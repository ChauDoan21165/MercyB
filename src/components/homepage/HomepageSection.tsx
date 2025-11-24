import { useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';
import { AudioPlayer } from '@/components/AudioPlayer';

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
  audio: {
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
  audio,
}: HomepageSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.15,
    rootMargin: '-50px',
    freezeOnceVisible: true
  });
  const parallaxOffset = 0;

  // Determine if background is dark to use light text
  const isDarkBackground = (bgColor: string): boolean => {
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const textColor = isDarkBackground(backgroundColor) 
    ? 'rgba(248, 250, 252, 0.90)' 
    : 'rgba(0, 0, 0, 0.75)';
  
  const textColorVi = isDarkBackground(backgroundColor)
    ? 'rgba(248, 250, 252, 0.85)'
    : 'rgba(0, 0, 0, 0.70)';


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
          backgroundColor
        }}
      />

      <div className="max-w-[640px] mx-auto space-y-10">
        {/* English Section */}
        <div className="space-y-4">
          <h2
            className="text-[18px] sm:text-[22px] font-semibold leading-relaxed bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent max-w-[90%] mx-auto sm:max-w-full sm:mx-0"
          >
            {title.en}
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: textColor }}>
            {body.en}
          </p>
          <AudioPlayer
            audioPath={`/audio/${audio.en}`}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onEnded={() => setIsPlaying(false)}
          />
        </div>

        {/* Vietnamese Section */}
        <div className="space-y-4">
          <h3
            className="text-[16px] sm:text-[19px] font-semibold leading-relaxed bg-[image:var(--gradient-rainbow)] bg-clip-text text-transparent max-w-[90%] mx-auto sm:max-w-full sm:mx-0"
          >
            {title.vi}
          </h3>
          <p className="text-[15px] leading-relaxed" style={{ color: textColorVi }}>
            {body.vi}
          </p>
        </div>
      </div>
    </section>
  );
};
