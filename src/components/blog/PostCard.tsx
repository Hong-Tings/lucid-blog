import Badge from '../ui/Badge';
import { formatDate } from '../../lib/utils';

interface Props {
  title: string;
  description: string;
  date: Date | string;
  category: string;
  slug: string;
}

export default function PostCard({ title, description, date, category, slug }: Props) {
  return (
    <a href={`/blog/${slug}`} className="group block py-6 border-b border-white/[0.04] last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors duration-300 mb-1">
            {title}
          </h3>
          <p className="text-xs text-white/30 line-clamp-2">{description}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[10px] text-white/20 font-mono tracking-wider">{formatDate(date)}</span>
            <Badge>{category}</Badge>
          </div>
        </div>
        <svg
          className="w-3.5 h-3.5 text-white/15 group-hover:text-white/50 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0 mt-2"
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
