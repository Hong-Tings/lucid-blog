import { useState, useRef, useEffect } from 'react';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  children,
  language = '',
  filename = '',
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = children.split('\n');

  return (
    <div className="code-block group relative rounded-xl overflow-hidden border border-warm-200 dark:border-warm-700 bg-[#fafafa] dark:bg-[#1a1a1a] my-6">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-warm-200 dark:border-warm-700 bg-warm-50 dark:bg-[#222222]">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          {/* Filename or language */}
          {filename ? (
            <span className="text-[11px] font-mono text-warm-500 dark:text-warm-400 tracking-wide">{filename}</span>
          ) : language ? (
            <span className="text-[10px] font-mono text-warm-400 dark:text-warm-500 tracking-wider uppercase">{language}</span>
          ) : null}
        </div>
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase text-warm-400 dark:text-warm-500 hover:text-warm-700 dark:hover:text-warm-300 hover:bg-warm-100 dark:hover:bg-warm-800 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, i) => (
              <tr key={i} className="hover:bg-warm-100/50 dark:hover:bg-white/[0.02] transition-colors">
                {showLineNumbers && (
                  <td className="text-right select-none w-10 px-3 py-0 align-top text-[12px] leading-[1.7] text-warm-300 dark:text-warm-600 font-mono border-r border-warm-100 dark:border-warm-800/50">
                    {i + 1}
                  </td>
                )}
                <td className="px-4 py-0 text-[13px] leading-[1.7] font-mono text-warm-700 dark:text-warm-300 whitespace-pre">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
