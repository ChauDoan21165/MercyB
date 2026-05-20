export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export enum CEFRSubskill {
  Grammar = "grammar",
  Vocabulary = "vocabulary",
  Coherence = "coherence",
  TaskAchievement = "taskAchievement",
}

export type CEFRScore = {
  level: CEFRLevel;
  confidence: number;
};

export type CEFRSubskillScore = CEFRScore & {
  notes: string;
};

export type L1InterferenceFlag = {
  pattern: string;
  severity: "low" | "med" | "high";
  examples: string[];
};

export type CEFRAssessment = {
  overall: CEFRScore;
  subskills: Record<CEFRSubskill, CEFRSubskillScore>;
  strengths: string[];
  gaps: string[];
  l1InterferenceFlags: L1InterferenceFlag[];
  recommendedFocusAreas: string[];
};

export const CEFR_LEVELS: readonly CEFRLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
] as const;

