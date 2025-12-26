/**
 * MercyBlade Blue — Mercy Replies Hook (SINGLE AUDIO ENGINE COMPLIANT)
 * File: src/hooks/useMercyReplies.ts
 * Version: MB-BLUE-94.5 — 2025-12-24 (+0700)
 *
 * CHANGE (A4 MIGRATION):
 * - Removed `new Audio()` usage.
 * - Playback now routes through MusicPlayerContext.
 * - Mercy reply logic / preload behavior preserved.
 *
 * AUDIO RULE (LOCKED):
 * - Pass filename-only to music.play().
 */

import { useState, useEffect, useCallback } from 'react';
import {
  type MercyReplyId,
  type MercyReply,
  getMercyReply,
  preloadMercyLibrary,
  isMercyLibraryLoaded,
} from '@/mercy';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';

interface UseMercyRepliesReturn {
  isLoaded: boolean;
  getReply: (id: MercyReplyId) => Promise<MercyReply | null>;
  playReplyAudio: (id: MercyReplyId, lang: 'en' | 'vi') => Promise<void>;
  isPlaying: boolean;
  stopAudio: () => void;
}

// filename-only helper (LOCKED convention)
const toFilename = (input?: string): string | null => {
  if (!input) return null;
  const s = input.trim();
  if (!s) return null;
  const clean = s.split('?')[0].split('#')[0];
  const parts = clean.split('/');
  return parts[parts.length - 1] || null;
};

export function useMercyReplies(): UseMercyRepliesReturn {
  const [isLoaded, setIsLoaded] = useState(isMercyLibraryLoaded());

  const { play, stop, isPlaying } = useMusicPlayer();

  // Preload library on mount (unchanged)
  useEffect(() => {
    if (!isLoaded) {
      preloadMercyLibrary();

      const interval = setInterval(() => {
        if (isMercyLibraryLoaded()) {
          setIsLoaded(true);
          clearInterval(interval);
        }
      }, 100);

      // Cleanup after 5 seconds
      const timeout = setTimeout(() => clearInterval(interval), 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [isLoaded]);

  const getReply = useCallback(async (id: MercyReplyId) => {
    return getMercyReply(id);
  }, []);

  const stopAudio = useCallback(() => {
    stop();
  }, [stop]);

  const playReplyAudio = useCallback(
    async (id: MercyReplyId, lang: 'en' | 'vi') => {
      const reply = await getMercyReply(id);
      if (!reply) {
        console.warn(`Mercy reply not found: ${id}`);
        return;
      }

      const audioPath = lang === 'en' ? reply.audio_en : reply.audio_vi;
      if (!audioPath) {
        console.warn(`No audio path for reply ${id} in ${lang}`);
        return;
      }

      const file = toFilename(audioPath);
      if (!file) {
        console.warn(`Invalid audio filename for reply ${id}:`, audioPath);
        return;
      }

      try {
        await play(file);
      } catch (err) {
        console.warn('Error playing mercy reply audio:', err);
      }
    },
    [play]
  );

  return {
    isLoaded,
    getReply,
    playReplyAudio,
    isPlaying,
    stopAudio,
  };
}
