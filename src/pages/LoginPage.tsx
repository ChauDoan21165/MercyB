// src/pages/LoginPage.tsx
// MB-BLUE-101.3f — 2026-01-11 (+0700)
//
// FIX:
// - STOP forcing everyone to /admin after sign-in.
// - OAuth redirect returns to /signin (not /admin), then we route based on profile admin flags.
// - After sign-in/session established: admin -> /admin, normal -> returnTo (safe) or /
//
// NOTE:
// - This relies on public.profiles having is_admin/admin_level (your useUserAccess does).
// - If profiles row doesn't exist yet for a new OAuth user, we treat them as non-admin.
//
// PATCHES carried forward:
// - Session Status bar (Signed in / Signed out) + User ID + "Sign out" + "Log session" helper.
// - returnTo security: absolute URLs allowed ONLY if same-origin.
// - OAuth non-silent: if signInWithOAuth returns data.url, force window.location.assign(data.url).
// - Env flags via readBoolEnv()
// - Right brand overlay is IMAGE ONLY: /brand/mercy_wordmark.png

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

import { UI } from "./login/loginUi";
import { MarketingPanel } from "./login/MarketingPanel";
import { RecoverySetPassword } from "./login/RecoverySetPassword";
import { PhoneOtp } from "./login/PhoneOtp";
import { EmailBlock } from "./login/EmailBlock";

import {
  ensureSessionOrThrow,
  parseHashParams,
  readBoolEnv,
  readOAuthErrorFromSearch,
  resolveAppFromReturnTo,
  safeParseReturnTo,
  toSafeAppPath,
  humanizeAuthError,
} from "./login/loginUtils";

type TopMode = "email" | "phone" | "google" | "facebook";

type AdminFlags = {
  isAdmin: boolean;
  adminLevel: number;
};

