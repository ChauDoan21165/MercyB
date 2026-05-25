import { FEATURE_FLAGS } from "@/lib/featureFlags";

type PlacementAvailabilityFlags = Pick<
  typeof FEATURE_FLAGS,
  "PLACEMENT_TEST_ENABLED" | "PLACEMENT_V3_UI_ENABLED"
>;

export function isPlacementEntryRouteAvailable(
  flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return flags.PLACEMENT_TEST_ENABLED;
}

export function isPlacementV3RouteAvailable(
  flags: PlacementAvailabilityFlags = FEATURE_FLAGS,
): boolean {
  return flags.PLACEMENT_TEST_ENABLED && flags.PLACEMENT_V3_UI_ENABLED;
}
