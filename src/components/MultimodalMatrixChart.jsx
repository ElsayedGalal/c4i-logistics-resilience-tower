import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import TacticalTooltip from './TacticalTooltip';
import { ScatterChart, Crosshair, Zap } from 'lucide-react';

export default function MultimodalMatrixChart({ selectedRoute, setSelectedRoute }) {
  const { endDate, computedMetrics } = useData();
  const { latestRotterdamRate } = computedMetrics || {};
  const isCrisisEra = endDate >= '2023-11-20';
  const [hoveredRoute, setHoveredRoute] = useState(null);

  const suezCost = isCrisisEra 
    ? Math.min(7200, Math.round((latestRotterdamRate || 5000) + 2200)) 
    : 3100;
  const suezDays = isCrisisEra ? 28 : 24;

  const landbridgeCost = isCrisisEra ? 3100 : 2850;
  const landbridgeDays = 17;

  const capeCost = isCrisisEra ? Math.round((latestRotterdamRate || 5000) * 1.05) : 3750;
  const capeDays = 36;

  const seaAirCost = isCrisisEra ? 6500 : 5800;
  const seaAirDays = 9;

  const BUBBLES = [
    {
      id: 'SEA_AIR',
      name: 'SEA-AIR GULF EXPRESS',
      shortName: 'SEA-AIR',
      cost: seaAirCost,
      costLabel: `$${seaAirCost.toLocaleString()}`,
      days: seaAirDays,
      daysLabel: `${seaAirDays} Days`,
      radius: 32,
      color: '#38BDF8',
      glowFilter: 'url(#bubbleGlowBlue)',
      fillGrad: 'url(#gradBlue)',
      badge: 'URGENT AIR',
      desc: 'High-speed air freight evacuating conflict corridors.',
    },
    {
      id: 'LANDBRIDGE',
      name: 'ARABIAN LAND BRIDGE',
      shortName: 'LAND BRIDGE',
      cost: landbridgeCost,
      costLabel: `$${landbridgeCost.toLocaleString()}`,
      days: landbridgeDays,
      daysLabel: `${landbridgeDays} Days`,
      radius: 38,
      color: '#00FF9D',
      glowFilter: 'url(#bubbleGlowGreen)',
      fillGrad: 'url(#gradGreen)',
      badge: 'OPTIMAL BYPASS',
      desc: 'Sovereign overland KSA pipeline avoiding Red Sea chokepoints.',
    },
    {
      id: 'SUEZ',
      name: 'SUEZ CANAL MARITIME',
      shortName: 'SUEZ CANAL',
      cost: suezCost,
      costLabel: `$${suezCost.toLocaleString()}`,
      days: suezDays,
      daysLabel: `${suezDays} Days`,
      radius: isCrisisEra ? 36 : 32,
      color: '#00F0FF',
      glowFilter: 'url(#bubbleGlowCyan)',
      fillGrad: 'url(#gradCyan)',
      badge: isCrisisEra ? 'HIGH THREAT' : 'STANDARD',
      desc: isCrisisEra ? 'War-risk surcharges and Bab el-Mandeb exposure.' : 'Conventional canal passage.',
    },
    {
      id: 'CAPE',
      name: 'CAPE OF GOOD HOPE',
      shortName: 'CAPE DETOUR',
      cost: capeCost,
      costLabel: `$${capeCost.toLocaleString()}`,
      days: capeDays,
      daysLabel: `${capeDays} Days`,
      radius: 35,
      color: '#F59E0B',
      glowFilter: 'url(#bubbleGlowAmber)',
      fillGrad: 'url(#gradAmber)',
      badge: '+4,000 NM DETOUR',
      desc: 'Extended voyage around the African continent.',
    },
  ];

  const SVG_W = 850;
  const SVG_H = 280;
  const PAD = { left: 80, right: 60, top: 50, bottom: 42 };

  const plotW = SVG_W - PAD.left - PAD.right;
  const plotH = SVG_H - PAD.top - PAD.bottom;

  const getX = (days) => PAD.left + (days / 42) * plotW;
  const getY = (cost) => PAD.top + plotH - ((cost - 1000) / 7500) * plotH;

  return (
    <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 relative overflow-visible flex flex-col h-full shadow-2xl font-mono select-none">
      
      {/* رأس اللوحة مع التولتيب التحليلي */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
            <h3 className="text-xs sm:text-sm font-black tracking-wider uppercase text-white flex items-center gap-1.5">
              <ScatterChart className="w-4 h-4 text-cyber-cyan" />
              BUBBLE MATRIX: COST VS. TRANSIT TIME
            </h3>
            <TacticalTooltip
              title="مصفوفة المقايضة بين التكلفة والزمن (Trade-off Analysis)"
              explanation="مخطط بياني يرسم الكفاءة النسبية للمسارات؛ يمثل المحور الأفقي زمن العبور بالأيام، والمحور الرأسي تكلفة شحن الحاوية (FEU)[cite: 8]."
              takeaway="الزاوية السفلية اليسرى (Optimal Sweet Spot) تمثل الخيار الأمثل اقتصادياً وتشغيلياً؛ ويتربع فيها الجسر البري بجمعه بين السرعة والوفر المالي[cite: 8]."
              position="top"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 tracking-wider">
            TRADE-OFF ANALYSIS // RELATIVE ROUTE EFFICIENCY
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
          <Crosshair className="w-3.5 h-3.5 text-cyber-emerald" />
          <span className="text-[10.5px] text-cyber-emerald font-bold tracking-wider">2026 BENCHMARK</span>
        </div>
      </div>

      {/* الرسم البياني المتجاوب */}
      <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#020917]/90 via-[#010610] to-black border border-slate-800/80">
        
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="bubbleGlowGreen" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="bubbleGlowCyan" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="bubbleGlowAmber" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="bubbleGlowBlue" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="gradGreen" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#00FF9D" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#052E20" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#02140D" stopOpacity="0.25" />
            </radialGradient>

            <radialGradient id="gradCyan" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#073B4C" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#021720" stopOpacity="0.25" />
            </radialGradient>

            <radialGradient id="gradAmber" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#451A03" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1C0A00" stopOpacity="0.25" />
            </radialGradient>

            <radialGradient id="gradBlue" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <stop offset="55%" stopColor="#0C2A4D" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#040F1E" stopOpacity="0.25" />
            </radialGradient>
          </defs>

          {/* تظليل نطاق الجدوى الاقتصادية (Sweet Spot Quadrant) */}
          <rect
            x={PAD.left}
            y={getY(4000)}
            width={getX(20) - PAD.left}
            height={plotH - (getY(4000) - PAD.top)}
            fill="#00FF9D"
            fillOpacity="0.05"
            stroke="#00FF9D"
            strokeWidth="1"
            strokeDasharray="4 4"
            strokeOpacity="0.3"
          />
          <text
            x={PAD.left + 12}
            y={getY(1500)}
            fill="#00FF9D"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="0.8"
            opacity="0.8"
          >
            ★ OPTIMAL SWEET SPOT (LOW COST / FAST TRANSIT)
          </text>

          {[2000, 4000, 6000, 8000].map((costVal) => {
            const y = getY(costVal);
            return (
              <g key={costVal}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={SVG_W - PAD.right}
                  y2={y}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
                <text
                  x={PAD.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="bold"
                >
                  ${costVal / 1000}k
                </text>
              </g>
            );
          })}

          {[0, 10, 20, 30, 40].map((dayVal) => {
            const x = getX(dayVal);
            return (
              <g key={dayVal}>
                <line
                  x1={x}
                  y1={PAD.top}
                  x2={x}
                  y2={SVG_H - PAD.bottom}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
                <text
                  x={x}
                  y={SVG_H - PAD.bottom + 18}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="11"
                  fontWeight="bold"
                >
                  {dayVal}d
                </text>
              </g>
            );
          })}

          <text
            x={SVG_W / 2}
            y={SVG_H - 8}
            textAnchor="middle"
            fill="#CBD5E1"
            fontSize="11.5"
            fontWeight="900"
            letterSpacing="1.2"
          >
            TRANSIT TIME (DAYS) ➔
          </text>

          <text
            x={-SVG_H / 2}
            y={22}
            transform="rotate(-90)"
            textAnchor="middle"
            fill="#CBD5E1"
            fontSize="11.5"
            fontWeight="900"
            letterSpacing="1.2"
          >
            COST PER FEU ($) ➔
          </text>

          {BUBBLES.map((bubble) => {
            const cx = getX(bubble.days);
            const cy = getY(bubble.cost);
            const isSelected = selectedRoute === bubble.id;
            const isHovered = hoveredRoute === bubble.id;

            return (
              <g
                key={bubble.id}
                className="cursor-pointer"
                onClick={() => setSelectedRoute && setSelectedRoute(bubble.id)}
                onMouseEnter={() => setHoveredRoute(bubble.id)}
                onMouseLeave={() => setHoveredRoute(null)}
              >
                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={bubble.radius + 6}
                    fill="none"
                    stroke={bubble.color}
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    opacity="0.9"
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${cx} ${cy}`}
                      to={`360 ${cx} ${cy}`}
                      dur="10s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={bubble.radius + 2}
                  fill="none"
                  stroke={bubble.color}
                  strokeWidth={isSelected ? '3' : '1.8'}
                  filter={bubble.glowFilter}
                  opacity={isSelected || isHovered ? 1 : 0.8}
                />

                <circle
                  cx={cx}
                  cy={cy}
                  r={bubble.radius}
                  fill={bubble.fillGrad}
                  stroke={bubble.color}
                  strokeWidth={isSelected ? '2.2' : '1.4'}
                />

                <text
                  x={cx}
                  y={cy - 6}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10"
                  fontWeight="900"
                  letterSpacing="0.5"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
                >
                  {bubble.shortName}
                </text>

                <text
                  x={cx}
                  y={cy + 6}
                  textAnchor="middle"
                  fill={bubble.color}
                  fontSize="11"
                  fontWeight="900"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
                >
                  {bubble.costLabel}
                </text>

                <text
                  x={cx}
                  y={cy + 17}
                  textAnchor="middle"
                  fill="#CBD5E1"
                  fontSize="9"
                  fontWeight="bold"
                >
                  {bubble.daysLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredRoute && (
          <div className="absolute top-3 right-3 bg-slate-950/95 border border-slate-700 p-2.5 rounded-xl shadow-2xl backdrop-blur-xl pointer-events-none z-30 max-w-[230px]">
            {(() => {
              const b = BUBBLES.find((item) => item.id === hoveredRoute);
              if (!b) return null;
              return (
                <>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10.5px] font-black text-white">{b.name}</span>
                    <span
                      className="text-[8.5px] font-bold px-1.5 py-0.2 rounded border"
                      style={{ color: b.color, borderColor: b.color }}
                    >
                      {b.badge}
                    </span>
                  </div>
                  <p className="text-[9.5px] text-slate-400 mb-1.5 leading-relaxed">{b.desc}</p>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[9.5px]">
                    <div>
                      <span className="text-slate-500 block">COST:</span>
                      <span className="text-white font-bold">{b.costLabel}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">TRANSIT:</span>
                      <span className="text-white font-bold">{b.daysLabel}</span>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* الشريط السفلي */}
      <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-400 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-cyber-emerald" />
          <span>Lower Left = High Viability Corridor</span>
        </span>
        <span className="text-slate-500 text-[10px] font-bold">CLICK BUBBLE TO SELECT</span>
      </div>

    </div>
  );
}