import { useState, useEffect } from 'react';

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

export default function TableOfContents({ headings }: Props) {
  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px' }
    );

    filtered.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  if (filtered.length === 0) return null;

  return (
    <nav className="relative">
      <p className="text-[10px] text-warm-300 dark:text-warm-600 mb-4 uppercase tracking-[0.2em] font-mono">目录</p>
      <div className="relative">
        {/* Track line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-warm-100 dark:bg-warm-800" />

        <ul className="space-y-1">
          {filtered.map((heading) => {
            const isActive = activeId === heading.slug;
            return (
              <li
                key={heading.slug}
                style={{ paddingLeft: `${(heading.depth - 2) * 12 + 12}px` }}
              >
                <a
                  href={`#${heading.slug}`}
                  className={`block py-1 text-xs transition-colors duration-200 relative ${
                    isActive
                      ? 'text-warm-800 dark:text-warm-200 font-medium'
                      : 'text-warm-400 dark:text-warm-600 hover:text-warm-600 dark:hover:text-warm-400'
                  }`}
                >
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute -left-px top-1/2 -translate-y-1/2 w-[3px] h-3 rounded-full bg-warm-400 dark:bg-warm-500" />
                  )}
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
