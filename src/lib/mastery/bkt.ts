import type { LearnerInteraction, MasteryCatalog, SkillMasteryState } from "./types";

const INITIAL_KNOWN = 0.25;
const LEARN_PROBABILITY = 0.08;
const GUESS_PROBABILITY = 0.2;
const SLIP_PROBABILITY = 0.1;

export function buildInitialSkillStates(catalog: MasteryCatalog): Map<string, SkillMasteryState> {
  return new Map(catalog.skills.map((skill) => [skill.id, createInitialSkillState(skill.id)]));
}

export function estimateSkillMastery(
  catalog: MasteryCatalog,
  interactions: readonly LearnerInteraction[],
): Map<string, SkillMasteryState> {
  const states = buildInitialSkillStates(catalog);
  const itemById = new Map(catalog.items.map((item) => [item.id, item]));

  for (const interaction of [...interactions].sort(compareInteractionTime)) {
    const skillIds = (interaction.skillId
      ? [interaction.skillId]
      : itemById.get(interaction.itemId)?.skillIds ?? []
    ).filter((skillId) => states.has(skillId));

    for (const skillId of skillIds) {
      const current = states.get(skillId) ?? createInitialSkillState(skillId);
      states.set(skillId, updateSkillMastery(current, interaction));
    }
  }

  return states;
}

export function updateSkillMastery(
  state: SkillMasteryState,
  interaction: LearnerInteraction,
): SkillMasteryState {
  const known = state.probabilityKnown;
  const posterior = interaction.outcome === "correct"
    ? (known * (1 - SLIP_PROBABILITY)) / ((known * (1 - SLIP_PROBABILITY)) + ((1 - known) * GUESS_PROBABILITY))
    : (known * SLIP_PROBABILITY) / ((known * SLIP_PROBABILITY) + ((1 - known) * (1 - GUESS_PROBABILITY)));
  const probabilityKnown = clamp(posterior + ((1 - posterior) * LEARN_PROBABILITY), 0.01, 0.99);
  const correctCount = state.correctCount + (interaction.outcome === "correct" ? 1 : 0);
  const incorrectCount = state.incorrectCount + (interaction.outcome === "incorrect" ? 1 : 0);
  const evidenceCount = correctCount + incorrectCount;

  return {
    ...state,
    probabilityKnown,
    evidenceCount,
    correctCount,
    incorrectCount,
    confidence: estimateConfidence(correctCount, incorrectCount),
    lastEvidenceAt: toTime(interaction.occurredAt),
  };
}

export function isConfidenceLimited(state: SkillMasteryState): boolean {
  return state.evidenceCount < 3 || state.confidence < 0.45;
}

function createInitialSkillState(skillId: string): SkillMasteryState {
  return {
    skillId,
    probabilityKnown: INITIAL_KNOWN,
    evidenceCount: 0,
    correctCount: 0,
    incorrectCount: 0,
    confidence: 0,
    lastEvidenceAt: null,
  };
}

function estimateConfidence(correctCount: number, incorrectCount: number): number {
  const evidenceCount = correctCount + incorrectCount;
  if (evidenceCount === 0) return 0;
  const sampleConfidence = Math.min(1, evidenceCount / 6);
  const balance = Math.abs(correctCount - incorrectCount) / evidenceCount;
  const consistency = 0.4 + (balance * 0.6);
  return clamp(sampleConfidence * consistency, 0, 1);
}

function compareInteractionTime(a: LearnerInteraction, b: LearnerInteraction): number {
  return toTime(a.occurredAt) - toTime(b.occurredAt);
}

function toTime(value: Date | string | number): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
