import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card p-6',
        hover && 'hover:border-white/10 hover:shadow-lg hover:shadow-primary/5 transition-all duration-500',
        className
      )}
    >
      {children}
    </div>
  );
}
