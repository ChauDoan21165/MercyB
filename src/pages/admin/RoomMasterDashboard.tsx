import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, XCircle, Loader2, RefreshCw, Download } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { roomMasterBatchLoader } from '@/lib/roomMaster/roomMasterLoader';
import type { RoomMasterOutput } from '@/lib/roomMaster/roomMasterTypes';
import { supabase } from '@/integrations/supabase/client';
import AdminButton from '@/components/design-system/AdminButton';

interface RoomSummary {
  roomId: string;
  title: string;
  tier: string;
  errorCount: number;
  warningCount: number;
  crisisFlags: number;
  autoFixed: boolean;
  qualityScore: number;
  validation: RoomMasterOutput | null;
}

export default function RoomMasterDashboard() {
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<RoomSummary[]>([]);
  const [sortBy, setSortBy] = useState<'worst' | 'best'>('worst');

  const loadAllRooms = async () => {
    setLoading(true);
    try {
      // Load all room IDs from database
      const { data: dbRooms } = await supabase
        .from('rooms')
        .select('id, title_en, tier');

      if (!dbRooms) return;

      const roomIds = dbRooms.map(r => r.id);

      // Batch validate all rooms
      const validations = await roomMasterBatchLoader(roomIds, {
        mode: 'preview',
        allowMissingFields: true,
        allowEmptyEntries: false,
        requireAudio: false,
        requireBilingualCopy: true,
        minEntries: 2,
        maxEntries: 8,
      });

      // Build summary
      const summaries: RoomSummary[] = validations.map((v, index) => {
        const dbRoom = dbRooms[index];
        return {
          roomId: v.cleanedRoom.id,
          title: dbRoom?.title_en || v.cleanedRoom.title?.en || v.cleanedRoom.id,
          tier: v.cleanedRoom.tier,
          errorCount: v.errors.length,
          warningCount: v.warnings.length,
          crisisFlags: v.crisisFlags.length,
          autoFixed: v.autofixed,
          qualityScore: v.qualityScore?.overall || 0,
          validation: v,
        };
      });

      setRooms(summaries);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllRooms();
  }, []);

  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortBy === 'worst') {
      // Sort by most errors, then most warnings, then lowest quality
      if (a.errorCount !== b.errorCount) return b.errorCount - a.errorCount;
      if (a.warningCount !== b.warningCount) return b.warningCount - a.warningCount;
      return a.qualityScore - b.qualityScore;
    } else {
      // Sort by fewest errors, then fewest warnings, then highest quality
      if (a.errorCount !== b.errorCount) return a.errorCount - b.errorCount;
      if (a.warningCount !== b.warningCount) return a.warningCount - b.warningCount;
      return b.qualityScore - a.qualityScore;
    }
  });

  const downloadReport = () => {
    const report = sortedRooms.map(r => ({
      roomId: r.roomId,
      title: r.title,
      tier: r.tier,
      errors: r.errorCount,
      warnings: r.warningCount,
      crisisFlags: r.crisisFlags,
      autoFixed: r.autoFixed,
      qualityScore: r.qualityScore,
    }));

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roommaster-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">RoomMaster Dashboard</h1>
        <p className="text-muted-foreground">
          Permanent auto-repair and health monitoring for all 689 rooms
        </p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">All Rooms Health</h2>
            <p className="text-sm text-muted-foreground">
              {rooms.length} rooms analyzed
            </p>
          </div>
          <div className="flex gap-2">
            <AdminButton
              variant="secondary"
              onClick={() => setSortBy(sortBy === 'worst' ? 'best' : 'worst')}
            >
              Sort: {sortBy === 'worst' ? 'Worst First' : 'Best First'}
            </AdminButton>
            <AdminButton onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </AdminButton>
            <AdminButton onClick={loadAllRooms} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </AdminButton>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p>Loading room validations...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedRooms.map(room => (
              <Card key={room.roomId} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {room.errorCount === 0 && room.warningCount === 0 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : room.errorCount > 0 ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                      )}
                      <div>
                        <p className="font-medium">{room.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {room.roomId} • {room.tier}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {room.autoFixed && (
                      <Badge variant="outline" className="bg-blue-50">
                        Auto-Fixed
                      </Badge>
                    )}
                    
                    {room.crisisFlags > 0 && (
                      <Badge variant="destructive">
                        {room.crisisFlags} Crisis Flags
                      </Badge>
                    )}

                    {room.errorCount > 0 && (
                      <Badge variant="destructive">
                        {room.errorCount} Errors
                      </Badge>
                    )}

                    {room.warningCount > 0 && (
                      <Badge variant="secondary">
                        {room.warningCount} Warnings
                      </Badge>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Quality:</span>
                      <Progress value={room.qualityScore} className="w-20" />
                      <span className="text-sm font-medium">{room.qualityScore}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}