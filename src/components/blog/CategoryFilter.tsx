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
              ? 'bg-primary text-surface-dark font-semibold'
              : 'border border-warm-700/20 text-warm-400/40 hover:border-primary/20 hover:text-warm-200'
            }
          `}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
