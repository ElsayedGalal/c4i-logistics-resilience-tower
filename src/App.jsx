import React, { useState, useEffect, useMemo } from 'react';
import { DataProvider, useData } from './context/DataContext';

// استيراد المكونات والخلفية المتحركة ونظام الصوت
import CyberBackground from './components/CyberBackground';
import { sound } from './utils/audioSystem';

// استيراد الصفحات الثلاث الرئيسية
import ChokepointsWarRoom from './views/ChokepointsWarRoom';
import MultimodalLandbridge from './views/MultimodalLandbridge';
import PredictiveForecasting from './views/PredictiveForecasting';

// أيقونات تكتيكية
import { 
  Compass, 
  GitFork, 
  Cpu, 
  Play, 
  Pause,
  RotateCcw, 
  Radio, 
  Calendar, 
  Clock,
  Volume2,
  VolumeX
} from 'lucide-react';

const TOTAL_MONTHS = 93;

function indexToDate(idx) {
  const totalMonths = Math.max(0, Math.min(TOTAL_MONTHS, Math.round(idx)));
  const year = 2019 + Math.floor(totalMonths / 12);
  const month = (totalMonths % 12) + 1;
  const day = (year === 2026 && month === 10) ? '04' : (year === 2023 && month === 11) ? '20' : '01';
  return `${year}-${String(month).padStart(2, '0')}-${day}`;
}

function dateToIndex(dateStr) {
  if (!dateStr) return TOTAL_MONTHS;
  const y = parseInt(dateStr.slice(0, 4), 10) || 2026;
  const m = parseInt(dateStr.slice(5, 7), 10) || 10;
  const idx = (y - 2019) * 12 + (m - 1);
  return Math.max(0, Math.min(TOTAL_MONTHS, idx));
}

