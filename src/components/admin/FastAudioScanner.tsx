import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, CheckCircle, XCircle, Loader2, Volume2, AlertTriangle } from "lucide-react";

interface MissingAudio {
  roomId: string;
  tier: string;
  entrySlug: string;
  filename: string;
}

interface ScanResult {
  totalJsonFiles: number;
  validRoomFiles: number;
  orphanFiles: string[];
  totalEntries: number;
  totalAudioRefs: number;
  uniqueFilenames: number;
  missingCount: number;
  missingByRoom: Record<string, MissingAudio[]>;
}

// Lazy-loaded data modules (NOT eager - loaded on demand when scan runs)
let dataModulesCache: Record<string, unknown> | null = null;

async function getDataModules(): Promise<Record<string, unknown>> {
  if (!dataModulesCache) {
    // Use dynamic import pattern - modules loaded when function is called, not at import time
    const modules = import.meta.glob('/public/data/*.json');
    const entries = await Promise.all(
      Object.entries(modules).map(async ([path, loader]) => {
        const mod = await loader();
        return [path, mod] as const;
      })
    );
    dataModulesCache = Object.fromEntries(entries);
  }
  return dataModulesCache;
}

// Non-room files to exclude
const EXCLUDED_FILES = new Set([
  'components.json',
  'Tiers.json',
  'Tiers_.json',
  'Package_Lock.json',
  '.gitkeep',
]);

function normalizeAudioFilename(raw: string): string {
  let s = raw.trim();
  if (s.startsWith("/")) s = s.slice(1);
  if (s.toLowerCase().startsWith("audio/")) s = s.slice("audio/".length);
  return s;
}

function isValidRoomJson(json: any, fileName: string): boolean {
  // Exclude known non-room files
  if (EXCLUDED_FILES.has(fileName)) return false;
  
  // Must have entries array
  if (!json.entries || !Array.isArray(json.entries)) return false;
  
  // Must have at least one entry
  if (json.entries.length === 0) return false;
  
  // Must have id or be a proper room structure
  if (!json.id && !json.name && !json.title) return false;
  
  return true;
}

