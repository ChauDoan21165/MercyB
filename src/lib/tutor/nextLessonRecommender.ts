// src/lib/tutor/nextLessonRecommender.ts
//
// LADDER STEP 14 FULL — Ranked next-lesson recommender.
//
// RULES ARCHITECTURE
// ==================
// Rules are evaluated in priority order (lowest number = highest priority).
// Every rule whose predicate fires is collected into a ranked list; the first
// entry is the strongest recommendation. Rules are never deduplicated by skill —
// each rule tests a distinct condition so overlap is impossible.
//
// COLD-START ABSTAIN
// ==================
// A profile with fewer than COLD_START_THRESHOLD data points (sessions +
// total interference observations) does not have enough signal to make a
// specific recommendation. In that case recommendNextLessons() returns a
// single-entry list with ruleFired: "cold-start:abstain". The caller should
// surface the default study path (e.g. the first Journey lesson), not junk.
//
// ENGINE WIRING (deferred to A1 — see learnerProfileBuilder.ts WIRING SPEC)
// =========================================================================
// A1 calls recommendNextLessons() from the session bootstrap path after
// syncProfileFromServer() loads the profile. This module is PURE: no side
// effects, no localStorage, no engine imports.

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
  // Which rule produced this result. Used in tests to verify dispatch.
  ruleFired: string;
};

// ---------------------------------------------------------------------------
// Cold-start threshold
// ---------------------------------------------------------------------------
export const COLD_START_THRESHOLD = 5;

/**
 * Total data points in a profile: sessions + sum of all interference
 * observations. Topic mastery entries are not counted here because they are
 * populated only by engine wiring (not directly from conversation events).
 */
export function countDataPoints(profile: LearnerHistoryProfile): number {
  const interferenceTotal = profile.interferencePatterns.reduce(
    (sum, p) => sum + p.observedCount,
    0,
  );
  return profile.sessionCount + interferenceTotal;
}

// ---------------------------------------------------------------------------
// Rule helpers
// ---------------------------------------------------------------------------
type RecommendationRule = {
  priority: number;
  label: string;
  predicate: (profile: LearnerHistoryProfile) => boolean;
  build: (profile: LearnerHistoryProfile) => Omit<NextLessonRecommendation, "ruleFired">;
};

// Minimum observed-count before an interference rule fires.
const INTERFERENCE_FIRE_THRESHOLD = 2;

