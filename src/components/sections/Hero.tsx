import ParticleBackground from '../effects/ParticleBackground';
import TextReveal from '../effects/TextReveal';
import TypewriterText from '../effects/TypewriterText';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <ParticleBackground />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/30 via-transparent to-surface-dark/30" />

      {/* Decorative line */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/[0.03] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/[0.02] rounded-full" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <p className="text-[10px] tracking-[0.5em] uppercase text-white/30 mb-8 font-mono">
          Welcome to my world
        </p>

        <TextReveal
          text="创造·探索·记录"
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-8 justify-center"
        />

        <p className="text-lg md:text-xl text-white/40 mb-16 font-light">
          <TypewriterText text="一个开发者的数字花园" speed={120} />
        </p>

        <div className="inline-flex flex-col items-center gap-3 text-xs text-white/25 animate-float">
          <span className="tracking-[0.3em] uppercase">Scroll</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-50">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
