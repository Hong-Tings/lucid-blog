import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const codeLines = [
  { indent: 0, text: 'const me = {', color: 'text-purple-400' },
  { indent: 1, key: 'name', value: '"Lucid"', color: 'text-green-400' },
  { indent: 1, key: 'role', value: '"Full-stack Developer"', color: 'text-green-400' },
  { indent: 1, key: 'location', value: '"China"', color: 'text-green-400' },
  { indent: 1, key: 'languages', value: '["TypeScript", "Rust", "Go"]', color: 'text-yellow-400' },
  { indent: 1, key: 'frameworks', value: '["React", "Astro", "Next.js"]', color: 'text-yellow-400' },
  { indent: 1, key: 'interests', value: '["开源", "设计", "摄影"]', color: 'text-yellow-400' },
  { indent: 1, key: 'coffee', value: 'true', color: 'text-orange-400' },
  { indent: 1, key: 'motto', value: '"少即是多"', color: 'text-green-400' },
  { indent: 0, text: '}', color: 'text-purple-400' },
  { indent: 0, text: '' },
  { indent: 0, text: 'export default me', color: 'text-purple-400' },
];

export default function AuthorCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power3.out' }
    );
  }, []);

  return (
    <section className="-mt-4 py-8 px-6 relative z-10">
      <div
        ref={cardRef}
        className="max-w-4xl mx-auto bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.2)] overflow-hidden"
      >
        <div className="flex flex-col md:flex-row">
          {/* Left — Avatar & Info */}
          <div className="md:w-48 flex-shrink-0 p-6 md:p-8 flex flex-row md:flex-col items-center md:items-start gap-4 md:border-r border-white/[0.06]">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl md:text-3xl font-display italic text-white/60">L</span>
            </div>
            <div className="md:mt-2">
              <h3 className="text-sm font-medium text-white">Lucid</h3>
              <p className="text-[11px] text-white/30 mt-0.5">开发者 · 创造者</p>
            </div>
            {/* Social links */}
            <div className="flex items-center gap-3 md:mt-auto">
              <a href="#" className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all" title="GitHub">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="#" className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all" title="Twitter">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="#" className="w-7 h-7 rounded-lg flex items-center justify-center text-white/25 hover:text-white/60 hover:bg-white/[0.06] transition-all" title="Email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          {/* Right — Code Block */}
          <div className="flex-1 p-5 md:p-6 font-mono text-[12px] md:text-[13px] leading-[1.8] overflow-x-auto">
            {codeLines.map((line, i) => (
              <div key={i} className="flex">
                {/* Line number */}
                <span className="w-8 text-right pr-4 text-white/10 select-none flex-shrink-0">
                  {i + 1}
                </span>
                {/* Code */}
                <span className="flex-1">
                  {line.text !== undefined ? (
                    <span className={line.color || 'text-white/40'}>{'  '.repeat(line.indent)}{line.text}</span>
                  ) : (
                    <span>
                      <span className="text-white/30">{'  '.repeat(line.indent)}</span>
                      <span className="text-white/50">{line.key}</span>
                      <span className="text-white/20">: </span>
                      <span className={line.color}>{line.value}</span>
                      {i < codeLines.length - 2 && <span className="text-white/20">,</span>}
                    </span>
                  )}
                </span>
              </div>
            ))}
            {/* Cursor blink */}
            <div className="flex mt-1">
              <span className="w-8 text-right pr-4 text-white/10 select-none flex-shrink-0">
                {codeLines.length + 1}
              </span>
              <span className="w-2 h-[14px] bg-white/40 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
