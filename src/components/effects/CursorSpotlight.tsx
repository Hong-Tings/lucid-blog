import { useEffect, useRef } from 'react';

export default function CursorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const spot = spotRef.current;
    if (!spot) return;

    let raf: number;
    let mx = -200;
    let my = -200;
    let cx = -200;
    let cy = -200;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animate = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      spot.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="fixed top-0 left-0 w-[300px] h-[300px] pointer-events-none z-[1] opacity-0 dark:opacity-100 transition-opacity duration-700"
      style={{
        background: 'radial-gradient(circle, rgba(212, 165, 116, 0.04) 0%, transparent 70%)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}
