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

  if (filtered.length === 0) return null;

  return (
    <nav className="p-4 bg-warm-50 dark:bg-[#262626] rounded-xl border-l border-warm-200 dark:border-warm-700">
      <p className="text-[10px] text-warm-400 dark:text-warm-500 mb-4 uppercase tracking-[0.2em] font-mono">目录</p>
      <ul className="space-y-2.5">
        {filtered.map((heading) => (
          <li
            key={heading.slug}
            style={{ paddingLeft: `${(heading.depth - 2) * 14}px` }}
          >
            <a
              href={`#${heading.slug}`}
              className="text-xs text-warm-400 dark:text-warm-500 hover:text-black dark:hover:text-white transition-colors duration-300"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
