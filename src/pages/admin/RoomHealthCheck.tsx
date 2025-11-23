import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2, FileEdit } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { JsonEditorDialog } from "@/components/admin/JsonEditorDialog";

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

export default function RoomHealthCheck() {
  const { tier } = useParams<{ tier: string }>();
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<RoomHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; title: string } | null>(null);

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

      const MANIFEST_KEY_OVERRIDES: Record<string, string> = {
        "weight-loss-&-fitness": "weight-loss-and-fitness-vip3",
        "strategy-in-life---mastery-&-legacy": "strategy-in-life-mastery-legacy-vip3",
        "legacy-long-term-peace-vip3-6-finance": "legacy-&-long-term-peace-vip3-6-finance",
        "quiet-growth-simple-investing-vip3.3.finance": "quiet-growth-simple-investing-vip3-3-finance",
        "growing-bigger-when-ready-vip3-5-fiance": "growing-bigger-when-ready-vip3-5-finance",
        "diverse-desires-belonging-vip3-sub5-sex": "diverse-desires-&-belonging-vip3-sub5-sex",
        "relational-intelligence-erotic-communication-vip3-sub2-sex":
          "relational-intelligence-&-erotic-communication-vip3-sub2-sex",
        "sexuality-curiosity-culture-vip3": "sexuality-&-curiosity-&-culture-vip3",
        "sexuality-curiosity-culture": "sexuality-&-curiosity-&-culture-vip3",
        "sexuality_culture_vip3": "sexuality-&-curiosity-&-culture-vip3",
        "strategy_life_foundations_vip3": "strategy-in-life-1-vip3",
        "strategy_life_advanced_tactics_vip3": "strategy-in-life-2-vip3",
        "strategy_life_advanced_tactics_ii_vip3": "strategy-in-life-advanced-tactics-ii-vip3",
        "english-writing-deepdive-part5-vip3ii": "english-writing-deepdive-part5-vip3-ii",
        "english-writing-deepdive-part8-vip3ii": "english-writing-deepdive-part8-vip3-ii",
        "English-Writing-Mastery-vip3": "english-writing-mastery-vip3",
        "strategy-in-life--advanced-tactics-ii-vip3": "strategy-in-life-advanced-tactics-ii-vip3",
      };

      const FILE_PATH_OVERRIDES: Record<string, string> = {
        "mercy-blade-method-of--learning-english": "data/Mercy_Blade_Method_Of_ Learning_English.json",
      };

      for (const room of rooms || []) {
        const roomIssues: RoomIssue[] = [];

        // Check if JSON file exists and is valid
        const manifestKeyOverride = MANIFEST_KEY_OVERRIDES[room.id];
        const manifestPathOverride = manifestKeyOverride
          ? PUBLIC_ROOM_MANIFEST[manifestKeyOverride]
          : undefined;

        const manifestPathById = PUBLIC_ROOM_MANIFEST[room.id];
        const manifestKeyWithTier = room.tier
          ? `${room.id}-${String(room.tier).toLowerCase()}`
          : null;
        const manifestPathByTier = manifestKeyWithTier
          ? PUBLIC_ROOM_MANIFEST[manifestKeyWithTier]
          : undefined;

        const manifestCandidates: { url: string; key: string; path: string }[] = [];

        if (manifestPathOverride) {
          manifestCandidates.push({
            url: `/${manifestPathOverride}`,
            key: manifestKeyOverride!,
            path: manifestPathOverride,
          });
        }

        if (manifestPathById && manifestPathById !== manifestPathOverride) {
          manifestCandidates.push({
            url: `/${manifestPathById}`,
            key: room.id,
            path: manifestPathById,
          });
        }

        if (manifestPathByTier && manifestPathByTier !== manifestPathById && manifestPathByTier !== manifestPathOverride) {
          manifestCandidates.push({
            url: `/${manifestPathByTier}`,
            key: manifestKeyWithTier!,
            path: manifestPathByTier,
          });
        }

        const fileOverridePath = FILE_PATH_OVERRIDES[room.id];

        if (fileOverridePath) {
          manifestCandidates.push({
            url: `/${fileOverridePath}`,
            key: "fallback",
            path: fileOverridePath,
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
          const suggestedPath = manifestPathById
            ? `public/${manifestPathById}`
            : manifestPathByTier
              ? `public/${manifestPathByTier}`
              : `public/data/${room.id}.json`;

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

  const handleEditFile = (filePath: string, roomTitle: string) => {
    setSelectedFile({ path: filePath, title: roomTitle });
    setEditorOpen(true);
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
                    <div className="flex items-start justify-between gap-3">
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
                      <div className="flex flex-col gap-2">
                        {getIssueBadge(issue.issueType)}
                        {issue.resolvedPath && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditFile(issue.resolvedPath!, issue.roomTitle)}
                          >
                            <FileEdit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {selectedFile && (
        <JsonEditorDialog
          open={editorOpen}
          onOpenChange={setEditorOpen}
          filePath={selectedFile.path}
          roomTitle={selectedFile.title}
        />
      )}
    </div>
  );
}
