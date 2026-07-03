/**
 * Audio Coverage Analysis
 *
 * Analyzes audio completeness across all rooms and tiers
 */

import { supabase } from "@/lib/supabaseClient";
import { normalizeTier, tierIdToLabel } from "@/lib/constants/tiers";

export interface RoomAudioCoverage {
  roomId: string;
  roomTitle: string;
  tier: string;
  totalEntries: number;
  audioEntries: number;
  coveragePercent: number;
  missingAudioSlugs: string[];
}

export interface TierAudioSummary {
  tier: string;
  tierLabel: string;
  rooms: RoomAudioCoverage[];
  totalRooms: number;
  avgCoverage: number;
}

export interface AudioCoverageReport {
  overallCoverage: number;
  totalRooms: number;
  totalEntries: number;
  entriesWithAudio: number;
  byTier: TierAudioSummary[];
}

type AudioCoverageEntry = Record<string, unknown>;
type AudioCoverageRoom = Record<string, unknown> & {
  entries?: unknown;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function nonEmptyString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

/**
 * Check if an entry has valid audio according to canonical rules
 */
function hasValidAudio(entry: AudioCoverageEntry): boolean {
  // Canonical field
  if (nonEmptyString(entry.audio)) {
    return true;
  }

  // Object format (legacy)
  if (isRecord(entry.audio)) {
    const audioObj = entry.audio;
    if (nonEmptyString(audioObj.en)) {
      return true;
    }
    if (nonEmptyString(audioObj.vi)) {
      return true;
    }
  }

  // Legacy fallbacks
  if (nonEmptyString(entry.audio_en)) {
    return true;
  }
  if (nonEmptyString(entry.audioEn)) {
    return true;
  }

  return false;
}

/**
 * Get entry identifier for reporting
 */
function getEntryIdentifier(entry: AudioCoverageEntry, index: number): string {
  return (
    nonEmptyString(entry.slug) ||
    nonEmptyString(entry.id) ||
    nonEmptyString(entry.artifact_id) ||
    `entry-${index}`
  );
}

/**
 * Analyze audio coverage for a single room
 */
function analyzeRoom(room: AudioCoverageRoom): RoomAudioCoverage {
  const entries = Array.isArray(room.entries)
    ? room.entries.map((entry) => (isRecord(entry) ? entry : {}))
    : [];
  const totalEntries = entries.length;

  const missingAudioSlugs: string[] = [];
  let audioEntries = 0;

  entries.forEach((entry, index) => {
    if (hasValidAudio(entry)) {
      audioEntries++;
    } else {
      missingAudioSlugs.push(getEntryIdentifier(entry, index));
    }
  });

  const coveragePercent =
    totalEntries > 0 ? Math.round((audioEntries / totalEntries) * 100) : 0;

  const tier = normalizeTier(nonEmptyString(room.tier) || "level0");
  const roomId = nonEmptyString(room.id) || "";

  return {
    roomId,
    roomTitle: nonEmptyString(room.title_en) || roomId,
    tier,
    totalEntries,
    audioEntries,
    coveragePercent,
    missingAudioSlugs,
  };
}

/**
 * Generate comprehensive audio coverage report
 */
export async function generateAudioCoverageReport(): Promise<AudioCoverageReport> {
  // Fetch all rooms from database
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("id, title_en, tier, entries")
    .order("tier")
    .order("title_en");

  if (error) {
    console.error("[AudioCoverage] Failed to fetch rooms:", error);
    throw new Error(`Failed to fetch rooms: ${error.message}`);
  }

  if (!rooms || rooms.length === 0) {
    return {
      overallCoverage: 0,
      totalRooms: 0,
      totalEntries: 0,
      entriesWithAudio: 0,
      byTier: [],
    };
  }

  // Analyze each room
  const roomCoverages = rooms.map(analyzeRoom);

  // Group by tier
  const tierMap = new Map<string, RoomAudioCoverage[]>();
  roomCoverages.forEach((coverage) => {
    if (!tierMap.has(coverage.tier)) {
      tierMap.set(coverage.tier, []);
    }
    tierMap.get(coverage.tier)!.push(coverage);
  });

  // Build tier summaries
  const byTier: TierAudioSummary[] = [];

  // Sort tiers in logical order
  const tierOrder = [
    "level0",
    "level1",
    "level2",
    "level3",
    "level4",
    "level5",
    "level6",
    "level7",
    "level8",
    "level9",
    "kidslevel1",
    "kidslevel2",
    "kidslevel3",
  ];

  tierOrder.forEach((tierId) => {
    const tierRooms = tierMap.get(tierId);
    if (tierRooms && tierRooms.length > 0) {
      const avgCoverage = Math.round(
        tierRooms.reduce((sum, r) => sum + r.coveragePercent, 0) / tierRooms.length
      );

      byTier.push({
        tier: tierId,
        tierLabel:
          (tierIdToLabel[tierId as keyof typeof tierIdToLabel] ?? String(tierId)).split(
            " / "
          )[0],
        rooms: tierRooms.sort((a, b) => a.coveragePercent - b.coveragePercent),
        totalRooms: tierRooms.length,
        avgCoverage,
      });
    }
  });

  // Calculate overall stats
  const totalRooms = roomCoverages.length;
  const totalEntries = roomCoverages.reduce((sum, r) => sum + r.totalEntries, 0);
  const entriesWithAudio = roomCoverages.reduce((sum, r) => sum + r.audioEntries, 0);
  const overallCoverage =
    totalEntries > 0 ? Math.round((entriesWithAudio / totalEntries) * 100) : 0;

  return {
    overallCoverage,
    totalRooms,
    totalEntries,
    entriesWithAudio,
    byTier,
  };
}

/**
 * Get coverage badge data based on percentage
 */
export function getCoverageBadge(percent: number): {
  label: string;
  variant: "default" | "secondary" | "destructive";
  color: string;
} {
  if (percent >= 90) {
    return {
      label: "Excellent",
      variant: "default",
      color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
  } else if (percent >= 60) {
    return {
      label: "Needs topping up",
      variant: "secondary",
      color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };
  } else {
    return {
      label: "High priority",
      variant: "destructive",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
  }
}
