/**
 * Room Registry Diagnostics
 * 
 * Provides comprehensive coverage analysis comparing JSON files on disk
 * with rooms loaded in the registry.
 * 
 * Now uses async roomFetcher instead of static roomDataImports.
 */

import { getAllRoomsAsync, getRoomByIdAsync, type RoomMeta } from './roomRegistry';
import { getRoomList } from '@/lib/roomFetcher';
import { PUBLIC_ROOM_MANIFEST } from '@/lib/roomManifest';
import { normalizeTier, TierId, ALL_TIER_IDS } from '@/lib/constants/tiers';

/**
 * Room coverage report
 */
export interface RoomCoverageReport {
  timestamp: string;
  totalManifestEntries: number;
  totalRegistryRooms: number;
  totalFetchedRooms: number;
  missingFromRegistry: MissingRoom[];
  missingFromManifest: MissingRoom[];
  duplicateIds: string[];
  byTier: TierCoverage[];
  healthScore: number; // 0-100
}

export interface MissingRoom {
  id: string;
  source: 'manifest' | 'registry' | 'fetched';
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
    [/vip9/i, 'vip9'],
    [/vip8/i, 'vip8'],
    [/vip7/i, 'vip7'],
    [/vip6/i, 'vip6'],
    [/vip5/i, 'vip5'],
    [/vip4/i, 'vip4'],
    [/vip3[-_]?ii/i, 'vip3'],
    [/vip3/i, 'vip3'],
    [/vip2/i, 'vip2'],
    [/vip1/i, 'vip1'],
    [/kids[-_]?l?3|kidslevel3/i, 'kids_3'],
    [/kids[-_]?l?2|kidslevel2/i, 'kids_2'],
    [/kids[-_]?l?1|kidslevel1/i, 'kids_1'],
    [/free/i, 'free'],
  ];
  
  for (const [pattern, tier] of tierPatterns) {
    if (pattern.test(roomId)) return tier;
  }
  return 'free';
}

/**
 * Get coverage report comparing manifest, registry, and fetched rooms (async)
 */
