import {
  detectEnVnError,
  detectL1Error,
  detectRegisterError,
  type L1DetectionInput,
} from "../../src/lib/feedback/index.js";
import { getDetectorHint } from "../../src/lib/ai-tutor/detectorHint.js";

export type ShippedDetectorResult = {
  matched: boolean;
  tag: string | null;
  detector: "detectL1Error";
  hintEligible: boolean;
};

export function runViEnL1Detector(input: L1DetectionInput): ShippedDetectorResult {
  const detection = detectL1Error(input);
  const hint = getDetectorHint(detection);

  return {
    matched: detection.matched,
    tag: detection.weaknessTag,
    detector: "detectL1Error",
    hintEligible: Boolean(hint),
  };
}

export function smokeImportAdditionalDetectorSurfaces(): void {
  detectEnVnError({ userAnswer: "toi la happy", expectedAnswer: "toi happy" });
  detectRegisterError({ learnerText: "Hey teacher, I am late." });
}
