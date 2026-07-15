export const PLACEMENT_SYNTHETIC_MARKER_KEY = "mercyblade.syntheticMonitoring";

export function isPlacementSyntheticMarkerValue(value: unknown): boolean {
  return value === true || value === "1" || value === "true" || value === "synthetic";
}
