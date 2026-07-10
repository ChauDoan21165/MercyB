// WP-001 — live-turn helper: self-guarding, never-throws, correct provenance when ON.
import { describe, it, expect, vi, afterEach } from "vitest";
import { captureLiveTurnPrediction, __resetLiveTurnStateForTests } from "@/lib/tm-int/pred/liveTurn";
import * as flag from "@/lib/tm-int/pred/flag";

afterEach(() => {
  vi.restoreAllMocks();
  __resetLiveTurnStateForTests();
});

describe("WP-001: live-turn capture helper", () => {
  it("is a no-op when the flag is OFF (default)", () => {
    const row = captureLiveTurnPrediction({ status: "corrected", appliedRuleIds: ["l1:x"], msgId: "corr-1" }, 1_000);
    expect(row).toBeNull();
  });

  it("captures a prediction with turn provenance when the flag is ON", () => {
    vi.spyOn(flag, "isPredictionCaptureEnabled").mockReturnValue(true);
    const first = captureLiveTurnPrediction(
      { status: "corrected", appliedRuleIds: ["l1:sva", "l1:tense"], isCurrentLessonTarget: true, cefrBucket: "B", msgId: "corr-1" },
      1_000,
    );
    const second = captureLiveTurnPrediction({ status: "corrected", appliedRuleIds: ["l1:sva"], msgId: "corr-2" }, 2_000);

    expect(first).not.toBeNull();
    expect(first?.turnAddress.msgId).toBe("corr-1");
    expect(first?.turnAddress.turnIndex).toBe(0);
    expect(first?.features.issueCount).toBe(2);
    expect(first?.features.ruleId).toBe("l1:sva");
    expect(first?.prediction.predictorVersion).toBe("pred-lut-v1");
    // Monotonic turn index within a session; stable session token.
    expect(second?.turnAddress.turnIndex).toBe(1);
    expect(second?.turnAddress.sessionId).toBe(first?.turnAddress.sessionId);
  });

  it("never throws even on malformed input", () => {
    vi.spyOn(flag, "isPredictionCaptureEnabled").mockReturnValue(true);
    // @ts-expect-error — deliberately malformed to prove the helper swallows errors.
    expect(() => captureLiveTurnPrediction({ status: undefined, msgId: undefined }, Number.NaN)).not.toThrow();
  });
});
