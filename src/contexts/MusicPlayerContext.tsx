// src/contexts/MusicPlayerContext.tsx — MB-BLUE-94.3 — 2025-12-24 (+0700)
/**
 * MercyBlade Blue — MusicPlayerContext (GLOBAL SINGLE AUDIO OWNER)
 *
 * GOAL (LOCKED):
 * - Only ONE audio plays at a time across the whole app.
 * - Simple API for buttons: play(file), stop()
 * - Audio is resolved through resolveRoomAudioUrl, which handles:
 *     • room audio (Supabase public bucket `room-audio`)
 *     • kids/* and music/* local assets
 *     • absolute https:// URLs (e.g. Mercy original songs served from the
 *       Supabase public `music` bucket — see MusicPlayer.tsx)
 *
 * Proof target:
 * - EntryAudioButton calls play("english_writing_basics.mp3") and it plays
 *   the correctly-resolved audio URL.
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
import { resolveRoomAudioUrl } from "@/lib/roomAudioResolver";

type MusicPlayerContextValue = {
  isPlaying: boolean;
  currentTrackName?: string;

  /** Play a track. Accepts a filename or an absolute URL; resolveRoomAudioUrl sorts it out. */
  play: (file: string) => Promise<void>;

  /** Stop current playback when present */
  stop: () => void;
};

const MusicPlayerContext =
  createContext<MusicPlayerContextValue | undefined>(undefined);

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

      // Phase 2: resolve via central pipeline — signed URL for adult-room keys,
      // local URL for kids/music (short-circuit, no network), local fallback on error.
      const resolved = await resolveRoomAudioUrl(name);
      if (!resolved) return;
      const url = resolved.url;
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
