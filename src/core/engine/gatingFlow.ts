// FILE: gatingFlow.ts
// PATH: src/core/engine/gatingFlow.ts
//
// Purpose:
// - Persist "gate outcome" and advance level when allowed
// - Uses repo as source of truth (authoritative progress)
// - Re-computes gate readiness from stored mastery (prevents stale/forged UI params)

import type { GateDefinition } from "../types/curriculum";
import type { UserProgress } from "../types/session";

import { computeGate, masteryToValues } from "./mastery";
import { loadUserProgress, saveUserProgress } from "../storage/repo";

export interface CompleteGateResult {
  progressed: boolean;
  previousLevelId: number;
  currentLevelId: number;
  gateReady: boolean;
  gateReasons: string[];
  missingSkills: string[];
  updatedProgress: UserProgress;

  // handy for UI / Mercy Host
  masteryValues: Record<string, number>;
}

export async function completeGateFlow(args: {
  userId: string;
  levelId: number;
  gateDefinition: GateDefinition;
}): Promise<CompleteGateResult> {
  const progress = loadUserProgress();
  if (!progress) throw new Error("User progress not initialized");

  if (progress.userId && progress.userId !== args.userId) {
    throw new Error("Progress user mismatch");
  }

  const gate = computeGate(progress.mastery, args.gateDefinition, {
    attemptsInLevel: progress.attemptsInCurrentLevel ?? 0,
    lastLevelId: args.levelId,
  });

  const now = new Date().toISOString();
  const masteryValues = masteryToValues(progress.mastery);

  if (!gate.ready) {
    const updated: UserProgress = {
      ...progress,
      lastGateCheckAtISO: now,
    };
    saveUserProgress(updated);

    return {
      progressed: false,
      previousLevelId: args.levelId,
      currentLevelId: updated.currentLevelId ?? args.levelId,
      gateReady: false,
      gateReasons: gate.reasons ?? [],
      missingSkills: (gate.missingSkills ?? []).map(String),
      updatedProgress: updated,
      masteryValues,
    };
  }

  const fromLevel = args.levelId;
  const toLevel = fromLevel + 1;

  const advanced: UserProgress = {
    ...progress,
    currentLevelId: toLevel,
    attemptsInCurrentLevel: 0,
    lastGateCheckAtISO: now,
    lastLevelAdvancedAtISO: now,
  };

  saveUserProgress(advanced);

  return {
    progressed: true,
    previousLevelId: fromLevel,
    currentLevelId: toLevel,
    gateReady: true,
    gateReasons: gate.reasons ?? [],
    missingSkills: (gate.missingSkills ?? []).map(String),
    updatedProgress: advanced,
    masteryValues,
  };
}