/**
 * Stage 3A — Local Weakness Map aggregator.
 *
 * Day 3 of the Stage 3A campaign. Pure function that reads from the
 * three local-only adapters landed by Day 2 (#1201/#1202/#1203
 * re-lands) and produces a typed `LocalWeaknessMap` for the Day 4
 * UI to render.
 *
 * Hard invariants per `docs/stage-3a/local-weakness-map-design.md`
 * §1 "Goal and posture" + `ROADMAP.md` Local-Only Posture:
 *
 *   - Pure function. Tests can fake `Date.now()` via vi.useFakeTimers
 *     when they need a deterministic `generatedAt`.
 *   - No Supabase, no network, no `mercy_user_facts`.
 *   - No localStorage WRITE — only reads (via the adapters).
 *   - Each of the three sources is read independently. A failure in
 *     one (corrupted JSON, missing key, schema drift) MUST NOT
 *     suppress the other two — the adapters already enforce this
 *     contract by returning `[]` / `null` on any I/O failure, so the
 *     aggregator can trust their outputs and just compose them.
 *
 * API shape note. The design doc §5 sketched a richer cross-source
 * ranking with confidence bands; the Day 3 dispatch trimmed that to a
 * simpler per-source top-N model (cross-source ranking is Day 4+
 * work). The schema below matches the Day 3 dispatch verbatim.
 *
 * Severity gap on `placementWeaknesses`: the placement-snapshot
 * adapter's `weaknesses: string[]` carries only tag IDs — no
 * severity. The dispatch's output requires `severity`; this
 * aggregator stamps `'medium'` as the conservative default with the
 * note that downstream UI / a future enrichment layer can lift the
 * real severity from `l1Flags` catalog or the placement engine's
 * scoring. Inventing per-tag severity here would be guessing.
 */

import type { L1WeaknessTag } from "@/lib/feedback/l1-error-detector";

import { readL1RecentTags } from "./adapters/l1TagAdapter";
import { readPlacementSnapshot } from "./adapters/placementSnapshotAdapter";
import {
  readPronunciationRecent,
  type PhonemeResult,
} from "./adapters/pronunciationAdapter";

export type WeaknessSeverity = "high" | "medium" | "low";

export interface L1PatternSummary {
  tag: L1WeaknessTag;
  count: number;
  /** Epoch ms of the most recent firing. */
  lastSeen: number;
}

export interface PlacementWeaknessSummary {
  tag: string;
  severity: WeaknessSeverity;
}

export interface PronunciationPainPointSummary {
  /** Either a `PainPointAxis` (when entries carried `painPointAxis`)
   *  or the raw `phoneme` string (when they didn't). */
  axis: string;
  /** 0..1, derived from accuracy scores (1 = always wrong, 0 = always right). */
  errorRate: number;
  /** Number of pronunciation observations under this axis. */
  samples: number;
}

export interface LocalWeaknessMap {
  topL1Patterns: L1PatternSummary[];
  placementWeaknesses: PlacementWeaknessSummary[];
  topPronunciationPainPoints: PronunciationPainPointSummary[];
  /** True when ALL three sources are empty. */
  isEmpty: boolean;
  /** Epoch ms when the aggregation ran. */
  generatedAt: number;
}

const L1_TOP_N = 5;
const PRONUNCIATION_TOP_N = 3;
const PRONUNCIATION_MIN_SAMPLES = 3;

/**
 * Read all three local sources and aggregate. Pure-ish:
 *   - Only side-effect-free localStorage READS through the adapters.
 *   - `Date.now()` for `generatedAt`. Tests fake the clock when they
 *     need a deterministic value.
 */
export function aggregateLocalWeaknesses(): LocalWeaknessMap {
  const l1Entries = safeRead(readL1RecentTags, []);
  const placement = safeRead(readPlacementSnapshot, null);
  const pronunciation = safeRead(readPronunciationRecent, []);

  const topL1Patterns = summarizeL1(l1Entries);
  const placementWeaknesses = summarizePlacement(placement);
  const topPronunciationPainPoints = summarizePronunciation(pronunciation);

  const isEmpty =
    topL1Patterns.length === 0 &&
    placementWeaknesses.length === 0 &&
    topPronunciationPainPoints.length === 0;

  return {
    topL1Patterns,
    placementWeaknesses,
    topPronunciationPainPoints,
    isEmpty,
    generatedAt: Date.now(),
  };
}

