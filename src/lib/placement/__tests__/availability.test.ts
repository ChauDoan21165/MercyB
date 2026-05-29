import { describe, expect, it } from "vitest";
import {
  isPlacementEntryRouteAvailable,
  isPlacementV3RouteAvailable,
} from "@/lib/placement/availability";

describe("placement route availability", () => {
  it("matches the /placement entry gate", () => {
    expect(
      isPlacementEntryRouteAvailable({
        PLACEMENT_TEST_ENABLED: false,
        PLACEMENT_V3_UI_ENABLED: false,
      }),
    ).toBe(false);
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

  it("post-v2-retirement: V3 route availability can be enabled by either placement flag", () => {
    expect(
      isPlacementV3RouteAvailable({
        PLACEMENT_TEST_ENABLED: false,
        PLACEMENT_V3_UI_ENABLED: false,
      }),
    ).toBe(false);
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
