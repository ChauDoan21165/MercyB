// Path: src/pages/LoginPage.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  ensureSessionOrThrow,
  fetchAdminFlagsSafe,
  humanizeAuthError,
} from "@/lib/authHelpers";
import {
  mapAuthRedirectError,
  readAuthRedirectError,
  readSearchFlag,
  resolveAppFromReturnTo,
  safeParseReturnTo,
  toSafeAppPath,
} from "@/lib/authRedirect";
import { UI } from "@/components/auth/authUI";
import { AppleSignInButton } from "@/components/auth/AppleSignInButton";
import EmailBlock from "@/components/auth/EmailBlock";
import PhoneOtp from "@/components/auth/PhoneOtp";
import { useChromeT } from "@/lib/i18n/chromeLanguage";
import {
  isNativeAuthPlatform,
  signInWithNativeOAuth,
} from "@/lib/nativeOAuth";

type TopMode = "email" | "phone";
type NoticeTone = "success" | "info" | "error";
type AuthNotice = { tone: NoticeTone; message: string } | null;

function MercyRightBrandOverlayInline() {
  return (
    <div
      aria-label="Mercy brand overlay"
      style={{
        position: "absolute",
        top: 18,
        left: 18,
        right: 18,
        zIndex: 20,
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          pointerEvents: "none",
          borderRadius: 22,
          border: "1px solid rgba(0,0,0,0.10)",
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 22px 70px rgba(0,0,0,0.10)",
          padding: "14px 18px",
          // min(720px, 100%) is equivalent to maxWidth:720 + width:100% here,
          // but makes the "never wider than parent" constraint explicit so a
          // future edit can't accidentally drop the width:100% and break it.
          maxWidth: "min(720px, 100%)",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Same brand asset + delivery chain as the global hero band
            (AppRouter.tsx:558). AVIF (~4 KB) → WebP (~7 KB) → PNG (128 KB)
            fallback so login no longer pays the full PNG every pageview.
            Intrinsic 512×341 = CLS insurance; the style overrides display
            size (height 46). onError keeps the existing "hide on failure"
            resilience for the login surface. */}
        <picture>
          <source srcSet="/brand/mercy-blade-header.avif" type="image/avif" />
          <source srcSet="/brand/mercy-blade-header.webp" type="image/webp" />
          <img
            src="/brand/mercy-blade-header.png"
            alt="Mercy"
            width={512}
            height={341}
            decoding="async"
            loading="eager"
            style={{
              display: "block",
              height: 46,
              width: "auto",
              maxWidth: "min(520px, 80vw)",
              objectFit: "contain",
            }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </picture>
      </div>
    </div>
  );
}

function MarketingPanel() {
  return (
    <div style={UI.right}>
      <MercyRightBrandOverlayInline />
      <div style={UI.rightInner}>
        <div style={UI.quoteMark}>“</div>
        <div style={UI.rightHeadline}>
          A loyal, smart, and gentle companion — for real life.
        </div>
        <p style={UI.rightText}>
          Mercy Blade is part of the{" "}
          <b>Mercy — Serving Humanity App Ecosystem</b>.
          <br />
          We walk with you through health, emotions, money, relationships, work,
          and meaning — with calm clarity and practical steps you can use today.
          <br />
          <br />
          No pressure. No judgment. Just a steady companion.
        </p>
        <div style={{ height: 14 }} />
        <div style={UI.rightHeadline}>
          Người đồng hành thông minh và dịu dàng — cho đời sống thật.
        </div>
        <p style={UI.rightText}>
          Mercy Blade là một phần của{" "}
          <b>Hệ sinh thái ứng dụng Mercy — Phục vụ Nhân loại</b>.
          <br />
          Chúng tôi đồng hành cùng bạn trong sức khỏe, cảm xúc, tiền bạc, mối
          quan hệ, công việc và ý nghĩa sống.
        </p>
        <div style={UI.rightBadge}>
          🌈 Mercy Blade • Calm • Practical • Human
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const nav = useNavigate();
  const t = useChromeT();
  const search = window.location.search || "";

  const returnToRaw = useMemo(() => safeParseReturnTo(search), [search]);
  const safeReturnPath = useMemo(
    () => toSafeAppPath(returnToRaw),
    [returnToRaw],
  );
  const fromApp = useMemo(
    () => resolveAppFromReturnTo(returnToRaw),
    [returnToRaw],
  );
  const hash =
    typeof window !== "undefined" ? window.location.hash || "" : "";
  const authRedirectError = useMemo(
    () => readAuthRedirectError(search, hash),
    [search, hash],
  );

  const IS_DEV = import.meta.env.DEV;

  const redirectToOAuthReturn = useMemo(() => {
    const url = new URL(`${window.location.origin}/signin`);
    if (safeReturnPath) url.searchParams.set("returnTo", safeReturnPath);
    return url.toString();
  }, [safeReturnPath]);

  const redirectToRecovery = useMemo(() => {
    const url = new URL(`${window.location.origin}/reset-password`);
    if (safeReturnPath) url.searchParams.set("returnTo", safeReturnPath);
    return url.toString();
  }, [safeReturnPath]);

  const DEFAULT_USER_ROUTE = "/";
  const ADMIN_ROUTE = "/admin";

  const submitRef = useRef(false);
  const isSubmitting = useRef(false);
  const noticeRef = useRef<HTMLDivElement>(null);
  const liveTimer = useRef<number | null>(null);

  const [topMode, setTopMode] = useState<TopMode>("email");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<AuthNotice>(null);
  const [hasSession, setHasSession] = useState(false);
  const [sessionBooted, setSessionBooted] = useState(false);
  const [liveMessage, setLiveMessage] = useState("");

  // A30 — one announcer for the whole auth shell. EmailBlock / PhoneOtp
  // and non-error notices push status text here; screen readers then hear
  // "code sent" / "invalid password" / "signed in, redirecting" on every
  // path (audit A3 — these were previously silent on the primary forms).
  // Clear-then-set so an identical consecutive message (e.g. two failed
  // password attempts with the same error) is still re-announced; the
  // bilingual "VI\nEN" status collapses to one spoken line.
  const announce = useCallback((raw: string) => {
    const msg = raw.replace(/\s*\n\s*/g, " — ").trim();
    if (!msg) return;
    if (liveTimer.current) window.clearTimeout(liveTimer.current);
    setLiveMessage("");
    liveTimer.current = window.setTimeout(() => setLiveMessage(msg), 60);
  }, []);

  useEffect(
    () => () => {
      if (liveTimer.current) window.clearTimeout(liveTimer.current);
    },
    [],
  );

  // Layout collapse at <= 980px is handled entirely in CSS (see the <style>
  // block in the returned JSX). No runtime breakpoint state or resize
  // listener — the page paints correctly in the first frame, matches SSR
  // mental models, and avoids a layout thrash on browser resize.

  useEffect(() => {
    return () => {
      if (IS_DEV) console.groupEnd();
    };
  }, [IS_DEV]);

  useEffect(() => {
    let alive = true;

    async function bootSessionFlag(retry = 0) {
      try {
        const { data } = await supabase.auth.getSession();
        if (!alive) return;
        setHasSession(Boolean(data?.session));
        setSessionBooted(true);
      } catch (err) {
        console.error("[bootSessionFlag] error:", err);
        if (retry === 0 && alive) {
          setTimeout(() => void bootSessionFlag(1), 800);
        } else if (alive) {
          setSessionBooted(true);
        }
      }
    }

    void bootSessionFlag();

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      if (!alive) return;
      setHasSession(Boolean(session));
      setSessionBooted(true);
    });

    return () => {
      alive = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  // Native OAuth-callback deep links are handled app-wide by
  // <NativeDeepLinkListener> (Cat-4 M2). handleDeepLink() sets the
  // session globally; the onAuthStateChange subscription above then
  // flips hasSession and runs routeAfterAuth (preserving ?returnTo),
  // exactly as the removed page-scoped listener did. A single owner
  // also prevents the Apple PKCE code being exchanged twice.

  const routeAfterAuth = useCallback(async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    try {
      if (IS_DEV) console.group("[MB Auth] routeAfterAuth");
      const session = await ensureSessionOrThrow();
      const { isAdmin } = await fetchAdminFlagsSafe(session.user.id);
      const target = isAdmin ? ADMIN_ROUTE : safeReturnPath || DEFAULT_USER_ROUTE;
      nav(target, { replace: true });
    } catch (err) {
      console.error("[routeAfterAuth] failed:", err);
    } finally {
      isSubmitting.current = false;
      if (IS_DEV) console.groupEnd();
    }
  }, [IS_DEV, nav, safeReturnPath]);

  useEffect(() => {
    if (hasSession && sessionBooted && !authRedirectError) {
      void routeAfterAuth();
    }
  }, [hasSession, authRedirectError, routeAfterAuth, sessionBooted]);

  useEffect(() => {
    if (readSearchFlag(search, "logged_out")) {
      setNotice({ tone: "success", message: "✅ You’ve been signed out." });
    }
    if (readSearchFlag(search, "created")) {
      setNotice({
        tone: "success",
        message: "✅ Account created. You can sign in now.",
      });
    }
    if (readSearchFlag(search, "reset")) {
      setNotice({
        tone: "success",
        message: "✅ Password updated. You can sign in now.",
      });
    }
  }, [search]);

  useEffect(() => {
    const mapped = mapAuthRedirectError(authRedirectError);
    if (!mapped) return;
    // VI-first per house style; EN underneath for non-Vietnamese users.
    setNotice({ tone: "error", message: `${mapped.vi}\n${mapped.en}` });
  }, [authRedirectError]);

  useEffect(() => {
    if (notice?.tone === "error") {
      noticeRef.current?.focus();
    }
  }, [notice]);

  // Error notices are already moved-to via noticeRef.focus() above; route
  // the success/info notices (signed out, account created, code sent) —
  // previously silent (audit A6) — through the single live region.
  useEffect(() => {
    if (notice && notice.tone !== "error") announce(notice.message);
  }, [notice, announce]);

  const signInGoogle = useCallback(async () => {
    if (busy || submitRef.current) return;
    submitRef.current = true;
    setBusy(true);

    try {
      if (IS_DEV) console.group("[MB Auth] signInGoogle");
      if (isNativeAuthPlatform()) {
        await signInWithNativeOAuth({ provider: "google" });
      } else {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: redirectToOAuthReturn },
        });
        if (error) throw error;
        if (data?.url) window.location.assign(data.url);
      }
    } catch (e) {
      setNotice({
        tone: "error",
        message: humanizeAuthError(e, "password_signin"),
      });
    } finally {
      setBusy(false);
      setTimeout(() => {
        submitRef.current = false;
      }, 1200);
      if (IS_DEV) console.groupEnd();
    }
  }, [busy, IS_DEV, redirectToOAuthReturn]);

  const signInFacebook = useCallback(async () => {
    if (busy || submitRef.current) return;
    submitRef.current = true;
    setBusy(true);

    try {
      if (IS_DEV) console.group("[MB Auth] signInFacebook");
      if (isNativeAuthPlatform()) {
        await signInWithNativeOAuth({ provider: "facebook" });
      } else {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "facebook",
          options: { redirectTo: redirectToOAuthReturn },
        });
        if (error) throw error;
        if (data?.url) window.location.assign(data.url);
      }
    } catch (e) {
      setNotice({
        tone: "error",
        message: humanizeAuthError(e, "password_signin"),
      });
    } finally {
      setBusy(false);
      setTimeout(() => {
        submitRef.current = false;
      }, 1200);
      if (IS_DEV) console.groupEnd();
    }
  }, [busy, IS_DEV, redirectToOAuthReturn]);

  // Sign in with Apple — required by App Store guideline 4.8 when Google
  // and Facebook login are offered. Uses the shared nativeOAuth helper on
  // iOS so the OAuth redirect stays in-app (SFSafariViewController).
  const signInApple = useCallback(async () => {
    if (busy || submitRef.current) return;
    submitRef.current = true;
    setBusy(true);

    try {
      if (IS_DEV) console.group("[MB Auth] signInApple");
      if (isNativeAuthPlatform()) {
        await signInWithNativeOAuth({ provider: "apple" });
      } else {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "apple",
          options: { redirectTo: redirectToOAuthReturn },
        });
        if (error) throw error;
        if (data?.url) window.location.assign(data.url);
      }
    } catch (e) {
      setNotice({
        tone: "error",
        message: humanizeAuthError(e, "password_signin"),
      });
    } finally {
      setBusy(false);
      setTimeout(() => {
        submitRef.current = false;
      }, 1200);
      if (IS_DEV) console.groupEnd();
    }
  }, [busy, IS_DEV, redirectToOAuthReturn]);

  return (
    // translate="no" prevents Chrome/Google Translate from wrapping
    // React-managed auth text nodes and triggering removeChild NotFoundError
    // during signin state changes or OAuth redirects.
    //
    // PRIMARY mitigation is now <meta name="google" content="notranslate" />
    // in index.html (site-wide). This attribute stays as defence-in-depth in
    // case Chrome ever ignores the meta tag or a browser extension bypasses it.
    <div translate="no" className="mb-login-shell" style={UI.page}>
      {/* Responsive collapse: at <= 980px the two-column shell becomes a
          single column and the marketing panel is hidden via display:none.
          CSS-only — no runtime state, no flash on resize. */}
      <style>{`
        @media (max-width: 980px) {
          .mb-login-shell { grid-template-columns: 1fr !important; }
          .mb-login-marketing { display: none !important; }
        }
      `}</style>

      {/* A30 — single visually-hidden polite live region for the auth
          shell. Fed by announce() from EmailBlock / PhoneOtp / notices so
          SR users hear auth status on every path (audit A3 / A6). */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="auth-live-region"
      >
        {liveMessage}
      </div>

      <div style={UI.left}>
        <div style={UI.card}>
          <div style={{ marginBottom: 12 }}>
            <button
              type="button"
              onClick={() => nav("/")}
              disabled={busy}
              style={{
                ...UI.ghostBtn(busy),
                minWidth: 0,
                padding: "10px 14px",
              }}
            >
              {t({ vi: "← Về trang chủ", en: "← Back to home" })}
            </button>
          </div>

          <h1 style={UI.title}>Đăng nhập hoặc tạo tài khoản · Sign in or create account</h1>
          <p style={UI.subtitle}>
            Nhập email — chúng tôi sẽ gửi mã đăng nhập hoặc tạo tài khoản mới cho bạn · Enter your email — we&apos;ll send a code to sign you in or create your account
          </p>

          <div
            style={{
              ...UI.block,
              position: "sticky",
              top: 12,
              zIndex: 50,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
            }}
          >
            {hasSession ? (
              <div>
                <div style={{ fontWeight: 950, fontSize: 13, marginBottom: 6 }}>
                  {t({ vi: "✅ Đã đăng nhập.", en: "✅ Signed in." })}
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => void routeAfterAuth()}
                    disabled={busy}
                    style={UI.primaryBtn(busy)}
                  >
                    {t({ vi: "Tiếp tục", en: "Continue" })}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      supabase.auth.signOut().then(() => nav("/signin", { replace: true }))
                    }
                    disabled={busy}
                    style={UI.ghostBtn(busy)}
                  >
                    {t({ vi: "Đăng xuất", en: "Sign out" })}
                  </button>
                </div>
              </div>
            ) : sessionBooted ? (
              <div style={{ fontWeight: 950, fontSize: 13 }}>
                {t({
                  vi: "🔒 Đã đăng xuất — vui lòng đăng nhập.",
                  en: "🔒 Signed out — please sign in.",
                })}
              </div>
            ) : (
              <div style={{ fontWeight: 950, fontSize: 13 }}>
                {t({ vi: "Đang kiểm tra phiên đăng nhập…", en: "Checking session…" })}
              </div>
            )}
          </div>

          {notice && (
            <div
              ref={noticeRef}
              tabIndex={-1}
              style={
                notice.tone === "error"
                  ? {
                      marginTop: 12,
                      padding: 14,
                      borderRadius: 14,
                      background: "rgba(254,242,242,0.94)",
                      border: "1px solid rgba(239,68,68,0.20)",
                      color: "rgba(127,29,29,0.92)",
                    }
                  : {
                      marginTop: 12,
                      padding: 14,
                      borderRadius: 14,
                      background: "rgba(236,253,245,0.92)",
                      border: "1px solid rgba(16,185,129,0.20)",
                      color: "rgba(6,95,70,0.92)",
                    }
              }
            >
              {notice.message}
            </div>
          )}

          <div style={UI.ecosystemBlock}>
            <p style={UI.ecosystemTitle}>
              {t({ vi: "Tài khoản Mercy", en: "Mercy Account" })}
            </p>
            <p style={UI.ecosystemText}>
              {t({
                vi: "Một lần đăng nhập cho mọi ứng dụng Mercy.",
                en: "One sign-in for all Mercy apps.",
              })}
            </p>
            {fromApp && (
              <p style={UI.ecosystemText}>
                {t({
                  vi: "Bạn đang đăng nhập để tiếp tục tới ",
                  en: "You’re signing in to continue to ",
                })}
                <b>{fromApp.label}</b>.
              </p>
            )}
            {safeReturnPath && (
              <div style={{ marginTop: 8, ...UI.small }}>
                {t({ vi: "Sau khi đăng nhập: ", en: "After sign-in: " })}
                <code>{safeReturnPath}</code>
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <AppleSignInButton
              onClick={() => void signInApple()}
              disabled={busy}
              busy={busy}
            />

            <button
              type="button"
              onClick={() => void signInGoogle()}
              disabled={busy}
              style={UI.primaryBtn(busy)}
            >
              {busy
                ? t({ vi: "Vui lòng đợi...", en: "Please wait..." })
                : t({ vi: "Tiếp tục với Google", en: "Continue with Google" })}
            </button>

            <button
              type="button"
              onClick={() => void signInFacebook()}
              disabled={busy}
              style={UI.primaryBtn(busy)}
            >
              {busy
                ? t({ vi: "Vui lòng đợi...", en: "Please wait..." })
                : t({ vi: "Tiếp tục với Facebook", en: "Continue with Facebook" })}
            </button>
          </div>

          <div style={UI.divider}>
            <span style={UI.hr} />
            {t({ vi: "HOẶC", en: "OR" })}
            <span style={UI.hr} />
          </div>

          <div style={UI.segRow}>
            <button
              type="button"
              onClick={() => setTopMode("email")}
              disabled={busy}
              style={UI.segBtn(topMode === "email", busy)}
            >
              ✉️ Email
            </button>
            <button
              type="button"
              onClick={() => setTopMode("phone")}
              disabled={busy}
              style={UI.segBtn(topMode === "phone", busy)}
            >
              {t({ vi: "📱 Số điện thoại", en: "📱 Phone" })}
            </button>
          </div>

          {topMode === "email" && (
            <EmailBlock
              emailRedirectTo={redirectToOAuthReturn}
              redirectToRecovery={redirectToRecovery}
              busyParent={busy}
              onAuthed={routeAfterAuth}
              onAnnounce={announce}
              onSignupCreated={(createdEmail, message) =>
                setNotice({
                  tone: "success",
                  message: `${message}\n\nEmail: ${createdEmail}`,
                })
              }
            />
          )}

          {topMode === "phone" && (
            <PhoneOtp
              busyParent={busy}
              onAuthed={routeAfterAuth}
              onAnnounce={announce}
            />
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
            <button
              type="button"
              onClick={() => nav("/")}
              disabled={busy}
              style={UI.ghostBtn(busy)}
            >
              {t({ vi: "← Về trang chủ", en: "← Back to home" })}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-login-marketing" style={{ display: "contents" }}>
        <MarketingPanel />
      </div>
    </div>
  );
}
