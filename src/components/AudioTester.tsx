import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, CheckCircle, XCircle, Loader2, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioFile {
  slug: string;
  audioPath: string;
  language: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  error?: string;
}

interface RoomAudio {
  roomId: string;
  roomName: string;
  jsonFile: string;
  audioFiles: AudioFile[];
  loaded: boolean;
}

const VIP4_ROOMS = [
  { 
    id: "discover-self-vip4-career-1",
    name: "Discover Self",
    jsonFile: "Discover_Self_vip4_career_1.json"
  },
  { 
    id: "explore-world-vip4-career-i-2",
    name: "Explore World I",
    jsonFile: "Explore_World_vip4_career_I_2.json"
  },
  { 
    id: "explore-world-vip4-career-ii-2",
    name: "Explore World II",
    jsonFile: "Explore_World_vip4_career_II_2.json"
  },
  { 
    id: "build-skills-vip4-career-3",
    name: "Build Skills",
    jsonFile: "Build_Skills_vip4_career_3.json"
  },
  { 
    id: "build-skills-vip4-career-3-ii",
    name: "Build Skills Summary",
    jsonFile: "Build_Skills_vip4_career_3_II.json"
  },
  { 
    id: "launch-career-vip4-career-4-ii",
    name: "Launch Career Summary",
    jsonFile: "Launch_Career_vip4_career_4_II.json"
  },
  { 
    id: "grow-wealth-vip4-career-6",
    name: "Grow Wealth",
    jsonFile: "Grow_Wealth_vip4_career_6.json"
  }
];

