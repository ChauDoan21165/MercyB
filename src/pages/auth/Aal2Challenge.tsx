/**
 * Path: src/pages/auth/Aal2Challenge.tsx
 *
 * Route: /auth/challenge
 *
 * The forced TOTP prompt. Users land here when:
 *   - Their session is at aal=1 AND
 *   - They have a verified TOTP factor AND
 *   - They tried to reach a route gated by RequireAal2
 *
 * On success the session JWT advances to aal=2; we redirect back to
 * the original `?next=` path. On cancel we sign the user out so the
 * dangling aal=1 session can't be reused via direct URL navigation.
 *
 * This page is the UX half of the aal=1 bypass fix from the security
 * review. The other half is migration 20260524 which adds the
 * "require_aal2_when_factor_present" RESTRICTIVE policy at the
 * database layer — that's the actual security boundary.
 */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import {
  challengeFactor,
  findFirstVerifiedTotp,
  humanizeMfaError,
  listMfaFactors,
  verifyChallenge,
} from "@/lib/security/mfaClient";

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "24px 16px 80px",
  display: "flex",
  justifyContent: "center",
};

const column: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

const cardStyle: React.CSSProperties = {
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: 22,
  background: "white",
  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
};

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 900,
  letterSpacing: -0.3,
  margin: 0,
  color: "rgba(10,10,10,0.94)",
};

const headingViStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  fontSize: 13,
  fontWeight: 500,
  color: "rgba(0,0,0,0.55)",
};

const bodyStyle: React.CSSProperties = {
  fontSize: 14,
  color: "rgba(0,0,0,0.72)",
  lineHeight: 1.55,
  margin: "0 0 4px",
};

const bodyViStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.50)",
  lineHeight: 1.5,
  margin: 0,
};

const codeInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: 4,
  textAlign: "center",
  borderRadius: 10,
  border: "1px solid #cbd5e1",
  outline: "none",
  fontVariantNumeric: "tabular-nums",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
};

const primaryBtn: React.CSSProperties = {
  background: "#111827",
  color: "white",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 22px",
  fontWeight: 700,
  fontSize: 14,
  border: "none",
  cursor: "pointer",
};

const ghostBtn: React.CSSProperties = {
  background: "white",
  color: "#475569",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 18px",
  fontWeight: 700,
  fontSize: 13,
  border: "1px solid rgba(0,0,0,0.12)",
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  marginTop: 14,
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid #fecaca",
  background: "#fef2f2",
  color: "#991b1b",
  fontSize: 13,
  lineHeight: 1.5,
};

/**
 * Pull a safe redirect target from `?next=`. Defaults to home and
 * rejects anything that doesn't start with `/` (so we can't be
 * coerced into bouncing to a different origin).
 */
function safeNext(searchParams: URLSearchParams): string {
  const raw = searchParams.get("next");
  if (!raw) return "/";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/";
  return raw;
}

