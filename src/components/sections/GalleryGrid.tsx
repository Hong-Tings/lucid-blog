import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Photo {
  id: number;
  alt: string;
  bg: string;
  emoji: string;
  span?: string;
}

const photos: Photo[] = [
  { id: 1, alt: '山景', bg: 'bg-warm-100 dark:bg-warm-800', emoji: '🏔️', span: 'row-span-2' },
  { id: 2, alt: '日落', bg: 'bg-warm-50 dark:bg-warm-900', emoji: '🌅' },
  { id: 3, alt: '樱花', bg: 'bg-warm-100 dark:bg-warm-800', emoji: '🌸' },
  { id: 4, alt: '海浪', bg: 'bg-warm-50 dark:bg-warm-900', emoji: '🌊', span: 'col-span-2' },
  { id: 5, alt: '城市', bg: 'bg-warm-100 dark:bg-warm-800', emoji: '🏙️' },
];

export default function GalleryGrid() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const items = gridRef.current.querySelectorAll('.gallery-item');
    gsap.fromTo(
      items,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      }
    );
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };

  const handleMouseLeave = (el: HTMLDivElement) => {
    el.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
  };

  return (
    <>
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className={`
              gallery-item opacity-0 rounded-xl overflow-hidden group cursor-pointer
              ${photo.span || ''}
            `}
            onClick={() => setLightbox(photo)}
          >
            <div
              className={`
                w-full h-full min-h-[180px] ${photo.bg}
                flex items-center justify-center text-4xl
                transition-transform duration-500 ease-out
              `}
              style={{ transition: 'transform 0.15s ease-out' }}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
            >
              <span className="group-hover:scale-125 transition-transform duration-500 ease-out">
                {photo.emoji}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
          style={{ animation: 'page-fade-in 0.3s ease both' }}
        >
          <div
            className="relative max-w-2xl w-full mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-card p-12 flex flex-col items-center gap-6">
              <span className="text-8xl">{lightbox.emoji}</span>
              <p className="text-lg font-display italic text-warm-700 dark:text-warm-300">{lightbox.alt}</p>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-warm-100 dark:bg-warm-800 flex items-center justify-center text-warm-500 dark:text-warm-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
