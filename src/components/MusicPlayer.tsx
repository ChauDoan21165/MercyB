import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Heart, Music, Shuffle } from 'lucide-react';
import { useMusicPlayer } from '@/contexts/MusicPlayerContext';
import { Button } from '@/components/ui/button';
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

// Mercy Blade original songs (26 tracks)
const MB_TRACKS = [
  { id: 'mb1', name: 'In A Quiet Room I Open My Mind', url: '/audio/in_a_quiet_room_i_open_my_mind.mp3' },
  { id: 'mb2', name: 'In A Quiet Room I Open My Mind (2)', url: '/audio/in_a_quiet_room_i_open_my_mind_2.mp3' },
  { id: 'mb3', name: 'When Mercy Looks at Me', url: '/audio/when_mercy_looks_at_me.mp3' },
  { id: 'mb4', name: 'When Mercy Looks at Me (1)', url: '/audio/when_mercy_looks_at_me_1.mp3' },
  { id: 'mb5', name: 'When Mercy Looks at Me (2)', url: '/audio/when_mercy_looks_at_me_2.mp3' },
  { id: 'mb6', name: 'When Mercy Looks at Me (3)', url: '/audio/when_mercy_looks_at_me_3.mp3' },
  { id: 'mb7', name: 'Heart of the Blade', url: '/audio/heart_of_the_blade.mp3' },
  { id: 'mb8', name: 'Heart of the Blade (1)', url: '/audio/heart_of_the_blade_1.mp3' },
  { id: 'mb8b', name: 'Heart of the Blade (2)', url: '/audio/heart_of_the_blade_2.mp3' },
  { id: 'mb9', name: 'Rise With Mercy', url: '/audio/rise_with_mercy.mp3' },
  { id: 'mb10', name: 'Where Mercy Finds Me', url: '/audio/where_mercy_finds_me.mp3' },
  { id: 'mb11', name: 'Where Mercy Finds Me (1)', url: '/audio/where_mercy_finds_me_1.mp3' },
  { id: 'mb12', name: 'Where Mercy Finds Me (2)', url: '/audio/where_mercy_finds_me_2.mp3' },
  { id: 'mb13', name: 'Where Mercy Finds Me (3)', url: '/audio/where_mercy_finds_me_3.mp3' },
  { id: 'mb14', name: 'Where Mercy Finds Me (4)', url: '/audio/where_mercy_finds_me_4.mp3' },
  { id: 'mb15', name: 'Where Mercy Finds Me (4 v2)', url: '/audio/where_mercy_finds_me_4_v2.mp3' },
  { id: 'mb16', name: 'Where Mercy Finds Me (5)', url: '/audio/where_mercy_finds_me_5.mp3' },
  { id: 'mb17', name: 'Where Mercy Finds Me (6)', url: '/audio/where_mercy_finds_me_6.mp3' },
  { id: 'mb18', name: 'Mercy On My Mind', url: '/audio/mercy_on_my_mind.mp3' },
  { id: 'mb19', name: 'Mercy On My Mind (1)', url: '/audio/mercy_on_my_mind_1.mp3' },
  { id: 'mb20', name: 'Mercy On My Mind (2)', url: '/audio/mercy_on_my_mind_2.mp3' },
  { id: 'mb21', name: 'Mercy On My Mind (3)', url: '/audio/mercy_on_my_mind_3.mp3' },
  { id: 'mb22', name: 'In the Quiet Mercy', url: '/audio/in_the_quiet_mercy.mp3' },
  { id: 'mb23', name: 'In the Quiet Mercy (2)', url: '/audio/in_the_quiet_mercy_2.mp3' },
  { id: 'mb24', name: 'Step With Me Mercy', url: '/audio/step_with_me_mercy.mp3' },
  { id: 'mb25', name: 'Step With Me Mercy (2)', url: '/audio/step_with_me_mercy_2.mp3' },
  { id: 'mb26', name: 'In A Quiet Room I Open My Mind (3)', url: '/audio/in_a_quiet_room_i_open_my_mind_3.mp3' },
];

// Common background music (Fesliyan Studios etc)
const COMMON_TRACKS = [
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
  { id: '117', name: 'Healing', url: '/audio/2015-08-11_-_Healing_-_David_Fesliyan.mp3' },
  { id: '120', name: 'Joy', url: '/audio/2015-12-12_-_Joy_-_David_Fesliyan.mp3' },
  { id: '123', name: 'Spirit', url: '/audio/2016-03-20_-_Spirit_-_David_Fesliyan.mp3' },
  { id: '148', name: 'Feels Good', url: '/audio/2019-10-21_-_Feels_Good_-_David_Fesliyan.mp3' },
  { id: '162', name: 'Feeling Free', url: '/audio/2021-01-09_-_Feeling_Free_-_www.FesliyanStudios.com_David_Renda.mp3' },
  { id: '163', name: 'Happy Feet', url: '/audio/2021-06-15_-_Happy_Feet_-_www.FesliyanStudios.com.mp3' },
  { id: '173', name: 'Happy Dreams', url: '/audio/2017-04-14_-_Happy_Dreams_-_David_Fesliyan.mp3' },
];

