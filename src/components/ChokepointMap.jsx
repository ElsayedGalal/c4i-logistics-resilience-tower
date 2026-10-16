import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useData } from '../context/DataContext';
import TacticalTooltip from './TacticalTooltip';
import { Compass, ShieldAlert, Waves, RotateCcw, CheckCircle2, TrendingDown } from 'lucide-react';

export default function ChokepointMap() {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneElementsRef = useRef({});
  
  const { computedMetrics, endDate } = useData();
  const { portStats } = computedMetrics;

  const [selectedChokepoint, setSelectedChokepoint] = useState('Bab el-Mandeb');
  const [activeCameraTarget, setActiveCameraTarget] = useState('RED_SEA');

  const latLngToVector3 = (lat, lng, radius) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  };

  const EARTH_RADIUS = 70;
  // ارتفاع موحد للمسارات المائية يعانق سطح المحيط دون اختراق أو تباعد في الفضاء
  const SEA_LEVEL = EARTH_RADIUS + 0.35;

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 800;
    const height = mountRef.current.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(125, 45, -125);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.7;
    controls.minDistance = 110;
    controls.maxDistance = 320;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      controls.autoRotate = false;
    });

    const ambientLight = new THREE.AmbientLight(0x0284c7, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(150, 100, -150);
    scene.add(keyLight);

    const cyanRimLight = new THREE.DirectionalLight(0x00f0ff, 1.5);
    cyanRimLight.position.set(-180, -60, 100);
    scene.add(cyanRimLight);

    // 1. جسم الكرة الأرضية السيبراني
    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 96, 96);
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x050d1a,
      roughness: 0.8,
      metalness: 0.1,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');
    textureLoader.load(
      'https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/img/earth-dark.jpg',
      (darkTex) => {
        darkTex.colorSpace = THREE.SRGBColorSpace;
        earthMaterial.map = darkTex;
        earthMaterial.color.setHex(0x0d2342);
        earthMaterial.needsUpdate = true;
      }
    );

    // 2. رسم حدود الدول باللون السيان النيوني الهادئ
    fetch('https://cdn.jsdelivr.net/gh/vasturiano/three-globe@master/example/country-polygons/ne_110m_admin_0_countries.geojson')
      .then((res) => res.json())
      .then((geoJson) => {
        const linePositions = [];
        const processPolygon = (rings) => {
          rings.forEach((ring) => {
            for (let i = 0; i < ring.length - 1; i++) {
              const p1 = latLngToVector3(ring[i][1], ring[i][0], EARTH_RADIUS + 0.18);
              const p2 = latLngToVector3(ring[i + 1][1], ring[i + 1][0], EARTH_RADIUS + 0.18);
              linePositions.push(p1.x, p1.y, p1.z, p2.x, p2.y, p2.z);
            }
          });
        };

        geoJson.features.forEach((feature) => {
          const { type, coordinates } = feature.geometry;
          if (type === 'Polygon') processPolygon(coordinates);
          else if (type === 'MultiPolygon') coordinates.forEach((poly) => processPolygon(poly));
        });

        const bordersGeometry = new THREE.BufferGeometry();
        bordersGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const bordersMaterial = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.42 });
        const countryBorders = new THREE.LineSegments(bordersGeometry, bordersMaterial);
        scene.add(countryBorders);
      })
      .catch((err) => console.warn('GeoJSON vector borders fallback:', err));

    // 3. هالة الغلاف الجوي
    const atmosGeometry = new THREE.SphereGeometry(EARTH_RADIUS * 1.025, 64, 64);
    const atmosMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    });
    scene.add(new THREE.Mesh(atmosGeometry, atmosMaterial));

    // =================================================================
    // 4. المسارات الملاحية الواقعية الدقيقة (Navigational Corridors)
    // =================================================================

    // أ) مسار رأس الرجاء الصالح (The Cape of Good Hope Bypass Corridor)
    const waypointsCape = [
      latLngToVector3(1.29, 103.85, SEA_LEVEL),   // سنغافورة
      latLngToVector3(2.5, 101.5, SEA_LEVEL),     // مضيق ملقا
      latLngToVector3(5.8, 95.0, SEA_LEVEL),      // شمال سومطرة
      latLngToVector3(5.9, 80.5, SEA_LEVEL),      // جنوب سريلانكا
      latLngToVector3(-5.0, 75.0, SEA_LEVEL),     // وسط المحيط الهندي
      latLngToVector3(-18.0, 60.0, SEA_LEVEL),    // جنوب المحيط الهندي
      latLngToVector3(-28.0, 48.0, SEA_LEVEL),    // جنوب مدغشقر
      latLngToVector3(-34.0, 28.0, SEA_LEVEL),    // مياه بورت إليزابيث
      latLngToVector3(-35.0, 20.0, SEA_LEVEL),    // مياه رأس أغولاس (أقصى جنوب إفريقيا)
      latLngToVector3(-34.35, 18.49, SEA_LEVEL),  // رأس الرجاء الصالح
      latLngToVector3(-26.0, 13.0, SEA_LEVEL),    // مياه ناميبيا
      latLngToVector3(-12.0, 2.0, SEA_LEVEL),     // جنوب الأطلسي
      latLngToVector3(0.0, -10.0, SEA_LEVEL),     // خط الاستواء الأطلسي
      latLngToVector3(14.0, -20.0, SEA_LEVEL),    // قبالة السنغال والرأس الأخضر
      latLngToVector3(28.0, -17.5, SEA_LEVEL),    // جزر الكناري
      latLngToVector3(38.0, -11.0, SEA_LEVEL),    // مياه البرتغال
      latLngToVector3(45.0, -9.0, SEA_LEVEL),     // خليج بسكاي
      latLngToVector3(48.8, -5.2, SEA_LEVEL),     // مدخل القناة الإنجليزية
      latLngToVector3(50.5, 0.5, SEA_LEVEL),      // مضيق دوفر
      latLngToVector3(51.95, 4.1, SEA_LEVEL),     // ميناء روتردام
    ];
    const capeCurve = new THREE.CatmullRomCurve3(waypointsCape, false, 'centripetal');

    const capeTubeMat = new THREE.MeshBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.95 });
    const capeTube = new THREE.Mesh(new THREE.TubeGeometry(capeCurve, 220, 0.16, 6, false), capeTubeMat);
    scene.add(capeTube);

    const capeGlow = new THREE.Mesh(
      new THREE.TubeGeometry(capeCurve, 220, 0.38, 6, false),
      new THREE.MeshBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending })
    );
    scene.add(capeGlow);

    // ب) مسار قناة السويس وباب المندب (The Direct Suez Canal Corridor)
    const waypointsSuez = [
      latLngToVector3(1.29, 103.85, SEA_LEVEL),   // سنغافورة
      latLngToVector3(2.5, 101.5, SEA_LEVEL),     // مضيق ملقا
      latLngToVector3(5.8, 95.0, SEA_LEVEL),      // شمال سومطرة
      latLngToVector3(5.9, 80.5, SEA_LEVEL),      // جنوب سريلانكا
      latLngToVector3(10.0, 65.0, SEA_LEVEL),     // وسط بحر العرب
      latLngToVector3(12.5, 52.0, SEA_LEVEL),     // ممر سقطرى
      latLngToVector3(12.2, 45.5, SEA_LEVEL),     // ممر خليج عدن الدولي
      latLngToVector3(12.58, 43.33, SEA_LEVEL),   // مضيق باب المندب
      latLngToVector3(14.5, 42.1, SEA_LEVEL),     // جزر حنيش (جنوب البحر الأحمر)
      latLngToVector3(20.0, 38.5, SEA_LEVEL),     // وسط البحر الأحمر
      latLngToVector3(25.5, 35.8, SEA_LEVEL),     // شمال البحر الأحمر
      latLngToVector3(27.8, 33.8, SEA_LEVEL),     // مضيق جوبال / مدخل خليج السويس
      latLngToVector3(29.97, 32.56, SEA_LEVEL),   // المدخل الجنوبي لقناة السويس
      latLngToVector3(31.3, 32.3, SEA_LEVEL),     // بورسعيد / البحر المتوسط
      latLngToVector3(33.5, 28.0, SEA_LEVEL),     // شرق المتوسط
      latLngToVector3(34.5, 24.5, SEA_LEVEL),     // جنوب جزيرة كريت (داخل المياه)
      latLngToVector3(36.0, 19.0, SEA_LEVEL),     // البحر الأيوني
      latLngToVector3(36.2, 14.5, SEA_LEVEL),     // مضيق صقلية / جنوب مالطا
      latLngToVector3(37.5, 5.0, SEA_LEVEL),      // غرب المتوسط (شمال الجزائر)
      latLngToVector3(35.95, -5.5, SEA_LEVEL),    // مضيق جبل طارق
      latLngToVector3(36.8, -9.2, SEA_LEVEL),     // رأس سانت فنسنت (البرتغال)
      latLngToVector3(38.8, -9.8, SEA_LEVEL),     // مياه لشبونة
      latLngToVector3(43.0, -9.5, SEA_LEVEL),     // مياه شمال غرب إسبانيا
      latLngToVector3(46.5, -6.5, SEA_LEVEL),     // مياه خليج بسكاي
      latLngToVector3(48.8, -5.2, SEA_LEVEL),     // مدخل القناة الإنجليزية
      latLngToVector3(50.5, 0.5, SEA_LEVEL),      // مضيق دوفر
      latLngToVector3(51.95, 4.1, SEA_LEVEL),     // ميناء روتردام
    ];
    const suezCurve = new THREE.CatmullRomCurve3(waypointsSuez, false, 'centripetal');

    const suezTubeMat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.85 });
    const suezTube = new THREE.Mesh(new THREE.TubeGeometry(suezCurve, 260, 0.16, 6, false), suezTubeMat);
    scene.add(suezTube);

    const suezGlow = new THREE.Mesh(
      new THREE.TubeGeometry(suezCurve, 260, 0.38, 6, false),
      new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending })
    );
    scene.add(suezGlow);

    // ج) مسار ناقلات الطاقة من مضيق هرمز (Hormuz Crude Line)
    const waypointsHormuz = [
      latLngToVector3(26.0, 52.5, SEA_LEVEL),     // مياه الخليج العربي
      latLngToVector3(26.56, 56.25, SEA_LEVEL),   // مضيق هرمز
      latLngToVector3(24.5, 58.8, SEA_LEVEL),     // خليج عمان
      latLngToVector3(21.5, 60.0, SEA_LEVEL),     // الالتفاف حول رأس الحد (عمان)
      latLngToVector3(16.0, 54.5, SEA_LEVEL),     // بحر العرب قبالة صلالة
      latLngToVector3(12.8, 51.5, SEA_LEVEL),     // ممر سقطرى
      latLngToVector3(12.2, 45.5, SEA_LEVEL),     // خليج عدن
      latLngToVector3(12.58, 43.33, SEA_LEVEL),   // مضيق باب المندب
    ];
    const hormuzCurve = new THREE.CatmullRomCurve3(waypointsHormuz, false, 'centripetal');
    const hormuzTube = new THREE.Mesh(
      new THREE.TubeGeometry(hormuzCurve, 80, 0.14, 6, false),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 })
    );
    scene.add(hormuzTube);

    // 5. حلقة رادار باب المندب الدقيقة
    const babPos = latLngToVector3(12.58, 43.33, EARTH_RADIUS + 0.4);
    const radarGroup = new THREE.Group();
    radarGroup.position.copy(babPos);
    radarGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), babPos.clone().normalize());

    const radarMat = new THREE.MeshBasicMaterial({ color: 0xff0055, side: THREE.DoubleSide, transparent: true, opacity: 0.75 });
    const thinOuterRing = new THREE.Mesh(new THREE.RingGeometry(3.6, 3.8, 48), radarMat);
    radarGroup.add(thinOuterRing);

    const thinInnerRing = new THREE.Mesh(new THREE.RingGeometry(1.8, 2.0, 36), radarMat);
    radarGroup.add(thinInnerRing);

    const crossMaterial = new THREE.LineBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0.5 });
    const crossPoints = [
      new THREE.Vector3(-4.5, 0, 0), new THREE.Vector3(4.5, 0, 0),
      new THREE.Vector3(0, -4.5, 0), new THREE.Vector3(0, 4.5, 0),
    ];
    radarGroup.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(crossPoints), crossMaterial));
    scene.add(radarGroup);

    sceneElementsRef.current = {
      radarGroup,
      radarMat,
      suezTubeMat,
      suezGlow,
      capeTubeMat,
      capeGlow,
    };

    // 6. مؤشرات المضائق والموانئ الاستراتيجية
    const CHOKEPOINTS = [
      { name: 'Bab el-Mandeb', lat: 12.58, lng: 43.33, color: 0xff0055, size: 1.1 },
      { name: 'Suez Canal', lat: 29.97, lng: 32.56, color: 0xf59e0b, size: 1.0 },
      { name: 'Cape of Good Hope', lat: -34.35, lng: 18.49, color: 0x00ff9d, size: 1.1 },
      { name: 'Strait of Hormuz', lat: 26.56, lng: 56.25, color: 0xfb923c, size: 1.0 },
      { name: 'Singapore', lat: 1.29, lng: 103.85, color: 0x00f0ff, size: 1.1 },
      { name: 'Rotterdam', lat: 51.95, lng: 4.1, color: 0x00f0ff, size: 1.1 },
    ];

    CHOKEPOINTS.forEach((pt) => {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(pt.size, 16, 16),
        new THREE.MeshBasicMaterial({ color: pt.color })
      );
      dot.position.copy(latLngToVector3(pt.lat, pt.lng, SEA_LEVEL + 0.1));
      scene.add(dot);
    });

    // 7. نبضات تدفق السفن الليزرية على المسارات
    const flowParticleGeom = new THREE.SphereGeometry(0.75, 16, 16);
    const flowCape = new THREE.Mesh(flowParticleGeom, new THREE.MeshBasicMaterial({ color: 0x00ff9d }));
    scene.add(flowCape);

    const flowSuez = new THREE.Mesh(flowParticleGeom, new THREE.MeshBasicMaterial({ color: 0xff0055 }));
    scene.add(flowSuez);

    // 8. حلقة التحريك
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      radarGroup.rotation.z = time * 0.45;
      const radarPulse = 1 + 0.06 * Math.sin(time * 3);
      radarGroup.scale.set(radarPulse, radarPulse, radarPulse);

      const tCape = (time * 0.08) % 1;
      flowCape.position.copy(capeCurve.getPointAt(tCape));

      const tSuez = (time * 0.07) % 1;
      flowSuez.position.copy(suezCurve.getPointAt(tSuez));

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || 800;
      const h = mountRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // تفاعل الألوان والرادار مع التاريخ
  useEffect(() => {
    const { radarGroup, radarMat, suezTubeMat, suezGlow, capeTubeMat, capeGlow } = sceneElementsRef.current;
    if (!radarGroup || !portStats) return;

    const babData = portStats['Bab el-Mandeb'];
    const isCrisisEra = babData?.status === 'CRITICAL_HAZARD' || endDate >= '2023-11-20';

    if (isCrisisEra) {
      radarGroup.visible = true;
      radarMat.opacity = 0.85;
      suezTubeMat.color.setHex(0xff0055);
      suezGlow.material.color.setHex(0xff0055);
      capeTubeMat.opacity = 1.0;
      capeGlow.material.opacity = 0.25;
    } else {
      radarGroup.visible = false;
      suezTubeMat.color.setHex(0x00f0ff);
      suezGlow.material.color.setHex(0x00f0ff);
      capeTubeMat.opacity = 0.45;
      capeGlow.material.opacity = 0.08;
    }
  }, [portStats, endDate]);

  const focusLocation = (target, chokepointName) => {
    if (!controlsRef.current || !cameraRef.current) return;
    controlsRef.current.autoRotate = false;
    setActiveCameraTarget(target);
    if (chokepointName) setSelectedChokepoint(chokepointName);

    const positions = {
      RED_SEA: { x: 125, y: 45, z: -125 },
      SUEZ: { x: 110, y: 70, z: -105 },
      CAPE: { x: 90, y: -85, z: -65 },
      HORMUZ: { x: 85, y: 65, z: -135 },
      GLOBAL: { x: 140, y: 75, z: 155 },
    };

    const pos = positions[target] || positions.GLOBAL;
    cameraRef.current.position.set(pos.x, pos.y, pos.z);
    controlsRef.current.update();
  };

  const currentChokepointStats = portStats[selectedChokepoint] || {
    liveAvgContainer: '0',
    liveAvgTotal: '0',
    liveChangePct: '0',
    status: 'NORMAL',
  };

  const isSelectedHazard = currentChokepointStats.status === 'CRITICAL_HAZARD';
  const isSelectedWarning = currentChokepointStats.status === 'WARNING';
  const isSelectedSurge = currentChokepointStats.status === 'SURGE';

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyber-border relative overflow-visible flex flex-col h-full shadow-2xl">
      
      {/* 1. شريط الفلاتر العلوية مع التولتيب التكتيكي */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-cyan animate-ping" />
            <h3 className="text-sm font-extrabold uppercase tracking-widest text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyber-cyan" />
              Cybernetic Maritime Digital Twin // Precision Corridors
            </h3>
            <TacticalTooltip
              title="التوأم الرقمي والمحاكاة الجيومكانية للمضائق"
              explanation="خريطة فضائية تفاعلية ثلاثية الأبعاد ترصد خطوط الملاحة الحية بمضيق باب المندب، وقناة السويس، ومضيق هرمز، مع مقارنتها بمسار رأس الرجاء الصالح بدقة جيومكانية."
              takeaway="رؤية مكانية حية لتحول مسار التجارة البحرية والمسافات الإضافية التي تقطعها السفن."
              position="bottom"
            />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyber-cyan">
              {endDate}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            AIS international nautical corridors: Red Sea chokepoint vs. Cape of Good Hope detour
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => focusLocation('RED_SEA', 'Bab el-Mandeb')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedChokepoint === 'Bab el-Mandeb'
                ? 'bg-cyber-hazard/20 border border-cyber-hazard text-cyber-hazard shadow-neon-red'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bab el-Mandeb
          </button>

          <button
            onClick={() => focusLocation('SUEZ', 'Suez Canal')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedChokepoint === 'Suez Canal'
                ? 'bg-cyber-warning/20 border border-cyber-warning text-cyber-warning'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Suez Canal
          </button>

          <button
            onClick={() => focusLocation('CAPE', 'Cape of Good Hope')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedChokepoint === 'Cape of Good Hope'
                ? 'bg-cyber-emerald/20 border border-cyber-emerald text-cyber-emerald shadow-neon-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cape of Good Hope
          </button>

          <button
            onClick={() => focusLocation('HORMUZ', 'Strait of Hormuz')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedChokepoint === 'Strait of Hormuz'
                ? 'bg-cyber-accent/20 border border-cyber-accent text-cyber-accent'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hormuz
          </button>

          <button
            onClick={() => focusLocation('GLOBAL', 'Bab el-Mandeb')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            title="Reset Camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. نافذة الـ 3D Canvas */}
      <div
        ref={mountRef}
        className="relative w-full flex-1 min-h-[500px] bg-[#02050e] rounded-xl border border-slate-800/90 overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="absolute top-3 right-3 bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-mono text-slate-200 shadow-xl pointer-events-none flex items-center gap-2 z-10">
          <Waves className="w-4 h-4 text-cyber-cyan animate-pulse" />
          <span>SIMULATION DATE:</span>
          <span className="text-cyber-cyan font-black">{endDate}</span>
        </div>

        {/* 3. الكارت الذكي الديناميكي */}
        <div className="absolute bottom-3 left-3 bg-slate-950/95 backdrop-blur-xl p-4 rounded-xl border border-slate-700/80 text-xs shadow-2xl max-w-sm pointer-events-none z-10 transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 font-extrabold text-white text-xs uppercase tracking-wider">
              {isSelectedHazard && <ShieldAlert className="w-4 h-4 text-cyber-hazard" />}
              {isSelectedWarning && <TrendingDown className="w-4 h-4 text-cyber-warning" />}
              {isSelectedSurge && <CheckCircle2 className="w-4 h-4 text-cyber-emerald" />}
              {!isSelectedHazard && !isSelectedWarning && !isSelectedSurge && <Compass className="w-4 h-4 text-cyber-cyan" />}
              <span>{selectedChokepoint}</span>
            </div>
            
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
              isSelectedHazard ? 'bg-cyber-hazard/20 text-cyber-hazard border border-cyber-hazard/30 shadow-neon-red' :
              isSelectedWarning ? 'bg-cyber-warning/20 text-cyber-warning border border-cyber-warning/30' :
              isSelectedSurge ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/30 shadow-neon-emerald' :
              'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
            }`}>
              {currentChokepointStats.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 my-2.5 p-2 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">CONTAINERS/DAY</span>
              <span className="text-white font-bold">{currentChokepointStats.liveAvgContainer}</span>
              <span className={`ml-1 text-[10px] font-bold ${
                Number(currentChokepointStats.liveChangePct) < 0 ? 'text-cyber-hazard' : 'text-cyber-emerald'
              }`}>
                ({currentChokepointStats.liveChangePct > 0 ? '+' : ''}{currentChokepointStats.liveChangePct}%)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CURRENT TRAFFIC</span>
              <span className="text-white font-bold">{currentChokepointStats.liveAvgTotal} ships/d</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
            {endDate >= '2023-11-20' ? (
              <span className="text-cyber-hazard">
                🚨 RED SEA ESCALATION ACTIVE: Vessels actively diverting via Africa.
              </span>
            ) : (
              <span className="text-cyber-emerald">
                ✔ STABLE MARITIME CORRIDOR: Baseline Suez transit flow operational.
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}