import { useRef } from 'react';
import { cn } from '../../lib/utils';
import { useLiquidGlass } from '../effects/useLiquidGlass';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  liquidGlass?: boolean;
  liquidGlassStrength?: number;
}

export default function Card({
  children,
  className,
  hover = true,
  liquidGlass = false,
  liquidGlassStrength = 0.3,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const liquidRef = useLiquidGlass({
    enabled: liquidGlass,
    strength: liquidGlassStrength,
    blur: 0.25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  };

  // Merge refs
  const setRef = (el: HTMLDivElement) => {
    cardRef.current = el;
    (liquidRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <div
      ref={setRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'magnetic-glow p-6 relative overflow-hidden rounded-2xl border border-warm-200 dark:border-warm-700',
        hover && 'hover:border-warm-300 dark:hover:border-warm-600 hover:shadow-md transition-all duration-500',
        liquidGlass && 'liquid-glass-card',
        className
      )}
    >
      {children}
    </div>
  );
}
