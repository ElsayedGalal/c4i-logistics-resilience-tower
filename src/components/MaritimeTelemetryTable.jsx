import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import TacticalTooltip from './TacticalTooltip';
import { Layers } from 'lucide-react';

export default function MaritimeTelemetryTable() {
  const { computedMetrics, endDate } = useData();
  const { filteredTransits } = computedMetrics || {};
  const [selectedPortFilter, setSelectedPortFilter] = useState('ALL');

  const BASELINE_TOTAL = {
    'Bab el-Mandeb': 74.6,
    'Suez Canal': 73.6,
    'Cape of Good Hope': 48.9,
    'Strait of Hormuz': 95.6,
  };

  const displayRows = useMemo(() => {
    let rows = filteredTransits || [];
    if (selectedPortFilter !== 'ALL') {
      rows = rows.filter((r) => r.port === selectedPortFilter);
    }
    return [...rows].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredTransits, selectedPortFilter]);

  const volumeChartBars = useMemo(() => {
    const grouped = {};
    displayRows.forEach((r) => {
      if (!grouped[r.date]) grouped[r.date] = 0;
      grouped[r.date] += r.capacity;
    });

    const sortedDates = Object.keys(grouped).sort();
    const recentDates = sortedDates.slice(-32);
    const maxVal = Math.max(...recentDates.map((d) => grouped[d]), 1);

    return recentDates.map((date) => {
      const val = grouped[date];
      return {
        date,
        val,
        heightPct: Math.min(70, Math.max(10, (val / maxVal) * 70)),
        dwtFormatted: (val / 1000000).toFixed(1) + 'M',
      };
    });
  }, [displayRows, endDate]);

  return (
    <div className="glass-panel rounded-2xl p-4 border border-cyber-border/80 flex flex-col h-full shadow-2xl relative overflow-visible select-none">
      
      {/* 1. هيدر الجدول */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <h3 className="text-xs font-black tracking-widest uppercase text-white font-mono">
              MARITIME CARGO & VOL. TELEMETRY
            </h3>
            <TacticalTooltip
              title="سجل تدفق السفن والحمولات البحرية"
              explanation="رصد يومي دقيق لأنواع السفن العابرة (حاويات، ناقلات نفط، بضائع صب) مع بيان سعة الوزن الساكن (DWT) ومعدل التغير عن المتوسط الطبيعي."
              takeaway="تحديد أي القطاعات التجارية أكثر تضرراً، والتفريق بين تعطل السلع الاستهلاكية أو إمدادات الطاقة."
              position="bottom"
            />
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyber-cyan">
              {endDate}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            Streaming AIS transit telemetry & deadweight capacity
          </p>
        </div>

        {/* فلاتر الممرات */}
        <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
          {['ALL', 'Bab el-Mandeb', 'Suez Canal', 'Cape of Good Hope'].map((port) => (
            <button
              key={port}
              onClick={() => setSelectedPortFilter(port)}
              className={`px-2 py-0.5 rounded transition-all ${
                selectedPortFilter === port
                  ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan font-bold shadow-neon-cyan'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {port === 'ALL' ? 'ALL' : port.replace(' of Good Hope', '').replace(' Canal', '')}
            </button>
          ))}
        </div>
      </div>

      {/* 2. جدول البيانات */}
      <div className="overflow-x-auto overflow-y-auto h-[248px] max-h-[248px] flex-shrink-0 pr-1 border border-slate-800/60 rounded-xl bg-slate-950/50">
        <table className="w-full text-left border-collapse text-[11px] font-mono">
          <thead>
            <tr className="border-b border-slate-800/80 text-slate-400 text-[10px] sticky top-0 bg-[#0B0F19]/95 backdrop-blur-md z-10">
              <th className="py-1.5 px-2">Date</th>
              <th className="py-1.5 px-2">Chokepoint</th>
              <th className="py-1.5 px-1.5 text-right text-cyber-cyan">Cont.</th>
              <th className="py-1.5 px-1.5 text-right text-cyber-warning">Tanker</th>
              <th className="py-1.5 px-1.5 text-right text-slate-300">Bulk</th>
              <th className="py-1.5 px-2 text-right">DWT Cap.</th>
              <th className="py-1.5 px-2 text-right">Change %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {displayRows.slice(0, 35).map((row, idx) => {
              const base = BASELINE_TOTAL[row.port] || 60;
              const changePct = (((row.total - base) / base) * 100).toFixed(1);
              const isNegative = Number(changePct) < 0;

              return (
                <tr
                  key={`${row.date}-${row.port}-${idx}`}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  <td className="py-1.5 px-2 text-slate-300 whitespace-nowrap">{row.date}</td>
                  <td className="py-1.5 px-2 font-bold text-white whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          row.port === 'Bab el-Mandeb'
                            ? 'bg-cyber-hazard'
                            : row.port === 'Suez Canal'
                            ? 'bg-cyber-warning'
                            : row.port === 'Cape of Good Hope'
                            ? 'bg-cyber-emerald'
                            : 'bg-cyber-accent'
                        }`}
                      />
                      {row.port.replace(' of Good Hope', '').replace(' Strait', '')}
                    </span>
                  </td>
                  <td className="py-1.5 px-1.5 text-right text-cyber-cyan font-bold">{row.container}</td>
                  <td className="py-1.5 px-1.5 text-right text-cyber-warning">{row.tanker}</td>
                  <td className="py-1.5 px-1.5 text-right text-slate-400">{row.bulk}</td>
                  <td className="py-1.5 px-2 text-right text-slate-300 font-bold">
                    {(row.capacity / 1000000).toFixed(2)}M
                  </td>
                  <td
                    className={`py-1.5 px-2 text-right font-bold whitespace-nowrap ${
                      isNegative ? 'text-cyber-hazard' : 'text-cyber-emerald'
                    }`}
                  >
                    {isNegative ? '' : '+'}
                    {changePct}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3. قسم الهستوجرام */}
      <div className="flex-1 flex flex-col justify-between mt-2.5 pt-2 border-t border-slate-800/80 min-h-0">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1 flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-white font-bold">
              <Layers className="w-3 h-3 text-cyber-cyan" />
              Vol. Telemetry Histogram (DWT Tonnage)
            </span>
            <TacticalTooltip
              title="مخطط سعة الحمولات المنقولة (آخر 30 يوماً)"
              explanation="يعكس التذبذب اليومي في إجمالي الأطنان المنقولة بحراً، ويقيس مدى ثبات أو تراجع حركة الشحن التراكمية في الممر المختار."
              takeaway="اكتشاف التراجعات الحادة في الإمدادات قبل تحولها إلى أزمة نقص بضائع في الأسواق."
              position="top"
            />
          </div>
          <span className="text-[10px] text-cyber-cyan font-bold">{endDate}</span>
        </div>

        <div className="flex-1 w-full bg-slate-950/80 rounded-xl border border-slate-900 p-2 flex items-end gap-1 overflow-hidden min-h-[75px] relative">
          <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-15">
            <div className="border-b border-dashed border-cyan-400 w-full" />
            <div className="border-b border-dashed border-cyan-400 w-full" />
            <div className="border-b border-dashed border-cyan-400 w-full" />
          </div>

          {volumeChartBars.map((bar, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-950 via-cyber-cyan/60 to-cyber-cyan hover:to-cyber-emerald transition-all duration-300 rounded-t-sm relative group cursor-pointer z-10"
              style={{ height: `${bar.heightPct}%` }}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center bg-slate-950/95 border border-slate-700 px-2 py-0.5 rounded text-[9px] font-mono text-white whitespace-nowrap z-30 shadow-2xl pointer-events-none">
                <span className="text-slate-300">{bar.date}</span>
                <span className="text-cyber-cyan font-bold">{bar.dwtFormatted} DWT</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1 px-1 flex-shrink-0">
          <span>{volumeChartBars[0]?.date || 'Window Start'}</span>
          <span className="text-slate-400 font-bold uppercase tracking-wider">Trailing 30-Day Activity</span>
          <span className="text-cyber-cyan font-bold">{endDate}</span>
        </div>
      </div>

    </div>
  );
}