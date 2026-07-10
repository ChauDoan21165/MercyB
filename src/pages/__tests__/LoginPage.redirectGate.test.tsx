// LoginPage.redirectGate.test.tsx — regression for !2580.
//
// Bug: AuthProvider bootstraps an ANONYMOUS Supabase session on boot
// (signInAnonymously, no email_confirmed_at). LoginPage used to treat ANY raw
// session as signed-in (setHasSession(Boolean(session))), so the anon session
// fired routeAfterAuth and bounced a first-time visitor off /signin.
//
// Fix: gate hasSession on a VERIFIED session (email_confirmed_at present), the
// same rule AuthProvider.getVerifiedSession uses. This suite locks that:
//   - anonymous session present  → LoginPage renders and STAYS (no navigate)
//   - confirmed session present  → LoginPage REDIRECTS (navigate called)

import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, render, waitFor } from "@testing-library/react";

const nav = vi.fn();

const h = {
  session: null as unknown,
  authCb: null as null | ((evt: string, session: unknown) => void),
};

vi.mock("react-router-dom", () => ({ useNavigate: () => nav }));

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(async () => ({ data: { session: h.session } })),
      onAuthStateChange: (cb: (evt: string, session: unknown) => void) => {
        h.authCb = cb;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      },
    },
  },
}));

vi.mock("@/lib/authHelpers", () => ({
  // Always resolve a valid session so routeAfterAuth reaches navigate when it
  // (wrongly) fires — otherwise a null-session throw would mask a regression.
  ensureSessionOrThrow: vi.fn(async () =>
    h.session ?? {
      user: { id: "fallback", email_confirmed_at: "2026-01-01T00:00:00.000Z" },
    },
  ),
  fetchAdminFlagsSafe: vi.fn(async () => ({ isAdmin: false })),
  humanizeAuthError: vi.fn(() => ""),
}));

vi.mock("@/lib/nativeOAuth", () => ({
  isNativeAuthPlatform: () => false,
  signInWithNativeOAuth: vi.fn(),
}));

vi.mock("@/lib/i18n/chromeLanguage", () => ({
  // Resolve bilingual { vi, en } copy (and plain strings) to a renderable
  // string so the shallow render never chokes on an unresolved copy object.
  useChromeT: () => (v: unknown) =>
    v && typeof v === "object"
      ? String((v as { vi?: string; en?: string }).vi ??
          (v as { en?: string }).en ??
          "")
      : String(v ?? ""),
}));

// Light stubs for the auth-form children so the render stays shallow and free
// of native (Capacitor) / heavy deps — irrelevant to the redirect gate.
vi.mock("@/components/auth/AppleSignInButton", () => ({
  AppleSignInButton: () => <div data-testid="apple-signin" />,
}));
vi.mock("@/components/auth/EmailBlock", () => ({
  default: () => <div data-testid="email-block" />,
}));
vi.mock("@/components/auth/PhoneOtp", () => ({
  default: () => <div data-testid="phone-otp" />,
}));

import LoginPage from "@/pages/LoginPage";

const ANON_SESSION = {
  access_token: "anon-jwt",
  user: { id: "anon-1", email_confirmed_at: null, is_anonymous: true },
};
const CONFIRMED_SESSION = {
  access_token: "user-jwt",
  user: { id: "user-1", email_confirmed_at: "2026-01-01T00:00:00.000Z" },
};

beforeEach(() => {
  nav.mockClear();
  h.session = null;
  h.authCb = null;
});

describe("LoginPage — verified-session redirect gate (!2580)", () => {
  it("anonymous bootstrap session → renders and STAYS (no redirect), via getSession", async () => {
    h.session = ANON_SESSION;
    const { container } = render(<LoginPage />);

    // Let the boot effect's getSession() promise resolve.
    await act(async () => {
      await Promise.resolve();
    });

    expect(container.firstChild).toBeTruthy(); // it rendered
    expect(nav).not.toHaveBeenCalled(); // and stayed
  });

  it("anonymous session arriving via onAuthStateChange → still no redirect", async () => {
    h.session = null; // getSession sees nothing at first
    render(<LoginPage />);
    await act(async () => {
      await Promise.resolve();
    });

    // The async anon bootstrap lands after mount (the real bug path).
    await act(async () => {
      h.authCb?.("SIGNED_IN", ANON_SESSION);
      await Promise.resolve();
    });

    expect(nav).not.toHaveBeenCalled();
  });

  it("confirmed (email_confirmed_at) session → REDIRECTS (navigate called)", async () => {
    h.session = CONFIRMED_SESSION;
    render(<LoginPage />);

    await waitFor(() => expect(nav).toHaveBeenCalled());
    expect(nav).toHaveBeenCalledWith(expect.any(String), { replace: true });
  });
});
