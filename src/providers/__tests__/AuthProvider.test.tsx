import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

// --- Supabase auth stub: deterministic onAuthStateChange + getSession. ---
type AuthCallback = (event: string, session: Session | null) => void;

let authCallback: AuthCallback | null = null;

// Factory is hoisted above module-scope consts, so the stubs are created
// inside it and re-read afterwards via the mocked module.
vi.mock("@/lib/supabaseClient", () => {
  const unsubscribe = vi.fn();
  return {
    supabase: {
      auth: {
        onAuthStateChange: vi.fn((cb: AuthCallback) => {
          authCallback = cb;
          return { data: { subscription: { unsubscribe } } };
        }),
        getSession: vi.fn(async () => ({
          data: { session: null },
          error: null,
        })),
        signOut: vi.fn(async () => ({ error: null })),
        _unsubscribe: unsubscribe,
      },
      rpc: vi.fn(async () => ({ data: null, error: null })),
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            maybeSingle: vi.fn(async () => ({ data: null, error: null })),
          })),
        })),
        update: vi.fn(() => ({ eq: vi.fn(async () => ({ error: null })) })),
      })),
    },
  };
});

// --- Fire-and-forget side-effect modules: no-op so the test stays hermetic. ---
vi.mock("@/lib/languagePair/anonymousPair", () => ({
  readAnonymousPair: vi.fn(() => null),
  clearAnonymousPair: vi.fn(),
}));
vi.mock("@/lib/auth/anonymousBootstrap", () => ({
  bootstrapAnonymousSession: vi.fn(async () => {}),
}));
vi.mock("@/lib/monitoring/sentryActivation", () => ({
  activateSentry: vi.fn(),
}));
vi.mock("@/lib/platform", () => ({ isNativePlatform: vi.fn(() => false) }));
vi.mock("@/lib/streakMigration", () => ({
  migrateLocalStreakOnce: vi.fn(async () => {}),
  writeBrowserTimezoneOnce: vi.fn(async () => {}),
}));
vi.mock("@/services/userSessions", () => ({
  heartbeatSession: vi.fn(async () => {}),
  logUserSession: vi.fn(async () => {}),
}));
vi.mock("@/lib/referral/referralClient", () => ({
  applyPendingReferralOnAuth: vi.fn(async () => {}),
  resetReferralRetryDedupe: vi.fn(),
  retryReferralRewardOnAuth: vi.fn(async () => {}),
}));

import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import { activateSentry } from "@/lib/monitoring/sentryActivation";
import { supabase } from "@/lib/supabaseClient";

const onAuthStateChange = vi.mocked(supabase.auth.onAuthStateChange);
const getSession = vi.mocked(supabase.auth.getSession);
const signOut = vi.mocked(supabase.auth.signOut);
const rpc = vi.mocked(supabase.rpc);
const unsubscribe = (supabase.auth as unknown as { _unsubscribe: () => void })
  ._unsubscribe as ReturnType<typeof vi.fn>;

function rpcSuccess<T>(data: T) {
  return {
    data,
    error: null,
    count: null,
    status: 200,
    statusText: "OK",
    success: true as const,
  };
}

function rpcFailure(message: string) {
  const error = {
    message,
    details: "",
    hint: "",
    code: "PGRST_TEST",
    name: "PostgrestError",
  };
  return {
    data: null,
    error: {
      ...error,
      toJSON: () => error,
    },
    count: null,
    status: 400,
    statusText: "Bad Request",
    success: false as const,
  };
}

