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
  const [currentAudio, setCurrentAudio] = useState<'en' | 'vi' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.15,
    rootMargin: '-50px',
    freezeOnceVisible: true
  });
  const parallaxOffset = 0;


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
            className="text-[22px] font-semibold leading-relaxed"
            style={{ color: headingColor }}
          >
            {title.en}
          </h2>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
            {body.en}
          </p>
          <AudioPlayer
            audioPath={`/audio/${audio.en}`}
            isPlaying={currentAudio === 'en' && isPlaying}
            onPlayPause={() => {
              if (currentAudio === 'en' && isPlaying) {
                setIsPlaying(false);
              } else {
                setCurrentAudio('en');
                setIsPlaying(true);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />
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
          <AudioPlayer
            audioPath={`/audio/${audio.vi}`}
            isPlaying={currentAudio === 'vi' && isPlaying}
            onPlayPause={() => {
              if (currentAudio === 'vi' && isPlaying) {
                setIsPlaying(false);
              } else {
                setCurrentAudio('vi');
                setIsPlaying(true);
              }
            }}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      </div>
    </section>
  );
};
