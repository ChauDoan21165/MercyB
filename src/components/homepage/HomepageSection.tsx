// src/components/homepage/HomepageSection.tsx — v2025-12-21-88.1-HOMEPAGE-AVATAR-INTEGRATED
import { useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "@/components/AudioPlayer";
import { MercyAvatar } from "@/components/mercy/MercyAvatar";
import { HaloPulse } from "@/components/mercy/MercyAnimations";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

interface HomepageSectionProps {
  id: string;
  backgroundColor: string;
  headingColor: string;
  accentColor: string;
  title: { en: string; vi: string };
  body: { en: string; vi: string };
  audio: { en: string; vi: string };
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

  const { updateFromPlayer } = useMusicPlayer();

  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.15,
    rootMargin: "-50px",
    freezeOnceVisible: true,
  });

  const isDarkBackground = (bgColor: string): boolean => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 2), 16);
    const b = parseInt(hex.substring(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const textColor = isDarkBackground(backgroundColor)
    ? "rgba(248, 250, 252, 0.92)"
    : "rgba(0, 0, 0, 0.78)";

  const handlePlayPause = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    updateFromPlayer({
      isPlaying: next,
      currentTrackName: title.en,
    });
  };

  const handleEnded = () => {
    setIsPlaying(false);
    updateFromPlayer({
      isPlaying: false,
      currentTrackName: undefined,
    });
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "w-full py-14 px-6 transition-all duration-700 relative overflow-hidden",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor }} />

      <div className="max-w-[640px] mx-auto space-y-12">
        {/* Avatar + English */}
        <div className="flex gap-4 items-start">
          <div className="relative shrink-0">
            <MercyAvatar size={56} animate={isPlaying} />
            {isPlaying && (
              <HaloPulse
                size={72}
                className="absolute -inset-2 pointer-events-none"
              />
            )}
          </div>

          <div className="flex-1 space-y-4">
            <h2
              className="text-[18px] sm:text-[22px] font-semibold leading-relaxed"
              style={{ color: headingColor }}
            >
              {title.en}
            </h2>

            <p className="text-[15px] leading-relaxed" style={{ color: textColor }}>
              {body.en}
            </p>

            <AudioPlayer
              audioPath={audio.en}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onEnded={handleEnded}
            />
          </div>
        </div>

        {/* Vietnamese */}
        <div className="space-y-4 pl-[72px]">
          <h3
            className="text-[16px] sm:text-[19px] font-semibold leading-relaxed"
            style={{ color: headingColor }}
          >
            {title.vi}
          </h3>

          <p className="text-[15px] leading-relaxed" style={{ color: textColor }}>
            {body.vi}
          </p>
        </div>
      </div>
    </section>
  );
};
