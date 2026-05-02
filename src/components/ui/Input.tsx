import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'input-glow w-full h-10 px-4 rounded-xl bg-white dark:bg-[#262626] border border-warm-200 dark:border-warm-700',
        'text-warm-800 dark:text-warm-200 text-sm placeholder:text-warm-400 dark:placeholder:text-warm-600',
        'focus:outline-none focus:border-black dark:focus:border-white focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10',
        'transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}
