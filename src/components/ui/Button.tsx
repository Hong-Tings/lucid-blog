import { useCallback } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  children,
  className,
  variant = 'default',
  size = 'md',
  onClick,
  ...props
}: ButtonProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Ripple effect
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    onClick?.(e);
  }, [onClick]);

  return (
    <button
      className={cn(
        'btn-ripple inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/20',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.97]',
        {
          'bg-black hover:bg-warm-800 text-white font-semibold dark:bg-white dark:text-black dark:hover:bg-warm-200': variant === 'default',
          'border border-warm-300 dark:border-warm-600 hover:border-black dark:hover:border-white text-warm-600 dark:text-warm-400 hover:text-black dark:hover:text-white bg-transparent': variant === 'outline',
          'hover:bg-warm-100 dark:hover:bg-warm-800 text-warm-500 dark:text-warm-400 hover:text-black dark:hover:text-white': variant === 'ghost',
        },
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-5 text-sm': size === 'md',
          'h-12 px-8 text-base': size === 'lg',
        },
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
