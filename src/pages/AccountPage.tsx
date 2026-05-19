// src/pages/AccountPage.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/lib/useEntitlements";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { GiftCodeModal } from "@/components/GiftCodeModal";
import PowerUserSection from "@/components/account/PowerUserSection";
import { supabase } from "@/lib/supabaseClient";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import LanguagePairSettings from "@/components/account/LanguagePairSettings";
import { StreakHistoryPanel } from "@/components/streak/StreakHistoryPanel";
import { ReferralCard } from "@/components/referral/ReferralCard";
import { CertificatesAccountEntry } from "@/components/certificates/CertificatesAccountEntry";
import { ApplyReferralCodeForm } from "@/components/referral/ApplyReferralCodeForm";
import { TrackingConsentPanel } from "@/components/account/TrackingConsentPanel";
import { WeeklyLeaderboardOptInPanel } from "@/components/leaderboard/WeeklyLeaderboardOptInPanel";
import { ReferralLeaderboardOptInPanel } from "@/components/leaderboard/ReferralLeaderboardOptInPanel";
import { exportAttemptsCsv } from "@/lib/analytics/speechProgress";
import { useChromeLanguage } from "@/lib/i18n/chromeLanguage";

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

function getExpiryValue(ent: any): string | null {
  if (!ent) return null;
  return ent.current_period_end || ent.expires_at || ent.expiry_at || ent.period_end || null;
}

function getIsPaidStatus(ent: any): boolean {
  const status = String(ent?.status ?? "").trim().toLowerCase();
  return status === "active" || status === "trialing" || status === "past_due";
}

// ── Chrome-language label ─────────────────────────────────────────────────────
// Was bilingual (EN over a muted VI subtitle). Now single-language: the
// account chrome follows the learner's native-language choice.
function BiLabel({ en, vi }: { en: string; vi: string }) {
  const lang = useChromeLanguage();
  return (
    <span style={{ display: "block" }}>{lang === "en" ? en : vi}</span>
  );
}

