interface Props {
  className?: string;
  flip?: boolean;
  color?: string;
  height?: number;
}

export default function WaveDivider({
  className = '',
  flip = false,
  color,
  height = 80,
}: Props) {
  const fillColor = color || 'currentColor';

  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}
      style={{ height }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-full"
        fill="none"
      >
        {/* Layer 1 - back wave */}
        <path
          d="M0,80 C240,120 480,40 720,80 C960,120 1200,40 1440,80 L1440,120 L0,120 Z"
          fill={fillColor}
          opacity="0.15"
        />
        {/* Layer 2 - mid wave */}
        <path
          d="M0,90 C360,50 720,110 1080,70 C1260,50 1380,80 1440,90 L1440,120 L0,120 Z"
          fill={fillColor}
          opacity="0.25"
        />
        {/* Layer 3 - front wave */}
        <path
          d="M0,100 C180,80 360,110 540,100 C720,90 900,110 1080,100 C1260,90 1380,105 1440,100 L1440,120 L0,120 Z"
          fill={fillColor}
          opacity="0.4"
        />
      </svg>
    </div>
  );
}
