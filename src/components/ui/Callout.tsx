import { type ReactNode } from 'react';

type CalloutVariant = 'info' | 'warning' | 'tip' | 'danger';

interface CalloutProps {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}

const variantStyles: Record<CalloutVariant, { bg: string; border: string; icon: string; iconColor: string }> = {
  info: {
    bg: 'bg-warm-50 dark:bg-warm-800/30',
    border: 'border-warm-300 dark:border-warm-600',
    icon: '💡',
    iconColor: 'text-warm-600 dark:text-warm-400',
  },
  warning: {
    bg: 'bg-warm-50 dark:bg-warm-800/30',
    border: 'border-warm-400 dark:border-warm-500',
    icon: '⚠️',
    iconColor: 'text-warm-600 dark:text-warm-400',
  },
  tip: {
    bg: 'bg-warm-50 dark:bg-warm-800/30',
    border: 'border-warm-200 dark:border-warm-700',
    icon: '✨',
    iconColor: 'text-warm-500 dark:text-warm-400',
  },
  danger: {
    bg: 'bg-warm-50 dark:bg-warm-800/30',
    border: 'border-warm-500 dark:border-warm-400',
    icon: '🚨',
    iconColor: 'text-warm-700 dark:text-warm-300',
  },
};

export default function Callout({ variant = 'info', title, children }: CalloutProps) {
  const style = variantStyles[variant];

  return (
    <div className={`${style.bg} ${style.border} border-l-4 rounded-r-lg p-4 my-6`}>
      <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0 mt-0.5">{style.icon}</span>
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`text-xs font-semibold ${style.iconColor} mb-1`}>{title}</p>
          )}
          <div className="text-[13px] text-warm-600 dark:text-warm-400 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