async function checkAudioExists(filename: string): Promise<boolean> {
  try {
    const response = await fetch(`/audio/${filename}`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export function FastAudioScanner() {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [currentFile, setCurrentFile] = useState<string>("");
  const [showOrphans, setShowOrphans] = useState(false);

  const runScan = useCallback(async () => {
    setScanning(true);
    setProgress(0);
    setResult(null);
    setCurrentFile("Loading JSON files...");

    // Load data modules on demand (not at import time)
    const dataModules = await getDataModules();
    const jsonFiles = Object.entries(dataModules);
    const totalFiles = jsonFiles.length;
    
    let validRoomFiles = 0;
    let totalEntries = 0;
    let totalAudioRefs = 0;
    const orphanFiles: string[] = [];
    const allAudioRefs: { roomId: string; tier: string; entrySlug: string; filename: string }[] = [];

    // Phase 1: Collect all audio references
    for (let i = 0; i < jsonFiles.length; i++) {
      const [path, module] = jsonFiles[i];
      const fileName = path.split('/').pop() || path;
      setCurrentFile(fileName);
      setProgress((i / totalFiles) * 50);

      try {
        const json = (module as any).default || module;
        
        // Check if valid room file
        if (!isValidRoomJson(json, fileName)) {
          orphanFiles.push(fileName);
          continue;
        }
        
        validRoomFiles++;
        const roomId = json.id || fileName.replace('.json', '');
        const tier = json.tier || 'unknown';
        const entries = json.entries || [];

        totalEntries += entries.length;

        for (const entry of entries) {
          let audioRaw: string | undefined;

          if (typeof entry.audio === 'string') {
            audioRaw = entry.audio;
          } else if (entry.audio && typeof entry.audio === 'object') {
            audioRaw = entry.audio.en || entry.audio.vi || Object.values(entry.audio)[0] as string;
          }

          if (!audioRaw) continue;

          totalAudioRefs++;
          const filename = normalizeAudioFilename(audioRaw);
          allAudioRefs.push({
            roomId,
            tier,
            entrySlug: entry.slug || entry.artifact_id || entry.id || `entry-${entries.indexOf(entry)}`,
            filename,
          });
        }
      } catch (err) {
        orphanFiles.push(fileName);
        console.warn(`Skipping invalid JSON: ${fileName}`, err);
      }
    }

    // Phase 2: Check unique filenames
    const uniqueFilenames = [...new Set(allAudioRefs.map(r => r.filename))];
    const existsMap = new Map<string, boolean>();
    
    setCurrentFile("Checking audio files...");
    
    const batchSize = 10;
    for (let i = 0; i < uniqueFilenames.length; i += batchSize) {
      const batch = uniqueFilenames.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(f => checkAudioExists(f)));
      batch.forEach((f, idx) => existsMap.set(f, results[idx]));
      setProgress(50 + (i / uniqueFilenames.length) * 50);
    }

    // Build missing list
    const missing = allAudioRefs.filter(r => !existsMap.get(r.filename));
    
    const missingByRoom: Record<string, MissingAudio[]> = {};
    for (const m of missing) {
      const key = m.roomId;
      if (!missingByRoom[key]) missingByRoom[key] = [];
      missingByRoom[key].push(m);
    }

    setResult({
      totalJsonFiles: totalFiles,
      validRoomFiles,
      orphanFiles,
      totalEntries,
      totalAudioRefs,
      uniqueFilenames: uniqueFilenames.length,
      missingCount: missing.length,
      missingByRoom,
    });

    setProgress(100);
    setCurrentFile("");
    setScanning(false);
  }, []);

  const roomsWithMissing = result ? Object.keys(result.missingByRoom).length : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Fast Audio Scanner
          </CardTitle>
          <Button
            size="sm"
            onClick={runScan}
            disabled={scanning}
          >
            {scanning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run Scan
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {scanning && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">{currentFile}</p>
          </div>
        )}

        {result && (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
              <div className="p-2 rounded bg-muted/50">
                <div className="text-lg font-bold">{result.totalJsonFiles}</div>
                <div className="text-xs text-muted-foreground">Total Files</div>
              </div>
              <div className="p-2 rounded bg-green-500/10">
                <div className="text-lg font-bold text-green-600">{result.validRoomFiles}</div>
                <div className="text-xs text-muted-foreground">Valid Rooms</div>
              </div>
              <div className={`p-2 rounded ${result.orphanFiles.length > 0 ? 'bg-yellow-500/10' : 'bg-muted/50'}`}>
                <div className={`text-lg font-bold ${result.orphanFiles.length > 0 ? 'text-yellow-600' : ''}`}>
                  {result.orphanFiles.length}
                </div>
                <div className="text-xs text-muted-foreground">Non-Room</div>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <div className="text-lg font-bold">{result.totalEntries}</div>
                <div className="text-xs text-muted-foreground">Entries</div>
              </div>
              <div className="p-2 rounded bg-muted/50">
                <div className="text-lg font-bold">{result.uniqueFilenames}</div>
                <div className="text-xs text-muted-foreground">Audio Files</div>
              </div>
              <div className={`p-2 rounded ${result.missingCount > 0 ? 'bg-destructive/10' : 'bg-green-500/10'}`}>
                <div className={`text-lg font-bold ${result.missingCount > 0 ? 'text-destructive' : 'text-green-600'}`}>
                  {result.missingCount}
                </div>
                <div className="text-xs text-muted-foreground">Missing</div>
              </div>
            </div>

            {/* Orphan Files Warning */}
            {result.orphanFiles.length > 0 && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowOrphans(!showOrphans)}
                  className="flex items-center gap-2 text-yellow-600 p-3 rounded bg-yellow-500/10 w-full text-left"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    {result.orphanFiles.length} non-room files (click to {showOrphans ? 'hide' : 'show'})
                  </span>
                </button>
                {showOrphans && (
                  <ScrollArea className="h-[150px] border rounded p-3">
                    <div className="space-y-1">
                      {result.orphanFiles.map((f, i) => (
                        <div key={i} className="text-xs font-mono text-muted-foreground">
                          • {f}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}

            {/* Result Status */}
            {result.missingCount === 0 ? (
              <div className="flex items-center gap-2 text-green-600 p-3 rounded bg-green-500/10">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">All referenced audio files exist!</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-destructive p-3 rounded bg-destructive/10">
                  <XCircle className="h-5 w-5" />
                  <span className="font-medium">
                    {result.missingCount} missing files in {roomsWithMissing} room(s)
                  </span>
                </div>

                <ScrollArea className="h-[300px] border rounded p-3">
                  {Object.entries(result.missingByRoom).map(([roomId, files]) => (
                    <div key={roomId} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{files[0]?.tier}</Badge>
                        <span className="font-medium text-sm">{roomId}</span>
                        <span className="text-xs text-muted-foreground">
                          ({files.length} missing)
                        </span>
                      </div>
                      <div className="pl-4 space-y-1">
                        {files.map((f, idx) => (
                          <div key={idx} className="text-xs font-mono text-muted-foreground">
                            • {f.filename} ← {f.entrySlug}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </>
            )}
          </>
        )}

        {!scanning && !result && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Click "Run Scan" to check all room JSON files for missing audio references.
            <br />
            <span className="text-xs">This runs locally without hitting the database.</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
