import Badge from '../ui/Badge';
import { formatDate } from '../../lib/utils';

interface Props {
  title: string;
  description: string;
  date: Date | string;
  category: string;
  slug: string;
  tags?: string[];
}

export default function PostCard({ title, description, date, category, slug, tags }: Props) {
  return (
    <a href={`/blog/${slug}`} className="group block py-6 border-b border-warm-200 dark:border-warm-800 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-warm-700 dark:text-warm-300 group-hover:text-black dark:group-hover:text-white transition-colors duration-300 mb-1 link-draw">
            {title}
          </h3>
          <p className="text-xs text-warm-400 dark:text-warm-500 line-clamp-2">{description}</p>
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className="text-[10px] text-warm-400 dark:text-warm-500 font-mono tracking-wider">{formatDate(date)}</span>
            <Badge>{category}</Badge>
            {tags && tags.length > 0 && (
              <div className="flex items-center gap-1.5">
                {tags.slice(0, 3).map((tag) => (
                  <a
                    key={tag}
                    href={`/tags/${tag}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[9px] font-mono tracking-wider text-warm-300 dark:text-warm-600 hover:text-warm-500 dark:hover:text-warm-400 transition-colors"
                  >
                    #{tag}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <svg
          className="w-3.5 h-3.5 text-warm-300 dark:text-warm-600 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
