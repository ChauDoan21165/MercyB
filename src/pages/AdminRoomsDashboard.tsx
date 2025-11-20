import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAccess } from "@/hooks/useUserAccess";
import { ALL_ROOMS } from "@/lib/roomData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Database,
  AlertCircle,
  BarChart3,
  Grid3x3,
  FileJson
} from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TierStats {
  tier: string;
  total: number;
  withData: number;
  withoutData: number;
  percentage: number;
}

const AdminRoomsDashboard = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useUserAccess();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | "all">("all");

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/");
      toast.error("Admin access required");
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Calculate statistics by tier
  const tiers = ["free", "vip1", "vip2", "vip3", "vip3_ii", "vip4", "vip5", "vip6"];
  const tierStats: TierStats[] = tiers.map(tier => {
    const tierRooms = ALL_ROOMS.filter(room => room.tier === tier);
    const withData = tierRooms.filter(room => room.hasData).length;
    const total = tierRooms.length;
    
    return {
      tier,
      total,
      withData,
      withoutData: total - withData,
      percentage: total > 0 ? Math.round((withData / total) * 100) : 0
    };
  });

  // Overall stats
  const totalRooms = ALL_ROOMS.length;
  const totalWithData = ALL_ROOMS.filter(room => room.hasData).length;
  const totalWithoutData = totalRooms - totalWithData;
  const overallPercentage = Math.round((totalWithData / totalRooms) * 100);

  // Get rooms for selected tier
  const displayRooms = selectedTier === "all" 
    ? ALL_ROOMS 
    : ALL_ROOMS.filter(room => room.tier === selectedTier);

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing room registry...", {
      description: "This will reload the page to reflect changes"
    });
    
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const getTierColor = (tier: string) => {
    const colors: Record<string, string> = {
      free: "bg-gray-100 text-gray-800 border-gray-300",
      vip1: "bg-blue-100 text-blue-800 border-blue-300",
      vip2: "bg-green-100 text-green-800 border-green-300",
      vip3: "bg-purple-100 text-purple-800 border-purple-300",
      vip3_ii: "bg-violet-100 text-violet-800 border-violet-300",
      vip4: "bg-orange-100 text-orange-800 border-orange-300",
      vip5: "bg-pink-100 text-pink-800 border-pink-300",
      vip6: "bg-indigo-100 text-indigo-800 border-indigo-300"
    };
    return colors[tier] || "bg-gray-100 text-gray-800";
  };

  const getTierLabel = (tier: string) => {
    const labels: Record<string, string> = {
      free: "Free",
      vip1: "VIP 1",
      vip2: "VIP 2",
      vip3: "VIP 3",
      vip3_ii: "VIP 3 II",
      vip4: "VIP 4",
      vip5: "VIP 5",
      vip6: "VIP 6"
    };
    return labels[tier] || tier.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <ColorfulMercyBladeHeader
        subtitle="Admin Room Management"
        showBackButton={true}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Database className="h-8 w-8 text-primary" />
              Room Registry Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and monitor all learning rooms across tiers
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Registry
          </Button>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Rooms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalRooms}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all tiers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                With Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 flex items-center gap-2">
                {totalWithData}
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{overallPercentage}% complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Without Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 flex items-center gap-2">
                {totalWithoutData}
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{100 - overallPercentage}% pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tiers Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">
                {tierStats.filter(t => t.total > 0).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Out of {tiers.length} tiers</p>
            </CardContent>
          </Card>
        </div>

        {/* Tier Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics by Tier
            </CardTitle>
            <CardDescription>
              Room completion status across all subscription tiers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tierStats.filter(stat => stat.total > 0).map((stat) => (
                <div key={stat.tier} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getTierColor(stat.tier)}>
                        {getTierLabel(stat.tier)}
                      </Badge>
                      <span className="text-sm font-medium">
                        {stat.withData} / {stat.total} rooms
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {stat.percentage}% complete
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rooms Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Grid3x3 className="h-5 w-5" />
                  Room Details
                </CardTitle>
                <CardDescription>
                  View and manage individual rooms
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md text-sm bg-background"
                >
                  <option value="all">All Tiers ({totalRooms})</option>
                  {tierStats.filter(t => t.total > 0).map(stat => (
                    <option key={stat.tier} value={stat.tier}>
                      {getTierLabel(stat.tier)} ({stat.total})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Room ID</TableHead>
                  <TableHead>Name (EN)</TableHead>
                  <TableHead>Name (VI)</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayRooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>
                      {room.hasData ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-orange-500" />
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {room.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {room.nameEn || <span className="text-muted-foreground italic">No name</span>}
                    </TableCell>
                    <TableCell>
                      {room.nameVi || <span className="text-muted-foreground italic">No name</span>}
                    </TableCell>
                    <TableCell>
                      <Badge className={getTierColor(room.tier)} variant="outline">
                        {getTierLabel(room.tier)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/chat/${room.id}`)}
                        disabled={!room.hasData}
                      >
                        View Room
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {displayRooms.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No rooms found for this tier
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <FileJson className="h-5 w-5" />
              Registry Management
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-orange-900 space-y-2">
            <p>
              <strong>To register new rooms:</strong> Place JSON files in <code className="bg-orange-100 px-1 rounded">public/data/</code> 
              with the naming pattern <code className="bg-orange-100 px-1 rounded">room_name_tier.json</code> 
              (e.g., <code className="bg-orange-100 px-1 rounded">vip6_new_room.json</code>)
            </p>
            <p>
              <strong>To regenerate registry:</strong> Run <code className="bg-orange-100 px-1 rounded">node scripts/generate-room-registry.js</code> 
              in the project terminal, or click the "Refresh Registry" button above
            </p>
            <p>
              <strong>Registry files:</strong> The script automatically updates 
              <code className="bg-orange-100 px-1 rounded">src/lib/roomManifest.ts</code> and 
              <code className="bg-orange-100 px-1 rounded">src/lib/roomDataImports.ts</code>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRoomsDashboard;
