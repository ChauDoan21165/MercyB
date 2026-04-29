// Tests for the family-flow-through layer added to computeEntitlement.
// The existing happy-path test in src/billing/computeEntitlement.test.ts
// stays as-is — this file only exercises the new
// computeEntitlementForUser + isFamilyMember surface area.

import { describe, it, expect, vi } from "vitest";
import {
  computeEntitlementForUser,
  isFamilyMember,
  type FamilyEntitlementDeps,
  type FamilyMembership,
} from "../computeEntitlement";
import type { SubscriptionRow } from "../types";

const FUTURE = "2099-01-01T00:00:00.000Z";

function activeStripeSub(): SubscriptionRow {
  return {
    user_id: "owner-1",
    provider: "stripe",
    status: "active",
    current_period_end: FUTURE,
  };
}

function expiredStripeSub(): SubscriptionRow {
  return {
    user_id: "owner-1",
    provider: "stripe",
    status: "expired",
    current_period_end: "2020-01-01T00:00:00.000Z",
  };
}

function makeDeps(overrides: Partial<FamilyEntitlementDeps>): FamilyEntitlementDeps {
  return {
    getFamilyMembership: vi.fn().mockResolvedValue(null),
    getSubscriptions: vi.fn().mockResolvedValue([]),
    ...overrides,
  };
}

describe("isFamilyMember", () => {
  it("returns false for empty userId", async () => {
    expect(await isFamilyMember("", { getFamilyMembership: vi.fn() })).toBe(false);
  });

  it("returns false when no membership", async () => {
    const deps = { getFamilyMembership: vi.fn().mockResolvedValue(null) };
    expect(await isFamilyMember("u1", deps)).toBe(false);
  });

  it("returns false when membership is inactive", async () => {
    const deps = {
      getFamilyMembership: vi.fn<() => Promise<FamilyMembership>>().mockResolvedValue({
        family_plan_id: "p1",
        owner_user_id: "owner",
        active: false,
      }),
    };
    expect(await isFamilyMember("u1", deps)).toBe(false);
  });

  it("returns false when caller is the owner (no self-membership flow)", async () => {
    const deps = {
      getFamilyMembership: vi.fn<() => Promise<FamilyMembership>>().mockResolvedValue({
        family_plan_id: "p1",
        owner_user_id: "owner",
        active: true,
      }),
    };
    expect(await isFamilyMember("owner", deps)).toBe(false);
  });

  it("returns true when caller is an active non-owner member", async () => {
    const deps = {
      getFamilyMembership: vi.fn<() => Promise<FamilyMembership>>().mockResolvedValue({
        family_plan_id: "p1",
        owner_user_id: "owner",
        active: true,
      }),
    };
    expect(await isFamilyMember("u1", deps)).toBe(true);
  });

  it("returns false (fail closed) when loader throws", async () => {
    const deps = {
      getFamilyMembership: vi.fn().mockRejectedValue(new Error("boom")),
    };
    expect(await isFamilyMember("u1", deps)).toBe(false);
  });
});

describe("computeEntitlementForUser — own subs win", () => {
  it("returns own active entitlement without consulting family loader", async () => {
    const getFamilyMembership = vi.fn();
    const deps = makeDeps({
      getSubscriptions: vi.fn().mockResolvedValue([activeStripeSub()]),
      getFamilyMembership,
    });

    const result = await computeEntitlementForUser("u1", deps);
    expect(result).toEqual({
      status: "active",
      expires_at: FUTURE,
      source: "stripe",
      via_family: false,
      family_plan_id: null,
    });
    expect(getFamilyMembership).not.toHaveBeenCalled();
  });
});

describe("computeEntitlementForUser — family flow-through", () => {
  it("inactive own + active owner → returns owner entitlement with via_family", async () => {
    const deps = makeDeps({
      getSubscriptions: vi.fn(async (uid: string) => {
        if (uid === "u1") return [];
        if (uid === "owner") return [activeStripeSub()];
        return [];
      }),
      getFamilyMembership: vi.fn().mockResolvedValue({
        family_plan_id: "plan-A",
        owner_user_id: "owner",
        active: true,
      }),
    });

    const result = await computeEntitlementForUser("u1", deps);
    expect(result.status).toBe("active");
    expect(result.source).toBe("stripe");
    expect(result.expires_at).toBe(FUTURE);
    expect(result.via_family).toBe(true);
    expect(result.family_plan_id).toBe("plan-A");
  });

  it("inactive own + inactive owner → stays inactive", async () => {
    const deps = makeDeps({
      getSubscriptions: vi.fn(async () => [expiredStripeSub()]),
      getFamilyMembership: vi.fn().mockResolvedValue({
        family_plan_id: "plan-A",
        owner_user_id: "owner",
        active: true,
      }),
    });

    const result = await computeEntitlementForUser("u1", deps);
    expect(result.status).toBe("inactive");
    expect(result.via_family).toBe(false);
    expect(result.family_plan_id).toBeNull();
  });

  it("inactive own + no membership → inactive (no flow-through)", async () => {
    const deps = makeDeps({
      getSubscriptions: vi.fn().mockResolvedValue([]),
      getFamilyMembership: vi.fn().mockResolvedValue(null),
    });

    const result = await computeEntitlementForUser("u1", deps);
    expect(result.status).toBe("inactive");
    expect(result.via_family).toBe(false);
  });

  it("inactive own + inactive membership → inactive", async () => {
    const deps = makeDeps({
      getSubscriptions: vi.fn().mockResolvedValue([]),
      getFamilyMembership: vi.fn().mockResolvedValue({
        family_plan_id: "plan-A",
        owner_user_id: "owner",
        active: false,
      }),
    });

    const result = await computeEntitlementForUser("u1", deps);
    expect(result.status).toBe("inactive");
    expect(result.via_family).toBe(false);
  });
});

describe("computeEntitlementForUser — error handling (safe fallback)", () => {
  it("returns own entitlement when membership loader throws", async () => {
    const deps = makeDeps({
      getSubscriptions: vi.fn().mockResolvedValue([]),
      getFamilyMembership: vi.fn().mockRejectedValue(new Error("boom")),
    });

    const result = await computeEntitlementForUser("u1", deps);
    expect(result.status).toBe("inactive");
    expect(result.via_family).toBe(false);
  });

  it("returns own entitlement when owner-sub loader throws", async () => {
    const deps = makeDeps({
      getSubscriptions: vi.fn(async (uid: string) => {
        if (uid === "u1") return [];
        throw new Error("owner-sub-load-failed");
      }),
      getFamilyMembership: vi.fn().mockResolvedValue({
        family_plan_id: "plan-A",
        owner_user_id: "owner",
        active: true,
      }),
    });

    const result = await computeEntitlementForUser("u1", deps);
    expect(result.status).toBe("inactive");
    expect(result.via_family).toBe(false);
  });

  it("does not flow-through when caller IS the owner of the plan", async () => {
    // Owners are seeded as members of their own plan via the trigger.
    // computeEntitlementForUser must not fall back to its own subs as
    // "family" when the caller is the owner — that would double-count.
    const deps = makeDeps({
      getSubscriptions: vi.fn().mockResolvedValue([]),
      getFamilyMembership: vi.fn().mockResolvedValue({
        family_plan_id: "plan-A",
        owner_user_id: "owner",
        active: true,
      }),
    });

    const result = await computeEntitlementForUser("owner", deps);
    expect(result.status).toBe("inactive");
    expect(result.via_family).toBe(false);
  });
});