function MainDashboard() {
  const context = useData() || {};
  const currentEndDate = context.endDate || '2026-10-04';
  const setDateFn = context.setEndDate || context.setDate || context.setCurrentDate || context.setSelectedDate;

  const [sliderIndex, setSliderIndex] = useState(() => dateToIndex(currentEndDate));
  const [isPlaying, setIsPlaying] = useState(false);
  
  // ✅ التعديل هنا: تم الضبط على 'chokepoints' لفتح الصفحة الأولى افتراضياً
  const [activeTab, setActiveTab] = useState('chokepoints');
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (currentEndDate) {
      setSliderIndex(dateToIndex(currentEndDate));
    }
  }, [currentEndDate]);

  const handleDateChange = (newIdx) => {
    const clamped = Math.max(0, Math.min(TOTAL_MONTHS, newIdx));
    if (clamped !== sliderIndex) {
      sound.playSliderTick();
    }
    setSliderIndex(clamped);
    const newDateStr = indexToDate(clamped);
    if (setDateFn) setDateFn(newDateStr);
  };

  // مشغل المحاكاة التلقائية مع صوت نبض تكتيكي خفيف عند كل شهر
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSliderIndex((prev) => {
          if (prev >= TOTAL_MONTHS) {
            setIsPlaying(false);
            return TOTAL_MONTHS;
          }
          const next = prev + 1;
          sound.playSliderTick();
          const newDateStr = indexToDate(next);
          if (setDateFn) setDateFn(newDateStr);
          return next;
        });
      }, 250);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, setDateFn]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) sound.playClick();
  };

  const PRESETS = [
    { label: 'All-Time (2019-2026)', date: '2026-10-04' },
    { label: 'Pre-Crisis Baseline (2023)', date: '2023-10-01' },
    { label: 'Ever Given Block (2021)', date: '2021-03-29' },
    { label: 'Red Sea Shock (Nov 23 - Jun 24)', date: '2023-11-20' },
    { label: 'Cape New Normal (2025-2026)', date: '2025-06-01' },
  ];

  const currentDateDisplay = useMemo(() => indexToDate(sliderIndex), [sliderIndex]);
  const progressPercent = (sliderIndex / TOTAL_MONTHS) * 100;

  return (
    <div className="min-h-screen text-slate-100 font-mono p-3 sm:p-5 flex flex-col space-y-4 select-none relative">
      
      {/* خلفية الرادار والشبكة السيبرانية المتحركة */}
      <CyberBackground/>

      {/* محتوى لوحة التحكم يطفو فوق الخلفية */}
      <div className="relative z-10 flex flex-col space-y-4 flex-1">
        
        {/* 1. الشريط العلوي التكتيكي (C4I Executive Header) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 backdrop-blur-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                LIVE TELEMETRY
              </span>
              <span className="text-[10px] text-slate-400">OCTOBER 2026 HORIZON</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-wider text-white uppercase">
              GLOBAL SUPPLY CHAIN RESILIENCE CONTROL TOWER
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-Time AIS Satellite Tracking, Chokepoint Triangle Analysis & Multimodal Shift (2019-2026)
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* زر كتم/تشغيل المؤثرات الصوتية */}
            <button
              onClick={toggleSound}
              title={isMuted ? 'Unmute Tactical Audio' : 'Mute Tactical Audio'}
              className="p-2.5 rounded-xl border border-slate-800 bg-[#030914]/90 text-slate-300 hover:text-white hover:border-slate-700 transition-all shadow-lg"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400"/>
              ) : (
                <Volume2 className="w-4 h-4 text-cyber-cyan animate-pulse"/>
              )}
            </button>

            {/* بروفايل القيادة */}
            <div className="flex items-center gap-3 bg-[#030914]/90 border border-slate-800 px-3.5 py-2 rounded-2xl shadow-xl backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl border border-cyber-cyan/50 overflow-hidden bg-slate-900 flex-shrink-0 flex items-center justify-center">
                <img 
                  src="/avatar.png" 
                  alt="Lead Architect" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.style.display = 'none'; }} 
                />
              </div>
              <div className="text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">Eng. Elsayed Galal</span>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/30">
                    LEAD ARCHITECT
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-0.5">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-500"/> Fri, Oct 16, 2026</span>
                  <span className="text-slate-600">|</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-cyber-cyan"/> 06:57:29</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. شريط السلايدر الزمني مع الأصوات التفاعلية */}
        <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 bg-[#020713]/85 shadow-2xl space-y-3 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-2">
            
            {/* الفترات الجاهزة */}
            <div className="flex flex-wrap items-center gap-1.5">
              {PRESETS.map((p) => {
                const isMatch = Math.abs(sliderIndex - dateToIndex(p.date)) <= 1;
                return (
                  <button
                    key={p.label}
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => {
                      sound.playClick();
                      setIsPlaying(false);
                      handleDateChange(dateToIndex(p.date));
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                      isMatch
                        ? 'border-cyber-cyan bg-cyan-950/40 text-cyber-cyan shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* محدد التاريخ وأزرار التحكم */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-xl text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-cyber-cyan"/>
                <span className="text-slate-400">2023-01-01</span>
                <span className="text-slate-600">➔</span>
                <span className="text-white font-bold">{currentDateDisplay}</span>
              </div>

              <button
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick();
                  setIsPlaying(!isPlaying);
                }}
                className={`px-3.5 py-1.5 rounded-xl border text-[11px] font-black flex items-center gap-1.5 transition-all ${
                  isPlaying
                    ? 'border-rose-500/60 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : 'border-cyber-emerald/50 bg-cyber-emerald/15 text-cyber-emerald shadow-neon-emerald hover:bg-cyber-emerald/25'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current"/>
                    <span>PAUSE</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current"/>
                    <span>PLAY</span>
                  </>
                )}
              </button>

              <button
                onMouseEnter={() => sound.playHover()}
                onClick={() => {
                  sound.playClick();
                  setIsPlaying(false);
                  handleDateChange(TOTAL_MONTHS);
                }}
                title="Reset to 2026 Horizon"
                className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5"/>
              </button>
            </div>

          </div>

          {/* مسار السلايدر المتدفق والمقبض النيوني */}
          <div className="relative pt-2 pb-1">
            <div className="relative h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyber-cyan via-blue-500 to-purple-600"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-10"
              style={{ left: `${progressPercent}%` }}
            >
              <div className="w-5 h-5 rounded-full bg-white border-2 border-cyber-cyan shadow-[0_0_18px_#00F0FF] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
              </div>
            </div>

            <input
              type="range"
              min="0"
              max={TOTAL_MONTHS}
              step="1"
              value={sliderIndex}
              onChange={(e) => {
                setIsPlaying(false);
                handleDateChange(Number(e.target.value));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
            />

            <div className="flex justify-between text-[9px] text-slate-500 font-bold mt-2 px-1">
              <span>2019</span>
              <span>2020</span>
              <span>2021 (Ever Given)</span>
              <span>2022</span>
              <span>2023 (Baseline)</span>
              <span className="text-rose-400">2024 (Crisis)</span>
              <span>2025</span>
              <span className="text-cyber-cyan font-bold">2026 (Live)</span>
            </div>
          </div>
        </div>

        {/* 3. شريط التنقل بين التبويبات الثلاثة */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-400">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse"/>
            <span>COMMAND MODULES //</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* تبويب 1 */}
            <button
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playTabSwitch();
                setActiveTab('chokepoints');
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'chokepoints'
                  ? 'border-cyber-cyan bg-cyan-950/40 text-white shadow-[0_0_18px_rgba(0,240,255,0.3)] ring-1 ring-cyber-cyan'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-cyber-cyan"/>
              <span>1. Chokepoints War Room</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 border border-slate-700 text-slate-400">
                Digital Twin
              </span>
            </button>

            {/* تبويب 2 */}
            <button
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playTabSwitch();
                setActiveTab('landbridge');
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'landbridge'
                  ? 'border-cyber-emerald bg-emerald-950/40 text-white shadow-[0_0_18px_rgba(0,255,157,0.3)] ring-1 ring-cyber-emerald'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <GitFork className="w-3.5 h-3.5 text-cyber-emerald"/>
              <span>2. Multimodal & Landbridge</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 border border-slate-700 text-slate-400">
                Saudi Bypass
              </span>
            </button>

            {/* تبويب 3 */}
            <button
              onMouseEnter={() => sound.playHover()}
              onClick={() => {
                sound.playTabSwitch();
                setActiveTab('predictive');
              }}
              className={`px-3.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'predictive'
                  ? 'border-fuchsia-500 bg-fuchsia-950/40 text-white shadow-[0_0_20px_rgba(217,70,239,0.35)] ring-1 ring-fuchsia-500'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-fuchsia-400"/>
              <span>3. Predictive AI & Simulator</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 border border-slate-700 text-fuchsia-300">
                What-If Engine
              </span>
            </button>
          </div>
        </div>

        {/* 4. عرض محتوى الصفحة المحددة */}
        <div className="flex-1 pt-1">
          {activeTab === 'chokepoints' && <ChokepointsWarRoom/>}
          {activeTab === 'landbridge' && <MultimodalLandbridge/>}
          {activeTab === 'predictive' && <PredictiveForecasting/>}
        </div>

      </div>

    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <MainDashboard/>
    </DataProvider>
  );
}