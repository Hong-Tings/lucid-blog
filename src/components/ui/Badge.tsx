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
          'bg-white/[0.05] text-warm-300/50': variant === 'default',
          'bg-primary/10 text-primary border border-primary/15': variant === 'primary',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
