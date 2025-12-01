import { useEffect } from "react";

/**
 * Preload audio files for a room to improve playback performance
 * @param audioBasePath - Base path for audio files (e.g., "audio/")
 * @param audioFiles - Array of audio filenames to preload
 */
export const useRoomAudioPreload = (
  audioBasePath: string,
  audioFiles: string[] | null
) => {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;
    
    // Skip if no files to preload
    if (!audioFiles || audioFiles.length === 0) return;

    console.log(`[Audio Preload] Preloading ${audioFiles.length} audio files...`);
    
    // Create Audio objects to trigger browser preloading
    const audioElements: HTMLAudioElement[] = [];
    
    audioFiles.forEach((file) => {
      if (!file) return;
      
      const audio = new Audio();
      const fullPath = `/${audioBasePath}${file}`;
      audio.src = fullPath;
      audio.preload = "metadata";
      
      // Start loading
      audio.load();
      audioElements.push(audio);
    });

    console.log(`[Audio Preload] Started preloading for ${audioElements.length} files`);

    // Cleanup: remove references
    return () => {
      audioElements.forEach((audio) => {
        audio.src = "";
      });
    };
  }, [audioBasePath, audioFiles]);
};
