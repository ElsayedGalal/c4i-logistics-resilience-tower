import React from 'react';
import { useData, TIME_PRESETS } from '../context/DataContext';
import { Play, Pause, RotateCcw, Calendar, AlertTriangle } from 'lucide-react';

export default function TimelineScrubber() {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activePreset,
    applyPreset,
    isPlaying,
    setIsPlaying,
    computedMetrics,
  } = useData();

  // تحويل التواريخ إلى نسب مئوية للشريط (2019-01-01 to 2026-10-04)
  const minTimestamp = new Date('2019-01-01').getTime();
  const maxTimestamp = new Date('2026-10-04').getTime();
  const totalDuration = maxTimestamp - minTimestamp;

  const currentEndTimestamp = new Date(endDate).getTime();
  const progressPct = Math.min(
    100,
    Math.max(0, ((currentEndTimestamp - minTimestamp) / totalDuration) * 100)
  );

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyber-border/70 shadow-2xl backdrop-blur-xl mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* أزرار الفترات الجاهزة (Quick Presets) */}
        <div className="flex flex-wrap items-center gap-2">
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-300 border ${
                activePreset === preset.id
                  ? 'bg-cyber-cyan/15 border-cyber-cyan text-cyber-cyan shadow-neon-cyan'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* أدوات التشغيل التلقائي وعرض التاريخ المباشر */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <Calendar className="w-4 h-4 text-cyber-accent" />
            <span className="text-xs font-mono text-slate-300">
              {startDate} <span className="text-cyber-cyan">──▶</span> {endDate}
            </span>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl border font-bold flex items-center gap-2 text-xs transition-all ${
              isPlaying
                ? 'bg-cyber-hazard/20 border-cyber-hazard text-cyber-hazard shadow-neon-red animate-pulse'
                : 'bg-cyber-emerald/20 border-cyber-emerald text-cyber-emerald shadow-neon-emerald hover:bg-cyber-emerald/30'
            }`}
            title={isPlaying ? 'Pause Simulation' : 'Play Time-Travel Simulation'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            onClick={() => applyPreset(TIME_PRESETS[0])}
            className="p-2.5 rounded-xl border border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
            title="Reset to Full Period"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* شريط السحب التفاعلي (Interactive Scrubber Track) */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <div className="relative w-full flex items-center">
          {/* خلفية المسار */}
          <div className="w-full h-2.5 bg-slate-900/90 rounded-full overflow-hidden border border-slate-800 relative">
            <div
              className="h-full bg-gradient-to-r from-cyber-cyan via-cyber-accent to-cyber-purple transition-all duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* مقبض السحب الخفي للتحكم الدقيق */}
          <input
            type="range"
            min={minTimestamp}
            max={maxTimestamp}
            value={currentEndTimestamp}
            onChange={(e) => {
              const dateStr = new Date(Number(e.target.value)).toISOString().split('T')[0];
              setEndDate(dateStr);
              setActivePreset('CUSTOM');
              setIsPlaying(false);
            }}
            className="absolute w-full h-6 opacity-0 cursor-pointer"
          />

          {/* نقطة المقبض النيون المتوهجة */}
          <div
            className="absolute w-4 h-4 rounded-full bg-white border-2 border-cyber-cyan shadow-neon-cyan pointer-events-none transition-all duration-150 transform -translate-x-1/2"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        {/* مؤشرات السنوات أسفل الشريط */}
        <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-2 px-1">
          <span>2019</span>
          <span>2020</span>
          <span>2021 (Ever Given)</span>
          <span>2022</span>
          <span>2023 (Baseline)</span>
          <span className="text-cyber-hazard font-bold">2024 (Crisis)</span>
          <span>2025</span>
          <span className="text-cyber-cyan font-bold">2026 (Live)</span>
        </div>
      </div>
    </div>
  );
}