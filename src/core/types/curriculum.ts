// FILE: curriculum.ts
// PATH: src/core/types/curriculum.ts
//
// Purpose:
// - Define curriculum JSON structure
// - Used by UI + recommendation engine

export type SkillId =
  | "listening"
  | "reading"
  | "speaking"
  | "writing"
  | "vocabulary"
  | "grammar"
  | "pronunciation";

export type DrillKind = "read" | "listen" | "shadow" | "speak" | "write" | "quiz";

export interface Drill {
  drillId: string;
  title: string;
  kind: DrillKind;
  skills: SkillId[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  prompt?: string;
  audioUrl?: string;
}

export interface Module {
  moduleId: string;
  title: string;
  description?: string;
  drills: Drill[];
}

export interface GateDefinition {
  minPerSkill: Partial<Record<SkillId, number>>; // 0..1
  minAverage: number; // 0..1
  minAttempts: number;
}

export interface LevelDefinition {
  levelId: number;
  title: string;
  description: string;
  modules: Module[];
  gate: GateDefinition;
}

export interface LevelsIndex {
  levels: {
    levelId: number;
    title: string;
    shortDescription: string;
  }[];
}