import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface CornerTalkerProps {
  roomId: string;
  introAudioEn?: string;
  introAudioVi?: string;
}

/**
 * CornerTalker - A silent talking mouth guide
 * - No text, only audio playback
 * - Plays EN intro then VI intro with 400ms pause
 * - Mouth animates while audio plays
 * - User can toggle on/off (persisted)
 * - Click blob to replay
 */
export function CornerTalker({ roomId, introAudioEn, introAudioVi }: CornerTalkerProps) {
  const [enabled, setEnabled] = useState(true);
  const [isTalking, setIsTalking] = useState(false);
  const audioEnRef = useRef<HTMLAudioElement | null>(null);
  const audioViRef = useRef<HTMLAudioElement | null>(null);
  const isPlayingRef = useRef(false);
  const abortRef = useRef(false);

  // Normalize audio path to ensure /audio/ prefix
  const normalizeAudioPath = (path: string | undefined): string | null => {
    if (!path) return null;
    const cleanPath = path.replace(/^\/+/, '');
    if (cleanPath.startsWith('audio/')) {
      return `/${cleanPath}`;
    }
    return `/audio/${cleanPath}`;
  };

  const audioEnPath = normalizeAudioPath(introAudioEn);
  const audioViPath = normalizeAudioPath(introAudioVi);
  const hasAudio = !!(audioEnPath || audioViPath);

  // Load user preference on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("mb_talker_enabled");
    if (stored === "false") setEnabled(false);
  }, []);

  // Set up audio elements
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (audioEnPath) {
      audioEnRef.current = new Audio(audioEnPath);
      audioEnRef.current.preload = "metadata";
    }
    if (audioViPath) {
      audioViRef.current = new Audio(audioViPath);
      audioViRef.current.preload = "metadata";
    }

    return () => {
      if (audioEnRef.current) {
        audioEnRef.current.pause();
        audioEnRef.current.src = "";
      }
      if (audioViRef.current) {
        audioViRef.current.pause();
        audioViRef.current.src = "";
      }
    };
  }, [audioEnPath, audioViPath]);

  // Play sequence: EN -> pause -> VI
  const playSequence = useCallback(async () => {
    if (!enabled || isPlayingRef.current) return;
    if (!audioEnRef.current && !audioViRef.current) return;

    isPlayingRef.current = true;
    abortRef.current = false;
    setIsTalking(true);

    try {
      // Play English
      if (audioEnRef.current && !abortRef.current) {
        audioEnRef.current.currentTime = 0;
        await audioEnRef.current.play();
        await new Promise<void>((resolve) => {
          const handler = () => {
            audioEnRef.current?.removeEventListener("ended", handler);
            resolve();
          };
          audioEnRef.current?.addEventListener("ended", handler);
        });
      }

      if (abortRef.current) throw new Error("aborted");

      // Pause between languages
      await new Promise((r) => setTimeout(r, 400));

      if (abortRef.current) throw new Error("aborted");

      // Play Vietnamese
      if (audioViRef.current) {
        audioViRef.current.currentTime = 0;
        await audioViRef.current.play();
        await new Promise<void>((resolve) => {
          const handler = () => {
            audioViRef.current?.removeEventListener("ended", handler);
            resolve();
          };
          audioViRef.current?.addEventListener("ended", handler);
        });
      }
    } catch {
      // Audio play failed or aborted silently
    } finally {
      isPlayingRef.current = false;
      setIsTalking(false);
    }
  }, [enabled]);

  // Stop all audio
  const stopAudio = useCallback(() => {
    abortRef.current = true;
    if (audioEnRef.current) {
      audioEnRef.current.pause();
      audioEnRef.current.currentTime = 0;
    }
    if (audioViRef.current) {
      audioViRef.current.pause();
      audioViRef.current.currentTime = 0;
    }
    isPlayingRef.current = false;
    setIsTalking(false);
  }, []);

  // Auto-play intro once per room per session
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!enabled || !hasAudio) return;

    const key = `mb_talker_intro_played_${roomId}`;
    if (window.sessionStorage.getItem(key) === "yes") return;

    window.sessionStorage.setItem(key, "yes");
    // Small delay to let audio load
    const timer = setTimeout(() => {
      playSequence();
    }, 800);

    return () => clearTimeout(timer);
  }, [roomId, enabled, hasAudio, playSequence]);

  // Handle toggle
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !enabled;
    setEnabled(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mb_talker_enabled", next ? "true" : "false");
    }
    if (!next) {
      stopAudio();
    }
  };

  // Handle blob click to replay
  const handleBlobClick = () => {
    if (!enabled || !hasAudio) return;
    if (isPlayingRef.current) {
      stopAudio();
    } else {
      playSequence();
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-1">
      {/* Toggle button */}
      <button
        onClick={handleToggle}
        className="w-6 h-6 rounded-full bg-background/90 border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors"
        aria-label={enabled ? "Disable guide audio" : "Enable guide audio"}
      >
        {enabled ? (
          <Volume2 className="w-3 h-3 text-foreground" />
        ) : (
          <VolumeX className="w-3 h-3 text-muted-foreground" />
        )}
      </button>

      {/* Talking blob */}
      <button
        onClick={handleBlobClick}
        disabled={!hasAudio}
        className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-primary/80 to-primary shadow-lg flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Play room introduction"
      >
        {/* Eyes */}
        <div className="absolute top-3 left-2.5 w-1.5 h-1.5 rounded-full bg-primary-foreground" />
        <div className="absolute top-3 right-2.5 w-1.5 h-1.5 rounded-full bg-primary-foreground" />
        
        {/* Mouth */}
        <div
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-4 bg-primary-foreground transition-all ${
            isTalking ? "animate-mouth-talk" : "h-1 rounded-full"
          }`}
        />
      </button>
    </div>
  );
}
