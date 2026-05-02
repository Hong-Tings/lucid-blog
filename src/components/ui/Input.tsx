import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full h-10 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]',
        'text-white text-sm placeholder:text-white/30',
        'focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20',
        'transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}
