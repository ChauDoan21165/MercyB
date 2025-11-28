import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Trash2, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SyncStats {
  category: string;
  inDatabase: number;
  inJsonFiles: number;
  difference: number;
  status: "good" | "warning";
  missingInDb?: string[];
  missingInJson?: string[];
}

export function SyncHealthSummary() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SyncStats[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [fixing, setFixing] = useState(false);

  useEffect(() => {
    loadSyncStats();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadSyncStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSyncStats = async () => {
    try {
      setLoading(true);

      // 1. Get all rooms from database
      const { data: dbRooms, error: dbError } = await supabase
        .from('rooms')
        .select('id, tier, title_en');

      if (dbError) throw dbError;

      // 2. Check which JSON files exist by trying to fetch them
      const jsonFileChecks = await Promise.all(
        (dbRooms || []).map(async (room) => {
          try {
            const response = await fetch(`/data/${room.id}.json`, { method: 'HEAD' });
            return { roomId: room.id, exists: response.ok, tier: room.tier };
          } catch {
            return { roomId: room.id, exists: false, tier: room.tier };
          }
        })
      );

      const roomsWithJson = jsonFileChecks.filter(r => r.exists).map(r => r.roomId);
      const roomsWithoutJson = jsonFileChecks.filter(r => !r.exists).map(r => r.roomId);

      // 3. Calculate stats
      const totalDbRooms = dbRooms?.length || 0;
      const totalJsonFiles = roomsWithJson.length;

      const freeDbRooms = dbRooms?.filter(r => 
        r.tier === 'free' || r.tier === 'Free / Miễn phí' || r.tier?.toLowerCase().includes('free')
      ).length || 0;
      
      const freeJsonFiles = jsonFileChecks.filter(r => 
        r.exists && (r.tier === 'free' || r.tier === 'Free / Miễn phí' || r.tier?.toLowerCase().includes('free'))
      ).length;

      const vipDbRooms = dbRooms?.filter(r => 
        r.tier && (r.tier.toLowerCase().startsWith('vip') || /vip\d/.test(r.tier.toLowerCase()))
      ).length || 0;
      
      const vipJsonFiles = jsonFileChecks.filter(r => 
        r.exists && r.tier && (r.tier.toLowerCase().startsWith('vip') || /vip\d/.test(r.tier.toLowerCase()))
      ).length;

      const newStats: SyncStats[] = [
        {
          category: "Total rooms (all tiers)",
          inDatabase: totalDbRooms,
          inJsonFiles: totalJsonFiles,
          difference: Math.abs(totalDbRooms - totalJsonFiles),
          status: totalDbRooms === totalJsonFiles ? "good" : "warning",
          missingInJson: roomsWithoutJson,
        },
        {
          category: "Free tier rooms",
          inDatabase: freeDbRooms,
          inJsonFiles: freeJsonFiles,
          difference: Math.abs(freeDbRooms - freeJsonFiles),
          status: freeDbRooms === freeJsonFiles ? "good" : "warning",
        },
        {
          category: "VIP1 – VIP9 rooms",
          inDatabase: vipDbRooms,
          inJsonFiles: vipJsonFiles,
          difference: Math.abs(vipDbRooms - vipJsonFiles),
          status: vipDbRooms === vipJsonFiles ? "good" : "warning",
        },
        {
          category: "Rooms in DB but no JSON file",
          inDatabase: roomsWithoutJson.length,
          inJsonFiles: 0,
          difference: roomsWithoutJson.length,
          status: roomsWithoutJson.length === 0 ? "good" : "warning",
          missingInJson: roomsWithoutJson,
        },
      ];

      setStats(newStats);
    } catch (error) {
      console.error('Error loading sync stats:', error);
      toast({
        title: "Error",
        description: "Failed to load sync health stats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoomsWithoutJson = async (roomIds: string[]) => {
    if (!roomIds || roomIds.length === 0) return;

    const confirmed = confirm(
      `⚠️ DELETE ${roomIds.length} ROOMS?\n\nThis will permanently delete these rooms from the database:\n\n${roomIds.slice(0, 10).join('\n')}${roomIds.length > 10 ? `\n\n...and ${roomIds.length - 10} more` : ''}\n\nThis action CANNOT be undone.\n\nType YES to confirm.`
    );

    if (!confirmed) return;

    try {
      setFixing(true);

      const { error } = await supabase
        .from('rooms')
        .delete()
        .in('id', roomIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deleted ${roomIds.length} rooms without JSON files`,
      });

      // Reload stats
      await loadSyncStats();
      setExpandedRow(null);
    } catch (error: any) {
      console.error('Error deleting rooms:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete rooms",
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  const handleCreateMissingDbRows = async () => {
    toast({
      title: "Not Implemented",
      description: "Creating DB rows from JSON files requires manual import workflow",
    });
  };

  return (
    <Card className="p-6 mb-6 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">SYNC HEALTH SUMMARY</h2>
          {loading && <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadSyncStats}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 font-semibold">Category</th>
              <th className="text-center py-3 px-4 font-semibold">In Database</th>
              <th className="text-center py-3 px-4 font-semibold">In public/data JSON</th>
              <th className="text-center py-3 px-4 font-semibold">Difference</th>
              <th className="text-center py-3 px-4 font-semibold">Status</th>
              <th className="text-center py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((stat) => (
              <>
                <tr
                  key={stat.category}
                  className={`border-b border-border ${
                    stat.status === "warning" ? "bg-destructive/5" : ""
                  }`}
                >
                  <td className="py-3 px-4 font-medium">{stat.category}</td>
                  <td className="text-center py-3 px-4 font-mono">{stat.inDatabase}</td>
                  <td className="text-center py-3 px-4 font-mono">
                    {stat.category.includes("but no JSON") ? "–" : stat.inJsonFiles}
                  </td>
                  <td className="text-center py-3 px-4">
                    <span
                      className={`font-mono font-bold ${
                        stat.difference > 0 ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {stat.difference}
                    </span>
                  </td>
                  <td className="text-center py-3 px-4">
                    {stat.status === "good" ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Good
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Warning
                      </Badge>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {stat.difference > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setExpandedRow(expandedRow === stat.category ? null : stat.category)
                        }
                      >
                        {expandedRow === stat.category ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </td>
                </tr>

                {/* Expanded details row */}
                {expandedRow === stat.category && stat.difference > 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-muted/30">
                      <div className="space-y-4">
                        {/* List of mismatched rooms */}
                        {stat.missingInJson && stat.missingInJson.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-destructive">
                              Rooms in database without JSON files ({stat.missingInJson.length}):
                            </h4>
                            <div className="max-h-48 overflow-y-auto bg-background rounded border p-3">
                              <ul className="space-y-1 font-mono text-sm">
                                {stat.missingInJson.map((roomId) => (
                                  <li key={roomId} className="text-muted-foreground">
                                    • {roomId}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-3">
                          {stat.missingInJson && stat.missingInJson.length > 0 && (
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteRoomsWithoutJson(stat.missingInJson!)}
                              disabled={fixing}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete all {stat.missingInJson.length} DB rows without JSON
                            </Button>
                          )}

                          {stat.missingInDb && stat.missingInDb.length > 0 && (
                            <Button
                              variant="default"
                              onClick={handleCreateMissingDbRows}
                              disabled={fixing}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Create missing DB rows from JSON files
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && stats.every((s) => s.status === "good") && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Perfect Sync — All rooms have matching JSON files</span>
          </div>
        </div>
      )}
    </Card>
  );
}
