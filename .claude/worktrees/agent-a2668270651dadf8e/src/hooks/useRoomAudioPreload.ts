// src/hooks/useRoomAudioPreload.ts

import { useEffect } from "react";

/**
 * Preload audio files for a room to improve playback performance.
 * @param audioBasePath - Base path for audio files (e.g., "audio/")
 * @param audioFiles    - Array of audio filenames to preload
 */
export const useRoomAudioPreload = (
  audioBasePath: string,
  audioFiles: string[] | null,
) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioFiles || audioFiles.length === 0) return;

    if (import.meta.env.DEV) {
      console.log(`[Audio Preload] Preloading ${audioFiles.length} audio files…`);
    }

    const audioElements: HTMLAudioElement[] = [];

    audioFiles.forEach((file) => {
      if (!file) return;
      const audio   = new Audio();
      audio.src     = `/${audioBasePath}${file}`;
      audio.preload = "metadata";
      audio.load();
      audioElements.push(audio);
    });

    if (import.meta.env.DEV) {
      console.log(`[Audio Preload] Started preloading ${audioElements.length} files`);
    }

    return () => {
      audioElements.forEach((audio) => { audio.src = ""; });
    };
  }, [audioBasePath, audioFiles]);
};