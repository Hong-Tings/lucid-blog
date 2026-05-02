import { useState } from 'react';

interface NavItem {
  href: string;
  label: string;
}

interface Props {
  items: readonly NavItem[];
}

export default function Navigation({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-sm text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-white transition-colors duration-300 relative group"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary dark:bg-white group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </div>

      {/* Mobile Toggle */}
      <button
        className="md:hidden text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white/95 dark:bg-[#1c1c1c]/95 backdrop-blur-xl border-b border-warm-200/40 dark:border-warm-700/40 p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-warm-500 dark:text-warm-400 hover:text-warm-800 dark:hover:text-white transition-colors text-lg"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