// ---------------------------------------------------------------------------
// Rule registry — ordered by priority (lower = higher priority)
// ---------------------------------------------------------------------------
const RULES: RecommendationRule[] = [
  // ------------------------------------------------------------------
  // Rule 1: Vietnamese article-omission interference (priority 10)
  // ------------------------------------------------------------------
  // WHY FIRST: "missing-article" is the #1 error tag for VN learners across
  // eval-010..042. Vietnamese has no determiner articles; English requires them
  // on almost every noun phrase. Two observations confirm a pattern, not a slip.
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
  // Rule 2: Preposition-calque interference (priority 15)
  // ------------------------------------------------------------------
  // WHY: Vietnamese spatial/temporal prepositions translate differently.
  // "Vào buổi sáng" → "at the morning" (should be "in the morning"). Ranked
  // before tense-omission because preposition errors are highly visible in
  // spoken interaction — MercyBlade's core use-case.
  {
    priority: 15,
    label: "viet-interference:preposition-calque",
    predicate: (profile) =>
      countInterference(profile, "preposition-calque") >= INTERFERENCE_FIRE_THRESHOLD,
    build: (profile) => {
      const count = countInterference(profile, "preposition-calque");
      return {
        lessonTitle: "Fix prepositions: in/on/at for time and place",
        targetSkill: "preposition-calque",
        reason: `Mercy saw ${count} preposition mistakes where you used a Vietnamese pattern (e.g. "at the morning" instead of "in the morning"). This lesson drills the correct English prepositions for time and place.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 3: Tense-omission interference (priority 20)
  // ------------------------------------------------------------------
  // WHY: Vietnamese marks time adverbially ("hôm qua", "đã"), not by verb
  // inflection. Learners frequently omit past/present markers on the verb.
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
  // Rule 4: Subject-verb agreement interference (priority 25)
  // ------------------------------------------------------------------
  // WHY: Vietnamese verbs do not conjugate for person or number. Learners
  // produce "she go", "he have". High-visibility error in IELTS/TOEIC writing
  // and conversation assessments.
  {
    priority: 25,
    label: "viet-interference:subj-verb-agreement",
    predicate: (profile) =>
      countInterference(profile, "subj-verb-agreement") >= INTERFERENCE_FIRE_THRESHOLD,
    build: (profile) => {
      const count = countInterference(profile, "subj-verb-agreement");
      return {
        lessonTitle: "Subject-verb agreement: match the verb to who does it",
        targetSkill: "subj-verb-agreement",
        reason: `Mercy noticed ${count} times the verb didn't match its subject (e.g. "she go" instead of "she goes"). Vietnamese verbs don't change form — English ones do. This lesson builds the reflex.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 5: Word-order interference (priority 35)
  // ------------------------------------------------------------------
  // WHY: Vietnamese nominal modifiers follow the head noun ("áo đỏ" = shirt
  // red), so learners produce reversed adjective order in English. Common in
  // writing tasks and less frequent than the above, hence lower priority.
  {
    priority: 35,
    label: "viet-interference:word-order",
    predicate: (profile) =>
      countInterference(profile, "word-order") >= INTERFERENCE_FIRE_THRESHOLD,
    build: (profile) => {
      const count = countInterference(profile, "word-order");
      return {
        lessonTitle: "Word order: adjectives go before nouns in English",
        targetSkill: "word-order",
        reason: `Mercy spotted ${count} word-order mistakes — often adjectives placed after the noun (Vietnamese style). English puts adjectives before the noun. This lesson locks in the pattern.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 6: Zero-copula interference (priority 40)
  // ------------------------------------------------------------------
  // WHY: The Vietnamese copula "là" is frequently omitted in speech. Learners
  // carry this into English: "She tired" instead of "She is tired". High IELTS
  // Writing score impact.
  {
    priority: 40,
    label: "viet-interference:zero-copula",
    predicate: (profile) =>
      countInterference(profile, "zero-copula") >= INTERFERENCE_FIRE_THRESHOLD,
    build: (profile) => {
      const count = countInterference(profile, "zero-copula");
      return {
        lessonTitle: "Never drop 'is/are/was': the copula in English",
        targetSkill: "zero-copula",
        reason: `Mercy saw ${count} sentences missing the verb "to be" (e.g. "She tired" instead of "She is tired"). In Vietnamese you can drop "là" — in English the copula is mandatory.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 7: Double-negation interference (priority 45)
  // ------------------------------------------------------------------
  // WHY: Vietnamese double negation ("không … không") is grammatically correct
  // in Vietnamese but produces non-standard English. When this tag fires it
  // almost always reflects structural confusion rather than a slip.
  {
    priority: 45,
    label: "viet-interference:double-negation",
    predicate: (profile) =>
      countInterference(profile, "double-negation") >= INTERFERENCE_FIRE_THRESHOLD,
    build: (profile) => {
      const count = countInterference(profile, "double-negation");
      return {
        lessonTitle: "One negative at a time: how negation works in English",
        targetSkill: "double-negation",
        reason: `Mercy noticed ${count} double-negation patterns (e.g. "I don't know nothing"). Vietnamese uses double negation — English uses only one negative element per clause.`,
        suggestedMode: "grammar",
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 8: Preferred-mode promotion (priority 50)
  // ------------------------------------------------------------------
  // WHY: If the learner has an established preferred mode (inferred from
  // learningEvents) and enough sessions to confirm it, recommend a session in
  // that mode. Reinforces positive habit formation and respects how the learner
  // studies best.
  {
    priority: 50,
    label: "preference:mode-promotion",
    predicate: (profile) =>
      profile.preferredMode !== null && profile.sessionCount >= 5,
    build: (profile) => {
      const mode = profile.preferredMode!;
      const modeLabels: Record<string, string> = {
        grammar: "Grammar practice",
        speak: "Speaking practice",
        journey: "Journey lesson",
        logic: "Logic & reasoning",
      };
      const label = modeLabels[mode] ?? mode;
      return {
        lessonTitle: `${label} — your strongest learning mode`,
        targetSkill: `preferred-mode-${mode}`,
        reason: `Mercy noticed you study best in ${label} mode. Continuing in your preferred mode keeps practice consistent and effective.`,
        suggestedMode: mode as TodayLessonMode,
      };
    },
  },

  // ------------------------------------------------------------------
  // Rule 9: Lowest-mastery topic review (priority 55)
  // ------------------------------------------------------------------
  // WHY: When no interference patterns fire, the weakest topic is the most
  // actionable recommendation — it corresponds to a lesson the learner has
  // already encountered and needs to revisit.
  {
    priority: 55,
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
];

// Sort once at module load — lowest priority number = highest precedence.
RULES.sort((a, b) => a.priority - b.priority);

// Cold-start default. Returned as the single entry when data points < threshold.
const COLD_START_RECOMMENDATION: NextLessonRecommendation = {
  lessonTitle: "Start with one clear daily sentence",
  targetSkill: "starter-sentence",
  reason: "Mercy doesn't have enough history yet. Start with a short sentence about your day.",
  suggestedMode: "grammar",
  ruleFired: "cold-start:abstain",
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Return a ranked list of lesson recommendations from the learner's profile.
 *
 * - If countDataPoints(profile) < COLD_START_THRESHOLD, returns
 *   [COLD_START_RECOMMENDATION] (ruleFired: "cold-start:abstain").
 *   The caller should route the learner to the default path, not junk.
 *
 * - Otherwise, collects every matching rule in priority order (lower number =
 *   more urgent). Falls back to a starter entry when no rules fire.
 *
 * - Deterministic: same profile → same list in the same order.
 */
export function recommendNextLessons(
  profile: LearnerHistoryProfile,
): NextLessonRecommendation[] {
  if (countDataPoints(profile) < COLD_START_THRESHOLD) {
    return [COLD_START_RECOMMENDATION];
  }

  const results: NextLessonRecommendation[] = [];
  for (const rule of RULES) {
    if (rule.predicate(profile)) {
      results.push({ ...rule.build(profile), ruleFired: rule.label });
    }
  }

  if (results.length === 0) {
    results.push({
      lessonTitle: "Start with one clear daily sentence",
      targetSkill: "starter-sentence",
      reason: "Mercy doesn't have enough history yet. Start with a short sentence about your day.",
      suggestedMode: "grammar",
      ruleFired: "fallback:starter",
    });
  }

  return results;
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
