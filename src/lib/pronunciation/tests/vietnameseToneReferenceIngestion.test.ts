import { describe, expect, it } from "vitest";

import {
  VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
  generateToneReferenceAudio,
} from "../__fixtures__/vietnameseToneReferenceAudioFixtures";
import { runVietnameseToneCalibration } from "../vietnameseToneCalibration";
import {
  type LabeledVietnameseToneRecording,
  ingestVietnameseToneReferenceRecordings,
} from "../vietnameseToneReferenceIngestion";

describe("ingestVietnameseToneReferenceRecordings", () => {
  it("turns clean labeled supported-tone recordings into calibration references", () => {
    const result = ingestVietnameseToneReferenceRecordings(cleanSupportedRecordings());
    const calibrationReport = runVietnameseToneCalibration(result.calibrationReferences);

    expect(result.calibrationReferences).toHaveLength(3);
    expect(result.calibrationReferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "reference-sac", kind: "clean_supported", expectedContour: "rising" }),
        expect.objectContaining({ id: "reference-huyen", kind: "clean_supported", expectedContour: "falling" }),
        expect.objectContaining({ id: "reference-ngang", kind: "clean_supported", expectedContour: "level" }),
      ]),
    );
    expect(result.droppedRecordings).toHaveLength(0);
    expect(calibrationReport.passed).toBe(true);
    expect(calibrationReport.cleanSupportedAccuracy).toBe(1);
  });

  it("normalizes per speaker so reference contours preserve shape instead of raw pitch height", () => {
    const result = ingestVietnameseToneReferenceRecordings([
      ...recordingsForSpeaker("low", 0.82),
      ...recordingsForSpeaker("high", 1.28),
    ]);

    expect(Object.keys(result.speakerMedianF0Hz).sort()).toEqual(["high", "low"]);
    expect(result.speakerMedianF0Hz.high).toBeGreaterThan(result.speakerMedianF0Hz.low);
    expect(result.perToneReferenceContours.sac?.medianF0Hz).toBeGreaterThan(0.9);
    expect(result.perToneReferenceContours.sac?.medianF0Hz).toBeLessThan(1.1);
    expect(result.perToneReferenceContours.huyen?.medianF0Hz).toBeGreaterThan(0.9);
    expect(result.perToneReferenceContours.huyen?.medianF0Hz).toBeLessThan(1.1);
    expect(result.perToneReferenceContours.ngang?.medianF0Hz).toBeGreaterThan(0.9);
    expect(result.perToneReferenceContours.ngang?.medianF0Hz).toBeLessThan(1.1);
  });

  it("drops clipped, low-confidence, and unexpected-contour recordings before reference generation", () => {
    const result = ingestVietnameseToneReferenceRecordings([
      recording("clean-sac", "speaker-a", "sac", 185, 230),
      {
        id: "clipped-sac",
        speakerId: "speaker-a",
        tone: "sac",
        syllable: "ma",
        sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
        samples: clippedSamples(),
      },
      {
        id: "quiet-sac",
        speakerId: "speaker-a",
        tone: "sac",
        syllable: "ma",
        sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
        samples: generateToneReferenceAudio({ startHz: 185, endHz: 230, amplitude: 0.001 }),
      },
      recording("wrong-sac", "speaker-a", "sac", 230, 185),
    ]);

    expect(result.calibrationReferences).toHaveLength(1);
    expect(result.calibrationReferences[0]).toMatchObject({ id: "reference-sac" });
    expect(result.droppedRecordings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "clipped-sac", reason: "clipped" }),
        expect.objectContaining({ id: "quiet-sac" }),
        expect.objectContaining({ id: "wrong-sac", reason: "unexpected_contour" }),
      ]),
    );
    expect(result.acceptedRecordings.map((accepted) => accepted.id)).toEqual(["clean-sac"]);
  });

  it("keeps hoi, nga, and nang unsupported rather than generating supported reference contours", () => {
    const result = ingestVietnameseToneReferenceRecordings([
      recording("hoi-clean", "speaker-a", "hoi", 185, 230),
      recording("nga-clean", "speaker-a", "nga", 185, 230),
      recording("nang-clean", "speaker-a", "nang", 185, 230),
    ]);
    const calibrationReport = runVietnameseToneCalibration(result.calibrationReferences);

    expect(result.perToneReferenceContours).toEqual({});
    expect(result.calibrationReferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "unsupported-hoi", kind: "unsupported" }),
        expect.objectContaining({ id: "unsupported-nga", kind: "unsupported" }),
        expect.objectContaining({ id: "unsupported-nang", kind: "unsupported" }),
      ]),
    );
    expect(calibrationReport.unsupportedTotal).toBe(3);
    expect(calibrationReport.unsupportedAbstained).toBe(3);
    expect(calibrationReport.passed).toBe(false);
  });

  it("prefers dropping bad material over emitting a bad reference contour", () => {
    const result = ingestVietnameseToneReferenceRecordings([recording("wrong-only-sac", "speaker-a", "sac", 230, 185)]);

    expect(result.calibrationReferences).toHaveLength(0);
    expect(result.perToneReferenceContours).toEqual({});
    expect(result.droppedRecordings).toEqual([
      expect.objectContaining({ id: "wrong-only-sac", reason: "unexpected_contour" }),
    ]);
  });
});

function cleanSupportedRecordings(): LabeledVietnameseToneRecording[] {
  return [
    recording("sac-a", "speaker-a", "sac", 185, 230),
    recording("sac-b", "speaker-b", "sac", 210, 258),
    recording("huyen-a", "speaker-a", "huyen", 230, 185),
    recording("huyen-b", "speaker-b", "huyen", 258, 210),
    recording("ngang-a", "speaker-a", "ngang", 205, 206),
    recording("ngang-b", "speaker-b", "ngang", 235, 234),
  ];
}

function recordingsForSpeaker(speakerId: string, pitchScale: number): LabeledVietnameseToneRecording[] {
  return [
    recording(`${speakerId}-sac`, speakerId, "sac", 185 * pitchScale, 230 * pitchScale),
    recording(`${speakerId}-huyen`, speakerId, "huyen", 230 * pitchScale, 185 * pitchScale),
    recording(`${speakerId}-ngang`, speakerId, "ngang", 205 * pitchScale, 206 * pitchScale),
  ];
}

function recording(
  id: string,
  speakerId: string,
  tone: LabeledVietnameseToneRecording["tone"],
  startHz: number,
  endHz: number,
): LabeledVietnameseToneRecording {
  return {
    id,
    speakerId,
    tone,
    syllable: "ma",
    sampleRate: VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE,
    samples: generateToneReferenceAudio({ startHz, endHz }),
  };
}

function clippedSamples(): Float32Array {
  const totalSamples = Math.round(VIETNAMESE_TONE_REFERENCE_SAMPLE_RATE * 0.72);
  const samples = new Float32Array(totalSamples);
  for (let index = 0; index < totalSamples; index += 1) {
    samples[index] = index % 2 === 0 ? 1 : -1;
  }
  return samples;
}
