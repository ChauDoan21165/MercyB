import { getAiConversationScenario } from "@/lib/ai-conversation/scenarios";
import type { AiConversationCorrection } from "@/lib/ai-conversation/session";
import type { TutorProduct } from "@/lib/ai-tutor/learningMemory";
import { estimateSkillMastery, isConfidenceLimited } from "@/lib/mastery/bkt";
import { buildAdaptiveMasteryPlan } from "@/lib/mastery/selector";
import { buildDefaultMasteryCatalog, skillIdFor } from "@/lib/mastery/skillModel";
import type {
  LearnerInteraction,
  MasteryCatalog,
  MasterySkillDimension,
  SkillMasteryState,
} from "@/lib/mastery/types";
import type { ConversationPronunciationPromptSummary } from "@/lib/pronunciation/conversationPronunciation";
import type { VietnamesePronunciationGradeResult } from "@/lib/pronunciation/vietnamesePronunciationGrading";
import {
  createEmptyLearnerHistoryProfile,
  loadLearnerHistoryProfile,
  mergeTopicMastery,
  saveLearnerHistoryProfile,
} from "@/lib/tutor/learnerHistoryProfile";
import { recommendNextLessons, type NextLessonRecommendation } from "@/lib/tutor/nextLessonRecommender";
import {
  recommendWithIntelligence,
  type IntelligentRecommendation,
  type LearnerGoal,
  type RecentPracticeEntry,
} from "@/lib/tutor/lessonRecommendationIntelligence";
import type { TodayLessonMode } from "@/lib/tutor/todayLessonPlanner";

export type ConversationToneEvidence = {
  provider: "azure";
  locale: "vi-VN";
  targetText: string;
  learnerToneDisplayAllowed: false;
  syllables: Array<{
    syllable: string;
    toneId: string;
    reason: string;
    confidence: number;
  }>;
};

export type ConversationMasteryEvidence = {
  interactions: LearnerInteraction[];
  topicMastery: Record<string, number>;
  /** Base recommendation from the rule engine (always produced — fallback). */
  recommendation: NextLessonRecommendation | null;
  /** Intelligent recommendation with CEFR scaffolding, goal alignment, recency
   *  diversity, challenge gradient, and teacher-quality reasoning. Only produced
   *  when the learner profile has enough signal (interference patterns + session
   *  count above cold-start threshold). Null when intelligence inputs are
   *  insufficient — consumers should fall back to `recommendation`. */
  intelligentRecommendation: IntelligentRecommendation | null;
  abstainedReason: "ambiguous_target" | "sparse_mastery_evidence" | null;
};

export type ConversationTurnEvidenceInput = {
  product: TutorProduct;
  targetLanguage: string;
  scenarioId: string;
  provider: "openai" | "local-fallback";
  correction?: AiConversationCorrection | null;
  pronunciation?: ConversationPronunciationPromptSummary | null;
  now?: number;
  catalog?: MasteryCatalog;
  /** Known CEFR level of the learner (optional — from profile DB or placement).
   *  When provided, enables CEFR-aware strategy selection and challenge
   *  calibration in the intelligent recommendation path. */
  cefrLevel?: string | null;
  /** Stated learner goals (optional — from profile settings).
   *  When provided, enables goal-alignment checking in the intelligent
   *  recommendation path. */
  goals?: LearnerGoal[] | null;
  /** Recently practiced topics with timestamps (optional).
   *  When provided, enables recency-aware diversity and topic variety
   *  scoring. If omitted, derived from stored interactions. */
  recentPractice?: RecentPracticeEntry[] | null;
  /** Average days between practice sessions (optional).
   *  When provided, enables session cadence awareness and review-vs-stretch
   *  strategy selection. If omitted, estimated from stored interactions. */
  avgDaysBetweenSessions?: number | null;
};

const STORAGE_PREFIX = "mercy.conversationMasteryInteractions.v1";
const MAX_STORED_INTERACTIONS = 120;

const CATEGORY_THEME_ALIASES: Record<string, string> = {
  money: "banking",
};

