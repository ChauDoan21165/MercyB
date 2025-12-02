import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileJson, 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Download,
  Upload,
  Loader2,
  FileWarning,
  Music
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// JSON-first types
type RoomJsonEntry = {
  slug?: string;
  audio?: string | { en?: string; vi?: string };
  keywords_en?: string[];
  keywords_vi?: string[];
};

type RoomJson = {
  id?: string;
  tier?: string;
  domain?: string;
  title?: { en?: string; vi?: string } | string;
  entries?: RoomJsonEntry[];
};

type JsonRoomHealth = {
  filename: string;
  id: string;
  tier: string | null;
  entryCount: number;
  validJson: boolean;
  issues: string[];
  healthScore: number;
  inDatabase: boolean;
};

type DbRoom = {
  id: string;
  tier: string | null;
  title_en: string;
  entries: any;
};

type SyncStatus = {
  jsonOnly: string[];
  dbOnly: string[];
  synced: string[];
  totalJson: number;
  totalDb: number;
};

// Import all JSON files from public/data
const jsonModules = import.meta.glob('/public/data/*.json', { eager: true });

export default function RoomHealthCheckV2() {
  const [loading, setLoading] = useState(false);
  const [jsonRooms, setJsonRooms] = useState<JsonRoomHealth[]>([]);
  const [dbRooms, setDbRooms] = useState<DbRoom[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Load data on mount
  useEffect(() => {
    runHealthCheck();
  }, []);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      // 1. Scan JSON files
      const jsonResults = scanJsonFiles();
      setJsonRooms(jsonResults);

      // 2. Fetch DB rooms
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('id, tier, title_en, entries');
      
      if (error) throw error;
      setDbRooms(rooms || []);

      // 3. Calculate sync status
      const jsonIds = new Set(jsonResults.map(r => r.id));
      const dbIds = new Set((rooms || []).map(r => r.id));

      const jsonOnly = jsonResults.filter(r => !dbIds.has(r.id)).map(r => r.id);
      const dbOnly = (rooms || []).filter(r => !jsonIds.has(r.id)).map(r => r.id);
      const synced = jsonResults.filter(r => dbIds.has(r.id)).map(r => r.id);

      setSyncStatus({
        jsonOnly,
        dbOnly,
        synced,
        totalJson: jsonResults.length,
        totalDb: (rooms || []).length
      });

      toast.success(`Scanned ${jsonResults.length} JSON files and ${(rooms || []).length} DB rooms`);
    } catch (err: any) {
      toast.error(`Health check failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const scanJsonFiles = (): JsonRoomHealth[] => {
    const results: JsonRoomHealth[] = [];

    for (const [path, module] of Object.entries(jsonModules)) {
      const filename = path.split('/').pop() || '';
      const id = filename.replace('.json', '');
      
      // Skip non-room files
      if (['components.json', 'Tiers.json', 'Tiers_.json', 'Package_Lock.json', 'Tsconfig_App.json', 'Tsconfig_Node.json'].includes(filename)) {
        continue;
      }

      try {
        const data = module as { default?: RoomJson } | RoomJson;
        const json: RoomJson = (data as any).default || data;
        
        const issues: string[] = [];
        const entries = Array.isArray(json.entries) ? json.entries : [];
        
        // Check for common issues
        if (entries.length === 0) {
          issues.push('No entries in JSON');
        }

        entries.forEach((entry, idx) => {
          if (!entry.audio) {
            issues.push(`Entry ${idx}: missing audio`);
          }
          if (!entry.keywords_en?.length) {
            issues.push(`Entry ${idx}: missing keywords_en`);
          }
          if (!entry.keywords_vi?.length) {
            issues.push(`Entry ${idx}: missing keywords_vi`);
          }
        });

        // Calculate health score
        let healthScore = 100;
        if (entries.length === 0) healthScore -= 40;
        if (issues.length > 0) healthScore -= Math.min(issues.length * 5, 50);

        results.push({
          filename,
          id,
          tier: json.tier || null,
          entryCount: entries.length,
          validJson: true,
          issues,
          healthScore: Math.max(healthScore, 0),
          inDatabase: false // Will be updated after DB check
        });
      } catch (err: any) {
        results.push({
          filename,
          id,
          tier: null,
          entryCount: 0,
          validJson: false,
          issues: [`Invalid JSON: ${err.message}`],
          healthScore: 0,
          inDatabase: false
        });
      }
    }

    return results;
  };

  const syncJsonToDb = async () => {
    if (!syncStatus?.jsonOnly.length) {
      toast.info('No JSON files need syncing to DB');
      return;
    }

    setSyncing(true);
    let synced = 0;
    let failed = 0;

    try {
      for (const id of syncStatus.jsonOnly) {
        const room = jsonRooms.find(r => r.id === id);
        if (!room) continue;

        // Find the JSON data
        const path = `/public/data/${room.filename}`;
        const module = jsonModules[path];
        if (!module) continue;

        const data = module as { default?: RoomJson } | RoomJson;
        const json: RoomJson = (data as any).default || data;

        // Prepare room data for DB
        const title = typeof json.title === 'string' 
          ? json.title 
          : json.title?.en || room.filename.replace('.json', '');
        
        const titleVi = typeof json.title === 'object' 
          ? json.title?.vi || title 
          : title;

        const { error } = await supabase.from('rooms').upsert({
          id: room.id,
          schema_id: 'default',
          title_en: title,
          title_vi: titleVi,
          tier: json.tier || 'Free / Miễn phí',
          domain: json.domain || 'General',
          entries: json.entries || [],
          is_demo: false
        }, { onConflict: 'id' });

        if (error) {
          console.error(`Failed to sync ${room.id}:`, error);
          failed++;
        } else {
          synced++;
        }
      }

      toast.success(`Synced ${synced} rooms to DB${failed > 0 ? `, ${failed} failed` : ''}`);
      runHealthCheck(); // Refresh
    } catch (err: any) {
      toast.error(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const generateMissingJson = async () => {
    if (!syncStatus?.dbOnly.length) {
      toast.info('All DB rooms have JSON files');
      return;
    }

    setGenerating(true);
    
    // Generate placeholder JSON for each DB-only room
    const placeholders: { id: string; json: RoomJson }[] = [];
    
    for (const id of syncStatus.dbOnly) {
      const dbRoom = dbRooms.find(r => r.id === id);
      if (!dbRoom) continue;

      const placeholder: RoomJson = {
        id: dbRoom.id,
        tier: dbRoom.tier || 'Free / Miễn phí',
        domain: 'General',
        title: {
          en: dbRoom.title_en || dbRoom.id,
          vi: dbRoom.title_en || dbRoom.id
        },
        entries: dbRoom.entries || []
      };

      placeholders.push({ id, json: placeholder });
    }

    // Create downloadable JSON bundle
    const bundle = placeholders.reduce((acc, { id, json }) => {
      acc[`${id}.json`] = json;
      return acc;
    }, {} as Record<string, RoomJson>);

    // Download as single file
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'missing-room-json-bundle.json';
    a.click();
    URL.revokeObjectURL(url);

    toast.success(`Generated ${placeholders.length} JSON placeholders. Upload them to public/data/`);
    setGenerating(false);
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-600">Healthy</Badge>;
    if (score >= 70) return <Badge className="bg-yellow-600">Warning</Badge>;
    if (score >= 40) return <Badge className="bg-orange-600">Issues</Badge>;
    return <Badge className="bg-red-600">Critical</Badge>;
  };

  const healthyCount = jsonRooms.filter(r => r.healthScore >= 90).length;
  const warningCount = jsonRooms.filter(r => r.healthScore >= 70 && r.healthScore < 90).length;
  const criticalCount = jsonRooms.filter(r => r.healthScore < 70).length;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Room Health Check V2</h1>
            <p className="text-gray-400">JSON-as-Source Architecture</p>
          </div>
          <Button 
            onClick={runHealthCheck} 
            disabled={loading}
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh
          </Button>
        </div>

        {/* Sync Status Summary */}
        {syncStatus && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <FileJson className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                <div className="text-3xl font-bold">{syncStatus.totalJson}</div>
                <div className="text-sm text-gray-400">JSON Files</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <Database className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                <div className="text-3xl font-bold">{syncStatus.totalDb}</div>
                <div className="text-sm text-gray-400">DB Rooms</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 text-center">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <div className="text-3xl font-bold">{syncStatus.synced.length}</div>
                <div className="text-sm text-gray-400">Synced</div>
              </CardContent>
            </Card>
            <Card className={`border-zinc-800 ${syncStatus.jsonOnly.length > 0 ? 'bg-yellow-900/30' : 'bg-zinc-900'}`}>
              <CardContent className="p-4 text-center">
                <FileWarning className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                <div className="text-3xl font-bold">{syncStatus.jsonOnly.length}</div>
                <div className="text-sm text-gray-400">JSON Only</div>
              </CardContent>
            </Card>
            <Card className={`border-zinc-800 ${syncStatus.dbOnly.length > 0 ? 'bg-red-900/30' : 'bg-zinc-900'}`}>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-400" />
                <div className="text-3xl font-bold">{syncStatus.dbOnly.length}</div>
                <div className="text-sm text-gray-400">DB Only</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={syncJsonToDb}
            disabled={syncing || !syncStatus?.jsonOnly.length}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {syncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Sync JSON → DB ({syncStatus?.jsonOnly.length || 0})
          </Button>
          <Button 
            onClick={generateMissingJson}
            disabled={generating || !syncStatus?.dbOnly.length}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {generating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Generate Missing JSON ({syncStatus?.dbOnly.length || 0})
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="json" className="space-y-4">
          <TabsList className="bg-zinc-900">
            <TabsTrigger value="json" className="data-[state=active]:bg-zinc-700">
              JSON Files ({jsonRooms.length})
            </TabsTrigger>
            <TabsTrigger value="json-only" className="data-[state=active]:bg-zinc-700">
              JSON Only ({syncStatus?.jsonOnly.length || 0})
            </TabsTrigger>
            <TabsTrigger value="db-only" className="data-[state=active]:bg-zinc-700">
              DB Only ({syncStatus?.dbOnly.length || 0})
            </TabsTrigger>
            <TabsTrigger value="issues" className="data-[state=active]:bg-zinc-700">
              Issues ({criticalCount + warningCount})
            </TabsTrigger>
          </TabsList>

          {/* JSON Files Tab */}
          <TabsContent value="json">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileJson className="w-5 h-5" />
                  All JSON Files (Source of Truth)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-4 text-sm">
                  <span className="text-green-400">✓ Healthy: {healthyCount}</span>
                  <span className="text-yellow-400">⚠ Warning: {warningCount}</span>
                  <span className="text-red-400">✗ Critical: {criticalCount}</span>
                </div>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {jsonRooms
                      .sort((a, b) => a.healthScore - b.healthScore)
                      .map(room => (
                        <div key={room.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{room.filename}</span>
                              {getHealthBadge(room.healthScore)}
                              {syncStatus?.synced.includes(room.id) && (
                                <Badge variant="outline" className="text-green-400 border-green-400">In DB</Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {room.tier || 'No tier'} • {room.entryCount} entries
                              {room.issues.length > 0 && (
                                <span className="text-yellow-400 ml-2">
                                  {room.issues.length} issue(s)
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-right w-16">
                            {room.healthScore}%
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* JSON Only Tab */}
          <TabsContent value="json-only">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileWarning className="w-5 h-5 text-yellow-400" />
                  JSON Files Not in Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                {syncStatus?.jsonOnly.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
                    <p>All JSON files are synced to database!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {syncStatus?.jsonOnly.map(id => {
                        const room = jsonRooms.find(r => r.id === id);
                        return (
                          <div key={id} className="p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
                            <div className="font-mono text-sm">{id}.json</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {room?.tier || 'No tier'} • {room?.entryCount || 0} entries
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DB Only Tab */}
          <TabsContent value="db-only">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  DB Rooms Without JSON (Need JSON Files)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {syncStatus?.dbOnly.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
                    <p>All DB rooms have JSON files!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {syncStatus?.dbOnly.map(id => {
                        const room = dbRooms.find(r => r.id === id);
                        const entriesCount = Array.isArray(room?.entries) ? room.entries.length : 0;
                        return (
                          <div key={id} className="p-3 bg-red-900/20 border border-red-600/30 rounded-lg">
                            <div className="font-mono text-sm">{id}</div>
                            <div className="text-xs text-gray-400 mt-1">
                              {room?.tier || 'No tier'} • {entriesCount} entries in DB
                            </div>
                            <div className="text-xs text-red-400 mt-1">
                              Missing: public/data/{id}.json
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Rooms with Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {jsonRooms
                      .filter(r => r.issues.length > 0)
                      .sort((a, b) => a.healthScore - b.healthScore)
                      .map(room => (
                        <div key={room.id} className="p-4 bg-zinc-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-sm">{room.filename}</span>
                            {getHealthBadge(room.healthScore)}
                          </div>
                          <ul className="space-y-1">
                            {room.issues.map((issue, idx) => (
                              <li key={idx} className="text-sm text-yellow-400 flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                {issue}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    {jsonRooms.filter(r => r.issues.length > 0).length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-400" />
                        <p>No issues found!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