export default function Aal2Challenge() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading } = useAuth();

  const [factorId, setFactorId] = useState<string | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorBilingual, setErrorBilingual] =
    useState<{ en: string; vi: string } | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);

  const next = safeNext(searchParams);

  // On mount: list factors → pick first verified TOTP → start challenge.
  // We do NOT trust the UI route guard alone — we re-verify here so a
  // direct visit to /auth/challenge by a user without MFA enrolled
  // doesn't sit forever waiting for input.
  useEffect(() => {
    if (authLoading || !user) return;
    let alive = true;
    (async () => {
      try {
        const factors = await listMfaFactors();
        const totp = findFirstVerifiedTotp(factors);
        if (!totp) {
          // User has no verified factor — they shouldn't be here. Bounce
          // them to the requested next path; the route guard will let
          // them through because needsAal2Upgrade() returns false.
          if (alive) navigate(next, { replace: true });
          return;
        }
        const challenge = await challengeFactor(totp.id);
        if (!alive) return;
        setFactorId(challenge.factorId);
        setChallengeId(challenge.challengeId);
      } catch (err) {
        if (!alive) return;
        const msg =
          err instanceof Error ? err.message : "Could not start MFA challenge.";
        setSetupError(msg);
      }
    })();
    return () => {
      alive = false;
    };
  }, [authLoading, user, navigate, next]);

  const onSubmit = useCallback(async () => {
    if (!factorId || !challengeId) return;
    if (!/^\d{6}$/.test(code)) {
      setErrorBilingual({
        en: "Enter the 6-digit code from your authenticator app.",
        vi: "Nhập mã 6 số từ ứng dụng xác thực.",
      });
      return;
    }
    setBusy(true);
    setErrorBilingual(null);
    try {
      await verifyChallenge(factorId, challengeId, code);
      // Session JWT now carries aal=aal2. Bounce to the originally
      // requested path. `replace` so the back button doesn't drop the
      // user back on the challenge page.
      navigate(next, { replace: true });
    } catch (err) {
      setErrorBilingual(humanizeMfaError(err));
      setBusy(false);
    }
  }, [factorId, challengeId, code, navigate, next]);

  // Cancel = sign out. Otherwise the dangling aal=1 session sits in
  // localStorage and a malicious bystander could resume the bypass
  // attempt by visiting another aal=1-permitted URL. (RLS would block
  // sensitive reads server-side, but we want the UX to match the
  // boundary — fully signed out is unambiguous.)
  const onCancel = useCallback(async () => {
    setBusy(true);
    try {
      await supabase.auth.signOut();
    } catch {
      /* best-effort */
    }
    navigate("/signin", { replace: true });
  }, [navigate]);

  // ── Render gates ──────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div style={wrap}>
        <div style={column}>
          <p style={{ color: "#64748b" }}>Đang tải… · Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Not signed in — there's nothing to challenge. Bounce to login.
    navigate("/signin", { replace: true });
    return null;
  }

  if (setupError) {
    return (
      <div style={wrap}>
        <div style={column}>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShieldAlert size={22} color="#b45309" aria-hidden />
              <h1 style={headingStyle}>
                Không bắt đầu được xác thực
                <span style={headingViStyle}>Couldn't start the challenge</span>
              </h1>
            </div>
            <p style={{ ...bodyStyle, marginTop: 12 }}>
              Có lỗi khi liên hệ máy chủ xác thực. Đăng xuất và đăng nhập lại nhé.
            </p>
            <p style={bodyViStyle}>
              We hit an error reaching the auth server. Sign out and back in to
              try again.
            </p>
            <div style={{ marginTop: 16 }}>
              <button
                type="button"
                style={primaryBtn}
                onClick={() => void onCancel()}
                data-testid="aal2-challenge-bailout"
              >
                Đăng xuất · Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <div style={column}>
        <section style={cardStyle} data-testid="aal2-challenge-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShieldAlert size={22} color="#0369a1" aria-hidden />
            <h1 style={headingStyle}>
              Xác thực 2 bước
              <span style={headingViStyle}>Two-factor verification</span>
            </h1>
          </div>

          <p style={{ ...bodyStyle, marginTop: 12 }}>
            Tài khoản của bạn đã bật 2FA. Mở ứng dụng xác thực và nhập mã 6 số đang hiển thị để tiếp tục.
          </p>
          <p style={bodyViStyle}>
            Your account has 2FA on. Open your authenticator app and enter the
            current 6-digit code to continue.
          </p>

          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(e) => {
              const next2 = e.target.value.replace(/\D/g, "").slice(0, 6);
              setCode(next2);
              if (errorBilingual) setErrorBilingual(null);
            }}
            placeholder="123456"
            aria-label="6-digit code from your authenticator app"
            data-testid="aal2-challenge-input"
            disabled={busy}
            autoFocus
            style={{ ...codeInputStyle, marginTop: 16 }}
          />

          {errorBilingual ? (
            <div role="alert" style={errorBox} data-testid="aal2-challenge-error">
              {errorBilingual.en}
              <span
                style={{
                  display: "block",
                  marginTop: 2,
                  fontSize: 12,
                  color: "#7f1d1d",
                }}
              >
                {errorBilingual.vi}
              </span>
            </div>
          ) : null}

          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={{
                ...primaryBtn,
                opacity: busy || code.length !== 6 ? 0.6 : 1,
              }}
              onClick={() => void onSubmit()}
              disabled={busy || code.length !== 6 || !challengeId}
              data-testid="aal2-challenge-submit"
            >
              {busy
                ? "Đang xác minh… · Verifying…"
                : "Xác nhận · Verify"}
            </button>
            <button
              type="button"
              style={ghostBtn}
              onClick={() => void onCancel()}
              disabled={busy}
              data-testid="aal2-challenge-cancel"
            >
              Đăng xuất · Sign out
            </button>
          </div>

          <p
            style={{
              marginTop: 14,
              fontSize: 12,
              color: "rgba(0,0,0,0.45)",
              lineHeight: 1.5,
            }}
          >
            Mất quyền truy cập ứng dụng xác thực? Liên hệ
            <a
              href="mailto:admin@mercyblade.com"
              style={{ color: "#0369a1", marginLeft: 4, fontWeight: 700 }}
            >
              admin@mercyblade.com
            </a>{" "}
            để được hỗ trợ.
            <br />
            <span style={{ color: "rgba(0,0,0,0.40)" }}>
              Lost access to your authenticator? Contact admin@mercyblade.com for
              help. (Phase 2 will ship one-time backup codes.)
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
