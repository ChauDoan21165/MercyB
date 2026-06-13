import { estimateSkillMastery, isConfidenceLimited } from "./bkt";
import { buildReviewStates } from "./fsrsScheduler";
import { buildDefaultMasteryCatalog, normalizeMasteryCatalog } from "./skillModel";
import type {
  BuildMasteryPlanInput,
  ItemReviewState,
  MasteryItem,
  RankedMasteryItem,
  SkillMasteryState,
} from "./types";

const WEAK_SKILL_THRESHOLD = 0.68;

export function buildAdaptiveMasteryPlan(input: BuildMasteryPlanInput = {}): RankedMasteryItem[] {
  const catalog = normalizeMasteryCatalog(input.catalog ?? buildDefaultMasteryCatalog());
  const interactions = input.interactions ?? [];
  const now = toTime(input.now ?? Date.now());
  const limit = input.limit ?? 10;
  const skillStates = estimateSkillMastery(catalog, interactions);
  const reviewStates = buildReviewStates(interactions);
  const seenItemIds = new Set(interactions.map((interaction) => interaction.itemId));

  const ranked = catalog.items.map((item) => {
    const itemSkillStates = item.skillIds.map((skillId) => skillStates.get(skillId)).filter(Boolean) as SkillMasteryState[];
    const reviewState = reviewStates.get(item.id);
    return rankItem(item, itemSkillStates, reviewState, seenItemIds.has(item.id), now);
  });

  return ranked
    .sort((a, b) => b.score - a.score || a.item.defaultOrder - b.item.defaultOrder || a.item.id.localeCompare(b.item.id))
    .slice(0, limit)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function rankItem(
  item: MasteryItem,
  skillStates: SkillMasteryState[],
  reviewState: ItemReviewState | undefined,
  hasBeenSeen: boolean,
  now: number,
): RankedMasteryItem {
  if (reviewState && !reviewState.suspended && reviewState.dueAt <= now) {
    const overdueDays = Math.max(0, (now - reviewState.dueAt) / 86_400_000);
    return {
      item,
      rank: 0,
      score: 1_000 + (overdueDays * 20) + learningValue(skillStates),
      reasonCode: "review_due",
      reason: `${item.id} is due for FSRS review.`,
      skillStates,
      reviewState,
    };
  }

  const weakest = weakestSkill(skillStates);
  if (weakest && isConfidenceLimited(weakest)) {
    return {
      item,
      rank: 0,
      score: defaultPathScore(item) + (hasBeenSeen ? -20 : 0),
      reasonCode: "confidence_limited",
      reason: `${weakest.skillId} has sparse or conflicting evidence, so default order is preserved.`,
      skillStates,
      reviewState,
    };
  }

  if (weakest && weakest.probabilityKnown < WEAK_SKILL_THRESHOLD) {
    return {
      item,
      rank: 0,
      score: 700 + ((WEAK_SKILL_THRESHOLD - weakest.probabilityKnown) * 300) - item.difficulty,
      reasonCode: "weak_skill",
      reason: `${weakest.skillId} is the weakest confident skill estimate.`,
      skillStates,
      reviewState,
    };
  }

  return {
    item,
    rank: 0,
    score: defaultPathScore(item) + (hasBeenSeen ? -20 : 0),
    reasonCode: "default_path",
    reason: `${item.id} follows the default mastery path.`,
    skillStates,
    reviewState,
  };
}

function weakestSkill(skillStates: readonly SkillMasteryState[]): SkillMasteryState | null {
  if (skillStates.length === 0) return null;
  return [...skillStates].sort((a, b) =>
    a.probabilityKnown - b.probabilityKnown || b.evidenceCount - a.evidenceCount || a.skillId.localeCompare(b.skillId),
  )[0];
}

function learningValue(skillStates: readonly SkillMasteryState[]): number {
  const weakest = weakestSkill(skillStates);
  return weakest ? (1 - weakest.probabilityKnown) * 100 : 0;
}

function defaultPathScore(item: MasteryItem): number {
  return 500 - item.defaultOrder - item.difficulty;
}

function toTime(value: Date | string | number): number {
  return value instanceof Date ? value.getTime() : new Date(value).getTime();
}
