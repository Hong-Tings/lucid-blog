import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface TechItem {
  name: string;
  icon: string;
  category: string;
  story: string;
}

const stack: TechItem[] = [
  { name: 'TypeScript', icon: 'TS', category: '语言', story: '从 JavaScript 转过来的，类型系统让我少踩了无数坑，现在写任何项目都首选 TS' },
  { name: 'React', icon: 'Re', category: '前端', story: '大二时跟着官方文档入门，从此组件化思维深入骨髓，生态也是真的强' },
  { name: 'Astro', icon: 'As', category: '框架', story: '这个博客就是用 Astro 搭的，岛屿架构让页面加载飞快，开发体验极好' },
  { name: 'Tailwind', icon: 'Tw', category: '样式', story: '一开始觉得类名太长很丑，用了两周就真香了，再也不想回去写 CSS 文件' },
  { name: 'Node.js', icon: 'Nj', category: '后端', story: '前端同学学后端的最短路径，写 CLI 工具、搭 API 都靠它' },
  { name: 'Go', icon: 'Go', category: '后端', story: '被编译速度和并发模型吸引，写过几个小服务，语法简单但很实用' },
  { name: 'Python', icon: 'Py', category: '工具', story: '大学第一门编程语言，现在主要用来写脚本、处理数据和搞自动化' },
  { name: 'Docker', icon: 'Dr', category: '部署', story: '告别"在我电脑上能跑"，部署从此不再是噩梦' },
  { name: 'Git', icon: 'Gt', category: '工具', story: '版本管理的基石，从只会 add/commit/push 到现在能熟练 rebase 和 cherry-pick' },
  { name: 'Figma', icon: 'Fi', category: '设计', story: '虽然是开发者，但自己设计稿子能更好地把控细节，Figma 的组件系统很上瘾' },
  { name: 'Linux', icon: 'Lx', category: '系统', story: '从 Ubuntu 入坑，现在日常用 Arch，终端操作已经成为肌肉记忆' },
  { name: 'Neovim', icon: 'Nv', category: '编辑器', story: '从 VSCode 转到 Neovim 花了一个月适应，但现在手不离键盘的感觉太爽了' },
];

export default function TechStack() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.tech-card');
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {stack.map((tech) => (
        <div
          key={tech.name}
          className="tech-card opacity-0 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-2xl p-4 flex items-start gap-4 hover:bg-white/[0.12] hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-default group"
        >
          <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center text-[11px] font-mono font-bold tracking-tight flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            {tech.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-warm-300">{tech.name}</span>
              <span className="text-[9px] text-warm-500 font-mono tracking-wider px-1.5 py-0.5 rounded bg-warm-800">{tech.category}</span>
            </div>
            <p className="text-[11px] text-warm-400 leading-relaxed">{tech.story}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