export function redactVietnameseToneEvidence(
  result: VietnamesePronunciationGradeResult,
): ConversationToneEvidence {
  return {
    provider: "azure",
    locale: "vi-VN",
    targetText: result.targetText,
    learnerToneDisplayAllowed: false,
    syllables: result.toneGrades.map((grade) => ({
      syllable: grade.syllable.syllable,
      toneId: grade.syllable.toneId,
      reason: grade.reason,
      confidence: clamp01(grade.confidence),
    })),
  };
}

export function buildConversationTurnMasteryInteractions(
  input: ConversationTurnEvidenceInput,
): { interactions: LearnerInteraction[]; abstainedReason: ConversationMasteryEvidence["abstainedReason"] } {
  if (input.provider !== "openai") {
    return { interactions: [], abstainedReason: "ambiguous_target" };
  }

  const catalog = input.catalog ?? buildDefaultMasteryCatalog();
  const themeId = resolveCatalogThemeId(input.scenarioId, catalog);
  if (!themeId) {
    return { interactions: [], abstainedReason: "ambiguous_target" };
  }

  const now = input.now ?? Date.now();
  const interactions: LearnerInteraction[] = [];

  if (input.correction) {
    interactions.push(toInteraction(themeId, "grammar", "incorrect", now));
  } else {
    interactions.push(toInteraction(themeId, "grammar", "correct", now));
  }

  const pronunciation = input.pronunciation ?? null;
  if (pronunciation && !pronunciation.shouldAskRetry && typeof pronunciation.overallScore === "number") {
    const hasSpecificFocus = pronunciation.focus.length > 0;
    const outcome = hasSpecificFocus || pronunciation.overallScore < 85 ? "incorrect" : "correct";
    interactions.push(toInteraction(themeId, "speaking", outcome, now));
  }

  return { interactions, abstainedReason: interactions.length > 0 ? null : "ambiguous_target" };
}

// ─── Intelligence Layer Helpers ────────────────────────────────────────────

/**
 * Derive recent practice entries from stored learner interactions.
 *
 * Groups interactions by day → topic, producing entries suitable for
 * the intelligence layer's recency-aware diversity checks.
 *
 * Pure function — no side effects, no I/O.
 */
function deriveRecentPracticeFromInteractions(
  interactions: readonly LearnerInteraction[],
): RecentPracticeEntry[] {
  // Build entries keyed by (day × skill theme) to deduplicate same-topic turns
  // within the same session day.
  const seen = new Map<string, RecentPracticeEntry>();
  const sorted = [...interactions].sort(
    (a, b) => toTime(b.occurredAt) - toTime(a.occurredAt),
  );

  for (const interaction of sorted) {
    // Extract topic from skillId (e.g. "food:grammar" → "food")
    const topic = (interaction.skillId ?? interaction.itemId ?? "")
      .split(":")[0]
      ?.trim();
    if (!topic) continue;

    const dayKey = `${topic}:${Math.floor(toTime(interaction.occurredAt) / (24 * 60 * 60 * 1000))}`;
    if (seen.has(dayKey)) continue;

    seen.set(dayKey, {
      topic,
      practicedAt: toTime(interaction.occurredAt),
      mode: interaction.skillId?.includes("speaking") ? "speak" as TodayLessonMode
        : "grammar" as TodayLessonMode,
    });
  }

  // Return most recent first (already sorted by occurredAt desc)
  return [...seen.values()].sort((a, b) => b.practicedAt - a.practicedAt);
}

/**
 * Estimate average days between practice sessions from stored interactions.
 *
 * Groups interactions by calendar day, then computes the average gap
 * between consecutive practice days. Returns null when fewer than 2
 * distinct practice days exist.
 */
