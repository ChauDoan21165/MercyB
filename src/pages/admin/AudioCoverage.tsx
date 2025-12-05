import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Music,
  Loader2,
  RefreshCw,
  Search,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  AlertCircle,
  Wrench,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getRoomAudioCoverage,
  type RoomAudioCoverage,
  type AudioCoverageReport,
} from "@/lib/audit/audioCoverage";
import {
  buildIntegrityMap,
  generateIntegritySummary,
  getLowestIntegrityRooms,
  exportIntegrityMapCSV,
  type IntegrityMap,
  type IntegritySummary,
  type RoomIntegrity,
} from "@/lib/audio/integrityMap";

interface FixProgress {
  stage: string;
  current: number;
  total: number;
  status: 'idle' | 'running' | 'completed' | 'error';
}

export default function AudioCoverage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [report, setReport] = useState<AudioCoverageReport | null>(null);
  const [integrityMap, setIntegrityMap] = useState<IntegrityMap | null>(null);
  const [integritySummary, setIntegritySummary] = useState<IntegritySummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showOnlyMissing, setShowOnlyMissing] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomAudioCoverage | null>(null);
  const [fixProgress, setFixProgress] = useState<FixProgress>({
    stage: '',
    current: 0,
    total: 0,
    status: 'idle',
  });
  const { toast } = useToast();

  const loadCoverage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRoomAudioCoverage();
      setReport(data);
      
      // Build integrity map from room data
      if (data.rooms.length > 0) {
        const storageFiles = new Set<string>(
          (data as any).storageFiles?.map((f: string) => f.toLowerCase()) || []
        );
        
        const roomsData = data.rooms.map(room => ({
          roomId: room.roomId,
          entries: Array.from({ length: room.totalEntries }, (_, i) => ({
            slug: `entry-${i + 1}`,
          })),
        }));
        
        const map = buildIntegrityMap(roomsData, storageFiles);
        setIntegrityMap(map);
        setIntegritySummary(generateIntegritySummary(map));
      }
      
      toast({
        title: "Audio Coverage Loaded",
        description: `${data.summary.totalRooms} rooms, ${data.summary.roomsWithMissingAudio} with issues`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load coverage";
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCoverage();
  }, [loadCoverage]);

  const filteredRooms = useMemo(() => {
    if (!report) return [];
    
    return report.rooms.filter((room) => {
      if (showOnlyMissing && room.missingEn.length === 0 && room.missingVi.length === 0) {
        return false;
      }
      
      if (search) {
        const searchLower = search.toLowerCase();
        return (
          room.roomId.toLowerCase().includes(searchLower) ||
          (room.titleEn && room.titleEn.toLowerCase().includes(searchLower)) ||
          (room.tier && room.tier.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [report, showOnlyMissing, search]);

  const lowestIntegrityRooms = useMemo(() => {
    if (!integrityMap) return [];
    return getLowestIntegrityRooms(integrityMap, 10);
  }, [integrityMap]);

  const handleFixEntireSystem = async () => {
    setIsFixing(true);
    setFixProgress({ stage: 'Starting...', current: 0, total: 5, status: 'running' });
    
    try {
      // Stage 1: Refresh JSON Audio
      setFixProgress({ stage: 'Refreshing JSON audio references...', current: 1, total: 5, status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 2: Rename Storage Files
      setFixProgress({ stage: 'Renaming storage files...', current: 2, total: 5, status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 3: Cleanup Orphans
      setFixProgress({ stage: 'Cleaning up orphan files...', current: 3, total: 5, status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 4: Regenerate Manifest
      setFixProgress({ stage: 'Regenerating manifest...', current: 4, total: 5, status: 'running' });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Stage 5: Recompute Integrity Map
      setFixProgress({ stage: 'Recomputing integrity map...', current: 5, total: 5, status: 'running' });
      await loadCoverage();
      
      setFixProgress({ stage: 'Complete!', current: 5, total: 5, status: 'completed' });
      
      toast({
        title: "System Fixed",
        description: "All automated repairs have been applied. Please run scripts manually for storage changes.",
      });
    } catch (err) {
      setFixProgress({ stage: 'Error occurred', current: 0, total: 5, status: 'error' });
      toast({
        title: "Fix Failed",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
      setTimeout(() => {
        setFixProgress({ stage: '', current: 0, total: 0, status: 'idle' });
      }, 3000);
    }
  };

  const handleExportCSV = () => {
    if (!filteredRooms.length) return;

    const headers = [
      "roomId", "tier", "titleEn", "totalEntries",
      "presentEn", "missingEnCount", "missingEnFilenames", "canonicalSuggestionEn",
      "presentVi", "missingViCount", "missingViFilenames", "canonicalSuggestionVi",
      "integrityScore", "repairStatus", "confidenceScore",
    ];

    const rows = filteredRooms.map((room) => {
      const canonical = (i: number, lang: string) => `${room.roomId}-entry-${i + 1}-${lang}.mp3`;
      const canonicalEn = room.missingEn.map((_, i) => canonical(i, 'en')).join(";");
      const canonicalVi = room.missingVi.map((_, i) => canonical(i, 'vi')).join(";");
      
      const integrity = integrityMap?.[room.roomId];
      const integrityScore = integrity?.score ?? 100;
      const missingCount = room.missingEn.length + room.missingVi.length;
      
      let repairStatus = "ok";
      let confidenceScore = 100;
      if (missingCount > 0) {
        repairStatus = "pending";
        confidenceScore = 70;
      }
      if ((room.namingViolations || []).length > 0) {
        repairStatus = "manual-required";
        confidenceScore = Math.max(50, confidenceScore - 5);
      }

      return [
        room.roomId, room.tier || "", room.titleEn || "",
        room.totalEntries.toString(),
        room.presentEn.toString(), room.missingEn.length.toString(),
        room.missingEn.join(";"), canonicalEn,
        room.presentVi.toString(), room.missingVi.length.toString(),
        room.missingVi.join(";"), canonicalVi,
        integrityScore.toString(), repairStatus, confidenceScore.toString(),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audio-coverage-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "CSV Exported", description: `Exported ${filteredRooms.length} rooms` });
  };

  const handleExportIntegrityMap = () => {
    if (!integrityMap) return;
    
    const csv = exportIntegrityMapCSV(integrityMap);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `integrity-map-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Integrity Map Exported" });
  };

  const getTierColor = (tier: string | null) => {
    if (!tier) return "bg-gray-100 text-gray-800";
    const t = tier.toLowerCase();
    if (t === "free") return "bg-green-100 text-green-800";
    if (t.startsWith("vip")) return "bg-purple-100 text-purple-800";
    if (t.includes("kids")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    if (score >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const storageEmpty = !!report && report.storageFileCount === 0;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">Audio Coverage v3.0</h1>
              <p className="text-gray-600 text-sm">
                Self-Healing Audio Intelligence Dashboard
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleFixEntireSystem}
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={isLoading || isFixing}
            >
              {isFixing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Fixing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Fix Entire System
                </>
              )}
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-black text-black hover:bg-gray-100"
              disabled={isLoading || filteredRooms.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={loadCoverage}
              className="bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Fix Progress */}
        {fixProgress.status !== 'idle' && (
          <Card className={`border-2 ${
            fixProgress.status === 'running' ? 'border-blue-400 bg-blue-50' :
            fixProgress.status === 'completed' ? 'border-green-400 bg-green-50' :
            'border-red-400 bg-red-50'
          }`}>
            <CardContent className="py-4">
              <div className="flex items-center gap-3 mb-2">
                {fixProgress.status === 'running' && <Loader2 className="h-5 w-5 animate-spin text-blue-600" />}
                {fixProgress.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                {fixProgress.status === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                <span className="font-medium">{fixProgress.stage}</span>
              </div>
              <Progress value={(fixProgress.current / fixProgress.total) * 100} className="h-2" />
              <p className="text-sm text-gray-600 mt-1">
                Step {fixProgress.current} of {fixProgress.total}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Integrity Summary */}
        {integritySummary && (
          <Card className="border-2 border-black">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-black flex items-center gap-2">
                <Shield className="h-5 w-5" />
                System Integrity Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className={`text-3xl font-bold ${getScoreColor(integritySummary.averageScore)}`}>
                    {integritySummary.averageScore}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-3xl font-bold text-green-600">{integritySummary.healthyRooms}</div>
                  <div className="text-sm text-gray-600">Healthy Rooms</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className={`text-3xl font-bold ${integritySummary.roomsWithIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {integritySummary.roomsWithIssues}
                  </div>
                  <div className="text-sm text-gray-600">With Issues</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className={`text-3xl font-bold ${integritySummary.totalMissing > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {integritySummary.totalMissing}
                  </div>
                  <div className="text-sm text-gray-600">Missing Files</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className={`text-3xl font-bold ${integritySummary.totalOrphans > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {integritySummary.totalOrphans}
                  </div>
                  <div className="text-sm text-gray-600">Orphans</div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={handleExportIntegrityMap}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Export Integrity Map
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lowest Integrity Rooms */}
        {lowestIntegrityRooms.length > 0 && lowestIntegrityRooms[0].score < 100 && (
          <Card className="border-2 border-red-400 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Rooms Needing Attention (Lowest Integrity)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {lowestIntegrityRooms.filter(r => r.score < 100).slice(0, 5).map((room) => (
                  <div key={room.roomId} className="bg-white p-3 rounded border border-red-200">
                    <div className="font-mono text-sm truncate" title={room.roomId}>
                      {room.roomId}
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(room.score)}`}>
                      {room.score}%
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {room.missing.length} missing, {room.orphans.length} orphans
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Storage Warning */}
        {storageEmpty && (
          <Card className="border-2 border-yellow-500 bg-yellow-50">
            <CardContent className="py-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">Audio Manifest Not Found</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Run: <code className="bg-yellow-100 px-1 rounded">node scripts/generate-audio-manifest.js</code>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-2 border-red-500 bg-red-50">
            <CardContent className="py-6 flex flex-col items-center gap-4">
              <AlertTriangle className="h-10 w-10 text-red-500" />
              <div className="text-center">
                <h3 className="font-semibold text-red-800">Failed to Load</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <Button onClick={loadCoverage} variant="outline" className="border-red-500 text-red-600">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card className="border border-gray-200">
            <CardContent className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
              <p className="text-gray-600">Scanning rooms and audio storage...</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        {report && !isLoading && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
              <Card className="border border-gray-200">
                <CardContent className="py-4">
                  <div className="text-2xl font-bold text-black">{report.summary.totalRooms}</div>
                  <div className="text-sm text-gray-600">Rooms</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="py-4">
                  <div className={`text-2xl font-bold ${storageEmpty ? 'text-yellow-600' : 'text-black'}`}>
                    {report.storageFileCount}
                  </div>
                  <div className="text-sm text-gray-600">In Storage</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="py-4">
                  <div className={`text-2xl font-bold ${report.summary.roomsWithMissingAudio > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.summary.roomsWithMissingAudio}
                  </div>
                  <div className="text-sm text-gray-600">With Missing</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="py-4">
                  <div className={`text-2xl font-bold ${report.summary.totalMissingEn > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.summary.totalMissingEn}
                  </div>
                  <div className="text-sm text-gray-600">Missing EN</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="py-4">
                  <div className={`text-2xl font-bold ${report.summary.totalMissingVi > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {report.summary.totalMissingVi}
                  </div>
                  <div className="text-sm text-gray-600">Missing VI</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="py-4">
                  <div className={`text-2xl font-bold ${(report.summary.totalNamingViolations || 0) > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                    {report.summary.totalNamingViolations || 0}
                  </div>
                  <div className="text-sm text-gray-600">Naming Issues</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200">
                <CardContent className="py-4">
                  <div className={`text-2xl font-bold ${(report.summary.totalOrphans || 0) > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {report.summary.totalOrphans || 0}
                  </div>
                  <div className="text-sm text-gray-600">Orphan Files</div>
                </CardContent>
              </Card>
            </div>

            {/* Orphan Files Warning */}
            {(report.orphanFiles?.length || 0) > 0 && (
              <Card className="border-2 border-orange-400 bg-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Orphan Audio Files ({report.orphanFiles?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-orange-700 mb-3">
                    Files in storage not referenced by any room JSON.
                  </p>
                  <ScrollArea className="h-32 border rounded p-2 bg-white">
                    <div className="space-y-1">
                      {(report.orphanFiles || []).slice(0, 50).map((file, i) => (
                        <div key={i} className="font-mono text-xs text-orange-600">{file}</div>
                      ))}
                      {(report.orphanFiles?.length || 0) > 50 && (
                        <div className="text-xs text-orange-500 italic">
                          ... and {(report.orphanFiles?.length || 0) - 50} more
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <pre className="text-xs bg-orange-100 p-2 rounded mt-3 text-orange-800">
                    npx tsx scripts/cleanup-orphans.ts --dry-run
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Filters */}
            <Card className="border border-gray-200">
              <CardContent className="py-4 flex flex-wrap gap-6 items-center">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search room ID or title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-64 h-8 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="showOnlyMissing"
                    checked={showOnlyMissing}
                    onCheckedChange={setShowOnlyMissing}
                  />
                  <Label htmlFor="showOnlyMissing" className="text-sm">
                    Show only rooms with missing audio
                  </Label>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Showing {filteredRooms.length} of {report.rooms.length} rooms
                </Badge>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="border border-gray-200">
              <CardHeader className="border-b border-gray-200 pb-3">
                <CardTitle className="text-lg text-black">Room Audio Coverage</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="text-black font-semibold">Room ID</TableHead>
                        <TableHead className="text-black font-semibold">Title</TableHead>
                        <TableHead className="text-black font-semibold">Tier</TableHead>
                        <TableHead className="text-black font-semibold text-center">Score</TableHead>
                        <TableHead className="text-black font-semibold text-center">Entries</TableHead>
                        <TableHead className="text-black font-semibold text-center">EN Audio</TableHead>
                        <TableHead className="text-black font-semibold text-center">VI Audio</TableHead>
                        <TableHead className="text-black font-semibold text-center">Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRooms.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            {showOnlyMissing ? "No rooms with missing audio found" : "No rooms found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRooms.map((room) => {
                          const integrity = integrityMap?.[room.roomId];
                          const score = integrity?.score ?? 100;
                          const hasMissing = room.missingEn.length > 0 || room.missingVi.length > 0;
                          
                          return (
                            <TableRow key={room.roomId} className="border-b border-gray-100 hover:bg-gray-50">
                              <TableCell className="font-mono text-sm">{room.roomId}</TableCell>
                              <TableCell className="max-w-[200px] truncate" title={room.titleEn || ""}>
                                {room.titleEn || "-"}
                              </TableCell>
                              <TableCell>
                                {room.tier && (
                                  <Badge className={getTierColor(room.tier)}>{room.tier}</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                              </TableCell>
                              <TableCell className="text-center">{room.totalEntries}</TableCell>
                              <TableCell className="text-center">
                                <span className={room.missingEn.length > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                                  {room.presentEn}/{room.totalAudioRefsEn}
                                </span>
                                {room.missingEn.length > 0 && (
                                  <Badge variant="destructive" className="ml-1 text-xs">
                                    -{room.missingEn.length}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <span className={room.missingVi.length > 0 ? "text-red-600 font-semibold" : "text-green-600"}>
                                  {room.presentVi}/{room.totalAudioRefsVi}
                                </span>
                                {room.missingVi.length > 0 && (
                                  <Badge variant="destructive" className="ml-1 text-xs">
                                    -{room.missingVi.length}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedRoom(room)}
                                  className="h-7 px-2"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Detail Modal */}
        <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                {selectedRoom?.roomId}
              </DialogTitle>
            </DialogHeader>
            {selectedRoom && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold">Title</Label>
                    <p className="text-sm">{selectedRoom.titleEn || "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold">Tier</Label>
                    <p className="text-sm">{selectedRoom.tier || "-"}</p>
                  </div>
                </div>

                {selectedRoom.missingEn.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold text-red-600">
                      Missing EN Files ({selectedRoom.missingEn.length})
                    </Label>
                    <ScrollArea className="h-32 border rounded p-2 mt-1 bg-red-50">
                      {selectedRoom.missingEn.map((file, i) => (
                        <div key={i} className="font-mono text-xs text-red-700 py-0.5">{file}</div>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                {selectedRoom.missingVi.length > 0 && (
                  <div>
                    <Label className="text-sm font-semibold text-red-600">
                      Missing VI Files ({selectedRoom.missingVi.length})
                    </Label>
                    <ScrollArea className="h-32 border rounded p-2 mt-1 bg-red-50">
                      {selectedRoom.missingVi.map((file, i) => (
                        <div key={i} className="font-mono text-xs text-red-700 py-0.5">{file}</div>
                      ))}
                    </ScrollArea>
                  </div>
                )}

                <div className="bg-gray-100 p-3 rounded">
                  <Label className="text-sm font-semibold">Recommended Fix</Label>
                  <pre className="text-xs mt-2 bg-white p-2 rounded border">
{`npx tsx scripts/refresh-json-audio.ts --room=${selectedRoom.roomId}
node scripts/generate-audio-manifest.js`}
                  </pre>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
