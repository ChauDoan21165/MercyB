import type { SupabaseClient } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getUserTierContext,
  type UserTierContext,
  type VipKey,
} from "../auth";
import {
  entitlementToVipKey,
  fetchCurrentEntitlement,
} from "../authService";

vi.mock("../authService", () => ({
  entitlementToVipKey: vi.fn(),
  fetchCurrentEntitlement: vi.fn(),
}));

const mockedFetchCurrentEntitlement = vi.mocked(fetchCurrentEntitlement);
const mockedEntitlementToVipKey = vi.mocked(entitlementToVipKey);

function createSupabaseAuthMock(
  getUser: ReturnType<typeof vi.fn>,
): SupabaseClient {
  return {
    auth: {
      getUser,
    },
  } as unknown as SupabaseClient;
}

const safeLevel0: UserTierContext = {
  userId: null,
  vipKey: "level0",
  tierId: null,
  subscriptionStatus: null,
};

describe("getUserTierContext hardening", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedEntitlementToVipKey.mockImplementation((ent) => {
      if (!ent?.is_premium) return "level0";
      if (ent.tier_id === "level1") return "level1";
      if (ent.tier_id === "level9") return "level9";
      return "level3";
    });
  });

  it("imports the exported VipKey and UserTierContext types", () => {
    const vipKey: VipKey = "level3";
    const context: UserTierContext = {
      userId: "user-typed",
      vipKey,
      tierId: "level6",
      subscriptionStatus: "active",
    };

    expect(context).toEqual({
      userId: "user-typed",
      vipKey: "level3",
      tierId: "level6",
      subscriptionStatus: "active",
    });
  });

  it("returns safe level0 when Supabase reports no signed-in user", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: null },
        error: null,
      }),
    );

    await expect(getUserTierContext(supabase)).resolves.toEqual(safeLevel0);
    expect(mockedFetchCurrentEntitlement).not.toHaveBeenCalled();
    expect(mockedEntitlementToVipKey).not.toHaveBeenCalled();
  });

  it("returns safe level0 when getUser returns an auth error", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: { id: "user-error" } },
        error: { message: "JWT expired" },
      }),
    );

    await expect(getUserTierContext(supabase)).resolves.toEqual(safeLevel0);
    expect(mockedFetchCurrentEntitlement).not.toHaveBeenCalled();
  });

  it("returns safe level0 when getUser throws", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockRejectedValue(new Error("network unavailable")),
    );

    await expect(getUserTierContext(supabase)).resolves.toEqual(safeLevel0);
    expect(mockedFetchCurrentEntitlement).not.toHaveBeenCalled();
  });

  it("returns safe level0 when the authenticated user has no id", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: { id: "" } },
        error: null,
      }),
    );

    await expect(getUserTierContext(supabase)).resolves.toEqual(safeLevel0);
    expect(mockedFetchCurrentEntitlement).not.toHaveBeenCalled();
  });

  it("returns the authenticated user id and mapped entitlement fields", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: { id: "user-123" } },
        error: null,
      }),
    );
    const entitlement = {
      is_premium: true,
      source: "stripe",
      status: "active",
      expires_at: null,
      tier_id: "level1",
      plan_name: "Level 1 Monthly",
    };
    mockedFetchCurrentEntitlement.mockResolvedValueOnce(entitlement);

    await expect(getUserTierContext(supabase)).resolves.toEqual({
      userId: "user-123",
      vipKey: "level1",
      tierId: "level1",
      subscriptionStatus: "active",
    });
    expect(mockedFetchCurrentEntitlement).toHaveBeenCalledTimes(1);
    expect(mockedFetchCurrentEntitlement).toHaveBeenCalledWith(supabase);
    expect(mockedEntitlementToVipKey).toHaveBeenCalledWith(entitlement);
  });

  it("passes higher-tier mapped vip keys through without rewriting tier metadata", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: { id: "user-level9" } },
        error: null,
      }),
    );
    const entitlement = {
      is_premium: true,
      source: "stripe",
      status: "trialing",
      expires_at: null,
      tier_id: "level9",
      plan_name: "Annual",
    };
    mockedFetchCurrentEntitlement.mockResolvedValueOnce(entitlement);

    await expect(getUserTierContext(supabase)).resolves.toEqual({
      userId: "user-level9",
      vipKey: "level9",
      tierId: "level9",
      subscriptionStatus: "trialing",
    });
  });

  it("normalizes missing entitlement metadata to null while preserving user id", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: { id: "user-free" } },
        error: null,
      }),
    );
    mockedFetchCurrentEntitlement.mockResolvedValueOnce({
      is_premium: false,
      source: null,
      status: "inactive",
      expires_at: null,
    });

    await expect(getUserTierContext(supabase)).resolves.toEqual({
      userId: "user-free",
      vipKey: "level0",
      tierId: null,
      subscriptionStatus: "inactive",
    });
  });

  it("fails closed to level0 entitlement state when entitlement fetch rejects", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: { id: "user-fetch-error" } },
        error: null,
      }),
    );
    mockedFetchCurrentEntitlement.mockRejectedValueOnce(
      new Error("edge function timeout"),
    );

    await expect(getUserTierContext(supabase)).resolves.toEqual({
      userId: "user-fetch-error",
      vipKey: "level0",
      tierId: null,
      subscriptionStatus: null,
    });
    expect(mockedEntitlementToVipKey).toHaveBeenCalledWith(null);
  });

  it("treats a null entitlement response as signed-in but unpaid", async () => {
    const supabase = createSupabaseAuthMock(
      vi.fn().mockResolvedValue({
        data: { user: { id: "user-no-entitlement" } },
        error: null,
      }),
    );
    mockedFetchCurrentEntitlement.mockResolvedValueOnce(null);

    await expect(getUserTierContext(supabase)).resolves.toEqual({
      userId: "user-no-entitlement",
      vipKey: "level0",
      tierId: null,
      subscriptionStatus: null,
    });
    expect(mockedEntitlementToVipKey).toHaveBeenCalledWith(null);
  });
});
