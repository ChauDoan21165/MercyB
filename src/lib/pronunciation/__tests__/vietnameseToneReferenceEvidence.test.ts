import { describe, expect, it } from "vitest";

import {
  VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
  generateToneReferenceAudio,
  generatedAmbiguousToneReferences,
  generatedCleanSupportedToneReferences,
  generatedUnsupportedToneReferences,
} from "../__fixtures__/vietnameseToneReferenceAudioFixtures";
import { extractF0PitchContour } from "../f0PitchExtractor";
import { classifyVietnameseToneContour, scoreVietnameseToneAttempt } from "../vietnameseToneScorer";

const CLEAN_SUPPORTED_TONE_REFERENCE_THRESHOLD = 0.9;

describe("Vietnamese tone reference evidence pack", () => {
  it("states the supported-tone acceptance threshold before scoring fixtures", () => {
    expect(CLEAN_SUPPORTED_TONE_REFERENCE_THRESHOLD).toBe(0.9);
  });

  it("classifies clean generated supported-tone references at >=90% contour-bucket accuracy", () => {
    const results = generatedCleanSupportedToneReferences.map((fixture) => {
      const contour = extractF0PitchContour({
        enabled: true,
        sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
        samples: generateToneReferenceAudio({
          startHz: fixture.startHz,
          endHz: fixture.endHz,
        }),
      });
      const score = scoreVietnameseToneAttempt({
        contour,
        target: fixture.target,
      });

      return {
        id: fixture.id,
        expectedContour: fixture.expectedContour,
        observedContour: classifyVietnameseToneContour(contour),
        score,
      };
    });

    const correct = results.filter(
      (result) => result.observedContour === result.expectedContour && result.score.bucket === "close",
    ).length;
    const accuracy = correct / results.length;

    expect(accuracy).toBeGreaterThanOrEqual(CLEAN_SUPPORTED_TONE_REFERENCE_THRESHOLD);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ expectedContour: "rising", observedContour: "rising" }),
        expect.objectContaining({ expectedContour: "falling", observedContour: "falling" }),
        expect.objectContaining({ expectedContour: "level", observedContour: "level" }),
      ]),
    );
    expect(results.every((result) => result.score.reason === "contour-match")).toBe(true);
  });

  it("keeps hoi, nga, and nang unsupported rather than forcing confident MVP feedback", () => {
    for (const fixture of generatedUnsupportedToneReferences()) {
      const contour = extractF0PitchContour({
        enabled: true,
        sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
        samples: fixture.samples,
      });
      const score = scoreVietnameseToneAttempt({
        contour,
        target: fixture.target,
      });

      expect(score.bucket).toBe("unclear");
      expect(score.score).toBeNull();
      expect(score.reason).toBe("unsupported-tone-for-mvp");
    }
  });

  it("abstains on low-quality or ambiguous generated references instead of returning confident wrong tone output", () => {
    for (const fixture of generatedAmbiguousToneReferences()) {
      const contour = extractF0PitchContour({
        enabled: true,
        sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
        samples: fixture.samples,
      });
      const score = scoreVietnameseToneAttempt({
        contour,
        target: fixture.target,
      });

      expect(score.bucket).toBe("unclear");
      expect(score.score).toBeNull();
      expect(score.reason).toMatch(/audio-unavailable|insufficient-pitch-evidence|low-confidence/);
    }
  });
});
