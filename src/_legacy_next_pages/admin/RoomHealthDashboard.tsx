import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Database,
  FileWarning,
  Volume2,
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRoomHealth } from "@/hooks/useRoomHealth";
import type { RoomValidationResult } from "@/hooks/useRoomHealth";

// ============= CONSTANTS =============

const TIER_OPTIONS = [
  { value: "all", label: "All Tiers" },
  { value: "free", label: "Free" },
  { value: "vip1", label: "VIP1" },
  { value: "vip2", label: "VIP2" },
  { value: "vip3", label: "VIP3" },
  { value: "vip4", label: "VIP4" },
  { value: "vip5", label: "VIP5" },
  { value: "vip6", label: "VIP6" },
  { value: "vip7", label: "VIP7" },
  { value: "vip8", label: "VIP8" },
  { value: "vip9", label: "VIP9" },
];

// ============= HELPER FUNCTIONS =============

function getHealthColor(score: number): string {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

function getSeverityColor(severity: "error" | "warning" | "info"): string {
  switch (severity) {
    case "error": return "destructive";
    case "warning": return "default";
    case "info": return "secondary";
  }
}

function getSeverityIcon(severity: "error" | "warning" | "info") {
  switch (severity) {
    case "error": return <XCircle className="h-4 w-4 text-red-600" />;
    case "warning": return <AlertCircle className="h-4 w-4 text-amber-600" />;
    case "info": return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
  }
}

// ============= MAIN COMPONENT =============

export default function RoomHealthDashboard() {
  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Use the room health hook
  const { data: summary, loading, error, refetch } = useRoomHealth({
    tier: selectedTier,
    autoFetch: false,
  });

  // Handle tier change
  const handleTierChange = (value: string) => {
    setSelectedTier(value);
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refetch();
    setLastUpdated(new Date());
    
    if (summary && !error) {
      toast({
        title: "Health data loaded",
        description: `Scanned ${summary.global.total_rooms} rooms successfully`,
      });
    }
  };

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to fetch health data",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Fetch data on tier change
  useEffect(() => {
    handleRefresh();
  }, [selectedTier]);

  // Get filtered room details
  const filteredRooms = summary?.room_details?.filter(room => {
    if (selectedTier === "all") return true;
    return room.tier?.toLowerCase()?.includes(selectedTier.toLowerCase());
  }) || [];

  const sortedRooms = [...filteredRooms].sort((a, b) => a.health_score - b.health_score);

  // Get tier-specific stats
  const tierStats = selectedTier !== "all" && summary?.byTier
    ? summary.byTier[selectedTier.toLowerCase()]
    : summary?.global;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Room Health Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor room JSON validation, audio coverage, and health scores
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={selectedTier} onValueChange={handleTierChange}>
              <SelectTrigger className="w-[180px] bg-background border-border">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                {TIER_OPTIONS.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleString()}
          </p>
        )}

        {/* Global Stats Cards */}
        {tierStats && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-background border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Rooms</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{tierStats.total_rooms}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedTier === "all" ? "Across all tiers" : `In ${selectedTier.toUpperCase()}`}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Missing JSON</CardTitle>
                <FileWarning className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{tierStats.rooms_missing_json}</div>
                <Progress 
                  value={tierStats.total_rooms > 0 ? (tierStats.rooms_missing_json / tierStats.total_rooms) * 100 : 0}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {tierStats.total_rooms > 0 
                    ? `${((tierStats.rooms_missing_json / tierStats.total_rooms) * 100).toFixed(1)}%`
                    : "0%"
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Zero Audio</CardTitle>
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{tierStats.rooms_zero_audio}</div>
                <Progress 
                  value={tierStats.total_rooms > 0 ? (tierStats.rooms_zero_audio / tierStats.total_rooms) * 100 : 0}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {tierStats.total_rooms > 0 
                    ? `${((tierStats.rooms_zero_audio / tierStats.total_rooms) * 100).toFixed(1)}%`
                    : "0%"
                  }
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Low Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{tierStats.rooms_low_health}</div>
                <Progress 
                  value={tierStats.total_rooms > 0 ? (tierStats.rooms_low_health / tierStats.total_rooms) * 100 : 0}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {tierStats.total_rooms > 0 
                    ? `${((tierStats.rooms_low_health / tierStats.total_rooms) * 100).toFixed(1)}%`
                    : "0%"
                  } health &lt; 50
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* VIP Track Gaps Alert */}
        {summary?.vip_track_gaps && summary.vip_track_gaps.length > 0 && (
          <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-foreground">
              <div className="font-semibold mb-2">Missing VIP Tiers Detected:</div>
              <div className="space-y-1">
                {summary.vip_track_gaps.map(gap => (
                  <div key={gap.tier} className="text-sm">
                    • {gap.title}: {gap.total_rooms} rooms (expected at least {gap.min_required})
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Tier Breakdown */}
        {summary?.byTier && Object.keys(summary.byTier).length > 0 && (
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Tier Breakdown</CardTitle>
              <CardDescription>Room health statistics by subscription tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(summary.byTier)
                  .sort(([a], [b]) => {
                    // Sort: free first, then vip1-9
                    if (a === 'free') return -1;
                    if (b === 'free') return 1;
                    return a.localeCompare(b);
                  })
                  .map(([tier, stats]) => (
                    <div key={tier} className="border border-border rounded-lg p-4 bg-background">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground uppercase">{tier}</h3>
                          <Badge variant="outline" className="text-foreground">
                            {stats.total_rooms} rooms
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleTierChange(tier)}
                          className="text-foreground"
                        >
                          View Details
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Missing JSON</div>
                          <div className="text-lg font-semibold text-foreground">
                            {stats.rooms_missing_json}
                            {stats.rooms_missing_json > 0 && (
                              <XCircle className="inline h-4 w-4 ml-1 text-red-600" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Zero Audio</div>
                          <div className="text-lg font-semibold text-foreground">
                            {stats.rooms_zero_audio}
                            {stats.rooms_zero_audio > 0 && (
                              <AlertCircle className="inline h-4 w-4 ml-1 text-amber-600" />
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Low Health</div>
                          <div className="text-lg font-semibold text-foreground">
                            {stats.rooms_low_health}
                            {stats.rooms_low_health > 0 && (
                              <AlertCircle className="inline h-4 w-4 ml-1 text-amber-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Per-Room Details */}
        {summary?.room_details && summary.room_details.length > 0 && (
          <Card className="bg-background border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Room Details</CardTitle>
              <CardDescription>
                Individual room health and validation issues
                {selectedTier !== "all" && ` (filtered by ${selectedTier.toUpperCase()})`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All ({filteredRooms.length})
                  </TabsTrigger>
                  <TabsTrigger value="issues">
                    Issues ({filteredRooms.filter(r => r.issues.length > 0).length})
                  </TabsTrigger>
                  <TabsTrigger value="healthy">
                    Healthy ({filteredRooms.filter(r => r.health_score >= 80 && r.issues.length === 0).length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4">
                  <RoomList rooms={sortedRooms} />
                </TabsContent>

                <TabsContent value="issues" className="mt-4">
                  <RoomList rooms={sortedRooms.filter(r => r.issues.length > 0)} />
                </TabsContent>

                <TabsContent value="healthy" className="mt-4">
                  <RoomList rooms={sortedRooms.filter(r => r.health_score >= 80 && r.issues.length === 0)} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !summary && (
          <Card className="bg-background border-border">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No health data loaded</h3>
                <p className="text-muted-foreground mb-4">Click refresh to scan room health</p>
                <Button onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Load Health Data
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading && (
          <Card className="bg-background border-border">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 mx-auto text-muted-foreground mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Scanning rooms...</h3>
                <p className="text-muted-foreground">Validating JSON files and computing health scores</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ============= SUB-COMPONENTS =============

interface RoomListProps {
  rooms: RoomValidationResult[];
}

function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rooms match the current filter
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-3">
        {rooms.map((room) => (
          <RoomCard key={room.room_id} room={room} />
        ))}
      </div>
    </ScrollArea>
  );
}

interface RoomCardProps {
  room: RoomValidationResult;
}

function RoomCard({ room }: RoomCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasErrors = room.issues.some(i => i.severity === "error");
  const hasWarnings = room.issues.some(i => i.severity === "warning");

  return (
    <Card 
      className={`border ${
        hasErrors ? 'border-red-300 dark:border-red-800' :
        hasWarnings ? 'border-amber-300 dark:border-amber-800' :
        'border-border'
      } bg-background`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-foreground">{room.room_id}</h4>
              <Badge variant="outline" className="text-xs text-foreground">
                {room.tier}
              </Badge>
              {room.slug && room.slug !== room.room_id && (
                <span className="text-xs text-muted-foreground">({room.slug})</span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span className={`font-medium ${getHealthColor(room.health_score)}`}>
                  {room.health_score}/100
                </span>
              </div>

              <div className="flex items-center gap-1">
                <Volume2 className="h-3 w-3" />
                <span className="text-foreground">
                  {Math.round(room.audio_coverage * 100)}% audio
                </span>
              </div>

              {room.issues.length > 0 && (
                <Badge variant={hasErrors ? "destructive" : "default"} className="text-xs">
                  {room.issues.filter(i => i.severity === "error").length} errors,{" "}
                  {room.issues.filter(i => i.severity === "warning").length} warnings
                </Badge>
              )}
            </div>

            {/* Issues Preview */}
            {room.issues.length > 0 && !expanded && (
              <div className="mt-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Top issue:</span> {room.issues[0].message}
              </div>
            )}
          </div>

          {room.issues.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setExpanded(!expanded)}
              className="text-foreground"
            >
              {expanded ? "Hide" : "Show"} Issues ({room.issues.length})
            </Button>
          )}
        </div>

        {/* Expanded Issues List */}
        {expanded && room.issues.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <h5 className="font-semibold text-sm text-foreground mb-3">Validation Issues:</h5>
            <div className="space-y-2">
              {room.issues.map((issue, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-2 text-sm p-2 rounded bg-muted/50"
                >
                  {getSeverityIcon(issue.severity)}
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{issue.message}</div>
                    {issue.context && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Context: <code className="bg-muted px-1 py-0.5 rounded">{issue.context}</code>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-1">
                      Code: <code className="bg-muted px-1 py-0.5 rounded">{issue.code}</code>
                    </div>
                  </div>
                  <Badge variant={getSeverityColor(issue.severity)} className="text-xs">
                    {issue.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
