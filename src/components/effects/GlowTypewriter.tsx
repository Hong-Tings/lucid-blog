import { useEffect, useRef, useState } from 'react';

interface Props {
  text: string;
  className?: string;
  speed?: number;
  glowColor?: string;
  glowDuration?: number;
}

export default function GlowTypewriter({
  text,
  className = '',
  speed = 100,
  glowColor = 'rgba(217, 119, 6, 0.8)',
  glowDuration = 800,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [glowIndex, setGlowIndex] = useState(-1);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Intersection observer to trigger on scroll
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Typewriter with per-character glow
  useEffect(() => {
    if (!started) return;

    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setVisibleCount(i + 1);
        setGlowIndex(i);
        i++;
      } else {
        clearInterval(interval);
        // Fade out glow after completion
        setTimeout(() => setGlowIndex(-1), glowDuration);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed, glowDuration]);

  // Reset glow after duration
  useEffect(() => {
    if (glowIndex < 0) return;
    const timer = setTimeout(() => setGlowIndex(-1), glowDuration);
    return () => clearTimeout(timer);
  }, [glowIndex, glowDuration]);

  const chars = text.split('');

  return (
    <span ref={ref} className={className} aria-label={text}>
      {chars.map((char, i) => {
        const visible = i < visibleCount;
        const isGlowing = i === glowIndex;

        return (
          <span
            key={i}
            className="inline-block transition-all duration-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              textShadow: isGlowing
                ? `0 0 8px ${glowColor}, 0 0 20px ${glowColor}, 0 0 40px ${glowColor}`
                : 'none',
              transitionDelay: visible ? '0ms' : '0ms',
            }}
          >
            {char === ' ' ? ' ' : char}
          </span>
        );
      })}
      {visibleCount < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle animate-blink" />
      )}
    </span>
  );
}
