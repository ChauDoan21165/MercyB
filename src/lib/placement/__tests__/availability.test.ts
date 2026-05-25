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
      }),
    ).toBe(false);
    expect(
      isPlacementEntryRouteAvailable({
        PLACEMENT_TEST_ENABLED: true,
      }),
    ).toBe(true);
  });

  it("post-v2-retirement: V3 route availability is an alias of entry availability", () => {
    // Pre-retirement this gate required both flags. Post-retirement v3
    // is the only placement path, so V3 route availability collapses
    // to the entry check. The PLACEMENT_V3_UI_ENABLED flag is now
    // vestigial (kept in featureFlags.ts for a follow-up cleanup PR).
    expect(
      isPlacementV3RouteAvailable({
        PLACEMENT_TEST_ENABLED: false,
      }),
    ).toBe(false);
    expect(
      isPlacementV3RouteAvailable({
        PLACEMENT_TEST_ENABLED: true,
      }),
    ).toBe(true);
  });
});
