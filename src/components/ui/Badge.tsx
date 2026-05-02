import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary';
}

export default function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium tracking-wider',
        {
          'bg-warm-800 text-warm-400': variant === 'default',
          'bg-white text-black': variant === 'primary',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
