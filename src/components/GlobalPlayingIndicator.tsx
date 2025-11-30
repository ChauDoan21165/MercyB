import { Music } from "lucide-react";
import { useMusicPlayer } from "@/contexts/MusicPlayerContext";

export const GlobalPlayingIndicator = () => {
  const { isPlaying, currentTrackName } = useMusicPlayer();

  if (!isPlaying) return null;

  return (
    <div className="fixed bottom-14 right-4 z-40 bg-black/80 text-white text-xs px-3 py-2 rounded-full shadow-lg flex items-center gap-2 max-w-[220px]">
      <Music className="h-3 w-3" />
      <span className="truncate">
        {currentTrackName || "Playing background music"}
      </span>
    </div>
  );
};
