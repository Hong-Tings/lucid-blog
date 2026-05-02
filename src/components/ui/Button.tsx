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
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary hover:bg-primary-light text-surface-dark font-semibold': variant === 'default',
          'border border-warm-600/20 hover:border-primary/30 text-warm-200/60 hover:text-warm-100 bg-transparent': variant === 'outline',
          'hover:bg-white/5 text-warm-300/50 hover:text-warm-100': variant === 'ghost',
        },
        {
          'h-8 px-3 text-xs': size === 'sm',
          'h-10 px-5 text-sm': size === 'md',
          'h-12 px-8 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
