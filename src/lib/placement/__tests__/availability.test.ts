import { describe, expect, it } from "vitest";
import {
  isPlacementEntryRouteAvailable,
  isPlacementV3RouteAvailable,
} from "@/lib/placement/availability";

describe("placement route availability", () => {
  it("keeps /placement reachable regardless of legacy build-time flags", () => {
    expect(
      isPlacementEntryRouteAvailable({
        PLACEMENT_TEST_ENABLED: false,
        PLACEMENT_V3_UI_ENABLED: false,
      }),
    ).toBe(true);
    expect(
      isPlacementEntryRouteAvailable({
        PLACEMENT_TEST_ENABLED: true,
        PLACEMENT_V3_UI_ENABLED: false,
      }),
    ).toBe(true);
    expect(
      isPlacementEntryRouteAvailable({
        PLACEMENT_TEST_ENABLED: false,
        PLACEMENT_V3_UI_ENABLED: true,
      }),
    ).toBe(true);
  });

  it("keeps V3 routes always available per Chau's June 12 product decision", () => {
    expect(
      isPlacementV3RouteAvailable({
        PLACEMENT_TEST_ENABLED: false,
        PLACEMENT_V3_UI_ENABLED: false,
      }),
    ).toBe(true);
    expect(
      isPlacementV3RouteAvailable({
        PLACEMENT_TEST_ENABLED: true,
        PLACEMENT_V3_UI_ENABLED: false,
      }),
    ).toBe(true);
    expect(
      isPlacementV3RouteAvailable({
        PLACEMENT_TEST_ENABLED: false,
        PLACEMENT_V3_UI_ENABLED: true,
      }),
    ).toBe(true);
  });
});
