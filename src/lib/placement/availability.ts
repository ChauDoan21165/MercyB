import { FEATURE_FLAGS } from "@/lib/featureFlags";

type PlacementAvailabilityFlags = Pick<
  typeof FEATURE_FLAGS,
  "PLACEMENT_TEST_ENABLED"
>;

export function isPlacementEntryRouteAvailable(
  flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return flags.PLACEMENT_TEST_ENABLED;
}

/**
 * Post-v2-retirement: v3 IS the placement path. The historical
 * `PLACEMENT_V3_UI_ENABLED` flag is vestigial (still defined in
 * featureFlags.ts for a follow-up cleanup PR) and no longer gates
 * anything; this function is an alias of `isPlacementEntryRouteAvailable`.
 * Kept as a separate symbol so callers don't churn — `AppRouter.tsx`
 * + `PlacementV3Gate` continue to read it.
 */
export function isPlacementV3RouteAvailable(
  flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return isPlacementEntryRouteAvailable(flags);
}