async function downloadProgressCsv(
  onError: (msg: string | null) => void,
): Promise<void> {
  onError(null);
  try {
    const csv = await exportAttemptsCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mercyblade-speech-history-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    onError(err instanceof Error ? err.message : String(err));
  }
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const nav = useNavigate();
  // Account chrome follows the learner's native-language choice.
  const lang = useChromeLanguage();
  const { user, isLoading, signOut } = useAuth();
  const { ent, loading: entitlementLoading, refreshEntitlements } = useEntitlements();
  const admin = useAdminAccess();

  const [isSigningOut, setIsSigningOut]       = useState(false);
  const [didRedirectToSignin, setDidRedirectToSignin] = useState(false);
  const [showGiftModal, setShowGiftModal]     = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting]           = useState(false);
  const [deleteError, setDeleteError]         = useState<string | null>(null);
  const [showResetMemoryConfirm, setShowResetMemoryConfirm] = useState(false);
  const [resetMemoryConfirmText, setResetMemoryConfirmText] = useState("");
  const [isResettingMemory, setIsResettingMemory]           = useState(false);
  const [resetMemoryError, setResetMemoryError]             = useState<string | null>(null);
  const [resetMemorySuccess, setResetMemorySuccess]         = useState(false);
  const [downloadError, setDownloadError]                   = useState<string | null>(null);

  // Ref-based in-flight guard — prevents duplicate sign-out taps before state settles.
  const signingOutRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      if (didRedirectToSignin) setDidRedirectToSignin(false);
      return;
    }
    if (!didRedirectToSignin) {
      setDidRedirectToSignin(true);
      nav("/signin", { replace: true });
    }
  }, [didRedirectToSignin, isLoading, user, nav]);

  const email = useMemo(() => String(user?.email ?? "").trim(), [user?.email]);

  const isPremium = useMemo(() => {
    if (entitlementLoading) return false;
    return ent?.is_premium === true || getIsPaidStatus(ent);
  }, [ent, entitlementLoading]);

  const expiryText = useMemo(() => {
    if (entitlementLoading) return "—";
    return formatDate(getExpiryValue(ent));
  }, [ent, entitlementLoading]);

  // ── Placement test (feature-flagged) ──────────────────────────────
  const { enabled: placementFlagEnabled } = useFeatureFlag(
    "placement_test_enabled",
    false,
  );
  // ── Pronunciation history (same flag as /speak) ────────────────────
  const { enabled: pronunciationFlagEnabled } = useFeatureFlag(
    "pronunciationScoringEnabled",
    false,
  );
  const [placementInfo, setPlacementInfo] = useState<{
    completedAt: string | null;
    cefr: string | null;
  } | null>(null);

  const { data: placementProfile } = useProfileQuery(
    placementFlagEnabled ? user?.id ?? null : null,
  );
  useEffect(() => {
    if (!placementFlagEnabled || !user?.id) return;
    const row = placementProfile as
      | { placement_completed_at?: string | null; placement_cefr?: string | null }
      | null
      | undefined;
    setPlacementInfo({
      completedAt: row?.placement_completed_at ?? null,
      cefr: row?.placement_cefr ?? null,
    });
  }, [placementFlagEnabled, user?.id, placementProfile]);

  const handleSignOut = useCallback(async () => {
    if (signingOutRef.current) return;
    signingOutRef.current = true;
    setIsSigningOut(true);
    try {
      await signOut();
      nav("/signin", { replace: true });
    } finally {
      signingOutRef.current = false;
      setIsSigningOut(false);
    }
  }, [nav, signOut]);

  const handleRefreshClick = useCallback((): void => {
    void refreshEntitlements();
  }, [refreshEntitlements]);

  const handleResetMercyMemory = useCallback(async (): Promise<void> => {
    if (isResettingMemory) return;
    setIsResettingMemory(true);
    setResetMemoryError(null);
    setResetMemorySuccess(false);
    try {
      const userId = user?.id;
      if (!userId) throw new Error("Not signed in.");

      const { error } = await supabase
        .from("teacher_memory")
        .delete()
        .eq("user_id", userId);
      if (error) throw error;

      // Wipe the mirrored device-local memory so Mercy forgets everywhere,
      // not just on the server.
      try {
        const memMod = await import("@/lib/teacher-mercy/memory");
        memMod.clearMemory();
      } catch { /* non-fatal — the server truth has been cleared */ }
      try {
        const logsMod = await import("@/lib/teacher-mercy/logs");
        logsMod.clearLogs();
      } catch { /* non-fatal */ }
      try {
        const curriculumMod = await import("@/lib/teacher-mercy/curriculumTracker");
        curriculumMod.resetCurriculumState();
      } catch { /* non-fatal */ }

      setResetMemorySuccess(true);
      setShowResetMemoryConfirm(false);
      setResetMemoryConfirmText("");
    } catch (err) {
      setResetMemoryError(
        err instanceof Error ? err.message : "Unable to reset Mercy's memory.",
      );
    } finally {
      setIsResettingMemory(false);
    }
  }, [isResettingMemory, user]);

  const handleDeleteAccount = useCallback(async (): Promise<void> => {
    if (isDeleting) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) throw new Error("Not signed in.");

      const { error } = await supabase.functions.invoke("delete-account", {
        body: {},
        headers: { Authorization: `Bearer ${token}` },
      });
      if (error) {
        // The edge function gates this irreversible action behind
        // aal=2 when the user has a verified second factor (issue
        // #233). Read the response body to see if that's why it
        // failed, and if so route through the existing TOTP
        // challenge, then back here to retry.
        let body: { error?: string; message?: string } | null = null;
        const ctx = (error as { context?: Response }).context;
        if (ctx && typeof ctx.clone === "function") {
          try {
            body = await ctx.clone().json();
          } catch {
            /* non-JSON / already-consumed body — fall through */
          }
        }
        if (body?.error === "aal2_required") {
          setDeleteError(
            "Vì xóa tài khoản là hành động không thể hoàn tác, bạn cần " +
              "xác thực mã 2FA. Đang chuyển đến trang xác thực…",
          );
          nav("/auth/challenge?next=/account");
          return;
        }
        if (body?.error === "aal_check_unavailable") {
          setDeleteError(
            body.message ??
              "Không thể xác minh trạng thái bảo mật. Vui lòng thử lại sau.",
          );
          return;
        }
        throw error;
      }

      await supabase.auth.signOut();
      nav("/", { replace: true });
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete account.",
      );
    } finally {
      setIsDeleting(false);
    }
  }, [isDeleting, nav]);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const wrap: React.CSSProperties = { width: "100%", minHeight: "100vh", background: "white" };

  const container: React.CSSProperties = { maxWidth: 720, margin: "0 auto", padding: "24px 16px 80px" };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 22,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  };

  const h1: React.CSSProperties = {
    margin: 0,
    fontSize: "clamp(22px, 5.5vw, 30px)",
    fontWeight: 950,
    letterSpacing: -0.8,
    color: "rgba(0,0,0,0.86)",
  };

  const emailLine: React.CSSProperties = {
    marginTop: 14,
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
    lineHeight: 1.5,
  };

  // Primary action row — only 3 buttons. Equal flex so they sit
  // comfortably on 414px viewports without wrapping.
  const primaryActionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "stretch",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 18,
  };

  const primaryButtonBase: React.CSSProperties = {
    flex: "1 1 140px",
    borderRadius: 12,
    minHeight: 48,
    padding: "10px 14px",
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
    color: "#111827",
    fontWeight: 800,
    cursor: "pointer",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    appearance: "none",
    WebkitAppearance: "none",
    userSelect: "none",
    textAlign: "center",
  };

  // Amber gift CTA — always shown amber per brief (most prominent).
  const giftButton: React.CSSProperties = {
    ...primaryButtonBase,
    background: "#fef3c7",
    color: "#78350f",
    borderColor: "#f59e0b",
  };

  const darkButton: React.CSSProperties = {
    ...primaryButtonBase,
    background: "#111827",
    color: "#fff",
    borderColor: "#111827",
  };

  // Secondary row — small underlined text links, lower hierarchy.
  // Houses Billing, pronunciation history, progress, CSV download,
  // placement, refresh access, notification preferences. Each item
  // is gated independently so the row stays sparse for users with
  // no feature flags enabled.
  const secondaryLinksStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px 16px",
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid rgba(0,0,0,0.06)",
  };

  const secondaryLink: React.CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#6b7280",
    fontWeight: 600,
    fontSize: 13,
    padding: "2px 0",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    textAlign: "left",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  };

  const secondaryLinkVi: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 400,
    color: "#94a3b8",
    marginTop: 1,
    textDecoration: "none",
  };

  const SecondaryLink = ({
    en,
    vi,
    onClick,
    disabled = false,
    testId,
  }: {
    en: string;
    vi: string;
    onClick: () => void;
    disabled?: boolean;
    testId?: string;
  }) => (
    <button
      type="button"
      style={{ ...secondaryLink, opacity: disabled ? 0.5 : 1 }}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {en}
      <span style={secondaryLinkVi}>{vi}</span>
    </button>
  );

  // ── Simplified status card ───────────────────────────────────────
  // Free: amber/warm. Premium: emerald. One sentence VI + EN,
  // plus a single contextual CTA (Upgrade vs expiry date).
  const statusCardFree: React.CSSProperties = {
    ...card,
    marginTop: 18,
    background: "linear-gradient(180deg, #fffbeb 0%, #ffffff 100%)",
    borderColor: "#fde68a",
  };

  const statusCardPremium: React.CSSProperties = {
    ...card,
    marginTop: 18,
    background: "linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)",
    borderColor: "#a7f3d0",
  };

  const statusHeadlineVi: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 800,
    color: "#111827",
    margin: 0,
    lineHeight: 1.35,
  };

  const statusBody: React.CSSProperties = {
    marginTop: 12,
    fontSize: 13,
    color: "rgba(0,0,0,0.60)",
    lineHeight: 1.5,
  };

  const upgradeCta: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    padding: "12px 22px",
    borderRadius: 9999,
    background: "#111827",
    color: "#fff",
    fontWeight: 800,
    fontSize: 14,
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
  };

  // ── Collapsible <details> styles ─────────────────────────────────
  const detailsCard: React.CSSProperties = {
    ...card,
    marginTop: 14,
    padding: 0,
    overflow: "hidden",
  };

  const summaryStyle: React.CSSProperties = {
    padding: "16px 22px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    color: "#111827",
    listStyle: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    userSelect: "none",
  };

  const detailsBody: React.CSSProperties = {
    padding: "0 22px 22px",
  };

  // Section spacing utility for content stacked below the status card.
  const section: React.CSSProperties = { marginTop: 18 };

  // ── Legal card styles (reused from prior version) ────────────────
  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.40)",
    marginBottom: 8,
  };

  const subStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.55)",
  };

  const legalButtonBase: React.CSSProperties = {
    borderRadius: 12,
    minHeight: 44,
    padding: "10px 16px",
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
    color: "#111827",
    fontWeight: 800,
    cursor: "pointer",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    appearance: "none",
    WebkitAppearance: "none",
    userSelect: "none",
    textAlign: "center",
  };
  // ────────────────────────────────────────────────────────────────────────────

  if (!user && !isLoading) return null;

  return (
    // translate="no" prevents Chrome/Google Translate (and similar extensions)
    // from wrapping text nodes inside React-managed children with <font>/<b>
    // tags, which desyncs the virtual DOM and crashes reconciliation with
    // "NotFoundError: Failed to execute 'insertBefore' on 'Node'".
    // Closes Sentry MERCYBLADE-WEB-Y (P1, route=/account, Chrome Mobile on a
    // vi-locale Android device). Same failure class previously mitigated on
    // RoomLayout.tsx:34 and LoginPage.tsx:404. The bilingual VI/EN labels on
    // every account button + the status card text are exactly the kind of
    // bilingual content Chrome's auto-translate flags on a Vietnamese-locale
    // device.
    <div translate="no" style={wrap}>
      <style>{`
        details[open] > summary .mb-chevron { transform: rotate(180deg); }
        summary::-webkit-details-marker { display: none; }
      `}</style>
      <div style={container}>

        {/* ── Header card: title + email + 3 primary buttons + secondary links ── */}
        <div style={card}>
          <h1 style={h1}>{lang === "en" ? "Account" : "Tài khoản của bạn"}</h1>
          <p style={emailLine}>{email || "—"}</p>

          {/* Three primary actions only — gift code (amber), pricing, sign out. */}
          <div style={primaryActionsStyle}>
            <button
              type="button"
              style={giftButton}
              onClick={() => {
                // Defer one tick so this click finishes bubbling before Radix
                // mounts the Dialog overlay — otherwise Radix's pointer-down-
                // outside handler fires on the same event and closes it.
                setTimeout(() => setShowGiftModal(true), 0);
              }}
            >
              <BiLabel en="Redeem gift code" vi="Kích hoạt mã quà tặng" />
            </button>

            <button
              type="button"
              style={primaryButtonBase}
              onClick={() => nav("/pricing")}
            >
              <BiLabel en="Pricing" vi="Bảng giá" />
            </button>

            <button
              type="button"
              style={darkButton}
              onClick={() => void handleSignOut()}
              disabled={isSigningOut}
            >
              <BiLabel
                en={isSigningOut ? "Signing out…" : "Sign out"}
                vi={isSigningOut ? "Đang đăng xuất…" : "Đăng xuất"}
              />
            </button>
          </div>

          {/* Secondary row — text-link style; less visual weight. */}
          <div style={secondaryLinksStyle}>
            <SecondaryLink
              en="Billing"
              vi="Thanh toán"
              onClick={() => nav("/billing")}
            />

            {pronunciationFlagEnabled ? (
              <SecondaryLink
                en="My progress"
                vi="Tiến độ của tôi"
                onClick={() => nav("/progress")}
                testId="account-progress-link"
              />
            ) : null}

            {pronunciationFlagEnabled ? (
              <SecondaryLink
                en="My pronunciation history"
                vi="Lịch sử phát âm"
                onClick={() => nav("/speech/history")}
              />
            ) : null}

            {pronunciationFlagEnabled ? (
              <SecondaryLink
                en="Download my progress data"
                vi="Tải dữ liệu tiến độ"
                onClick={() => void downloadProgressCsv(setDownloadError)}
                testId="account-progress-download"
              />
            ) : null}

            {/* Placement retake link — HIDDEN behind
                FEATURE_FLAGS.PLACEMENT_TEST_ENABLED (default false; see
                featureFlags.ts). AND-ed with the pre-existing DB flag so
                reviving the feature still respects its original runtime
                toggle. Hiding this link also removes the only place the
                Account page surfaced a placement CEFR level, so no
                "Level: not assessed" leaks. */}
            {FEATURE_FLAGS.PLACEMENT_TEST_ENABLED && placementFlagEnabled ? (
              <SecondaryLink
                en={
                  placementInfo?.completedAt
                    ? `Retake placement test${placementInfo.cefr ? ` · ${placementInfo.cefr}` : ""}`
                    : "Take placement test"
                }
                vi={
                  placementInfo?.completedAt
                    ? `Làm lại bài đánh giá${placementInfo.cefr ? ` · ${placementInfo.cefr}` : ""}`
                    : "Làm bài đánh giá"
                }
                onClick={() => nav("/placement")}
              />
            ) : null}

            <SecondaryLink
              en={entitlementLoading ? "Refreshing…" : "Refresh access"}
              vi={entitlementLoading ? "Đang làm mới…" : "Làm mới quyền truy cập"}
              onClick={handleRefreshClick}
              disabled={entitlementLoading}
            />

            <SecondaryLink
              en="Notification preferences"
              vi="Tùy chọn email"
              onClick={() => nav("/account/notifications")}
              testId="account-notification-prefs-link"
            />
          </div>

          {downloadError ? (
            <p
              role="alert"
              style={{ color: "#991b1b", fontSize: 12, marginTop: 10 }}
            >
              {downloadError}
            </p>
          ) : null}
        </div>

        {/* ── Simplified subscription status ──────────────────────── */}
        <div style={isPremium ? statusCardPremium : statusCardFree}>
          {isPremium ? (
            <>
              <p style={statusHeadlineVi}>
                {lang === "en"
                  ? "⭐ Premium active"
                  : "⭐ Premium đang hoạt động"}
              </p>
              <p style={statusBody}>
                {expiryText !== "—" ? (
                  lang === "en" ? (
                    <>Renews on <b>{expiryText}</b></>
                  ) : (
                    <>Gia hạn vào <b>{expiryText}</b></>
                  )
                ) : lang === "en" ? (
                  "You have full access."
                ) : (
                  "Bạn có quyền truy cập đầy đủ."
                )}
              </p>
            </>
          ) : (
            <>
              <p style={statusHeadlineVi}>
                {lang === "en"
                  ? "🔓 You're on the free plan"
                  : "🔓 Bạn đang dùng bản miễn phí"}
              </p>
              <p style={statusBody}>
                {lang === "en"
                  ? "Unlock every lesson, exam prep set, and pronunciation feedback."
                  : "Mở khóa toàn bộ bài học, luyện thi, và phản hồi phát âm."}
              </p>
              <button
                type="button"
                style={upgradeCta}
                onClick={() => nav("/pricing")}
                aria-label="Upgrade to premium"
              >
                {lang === "en" ? "Upgrade →" : "Nâng cấp →"}
              </button>
            </>
          )}
        </div>

        {/* ── My Progress (streaks + certificates) ─────────────────── */}
        <div style={section}>
          <StreakHistoryPanel />
        </div>
        <CertificatesAccountEntry />

        {/* ── Admin link (level 9+ only) ───────────────────────────── */}
        {!admin.loading && admin.permissions.level >= 9 ? (
          <div style={section}>
            <a
              href="/admin/analytics"
              data-testid="account-admin-dashboard-link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 16px",
                border: "1px solid #bae6fd",
                background: "#f0f9ff",
                color: "#075985",
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Admin dashboard →
            </a>
          </div>
        ) : null}

        {/* ── Referral (collapsed by default) ──────────────────────── */}
        <details style={detailsCard}>
          <summary style={summaryStyle}>
            <span>
              {lang === "en" ? "Share referral code" : "Chia sẻ mã giới thiệu"}
            </span>
            <span className="mb-chevron" style={{ transition: "transform 0.2s", color: "#94a3b8" }} aria-hidden>▾</span>
          </summary>
          <div style={detailsBody}>
            <ReferralCard userId={user?.id} />
            <div style={{ marginTop: 12 }}>
              <ApplyReferralCodeForm userId={user?.id} />
            </div>
          </div>
        </details>

        {/* ── Leaderboard settings (collapsed by default) ──────────── */}
        <details style={detailsCard}>
          <summary style={summaryStyle}>
            <span>
              {lang === "en"
                ? "Leaderboard settings"
                : "Bảng xếp hạng & tùy chọn"}
            </span>
            <span className="mb-chevron" style={{ transition: "transform 0.2s", color: "#94a3b8" }} aria-hidden>▾</span>
          </summary>
          <div style={detailsBody}>
            <WeeklyLeaderboardOptInPanel />
            <div style={{ marginTop: 12 }}>
              <ReferralLeaderboardOptInPanel />
            </div>
          </div>
        </details>

        {/* ── Learning languages (collapsed by default) ───────────── */}
        <details style={detailsCard}>
          <summary style={summaryStyle}>
            <span>
              {lang === "en" ? "Learning languages" : "Ngôn ngữ học"}
            </span>
            <span className="mb-chevron" style={{ transition: "transform 0.2s", color: "#94a3b8" }} aria-hidden>▾</span>
          </summary>
          <div style={detailsBody}>
            <LanguagePairSettings />
          </div>
        </details>

        {/* ── Privacy: advertising + analytics tracking (collapsed) ── */}
        <details style={detailsCard}>
          <summary style={summaryStyle}>
            <span>
              {lang === "en" ? "Privacy" : "Quyền riêng tư"}
            </span>
            <span className="mb-chevron" style={{ transition: "transform 0.2s", color: "#94a3b8" }} aria-hidden>▾</span>
          </summary>
          <div style={detailsBody}>
            <TrackingConsentPanel />
          </div>
        </details>

        {/* ── Legal + account deletion ─────────────────────────────── */}
        <div style={{ ...card, marginTop: 18 }}>
          <div style={labelStyle}>Legal & account</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...legalButtonBase, textDecoration: "none" } as React.CSSProperties}
            >
              <BiLabel en="Privacy Policy" vi="Chính sách bảo mật" />
            </a>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...legalButtonBase, textDecoration: "none" } as React.CSSProperties}
            >
              <BiLabel en="Terms of Use" vi="Điều khoản sử dụng" />
            </a>
            <button
              type="button"
              style={{
                ...legalButtonBase,
                background: "#fff",
                color: "#92400e",
                borderColor: "#fde68a",
              }}
              onClick={() => {
                setShowResetMemoryConfirm(true);
                setResetMemoryError(null);
                setResetMemorySuccess(false);
                setResetMemoryConfirmText("");
              }}
            >
              <BiLabel en="Reset Mercy's memory" vi="Đặt lại bộ nhớ của Mercy" />
            </button>
            <button
              type="button"
              style={{
                ...legalButtonBase,
                background: "#fff",
                color: "#b91c1c",
                borderColor: "#fecaca",
              }}
              onClick={() => { setShowDeleteConfirm(true); setDeleteError(null); setDeleteConfirmText(""); }}
            >
              <BiLabel en="Delete my account" vi="Xóa tài khoản của tôi" />
            </button>
          </div>

          {resetMemorySuccess && !showResetMemoryConfirm ? (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                border: "1px solid #bbf7d0",
                borderRadius: 12,
                background: "#f0fdf4",
              }}
            >
              <p style={{ ...subStyle, color: "#065f46", margin: 0 }}>
                {lang === "en"
                  ? "Mercy's memory has been reset. She'll start fresh on your next lesson."
                  : "Bộ nhớ của Mercy đã được xóa. Cô ấy sẽ bắt đầu lại từ buổi học tiếp theo."}
              </p>
            </div>
          ) : null}

          {showResetMemoryConfirm ? (
            <div
              style={{
                marginTop: 14,
                padding: 14,
                border: "1px solid #fde68a",
                borderRadius: 12,
                background: "#fffbeb",
              }}
            >
              <p style={{ ...subStyle, color: "#92400e", fontWeight: 700, marginTop: 0, marginBottom: 10 }}>
                {lang === "en"
                  ? "This clears everything Mercy remembers about you — past lessons, strengths, weaknesses, and personality notes. Your account and progress stay."
                  : "Thao tác này sẽ xóa mọi thứ Mercy nhớ về bạn — các bài học trước, điểm mạnh, điểm yếu, và ghi chú về tính cách. Tài khoản và tiến độ của bạn được giữ nguyên."}
              </p>
              <p style={{ ...subStyle, margin: "4px 0 8px" }}>
                {lang === "en" ? (
                  <>Type <strong>RESET</strong> to confirm:</>
                ) : (
                  <>Nhập <strong>RESET</strong> để xác nhận.</>
                )}
              </p>
              <input
                type="text"
                autoComplete="off"
                value={resetMemoryConfirmText}
                onChange={(e) => setResetMemoryConfirmText(e.target.value)}
                placeholder="RESET"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #fde68a",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              />
              {resetMemoryError ? (
                <p style={{ ...subStyle, color: "#b45309", marginTop: 4 }}>
                  {resetMemoryError}
                </p>
              ) : null}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={{
                    ...legalButtonBase,
                    background: "#b45309",
                    color: "#fff",
                    borderColor: "#b45309",
                    opacity:
                      resetMemoryConfirmText === "RESET" && !isResettingMemory ? 1 : 0.5,
                    cursor:
                      resetMemoryConfirmText === "RESET" && !isResettingMemory
                        ? "pointer"
                        : "not-allowed",
                  }}
                  disabled={resetMemoryConfirmText !== "RESET" || isResettingMemory}
                  onClick={() => void handleResetMercyMemory()}
                >
                  <BiLabel
                    en={isResettingMemory ? "Resetting…" : "Reset memory"}
                    vi={isResettingMemory ? "Đang đặt lại…" : "Đặt lại bộ nhớ"}
                  />
                </button>
                <button
                  type="button"
                  style={legalButtonBase}
                  disabled={isResettingMemory}
                  onClick={() => {
                    setShowResetMemoryConfirm(false);
                    setResetMemoryConfirmText("");
                  }}
                >
                  <BiLabel en="Cancel" vi="Hủy" />
                </button>
              </div>
            </div>
          ) : null}

          {showDeleteConfirm ? (
            <div
              style={{
                marginTop: 14,
                padding: 14,
                border: "1px solid #fecaca",
                borderRadius: 12,
                background: "#fef2f2",
              }}
            >
              <p style={{ ...subStyle, color: "#991b1b", fontWeight: 700, marginTop: 0, marginBottom: 10 }}>
                {lang === "en"
                  ? "This permanently deletes your account, memory, notebook, and all associated data. This cannot be undone."
                  : "Thao tác này sẽ xóa vĩnh viễn tài khoản, bộ nhớ, sổ tay và toàn bộ dữ liệu liên quan. Không thể hoàn tác."}
              </p>
              <p style={{ ...subStyle, margin: "4px 0 8px" }}>
                {lang === "en" ? (
                  <>Type <strong>DELETE</strong> to confirm:</>
                ) : (
                  <>Nhập <strong>DELETE</strong> để xác nhận.</>
                )}
              </p>
              <input
                type="text"
                autoComplete="off"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #fecaca",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              />
              {deleteError ? (
                <p style={{ ...subStyle, color: "#b91c1c", marginTop: 4 }}>
                  {deleteError}
                </p>
              ) : null}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={{
                    ...legalButtonBase,
                    background: "#b91c1c",
                    color: "#fff",
                    borderColor: "#b91c1c",
                    opacity: deleteConfirmText === "DELETE" && !isDeleting ? 1 : 0.5,
                    cursor:
                      deleteConfirmText === "DELETE" && !isDeleting ? "pointer" : "not-allowed",
                  }}
                  disabled={deleteConfirmText !== "DELETE" || isDeleting}
                  onClick={() => void handleDeleteAccount()}
                >
                  <BiLabel
                    en={isDeleting ? "Deleting…" : "Permanently delete"}
                    vi={isDeleting ? "Đang xóa…" : "Xóa vĩnh viễn"}
                  />
                </button>
                <button
                  type="button"
                  style={legalButtonBase}
                  disabled={isDeleting}
                  onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText(""); }}
                >
                  <BiLabel en="Cancel" vi="Hủy" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {user?.id ? (
        <PowerUserSection
          userId={user.id}
          displayName={user.email?.split("@")[0] ?? "MercyBlade learner"}
        />
      ) : null}

      <GiftCodeModal open={showGiftModal} onOpenChange={setShowGiftModal} />
    </div>
  );
}
