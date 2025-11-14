import { useEffect, useState, RefObject } from 'react';

export const useParallax = (elementRef: RefObject<HTMLElement>, speed: number = 0.5) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;
      
      const rect = elementRef.current.getBoundingClientRect();
      const elementTop = rect.top;
      const windowHeight = window.innerHeight;
      
      // Calculate parallax offset when element is in viewport
      if (elementTop < windowHeight && elementTop > -rect.height) {
        const scrolled = windowHeight - elementTop;
        const parallaxOffset = -scrolled * speed;
        setOffset(parallaxOffset);
      }
    };

    handleScroll(); // Initial calculation
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef, speed]);

  return offset;
};