export const AudioTester = () => {
  const [rooms, setRooms] = useState<RoomAudio[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAllRoomData();
  }, []);

  const loadAllRoomData = async () => {
    setLoading(true);
    const roomsData: RoomAudio[] = [];

    for (const room of VIP4_ROOMS) {
      try {
        const response = await fetch(`/data/${room.jsonFile}`);
        if (!response.ok) {
          throw new Error(`Failed to load ${room.jsonFile}`);
        }
        
        const data = await response.json();
        const audioFiles: AudioFile[] = [];

        // Extract audio files from entries
        if (data.entries && Array.isArray(data.entries)) {
          data.entries.forEach((entry: any) => {
            if (entry.audio) {
              if (typeof entry.audio === 'string') {
                audioFiles.push({
                  slug: entry.slug,
                  audioPath: entry.audio,
                  language: 'en',
                  status: 'pending'
                });
              } else if (typeof entry.audio === 'object') {
                Object.entries(entry.audio).forEach(([lang, path]) => {
                  audioFiles.push({
                    slug: entry.slug,
                    audioPath: path as string,
                    language: lang,
                    status: 'pending'
                  });
                });
              }
            }
          });
        }

        roomsData.push({
          roomId: room.id,
          roomName: room.name,
          jsonFile: room.jsonFile,
          audioFiles,
          loaded: true
        });
      } catch (error) {
        console.error(`Error loading ${room.jsonFile}:`, error);
        roomsData.push({
          roomId: room.id,
          roomName: room.name,
          jsonFile: room.jsonFile,
          audioFiles: [],
          loaded: false
        });
      }
    }

    setRooms(roomsData);
    setLoading(false);
  };

  const testAudioFile = async (roomIndex: number, audioIndex: number) => {
    const updatedRooms = [...rooms];
    const audioFile = updatedRooms[roomIndex].audioFiles[audioIndex];
    
    audioFile.status = 'loading';
    setRooms(updatedRooms);

    try {
      // Clean and construct audio path
      let audioPath = audioFile.audioPath;
      audioPath = audioPath.replace(/^\/audio\//, '');
      audioPath = audioPath.replace(/^audio\//, '');
      
      const fullPath = `/audio/${audioPath}`;
      
      // Test if file exists
      const response = await fetch(fullPath, { method: 'HEAD' });
      
      if (response.ok) {
        audioFile.status = 'success';
        audioFile.error = undefined;
      } else {
        audioFile.status = 'error';
        audioFile.error = `HTTP ${response.status}`;
      }
    } catch (error) {
      audioFile.status = 'error';
      audioFile.error = error instanceof Error ? error.message : 'Failed to load';
    }

    setRooms([...updatedRooms]);
  };

  const playAudio = async (roomIndex: number, audioIndex: number) => {
    const audioFile = rooms[roomIndex].audioFiles[audioIndex];
    
    if (currentlyPlaying === audioFile.audioPath) {
      audioRef.current?.pause();
      setCurrentlyPlaying(null);
      return;
    }

    try {
      let audioPath = audioFile.audioPath;
      audioPath = audioPath.replace(/^\/audio\//, '');
      audioPath = audioPath.replace(/^audio\//, '');
      
      const fullPath = `/audio/${audioPath}`;
      
      if (audioRef.current) {
        audioRef.current.src = fullPath;
        await audioRef.current.play();
        setCurrentlyPlaying(audioFile.audioPath);
      }
    } catch (error) {
      toast({
        title: "Playback Error",
        description: `Failed to play: ${audioFile.audioPath}`,
        variant: "destructive"
      });
    }
  };

  const testAllInRoom = async (roomIndex: number) => {
    const room = rooms[roomIndex];
    for (let i = 0; i < room.audioFiles.length; i++) {
      await testAudioFile(roomIndex, i);
      // Small delay to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  const testAllRooms = async () => {
    for (let roomIdx = 0; roomIdx < rooms.length; roomIdx++) {
      await testAllInRoom(roomIdx);
    }
    
    // Calculate summary
    const total = rooms.reduce((acc, room) => acc + room.audioFiles.length, 0);
    const success = rooms.reduce((acc, room) => 
      acc + room.audioFiles.filter(f => f.status === 'success').length, 0
    );
    const failed = rooms.reduce((acc, room) => 
      acc + room.audioFiles.filter(f => f.status === 'error').length, 0
    );

    toast({
      title: "Testing Complete",
      description: `${success}/${total} files loaded successfully. ${failed} failed.`,
      variant: success === total ? "default" : "destructive"
    });
  };

  const getStatusIcon = (status: AudioFile['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading room data...</span>
      </div>
    );
  }

  const totalFiles = rooms.reduce((acc, room) => acc + room.audioFiles.length, 0);
  const testedFiles = rooms.reduce((acc, room) => 
    acc + room.audioFiles.filter(f => f.status !== 'pending').length, 0
  );
  const successFiles = rooms.reduce((acc, room) => 
    acc + room.audioFiles.filter(f => f.status === 'success').length, 0
  );
  const failedFiles = rooms.reduce((acc, room) => 
    acc + room.audioFiles.filter(f => f.status === 'error').length, 0
  );

  return (
    <div className="space-y-4 p-4">
      <audio ref={audioRef} onEnded={() => setCurrentlyPlaying(null)} />
      
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Volume2 className="h-6 w-6" />
            VIP4 Audio File Tester
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Test and verify all audio files in VIP4 career rooms
          </p>
        </div>
        <Button onClick={testAllRooms} size="lg">
          Test All Rooms
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold">{totalFiles}</div>
          <div className="text-sm text-muted-foreground">Total Files</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">{testedFiles}</div>
          <div className="text-sm text-muted-foreground">Tested</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">{successFiles}</div>
          <div className="text-sm text-muted-foreground">Success</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-red-600">{failedFiles}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </Card>
      </div>

      {/* Room Cards */}
      <ScrollArea className="h-[600px]">
        <div className="space-y-4">
          {rooms.map((room, roomIdx) => (
            <Card key={room.roomId} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{room.roomName}</h3>
                  <p className="text-xs text-muted-foreground">{room.jsonFile}</p>
                  {!room.loaded && (
                    <Badge variant="destructive" className="mt-1">
                      Failed to load JSON
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {room.audioFiles.length} files
                  </Badge>
                  <Button
                    onClick={() => testAllInRoom(roomIdx)}
                    size="sm"
                    variant="outline"
                  >
                    Test All
                  </Button>
                </div>
              </div>

              {room.audioFiles.length > 0 ? (
                <div className="space-y-2">
                  {room.audioFiles.map((audio, audioIdx) => (
                    <div
                      key={`${audio.slug}-${audio.language}`}
                      className="flex items-center gap-3 p-2 rounded border bg-card hover:bg-accent/50 transition-colors"
                    >
                      {getStatusIcon(audio.status)}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium truncate">
                            {audio.slug}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {audio.language}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {audio.audioPath}
                        </div>
                        {audio.error && (
                          <div className="text-xs text-red-500 mt-1">
                            Error: {audio.error}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => testAudioFile(roomIdx, audioIdx)}
                          size="sm"
                          variant="outline"
                          disabled={audio.status === 'loading'}
                        >
                          {audio.status === 'loading' ? 'Testing...' : 'Test'}
                        </Button>
                        {audio.status === 'success' && (
                          <Button
                            onClick={() => playAudio(roomIdx, audioIdx)}
                            size="sm"
                            variant={currentlyPlaying === audio.audioPath ? "default" : "outline"}
                          >
                            {currentlyPlaying === audio.audioPath ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No audio files found in this room
                </p>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
