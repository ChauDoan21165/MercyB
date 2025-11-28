import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';

const TRACKS = [
  { id: '1', name: 'Peaceful Piano', url: '/audio/relaxing/peaceful-piano.mp3' },
  { id: '2', name: 'Calm Waters', url: '/audio/relaxing/calm-waters.mp3' },
  { id: '3', name: 'Gentle Rain', url: '/audio/relaxing/gentle-rain.mp3' },
  { id: '4', name: 'Mountain Breeze', url: '/audio/relaxing/mountain-breeze.mp3' },
  { id: '5', name: 'Forest Walk', url: '/audio/relaxing/forest-walk.mp3' },
  { id: '6', name: 'Ocean Waves', url: '/audio/relaxing/ocean-waves.mp3' },
  { id: '7', name: 'Soft Guitar', url: '/audio/relaxing/soft-guitar.mp3' },
  { id: '8', name: 'Morning Light', url: '/audio/relaxing/morning-light.mp3' },
  { id: '9', name: 'Night Sky', url: '/audio/relaxing/night-sky.mp3' },
  { id: '10', name: 'Quiet Mind', url: '/audio/relaxing/quiet-mind.mp3' },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string>('1');
  const [volume, setVolume] = useState<number>(50);

  // Load saved preferences on mount
  useEffect(() => {
    const savedTrackId = localStorage.getItem('musicPlayerTrackId');
    const savedVolume = localStorage.getItem('musicPlayerVolume');
    
    if (savedTrackId) setCurrentTrackId(savedTrackId);
    if (savedVolume) setVolume(parseInt(savedVolume, 10));
  }, []);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Handle track change
  const handleTrackChange = (trackId: string) => {
    setCurrentTrackId(trackId);
    localStorage.setItem('musicPlayerTrackId', trackId);
    setIsPlaying(false);
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    localStorage.setItem('musicPlayerVolume', newVolume.toString());
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const currentTrack = TRACKS.find(t => t.id === currentTrackId) || TRACKS[0];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[100px] bg-white border-t-2 border-black z-50">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          variant="outline"
          size="sm"
          className="border-black text-black hover:bg-gray-100 h-10 w-10 p-0"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        {/* Volume Slider */}
        <div className="flex items-center gap-2 w-32">
          <Volume2 className="h-4 w-4 text-black" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        {/* Track Name */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-black truncate">{currentTrack.name}</p>
        </div>

        {/* Track Selector */}
        <Select value={currentTrackId} onValueChange={handleTrackChange}>
          <SelectTrigger className="w-[200px] border-black text-black bg-white">
            <SelectValue placeholder="Select track" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black z-[100]">
            {TRACKS.map((track) => (
              <SelectItem key={track.id} value={track.id} className="text-black">
                {track.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.url}
          loop
          onEnded={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
};
