import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Interest {
  emoji: string;
  label: string;
  detail: string;
  story: string;
  image?: string;  // ← 可选：每个兴趣配一张图
}

const interests: Interest[] = [
  { emoji: '📷', label: '摄影', detail: '街头 · 风光 · 胶片', story: '高中时借了朋友的胶片机拍了一卷，从此入坑。喜欢街头摄影那种捕捉决定性瞬间的感觉，后来也开始拍风光和胶片，享受按下快门前认真构图的过程', image: '/images/interest-photo.jpg' },
  { emoji: '🎵', label: '音乐', detail: '电子 · Indie · Jazz', story: '写代码时必须有音乐，从电子乐入坑，后来慢慢听 Indie 和 Jazz。深夜一个人戴上耳机听 Beach House 的那种沉浸感，是其他东西给不了的' },
  { emoji: '☕', label: '咖啡', detail: '手冲 · 单品 · 拉花', story: '从速溶到手冲，从拿铁到单品，咖啡是每天的仪式感。周末磨豆、烧水、注水，看咖啡粉膨胀的过程很治愈', image: '/images/interest-coffee.jpg' },
  { emoji: '📚', label: '阅读', detail: '科技 · 哲学 · 小说', story: '比起短视频更喜欢读书，科技类帮我理解世界运作，哲学类让我思考人生意义，小说则纯粹是享受好故事' },
  { emoji: '🏔️', label: '徒步', detail: '山野 · 露营 · 星空', story: '第一次徒步是大学社团组织的，爬到山顶看到云海的那一刻就爱上了。露营时躺在帐篷外看星空，感觉城市里的焦虑都不重要了', image: '/images/interest-hiking.jpg' },
  { emoji: '🎮', label: '游戏', detail: 'RPG · 独立 · 策略', story: '从小学开始打游戏，从 PSP 到 PC，从 AAA 到独立游戏。好的游戏和好书一样，能带你去一个全新的世界体验另一种人生' },
  { emoji: '🍜', label: '美食', detail: '探店 · 烘焙 · 料理', story: '吃是最大的快乐之一。周末会去探各种小店，也会在家尝试烘焙和做饭，虽然经常翻车但过程很开心', image: '/images/interest-food.jpg' },
  { emoji: '✈️', label: '旅行', detail: '日本 · 东南亚 · 欧洲', story: '喜欢一个人或者和朋友去陌生的城市走走，不赶景点，就是随便逛逛、吃吃当地的东西、感受不一样的生活节奏' },
];

export default function Interests() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const items = containerRef.current.querySelectorAll('.interest-item');
    gsap.fromTo(
      items,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="space-y-2">
      {interests.map((item, i) => (
        <div
          key={item.label}
          className="interest-item opacity-0 bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-2xl hover:bg-white/[0.12] hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 cursor-default group overflow-hidden"
        >
          <div className={`flex items-stretch ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            {/* Optional image thumbnail */}
            {item.image && (
              <div className="hidden md:block w-32 lg:w-40 flex-shrink-0 overflow-hidden">
                {/*
                  替换：<img src={item.image} alt={item.label} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                */}
                <div className="w-full h-full min-h-[100px] bg-warm-800/50 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-warm-600 rotate-90 whitespace-nowrap">{item.image}</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className={`flex items-start gap-5 p-5 flex-1 min-w-0 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              {/* Emoji + Label */}
              <div className={`flex-shrink-0 text-center ${i % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                <span className="text-3xl block mb-1.5 group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                <p className="text-xs font-medium text-warm-300">{item.label}</p>
                <p className="text-[10px] text-warm-500 font-mono mt-0.5">{item.detail}</p>
              </div>
              {/* Story */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-warm-400 leading-[1.8]">{item.story}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
