import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Photo {
  id: number;
  alt: string;
  gradient: string;
  emoji: string;
  span?: string;
}

const photos: Photo[] = [
  { id: 1, alt: '山景', gradient: 'from-indigo-950 to-blue-950', emoji: '🏔️', span: 'row-span-2' },
  { id: 2, alt: '日落', gradient: 'from-orange-950 to-red-950', emoji: '🌅' },
  { id: 3, alt: '樱花', gradient: 'from-pink-950 to-rose-950', emoji: '🌸' },
  { id: 4, alt: '海浪', gradient: 'from-cyan-950 to-blue-950', emoji: '🌊', span: 'col-span-2' },
  { id: 5, alt: '城市', gradient: 'from-slate-900 to-zinc-900', emoji: '🏙️' },
];

export default function GalleryGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className={`
            gallery-item opacity-0 rounded-xl overflow-hidden group cursor-pointer
            ${photo.span || ''}
          `}
        >
          <div
            className={`
              w-full h-full min-h-[180px] bg-gradient-to-br ${photo.gradient}
              flex items-center justify-center text-4xl
              group-hover:scale-110 transition-transform duration-700 ease-out
            `}
          >
            {photo.emoji}
          </div>
        </div>
      ))}
    </div>
  );
}
