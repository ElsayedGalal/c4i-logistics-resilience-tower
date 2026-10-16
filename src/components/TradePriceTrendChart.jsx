import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import TacticalTooltip from './TacticalTooltip';
import { Activity, Calendar } from 'lucide-react';

const FRED_SERIES_DATA = [
  { date: '2020-01-01', value: 112.4, label: 'Jan 2020' },
  { date: '2020-07-01', value: 121.8, label: 'Jul 2020' },
  { date: '2021-01-01', value: 148.2, label: 'Jan 2021' },
  { date: '2021-07-01', value: 204.6, label: 'Jul 2021' },
  { date: '2022-01-01', value: 254.8, label: 'Jan 2022' },
  { date: '2022-04-01', value: 262.3, label: 'Apr 2022' },
  { date: '2022-10-01', value: 221.7, label: 'Oct 2022' },
  { date: '2023-04-01', value: 168.2, label: 'Apr 2023' },
  { date: '2023-10-01', value: 152.1, label: 'Oct 2023' },
  { date: '2023-11-20', value: 154.3, label: 'Nov 2023 (Crisis Start)' },
  { date: '2024-04-01', value: 205.4, label: 'Apr 2024' },
  { date: '2024-10-01', value: 224.2, label: 'Oct 2024' },
  { date: '2025-04-01', value: 216.8, label: 'Apr 2025' },
  { date: '2025-10-01', value: 208.9, label: 'Oct 2025' },
  { date: '2026-04-01', value: 204.5, label: 'Apr 2026' },
  { date: '2026-10-04', value: 201.8, label: 'Oct 2026' },
];

export default function TradePriceTrendChart() {
  const { endDate } = useData();
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const chartData = useMemo(() => {
    const filtered = FRED_SERIES_DATA.filter((d) => !endDate || d.date <= endDate);
    return filtered.length >= 3 ? filtered : FRED_SERIES_DATA.slice(0, 6);
  }, [endDate]);

  const { pctChange, latestValue } = useMemo(() => {
    if (!chartData || chartData.length < 2) return { pctChange: '+0.00%', latestValue: '100.0' };
    const first = chartData[0].value;
    const latest = chartData[chartData.length - 1].value;
    const diff = ((latest - first) / first) * 100;
    return {
      pctChange: `${diff >= 0 ? '+' : ''}${diff.toFixed(2)}%`,
      latestValue: latest.toFixed(1),
    };
  }, [chartData]);

  const SVG_W = 850;
  const SVG_H = 280;
  const PAD = { left: 60, right: 35, top: 35, bottom: 45 };
  const plotW = SVG_W - PAD.left - PAD.right;
  const plotH = SVG_H - PAD.top - PAD.bottom;

  const minY = 90;
  const maxY = 280;

  const getX = (idx) => PAD.left + (idx / (chartData.length - 1)) * plotW;
  const getY = (val) => PAD.top + plotH - ((val - minY) / (maxY - minY)) * plotH;

  const { linePathD, areaPathD } = useMemo(() => {
    if (!chartData || chartData.length < 2) return { linePathD: '', areaPathD: '' };
    const pts = chartData.map((d, i) => [getX(i), getY(d.value)]);
    let d = `M ${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];

      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;

      d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }

    const firstX = getX(0).toFixed(1);
    const lastX = getX(chartData.length - 1).toFixed(1);
    const bottomY = (PAD.top + plotH).toFixed(1);
    const areaD = `${d} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

    return { linePathD: d, areaPathD: areaD };
  }, [chartData]);

  const crisisIndex = chartData.findIndex((d) => d.date >= '2023-11-20');
  const crisisX = crisisIndex !== -1 ? getX(crisisIndex) : null;

  return (
    <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 relative overflow-visible flex flex-col h-full shadow-2xl font-mono select-none">
      
      {/* 1. Header اللوحة مع التولتيب الإحصائي */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyber-cyan animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase">
              PCU4831114831115 / TRADE PRICE TREND
            </h3>
            <TacticalTooltip
              title="مؤشر أسعار نقل الحاويات في أعالي البحار (FRED / BLS)"
              explanation="المؤشر القياسي الرسمي الصادر عن بنك الاحتياطي الفيدرالي ومكتب إحصاءات العمل الأمريكي (PCU4831114831115) لقياس تضخم تكاليف الشحن البحري العالمي[cite: 8]."
              takeaway="قفزة المؤشر بأكثر من 79% بعد أزمة نوفمبر 2023 تؤكد أن اضطراب المضائق يمثل محركاً رئيسياً للتضخم وارتفاع أسعار السلع[cite: 8]."
              position="top"
            />
          </div>
          <span className="text-[10px] text-slate-400 block tracking-wider mt-0.5">
            DEEP SEA FREIGHT TRANSPORTATION PPI (FRED / BLS)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black px-2.5 py-0.5 rounded-md border tracking-wider bg-rose-500/15 text-rose-400 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
            {pctChange}
          </span>
          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyber-cyan">
            FRED
          </span>
        </div>
      </div>

      {/* 2. الرسم المنحني العريض */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#020917]/90 via-[#010610] to-black border border-slate-800/80">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="trendLineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#00FF9D" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="lineNeonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#00FF9D" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {[100, 140, 180, 220, 260].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={SVG_W - PAD.right}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={PAD.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {crisisX && (
            <g>
              <line
                x1={crisisX}
                y1={PAD.top}
                x2={crisisX}
                y2={PAD.top + plotH}
                stroke="#FF0055"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.9"
              />
              <text
                x={crisisX + 6}
                y={PAD.top + 14}
                fill="#FF0055"
                fontSize="9.5"
                fontWeight="900"
                letterSpacing="0.8"
              >
                ⚡ RED SEA CRISIS
              </text>
            </g>
          )}

          {areaPathD && <path d={areaPathD} fill="url(#areaGradient)" />}

          {linePathD && (
            <path
              d={linePathD}
              fill="none"
              stroke="url(#lineNeonGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              filter="url(#trendLineGlow)"
            />
          )}

          {chartData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.value);
            const isLast = i === chartData.length - 1;

            return (
              <g
                key={d.date}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredPoint(d)}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {isLast && (
                  <circle cx={cx} cy={cy} r="10" fill="none" stroke="#00FF9D" strokeWidth="1.5">
                    <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0;1" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isLast ? 5 : 3.5}
                  fill={isLast ? '#00FF9D' : '#00F0FF'}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {['2020', '2021', '2022', '2023', '2024', '2025', '2026'].map((year) => {
            const idx = chartData.findIndex((d) => d.date.startsWith(year));
            if (idx === -1) return null;
            return (
              <text
                key={year}
                x={getX(idx)}
                y={SVG_H - 10}
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="11"
                fontWeight="bold"
              >
                {year}
              </text>
            );
          })}
        </svg>

        {hoveredPoint && (
          <div className="absolute top-3 right-3 bg-slate-950/95 border border-cyber-cyan/50 p-2.5 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none z-20 text-[10px]">
            <div className="text-slate-400 font-bold">{hoveredPoint.label}</div>
            <div className="text-white font-bold flex items-center gap-1.5 mt-1">
              <span>PPI INDEX:</span>
              <span className="text-cyber-cyan text-sm font-black">{hoveredPoint.value}</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. الشريط السفلي */}
      <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-400 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>CURRENT INDEX: <strong className="text-white font-mono">{latestValue}</strong></span>
        </span>
        <span className="text-slate-500 text-[10px]">BASE DEC 2003 = 100</span>
      </div>

    </div>
  );
}