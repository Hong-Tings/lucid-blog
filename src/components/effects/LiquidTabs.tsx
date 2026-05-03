import { useState, useEffect, useRef, useCallback } from 'react';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

interface LiquidTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function LiquidTabs({ tabs, activeTab, onChange }: LiquidTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  const updateIndicator = useCallback(() => {
    const btn = tabRefs.current.get(activeTab);
    const container = containerRef.current;
    if (!btn || !container) return;
    const cr = container.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    setIndicator({ left: br.left - cr.left, width: br.width });
  }, [activeTab]);

  useEffect(() => {
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    return () => window.removeEventListener('resize', updateIndicator);
  }, [updateIndicator]);

  return (
    <div className="relative inline-flex items-center">
      {/* Tab bar */}
      <div
        ref={containerRef}
        className="relative flex items-center gap-1 p-1.5 rounded-2xl overflow-hidden bg-warm-100 dark:bg-white/[0.04] border border-warm-200 dark:border-white/[0.06]"
        style={{
          backdropFilter: 'blur(20px) contrast(1.1) saturate(1.3)',
          WebkitBackdropFilter: 'blur(20px) contrast(1.1) saturate(1.3)',
        }}
      >
        {/* Sliding glass indicator */}
        <div
          className="absolute top-1.5 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] bg-white dark:bg-white/[0.08] border border-warm-200 dark:border-white/[0.1] shadow-sm dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
          style={{
            left: indicator.left,
            width: indicator.width,
            height: 'calc(100% - 12px)',
            backdropFilter: 'blur(8px) contrast(1.2) brightness(1.1)',
            WebkitBackdropFilter: 'blur(8px) contrast(1.2) brightness(1.1)',
          }}
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              animation: 'liquidShimmer 3s ease-in-out infinite',
            }}
          />
        </div>

        {/* Tab buttons */}
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { if (el) tabRefs.current.set(tab.id, el); }}
            onClick={() => onChange(tab.id)}
            className={`relative z-10 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? 'text-warm-800 dark:text-white'
                : 'text-warm-400 dark:text-white/30 hover:text-warm-600 dark:hover:text-white/50'
            }`}
          >
            <span className="text-sm">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <style>{`
        @keyframes liquidShimmer {
          0%, 100% { transform: translateX(-100%); opacity: 0; }
          50% { transform: translateX(100%); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
