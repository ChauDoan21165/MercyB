import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

interface RoomIssue {
  roomId: string;
  roomTitle: string;
  tier: string;
  issueType: "missing_file" | "invalid_json" | "no_entries" | "missing_audio" | "locked";
  message: string;
  details?: string;
  resolvedPath?: string;
  manifestKey?: string;
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
};

const getSuggestedJsonBaseName = (room: { id: string; schema_id?: string | null; tier?: string | null }) => {
  const baseId = (room.schema_id || room.id).toString();
  const normalizedTier = room.tier ? String(room.tier).toLowerCase() : null;

  if (!normalizedTier) {
    return baseId;
  }

  const suffix = `-${normalizedTier}`;
  const baseLower = baseId.toLowerCase();
  const roomIdLower = room.id.toString().toLowerCase();

  if (baseLower.endsWith(suffix) || roomIdLower.endsWith(suffix)) {
    return baseId;
  }

  return `${baseId}${suffix}`;
};

const getSuggestedJsonPath = (room: { id: string; schema_id?: string | null; tier?: string | null }) => {
  return `public/data/${getSuggestedJsonBaseName(room)}.json`;
};

export default function RoomHealthCheck() {
  const { tier } = useParams<{ tier: string }>();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<RoomHealth | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tierDisplay = tier ? TIER_DISPLAY_NAMES[tier] || tier.toUpperCase() : "All Tiers";

  useEffect(() => {
    checkRoomHealth();
  }, [tier]);

  const checkRoomHealth = async () => {
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from("rooms")
        .select("*")
        .neq("tier", "kids");

      if (tier) {
        query = query.eq("tier", tier);
      }

      const { data: rooms, error: roomsError } = await query;

      if (roomsError) throw roomsError;

      const issues: RoomIssue[] = [];
      let healthyCount = 0;

      for (const room of rooms || []) {
        const roomIssues: RoomIssue[] = [];

        // Check if JSON file exists and is valid
        const manifestPathById = PUBLIC_ROOM_MANIFEST[room.id];
        const baseId = (room.schema_id || room.id) as string;
        const normalizedTier = room.tier ? String(room.tier).toLowerCase() : null;
        let manifestKeyWithTier: string | null = null;

        if (normalizedTier) {
          const suffix = `-${normalizedTier}`;
          const baseIdLower = baseId.toLowerCase();
          const roomIdLower = String(room.id).toLowerCase();

          if (baseIdLower.endsWith(suffix)) {
            manifestKeyWithTier = baseId;
          } else if (roomIdLower.endsWith(suffix)) {
            manifestKeyWithTier = room.id;
          } else {
            manifestKeyWithTier = `${baseId}${suffix}`;
          }
        }

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

        const baseCandidates = new Set<string>();
        baseCandidates.add(String(room.id));
        baseCandidates.add(String(room.id).replace(/-/g, "_"));
        const suggestedBaseName = getSuggestedJsonBaseName(room);
        baseCandidates.add(suggestedBaseName);
        baseCandidates.add(suggestedBaseName.replace(/-/g, "_"));

        const fallbackCandidates: { url: string; key: string; path: string }[] = Array.from(baseCandidates).map(
          (base) => ({
            url: `/data/${base}.json`,
            key: "fallback",
            path: `data/${base}.json`,
          }),
        );

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
          const suggestedPath =
            manifestPathById
              ? `public/${manifestPathById}`
              : manifestPathByTier
                ? `public/${manifestPathByTier}`
                : getSuggestedJsonPath(room);

          const manifestKeyForIssue =
            manifestPathByTier && manifestKeyWithTier
              ? manifestKeyWithTier
              : manifestPathById
                ? room.id
                : getSuggestedJsonBaseName(room);

          roomIssues.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
            issueType: "missing_file",
            message: htmlDetected
              ? "File returns HTML instead of JSON (file missing)"
              : "JSON file not found",
            details: `Create: ${suggestedPath}`,
            manifestKey: manifestKeyForIssue,
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getIssueIcon = (issueType: RoomIssue["issueType"]) => {
    switch (issueType) {
      case "missing_file":
      case "invalid_json":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "no_entries":
      case "locked":
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
      missing_audio: "default",
      locked: "default",
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
                All {tierDisplay} rooms are properly configured with valid JSON files.
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Rooms Requiring Attention</h2>
              <div className="space-y-4">
                {health.issues.map((issue, index) => (
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
    </div>
  );
}
