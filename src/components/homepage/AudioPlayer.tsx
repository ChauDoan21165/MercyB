import { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  audioFile: string;
  language: string;
  accentColor: string;
}

export const AudioPlayer = ({ audioFile, language, accentColor }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-2">
      <audio
        ref={audioRef}
        src={`/audio/${audioFile}`}
        onEnded={handleEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={togglePlay}
        className="h-8 px-3 gap-1.5 text-xs transition-all hover:scale-105"
        style={{ color: accentColor }}
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5" />
        )}
        <Volume2 className="w-3 h-3 opacity-60" />
        <span className="font-medium">{language}</span>
      </Button>
    </div>
  );
};
