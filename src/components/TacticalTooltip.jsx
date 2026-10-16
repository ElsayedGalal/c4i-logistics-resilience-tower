import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';

export default function TacticalTooltip({ title, explanation, takeaway, position = 'bottom' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 280;
    const estimatedHeight = 150;

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 15) left = 15;
    if (left + tooltipWidth > window.innerWidth - 15) {
      left = window.innerWidth - tooltipWidth - 15;
    }

    let top = 0;
    if (position === 'top') {
      top = rect.top - estimatedHeight - 10;
      if (top < 10) {
        top = rect.bottom + 10;
      }
    } else {
      top = rect.bottom + 10;
      if (top + estimatedHeight > window.innerHeight - 10) {
        top = rect.top - estimatedHeight - 10;
      }
    }

    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    calculatePosition();
    setIsOpen(true);
  };

  return (
    <div className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsOpen(false)}
        className="text-slate-500 hover:text-cyber-cyan transition-colors p-0.5 focus:outline-none cursor-pointer"
        aria-label="معلومات توضيحية"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen &&
        createPortal(
          <div
            dir="rtl"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              zIndex: 99999,
              position: 'fixed',
              width: '280px',
            }}
            className="p-3 rounded-xl border border-cyan-500/50 bg-[#020a17]/98 backdrop-blur-2xl shadow-[0_0_25px_rgba(0,240,255,0.3)] text-right font-sans pointer-events-none animate-in fade-in zoom-in-95 duration-150 select-none text-slate-100"
          >
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_8px_#00F0FF]" />
              <h5 className="text-[11px] font-black text-white">{title}</h5>
            </div>

            <p className="text-[10px] text-slate-300 leading-relaxed mb-2">
              {explanation}
            </p>

            {takeaway && (
              <div className="bg-cyan-950/50 border border-cyan-500/30 rounded-lg p-1.5 text-[9px] text-cyan-200">
                <strong className="text-cyber-cyan block mb-0.5 font-bold">الأثر الاستراتيجي:</strong>
                {takeaway}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}