import { describe, expect, it } from "vitest";

import {
  buildProfileProjection,
  profileProjectionNeedsSync,
} from "../entitlementProjection";

describe("entitlement profile projection", () => {
  it("projects an active provider subscription to the legacy display cache", () => {
    expect(
      buildProfileProjection({
        is_premium: true,
        status: "active",
        source: "stripe",
        expires_at: "2027-01-01T00:00:00.000Z",
      })
    ).toEqual({
      premium_status: "active",
      premium_expires_at: "2027-01-01T00:00:00.000Z",
      premium_source: "stripe",
      tier: "level9",
    });
  });

  it("demotes inactive and canceled entitlements to free display cache", () => {
    expect(
      buildProfileProjection({
        is_premium: false,
        status: "expired",
        source: "stripe",
        expires_at: "2027-01-01T00:00:00.000Z",
      })
    ).toEqual({
      premium_status: "inactive",
      premium_expires_at: null,
      premium_source: null,
      tier: "level0",
    });
  });

  it("detects lapsed profile projection drift", () => {
    const projection = buildProfileProjection({
      is_premium: true,
      status: "active",
      source: "stripe",
      expires_at: "2027-01-01T00:00:00.000Z",
    });

    expect(
      profileProjectionNeedsSync(
        {
          premium_status: "inactive",
          premium_expires_at: "2026-05-09T00:00:00.000Z",
          premium_source: null,
          tier: "level0",
        },
        projection
      )
    ).toBe(true);
  });
});
