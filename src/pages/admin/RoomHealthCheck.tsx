import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, XCircle, ArrowLeft, Loader2, Download } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { repairJSON, downloadJSON } from "@/lib/jsonRepair";

interface RoomIssue {
  roomId: string;
  roomTitle: string;
  tier: string;
  issueType: "missing_file" | "invalid_json" | "no_entries" | "missing_audio" | "locked";
  message: string;
  details?: string;
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
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [repairing, setRepairing] = useState<string | null>(null);
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
        const possibleFilenames = [
          `${room.id}.json`,
          `${room.id.replace(/-/g, "_")}.json`,
        ];

        let jsonFound = false;
        let jsonData: any = null;

        for (const filename of possibleFilenames) {
          try {
            const response = await fetch(`/data/${filename}`);
            if (response.ok) {
              const text = await response.text();
              try {
                jsonData = JSON.parse(text);
                jsonFound = true;
                break;
              } catch (parseError: any) {
                roomIssues.push({
                  roomId: room.id,
                  roomTitle: room.title_en,
                  tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
                  issueType: "invalid_json",
                  message: "Invalid JSON syntax in file",
                  details: parseError.message,
                });
              }
            }
          } catch (fetchError) {
            // File not found, continue to next filename
          }
        }

        if (!jsonFound && roomIssues.length === 0) {
          roomIssues.push({
            roomId: room.id,
            roomTitle: room.title_en,
            tier: TIER_DISPLAY_NAMES[room.tier] || room.tier,
            issueType: "missing_file",
            message: `JSON file not found: /data/${room.id}.json`,
            details: `Expected: /data/${room.id}.json`,
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

  const repairJsonFile = async (roomId: string) => {
    setRepairing(roomId);
    try {
      const possibleFilenames = [
        `${roomId}.json`,
        `${roomId.replace(/-/g, "_")}.json`,
      ];

      let jsonText: string | null = null;
      let filename: string | null = null;

      for (const fn of possibleFilenames) {
        try {
          const response = await fetch(`/data/${fn}`);
          if (response.ok) {
            jsonText = await response.text();
            filename = fn;
            break;
          }
        } catch {
          continue;
        }
      }

      if (!jsonText || !filename) {
        throw new Error(`JSON file not found for room: ${roomId}`);
      }

      const result = repairJSON(jsonText);

      if (result.success) {
        downloadJSON(result.data, filename);
        
        toast({
          title: "✅ JSON Repaired Successfully",
          description: (
            <div className="space-y-2">
              <p>The repaired file has been downloaded: <strong>{filename}</strong></p>
              {result.changes && result.changes.length > 0 && (
                <>
                  <p className="text-sm mt-2">Changes made:</p>
                  <ul className="text-sm list-disc list-inside space-y-1">
                    {result.changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Please replace the file in <code>/public/data/{filename}</code> and refresh.
              </p>
            </div>
          ),
        });
        
        setTimeout(() => checkRoomHealth(), 1000);
      } else {
        throw new Error(result.error || 'Failed to repair JSON');
      }
    } catch (error: any) {
      toast({
        title: "❌ Repair Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRepairing(null);
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
                          {issue.details && (
                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                              {issue.details}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {issue.issueType === "invalid_json" && (
                          <Button
                            onClick={() => repairJsonFile(issue.roomId)}
                            disabled={repairing === issue.roomId}
                            size="sm"
                            variant="outline"
                          >
                            {repairing === issue.roomId ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Repairing...
                              </>
                            ) : (
                              <>
                                <Download className="mr-2 h-4 w-4" />
                                Repair
                              </>
                            )}
                          </Button>
                        )}
                        {getIssueBadge(issue.issueType)}
                      </div>
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
