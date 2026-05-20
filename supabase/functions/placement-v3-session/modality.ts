import {
  CEFR_ORDER,
  MODALITY_ORDER,
  type CEFRLevel,
  type CEFRAssessment,
  type ModalityStats,
  type PlacementV3Modality,
  type PlacementV3Response,
  type PlacementV3Session,
  type PromptTask,
  type SessionMetadata,
} from "./types.ts";

export const MIN_TASKS_PER_MODALITY = 1;
export const MAX_TASKS_PER_MODALITY = 3;
export const CONFIDENCE_STOP_THRESHOLD = 0.72;
export const MAX_TOTAL_TASKS = 11;

// Temporary A25 stub. The real prompt library will live under
// src/data/placement/v3/prompts/ once that PR lands. Keep ids stable so
// persisted response rows remain debuggable.
export const PROMPTS: PromptTask[] = MODALITY_ORDER.flatMap((modality) =>
  CEFR_ORDER.flatMap((cefr) =>
    [1, 2, 3].map((n) => ({
      id: `stub_${modality}_${cefr}_${n}`,
      modality,
      cefr,
      expectedResponse: modality === "speaking" ? "audio" : "text",
      promptText: promptTextFor(modality, cefr, n),
      metadata: { source: "placement-v3-session-stub" },
    } satisfies PromptTask)),
  )
);

function promptTextFor(
  modality: PlacementV3Modality,
  cefr: CEFRLevel,
  n: number,
): string {
  const stem: Record<PlacementV3Modality, string> = {
    writing: "Write in English",
    speaking: "Speak in English",
    reading: "Read the short situation and answer in English",
    listening: "Listen to the short situation and answer in English",
    conversation: "Reply naturally in English",
  };
  const topics = [
    "about your daily routine and one small problem you solved.",
    "about studying English as a Vietnamese learner.",
    "about a work or school decision and the reason behind it.",
  ];
  return `${stem[modality]} at ${cefr}: ${topics[(n - 1) % topics.length]}`;
}

export function cefrToNumber(level: CEFRLevel): number {
  return Math.max(0, CEFR_ORDER.indexOf(level));
}

export function numberToCefr(n: number): CEFRLevel {
  const clamped = Math.min(CEFR_ORDER.length - 1, Math.max(0, Math.round(n)));
  return CEFR_ORDER[clamped];
}

export function adjustDifficulty(level: CEFRLevel, assessment?: CEFRAssessment): CEFRLevel {
  if (!assessment) return level;
  const current = cefrToNumber(level);
  const observed = cefrToNumber(assessment.overallLevel);
  if (assessment.confidence < 0.45) return numberToCefr((current + observed) / 2);
  if (observed >= current + 1 && assessment.confidence >= 0.65) {
    return numberToCefr(current + 1);
  }
  if (observed <= current - 1 && assessment.confidence >= 0.65) {
    return numberToCefr(current - 1);
  }
  return numberToCefr((current + observed) / 2);
}

export function updateStats(
  metadata: SessionMetadata,
  modality: PlacementV3Modality,
  assessment: CEFRAssessment,
): SessionMetadata {
  const stats = metadata.modalityStats ?? {};
  const prev = stats[modality] ?? {
    attempts: 0,
    levelSum: 0,
    weightedLevelSum: 0,
    confidenceSum: 0,
  };
  const level = cefrToNumber(assessment.overallLevel);
  const next: ModalityStats = {
    attempts: prev.attempts + 1,
    levelSum: prev.levelSum + level,
    weightedLevelSum: prev.weightedLevelSum + level * assessment.confidence,
    confidenceSum: prev.confidenceSum + assessment.confidence,
    lastLevel: assessment.overallLevel,
  };
  return {
    ...metadata,
    modalityStats: { ...stats, [modality]: next },
  };
}

export function modalityComplete(stats?: ModalityStats): boolean {
  if (!stats) return false;
  if (stats.attempts >= MAX_TASKS_PER_MODALITY) return true;
  return (
    stats.attempts >= MIN_TASKS_PER_MODALITY &&
    stats.confidenceSum / stats.attempts >= CONFIDENCE_STOP_THRESHOLD
  );
}

export function selectNextModality(
  metadata: SessionMetadata,
): PlacementV3Modality | null {
  const stats = metadata.modalityStats ?? {};
  return MODALITY_ORDER.find((m) => !modalityComplete(stats[m])) ?? null;
}

export function selectPrompt(args: {
  modality: PlacementV3Modality;
  targetLevel: CEFRLevel;
  responses: PlacementV3Response[];
}): PromptTask {
  const used = new Set(args.responses.map((r) => r.prompt_id));
  const candidates = PROMPTS.filter(
    (p) =>
      p.modality === args.modality &&
      p.cefr === args.targetLevel &&
      !used.has(p.id),
  );
  if (candidates[0]) return candidates[0];
  const fallback = PROMPTS.find(
    (p) => p.modality === args.modality && !used.has(p.id),
  );
  return fallback ?? PROMPTS.find((p) => p.modality === args.modality) ?? PROMPTS[0];
}

export function nextPromptAfterAssessment(args: {
  session: PlacementV3Session;
  responses: PlacementV3Response[];
  assessment: CEFRAssessment;
}): { prompt: PromptTask | null; metadata: SessionMetadata } {
  const currentModality = args.session.current_modality ?? "writing";
  const withStats = updateStats(
    args.session.metadata,
    currentModality,
    args.assessment,
  );
  const targetLevel = adjustDifficulty(
    withStats.targetLevel ?? "A2",
    args.assessment,
  );
  const currentComplete = modalityComplete(withStats.modalityStats?.[currentModality]);
  const completedModalities = currentComplete
    ? [...new Set([...(withStats.completedModalities ?? []), currentModality])]
    : withStats.completedModalities;
  const metadata = {
    ...withStats,
    completedModalities,
    lastCompletedModality: undefined,
    targetLevel,
  };
  const modality = selectNextModality(metadata);
  if (!modality) return { prompt: null, metadata };
  const prompt = selectPrompt({
    modality,
    targetLevel,
    responses: args.responses,
  });
  const crossedModality = currentComplete && modality !== currentModality;
  return {
    prompt,
    metadata: {
      ...metadata,
      lastCompletedModality: crossedModality ? currentModality : undefined,
      lastPrompt: prompt,
    },
  };
}

export function currentPrompt(session: PlacementV3Session): PromptTask | null {
  return session.metadata.lastPrompt ?? null;
}
