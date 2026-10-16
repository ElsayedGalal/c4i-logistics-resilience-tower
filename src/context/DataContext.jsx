import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

import chokepointsDaily from '../data/chokepoints_daily.json';
import freightRates from '../data/freight_rates.json';
import fredIndices from '../data/fred_freight_indices.json';
import geopoliticalEvents from '../data/geopolitical_events.json';
import multimodalData from '../data/multimodal_benchmarks.json';

const DataContext = createContext();

export const TIME_PRESETS = [
  { id: 'ALL', label: 'All-Time (2019-2026)', start: '2019-01-01', end: '2026-10-04' },
  { id: 'PRE_CRISIS', label: 'Pre-Crisis Baseline (2023)', start: '2023-01-01', end: '2023-10-31' },
  { id: 'EVER_GIVEN', label: 'Ever Given Block (2021)', start: '2021-03-01', end: '2021-04-15' },
  { id: 'RED_SEA_SHOCK', label: 'Red Sea Shock (Nov 23 - Jun 24)', start: '2023-11-01', end: '2024-06-30' },
  { id: 'CAPE_NORMAL', label: 'Cape New Normal (2025-2026)', start: '2025-01-01', end: '2026-10-04' },
];

export function DataProvider({ children }) {
  const [startDate, setStartDate] = useState('2019-01-01');
  const [endDate, setEndDate] = useState('2026-10-04');
  const [activePreset, setActivePreset] = useState('ALL');
  const [isPlaying, setIsPlaying] = useState(false);

  // تشغيل المحاكاة الزمنية التلقائية شهراً بشهر
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setEndDate((prevEnd) => {
          const current = new Date(prevEnd);
          current.setMonth(current.getMonth() + 1);
          if (current > new Date('2026-10-04')) {
            setIsPlaying(false);
            return '2026-10-04';
          }
          return current.toISOString().split('T')[0];
        });
      }, 650);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const applyPreset = (preset) => {
    setStartDate(preset.start);
    setEndDate(preset.end);
    setActivePreset(preset.id);
    setIsPlaying(false);
  };

  const computedMetrics = useMemo(() => {
    // 1. تصفية حركة السفن ضمن النطاق
    const filteredTransits = chokepointsDaily.filter(
      (d) => d.date >= startDate && d.date <= endDate
    );

    // خط الأساس الثابت للمقارنة (2023 Baseline)
    const baseline = {
      'Bab el-Mandeb': { containers: 19.3, total: 74.6 },
      'Suez Canal': { containers: 19.6, total: 73.6 },
      'Cape of Good Hope': { containers: 5.9, total: 48.9 },
      'Strait of Hormuz': { containers: 16.5, total: 95.6 },
    };

    const ports = ['Bab el-Mandeb', 'Suez Canal', 'Cape of Good Hope', 'Strait of Hormuz'];

    // 2. نافذة الرصد اللحظية (آخر 30 يوماً قبل endDate) للتفاعل مع الـ Play
    const recentEndDate = new Date(endDate);
    const recentStartDate = new Date(recentEndDate);
    recentStartDate.setDate(recentStartDate.getDate() - 30);
    const recentStartStr = recentStartDate.toISOString().split('T')[0];

    const recentTransits = chokepointsDaily.filter(
      (d) => d.date >= recentStartStr && d.date <= endDate
    );

    const portStats = {};
    const liveWindowStats = {};

    ports.forEach((port) => {
      // أ) الحساب الإجمالي للنطاق
      const portRows = filteredTransits.filter((d) => d.port === port);
      const count = portRows.length || 1;
      const avgTotal = portRows.reduce((sum, r) => sum + r.total, 0) / count;
      const avgContainer = portRows.reduce((sum, r) => sum + r.container, 0) / count;
      const avgTanker = portRows.reduce((sum, r) => sum + r.tanker, 0) / count;
      const avgCapacity = portRows.reduce((sum, r) => sum + r.capacity, 0) / count;
      const baseCont = baseline[port].containers;
      const containerChangePct = ((avgContainer - baseCont) / baseCont) * 100;

      // ب) الحساب اللحظي الفعلي عند تاريخ endDate الحالي (يعكس الأزمة فوراً)
      const recentRows = recentTransits.filter((d) => d.port === port);
      const recentCount = recentRows.length || 1;
      const liveAvgContainer = recentRows.reduce((sum, r) => sum + r.container, 0) / recentCount;
      const liveAvgTotal = recentRows.reduce((sum, r) => sum + r.total, 0) / recentCount;
      const liveAvgCapacity = recentRows.reduce((sum, r) => sum + r.capacity, 0) / recentCount;
      const liveChangePct = ((liveAvgContainer - baseCont) / baseCont) * 100;

      // تحديد حالة الخطر اللحظية
      let status = 'NORMAL';
      if (port === 'Bab el-Mandeb' && (liveChangePct < -35 || endDate >= '2023-12-01')) {
        status = 'CRITICAL_HAZARD';
      } else if (port === 'Suez Canal' && (liveChangePct < -30 || endDate >= '2023-12-15')) {
        status = 'WARNING';
      } else if (port === 'Cape of Good Hope' && (liveChangePct > 45 || endDate >= '2023-12-15')) {
        status = 'SURGE';
      }

      portStats[port] = {
        avgTotal: avgTotal.toFixed(1),
        avgContainer: avgContainer.toFixed(1),
        avgTanker: avgTanker.toFixed(1),
        avgCapacity: Math.round(avgCapacity),
        containerChangePct: containerChangePct.toFixed(1),
        status,
        // أرقام الرصد الحي اللحظي عند تاريخ الـ Play
        liveAvgContainer: liveAvgContainer.toFixed(1),
        liveAvgTotal: liveAvgTotal.toFixed(1),
        liveAvgCapacity: Math.round(liveAvgCapacity),
        liveChangePct: liveChangePct.toFixed(1),
      };
    });

    // 3. أسعار الشحن اللحظية
    const filteredRates = freightRates.filter((d) => d.date >= startDate && d.date <= endDate);
    const globalRates = filteredRates.filter((d) => d.route === 'Global Composite');
    const rotterdamRates = filteredRates.filter((d) => d.route === 'Shanghai to Rotterdam');

    const avgSpotRate = globalRates.length
      ? Math.round(globalRates.reduce((sum, r) => sum + r.rate, 0) / globalRates.length)
      : 4450;

    const latestRotterdamRate = rotterdamRates.length
      ? rotterdamRates[rotterdamRates.length - 1].rate
      : 5400;

    // 4. الأحداث النشطة
    const activeEvents = geopoliticalEvents.filter(
      (ev) => ev.date >= startDate && ev.date <= endDate
    );

    return {
      portStats,
      avgSpotRate,
      latestRotterdamRate,
      activeEvents,
      daysInRange: Math.round(filteredTransits.length / 4),
      filteredTransits,
      filteredRates,
    };
  }, [startDate, endDate]);

  const value = {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activePreset,
    applyPreset,
    isPlaying,
    setIsPlaying,
    computedMetrics,
    geopoliticalEvents,
    multimodalData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within a DataProvider');
  return context;
}