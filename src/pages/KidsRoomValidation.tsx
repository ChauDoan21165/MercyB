import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface KidsLevel {
  id: string;
  name_en: string;
  age_range: string;
  color_theme: string;
}

interface KidsRoom {
  id: string;
  level_id: string;
  title_en: string;
  is_active: boolean;
}

interface RoomStatus {
  room: KidsRoom;
  hasJson: boolean;
  jsonEntryCount: number;
  missingAudioFiles: string[];
  error?: string;
}

interface LevelStatus {
  level: KidsLevel;
  rooms: RoomStatus[];
}

export default function KidsRoomValidation() {
  const [levelStatuses, setLevelStatuses] = useState<LevelStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalLevels: 0,
    totalRooms: 0,
    totalEntries: 0,
    roomsWithIssues: 0,
  });

  useEffect(() => {
    validateRooms();
  }, []);

  const validateRooms = async () => {
    setLoading(true);
    try {
      // Fetch all levels
      const { data: levels, error: levelsError } = await supabase
        .from('kids_levels')
        .select('*')
        .order('display_order');

      if (levelsError) throw levelsError;

      const results: LevelStatus[] = [];
      let totalEntries = 0;
      let roomsWithIssues = 0;

      for (const level of levels || []) {
        // Fetch rooms for this level
        const { data: rooms, error: roomsError } = await supabase
          .from('kids_rooms')
          .select('*')
          .eq('level_id', level.id)
          .order('display_order');

        if (roomsError) throw roomsError;

        const roomStatuses: RoomStatus[] = [];

        for (const room of rooms || []) {
          try {
            // Try to fetch the JSON file
            const response = await fetch(`/data/kids/${room.id}.json`);
            
            if (response.ok) {
              const jsonData = await response.json();
              const entries = jsonData.entries || [];
              totalEntries += entries.length;

              // Check for missing audio files
              const missingAudio: string[] = [];
              for (const entry of entries) {
                if (entry.audio_url) {
                  try {
                    const audioResponse = await fetch(entry.audio_url);
                    if (!audioResponse.ok) {
                      missingAudio.push(entry.audio_url);
                    }
                  } catch {
                    missingAudio.push(entry.audio_url);
                  }
                }
              }

              if (entries.length === 0 || missingAudio.length > 0 || !room.is_active) {
                roomsWithIssues++;
              }

              roomStatuses.push({
                room,
                hasJson: true,
                jsonEntryCount: entries.length,
                missingAudioFiles: missingAudio,
              });
            } else {
              roomsWithIssues++;
              roomStatuses.push({
                room,
                hasJson: false,
                jsonEntryCount: 0,
                missingAudioFiles: [],
                error: 'JSON file not found',
              });
            }
          } catch (error) {
            roomsWithIssues++;
            roomStatuses.push({
              room,
              hasJson: false,
              jsonEntryCount: 0,
              missingAudioFiles: [],
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          }
        }

        results.push({
          level,
          rooms: roomStatuses,
        });
      }

      setLevelStatuses(results);
      setSummary({
        totalLevels: levels?.length || 0,
        totalRooms: results.reduce((acc, l) => acc + l.rooms.length, 0),
        totalEntries,
        roomsWithIssues,
      });
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomStatusIcon = (status: RoomStatus) => {
    if (status.error || !status.hasJson) {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    if (status.jsonEntryCount === 0 || status.missingAudioFiles.length > 0 || !status.room.is_active) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Kids Room Validation Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time status of all kids rooms, entries, and audio files</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalLevels}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRooms}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalEntries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Rooms With Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{summary.roomsWithIssues}</div>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="space-y-6">
          {levelStatuses.map((levelStatus) => (
            <Card key={levelStatus.level.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: levelStatus.level.color_theme }}
                  />
                  {levelStatus.level.name_en}
                </CardTitle>
                <CardDescription>
                  Age Range: {levelStatus.level.age_range} • {levelStatus.rooms.length} rooms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {levelStatus.rooms.map((roomStatus) => (
                    <div
                      key={roomStatus.room.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getRoomStatusIcon(roomStatus)}
                        <div>
                          <div className="font-medium">{roomStatus.room.title_en}</div>
                          <div className="text-sm text-muted-foreground">
                            {roomStatus.error ? (
                              <span className="text-destructive">{roomStatus.error}</span>
                            ) : (
                              <>
                                {roomStatus.jsonEntryCount} entries
                                {roomStatus.missingAudioFiles.length > 0 && (
                                  <span className="text-yellow-500">
                                    {' '}• {roomStatus.missingAudioFiles.length} missing audio
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!roomStatus.room.is_active && <Badge variant="secondary">Inactive</Badge>}
                        {roomStatus.hasJson && roomStatus.jsonEntryCount > 0 && (
                          <Badge variant="default">✓ JSON</Badge>
                        )}
                        {roomStatus.hasJson && roomStatus.missingAudioFiles.length === 0 && roomStatus.jsonEntryCount > 0 && (
                          <Badge variant="default">✓ Audio</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
