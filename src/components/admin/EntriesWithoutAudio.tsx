import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, AlertTriangle, CheckCircle, FileAudio } from "lucide-react";

interface EntryWithoutAudio {
  roomId: string;
  roomTitle: string;
  entrySlug: string;
  entryIndex: number;
}

interface RoomGroup {
  roomId: string;
  roomTitle: string;
  entries: EntryWithoutAudio[];
}

// Known non-room JSON files to skip
const NON_ROOM_FILES = [
  "components.json",
  "Tiers.json",
  "room-registry.json",
  "manifest.json",
];

export function EntriesWithoutAudio() {
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [entriesWithoutAudio, setEntriesWithoutAudio] = useState<EntryWithoutAudio[]>([]);
  const [totalEntries, setTotalEntries] = useState(0);
  const [entriesWithAudio, setEntriesWithAudio] = useState(0);

  const runScan = async () => {
    setLoading(true);
    setEntriesWithoutAudio([]);
    
    try {
      // Lazy-load JSON files only when scan runs (not at import time)
      const modules = import.meta.glob("/public/data/*.json");
      const loadedModules: Record<string, unknown> = {};
      for (const [path, loader] of Object.entries(modules)) {
        loadedModules[path] = await loader();
      }
      
      const missing: EntryWithoutAudio[] = [];
      let total = 0;
      let withAudio = 0;

      for (const [path, module] of Object.entries(loadedModules)) {
        const filename = path.split("/").pop() || "";
        
        // Skip non-room files
        if (NON_ROOM_FILES.includes(filename)) continue;
        
        const json = module as any;
        if (!json?.default?.entries && !json?.entries) continue;
        
        const data = json.default || json;
        const entries = data.entries;
        if (!Array.isArray(entries)) continue;

        const roomId = data.id || filename.replace(".json", "");
        const roomTitle = typeof data.title === "string" 
          ? data.title 
          : data.title?.en || roomId;

        entries.forEach((entry: any, index: number) => {
          total++;
          const hasAudio = entry.audio || entry.audio_en || entry.audioEn;
          
          if (hasAudio) {
            withAudio++;
          } else {
            missing.push({
              roomId,
              roomTitle,
              entrySlug: entry.slug || entry.artifact_id || entry.id || `entry-${index}`,
              entryIndex: index + 1,
            });
          }
        });
      }

      setTotalEntries(total);
      setEntriesWithAudio(withAudio);
      setEntriesWithoutAudio(missing);
      setScanned(true);
    } catch (error) {
      console.error("Scan error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group entries by room
  const groupedByRoom: RoomGroup[] = [];
  const roomMap = new Map<string, RoomGroup>();
  
  for (const entry of entriesWithoutAudio) {
    let group = roomMap.get(entry.roomId);
    if (!group) {
      group = { roomId: entry.roomId, roomTitle: entry.roomTitle, entries: [] };
      roomMap.set(entry.roomId, group);
      groupedByRoom.push(group);
    }
    group.entries.push(entry);
  }

  return (
    <Card className="border-2 border-black bg-white">
      <CardHeader className="border-b border-black">
        <CardTitle className="flex items-center gap-2 text-black">
          <FileAudio className="h-5 w-5" />
          Entries Without Audio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Button 
          onClick={runScan} 
          disabled={loading}
          className="mb-4 bg-black text-white hover:bg-gray-800"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Scanning..." : "Run Scan"}
        </Button>

        {scanned && (
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded border border-black p-3 text-center">
                <div className="text-2xl font-bold text-black">{totalEntries}</div>
                <div className="text-sm text-gray-600">Total Entries</div>
              </div>
              <div className="rounded border border-black p-3 text-center">
                <div className="text-2xl font-bold text-green-600">{entriesWithAudio}</div>
                <div className="text-sm text-gray-600">With Audio</div>
              </div>
              <div className="rounded border border-black p-3 text-center">
                <div className="text-2xl font-bold text-red-600">{entriesWithoutAudio.length}</div>
                <div className="text-sm text-gray-600">Missing Audio</div>
              </div>
            </div>

            {/* Results */}
            {entriesWithoutAudio.length === 0 ? (
              <div className="flex items-center gap-2 rounded bg-green-50 p-4 text-green-700">
                <CheckCircle className="h-5 w-5" />
                All entries have audio files!
              </div>
            ) : (
              <ScrollArea className="h-[500px] rounded border border-black">
                <div className="p-4 space-y-4">
                  {groupedByRoom.map((group) => (
                    <div key={group.roomId} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="font-bold text-black">{group.roomId}</span>
                        <span className="text-sm text-gray-500">({group.entries.length} missing)</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{group.roomTitle}</div>
                      <ul className="ml-6 space-y-1">
                        {group.entries.map((e, i) => (
                          <li key={i} className="text-sm text-gray-700">
                            Entry #{e.entryIndex}: <code className="bg-gray-100 px-1 rounded">{e.entrySlug}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
