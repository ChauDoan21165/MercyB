// src/lib/rooms/roomRegistryDiagnostics.ts
/**
 * Room Registry Diagnostics
 *
 * Provides coverage analysis comparing registry rooms with fetched room summaries.
 *
 * Cleaned up:
 * - Removed PUBLIC_ROOM_MANIFEST dependency
 * - Removed manifest-based path assumptions
 * - Kept compatibility fields like totalManifestEntries / missingFromManifest / inManifest
 *   as aliases so older callers do not break immediately
 *
 * Current comparison:
 * - registry rooms = roomRegistry source
 * - fetched rooms = roomFetcher source
 */

import { getAllRoomsAsync, getRoomByIdAsync, type RoomMeta } from "./roomRegistry";
import { getRoomList } from "@/lib/roomFetcher";
import { normalizeTier, TierId, ALL_TIER_IDS } from "@/lib/constants/tiers";

/**
 * Room coverage report
 */
export interface RoomCoverageReport {
  timestamp: string;

  /**
   * Compatibility alias for older callers.
   * This now mirrors totalFetchedRooms instead of manifest entries.
   */
  totalManifestEntries: number;

  totalRegistryRooms: number;
  totalFetchedRooms: number;

  /**
   * Rooms expected from fetched/baseline source but missing from registry.
   */
  missingFromRegistry: MissingRoom[];

  /**
   * Compatibility alias for older callers.
   * This now means "in registry but not in fetched rooms".
   */
  missingFromManifest: MissingRoom[];

  duplicateIds: string[];
  byTier: TierCoverage[];
  healthScore: number; // 0-100
}

export interface MissingRoom {
  id: string;
  source: "manifest" | "registry" | "fetched";
  expectedPath?: string;
  reason?: string;
}

export interface TierCoverage {
  tier: TierId;
  manifestCount: number;
  registryCount: number;
  fetchedCount: number;
  difference: number;
}

/**
 * Extract tier from room ID
 */
function extractTierFromId(roomId: string): TierId {
  const tierPatterns: [RegExp, TierId][] = [
    [/vip9/i, "vip9"],
    [/vip8/i, "vip8"],
    [/vip7/i, "vip7"],
    [/vip6/i, "vip6"],
    [/vip5/i, "vip5"],
    [/vip4/i, "vip4"],
    [/vip3[-_]?ii/i, "vip3"],
    [/vip3/i, "vip3"],
    [/vip2/i, "vip2"],
    [/vip1/i, "vip1"],
    [/kids[-_]?l?3|kidslevel3/i, "kids_3"],
    [/kids[-_]?l?2|kidslevel2/i, "kids_2"],
    [/kids[-_]?l?1|kidslevel1/i, "kids_1"],
    [/free/i, "free"],
  ];

  for (const [pattern, tier] of tierPatterns) {
    if (pattern.test(roomId)) return tier;
  }

  return "free";
}

