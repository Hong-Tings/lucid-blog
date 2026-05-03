import { useEffect, useRef } from 'react';
import TextReveal from '../effects/TextReveal';
import GlowTypewriter from '../effects/GlowTypewriter';

export default function Hero() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const circles = svgRef.current.querySelectorAll('.hero-circle');
    circles.forEach((circle, i) => {
      const el = circle as SVGCircleElement;
      const length = el.getTotalLength();
      el.style.strokeDasharray = `${length}`;
      el.style.strokeDashoffset = `${length}`;
      el.style.transition = `stroke-dashoffset ${2 + i * 0.8}s cubic-bezier(0.16, 1, 0.3, 1) ${0.5 + i * 0.3}s`;
      requestAnimationFrame(() => {
        el.style.strokeDashoffset = '0';
      });
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* No frosted glass — let fluid canvas show through clearly */}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* SVG Animated circles */}
      <svg
        ref={svgRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none"
        viewBox="0 0 700 700"
        fill="none"
      >
        <circle className="hero-circle" cx="350" cy="350" r="250" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
        <circle className="hero-circle" cx="350" cy="350" r="350" stroke="currentColor" strokeWidth="0.5" opacity="0.08" />
        <circle className="hero-circle" cx="350" cy="350" r="150" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
      </svg>

      {/* Rotating ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <svg className="w-full h-full animate-[spin_60s_linear_infinite]" viewBox="0 0 600 600" fill="none">
          <circle cx="300" cy="300" r="298" stroke="currentColor" strokeWidth="0.3" strokeDasharray="8 12" opacity="0.1" />
        </svg>
      </div>

      {/* Corner marks */}
      <div className="absolute top-24 left-8 w-12 h-12 border-t border-l border-warm-700" />
      <div className="absolute bottom-24 right-8 w-12 h-12 border-b border-r border-warm-700" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <p className="text-[10px] tracking-[0.6em] uppercase text-warm-500 mb-10 font-mono">
          Welcome to my world
        </p>

        <TextReveal
          text="学习·试错·成长"
          className="text-6xl md:text-8xl lg:text-9xl font-display italic mb-8 justify-center text-white"
        />

        <p className="text-lg md:text-xl text-warm-400 mb-8 font-light">
          <GlowTypewriter text="Lucid · 清醒" speed={120} />
        </p>

        <p className="text-sm text-warm-400 leading-[1.9] max-w-xl mx-auto mb-14">
          学习是认知的输入，试错是实践的反馈，成长是两者循环迭代中实现的质变。
        </p>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <a href={`${import.meta.env.BASE_URL}/blog`} className="link-draw text-xs font-mono tracking-wider uppercase text-warm-300 hover:text-white transition-colors">
            阅读文章
          </a>
          <span className="text-warm-700">·</span>
          <a href={`${import.meta.env.BASE_URL}/projects`} className="link-draw text-xs font-mono tracking-wider uppercase text-warm-300 hover:text-white transition-colors">
            看看项目
          </a>
          <span className="text-warm-700">·</span>
          <a href={`${import.meta.env.BASE_URL}/about`} className="link-draw text-xs font-mono tracking-wider uppercase text-warm-300 hover:text-white transition-colors">
            了解更多
          </a>
        </div>
      </div>
    </section>
  );
}
