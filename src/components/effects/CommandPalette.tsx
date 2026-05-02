import { useState, useEffect, useRef, useCallback } from 'react';

interface CommandItem {
  title: string;
  description: string;
  href: string;
  category: string;
  icon: string;
}

const commands: CommandItem[] = [
  { title: '首页', description: '回到首页', href: '/', category: '页面', icon: '🏠' },
  { title: '文章', description: '浏览所有文章', href: '/blog', category: '页面', icon: '📝' },
  { title: '项目', description: '查看开源项目', href: '/projects', category: '页面', icon: '🚀' },
  { title: '摄影', description: '摄影作品集', href: '/gallery', category: '页面', icon: '📷' },
  { title: '标签', description: '按标签浏览文章', href: '/tags', category: '页面', icon: '🏷️' },
  { title: '关于', description: '了解我', href: '/about', category: '页面', icon: '👋' },
  { title: 'Now', description: '我最近在做什么', href: '/now', category: '页面', icon: '📌' },
  { title: 'Uses', description: '我使用的工具和设备', href: '/uses', category: '页面', icon: '⚙️' },
  { title: '友链', description: '志同道合的朋友', href: '/links', category: '页面', icon: '🔗' },
  { title: '留言', description: '留下你的足迹', href: '/guestbook', category: '页面', icon: '💬' },
  { title: '从零搭建一个炫酷博客', description: '技术 · 5 分钟阅读', href: '/blog/hello-world', category: '文章', icon: '📄' },
  { title: '我为什么开始写博客', description: '随笔 · 8 分钟阅读', href: '/blog/why-i-write', category: '文章', icon: '📄' },
  { title: 'React Server Components 深度解析', description: '技术 · 12 分钟阅读', href: '/blog/rsc-deep-dive', category: '文章', icon: '📄' },
  { title: '京都的雨季', description: '生活 · 3 分钟阅读', href: '/blog/kyoto-rain', category: '文章', icon: '📄' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = commands.filter((cmd) => {
    const q = query.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.description.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const grouped = filtered.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  const flatList = filtered;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery('');
        setSelectedIndex(0);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (listRef.current) {
      const selected = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      selected?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  const handleSelect = (href: string) => {
    setOpen(false);
    window.location.href = href;
  };

  return (
    <>
      {/* Trigger hint in header — rendered separately */}
      {open && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-[#262626] rounded-2xl border border-warm-200 dark:border-warm-700 shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-warm-100 dark:border-warm-800">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warm-400 dark:text-warm-500 flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.min(i + 1, flatList.length - 1));
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedIndex((i) => Math.max(i - 1, 0));
                  } else if (e.key === 'Enter' && flatList[selectedIndex]) {
                    handleSelect(flatList[selectedIndex].href);
                  }
                }}
                placeholder="搜索页面、文章..."
                className="flex-1 bg-transparent text-sm text-warm-800 dark:text-warm-200 placeholder:text-warm-400 dark:placeholder:text-warm-600 outline-none"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono text-warm-400 dark:text-warm-500 bg-warm-100 dark:bg-warm-800 border border-warm-200 dark:border-warm-700">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <p className="px-5 py-1.5 text-[10px] font-mono tracking-wider uppercase text-warm-400 dark:text-warm-500">
                    {category}
                  </p>
                  {items.map((item) => {
                    const idx = flatList.indexOf(item);
                    return (
                      <button
                        key={item.href}
                        data-index={idx}
                        onClick={() => handleSelect(item.href)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                          idx === selectedIndex
                            ? 'bg-warm-50 dark:bg-warm-800/50'
                            : 'hover:bg-warm-50/50 dark:hover:bg-warm-800/30'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-warm-700 dark:text-warm-300 truncate">{item.title}</p>
                          <p className="text-[11px] text-warm-400 dark:text-warm-500 truncate">{item.description}</p>
                        </div>
                        {idx === selectedIndex && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-warm-400 dark:text-warm-500 flex-shrink-0">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
              {flatList.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-warm-400 dark:text-warm-500">没有找到结果</p>
                  <p className="text-[11px] text-warm-300 dark:text-warm-600 mt-1">试试其他关键词</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-warm-100 dark:border-warm-800 bg-warm-50/50 dark:bg-[#222222]">
              <span className="flex items-center gap-1 text-[10px] text-warm-400 dark:text-warm-500">
                <kbd className="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-warm-800 font-mono">↑↓</kbd>
                导航
              </span>
              <span className="flex items-center gap-1 text-[10px] text-warm-400 dark:text-warm-500">
                <kbd className="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-warm-800 font-mono">↵</kbd>
                打开
              </span>
              <span className="flex items-center gap-1 text-[10px] text-warm-400 dark:text-warm-500">
                <kbd className="px-1.5 py-0.5 rounded bg-warm-100 dark:bg-warm-800 font-mono">esc</kbd>
                关闭
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
