import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Heart, Music, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { useFavoriteTracks } from '@/hooks/useFavoriteTracks';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  { id: '41', name: 'Down Days', url: '/audio/relaxing/down-days.mp3' },
  { id: '42', name: 'Time Alone', url: '/audio/relaxing/time-alone.mp3' },
  { id: '43', name: 'Beauty Of Russia', url: '/audio/relaxing/beauty-of-russia.mp3' },
  { id: '44', name: 'Irish Sunset', url: '/audio/relaxing/irish-sunset.mp3' },
  { id: '45', name: 'Rolling Hills Of Ireland', url: '/audio/relaxing/rolling-hills-of-ireland.mp3' },
  { id: '46', name: 'Country Fireside', url: '/audio/relaxing/country-fireside.mp3' },
  { id: '47', name: 'Heaven', url: '/audio/relaxing/heaven.mp3' },
  { id: '48', name: 'Our Hopes And Dreams', url: '/audio/relaxing/our-hopes-and-dreams.mp3' },
  { id: '49', name: 'Galaxys Endless Expanse', url: '/audio/relaxing/galaxys-endless-expanse.mp3' },
  { id: '50', name: 'Prairie Evening', url: '/audio/relaxing/prairie-evening.mp3' },
  { id: '51', name: 'Glistening Gifts', url: '/audio/relaxing/glistening-gifts.mp3' },
  { id: '52', name: 'Broken Inside', url: '/audio/relaxing/broken-inside.mp3' },
  { id: '53', name: 'Requiem', url: '/audio/relaxing/requiem.mp3' },
  { id: '54', name: 'News Chill', url: '/audio/relaxing/news-chill.mp3' },
  { id: '55', name: 'Wishing Well', url: '/audio/relaxing/wishing-well.mp3' },
  { id: '56', name: 'Anhedonia', url: '/audio/relaxing/anhedonia.mp3' },
  { id: '57', name: 'Saying Goodbye', url: '/audio/relaxing/saying-goodbye.mp3' },
  { id: '58', name: 'I Wish I Told You', url: '/audio/relaxing/i-wish-i-told-you.mp3' },
  { id: '59', name: 'Deep Meditation', url: '/audio/relaxing/deep-meditation.mp3' },
  { id: '60', name: 'Quiet Time', url: '/audio/relaxing/quiet-time.mp3' },
  { id: '61', name: 'In The Light', url: '/audio/relaxing/in-the-light.mp3' },
  { id: '62', name: 'Tranquility', url: '/audio/relaxing/tranquility.mp3' },
  { id: '63', name: 'Land of 8 Bits (v2)', url: '/music/2019-01-10_-_Land_of_8_Bits_-_Stephen_Bennett_-_FesliyanStudios.com-2.mp3' },
  { id: '64', name: 'Done With Work (v2)', url: '/music/2019-07-02_-_Done_With_Work_-_www.FesliyanStudios.com_-_David_Renda-2.mp3' },
  { id: '65', name: 'Cruisin Along (v2)', url: '/music/2020-08-19_-_Cruisin_Along_-_www.FesliyanStudios.com_David_Renda-2.mp3' },
  { id: '66', name: 'Tender Love (v2)', url: '/music/RomanticMusic2018-11-11_-_Tender_Love_-_David_Fesliyan-2.mp3' },
  { id: '67', name: 'Mellow Thoughts (v2)', url: '/music/2020-09-14_-_Mellow_Thoughts_-_www.FesliyanStudios.com_David_Renda-2.mp3' },
  { id: '68', name: 'Sad Winds (v2)', url: '/music/2017-10-14_-_Sad_Winds_Chapter_1_-_David_Fesliyan-2.mp3' },
  { id: '69', name: 'Looking Up (v2)', url: '/music/2020-09-14_-_Looking_Up_-_www.FesliyanStudios.com_David_Renda-2.mp3' },
  { id: '70', name: 'Simplicity (v2)', url: '/music/2020-09-24_-_Simplicity_-_David_Fesliyan-2.mp3' },
  { id: '71', name: 'Tropical Keys (v2)', url: '/music/2020-09-14_-_Tropical_Keys_-_www.FesliyanStudios.com_David_Renda_1.mp3' },
  { id: '72', name: 'Chill Gaming (v2)', url: '/music/2019-06-07_-_Chill_Gaming_-_David_Fesliyan-2.mp3' },
  { id: '73', name: 'Peace (v2)', url: '/music/2015-11-08_-_Peace_-_David_Fesliyan-2.mp3' },
  { id: '74', name: 'An Ambient Day (v2)', url: '/music/2015-12-22_-_An_Ambient_Day_-_David_Fesliyan-2.mp3' },
  { id: '75', name: 'Peace And Happy (v2)', url: '/music/2016-04-26_-_Peace_And_Happy_-_David_Fesliyan-2.mp3' },
  { id: '76', name: 'On My Own (v2)', url: '/music/2019-06-27_-_On_My_Own_-_www.FesliyanStudios.com_-_David_Renda-2.mp3' },
  { id: '77', name: 'Strings of Time (v2)', url: '/music/2016-05-06_-_Strings_of_Time_-_David_Fesliyan_1.mp3' },
  { id: '78', name: 'Elven Forest (v2)', url: '/music/2019-07-29_-_Elven_Forest_-_FesliyanStudios.com_-_David_Renda-2.mp3' },
  { id: '79', name: 'Elevator Ride (v2)', url: '/music/2019-05-03_-_Elevator_Ride_-_www.fesliyanstudios.com-2.mp3' },
  { id: '80', name: 'The Lounge (v2)', url: '/music/2019-06-05_-_The_Lounge_-_www.fesliyanstudios.com_-_David_Renda-2.mp3' },
  { id: '81', name: 'The Soft Lullaby (v2)', url: '/music/2020-03-22_-_The_Soft_Lullaby_-_FesliyanStudios.com_-_David_Renda-2.mp3' },
  { id: '82', name: 'Not Much To Say (v2)', url: '/music/2020-02-11_-_Not_Much_To_Say_-_David_Fesliyan-2.mp3' },
  { id: '83', name: 'The Soft Lullaby (v3)', url: '/audio/2020-03-22_-_The_Soft_Lullaby_-_FesliyanStudios.com_-_David_Renda-3.mp3' },
  { id: '84', name: 'Not Much To Say (v3)', url: '/audio/2020-02-11_-_Not_Much_To_Say_-_David_Fesliyan-3.mp3' },
  { id: '85', name: 'Relaxing Green Nature (v2)', url: '/audio/2020-02-22_-_Relaxing_Green_Nature_-_David_Fesliyan-2.mp3' },
  { id: '86', name: 'We Were Friends (v2)', url: '/audio/2020-04-28_-_We_Were_Friends_-_David_Fesliyan-2.mp3' },
  { id: '87', name: 'Beautiful Memories (v1)', url: '/audio/Happy_Music-2018-09-18_-_Beautiful_Memories_-_David_Fesliyan_1.mp3' },
  { id: '88', name: 'In The Moment (v2)', url: '/audio/2020-05-05_-_In_The_Moment_-_www.FesliyanStudios.com_Steve_Oxen-2.mp3' },
  { id: '89', name: 'Champagne at Sunset (v2)', url: '/audio/2020-05-27_-_Champagne_at_Sunset_-_www.FesliyanStudios.com_Steve_Oxen-2.mp3' },
  { id: '90', name: 'Serenity (v2)', url: '/audio/2020-06-18_-_Serenity_-_www.FesliyanStudios.com_David_Renda-2.mp3' },
  { id: '91', name: 'Cathedral Ambience (v2)', url: '/audio/2020-06-18_-_Cathedral_Ambience_-_www.FesliyanStudios.com_David_Renda-2.mp3' },
  { id: '92', name: 'Painful Memories (v2)', url: '/audio/2020-08-17_-_Painful_Memories_-_www.FesliyanStudios.com_Steve_Oxen-2.mp3' },
  { id: '93', name: 'Stasis (1)', url: '/audio/2020-10-27_-_Stasis_-_www.FesliyanStudios.com_Steve_Oxen-2.mp3' },
  { id: '94', name: 'Upon Reflection (1)', url: '/audio/2020-10-27_-_Upon_Reflection_-_www.FesliyanStudios.com_Steve_Oxen-2.mp3' },
  { id: '95', name: 'Down Days (1)', url: '/audio/2020-11-16_-_Down_Days_-_www.FesliyanStudios.com_David_Renda-2.mp3' },
  { id: '96', name: 'Time Alone (1)', url: '/audio/2020-11-17_-_Time_Alone_-_www.FesliyanStudios.com_David_Renda-2.mp3' },
  { id: '97', name: 'Beauty Of Russia (1)', url: '/audio/2021-05-26_-_Beauty_Of_Russia_-_www.FesliyanStudios.com-2.mp3' },
  { id: '98', name: 'Irish Sunset (1)', url: '/audio/2021-06-03_-_Irish_Sunset_-_www.FesliyanStudios.com-2.mp3' },
  { id: '99', name: 'Country Fireside (1)', url: '/audio/2021-10-11_-_Country_Fireside_-_www.FesliyanStudios.com-2.mp3' },
  { id: '100', name: 'Heaven (1)', url: '/audio/2021-10-20_-_Heaven_-_David_Fesliyan-2.mp3' },
  { id: '101', name: 'Our Hopes And Dreams (1)', url: '/audio/2022-07-13_-_Our_Hopes_And_Dreams_-_www.FesliyanStudios.com-2.mp3' },
  { id: '102', name: 'Galaxys Endless Expanse (1)', url: '/audio/2023-05-02_-_Galaxys_Endless_Expanse_-_www.FesliyanStudios.com-2.mp3' },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string>('1');
  const [volume, setVolume] = useState<number>(50);
  const [showAllTracks, setShowAllTracks] = useState(true);
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState<typeof TRACKS>([]);
  const { favoriteIds, toggleFavorite, isFavorite } = useFavoriteTracks();

  // Load saved preferences on mount
  useEffect(() => {
    const savedTrackId = localStorage.getItem('musicPlayerTrackId');
    const savedVolume = localStorage.getItem('musicPlayerVolume');
    const savedShuffle = localStorage.getItem('musicPlayerShuffle');
    
    if (savedTrackId) setCurrentTrackId(savedTrackId);
    if (savedVolume) setVolume(parseInt(savedVolume, 10));
    if (savedShuffle) setIsShuffle(savedShuffle === 'true');
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

  // Shuffle tracks
  const shuffleArray = (array: typeof TRACKS) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    const newShuffleState = !isShuffle;
    setIsShuffle(newShuffleState);
    localStorage.setItem('musicPlayerShuffle', newShuffleState.toString());
    
    if (newShuffleState) {
      const shuffled = shuffleArray(TRACKS);
      setShuffledTracks(shuffled);
    }
  };

  // Play next track
  const playNextTrack = () => {
    let trackList = TRACKS;
    
    if (isShuffle) {
      // If shuffle is on but shuffledTracks is empty, create it
      if (shuffledTracks.length === 0) {
        trackList = shuffleArray(TRACKS);
        setShuffledTracks(trackList);
      } else {
        trackList = shuffledTracks;
      }
    }
    
    const currentIndex = trackList.findIndex(t => t.id === currentTrackId);
    const nextIndex = (currentIndex + 1) % trackList.length;
    const nextTrack = trackList[nextIndex];
    
    setCurrentTrackId(nextTrack.id);
    localStorage.setItem('musicPlayerTrackId', nextTrack.id);
    setIsPlaying(true);
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
  const displayTracks = showAllTracks ? TRACKS : TRACKS.filter(t => favoriteIds.includes(t.id));

  return (
    <div className="fixed bottom-0 left-0 right-0 h-[50px] bg-white border-t-2 border-black z-50">
      <div className="h-full max-w-7xl mx-auto px-2 flex items-center gap-2">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          variant="outline"
          size="sm"
          className="border-black text-black hover:bg-gray-100 h-8 w-8 p-0"
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>

        {/* Shuffle Button */}
        <Button
          onClick={toggleShuffle}
          variant="outline"
          size="sm"
          className={`border-black hover:bg-gray-100 h-8 w-8 p-0 ${
            isShuffle ? 'bg-gray-200 text-black' : 'text-black'
          }`}
          title={isShuffle ? "Shuffle: On" : "Shuffle: Off"}
        >
          <Shuffle className="h-3 w-3" />
        </Button>

        {/* Volume Slider */}
        <div className="flex items-center gap-1 w-24">
          <Volume2 className="h-3 w-3 text-black" />
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
          <p className="text-xs font-bold text-black truncate">{currentTrack.name}</p>
        </div>

        {/* Favorite Current Track Button */}
        <Button
          onClick={() => toggleFavorite(currentTrackId)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          title={isFavorite(currentTrackId) ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-3 w-3 ${isFavorite(currentTrackId) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
          />
        </Button>

        {/* My Playlist Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-black text-black hover:bg-gray-100 h-8 px-2 gap-1"
            >
              <Music className="h-3 w-3" />
              <span className="text-xs">My Playlist ({favoriteIds.length})</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] bg-white border-black z-[100]">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>My Favorite Tracks</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTracks(!showAllTracks)}
                className="h-6 px-2 text-xs"
              >
                {showAllTracks ? 'Show Favorites' : 'Show All'}
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {favoriteIds.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  No favorites yet. Click the heart icon to add tracks.
                </div>
              ) : (
                TRACKS.filter(t => favoriteIds.includes(t.id)).map((track) => (
                  <DropdownMenuItem
                    key={track.id}
                    onClick={() => handleTrackChange(track.id)}
                    className="cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-xs truncate">{track.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(track.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                    </Button>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Track Selector */}
        <Select value={currentTrackId} onValueChange={handleTrackChange}>
          <SelectTrigger className="w-[180px] h-8 border-black text-black bg-white text-xs">
            <SelectValue placeholder="Select track" />
          </SelectTrigger>
          <SelectContent className="bg-white border-black z-[100]">
            <ScrollArea className="h-[300px]">
              {displayTracks.map((track) => (
                <SelectItem key={track.id} value={track.id} className="text-black text-xs">
                  <div className="flex items-center justify-between w-full">
                    <span className="truncate">{track.name}</span>
                    {isFavorite(track.id) && (
                      <Heart className="h-3 w-3 fill-red-500 text-red-500 ml-2" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </ScrollArea>
          </SelectContent>
        </Select>

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={playNextTrack}
        />
      </div>
    </div>
  );
};
