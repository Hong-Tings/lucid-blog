import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999]">
      {/* Track background — always visible */}
      <div className="absolute inset-0 bg-warm-100/60 dark:bg-warm-800/40" />
      {/* Progress fill */}
      <div
        className="h-full origin-left transition-[width] duration-100 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-warm-400 via-warm-600 to-warm-800 dark:from-warm-500 dark:via-warm-300 dark:to-warm-100" />
      </div>
      {/* Glow at tip */}
      <div
        className="absolute top-[-2px] h-[7px] w-10 blur-md transition-[left] duration-100 ease-out"
        style={{
          left: `calc(${progress}% - 20px)`,
          background: 'linear-gradient(90deg, transparent, rgba(180, 140, 100, 0.5), transparent)',
        }}
      />
    </div>
  );
}
