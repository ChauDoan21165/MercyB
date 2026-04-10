// src/components/admin/SyncHealthSummary.tsx
import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import JSZip from "jszip";
import { normalizeTier } from "@/lib/constants/tiers";

type SyncStatAction =
  | "review_noncanonical"
  | "delete_noncanonical"
  | "delete_phantom"
  | null;

interface SyncStats {
  category: string;
  inDatabase: number;
  matchesRule: number;
  difference: number;
  status: "good" | "warning";
  items?: string[];
  note?: string;
  action?: SyncStatAction;
}

interface RoomRow {
  id: string;
  tier: string | null;
  title_en?: string | null;
  entries?: unknown;
  schema_id?: string | null;
  domain?: string | null;
  title_vi?: string | null;
  keywords?: unknown;
  room_essay_en?: string | null;
  room_essay_vi?: string | null;
  safety_disclaimer_en?: string | null;
  safety_disclaimer_vi?: string | null;
  crisis_footer_en?: string | null;
  crisis_footer_vi?: string | null;
}

function hasNoEntries(entries: unknown): boolean {
  if (!entries) return true;
  if (Array.isArray(entries)) return entries.length === 0;
  if (typeof entries === "object") {
    return Object.keys(entries as Record<string, unknown>).length === 0;
  }
  return false;
}