function makeSession(over: Partial<Session["user"]> = {}): Session {
  return {
    access_token: "tok",
    refresh_token: "ref",
    expires_in: 3600,
    token_type: "bearer",
    user: {
      id: "user-1",
      email: "a@b.com",
      email_confirmed_at: "2026-01-01T00:00:00Z",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: "2026-01-01T00:00:00Z",
      ...over,
    },
  } as unknown as Session;
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    authCallback = null;
    onAuthStateChange.mockClear();
    getSession.mockClear();
    getSession.mockResolvedValue({ data: { session: null }, error: null });
    signOut.mockClear();
    signOut.mockResolvedValue({ error: null });
    rpc.mockClear();
    rpc.mockResolvedValue(rpcSuccess(null));
    unsubscribe.mockClear();
    sessionStorage.clear();
    vi.mocked(activateSentry).mockClear();
  });

  it("throws when useAuth is used outside the provider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      /must be used inside <AuthProvider>/,
    );
  });

  it("resolves to a deterministic signed-out state after boot", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
    expect(onAuthStateChange).toHaveBeenCalledTimes(1);
  });

  it("exposes a verified session pushed through onAuthStateChange", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(authCallback).not.toBeNull());

    const session = makeSession();
    act(() => authCallback!("SIGNED_IN", session));

    await waitFor(() => expect(result.current.user?.id).toBe("user-1"));
    expect(result.current.session).not.toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(activateSentry).toHaveBeenCalledWith("auth");
  });

  it("claims a pending family invite only after verified auth and confirmed RPC success", async () => {
    sessionStorage.setItem("mb:family-invite-token", "ABCDEF234567");
    rpc.mockResolvedValueOnce(rpcSuccess(true));
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(authCallback).not.toBeNull());

    act(() => authCallback!("SIGNED_IN", makeSession()));

    await waitFor(() =>
      expect(rpc).toHaveBeenCalledWith("mark_family_invite_signed_up", {
        p_token: "ABCDEF234567",
        p_referred_user_id: "user-1",
      }),
    );
    await waitFor(() => expect(result.current.user?.id).toBe("user-1"));
    expect(sessionStorage.getItem("mb:family-invite-token")).toBeNull();
  });

  it("does not claim a family invite for an unverified auth event", async () => {
    sessionStorage.setItem("mb:family-invite-token", "ABCDEF234567");
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(authCallback).not.toBeNull());

    act(() =>
      authCallback!("SIGNED_IN", makeSession({ email_confirmed_at: undefined })),
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(rpc).not.toHaveBeenCalledWith(
      "mark_family_invite_signed_up",
      expect.anything(),
    );
    expect(sessionStorage.getItem("mb:family-invite-token")).toBe(
      "ABCDEF234567",
    );
  });

  it("keeps a pending family invite token when the claim RPC transport fails", async () => {
    sessionStorage.setItem("mb:family-invite-token", "ABCDEF234567");
    rpc.mockResolvedValueOnce(rpcFailure("network unavailable"));
    renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(authCallback).not.toBeNull());

    act(() => authCallback!("SIGNED_IN", makeSession()));

    await waitFor(() =>
      expect(rpc).toHaveBeenCalledWith("mark_family_invite_signed_up", {
        p_token: "ABCDEF234567",
        p_referred_user_id: "user-1",
      }),
    );
    expect(sessionStorage.getItem("mb:family-invite-token")).toBe(
      "ABCDEF234567",
    );
  });

  it("treats an unverified-email session as signed-out", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(authCallback).not.toBeNull());

    const unverified = makeSession({ email_confirmed_at: undefined });
    act(() => authCallback!("SIGNED_IN", unverified));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("signOut clears the session and calls supabase.auth.signOut", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(authCallback).not.toBeNull());

    act(() => authCallback!("SIGNED_IN", makeSession()));
    await waitFor(() => expect(result.current.user?.id).toBe("user-1"));

    await act(async () => {
      await result.current.signOut();
    });

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(result.current.session).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("refreshSession reads the latest session from getSession", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    getSession.mockResolvedValueOnce({
      data: { session: makeSession() },
      error: null,
    });

    await act(async () => {
      await result.current.refreshSession();
    });

    expect(result.current.user?.id).toBe("user-1");
  });

  it("unsubscribes the auth listener on unmount", async () => {
    const { unmount } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(onAuthStateChange).toHaveBeenCalled());

    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
