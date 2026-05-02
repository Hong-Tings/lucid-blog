import { useState } from 'react';
import { CATEGORIES } from '../../lib/constants';

interface Props {
  onFilterChange: (category: string) => void;
}

export default function CategoryFilter({ onFilterChange }: Props) {
  const [active, setActive] = useState('全部');

  return (
    <div className="flex flex-wrap gap-2 mb-10">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setActive(cat);
            onFilterChange(cat);
          }}
          className={`
            px-4 py-1.5 rounded-full text-xs transition-all duration-300
            ${active === cat
              ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
              : 'border border-warm-200 dark:border-warm-700 text-warm-500 dark:text-warm-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
