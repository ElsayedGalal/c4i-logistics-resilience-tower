import React from 'react';
import { Compass, GitMerge, Cpu, Radio } from 'lucide-react';

export const VIEWS = [
  { id: 'WAR_ROOM', label: '1. Chokepoints War Room', icon: Compass, badge: 'Digital Twin' },
  { id: 'MULTIMODAL', label: '2. Multimodal & Landbridge', icon: GitMerge, badge: 'Saudi Bypass' },
  { id: 'PREDICTIVE', label: '3. Predictive AI & Simulator', icon: Cpu, badge: 'What-If Engine' },
];

export default function Navigation({ activeView, setActiveView }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <Radio className="w-5 h-5 text-cyber-hazard animate-pulse" />
        <span className="text-xs font-mono tracking-widest text-slate-300 uppercase">
          Command Modules //
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
        {VIEWS.map((view) => {
          const Icon = view.icon;
          const isActive = activeView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-cyber-cyan/20 to-cyber-accent/20 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{view.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  isActive ? 'bg-cyber-cyan/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {view.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}