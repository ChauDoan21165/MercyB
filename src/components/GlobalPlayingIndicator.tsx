import { Music } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

/**
 * Global playing indicator that shows when music is playing
 * Floats in a fixed position to follow the user across pages
 */
export function GlobalPlayingIndicator() {
  const { isPlaying, currentTrack } = useMusicPlayer();

  if (!isPlaying || !currentTrack) return null;

  return (
    <div 
      className="fixed bottom-24 right-6 z-40 flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-3 py-2 rounded-full shadow-lg animate-in slide-in-from-bottom-5"
      role="status"
      aria-live="polite"
      aria-label={`Now playing: ${currentTrack.title}`}
    >
      <Music className="w-4 h-4 animate-pulse" />
      <span className="text-sm font-medium max-w-[150px] truncate">
        {currentTrack.title}
      </span>
    </div>
  );
}
