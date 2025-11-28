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
  { id: '1', name: 'Land of 8 Bits', url: '/audio/relaxing/land-of-8-bits.mp3' },
  { id: '2', name: 'Lazy Day', url: '/audio/relaxing/lazy-day.mp3' },
  { id: '3', name: 'Done With Work', url: '/audio/relaxing/done-with-work.mp3' },
  { id: '4', name: 'Vibes', url: '/audio/relaxing/vibes.mp3' },
  { id: '5', name: 'Cruisin Along', url: '/audio/relaxing/cruisin-along.mp3' },
  { id: '6', name: 'Mellow Thoughts', url: '/audio/relaxing/mellow-thoughts.mp3' },
  { id: '7', name: 'Looking Up', url: '/audio/relaxing/looking-up.mp3' },
  { id: '8', name: 'Tropical Keys', url: '/audio/relaxing/tropical-keys.mp3' },
  { id: '9', name: 'Simplicity', url: '/audio/relaxing/simplicity.mp3' },
  { id: '10', name: 'All Shall End', url: '/audio/relaxing/all-shall-end.mp3' },
  { id: '11', name: 'Peace', url: '/audio/relaxing/peace.mp3' },
  { id: '12', name: 'An Ambient Day', url: '/audio/relaxing/an-ambient-day.mp3' },
  { id: '13', name: 'Peace And Happy', url: '/audio/relaxing/peace-and-happy.mp3' },
  { id: '14', name: 'Strings of Time', url: '/audio/relaxing/strings-of-time.mp3' },
  { id: '15', name: 'Childhood Nostalgia', url: '/audio/relaxing/childhood-nostalgia.mp3' },
  { id: '16', name: 'Sad Winds', url: '/audio/relaxing/sad-winds.mp3' },
  { id: '17', name: 'Tender Love', url: '/audio/relaxing/tender-love.mp3' },
  { id: '18', name: 'Chill Gaming', url: '/audio/relaxing/chill-gaming.mp3' },
  { id: '19', name: 'Homework', url: '/audio/relaxing/homework.mp3' },
  { id: '20', name: 'On My Own', url: '/audio/relaxing/on-my-own.mp3' },
  { id: '21', name: 'Love Spell', url: '/audio/relaxing/love-spell.mp3' },
  { id: '22', name: 'Elevator Ride', url: '/audio/relaxing/elevator-ride.mp3' },
  { id: '23', name: 'Fireside Date', url: '/audio/relaxing/fireside-date.mp3' },
  { id: '24', name: 'The Lounge', url: '/audio/relaxing/the-lounge.mp3' },
  { id: '25', name: 'Warm Light', url: '/audio/relaxing/warm-light.mp3' },
  { id: '26', name: 'Elven Forest', url: '/audio/relaxing/elven-forest.mp3' },
  { id: '27', name: 'Healing Water', url: '/audio/relaxing/healing-water.mp3' },
  { id: '28', name: 'Beautiful Memories', url: '/audio/relaxing/beautiful-memories.mp3' },
  { id: '29', name: 'Quiet Morning', url: '/audio/relaxing/quiet-morning.mp3' },
  { id: '30', name: 'Not Much To Say', url: '/audio/relaxing/not-much-to-say.mp3' },
  { id: '31', name: 'Relaxing Green Nature', url: '/audio/relaxing/relaxing-green-nature.mp3' },
  { id: '32', name: 'The Soft Lullaby', url: '/audio/relaxing/the-soft-lullaby.mp3' },
  { id: '33', name: 'We Were Friends', url: '/audio/relaxing/we-were-friends.mp3' },
  { id: '34', name: 'In The Moment', url: '/audio/relaxing/in-the-moment.mp3' },
  { id: '35', name: 'Champagne at Sunset', url: '/audio/relaxing/champagne-at-sunset.mp3' },
  { id: '36', name: 'Serenity', url: '/audio/relaxing/serenity.mp3' },
  { id: '37', name: 'Cathedral Ambience', url: '/audio/relaxing/cathedral-ambience.mp3' },
  { id: '38', name: 'Painful Memories', url: '/audio/relaxing/painful-memories.mp3' },
  { id: '39', name: 'Stasis', url: '/audio/relaxing/stasis.mp3' },
  { id: '40', name: 'Upon Reflection', url: '/audio/relaxing/upon-reflection.mp3' },
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
