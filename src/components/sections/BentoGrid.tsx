import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Card from '../ui/Card';
import { useMagnetic } from '../effects/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

interface BentoItem {
  title?: string;
  content: string;
  sub?: string;
  emoji?: string;
  link?: string;
  span?: string;
  image?: string;      // 背景图片路径
  imageAlt?: string;
  darkOverlay?: boolean; // 是否需要暗色遮罩让文字可读
}

const items: BentoItem[] = [
  {
    title: '最新文章',
    content: '如何用 Three.js 做一个粒子宇宙',
    sub: '2026.05.01 · 技术',
    span: 'md:col-span-2',
    link: `${base}/blog`,
  },
  {
    emoji: '🎵',
    content: '正在听',
    sub: 'Midnight City — M83',
  },
  {
    emoji: '🎮',
    content: '在玩',
    sub: 'Elden Ring · 塞尔达',
  },
  {
    title: '成长',
    content: '从 Hello World 到独立开发者',
    sub: '看看我的成长轨迹 →',
    link: `${base}/growth`,
    span: 'md:col-span-2',
  },
];

function MagneticBentoCard({ item }: { item: BentoItem }) {
  const magneticRef = useMagnetic({ strength: 0.15, maxTilt: 4 });
  const hasImage = !!item.image;

  return (
    <a
      href={item.link || '#'}
      className={`bento-card opacity-0 ${item.span || ''} group block`}
    >
      <div ref={magneticRef} className="h-full">
        {hasImage ? (
          /* Image-backed card */
          <div className="h-full min-h-[180px] overflow-hidden relative group rounded-2xl border border-white/[0.12] backdrop-blur-md bg-white/[0.08] hover:bg-white/[0.12] hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500">
            {/* Background image */}
            <div className="absolute inset-0">
              {/*
                替换：取消注释并删除占位
                <img src={item.image} alt={item.imageAlt || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              */}
              <div className="w-full h-full bg-warm-800/50 flex items-center justify-center">
                <span className="text-xs font-mono text-warm-600">{item.image}</span>
              </div>
            </div>
            {/* Dark overlay for text readability */}
            {item.darkOverlay && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            )}
            {/* Content on top of image */}
            <div className="relative z-10 h-full flex flex-col justify-end p-5">
              {item.title && (
                <p className={`text-[10px] uppercase tracking-[0.2em] mb-1 font-mono ${item.darkOverlay ? 'text-white/60' : 'text-warm-400 dark:text-warm-500'}`}>
                  {item.title}
                </p>
              )}
              <p className={`text-sm font-medium ${item.darkOverlay ? 'text-white' : 'text-warm-700 dark:text-warm-300 group-hover:text-black dark:group-hover:text-white transition-colors'}`}>
                {item.content}
              </p>
              {item.sub && (
                <p className={`text-xs mt-1 ${item.darkOverlay ? 'text-white/50' : 'text-warm-400 dark:text-warm-500'}`}>{item.sub}</p>
              )}
            </div>
          </div>
        ) : (
          /* Regular card */
          <Card className="h-full min-h-[140px] flex flex-col justify-between bg-white/[0.08] backdrop-blur-md border-white/[0.12] hover:bg-white/[0.12] hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500">
            <div>
              {item.emoji && (
                <div className="text-2xl mb-3">{item.emoji}</div>
              )}
              {item.title && (
                <p className="text-[10px] text-warm-500 uppercase tracking-[0.2em] mb-2 font-mono">
                  {item.title}
                </p>
              )}
              <p className="text-sm text-warm-300 group-hover:text-white transition-colors">
                {item.content}
              </p>
            </div>
            {item.sub && (
              <p className="text-xs text-warm-500 mt-3">{item.sub}</p>
            )}
          </Card>
        )}
      </div>
    </a>
  );
}

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
    <div ref={gridRef} className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <MagneticBentoCard key={i} item={item} />
      ))}
    </div>
  );
}
