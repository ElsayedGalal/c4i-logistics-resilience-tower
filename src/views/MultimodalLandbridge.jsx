import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';

// استيراد المكونات التكتيكية الأربعة
import RouteComparisonCards from '../components/RouteComparisonCards';
import ArabianLandbridgeMap from '../components/ArabianLandbridgeMap';
import MultimodalMatrixChart from '../components/MultimodalMatrixChart';
import TradePriceTrendChart from '../components/TradePriceTrendChart';
import TacticalTooltip from '../components/TacticalTooltip';

// أيقونات تكتيكية
import { 
  Boxes, 
  Pill, 
  Cpu, 
  Car, 
  Apple, 
  Fuel, 
  Layers, 
  ShieldCheck, 
  Ship, 
  Train, 
  Truck, 
  Zap, 
  GitFork,
  Radio,
  Activity
} from 'lucide-react';

export default function MultimodalLandbridge() {
  const { endDate, computedMetrics } = useData();

  // --------------------------------------------------------------------------
  // محرك المحاكاة القياسي المرتبط بالفلتر الزمني لحظة بلحظة (Time-Driven Simulation)
  // --------------------------------------------------------------------------
  const timelineMetrics = useMemo(() => {
    const rawDate = endDate || '2026-10-04';
    const d = new Date(rawDate);
    const yr = isNaN(d.getFullYear()) ? 2026 : d.getFullYear();
    const mo = isNaN(d.getMonth()) ? 9 : d.getMonth(); // 0 - 11
    const timeVal = yr + mo / 12; // تمثيل زمني دقيق بالكسور

    const isCrisisEra = timeVal >= (2023 + 10.5 / 12); // بعد 20 نوفمبر 2023

    let baseFreight = 4850;
    let warPremium = 0;
    let capeDetourPenalty = 0;
    let capacityTEU = 18500;

    // محاكاة تقلبات أسعار الشحن وسلاسل الإمداد العالمية تاريخياً
    if (timeVal < 2021) {
      baseFreight = Math.round(1500 + (timeVal - 2020) * 800);
      capacityTEU = Math.round(9000 + (timeVal - 2020) * 1500);
    } else if (timeVal < 2022) {
      baseFreight = Math.round(2300 + (timeVal - 2021) * 5500); // طفرة كورونا 2021
      capacityTEU = Math.round(10500 + (timeVal - 2021) * 2000);
    } else if (timeVal < 2023) {
      baseFreight = Math.round(7800 - (timeVal - 2022) * 4600); // تهدئة 2022
      capacityTEU = Math.round(12500 + (timeVal - 2022) * 1500);
    } else if (timeVal < 2023.88) {
      baseFreight = Math.round(1600 - (timeVal - 2023) * 200); // استقرار 2023
      capacityTEU = 14000;
    } else if (timeVal < 2024.6) {
      // ذروة اندلاع أزمة البحر الأحمر وباب المندب
      const prog = (timeVal - 2023.88) / 0.72;
      baseFreight = Math.round(1800 + prog * 5600); // تصل إلى 7400$
      warPremium = Math.round(850 + prog * 1350);  // تصل إلى 2200$
      capeDetourPenalty = Math.round(900 + prog * 1100);
      capacityTEU = Math.round(14500 + prog * 2000);
    } else if (timeVal < 2025.0) {
      const prog = (timeVal - 2024.6) / 0.4;
      baseFreight = Math.round(7400 - prog * 2200);
      warPremium = Math.round(2200 - prog * 400);
      capeDetourPenalty = 1750;
      capacityTEU = Math.round(16500 + prog * 700);
    } else if (timeVal < 2026.0) {
      const prog = (timeVal - 2025.0);
      baseFreight = Math.round(5200 - prog * 600);
      warPremium = Math.round(1800 - prog * 250);
      capeDetourPenalty = 1550;
      capacityTEU = Math.round(17200 + prog * 1000);
    } else {
      const prog = Math.min(1, (timeVal - 2026.0) / 0.85);
      baseFreight = Math.round(4600 - prog * 350);
      warPremium = Math.round(1550 - prog * 150);
      capeDetourPenalty = 1470;
      capacityTEU = Math.round(18200 + prog * 300);
    }

    // حساب التكاليف المتزامنة
    const oceanFeederCost = Math.round(baseFreight * 0.38);
    const railCost = isCrisisEra ? 650 : 520;
    const truckCost = isCrisisEra ? 850 : 710;
    const medFeederCost = Math.round(baseFreight * 0.22) + (isCrisisEra ? 320 : 120);

    const landbridgeTotal = oceanFeederCost + railCost + truckCost + medFeederCost;
    const capeTotalCost = isCrisisEra ? Math.round(baseFreight * 1.05 + capeDetourPenalty) : Math.round(baseFreight * 1.08);
    const savingsVsCape = Math.max(300, capeTotalCost - landbridgeTotal);

    return {
      isCrisisEra,
      rawDate,
      capacityTEU: capacityTEU.toLocaleString(),
      oceanFeederCost,
      railCost,
      truckCost,
      medFeederCost,
      landbridgeTotal,
      capeTotalCost,
      savingsVsCape,
      warPremium,
    };
  }, [endDate]);

  // حالة المسار المحدد
  const [selectedRoute, setSelectedRoute] = useState('LANDBRIDGE');
  
  // حالة نوع الشحنة
  const [cargoProfile, setCargoProfile] = useState('PHARMA');

  // حالة مرحلة خط الأنابيب المختارة
  const [activeStage, setActiveStage] = useState('STAGE_01');

  // ملفات الشحن الحساسة
  const CARGO_PROFILES = [
    { id: 'PHARMA', label: 'Pharmaceuticals', icon: Pill },
    { id: 'TECH', label: 'High-Value Tech', icon: Cpu },
    { id: 'AUTO', label: 'Automotive / EV', icon: Car },
    { id: 'PERISHABLE', label: 'Cold-Chain', icon: Apple },
    { id: 'OIL', label: 'Energy', icon: Fuel },
    { id: 'BULK', label: 'Bulk', icon: Layers },
  ];

  // محرك التوصيات الاستراتيجي الديناميكي
  const recommendation = useMemo(() => {
    switch (cargoProfile) {
      case 'PHARMA':
      case 'TECH':
        return {
          route: 'ARABIAN LAND BRIDGE (ROAD & RAIL)',
          routeId: 'LANDBRIDGE',
          badge: 'OPTIMAL BYPASS // ZERO CHOKEPOINT',
          color: 'text-cyber-emerald border-cyber-emerald/40 bg-emerald-950/30',
        };
      case 'AUTO':
        return {
          route: 'ARABIAN LAND BRIDGE (RAIL CORRIDOR)',
          routeId: 'LANDBRIDGE',
          badge: 'JIT SUPPLY CHAIN SECURE',
          color: 'text-cyber-emerald border-cyber-emerald/40 bg-emerald-950/30',
        };
      case 'PERISHABLE':
        return {
          route: timelineMetrics.isCrisisEra ? 'SEA-AIR GULF EXPRESS' : 'ARABIAN LAND BRIDGE',
          routeId: timelineMetrics.isCrisisEra ? 'SEA_AIR' : 'LANDBRIDGE',
          badge: timelineMetrics.isCrisisEra ? 'EXPEDITED AIR EVACUATION' : 'COLD CHAIN REEFER BYPASS',
          color: timelineMetrics.isCrisisEra ? 'text-blue-400 border-blue-500/40 bg-blue-950/30' : 'text-cyber-emerald border-cyber-emerald/40 bg-emerald-950/30',
        };
      default:
        return {
          route: timelineMetrics.isCrisisEra ? 'CAPE OF GOOD HOPE DIVERSION' : 'SUEZ TRADITIONAL MARITIME',
          routeId: timelineMetrics.isCrisisEra ? 'CAPE' : 'SUEZ',
          badge: timelineMetrics.isCrisisEra ? 'LOW VALUE-DENSITY DETOUR' : 'STANDARD PASSAGE',
          color: timelineMetrics.isCrisisEra ? 'text-amber-400 border-amber-500/40 bg-amber-950/30' : 'text-cyber-cyan border-cyber-cyan/40 bg-cyan-950/30',
        };
    }
  }, [cargoProfile, timelineMetrics.isCrisisEra]);

  // بيانات المراحل الأربعة المتغيرة بالكامل مع كل حركة في السلايدر
  const PIPELINE_STAGES = useMemo(() => [
    {
      id: 'STAGE_01',
      stageNum: 'STAGE 01',
      title: 'Ocean Feeder Leg',
      days: 'Day 1 - 10',
      mode: 'DEEPSEA',
      icon: Ship,
      path: '(East Asia / Singapore → Arabian Gulf Hubs)',
      hub: 'Hub: King Abdulaziz Port (Dammam) / Jebel Ali Port',
      desc: timelineMetrics.isCrisisEra
        ? 'Vessels divert through Strait of Hormuz directly into safe Arabian Gulf deepwater terminals, entirely evading the Bab el-Mandeb threat envelope.'
        : 'Regular liner feeder services calling directly at Arabian Gulf terminals under nominal peacetime shipping operations.',
      distance: '3,800 NM',
      timeWindow: '10 Days Direct',
      risk: timelineMetrics.isCrisisEra ? 'Low (0% Threat)' : 'Nominal (0% Threat)',
      warSurcharge: timelineMetrics.isCrisisEra ? `$0.00 (Saved $${timelineMetrics.warPremium.toLocaleString()})` : '$0.00 (No Crisis)',
      capacity: '12,500 TEU',
      costPerFeu: `$${timelineMetrics.oceanFeederCost.toLocaleString()}`,
    },
    {
      id: 'STAGE_02',
      stageNum: 'STAGE 02',
      title: 'Saudi Overland Rail',
      days: 'Day 11 - 12',
      mode: 'SAR RAIL',
      icon: Train,
      path: '(King Abdulaziz Port Dammam → Riyadh Dry Port Hub)',
      hub: 'Hub: SAR East-West Railway / Riyadh Logistics Park',
      desc: 'Double-stack container freight rail and bonded priority highway fleets transit through central Saudi dry ports in under 48 hours.',
      distance: '450 KM',
      timeWindow: '48 Hours',
      risk: 'Zero War-Risk',
      warSurcharge: '$0.00 (Immune)',
      capacity: '2,400 TEU',
      costPerFeu: `$${timelineMetrics.railCost.toLocaleString()}`,
    },
    {
      id: 'STAGE_03',
      stageNum: 'STAGE 03',
      title: 'West Coast Bridge',
      days: 'Day 13 - 14',
      mode: 'ROAD / RAIL',
      icon: Truck,
      path: '(Riyadh Logistics Hub → Jeddah Port / King Abdullah Port)',
      hub: 'Hub: Jeddah Islamic Port / KAEC Gateway',
      desc: 'Overland transit delivers bonded containers directly to western maritime quays, completely bypassing southern Red Sea chokepoints.',
      distance: '950 KM',
      timeWindow: '24-36 Hours',
      risk: 'Zero War-Risk',
      warSurcharge: '$0.00 (Immune)',
      capacity: '3,100 TEU',
      costPerFeu: `$${timelineMetrics.truckCost.toLocaleString()}`,
    },
    {
      id: 'STAGE_04',
      stageNum: 'STAGE 04',
      title: 'Final Maritime Leg',
      days: 'Day 15 - 17',
      mode: 'FEEDER',
      icon: Ship,
      path: '(Jeddah Port → Suez Canal → European Gateways)',
      hub: 'Hub: Port Said / Rotterdam / Hamburg',
      desc: timelineMetrics.isCrisisEra
        ? 'Direct maritime feeder route sailing north through safe upper Red Sea waters directly into the Suez Canal and onward to Europe.'
        : 'Connecting feeder sailings through northern Red Sea to Mediterranean distribution centers.',
      distance: '2,200 NM',
      timeWindow: '3 Days Sailing',
      risk: 'Minimal (North)',
      warSurcharge: timelineMetrics.isCrisisEra ? '$0.00 (Upper Sea)' : '$0.00 (Peacetime)',
      capacity: '9,000 TEU',
      costPerFeu: `$${timelineMetrics.medFeederCost.toLocaleString()}`,
    },
  ], [timelineMetrics]);

  const currentStageData = PIPELINE_STAGES.find((s) => s.id === activeStage) || PIPELINE_STAGES[0];

  return (
    <div className="flex flex-col space-y-4 pb-8 text-slate-100 font-mono select-none">
      
      {/* 1. شريط اختيار نوع الشحنة والموصي الذكي */}
      <div className="glass-panel p-2.5 rounded-xl border border-cyber-border/80 bg-[#020713]/90 shadow-xl flex flex-wrap items-center justify-between gap-2 overflow-visible">
        <div className="flex items-center gap-2">
          <Boxes className="w-4 h-4 text-cyber-emerald animate-pulse" />
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black tracking-wider uppercase text-white">
              SELECT CARGO PROFILE:
            </span>
            <TacticalTooltip
              title="محدد حساسية الشحنات ونوع البضاعة"
              explanation="محرك محاكاة يحدد الجدوى التشغيلية والاقتصادية للمسار البديل وفقاً لطبيعة السلعة (أدوية، رقائق تقنية، سيارات، أغذية مبردة، طاقة، بضائع صب)."
              takeaway="الشحنات الحساسة للوقت وقيمة رأس المال العالق تستفيد بأعلى عائد من سرعة الجسر البري."
              position="bottom"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5 ml-2">
            {CARGO_PROFILES.map((profile) => {
              const IconComp = profile.icon;
              const isSelected = cargoProfile === profile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => {
                    setCargoProfile(profile.id);
                    setSelectedRoute(recommendation.routeId);
                  }}
                  className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-cyber-emerald bg-cyber-emerald/15 text-white shadow-neon-emerald'
                      : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <IconComp className="w-3 h-3" />
                  <span>{profile.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={`px-2.5 py-1 rounded-lg border text-[10.5px] font-bold flex items-center gap-2 ${recommendation.color}`}>
          <Zap className="w-3.5 h-3.5 animate-bounce" />
          <span>{recommendation.route}</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. الصف العلوي: الكروت الأربعة بعرض الشاشة                                 */}
      {/* ========================================================================= */}
      <div className="w-full">
        <RouteComparisonCards
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />
      </div>

      {/* ========================================================================= */}
      {/* 3. الصف الأوسط: [الخريطة (يسار)] + [مكون خط الأنابيب المتفاعل (يمين)]      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        
        {/* الخريطة الفضائية الواقعية (يسار) */}
        <div className="h-[555px] flex flex-col">
          <ArabianLandbridgeMap
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
          />
        </div>

        {/* مكون خط الأنابيب المتفاعل لحظياً مع السلايدر الزمني (يمين) */}
        <div className="h-[555px] glass-panel p-4 rounded-2xl border border-cyber-border/80 bg-[#020713]/95 shadow-2xl flex flex-col justify-between overflow-visible">
          
          {/* رأس المكون */}
          <div className="border-b border-slate-800 pb-2 space-y-1.5 flex-shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <GitFork className="w-4 h-4 text-cyber-emerald flex-shrink-0" />
                <h3 className="text-xs sm:text-sm font-black tracking-wider text-white uppercase truncate">
                  ARABIAN LAND BRIDGE PIPELINE // BAB EL-MANDEB BYPASS
                </h3>
                <TacticalTooltip
                  title="خط أنابيب الجسر البري العربي متعدد الوسائط"
                  explanation="منظومة لوجستية متكاملة تربط موانئ الخليج العربي (الدمام / جبل علي) بموانئ البحر الأحمر (جدة / الملك عبد الله) عبر شبكة السكك الحديدية والشاحنات."
                  takeaway="مسار استراتيجي سيادي يتجاوز نقاط الاختناق البحرية ويضمن استمرارية تدفق التجارة الدولية بين الشرق والغرب."
                  position="bottom"
                />
                <span className="text-[9.5px] font-bold text-cyber-cyan bg-slate-900 px-2 py-0.5 rounded border border-slate-800 flex-shrink-0">
                  {timelineMetrics.rawDate}
                </span>
              </div>

              {/* بادج الحالة المتفاعل زمنياً */}
              <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap transition-all ${
                timelineMetrics.isCrisisEra 
                  ? 'border-cyber-emerald/50 bg-cyber-emerald/10 text-cyber-emerald shadow-neon-emerald' 
                  : 'border-cyber-cyan/50 bg-cyan-950/40 text-cyber-cyan shadow-[0_0_12px_rgba(0,240,255,0.2)]'
              }`}>
                <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
                <span>{timelineMetrics.isCrisisEra ? 'ACTIVE EMERGENCY BYPASS' : 'STRATEGIC TRADE CORRIDOR'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
              <span className="truncate font-sans">
                Intermodal East-West rail and truck corridor connecting Arabian Gulf to Red Sea
              </span>
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className="flex items-center gap-1 text-slate-300">
                  <Activity className="w-3 h-3 text-cyber-cyan" />
                  {timelineMetrics.capacityTEU} TEU/wk
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-cyber-emerald font-bold">
                  <Radio className="w-3 h-3 animate-pulse" />
                  {timelineMetrics.isCrisisEra ? '100% SECURE' : '100% NOMINAL'}
                </span>
              </div>
            </div>
          </div>

          {/* كروت المراحل الأربعة */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-1.5 flex-shrink-0">
            {PIPELINE_STAGES.map((stg) => {
              const IconComp = stg.icon;
              const isActive = activeStage === stg.id;

              return (
                <div
                  key={stg.id}
                  onClick={() => setActiveStage(stg.id)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer relative ${
                    isActive
                      ? 'border-cyber-cyan bg-cyan-950/30 shadow-[0_0_15px_rgba(0,240,255,0.25)] ring-1 ring-cyber-cyan'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[8.5px] font-black px-1.5 py-0.2 rounded ${isActive ? 'bg-cyber-cyan text-black' : 'bg-slate-800 text-slate-400'}`}>
                      {stg.stageNum}
                    </span>
                    <IconComp className={`w-3.5 h-3.5 ${isActive ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                  </div>
                  <h5 className="text-[10.5px] font-bold text-white truncate mb-0.5">{stg.title}</h5>
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-cyber-emerald font-bold whitespace-nowrap">{stg.days}</span>
                    <span className="text-slate-500 text-[8px] font-bold">{stg.mode}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* صندوق تفاصيل القطاع المختار */}
          <div className="p-3 rounded-xl border border-slate-800 bg-[#030d1c]/95 space-y-2 flex-shrink-0">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-1.5">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8.5px] font-black text-cyber-cyan tracking-wider uppercase">
                    SELECTED OPERATION SEGMENT
                  </span>
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyber-emerald/10 border border-cyber-emerald/30 text-cyber-emerald font-bold">
                    SMART-SEAL RFID
                  </span>
                </div>
                <h4 className="text-xs font-black text-white mt-0.5 truncate">{currentStageData.title}</h4>
                <span className="text-[9.5px] text-slate-400 block truncate">{currentStageData.path}</span>
              </div>
              
              <span className="text-[9.5px] font-bold text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-700 flex-shrink-0 truncate">
                {currentStageData.hub}
              </span>
            </div>

            <p className="text-[10px] text-slate-300 leading-relaxed font-sans line-clamp-2">
              {currentStageData.desc}
            </p>

            {/* المقاييس الستة للمرحلة */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1 font-mono text-center">
              <div className="p-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[7.5px] text-slate-400 uppercase block">DISTANCE</span>
                <span className="text-[11px] font-black text-cyber-cyan">{currentStageData.distance}</span>
              </div>

              <div className="p-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[7.5px] text-slate-400 uppercase block">TIME WINDOW</span>
                <span className="text-[11px] font-black text-white">{currentStageData.timeWindow}</span>
              </div>

              <div className="p-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[7.5px] text-slate-400 uppercase block">SECURITY</span>
                <span className="text-[11px] font-black text-cyber-emerald">{currentStageData.risk}</span>
              </div>

              <div className="p-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[7.5px] text-slate-400 uppercase block">WAR SURCHARGE</span>
                <span className="text-[11px] font-black text-cyber-emerald">{currentStageData.warSurcharge}</span>
              </div>

              <div className="p-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[7.5px] text-slate-400 uppercase block">CAPACITY</span>
                <span className="text-[11px] font-black text-white">{currentStageData.capacity}</span>
              </div>

              <div className="p-1 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[7.5px] text-slate-400 uppercase block">COST/FEU</span>
                <span className="text-[11px] font-black text-cyber-cyan">{currentStageData.costPerFeu}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* مصفوفة الكفاءة التشغيلية والبيئية المتكاملة للجسر البري (شبكة مكبرة 2×3)  */}
          {/* ========================================================================= */}
          <div className="flex-1 flex flex-col justify-between pt-2.5 mt-2 border-t border-slate-800/80 min-h-[195px]">
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              {/* كارت 1: سرعة العبور الإجمالية */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-slate-800/90 bg-gradient-to-b from-[#030d1d] to-[#010611] hover:border-cyber-cyan/50 transition-all shadow-lg flex flex-col justify-between relative overflow-visible group">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                    TRANSIT SPEED
                  </span>
                  <TacticalTooltip
                    title="زمن العبور الكلي (النقل متعدد الوسائط)"
                    explanation="إجمالي مدة نقل الحاوية من موانئ شرق آسيا إلى أوروبا عبر الجسر البري السعودي (10 أيام بحري للخليج + 4 أيام قطار وشاحنات عبر المملكة + 3 أيام بحري للمتوسط)."
                    takeaway="اختصار 19 يوماً كاملاً مقارنة بمسار الالتفاف الإجباري حول إفريقيا (36 يوماً)."
                    position="top"
                  />
                </div>
                <div className="text-base sm:text-lg font-black text-cyber-cyan my-1">
                  17 Days Total
                </div>
                <div className="text-[9px] text-cyber-emerald font-bold">
                  4d Land + 13d Feeder <span className="text-slate-500 font-normal">(-19d vs Cape)</span>
                </div>
              </div>

              {/* كارت 2: التكلفة الشاملة للحاوية */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-slate-800/90 bg-gradient-to-b from-[#030d1d] to-[#010611] hover:border-cyber-emerald/50 transition-all shadow-lg flex flex-col justify-between relative overflow-visible group">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                    ALL-IN COST / FEU
                  </span>
                  <TacticalTooltip
                    title="التكلفة الشاملة للحاوية (All-in Cost)"
                    explanation="التكلفة الفعلية الشاملة لجميع مراحل النقل (سفن التغذية البحرية، قطارات SAR، تفريغ الحاويات، والشحن إلى موانئ الوصول الأوروبية)."
                    takeaway="وفر مالي مباشر يتجاوز 1,500 دولار لكل حاوية مقارنة بمسار رأس الرجاء الصالح."
                    position="top"
                  />
                </div>
                <div className="text-base sm:text-lg font-black text-white my-1">
                  ${timelineMetrics.landbridgeTotal.toLocaleString()}
                </div>
                <div className="text-[9px] text-cyber-emerald font-bold truncate">
                  -${timelineMetrics.savingsVsCape.toLocaleString()} vs Cape Detour
                </div>
              </div>

              {/* كارت 3: إلغاء رسوم مخاطر الحرب */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-slate-800/90 bg-gradient-to-b from-[#030d1d] to-[#010611] hover:border-cyber-cyan/50 transition-all shadow-lg flex flex-col justify-between relative overflow-visible group">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                    WAR RISK SAVINGS
                  </span>
                  <TacticalTooltip
                    title="إلغاء أقساط التأمين ضد مخاطر الحرب"
                    explanation="قيمة الوفر المالي الناتج عن تفادي منطقة الصراع والتهديدات العسكرية في جنوب البحر الأحمر ومضيق باب المندب بالكامل."
                    takeaway="توفير فوري يصل إلى 1,418 دولار للحاوية بفضل الأمان والحصانة السيادية لشبكة النقل السعودية."
                    position="top"
                  />
                </div>
                <div className="text-base sm:text-lg font-black text-cyber-cyan my-1">
                  {timelineMetrics.warPremium > 0 ? `-$${timelineMetrics.warPremium.toLocaleString()} / FEU` : '$0.00 / FEU'}
                </div>
                <div className="text-[9px] text-slate-300 font-bold">
                  {timelineMetrics.warPremium > 0 ? '100% Sovereign Security' : 'Peacetime Baseline'}
                </div>
              </div>

              {/* كارت 4: طاقة الاستيعاب السككية اليومية (SAR) */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-slate-800/90 bg-gradient-to-b from-[#030d1d] to-[#010611] hover:border-amber-400/50 transition-all shadow-lg flex flex-col justify-between relative overflow-visible group">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                    RAIL THROUGHPUT (SAR)
                  </span>
                  <TacticalTooltip
                    title="الطاقة الاستيعابية لشبكة قطارات SAR"
                    explanation="القدرة اليومية لقطارات الشحن المزدوجة التابعة للخطوط الحديدية السعودية (SAR) لنقل الحاويات من ميناء الدمام إلى الميناء الجاف بالرياض وموانئ الغربية."
                    takeaway="تشغيل 64 قطار شحن أسبوعياً بطاقة 2,800 حاوية نمطية يومياً دون أي اختناقات تشغيلية."
                    position="top"
                  />
                </div>
                <div className="text-base sm:text-lg font-black text-amber-400 my-1">
                  2,800 TEU / Day
                </div>
                <div className="text-[9px] text-slate-400 font-bold">
                  64 Freight Trains / Week
                </div>
              </div>

              {/* كارت 5: الوفر الكربوني والامتثال البيئي */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-slate-800/90 bg-gradient-to-b from-[#030d1d] to-[#010611] hover:border-emerald-400/50 transition-all shadow-lg flex flex-col justify-between relative overflow-visible group">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                    CARBON ARBITRAGE (CO2)
                  </span>
                  <TacticalTooltip
                    title="الوفر في البصمة الكربونية (Green Logistics)"
                    explanation="نسبة خفض انبعاثات غازات الاحتباس الحراري الناتجة عن استبدال آلاف الأميال البحرية بحركة القطارات السككية الكهربائية والديزل النظيف."
                    takeaway="خفض انبعاثات الكربون بنسبة 35% (توفير 1.3 طن CO2 لكل حاوية)، مما يعزز الامتثال لمعايير الاستدامة العالمية Scope-3."
                    position="top"
                  />
                </div>
                <div className="text-base sm:text-lg font-black text-emerald-400 my-1">
                  -35% Emissions
                </div>
                <div className="text-[9px] text-emerald-500/90 font-bold">
                  -1.3 Tons CO2 / TEU vs Cape
                </div>
              </div>

              {/* كارت 6: زمن التخليص والمناقلة الجمركية (FASAH) */}
              <div className="p-3 sm:p-3.5 rounded-xl border border-slate-800/90 bg-gradient-to-b from-[#030d1d] to-[#010611] hover:border-purple-400/50 transition-all shadow-lg flex flex-col justify-between relative overflow-visible group">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">
                    CUSTOMS DWELL (FASAH)
                  </span>
                  <TacticalTooltip
                    title="زمن التخليص والمناقلة الجمركية (منصة فسح)"
                    explanation="متوسط الوقت المستغرق لمناقلة الحاوية وإنهاء إجراءاتها الجمركية بين رصيف الميناء وعربات القطار والشاحنات عبر الربط الرقمي المسبق."
                    takeaway="إنهاء إجراءات التخليص والعبور في أقل من 8 ساعات عبر الفحص بالأشعة ونظام الربط الجمركي الموحد."
                    position="top"
                  />
                </div>
                <div className="text-base sm:text-lg font-black text-purple-300 my-1">
                  &lt; 8 Hours SLA
                </div>
                <div className="text-[9px] text-slate-400 font-bold">
                  Digital Pre-Clearance
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. الصف السفلي: [Pcu (يسار)] + [Bubble matrix (يمين)]                     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        
        {/* مؤشر Pcu الفيدرالي (يسار) */}
        <div className="h-[340px]">
          <TradePriceTrendChart />
        </div>

        {/* رسم الفقاعات Bubble Matrix (يمين) */}
        <div className="h-[340px]">
          <MultimodalMatrixChart
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
          />
        </div>

      </div>

    </div>
  );
}