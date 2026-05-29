import { FEATURE_FLAGS } from "@/lib/featureFlags";

type PlacementAvailabilityFlags = Pick<
  typeof FEATURE_FLAGS,
  "PLACEMENT_TEST_ENABLED" | "PLACEMENT_V3_UI_ENABLED"
>;

export function isPlacementEntryRouteAvailable(
  flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return flags.PLACEMENT_TEST_ENABLED || flags.PLACEMENT_V3_UI_ENABLED;
}

/**
 * Post-v2-retirement: v3 IS the placement path. Either the legacy
 * placement-test flag or the V3 UI flag may expose the route, so
 * production can enable V3 without reviving old v2 assumptions.
 */
export function isPlacementV3RouteAvailable(
  flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return isPlacementEntryRouteAvailable(flags);
}
