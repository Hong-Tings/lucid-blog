import ParticleBackground from '../effects/ParticleBackground';
import TextReveal from '../effects/TextReveal';
import TypewriterText from '../effects/TypewriterText';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <ParticleBackground />

      {/* Warm gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-dark/50 to-surface-dark" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark/40 via-transparent to-surface-dark/40" />

      {/* Warm glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/[0.04] rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-accent/[0.03] rounded-full blur-[100px]" />

      {/* Decorative circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-primary/[0.06] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-primary/[0.03] rounded-full" />

      {/* Horizontal accent lines */}
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <p className="text-[10px] tracking-[0.6em] uppercase text-primary/60 mb-10 font-mono">
          Welcome to my world
        </p>

        <TextReveal
          text="创造·探索·记录"
          className="text-6xl md:text-8xl lg:text-9xl font-display italic mb-8 justify-center text-warm-50"
        />

        <p className="text-lg md:text-xl text-warm-300/60 mb-20 font-light">
          <TypewriterText text="一个开发者的数字花园" speed={120} />
        </p>

        <div className="inline-flex flex-col items-center gap-3 text-xs text-warm-400/40 animate-float">
          <span className="tracking-[0.4em] uppercase font-mono text-[9px]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-primary/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
