import { formatDate } from '../../lib/utils';
import { GlareHover } from '../magic-ui/GlareHover';
import { BlurFade } from '../magic-ui/BlurFade';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

const accentColors = [
  'from-rose-100 to-orange-50 dark:from-rose-900/30 dark:to-orange-900/20',
  'from-sky-100 to-cyan-50 dark:from-sky-900/30 dark:to-cyan-900/20',
  'from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/20',
  'from-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:to-emerald-900/20',
  'from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-amber-900/20',
  'from-pink-100 to-fuchsia-50 dark:from-pink-900/30 dark:to-fuchsia-900/20',
];

interface Props {
  title: string;
  description: string;
  date: Date | string;
  category: string;
  slug: string;
  tags?: string[];
  index?: number;
  large?: boolean;
  compact?: boolean;
}

export default function PostCard({ title, description, date, category, slug, tags, index = 0, large = false, compact = false }: Props) {
  const color = accentColors[index % accentColors.length];
  const imgHeight = large ? 'h-56 md:h-64' : compact ? 'h-28' : 'h-40';

  return (
    <BlurFade delay={0.04 * index} duration={0.5} offset={8} direction="up" margin="-20px">
      <a href={`${base}/blog/${slug}`} className="group block">
        <div
          className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]"
          style={{
            boxShadow: `
              0 0 0 1px rgba(0,0,0,0.03),
              0 2px 4px rgba(0,0,0,0.05),
              0 12px 24px rgba(0,0,0,0.05)
            `,
            backdropFilter: 'blur(40px) saturate(2) brightness(1.05)',
            WebkitBackdropFilter: 'blur(40px) saturate(2) brightness(1.05)',
            background: 'var(--card-bg, rgba(255,255,255,0.15))',
          }}
        >
          {/* Bento-style dark mode inner glow */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 dark:opacity-100 transition-opacity"
            style={{
              boxShadow: 'inset 0 -20px 80px -20px rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.06)',
            }}
          />

          {/* Image area with GlareHover */}
          <GlareHover
            color="#ffffff"
            opacity={0.4}
            size={compact ? 200 : 300}
            duration={600}
            className={`relative ${imgHeight} bg-gradient-to-br ${color} overflow-hidden`}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`${compact ? 'w-8 h-8 rounded-xl' : 'w-14 h-14 rounded-2xl'} bg-white/25 dark:bg-white/[0.06] rotate-12 group-hover:rotate-6 transition-transform duration-700 animate-float`} style={{ animationDelay: '0s' }} />
              <div className={`absolute ${compact ? 'w-6 h-6' : 'w-10 h-10'} rounded-full bg-white/20 dark:bg-white/[0.05] -translate-x-5 translate-y-6 group-hover:translate-y-3 transition-transform duration-700 animate-float`} style={{ animationDelay: '1s' }} />
              {large && (
                <div className="absolute w-8 h-8 rounded-lg bg-white/15 dark:bg-white/[0.04] translate-x-8 -translate-y-4 group-hover:-translate-y-6 transition-transform duration-700 animate-float" style={{ animationDelay: '2s' }} />
              )}
            </div>

            {/* Category tag */}
            <div className={compact ? 'absolute top-2.5 left-2.5' : 'absolute top-4 left-4'}>
              <span className={`inline-flex items-center ${compact ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-0.5 text-[10px]'} rounded-full font-medium tracking-wider bg-white/60 dark:bg-black/30 backdrop-blur-md text-warm-700 dark:text-warm-200 border border-white/40 dark:border-white/[0.08] group-hover:bg-white/80 transition-colors duration-300`}>
                {category}
              </span>
            </div>
          </GlareHover>

          {/* Content — slides up on hover (Bento CTA reveal) */}
          <div className={compact ? 'p-3.5' : large ? 'p-7' : 'p-5'}>
            <div className="pointer-events-none transform-gpu transition-all duration-300 group-hover:-translate-y-2">
              <div className="flex items-center gap-2 mb-2">
                <span className={`${compact ? 'text-[9px]' : 'text-[10px]'} text-warm-400 font-mono tracking-wider`}>{formatDate(date)}</span>
              </div>

              <h3 className={`${large ? 'text-lg' : compact ? 'text-[13px]' : 'text-sm'} font-medium text-warm-800 dark:text-warm-200 leading-snug mb-1.5 relative inline-block`}>
                <span className="group-hover:text-black dark:group-hover:text-white transition-colors duration-300">{title}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-warm-400 dark:bg-warm-500 group-hover:w-full transition-all duration-500 ease-out" />
              </h3>

              {!compact && (
                <p className="text-xs text-warm-400 dark:text-warm-500 line-clamp-2 leading-relaxed">{description}</p>
              )}
            </div>

            {!compact && (
              <div className="flex items-center justify-between mt-3">
                {tags && tags.length > 0 && (
                  <div className="flex items-center gap-1.5 pointer-events-none">
                    {tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[9px] font-mono tracking-wider text-warm-300 dark:text-warm-600">#{tag}</span>
                    ))}
                  </div>
                )}
                {/* Read more — slides in on hover */}
                <span className="ml-auto text-[10px] font-mono text-warm-300 dark:text-warm-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 ease-out flex items-center gap-1">
                  阅读
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            )}
          </div>

          {/* Hover darken overlay (Bento style) */}
          <div className="absolute inset-0 rounded-2xl pointer-events-none transition-colors duration-300 group-hover:bg-black/[0.02] dark:group-hover:bg-white/[0.02]" />
        </div>
      </a>
    </BlurFade>
  );
}