function findDuplicateIds(ids: string[]): string[] {
  const counts = new Map<string, number>();

  for (const id of ids) {
    const normalized = String(id || "").trim();
    if (!normalized) continue;
    counts.set(normalized, (counts.get(normalized) || 0) + 1);
  }

  return Array.from(counts.entries())
    .filter(([, count]) => count > 1)
    .map(([id]) => id)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Get coverage report comparing registry and fetched rooms (async)
 */
export async function getRoomCoverageReportAsync(): Promise<RoomCoverageReport> {
  const fetchedRooms = await getRoomList();
  const registryRooms = await getAllRoomsAsync();

  const fetchedIds = new Set(fetchedRooms.map((room) => room.id));
  const registryIds = new Set(registryRooms.map((room) => room.id));

  const missingFromRegistry: MissingRoom[] = [];
  for (const room of fetchedRooms) {
    if (!registryIds.has(room.id)) {
      missingFromRegistry.push({
        id: room.id,
        source: "fetched",
        reason: "In fetched rooms but not in registry",
      });
    }
  }

  const missingFromFetched: MissingRoom[] = [];
  for (const room of registryRooms) {
    if (!fetchedIds.has(room.id)) {
      missingFromFetched.push({
        id: room.id,
        source: "registry",
        reason: "In registry but not in fetched rooms",
      });
    }
  }

  const duplicateIds = Array.from(
    new Set([
      ...findDuplicateIds(fetchedRooms.map((room) => room.id)),
      ...findDuplicateIds(registryRooms.map((room) => room.id)),
    ])
  ).sort((a, b) => a.localeCompare(b));

  const tierStats = new Map<TierId, { manifest: number; registry: number; fetched: number }>();
  ALL_TIER_IDS.forEach((tier) => {
    tierStats.set(tier, { manifest: 0, registry: 0, fetched: 0 });
  });

  for (const room of fetchedRooms) {
    const tier = normalizeTier(room.tier) || extractTierFromId(room.id);
    const stats = tierStats.get(tier);
    if (stats) {
      stats.manifest += 1; // compatibility alias for baseline/fetched
      stats.fetched += 1;
    }
  }

  for (const room of registryRooms) {
    const normalizedTier = normalizeTier((room as { tier?: string | null }).tier);
    const tier = normalizedTier || extractTierFromId(room.id);
    const stats = tierStats.get(tier);
    if (stats) stats.registry += 1;
  }

  const byTier: TierCoverage[] = Array.from(tierStats.entries())
    .filter(([, stats]) => stats.manifest > 0 || stats.registry > 0 || stats.fetched > 0)
    .map(([tier, stats]) => ({
      tier,
      manifestCount: stats.manifest,
      registryCount: stats.registry,
      fetchedCount: stats.fetched,
      difference: Math.abs(stats.fetched - stats.registry),
    }))
    .sort((a, b) => a.tier.localeCompare(b.tier));

  const totalExpected = fetchedRooms.length;
  const missingCount = missingFromRegistry.length + missingFromFetched.length;
  const healthScore =
    totalExpected > 0
      ? Math.round(100 * (1 - missingCount / Math.max(1, totalExpected * 2)))
      : 100;

  return {
    timestamp: new Date().toISOString(),
    totalManifestEntries: fetchedRooms.length,
    totalRegistryRooms: registryRooms.length,
    totalFetchedRooms: fetchedRooms.length,
    missingFromRegistry,
    missingFromManifest: missingFromFetched,
    duplicateIds,
    byTier,
    healthScore: Math.max(0, Math.min(100, healthScore)),
  };
}

/**
 * Quick check if registry is fully covered (async)
 */
export async function isRegistryFullyCovered(): Promise<boolean> {
  const report = await getRoomCoverageReportAsync();
  return report.missingFromRegistry.length === 0;
}

/**
 * Get coverage summary for logging (async)
 */
export async function getCoverageSummary(): Promise<string> {
  const report = await getRoomCoverageReportAsync();

  const lines = [
    "=== Room Registry Coverage Report ===",
    `Timestamp: ${report.timestamp}`,
    `Health Score: ${report.healthScore}%`,
    "",
    "Counts:",
    `  Baseline / fetched rooms: ${report.totalFetchedRooms}`,
    `  Registry rooms: ${report.totalRegistryRooms}`,
    "",
  ];

  if (report.missingFromRegistry.length > 0) {
    lines.push(`Missing from Registry (${report.missingFromRegistry.length}):`);
    report.missingFromRegistry.slice(0, 10).forEach((item) => {
      lines.push(`  - ${item.id} (${item.source}): ${item.reason}`);
    });
    if (report.missingFromRegistry.length > 10) {
      lines.push(`  ... and ${report.missingFromRegistry.length - 10} more`);
    }
    lines.push("");
  }

  if (report.missingFromManifest.length > 0) {
    lines.push(`Missing from Fetched/Baseline (${report.missingFromManifest.length}):`);
    report.missingFromManifest.slice(0, 10).forEach((item) => {
      lines.push(`  - ${item.id} (${item.source}): ${item.reason}`);
    });
    if (report.missingFromManifest.length > 10) {
      lines.push(`  ... and ${report.missingFromManifest.length - 10} more`);
    }
    lines.push("");
  }

  if (report.byTier.length > 0) {
    lines.push("Coverage by Tier:");
    report.byTier.forEach((tier) => {
      const status = tier.difference === 0 ? "✓" : `⚠ diff: ${tier.difference}`;
      lines.push(
        `  ${tier.tier}: baseline=${tier.fetchedCount}, registry=${tier.registryCount} ${status}`
      );
    });
  }

  return lines.join("\n");
}

/**
 * Log coverage report to console (dev only, async)
 */
export async function logCoverageReport(): Promise<RoomCoverageReport> {
  const report = await getRoomCoverageReportAsync();

  if (import.meta.env.DEV) {
    console.log(await getCoverageSummary());
  }

  return report;
}

/**
 * Validate a specific room exists in registry (async)
 */
export async function validateRoomInRegistry(
  roomId: string
): Promise<{
  exists: boolean;
  room?: RoomMeta;
  inManifest: boolean;
  inFetched: boolean;
}> {
  const room = await getRoomByIdAsync(roomId);
  const fetchedRooms = await getRoomList();
  const fetchedIds = new Set(fetchedRooms.map((r) => r.id));

  const inFetched = fetchedIds.has(roomId);

  return {
    exists: !!room,
    room,
    inManifest: inFetched, // compatibility alias
    inFetched,
  };
}

/**
 * Sync version for backward compatibility.
 */
export function getRoomCoverageReport(): RoomCoverageReport {
  return {
    timestamp: new Date().toISOString(),
    totalManifestEntries: 0,
    totalRegistryRooms: 0,
    totalFetchedRooms: 0,
    missingFromRegistry: [],
    missingFromManifest: [],
    duplicateIds: [],
    byTier: [],
    healthScore: 0,
  };
}