// All tracks combined for searching
const ALL_TRACKS = [...COMMON_TRACKS, ...MB_TRACKS];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackId, setCurrentTrackId] = useState<string>('1');
  const [volume, setVolume] = useState<number>(50);
  const [mode, setMode] = useState<"common" | "mercy" | "favorites">("common");
  const [isShuffle, setIsShuffle] = useState(false);
  const [shuffledTracks, setShuffledTracks] = useState<typeof ALL_TRACKS>([]);
  const { favoriteIds, toggleFavorite, isFavorite } = useFavoriteTracks();

  // Favorite tracks (filtered from ALL_TRACKS)
  const favoriteTracks = ALL_TRACKS.filter(t => favoriteIds.includes(t.id));

  // Load saved preferences on mount
  useEffect(() => {
    const savedTrackId = localStorage.getItem('musicPlayerTrackId');
    const savedVolume = localStorage.getItem('musicPlayerVolume');
    const savedShuffle = localStorage.getItem('musicPlayerShuffle');
    const savedMode = localStorage.getItem('musicPlayerMode') as "common" | "mercy" | "favorites" | null;
    
    if (savedTrackId) setCurrentTrackId(savedTrackId);
    if (savedVolume) setVolume(parseInt(savedVolume, 10));
    if (savedShuffle) setIsShuffle(savedShuffle === 'true');
    if (savedMode && ['common', 'mercy', 'favorites'].includes(savedMode)) setMode(savedMode);
  }, []);

  // Update audio element when track changes and auto-play if already playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrackId, isPlaying]);

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
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    localStorage.setItem('musicPlayerVolume', newVolume.toString());
  };

  // Shuffle tracks
  const shuffleArray = (array: typeof ALL_TRACKS) => {
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
      const shuffled = shuffleArray(getCurrentPlaylist());
      setShuffledTracks(shuffled);
    }
  };

  // Get current playlist based on mode
  const getCurrentPlaylist = () => {
    if (mode === "mercy") return MB_TRACKS;
    if (mode === "favorites" && favoriteTracks.length > 0) return favoriteTracks;
    return COMMON_TRACKS;
  };

  // Play next track
  const playNextTrack = () => {
    let trackList = getCurrentPlaylist();
    
    if (isShuffle) {
      if (shuffledTracks.length === 0) {
        trackList = shuffleArray(trackList);
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

  const currentTrack = ALL_TRACKS.find(t => t.id === currentTrackId) || COMMON_TRACKS[0];
  const currentPlaylist = getCurrentPlaylist();
  const displayTracks = currentPlaylist;

  const { updateFromPlayer } = useMusicPlayer();

  // Sync player state to context so GlobalPlayingIndicator can show it
  useEffect(() => {
    updateFromPlayer({
      isPlaying,
      currentTrackName: isPlaying ? currentTrack?.name : undefined,
    });
  }, [isPlaying, currentTrack?.name, updateFromPlayer]);

  // Reset state on unmount only
  useEffect(() => {
    return () => {
      updateFromPlayer({ isPlaying: false, currentTrackName: undefined });
    };
  }, [updateFromPlayer]);

  return (
    <div className="h-full w-full bg-card border border-border rounded-lg shadow-sm">
      <div className="h-full px-3 flex items-center gap-2">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlay}
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
        </Button>

        {/* Shuffle Button */}
        <Button
          onClick={toggleShuffle}
          variant="outline"
          size="sm"
          className={`h-8 w-8 p-0 transition-colors ${
            isShuffle 
              ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 border-2 border-amber-500' 
              : ''
          }`}
          title={isShuffle ? "Shuffle: On" : "Shuffle: Off"}
          aria-label={isShuffle ? "Turn shuffle off" : "Turn shuffle on"}
        >
          <Shuffle className="h-3 w-3" />
        </Button>

        {/* Volume Slider */}
        <div className="flex items-center gap-1 w-24">
          <Volume2 className="h-3 w-3 text-muted-foreground" />
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
          <p className="text-xs font-bold text-foreground truncate">{currentTrack.name}</p>
        </div>

        {/* Favorite Current Track Button */}
        <Button
          onClick={() => toggleFavorite(currentTrackId)}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          title={isFavorite(currentTrackId) ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-3 w-3 ${isFavorite(currentTrackId) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`}
          />
        </Button>

        {/* Mode Buttons: Common / Mercy Blade / My List */}
        <div className="flex gap-1">
          <Button
            onClick={() => {
              setMode("common");
              localStorage.setItem('musicPlayerMode', 'common');
              // Switch to first track of common playlist if current track not in it
              const currentInCommon = COMMON_TRACKS.find(t => t.id === currentTrackId);
              if (!currentInCommon && COMMON_TRACKS.length > 0) {
                setCurrentTrackId(COMMON_TRACKS[0].id);
                localStorage.setItem('musicPlayerTrackId', COMMON_TRACKS[0].id);
              }
            }}
            variant="outline"
            size="sm"
            className={`h-8 px-2 transition-colors text-xs ${
              mode === "common"
                ? 'bg-blue-500 text-white hover:bg-blue-600 border-blue-500 font-bold'
                : ''
            }`}
            title={`Common playlist (${COMMON_TRACKS.length} tracks)`}
          >
            Common
          </Button>
          <Button
            onClick={() => {
              setMode("mercy");
              localStorage.setItem('musicPlayerMode', 'mercy');
              // Switch to first track of MB playlist if current track not in it
              const currentInMB = MB_TRACKS.find(t => t.id === currentTrackId);
              if (!currentInMB && MB_TRACKS.length > 0) {
                setCurrentTrackId(MB_TRACKS[0].id);
                localStorage.setItem('musicPlayerTrackId', MB_TRACKS[0].id);
              }
            }}
            variant="outline"
            size="sm"
            className={`h-8 px-2 transition-colors text-xs ${
              mode === "mercy"
                ? 'bg-purple-500 text-white hover:bg-purple-600 border-purple-500 font-bold'
                : ''
            }`}
            title={`Mercy Blade Songs (${MB_TRACKS.length} tracks)`}
          >
            MB Songs
          </Button>
          <Button
            onClick={() => {
              if (favoriteTracks.length > 0) {
                setMode("favorites");
                localStorage.setItem('musicPlayerMode', 'favorites');
                // Switch to first favorite track if current track not in favorites
                const currentInFavorites = favoriteTracks.find(t => t.id === currentTrackId);
                if (!currentInFavorites && favoriteTracks.length > 0) {
                  setCurrentTrackId(favoriteTracks[0].id);
                  localStorage.setItem('musicPlayerTrackId', favoriteTracks[0].id);
                }
              }
            }}
            disabled={favoriteTracks.length === 0}
            variant="outline"
            size="sm"
            className={`h-8 px-2 transition-colors text-xs ${
              mode === "favorites"
                ? 'bg-pink-500 text-white hover:bg-pink-600 border-pink-500 font-bold'
                : ''
            }`}
            title={favoriteTracks.length === 0 ? "No favorites yet" : `My favorites (${favoriteTracks.length})`}
          >
            <Heart className={`h-3 w-3 mr-1 ${mode === "favorites" ? 'fill-current' : ''}`} />
            My List
          </Button>
        </div>

        {/* Favorites List Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 gap-1"
            >
              <Music className="h-3 w-3" />
              <span className="text-xs">({favoriteIds.length})</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[300px] z-[100]">
            <DropdownMenuLabel>Favorite Tracks</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {favoriteIds.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No favorites yet. Click the heart icon to add tracks.
                </div>
              ) : (
                ALL_TRACKS.filter(t => favoriteIds.includes(t.id)).map((track) => (
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

        {/* Track Selector - Using DropdownMenu for better reliability */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[180px] h-8 text-xs justify-between"
            >
              <span className="truncate">{currentTrack?.name || 'Select track'}</span>
              <Music className="h-3 w-3 ml-1 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-[280px] z-[9999] bg-popover border border-border shadow-xl"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs font-semibold">
              {mode === "mercy" ? "MB Songs" : mode === "favorites" ? "My Favorites" : "Common Tracks"} ({displayTracks.length})
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[300px]">
              {displayTracks.map((track) => (
                <DropdownMenuItem
                  key={track.id}
                  onClick={() => handleTrackChange(track.id)}
                  className={`cursor-pointer text-xs ${currentTrackId === track.id ? 'bg-accent' : ''}`}
                >
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className="truncate flex-1">{track.name}</span>
                    {isFavorite(track.id) && (
                      <Heart className="h-3 w-3 fill-red-500 text-red-500 shrink-0" />
                    )}
                    {currentTrackId === track.id && (
                      <span className="text-primary shrink-0">▶</span>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="none"
        onEnded={playNextTrack}
      />
      </div>
    </div>
  );
};
