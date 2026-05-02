import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Badge from '../ui/Badge';
import { formatDate } from '../../lib/utils';

gsap.registerPlugin(ScrollTrigger);

interface TimelinePost {
  date: string;
  title: string;
  category: string;
  readTime: string;
  slug: string;
}

const posts: TimelinePost[] = [
  { date: '2026-05-01', title: '从零搭建一个炫酷博客', category: '技术', readTime: '5 分钟', slug: 'build-cool-blog' },
  { date: '2026-04-28', title: '京都的雨季', category: '生活', readTime: '3 分钟', slug: 'kyoto-rain' },
  { date: '2026-04-25', title: '我为什么开始写博客', category: '随笔', readTime: '8 分钟', slug: 'why-blog' },
  { date: '2026-04-20', title: 'React Server Components 深度解析', category: '技术', readTime: '12 分钟', slug: 'rsc-deep-dive' },
];

export default function Timeline() {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const items = timelineRef.current.querySelectorAll('.timeline-item');
    gsap.fromTo(
      items,
      { opacity: 0, x: -30 },
      {
        opacity: 1,
        x: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 75%',
        },
      }
    );
  }, []);

  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-14">
          <h2 className="text-xl font-display italic text-warm-50 tracking-tight">
            最新文章
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
        </div>

        <div ref={timelineRef} className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-accent/20 to-transparent" />

          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="timeline-item opacity-0 block mb-10 last:mb-0 group"
            >
              {/* Dot */}
              <div className="absolute left-0 w-[11px] h-[11px] rounded-full border border-primary/40 bg-surface-dark group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_12px_rgba(232,168,56,0.4)] transition-all duration-300" />

              <div className="ml-4">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[10px] text-warm-400/30 font-mono tracking-wider">
                    {formatDate(post.date)}
                  </span>
                  <Badge>{post.category}</Badge>
                  <span className="text-[10px] text-warm-400/30">{post.readTime}</span>
                </div>
                <h3 className="text-sm text-warm-200/60 group-hover:text-warm-50 transition-colors duration-300">
                  {post.title}
                </h3>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
