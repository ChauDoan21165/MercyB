import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2, Wrench, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { KIDS_ROOM_JSON_MAP } from "@/pages/KidsChat";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface RoomIssue {
  roomId: string;
  roomTitle: string;
  tier: string;
  issueType: "missing_file" | "invalid_json" | "no_entries" | "missing_audio" | "locked" | "missing_entries" | "inactive";
  message: string;
  details?: string;
  resolvedPath?: string;
  manifestKey?: string;
  isKidsRoom?: boolean;
  levelId?: string;
}

interface RoomHealth {
  totalRooms: number;
  healthyRooms: number;
  issuesFound: number;
  issues: RoomIssue[];
}

const TIER_DISPLAY_NAMES: Record<string, string> = {
  free: "Free",
  "Free / Miễn phí": "Free",
  vip1: "VIP1",
  VIP1: "VIP1",
  vip2: "VIP2",
  VIP2: "VIP2",
  vip3: "VIP3",
  VIP3: "VIP3",
  vip4: "VIP4",
  VIP4: "VIP4",
  vip5: "VIP5",
  VIP5: "VIP5",
  vip6: "VIP6",
  VIP6: "VIP6",
  vip7: "VIP7",
  VIP7: "VIP7",
  vip8: "VIP8",
  VIP8: "VIP8",
  vip9: "VIP9",
  VIP9: "VIP9",
  kids: "Kids",
};

// Helper to convert schema_id to proper JSON filename
const getSuggestedJsonBaseName = (schemaId: string, tier: string): string => {
  // If schema_id already has underscores, use it as-is and capitalize
  if (schemaId.includes('_')) {
    const words = schemaId.split('_');
    const capitalizedWords = words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    );
    const baseName = capitalizedWords.join('_');
    const tierSuffix = tier.toLowerCase().replace(/\s+/g, '');
    return `${baseName}_${tierSuffix}`;
  }
  
  // Otherwise split by hyphens, capitalize each word, then join with underscores
  const words = schemaId.split('-');
  const capitalizedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  const baseName = capitalizedWords.join('_');
  
  // Add tier suffix (lowercase, remove spaces)
  const tierSuffix = tier.toLowerCase().replace(/\s+/g, '');
  return `${baseName}_${tierSuffix}`;
};

const getSuggestedJsonPath = (schemaId: string, tier: string): string => {
  const fileName = getSuggestedJsonBaseName(schemaId, tier);
  return `public/data/${fileName}.json`;
};

const getJsonFilenameForKidsRoom = (roomId: string, levelId: string): string => {
  const mappedFile = KIDS_ROOM_JSON_MAP[roomId];
  if (mappedFile) return mappedFile;

  const suffix =
    levelId === 'level1' ? 'kids_l1' :
    levelId === 'level2' ? 'kids_l2' :
    levelId === 'level3' ? 'kids_l3' : 'kids';

  return `${roomId.replace(/-/g, '_')}_${suffix}.json`;
};

