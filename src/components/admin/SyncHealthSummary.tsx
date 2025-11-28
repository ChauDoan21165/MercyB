import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Trash2, Plus, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import JSZip from "jszip";

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

      // 2. Check which JSON files exist by trying to fetch them (with cache-busting)
      const cacheBuster = Date.now();
      const jsonFileChecks = await Promise.all(
        (dbRooms || []).map(async (room) => {
          try {
            const response = await fetch(`/data/${room.id}.json?t=${cacheBuster}`, { 
              method: 'HEAD',
              cache: 'no-store'
            });
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

  // CANONICAL ID RULES
  const isCanonicalId = (id: string): boolean => {
    // Canonical = lowercase only, using [a-z 0-9 _ -], no uppercase
    
    // English Pathway canonical patterns
    const englishPatterns = [
      /^english_foundation_ef\d{2}$/,        // english_foundation_ef01-ef14
      /^english_a1_a1\d{2}$/,                // english_a1_a101-a114
      /^english_a2_a2\d{2}$/,                // english_a2_a201-a214
      /^english_b1_b1\d{2}$/,                // english_b1_b101-b114
      /^english_b2_b2\d{2}$/,                // english_b2_b201-b214
      /^english_c1_c1\d{2}$/,                // english_c1_c101-c114
      /^english_c2_c2\d{2}$/,                // english_c2_c201-c214
    ];
    
    // Kids English canonical pattern
    const kidsPattern = /^kids_english_l[123]_/;
    
    // Check if matches known English patterns
    const matchesEnglishPattern = englishPatterns.some(pattern => pattern.test(id));
    const matchesKidsPattern = kidsPattern.test(id);
    
    if (matchesEnglishPattern || matchesKidsPattern) return true;
    
    // For non-English IDs: canonical if lowercase only (no uppercase letters)
    const isLowercaseOnly = !/[A-Z]/.test(id);
    
    return isLowercaseOnly;
  };

  // NON-CANONICAL ID DETECTION (safe to auto-delete)
  const isNonCanonicalEnglishDuplicate = (id: string): boolean => {
    // Pattern 1: Uppercase English level codes (EF-01, A1-01, etc.)
    const isUppercaseEnglishPattern = /^(EF|A1|A2|B1|B2|C1|C2)-\d{2}$/i.test(id);
    
    // Pattern 2: Any English room id with uppercase letters or hyphens that's clearly a short code
    const hasUppercaseWithHyphens = /[A-Z]/.test(id) && id.includes('-');
    
    // Pattern 3: Test/temp/draft prefixes (unless explicitly protected)
    const isTestPrefix = /^(test_|temp_|draft_|dev_|old_)/i.test(id);
    
    return isUppercaseEnglishPattern || (hasUppercaseWithHyphens && id.length < 20) || isTestPrefix;
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

  // NEW: Delete only non-canonical English duplicates (safe operation)
  const handleDeleteNonCanonicalDuplicates = async (roomIds: string[]) => {
    if (!roomIds || roomIds.length === 0) return;

    const message = `🗑️ DELETE ${roomIds.length} NON-CANONICAL DUPLICATES?\n\n` +
      `These are safe-to-delete English legacy IDs:\n\n` +
      roomIds.slice(0, 15).join(', ') +
      (roomIds.length > 15 ? `\n...and ${roomIds.length - 15} more` : '') +
      `\n\nThis will NOT delete any lowercase snake_case canonical IDs.`;

    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setFixing(true);

      const { error } = await supabase
        .from('rooms')
        .delete()
        .in('id', roomIds);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: `Deleted ${roomIds.length} non-canonical English duplicate(s)`,
      });

      // Auto-healing: reload stats
      await loadSyncStats();
      setExpandedRow(null);
    } catch (error: any) {
      console.error('Error deleting non-canonical duplicates:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete duplicates",
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  // NEW: Export JSON only for canonical IDs
  const handleExportCanonicalJson = async (canonicalIds: string[]) => {
    if (!canonicalIds || canonicalIds.length === 0) return;

    try {
      setFixing(true);

      // Get rooms data for canonical IDs
      const { data: rooms, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .in('id', canonicalIds);

      if (fetchError) throw fetchError;

      if (!rooms || rooms.length === 0) {
        toast({
          title: "No Data",
          description: "Could not find any rooms to export",
        });
        return;
      }

      console.log(`Exporting ${rooms.length} canonical rooms to JSON:`, rooms.map(r => r.id));

      // Create ZIP file
      const zip = new JSZip();
      let successCount = 0;

      for (const room of rooms) {
        try {
          // Construct JSON in Mercy Blade standard format
          const entries = room.entries && Array.isArray(room.entries) ? room.entries : [];
          
          const jsonContent = {
            schema_version: "1.0",
            schema_id: room.schema_id || room.id,
            id: room.id,
            tier: room.tier || "free",
            domain: room.domain || "",
            description: {
              en: room.title_en || "",
              vi: room.title_vi || ""
            },
            keywords: room.keywords || [],
            entries: entries,
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

          // Add file to ZIP
          zip.file(`${room.id}.json`, JSON.stringify(jsonContent, null, 2));
          successCount++;
        } catch (error) {
          console.error(`Failed to add ${room.id} to ZIP:`, error);
        }
      }

      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `canonical-rooms-${successCount}-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "✅ ZIP Download Complete",
        description: `Downloaded ${successCount} canonical JSON files. Upload to GitHub public/data/ folder.`,
      });

      // Auto-healing: reload stats
      await loadSyncStats();
    } catch (error: any) {
      console.error('Error exporting canonical JSON:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to export canonical JSON files",
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

      // Get all rooms in DB without JSON files
      const missingJsonStat = stats.find(s => s.category === "Rooms in DB but no JSON file");
      if (!missingJsonStat || !missingJsonStat.missingInJson || missingJsonStat.missingInJson.length === 0) {
        toast({
          title: "Nothing to Export",
          description: "All rooms already have JSON files!",
        });
        return;
      }

      // Filter to only canonical IDs
      const canonicalIds = missingJsonStat.missingInJson.filter(id => isCanonicalId(id));
      
      if (canonicalIds.length === 0) {
        toast({
          title: "No Canonical IDs",
          description: "No canonical room IDs found that need JSON export. Use manual review for non-canonical IDs.",
        });
        return;
      }

      // Use the canonical export handler
      await handleExportCanonicalJson(canonicalIds);
    } catch (error: any) {
      console.error('Error in export handler:', error);
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
            📝 Export Canonical JSON from DB ({stats.find(s => s.category === "Rooms in DB but no JSON file")?.missingInJson?.filter(id => isCanonicalId(id)).length || 0} canonical rooms)
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
                        {/* List of mismatched rooms with classification */}
                        {stat.missingInJson && stat.missingInJson.length > 0 && (
                          <div className="space-y-4">
                            {/* Classify rooms */}
                            {(() => {
                              const safeToDelete = stat.missingInJson.filter(id => isNonCanonicalEnglishDuplicate(id));
                              const needsReview = stat.missingInJson.filter(id => !isNonCanonicalEnglishDuplicate(id));
                              const canonicalMissing = needsReview.filter(id => isCanonicalId(id));
                              const otherMissing = needsReview.filter(id => !isCanonicalId(id));
                              
                              return (
                                <>
                                  {/* Safe to auto-delete */}
                                  {safeToDelete.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                                        ✅ Safe to auto-delete ({safeToDelete.length} non-canonical English duplicates):
                                      </h4>
                                      <div className="max-h-32 overflow-y-auto bg-background rounded border border-orange-200 dark:border-orange-800 p-3">
                                        <ul className="space-y-1 font-mono text-sm">
                                          {safeToDelete.map((roomId) => (
                                            <li key={roomId} className="text-muted-foreground">
                                              • {roomId}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Canonical IDs needing JSON export */}
                                  {canonicalMissing.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2 text-green-600 dark:text-green-400">
                                        📝 Canonical IDs needing JSON export ({canonicalMissing.length}):
                                      </h4>
                                      <div className="max-h-32 overflow-y-auto bg-background rounded border border-green-200 dark:border-green-800 p-3">
                                        <ul className="space-y-1 font-mono text-sm">
                                          {canonicalMissing.map((roomId) => (
                                            <li key={roomId} className="text-muted-foreground">
                                              • {roomId}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}
                                  
                                  {/* Other IDs needing manual review */}
                                  {otherMissing.length > 0 && (
                                    <div>
                                      <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                                        ⚠️ Needs manual review ({otherMissing.length} other IDs):
                                      </h4>
                                      <div className="max-h-32 overflow-y-auto bg-background rounded border border-yellow-200 dark:border-yellow-800 p-3">
                                        <ul className="space-y-1 font-mono text-sm">
                                          {otherMissing.map((roomId) => (
                                            <li key={roomId} className="text-muted-foreground">
                                              • {roomId}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  )}

                                  {/* Action buttons */}
                                  <div className="flex flex-wrap gap-3 pt-2">
                                    {safeToDelete.length > 0 && (
                                      <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteNonCanonicalDuplicates(safeToDelete)}
                                        disabled={fixing}
                                        className="bg-orange-600 hover:bg-orange-700"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete {safeToDelete.length} non-canonical English duplicates
                                      </Button>
                                    )}
                                    
                                    {canonicalMissing.length > 0 && (
                                      <Button
                                        variant="default"
                                        onClick={() => handleExportCanonicalJson(canonicalMissing)}
                                        disabled={fixing}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Export {canonicalMissing.length} canonical JSON files
                                      </Button>
                                    )}
                                  </div>
                                </>
                              );
                            })()}
                          </div>
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
