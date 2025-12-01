import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Gauge, SkipBack, SkipForward } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * AudioPlayer Component
 * 
 * AUDIO PATH FORMAT:
 * - Expects audioPath in format: "/audio/{filename}.mp3"
 * - Base path is constructed by roomLoader using AUDIO_FOLDER constant ("audio")
 * - AudioPlayer receives final path like "/audio/room_entry_01_en.mp3"
 * - NO "public/" prefix should ever be in the path
 * 
 * RESILIENCE FEATURES:
 * - Shows loading spinner while audio is buffering
 * - Displays inline error message with retry button if audio fails to load
 * - Logs clear error messages to console for debugging
 * - Supports playlists with automatic track progression
 * - Saves/restores playback position per track
 */

interface AudioPlayerProps {
  audioPath: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
  className?: string;
  playlist?: string[];
  preload?: "none" | "metadata" | "auto";
}

interface AudioPlayerState {
  isAudioReady: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const AudioPlayer = ({ 
  audioPath, 
  isPlaying, 
  onPlayPause, 
  onEnded,
  className,
  playlist = [],
  preload = "metadata"
}: AudioPlayerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [state, setState] = useState<AudioPlayerState>({
    isAudioReady: false,
    hasError: false,
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Use playlist if available, otherwise single audio
  const isPlaylist = playlist.length > 1;
  const currentAudioPath = isPlaylist ? playlist[currentTrackIndex] : audioPath;

  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const stripQuery = (url: string) => {
    try {
      // Handle absolute or relative URLs
      const qIndex = url.indexOf('?');
      const hashIndex = url.indexOf('#');
      let out = qIndex === -1 ? url : url.slice(0, qIndex);
      out = hashIndex === -1 ? out : out.slice(0, hashIndex);
      return out;
    } catch {
      return url;
    }
  };
  const storageKey = (path: string) => `audio-pos:${stripQuery(path)}`;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Determine if the source actually changed (ignore query params/signatures)
    const currentSrcNoQuery = stripQuery(audio.src);
    const newSrcNoQuery = stripQuery(currentAudioPath);
    const isSameSource =
      currentSrcNoQuery === newSrcNoQuery || currentSrcNoQuery.endsWith(newSrcNoQuery);

    // Only reset and set src when the source changed
    if (!isSameSource) {
      audio.pause();
      setState({ isAudioReady: false, hasError: false });
      // Add cache-busting parameter to force reload of updated audio
      const cacheBustedPath = currentAudioPath.includes('?') 
        ? `${currentAudioPath}&v=${Date.now()}` 
        : `${currentAudioPath}?v=${Date.now()}`;
      audio.src = cacheBustedPath;
      // Ensure a fresh load only when switching tracks
      audio.load();
      setCurrentTime(0);
    }

    const handleTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(audio.currentTime);
      }
      try {
        sessionStorage.setItem(storageKey(currentAudioPath), String(audio.currentTime));
      } catch {}
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setState({ isAudioReady: true, hasError: false });
      // Restore saved position if available
      try {
        const saved = parseFloat(sessionStorage.getItem(storageKey(currentAudioPath)) || '0');
        if (!isNaN(saved) && saved > 0 && saved < audio.duration - 0.2) {
          audio.currentTime = saved;
          setCurrentTime(saved);
        }
      } catch {}
      console.log('✅ Audio loaded successfully:', currentAudioPath, 'Duration:', audio.duration);
    };

    const handleEnded = () => {
      setCurrentTime(0);
      try { sessionStorage.removeItem(storageKey(currentAudioPath)); } catch {}
      
      // Auto-play next track in playlist
      if (isPlaylist && currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(prev => prev + 1);
      } else {
        onEnded();
      }
    };

    const handleError = (e: Event) => {
      console.error('❌ Audio failed to load:', currentAudioPath);
      console.error('Error details:', audio.error);
      console.error('Error event:', e);
      
      // Determine error message based on error code
      let errorMessage = 'Audio not available';
      if (audio.error) {
        switch (audio.error.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio playback aborted';
            break;
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error loading audio';
            break;
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Audio file is corrupted or unplayable';
            break;
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio format not supported';
            break;
          default:
            errorMessage = 'Audio failed to load';
        }
      }
      
      // Set inline error state instead of toast
      setState({
        isAudioReady: false,
        hasError: true,
        errorMessage,
      });
    };

    const handleCanPlay = () => {
      console.log('✅ Audio can play:', currentAudioPath);
      // Double-check resume in case metadata loaded earlier
      try {
        const saved = parseFloat(sessionStorage.getItem(storageKey(currentAudioPath)) || '0');
        if (!isNaN(saved) && saved > 0.1 && Math.abs((audio.currentTime || 0) - saved) > 0.2 && saved < (audio.duration || Infinity) - 0.2) {
          audio.currentTime = saved;
          setCurrentTime(saved);
        }
      } catch {}
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentAudioPath, isDragging, isPlaylist, currentTrackIndex]);