export default function UnifiedHealthCheck() {
  const { tier } = useParams<{ tier: string }>();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<RoomHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fixing, setFixing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "kids">(
    tier === "kids" || (typeof window !== "undefined" && window.location.pathname.includes("kids-room-health"))
      ? "kids"
      : "main"
  );
  const [progress, setProgress] = useState<{ current: number; total: number; roomName: string } | null>(null);
  
  // Kids room filtering state
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [availableRooms, setAvailableRooms] = useState<Array<{ id: string; title: string; level: string }>>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);

  const tierDisplay = tier
    ? tier === "kids"
      ? "Kids Rooms"
      : TIER_DISPLAY_NAMES[tier] || tier.toUpperCase()
    : activeTab === "kids"
      ? "Kids Rooms"
      : "All Tiers";

  useEffect(() => {
    if (activeTab === "kids") {
      loadAvailableKidsRooms();
    }
  }, [activeTab, selectedLevel]);

  // Auto-run health checks only when a specific tier route is used (e.g. /admin/room-health/free)
  // On /admin/kids-room-health there is no tier param, so checks run only when you click the button
  useEffect(() => {
    if (!tier) return;
    checkRoomHealth();
  }, [tier]);

  const loadAvailableKidsRooms = async () => {
    try {
      let query = supabase
        .from('kids_rooms')
        .select('id, title_en, level_id')
        .eq('is_active', true)
        .order('level_id')
        .order('display_order');

      if (selectedLevel !== "all") {
        query = query.eq('level_id', selectedLevel);
      }

      const { data, error } = await query;

      if (error) throw error;

      const rooms = (data || []).map(room => ({
        id: room.id,
        title: room.title_en,
        level: room.level_id
      }));

      setAvailableRooms(rooms);
      
      // Reset selected rooms when level changes
      setSelectedRooms([]);
    } catch (error) {
      console.error('Error loading kids rooms:', error);
    }
  };

  const downloadMissingFilesReport = () => {
    if (!health) return;

    const missingFileIssues = health.issues.filter(
      issue => issue.issueType === "missing_file"
    );

    if (missingFileIssues.length === 0) {
      toast({
        title: "No missing files",
        description: "All rooms have their JSON files",
      });
      return;
    }

    let report = `MISSING FILES REPORT - ${new Date().toISOString()}\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;
    report += `Total Missing Files: ${missingFileIssues.length}\n\n`;
    report += `INSTRUCTIONS:\n`;
    report += `- Create these JSON files in the paths specified below\n`;
    report += `- Each file should contain valid room data with entries\n`;
    report += `- Schema_id from database: refers to the room identifier\n\n`;
    report += `═══════════════════════════════════════════════════════════\n\n`;

    missingFileIssues.forEach((issue, index) => {
      report += `${index + 1}. ${issue.roomTitle}\n`;
      report += `   Room ID: ${issue.roomId}\n`;
      report += `   Tier: ${issue.tier}\n`;
      report += `   ${issue.details || issue.message}\n`;
      report += `   Manifest Key: ${issue.manifestKey || 'N/A'}\n`;
      report += `\n`;
    });

    report += `═══════════════════════════════════════════════════════════\n`;
    report += `SUMMARY BY PATH:\n\n`;
    
    const pathMap = new Map<string, string[]>();
    missingFileIssues.forEach(issue => {
      const path = issue.details?.replace('Create: ', '') || 'Unknown path';
      if (!pathMap.has(path)) {
        pathMap.set(path, []);
      }
      pathMap.get(path)!.push(`${issue.roomTitle} (${issue.roomId})`);
    });

    pathMap.forEach((rooms, path) => {
      report += `${path}\n`;
      rooms.forEach(room => report += `  - ${room}\n`);
      report += `\n`;
    });

    // Create and download the file
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `missing-files-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: `Downloaded report with ${missingFileIssues.length} missing files`,
    });
  };

  const checkRoomHealth = async () => {
    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      if (activeTab === "kids") {
        await checkKidsRooms();
      } else {
        await checkMainRooms();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  const checkMainRooms = async () => {
    // Step 1: Get all JSON files from manifest for the selected tier
    const selectedTierKey = tier?.toLowerCase() || null;
    const manifestRooms: Array<{ id: string; path: string; tier: string }> = [];
    
    Object.entries(PUBLIC_ROOM_MANIFEST).forEach(([roomId, path]) => {
      // Extract tier from room ID (e.g., "room-name-vip9" -> "vip9")
      const tierMatch = roomId.match(/-(free|vip1|vip2|vip3|vip4|vip5|vip6|vip7|vip8|vip9)$/);
      const roomTier = tierMatch ? tierMatch[1] : 'free';
      
      // Skip kids rooms
      if (path.includes('kids_l')) return;
      
      // Filter by selected tier if specified
      if (selectedTierKey && roomTier !== selectedTierKey) return;
      
      manifestRooms.push({ id: roomId, path, tier: roomTier });
    });

    // Step 2: Get database rooms for comparison
    let query = supabase
      .from("rooms")
      .select("*")
      .neq("tier", "kids");

    if (tier && tier !== "kids") {
      query = query.eq("tier", tier.toLowerCase());
    }

    const { data: dbRooms, error: roomsError } = await query;
    if (roomsError) throw roomsError;

    const issues: RoomIssue[] = [];
    let healthyCount = 0;
    const totalRooms = manifestRooms.length;
    
    // Track which manifest rooms we've validated
    const validatedManifestIds = new Set<string>();

    // Step 3: Check all JSON files from manifest
    for (let i = 0; i < manifestRooms.length; i++) {
      const manifestRoom = manifestRooms[i];
      validatedManifestIds.add(manifestRoom.id);
      
      // Find corresponding database room if exists
      const dbRoom = dbRooms?.find(r => 
        r.id === manifestRoom.id || 
        `${r.id}-${r.tier}` === manifestRoom.id ||
        r.schema_id === manifestRoom.id.replace(/-free|-vip\d+$/i, '')
      );
      
      const displayTitle = dbRoom?.title_en || manifestRoom.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      setProgress({ current: i + 1, total: totalRooms, roomName: displayTitle });
      
      const roomIssues: RoomIssue[] = [];

      // Validate the JSON file directly from manifest
      const jsonPath = `/${manifestRoom.path}`;
      let jsonFound = false;
      let jsonData: any = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch(jsonPath, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const text = await response.text();
          
          // Check if HTML (404 page)
          if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
            roomIssues.push({
              roomId: manifestRoom.id,
              roomTitle: displayTitle,
              tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
              issueType: "missing_file",
              message: "File returns HTML (404)",
              details: `Path: ${manifestRoom.path}`,
            });
          } else {
            try {
              jsonData = JSON.parse(text);
              jsonFound = true;
            } catch (parseError: any) {
              roomIssues.push({
                roomId: manifestRoom.id,
                roomTitle: displayTitle,
                tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
                issueType: "invalid_json",
                message: "Invalid JSON syntax",
                details: parseError.message,
              });
            }
          }
        } else {
          roomIssues.push({
            roomId: manifestRoom.id,
            roomTitle: displayTitle,
            tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
            issueType: "missing_file",
            message: `HTTP ${response.status}`,
            details: `Path: ${manifestRoom.path}`,
          });
        }
      } catch (error: any) {
        if (error.name === 'AbortError') {
          roomIssues.push({
            roomId: manifestRoom.id,
            roomTitle: displayTitle,
            tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
            issueType: "missing_file",
            message: "Timeout loading file",
            details: `Path: ${manifestRoom.path}`,
          });
        }
      }

      // If JSON was found and parsed, validate content
      if (jsonData) {
        // Check for entries
        if (!jsonData.entries || jsonData.entries.length === 0) {
          roomIssues.push({
            roomId: manifestRoom.id,
            roomTitle: displayTitle,
            tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
            issueType: "no_entries",
            message: "Room has no entries",
          });
        } else {
          // Check entry structure
          const invalidEntries = jsonData.entries.filter((entry: any, idx: number) => {
            const hasSlug = !!entry.slug;
            const hasCopy = !!entry.copy?.en || !!entry.copy?.vi;
            return !hasSlug || !hasCopy;
          });
          
          if (invalidEntries.length > 0) {
            roomIssues.push({
              roomId: manifestRoom.id,
              roomTitle: displayTitle,
              tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
              issueType: "missing_entries",
              message: `${invalidEntries.length} entries missing slug or copy`,
            });
          }
        }
        
        // Check for title and content
        if (!jsonData.title?.en && !jsonData.title?.vi) {
          roomIssues.push({
            roomId: manifestRoom.id,
            roomTitle: displayTitle,
            tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
            issueType: "missing_entries",
            message: "Missing title translations",
          });
        }
        
        if (!jsonData.content?.en && !jsonData.content?.vi) {
          roomIssues.push({
            roomId: manifestRoom.id,
            roomTitle: displayTitle,
            tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
            issueType: "missing_entries",
            message: "Missing content/introduction",
          });
        }
      }

      // Check if room is in database and locked
      if (dbRoom?.is_locked) {
        roomIssues.push({
          roomId: manifestRoom.id,
          roomTitle: displayTitle,
          tier: TIER_DISPLAY_NAMES[manifestRoom.tier] || manifestRoom.tier.toUpperCase(),
          issueType: "locked",
          message: "Room is locked",
        });
      }

      if (roomIssues.length === 0) {
        healthyCount++;
      } else {
        issues.push(...roomIssues);
      }
    }

    setHealth({
      totalRooms: rooms?.length || 0,
      healthyRooms: healthyCount,
      issuesFound: issues.length,
      issues,
    });
  };

  const checkKidsRooms = async () => {
    let query = supabase
      .from('kids_rooms')
      .select(`
        id,
        title_en,
        title_vi,
        level_id,
        is_active,
        kids_entries(count)
      `)
      .order('level_id')
      .order('display_order');

    // Apply level filter
    if (selectedLevel !== "all") {
      query = query.eq('level_id', selectedLevel);
    }

    const { data: allRooms, error: roomsError } = await query;

    if (roomsError) throw roomsError;

    // Apply room-specific filter if any rooms are selected
    const rooms = selectedRooms.length > 0 
      ? allRooms?.filter(room => selectedRooms.includes(room.id))
      : allRooms;

    const issues: RoomIssue[] = [];
    let healthyCount = 0;
    const totalRooms = rooms?.length || 0;

    for (let i = 0; i < (rooms?.length || 0); i++) {
      const room = rooms![i];
      setProgress({ current: i + 1, total: totalRooms, roomName: room.title_en });
      
      const roomIssues: RoomIssue[] = [];
      const entryCount = room.kids_entries?.[0]?.count || 0;

      // Try to validate JSON file
      try {
        const jsonFileName = getJsonFilenameForKidsRoom(room.id, room.level_id);
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(`/data/${jsonFileName}`, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
          roomIssues.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: "Kids",
            issueType: "missing_file",
            message: `JSON file not found: /data/${jsonFileName}`,
            isKidsRoom: true,
            levelId: room.level_id,
          });
        } else {
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            roomIssues.push({
              roomId: room.id,
              roomTitle: room.title_en,
              tier: "Kids",
              issueType: "missing_file",
              message: `JSON file not found (got ${contentType || 'unknown type'})`,
              isKidsRoom: true,
              levelId: room.level_id,
            });
          } else {
            try {
              const json = await response.json();
              // For kids rooms, we only care that JSON exists and is valid.
              // It's okay if either JSON or DB has zero entries; content can still be loaded from JSON.
              if (!Array.isArray(json.entries)) {
                roomIssues.push({
                  roomId: room.id,
                  roomTitle: room.title_en,
                  tier: "Kids",
                  issueType: "invalid_json",
                  message: "JSON entries field is missing or not an array",
                  isKidsRoom: true,
                  levelId: room.level_id,
                });
              }
            } catch (e) {
              roomIssues.push({
                roomId: room.id,
                roomTitle: room.title_en,
                tier: "Kids",
                issueType: "invalid_json",
                message: "Invalid JSON syntax in file",
                isKidsRoom: true,
                levelId: room.level_id,
              });
            }
          }
        }
      } catch (e: any) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: "Kids",
          issueType: "missing_file",
          message: e.message,
          isKidsRoom: true,
          levelId: room.level_id,
        });
      }

      if (!room.is_active) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: "Kids",
          issueType: "inactive",
          message: "Room is inactive",
          isKidsRoom: true,
          levelId: room.level_id,
        });
      }

      if (roomIssues.length === 0) {
        healthyCount++;
      } else {
        issues.push(...roomIssues);
      }
    }

    setHealth({
      totalRooms: rooms?.length || 0,
      healthyRooms: healthyCount,
      issuesFound: issues.length,
      issues,
    });
  };

  const fixKidsRoom = async (roomId: string, levelId: string) => {
    setFixing(roomId);
    try {
      const jsonFileName = getJsonFilenameForKidsRoom(roomId, levelId);
      const response = await fetch(`/data/${jsonFileName}`);
      
      if (!response.ok) {
        throw new Error(`JSON file not found: /data/${jsonFileName}`);
      }

      const roomData = await response.json();
      
      if (!roomData.entries || roomData.entries.length === 0) {
        throw new Error('No entries found in JSON file');
      }

      const entries = roomData.entries.map((entry: any, index: number) => {
        let contentEn = '';
        let contentVi = '';
        
        if (entry.copy) {
          contentEn = entry.copy.en || '';
          contentVi = entry.copy.vi || '';
        } else if (entry.content) {
          contentEn = entry.content.en || '';
          contentVi = entry.content.vi || '';
        }
        
        let audioUrl = entry.audio || entry.audio_url || null;
        if (audioUrl && !audioUrl.startsWith('http') && !audioUrl.startsWith('/')) {
          audioUrl = `/${audioUrl}`;
        }
        
        return {
          id: `${roomId}-${index + 1}`,
          room_id: roomId,
          content_en: contentEn,
          content_vi: contentVi,
          audio_url: audioUrl,
          display_order: index + 1,
          is_active: true
        };
      });

      const { error } = await supabase
        .from('kids_entries')
        .insert(entries);

      if (error) throw error;

      toast({
        title: "Room fixed!",
        description: `Inserted ${entries.length} entries for ${roomId}`,
      });

      await checkRoomHealth();
    } catch (error: any) {
      toast({
        title: "Error fixing room",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setFixing(null);
    }
  };

  const getIssueIcon = (issueType: RoomIssue["issueType"]) => {
    switch (issueType) {
      case "missing_file":
      case "invalid_json":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "no_entries":
      case "missing_entries":
      case "locked":
      case "inactive":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getIssueBadge = (issueType: RoomIssue["issueType"]) => {
    const variants: Record<RoomIssue["issueType"], "destructive" | "default"> = {
      missing_file: "destructive",
      invalid_json: "destructive",
      no_entries: "default",
      missing_entries: "default",
      missing_audio: "default",
      locked: "default",
      inactive: "default",
    };

    return <Badge variant={variants[issueType]}>{issueType.replace(/_/g, " ")}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link to="/admin/health-dashboard">
            <Button variant="ghost" size="sm" className="mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Room Health Check: {tierDisplay}</h1>
          <p className="text-muted-foreground">
            Validate room JSON files and configuration
          </p>
        </div>
        <div className="flex gap-2">
          {health && health.issues.some(i => i.issueType === "missing_file") && (
            <Button 
              onClick={downloadMissingFilesReport} 
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" />
              Download Missing Files Report
            </Button>
          )}
          <Button onClick={checkRoomHealth} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && progress && (
        <Card className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Checking rooms...</span>
              <span className="font-medium">
                {progress.current} / {progress.total}
              </span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-foreground">{progress.roomName}</span>
            </div>
          </div>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "main" | "kids")}>
        <TabsList>
          <TabsTrigger value="main">Main Rooms</TabsTrigger>
          <TabsTrigger value="kids">Kids Rooms</TabsTrigger>
        </TabsList>

        <TabsContent value="main" className="space-y-6">
          {health && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{health.totalRooms}</p>
                      <p className="text-sm text-muted-foreground">Total Rooms</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{health.healthyRooms}</p>
                      <p className="text-sm text-muted-foreground">Healthy Rooms</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-2xl font-bold">{health.issuesFound}</p>
                      <p className="text-sm text-muted-foreground">Issues Found</p>
                    </div>
                  </div>
                </Card>
              </div>

              {health.issuesFound === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Rooms Healthy!</h3>
                  <p className="text-muted-foreground">
                    All rooms are properly configured with valid JSON files.
                  </p>
                </Card>
              ) : (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Rooms Requiring Attention</h2>
                  <div className="space-y-4">
                    {health.issues.filter(i => !i.isKidsRoom).map((issue, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getIssueIcon(issue.issueType)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold">
                                  {issue.roomTitle} ({issue.roomId})
                                </h3>
                                <Badge variant="outline">{issue.tier}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{issue.message}</p>
                              {(issue.manifestKey || issue.resolvedPath) && (
                                <div className="mt-2">
                                  <div className="inline-flex items-center gap-2 px-2 py-1 bg-muted rounded text-xs font-mono">
                                    {issue.manifestKey && (
                                      <span className="text-muted-foreground">
                                        manifest: <span className="text-foreground">{issue.manifestKey}</span>
                                      </span>
                                    )}
                                    {issue.resolvedPath && (
                                      <>
                                        {issue.manifestKey && <span className="text-muted-foreground">→</span>}
                                        <span className="text-primary">{issue.resolvedPath}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              )}
                              {issue.details && (
                                <p className="text-xs text-muted-foreground mt-1 font-mono bg-muted/30 p-2 rounded">
                                  {issue.details}
                                </p>
                              )}
                              {issue.issueType === "missing_file" && (
                                <Alert className="mt-2 py-2 px-3">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription className="text-xs">
                                    💡 This file needs to be created. Check the database schema_id field and create the matching JSON file in public/data/
                                  </AlertDescription>
                                </Alert>
                              )}
                            </div>
                          </div>
                          {getIssueBadge(issue.issueType)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="kids" className="space-y-6">
          {/* Kids Room Filters */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Filter Options</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Level</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="level1">Kids Level 1 (Ages 4-7)</SelectItem>
                      <SelectItem value="level2">Kids Level 2 (Ages 7-9)</SelectItem>
                      <SelectItem value="level3">Kids Level 3 (Ages 10-12)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {availableRooms.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Select Specific Rooms (Optional)
                    </label>
                    <div className="border rounded-md p-3 max-h-40 overflow-y-auto space-y-2">
                      <div className="flex items-center space-x-2 mb-2 pb-2 border-b">
                        <Checkbox
                          id="select-all"
                          checked={selectedRooms.length === availableRooms.length && availableRooms.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRooms(availableRooms.map(r => r.id));
                            } else {
                              setSelectedRooms([]);
                            }
                          }}
                        />
                        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                          {selectedRooms.length === availableRooms.length && availableRooms.length > 0 ? 'Deselect All' : 'Select All'}
                        </label>
                      </div>
                      {availableRooms.map((room) => (
                        <div key={room.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={room.id}
                            checked={selectedRooms.includes(room.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedRooms([...selectedRooms, room.id]);
                              } else {
                                setSelectedRooms(selectedRooms.filter(id => id !== room.id));
                              }
                            }}
                          />
                          <label htmlFor={room.id} className="text-sm cursor-pointer">
                            {room.title}
                          </label>
                        </div>
                      ))}
                    </div>
                    {selectedRooms.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {selectedRooms.length} room{selectedRooms.length !== 1 ? 's' : ''} selected
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button onClick={checkRoomHealth} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    'Run Health Check'
                  )}
                </Button>
                
                {(selectedLevel !== "all" || selectedRooms.length > 0) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLevel("all");
                      setSelectedRooms([]);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {health && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{health.totalRooms}</p>
                      <p className="text-sm text-muted-foreground">Total Rooms</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{health.healthyRooms}</p>
                      <p className="text-sm text-muted-foreground">Healthy Rooms</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <div>
                      <p className="text-2xl font-bold">{health.issuesFound}</p>
                      <p className="text-sm text-muted-foreground">Issues Found</p>
                    </div>
                  </div>
                </Card>
              </div>

              {health.issuesFound === 0 ? (
                <Card className="p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Kids Rooms Healthy!</h3>
                  <p className="text-muted-foreground">
                    All kids rooms are properly configured.
                  </p>
                </Card>
              ) : (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Kids Rooms Requiring Attention</h2>
                  <div className="space-y-4">
                    {health.issues.filter(i => i.isKidsRoom).map((issue, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getIssueIcon(issue.issueType)}
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold">
                                  {issue.roomTitle} ({issue.roomId})
                                </h3>
                                <Badge variant="outline">{issue.tier}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{issue.message}</p>
                              {issue.issueType === "missing_entries" && issue.levelId && (
                                <Button
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => fixKidsRoom(issue.roomId, issue.levelId!)}
                                  disabled={fixing === issue.roomId}
                                >
                                  {fixing === issue.roomId ? (
                                    <>
                                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                      Fixing...
                                    </>
                                  ) : (
                                    <>
                                      <Wrench className="h-4 w-4 mr-2" />
                                      Fix Room
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                          {getIssueBadge(issue.issueType)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
