import { describe, expect, it } from "vitest";
import { createObservationPacket } from "../../obs/evidencePacket";
import { detectLearningObservation } from "../../obs/detectors/learning";
import { replayTeacherContext } from "../replay";

const OBSERVED_AT = "2026-07-03T00:00:00.000Z";

function answer(taskId: string, responseTimeMs: number, correct: boolean) {
  return detectLearningObservation({ action: "answer", route: "/placement/test/:sessionId", taskId, responseTimeMs, correct }, OBSERVED_AT);
}

describe("TeacherContext runtime replay", () => {
  it("replays deterministically with learning behavior recommendations", () => {
    const packet = createObservationPacket([
      answer("struggle::item-1", 1200, false),
      answer("struggle::item-2", 1400, false),
      answer("struggle::item-3", 2200, true),
    ], OBSERVED_AT);

    const replay = replayTeacherContext(packet);

    expect(replay.pass).toBe(true);
    expect(replay.deterministic).toBe(true);
    expect(replay.failures).toEqual([]);
    expect(replay.first.learningSignals.map((signal) => signal.signal_key)).toContain("productive_struggle");
    expect(replay.first.recommendations).toContainEqual(expect.objectContaining({
      source: "LEARNING-BEHAVIOR-FAMILY-v1",
      reason: "productive_struggle",
      action: "acknowledge_persistence_and_offer_transfer_item",
    }));
  });

  it("does not emit placeholder context for empty observations", () => {
    const replay = replayTeacherContext(createObservationPacket([], OBSERVED_AT));

    expect(replay.pass).toBe(true);
    expect(replay.first.observationSummary.factCount).toBe(0);
    expect(replay.first.learningSignals).toEqual([]);
    expect(replay.first.recommendations).toEqual([]);
    expect(replay.first.replayTrace.at(-1)).toEqual({
      stage: "RUNTIME",
      source: "runtime",
      summary: "0 recommendations",
    });
  });
});
