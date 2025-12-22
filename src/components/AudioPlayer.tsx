// src/components/AudioPlayer.tsx — v2025-12-21-88.0-AUDIOPLAYER-TALKING
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Gauge,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function formatTime(time: number) {
  if (!Number.isFinite(time) || time < 0) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const AudioPlayer = ({
  audioPath,
  isPlaying,
  onPlayPause,
  onEnded,
  className,
  playlist = [],
  preload = "metadata",
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

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

  const speedOptions = useMemo(() => [0.5, 0.75, 1, 1.25, 1.5, 2], []);
  const isPlaylist = playlist.length > 1;

  // Normalize audio path to ensure proper prefix
  const normalizeAudioPath = (path: string): string => {
    if (!path) return path;
    const clean = path.replace(/^\/+/, "");
    if (clean.startsWith("audio/") || clean.startsWith("music/")) return `/${clean}`;
    return `/audio/${clean}`;
  };

  const rawAudioPath = isPlaylist ? playlist[currentTrackIndex] : audioPath;
  const currentAudioPath = normalizeAudioPath(rawAudioPath);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // If no audio configured
  if (!currentAudioPath) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-3 bg-muted/50 rounded-lg border border-muted",
          className
        )}
      >
        <div className="text-sm text-muted-foreground flex-1">
          <span>Audio not configured for this entry</span>
          <span className="text-xs block mt-0.5">Mục này chưa được cấu hình âm thanh</span>
        </div>
      </div>
    );
  }

  // Load audio when track changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    setState({ isAudioReady: false, hasError: false });
    setCurrentTime(0);
    setDuration(0);

    // Force reload
    try {
      el.load();
    } catch {}
  }, [currentAudioPath, currentTrackIndex]);

  // Apply playback rate to element
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  // Apply volume/mute to element
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = isMuted;
    el.volume = Math.min(1, Math.max(0, volume));
  }, [isMuted, volume]);

  // Sync isPlaying prop -> real audio element
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (!state.isAudioReady) return;

    if (isPlaying) {
      const p = el.play();
      if (p && typeof (p as any).catch === "function") {
        (p as any).catch(() => {
          // autoplay blocked etc.
        });
      }
    } else {
      el.pause();
    }
  }, [isPlaying, state.isAudioReady]);

  // Audio element listeners
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
    };
    const onCanPlay = () => {
      setState((s) => ({ ...s, isAudioReady: true, hasError: false, errorMessage: undefined }));
    };
    const onTimeUpdate = () => {
      if (isDragging) return;
      setCurrentTime(el.currentTime || 0);
    };
    const onError = () => {
      const msg =
        (el.error && (el.error as any).message) ||
        "Audio not available";
      setState({ isAudioReady: false, hasError: true, errorMessage: msg });
    };
    const onEndedInternal = () => {
      onEnded?.();
      // If playlist: auto-advance
      if (isPlaylist) {
        setCurrentTrackIndex((idx) => {
          const next = idx + 1;
          return next >= playlist.length ? 0 : next;
        });
      }
    };

    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("error", onError);
    el.addEventListener("ended", onEndedInternal);

    return () => {
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("error", onError);
      el.removeEventListener("ended", onEndedInternal);
    };
  }, [isDragging, isPlaylist, playlist.length, onEnded]);

  // Progress seek helpers
  const seekToPercent = (pct: number) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const clamped = Math.min(1, Math.max(0, pct));
    const t = clamped * duration;
    el.currentTime = t;
    setCurrentTime(t);
  };

  const handleProgressPointer = (clientX: number) => {
    const bar = progressBarRef.current;
    if (!bar) return;
    const rect = bar.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = (clientX - rect.left) / rect.width;
    seekToPercent(pct);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleProgressPointer(e.clientX);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging) return;
      handleProgressPointer(e.clientX);
    };
    const onUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDragging]);

  // Controls
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume > 0 ? previousVolume : 1);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
    }
  };

  const skipBackward = () => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaylist) {
      setCurrentTrackIndex((idx) => (idx - 1 < 0 ? playlist.length - 1 : idx - 1));
      return;
    }

    el.currentTime = Math.max(0, (el.currentTime || 0) - 10);
  };

  const skipForward = () => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaylist) {
      setCurrentTrackIndex((idx) => (idx + 1 >= playlist.length ? 0 : idx + 1));
      return;
    }

    el.currentTime = Math.min(duration || 0, (el.currentTime || 0) + 10);
  };

  return (
    <div className={cn("flex items-center gap-2 w-full", className)}>
      {/* Local CSS so mouth animation always exists */}
      <style>{`
        @keyframes mb-mouth-talk {
          0%, 100% { transform: translateX(-50%) scaleY(0.55); }
          25% { transform: translateX(-50%) scaleY(1.2); }
          50% { transform: translateX(-50%) scaleY(0.8); }
          75% { transform: translateX(-50%) scaleY(1.4); }
        }
        .animate-mouth-talk { animation: mb-mouth-talk 250ms infinite; }
      `}</style>

      <audio
        ref={audioRef}
        preload={preload}
        src={`${currentAudioPath}?t=${currentTrackIndex}`}
      />

      {state.hasError ? (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg border border-destructive/20 flex-1">
          <div className="text-sm text-destructive flex-1">
            {state.errorMessage || "Audio not available"}
          </div>
          <Button
            onClick={() => {
              setState({ isAudioReady: false, hasError: false });
              audioRef.current?.load();
            }}
            size="sm"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      ) : !state.isAudioReady ? (
        <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg flex-1">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Loading audio...</span>
        </div>
      ) : (
        <>
          {/* Skip Backward */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={skipBackward}
            aria-label="Previous / Back 10s"
          >
            <SkipBack className="h-3.5 w-3.5" />
          </Button>

          {/* Play/Pause Talking Mouth Button */}
          <button
            onClick={onPlayPause}
            disabled={!state.isAudioReady}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-primary/80 to-primary shadow-md flex items-center justify-center transition-transform hover:scale-105 disabled:opacity-50"
          >
            {/* Eyes */}
            <div className="absolute top-2.5 left-2 w-1.5 h-1.5 rounded-full bg-primary-foreground/90" />
            <div className="absolute top-2.5 right-2 w-1.5 h-1.5 rounded-full bg-primary-foreground/90" />
            {/* Mouth - animated when playing */}
            <div
              className={cn(
                "absolute bottom-2.5 left-1/2 -translate-x-1/2 w-3 bg-primary-foreground transition-all",
                isPlaying ? "h-2 rounded-sm animate-mouth-talk" : "h-0.5 rounded-full"
              )}
            />
          </button>

          {/* Skip Forward */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={skipForward}
            aria-label="Next / Forward 10s"
          >
            <SkipForward className="h-3.5 w-3.5" />
          </Button>

          {/* Time Display */}
          <span className="text-xs text-muted-foreground w-12 tabular-nums">
            {formatTime(currentTime)}
          </span>

          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            className="flex-1 h-2 bg-secondary rounded-full cursor-pointer relative group select-none"
            onMouseDown={onMouseDown}
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Duration */}
          <span className="text-xs text-muted-foreground w-12 tabular-nums">
            {formatTime(duration)}
          </span>

          {/* Volume Toggle */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
          </Button>

          {/* Speed Control */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">
                <Gauge className="h-3.5 w-3.5 mr-1" />
                {playbackSpeed}x
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {speedOptions.map((speed) => (
                <DropdownMenuItem
                  key={speed}
                  onClick={() => setPlaybackSpeed(speed)}
                  className={cn(playbackSpeed === speed && "bg-accent")}
                >
                  {speed}x
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
};
