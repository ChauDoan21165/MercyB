import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Music, Play, Pause, ArrowUp, ArrowDown, Plus, ArrowRight, FolderOpen, Search } from 'lucide-react';
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

export default function HomepageMusicController() {
  const [songs, setSongs] = useState<HomepageSong[]>([]);
  const [mbSongs, setMbSongs] = useState<HomepageSong[]>([]);
  const [availableFiles, setAvailableFiles] = useState<string[]>([]);
  const [fileSearch, setFileSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ song: HomepageSong; type: 'homepage' | 'mb' } | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { toast } = useToast();

  // Load audio manifest
  useEffect(() => {
    fetch('/audio/manifest.json')
      .then(res => res.json())
      .then((data: { files: string[] }) => {
        // Filter to show only .mp3 files that look like songs (not room audio)
        const songFiles = data.files.filter(f => 
          f.endsWith('.mp3') && 
          !f.includes('_en.mp3') && 
          !f.includes('_vi.mp3') &&
          !f.includes('day') &&
          !f.includes('entry')
        );
        setAvailableFiles(songFiles);
      })
      .catch(() => {
        setAvailableFiles([]);
      });
  }, []);

  // Load songs from localStorage
  useEffect(() => {
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
    
    const mbStored = localStorage.getItem(MB_SONGS_STORAGE_KEY);
    if (mbStored) {
      try {
        setMbSongs(JSON.parse(mbStored));
      } catch {
        setMbSongs([]);
      }
    }
  }, []);

  const saveSongs = (updatedSongs: HomepageSong[]) => {
    setSongs(updatedSongs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSongs));
  };
  
  const saveMbSongs = (updatedSongs: HomepageSong[]) => {
    setMbSongs(updatedSongs);
    localStorage.setItem(MB_SONGS_STORAGE_KEY, JSON.stringify(updatedSongs));
  };

  // Add file to a list
  const handleAddFile = (filename: string, target: 'homepage' | 'mb') => {
    const title = filename.replace('.mp3', '').replace(/_/g, ' ').replace(/-/g, ' ');
    const newSong: HomepageSong = {
      id: `${target}_${Date.now()}`,
      title_en: title,
      title_vi: title,
      audioSrc: `/audio/${filename}`,
      createdAt: new Date().toISOString()
    };

    if (target === 'homepage') {
      saveSongs([...songs, newSong]);
    } else {
      saveMbSongs([...mbSongs, newSong]);
    }

    toast({
      title: "Song added",
      description: `Added "${title}" to ${target === 'homepage' ? 'Homepage' : 'Mercy Blade'} songs.`
    });
  };

  // Move song between lists
  const handleMoveTo = (song: HomepageSong, from: 'homepage' | 'mb') => {
    if (from === 'homepage') {
      saveSongs(songs.filter(s => s.id !== song.id));
      saveMbSongs([...mbSongs, { ...song, id: `mb_${Date.now()}` }]);
    } else {
      saveMbSongs(mbSongs.filter(s => s.id !== song.id));
      saveSongs([...songs, { ...song, id: `song_${Date.now()}` }]);
    }
    toast({ title: "Song moved" });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    
    if (deleteTarget.type === 'homepage') {
      saveSongs(songs.filter(s => s.id !== deleteTarget.song.id));
    } else {
      saveMbSongs(mbSongs.filter(s => s.id !== deleteTarget.song.id));
    }
    
    if (playingId === deleteTarget.song.id) {
      setPlayingId(null);
      audioRef.current?.pause();
    }

    toast({ title: "Song deleted" });
    setDeleteTarget(null);
  };

  const handlePlayPause = (id: string, src: string) => {
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = src;
        audioRef.current.play().catch(() => {
          toast({ title: "Playback error", variant: "destructive" });
        });
        setPlayingId(id);
      }
    }
  };

  const handleMoveUp = (index: number, type: 'homepage' | 'mb') => {
    if (index === 0) return;
    const list = type === 'homepage' ? [...songs] : [...mbSongs];
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    type === 'homepage' ? saveSongs(list) : saveMbSongs(list);
  };

  const handleMoveDown = (index: number, type: 'homepage' | 'mb') => {
    const list = type === 'homepage' ? songs : mbSongs;
    if (index === list.length - 1) return;
    const newList = [...list];
    [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]];
    type === 'homepage' ? saveSongs(newList) : saveMbSongs(newList);
  };

  // Check if file is already in a list
  const isFileUsed = (filename: string) => {
    const path = `/audio/${filename}`;
    return songs.some(s => s.audioSrc === path) || mbSongs.some(s => s.audioSrc === path);
  };

  // Filter available files
  const filteredFiles = availableFiles.filter(f => 
    f.toLowerCase().includes(fileSearch.toLowerCase())
  );

  const renderSongList = (songList: HomepageSong[], type: 'homepage' | 'mb') => (
    songList.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No songs. Add from the list above.</p>
    ) : (
      <div className="space-y-2">
        {songList.map((song, index) => (
          <div 
            key={song.id}
            className="flex items-center gap-2 p-3 border border-black rounded bg-white"
          >
            <div className="flex flex-col">
              <button
                onClick={() => handleMoveUp(index, type)}
                disabled={index === 0}
                className="p-1 hover:bg-gray-100 disabled:opacity-30"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => handleMoveDown(index, type)}
                disabled={index === songList.length - 1}
                className="p-1 hover:bg-gray-100 disabled:opacity-30"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>
            
            <span className="text-xs text-gray-400 w-5">{index + 1}</span>
            
            <button
              onClick={() => handlePlayPause(song.id, song.audioSrc)}
              className="p-2 rounded-full bg-purple-100 hover:bg-purple-200"
            >
              {playingId === song.id ? (
                <Pause className="h-4 w-4 text-purple-700" />
              ) : (
                <Play className="h-4 w-4 text-purple-700" />
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className="font-medium text-black text-sm truncate">{song.title_en}</p>
              <p className="text-xs text-gray-500 truncate">{song.audioSrc}</p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMoveTo(song, type)}
              title={`Move to ${type === 'homepage' ? 'Mercy Blade' : 'Homepage'}`}
              className="text-blue-600 hover:bg-blue-50"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteTarget({ song, type })}
              className="text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-6">
      {/* Available Audio Files */}
      <Card className="bg-white border-2 border-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black">
            <FolderOpen className="h-6 w-6" />
            Available Audio Files ({availableFiles.length})
          </CardTitle>
          <CardDescription className="text-black">
            Click + to add a file to Homepage or Mercy Blade songs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={fileSearch}
              onChange={(e) => setFileSearch(e.target.value)}
              placeholder="Search files..."
              className="pl-10 border-black"
            />
          </div>
          
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded">
            {filteredFiles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No audio files found in manifest</p>
            ) : (
              <div className="divide-y">
                {filteredFiles.map(file => {
                  const used = isFileUsed(file);
                  return (
                    <div 
                      key={file}
                      className={`flex items-center gap-2 p-2 ${used ? 'bg-gray-100 opacity-60' : 'hover:bg-gray-50'}`}
                    >
                      <button
                        onClick={() => handlePlayPause(`file_${file}`, `/audio/${file}`)}
                        className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        {playingId === `file_${file}` ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </button>
                      
                      <span className="flex-1 text-sm font-mono truncate">{file}</span>
                      
                      {used ? (
                        <span className="text-xs text-gray-500 px-2">Added</span>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddFile(file, 'homepage')}
                            className="text-xs h-7"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Homepage
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddFile(file, 'mb')}
                            className="text-xs h-7 border-purple-300 text-purple-600 hover:bg-purple-50"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            MB Songs
                          </Button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Song Lists */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Homepage Songs */}
        <Card className="bg-white border-2 border-black">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-black text-lg">
              <Music className="h-5 w-5" />
              Homepage Songs ({songs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderSongList(songs, 'homepage')}
          </CardContent>
        </Card>

        {/* Mercy Blade Songs */}
        <Card className="bg-white border-2 border-purple-400">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-black text-lg">
              <Music className="h-5 w-5 text-purple-600" />
              Mercy Blade Songs ({mbSongs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderSongList(mbSongs, 'mb')}
          </CardContent>
        </Card>
      </div>

      <audio ref={audioRef} onEnded={() => setPlayingId(null)} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Song?</AlertDialogTitle>
            <AlertDialogDescription>
              Remove "{deleteTarget?.song.title_en}" from the list?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
