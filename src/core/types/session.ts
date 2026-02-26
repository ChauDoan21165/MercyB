// FILE: session.ts
// PATH: src/core/types/session.ts
//
// Purpose:
// - Define session lifecycle + progress

import type { SkillId } from "./curriculum";

export type ISODateString = string;

export interface DrillAttempt {
  drillId: string;
  kind: string;

  startedAtISO: ISODateString;
  endedAtISO: ISODateString;

  score0to100: number;
  accuracy0to1?: number;
  wpm?: number;
}

export interface Session {
  sessionId: string;
  userId: string;

  levelId: number;

  startedAtISO: ISODateString;
  endedAtISO?: ISODateString;

  drills: DrillAttempt[];

  sessionScore0to100?: number;
}

export interface SkillMastery {
  value: number; // 0..1
  updatedAtISO: ISODateString;
}

export interface UserProgress {
  userId: string;

  currentLevelId: number;

  mastery: Record<SkillId, SkillMastery>;

  attemptsInCurrentLevel: number;

  completedDrillIds: string[];

  // Optional book-keeping (used by gatingFlow)
  lastGateCheckAtISO?: ISODateString;
  lastLevelAdvancedAtISO?: ISODateString;
}