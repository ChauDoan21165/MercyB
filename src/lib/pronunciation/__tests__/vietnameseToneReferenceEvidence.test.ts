import { describe, expect, it } from "vitest";

import {
  VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
  generateToneReferenceAudio,
  generatedAmbiguousToneReferences,
  generatedCleanSupportedToneReferences,
  generatedHardToneReferences,
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
    const results = generatedCleanSupportedToneReferences.map((fixture) => evaluateFixture(fixture.target, fixture.startHz, fixture.endHz));
    const summary = summarize(results);

    expect(summary.overallAccuracy).toBeGreaterThanOrEqual(CLEAN_SUPPORTED_TONE_REFERENCE_THRESHOLD);
    expect(summary.byTone.sac.accuracy).toBe(1);
    expect(summary.byTone.huyen.accuracy).toBe(1);
    expect(summary.byTone.ngang.accuracy).toBe(1);
    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ expectedContour: "rising", observedContour: "rising" }),
        expect.objectContaining({ expectedContour: "falling", observedContour: "falling" }),
        expect.objectContaining({ expectedContour: "level", observedContour: "level" }),
      ]),
    );
    expect(results.every((result) => result.score.reason === "contour-match")).toBe(true);
  });

  it("abstains on learner-like hard cases and keeps unsupported tones unclear", () => {
    const hardReadouts = generatedHardToneReferences().map((fixture) =>
      evaluateSynthFixture(fixture.target, fixture.samples, fixture.hardCase),
    );
    const ambiguousReadouts = generatedAmbiguousToneReferences().map((fixture) =>
      evaluateSynthFixture(fixture.target, fixture.samples, "ambiguous"),
    );
    const unsupportedReadouts = generatedUnsupportedToneReferences().map((fixture) =>
      evaluateSynthFixture(fixture.target, fixture.samples, `unsupported-${fixture.tone}`),
    );

    expect(hardReadouts.every((result) => result.score.bucket === "unclear")).toBe(true);
    expect(ambiguousReadouts.every((result) => result.score.bucket === "unclear")).toBe(true);
    expect(unsupportedReadouts.every((result) => result.score.bucket === "unclear")).toBe(true);
    expect(unsupportedReadouts.every((result) => result.score.reason === "unsupported-tone-for-mvp")).toBe(true);
    expect(
      [...hardReadouts, ...ambiguousReadouts].some((result) =>
        result.contour.reason === "too-short" ||
        result.contour.reason === "insufficient-voicing" ||
        result.score.reason === "low-confidence" ||
        result.score.reason === "insufficient-pitch-evidence",
      ),
    ).toBe(true);

    const failureRead = unsupportedReadouts.map((result) => ({
      tone: result.tone,
      observedContour: result.observedContour,
      bucket: result.score.bucket,
      reason: result.score.reason,
      contourReason: result.contour.reason,
      voicedRatio: result.contour.voicedRatio,
      extractionConfidence: result.contour.extractionConfidence,
    }));

    expect(failureRead.every((entry) => entry.bucket === "unclear")).toBe(true);
    expect(failureRead.every((entry) => entry.reason === "unsupported-tone-for-mvp")).toBe(true);
    expect(failureRead.some((entry) => entry.observedContour !== "unknown")).toBe(true);
  });
});

function evaluateFixture(
  target: (typeof generatedCleanSupportedToneReferences)[number]["target"],
  startHz: number,
  endHz: number,
) {
  const contour = extractF0PitchContour({
    enabled: true,
    sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
    samples: generateToneReferenceAudio({
      startHz,
      endHz,
    }),
  });
  const score = scoreVietnameseToneAttempt({
    contour,
    target,
  });

  return {
    expectedContour: target.expectedContour,
    observedContour: classifyVietnameseToneContour(contour),
    contour,
    score,
    tone: target.tone,
  };
}

function evaluateSynthFixture(
  target: (typeof generatedHardToneReferences)[number]["target"],
  samples: Float32Array,
  label: string,
) {
  const contour = extractF0PitchContour({
    enabled: true,
    sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
    samples,
  });
  const score = scoreVietnameseToneAttempt({
    contour,
    target,
  });

  return {
    label,
    tone: target.tone,
    observedContour: classifyVietnameseToneContour(contour),
    contour,
    score,
  };
}

function summarize(results: Array<ReturnType<typeof evaluateFixture>>) {
  const byTone = {
    sac: toneSummary(results.filter((result) => result.tone === "sac")),
    huyen: toneSummary(results.filter((result) => result.tone === "huyen")),
    ngang: toneSummary(results.filter((result) => result.tone === "ngang")),
  };
  const overallAccuracy = results.length === 0 ? 0 : results.filter((result) => result.score.bucket === "close").length / results.length;

  return {
    overallAccuracy,
    byTone,
  };
}

function toneSummary(results: Array<ReturnType<typeof evaluateFixture>>) {
  const total = results.length;
  const correct = results.filter((result) => result.score.bucket === "close" && result.score.reason === "contour-match").length;
  return {
    total,
    correct,
    accuracy: total === 0 ? 0 : correct / total,
  };
}
