export type MasterySkillDimension = "vocabulary" | "grammar" | "listening" | "speaking";

export type MasteryReasonCode =
  | "review_due"
  | "weak_skill"
  | "default_path"
  | "confidence_limited";

export type MasteryOutcome = "correct" | "incorrect";

export type FsrsRating = "again" | "hard" | "good" | "easy";

export type MasteryTheme = {
  id: string;
  label: string;
  defaultOrder: number;
};

export type MasterySkill = {
  id: string;
  themeId: string;
  dimension: MasterySkillDimension;
  label: string;
  defaultOrder: number;
  prerequisites?: string[];
  difficultyBand: "starter" | "core" | "stretch";
};

export type MasteryItem = {
  id: string;
  themeId: string;
  skillIds: string[];
  label: string;
  defaultOrder: number;
  difficulty: number;
  reviewable?: boolean;
};

export type MasteryCatalog = {
  themes: MasteryTheme[];
  skills: MasterySkill[];
  items: MasteryItem[];
};

export type LearnerInteraction = {
  itemId: string;
  skillId?: string;
  outcome: MasteryOutcome;
  occurredAt: Date | string | number;
  fsrsRating?: FsrsRating;
};

export type SkillMasteryState = {
  skillId: string;
  probabilityKnown: number;
  evidenceCount: number;
  correctCount: number;
  incorrectCount: number;
  confidence: number;
  lastEvidenceAt: number | null;
};

export type ItemReviewState = {
  itemId: string;
  dueAt: number;
  stability: number;
  difficulty: number;
  lastReviewAt: number | null;
  ratingHistory: FsrsRating[];
  suspended: boolean;
};

export type RankedMasteryItem = {
  item: MasteryItem;
  rank: number;
  score: number;
  reasonCode: MasteryReasonCode;
  reason: string;
  skillStates: SkillMasteryState[];
  reviewState?: ItemReviewState;
};

export type BuildMasteryPlanInput = {
  catalog?: MasteryCatalog;
  interactions?: LearnerInteraction[];
  now?: Date | string | number;
  limit?: number;
};
