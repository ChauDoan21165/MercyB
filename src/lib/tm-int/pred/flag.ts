// WP-001 — single flag import site (per-module flag pattern).
import { FEATURE_FLAGS } from "@/lib/featureFlags";

/** True iff prediction-error capture (SHADOW MODE) is enabled. Default OFF. */
export function isPredictionCaptureEnabled(): boolean {
  return FEATURE_FLAGS.TUTOR_PREDICTION_CAPTURE_ENABLED === true;
}