/**
 * Belt-and-braces wrapper around adapter reads. The adapters
 * already return safe defaults on failure, but this catches any
 * future regression (e.g. if an adapter starts throwing) so the
 * aggregator's tolerance contract holds even on adapter bugs.
 */
function safeRead<T>(reader: () => T, fallback: T): T {
  try {
    return reader();
  } catch {
    return fallback;
  }
}

function summarizeL1(
  entries: ReadonlyArray<{ tag: L1WeaknessTag; ts: number }>,
): L1PatternSummary[] {
  if (entries.length === 0) return [];
  // Group by tag — preserve max(ts) as `lastSeen`.
  const byTag = new Map<L1WeaknessTag, { count: number; lastSeen: number }>();
  for (const entry of entries) {
    const prev = byTag.get(entry.tag);
    if (prev) {
      prev.count += 1;
      if (entry.ts > prev.lastSeen) prev.lastSeen = entry.ts;
    } else {
      byTag.set(entry.tag, { count: 1, lastSeen: entry.ts });
    }
  }
  const summaries: L1PatternSummary[] = [];
  for (const [tag, agg] of byTag) {
    summaries.push({ tag, count: agg.count, lastSeen: agg.lastSeen });
  }
  // Sort by count desc, tie-break on lastSeen desc so the more recent
  // pattern wins a tie — slightly more useful for the UI.
  summaries.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return b.lastSeen - a.lastSeen;
  });
  return summaries.slice(0, L1_TOP_N);
}

function summarizePlacement(
  snapshot: ReturnType<typeof readPlacementSnapshot>,
): PlacementWeaknessSummary[] {
  if (!snapshot) return [];
  // Severity is not present in the snapshot — stamp the conservative
  // default. Inline rationale documented at the top of this file.
  return snapshot.weaknesses.map((tag) => ({ tag, severity: "medium" }));
}

function summarizePronunciation(
  entries: ReadonlyArray<PhonemeResult>,
): PronunciationPainPointSummary[] {
  if (entries.length === 0) return [];
  // Group by painPointAxis when present, else by phoneme. Mixing the
  // two keys in a single Map is safe because PainPointAxis values
  // (e.g. "TH_T", "R_L") are uppercase + underscored and don't
  // collide with Azure phoneme strings (lowercase IPA-flavoured).
  const byAxis = new Map<string, { sumAccuracy: number; samples: number }>();
  for (const entry of entries) {
    const key = entry.painPointAxis ?? entry.phoneme;
    if (!key) continue;
    const accuracy = clampAccuracy(entry.accuracy);
    const prev = byAxis.get(key);
    if (prev) {
      prev.sumAccuracy += accuracy;
      prev.samples += 1;
    } else {
      byAxis.set(key, { sumAccuracy: accuracy, samples: 1 });
    }
  }
  const summaries: PronunciationPainPointSummary[] = [];
  for (const [axis, agg] of byAxis) {
    if (agg.samples < PRONUNCIATION_MIN_SAMPLES) continue;
    const meanAccuracy = agg.sumAccuracy / agg.samples;
    const errorRate = 1 - meanAccuracy / 100;
    summaries.push({ axis, errorRate, samples: agg.samples });
  }
  // Sort by errorRate desc — worst axes surface first; tie-break on
  // samples desc so a more-evidence axis wins.
  summaries.sort((a, b) => {
    if (b.errorRate !== a.errorRate) return b.errorRate - a.errorRate;
    return b.samples - a.samples;
  });
  return summaries.slice(0, PRONUNCIATION_TOP_N);
}

function clampAccuracy(raw: number): number {
  if (!Number.isFinite(raw)) return 0;
  if (raw < 0) return 0;
  if (raw > 100) return 100;
  return raw;
}