function deriveAvgDaysBetweenSessions(
  interactions: readonly LearnerInteraction[],
): number | null {
  if (interactions.length < 2) return null;

  const days = new Set(
    interactions.map((i) =>
      Math.floor(toTime(i.occurredAt) / (24 * 60 * 60 * 1000)),
    ),
  );
  const sorted = [...days].sort((a, b) => a - b);
  if (sorted.length < 2) return null;

  let totalGap = 0;
  for (let i = 1; i < sorted.length; i++) {
    totalGap += sorted[i] - sorted[i - 1];
  }
  return totalGap / (sorted.length - 1);
}

/**
 * Decide whether the learner profile has enough signal to make intelligent
 * recommendations meaningful (beyond cold-start fallback).
 *
 * Requires at least one of: interference patterns, meaningful session count,
 * or external intelligence inputs (CEFR level, goals).
 */
function hasIntelligenceSignal(
  input: ConversationTurnEvidenceInput,
  profile: ReturnType<typeof createEmptyLearnerHistoryProfile>,
): boolean {
  return (
    profile.interferencePatterns.length > 0 ||
    profile.sessionCount >= 5 ||
    (typeof input.cefrLevel === "string" && input.cefrLevel.trim().length > 0) ||
    (Array.isArray(input.goals) && input.goals.length > 0)
  );
}

export function recordConversationTurnMasteryEvidence(
  input: ConversationTurnEvidenceInput,
): ConversationMasteryEvidence {
  const catalog = input.catalog ?? buildDefaultMasteryCatalog();
  const built = buildConversationTurnMasteryInteractions({ ...input, catalog });
  if (built.interactions.length === 0) {
    return {
      interactions: [],
      topicMastery: {},
      recommendation: null,
      intelligentRecommendation: null,
      abstainedReason: built.abstainedReason,
    };
  }

  const stored = loadStoredInteractions(input.product, input.targetLanguage);
  const interactions = [...stored, ...built.interactions]
    .sort((a, b) => toTime(a.occurredAt) - toTime(b.occurredAt))
    .slice(-MAX_STORED_INTERACTIONS);
  saveStoredInteractions(input.product, input.targetLanguage, interactions);

  const states = estimateSkillMastery(catalog, interactions);
  const topicMastery = buildConfidentTopicMastery(catalog, states);
  const profile =
    loadLearnerHistoryProfile(input.product, input.targetLanguage) ??
    createEmptyLearnerHistoryProfile(input.product, input.targetLanguage, input.now ?? Date.now());
  const updatedProfile = saveLearnerHistoryProfile(
    mergeTopicMastery(profile, topicMastery),
    input.now ?? Date.now(),
  );

  // ── Base recommendation (always computed — fallback) ──
  const recommendation = recommendNextLessons(updatedProfile)
    .find((rec) => rec.ruleFired !== "cold-start:abstain") ?? null;

  // ── Intelligent recommendation (when enough signal exists) ──
  let intelligentRecommendation: IntelligentRecommendation | null = null;
  if (hasIntelligenceSignal(input, updatedProfile)) {
    const recentPractice =
      input.recentPractice ??
      deriveRecentPracticeFromInteractions(interactions);
    const avgDaysBetweenSessions =
      input.avgDaysBetweenSessions ??
      deriveAvgDaysBetweenSessions(interactions);

    const intelResult = recommendWithIntelligence({
      profile: updatedProfile,
      cefrLevel: normalizeCefrLevel(input.cefrLevel ?? null),
      goals: input.goals ?? [],
      recentPractice,
      avgDaysBetweenSessions,
      now: input.now,
    });
    // Prefer the top pick that matches the base recommendation's target,
    // falling back to the first intelligent recommendation.
    intelligentRecommendation =
      intelResult.find(
        (r) => r.base.targetSkill === recommendation?.targetSkill,
      ) ??
      intelResult[0] ??
      null;
  }

  return {
    interactions: built.interactions,
    topicMastery,
    recommendation,
    intelligentRecommendation,
    abstainedReason: Object.keys(topicMastery).length > 0 ? null : "sparse_mastery_evidence",
  };
}

