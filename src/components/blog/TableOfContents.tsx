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
    <nav className="p-4 bg-white/[0.02] rounded-xl border-l border-primary/30">
      <p className="text-[10px] text-white/25 mb-4 uppercase tracking-[0.2em] font-mono">目录</p>
      <ul className="space-y-2.5">
        {filtered.map((heading) => (
          <li
            key={heading.slug}
            style={{ paddingLeft: `${(heading.depth - 2) * 14}px` }}
          >
            <a
              href={`#${heading.slug}`}
              className="text-xs text-white/35 hover:text-white/80 transition-colors duration-300"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
