import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Music, AlertTriangle, CheckSquare, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

interface MusicFile {
  id: string;
  name: string;
  url: string;
  filename: string;
}

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
  { id: '63', name: 'Slow Funny Music A', url: '/audio/2019-02-21_-_Slow_Funny_Music_A_-_www.fesliyanstudios.com_-_David_Renda.mp3' },
];

export default function MusicManager() {
  const [tracks, setTracks] = useState<MusicFile[]>([]);
  const [deleteTrack, setDeleteTrack] = useState<MusicFile | null>(null);
  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(new Set());
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Convert TRACKS to MusicFile format with filenames extracted
    const musicFiles = TRACKS.map(track => ({
      ...track,
      filename: track.url.split('/').pop() || ''
    }));
    setTracks(musicFiles);
  }, []);

  const handleDeleteClick = (track: MusicFile) => {
    setDeleteTrack(track);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTrack) return;

    // Remove from local state
    setTracks(tracks.filter(t => t.id !== deleteTrack.id));
    
    // Remove from selected if it was selected
    const newSelected = new Set(selectedTracks);
    newSelected.delete(deleteTrack.id);
    setSelectedTracks(newSelected);
    
    toast({
      title: "Track Removed",
      description: `${deleteTrack.name} has been removed from the music player.`,
    });

    setDeleteTrack(null);
  };

  const handleToggleSelect = (trackId: string) => {
    const newSelected = new Set(selectedTracks);
    if (newSelected.has(trackId)) {
      newSelected.delete(trackId);
    } else {
      newSelected.add(trackId);
    }
    setSelectedTracks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTracks.size === tracks.length) {
      setSelectedTracks(new Set());
    } else {
      setSelectedTracks(new Set(tracks.map(t => t.id)));
    }
  };

  const handleSelectAllDuplicates = () => {
    const duplicates = tracks.filter(t => 
      t.name.includes('(1)') || t.name.includes('(2)') || t.name.includes('(v2)') || t.name.includes('(v3)')
    );
    setSelectedTracks(new Set(duplicates.map(t => t.id)));
  };

  const handleBulkDeleteClick = () => {
    if (selectedTracks.size === 0) {
      toast({
        title: "No tracks selected",
        description: "Please select tracks to delete.",
        variant: "destructive",
      });
      return;
    }
    setShowBulkDeleteDialog(true);
  };

  const handleBulkDeleteConfirm = () => {
    const deletedCount = selectedTracks.size;
    const remainingTracks = tracks.filter(t => !selectedTracks.has(t.id));
    setTracks(remainingTracks);
    setSelectedTracks(new Set());
    setShowBulkDeleteDialog(false);
    
    toast({
      title: "Tracks Removed",
      description: `${deletedCount} track${deletedCount > 1 ? 's' : ''} removed from the music player.`,
    });
  };

  const getDuplicateIndicator = (name: string) => {
    if (name.includes('(1)') || name.includes('(2)') || name.includes('(v2)') || name.includes('(v3)')) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-300">
          <AlertTriangle className="h-3 w-3" />
          Duplicate
        </span>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="bg-white border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Music className="h-6 w-6" />
            Music File Manager
          </CardTitle>
          <CardDescription className="text-black">
            Manage all music files in the player. All duplicates have been removed - only unique tracks remain.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-4 bg-gray-50 border border-black rounded">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-bold text-black mb-1">Total Tracks: {tracks.length}</p>
                <p className="text-xs text-black">
                  {selectedTracks.size} selected | All duplicates removed - only unique tracks remain
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-gray-100"
                >
                  {selectedTracks.size === tracks.length ? (
                    <>
                      <CheckSquare className="h-4 w-4 mr-1" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="h-4 w-4 mr-1" />
                      Select All
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleSelectAllDuplicates}
                  variant="outline"
                  size="sm"
                  className="border-black text-black hover:bg-gray-100"
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Select Duplicates
                </Button>
                <Button
                  onClick={handleBulkDeleteClick}
                  disabled={selectedTracks.size === 0}
                  variant="outline"
                  size="sm"
                  className="border-black text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected ({selectedTracks.size})
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[600px] border border-black rounded">
            <div className="space-y-2 p-4">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className={`flex items-center gap-3 p-3 border border-black rounded hover:bg-gray-50 ${
                    selectedTracks.has(track.id) ? 'bg-blue-50' : 'bg-white'
                  }`}
                >
                  <Checkbox
                    checked={selectedTracks.has(track.id)}
                    onCheckedChange={() => handleToggleSelect(track.id)}
                    className="border-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-black text-sm">{track.name}</p>
                      {getDuplicateIndicator(track.name)}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{track.filename}</p>
                  </div>
                  <Button
                    onClick={() => handleDeleteClick(track)}
                    variant="outline"
                    size="sm"
                    className="border-black text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Single Delete Dialog */}
      <AlertDialog open={!!deleteTrack} onOpenChange={() => setDeleteTrack(null)}>
        <AlertDialogContent className="bg-white border-2 border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Delete Music File?</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to delete "{deleteTrack?.name}"? This action cannot be undone.
              <br />
              <br />
              <span className="text-xs text-gray-600">File: {deleteTrack?.filename}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-black text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent className="bg-white border-2 border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black">Delete {selectedTracks.size} Tracks?</AlertDialogTitle>
            <AlertDialogDescription className="text-black">
              Are you sure you want to delete {selectedTracks.size} selected track{selectedTracks.size > 1 ? 's' : ''}? This action cannot be undone.
              <br />
              <br />
              <span className="text-xs text-gray-600 font-bold">
                Selected tracks: {Array.from(selectedTracks).slice(0, 5).map(id => {
                  const track = tracks.find(t => t.id === id);
                  return track?.name;
                }).join(', ')}
                {selectedTracks.size > 5 ? ` and ${selectedTracks.size - 5} more...` : ''}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-black text-black">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDeleteConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
