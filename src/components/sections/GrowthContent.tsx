import { useState, useEffect } from 'react';
import LiquidTabs from '../effects/LiquidTabs';

const tabs = [
  { id: 'timeline', label: '时间线', icon: '📅' },
  { id: 'skills', label: '技能树', icon: '🌳' },
  { id: 'yearly', label: '年度总结', icon: '📊' },
];

const milestones = [
  { year: '2022', title: '写下第一行代码', description: 'Hello World 打开了新世界的大门。', icon: '💻' },
  { year: '2022', title: '前端三件套', description: 'HTML、CSS、JavaScript — 万丈高楼平地起。', icon: '🌐' },
  { year: '2023', title: '入坑 React', description: '组件化思维彻底改变了我对前端的认知。', icon: '⚛️' },
  { year: '2023', title: '第一个开源项目', description: '在 GitHub 上发布了第一个获得 star 的项目。', icon: '🌟' },
  { year: '2024', title: '全栈转型', description: '开始接触后端，学会了 Node.js 和数据库。', icon: '🔧' },
  { year: '2024', title: '搭建个人博客', description: '用 Astro + React 打造了这个数字花园。', icon: '✍️' },
  { year: '2025', title: '深入系统编程', description: '开始学习 Rust，探索底层世界。', icon: '🦀' },
  { year: '2025', title: '独立开发者', description: '开始做自己的产品，享受创造的乐趣。', icon: '🚀' },
];

const skills = [
  { name: 'TypeScript', level: 5, category: '语言', icon: '📘' },
  { name: 'Rust', level: 2, category: '语言', icon: '🦀' },
  { name: 'Go', level: 3, category: '语言', icon: '🐹' },
  { name: 'Python', level: 3, category: '语言', icon: '🐍' },
  { name: 'React', level: 5, category: '前端', icon: '⚛️' },
  { name: 'Astro', level: 4, category: '前端', icon: '🚀' },
  { name: 'Next.js', level: 4, category: '前端', icon: '▲' },
  { name: 'Tailwind CSS', level: 5, category: '前端', icon: '🎨' },
  { name: 'Node.js', level: 4, category: '后端', icon: '🟢' },
  { name: 'PostgreSQL', level: 3, category: '后端', icon: '🐘' },
  { name: 'Docker', level: 3, category: '工具', icon: '🐳' },
  { name: 'Git', level: 4, category: '工具', icon: '📦' },
  { name: 'Linux', level: 3, category: '工具', icon: '🐧' },
  { name: 'Figma', level: 3, category: '设计', icon: '🎯' },
];

const yearSummaries = [
  {
    year: '2025',
    highlight: '独立开发者',
    stats: [
      { label: '文章', value: '24' },
      { label: '项目', value: '6' },
      { label: '开源贡献', value: '120+' },
    ],
    description: '从打工人的身份中跳出来，开始做自己的产品。学会了独立思考、独立决策、独立承担。这一年的成长比过去三年加起来还多。',
  },
  {
    year: '2024',
    highlight: '全栈突破',
    stats: [
      { label: '文章', value: '18' },
      { label: '项目', value: '4' },
      { label: '新技术', value: '8' },
    ],
    description: '从前端走向全栈，第一次完整地从零搭建了一个线上产品。理解了"全栈"不只是技术栈的扩展，更是思维方式的升级。',
  },
  {
    year: '2023',
    highlight: '开源启蒙',
    stats: [
      { label: '文章', value: '12' },
      { label: '项目', value: '3' },
      { label: 'GitHub Stars', value: '500+' },
    ],
    description: '第一次在 GitHub 上发布项目，第一次收到 PR，第一次被陌生人感谢。开源社区让我感受到了技术的温度。',
  },
];

const skillCategories = [...new Set(skills.map(s => s.category))];

function TimelineSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const active = selected !== null ? milestones[selected] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <div className="overflow-x-auto pt-24 pb-12 -mx-2 px-2">
        <div className="relative min-w-max px-12">
          {/* Single horizontal line */}
          <div className="absolute top-1/2 left-12 right-12 h-px bg-warm-200 dark:bg-warm-700 -translate-y-1/2" />

          {/* Nodes */}
          <div className="flex items-center gap-24 relative z-10">
            {milestones.map((m, i) => (
              <div key={i} className="relative group flex flex-col items-center">
                <button
                  onClick={() => setSelected(i)}
                  className="w-10 h-10 rounded-full bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-warm-200 dark:border-white/10 flex items-center justify-center cursor-pointer hover:scale-125 hover:border-warm-400 dark:hover:border-white/20 transition-all duration-300"
                  style={{ WebkitBackdropFilter: 'blur(12px)' }}
                >
                  <span className="text-base">{m.icon}</span>
                </button>

                {/* Hover tooltip */}
                <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                  <div className="text-[11px] font-medium text-warm-600 dark:text-warm-300 whitespace-nowrap px-2 py-1 rounded-md bg-white/80 dark:bg-white/[0.08] backdrop-blur-md border border-warm-200 dark:border-white/[0.06]" style={{ WebkitBackdropFilter: 'blur(12px)' }}>
                    {m.title}
                  </div>
                </div>

                {/* Year label below (only show when year changes) */}
                {(i === 0 || m.year !== milestones[i - 1].year) && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-wider text-warm-400 dark:text-warm-600 whitespace-nowrap">
                    {m.year}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal — small frosted glass card */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div className="absolute inset-0 bg-black/20 dark:bg-black/30 backdrop-blur-sm" />
          <div
            className="relative max-w-xs w-full rounded-xl p-5 animate-[modalIn_0.25s_ease-out] bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl border border-warm-200 dark:border-white/[0.1] shadow-lg dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            style={{ backdropFilter: 'blur(40px) saturate(1.5)', WebkitBackdropFilter: 'blur(40px) saturate(1.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl">{active.icon}</span>
              <div>
                <h3 className="text-sm font-medium text-warm-800 dark:text-warm-200">{active.title}</h3>
                <span className="text-[10px] font-mono text-warm-400">{active.year}</span>
              </div>
            </div>
            <p className="text-xs text-warm-500 dark:text-warm-400 leading-[1.8] mt-3">{active.description}</p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
}

function SkillsSection() {
  return (
    <div className="space-y-8">
      {skillCategories.map((cat) => (
        <div key={cat}>
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-warm-400 dark:text-warm-500 mb-4">{cat}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.filter(s => s.category === cat).map((skill) => (
              <div key={skill.name} className="bg-white dark:bg-[#262626] border border-warm-200 dark:border-warm-700 p-4 rounded-xl group hover:border-warm-300 dark:hover:border-warm-600 transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">{skill.icon}</span>
                  <span className="text-sm text-warm-700 dark:text-warm-300 font-medium">{skill.name}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((l) => (
                    <div key={l} className={`h-1.5 flex-1 rounded-full ${l <= skill.level ? 'bg-warm-400 dark:bg-warm-500' : 'bg-warm-100 dark:bg-warm-800'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function YearlySection() {
  return (
    <div className="space-y-6">
      {yearSummaries.map((ys) => (
        <div key={ys.year} className="bg-white dark:bg-[#262626] border border-warm-200 dark:border-warm-700 rounded-2xl p-6 md:p-8 group hover:border-warm-300 dark:hover:border-warm-600 transition-all">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-shrink-0">
              <div className="text-4xl font-display italic text-warm-200 dark:text-warm-700 leading-none">{ys.year}</div>
              <p className="text-[10px] font-mono tracking-wider text-warm-400 dark:text-warm-500 mt-1">{ys.highlight}</p>
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-4 mb-4">
                {ys.stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-display italic text-warm-800 dark:text-warm-200">{stat.value}</div>
                    <p className="text-[9px] font-mono tracking-wider uppercase text-warm-400 dark:text-warm-500">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-warm-500 dark:text-warm-400 leading-[1.8]">{ys.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GrowthContent() {
  const [activeTab, setActiveTab] = useState('timeline');

  return (
    <div>
      {/* Tab bar */}
      <div className="flex justify-center mb-10">
        <LiquidTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Tab content */}
      <div className="min-h-[400px]">
        {activeTab === 'timeline' && <TimelineSection />}
        {activeTab === 'skills' && <SkillsSection />}
        {activeTab === 'yearly' && <YearlySection />}
      </div>
    </div>
  );
}