export function SyncHealthSummary() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SyncStats[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [fixing, setFixing] = useState(false);
  const [canonicalRoomIds, setCanonicalRoomIds] = useState<string[]>([]);

  useEffect(() => {
    loadSyncStats();

    const interval = setInterval(loadSyncStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadSyncStats = async () => {
    try {
      setLoading(true);

      const { data: dbRooms, error: dbError } = await supabase
        .from("rooms")
        .select("id, tier, title_en, entries");

      if (dbError) throw dbError;

      const rooms = (dbRooms || []) as RoomRow[];

      const totalDbRooms = rooms.length;
      const freeDbRooms = rooms.filter(
        (room) => normalizeTier(room.tier || "") === "free"
      ).length;
      const vipDbRooms = rooms.filter((room) => {
        const normalizedTier = normalizeTier(room.tier || "");
        return normalizedTier.startsWith("vip");
      }).length;

      const canonicalIds = rooms
        .filter((room) => isCanonicalId(room.id))
        .map((room) => room.id);

      const nonCanonicalIds = rooms
        .filter((room) => !isCanonicalId(room.id))
        .map((room) => room.id);

      const nonCanonicalDuplicates = nonCanonicalIds.filter((id) =>
        isNonCanonicalEnglishDuplicate(id)
      );

      const phantomRows = rooms.filter((room) => {
        const isNonCanonical = /[A-Z-]/.test(room.id);
        return isNonCanonical && hasNoEntries(room.entries);
      });

      setCanonicalRoomIds(canonicalIds);

      const newStats: SyncStats[] = [
        {
          category: "Total rooms (all tiers)",
          inDatabase: totalDbRooms,
          matchesRule: totalDbRooms,
          difference: 0,
          status: "good",
          note: "Database count only.",
          action: null,
        },
        {
          category: "Free tier rooms",
          inDatabase: freeDbRooms,
          matchesRule: freeDbRooms,
          difference: 0,
          status: "good",
          note: "Tier count from database only.",
          action: null,
        },
        {
          category: "VIP1 – VIP9 rooms",
          inDatabase: vipDbRooms,
          matchesRule: vipDbRooms,
          difference: 0,
          status: "good",
          note: "Legacy VIP counts remain for backward compatibility checks.",
          action: null,
        },
        {
          category: "Canonical room IDs",
          inDatabase: totalDbRooms,
          matchesRule: canonicalIds.length,
          difference: nonCanonicalIds.length,
          status: nonCanonicalIds.length === 0 ? "good" : "warning",
          items: nonCanonicalIds,
          note: "All production room IDs should be canonical lowercase IDs.",
          action: "review_noncanonical",
        },
        {
          category: "Non-canonical English duplicates",
          inDatabase: nonCanonicalDuplicates.length,
          matchesRule: 0,
          difference: nonCanonicalDuplicates.length,
          status: nonCanonicalDuplicates.length === 0 ? "good" : "warning",
          items: nonCanonicalDuplicates,
          note: "Safe-to-delete legacy English duplicates detected by pattern.",
          action: "delete_noncanonical",
        },
        {
          category: "Empty non-canonical rooms",
          inDatabase: phantomRows.length,
          matchesRule: 0,
          difference: phantomRows.length,
          status: phantomRows.length === 0 ? "good" : "warning",
          items: phantomRows.map((room) => room.id),
          note: "Non-canonical rows with no entries are strong phantom-row candidates.",
          action: "delete_phantom",
        },
      ];

      setStats(newStats);
    } catch (error) {
      console.error("Error loading sync stats:", error);
      toast({
        title: "Error",
        description: "Failed to load sync health stats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isCanonicalId = (id: string): boolean => {
    const englishPatterns = [
      /^english_foundation_ef\d{2}$/,
      /^english_a1_a1\d{2}$/,
      /^english_a2_a2\d{2}$/,
      /^english_b1_b1\d{2}$/,
      /^english_b2_b2\d{2}$/,
      /^english_c1_c1\d{2}$/,
      /^english_c2_c2\d{2}$/,
    ];

    const kidsPattern = /^kids_english_l[123]_/;

    const matchesEnglishPattern = englishPatterns.some((pattern) =>
      pattern.test(id)
    );
    const matchesKidsPattern = kidsPattern.test(id);

    if (matchesEnglishPattern || matchesKidsPattern) return true;

    return !/[A-Z]/.test(id);
  };

  const isNonCanonicalEnglishDuplicate = (id: string): boolean => {
    const isUppercaseEnglishPattern = /^(EF|A1|A2|B1|B2|C1|C2)-\d{2}$/i.test(id);
    const hasUppercaseWithHyphens = /[A-Z]/.test(id) && id.includes("-");
    const isTestPrefix = /^(test_|temp_|draft_|dev_|old_)/i.test(id);

    return (
      isUppercaseEnglishPattern ||
      (hasUppercaseWithHyphens && id.length < 20) ||
      isTestPrefix
    );
  };

  const handleDeleteNonCanonicalDuplicates = async (roomIds: string[]) => {
    if (!roomIds || roomIds.length === 0) return;

    const message =
      `🗑️ DELETE ${roomIds.length} NON-CANONICAL DUPLICATES?\n\n` +
      `These look like safe-to-delete legacy English IDs:\n\n` +
      roomIds.slice(0, 15).join(", ") +
      (roomIds.length > 15 ? `\n...and ${roomIds.length - 15} more` : "") +
      `\n\nThis will NOT delete lowercase canonical room IDs.`;

    const confirmed = confirm(message);
    if (!confirmed) return;

    try {
      setFixing(true);

      const { error } = await supabase.from("rooms").delete().in("id", roomIds);

      if (error) throw error;

      toast({
        title: "✅ Success",
        description: `Deleted ${roomIds.length} non-canonical duplicate(s)`,
      });

      await loadSyncStats();
      setExpandedRow(null);
    } catch (error: any) {
      console.error("Error deleting non-canonical duplicates:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete duplicates",
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  const handleExportCanonicalJson = async (roomIds: string[]) => {
    if (!roomIds || roomIds.length === 0) return;

    try {
      setFixing(true);

      const { data: rooms, error: fetchError } = await supabase
        .from("rooms")
        .select("*")
        .in("id", roomIds);

      if (fetchError) throw fetchError;

      const typedRooms = (rooms || []) as RoomRow[];

      if (typedRooms.length === 0) {
        toast({
          title: "No Data",
          description: "Could not find any canonical rooms to export",
        });
        return;
      }

      const zip = new JSZip();
      let successCount = 0;

      for (const room of typedRooms) {
        try {
          const entries = Array.isArray(room.entries) ? room.entries : [];

          const jsonContent = {
            schema_version: "1.0",
            schema_id: room.schema_id || room.id,
            id: room.id,
            tier: room.tier || "free",
            domain: room.domain || "",
            description: {
              en: room.title_en || "",
              vi: room.title_vi || "",
            },
            keywords: Array.isArray(room.keywords) ? room.keywords : [],
            entries,
            room_essay: {
              en: room.room_essay_en || "",
              vi: room.room_essay_vi || "",
            },
            safety_disclaimer: {
              en: room.safety_disclaimer_en || "",
              vi: room.safety_disclaimer_vi || "",
            },
            crisis_footer: {
              en: room.crisis_footer_en || "",
              vi: room.crisis_footer_vi || "",
            },
          };

          zip.file(`${room.id}.json`, JSON.stringify(jsonContent, null, 2));
          successCount += 1;
        } catch (error) {
          console.error(`Failed to add ${room.id} to ZIP:`, error);
        }
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `canonical-rooms-${successCount}-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "✅ ZIP Download Complete",
        description: `Downloaded ${successCount} canonical room JSON file(s) from the database.`,
      });

      await loadSyncStats();
    } catch (error: any) {
      console.error("Error exporting canonical JSON:", error);
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

      const { data: allRooms, error: fetchError } = await supabase
        .from("rooms")
        .select("id, entries, tier");

      if (fetchError) throw fetchError;

      const typedRooms = (allRooms || []) as RoomRow[];

      const phantomRows = typedRooms.filter((room) => {
        const isNonCanonical = /[A-Z-]/.test(room.id);
        return isNonCanonical && hasNoEntries(room.entries);
      });

      if (phantomRows.length === 0) {
        toast({
          title: "Database Clean",
          description: "No empty non-canonical phantom rows found.",
        });
        return;
      }

      const phantomIds = phantomRows.map((room) => room.id);

      const message =
        `🗑️ DELETE ${phantomIds.length} PHANTOM DB ROWS?\n\n` +
        `These rows match both conditions:\n` +
        `✓ Zero entries (no content)\n` +
        `✓ Non-canonical IDs (uppercase/hyphens)\n\n` +
        `IDs to delete:\n${phantomIds.slice(0, 20).join(", ")}` +
        (phantomIds.length > 20 ? `\n...and ${phantomIds.length - 20} more` : "") +
        `\n\nThis removes obvious empty legacy rows from the database.`;

      const confirmed = confirm(message);
      if (!confirmed) return;

      const { error: deleteError } = await supabase
        .from("rooms")
        .delete()
        .in("id", phantomIds);

      if (deleteError) throw deleteError;

      toast({
        title: "✅ Success",
        description: `Deleted ${phantomIds.length} empty non-canonical phantom row(s).`,
      });

      await loadSyncStats();
      setExpandedRow(null);
    } catch (error: any) {
      console.error("Error deleting phantom rows:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete phantom rows",
        variant: "destructive",
      });
    } finally {
      setFixing(false);
    }
  };

  const renderExpandedContent = (stat: SyncStats) => {
    if (!stat.items || stat.items.length === 0) {
      return <p className="text-sm text-muted-foreground">No items found for this category.</p>;
    }

    if (stat.action === "delete_noncanonical") {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
              Safe-to-delete legacy English duplicates ({stat.items.length})
            </h4>
            <div className="max-h-40 overflow-y-auto bg-background rounded border border-orange-200 dark:border-orange-800 p-3">
              <ul className="space-y-1 font-mono text-sm">
                {stat.items.map((roomId) => (
                  <li key={roomId} className="text-muted-foreground">
                    • {roomId}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={() => handleDeleteNonCanonicalDuplicates(stat.items || [])}
            disabled={fixing}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete {stat.items.length} non-canonical duplicate(s)
          </Button>
        </div>
      );
    }

    if (stat.action === "delete_phantom") {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">
              Empty non-canonical phantom rows ({stat.items.length})
            </h4>
            <div className="max-h-40 overflow-y-auto bg-background rounded border border-red-200 dark:border-red-800 p-3">
              <ul className="space-y-1 font-mono text-sm">
                {stat.items.map((roomId) => (
                  <li key={roomId} className="text-muted-foreground">
                    • {roomId}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            variant="destructive"
            onClick={handleDeletePhantomRows}
            disabled={fixing}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete phantom rows
          </Button>
        </div>
      );
    }

    if (stat.action === "review_noncanonical") {
      const safeToDelete = stat.items.filter((id) =>
        isNonCanonicalEnglishDuplicate(id)
      );
      const needsManualReview = stat.items.filter(
        (id) => !isNonCanonicalEnglishDuplicate(id)
      );

      return (
        <div className="space-y-4">
          {safeToDelete.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-orange-600 dark:text-orange-400">
                Safe to auto-delete ({safeToDelete.length})
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

          {needsManualReview.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 text-yellow-600 dark:text-yellow-400">
                Needs manual review ({needsManualReview.length})
              </h4>
              <div className="max-h-32 overflow-y-auto bg-background rounded border border-yellow-200 dark:border-yellow-800 p-3">
                <ul className="space-y-1 font-mono text-sm">
                  {needsManualReview.map((roomId) => (
                    <li key={roomId} className="text-muted-foreground">
                      • {roomId}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {safeToDelete.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => handleDeleteNonCanonicalDuplicates(safeToDelete)}
              disabled={fixing}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete {safeToDelete.length} safe duplicate(s)
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="max-h-40 overflow-y-auto bg-background rounded border p-3">
        <ul className="space-y-1 font-mono text-sm">
          {stat.items.map((item) => (
            <li key={item} className="text-muted-foreground">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const allGood = stats.every((stat) => stat.status === "good");

  return (
    <Card className="p-6 mb-6 border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">SYNC HEALTH SUMMARY</h2>
          {loading && <RefreshCw className="w-5 h-5 animate-spin text-muted-foreground" />}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant="default"
            size="lg"
            onClick={() => handleExportCanonicalJson(canonicalRoomIds)}
            disabled={fixing || canonicalRoomIds.length === 0}
            className="bg-green-600 hover:bg-green-700 text-white font-bold"
          >
            📝 Export Canonical JSON Snapshot ({canonicalRoomIds.length} rooms)
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

      <div className="mb-4 rounded-lg border border-primary/15 bg-muted/20 p-4 text-sm text-muted-foreground">
        This summary audits database hygiene and canonical room IDs only.
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-4 font-semibold">Category</th>
              <th className="text-center py-3 px-4 font-semibold">In Database</th>
              <th className="text-center py-3 px-4 font-semibold">Matches Rule</th>
              <th className="text-center py-3 px-4 font-semibold">Difference</th>
              <th className="text-center py-3 px-4 font-semibold">Status</th>
              <th className="text-center py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stats.map((stat) => (
              <Fragment key={stat.category}>
                <tr
                  className={`border-b border-border ${
                    stat.status === "warning" ? "bg-destructive/5" : ""
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="font-medium">{stat.category}</div>
                    {stat.note ? (
                      <div className="text-xs text-muted-foreground mt-1">{stat.note}</div>
                    ) : null}
                  </td>

                  <td className="text-center py-3 px-4 font-mono">
                    {stat.inDatabase}
                  </td>

                  <td className="text-center py-3 px-4 font-mono">
                    {stat.matchesRule}
                  </td>

                  <td className="text-center py-3 px-4">
                    <span
                      className={`font-mono font-bold ${
                        stat.difference > 0
                          ? "text-destructive"
                          : "text-muted-foreground"
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
                          setExpandedRow(
                            expandedRow === stat.category ? null : stat.category
                          )
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

                {expandedRow === stat.category && stat.difference > 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 bg-muted/30">
                      {renderExpandedContent(stat)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {!loading && allGood && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">
              Database hygiene is clean — no non-canonical room ID issues detected.
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}