export function buildConversationMasteryPlanFromStoredEvidence(input: {
  product: TutorProduct;
  targetLanguage: string;
  catalog?: MasteryCatalog;
  now?: number;
}) {
  const catalog = input.catalog ?? buildDefaultMasteryCatalog();
  return buildAdaptiveMasteryPlan({
    catalog,
    interactions: loadStoredInteractions(input.product, input.targetLanguage),
    now: input.now ?? Date.now(),
  });
}

function toInteraction(
  themeId: string,
  dimension: MasterySkillDimension,
  outcome: LearnerInteraction["outcome"],
  occurredAt: number,
): LearnerInteraction {
  return {
    itemId: `${themeId}-${dimension}-practice-1`,
    skillId: skillIdFor(themeId, dimension),
    outcome,
    occurredAt,
    fsrsRating: outcome === "correct" ? "good" : "again",
  };
}

function buildConfidentTopicMastery(
  catalog: MasteryCatalog,
  states: Map<string, SkillMasteryState>,
): Record<string, number> {
  const scores: Record<string, number[]> = {};
  for (const skill of catalog.skills) {
    const state = states.get(skill.id);
    if (!state || isConfidenceLimited(state)) continue;
    scores[skill.themeId] = scores[skill.themeId] ?? [];
    scores[skill.themeId].push(Math.round(state.probabilityKnown * 100));
  }

  const topicMastery: Record<string, number> = {};
  for (const [themeId, values] of Object.entries(scores)) {
    if (values.length === 0) continue;
    topicMastery[themeId] = Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }
  return topicMastery;
}

function resolveCatalogThemeId(scenarioId: string, catalog: MasteryCatalog): string | null {
  const scenario = getAiConversationScenario(scenarioId);
  const rawCategory = String(scenario.topic.category ?? "").trim();
  const themeId = CATEGORY_THEME_ALIASES[rawCategory] ?? rawCategory;
  return catalog.themes.some((theme) => theme.id === themeId) ? themeId : null;
}

function storageKey(product: TutorProduct, targetLanguage: string): string {
  return `${STORAGE_PREFIX}.${normalizeKeyPart(product)}.${normalizeKeyPart(targetLanguage)}`;
}

function loadStoredInteractions(product: TutorProduct, targetLanguage: string): LearnerInteraction[] {
  const storage = getLocalStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(storageKey(product, targetLanguage));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizeInteraction)
      .filter((interaction): interaction is LearnerInteraction => interaction !== null);
  } catch {
    return [];
  }
}

function saveStoredInteractions(
  product: TutorProduct,
  targetLanguage: string,
  interactions: readonly LearnerInteraction[],
): void {
  const storage = getLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(storageKey(product, targetLanguage), JSON.stringify(interactions));
  } catch {
    // Best effort. Recommendation state must not block the conversation turn.
  }
}

function normalizeInteraction(value: unknown): LearnerInteraction | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Partial<LearnerInteraction>;
  const itemId = String(record.itemId ?? "").trim();
  const skillId = String(record.skillId ?? "").trim();
  const outcome = record.outcome === "correct" || record.outcome === "incorrect" ? record.outcome : null;
  const occurredAt = toTime(record.occurredAt ?? Date.now());
  if (!itemId || !outcome || !Number.isFinite(occurredAt)) return null;
  return {
    itemId,
    skillId: skillId || undefined,
    outcome,
    occurredAt,
    fsrsRating: record.fsrsRating,
  };
}

function normalizeKeyPart(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

function getLocalStorage(): Storage | null {
  if (typeof window === "undefined" || typeof window.localStorage === "undefined") return null;
  return window.localStorage;
}

function toTime(value: Date | string | number): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));
}

/**
 * Normalize a raw CEFR level string into the canonical CefrLevel union.
 * Returns null for unrecognized values — the intelligence layer handles
 * null CEFR gracefully (safe middle-ground defaults).
 */
function normalizeCefrLevel(raw: string | null): "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | null {
  if (!raw || typeof raw !== "string") return null;
  const upper = raw.trim().toUpperCase();
  const VALID = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
  return VALID.has(upper) ? (upper as "A1" | "A2" | "B1" | "B2" | "C1" | "C2") : null;
}
