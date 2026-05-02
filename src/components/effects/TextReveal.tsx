import { useEffect, useRef } from 'react';

interface Props {
  text: string;
  className?: string;
  delay?: number;
}

export default function TextReveal({ text, className = '', delay = 0 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const chars = el.querySelectorAll('.char');
          chars.forEach((char, i) => {
            (char as HTMLElement).style.animationDelay = `${delay + i * 0.04}s`;
            char.classList.add('animate-char-reveal');
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={containerRef} className={`flex overflow-hidden ${className}`}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="char inline-block opacity-0"
          style={{ animationFillMode: 'forwards', perspective: '500px' }}
        >
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </div>
  );
}
