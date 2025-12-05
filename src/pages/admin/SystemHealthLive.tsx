import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RefreshCw, Activity, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type StatusLevel = "healthy" | "warning" | "critical";

interface RoomMetrics {
  totalRooms: number;
  validRooms: number;
  invalidRooms: number;
}

interface AudioMetrics {
  hasAutopilotStatus: boolean;
  beforeIntegrity: number | null;
  afterIntegrity: number | null;
}

interface SystemHealth {
  version: string;
  generatedAt: string;
  status: StatusLevel;
  overallScore: number;
  rooms: RoomMetrics;
  audio: AudioMetrics;
  notes: string[];
}

export default function SystemHealthLive() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setIsLoading(true);
    setLastError(null);
    try {
      const res = await fetch("/system-health.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as SystemHealth;
      setHealth(data);
    } catch (err: any) {
      console.error("Failed to load system health:", err);
      setLastError(err?.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const id = setInterval(fetchHealth, 10000); // 10s
    return () => clearInterval(id);
  }, []);

  const statusIcon = () => {
    if (!health) return null;
    if (health.status === "healthy") {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (health.status === "warning") {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  const statusBadgeVariant = (status: StatusLevel | undefined) => {
    switch (status) {
      case "healthy":
        return "default";
      case "warning":
        return "secondary";
      case "critical":
        return "destructive";
      default:
        return "outline";
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-yellow-600";
    if (score >= 70) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              System Health (Live)
            </h1>
            <p className="text-muted-foreground">
              Global snapshot of rooms + audio automation integrity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {health && (
              <Badge variant={statusBadgeVariant(health.status)} className="uppercase">
                {health.status}
              </Badge>
            )}
            <Button variant="outline" size="sm" onClick={fetchHealth} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error banner */}
        {lastError && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950">
            <CardContent className="py-3 flex items-center gap-2 text-sm text-red-700">
              <AlertTriangle className="w-4 h-4" />
              <span>Failed to load system-health.json: {lastError}</span>
            </CardContent>
          </Card>
        )}

        {/* Main cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Overall Score</CardTitle>
              <CardDescription>Weighted rooms + audio integrity</CardDescription>
            </CardHeader>
            <CardContent>
              {health ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`text-3xl font-bold ${scoreColor(health.overallScore)}`}>
                      {health.overallScore.toFixed(1)}%
                    </div>
                    <div className="flex items-center gap-2">
                      {statusIcon()}
                      <span className="text-sm text-muted-foreground">
                        Generated at{" "}
                        {new Date(health.generatedAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <Progress value={health.overallScore} className="h-2" />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data yet. Run system:check.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Rooms</CardTitle>
              <CardDescription>JSON coverage</CardDescription>
            </CardHeader>
            <CardContent>
              {health ? (
                <div className="space-y-1 text-sm">
                  <div>Total: {health.rooms.totalRooms}</div>
                  <div>Valid: {health.rooms.validRooms}</div>
                  <div className="text-red-600">
                    Invalid: {health.rooms.invalidRooms}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading…</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Audio</CardTitle>
              <CardDescription>Autopilot integrity</CardDescription>
            </CardHeader>
            <CardContent>
              {health ? (
                <div className="space-y-1 text-sm">
                  <div>
                    Status:{" "}
                    {health.audio.hasAutopilotStatus ? (
                      <span className="text-green-600">autopilot-status.json</span>
                    ) : (
                      <span className="text-yellow-600">missing</span>
                    )}
                  </div>
                  <div>
                    Before:{" "}
                    {health.audio.beforeIntegrity != null
                      ? `${health.audio.beforeIntegrity.toFixed(1)}%`
                      : "—"}
                  </div>
                  <div>
                    After:{" "}
                    {health.audio.afterIntegrity != null
                      ? `${health.audio.afterIntegrity.toFixed(1)}%`
                      : "—"}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading…</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>System health comments from checker</CardDescription>
          </CardHeader>
          <CardContent>
            {!health || health.notes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notes. System looks clean from the checker's perspective.
              </p>
            ) : (
              <ScrollArea className="h-40">
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {health.notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
