// src/_legacy_next_pages/admin/AudioCoverage.tsx
// MB-BLUE-97.4 — 2025-12-28 (+0700)
//
// LOCKED FIX:
// - This admin audit panel must NEVER mount inside /room/* routes.
// - Prevents any legacy UI side-effects from leaking into room pages.

import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";

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
  DialogDescription,
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
  Zap,
  Shield,
  BarChart3,
  Terminal,
  Github,
  Copy,
  Play,
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
} from "@/lib/audio/integrityMap";

interface FixProgress {
  stage: string;
  current: number;
  total: number;
  status: "idle" | "running" | "completed" | "error";
}

export default function AudioCoverage() {
  // ✅ HARD GUARD (LOOP BREAKER):
  // If this component is ever globally mounted, it must not run on /room/*
  // (prevents any legacy UI / side-effects from appearing inside rooms).
  const location = useLocation();
  if (location.pathname.startsWith("/room/")) {
    return null;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<AudioCoverageReport | null>(null);
  const [integrityMap, setIntegrityMap] = useState<IntegrityMap | null>(null);
  const [integritySummary, setIntegritySummary] =
    useState<IntegritySummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [showOnlyMissing, setShowOnlyMissing] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<RoomAudioCoverage | null>(
    null
  );

  // Modal states
  const [showFixModal, setShowFixModal] = useState(false);
  const [showDryRunModal, setShowDryRunModal] = useState(false);

  const [fixProgress, setFixProgress] = useState<FixProgress>({
    stage: "",
    current: 0,
    total: 0,
    status: "idle",
  });

  const { toast } = useToast();

  const loadCoverage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getRoomAudioCoverage();
      setReport(data);

      if (data.rooms.length > 0) {
        const storageFiles = new Set<string>(
          (data as any).storageFiles?.map((f: string) => f.toLowerCase()) || []
        );

        const roomsData = data.rooms.map((room) => ({
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
      const message =
        err instanceof Error ? err.message : "Failed to load coverage";
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
      if (
        showOnlyMissing &&
        room.missingEn.length === 0 &&
        room.missingVi.length === 0
      ) {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const handleExportCSV = () => {
    if (!filteredRooms.length) return;

    const headers = [
      "roomId",
      "tier",
      "titleEn",
      "totalEntries",
      "presentEn",
      "missingEnCount",
      "missingEnFilenames",
      "presentVi",
      "missingViCount",
      "missingViFilenames",
      "integrityScore",
      "orphanCount",
      "namingIssuesCount",
      "duplicateGroups",
    ];

    const rows = filteredRooms.map((room) => {
      const integrity = integrityMap?.[room.roomId];
      const integrityScore = integrity?.score ?? 100;
      const orphanCount = integrity?.orphans.length ?? 0;
      const namingCount = (room.namingViolations || []).length;
      const dupCount = integrity?.duplicates.length ?? 0;

      return [
        room.roomId,
        room.tier || "",
        room.titleEn || "",
        room.totalEntries.toString(),
        room.presentEn.toString(),
        room.missingEn.length.toString(),
        room.missingEn.join(";"),
        room.presentVi.toString(),
        room.missingVi.length.toString(),
        room.missingVi.join(";"),
        integrityScore.toString(),
        orphanCount.toString(),
        namingCount.toString(),
        dupCount.toString(),
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audio-coverage-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "CSV Exported",
      description: `Exported ${filteredRooms.length} rooms`,
    });
  };

  const handleExportIntegrityMap = () => {
    if (!integrityMap) return;

    const csv = exportIntegrityMapCSV(integrityMap);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `integrity-map-${new Date()
      .toISOString()
      .split("T")[0]}.csv`;
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

  // Commands for modals - v4.3 Autopilot standard
  const dryRunCommands = `# Option 1: npm script (recommended)
npm run audio:check

# Option 2: Individual commands
npx tsx scripts/refresh-json-audio.ts --dry-run --verbose
npx tsx scripts/cleanup-orphans.ts --dry-run
npx tsx scripts/rename-audio-storage.ts --dry-run --verbose`;

  const fixCommands = `# Option 1: npm script (recommended)
npm run audio:fix

# Option 2: Individual commands (Autopilot)
npx tsx scripts/refresh-json-audio.ts --apply --verbose
npx tsx scripts/rename-audio-storage.ts --verbose
npx tsx scripts/cleanup-orphans.ts --auto-fix
node scripts/generate-audio-manifest.js`;

  const ghCommand =
    'gh workflow run "Audio Auto-Repair v4.3" -f apply_fixes=true';

  return (
    <div className="min-h-screen bg-white p-6">
      {/* ... ENTIRE REST OF YOUR JSX UNCHANGED ... */}
      {/* KEEP EVERYTHING BELOW EXACTLY AS YOU HAVE IT */}
      {/* (I’m not re-pasting the remaining JSX here to avoid accidental diffs.
          Your pasted file already contains it.) */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* paste your existing JSX here unchanged */}
      </div>
    </div>
  );
}

/** New thing to learn:
 * Route-guards (pathname checks) are the fastest way to stop “global mounts” from leaking UI into forbidden pages.
 */
