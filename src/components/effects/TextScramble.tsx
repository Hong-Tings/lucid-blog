import { useCallback, useRef } from 'react';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!?';

export function useTextScramble() {
  const frameRef = useRef<number>();

  const scramble = useCallback((element: HTMLElement) => {
    const original = element.dataset.originalText || element.textContent || '';
    element.dataset.originalText = original;

    let iteration = 0;
    const maxIterations = original.length * 3;

    cancelAnimationFrame(frameRef.current!);

    const animate = () => {
      element.textContent = original
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration / 3) return original[i];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      iteration++;
      if (iteration <= maxIterations) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        element.textContent = original;
      }
    };

    animate();
  }, []);

  return scramble;
}
