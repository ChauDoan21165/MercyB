// FILE: src/components/homepage/HomepageSection.tsx
// v2025-12-21-88.2-HOMEPAGE-AVATAR-INTEGRATED
//
// FIXES (TS build-safe):
// - AudioPlayer Props in this repo do NOT include `onPlayPause` / `onEnded`.
//   => Remove those props and use an explicit Play/Pause button that drives the global MusicPlayerContext.
// - Ref typing: keep a single ref type (HTMLElement) and cast once for the intersection observer hook.
// - Local isPlaying stays in sync with global player (so avatar halo stops when global stops).

import { useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/lib/utils";
import { MercyAvatar } from "@/components/mercy/MercyAvatar";
import { HaloPulse } from "@/components/mercy/MercyAnimations";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";
import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

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
  accentColor, // kept for API compatibility (may be used by CSS/variants later)
  title,
  body,
  audio,
}: HomepageSectionProps) => {
  // Use a real DOM element ref; hook expects RefObject<Element>
  const sectionRef = useRef<HTMLElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  // Global player controls
  const { isPlaying: globalIsPlaying, currentTrackName, play, stop } = useMusicPlayer();

  const isVisible = useIntersectionObserver(sectionRef as unknown as React.RefObject<Element>, {
    threshold: 0.15,
    rootMargin: "-50px",
    freezeOnceVisible: true,
  });

  const isDarkBackground = (bgColor: string): boolean => {
    const hex = bgColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  };

  const textColor = isDarkBackground(backgroundColor)
    ? "rgba(248, 250, 252, 0.92)"
    : "rgba(0, 0, 0, 0.78)";

  // Use filename-only for the global engine (consistent with other components)
  const toFilename = (input?: string): string | null => {
    if (!input) return null;
    const s = input.trim();
    if (!s) return null;
    const noQuery = s.split("?")[0].split("#")[0];
    const parts = noQuery.split("/");
    const last = parts[parts.length - 1];
    return last ? last.trim() : null;
  };

  const primaryFile = toFilename(audio.en) || toFilename(audio.vi);

  // Keep local UI synced with global player state
  useEffect(() => {
    if (!primaryFile) {
      setIsPlaying(false);
      return;
    }
    const active = !!(globalIsPlaying && currentTrackName === primaryFile);
    setIsPlaying(active);
  }, [globalIsPlaying, currentTrackName, primaryFile]);

  const handlePlayPause = async () => {
    if (!primaryFile) return;

    const isThisTrackActive = !!(globalIsPlaying && currentTrackName === primaryFile);

    if (isThisTrackActive) {
      stop();
      setIsPlaying(false);
      return;
    }

    await play(primaryFile);
    setIsPlaying(true);
  };

  return (
    <section
      ref={sectionRef}
      id={id}
      className={cn(
        "w-full py-14 px-6 transition-all duration-700 relative overflow-hidden",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={{ backgroundColor }} />

      <div className="max-w-[640px] mx-auto space-y-12">
        {/* Avatar + English */}
        <div className="flex gap-4 items-start">
          <div className="relative shrink-0">
            <MercyAvatar size={56} animate={isPlaying} />
            {isPlaying ? <HaloPulse size={72} className="absolute -inset-2 pointer-events-none" /> : null}
          </div>

          <div className="flex-1 space-y-4">
            <h2 className="text-[18px] sm:text-[22px] font-semibold leading-relaxed" style={{ color: headingColor }}>
              {title.en}
            </h2>

            <p className="text-[15px] leading-relaxed" style={{ color: textColor }}>
              {body.en}
            </p>

            {/* Build-safe audio control: drive the global player directly */}
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                disabled={!primaryFile}
                className="gap-2"
                title={!primaryFile ? "Missing audio" : isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause audio" : "Play audio"}
              </Button>

              {primaryFile ? (
                <span className="text-xs text-muted-foreground truncate max-w-[340px]">{primaryFile}</span>
              ) : (
                <span className="text-xs text-muted-foreground">No audio</span>
              )}
            </div>
          </div>
        </div>

        {/* Vietnamese */}
        <div className="space-y-4 pl-[72px]">
          <h3 className="text-[16px] sm:text-[19px] font-semibold leading-relaxed" style={{ color: headingColor }}>
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