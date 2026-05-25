import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import {
  getNextMasteryFocus,
  type MasterySignal,
} from "@/lib/tutor/masteryGraph";

export type TodayLessonMode = "journey" | "grammar" | "speak" | "logic";

export type TodayLessonPlan = {
  lessonTitle: string;
  targetSkill: string;
  reason: string;
  steps: string[];
  estimatedMinutes: number;
  suggestedMode: TodayLessonMode;
  nextFocus: string;
};

export type TodayLessonMemorySummary = Pick<
  MemorySummary,
  | "totalCorrections"
  | "practicedCount"
  | "strongestTopic"
  | "topicNeedingReview"
  | "lastPracticedTopic"
  | "suggestedNextFocus"
  | "nextRecommendedFocus"
  | "needsReview"
  | "strengths"
  | "commonMistakePatterns"
  | "confidenceTrend"
  | "topicCounts"
  | "updatedAt"
> | null | undefined;

const BEGINNER_FOCUS = "starter sentence";
const BEGINNER_PLAN: TodayLessonPlan = {
  lessonTitle: "Start with one clear daily sentence",
  targetSkill: BEGINNER_FOCUS,
  reason: "No local practice summary is available yet, so Mercy starts with a short beginner lesson.",
  steps: [
    "Write one simple sentence about your day.",
    "Fix one sentence with Mercy.",
    "Read the corrected sentence.",
    "Notice one English pattern.",
    "Save the next focus.",
  ],
  estimatedMinutes: 6,
  suggestedMode: "grammar",
  nextFocus: BEGINNER_FOCUS,
};

const GRAMMAR_REVIEW_HINTS = [
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

export function planTodayLesson(memory: TodayLessonMemorySummary): TodayLessonPlan {
  if (!hasMemorySignal(memory)) return { ...BEGINNER_PLAN, steps: [...BEGINNER_PLAN.steps] };

  const strongestTopic = firstCleanTopic(memory?.strongestTopic, memory?.strengths?.[0]);
  const weakPattern = firstCleanTopic(
    memory?.commonMistakePatterns?.find((pattern) => cleanTopic(pattern) !== strongestTopic),
    memory?.commonMistakePatterns?.[0],
  );
  const masteryFocus = getNextMasteryFocus({
    practiceCount: memory?.practicedCount ?? 0,
    strongestTopic,
    topicNeedingReview: memory?.topicNeedingReview,
    weakPattern,
    suggestedNextFocus: memory?.suggestedNextFocus || memory?.nextRecommendedFocus,
    correctionCategories: memory?.needsReview,
    topicTags: memory?.commonMistakePatterns,
    topicCounts: memory?.topicCounts,
    confidenceTrend: memory?.confidenceTrend,
    updatedAt: memory?.updatedAt,
  });
  const masteryTopic = displayTopic(masteryFocus.topicId);
  const reviewTopic = firstCleanTopic(
    masteryTopic,
    memory?.topicNeedingReview,
    memory?.needsReview?.[0],
    memory?.nextRecommendedFocus,
    memory?.suggestedNextFocus,
    weakPattern,
  );
  const nextFocus = reviewTopic || strongestTopic || BEGINNER_FOCUS;
  const suggestedMode = masteryFocus.recommendedMode || chooseSuggestedMode(nextFocus, memory?.confidenceTrend);
  const lessonTitle = buildLessonTitle(nextFocus, strongestTopic);

  return {
    lessonTitle,
    targetSkill: nextFocus,
    reason: buildReason(nextFocus, strongestTopic, memory?.practicedCount ?? 0, masteryFocus),
    steps: buildSteps(suggestedMode),
    estimatedMinutes: suggestedMode === "journey" ? 8 : 7,
    suggestedMode,
    nextFocus,
  };
}

export const getTodayLessonPlan = planTodayLesson;

function hasMemorySignal(memory: TodayLessonMemorySummary): memory is NonNullable<TodayLessonMemorySummary> {
  if (!memory) return false;
  return Boolean(
    memory.totalCorrections > 0 ||
    memory.practicedCount > 0 ||
    firstCleanTopic(
      memory.topicNeedingReview,
      memory.strongestTopic,
      memory.suggestedNextFocus,
      memory.nextRecommendedFocus,
      memory.needsReview?.[0],
      memory.strengths?.[0],
      memory.commonMistakePatterns?.[0],
      ...Object.keys(memory.topicCounts ?? {}),
    ),
  );
}

function firstCleanTopic(...values: Array<string | null | undefined>): string {
  for (const value of values) {
    const cleaned = cleanTopic(value);
    if (cleaned) return cleaned;
  }
  return "";
}

function cleanTopic(value: string | null | undefined): string {
  const normalized = String(value ?? "")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "")
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, "")
    .replace(/\b\d{6,}\b/g, "")
    .replace(/[^\p{L}\p{N}\s._:-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return normalized.slice(0, 48);
}

function displayTopic(topicId: string): string {
  return cleanTopic(topicId.replace(/-/g, " "));
}

function chooseSuggestedMode(topic: string, confidenceTrend: MemorySummary["confidenceTrend"] | undefined): TodayLessonMode {
  const normalized = topic.toLowerCase();
  if (LOGIC_HINTS.some((hint) => normalized.includes(hint))) return "logic";
  if (SPEAKING_HINTS.some((hint) => normalized.includes(hint))) return "speak";
  if (confidenceTrend === "needs-review") return "grammar";
  if (GRAMMAR_REVIEW_HINTS.some((hint) => normalized.includes(hint))) return "grammar";
  return "journey";
}

function buildLessonTitle(nextFocus: string, strongestTopic: string): string {
  if (nextFocus.toLowerCase().includes("past")) {
    return strongestTopic
      ? `Practice ${nextFocus} in ${strongestTopic}`
      : `Practice ${nextFocus} in daily life`;
  }

  if (strongestTopic && strongestTopic !== nextFocus) {
    return `Practice ${nextFocus} using ${strongestTopic}`;
  }

  return `Practice ${nextFocus} today`;
}

function buildReason(
  nextFocus: string,
  strongestTopic: string,
  practicedCount: number,
  masteryFocus: MasterySignal,
): string {
  const practiceNote = practicedCount > 0
    ? `You have ${practicedCount} practiced item${practicedCount === 1 ? "" : "s"} in local summary memory.`
    : "Mercy found this from local summary memory.";
  const reviewNote = masteryFocus.needsReview
    ? "needs review"
    : "is improving";
  const masteryNote = ` Mastery graph marks ${nextFocus} at ${masteryFocus.masteryScore}% mastery with ${masteryFocus.confidenceLevel} confidence, so this focus ${reviewNote}.`;
  const strengthNote = strongestTopic && strongestTopic !== nextFocus
    ? ` Your strongest topic is ${strongestTopic}, so Mercy can connect the review to something familiar.`
    : "";
  return `${practiceNote}${masteryNote}${strengthNote}`;
}

function buildSteps(mode: TodayLessonMode): string[] {
  const modeStep = mode === "journey"
    ? "Answer one short question."
    : mode === "logic"
      ? "Learn one logic rule."
      : mode === "speak"
        ? "Say one clean sentence aloud."
        : "Fix one sentence.";

  return [
    modeStep,
    "Review Mercy's correction or explanation.",
    "Retry the mistake once.",
    "Apply one pattern in a new example.",
    "Save the next focus.",
  ];
}
