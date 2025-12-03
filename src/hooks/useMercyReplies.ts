/**
 * React hook for using Mercy replies with audio
 */

import { useState, useEffect, useCallback } from 'react';
import {
  type MercyReplyId,
  type MercyReply,
  getMercyReply,
  preloadMercyLibrary,
  isMercyLibraryLoaded,
} from '@/mercy';

interface UseMercyRepliesReturn {
  isLoaded: boolean;
  getReply: (id: MercyReplyId) => Promise<MercyReply | null>;
  playReplyAudio: (id: MercyReplyId, lang: 'en' | 'vi') => void;
  currentAudio: HTMLAudioElement | null;
  isPlaying: boolean;
  stopAudio: () => void;
}

export function useMercyReplies(): UseMercyRepliesReturn {
  const [isLoaded, setIsLoaded] = useState(isMercyLibraryLoaded());
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Preload library on mount
  useEffect(() => {
    if (!isLoaded) {
      preloadMercyLibrary();
      // Check periodically if loaded
      const interval = setInterval(() => {
        if (isMercyLibraryLoaded()) {
          setIsLoaded(true);
          clearInterval(interval);
        }
      }, 100);
      
      // Cleanup after 5 seconds
      setTimeout(() => clearInterval(interval), 5000);
      
      return () => clearInterval(interval);
    }
  }, [isLoaded]);

  const getReply = useCallback(async (id: MercyReplyId) => {
    return getMercyReply(id);
  }, []);

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setIsPlaying(false);
    }
  }, [currentAudio]);

  const playReplyAudio = useCallback(async (id: MercyReplyId, lang: 'en' | 'vi') => {
    // Stop any current audio
    stopAudio();

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

    try {
      const audio = new Audio(audioPath);
      
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      };
      audio.onerror = () => {
        console.warn(`Failed to play mercy audio: ${audioPath}`);
        setIsPlaying(false);
        setCurrentAudio(null);
      };

      setCurrentAudio(audio);
      await audio.play();
    } catch (err) {
      console.warn('Error playing mercy audio:', err);
      setIsPlaying(false);
    }
  }, [stopAudio]);

  return {
    isLoaded,
    getReply,
    playReplyAudio,
    currentAudio,
    isPlaying,
    stopAudio,
  };
}
