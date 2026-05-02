import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  contentRef?: React.RefObject<HTMLElement | null>;
}

export default function ReadingProgress({ contentRef }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    // Count words in article content
    const article = contentRef?.current || document.querySelector('.prose');
    if (article) {
      const text = article.textContent || '';
      // Chinese chars + English words
      const chineseChars = (text.match(/[一-鿿]/g) || []).length;
      const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
      setWordCount(chineseChars + englishWords);
    }

    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setProgress(Math.min(100, (window.scrollY / docHeight) * 100));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [contentRef]);

  const readTime = Math.max(1, Math.ceil(wordCount / 400));

  return (
    <div className="flex items-center gap-4 text-[10px] font-mono text-warm-400 dark:text-warm-500">
      <span>{wordCount} 字</span>
      <span className="text-warm-200 dark:text-warm-700">·</span>
      <span>{readTime} 分钟阅读</span>
      <span className="text-warm-200 dark:text-warm-700">·</span>
      <span>{Math.round(progress)}% 已读</span>
    </div>
  );
}
