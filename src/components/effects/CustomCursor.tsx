import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const circleRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window) return;

    let mouseX = 0, mouseY = 0;
    let circleX = 0, circleY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);

    const updateInteractiveElements = () => {
      const elements = document.querySelectorAll('a, button, [data-cursor-hover]');
      elements.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
      return elements;
    };

    let elements = updateInteractiveElements();
    document.addEventListener('mousemove', onMouseMove);

    const observer = new MutationObserver(() => {
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
      elements = updateInteractiveElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function animate() {
      circleX += (mouseX - circleX) * 0.15;
      circleY += (mouseY - circleY) * 0.15;

      if (circleRef.current) {
        circleRef.current.style.left = `${circleX}px`;
        circleRef.current.style.top = `${circleY}px`;
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${mouseX}px`;
        dotRef.current.style.top = `${mouseY}px`;
      }

      requestAnimationFrame(animate);
    }
    animate();

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      elements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
      observer.disconnect();
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <div
        ref={circleRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{
          width: isHovering ? 50 : 30,
          height: isHovering ? 50 : 30,
          border: `1.5px solid ${isHovering ? 'rgba(167, 139, 250, 0.8)' : 'rgba(255, 255, 255, 0.5)'}`,
          borderRadius: '50%',
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1), height 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s',
        }}
      />
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"
      />
    </>
  );
}
