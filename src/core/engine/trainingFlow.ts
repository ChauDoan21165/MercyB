// FILE: trainingFlow.ts
// PATH: src/core/engine/trainingFlow.ts
//
// Purpose:
// - Orchestrates drill completion flow
// - Score → Update mastery → Build session → Save progress + session
// - Compute gate readiness for UI

import { scoreDrillAttempt } from "./scoring";
import { updateMastery, computeGate } from "./mastery";
import type { DrillAttemptInput } from "./scoring";

import type { Session, UserProgress } from "../types/session";
import type { GateDefinition } from "../types/curriculum";

import { loadUserProgress, saveUserProgress, saveSession } from "../storage/repo";

import { v4 as uuidv4 } from "uuid";

// -----------------------------------------------------
// COMPLETE DRILL
// -----------------------------------------------------

export interface CompleteDrillResult {
  updatedProgress: UserProgress;
  updatedSession: Session;

  sessionScore: number;
  avgAccuracy?: number;

  gateReady: boolean;
  gateReasons: string[];
  missingSkills: string[];
}

export async function completeDrillFlow(args: {
  userId: string;
  levelId: number;
  gateDefinition: GateDefinition;

  drillInput: DrillAttemptInput;
  skillImpacted: string; // e.g. "writing"
}): Promise<CompleteDrillResult> {
  // 1️⃣ Score drill
  const metrics = scoreDrillAttempt(args.drillInput);

  // 2️⃣ Load progress
  let progress = loadUserProgress();
  if (!progress) {
    throw new Error("User progress not initialized");
  }

  // 3️⃣ Update mastery
  const updatedMastery = updateMastery(progress.mastery, {
    // keep permissive typing; mastery engine owns the final skill-key validation
    skill: args.skillImpacted as any,
    score0to100: metrics.score,
    accuracy0to1: metrics.accuracy,
    atISO: new Date().toISOString(),
  });

  progress = {
    ...progress,
    mastery: updatedMastery,
    attemptsInCurrentLevel: (progress.attemptsInCurrentLevel ?? 0) + 1,
  };

  // 4️⃣ Build session
  const session: Session = {
    sessionId: uuidv4(),
    userId: args.userId,
    levelId: args.levelId,
    startedAtISO: args.drillInput.startedAtISO,
    endedAtISO: args.drillInput.endedAtISO,
    drills: [
      {
        drillId: args.drillInput.drillId,
        kind: args.drillInput.kind,
        startedAtISO: args.drillInput.startedAtISO,
        endedAtISO: args.drillInput.endedAtISO,
        score0to100: metrics.score,
        accuracy0to1: metrics.accuracy,
        wpm: metrics.wpm,
      },
    ],
    sessionScore0to100: metrics.score,
  };

  // 5️⃣ Save session + progress
  saveSession(session);
  saveUserProgress(progress);

  // 6️⃣ Compute gate readiness (based on updated mastery + gate definition)
  const gate = computeGate(updatedMastery, args.gateDefinition, {
    attemptsInLevel: progress.attemptsInCurrentLevel,
    lastLevelId: args.levelId,
  });

  return {
    updatedProgress: progress,
    updatedSession: session,
    sessionScore: metrics.score,
    avgAccuracy: metrics.accuracy,
    gateReady: gate.ready,
    gateReasons: gate.reasons ?? [],
    missingSkills: gate.missingSkills ?? [],
  };
}