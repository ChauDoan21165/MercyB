import { describe, expect, it } from "vitest";
import { detectAudioObservations } from "../detectors/audio";

describe("OBS INT audio observations", () => {
  it("records missing audio, zero duration, playback failure, and replay count as facts", () => {
    const facts = detectAudioObservations(
      {
        requestedUrl: "",
        durationSeconds: 0,
        playbackError: "media element error",
        replayCount: 2,
        route: "/placement/test/:sessionId",
        taskId: "listening-a2-class-delay-1",
      },
      "2026-07-03T00:00:00.000Z",
    );

    expect(facts.map((fact) => fact.factType)).toEqual([
      "AudioUnavailable",
      "AudioDurationZero",
      "AudioPlaybackFailed",
      "AudioReplayCount",
    ]);
    expect(facts.find((fact) => fact.factType === "AudioDurationZero")?.metrics).toEqual({ durationSeconds: 0 });
    expect(JSON.stringify(facts)).not.toMatch(/weak|psychology|listening weakness/i);
  });
});
