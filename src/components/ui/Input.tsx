import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'w-full h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.07]',
        'text-warm-100 text-sm placeholder:text-warm-500/30',
        'focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/15',
        'transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}
