import React from 'react';
import { useData } from '../context/DataContext';
import TacticalTooltip from './TacticalTooltip';
import { 
  Truck, 
  Train, 
  Ship, 
  Anchor, 
  PlaneTakeoff, 
  Clock, 
  DollarSign, 
  CheckCircle2
} from 'lucide-react';

export default function RouteComparisonCards({ selectedRoute, setSelectedRoute }) {
  const { endDate, computedMetrics } = useData();
  const { latestRotterdamRate } = computedMetrics || {};
  const isCrisisEra = endDate >= '2023-11-20';

  const ROUTES_DATA = [
    {
      id: 'LANDBRIDGE',
      title: 'ARABIAN LAND BRIDGE',
      subtitle: 'ROAD & RAIL INTERMODAL (KSA)',
      icons: [<Train key="train" className="w-4 h-4" />, <Truck key="truck" className="w-4 h-4" />],
      cost: isCrisisEra ? '$3,100' : '$2,850',
      costUnit: '/ FEU',
      transitDays: 4,
      transitLabel: '4 Days (Land Corridor)',
      fullTransit: '17 Days Port-to-Port',
      speedPct: 90,
      riskLevel: 'LOW RISK',
      riskText: '100% SECURE // ZERO BAB EL-MANDEB',
      tooltip: {
        title: 'الجسر البري العربي (المملكة العربية السعودية)',
        explanation: 'مسار متعدد الوسائط يدمج سفن التغذية في الخليج العربي مع شبكة قطارات SAR والشاحنات السريعة وصولاً لموانئ الغربية ثم أوروبا[cite: 7, 8].',
        takeaway: 'أعلى توازن لوجستي: 17 يوماً إجمالياً، تكلفة تنافسية (3,100$)، وحصانة سيادية كاملة ضد تهديدات باب المندب[cite: 7, 8].',
      },
      theme: {
        border: 'border-cyber-emerald/60 hover:border-cyber-emerald',
        activeBorder: 'border-cyber-emerald shadow-[0_0_25px_rgba(0,255,157,0.35)] ring-1 ring-cyber-emerald',
        text: 'text-cyber-emerald',
        badgeBg: 'bg-emerald-500/10 text-cyber-emerald border-emerald-500/30',
        bg: 'from-[#031c17]/60 to-[#020b14]/80',
        barColor: 'bg-cyber-emerald',
      },
    },
    {
      id: 'SUEZ',
      title: 'SUEZ CANAL MARITIME',
      subtitle: 'TRADITIONAL CHOKEPOINT CORRIDOR',
      icons: [<Ship key="ship" className="w-4 h-4" />],
      cost: isCrisisEra 
        ? `$${Math.min(7200, Math.round((latestRotterdamRate || 5000) + 2200)).toLocaleString()}` 
        : '$3,100',
      costUnit: '/ FEU',
      transitDays: isCrisisEra ? 28 : 24,
      transitLabel: isCrisisEra ? '24 - 28 Days' : '24 Days Total',
      fullTransit: isCrisisEra ? '+4d War Zone Delay' : 'Standard Speed',
      speedPct: 60,
      riskLevel: isCrisisEra ? 'HIGH THREAT' : 'MODERATE',
      riskText: isCrisisEra ? 'WAR-RISK SURCHARGE // MISSILE THREAT' : 'CONVENTIONAL TOLL',
      tooltip: {
        title: 'الممر الملاحي التقليدي عبر قناة السويس',
        explanation: 'المسار المائي التاريخي عبر مضيق باب المندب والبحر الأحمر[cite: 7]. يعاني حالياً من التهديدات العسكرية واحتجاز حركة السفن التجارية[cite: 7].',
        takeaway: 'ارتفاع حاد في التكلفة الإجمالية نتيجة إضافة أقساط التأمين ضد مخاطر الحرب (War-Risk Premium) وتراجع موثوقية المواعيد[cite: 7].',
      },
      theme: {
        border: 'border-cyber-cyan/50 hover:border-cyber-cyan',
        activeBorder: 'border-cyber-cyan shadow-[0_0_25px_rgba(0,240,255,0.35)] ring-1 ring-cyber-cyan',
        text: 'text-cyber-cyan',
        badgeBg: isCrisisEra 
          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
          : 'bg-cyan-500/10 text-cyber-cyan border-cyan-500/30',
        bg: 'from-[#031a2c]/60 to-[#020b14]/80',
        barColor: isCrisisEra ? 'bg-rose-500' : 'bg-cyber-cyan',
      },
    },
    {
      id: 'CAPE',
      title: 'CAPE OF GOOD HOPE',
      subtitle: 'AFRICAN MARITIME DETOUR',
      icons: [<Anchor key="anchor" className="w-4 h-4" />],
      cost: isCrisisEra 
        ? `$${Math.round((latestRotterdamRate || 5000) * 1.05).toLocaleString()}` 
        : '$3,750',
      costUnit: '/ FEU',
      transitDays: 36,
      transitLabel: '36 Days (+12d Detour)',
      fullTransit: '+4,000 NM Extended Voyage',
      speedPct: 35,
      riskLevel: 'ZERO COMBAT',
      riskText: 'BUNKER SURCHARGE // LONG TRANSIT',
      tooltip: {
        title: 'مسار رأس الرجاء الصالح (الالتفاف الإفريقي)',
        explanation: 'المسار البحري البديل حول القارة الإفريقية لتفادي الشرق الأوسط، بإضافة مسافة تتجاوز 4,000 ميل بحري[cite: 7].',
        takeaway: 'أمان عسكري كامل ولكن بتكلفة زمنية تصل إلى 36 يوماً، مع استنزاف هائل لوقود السفن وارتفاع الانبعاثات الكربونية[cite: 7].',
      },
      theme: {
        border: 'border-amber-500/40 hover:border-amber-400',
        activeBorder: 'border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.35)] ring-1 ring-amber-400',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        bg: 'from-[#221504]/60 to-[#020b14]/80',
        barColor: 'bg-amber-400',
      },
    },
    {
      id: 'SEA_AIR',
      title: 'SEA-AIR EXPRESS HUB',
      subtitle: 'ARABIAN GULF TO EUROPE FLIGHT',
      icons: [<PlaneTakeoff key="plane" className="w-4 h-4" />],
      cost: isCrisisEra ? '$6,500' : '$5,800',
      costUnit: '/ Ton Equivalent',
      transitDays: 3,
      transitLabel: '3 Days (Air Cargo)',
      fullTransit: '9 Days Total Multimodal',
      speedPct: 98,
      riskLevel: 'PRIORITY',
      riskText: 'EXPEDITED URGENT FREIGHT',
      tooltip: {
        title: 'المسار الهجين السريع (بحر - جو)',
        explanation: 'شحن بحري سريع إلى موانئ الخليج العربي يعقبه نقل جوي مباشر (Air Cargo) لمطارات أوروبا للشحنات الحيوية[cite: 7].',
        takeaway: 'أسرع حل متاح (3 أيام جوي / 9 أيام إجمالياً)، لكنه محصور بالبضائع الخفيفة وفائقة القيمة لارتفاع تكلفته للطن[cite: 7].',
      },
      theme: {
        border: 'border-blue-500/40 hover:border-blue-400',
        activeBorder: 'border-blue-400 shadow-[0_0_25px_rgba(96,165,250,0.35)] ring-1 ring-blue-400',
        text: 'text-blue-400',
        badgeBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
        bg: 'from-[#071739]/60 to-[#020b14]/80',
        barColor: 'bg-blue-400',
      },
    },
  ];

  return (
    <div className="flex flex-col w-full font-mono space-y-2.5 select-none">
      
      {/* رأس اللوحة التكتيكي مع التولتيب المفسر */}
      <div className="glass-panel p-3 rounded-2xl border border-cyber-border/80 bg-[#020713]/90 shadow-xl flex items-center justify-between overflow-visible">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
            <h3 className="text-xs font-black tracking-widest uppercase text-white">
              ROUTE COMPARISON MATRIX (2026)
            </h3>
            <TacticalTooltip
              title="مصفوفة مقارنة الممرات اللوجستية الدولية"
              explanation="تحليل مقارن للمسارات الأربعة الرئيسية بين آسيا وأوروبا يوضح تكلفة شحن الحاوية (FEU)، والزمن الإجمالي، ومستوى الأمان الملاحي[cite: 7]."
              takeaway="تحديد البديل الاستراتيجي الأكثر كفاءة من حيث التكلفة والسرعة والحماية السيادية[cite: 7]."
              position="bottom"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 tracking-wider">
            CLICK CARD TO HIGHLIGHT CORRIDOR
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
          4 LANES ACTIVE
        </span>
      </div>

      {/* توزيع الكروت الأربعة أفقياً في شبكة رباعية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {ROUTES_DATA.map((route) => {
          const isSelected = selectedRoute === route.id;

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRoute && setSelectedRoute(route.id)}
              className={`p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer relative overflow-visible backdrop-blur-xl bg-gradient-to-r ${route.theme.bg} flex flex-col justify-between ${
                isSelected ? route.theme.activeBorder : route.theme.border
              } ${isSelected ? 'scale-[1.01]' : 'hover:scale-[1.005] opacity-90 hover:opacity-100'}`}
            >
              {/* شريط ضوئي جانبي للكارت المختار */}
              {isSelected && (
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${route.theme.barColor} shadow-glow rounded-l-2xl`} />
              )}

              {/* صف العنوان والأيقونات والبادج */}
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-black/60 border border-white/10 ${route.theme.text} flex items-center gap-1`}>
                    {route.icons}
                  </div>
                  <div>
                    <h4 className="text-xs font-black tracking-wide text-white flex items-center gap-1">
                      {route.title}
                      {isSelected && (
                        <CheckCircle2 className={`w-3.5 h-3.5 ${route.theme.text}`} />
                      )}
                    </h4>
                    <span className="text-[9px] text-slate-400 block tracking-wider">
                      {route.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {route.tooltip && (
                    <TacticalTooltip
                      title={route.tooltip.title}
                      explanation={route.tooltip.explanation}
                      takeaway={route.tooltip.takeaway}
                      position="bottom"
                    />
                  )}
                  <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-md border tracking-wider whitespace-nowrap ${route.theme.badgeBg}`}>
                    {route.riskLevel}
                  </span>
                </div>
              </div>

              {/* شبكة الأرقام اللوجستية (التكلفة والزمن) */}
              <div className="grid grid-cols-2 gap-2 pt-2 pb-2.5 border-t border-white/10">
                <div>
                  <div className="flex items-center gap-1 text-[8.5px] text-slate-400 uppercase tracking-wider mb-0.5">
                    <DollarSign className="w-3 h-3 text-slate-500" />
                    <span>Cost:</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-white tracking-tight">
                      {route.cost}
                    </span>
                    <span className="text-[8.5px] text-slate-400">{route.costUnit}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-[8.5px] text-slate-400 uppercase tracking-wider mb-0.5">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>Transit:</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-sm font-black ${route.theme.text}`}>
                      {route.transitLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* مؤشر السرعة النسبي وحالة الأمان أسفل الكارت */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-[8.5px] text-slate-400 truncate">
                  {route.riskText}
                </span>

                <div className="w-16 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-white/10 flex-shrink-0">
                  <div
                    className={`h-full ${route.theme.barColor} transition-all duration-700`}
                    style={{ width: `${route.speedPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}