import { useRef } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useParallax } from '@/hooks/useParallax';
import { cn } from '@/lib/utils';

interface HomepageSectionProps {
  id: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  title: {
    en: string;
    vi: string;
  };
  body: {
    en: string;
    vi: string;
  };
}

export const HomepageSection = ({
  id,
  backgroundColor,
  headingColor,
  accentColor,
  title,
  body,
}: HomepageSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.15,
    rootMargin: '-50px',
    freezeOnceVisible: true
  });
  const parallaxOffset = useParallax(sectionRef, 0.2);
  
  // Make section background a subtle tint instead of a solid block
  const toRGBA = (hex: string, alpha = 0.02) => {
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "w-full py-12 px-6 transition-all duration-700 relative overflow-hidden",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      )}
    >
      {/* Parallax background layer */}
      <div 
        className="absolute inset-0 -z-10"
        style={{ 
          backgroundColor: toRGBA(backgroundColor, 0.02),
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      <div className="max-w-[640px] mx-auto space-y-10">
        {/* English Section */}
        <div className="space-y-4">
          <h2
            className="text-[22px] font-semibold leading-relaxed"
            style={{ color: headingColor }}
          >
            {title.en}
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
            {body.en}
          </p>
        </div>

        {/* Vietnamese Section */}
        <div className="space-y-4">
          <h3
            className="text-[19px] font-semibold leading-relaxed"
            style={{ color: `${headingColor}cc` }}
          >
            {title.vi}
          </h3>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(0, 0, 0, 0.70)' }}>
            {body.vi}
          </p>
        </div>
      </div>
    </section>
  );
};