async function fetchAdminFlagsPreferEmail(args: {
  userId: string;
  email: string | null;
}): Promise<AdminFlags> {
  const { userId, email } = args;

  // Treat missing profile row as non-admin.
  const fallback: AdminFlags = { isAdmin: false, adminLevel: 0 };

  try {
    // Prefer lookup by email (more stable across OAuth identity edge cases),
    // then fall back to id if needed.
    if (email) {
      const { data, error } = await supabase
        .from("profiles")
        .select("is_admin, admin_level")
        .eq("email", email)
        .maybeSingle();

      if (!error && data) {
        const lvl = Number((data as any).admin_level || 0) || 0;
        const isAdmin = Boolean((data as any).is_admin) || lvl >= 1;
        return { isAdmin, adminLevel: lvl };
      }
    }

    const { data: dataById, error: errById } = await supabase
      .from("profiles")
      .select("is_admin, admin_level")
      .eq("id", userId)
      .maybeSingle();

    if (!errById && dataById) {
      const lvl = Number((dataById as any).admin_level || 0) || 0;
      const isAdmin = Boolean((dataById as any).is_admin) || lvl >= 1;
      return { isAdmin, adminLevel: lvl };
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export default function LoginPage() {
  const nav = useNavigate();

  // BUILD STAMP (DEV): helps prove you are running the newest bundle.
  // Change this string if you want a new “stamp”.
  const BUILD_STAMP = "MB-BLUE-101.3f-login-oauth-debug-1";

  const returnToRaw = useMemo(() => safeParseReturnTo(window.location.search || ""), []);
  const fromApp = useMemo(() => resolveAppFromReturnTo(returnToRaw), [returnToRaw]);

  // IMPORTANT: do NOT memoize env flags with [] — it can “freeze” values under HMR/soft reloads.
  const AUTH_GOOGLE_ENABLED = readBoolEnv("VITE_AUTH_GOOGLE_ENABLED");
  const AUTH_FACEBOOK_ENABLED = readBoolEnv("VITE_AUTH_FACEBOOK_ENABLED");
  const IS_DEV = import.meta.env.DEV;

  useEffect(() => {
    if (!IS_DEV) return;

    // eslint-disable-next-line no-console
    console.log("[MB] OAuth flags from import.meta.env:", {
      google: import.meta.env.VITE_AUTH_GOOGLE_ENABLED,
      facebook: import.meta.env.VITE_AUTH_FACEBOOK_ENABLED,
      mode: import.meta.env.MODE,
      dev: import.meta.env.DEV,
    });

    // DEBUG (safe): prove what readBoolEnv computes vs raw import.meta.env.
    // Remove after confirmed.
    // eslint-disable-next-line no-console
    console.log("[MB] readBoolEnv() computed:", {
      google: readBoolEnv("VITE_AUTH_GOOGLE_ENABLED"),
      facebook: readBoolEnv("VITE_AUTH_FACEBOOK_ENABLED"),
    });

    // eslint-disable-next-line no-console
    console.log("[MB] raw import.meta.env values:", {
      google: (import.meta as any).env?.VITE_AUTH_GOOGLE_ENABLED,
      facebook: (import.meta as any).env?.VITE_AUTH_FACEBOOK_ENABLED,
      keys: Object.keys((import.meta as any).env || {}).filter((k) => k.includes("VITE_AUTH")),
    });
  }, [IS_DEV, AUTH_GOOGLE_ENABLED, AUTH_FACEBOOK_ENABLED]);

  const redirectToOAuthReturn = useMemo(() => `${window.location.origin}/signin`, []);
  const redirectToRecovery = useMemo(() => `${window.location.origin}/signin?recovery=1`, []);

  const DEFAULT_USER_ROUTE = "/";
  const ADMIN_ROUTE = "/admin";

  const safeReturnPath = useMemo(() => toSafeAppPath(returnToRaw), [returnToRaw]);

  async function routeAfterAuth() {
    const session = await ensureSessionOrThrow();
    const userId = session.user.id;
    const email = (session.user.email as string) || null;

    const { isAdmin } = await fetchAdminFlagsPreferEmail({ userId, email });

    const target = isAdmin ? ADMIN_ROUTE : safeReturnPath || DEFAULT_USER_ROUTE;
    nav(target, { replace: true });
  }

  const [topMode, setTopMode] = useState<TopMode>("email");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const [recoveryReady, setRecoveryReady] = useState(false);
  const [recoveryMsg, setRecoveryMsg] = useState<string | null>(null);

  const [isNarrow, setIsNarrow] = useState(false);

  const [hasSession, setHasSession] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionUserId, setSessionUserId] = useState<string | null>(null);

  useEffect(() => {
    function onResize() {
      setIsNarrow(window.innerWidth < 980);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    let alive = true;

    async function bootSessionFlag() {
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      const s = data?.session;
      setHasSession(Boolean(s));
      setSessionEmail((s?.user?.email as string) || null);
      setSessionUserId((s?.user?.id as string) || null);
    }

    bootSessionFlag();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!alive) return;
      setHasSession(Boolean(session));
      setSessionEmail((session?.user?.email as string) || null);
      setSessionUserId((session?.user?.id as string) || null);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  async function signOutNow() {
    setBusy(true);
    setStatus(null);
    try {
      await supabase.auth.signOut();
      nav("/signin", { replace: true });
    } catch (e: any) {
      setStatus(e?.message || "Sign out failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    const oauthErr = readOAuthErrorFromSearch(window.location.search || "");
    if (!oauthErr) return;

    const lines = [
      "OAuth sign-in failed.",
      oauthErr.error ? `error: ${oauthErr.error}` : "",
      oauthErr.desc ? `details: ${oauthErr.desc}` : "",
    ].filter(Boolean);

    setStatus(lines.join("\n"));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootRecoveryIfNeeded() {
      try {
        const qp = new URLSearchParams(window.location.search || "");
        const wantRecovery = qp.get("recovery") === "1";

        const h = parseHashParams(window.location.hash || "");
        const isRecoveryHash = h.type === "recovery" || h.type === "signup";

        if (h.access_token && h.refresh_token && (h.type === "recovery" || wantRecovery || isRecoveryHash)) {
          const { error } = await supabase.auth.setSession({
            access_token: h.access_token,
            refresh_token: h.refresh_token,
          });
          if (error) {
            if (!cancelled) setRecoveryMsg(error.message);
            return;
          }
          if (!cancelled) {
            setRecoveryReady(true);
            setTopMode("email");
          }
        }
      } catch (e: any) {
        if (!cancelled) setRecoveryMsg(e?.message || "Recovery error");
      }
    }

    bootRecoveryIfNeeded();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let alive = true;

    async function bootIfAlreadySignedIn() {
      try {
        const { data } = await supabase.auth.getSession();
        if (!alive) return;
        if (data?.session?.user?.id) {
          await routeAfterAuth();
        }
      } catch {
        // ignore
      }
    }

    bootIfAlreadySignedIn();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signInGoogle() {
    setBusy(true);
    setStatus(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectToOAuthReturn },
      });

      if (error) {
        setStatus(humanizeAuthError(error, "password_signin"));
        return;
      }

      if (data?.url) window.location.assign(data.url);
      else setStatus("Google sign-in did not return a redirect URL.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, "password_signin"));
    } finally {
      setBusy(false);
    }
  }

  async function signInFacebook() {
    setBusy(true);
    setStatus(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: { redirectTo: redirectToOAuthReturn },
      });

      if (error) {
        setStatus(humanizeAuthError(error, "password_signin"));
        return;
      }

      if (data?.url) window.location.assign(data.url);
      else setStatus("Facebook sign-in did not return a redirect URL.");
    } catch (e: any) {
      setStatus(humanizeAuthError(e, "password_signin"));
    } finally {
      setBusy(false);
    }
  }

  const pageStyle: React.CSSProperties = isNarrow ? { ...UI.page, gridTemplateColumns: "1fr" } : UI.page;
  const anyOAuthEnabled = AUTH_GOOGLE_ENABLED || AUTH_FACEBOOK_ENABLED;

  return (
    <div style={pageStyle}>
      <div style={UI.left}>
        <div style={UI.card}>
          <h1 style={UI.title}>Sign in</h1>
          <p style={UI.subtitle}>Choose a sign-in method. After signing in, we’ll take you to the right place.</p>

          <div style={UI.block}>
            {hasSession ? (
              <>
                <div style={{ fontWeight: 950, fontSize: 13, marginBottom: 6 }}>
                  ✅ Signed in{sessionEmail ? ` as ${sessionEmail}` : ""}.
                </div>

                {sessionUserId && (
                  <div style={{ ...UI.small, marginBottom: 10 }}>
                    User ID: <code>{sessionUserId}</code>
                  </div>
                )}

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    onClick={signOutNow}
                    disabled={busy}
                    style={{ ...UI.primaryBtn(busy), width: "auto", flex: "1 1 180px" }}
                  >
                    {busy ? "Please wait..." : "Sign out"}
                  </button>

                  <button
                    type="button"
                    disabled={busy}
                    onClick={async () => {
                      const { data } = await supabase.auth.getSession();
                      // eslint-disable-next-line no-console
                      console.log("[MB] session:", data?.session);
                    }}
                    style={{ ...UI.ghostBtn(busy), flex: "1 1 180px" }}
                    title="Print session object in DevTools"
                  >
                    Log session
                  </button>
                </div>
              </>
            ) : (
              <div style={{ fontWeight: 950, fontSize: 13 }}>🔒 Signed out — please sign in.</div>
            )}
          </div>

          <div style={UI.ecosystemBlock}>
            <p style={UI.ecosystemTitle}>Mercy Account</p>
            <p style={UI.ecosystemText}>One sign-in for all Mercy apps.</p>

            {fromApp ? (
              <p style={UI.ecosystemText}>
                You’re signing in to continue to <b>{fromApp.label}</b>.
              </p>
            ) : null}

            <div style={UI.ecosystemText as React.CSSProperties}>
              Apps in the Mercy ecosystem (for now):
              <ul style={{ margin: "6px 0 0 18px" }}>
                <li>Mercy AI Builder</li>
                <li>Mercy Signal</li>
              </ul>
            </div>

            {safeReturnPath ? (
              <div style={{ marginTop: 8, ...UI.small }}>
                After sign-in you’ll continue to: <code>{safeReturnPath}</code>
              </div>
            ) : null}
          </div>

          {IS_DEV && (
            <div style={{ marginTop: 8, ...UI.small }}>
              OAuth flags: Google=<b>{String(AUTH_GOOGLE_ENABLED)}</b> • Facebook=<b>{String(AUTH_FACEBOOK_ENABLED)}</b>
              <div style={{ marginTop: 4, opacity: 0.8 }}>
                Build: <code>{BUILD_STAMP}</code>
              </div>
            </div>
          )}

          {recoveryReady ? (
            <>
              <RecoverySetPassword
                busyParent={busy}
                onDone={() => {
                  // keep wiring identical to before
                  void (async () => {
                    try {
                      await ensureSessionOrThrow();
                      await routeAfterAuth();
                    } catch {
                      // keep user on page
                    }
                  })();
                }}
              />
              {recoveryMsg && <div style={UI.status}>{recoveryMsg}</div>}
            </>
          ) : (
            <>
              {anyOAuthEnabled && (
                <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {AUTH_GOOGLE_ENABLED && (
                    <button
                      onClick={signInGoogle}
                      disabled={busy}
                      style={{ ...UI.primaryBtn(busy), width: "auto", flex: "1 1 200px" }}
                    >
                      {busy ? "Please wait..." : "Continue with Google"}
                    </button>
                  )}

                  {AUTH_FACEBOOK_ENABLED && (
                    <button
                      onClick={signInFacebook}
                      disabled={busy}
                      style={{ ...UI.primaryBtn(busy), width: "auto", flex: "1 1 200px" }}
                    >
                      {busy ? "Please wait..." : "Continue with Facebook"}
                    </button>
                  )}
                </div>
              )}

              <div style={UI.divider}>
                <span style={UI.hr} />
                <span>OR</span>
                <span style={UI.hr} />
              </div>

              <div style={UI.segRow}>
                <button onClick={() => setTopMode("email")} disabled={busy} style={UI.segBtn(topMode === "email", busy)}>
                  ✉️ Email
                </button>
                <button onClick={() => setTopMode("phone")} disabled={busy} style={UI.segBtn(topMode === "phone", busy)}>
                  📱 Phone
                </button>
              </div>

              {topMode === "email" && (
                <EmailBlock
                  emailRedirectTo={redirectToOAuthReturn}
                  redirectToRecovery={redirectToRecovery}
                  busyParent={busy}
                  onAuthed={routeAfterAuth}
                />
              )}

              {topMode === "phone" && (
                <PhoneOtp redirectToOAuthReturn={redirectToOAuthReturn} busyParent={busy} onAuthed={routeAfterAuth} />
              )}

              {status && <div style={UI.status}>{status}</div>}
            </>
          )}

          <div
            style={{
              marginTop: 18,
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button onClick={() => nav("/")} style={UI.ghostBtn(busy)} disabled={busy}>
              ← Back to home
            </button>

            <div style={UI.small}>
              OAuth return: <code>{redirectToOAuthReturn}</code>
            </div>
          </div>
        </div>
      </div>

      {!isNarrow && <MarketingPanel />}
    </div>
  );
}

/** New thing to learn:
 * Anything inside /public is served from "/".
 * So: public/brand/mercy_wordmark.png  →  /brand/mercy_wordmark.png
 */
