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

  it("passes the calibration scaffold for supported tones and unsupported abstention", () => {
    const result = azureVietnameseToneTtsCalibrationIngestionResult();
    const report = runVietnameseToneCalibration(result.calibrationReferences);

    expect(report.passed).toBe(true);
    expect(report.cleanSupportedAccuracy).toBe(1);
    expect(report.cleanSupportedTotal).toBe(3);
    expect(report.cleanSupportedCorrect).toBe(3);
    expect(report.unsupportedTotal).toBe(3);
    expect(report.unsupportedAbstained).toBe(3);
  });

  it("keeps hoi, nga, and nang unsupported even when TTS-proxy contours are accepted", () => {
    const result = azureVietnameseToneTtsCalibrationIngestionResult();

    expect(Object.keys(result.perToneReferenceContours).sort()).toEqual(["huyen", "ngang", "sac"]);
    expect(result.calibrationReferences).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "unsupported-hoi", kind: "unsupported" }),
        expect.objectContaining({ id: "unsupported-nga", kind: "unsupported" }),
        expect.objectContaining({ id: "unsupported-nang", kind: "unsupported" }),
      ]),
    );
  });
});
