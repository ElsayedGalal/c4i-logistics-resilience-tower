import React from 'react';
import { 
  Package, 
  Fuel, 
  Leaf, 
  ShieldAlert, 
  Anchor,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';

export default function MacroCrisisHUD() {
  const { endDate } = useData() || {};

  // البيانات والمؤشرات الخمسة المستمدة من واقع الأزمة اللوجستية
  const metrics = [
    {
      id: 'floating',
      icon: Package,
      title: 'FLOATING INVENTORY DELAY',
      subtext: 'Global Trapped Value',
      value: '$18.4B',
      detail: '+12 Days Added Transit',
      color: 'amber',
      borderColor: 'border-amber-500/40 hover:border-amber-400',
      bgColor: 'bg-amber-950/20',
      textColor: 'text-amber-400',
      badge: 'SUPPLY SHOCK',
    },
    {
      id: 'fuel',
      icon: Fuel,
      title: 'EXCESS BUNKER BURN',
      subtext: 'Cape Detour Consumption',
      value: '+1,200 MT',
      detail: '+$734K / Vessel Run',
      color: 'rose',
      borderColor: 'border-rose-500/40 hover:border-rose-400',
      bgColor: 'bg-rose-950/20',
      textColor: 'text-rose-400',
      badge: 'COST DRIVER',
    },
    {
      id: 'carbon',
      icon: Leaf,
      title: 'CARBON FOOTPRINT (CO2)',
      subtext: 'Scope-3 Emissions Spike',
      value: '+3,736 T',
      detail: '+38% Per Container (FEU)',
      color: 'purple',
      borderColor: 'border-purple-500/40 hover:border-purple-400',
      bgColor: 'bg-purple-950/20',
      textColor: 'text-purple-300',
      badge: 'ESG IMPACT',
    },
    {
      id: 'escort',
      icon: ShieldAlert,
      title: 'TRANSIT RISK & ESCORTS',
      subtext: 'High-Hazard Zone Profile',
      value: '84.2%',
      detail: 'Naval Convoy / Non-Western',
      color: 'sky',
      borderColor: 'border-sky-500/40 hover:border-sky-400',
      bgColor: 'bg-sky-950/20',
      textColor: 'text-sky-400',
      badge: 'CONVOY ONLY',
    },
    {
      id: 'port',
      icon: Anchor,
      title: 'PORT BOTTLENECK INDEX',
      subtext: 'Bypass Hub Congestion',
      value: '4.8 Days',
      detail: 'Tangier Med & Durban Wait',
      color: 'emerald',
      borderColor: 'border-emerald-500/40 hover:border-emerald-400',
      bgColor: 'bg-emerald-950/20',
      textColor: 'text-emerald-400',
      badge: '+140% CLUSTER',
    },
  ];

  return (
    <div className="glass-panel p-3 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-2xl select-none">
      
      {/* 1. رأس الشريط التكتيكي */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <h4 className="text-[11px] font-black tracking-widest text-white uppercase font-mono flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            MACRO LOGISTICAL IMPACT // SECONDARY CRISIS FOOTPRINT
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[9.5px] font-mono text-slate-400">
          <span>MEASURED TELEMETRY HORIZON:</span>
          <span className="text-cyber-cyan font-bold">{endDate || '2026-10-04'}</span>
        </div>
      </div>

      {/* 2. شبكة الكروت الخمسة المتوازية والمتجاوبة */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {metrics.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              className={`p-2.5 rounded-xl border transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] ${item.borderColor} ${item.bgColor} bg-gradient-to-b from-[#020a17]/90 to-black`}
            >
              {/* هيدر الكارت المصغر مع الشارة */}
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div className="p-1.5 rounded-lg bg-black/60 border border-slate-800 text-slate-300 group-hover:border-slate-700 transition-colors">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider ${item.textColor} border-current/30 bg-black/40`}>
                  {item.badge}
                </span>
              </div>

              {/* العنوان والتفاصيل */}
              <div className="min-h-[28px] mb-1">
                <h5 className="text-[9.5px] font-black text-slate-200 tracking-wide leading-tight truncate">
                  {item.title}
                </h5>
                <span className="text-[8px] text-slate-400 block truncate">
                  {item.subtext}
                </span>
              </div>

              {/* القيمة الرئيسية والرقم التوضيحي */}
              <div className="pt-1.5 border-t border-slate-800/60 flex items-baseline justify-between gap-1">
                <span className={`text-base font-black tracking-wider ${item.textColor} font-mono`}>
                  {item.value}
                </span>
                <span className="text-[8.5px] text-slate-400 font-mono text-right truncate">
                  {item.detail}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}