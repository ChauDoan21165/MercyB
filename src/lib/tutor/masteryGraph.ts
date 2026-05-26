import type { ConfidenceTrend } from "@/lib/ai-tutor/learningMemory";
import type { TodayLessonMode } from "@/lib/tutor/todayLessonPlanner";

export type MasteryConfidenceLevel = "not-enough-data" | "low" | "medium" | "high";

export type MasteryGraphInput = {
  practiceCount?: number;
  strongestTopic?: string | null;
  topicNeedingReview?: string | null;
  weakPattern?: string | null;
  suggestedNextFocus?: string | null;
  correctionCategories?: string[];
  topicTags?: string[];
  topicCounts?: Record<string, number>;
  confidenceTrend?: ConfidenceTrend;
  updatedAt?: number | null;
};

export type MasterySignal = {
  topicId: string;
  masteryScore: number;
  confidenceLevel: MasteryConfidenceLevel;
  needsReview: boolean;
  nextPracticeReason: string;
  recommendedMode: TodayLessonMode;
  updatedAt: number;
};

const FALLBACK_TOPIC = "starter-sentence";
const MAX_TOPIC_LENGTH = 48;
const GRAMMAR_HINTS = [
  "article",
  "past",
  "tense",
  "verb",
  "preposition",
  "plural",
  "third-person",
  "third person",
  "word order",
  "sentence structure",
  "grammar",
];
const SPEAKING_HINTS = ["pronunciation", "speaking", "fluency", "voice"];
const LOGIC_HINTS = ["vietlish", "logic", "translate", "word-for-word", "word for word"];

export function buildMasteryGraph(input: MasteryGraphInput | null | undefined): MasterySignal[] {
  const safeInput = input ?? {};
  const updatedAt = normalizeUpdatedAt(safeInput.updatedAt);
  const practiceCount = Math.max(0, Math.floor(safeInput.practiceCount ?? 0));
  const topicCounts = normalizeTopicCounts(safeInput.topicCounts);
  const reviewTopics = collectTopics(
    safeInput.topicNeedingReview,
    safeInput.weakPattern,
    safeInput.suggestedNextFocus,
    ...(safeInput.correctionCategories ?? []),
    ...(safeInput.topicTags ?? []),
  );
  const strengthTopics = collectTopics(safeInput.strongestTopic);
  const allTopics = uniqueTopics([
    ...reviewTopics,
    ...strengthTopics,
    ...Object.keys(topicCounts).map(cleanTopicId),
  ]);
  const topics = allTopics.length > 0 ? allTopics : [FALLBACK_TOPIC];

  return topics.map((topicId) => {
    const reviewWeight = reviewTopics.includes(topicId) ? 1 : 0;
    const strengthWeight = strengthTopics.includes(topicId) ? 1 : 0;
    const topicCount = topicCounts[topicId] ?? 0;
    const masteryScore = scoreTopic({
      practiceCount,
      topicCount,
      reviewWeight,
      strengthWeight,
      confidenceTrend: safeInput.confidenceTrend,
    });
    const needsReview = reviewWeight > 0 || masteryScore < 60;

    return {
      topicId,
      masteryScore,
      confidenceLevel: confidenceForScore(masteryScore, practiceCount, topicCount),
      needsReview,
      nextPracticeReason: buildReason(topicId, needsReview, masteryScore, practiceCount),
      recommendedMode: chooseRecommendedMode(topicId, needsReview, safeInput.confidenceTrend),
      updatedAt,
    };
  }).sort((a, b) => Number(b.needsReview) - Number(a.needsReview) || a.masteryScore - b.masteryScore || a.topicId.localeCompare(b.topicId));
}

export function getNextMasteryFocus(input: MasteryGraphInput | null | undefined): MasterySignal {
  return buildMasteryGraph(input)[0];
}

function normalizeUpdatedAt(value: number | null | undefined): number {
  return Number.isFinite(value) && Number(value) > 0 ? Math.floor(Number(value)) : 0;
}

function normalizeTopicCounts(topicCounts: Record<string, number> | undefined): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const [rawTopic, rawCount] of Object.entries(topicCounts ?? {})) {
    const topic = cleanTopicId(rawTopic);
    if (!topic) continue;
    normalized[topic] = (normalized[topic] ?? 0) + Math.max(0, Math.floor(rawCount));
  }
  return normalized;
}

function collectTopics(...values: Array<string | null | undefined>): string[] {
  return uniqueTopics(values.map(cleanTopicId));
}

function uniqueTopics(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function cleanTopicId(value: string | null | undefined): string {
  const cleaned = String(value ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "")
    .replace(/\b\d{6,}\b/g, "")
    .replace(/[^\p{L}\p{N}\s._:-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .slice(0, MAX_TOPIC_LENGTH);

  return cleaned
    .replace(/\s+/g, "-")
    .replace(/_+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function scoreTopic({
  practiceCount,
  topicCount,
  reviewWeight,
  strengthWeight,
  confidenceTrend,
}: {
  practiceCount: number;
  topicCount: number;
  reviewWeight: number;
  strengthWeight: number;
  confidenceTrend: ConfidenceTrend | undefined;
}): number {
  let score = 35;
  score += Math.min(30, practiceCount * 5);
  score += Math.min(20, topicCount * 4);
  score += strengthWeight * 20;
  score -= reviewWeight * 25;

  if (confidenceTrend === "improving") score += 10;
  if (confidenceTrend === "steady") score += 4;
  if (confidenceTrend === "needs-review") score -= 12;
  if (confidenceTrend === "not-enough-data") score -= 5;

  return clamp(Math.round(score), 0, 100);
}

function confidenceForScore(score: number, practiceCount: number, topicCount: number): MasteryConfidenceLevel {
  if (practiceCount === 0 && topicCount === 0) return "not-enough-data";
  if (score >= 80) return "high";
  if (score >= 55) return "medium";
  return "low";
}

function buildReason(topicId: string, needsReview: boolean, masteryScore: number, practiceCount: number): string {
  if (needsReview) {
    return `${topicId} needs review because the safe summary marks it as weak or below mastery.`;
  }
  if (practiceCount === 0) {
    return `${topicId} is ready for a starter practice because there is not enough local summary data yet.`;
  }
  return `${topicId} is improving; keep practicing to raise mastery above ${masteryScore}%.`;
}

function chooseRecommendedMode(
  topicId: string,
  needsReview: boolean,
  confidenceTrend: ConfidenceTrend | undefined,
): TodayLessonMode {
  if (LOGIC_HINTS.some((hint) => topicId.includes(hint))) return "logic";
  if (SPEAKING_HINTS.some((hint) => topicId.includes(hint))) return "speak";
  if (needsReview || confidenceTrend === "needs-review" || GRAMMAR_HINTS.some((hint) => topicId.includes(hint))) {
    return "grammar";
  }
  return "journey";
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
