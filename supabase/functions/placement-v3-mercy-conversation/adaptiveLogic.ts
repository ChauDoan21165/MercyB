import { CEFR_ORDER, type AdaptiveContext, type AdaptiveDecisionResult, type CefrLevel, type Subskill } from "./types";

const SUBSKILLS: Subskill[] = ["grammar", "vocab", "fluency", "comprehension"];

export function decideNextAction(ctx: AdaptiveContext): AdaptiveDecisionResult {
  const turnPairs = ctx.turnPairs;
  const targetTurnPairs = ctx.targetTurnPairs;
  const running = ctx.signals.runningLevel;
  const last = ctx.lastSignal;

  if (ctx.phase === "wrap" || ctx.phase === "complete") {
    return { decision: "WRAP", nextPhase: "complete", targetCefr: "A2", reason: "Session is already closing." };
  }

  if (turnPairs >= targetTurnPairs) {
    return { decision: "WRAP", nextPhase: "wrap", targetCefr: easier(running), reason: "Target session length reached." };
  }

  if (turnPairs >= Math.max(5, targetTurnPairs - 2)) {
    return { decision: "COMFORT", nextPhase: "comfort", targetCefr: easier(running), reason: "Approaching session limit; restore confidence before closing." };
  }

  if (last?.safety_flag === "abusive") {
    return { decision: "BACKOFF", nextPhase: "comfort", targetCefr: "A2", reason: "Safety redirect needed after abusive input." };
  }

  if (last?.insufficient_signal || last?.off_topic || last?.confidence < 0.35) {
    return { decision: "BACKOFF", nextPhase: "probe", targetCefr: easier(running), reason: "Last answer gave little usable signal or showed misunderstanding." };
  }

  const underdiagnosed = leastCoveredSubskill(ctx.signals.subskillCoverage);
  if (turnPairs >= 4 && underdiagnosed && ctx.signals.subskillCoverage[underdiagnosed] < 2) {
    return {
      decision: "TARGET",
      nextPhase: "targeted",
      targetCefr: running,
      targetSubskill: underdiagnosed,
      reason: `${underdiagnosed} has not been probed enough for a holistic profile.`,
    };
  }

  const recent = ctx.signals.recentSignals.slice(-2);
  const avgRecentConfidence = recent.reduce((sum, s) => sum + s.confidence, 0) / Math.max(1, recent.length);
  const comfortable = recent.length >= 2 && avgRecentConfidence >= 0.43 &&
    recent.every((s) => s.numericLevel >= ctx.signals.runningNumeric - 0.35);
  if (comfortable && turnPairs >= 2) {
    return { decision: "ADVANCE", nextPhase: turnPairs >= 4 ? "targeted" : "probe", targetCefr: harder(running), reason: "Recent answers are comfortable and coherent; probe one step harder." };
  }

  return { decision: "HOLD", nextPhase: turnPairs >= 4 ? "targeted" : "probe", targetCefr: running, reason: "Learner is near the edge of current estimate; hold difficulty and gather more evidence." };
}

export function harder(level: CefrLevel): CefrLevel {
  return CEFR_ORDER[Math.min(CEFR_ORDER.length - 1, CEFR_ORDER.indexOf(level) + 1)];
}

export function easier(level: CefrLevel): CefrLevel {
  return CEFR_ORDER[Math.max(0, CEFR_ORDER.indexOf(level) - 1)];
}

function leastCoveredSubskill(coverage: Record<Subskill, number>): Subskill | undefined {
  return SUBSKILLS.reduce<Subskill | undefined>((best, skill) => {
    if (!best) return skill;
    return coverage[skill] < coverage[best] ? skill : best;
  }, undefined);
}
