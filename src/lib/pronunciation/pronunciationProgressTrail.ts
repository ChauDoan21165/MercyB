/**
 * Per-session "progress trail" for the Speak practice flow (Step 7 warmth UX).
 *
 * Only SUPPORTED, SCORED attempt outcomes enter the trail: statuses
 * "correct" and "try_again". Abstained outcomes (unclear / unsupported /
 * missing-evidence) are deliberately excluded by the caller so the learner
 * never sees an implied "progress" signal built on weak evidence.
 *
 * The display is intentionally low-shame: it never tells the learner an
 * attempt was worse or that they failed. A dip is framed as "keep going",
 * never as a regression.
 */

export type PronunciationProgressStatus = "correct" | "try_again";

export type PronunciationProgressEntry = {
  status: PronunciationProgressStatus;
  score: number | null;
};

export type PronunciationProgressTrend = "improving" | "steady" | "keep_going";

export type PronunciationProgressDisplay = {
  entries: PronunciationProgressEntry[];
  attemptCount: number;
  latestStatus: PronunciationProgressStatus;
  trend: PronunciationProgressTrend;
  headlineVi: string;
  headlineEn: string;
  supportiveVi: string;
};

export const PRONUNCIATION_PROGRESS_MAX_ENTRIES = 5;

// We need at least two supported attempts before claiming any movement —
// a single data point is not evidence of a trend.
const MIN_ENTRIES_TO_SHOW = 2;

// Score swing (0..100) that counts as a real change rather than measurement noise.
const SCORE_NOISE_BAND = 3;

/**
 * Append a supported, scored attempt to the trail, keeping only the most
 * recent `maxEntries`. Pure — returns a new array, never mutates the input.
 */
export function appendPronunciationProgress(
  previous: readonly PronunciationProgressEntry[],
  entry: PronunciationProgressEntry,
  maxEntries: number = PRONUNCIATION_PROGRESS_MAX_ENTRIES,
): PronunciationProgressEntry[] {
  const next = [...previous, entry];
  if (next.length <= maxEntries) return next;
  return next.slice(next.length - maxEntries);
}

function computeTrend(
  previous: PronunciationProgressEntry,
  latest: PronunciationProgressEntry,
): PronunciationProgressTrend {
  // Crossing the supported threshold (try_again -> correct) dominates the
  // score delta: it is the clearest "you got it" signal.
  if (previous.status === "try_again" && latest.status === "correct") {
    return "improving";
  }
  if (previous.status === "correct" && latest.status === "correct") {
    return "steady";
  }
  if (typeof previous.score === "number" && typeof latest.score === "number") {
    const delta = latest.score - previous.score;
    if (delta >= SCORE_NOISE_BAND) return "improving";
    if (delta <= -SCORE_NOISE_BAND) return "keep_going";
    return "steady";
  }
  // correct -> try_again with no comparable scores: stay encouraging, never shaming.
  return "keep_going";
}

const HEADLINES: Record<PronunciationProgressTrend, { vi: string; en: string }> = {
  improving: {
    vi: "Bạn đang tiến bộ — lần này tốt hơn lần trước rồi.",
    en: "You're improving — this try was better than the last.",
  },
  steady: {
    vi: "Bạn đang giữ phong độ tốt. Cứ vậy nhé.",
    en: "You're holding steady — keep it up.",
  },
  keep_going: {
    vi: "Cứ luyện tiếp nhé — mỗi lần một chút là tiến.",
    en: "Keep going — a little each try adds up.",
  },
};

/**
 * Build the learner-facing progress display, or `null` when there is not yet
 * enough supported evidence (fewer than two scored attempts) to show movement.
 */
export function buildPronunciationProgressDisplay(
  entries: readonly PronunciationProgressEntry[],
): PronunciationProgressDisplay | null {
  if (entries.length < MIN_ENTRIES_TO_SHOW) return null;

  const latest = entries[entries.length - 1];
  const previous = entries[entries.length - 2];
  const trend = computeTrend(previous, latest);

  return {
    entries: [...entries],
    attemptCount: entries.length,
    latestStatus: latest.status,
    trend,
    headlineVi: HEADLINES[trend].vi,
    headlineEn: HEADLINES[trend].en,
    supportiveVi: `Đã luyện ${entries.length} lần có chấm trong buổi này.`,
  };
}
