import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      ta.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: '微博',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.739 5.443zM20.196 9.4a4.07 4.07 0 0 0-3.168-1.176l-.002.001c-.37.047-.622.39-.575.76.047.37.392.622.76.576a2.53 2.53 0 0 1 1.968.732 2.53 2.53 0 0 1 .55 2.006c-.075.365.157.724.522.799.366.075.725-.157.8-.522A4.07 4.07 0 0 0 20.196 9.4z" />
        </svg>
      ),
      href: `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono tracking-wider uppercase text-warm-400 dark:text-warm-500 mr-1">分享</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-warm-400 dark:text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800 transition-all duration-200"
          title={`分享到${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={handleCopy}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-warm-400 dark:text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800 transition-all duration-200"
        title="复制链接"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
    </div>
  );
}
