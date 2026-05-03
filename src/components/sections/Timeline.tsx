import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Badge from '../ui/Badge';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

gsap.registerPlugin(ScrollTrigger);

interface TimelinePost {
  date: string;
  title: string;
  category: string;
  slug: string;
}

interface TimelineProps {
  posts?: TimelinePost[];
}

const defaultPosts: TimelinePost[] = [
  { date: '2026-05-01', title: '从零搭建一个炫酷博客', category: '技术', slug: 'hello-world' },
  { date: '2026-04-28', title: '京都的雨季', category: '生活', slug: 'kyoto-rain' },
  { date: '2026-04-25', title: '我为什么开始写博客', category: '随笔', slug: 'why-i-write' },
  { date: '2026-04-20', title: 'React Server Components 深度解析', category: '技术', slug: 'rsc-deep-dive' },
];

export default function Timeline({ posts = defaultPosts }: TimelineProps) {
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <section className="section-padding relative transition-colors duration-500">
      <div className="max-w-3xl mx-auto relative">
        <div ref={timelineRef} className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[5px] top-0 bottom-0 w-px bg-warm-800" />

          {posts.map((post) => (
            <a
              key={post.slug}
              href={`${base}/blog/${post.slug}`}
              className="timeline-item opacity-0 block mb-10 last:mb-0 group"
            >
              {/* Dot */}
              <div className="absolute left-0 w-[11px] h-[11px] rounded-full border border-warm-600 bg-[#1c1c1c] group-hover:bg-white group-hover:border-white transition-all duration-300" />

              <div className="ml-4">
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[10px] text-warm-500 font-mono tracking-wider">
                    {formatDate(post.date)}
                  </span>
                  <Badge>{post.category}</Badge>
                </div>
                <h3 className="text-sm text-warm-400 group-hover:text-white transition-colors duration-300 link-draw">
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
