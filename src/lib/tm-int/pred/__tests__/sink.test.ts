// WP-001 — storage adapter: same drain path, flag-gated, drain-safe projection.
import { describe, it, expect } from "vitest";
import { buildThesisFixture, buildHindsightFixture } from "@/lib/tm-int/pred/fixtures";
import { resolveSurprise } from "@/lib/tm-int/pred/capture";
import {
  toPredictionEvent,
  toSurpriseEvent,
  sinkAnchorToken,
  drainPrediction,
  drainSurprise,
} from "@/lib/tm-int/pred/sink";

describe("WP-001: storage adapter (existing learning-events drain)", () => {
  it("projects a prediction onto the allowlisted learning-events fields", () => {
    const { rows } = buildThesisFixture();
    const event = toPredictionEvent(rows[0]);
    expect(event.eventType).toBe("prediction_recorded");
    expect(event.product).toBe("ai_tutor");
    expect(event.ruleOrDetectorId).toBe("pred-lut-v1");
    expect(event.value).toBeGreaterThanOrEqual(0);
    expect(event.value).toBeLessThanOrEqual(1000);
    expect(typeof event.safeTopicTag).toBe("string");
  });

  it("the sink anchor token survives safeTopicTag sanitization (letters + hyphen only)", () => {
    const { rows } = buildThesisFixture();
    for (const row of rows.slice(0, 5)) {
      const token = sinkAnchorToken(row.turnAddress);
      expect(token).toMatch(/^ta-[a-z]{7}$/); // no digits, no spaces, single token, < 48 chars
    }
  });

  it("does NOT drain hindsight-rejected pairs", () => {
    const { rows, outcomes } = buildHindsightFixture();
    const resolutions = rows.map((row, i) => resolveSurprise(row, outcomes[i]));
    for (const resolution of resolutions) {
      const event = toSurpriseEvent(resolution);
      if (resolution.hindsightRejected) expect(event).toBeNull();
      else expect(event?.eventType).toBe("surprise_resolved");
    }
  });

  it("is flag-gated: drains nothing when capture is OFF (default), even with an injected recorder", () => {
    const { rows, resolutions } = buildThesisFixture();
    const recorded: string[] = [];
    const recorder = (e: { eventType: string }) => {
      recorded.push(e.eventType);
      return null;
    };
    // Flag defaults OFF in the test env → both drains are no-ops.
    expect(drainPrediction(rows[0], recorder)).toBeNull();
    expect(drainSurprise(resolutions[0], recorder)).toBeNull();
    expect(recorded).toEqual([]);
  });
});
