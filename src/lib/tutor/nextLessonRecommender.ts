// src/lib/tutor/nextLessonRecommender.ts
//
// Recommendation function stub — Step 14 scaffold.
//
// RULES ARCHITECTURE
// ==================
// Rules are evaluated in priority order. The first rule whose predicate fires
// returns its recommendation. A single fallback at the end ensures we always
// emit something.
//
// Adding a new rule: append an object to RULES with a priority number below the
// current lowest, a label (shown in ruleFired for debugging), a predicate, and
// a builder.
//
// ENGINE WIRING (deferred to A1)
// ==============================
// This module is PURE — it reads from LearnerHistoryProfile and emits a
// NextLessonRecommendation. No side effects, no localStorage, no engine imports.
// A1 will call recommendNextLesson() from the session bootstrapping path after
// loading the profile.

import type { LearnerHistoryProfile } from "@/lib/tutor/learnerHistoryProfile";
import type { TodayLessonMode } from "@/lib/tutor/todayLessonPlanner";

// ---------------------------------------------------------------------------
// Output type
// ---------------------------------------------------------------------------
export type NextLessonRecommendation = {
  lessonTitle: string;
  targetSkill: string;
  reason: string;
  suggestedMode: TodayLessonMode;
  // Which rule produced this result. Shown in MR architecture notes and used
  // in tests to verify rule dispatch without inspecting internals.
  ruleFired: string;
};

// ---------------------------------------------------------------------------
// Rule helpers
// ---------------------------------------------------------------------------
type RecommendationRule = {
  priority: number;
  label: string;
  predicate: (profile: LearnerHistoryProfile) => boolean;
  build: (profile: LearnerHistoryProfile) => Omit<NextLessonRecommendation, "ruleFired">;
};

// Minimum observed-count threshold before an interference pattern fires a rule.
const INTERFERENCE_FIRE_THRESHOLD = 2;

// ---------------------------------------------------------------------------
// Rule registry — ordered by priority (lower = higher priority)
// ---------------------------------------------------------------------------
const RULES: RecommendationRule[] = [
  // ------------------------------------------------------------------
  // Rule 1: Vietnamese article-omission interference
  // ------------------------------------------------------------------
  // WHY THIS RULE IS FIRST:
  // "missing-article" is the single highest-frequency interference pattern for
  // Vietnamese learners of English. Vietnamese has no determiner articles
  // (a/an/the). Learners frequently omit them even after years of study.
  // Corpus evidence: this is the #1 error tag produced by the correction engine
  // in early eval sessions (eval-010 to eval-042). Prioritising it over generic
  // mastery signals means the very first real recommendation targets the deepest
  // structural gap.
  //
  // THRESHOLD = 2: one sighting could be a slip; two confirms a pattern.
  {
    priority: 10,
    label: "viet-interference:missing-article",
    predicate: (profile) =>
      countInterference(profile, "missing-article") >= INTERFERENCE_FIRE_THRESHOLD,
    build: (profile) => {
      const count = countInterference(profile, "missing-article");
      return {
        lessonTitle: "Master English articles: a, an, and the",
        targetSkill: "missing-article",
        reason: `Mercy noticed ${count} times you skipped an article (a, an, the). Vietnamese doesn't use them, but English always needs one. This lesson drills the pattern until it sticks.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 2: Tense-omission interference
  // ------------------------------------------------------------------
  // Vietnamese marks time with adverbs ("hôm qua", "đã"), not verb inflection.
  // Learners carry this habit into English, omitting past/present markers.
  {
    priority: 20,
    label: "viet-interference:tense-omission",
    predicate: (profile) =>
      countInterference(profile, "tense-omission") >= INTERFERENCE_FIRE_THRESHOLD,
    build: (profile) => {
      const count = countInterference(profile, "tense-omission");
      return {
        lessonTitle: "Fix tense: show time inside the verb",
        targetSkill: "tense-omission",
        reason: `Mercy saw ${count} sentences where the tense wasn't marked on the verb. In Vietnamese that is normal — in English the verb itself must show the time.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 3: Lowest-mastery topic review
  // ------------------------------------------------------------------
  // Generic fallback for any topic that has dropped below 50% mastery.
  {
    priority: 30,
    label: "mastery:lowest-topic-review",
    predicate: (profile) => getLowestMasteryTopic(profile) !== null,
    build: (profile) => {
      const entry = getLowestMasteryTopic(profile)!;
      return {
        lessonTitle: `Review ${displayTopic(entry.topic)}`,
        targetSkill: entry.topic,
        reason: `Mastery for "${displayTopic(entry.topic)}" is at ${entry.score}%. Practicing it now will prevent the gap from growing.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 4: Starter — no signal yet
  // ------------------------------------------------------------------
  {
    priority: 99,
    label: "fallback:starter",
    predicate: () => true,
    build: () => ({
      lessonTitle: "Start with one clear daily sentence",
      targetSkill: "starter-sentence",
      reason: "Mercy doesn't have enough history yet. Start with a short sentence about your day.",
      suggestedMode: "grammar",
    }),
  },
];

// Sort once at module load, lowest priority number first.
RULES.sort((a, b) => a.priority - b.priority);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function recommendNextLesson(
  profile: LearnerHistoryProfile,
): NextLessonRecommendation {
  for (const rule of RULES) {
    if (rule.predicate(profile)) {
      return { ...rule.build(profile), ruleFired: rule.label };
    }
  }
  // Should never reach here (fallback rule always fires).
  return {
    lessonTitle: "Start with one clear daily sentence",
    targetSkill: "starter-sentence",
    reason: "No rules matched. Mercy starts from a safe default.",
    suggestedMode: "grammar",
    ruleFired: "fallback:default",
  };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------
function countInterference(
  profile: LearnerHistoryProfile,
  tag: string,
): number {
  return (
    profile.interferencePatterns.find((p) => p.tag === tag)?.observedCount ?? 0
  );
}

type MasteryEntry = { topic: string; score: number };

function getLowestMasteryTopic(profile: LearnerHistoryProfile): MasteryEntry | null {
  const entries = Object.entries(profile.topicMastery);
  if (entries.length === 0) return null;
  const below = entries
    .filter(([, score]) => score < 50)
    .sort(([, a], [, b]) => a - b);
  if (below.length === 0) return null;
  const [topic, score] = below[0];
  return { topic, score };
}

function displayTopic(topicId: string): string {
  return topicId.replace(/-/g, " ");
}