export async function getRoomCoverageReportAsync(): Promise<RoomCoverageReport> {
  const manifestIds = new Set(Object.keys(PUBLIC_ROOM_MANIFEST));
  const fetchedRooms = await getRoomList();
  const fetchedIds = new Set(fetchedRooms.map(r => r.id));
  const registryRooms = await getAllRoomsAsync();
  const registryIds = new Set(registryRooms.map(r => r.id));
  
  // Find rooms missing from registry that exist in manifest or fetched
  const missingFromRegistry: MissingRoom[] = [];
  
  for (const id of manifestIds) {
    if (!registryIds.has(id)) {
      missingFromRegistry.push({
        id,
        source: 'manifest',
        expectedPath: PUBLIC_ROOM_MANIFEST[id],
        reason: 'In manifest but not in registry'
      });
    }
  }
  
  for (const id of fetchedIds) {
    if (!registryIds.has(id) && !manifestIds.has(id)) {
      missingFromRegistry.push({
        id,
        source: 'fetched',
        reason: 'In fetched rooms but not in registry'
      });
    }
  }
  
  // Find rooms in registry not in manifest
  const missingFromManifest: MissingRoom[] = [];
  for (const room of registryRooms) {
    if (!manifestIds.has(room.id)) {
      missingFromManifest.push({
        id: room.id,
        source: 'registry',
        reason: 'In registry but no JSON file mapped in manifest'
      });
    }
  }
  
  // Find duplicate IDs
  const allIds = [...manifestIds, ...fetchedIds, ...registryIds];
  const idCounts = new Map<string, number>();
  for (const id of allIds) {
    idCounts.set(id, (idCounts.get(id) || 0) + 1);
  }
  const duplicateIds = Array.from(idCounts.entries())
    .filter(([_, count]) => count > 3)
    .map(([id]) => id);
  
  // Coverage by tier
  const tierStats = new Map<TierId, { manifest: number; registry: number; fetched: number }>();
  ALL_TIER_IDS.forEach(tier => {
    tierStats.set(tier, { manifest: 0, registry: 0, fetched: 0 });
  });
  
  for (const id of manifestIds) {
    const tier = extractTierFromId(id);
    const stats = tierStats.get(tier);
    if (stats) stats.manifest++;
  }
  
  for (const room of registryRooms) {
    const stats = tierStats.get(room.tier);
    if (stats) stats.registry++;
  }
  
  for (const room of fetchedRooms) {
    const tier = normalizeTier(room.tier);
    const stats = tierStats.get(tier);
    if (stats) stats.fetched++;
  }
  
  const byTier: TierCoverage[] = Array.from(tierStats.entries())
    .filter(([_, stats]) => stats.manifest > 0 || stats.registry > 0 || stats.fetched > 0)
    .map(([tier, stats]) => ({
      tier,
      manifestCount: stats.manifest,
      registryCount: stats.registry,
      fetchedCount: stats.fetched,
      difference: Math.abs(stats.manifest - stats.registry)
    }))
    .sort((a, b) => a.tier.localeCompare(b.tier));
  
  // Calculate health score
  const totalExpected = Math.max(manifestIds.size, fetchedIds.size);
  const missingCount = missingFromRegistry.length + missingFromManifest.length;
  const healthScore = totalExpected > 0 
    ? Math.round(100 * (1 - missingCount / (totalExpected * 2)))
    : 100;
  
  return {
    timestamp: new Date().toISOString(),
    totalManifestEntries: manifestIds.size,
    totalRegistryRooms: registryRooms.length,
    totalFetchedRooms: fetchedRooms.length,
    missingFromRegistry,
    missingFromManifest,
    duplicateIds,
    byTier,
    healthScore: Math.max(0, Math.min(100, healthScore))
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
    `=== Room Registry Coverage Report ===`,
    `Timestamp: ${report.timestamp}`,
    `Health Score: ${report.healthScore}%`,
    ``,
    `Counts:`,
    `  Manifest entries: ${report.totalManifestEntries}`,
    `  Registry rooms: ${report.totalRegistryRooms}`,
    `  Fetched rooms: ${report.totalFetchedRooms}`,
    ``
  ];
  
  if (report.missingFromRegistry.length > 0) {
    lines.push(`Missing from Registry (${report.missingFromRegistry.length}):`);
    report.missingFromRegistry.slice(0, 10).forEach(m => {
      lines.push(`  - ${m.id} (${m.source}): ${m.reason}`);
    });
    if (report.missingFromRegistry.length > 10) {
      lines.push(`  ... and ${report.missingFromRegistry.length - 10} more`);
    }
    lines.push(``);
  }
  
  if (report.byTier.length > 0) {
    lines.push(`Coverage by Tier:`);
    report.byTier.forEach(t => {
      const status = t.difference === 0 ? '✓' : `⚠ diff: ${t.difference}`;
      lines.push(`  ${t.tier}: manifest=${t.manifestCount}, registry=${t.registryCount} ${status}`);
    });
  }
  
  return lines.join('\n');
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
export async function validateRoomInRegistry(roomId: string): Promise<{ 
  exists: boolean; 
  room?: RoomMeta; 
  inManifest: boolean;
  inFetched: boolean;
}> {
  const room = await getRoomByIdAsync(roomId);
  const fetchedRooms = await getRoomList();
  const fetchedIds = new Set(fetchedRooms.map(r => r.id));
  
  return {
    exists: !!room,
    room,
    inManifest: roomId in PUBLIC_ROOM_MANIFEST,
    inFetched: fetchedIds.has(roomId)
  };
}

// Sync versions for backward compatibility (return empty/false if not loaded)
export function getRoomCoverageReport(): RoomCoverageReport {
  return {
    timestamp: new Date().toISOString(),
    totalManifestEntries: Object.keys(PUBLIC_ROOM_MANIFEST).length,
    totalRegistryRooms: 0,
    totalFetchedRooms: 0,
    missingFromRegistry: [],
    missingFromManifest: [],
    duplicateIds: [],
    byTier: [],
    healthScore: 0
  };
}
