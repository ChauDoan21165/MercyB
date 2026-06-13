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
  recommendation: NextLessonRecommendation | null;
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
  const recommendation = recommendNextLessons(updatedProfile)
    .find((rec) => rec.ruleFired !== "cold-start:abstain") ?? null;

  return {
    interactions: built.interactions,
    topicMastery,
    recommendation,
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
