import { FEATURE_FLAGS } from "@/lib/featureFlags";

type PlacementAvailabilityFlags = Pick<
  typeof FEATURE_FLAGS,
  "PLACEMENT_TEST_ENABLED" | "PLACEMENT_V3_UI_ENABLED"
>;

export function isPlacementEntryRouteAvailable(
  _flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return true;
}

/**
 * Chau's June 12 product decision: placement must be reachable at all
 * times for everyone. These helpers intentionally ignore the legacy
 * build-time flags; the flags remain defined for non-route consumers.
 */
export function isPlacementV3RouteAvailable(
  flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return isPlacementEntryRouteAvailable(flags);
}
