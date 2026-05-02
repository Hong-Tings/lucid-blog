import { useEffect, useRef } from 'react';

const shapes = [
  // Large shapes — more visible
  { type: 'triangle', size: 60, x: '5%', y: '15%', duration: 22, delay: 0, opacity: 0.06 },
  { type: 'circle', size: 40, x: '88%', y: '25%', duration: 26, delay: 2, opacity: 0.08 },
  { type: 'square', size: 50, x: '3%', y: '55%', duration: 24, delay: 4, opacity: 0.05 },
  { type: 'cross', size: 45, x: '92%', y: '70%', duration: 20, delay: 1, opacity: 0.07 },
  { type: 'ring', size: 70, x: '78%', y: '10%', duration: 28, delay: 3, opacity: 0.05 },
  // Medium shapes
  { type: 'diamond', size: 35, x: '15%', y: '80%', duration: 18, delay: 5, opacity: 0.06 },
  { type: 'dots', size: 50, x: '70%', y: '50%', duration: 30, delay: 2, opacity: 0.04 },
  { type: 'zigzag', size: 60, x: '50%', y: '85%', duration: 24, delay: 4, opacity: 0.04 },
  { type: 'circle', size: 25, x: '35%', y: '10%', duration: 20, delay: 6, opacity: 0.06 },
  { type: 'ring', size: 45, x: '20%', y: '40%', duration: 26, delay: 1, opacity: 0.04 },
];

function getShapeSVG(type: string, size: number, color: string) {
  switch (type) {
    case 'triangle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 3L22 21H2L12 3Z" stroke={color} strokeWidth="0.8" />
        </svg>
      );
    case 'circle':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" fill={color} />
        </svg>
      );
    case 'square':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" stroke={color} strokeWidth="0.8" transform="rotate(15 12 12)" />
        </svg>
      );
    case 'cross':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 3V21M3 12H21" stroke={color} strokeWidth="0.8" />
        </svg>
      );
    case 'ring':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="0.6" />
          <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="0.4" />
        </svg>
      );
    case 'diamond':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 2L22 12L12 22L2 12Z" stroke={color} strokeWidth="0.8" />
        </svg>
      );
    case 'dots':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="4" cy="4" r="1.5" fill={color} />
          <circle cx="12" cy="4" r="1.5" fill={color} />
          <circle cx="20" cy="4" r="1.5" fill={color} />
          <circle cx="4" cy="12" r="1.5" fill={color} />
          <circle cx="12" cy="12" r="1.5" fill={color} />
          <circle cx="20" cy="12" r="1.5" fill={color} />
          <circle cx="4" cy="20" r="1.5" fill={color} />
          <circle cx="12" cy="20" r="1.5" fill={color} />
          <circle cx="20" cy="20" r="1.5" fill={color} />
        </svg>
      );
    case 'zigzag':
      return (
        <svg width={size} height={size / 2} viewBox="0 0 40 20" fill="none">
          <path d="M0 10L8 2L16 18L24 2L32 18L40 10" stroke={color} strokeWidth="0.8" />
        </svg>
      );
    default:
      return null;
  }
}

export default function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    let mouseX = 0, mouseY = 0;
    const onMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('mousemove', onMove);

    let frame: number;
    const els = containerRef.current?.querySelectorAll('.floating-shape') || [];

    function animate() {
      els.forEach((el, i) => {
        const depth = 0.5 + i * 0.2;
        const offsetX = mouseX * 10 * depth;
        const offsetY = mouseY * 10 * depth;
        (el as HTMLElement).style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
      frame = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="floating-shape absolute"
          style={{
            left: shape.x,
            top: shape.y,
            opacity: shape.opacity,
            animation: `float-shape ${shape.duration}s ${shape.delay}s ease-in-out infinite`,
          }}
        >
          {getShapeSVG(shape.type, shape.size, '#9a9a9a')}
        </div>
      ))}

      {/* Large decorative gradient blobs */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          top: '-10%',
          right: '-5%',
          background: 'radial-gradient(circle, #d4a574 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style={{
          bottom: '10%',
          left: '-8%',
          background: 'radial-gradient(circle, #c9a87c 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      <style>{`
        @keyframes float-shape {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(12px, -18px) rotate(6deg); }
          50% { transform: translate(-8px, -28px) rotate(-4deg); }
          75% { transform: translate(-18px, -12px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
