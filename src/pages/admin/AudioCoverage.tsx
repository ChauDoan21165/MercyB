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
  const [search, setSearch] = useState("");
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomAudioCoverage | null>(null);
  const { toast } = useToast();

  const loadCoverage = async () => {
    setIsLoading(true);
    try {
      const data = await getRoomAudioCoverage();
      setReport(data);
      toast({
        title: "Audio Coverage Loaded",
        description: `${data.summary.totalRooms} rooms, ${data.summary.roomsWithMissingAudio} with missing audio`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load coverage",
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
      // Filter by missing audio
      if (showOnlyMissing && room.missingEn.length === 0 && room.missingVi.length === 0) {
        return false;
      }
      
      // Filter by search
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

  const getTierColor = (tier: string | null) => {
    if (!tier) return "bg-gray-100 text-gray-800";
    const t = tier.toLowerCase();
    if (t === "free") return "bg-green-100 text-green-800";
    if (t.startsWith("vip")) return "bg-purple-100 text-purple-800";
    if (t.includes("kids")) return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Music className="h-8 w-8 text-black" />
            <div>
              <h1 className="text-2xl font-bold text-black">Room Audio Coverage</h1>
              <p className="text-gray-600 text-sm">
                Per-room audio file coverage analysis
              </p>
            </div>
          </div>
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

        {/* Summary Cards */}
        {report && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200">
              <CardContent className="py-4">
                <div className="text-2xl font-bold text-black">
                  {report.summary.totalRooms}
                </div>
                <div className="text-sm text-gray-600">Total Rooms</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="py-4">
                <div className="text-2xl font-bold text-black">
                  {report.storageFiles.size}
                </div>
                <div className="text-sm text-gray-600">Files in Storage</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="py-4">
                <div className={`text-2xl font-bold ${report.summary.roomsWithMissingAudio > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {report.summary.roomsWithMissingAudio}
                </div>
                <div className="text-sm text-gray-600">Rooms with Missing Audio</div>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="py-4">
                <div className={`text-2xl font-bold ${(report.summary.totalMissingEn + report.summary.totalMissingVi) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {report.summary.totalMissingEn + report.summary.totalMissingVi}
                </div>
                <div className="text-sm text-gray-600">
                  Total Missing (EN: {report.summary.totalMissingEn}, VI: {report.summary.totalMissingVi})
                </div>
              </CardContent>
            </Card>
          </div>
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
            {report && (
              <Badge variant="outline" className="ml-auto">
                Showing {filteredRooms.length} of {report.rooms.length} rooms
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-200 pb-3">
            <CardTitle className="text-lg text-black">Room Audio Coverage</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-black font-semibold">Room ID</TableHead>
                      <TableHead className="text-black font-semibold">Title</TableHead>
                      <TableHead className="text-black font-semibold">Tier</TableHead>
                      <TableHead className="text-black font-semibold text-center">Entries</TableHead>
                      <TableHead className="text-black font-semibold text-center">EN Audio</TableHead>
                      <TableHead className="text-black font-semibold text-center">VI Audio</TableHead>
                      <TableHead className="text-black font-semibold text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRooms.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
                              disabled={
                                room.missingEn.length === 0 &&
                                room.missingVi.length === 0
                              }
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
            )}
          </CardContent>
        </Card>

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
                <div className="text-sm text-gray-600">
                  {selectedRoom.titleEn && <div>{selectedRoom.titleEn}</div>}
                  <Badge className={getTierColor(selectedRoom.tier)}>
                    {selectedRoom.tier || "unknown"}
                  </Badge>
                </div>

                {selectedRoom.missingEn.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Missing EN Audio ({selectedRoom.missingEn.length})
                    </h4>
                    <ScrollArea className="h-32 border rounded p-2">
                      <div className="space-y-1">
                        {selectedRoom.missingEn.map((file, i) => (
                          <div key={i} className="font-mono text-xs text-red-600">
                            {file}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {selectedRoom.missingVi.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-black mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Missing VI Audio ({selectedRoom.missingVi.length})
                    </h4>
                    <ScrollArea className="h-32 border rounded p-2">
                      <div className="space-y-1">
                        {selectedRoom.missingVi.map((file, i) => (
                          <div key={i} className="font-mono text-xs text-red-600">
                            {file}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {selectedRoom.missingEn.length === 0 &&
                  selectedRoom.missingVi.length === 0 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      All audio files present
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
        <span className="text-xs ml-1">({missing} missing)</span>
      )}
    </span>
  );
}
