import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { GitMerge, Train, Ship, Truck, ShieldCheck, Clock, DollarSign, ArrowRight } from 'lucide-react';

export default function SaudiLandbridgeCorridor() {
  const { computedMetrics, endDate } = useData();
  const { latestRotterdamRate } = computedMetrics;
  const [selectedLeg, setSelectedLeg] = useState(1);

  const isCrisisEra = endDate >= '2023-11-20';

  // حساب الوفورات المالية والزمنية الحية مقارنة بسعر الشحن الحالي لتاريخ الـ Play
  const capeCostLive = Math.round(latestRotterdamRate * 1.06);
  const landBridgeCostLive = isCrisisEra ? 4850 : 4150;
  const netSavingsVsCape = capeCostLive - landBridgeCostLive;

  const CORRIDOR_STEPS = [
    {
      id: 1,
      title: 'Ocean Feeder Leg',
      route: 'East Asia / Singapore ➔ Arabian Gulf Hubs',
      hub: 'King Abdulaziz Port (Dammam) / Jebel Ali Port',
      time: 'Day 1 - 10',
      icon: Ship,
      color: '#00F0FF',
      details: 'Vessels divert through Strait of Hormuz directly into safe Arabian Gulf deepwater terminals, entirely evading the Bab el-Mandeb threat envelope.',
      metrics: { distance: '3,800 NM', risk: 'Low', costPerFEU: isCrisisEra ? '$2,100' : '$1,750' },
    },
    {
      id: 2,
      title: 'Saudi Overland Freight Rail & Road',
      route: 'Dammam Port ➔ Riyadh Dry Port Hub',
      hub: 'Saudi Railway Company (SAR) Freight Line',
      time: 'Day 11 - 12',
      icon: Train,
      color: '#38BDF8',
      details: 'High-throughput double-stack container block trains running across the Eastern and Central Provinces with pre-cleared customs transit.',
      metrics: { distance: '450 km', transitTime: '18 Hours', costPerFEU: '$650' },
    },
    {
      id: 3,
      title: 'Red Sea West Coast Bridge',
      route: 'Riyadh Hub ➔ Jeddah Islamic Port / King Abdullah Port (KAEC)',
      hub: 'Western Province Transshipment Hubs',
      time: 'Day 13 - 14',
      icon: Truck,
      color: '#00FF9D',
      details: 'Container convoys connect safely to Red Sea ports NORTH of the conflict zone, maintaining zero exposure to Houthi missile range.',
      metrics: { distance: '950 km', safetyScore: '100%', costPerFEU: '$850' },
    },
    {
      id: 4,
      title: 'Final Maritime Corridor',
      route: 'Jeddah / King Abdullah Port ➔ Mediterranean & North Europe',
      hub: 'Suez Northbound Passage into Europe',
      time: 'Day 15 - 17',
      icon: Ship,
      color: '#A855F7',
      details: 'Feeder vessels transit northbound via Suez Canal into Greece, Italy, or Rotterdam in just 17 days total (saving 19 full voyage days vs Cape).',
      metrics: { totalTime: '17 Days', savingsVsCape: '-19 Days', costPerFEU: isCrisisEra ? '$1,250' : '$900' },
    },
  ];

  const currentStep = CORRIDOR_STEPS.find((s) => s.id === selectedLeg) || CORRIDOR_STEPS[0];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyber-border/80 flex flex-col h-full shadow-2xl">
      
      {/* Header المكون مع التاريخ الحي */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-cyber-emerald" />
            <h3 className="text-sm font-black tracking-wider uppercase text-white font-mono">
              Arabian Land Bridge Pipeline // Bab el-Mandeb Bypass
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyber-emerald">
              {endDate}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Intermodal East-West rail and truck corridor connecting Arabian Gulf to the Red Sea
          </p>
        </div>

        <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-cyber-emerald/15 border border-cyber-emerald text-cyber-emerald shadow-neon-emerald flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          {isCrisisEra ? 'ACTIVE EMERGENCY BYPASS' : 'OPERATIONAL STANDBY'}
        </span>
      </div>

      {/* المراحل الأربعة التفاعلية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {CORRIDOR_STEPS.map((step) => {
          const Icon = step.icon;
          const isSelected = selectedLeg === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setSelectedLeg(step.id)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-300 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-cyber-cyan shadow-neon-cyan'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-cyber-cyan text-black' : 'bg-slate-800 text-slate-300'
                }`}>
                  STAGE 0{step.id}
                </span>
                <Icon className={`w-4 h-4 ${isSelected ? 'text-cyber-cyan' : 'text-slate-500'}`} />
              </div>
              <div className="text-xs font-bold text-slate-200 mb-1">{step.title}</div>
              <div className="text-[10px] font-mono text-cyber-emerald">{step.time}</div>
            </button>
          );
        })}
      </div>

      {/* لوحة تفاصيل المرحلة */}
      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 relative overflow-hidden mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3 pb-3 border-b border-slate-800/80">
          <div>
            <span className="text-[10px] font-mono text-cyber-cyan uppercase block">Selected Operation Segment</span>
            <h4 className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
              <span>{currentStep.title}</span>
              <span className="text-xs text-slate-400 font-normal">({currentStep.route})</span>
            </h4>
          </div>

          <span className="text-xs font-mono px-3 py-1 rounded bg-slate-900 border border-slate-700 text-white font-bold">
            Hub: {currentStep.hub}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {currentStep.details}
        </p>

        <div className="grid grid-cols-3 gap-3">
          {Object.entries(currentStep.metrics).map(([key, val]) => (
            <div key={key} className="bg-slate-900/70 p-2.5 rounded-lg border border-slate-800 text-center">
              <span className="text-[9px] font-mono uppercase text-slate-400 block">{key}</span>
              <span className="text-xs font-bold font-mono text-cyber-cyan mt-0.5 block">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* المقارنة اللحظية الحية المتأثرة بالزمن وأسعار الشحن */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">TRANSIT SPEED</span>
          <span className="text-lg font-black text-cyber-cyan">17 Days</span>
          <span className="text-[10px] text-cyber-emerald block mt-0.5">-19 Days vs Cape Detour</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">ALL-IN SIMULATED COST</span>
          <span className="text-lg font-black text-white">${landBridgeCostLive.toLocaleString()}</span>
          <span className={`text-[10px] block mt-0.5 font-bold ${netSavingsVsCape > 0 ? 'text-cyber-emerald' : 'text-slate-400'}`}>
            {netSavingsVsCape > 0 ? `-$${netSavingsVsCape.toLocaleString()} cheaper than Cape` : 'Speed premium vs baseline'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <span className="text-[10px] text-slate-400 block mb-1">BYPASS EFFECTIVENESS</span>
          <span className="text-lg font-black text-cyber-emerald">100% SECURE</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">Zero Red Sea Chokepoint Risk</span>
        </div>
      </div>

    </div>
  );
}