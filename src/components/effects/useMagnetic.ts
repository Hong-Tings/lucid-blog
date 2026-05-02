import { useRef, useEffect, useCallback } from 'react';

interface MagneticOptions {
  strength?: number;
  maxTilt?: number;
}

export function useMagnetic({ strength = 0.3, maxTilt = 8 }: MagneticOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    const rotateX = (-deltaY / (rect.height / 2)) * maxTilt;
    const rotateY = (deltaX / (rect.width / 2)) * maxTilt;

    // Highlight position
    const highlightX = ((e.clientX - rect.left) / rect.width) * 100;
    const highlightY = ((e.clientY - rect.top) / rect.height) * 100;

    el.style.transform = `perspective(800px) translate(${deltaX}px, ${deltaY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    el.style.setProperty('--highlight-x', `${highlightX}%`);
    el.style.setProperty('--highlight-y', `${highlightY}%`);
  }, [strength, maxTilt]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) translate(0, 0) rotateX(0deg) rotateY(0deg) scale(1)';
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check for touch device
    if ('ontouchstart' in window) return;

    el.style.transition = 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)';
    el.style.willChange = 'transform';
    el.style.setProperty('--highlight-x', '50%');
    el.style.setProperty('--highlight-y', '50%');

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}
