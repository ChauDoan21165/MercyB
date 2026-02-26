// core/types/curriculum.ts

import { ModuleKey } from "./session";

export interface LevelTargets {
  mastery: number;
  minimums: Partial<Record<string, number>>;
  sessions: number;
}

export interface Prompt {
  id: string;
  text: string;
  constraints?: string[];
}

export interface ModuleDefinition {
  moduleKey: ModuleKey;
  title: string;

  // for timed drills
  durationSec?: number;
  prompts?: Prompt[];
  scoringProfile?: {
    targetWords?: number;
  };

  // for accuracy drills
  items?: {
    id: string;
    bad?: string;
    goal?: string;
  }[];
}

export interface MercyHostRule {
  if: string; // simple rule expression
  diagnosis: string;
  prescription: string;
}

export interface LevelCurriculum {
  level: number;
  focus: string;
  targets: LevelTargets;
  modules: ModuleDefinition[];
  mercyHostRules: MercyHostRule[];
}