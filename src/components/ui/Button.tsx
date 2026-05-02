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
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-primary hover:bg-primary-light text-white': variant === 'default',
          'border border-white/10 hover:border-white/20 text-white/80 hover:text-white bg-transparent': variant === 'outline',
          'hover:bg-white/5 text-white/60 hover:text-white': variant === 'ghost',
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
