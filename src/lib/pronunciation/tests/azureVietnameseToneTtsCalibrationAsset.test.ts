import { describe, expect, it } from "vitest";

import {
  azureVietnameseToneTtsCalibrationAsset,
  azureVietnameseToneTtsCalibrationIngestionResult,
} from "../azureVietnameseToneTtsCalibrationAsset";
import { runVietnameseToneCalibration } from "../vietnameseToneCalibration";

describe("azureVietnameseToneTtsCalibrationAsset", () => {
  it("stores derived TTS-proxy contour references without raw audio", () => {
    expect(azureVietnameseToneTtsCalibrationAsset.source).toBe("azure-tts-proxy");
    expect(azureVietnameseToneTtsCalibrationAsset.locale).toBe("vi-VN");
    expect(azureVietnameseToneTtsCalibrationAsset.voices).toHaveLength(2);
    expect(azureVietnameseToneTtsCalibrationAsset.recordingCount).toBe(24);
    expect(azureVietnameseToneTtsCalibrationAsset.acceptedRecordingCount).toBe(13);

    const serialized = JSON.stringify(azureVietnameseToneTtsCalibrationAsset);
    expect(serialized).not.toMatch(/rawAudio|audioBytes|wav|base64|pcm/i);
  });

  it("expands the accepted TTS-proxy recordings into a larger emitted calibration set", () => {
    const result = azureVietnameseToneTtsCalibrationIngestionResult();
    const report = runVietnameseToneCalibration(result.calibrationReferences);

    expect(report.passed).toBe(true);
    expect(report.cleanSupportedAccuracy).toBe(1);
    expect(report.cleanSupportedTotal).toBe(7);
    expect(report.cleanSupportedCorrect).toBe(7);
    expect(report.unsupportedTotal).toBe(6);
    expect(report.unsupportedAbstained).toBe(6);
    expect(result.calibrationReferences).toHaveLength(13);
    expect(result.calibrationReferences.length).toBeGreaterThan(6);
    expect(result.calibrationReferences.every((reference) => reference.kind === "clean_supported" || reference.kind === "unsupported")).toBe(true);
  });

  it("keeps hoi, nga, and nang unsupported even when TTS-proxy contours are accepted", () => {
    const result = azureVietnameseToneTtsCalibrationIngestionResult();

    expect(Object.keys(result.perToneReferenceContours).sort()).toEqual(["huyen", "ngang", "sac"]);
    expect(result.calibrationReferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "unsupported", target: expect.objectContaining({ tone: "hoi" }) }),
        expect.objectContaining({ kind: "unsupported", target: expect.objectContaining({ tone: "nga" }) }),
        expect.objectContaining({ kind: "unsupported", target: expect.objectContaining({ tone: "nang" }) }),
      ]),
    );
  });
});
