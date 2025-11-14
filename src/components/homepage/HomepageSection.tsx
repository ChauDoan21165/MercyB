import { useRef, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

import { cn } from '@/lib/utils';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const audioEnRef = useRef<HTMLAudioElement>(null);
  const audioViRef = useRef<HTMLAudioElement>(null);
  const [playingEn, setPlayingEn] = useState(false);
  const [playingVi, setPlayingVi] = useState(false);

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.15,
    rootMargin: '-50px',
    freezeOnceVisible: true
  });
  const parallaxOffset = 0;

  const toggleAudioEn = () => {
    if (!audioEnRef.current) return;
    if (playingEn) {
      audioEnRef.current.pause();
      setPlayingEn(false);
    } else {
      // Pause Vietnamese if playing
      if (audioViRef.current) {
        audioViRef.current.pause();
        setPlayingVi(false);
      }
      audioEnRef.current.play();
      setPlayingEn(true);
    }
  };

  const toggleAudioVi = () => {
    if (!audioViRef.current) return;
    if (playingVi) {
      audioViRef.current.pause();
      setPlayingVi(false);
    } else {
      // Pause English if playing
      if (audioEnRef.current) {
        audioEnRef.current.pause();
        setPlayingEn(false);
      }
      audioViRef.current.play();
      setPlayingVi(true);
    }
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
          backgroundColor
        }}
      />
      
      {/* Audio elements */}
      <audio
        ref={audioEnRef}
        src={`/audio/${audio.en}`}
        onEnded={() => setPlayingEn(false)}
        onPause={() => setPlayingEn(false)}
      />
      <audio
        ref={audioViRef}
        src={`/audio/${audio.vi}`}
        onEnded={() => setPlayingVi(false)}
        onPause={() => setPlayingVi(false)}
      />

      <div className="max-w-[640px] mx-auto space-y-10">
        {/* English Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2
              className="text-[22px] font-semibold leading-relaxed"
              style={{ color: headingColor }}
            >
              {title.en}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAudioEn}
              className="flex-shrink-0 gap-2"
              style={{ color: accentColor }}
            >
              {playingEn ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span className="text-xs">EN</span>
            </Button>
          </div>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
            {body.en}
          </p>
        </div>

        {/* Vietnamese Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3
              className="text-[19px] font-semibold leading-relaxed"
              style={{ color: `${headingColor}cc` }}
            >
              {title.vi}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleAudioVi}
              className="flex-shrink-0 gap-2"
              style={{ color: accentColor }}
            >
              {playingVi ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span className="text-xs">VI</span>
            </Button>
          </div>
          <p className="text-[15px] leading-relaxed" style={{ color: 'rgba(0, 0, 0, 0.70)' }}>
            {body.vi}
          </p>
        </div>
      </div>
    </section>
  );
};
