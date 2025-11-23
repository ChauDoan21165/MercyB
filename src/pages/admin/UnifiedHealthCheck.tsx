import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2, Wrench } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { KIDS_ROOM_JSON_MAP } from "@/pages/KidsChat";
import { useToast } from "@/hooks/use-toast";

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
  kids: "Kids",
};

// Helper to convert schema_id to proper JSON filename
const getSuggestedJsonBaseName = (schemaId: string, tier: string): string => {
  // Split by hyphens, capitalize each word, then join with underscores
  const words = schemaId.split('-');
  const capitalizedWords = words.map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  );
  const baseName = capitalizedWords.join('_');
  
  // Add tier suffix (lowercase)
  const tierSuffix = tier.toLowerCase();
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
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<RoomHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fixing, setFixing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"main" | "kids">(tier === "kids" ? "kids" : "main");

  const tierDisplay = tier && tier !== "kids" ? TIER_DISPLAY_NAMES[tier] || tier.toUpperCase() : tier === "kids" ? "Kids Rooms" : "All Tiers";

  useEffect(() => {
    checkRoomHealth();
  }, [tier, activeTab]);

  const checkRoomHealth = async () => {
    setLoading(true);
    setError(null);

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
    }
  };

  const checkMainRooms = async () => {
    let query = supabase
      .from("rooms")
      .select("*")
      .neq("tier", "kids");

    if (tier && tier !== "kids") {
      query = query.eq("tier", tier.toLowerCase());
    }

    const { data: rooms, error: roomsError } = await query;

    if (roomsError) throw roomsError;

    const issues: RoomIssue[] = [];
    let healthyCount = 0;

    for (const room of rooms || []) {
      const roomIssues: RoomIssue[] = [];

      // Check if JSON file exists and is valid
      const manifestPathById = PUBLIC_ROOM_MANIFEST[room.id];
      const manifestKeyWithTier = room.tier
        ? `${room.id}-${String(room.tier).toLowerCase()}`
        : null;
      const manifestPathByTier = manifestKeyWithTier
        ? PUBLIC_ROOM_MANIFEST[manifestKeyWithTier]
        : undefined;

      const manifestCandidates: { url: string; key: string; path: string }[] = [];
      if (manifestPathById) {
        manifestCandidates.push({
          url: `/${manifestPathById}`,
          key: room.id,
          path: manifestPathById,
        });
      }
      if (manifestPathByTier && manifestPathByTier !== manifestPathById) {
        manifestCandidates.push({
          url: `/${manifestPathByTier}`,
          key: manifestKeyWithTier!,
          path: manifestPathByTier,
        });
      }

      const fallbackCandidates: { url: string; key: string; path: string }[] = [
        {
          url: `/data/${room.id}.json`,
          key: "fallback",
          path: `data/${room.id}.json`,
        },
        {
          url: `/data/${String(room.id).replace(/-/g, "_")}.json`,
          key: "fallback",
          path: `data/${String(room.id).replace(/-/g, "_")}.json`,
        },
      ];

      const fileCandidates = [...manifestCandidates, ...fallbackCandidates];

      let jsonFound = false;
      let jsonData: any = null;
      let htmlDetected = false;
      let resolvedPath: string | undefined;
      let resolvedManifestKey: string | undefined;

      for (const { url, key, path } of fileCandidates) {
        try {
          const response = await fetch(url);
          if (!response.ok) continue;

          const text = await response.text();

          // Check if response is HTML instead of JSON (404 page scenario)
          if (text.trim().startsWith("<!") || text.trim().startsWith("<html")) {
            htmlDetected = true;
            break;
          }

          try {
            jsonData = JSON.parse(text);
            jsonFound = true;
            resolvedPath = path;
            resolvedManifestKey = key !== "fallback" ? key : undefined;
            break;
          } catch (parseError: any) {
            roomIssues.push({
              roomId: room.id,
              roomTitle: room.title_en,
              tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
              issueType: "invalid_json",
              message: "Invalid JSON syntax in file",
              details: parseError.message,
              resolvedPath: path,
              manifestKey: key !== "fallback" ? key : undefined,
            });
            break;
          }
        } catch {
          // File not found or fetch error, continue to next candidate
        }
      }

      if (!jsonFound && roomIssues.length === 0) {
        const suggestedPath = getSuggestedJsonPath(room.id, room.tier || 'free');

        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
          issueType: "missing_file",
          message: htmlDetected
            ? "File returns HTML instead of JSON (file missing)"
            : "JSON file not found",
          details: `Create: ${suggestedPath}`,
          manifestKey: manifestKeyWithTier || room.id,
        });
      }

      // If JSON was found and parsed, check entries
      if (jsonData) {
        if (!jsonData.entries || jsonData.entries.length === 0) {
          roomIssues.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
            issueType: "no_entries",
            message: "Room has no entries",
            resolvedPath,
            manifestKey: resolvedManifestKey,
          });
        }
      }

      // Check if room is locked
      if (room.is_locked) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
          issueType: "locked",
          message: "Room is locked",
          resolvedPath,
          manifestKey: resolvedManifestKey,
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
    const { data: rooms, error: roomsError } = await supabase
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

    if (roomsError) throw roomsError;

    const issues: RoomIssue[] = [];
    let healthyCount = 0;

    for (const room of rooms || []) {
      const roomIssues: RoomIssue[] = [];
      const entryCount = room.kids_entries?.[0]?.count || 0;

      // Try to validate JSON file
      try {
        const jsonFileName = getJsonFilenameForKidsRoom(room.id, room.level_id);
        const response = await fetch(`/data/${jsonFileName}`);

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
              if (!Array.isArray(json.entries) || json.entries.length === 0) {
                if (entryCount === 0) {
                  roomIssues.push({
                    roomId: room.id,
                    roomTitle: room.title_en,
                    tier: "Kids",
                    issueType: "no_entries",
                    message: "JSON has no entries and DB has no entries",
                    isKidsRoom: true,
                    levelId: room.level_id,
                  });
                }
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
      } else if (entryCount === 0 && roomIssues.length === 0) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: "Kids",
          issueType: "missing_entries",
          message: "Room has no entries in database",
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
        <Button onClick={checkRoomHealth} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
