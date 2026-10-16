import React, { useEffect, useRef } from 'react';

export default function CyberBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // ضبط أبعاد الكانفاس لتلائم الشاشة ومعدل البكسل
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // تتبع موقع الماوس للتفاعل المغناطيسي
    const mouse = {
      x: null,
      y: null,
      radius: 160, // نطاق جذب العقد وتفاعلها مع الماوس
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // لوحة الألوان السيبرانية للشبكة العصبية
    const COLORS = [
      { r: 0, g: 240, b: 255 },   // Cyan (الذكاء الاصطناعي)
      { r: 0, g: 255, b: 157 },   // Emerald (المسارات الآمنة)
      { r: 217, g: 70, b: 239 },  // Fuchsia (التنبؤ والمخاطر)
      { r: 168, g: 85, b: 247 },  // Violet
    ];

    let nodes = [];
    const MAX_DISTANCE = 135; // المسافة القصوى لتوليد رابط تشابكي

    // فئة العقدة العصبية (Neuron Node)
    class Node {
      constructor() {
        this.reset();
        // توزيع أولي عشوائي
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        // سرعة بطيئة انسيابية تليق بخلفية مراقبة تكتيكية
        this.vx = (Math.random() - 0.5) * 0.55;
        this.vy = (Math.random() - 0.5) * 0.55;
        this.radius = Math.random() * 1.8 + 1.2;
        this.baseRadius = this.radius;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.alpha = Math.random() * 0.4 + 0.35;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseAngle = Math.random() * Math.PI * 2;
      }

      update() {
        // حركة العقدة
        this.x += this.vx;
        this.y += this.vy;

        // ارتداد هادئ عند حواف الشاشة
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // نبض العقدة الداخلي
        this.pulseAngle += this.pulseSpeed;
        this.currentRadius = this.baseRadius + Math.sin(this.pulseAngle) * 0.6;

        // تفاعل العقدة مع مؤشر الماوس (نفور لطيف مع زيادة التوهج)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius) * 1.5;
            this.x += (dx / dist) * force;
            this.y += (dy / dist) * force;
            this.currentRadius = this.baseRadius + force * 2;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.5, this.currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`;
        ctx.fill();

        // هالة توهج خفيفة للعقد
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.currentRadius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.15})`;
        ctx.fill();
      }
    }

    // إشارات عصبية نبضية تنتقل بين الوصلات (Action Potentials / Synaptic Pulses)
    let pulses = [];
    class SynapticPulse {
      constructor(from, to, color) {
        this.from = from;
        this.to = to;
        this.progress = 0;
        this.speed = Math.random() * 0.025 + 0.015;
        this.color = color;
      }

      update() {
        this.progress += this.speed;
        return this.progress <= 1;
      }

      draw() {
        const x = this.from.x + (this.to.x - this.from.x) * this.progress;
        const y = this.from.y + (this.to.y - this.from.y) * this.progress;
        
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // إعادة التعيين لمنع استهلاك المعالجة
      }
    }

    // تحديد كثافة العقد بناءً على حجم الشاشة (أداء متوازن)
    const initNodes = () => {
      const nodeCount = Math.floor((width * height) / 16000); // حوالي 70 - 100 عقدة على الشاشات الكبيرة
      nodes = Array.from({ length: Math.min(110, Math.max(45, nodeCount)) }, () => new Node());
      pulses = [];
    };

    initNodes();

    // دورة الرسم والتحريك المستمرة
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // تحديث ورسم العقد
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();
      }

      // رسم الروابط العصبية (Synapses) بين العقد القريبة
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DISTANCE) {
            const opacity = (1 - dist / MAX_DISTANCE) * 0.22;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            // تدرج لوني بين العقدتين المتصلتين
            const grad = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grad.addColorStop(0, `rgba(${nodes[i].color.r}, ${nodes[i].color.g}, ${nodes[i].color.b}, ${opacity})`);
            grad.addColorStop(1, `rgba(${nodes[j].color.r}, ${nodes[j].color.g}, ${nodes[j].color.b}, ${opacity})`);

            ctx.strokeStyle = grad;
            ctx.lineWidth = opacity * 1.5;
            ctx.stroke();

            // فرصة عشوائية نادرة لإطلاق نبضة عصبية متدفقة
            if (Math.random() < 0.0007 && pulses.length < 8) {
              pulses.push(new SynapticPulse(nodes[i], nodes[j], nodes[i].color));
            }
          }
        }

        // تفاعل العقد وربطها بمؤشر الماوس مباشرة عند الاقتراب
        if (mouse.x !== null && mouse.y !== null) {
          const dx = nodes[i].x - mouse.x;
          const dy = nodes[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const mouseOpacity = (1 - dist / mouse.radius) * 0.35;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${mouseOpacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // تحديث ورسم النبضات العصبية المتدفقة
      for (let p = pulses.length - 1; p >= 0; p--) {
        if (!pulses[p].update()) {
          pulses.splice(p, 1);
        } else {
          pulses[p].draw();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#01040a]">
      {/* 1. كانفاس الشبكة العصبية الحية */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2. تدرج شعاعي عميق يركّز الضوء في المنتصف ويغمّق الأطراف لراحة العين */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(2, 9, 23, 0.45) 0%, rgba(1, 4, 10, 0.92) 80%, #01040a 100%)',
        }}
      />

      {/* 3. سديم ناعم ملون في الزوايا يعزز عمق الفضاء السيبراني */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-cyan-600/[0.04] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-600/[0.035] rounded-full blur-[170px] pointer-events-none" />
    </div>
  );
}