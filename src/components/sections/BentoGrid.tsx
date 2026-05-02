import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from '../ui/Card';

gsap.registerPlugin(ScrollTrigger);

interface BentoItem {
  title?: string;
  content: string;
  sub?: string;
  emoji?: string;
  gradient?: string;
  link?: string;
  span?: string;
}

const items: BentoItem[] = [
  {
    title: '最新文章',
    content: '如何用 Three.js 做一个粒子宇宙',
    sub: '2026.05.01 · 技术',
    span: 'md:col-span-2',
    link: '/blog',
  },
  {
    emoji: '🎵',
    content: '正在听',
    sub: 'Midnight City — M83',
    gradient: 'from-amber-950/30 to-orange-950/30',
  },
  {
    title: '项目',
    content: '开源工具集',
    sub: '3 个仓库 →',
    gradient: 'from-red-950/20 to-orange-950/30',
    link: '/projects',
  },
  {
    emoji: '📷',
    content: '摄影',
    sub: '12 张照片',
    gradient: 'from-yellow-950/25 to-amber-950/25',
    link: '/gallery',
  },
  {
    title: '关于我',
    content: '全栈开发者 / 开源爱好者 / 摄影入门选手',
    span: 'md:col-span-2',
    link: '/about',
  },
];

export default function BentoGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.bento-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  return (
    <section className="section-padding">
      <div className="max-w-5xl mx-auto">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.link || '#'}
              className={`bento-card opacity-0 ${item.span || ''} group`}
            >
              <Card
                className={`h-full min-h-[140px] bg-gradient-to-br ${
                  item.gradient || 'from-surface to-surface-light'
                } flex flex-col justify-between hover:scale-[1.02] hover:border-primary/10 transition-all duration-500`}
              >
                <div>
                  {item.emoji && (
                    <div className="text-2xl mb-3">{item.emoji}</div>
                  )}
                  {item.title && (
                    <p className="text-[10px] text-primary/50 uppercase tracking-[0.2em] mb-2 font-mono">
                      {item.title}
                    </p>
                  )}
                  <p className="text-sm text-warm-200/80 group-hover:text-warm-50 transition-colors">
                    {item.content}
                  </p>
                </div>
                {item.sub && (
                  <p className="text-xs text-warm-400/40 mt-3">{item.sub}</p>
                )}
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