  // Auto-play when track changes in playlist
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isPlaylist) return;

    // If a track changed and we were playing, continue playing the new track
    if (isPlaying && state.isAudioReady) {
      audio.play().catch(console.error);
    }
  }, [currentTrackIndex, isPlaylist, isPlaying, state.isAudioReady]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && state.isAudioReady) {
      audio.play().catch(console.error);
    } else if (!isPlaying) {
      // Save position on pause
      try { sessionStorage.setItem(storageKey(currentAudioPath), String(audio.currentTime)); } catch {}
      audio.pause();
    }
  }, [isPlaying, state.isAudioReady, currentAudioPath]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const audio = audioRef.current;
      if (!audio) return;

      // Prevent shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onPlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          audio.currentTime = Math.max(0, audio.currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          audio.currentTime = Math.min(duration, audio.currentTime + 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          setIsMuted(false);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onPlayPause, duration]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressBarRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
    // If currently paused, start playing from the selected position
    if (!isPlaying) {
      onPlayPause();
    }
  };

  const handleReplay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      onPlayPause();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleSkipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  };

  const handlePreviousTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setCurrentTime(0);
    }
  };

  const handleNextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setCurrentTime(0);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Show error state inline instead of controls
  if (state.hasError) {
    return (
      <div className={cn("flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20", className)}>
        <div className="text-sm text-destructive flex-1">
          {state.errorMessage || 'Audio not available right now'}
        </div>
        <Button
          onClick={() => {
            setState({ isAudioReady: false, hasError: false });
            const audio = audioRef.current;
            if (audio) {
              audio.load();
            }
          }}
          size="sm"
          variant="outline"
          className="shrink-0"
        >
          Retry
        </Button>
      </div>
    );
  }

  // Show loading state while audio is buffering
  if (!state.isAudioReady) {
    return (
      <div className={cn("flex items-center gap-2 p-2 bg-muted/50 rounded-lg", className)}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span>Loading audio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      <audio ref={audioRef} preload={preload} />
      
      {/* Skip Backward Button */}
      <Button
        onClick={handleSkipBackward}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 shrink-0"
        title="Skip backward 10s"
      >
        <SkipBack className="h-3 w-3" />
      </Button>

      {/* Play/Pause Button */}
      <Button
        onClick={onPlayPause}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 shrink-0"
        title={!state.isAudioReady ? "Audio unavailable" : "Play/Pause (Space)"}
        disabled={!state.isAudioReady}
      >
        {isPlaying ? (
          <Pause className="h-3 w-3" />
        ) : (
          <Play className="h-3 w-3" />
        )}
      </Button>

      {/* Skip Forward Button */}
      <Button
        onClick={handleSkipForward}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 shrink-0"
        title="Skip forward 10s"
      >
        <SkipForward className="h-3 w-3" />
      </Button>

      {/* Track Navigation (only for playlists) */}
      {isPlaylist && (
        <>
          <div className="h-4 w-px bg-border mx-1" />
          <Button
            onClick={handlePreviousTrack}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 shrink-0"
            disabled={currentTrackIndex === 0}
            title="Previous track"
          >
            <SkipBack className="h-3 w-3" />
          </Button>
          <span className="text-xs text-muted-foreground shrink-0 px-1">
            {currentTrackIndex + 1}/{playlist.length}
          </span>
          <Button
            onClick={handleNextTrack}
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 shrink-0"
            disabled={currentTrackIndex === playlist.length - 1}
            title="Next track"
          >
            <SkipForward className="h-3 w-3" />
          </Button>
        </>
      )}

      {/* Time Display */}
      <span className="text-xs text-muted-foreground shrink-0 w-12">
        {formatTime(currentTime)}
      </span>

      {/* Progress Bar */}
      <div
        ref={progressBarRef}
        onClick={handleProgressClick}
        className="flex-1 h-2 bg-secondary rounded-full cursor-pointer relative group"
      >
        <div
          className="h-full bg-primary rounded-full transition-all duration-100 relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Duration */}
      <span className="text-xs text-muted-foreground shrink-0 w-12">
        {formatTime(duration)}
      </span>

      {/* Replay Button */}
      <Button
        onClick={handleReplay}
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 shrink-0"
      >
        <RotateCcw className="h-3 w-3" />
      </Button>

      {/* Volume Control */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={toggleMute}
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-3 w-3" />
          ) : (
            <Volume2 className="h-3 w-3" />
          )}
        </Button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="w-20 h-1 bg-secondary rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0"
        />
      </div>

      {/* Playback Speed */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 shrink-0 text-xs font-medium"
          >
            <Gauge className="h-3 w-3 mr-1" />
            {playbackSpeed}x
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background border z-50">
          {speedOptions.map((speed) => (
            <DropdownMenuItem
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={cn(
                "cursor-pointer",
                playbackSpeed === speed && "bg-accent"
              )}
            >
              {speed}x {speed === 1 && "(Normal)"}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
