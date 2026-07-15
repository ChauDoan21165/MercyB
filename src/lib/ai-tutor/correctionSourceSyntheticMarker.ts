export const CORRECTION_SOURCE_SYNTHETIC_MARKER_KEY = "mercyblade.syntheticMonitoring";

export function isCorrectionSourceSyntheticMarkerValue(value: string | null): boolean {
  return value === "1" || value === "true" || value === "synthetic";
}
