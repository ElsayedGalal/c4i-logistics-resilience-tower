import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import ChokepointMap from '../components/ChokepointMap';
import TransitFreightChart from '../components/TransitFreightChart';
import MaritimeTelemetryTable from '../components/MaritimeTelemetryTable';
import TacticalTooltip from '../components/TacticalTooltip';
import { 
  ShieldAlert, 
  TrendingDown, 
  ArrowUpRight, 
  DollarSign, 
  Radio, 
  Table,
  Package,
  Fuel,
  Leaf,
  Anchor,
  AlertCircle
} from 'lucide-react';

export default function ChokepointsWarRoom() {
  const { computedMetrics, endDate } = useData();
  const { portStats, avgSpotRate, latestRotterdamRate, activeEvents } = computedMetrics || {};
  
  const [rightPanelTab, setRightPanelTab] = useState('TELEMETRY');

  const babElMandeb = portStats?.['Bab el-Mandeb'] || {};
  const suez = portStats?.['Suez Canal'] || {};
  const cape = portStats?.['Cape of Good Hope'] || {};

  const macroMetrics = useMemo(() => {
    const baselineCapeContainers = 4.8;
    const currentCapeCont = Number(cape.avgContainer) || baselineCapeContainers;
    const divertedContainersPerDay = Math.max(0, currentCapeCont - baselineCapeContainers);

    const crisisIntensity = Math.min(1.2, divertedContainersPerDay / 16);

    const floatingValue = (1.5 + crisisIntensity * 16.9).toFixed(1);
    const addedDelayDays = Math.round(crisisIntensity * 12);

    const excessFuelMT = Math.round(150 + crisisIntensity * 1050);
    const excessFuelCostK = Math.round((excessFuelMT * 612) / 1000);

    const carbonTons = Math.round(excessFuelMT * 3.114);
    const carbonPct = Math.round(crisisIntensity * 38);

    const dropPct = Math.abs(Number(babElMandeb.containerChangePct) || 0);
    const escortRiskPct = Math.min(88, Math.max(4.5, (dropPct * 1.1 + 5))).toFixed(1);

    const portDelayDays = (1.2 + crisisIntensity * 3.6).toFixed(1);
    const portClusterPct = Math.round(crisisIntensity * 140);

    return [
      {
        id: 'floating',
        icon: Package,
        title: 'FLOATING INVENTORY DELAY',
        subtext: 'Global Trapped Value',
        value: `$${floatingValue}B`,
        detail: `+${addedDelayDays}d Added Transit`,
        textColor: 'text-amber-400',
        borderColor: 'border-amber-500/30 hover:border-amber-400/80',
        bgColor: 'bg-amber-950/20',
        badge: crisisIntensity > 0.4 ? 'SUPPLY SHOCK' : 'NOMINAL FLOW',
        tooltip: {
          title: 'المخزون المالي العالق في البحر',
          explanation: 'القيمة المالية التقديرية للبضائع المحتجزة داخل الحاويات في عرض البحر نتيجة تأخر وصول السفن الدائرة حول إفريقيا.',
          takeaway: 'تأخر السيولة وتعطل خطوط الإنتاج ونقص المعروض بالأسواق العالمية.',
        },
      },
      {
        id: 'fuel',
        icon: Fuel,
        title: 'EXCESS BUNKER BURN',
        subtext: 'Cape Detour Consumption',
        value: `+${excessFuelMT.toLocaleString()} MT`,
        detail: `+$${excessFuelCostK}K / Voyage`,
        textColor: 'text-rose-400',
        borderColor: 'border-rose-500/30 hover:border-rose-400/80',
        bgColor: 'bg-rose-950/20',
        badge: crisisIntensity > 0.4 ? 'COST DRIVER' : 'BASE BURN',
        tooltip: {
          title: 'استهلاك الوقود الإضافي',
          explanation: 'أطنان وقود السفن الإضافية المحترقة لقطع 3,500 ميل بحري إضافي حول القارة الإفريقية مقارنة بعبور قناة السويس.',
          takeaway: 'إضافة ما يقارب 700 ألف دولار تكلفة وقود مباشرة لكل رحلة سفينة.',
        },
      },
      {
        id: 'carbon',
        icon: Leaf,
        title: 'CARBON PENALTY (CO2)',
        subtext: 'Scope-3 Emissions Spike',
        value: `+${carbonTons.toLocaleString()} T`,
        detail: `+${carbonPct}% Per Container`,
        textColor: 'text-purple-300',
        borderColor: 'border-purple-500/30 hover:border-purple-400/80',
        bgColor: 'bg-purple-950/20',
        badge: 'ESG IMPACT',
        tooltip: {
          title: 'البصمة الكربونية الإضافية (CO2)',
          explanation: 'كميات انبعاثات الكربون الناتجة عن إطالة مسار الرحلة، محسوبة وفق المعيار الفني للمنظمة البحرية الدولية (IMO: 3.114 طن كربون/طن مازوت).',
          takeaway: 'ضغط سلبي حاد على أهداف الاستدامة للشركات العالمية (معايير Scope-3).',
        },
      },
      {
        id: 'escort',
        icon: ShieldAlert,
        title: 'TRANSIT RISK PROFILE',
        subtext: 'Chokepoint Escort Need',
        value: `${escortRiskPct}%`,
        detail: crisisIntensity > 0.4 ? 'Naval Convoy Only' : 'Commercial Routine',
        textColor: 'text-sky-400',
        borderColor: 'border-sky-500/30 hover:border-sky-400/80',
        bgColor: 'bg-sky-950/20',
        badge: crisisIntensity > 0.4 ? 'CONVOY ACTIVE' : 'UNESCORTED',
        tooltip: {
          title: 'ملف المخاطر والحماية البحرية',
          explanation: 'نسبة السفن المتبقية في البحر الأحمر التي تتطلب مرافقة بوارج عسكرية أو تقتصر على جنسيات معينة غير مستهدفة.',
          takeaway: 'تراجع حركة الخطوط الملاحية الغربية الكبرى في المضيق إلى الصفر تقريباً.',
        },
      },
      {
        id: 'port',
        icon: Anchor,
        title: 'PORT BOTTLENECK INDEX',
        subtext: 'Bypass Hub Congestion',
        value: `${portDelayDays} Days`,
        detail: `+${portClusterPct}% Wait Time`,
        textColor: 'text-emerald-400',
        borderColor: 'border-emerald-500/30 hover:border-emerald-400/80',
        bgColor: 'bg-emerald-950/20',
        badge: crisisIntensity > 0.4 ? 'CLUSTER RISK' : 'LOW QUEUE',
        tooltip: {
          title: 'مؤشر تكدس الموانئ البديلة',
          explanation: 'متوسط أيام انتظار السفن على أرصفة محطات التغذية البديلة (مثل طنجة المتوسط وديربان وجبل علي) بسبب التدفق المفاجئ للحمولات.',
          takeaway: 'انتقال الأزمة اللوجستية من عرض البحر إلى اختناق أرصفة ومحطات الموانئ.',
        },
      },
    ];
  }, [cape.avgContainer, babElMandeb.containerChangePct]);

  return (
    <div className="space-y-4 font-mono select-none">
      
      {/* 1. صف الـ KPI Cards العلوي */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* كارت 1: باب المندب */}
        <div className="glass-card rounded-2xl p-4 relative overflow-visible border border-cyber-border/70 bg-[#020713]/95 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="tracking-wider">BAB EL-MANDEB TRANSITS</span>
              <TacticalTooltip
                title="مؤشر عبور مضيق باب المندب"
                explanation="يرصد متوسط عدد السفن اليومية العابرة للمضيق. يوضح نسبة التراجع الحاد لسفن الحاويات نتيجة التهديدات الأمنية والصاروخية."
                takeaway="انخفاضه بمثابة إنذار مبكر لهروب الخطوط الملاحية وتحولها إجبارياً لمسارات أطول."
                position="bottom"
              />
            </div>
            <ShieldAlert className="w-4 h-4 text-cyber-hazard animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {babElMandeb.avgTotal || '0'}{' '}
            <span className="text-xs font-normal text-slate-400">/ day</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                Number(babElMandeb.containerChangePct) < 0
                  ? 'bg-cyber-hazard/20 text-cyber-hazard shadow-neon-red'
                  : 'bg-cyber-emerald/20 text-cyber-emerald'
              }`}
            >
              {babElMandeb.containerChangePct > 0 ? '+' : ''}
              {babElMandeb.containerChangePct}%
            </span>
            <span className="text-[10px] text-slate-400">Containers ({babElMandeb.avgContainer}/d)</span>
          </div>
        </div>

        {/* كارت 2: قناة السويس */}
        <div className="glass-card rounded-2xl p-4 relative overflow-visible border border-cyber-border/70 bg-[#020713]/95 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="tracking-wider">SUEZ CANAL DISRUPTION</span>
              <TacticalTooltip
                title="مؤشر تأثر قناة السويس"
                explanation="يقيس حركة المرور اليومية عبر قناة السويس. يرتبط مباشرة بباب المندب، فأي سفينة تتفادى البحر الأحمر تفقدها القناة تلقائياً."
                takeaway="تراجع عبور السويس يعني طول زمن الرحلات ونقص الإيرادات الملاحية الإقليمية."
                position="bottom"
              />
            </div>
            <TrendingDown className="w-4 h-4 text-cyber-warning" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {suez.avgTotal || '0'}{' '}
            <span className="text-xs font-normal text-slate-400">/ day</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                Number(suez.containerChangePct) < 0
                  ? 'bg-cyber-warning/20 text-cyber-warning'
                  : 'bg-cyber-emerald/20 text-cyber-emerald'
              }`}
            >
              {suez.containerChangePct > 0 ? '+' : ''}
              {suez.containerChangePct}%
            </span>
            <span className="text-[10px] text-slate-400">Containers ({suez.avgContainer}/d)</span>
          </div>
        </div>

        {/* كارت 3: رأس الرجاء الصالح */}
        <div className="glass-card rounded-2xl p-4 relative overflow-visible border border-cyber-border/70 bg-[#020713]/95 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="tracking-wider">CAPE DIVERSION SURGE</span>
              <TacticalTooltip
                title="طفرة الالتفاف حول إفريقيا"
                explanation="نسبة الزيادة في أعداد السفن التي اختارت الدوران حول رأس الرجاء الصالح كمسار بديل اضطراري لتفادي منطقة الصراع."
                takeaway="يضيف ما بين 10 إلى 14 يوماً لكل رحلة بحرية، مما يسبب احتجاز الحاويات وارتفاع تكلفة الشحن."
                position="bottom"
              />
            </div>
            <ArrowUpRight className="w-4 h-4 text-cyber-emerald animate-bounce" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">+{cape.containerChangePct || '0'}%</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyber-emerald/20 text-cyber-emerald shadow-neon-emerald">
              {cape.avgContainer || '0'} Cont/day
            </span>
            <span className="text-[10px] text-slate-400">Total: {cape.avgTotal}/d</span>
          </div>
        </div>

        {/* كارت 4: مؤشر نولون الشحن الفوري */}
        <div className="glass-card rounded-2xl p-4 relative overflow-visible border border-cyber-border/70 bg-[#020713]/95 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="tracking-wider">SPOT FREIGHT RATE</span>
              <TacticalTooltip
                title="مؤشر أسعار الشحن الفوري (Drewry WCI)"
                explanation="السعر الفوري القياسي لشحن الحاوية النمطية (40 قدم). يوضح الارتفاع الكبير الحادث على خط التجارة الرئيسي (شنغهاي - روتردام)."
                takeaway="انعكاس فوري ومباشر لطول الرحلات وارتفاع أقساط التأمين الحربي على تكلفة السلع للمستهلك."
                position="bottom"
              />
            </div>
            <DollarSign className="w-4 h-4 text-cyber-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">${avgSpotRate ? avgSpotRate.toLocaleString() : '0'}</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyber-cyan/20 text-cyber-cyan">
              Rotterdam: ${latestRotterdamRate ? latestRotterdamRate.toLocaleString() : '0'}
            </span>
            <span className="text-[10px] text-slate-400">Per 40ft</span>
          </div>
        </div>
      </div>

      {/* 2. منتصف الشاشة: المجسم ثلاثي الأبعاد وبجانبه جدول الـ Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        
        {/* المجسم 3D في اليسار */}
        <div className="lg:col-span-7 h-full">
          <ChokepointMap />
        </div>

        {/* الكارت الأيمن: مع أزرار التبديل */}
        <div className="lg:col-span-5 flex flex-col h-full space-y-2.5">
          
          <div className="flex items-center justify-between bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setRightPanelTab('TELEMETRY')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rightPanelTab === 'TELEMETRY'
                    ? 'bg-cyber-cyan/20 border border-cyber-cyan text-cyber-cyan shadow-neon-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                Vessel Telemetry Table
              </button>

              <button
                onClick={() => setRightPanelTab('EVENTS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  rightPanelTab === 'EVENTS'
                    ? 'bg-cyber-hazard/20 border border-cyber-hazard text-cyber-hazard shadow-neon-red'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                Event Feed ({activeEvents ? activeEvents.length : 0})
              </button>
            </div>
            <span className="text-[10px] text-slate-500 pr-2">LIVE</span>
          </div>

          {rightPanelTab === 'TELEMETRY' ? (
            <MaritimeTelemetryTable />
          ) : (
            <div className="glass-panel rounded-2xl p-5 border border-cyber-border flex flex-col h-[520px]">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyber-hazard" />
                  <h3 className="text-sm font-bold tracking-wider uppercase text-white">
                    Geopolitical Event Feed
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                  {activeEvents ? activeEvents.length : 0} Active in Window
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
                {!activeEvents || activeEvents.length === 0 ? (
                  <div className="text-center text-slate-500 py-12 text-xs">
                    No major security alerts logged in this date range.
                  </div>
                ) : (
                  activeEvents.slice().reverse().map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all text-xs"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-cyber-cyan text-[11px]">{ev.date}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                            ev.severity === 'Critical'
                              ? 'bg-cyber-hazard/20 text-cyber-hazard border border-cyber-hazard/40'
                              : ev.severity === 'High'
                              ? 'bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/40'
                              : 'bg-cyber-accent/20 text-cyber-accent'
                          }`}
                        >
                          {ev.severity}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-200 mb-1">{ev.title}</h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                        {ev.description}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. شريط الكروت الخمسة التكتيكية */}
      <div className="glass-panel p-3 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <h4 className="text-[11px] font-black tracking-widest text-white uppercase flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              MACRO CRISIS SHOCK // SECONDARY ECONOMIC & CARBON FOOTPRINT
            </h4>
            <TacticalTooltip
              title="حزمة الآثار الماكرو-لوجستية للأزمة"
              explanation="مصفوفة مؤشرات مشتقة لحظياً تحسب الفاتورة التراكمية الناتجة عن إغلاق المضيق، شاملة المخزون العالق، حرق الوقود الإضافي، والانبعاثات البيئية."
              takeaway="ترجمة الأزمة الجغرافية إلى أرقام مالية وتنفيذية واضحة لصناع القرار."
              position="top"
            />
          </div>
          <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400">
            <span>CALIBRATION DATE:</span>
            <span className="text-cyber-cyan font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              {endDate}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {macroMetrics.map((item) => {
            const IconComp = item.icon;

            return (
              <div
                key={item.id}
                className={`p-2.5 rounded-xl border transition-all duration-300 relative overflow-visible group hover:scale-[1.01] ${item.borderColor} ${item.bgColor} bg-gradient-to-b from-[#020a17]/90 to-black`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="p-1 rounded-md bg-black/60 border border-slate-800 text-slate-300 group-hover:border-slate-700 transition-colors">
                    <IconComp className="w-3 h-3" />
                  </div>
                  <span className={`text-[7.5px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider ${item.textColor} border-current/30 bg-black/50`}>
                    {item.badge}
                  </span>
                </div>

                <div className="min-h-[26px]">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="text-[9px] font-black text-slate-200 tracking-wide truncate">
                      {item.title}
                    </h5>
                    {item.tooltip && (
                      <TacticalTooltip
                        title={item.tooltip.title}
                        explanation={item.tooltip.explanation}
                        takeaway={item.tooltip.takeaway}
                        position="top"
                      />
                    )}
                  </div>
                  <span className="text-[7.5px] text-slate-400 block truncate">
                    {item.subtext}
                  </span>
                </div>

                <div className="pt-1 mt-1 border-t border-slate-800/60 flex items-baseline justify-between gap-1">
                  <span className={`text-sm sm:text-base font-black tracking-wider ${item.textColor}`}>
                    {item.value}
                  </span>
                  <span className="text-[8px] text-slate-400 text-right truncate">
                    {item.detail}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. أسفل الشاشة: المنحنى الزمني المزدوج */}
      <TransitFreightChart />

    </div>
  );
}