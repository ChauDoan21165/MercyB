// @vitest-environment node

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the supabase client BEFORE importing the module under test.
const getSession = vi.fn();
const signInAnonymously = vi.fn();
const featureFlagSelect = {
  select: vi.fn(),
  eq: vi.fn(),
  maybeSingle: vi.fn(),
};
const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: (...args: unknown[]) => getSession(...args),
      signInAnonymously: (...args: unknown[]) => signInAnonymously(...args),
    },
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

// Build the chained-builder shape Supabase exposes:
//   supabase.from("feature_flags").select(...).eq(...).maybeSingle()
function makeFlagBuilder(value: { is_enabled?: boolean } | null, error?: Error) {
  const maybeSingle = vi.fn().mockResolvedValue({ data: value, error: error ?? null });
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  return { select, eq, maybeSingle };
}

import { bootstrapAnonymousSession } from "../anonymousBootstrap";

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("bootstrapAnonymousSession", () => {
  it("skips when a session already exists in localStorage", async () => {
    getSession.mockResolvedValue({ data: { session: { user: { id: "u-1" } } } });
    const result = await bootstrapAnonymousSession();
    expect(result).toEqual({ kind: "skipped", reason: "session_exists" });
    expect(signInAnonymously).not.toHaveBeenCalled();
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("skips when the feature flag is OFF", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const builder = makeFlagBuilder({ is_enabled: false });
    fromMock.mockReturnValue({ select: builder.select });

    const result = await bootstrapAnonymousSession();
    expect(result).toEqual({ kind: "skipped", reason: "flag_off" });
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it("skips when the flag row is missing (defaults to OFF)", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const builder = makeFlagBuilder(null);
    fromMock.mockReturnValue({ select: builder.select });

    const result = await bootstrapAnonymousSession();
    expect(result.kind).toBe("skipped");
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it("skips when the flag fetch errors (defaults to OFF, never crashes)", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const builder = makeFlagBuilder(null, new Error("rls_denied"));
    fromMock.mockReturnValue({ select: builder.select });

    const result = await bootstrapAnonymousSession();
    expect(result.kind).toBe("skipped");
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it("calls signInAnonymously when no session and flag is ON", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const builder = makeFlagBuilder({ is_enabled: true });
    fromMock.mockReturnValue({ select: builder.select });
    signInAnonymously.mockResolvedValue({
      data: { user: { id: "anon-uuid-1" } },
      error: null,
    });

    const result = await bootstrapAnonymousSession();
    expect(signInAnonymously).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ kind: "anon_created", userId: "anon-uuid-1" });
  });

  it("returns error when signInAnonymously fails (provider disabled in dashboard)", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const builder = makeFlagBuilder({ is_enabled: true });
    fromMock.mockReturnValue({ select: builder.select });
    signInAnonymously.mockResolvedValue({
      data: null,
      error: { message: "anonymous_provider_disabled" },
    });

    const result = await bootstrapAnonymousSession();
    expect(result).toEqual({
      kind: "error",
      message: "anonymous_provider_disabled",
    });
  });

  it("returns error when signInAnonymously response is missing user_id", async () => {
    getSession.mockResolvedValue({ data: { session: null } });
    const builder = makeFlagBuilder({ is_enabled: true });
    fromMock.mockReturnValue({ select: builder.select });
    signInAnonymously.mockResolvedValue({ data: { user: null }, error: null });

    const result = await bootstrapAnonymousSession();
    expect(result.kind).toBe("error");
  });

  it("never throws — wraps unexpected exceptions and returns error result", async () => {
    getSession.mockRejectedValue(new Error("network down"));

    const result = await bootstrapAnonymousSession();
    expect(result).toEqual({ kind: "error", message: "network down" });
  });
});
