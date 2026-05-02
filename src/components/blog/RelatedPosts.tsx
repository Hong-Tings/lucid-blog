interface RelatedPost {
  title: string;
  description: string;
  slug: string;
  category: string;
}

interface RelatedPostsProps {
  currentSlug: string;
  posts: RelatedPost[];
}

export default function RelatedPosts({ currentSlug, posts }: RelatedPostsProps) {
  const related = posts.filter((p) => p.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <div className="mt-16 pt-10 border-t border-warm-100 dark:border-warm-800">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-sm font-display italic text-warm-800 dark:text-warm-200 tracking-tight">继续阅读</h3>
        <div className="flex-1 h-px bg-warm-100 dark:bg-warm-800" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {related.map((post) => (
          <a
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-4 rounded-xl border border-warm-100 dark:border-warm-800 hover:border-warm-300 dark:hover:border-warm-600 transition-all duration-300"
          >
            <span className="text-[9px] font-mono tracking-wider uppercase text-warm-400 dark:text-warm-500 mb-2 block">
              {post.category}
            </span>
            <h4 className="text-sm text-warm-700 dark:text-warm-300 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
              {post.title}
            </h4>
            <p className="text-[11px] text-warm-400 dark:text-warm-500 mt-1.5 line-clamp-2">{post.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
