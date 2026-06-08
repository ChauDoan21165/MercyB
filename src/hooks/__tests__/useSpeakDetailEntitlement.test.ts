import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Session } from "@supabase/supabase-js";
import { useSpeakDetailEntitlement } from "../useSpeakDetailEntitlement";

const getMeEntitlement = vi.hoisted(() => vi.fn());
vi.mock("@/lib/getMeEntitlement", () => ({ getMeEntitlement }));

const sessionWith = (token: string | null) =>
  (token ? { access_token: token } : null) as unknown as Session | null;

beforeEach(() => vi.clearAllMocks());

describe("useSpeakDetailEntitlement", () => {
  it("returns false and makes NO network call when the gate is disabled", async () => {
    const { result } = renderHook(() =>
      useSpeakDetailEntitlement(sessionWith("tok"), false),
    );
    expect(result.current).toBe(false);
    expect(getMeEntitlement).not.toHaveBeenCalled();
  });

  it("returns false and makes NO network call when there is no session", () => {
    renderHook(() => useSpeakDetailEntitlement(sessionWith(null), true));
    expect(getMeEntitlement).not.toHaveBeenCalled();
  });

  it("is fail-closed (false) when the entitlement fetch errors", async () => {
    getMeEntitlement.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() =>
      useSpeakDetailEntitlement(sessionWith("tok"), true),
    );
    await waitFor(() => expect(getMeEntitlement).toHaveBeenCalled());
    expect(result.current).toBe(false);
  });

  it("reports premium for an active subscription", async () => {
    getMeEntitlement.mockResolvedValue({ is_premium: true, status: "active" });
    const { result } = renderHook(() =>
      useSpeakDetailEntitlement(sessionWith("tok"), true),
    );
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("treats an active trial as entitled (trial-inclusive)", async () => {
    getMeEntitlement.mockResolvedValue({ is_premium: true, status: "trialing" });
    const { result } = renderHook(() =>
      useSpeakDetailEntitlement(sessionWith("tok"), true),
    );
    await waitFor(() => expect(result.current).toBe(true));
  });

  it("is not premium for a non-premium response", async () => {
    getMeEntitlement.mockResolvedValue({ is_premium: false, status: "inactive" });
    const { result } = renderHook(() =>
      useSpeakDetailEntitlement(sessionWith("tok"), true),
    );
    await waitFor(() => expect(getMeEntitlement).toHaveBeenCalled());
    expect(result.current).toBe(false);
  });
});
