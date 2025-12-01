import { useEffect, useRef } from 'react';

interface UseOptimizedAudioOptions {
  audioFiles: string[];
  basePath?: string;
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Optimized audio preloading with network priority hints
 */
export function useOptimizedAudio(options: UseOptimizedAudioOptions) {
  const { audioFiles, basePath = '/audio/', priority = 'auto' } = options;
  const audioElementsRef = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    if (!audioFiles || audioFiles.length === 0) return;

    const elements: HTMLAudioElement[] = [];

    audioFiles.forEach((file, index) => {
      if (!file) return;

      const audio = new Audio();
      const fullPath = `${basePath}${file}`;
      
      // Set network priority
      if (priority === 'high' && index === 0) {
        audio.preload = 'auto'; // First audio loads fully
      } else {
        audio.preload = 'metadata'; // Others load metadata only
      }
      
      audio.src = fullPath;
      
      // Add link preload hint for critical audio
      if (priority === 'high' && index === 0) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'audio';
        link.href = fullPath;
        document.head.appendChild(link);
      }

      audio.load();
      elements.push(audio);
    });

    audioElementsRef.current = elements;

    return () => {
      elements.forEach((audio) => {
        audio.src = '';
      });
    };
  }, [audioFiles, basePath, priority]);

  return audioElementsRef.current;
}
