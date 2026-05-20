import { describe, expect, it } from "vitest";
import { decideNextAction } from "../adaptiveLogic";
import { extractSignalsFromTurn, summarizeSignals } from "../signalExtractor";
import type { AdaptiveContext } from "../types";

function ctx(overrides: Partial<AdaptiveContext>): AdaptiveContext {
  const signals = overrides.signals ?? summarizeSignals([
    extractSignalsFromTurn("I practiced every night because it was difficult and I improved."),
    extractSignalsFromTurn("I can explain my work clearly because I prepare examples."),
  ]);
  return { phase: "probe", targetTurnPairs: 8, turnPairs: 3, signals, lastSignal: signals.recentSignals.at(-1), ...overrides };
}

describe("adaptiveLogic", () => {
  it("triggers ADVANCE when user is comfortable", () => {
    expect(decideNextAction(ctx({ turnPairs: 3 })).decision).toBe("ADVANCE");
  });

  it("triggers HOLD at current edge", () => {
    const signals = summarizeSignals([extractSignalsFromTurn("I work in shop and I want speak better.")]);
    expect(decideNextAction(ctx({ signals, lastSignal: signals.recentSignals.at(-1), turnPairs: 2 })).decision).toBe("HOLD");
  });

  it("triggers BACKOFF after insufficient signal", () => {
    const signals = summarizeSignals([extractSignalsFromTurn("")]);
    expect(decideNextAction(ctx({ signals, lastSignal: signals.recentSignals.at(-1) })).decision).toBe("BACKOFF");
  });

  it("triggers TARGET when a subskill is underdiagnosed", () => {
    const signals = summarizeSignals([
      extractSignalsFromTurn("I practiced because it was difficult."),
      extractSignalsFromTurn("I improved because I studied every night."),
      extractSignalsFromTurn("My teacher helped me because she gave small goals."),
      extractSignalsFromTurn("I want to speak with customers because it helps my job."),
    ]);
    signals.subskillCoverage.grammar = 0;
    const decision = decideNextAction(ctx({ signals, turnPairs: 4, lastSignal: signals.recentSignals.at(-1) }));
    expect(decision.decision).toBe("TARGET");
    expect(decision.targetSubskill).toBe("grammar");
  });

  it("shifts to COMFORT near session limit", () => {
    expect(decideNextAction(ctx({ turnPairs: 7, targetTurnPairs: 8 })).decision).toBe("COMFORT");
  });

  it("wraps at target length", () => {
    expect(decideNextAction(ctx({ turnPairs: 8, targetTurnPairs: 8 })).decision).toBe("WRAP");
  });
});
