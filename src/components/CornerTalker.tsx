/**
 * MercyBlade Blue — CornerTalker (SINGLE ENGINE COMPLIANT)
 * File: src/components/CornerTalker.tsx
 * Version: MB-BLUE-94.3 — 2025-12-24 (+0700)
 *
 * CHANGE (A4.3):
 * - Remove all `new Audio()` usage.
 * - Use ONLY the global MusicPlayerContext engine.
 *
 * NOTE (temporary baseline):
 * - We disable auto-play sequence EN->VI for now.
 * - Click blob toggles the first available intro audio.
 * - Next step (A4.4) will add queue support to re-enable EN->VI sequence.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

interface CornerTalkerProps {
  roomId: string;
  introAudioEn?: string;
  introAudioVi?: string;
}

// Convert input into filename-only (LOCKED rule)
const toFilename = (input?: string): string | null => {
  if (!input) return null;
  const s = input.trim();
  if (!s) return null;

  // Accept forms:
  // - "alexander_v1_2_en.mp3"
  // - "/audio/alexander_v1_2_en.mp3"
  // - "audio/alexander_v1_2_en.mp3"
  const noQuery = s.split("?")[0].split("#")[0];
  const parts = noQuery.split("/");
  const last = parts[parts.length - 1];
  return last ? last.trim() : null;
};

export function CornerTalker({ roomId, introAudioEn, introAudioVi }: CornerTalkerProps) {
  const [enabled, setEnabled] = useState(true);

  const { isPlaying, currentTrackName, toggle, stop } = useMusicPlayer();

  const enFile = useMemo(() => toFilename(introAudioEn), [introAudioEn]);
  const viFile = useMemo(() => toFilename(introAudioVi), [introAudioVi]);

  // Choose one baseline intro track for now (EN preferred)
  const primaryFile = enFile || viFile;
  const hasAudio = !!primaryFile;

  // Used to compute "isTalking" only when this component's track is active
  const isTalking = !!(primaryFile && isPlaying && currentTrackName === primaryFile);

  // Load user preference on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("mb_talker_enabled");
    if (stored === "false") setEnabled(false);
  }, []);

  // Session autoplay disabled for baseline stability (A4.3)
  // We keep the sessionStorage marker so later A4.4 can re-enable safely.
  const autoplayArmedRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `mb_talker_intro_played_${roomId}`;
    autoplayArmedRef.current = window.sessionStorage.getItem(key) !== "yes";
  }, [roomId]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !enabled;
    setEnabled(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("mb_talker_enabled", next ? "true" : "false");
    }
    if (!next) {
      stop(); // stop global audio (consistent)
    }
  };

  const handleBlobClick = async () => {
    if (!enabled || !primaryFile) return;

    // mark "played" for this room session on first click
    if (typeof window !== "undefined") {
      const key = `mb_talker_intro_played_${roomId}`;
      if (window.sessionStorage.getItem(key) !== "yes") {
        window.sessionStorage.setItem(key, "yes");
      }
    }

    // Toggle only this track
    await toggle(primaryFile);
  };

  return (
    <div className="fixed bottom-32 right-4 z-40 flex flex-col items-end gap-1">
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
        disabled={!hasAudio || !enabled}
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
