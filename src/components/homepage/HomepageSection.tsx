import { useRef, useState } from 'react';
import { AudioPlayer } from '@/components/AudioPlayer';
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
  audio?: {
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
  const parallaxOffset = useParallax(sectionRef, 0.3);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "w-full py-16 px-6 transition-all duration-700 relative overflow-hidden",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-8"
      )}
    >
      {/* Parallax background layer */}
      <div 
        className="absolute inset-0 -z-10"
        style={{ 
          backgroundColor,
          transform: `translateY(${parallaxOffset}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      />
      <div className="max-w-[640px] mx-auto space-y-6">
        {/* Title */}
        <h2
          className="text-2xl font-semibold leading-relaxed"
          style={{ color: headingColor }}
        >
          {title.en}
        </h2>

        {/* English body */}
        <div className="space-y-4">
          <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
            {body.en}
          </p>
          
          {audio && (
            <AudioPlayer
              audioPath={`/audio/${audio.en}`}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onEnded={handleEnded}
              className="mt-4"
            />
          )}
        </div>

        {/* Vietnamese body */}
        <div className="space-y-4 pt-6 border-t border-gray-300/30 dark:border-gray-600/30">
          <p className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
            {body.vi}
          </p>
        </div>
      </div>
    </section>
  );
};
