import { GlareHover } from '../magic-ui/GlareHover';
import { BlurFade } from '../magic-ui/BlurFade';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const accentColors = [
  'from-rose-100 to-orange-50 dark:from-rose-900/30 dark:to-orange-900/20',
  'from-sky-100 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/20',
  'from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20',
];

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
    <div>
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-xs font-mono tracking-[0.15em] uppercase text-warm-400 dark:text-warm-500">继续阅读</h3>
        <div className="flex-1 h-px bg-warm-100 dark:bg-warm-800" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {related.map((post, i) => (
          <BlurFade key={post.slug} delay={0.1 * i} duration={0.5} offset={8} direction="up" margin="-20px">
            <a
              href={`${base}/blog/${post.slug}`}
              className="group block rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02]"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(0,0,0,0.03),
                  0 2px 4px rgba(0,0,0,0.05),
                  0 12px 24px rgba(0,0,0,0.05)
                `,
                backdropFilter: 'blur(40px) saturate(2) brightness(1.05)',
                WebkitBackdropFilter: 'blur(40px) saturate(2) brightness(1.05)',
              }}
            >
              {/* Bento dark mode inner glow */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 dark:opacity-100 transition-opacity z-10"
                style={{
                  boxShadow: 'inset 0 -20px 80px -20px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06)',
                }}
              />

              {/* Mini color block with GlareHover */}
              <GlareHover
                color="#ffffff"
                opacity={0.12}
                size={200}
                duration={500}
                className={`h-24 bg-gradient-to-br ${accentColors[i % accentColors.length]} relative overflow-hidden`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-lg bg-white/20 dark:bg-white/[0.06] rotate-12 group-hover:rotate-6 transition-transform duration-700 animate-float" />
                </div>
              </GlareHover>

              <div className="p-4 relative z-20" style={{ background: 'var(--card-bg, rgba(255,255,255,0.15))' }}>
                <span className="text-[9px] font-mono tracking-wider uppercase text-warm-300 dark:text-warm-600 block mb-2">
                  {post.category}
                </span>
                <h4 className="text-sm text-warm-700 dark:text-warm-300 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug font-medium relative inline-block">
                  <span>{post.title}</span>
                  <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-warm-400 dark:bg-warm-500 group-hover:w-full transition-all duration-500 ease-out" />
                </h4>
                <p className="text-[11px] text-warm-400 dark:text-warm-500 mt-1.5 line-clamp-2 leading-relaxed">{post.description}</p>
              </div>

              {/* Hover darken */}
              <div className="absolute inset-0 rounded-2xl pointer-events-none transition-colors duration-300 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]" />
            </a>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
