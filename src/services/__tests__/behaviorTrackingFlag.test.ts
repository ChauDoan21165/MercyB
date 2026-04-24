import { describe, it, expect, vi, beforeEach } from "vitest";

const mockMaybeSingle = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();

const chain: any = {
  select: (...args: unknown[]) => {
    mockSelect(...args);
    return chain;
  },
  eq: (...args: unknown[]) => {
    mockEq(...args);
    return chain;
  },
  maybeSingle: () => mockMaybeSingle(),
};

const mockFrom = vi.fn(() => chain);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

import {
  __resetTrackingFlagCacheForTests,
  isTrackingEnabled,
} from "../behaviorTrackingFlag";

const USER_IN_COHORT = "cohort-user";
const USER_NOT_IN_COHORT = "other-user";

function resetAll() {
  mockMaybeSingle.mockReset();
  mockEq.mockReset();
  mockSelect.mockReset();
  mockFrom.mockClear();
  __resetTrackingFlagCacheForTests();
}

describe("behaviorTrackingFlag.isTrackingEnabled", () => {
  beforeEach(resetAll);

  it("returns false when userId is missing", async () => {
    expect(await isTrackingEnabled(null)).toBe(false);
    expect(await isTrackingEnabled(undefined)).toBe(false);
    expect(await isTrackingEnabled("")).toBe(false);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns true when flag row has is_enabled=true globally", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { is_enabled: true, enabled_user_ids: [] },
      error: null,
    });
    expect(await isTrackingEnabled(USER_NOT_IN_COHORT)).toBe(true);
  });

  it("returns false when is_enabled=false AND user is not in cohort", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { is_enabled: false, enabled_user_ids: [] },
      error: null,
    });
    expect(await isTrackingEnabled(USER_NOT_IN_COHORT)).toBe(false);
  });

  it("returns true when user is in cohort even if global is_enabled=false", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { is_enabled: false, enabled_user_ids: [USER_IN_COHORT] },
      error: null,
    });
    expect(await isTrackingEnabled(USER_IN_COHORT)).toBe(true);
  });

  it("returns false when flag row is missing", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    expect(await isTrackingEnabled(USER_NOT_IN_COHORT)).toBe(false);
  });

  it("returns false when query errors out", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: null,
      error: { message: "network" },
    });
    expect(await isTrackingEnabled(USER_NOT_IN_COHORT)).toBe(false);
  });

  it("caches result per userId — second call skips Supabase", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { is_enabled: true, enabled_user_ids: [] },
      error: null,
    });
    expect(await isTrackingEnabled(USER_NOT_IN_COHORT)).toBe(true);
    expect(await isTrackingEnabled(USER_NOT_IN_COHORT)).toBe(true);
    expect(mockFrom).toHaveBeenCalledTimes(1);
  });
});
