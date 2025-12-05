import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Music, Upload, Play, Pause, GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

interface HomepageSong {
  id: string;
  title_en: string;
  title_vi: string;
  audioSrc: string;
  createdAt: string;
}

const STORAGE_KEY = 'mercyBladeHomepageSongs';
const MB_SONGS_STORAGE_KEY = 'mercyBladeSongs';

const DEFAULT_SONGS: HomepageSong[] = [
  {
    id: 'mercy_blade_theme',
    title_en: 'The Song of Mercy Blade',
    title_vi: 'Khúc Ca Mercy Blade',
    audioSrc: '/audio/mercy_blade_theme.mp3',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_MB_SONGS: HomepageSong[] = [];

export default function HomepageMusicController() {
  const [songs, setSongs] = useState<HomepageSong[]>([]);
  const [mbSongs, setMbSongs] = useState<HomepageSong[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<{ song: HomepageSong; type: 'homepage' | 'mb' } | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // New song form (Homepage)
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleVi, setNewTitleVi] = useState('');
  const [newAudioSrc, setNewAudioSrc] = useState('');
  
  // New song form (Mercy Blade Songs)
  const [mbTitleEn, setMbTitleEn] = useState('');
  const [mbTitleVi, setMbTitleVi] = useState('');
  const [mbAudioSrc, setMbAudioSrc] = useState('');
  
  const { toast } = useToast();

  // Load songs from localStorage
  useEffect(() => {
    // Homepage songs
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSongs(JSON.parse(stored));
      } catch {
        setSongs(DEFAULT_SONGS);
      }
    } else {
      setSongs(DEFAULT_SONGS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SONGS));
    }
    
    // Mercy Blade songs
    const mbStored = localStorage.getItem(MB_SONGS_STORAGE_KEY);
    if (mbStored) {
      try {
        setMbSongs(JSON.parse(mbStored));
      } catch {
        setMbSongs(DEFAULT_MB_SONGS);
      }
    } else {
      setMbSongs(DEFAULT_MB_SONGS);
    }
  }, []);

  // Save homepage songs
  const saveSongs = (updatedSongs: HomepageSong[]) => {
    setSongs(updatedSongs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSongs));
  };
  
  // Save Mercy Blade songs
  const saveMbSongs = (updatedSongs: HomepageSong[]) => {
    setMbSongs(updatedSongs);
    localStorage.setItem(MB_SONGS_STORAGE_KEY, JSON.stringify(updatedSongs));
  };

  const handleAddSong = () => {
    if (!newTitleEn.trim() || !newAudioSrc.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in English title and audio path.",
        variant: "destructive"
      });
      return;
    }

    const newSong: HomepageSong = {
      id: `song_${Date.now()}`,
      title_en: newTitleEn.trim(),
      title_vi: newTitleVi.trim() || newTitleEn.trim(),
      audioSrc: newAudioSrc.startsWith('/') ? newAudioSrc : `/audio/${newAudioSrc}`,
      createdAt: new Date().toISOString()
    };

    const updated = [...songs, newSong];
    saveSongs(updated);

    setNewTitleEn('');
    setNewTitleVi('');
    setNewAudioSrc('');

    toast({
      title: "Song added",
      description: `"${newSong.title_en}" has been added to the homepage.`
    });
  };
  
  const handleAddMbSong = () => {
    if (!mbTitleEn.trim() || !mbAudioSrc.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in English title and audio path.",
        variant: "destructive"
      });
      return;
    }

    const newSong: HomepageSong = {
      id: `mb_song_${Date.now()}`,
      title_en: mbTitleEn.trim(),
      title_vi: mbTitleVi.trim() || mbTitleEn.trim(),
      audioSrc: mbAudioSrc.startsWith('/') ? mbAudioSrc : `/audio/${mbAudioSrc}`,
      createdAt: new Date().toISOString()
    };

    const updated = [...mbSongs, newSong];
    saveMbSongs(updated);

    setMbTitleEn('');
    setMbTitleVi('');
    setMbAudioSrc('');

    toast({
      title: "Mercy Blade Song added",
      description: `"${newSong.title_en}" has been added.`
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'homepage') {
      const updated = songs.filter(s => s.id !== deleteTarget.song.id);
      saveSongs(updated);
    } else {
      const updated = mbSongs.filter(s => s.id !== deleteTarget.song.id);
      saveMbSongs(updated);
    }
    
    if (playingId === deleteTarget.song.id) {
      setPlayingId(null);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    toast({
      title: "Song deleted",
      description: `"${deleteTarget.song.title_en}" has been removed.`
    });
    
    setDeleteTarget(null);
  };

  const handlePlayPause = (song: HomepageSong) => {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = song.audioSrc;
        audioRef.current.play().catch(() => {
          toast({
            title: "Playback error",
            description: "Could not play this audio file.",
            variant: "destructive"
          });
        });
        setPlayingId(song.id);
      }
    }
  };

  const handleAudioEnded = () => {
    setPlayingId(null);
  };
  
  // Move song up/down
  const handleMoveUp = (index: number, type: 'homepage' | 'mb') => {
    if (index === 0) return;
    const list = type === 'homepage' ? [...songs] : [...mbSongs];
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    if (type === 'homepage') {
      saveSongs(list);
    } else {
      saveMbSongs(list);
    }
  };

  const handleMoveDown = (index: number, type: 'homepage' | 'mb') => {
    const list = type === 'homepage' ? songs : mbSongs;
    if (index === list.length - 1) return;
    const newList = [...list];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    if (type === 'homepage') {
      saveSongs(newList);
    } else {
      saveMbSongs(newList);
    }
  };

  // Render song list component
  const renderSongList = (songList: HomepageSong[], type: 'homepage' | 'mb') => (
    songList.length === 0 ? (
      <p className="text-gray-500 text-center py-8">
        No songs added yet. Add your first song above.
      </p>
    ) : (
      <div className="space-y-3">
        {songList.map((song, index) => (
          <div 
            key={song.id}
            className="flex items-center justify-between p-4 border border-black rounded bg-white"
          >
            <div className="flex items-center gap-3 flex-1">
              {/* Reorder controls */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleMoveUp(index, type)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ArrowUp className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleMoveDown(index, type)}
                  disabled={index === songList.length - 1}
                  className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ArrowDown className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <span className="text-xs text-gray-400 font-mono w-6">{index + 1}</span>
              
              <button
                onClick={() => handlePlayPause(song)}
                className="p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors"
              >
                {playingId === song.id ? (
                  <Pause className="h-5 w-5 text-purple-700" />
                ) : (
                  <Play className="h-5 w-5 text-purple-700" />
                )}
              </button>
              <div>
                <p className="font-semibold text-black">{song.title_en}</p>
                <p className="text-sm text-gray-600">{song.title_vi}</p>
                <p className="text-xs text-gray-400 mt-1">{song.audioSrc}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteTarget({ song, type })}
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      {/* Homepage Music Controller */}
      <Card className="bg-white border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Music className="h-6 w-6" />
            Homepage Music Controller
          </CardTitle>
          <CardDescription className="text-black">
            Manage songs displayed in the Theme Song section on the homepage.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add New Song Form */}
          <div className="p-4 border border-black rounded bg-gray-50">
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Add New Song
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-black">English Title *</Label>
                <Input
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="The Song of Mercy Blade"
                  className="border-black"
                />
              </div>
              <div>
                <Label className="text-black">Vietnamese Title</Label>
                <Input
                  value={newTitleVi}
                  onChange={(e) => setNewTitleVi(e.target.value)}
                  placeholder="Khúc Ca Mercy Blade"
                  className="border-black"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-black">Audio Path *</Label>
                <Input
                  value={newAudioSrc}
                  onChange={(e) => setNewAudioSrc(e.target.value)}
                  placeholder="/audio/song_name.mp3 or just song_name.mp3"
                  className="border-black"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Upload audio to public/audio/ first, then enter the filename here.
                </p>
              </div>
            </div>
            <Button 
              onClick={handleAddSong}
              className="mt-4 bg-black text-white hover:bg-gray-800"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          </div>

          {/* Songs List */}
          <div>
            <h3 className="font-bold text-black mb-4">
              Current Songs ({songs.length})
            </h3>
            {renderSongList(songs, 'homepage')}
          </div>
        </CardContent>
      </Card>

      {/* Mercy Blade Songs */}
      <Card className="bg-white border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <Music className="h-6 w-6 text-purple-600" />
            Mercy Blade Songs
          </CardTitle>
          <CardDescription className="text-black">
            Original songs created exclusively for Mercy Blade app.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Add New MB Song Form */}
          <div className="p-4 border border-purple-300 rounded bg-purple-50">
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Add Mercy Blade Song
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-black">English Title *</Label>
                <Input
                  value={mbTitleEn}
                  onChange={(e) => setMbTitleEn(e.target.value)}
                  placeholder="Healing Waters"
                  className="border-purple-300"
                />
              </div>
              <div>
                <Label className="text-black">Vietnamese Title</Label>
                <Input
                  value={mbTitleVi}
                  onChange={(e) => setMbTitleVi(e.target.value)}
                  placeholder="Dòng Nước Chữa Lành"
                  className="border-purple-300"
                />
              </div>
              <div className="md:col-span-2">
                <Label className="text-black">Audio Path *</Label>
                <Input
                  value={mbAudioSrc}
                  onChange={(e) => setMbAudioSrc(e.target.value)}
                  placeholder="/audio/mb_song_name.mp3"
                  className="border-purple-300"
                />
              </div>
            </div>
            <Button 
              onClick={handleAddMbSong}
              className="mt-4 bg-purple-600 text-white hover:bg-purple-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Song
            </Button>
          </div>

          {/* MB Songs List */}
          <div>
            <h3 className="font-bold text-black mb-4">
              Mercy Blade Songs ({mbSongs.length})
            </h3>
            {renderSongList(mbSongs, 'mb')}
          </div>
        </CardContent>
      </Card>

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleAudioEnded} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Song?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.song.title_en}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
