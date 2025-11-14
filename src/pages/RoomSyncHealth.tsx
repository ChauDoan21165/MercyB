import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RoomSyncStatus {
  roomId: string;
  title: string;
  tier: string;
  lastSyncedAt: string;
  entryCount: number;
  status: 'synced' | 'unknown' | 'empty';
}

interface HealthCheckResponse {
  timestamp: string;
  summary: {
    totalRooms: number;
    syncedRooms: number;
    emptyRooms: number;
    unknownRooms: number;
    healthScore: number;
  };
  tierBreakdown: Record<string, number>;
  rooms: RoomSyncStatus[];
  roomsNeedingAttention: RoomSyncStatus[];
  recommendations: string[];
}

export default function RoomSyncHealth() {
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['room-sync-health'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke<HealthCheckResponse>('room-sync-health');
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'synced':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'empty':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'unknown':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      synced: 'default',
      empty: 'destructive',
      unknown: 'secondary',
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      free: 'bg-gray-500',
      vip1: 'bg-blue-500',
      vip2: 'bg-purple-500',
      vip3: 'bg-amber-500',
    } as const;

    return (
      <Badge className={colors[tier as keyof typeof colors] || 'bg-gray-500'}>
        {tier.toUpperCase()}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    if (timestamp === 'Never') return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load health check: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room Sync Health Monitor</h1>
          <p className="text-muted-foreground mt-1">
            Last updated: {formatTimestamp(data.timestamp)}
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.summary.healthScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.summary.syncedRooms} of {data.summary.totalRooms} synced
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.summary.totalRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all tiers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Empty Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{data.summary.emptyRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">Need content import</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Unknown Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">{data.summary.unknownRooms}</div>
            <p className="text-xs text-muted-foreground mt-1">Never synced</p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Distribution</CardTitle>
          <CardDescription>Number of rooms per subscription tier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            {Object.entries(data.tierBreakdown).map(([tier, count]) => (
              <div key={tier} className="flex items-center gap-2">
                {getTierBadge(tier)}
                <span className="text-2xl font-bold">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recommendations.map((rec, idx) => (
                <Alert key={idx}>
                  <AlertDescription>{rec}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rooms Needing Attention */}
      {data.roomsNeedingAttention.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rooms Needing Attention</CardTitle>
            <CardDescription>{data.roomsNeedingAttention.length} room(s) require action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.roomsNeedingAttention.map((room) => (
                <div key={room.roomId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(room.status)}
                    <div>
                      <div className="font-medium">{room.title}</div>
                      <div className="text-sm text-muted-foreground">ID: {room.roomId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTierBadge(room.tier)}
                    {getStatusBadge(room.status)}
                    <span className="text-sm text-muted-foreground">{room.entryCount} entries</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Rooms Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Rooms</CardTitle>
          <CardDescription>Complete sync status for all rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.rooms.map((room) => (
              <div key={room.roomId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(room.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{room.title}</div>
                    <div className="text-sm text-muted-foreground">ID: {room.roomId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTimestamp(room.lastSyncedAt)}
                  </div>
                  {getTierBadge(room.tier)}
                  {getStatusBadge(room.status)}
                  <span className="text-sm font-medium min-w-[80px] text-right">
                    {room.entryCount} entries
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
