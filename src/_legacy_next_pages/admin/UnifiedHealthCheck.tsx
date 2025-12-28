// src/pages/admin/UnifiedHealthCheck.tsx
// MB-BLUE-95.5 — 2025-12-27 (+0700)
// FIXED: resolveRoomJsonPath import + correct fallback candidate semantics

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ColorfulMercyBladeHeader } from "@/components/ColorfulMercyBladeHeader";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  Wrench,
  Download,
  Volume2,
  FileText,
  Trash2,
  RefreshCw,
  FileEdit,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import { KIDS_ROOM_JSON_MAP } from "@/pages/KidsChat";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { guardedCall } from "@/lib/guardedCall";
import {
  normalizeTier,
  tierIdToLabel,
} from "@/lib/constants/tiers";
import { UiHealthPanel } from "@/components/admin/UiHealthPanel";
import { RoomLinkHealth } from "@/components/admin/RoomLinkHealth";
import { AudioCoveragePanel } from "@/components/admin/AudioCoveragePanel";
import EnvironmentBanner from "@/components/admin/EnvironmentBanner";
import { RoomHealthSummary as RoomHealthSummaryComponent } from "@/components/admin/RoomHealthSummary";
import { TierFilterBar } from "@/components/admin/TierFilterBar";
import { RoomIssuesTable } from "@/components/admin/RoomIssuesTable";
import { DeepScanPanel } from "@/components/admin/DeepScanPanel";
import { VipTierCoveragePanel } from "@/components/admin/VipTierCoveragePanel";

/* ✅ FIX #1 — REQUIRED IMPORT */
import { resolveRoomJsonPath } from "@/lib/roomJsonResolver";

/* ------------------------------------------------------------------ */
/* -------------------------- TYPES --------------------------------- */
/* ------------------------------------------------------------------ */

interface RoomIssue {
  roomId: string;
  roomTitle: string;
  tier: string;
  issueType:
    | "missing_file"
    | "invalid_json"
    | "no_entries"
    | "missing_audio"
    | "locked"
    | "missing_entries"
    | "inactive"
    | "orphan_json"
    | "audio_unreachable"
    | "entry_mismatch"
    | "audio_filename_mismatch";
  message: string;
  details?: string;
  resolvedPath?: string;
  manifestKey?: string;
  isKidsRoom?: boolean;
  levelId?: string;
  audioFile?: string;
  entrySlug?: string;
  httpStatus?: number;
  url?: string;
}

interface RoomHealth {
  totalRooms: number;
  healthyRooms: number;
  issuesFound: number;
  issues: RoomIssue[];
}

/* ------------------------------------------------------------------ */
/* ------------------------- HELPERS -------------------------------- */
/* ------------------------------------------------------------------ */

function getTierDisplayName(tier?: string | null): string {
  if (!tier) return "Free";
  const tierId = normalizeTier(tier);
  return tierIdToLabel(tierId).split(" / ")[0];
}

const getSuggestedJsonPath = (schemaId: string, tier: string): string => {
  const base = schemaId.replace(/-/g, "_");
  const suffix = tier.toLowerCase().replace(/\s+/g, "");
  return `public/data/${base}_${suffix}.json`;
};

/* ------------------------------------------------------------------ */
/* ----------------------- COMPONENT -------------------------------- */
/* ------------------------------------------------------------------ */

export default function UnifiedHealthCheck() {
  const { tier } = useParams<{ tier: string }>();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<RoomHealth | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    current: number;
    total: number;
    roomName: string;
  } | null>(null);

  const selectedTier = tier ?? "free";

  /* ------------------------------------------------------------------ */
  /* ----------------------- QUICK SCAN -------------------------------- */
  /* ------------------------------------------------------------------ */

  const checkMainRooms = async () => {
    let query = supabase.from("rooms").select("*");

    if (selectedTier) {
      query = query.ilike("tier", `%${selectedTier}%`);
    }

    const { data: rooms, error } = await query;
    if (error) throw error;

    const totalRooms = rooms?.length ?? 0;

    setHealth({
      totalRooms,
      healthyRooms: 0,
      issuesFound: 0,
      issues: [],
    });

    for (let i = 0; i < totalRooms; i++) {
      const room = rooms![i];
      setProgress({
        current: i + 1,
        total: totalRooms,
        roomName: room.title_en,
      });

      const roomIssues: RoomIssue[] = [];

      const manifestPath = PUBLIC_ROOM_MANIFEST[room.id];

      const candidates: { url: string; key: string; path: string }[] = [];

      if (manifestPath) {
        candidates.push({
          url: `/${manifestPath}`,
          key: room.id,
          path: manifestPath,
        });
      }

      /* ✅ FIX #2 — CORRECT RESOLVER FALLBACK */
      candidates.push({
        url: resolveRoomJsonPath(room.id),
        key: "resolver",
        path: `data/${room.id}.json`,
      });

      let jsonFound = false;
      let jsonData: any = null;
      let resolvedPath: string | undefined;
      let resolvedKey: string | undefined;

      for (const c of candidates) {
        try {
          const res = await fetch(c.url);
          if (!res.ok) continue;

          const text = await res.text();
          if (text.trim().startsWith("<")) continue;

          jsonData = JSON.parse(text);
          jsonFound = true;
          resolvedPath = c.path;
          resolvedKey = c.key;
          break;
        } catch {
          continue;
        }
      }

      if (!jsonFound) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: getTierDisplayName(room.tier),
          issueType: "missing_file",
          message: "JSON file not found",
          details: `Create: ${getSuggestedJsonPath(
            room.schema_id || room.id,
            room.tier || "free"
          )}`,
          manifestKey: room.id,
        });
      } else if (!Array.isArray(jsonData.entries) || jsonData.entries.length === 0) {
        roomIssues.push({
          roomId: room.id,
          roomTitle: room.title_en,
          tier: getTierDisplayName(room.tier),
          issueType: "no_entries",
          message: "Room has no entries",
          resolvedPath,
          manifestKey: resolvedKey,
        });
      }

      setHealth((prev) => {
        if (!prev) return prev;
        const newIssues =
          roomIssues.length > 0 ? [...prev.issues, ...roomIssues] : prev.issues;
        return {
          totalRooms: prev.totalRooms,
          healthyRooms:
            roomIssues.length === 0
              ? prev.healthyRooms + 1
              : prev.healthyRooms,
          issuesFound: newIssues.length,
          issues: newIssues,
        };
      });
    }
  };

  const checkRoomHealth = async () => {
    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      await checkMainRooms();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  /* ------------------------------------------------------------------ */
  /* ----------------------------- UI --------------------------------- */
  /* ------------------------------------------------------------------ */

  return (
    <>
      <ColorfulMercyBladeHeader subtitle="Room Health Check" />
      <EnvironmentBanner />

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/admin/health-dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>

          <Button onClick={checkRoomHealth} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Scanning…
              </>
            ) : (
              "Quick Scan"
            )}
          </Button>
        </div>

        {progress && (
          <Card className="p-6">
            <Progress
              value={(progress.current / progress.total) * 100}
              className="h-2"
            />
            <p className="mt-2 text-sm">
              {progress.current} / {progress.total} — {progress.roomName}
            </p>
          </Card>
        )}

        {health && (
          <Card className="p-6">
            <p>Total rooms: {health.totalRooms}</p>
            <p>Healthy: {health.healthyRooms}</p>
            <p>Issues: {health.issuesFound}</p>
          </Card>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </>
  );
}
