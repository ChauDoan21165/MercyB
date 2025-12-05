import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  ExternalLink,
  Download,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  getRoomAudioCoverage,
  type RoomAudioCoverage,
  type AudioCoverageReport,
} from "@/lib/audit/audioCoverage";

export default function AudioCoverage() {
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AudioCoverageReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showOnlyMissing, setShowOnlyMissing] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomAudioCoverage | null>(null);
  const { toast } = useToast();

  const loadCoverage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRoomAudioCoverage();
      setReport(data);
      toast({
        title: "Audio Coverage Loaded",
        description: `${data.summary.totalRooms} rooms, ${data.summary.roomsWithMissingAudio} with missing audio`,
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
  };

  useEffect(() => {
    loadCoverage();
  }, []);

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

  const handleExportCSV = () => {
    if (!filteredRooms.length) return;

    // Enhanced CSV with Phase 2 fields
    const headers = [
      "roomId",
      "tier",
      "titleEn",
      "totalEntries",
      "totalAudioRefsEn",
      "presentEn",
      "missingEnCount",
      "missingEnFilenames",
      "canonicalSuggestionEn",
      "totalAudioRefsVi",
      "presentVi",
      "missingViCount",
      "missingViFilenames",
      "canonicalSuggestionVi",
      "namingViolationCount",
      "namingViolations",
      "repairStatus",
      "confidenceScore",
    ];

    const rows = filteredRooms.map((room) => {
      // Generate canonical suggestions for missing files
      const canonicalEn = room.missingEn.map((f, i) => 
        `${room.roomId}-entry-${i + 1}-en.mp3`
      ).join(";");
      const canonicalVi = room.missingVi.map((f, i) => 
        `${room.roomId}-entry-${i + 1}-vi.mp3`
      ).join(";");
      
      const violationCount = (room.namingViolations || []).length;
      const missingCount = room.missingEn.length + room.missingVi.length;
      
      // Determine repair status
      let repairStatus = "ok";
      let confidenceScore = 100;
      if (missingCount > 0) {
        repairStatus = "pending";
        confidenceScore = 70;
      }
      if (violationCount > 0) {
        repairStatus = "manual-required";
        confidenceScore = Math.max(50, confidenceScore - violationCount * 5);
      }

      return [
        room.roomId,
        room.tier || "",
        room.titleEn || "",
        room.totalEntries.toString(),
        room.totalAudioRefsEn.toString(),
        room.presentEn.toString(),
        room.missingEn.length.toString(),
        room.missingEn.join(";"),
        canonicalEn,
        room.totalAudioRefsVi.toString(),
        room.presentVi.toString(),
        room.missingVi.length.toString(),
        room.missingVi.join(";"),
        canonicalVi,
        violationCount.toString(),
        (room.namingViolations || []).join(";"),
        repairStatus,
        confidenceScore.toString(),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
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

    toast({
      title: "CSV Exported",
      description: `Exported ${filteredRooms.length} rooms with repair suggestions`,
    });
  };

  const getTierColor = (tier: string | null) => {
    if (!tier) return "bg-gray-100 text-gray-800";
    const t = tier.toLowerCase();
    if (t === "free") return "bg-green-100 text-green-800";
    if (t.startsWith("vip")) return "bg-purple-100 text-purple-800";
    if (t.includes("kids")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  // Safe check for empty storage - using array-based storageFileCount
  const storageEmpty = !!report && report.storageFileCount === 0;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">Audio Coverage</h1>
              <p className="text-gray-600 text-sm">
                See which rooms are missing EN/VI mp3 files
              </p>
            </div>
          </div>
          <div className="flex gap-2">
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
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
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

        {/* Storage Empty Warning */}
        {storageEmpty && (
          <Card className="border-2 border-yellow-500 bg-yellow-50">
            <CardContent className="py-4 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800">
                  Audio Manifest Not Found
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Audio files are stored in <code className="bg-yellow-100 px-1 rounded">public/audio/</code> (static files).
                  To enable coverage checking, generate the manifest:
                </p>
                <pre className="text-xs bg-yellow-100 p-2 rounded mt-2 text-yellow-800">
                  node scripts/generate-audio-manifest.js
                </pre>
                <p className="text-xs text-yellow-600 mt-2">
                  This creates <code className="bg-yellow-100 px-1 rounded">/audio/manifest.json</code> listing all .mp3 files.
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
                  <div className="text-2xl font-bold text-black">
                    {report.summary.totalRooms}
                  </div>
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
                    These files exist in storage but are not referenced by any room JSON.
                    Consider running the cleanup script to remove them.
                  </p>
                  <ScrollArea className="h-32 border rounded p-2 bg-white">
                    <div className="space-y-1">
                      {(report.orphanFiles || []).slice(0, 50).map((file, i) => (
                        <div key={i} className="font-mono text-xs text-orange-600">
                          {file}
                        </div>
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
                        <TableHead className="text-black font-semibold text-center">Status</TableHead>
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
                            {showOnlyMissing
                              ? "No rooms with missing audio found"
                              : "No rooms found"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRooms.map((room) => (
                          <TableRow
                            key={room.roomId}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <TableCell className="font-mono text-sm">
                              <Link
                                to={`/room/${room.roomId}`}
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                {room.roomId}
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {room.titleEn || "—"}
                            </TableCell>
                            <TableCell>
                              <Badge className={getTierColor(room.tier)}>
                                {room.tier || "unknown"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              {room.missingEn.length + room.missingVi.length === 0 ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-600">
                                  <span className="h-2 w-2 rounded-full bg-green-500" /> OK
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-red-600">
                                  <span className="h-2 w-2 rounded-full bg-red-500" /> Missing
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">{room.totalEntries}</TableCell>
                            <TableCell className="text-center">
                              <AudioCoverageCell
                                present={room.presentEn}
                                total={room.totalAudioRefsEn}
                                missing={room.missingEn.length}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <AudioCoverageCell
                                present={room.presentVi}
                                total={room.totalAudioRefsVi}
                                missing={room.missingVi.length}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRoom(room)}
                                className="h-7"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Missing Audio Modal */}
        <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-black">
                Missing Audio: {selectedRoom?.roomId}
              </DialogTitle>
            </DialogHeader>
            {selectedRoom && (
              <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Room ID:</strong> {selectedRoom.roomId}</div>
                  <div><strong>Title EN:</strong> {selectedRoom.titleEn || "—"}</div>
                  <div><strong>Title VI:</strong> {selectedRoom.titleVi || "—"}</div>
                  <div className="flex items-center gap-2">
                    <strong>Tier:</strong>
                    <Badge className={getTierColor(selectedRoom.tier)}>
                      {selectedRoom.tier || "unknown"}
                    </Badge>
                  </div>
                </div>

                {selectedRoom.missingEn.length > 0 ? (
                  <div>
                    <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Missing EN Audio ({selectedRoom.missingEn.length})
                    </h4>
                    <ScrollArea className="h-32 border rounded p-2 bg-gray-50">
                      <div className="space-y-1">
                        {selectedRoom.missingEn.map((file, i) => (
                          <div key={i} className="font-mono text-xs text-red-600">
                            {file}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 py-2">
                    <CheckCircle className="h-4 w-4" />
                    All EN audio present ✅
                  </div>
                )}

                {selectedRoom.missingVi.length > 0 ? (
                  <div>
                    <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Missing VI Audio ({selectedRoom.missingVi.length})
                    </h4>
                    <ScrollArea className="h-32 border rounded p-2 bg-gray-50">
                      <div className="space-y-1">
                        {selectedRoom.missingVi.map((file, i) => (
                          <div key={i} className="font-mono text-xs text-red-600">
                            {file}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 py-2">
                    <CheckCircle className="h-4 w-4" />
                    All VI audio present ✅
                  </div>
                )}

                {selectedRoom.namingViolations && selectedRoom.namingViolations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Naming Violations ({selectedRoom.namingViolations.length})
                    </h4>
                    <ScrollArea className="h-32 border rounded p-2 bg-amber-50">
                      <div className="space-y-1">
                        {selectedRoom.namingViolations.map((issue, i) => (
                          <div key={i} className="font-mono text-xs text-amber-700">
                            {issue}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function AudioCoverageCell({
  present,
  total,
  missing,
}: {
  present: number;
  total: number;
  missing: number;
}) {
  if (total === 0) {
    return <span className="text-gray-400">—</span>;
  }

  const hasMissing = missing > 0;
  return (
    <span className={hasMissing ? "text-red-600 font-medium" : "text-green-600"}>
      {present} / {total}
      {hasMissing && (
        <Badge variant="destructive" className="ml-1 text-xs px-1 py-0">
          +{missing}
        </Badge>
      )}
    </span>
  );
}
