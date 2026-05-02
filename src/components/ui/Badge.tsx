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
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-white/5 text-white/60': variant === 'default',
          'bg-primary/15 text-accent border border-primary/20': variant === 'primary',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
