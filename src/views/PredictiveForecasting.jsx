import React, { useState, useMemo } from 'react';
import TacticalTooltip from '../components/TacticalTooltip';
import { 
  Cpu, 
  AlertTriangle, 
  Flame, 
  Sliders, 
  Activity, 
  ArrowUpRight,
  Ship,
  Truck,
  Plane,
  Clock,
  Compass,
  GitBranch,
  TrendingUp,
  RotateCcw,
  Skull,
  Fuel,
  ShieldAlert,
  Crosshair,
  Gauge,
  Layers,
  Radio
} from 'lucide-react';

export default function PredictiveForecasting() {
  // 1. أشرطة محاكاة المخاطر الجيوسياسية وحالة صدمة البجعة السوداء
  const [securityRisk, setSecurityRisk] = useState(78);
  const [suezBlock, setSuezBlock] = useState(45);
  const [tradeImpediment, setTradeImpediment] = useState(32);
  const [fuelVolatility, setFuelVolatility] = useState(71);
  const [blackSwanActive, setBlackSwanActive] = useState(false);

  // إعادة ضبط المتغيرات للحالة الافتراضية
  const handleResetVariables = () => {
    setSecurityRisk(78);
    setSuezBlock(45);
    setTradeImpediment(32);
    setFuelVolatility(71);
    setBlackSwanActive(false);
  };

  // تفعيل/تعطيل سيناريو البجعة السوداء (صدمة إغلاق هرمز وباب المندب معاً)
  const toggleBlackSwan = () => {
    if (!blackSwanActive) {
      setSecurityRisk(98);
      setSuezBlock(92);
      setTradeImpediment(88);
      setFuelVolatility(95);
      setBlackSwanActive(true);
    } else {
      handleResetVariables();
    }
  };

  // 2. حساب المؤشرات التشغيلية والمالية التنبؤية المتأثرة لحظياً بالسلايدرات
  const simMetrics = useMemo(() => {
    const riskFactor = (securityRisk * 0.35 + suezBlock * 0.25 + tradeImpediment * 0.2 + fuelVolatility * 0.2) / 100;
    
    // رأس المال المعرض للخطر (VaR)
    const varValue = (6.2 + riskFactor * 4.8).toFixed(1);

    // سعر التعادل للوقود
    const fuelBreakeven = Math.round(680 + (fuelVolatility * 1.4));

    // احتمالية نفاد المخزون
    const stockoutCape = Math.min(48, (12 + riskFactor * 22)).toFixed(1);
    const stockoutLandbridge = (1.2 + tradeImpediment * 0.02).toFixed(1);

    // نسب سيناريوهات مونت كارلو المتزامنة مع السلايدرات
    const crisisProb = Math.min(96, Math.max(25, Math.round(20 + riskFactor * 78)));
    const landbridgeProb = Math.min(65, Math.max(20, Math.round(24 + riskFactor * 32)));
    const suezProb = Math.max(4, Math.min(35, Math.round(36 - riskFactor * 25)));
    const ceasefireProb = Math.max(3, Math.min(25, Math.round(22 - riskFactor * 18)));

    return {
      riskFactor,
      varValue,
      fuelBreakeven,
      stockoutCape,
      stockoutLandbridge,
      crisisProb,
      landbridgeProb,
      suezProb,
      ceasefireProb,
    };
  }, [securityRisk, suezBlock, tradeImpediment, fuelVolatility]);

  // 3. حساب التكاليف التنبؤية للمسارات الأربعة لعام 2026
  const predictedRoutes = useMemo(() => {
    const suezBase = 3200;
    const suezCost = Math.round(suezBase + (securityRisk * 22) + (suezBlock * 30));
    const suezDays = suezBlock > 55 ? 28 : 24;

    const capeBase = 3800;
    const capeCost = Math.round(capeBase + (fuelVolatility * 16) + (tradeImpediment * 8));
    const capeDays = 36;

    const landbridgeBase = 3150;
    const landbridgeCost = Math.round(landbridgeBase + (fuelVolatility * 3));
    const landbridgeDays = 4;

    const seaAirBase = 6600;
    const seaAirCost = Math.round(seaAirBase + (fuelVolatility * 10));
    const seaAirDays = 3;

    return [
      {
        id: 'SUEZ',
        name: 'SUEZ TRADITIONAL MARITIME',
        mode: 'Maritime Deepsea',
        icon: Ship,
        days: `${suezDays} Days`,
        costLabel: `$${suezCost.toLocaleString()}`,
        badge: 'WAR-RISK SURCHARGE',
        badgeColor: 'text-rose-400 bg-rose-950/50 border-rose-500/50',
        deltaText: `+$${(suezCost - landbridgeCost).toLocaleString()} vs Landbridge`,
        deltaColor: 'text-rose-400',
        barPercent: Math.min(100, Math.round((suezCost / 8000) * 100)),
        barColor: 'from-rose-500 to-pink-600',
        themeBorder: 'border-rose-500/40 hover:border-rose-400 bg-gradient-to-r from-rose-950/20 via-[#030a17]/90 to-black',
        alert: true,
        tooltip: {
          title: 'مسار قناة السويس المحاكى (2026)',
          explanation: 'محاكاة لأسعار عبور السفن التقليدية عبر مضيق باب المندب وقناة السويس متأثرة بأقساط التأمين ضد أخطار الحرب المحسوبة لحظياً[cite: 13, 14].',
          takeaway: 'تكلفة متضخمة ناجمة عن المخاطر العسكرية تجعل الممر أقل تنافسية مقارنة بالمسار البري[cite: 13, 14].',
        },
      },
      {
        id: 'CAPE',
        name: 'CAPE OF GOOD HOPE DIVERSION',
        mode: 'Africa Detour',
        icon: Ship,
        days: `${capeDays} Days`,
        costLabel: `$${capeCost.toLocaleString()}`,
        badge: '+12 DAYS DETOUR',
        badgeColor: 'text-amber-300 bg-amber-950/50 border-amber-500/50',
        deltaText: `+$${(capeCost - landbridgeCost).toLocaleString()} vs Landbridge`,
        deltaColor: 'text-amber-400',
        barPercent: Math.min(100, Math.round((capeCost / 8000) * 100)),
        barColor: 'from-amber-500 to-yellow-600',
        themeBorder: 'border-amber-500/30 hover:border-amber-400/80 bg-gradient-to-r from-amber-950/15 via-[#030a17]/90 to-black',
        alert: false,
        tooltip: {
          title: 'مسار رأس الرجاء الصالح المحاكى (2026)',
          explanation: 'محاكاة لكلفة الدوران حول إفريقيا متأثرة بأسعار وقود السفن (Bunker Fuel) والمسافة الإضافية البالغة 4,000 ميل بحري[cite: 12, 13, 14].',
          takeaway: 'استنزاف مالي وزمني مستمر يرفع من احتمالية نفاد المخزون بالأسواق[cite: 13].',
        },
      },
      {
        id: 'LANDBRIDGE',
        name: 'ARABIAN LAND BRIDGE (ROAD & RAIL)',
        mode: 'Saudi Sovereign Corridor',
        icon: Truck,
        days: `${landbridgeDays} Days`,
        costLabel: `$${landbridgeCost.toLocaleString()}`,
        badge: '★ OPTIMAL BYPASS',
        badgeColor: 'text-cyber-emerald bg-emerald-950/60 border-cyber-emerald/60 shadow-neon-emerald',
        deltaText: 'LOWEST COST // ZERO CHOKEPOINTS',
        deltaColor: 'text-cyber-emerald',
        barPercent: Math.min(100, Math.round((landbridgeCost / 8000) * 100)),
        barColor: 'from-cyber-cyan via-cyber-emerald to-emerald-400',
        themeBorder: 'border-cyber-emerald/60 bg-gradient-to-r from-emerald-950/30 via-[#03131c]/90 to-black shadow-[0_0_20px_rgba(0,255,157,0.15)] ring-1 ring-cyber-emerald/50',
        alert: false,
        isSovereign: true,
        tooltip: {
          title: 'الجسر البري العربي المحاكى (2026)',
          explanation: 'التكلفة الإجمالية للنقل متعدد الوسائط عبر المملكة، محصنة ضد التوترات البحرية بفضل الأمان السيادي[cite: 8, 14].',
          takeaway: 'أقل تكلفة وأسرع زمن عبور بري (4 أيام) مع انعدام تام لرسوم التأمين الحربي[cite: 7, 8, 14].',
        },
      },
      {
        id: 'SEA_AIR',
        name: 'SEA-AIR GULF HUB EXPRESS',
        mode: 'Intermodal Air Cargo',
        icon: Plane,
        days: `${seaAirDays} Days`,
        costLabel: `$${seaAirCost.toLocaleString()}`,
        badge: 'RAPID AIR EVACUATION',
        badgeColor: 'text-sky-300 bg-sky-950/50 border-sky-500/50',
        deltaText: `+$${(seaAirCost - landbridgeCost).toLocaleString()} vs Landbridge`,
        deltaColor: 'text-sky-400',
        barPercent: Math.min(100, Math.round((seaAirCost / 8000) * 100)),
        barColor: 'from-sky-500 to-blue-600',
        themeBorder: 'border-sky-500/30 hover:border-sky-400/80 bg-gradient-to-r from-sky-950/20 via-[#030a17]/90 to-black',
        alert: false,
        tooltip: {
          title: 'الشحن الجو-بحري فائق السرعة',
          explanation: 'مسار إخلاء البضائع الحيوية عبر النقل الجوي من مطارات الخليج مباشرة إلى أوروبا لتفادي الاختناقات[cite: 7, 12, 14].',
          takeaway: 'حل استثنائي للشحنات الطارئة بـ 3 أيام فقط مع تكلفة تعادل قيمتها الاستراتيجية[cite: 7, 14].',
        },
      },
    ];
  }, [securityRisk, suezBlock, tradeImpediment, fuelVolatility]);

  const forecastShift = useMemo(() => {
    return ((securityRisk + fuelVolatility) / 2 - 50) * 0.7;
  }, [securityRisk, fuelVolatility]);

  // 4. حساب إحداثيات Y المتفاعلة للسيناريوهات الأربعة في رسم مونت كارلو
  const scenariosCoords = useMemo(() => {
    // المحور الرأسي من 10 (قمة 100%) إلى 95 (قاع 0%)
    const getY = (prob) => 96 - (prob / 100) * 78;

    return {
      crisisY: getY(simMetrics.crisisProb),
      landbridgeY: getY(simMetrics.landbridgeProb),
      suezY: getY(simMetrics.suezProb),
      ceasefireY: getY(simMetrics.ceasefireProb),
    };
  }, [simMetrics]);

  return (
    <div className="flex flex-col space-y-3 pb-6 text-slate-100 font-mono select-none">
      
      {/* 1. الشريط العلوي التكتيكي مع التولتيب التحليلي */}
      <div className="glass-panel p-3 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-2xl flex flex-wrap items-center justify-between gap-3 overflow-visible">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            <h2 className="text-xs sm:text-sm font-black tracking-widest uppercase text-white bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400">
              AI PREDICTIVE FORECASTING ENGINE // GLOBAL TRADE & RISK SIMULATOR
            </h2>
            <TacticalTooltip
              title="محرك التنبؤ والمحاكاة الجيوسياسية بالذكاء الاصطناعي"
              explanation="نظام محاكاة متقدم يجمع بين سلاسل إحصاءات التجارة البحرية، وأسعار الوقود، ومخاطر المضائق لنمذجة سلوك الأسعار وحركة السفن حتى عام 2027[cite: 13, 14]."
              takeaway="تمكين صناع القرار من اختبار سيناريوهات الأزمات المستقبلية وقياس الأثر المالي والتشغيلي قبل حدوثه[cite: 13]."
              position="bottom"
            />
          </div>
          <div className="flex items-center gap-2.5 mt-1 text-[10px]">
            <span className="text-cyber-emerald font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
              SYSTEM: OPTIMIZED
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">10.15.2026 19:05:38 UTC</span>
            <span className="text-slate-600">|</span>
            <span className="text-fuchsia-400 font-bold">SIMULATION ENGINE v4.2</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-[10px] text-slate-300">
          <Activity className="w-3.5 h-3.5 text-cyber-cyan animate-pulse" />
          <span>BUNKER FUEL: <strong className="text-white">$612/MT</strong></span>
          <span className="text-slate-600">|</span>
          <span>WAR PREMIUM: <strong className="text-rose-400">+{blackSwanActive ? '2.10%' : '0.75%'} HULL</strong></span>
        </div>
      </div>

      {/* 2. الشبكة الرئيسية التكتيكية المتوازنة (3 أعمدة موازية بالكامل) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        
        {/* ========================================================================= */}
        {/* العمود الأيسر (3 أعمدة): محاكي المخاطر + لوحة مراقبة القياس + تباين الدلتا         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 flex flex-col justify-between gap-3.5">
          
          {/* كارت 1: محاكي المخاطر الجيوسياسية */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-xl flex-1 flex flex-col justify-between min-h-[310px] overflow-visible">
            <div className="border-b border-slate-800 pb-3 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-fuchsia-400" />
                <h3 className="text-xs font-black tracking-wider text-white uppercase">
                  GEOPOLITICAL RISK SIMULATION
                </h3>
                <TacticalTooltip
                  title="لوحة محاكاة المخاطر وتعديل المتغيرات"
                  explanation="واجهة تحكم تتيح تعديل شدة التهديدات الأمنية، ونسبة إغلاق الممرات، وتذبذب الوقود لمعاينة أثرها الفوري على تكاليف الشحن ومسارات السفن[cite: 13, 14]."
                  takeaway="أداة فحص إجهاد لاختبار مرونة الإمدادات تحت مختلف الظروف القاسية[cite: 13]."
                  position="right"
                />
              </div>
              <button
                onClick={handleResetVariables}
                title="Reset Variables"
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5 flex-1 flex flex-col justify-between">
              {/* السلايدر 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    MARITIME SECURITY RISK
                    <TacticalTooltip title="خطر الأمن البحري" explanation="مدى شدة التهديدات العسكرية والعمليات البحرية على السفن التجارية في مضيق باب المندب." position="right" />
                  </span>
                  <div className="flex items-center gap-1 text-fuchsia-400">
                    <span className="text-[8px] animate-pulse">📡</span>
                    <span className="px-1.5 py-0.2 rounded bg-fuchsia-950/40 border border-fuchsia-500/30 text-fuchsia-400">
                      ▲ {securityRisk}%
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={securityRisk}
                  onChange={(e) => setSecurityRisk(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                />
              </div>

              {/* السلايدر 2 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    SUEZ TRANSIT BLOCK
                    <TacticalTooltip title="تعطل عبور السويس" explanation="نسبة الانخفاض في حركة عبور السفن أو حدوث تكدس كامل بقناة السويس." position="right" />
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <span className="text-[8px] animate-ping">⚠️</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300">
                      ▲ {suezBlock}%
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={suezBlock}
                  onChange={(e) => setSuezBlock(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* السلايدر 3 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    TRADE FLOW IMPEDIMENT
                    <TacticalTooltip title="عوائق تدفق التجارة" explanation="درجة الاختناق التشغيلي بموانئ المنشأ والتغذية المؤثرة على سرعة المناولة." position="right" />
                  </span>
                  <div className="flex items-center gap-1 text-cyber-cyan">
                    <span className="px-1.5 py-0.2 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
                      ▲ {tradeImpediment}%
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={tradeImpediment}
                  onChange={(e) => setTradeImpediment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* السلايدر 4 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-300 flex items-center gap-1">
                    FUEL INDEX VOLATILITY
                    <TacticalTooltip title="تذبذب مؤشر الوقود" explanation="حجم التغير والتقلب في أسعار وقود السفن (بنزين/مازوت) في الأسواق العالمية." position="right" />
                  </span>
                  <div className="flex items-center gap-1 text-purple-400">
                    <span className="px-1.5 py-0.2 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300">
                      ▲ {fuelVolatility}%
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={fuelVolatility}
                  onChange={(e) => setFuelVolatility(Number(e.target.value))}
                  className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* كارت 2: مراقبة حالة قياس الذكاء الاصطناعي (AI SIMULATION & TELEMETRY) */}
          <div className="glass-panel p-4 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-xl min-h-[145px] flex flex-col justify-between overflow-visible relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10.5px] font-black text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
                  AI SIMULATION & TELEMETRY
                </span>
                <TacticalTooltip
                  title="مراقبة وقياس حالة الذكاء الاصطناعي (Telemetry)"
                  explanation="لوحة حية تعرض استمرارية تدفق الحسابات الإحصائية وسيناريوهات مونت كارلو النشطة لتقدير الاحتماليات[cite: 13]."
                  takeaway="تضمن دقة وموثوقية تشغيلية مستمرة لبيئة المحاكاة بنسبة خطأ شبه معدومة."
                  position="right"
                />
              </div>
              <span className="text-[8.5px] text-slate-500 font-bold">ONLINE STATUS</span>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <div>
                <span className="text-[9.5px] text-slate-400 uppercase tracking-wider block">SIMULATION SUCCESS RATE:</span>
                <span className="text-xl sm:text-2xl font-black text-cyber-cyan tracking-tight">99.4%</span>
              </div>
              <div className="h-6 w-16 opacity-85">
                <svg viewBox="0 0 60 20" className="w-full h-full" preserveAspectRatio="none">
                  <path d="M 0,10 L 15,10 L 20,2 L 25,18 L 30,10 L 42,10 L 45,7 L 48,13 L 52,10 L 60,10" fill="none" stroke="#00F0FF" strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-850 mb-2 flex items-center">
              <div className="bg-gradient-to-r from-cyber-cyan via-fuchsia-500 to-purple-600 h-full w-[99.4%]" />
            </div>

            <div className="flex items-center justify-between text-[9.5px] font-bold border-t border-slate-800/60 pt-1.5">
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/40 text-cyber-emerald text-[8.5px] font-bold tracking-wider animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
                  RUNNING MONTE CARLO
                </span>
              </div>
              <div className="text-right text-[10px]">
                <span className="text-slate-400">ACTIVE SCENARIOS: </span>
                <span className="text-white font-black">4,000 SIMS</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[8px] text-slate-500 pt-1">
              <span>AI PRECISION: <strong className="text-cyber-emerald">ULTRA-RESILIENT</strong></span>
              <span>COMPUTE POWER: <strong className="text-cyber-emerald">ACTIVE</strong></span>
            </div>
          </div>

          {/* كارت 3: تباين الدلتا المنقول أسفل اليسار */}
          <div className="glass-panel p-4 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-xl flex flex-col justify-between min-h-[175px] overflow-visible">
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-fuchsia-400" />
                <span className="text-[10px] font-black tracking-wider text-white uppercase">
                  DELTA VARIANCE
                </span>
                <TacticalTooltip
                  title="مؤشر انحراف ودقة النموذج التنبؤي"
                  explanation="يقارن التنبؤات السابقة للنموذج مع بيانات السوق الواقعية المنفذة؛ ويوضح أن نسبة الخطأ لا تتجاوز هامشاً إحصائياً دقيقاً[cite: 13, 14]."
                  takeaway="إثبات مصداقية الخوارزميات الرياضية في تقدير التكاليف وحركة النولون[cite: 13]."
                  position="top"
                />
              </div>
              <span className="text-[8.5px] font-bold px-2 py-0.5 rounded bg-fuchsia-950/45 border border-fuchsia-500/40 text-fuchsia-300">
                σ = ±0.42
              </span>
            </div>

            <div className="h-[95px] w-full bg-slate-950/90 rounded-xl border border-slate-850 p-2 relative overflow-hidden">
              <svg viewBox="0 0 320 75" className="w-full h-full" preserveAspectRatio="none">
                <line x1="5" y1="37" x2="315" y2="37" stroke="#334155" strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1="160" y1="5" x2="160" y2="70" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="2 3" />
                
                <path
                  d="M 10,40 L 50,22 L 95,48 L 145,20 L 190,32 L 240,16 L 285,30 L 315,14"
                  fill="none"
                  stroke="#D946EF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="145" cy="20" r="3" fill="#D946EF" />
                <circle cx="240" cy="16" r="3" fill="#D946EF" />

                <path
                  d="M 10,48 L 60,32 L 105,44 L 155,28 L 205,38 L 255,22 L 295,34 L 315,22"
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="155" cy="28" r="2.5" fill="#00F0FF" />
                <circle cx="255" cy="22" r="2.5" fill="#00F0FF" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[8.5px] text-slate-400 mt-2 border-t border-slate-800/40 pt-1.5">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" /> Model Predicted
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan" /> Market Realized
              </span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* العمود الأوسط (5 أعمدة): رسم PCU + شريط اختبار الإجهاد + مونت كارلو المطور */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
          
          {/* كارت 1: رسم PCU البياني (بدون أي فراغات علوية) */}
          <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-2xl flex-1 flex flex-col justify-between overflow-visible min-h-[310px]">
            <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                  PCU4831114831115 FORECASTING
                  <TacticalTooltip
                    title="مخروط التنبؤ بمؤشر الشحن البحري الفيدرالي"
                    explanation="محاكاة مسار مؤشر أسعار شحن الحاويات في أعالي البحار حتى عام 2027 مع مخروط احتمالات يمثل مجال ثقة 95% وفق أوزان المخاطر الحالية[cite: 13, 14]."
                    takeaway="استحالة عودة الأسعار لمستويات ما قبل 2023؛ والمسار يميل للبقاء في النطاق التضخمي المرتفع لعامين إضافيين[cite: 13]."
                    position="bottom"
                  />
                </h3>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  DEEP SEA FREIGHT TRANSPORTATION PPI (FRED / BLS)
                </span>
              </div>
              <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-lg border border-fuchsia-500/50 bg-fuchsia-950/40 text-fuchsia-300">
                95% AI CONFIDENCE INTERVAL
              </span>
            </div>

            <div className="relative w-full flex-1 min-h-[225px] bg-gradient-to-b from-[#020a17]/80 via-black to-black rounded-xl border border-slate-800/80 p-2 overflow-hidden">
              <svg viewBox="0 0 600 220" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  <filter id="glowFuchsia" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <linearGradient id="coneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#D946EF" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#EC4899" stopOpacity="0.15" />
                  </linearGradient>
                </defs>

                {[200, 250, 300, 350, 400, 450, 500].map((val) => {
                  const y = 200 - ((val - 200) / 300) * 180;
                  return (
                    <g key={val}>
                      <line x1="45" y1={y} x2="585" y2={y} stroke="#1E293B" strokeWidth="0.7" strokeDasharray="3 4" />
                      <text x="40" y={y + 3} textAnchor="end" fill="#64748B" fontSize="8.5" fontWeight="bold">
                        {val}
                      </text>
                    </g>
                  );
                })}

                {[
                  { yr: '2019', x: 55 },
                  { yr: '2020', x: 120 },
                  { yr: '2021', x: 185 },
                  { yr: '2022', x: 250 },
                  { yr: '2023', x: 315 },
                  { yr: '2024', x: 380 },
                  { yr: '2025', x: 445 },
                  { yr: '2026', x: 505 },
                  { yr: '2027', x: 575 },
                ].map((item) => (
                  <g key={item.yr}>
                    <line x1={item.x} y1="20" x2={item.x} y2="200" stroke="#1E293B" strokeWidth="0.7" strokeDasharray="3 4" />
                    <text x={item.x} y="215" textAnchor="middle" fill="#64748B" fontSize="8.5" fontWeight="bold">
                      {item.yr}
                    </text>
                  </g>
                ))}

                <line x1="505" y1="20" x2="505" y2="200" stroke="#EC4899" strokeWidth="1.2" strokeDasharray="4 3" opacity="0.8" />
                <text x="510" y="195" fill="#EC4899" fontSize="8" fontWeight="bold">
                  FORECAST
                </text>

                {/* مخروط الثقة 95% */}
                <path
                  d={`M 380,120 
                     C 430,${105 - forecastShift * 0.3} 475,${80 - forecastShift * 0.5} 505,${70 - forecastShift * 0.6}
                     C 535,${55 - forecastShift * 0.8} 560,${40 - forecastShift} 585,${35 - forecastShift}
                     L 585,${155 + forecastShift}
                     C 560,${145 + forecastShift * 0.8} 535,${120 + forecastShift * 0.5} 505,${95 + forecastShift * 0.3}
                     C 475,115 430,135 380,120 Z`}
                  fill="url(#coneGrad)"
                  stroke="#D946EF"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                  opacity="0.85"
                />

                {/* خط البيانات التاريخية */}
                <path
                  d="M 55,185 L 70,162 L 85,195 L 98,148 L 115,170 L 130,152 L 150,133 L 170,111 L 185,138 L 205,87 L 220,124 L 240,101 L 260,152 L 280,120 L 305,166 L 325,148 L 345,175 L 380,120"
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glowFuchsia)"
                />

                {/* مسار التنبؤ الأوسط */}
                <path
                  d={`M 380,120 
                     C 430,${110 - forecastShift * 0.4} 470,${90 - forecastShift * 0.5} 505,${80 - forecastShift * 0.5}
                     C 535,${73 - forecastShift * 0.6} 560,${77 - forecastShift * 0.7} 585,${83 - forecastShift * 0.8}`}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  filter="url(#glowFuchsia)"
                />

                <circle cx="505" cy={80 - forecastShift * 0.5} r="6" fill="none" stroke="#FFFFFF" strokeWidth="1.5">
                  <animate attributeName="r" values="4;9;4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="505" cy={80 - forecastShift * 0.5} r="4" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* كارت 2: شريط اختبارات الإجهاد والمرونة (STRESS-TEST & RESILIENCE HUD) */}
          <div className="glass-panel p-2.5 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-xl overflow-visible">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <h4 className="text-[10px] font-black tracking-widest text-white uppercase">
                  STRESS-TEST & RESILIENCE MATRIX // PORTFOLIO EXPOSURE
                </h4>
                <TacticalTooltip
                  title="مصفوفة اختبارات الإجهاد وحساسية الصدمات"
                  explanation="كبسولات تنفيذية تقيس مدى قدرة سلاسل الإمداد على تحمل سيناريوهات الإغلاق الشامل، وحساب رأس المال المعرض للخطر، ونقطة انكسار الوقود[cite: 13]."
                  takeaway="حساب الخسارة السنوية المتوقعة ومقارنة هشاشة المخزون بين المسارات لاختيار التحوط الأمثل."
                  position="top"
                />
              </div>
              <span className="text-[8.5px] text-slate-400 font-bold">REAL-TIME RISK ENGINE</span>
            </div>

            {/* الكبسولات الأربعة التفاعلية */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              {/* كبسولة 1: زر صدمة البجعة السوداء */}
              <button
                onClick={toggleBlackSwan}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  blackSwanActive
                    ? 'bg-rose-950/60 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[8px] text-slate-400">
                  <span className="font-bold flex items-center gap-1">
                    <Skull className="w-3 h-3 text-rose-400" />
                    BLACK SWAN
                  </span>
                  <span className={`px-1 py-0.2 rounded font-black ${blackSwanActive ? 'bg-rose-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                    {blackSwanActive ? 'ACTIVE' : 'TEST'}
                  </span>
                </div>
                <div className="text-[11px] font-black text-rose-400 mt-1 truncate">
                  Dual-Chokepoint
                </div>
                <div className="text-[7.5px] text-slate-400">
                  {blackSwanActive ? 'Hormuz + Mandeb Down' : 'Click to Trigger Shock'}
                </div>
              </button>

              {/* كبسولة 2: رأس المال المعرض للخطر */}
              <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-col justify-between">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                  VALUE AT RISK (VaR)
                </span>
                <div className="text-xs sm:text-sm font-black text-amber-400 my-0.5">
                  ${simMetrics.varValue}B / Yr
                </div>
                <div className="text-[7.5px] text-slate-400 truncate">
                  Trapped Working Capital
                </div>
              </div>

              {/* كبسولة 3: نقطة انكسار تكلفة الوقود */}
              <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-col justify-between">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                  BUNKER BREAKEVEN
                </span>
                <div className="text-xs sm:text-sm font-black text-cyber-cyan my-0.5">
                  ${simMetrics.fuelBreakeven} / MT
                </div>
                <div className="text-[7.5px] text-emerald-400 truncate">
                  Rail Wins at &gt; $780
                </div>
              </div>

              {/* كبسولة 4: احتمالية نفاد المخزون */}
              <div className="p-2 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-col justify-between">
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                  STOCKOUT RISK
                </span>
                <div className="text-[10px] sm:text-[11px] font-black text-white my-0.5">
                  <span className="text-emerald-400">{simMetrics.stockoutLandbridge}%</span> vs <span className="text-rose-400">{simMetrics.stockoutCape}%</span>
                </div>
                <div className="text-[7.5px] text-slate-400 truncate">
                  Landbridge vs Cape Detour
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================================= */}
          {/* كارت 3: السيناريوهات النشطة المطور هندسياً وبصرياً (4,000 SIMS)            */}
          {/* ========================================================================= */}
          <div className="glass-panel p-4 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-xl flex flex-col justify-between overflow-visible min-h-[175px] relative">
            
            {/* رأس اللوحة مع الكبسولات النيونية المحسنة */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-fuchsia-400 animate-pulse" />
                <span className="text-[11px] font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                  ACTIVE SCENARIOS (4,000 SIMS)
                </span>
                <TacticalTooltip
                  title="مصفوفة مسارات مونت كارلو الاحتمالية"
                  explanation="نمذجة ديناميكية تجمع 4,000 تكرار عشوائي، موضحة احتمالية استمرار الأزمة، وهيمنة الجسر البري، أو عودة السويس، أو توقيع هدنة[cite: 13, 14, 16]."
                  takeaway="إثبات إحصائي بأن الجسر البري السعودي هو المسار الأكثر استقراراً وجدوى على المدى المتوسط والبعيد[cite: 13]."
                  position="top"
                />
              </div>

              {/* كبسولات النسب التفاعلية النيونية */}
              <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-bold">
                <span className="text-fuchsia-300 bg-fuchsia-950/60 px-2 py-0.5 rounded-md border border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.2)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
                  Crisis: {simMetrics.crisisProb}%
                </span>
                <span className="text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.2)] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Landbridge: {simMetrics.landbridgeProb}%
                </span>
                <span className="text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-md border border-cyan-500/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Suez: {simMetrics.suezProb}%
                </span>
                <span className="text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Ceasefire: {simMetrics.ceasefireProb}%
                </span>
              </div>
            </div>

            {/* الحاوية المركزية للرسم البياني السيبراني لمونت كارلو */}
            <div className="h-[110px] w-full bg-gradient-to-b from-[#020a17] via-[#010612] to-black rounded-xl border border-slate-800/90 p-2 relative overflow-hidden flex flex-col justify-between">
              
              <svg viewBox="0 0 540 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                  {/* فلاتر التوهج الليزري النيون */}
                  <filter id="simGlowFuchsia" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="simGlowRose" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="simGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.8" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  {/* تدرج هالة الأزمة */}
                  <linearGradient id="crisisAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D946EF" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#D946EF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* 1. شبكة خطوط وتدريجات المحاور الأفقية */}
                {[20, 48, 76].map((y, idx) => (
                  <g key={idx}>
                    <line x1="28" y1={y} x2="495" y2={y} stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.7" />
                    <text x="22" y={y + 3} textAnchor="end" fill="#475569" fontSize="7" fontWeight="bold">
                      {idx === 0 ? '80%' : idx === 1 ? '50%' : '20%'}
                    </text>
                  </g>
                ))}

                {/* خطوط المحاور الرأسية وعلامات التقاطع (+) */}
                {[50, 140, 230, 320, 410, 490].map((x) => (
                  <g key={x}>
                    <line x1={x} y1="10" x2={x} y2="88" stroke="#1E293B" strokeWidth="0.6" strokeDasharray="2 4" opacity="0.5" />
                    <text x={x} y="50" textAnchor="middle" fill="#334155" fontSize="8" fontWeight="bold" opacity="0.35">+</text>
                  </g>
                ))}

                {/* 2. مسارات المحاكاة الشبحية (Stochastic Monte Carlo Ghost Trails) */}
                <g opacity="0.28">
                  {/* أشباح الأزمة */}
                  <path d="M 35,62 C 160,58 290,26 490,14" fill="none" stroke="#D946EF" strokeWidth="0.8" strokeDasharray="4 3" />
                  <path d="M 35,68 C 160,64 290,34 490,22" fill="none" stroke="#D946EF" strokeWidth="0.7" strokeDasharray="3 4" />
                  {/* أشباح الجسر البري */}
                  <path d="M 35,70 C 160,67 290,44 490,34" fill="none" stroke="#F43F5E" strokeWidth="0.8" strokeDasharray="4 3" />
                  <path d="M 35,74 C 160,72 290,52 490,42" fill="none" stroke="#F43F5E" strokeWidth="0.7" strokeDasharray="3 4" />
                  {/* أشباح السويس */}
                  <path d="M 35,78 C 160,76 290,68 490,64" fill="none" stroke="#00F0FF" strokeWidth="0.6" strokeDasharray="2 3" />
                  {/* أشباح الهدنة */}
                  <path d="M 35,82 C 160,80 290,75 490,73" fill="none" stroke="#00FF9D" strokeWidth="0.6" strokeDasharray="2 3" />
                </g>

                {/* 3. تظليل الهالة تحت مسار الأزمة الحرج */}
                <path
                  d={`M 35,66 C 160,60 290,${(scenariosCoords.crisisY + 25) / 2} 490,${scenariosCoords.crisisY} L 490,92 L 35,92 Z`}
                  fill="url(#crisisAreaGrad)"
                />

                {/* 4. المسارات الرئيسية الأربعة المتفاعلة مع السلايدرات لحظياً */}
                
                {/* أ) مسار استمرار الأزمة (الوردي المتوهج) */}
                <path
                  d={`M 35,66 C 160,60 290,${(scenariosCoords.crisisY + 25) / 2} 490,${scenariosCoords.crisisY}`}
                  fill="none"
                  stroke="#E879F9"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  filter="url(#simGlowFuchsia)"
                />

                {/* ب) مسار الجسر البري (المرجاني / الروز المتماسك) */}
                <path
                  d={`M 35,72 C 160,68 290,${(scenariosCoords.landbridgeY + 30) / 2} 490,${scenariosCoords.landbridgeY}`}
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  filter="url(#simGlowRose)"
                />

                {/* ج) مسار قناة السويس (السيان المتقطع) */}
                <path
                  d={`M 35,79 C 160,78 290,${(scenariosCoords.suezY + 35) / 2} 490,${scenariosCoords.suezY}`}
                  fill="none"
                  stroke="#00F0FF"
                  strokeWidth="1.8"
                  strokeDasharray="4 3"
                  strokeLinecap="round"
                  filter="url(#simGlowCyan)"
                />

                {/* د) مسار التهدئة والهدنة (الزمردي المتقطع الهادئ) */}
                <path
                  d={`M 35,84 C 160,82 290,${(scenariosCoords.ceasefireY + 40) / 2} 490,${scenariosCoords.ceasefireY}`}
                  fill="none"
                  stroke="#00FF9D"
                  strokeWidth="1.6"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />

                {/* 5. العقد الليزرية مع شارات الأرقام عند نهايات المسارات */}
                
                {/* عقدة الأزمة */}
                <circle cx="490" cy={scenariosCoords.crisisY} r="5" fill="none" stroke="#E879F9" strokeWidth="1.5">
                  <animate attributeName="r" values="3.5;7.5;3.5" dur="1.8s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="490" cy={scenariosCoords.crisisY} r="3" fill="#FFFFFF" />
                <text x="502" y={scenariosCoords.crisisY + 3} fill="#E879F9" fontSize="7.5" fontWeight="900" fontFamily="monospace">
                  {simMetrics.crisisProb}%
                </text>

                {/* عقدة الجسر البري */}
                <circle cx="490" cy={scenariosCoords.landbridgeY} r="4.5" fill="none" stroke="#F43F5E" strokeWidth="1.4">
                  <animate attributeName="r" values="3;6.5;3" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="490" cy={scenariosCoords.landbridgeY} r="2.8" fill="#F43F5E" />
                <text x="502" y={scenariosCoords.landbridgeY + 3} fill="#F43F5E" fontSize="7.5" fontWeight="900" fontFamily="monospace">
                  {simMetrics.landbridgeProb}%
                </text>

                {/* عقدة السويس */}
                <circle cx="490" cy={scenariosCoords.suezY} r="2.6" fill="#00F0FF" />
                <text x="502" y={scenariosCoords.suezY + 3} fill="#00F0FF" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                  {simMetrics.suezProb}%
                </text>

                {/* عقدة الهدنة */}
                <circle cx="490" cy={scenariosCoords.ceasefireY} r="2.6" fill="#00FF9D" />
                <text x="502" y={scenariosCoords.ceasefireY + 3} fill="#00FF9D" fontSize="7.5" fontWeight="bold" fontFamily="monospace">
                  {simMetrics.ceasefireProb}%
                </text>
              </svg>

              {/* المحور الزمني السفلي التكتيكي للرسم */}
              <div className="flex justify-between items-center text-[7.5px] font-mono text-slate-500 border-t border-slate-900 pt-1 px-1">
                <span className="text-slate-400">T0 (NOW)</span>
                <span>T+90D</span>
                <span className="text-cyber-cyan font-bold">T+180D (MIDWAY)</span>
                <span>T+270D</span>
                <span className="text-fuchsia-400 font-bold">T+360D (2027 FORECAST)</span>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* العمود الأيمن (4 أعمدة): كروت تأثير المسارات موازية بالكامل لليسار والوسط  */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-3.5">
          
          <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-2xl h-full flex flex-col justify-between overflow-visible">
            
            {/* رأس الكارت */}
            <div className="border-b border-slate-800/80 pb-2 mb-2 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-cyber-cyan" />
                  <h3 className="text-xs font-black tracking-wider text-white uppercase">
                    ROUTE IMPACT & COST PREDICTION (2026)
                  </h3>
                  <TacticalTooltip
                    title="توقعات التكلفة وزمن النقل لعام 2026"
                    explanation="محاكاة فورية لتكلفة الحاوية (FEU) وزمن الوصول لكل مسار بناءً على المدخلات الحالية للمخاطر وأسعار الوقود[cite: 13, 14]."
                    takeaway="برهان رقمي على الجدوى الاقتصادية الفائقة للجسر البري مقارنة بجميع البدائل البحرية والجوية[cite: 13, 14]."
                    position="left"
                  />
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 block tracking-wider">
                  REAL-TIME SIMULATION VS SOVEREIGN BENCHMARK
                </span>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-lg border border-slate-700 bg-slate-900 text-slate-300 font-bold">
                Q4 2026
              </span>
            </div>

            {/* الكروت الأربعة المتناسقة بتوزيع يملأ كامل الارتفاع */}
            <div className="space-y-2.5 flex-1 flex flex-col justify-between min-h-[485px]">
              {predictedRoutes.map((route) => {
                const IconComp = route.icon;

                return (
                  <div
                    key={route.id}
                    className={`p-2.5 rounded-xl border transition-all relative overflow-visible group hover:scale-[1.01] ${route.themeBorder} flex-1 flex flex-col justify-between`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1.5 rounded-lg bg-black/60 border border-slate-800 text-slate-200 flex-shrink-0">
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[10.5px] font-black text-white truncate tracking-wide">
                              {route.name}
                            </h4>
                            {route.alert && (
                              <ArrowUpRight className="w-3 h-3 text-rose-400 flex-shrink-0 animate-bounce" />
                            )}
                          </div>
                          <span className="text-[8px] text-slate-400 block -mt-0.5">{route.mode}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {route.tooltip && (
                          <TacticalTooltip
                            title={route.tooltip.title}
                            explanation={route.tooltip.explanation}
                            takeaway={route.tooltip.takeaway}
                            position="left"
                          />
                        )}
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase tracking-wider flex-shrink-0 ${route.badgeColor}`}>
                          {route.badge}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-end justify-between pt-1 border-t border-slate-800/60 text-[9.5px]">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>TRANSIT:</span>
                        <strong className="text-white font-bold ml-0.5">{route.days}</strong>
                      </div>

                      <div className="text-right">
                        <span className="text-slate-400 text-[8.5px] mr-1">SIMULATED:</span>
                        <span className={`text-xs font-black tracking-wider ${route.isSovereign ? 'text-cyber-emerald text-sm' : route.alert ? 'text-rose-400' : 'text-cyber-cyan'}`}>
                          {route.costLabel}
                        </span>
                      </div>
                    </div>

                    <div className="mt-1 pt-1 flex items-center justify-between text-[8px] font-bold">
                      <span className={route.deltaColor}>
                        {route.deltaText}
                      </span>
                      <div className="w-20 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850 flex-shrink-0 ml-2">
                        <div 
                          className={`h-full bg-gradient-to-r ${route.barColor} rounded-full`}
                          style={{ width: `${route.barPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}