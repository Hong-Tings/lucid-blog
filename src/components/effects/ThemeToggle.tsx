import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read current state — the blocking script in BaseLayout already initialized it
    setIsDark(document.documentElement.classList.contains('dark'));
    setMounted(true);

    // Listen for system preference changes
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (!localStorage.getItem('theme')) {
        const dark = mq.matches;
        setIsDark(dark);
        document.documentElement.classList.toggle('dark', dark);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
      className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-warm-100 dark:hover:bg-warm-800 transition-colors duration-300 group"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        {/* Sun */}
        <svg
          className="absolute inset-0 w-5 h-5 transition-all duration-500 text-warm-600 dark:text-warm-400"
          style={{
            transform: isDark ? 'rotate(90deg) scale(0)' : 'rotate(0) scale(1)',
            opacity: isDark ? 0 : 1,
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
        {/* Moon */}
        <svg
          className="absolute inset-0 w-5 h-5 transition-all duration-500 text-warm-400"
          style={{
            transform: isDark ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0)',
            opacity: isDark ? 1 : 0,
          }}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      </div>
    </button>
  );
}
