// src/contexts/MusicPlayerContext.tsx — MB-BLUE-94.3 — 2025-12-24 (+0700)
/**
 * MercyBlade Blue — MusicPlayerContext (GLOBAL SINGLE AUDIO OWNER)
 *
 * GOAL (LOCKED):
 * - Only ONE audio plays at a time across the whole app.
 * - Simple API for buttons: play(file), stop()
 * - Audio files live in /public/audio and are referenced as filename only.
 *
 * Proof target:
 * - EntryAudioButton calls play("english_writing_basics.mp3") and it plays /audio/english_writing_basics.mp3
 *
 * MB-BLUE-94.3 changes:
 * - stop() clears audioRef to hard reset ownership
 * - play() catches play() rejection (autoplay policy, navigation) to avoid unhandled promise
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MusicPlayerContextValue = {
  isPlaying: boolean;
  currentTrackName?: string;

  /** Play a filename from /public/audio (filename only) */
  play: (file: string) => Promise<void>;

  /** Stop current playback (if any) */
  stop: () => void;
};

const MusicPlayerContext =
  createContext<MusicPlayerContextValue | undefined>(undefined);

function normalizeAudioUrl(file: string): string {
  const clean = String(file || "").trim().replace(/^\/+/, "");
  // If caller accidentally passes "audio/x.mp3", normalize to "/audio/x.mp3"
  if (clean.startsWith("audio/")) return `/${clean}`;
  // Default: filename only
  return `/audio/${clean}`;
}

export const MusicPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackName, setCurrentTrackName] = useState<string | undefined>();

  // Single audio element for whole app
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      try {
        a.pause();
        a.currentTime = 0;
      } catch {
        // ignore
      }
    }
    audioRef.current = null; // ✅ hard reset ownership
    setIsPlaying(false);
    setCurrentTrackName(undefined);
  }, []);

  const play = useCallback(
    async (file: string) => {
      const name = String(file || "").trim();
      if (!name) return;

      // If same track is playing -> restart (predictable UX)
      if (isPlaying && currentTrackName === name && audioRef.current) {
        audioRef.current.currentTime = 0;
        return;
      }

      // Stop anything else first (SINGLE OWNER rule)
      stop();

      const url = normalizeAudioUrl(name);
      const a = new Audio(url);
      a.preload = "metadata";

      audioRef.current = a;
      setCurrentTrackName(name);

      a.onplay = () => setIsPlaying(true);

      a.onended = () => {
        setIsPlaying(false);
        setCurrentTrackName(undefined);
        audioRef.current = null;
      };

      a.onerror = () => {
        setIsPlaying(false);
        setCurrentTrackName(undefined);
        audioRef.current = null;
        // Keep this as warn (important for coverage)
        console.warn("[MusicPlayer] audio load/play failed:", url);
      };

      // Must be user-gesture initiated in most cases; EntryAudioButton provides that.
      try {
        await a.play();
      } catch (err) {
        setIsPlaying(false);
        setCurrentTrackName(undefined);
        audioRef.current = null;
        console.warn("[MusicPlayer] play() rejected:", url, err);
      }
    },
    [stop, isPlaying, currentTrackName]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      audioRef.current = null;
    };
  }, [stop]);

  return (
    <MusicPlayerContext.Provider value={{ isPlaying, currentTrackName, play, stop }}>
      {children}
    </MusicPlayerContext.Provider>
  );
};

export const useMusicPlayer = () => {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return ctx;
};
