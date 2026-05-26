import { Music } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Global playing indicator - shows when music is playing
 * Positioned in top-right corner of app
 */
export function GlobalPlayingIndicator() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Listen for global music player events
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleStop = () => setIsPlaying(false);

    window.addEventListener('musicplayer:play', handlePlay);
    window.addEventListener('musicplayer:pause', handlePause);
    window.addEventListener('musicplayer:stop', handleStop);

    // Check initial state from localStorage
    const savedTrackId = localStorage.getItem('selectedTrackId');
    const savedIsPlaying = localStorage.getItem('musicPlayerIsPlaying') === 'true';
    if (savedTrackId && savedIsPlaying) {
      setIsPlaying(true);
    }

    return () => {
      window.removeEventListener('musicplayer:play', handlePlay);
      window.removeEventListener('musicplayer:pause', handlePause);
      window.removeEventListener('musicplayer:stop', handleStop);
    };
  }, []);

  if (!isPlaying) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-2 rounded-full shadow-lg animate-pulse">
      <Music className="w-4 h-4" />
      <span className="text-sm font-medium">Playing</span>
    </div>
  );
}
