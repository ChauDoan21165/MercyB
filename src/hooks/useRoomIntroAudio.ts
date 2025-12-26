// src/hooks/useRoomIntroAudio.ts — MB-BLUE-95.0 — 2025-12-24 (+0700)
/**
 * Auto-play room intro audio once per session.
 *
 * RULES:
 * - filename only
 * - /public/audio
 * - one-time per room per session
 */

import { useEffect, useRef } from "react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export function useRoomIntroAudio(
  roomId: string,
  introFile?: string
) {
  const { requestPlay, notifyStop } = useMusicPlayer();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!roomId || !introFile) return;

    const key = `mb_intro_played_${roomId}`;
    if (sessionStorage.getItem(key) === "yes") return;

    sessionStorage.setItem(key, "yes");

    const allowed = requestPlay({
      isPlaying: true,
      currentTrackName: introFile,
    });

    if (!allowed) return;

    const audio = new Audio(`/audio/${introFile}`);
    audioRef.current = audio;

    audio.onended = () => {
      audioRef.current = null;
      notifyStop();
    };

    audio.onerror = () => {
      audioRef.current = null;
      notifyStop();
    };

    audio.play().catch(() => {
      notifyStop();
    });

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [roomId, introFile, requestPlay, notifyStop]);
}
