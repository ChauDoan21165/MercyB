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

  // Helper to check if room ID is non-canonical English duplicate (safe to auto-delete)
  const isNonCanonicalEnglishDuplicate = (id: string): boolean => {
    // Pattern: uppercase letters with hyphens (EF-01, A1-01, A2-01, etc.)
    const hasUppercaseWithHyphens = /[A-Z]/.test(id) && id.includes('-');
    
    // Pattern: English layer IDs like EF-01...EF-14, A1-01...A1-14, A2-01...C2-14
    const isEnglishLayerPattern = /^(EF|A1|A2|B1|B2|C1|C2)-\d{2}$/.test(id);
    
    return hasUppercaseWithHyphens || isEnglishLayerPattern;
  };

  const handleDeleteRoomsWithoutJson = async (roomIds: string[]) => {
    if (!roomIds || roomIds.length === 0) return;

    // Split rooms into safe-to-delete and review-manually categories
    const safeToDelete = roomIds.filter(id => isNonCanonicalEnglishDuplicate(id));
    const reviewManually = roomIds.filter(id => !isNonCanonicalEnglishDuplicate(id));

    // Build confirmation message
    let message = `⚠️ SAFETY CHECK:\n\n`;
    
    if (safeToDelete.length > 0) {
      message += `✅ SAFE TO AUTO-DELETE (${safeToDelete.length} non-canonical English duplicates):\n`;
      message += safeToDelete.slice(0, 10).join('\n');
      if (safeToDelete.length > 10) message += `\n...and ${safeToDelete.length - 10} more`;
      message += '\n\n';
    } else {
      message += `✅ SAFE TO AUTO-DELETE: None\n\n`;
    }
    
    if (reviewManually.length > 0) {
      message += `⚠️ REVIEW MANUALLY (${reviewManually.length} lowercase snake_case IDs - will NOT be deleted):\n`;
      message += reviewManually.slice(0, 10).join('\n');
      if (reviewManually.length > 10) message += `\n...and ${reviewManually.length - 10} more`;
      message += '\n\n';
    }

    if (safeToDelete.length === 0) {
      alert(message + `All ${reviewManually.length} room(s) require manual review. Nothing will be deleted automatically.`);
      return;
    }

    message += `Proceed with deleting ONLY the ${safeToDelete.length} non-canonical duplicate(s)?`;
    
    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setFixing(true);

      const { error } = await supabase
        .from('rooms')
        .delete()
        .in('id', safeToDelete);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Deleted ${safeToDelete.length} non-canonical duplicate(s). ${reviewManually.length} room(s) kept for manual review.`,
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

  const handleDeletePhantomRows = async () => {
    try {
      setFixing(true);

      // Get all rooms with entries field to check
      const { data: allRooms, error: fetchError } = await supabase
        .from('rooms')
        .select('id, entries, tier');

      if (fetchError) throw fetchError;

      // Check which rooms have JSON files
      const jsonFileChecks = await Promise.all(
        (allRooms || []).map(async (room) => {
          try {
            const response = await fetch(`/data/${room.id}.json`, { method: 'HEAD' });
            return { roomId: room.id, hasJson: response.ok };
          } catch {
            return { roomId: room.id, hasJson: false };
          }
        })
      );

      const jsonFileMap = new Map(jsonFileChecks.map(r => [r.roomId, r.hasJson]));

      // Find phantom rows matching ALL three conditions
      const phantomRows = (allRooms || []).filter(room => {
        // Condition 1: entries is empty or null
        const hasNoEntries = !room.entries || 
                            (Array.isArray(room.entries) && room.entries.length === 0) ||
                            (typeof room.entries === 'object' && Object.keys(room.entries).length === 0);
        
        // Condition 2: ID has uppercase letters OR hyphens (non-canonical)
        const isNonCanonical = /[A-Z-]/.test(room.id);
        
        // Condition 3: No JSON file exists
        const noJsonFile = !jsonFileMap.get(room.id);
        
        return hasNoEntries && isNonCanonical && noJsonFile;
      });

      if (phantomRows.length === 0) {
        toast({
          title: "Database Clean",
          description: "No phantom rows found - Deep Scan will be 100% green!",
        });
        return;
      }

      const phantomIds = phantomRows.map(r => r.id);
      
      const message = `🗑️ DELETE ${phantomIds.length} PHANTOM DB ROWS?\n\n` +
        `These rows match ALL three conditions:\n` +
        `✓ Zero entries (no content)\n` +
        `✓ Non-canonical IDs (uppercase/hyphens)\n` +
        `✓ No JSON files\n\n` +
        `IDs to delete:\n${phantomIds.slice(0, 20).join(', ')}` +
        (phantomIds.length > 20 ? `\n...and ${phantomIds.length - 20} more` : '') +
        `\n\nThis will make Deep Scan 100% green forever.`;

      const confirmed = confirm(message);
      if (!confirmed) return;

      const { error: deleteError } = await supabase
        .from('rooms')
        .delete()
        .in('id', phantomIds);

      if (deleteError) throw deleteError;

      toast({
        title: "✅ Success",
        description: `Deleted ${phantomIds.length} phantom DB rows - Deep Scan will be 100% green!`,
      });

      // Reload stats
      await loadSyncStats();
      setExpandedRow(null);
    } catch (error: any) {
      console.error('Error deleting phantom rows:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete phantom rows",
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  const handleExportMissingJsonFiles = async () => {
    try {
      setFixing(true);

      // Get all rooms that have entries
      const { data: allRooms, error: fetchError } = await supabase
        .from('rooms')
        .select('*');

      if (fetchError) throw fetchError;

      // Check which rooms are missing JSON files
      const jsonFileChecks = await Promise.all(
        (allRooms || []).map(async (room) => {
          try {
            const response = await fetch(`/data/${room.id}.json`, { method: 'HEAD' });
            return { room, hasJson: response.ok };
          } catch {
            return { room, hasJson: false };
          }
        })
      );

      // Filter rooms with DB entries but no JSON file
      const roomsNeedingJson = jsonFileChecks
        .filter(r => !r.hasJson && r.room.entries && 
                     (Array.isArray(r.room.entries) ? r.room.entries.length > 0 : Object.keys(r.room.entries).length > 0))
        .map(r => r.room);

      if (roomsNeedingJson.length === 0) {
        toast({
          title: "No Files to Export",
          description: "All rooms with DB entries already have JSON files!",
        });
        return;
      }

      const message = `📝 EXPORT ${roomsNeedingJson.length} JSON FILES FROM DATABASE?\n\n` +
        `This will generate JSON files for:\n${roomsNeedingJson.map(r => r.id).slice(0, 10).join('\n')}` +
        (roomsNeedingJson.length > 10 ? `\n...and ${roomsNeedingJson.length - 10} more` : '') +
        `\n\nFiles will be saved to public/data/{id}.json`;

      const confirmed = confirm(message);
      if (!confirmed) return;

      let successCount = 0;
      let failCount = 0;

      for (const room of roomsNeedingJson) {
        try {
          // Construct JSON in Mercy Blade standard format
          const jsonContent = {
            schema_version: "1.0",
            schema_id: room.schema_id || room.id,
            id: room.id,
            tier: room.tier,
            domain: room.domain || "",
            description: {
              en: room.title_en || "",
              vi: room.title_vi || ""
            },
            keywords: room.keywords || [],
            entries: Array.isArray(room.entries) ? room.entries : [],
            room_essay: {
              en: room.room_essay_en || "",
              vi: room.room_essay_vi || ""
            },
            safety_disclaimer: {
              en: room.safety_disclaimer_en || "",
              vi: room.safety_disclaimer_vi || ""
            },
            crisis_footer: {
              en: room.crisis_footer_en || "",
              vi: room.crisis_footer_vi || ""
            }
          };

          // Convert to JSON string with proper formatting
          const jsonString = JSON.stringify(jsonContent, null, 2);

          // Create a blob and download it (browser will handle the file save)
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${room.id}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          successCount++;
        } catch (error) {
          console.error(`Failed to export ${room.id}:`, error);
          failCount++;
        }
      }

      toast({
        title: "✅ Export Complete",
        description: `Exported ${successCount} JSON files. ${failCount > 0 ? `${failCount} failed.` : ''} Please upload them to public/data/ via GitHub.`,
      });

      await loadSyncStats();
    } catch (error: any) {
      console.error('Error exporting JSON files:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to export JSON files",
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
        <div className="flex gap-2">
          <Button
            variant="default"
            size="lg"
            onClick={handleExportMissingJsonFiles}
            disabled={fixing}
            className="bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            📝 Export Missing JSON from DB ({stats.find(s => s.category === "Rooms in DB but no JSON file")?.difference || 0} rooms)
          </Button>
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
                        <div className="flex flex-wrap gap-3">
                          {stat.missingInJson && stat.missingInJson.length > 0 && (
                            <>
                              <Button
                                variant="default"
                                onClick={handleExportMissingJsonFiles}
                                disabled={fixing}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Export Missing JSON from DB ({stat.missingInJson.length} rooms)
                              </Button>
                              
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteRoomsWithoutJson(stat.missingInJson!)}
                                disabled={fixing}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete all {stat.missingInJson.length} DB rows without JSON
                              </Button>
                              
                              <Button
                                variant="destructive"
                                onClick={handleDeletePhantomRows}
                                disabled={fixing}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Phantom DB Rows (zero entries, non-canonical IDs only)
                              </Button>
                            </>
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
