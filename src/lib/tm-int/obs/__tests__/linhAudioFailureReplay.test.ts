import { describe, expect, it } from "vitest";
import { LINH_AUDIO_FAILURE_REPLAY, replayObservationScenario } from "../replay";

describe("Linh audio failure replay", () => {
  it("records audio failure facts only and does not infer weak listening", () => {
    const packet = replayObservationScenario(LINH_AUDIO_FAILURE_REPLAY, "2026-07-03T00:00:00.000Z");
    const text = JSON.stringify(packet);

    expect(packet.facts).toHaveLength(1);
    expect(packet.facts[0]).toMatchObject({
      capabilityId: "OBS-AUDIO-000002",
      factType: "AudioDurationZero",
      context: {
        route: "/placement/test/:sessionId",
        taskId: "listening-a2-class-delay-1",
        requestedUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
        learnerAction: "guessed",
      },
      metrics: { durationSeconds: 0 },
    });
    expect(text).not.toMatch(/weak listening|poor listening|learner weakness|psychology/i);
    expect(text).not.toMatch(/verified\":true/i);
  });
});
