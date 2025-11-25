import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertCircle, Loader2, StopCircle, Search, Zap } from "lucide-react";
import { toast } from "sonner";

interface Room {
  id: string;
  tier: string;
  title_en: string;
  is_active?: boolean;
  entries?: any;
}

interface RoomStatus {
  room: Room;
  hasJson: boolean;
  jsonEntryCount: number;
  missingAudioFiles: string[];
  error?: string;
}

export default function KidsRoomValidation() {
  const [selectedTier, setSelectedTier] = useState<string>("");
  const [roomStatuses, setRoomStatuses] = useState<RoomStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [summary, setSummary] = useState({
    totalRooms: 0,
    totalEntries: 0,
    roomsWithIssues: 0,
  });

  const tiers = [
    { value: "free", label: "Free" },
    { value: "VIP1", label: "VIP1" },
    { value: "VIP2", label: "VIP2" },
    { value: "VIP3", label: "VIP3" },
    { value: "VIP4", label: "VIP4" },
    { value: "VIP5", label: "VIP5" },
    { value: "VIP6", label: "VIP6" },
    { value: "VIP7", label: "VIP7" },
    { value: "VIP8", label: "VIP8" },
    { value: "VIP9", label: "VIP9" },
    { value: "kids_level_1", label: "Kids Level 1" },
    { value: "kids_level_2", label: "Kids Level 2" },
    { value: "kids_level_3", label: "Kids Level 3" },
  ];

  const stopScan = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setScanning(false);
      setLoading(false);
      toast.info("Scan stopped");
    }
  };

  const validateRooms = async (deepScan: boolean = false) => {
    if (!selectedTier) {
      toast.error("Please select a tier first");
      return;
    }

    setLoading(true);
    setScanning(true);
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    try {
      if (signal.aborted) throw new Error("Scan cancelled");
      
      toast.info(`Starting ${deepScan ? 'deep' : 'quick'} scan for ${selectedTier}...`);

      // Fetch rooms for selected tier
      const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('tier', selectedTier)
        .order('title_en');

      if (roomsError) throw roomsError;

      const results: RoomStatus[] = [];
      let totalEntries = 0;
      let roomsWithIssues = 0;

      for (const room of rooms || []) {
        if (signal.aborted) throw new Error("Scan cancelled");
        
        try {
          // Try to fetch the JSON file
          const response = await fetch(`/data/${room.id}.json`, { signal });
          
          if (response.ok) {
            const jsonData = await response.json();
            const entries = jsonData.entries || [];
            totalEntries += entries.length;

            // Deep scan checks audio files
            const missingAudio: string[] = [];
            if (deepScan) {
              for (const entry of entries) {
                const audioFile = entry.audio_file || entry.audio_url;
                if (audioFile) {
                  try {
                    const audioPath = audioFile.startsWith('/') ? audioFile : `/audio/${audioFile}`;
                    const audioResponse = await fetch(audioPath, { signal });
                    if (!audioResponse.ok) {
                      missingAudio.push(audioFile);
                    }
                  } catch {
                    missingAudio.push(audioFile);
                  }
                }
              }
            }

            if (entries.length === 0 || (deepScan && missingAudio.length > 0)) {
              roomsWithIssues++;
            }

            results.push({
              room,
              hasJson: true,
              jsonEntryCount: entries.length,
              missingAudioFiles: missingAudio,
            });
          } else {
            roomsWithIssues++;
            results.push({
              room,
              hasJson: false,
              jsonEntryCount: 0,
              missingAudioFiles: [],
              error: 'JSON file not found',
            });
          }
        } catch (error) {
          if (signal.aborted) throw error;
          roomsWithIssues++;
          results.push({
            room,
            hasJson: false,
            jsonEntryCount: 0,
            missingAudioFiles: [],
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      }

      setRoomStatuses(results);
      setSummary({
        totalRooms: rooms?.length || 0,
        totalEntries,
        roomsWithIssues,
      });
      
      toast.success(`${deepScan ? 'Deep' : 'Quick'} scan complete: ${results.length} rooms checked`);
    } catch (error) {
      if (error instanceof Error && error.message === "Scan cancelled") {
        console.log('Scan was cancelled by user');
      } else {
        console.error('Validation error:', error);
        toast.error("Validation failed");
      }
    } finally {
      setLoading(false);
      setScanning(false);
      abortControllerRef.current = null;
    }
  };

  const getRoomStatusIcon = (status: RoomStatus) => {
    if (status.error || !status.hasJson) {
      return <XCircle className="h-5 w-5 text-destructive" />;
    }
    if (status.jsonEntryCount === 0 || status.missingAudioFiles.length > 0) {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
    return <CheckCircle2 className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Health Check</h1>
          <p className="text-muted-foreground mt-2">Validate room JSON files, entries, and audio files</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Tier and Scan Type</CardTitle>
          <CardDescription>Choose a tier to validate, then run a quick or deep scan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Tier</label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tier to scan" />
                </SelectTrigger>
                <SelectContent>
                  {tiers.map((tier) => (
                    <SelectItem key={tier.value} value={tier.value}>
                      {tier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {scanning && (
                <Button 
                  onClick={stopScan}
                  variant="destructive"
                  className="gap-2"
                >
                  <StopCircle className="h-4 w-4" />
                  Stop
                </Button>
              )}
              <Button 
                onClick={() => validateRooms(false)} 
                disabled={loading || !selectedTier}
                variant="outline"
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Quick Scan
              </Button>
              <Button 
                onClick={() => validateRooms(true)} 
                disabled={loading || !selectedTier}
                className="gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Deep Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      {roomStatuses.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <Card>
                <CardHeader>
                  <CardTitle>
                    {selectedTier} Rooms
                  </CardTitle>
                  <CardDescription>
                    {roomStatuses.length} rooms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {roomStatuses.map((roomStatus) => (
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
            </div>
          </ScrollArea>
        </>
      )}
    </div>
  );
}
