import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import TacticalTooltip from './TacticalTooltip';
import { Navigation, ShieldCheck, Radio, AlertTriangle } from 'lucide-react';

export default function ArabianLandbridgeMap({ selectedRoute, setSelectedRoute }) {
  const { endDate, computedMetrics } = useData();
  const { isCrisis } = computedMetrics || {};
  const isCrisisEra = isCrisis || endDate >= '2023-11-20';
  const [hoveredNode, setHoveredNode] = useState(null);

  return (
    <div className="glass-panel rounded-2xl p-3 sm:p-4 border border-cyber-border/80 relative overflow-visible flex flex-col h-full bg-[#020713] shadow-2xl select-none">
      
      {/* 1. الشريط العلوي التكتيكي مع التولتيب */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 z-20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
          <h3 className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-white uppercase flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-cyber-emerald" />
            GEOSPATIAL MULTIMODAL BYPASS ARCHITECTURE // KSA HUB
          </h3>
          <TacticalTooltip
            title="الهندسة الجيومكانية لممر الجسر البري السعودي"
            explanation="خريطة بالأقمار الصناعية تبرز الشريان اللوجستي البري والسككي الرابط بين ميناء الدمام وميناء جدة الإسلامي عبر الرياض[cite: 7, 8]."
            takeaway="الالتفاف التام شمال منطقة الصراع في مضيق باب المندب وتوفير 19 يوماً مقارنة بمسار إفريقيا تحت أمان سيادي كامل[cite: 7, 8]."
            position="bottom"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] sm:text-[10px] font-mono text-cyber-cyan bg-slate-900/90 px-2 py-0.5 rounded-lg border border-slate-800">
            TIMELINE: {endDate}
          </span>
          <span className={`text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-lg flex items-center gap-1 border ${
            isCrisisEra 
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400' 
              : 'bg-cyber-emerald/10 border-cyber-emerald/30 text-cyber-emerald'
          }`}>
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            {isCrisisEra ? 'BAB EL-MANDEB CONFLICT' : 'LIVE RADAR NOMINAL'}
          </span>
        </div>
      </div>

      {/* 2. الحاوية المركزية للخريطة */}
      <div className="relative w-full flex-1 min-h-[420px] flex items-center justify-center overflow-hidden rounded-xl border border-slate-800/80 bg-black">
        
        <svg
          viewBox="0 0 1000 747"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="laserGlowEmerald" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur1" />
              <feGaussianBlur stdDeviation="2.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="laserGlowCyan" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="laserGlowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <linearGradient id="landbridgeNeonGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#00FF9D" />
              <stop offset="100%" stopColor="#00F0FF" />
            </linearGradient>

            <linearGradient id="capeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#D97706" />
            </linearGradient>
          </defs>

          {/* الطبقة 1: صورة القمر الصناعي */}
          <image
            href="/ksa-map.jpg"
            x="0"
            y="0"
            width="1000"
            height="747"
            preserveAspectRatio="none"
            className="brightness-95 contrast-110"
          />

          {/* الطبقة 2: دوائر الرادار فوق الرياض */}
          <g opacity="0.38">
            <circle cx="566.5" cy="376.5" r="85" fill="none" stroke="#00F0FF" strokeWidth="0.8" strokeDasharray="5 7" />
            <circle cx="566.5" cy="376.5" r="165" fill="none" stroke="#00FF9D" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.6" />
            <circle cx="566.5" cy="376.5" r="255" fill="none" stroke="#38BDF8" strokeWidth="0.7" opacity="0.3" />
            <ellipse cx="566.5" cy="376.5" rx="340" ry="185" fill="none" stroke="#00FF9D" strokeWidth="0.6" strokeDasharray="6 8" />
          </g>

          {/* الطبقة 3: مسار الجسر البري الحركي (جدة ➔ الدمام) */}
          <path
            d="M 360.7,465.7 L 566.5,376.5 L 662.5,329.3"
            fill="none"
            stroke="#00FF9D"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={selectedRoute === 'LANDBRIDGE' ? 0.42 : 0.25}
            filter="url(#laserGlowEmerald)"
          />

          <path
            d="M 360.7,465.7 L 566.5,376.5 L 662.5,329.3"
            fill="none"
            stroke="url(#landbridgeNeonGrad)"
            strokeWidth={selectedRoute === 'LANDBRIDGE' ? '5.5' : '4'}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#laserGlowEmerald)"
          />

          <path
            d="M 360.7,465.7 L 566.5,376.5 L 662.5,329.3"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeDasharray="12 24"
            strokeLinecap="round"
            opacity="0.9"
            filter="url(#laserGlowCyan)"
          >
            <animate attributeName="stroke-dashoffset" values="0;-144" dur="2s" repeatCount="indefinite" />
          </path>

          <circle r="4.5" fill="#FFFFFF" filter="url(#laserGlowCyan)">
            <animateMotion
              path="M 360.7,465.7 L 566.5,376.5 L 662.5,329.3"
              dur="2.4s"
              repeatCount="indefinite"
            />
          </circle>

          <circle r="3.5" fill="#00FF9D" filter="url(#laserGlowEmerald)">
            <animateMotion
              path="M 360.7,465.7 L 566.5,376.5 L 662.5,329.3"
              dur="2.4s"
              begin="0.8s"
              repeatCount="indefinite"
            />
          </circle>

          <circle r="3.5" fill="#00F0FF" filter="url(#laserGlowCyan)">
            <animateMotion
              path="M 360.7,465.7 L 566.5,376.5 L 662.5,329.3"
              dur="2.4s"
              begin="1.6s"
              repeatCount="indefinite"
            />
          </circle>

          <circle cx="566.5" cy="376.5" r="5" fill="#FFFFFF" filter="url(#laserGlowCyan)">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
            <animate attributeName="r" values="3.5;6.5;3.5" dur="1.8s" repeatCount="indefinite" />
          </circle>

          {/* الطبقة 4: مسار قناة السويس وباب المندب */}
          <path
            d="M 170.8,158.4 L 172.9,179.2 L 177.1,204.3 L 183.3,231.4 L 189.6,250.1 L 197.9,271.0 L 210.4,291.8 L 231.2,316.8 Q 290,385 360.7,465.7"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="2.5"
            strokeDasharray="6 6"
            opacity="0.9"
            filter="url(#laserGlowCyan)"
          />

          <path
            d="M 360.7,465.7 Q 405,575 438,688"
            fill="none"
            stroke={isCrisisEra ? "#FF0055" : "#38BDF8"}
            strokeWidth={isCrisisEra ? "2.6" : "1.8"}
            strokeDasharray={isCrisisEra ? "6 5" : "4 4"}
            opacity={isCrisisEra ? 0.95 : 0.45}
            filter={isCrisisEra ? "url(#laserGlowRed)" : undefined}
          />

          {isCrisisEra && (
            <g>
              <circle cx="438" cy="688" r="8" fill="none" stroke="#FF0055" strokeWidth="1.5">
                <animate attributeName="r" values="5;14;5" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="438" cy="688" r="4.5" fill="#FF0055" />
              <circle cx="438" cy="688" r="2" fill="#FFFFFF" />
              <rect x="450" y="676" width="165" height="24" rx="4" fill="#18040a" fillOpacity="0.9" stroke="#FF0055" strokeWidth="1" />
              <text x="458" y="692" fill="#FF4D79" fontSize="9" fontWeight="900" fontFamily="monospace">
                ⚡ Bab el-Mandeb (Conflict)
              </text>
            </g>
          )}

          {/* الطبقة 5: مسار رأس الرجاء الصالح ومضيق هرمز */}
          <path
            d="M 662.5,329.3 C 671.2,327.4 697.9,320.9 715.0,318.0 C 732.1,315.1 748.0,313.9 765.0,312.0 C 782.0,310.1 800.0,303.7 816.7,306.4 C 833.4,309.1 848.6,316.6 865.0,328.0 C 881.4,339.4 902.8,357.2 915.0,375.0 C 927.2,392.8 941.3,408.3 938.0,435.0 C 934.7,461.7 915.9,499.8 895.0,535.0 C 874.1,570.2 840.1,610.8 812.5,646.1 C 784.9,681.4 743.1,730.2 729.2,747.0"
            fill="none"
            stroke="url(#capeGrad)"
            strokeWidth="3.2"
            strokeDasharray="7 6"
            opacity="0.85"
          />

          <circle cx="816.7" cy="306.4" r="4.5" fill="#F59E0B" />
          <circle cx="816.7" cy="306.4" r="1.8" fill="#FFFFFF" />

          <circle cx="210" cy="291" r="3.5" fill="#00F0FF" />
          <circle cx="210" cy="291" r="1.5" fill="#FFFFFF" />

          {/* الطبقة 6: العقد التفاعلية والنصوص */}
          <g
            className="cursor-pointer"
            onClick={() => setSelectedRoute && setSelectedRoute('LANDBRIDGE')}
            onMouseEnter={() => setHoveredNode('RIYADH')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle cx="566.5" cy="376.5" r="10" fill="none" stroke="#00FF9D" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="8;16;8" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="566.5" cy="376.5" r="7" fill="#00FF9D" filter="url(#laserGlowEmerald)" />
            <circle cx="566.5" cy="376.5" r="3" fill="#FFFFFF" />
            <text
              x="584"
              y="381"
              fill="#FFFFFF"
              fontSize="14"
              fontWeight="900"
              fontFamily="monospace"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
            >
              Riyadh
            </text>
          </g>

          <g
            className="cursor-pointer"
            onClick={() => setSelectedRoute && setSelectedRoute('LANDBRIDGE')}
            onMouseEnter={() => setHoveredNode('DAMMAM')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle cx="662.5" cy="329.3" r="9" fill="none" stroke="#00F0FF" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="7;14;7" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="662.5" cy="329.3" r="6" fill="#00F0FF" filter="url(#laserGlowCyan)" />
            <circle cx="662.5" cy="329.3" r="2.5" fill="#FFFFFF" />
            <text
              x="678"
              y="333"
              fill="#E2E8F0"
              fontSize="13"
              fontWeight="bold"
              fontFamily="monospace"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
            >
              Dammam Hub
            </text>
          </g>

          <g
            className="cursor-pointer"
            onClick={() => setSelectedRoute && setSelectedRoute('LANDBRIDGE')}
            onMouseEnter={() => setHoveredNode('RED_SEA')}
            onMouseLeave={() => setHoveredNode(null)}
          >
            <circle cx="360.7" cy="465.7" r="10" fill="none" stroke="#00FF9D" strokeWidth="1.5" opacity="0.6">
              <animate attributeName="r" values="8;16;8" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="360.7" cy="465.7" r="7" fill="#00FF9D" filter="url(#laserGlowEmerald)" />
            <circle cx="360.7" cy="465.7" r="3" fill="#FFFFFF" />
            <text
              x="345"
              y="470"
              textAnchor="end"
              fill="#38BDF8"
              fontSize="14"
              fontWeight="900"
              fontFamily="monospace"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
            >
              Jeddah Port
            </text>
          </g>

          <g
            className="cursor-pointer transition-transform hover:opacity-90"
            onClick={() => setSelectedRoute && setSelectedRoute('LANDBRIDGE')}
          >
            <rect
              x="350"
              y="280"
              width="230"
              height="44"
              rx="8"
              fill="#020d18"
              fillOpacity="0.92"
              stroke="#00FF9D"
              strokeWidth="1.4"
              filter="url(#laserGlowEmerald)"
            />
            <text
              x="465"
              y="299"
              textAnchor="middle"
              fill="#00FF9D"
              fontSize="11.5"
              fontWeight="900"
              fontFamily="monospace"
              letterSpacing="1"
            >
              ARABIAN LAND BRIDGE
            </text>
            <text
              x="465"
              y="314"
              textAnchor="middle"
              fill="#38BDF8"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing="0.5"
            >
              (ROAD & RAIL) ROUTE
            </text>
          </g>

          <text
            x="145"
            y="145"
            fill="#CBD5E1"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.95))' }}
          >
            Suez Traditional Maritime
          </text>

          <g>
            <rect
              x="680"
              y="590"
              width="230"
              height="34"
              rx="6"
              fill="#0b132b"
              fillOpacity="0.88"
              stroke="#475569"
              strokeWidth="1.2"
            />
            <text
              x="795"
              y="612"
              textAnchor="middle"
              fill="#FDE68A"
              fontSize="11"
              fontWeight="bold"
              fontFamily="monospace"
            >
              Cape of Good Hope Diversion
            </text>
          </g>
        </svg>

        {/* 3. كارت الوفورات التكتيكي العائم مع التولتيب */}
        <div className="absolute bottom-5 left-5 sm:bottom-6 sm:left-6 bg-slate-950/90 backdrop-blur-md px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-cyber-emerald/40 text-[10px] sm:text-[11.5px] font-mono text-slate-200 flex items-center gap-2 sm:gap-3 shadow-[0_0_20px_rgba(0,0,0,0.85)] z-20 pointer-events-auto">
          {isCrisisEra ? (
            <ShieldCheck className="w-4 h-4 text-cyber-emerald animate-pulse flex-shrink-0" />
          ) : (
            <Radio className="w-4 h-4 text-cyber-cyan animate-pulse flex-shrink-0" />
          )}
          <span className="hidden xs:inline text-slate-400">
            {isCrisisEra ? 'STRATEGIC ADVANTAGE:' : 'CORRIDOR STATUS:'}
          </span>
          <span className="text-cyber-emerald font-black tracking-wide">
            {isCrisisEra ? '-19 DAYS VS CAPE' : 'SOVEREIGN RESERVE READY'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyber-cyan font-bold tracking-wide">
            100% SOVEREIGN SECURITY
          </span>
          <TacticalTooltip
            title="الميزة الاستراتيجية والأمان السيادي"
            explanation="توثيق عملي لتفوق الممر: اختصار 19 يوماً من زمن الإبحار حول إفريقيا مع انعدام المخاطر العسكرية[cite: 7, 8]."
            takeaway="تأمين سلاسل التوريد الاستراتيجية والمصانع ضد الصدمات البحرية الإقليمية[cite: 7, 8]."
            position="top"
          />
        </div>

      </div>
    </div>
  );
}