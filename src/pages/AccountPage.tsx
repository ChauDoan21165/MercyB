// src/pages/AccountPage.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/lib/useEntitlements";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { GiftCodeModal } from "@/components/GiftCodeModal";
import { supabase } from "@/lib/supabaseClient";
import { StreakHistoryPanel } from "@/components/streak/StreakHistoryPanel";

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function getStatusLabel(status: string | null | undefined): { en: string; vi: string } {
  switch (status) {
    case "active":
      return { en: "Active",              vi: "Đang hoạt động" };
    case "trialing":
      return { en: "Active (trial)",      vi: "Đang dùng thử" };
    case "grace_period":
      return { en: "Grace period",        vi: "Trong thời gian gia hạn" };
    case "past_due":
      return { en: "Past due",            vi: "Quá hạn thanh toán" };
    case "paused":
      return { en: "Paused",              vi: "Đã tạm dừng" };
    case "expired":
      return { en: "Expired",             vi: "Đã hết hạn" };
    case "revoked":
      return { en: "Revoked",             vi: "Đã bị thu hồi" };
    case "canceled":
      return { en: "Canceled",            vi: "Đã hủy" };
    case "inactive":
    default:
      return { en: "Inactive",            vi: "Chưa kích hoạt" };
  }
}

function getExpiryValue(ent: any): string | null {
  if (!ent) return null;
  return ent.current_period_end || ent.expires_at || ent.expiry_at || ent.period_end || null;
}

function getCancelAtPeriodEnd(ent: any): boolean {
  return Boolean(ent?.cancel_at_period_end);
}

function getIsPaidStatus(ent: any): boolean {
  const status = String(ent?.status ?? "").trim().toLowerCase();
  return status === "active" || status === "trialing" || status === "past_due";
}

// ── Bilingual helpers ─────────────────────────────────────────────────────────
const viStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 400,
  color: "#94a3b8",
  marginTop: 2,
  lineHeight: 1.4,
};

function BiLabel({ en, vi }: { en: string; vi: string }) {
  return (
    <span style={{ display: "block" }}>
      {en}
      <span style={viStyle}>{vi}</span>
    </span>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const nav = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  const { ent, loading: entitlementLoading, refreshEntitlements } = useEntitlements();

  const [isSigningOut, setIsSigningOut]       = useState(false);
  const [didRedirectToSignin, setDidRedirectToSignin] = useState(false);
  const [isOpeningBilling, setIsOpeningBilling] = useState(false);
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

  // Ref-based in-flight guards — prevent duplicate taps even before state updates
  const signingOutRef     = useRef(false);
  const openingBillingRef = useRef(false);

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

  const accessLabel = useMemo((): { en: string; vi: string } => {
    if (entitlementLoading) return { en: "Loading…", vi: "Đang tải…" };
    if (!isPremium) return { en: "Free access", vi: "Truy cập miễn phí" };

    if (typeof ent?.plan_name === "string" && ent.plan_name.trim()) {
      return { en: ent.plan_name.trim(), vi: "Đã kích hoạt premium" };
    }

    return { en: "Premium access", vi: "Đã kích hoạt premium" };
  }, [ent, entitlementLoading, isPremium]);

  const entitlementStatusLabels = useMemo(() => {
    if (entitlementLoading) return { en: "Loading…", vi: "Đang tải…" };
    return getStatusLabel(ent?.status);
  }, [ent?.status, entitlementLoading]);

  const expiryText = useMemo(() => {
    if (entitlementLoading) return "Loading…";
    return formatDateTime(getExpiryValue(ent));
  }, [ent, entitlementLoading]);

  const cancelAtPeriodEnd = useMemo(() => {
    if (entitlementLoading) return false;
    return getCancelAtPeriodEnd(ent);
  }, [ent, entitlementLoading]);

  const sessionLabel = isLoading ? "Checking…" : user ? "Active" : "Redirecting…";
  const sessionViLabel = isLoading ? "Đang kiểm tra…" : user ? "Đang hoạt động" : "Đang chuyển hướng…";

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

  const handleBillingClick = useCallback((): void => {
    nav("/billing");
  }, [nav]);

  const handleManageBillingClick = useCallback((): void => {
    // Hard guard — ignore duplicate taps
    if (openingBillingRef.current) return;
    openingBillingRef.current = true;
    setIsOpeningBilling(true);
    // Navigate — page unloads so ref/state cleanup is not needed
    nav("/billing");
  }, [nav]);

  const handlePricingClick = useCallback((): void => {
    nav("/pricing");
  }, [nav]);

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

  useEffect(() => {
    if (!placementFlagEnabled || !user?.id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("placement_completed_at, placement_cefr")
        .eq("id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.warn("[AccountPage] placement info fetch:", error.message);
        return;
      }
      setPlacementInfo({
        completedAt:
          (data as { placement_completed_at?: string | null } | null)
            ?.placement_completed_at ?? null,
        cefr:
          (data as { placement_cefr?: string | null } | null)
            ?.placement_cefr ?? null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [placementFlagEnabled, user?.id]);

  const handlePlacementClick = useCallback((): void => {
    nav("/placement");
  }, [nav]);

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
  }, [isResettingMemory, user?.id]);

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
      if (error) throw error;

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

  const container: React.CSSProperties = { maxWidth: 980, margin: "0 auto", padding: "24px 16px 80px" };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 22,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  };

  const headerRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  };

  const h1: React.CSSProperties = {
    margin: 0,
    // clamp down to 22px on the narrowest phones; full 34px on tablet+
    fontSize: "clamp(22px, 5.5vw, 34px)",
    fontWeight: 950,
    letterSpacing: -0.8,
    color: "rgba(0,0,0,0.86)",
  };

  const h1Vi: React.CSSProperties = {
    display: "block",
    fontSize: 14,
    fontWeight: 400,
    color: "#94a3b8",
    marginTop: 4,
    letterSpacing: 0,
  };

  const subtitle: React.CSSProperties = {
    marginTop: 6,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.55)",
    maxWidth: 520,
  };

  const subtitleVi: React.CSSProperties = {
    marginTop: 2,
    marginBottom: 0,
    fontSize: 12,
    lineHeight: 1.5,
    color: "#94a3b8",
    maxWidth: 520,
  };

  const actionsStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const buttonBase: React.CSSProperties = {
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

  const primaryButton: React.CSSProperties = {
    ...buttonBase,
    background: "#111827",
    color: "#fff",
    borderColor: "#111827",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    // 2 cols on tablet+, 1 col on phones. CSS media query override applied
    // via the .mb-account-grid class below so the layout is driven by the
    // viewport, not by runtime JS state.
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
    marginTop: 18,
  };

  const panel = (span = 1): React.CSSProperties => ({
    ...card,
    gridColumn: span === 2 ? "span 2" : "span 1",
  });

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "rgba(0,0,0,0.40)",
    marginBottom: 8,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
    lineHeight: 1.2,
  };

  const valueViStyle: React.CSSProperties = {
    display: "block",
    fontSize: 12,
    fontWeight: 400,
    color: "#94a3b8",
    marginTop: 3,
  };

  const subStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.55)",
  };

  const subViStyle: React.CSSProperties = {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 1.5,
    color: "#94a3b8",
  };
  // ────────────────────────────────────────────────────────────────────────────

  if (!user && !isLoading) return null;

  return (
    <div style={wrap}>
      {/* Collapse the 2-col grid to a single column on phones so card content
          doesn't get squeezed into ~140px at 320/375px viewports. */}
      <style>{`
        @media (max-width: 640px) {
          .mb-account-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <div style={container}>

        {/* ── Header card ─────────────────────────────────────── */}
        <div style={card}>
          <div style={headerRow}>
            <div>
              <h1 style={h1}>
                Account
                <span style={h1Vi}>Tài khoản của bạn</span>
              </h1>
              <p style={subtitle}>
                Manage your subscription and billing in one place.
              </p>
              <p style={subtitleVi}>
                Quản lý gói đăng ký và thanh toán của bạn tại đây.
              </p>
            </div>

            <div style={actionsStyle}>
              <button type="button" style={buttonBase}
                onClick={handleRefreshClick} disabled={entitlementLoading}>
                <BiLabel
                  en={entitlementLoading ? "Refreshing…" : "Refresh access"}
                  vi={entitlementLoading ? "Đang làm mới…" : "Làm mới quyền truy cập"}
                />
              </button>

              <button type="button" style={buttonBase}
                onClick={handleBillingClick} aria-label="Open billing page">
                <BiLabel en="Billing" vi="Thanh toán" />
              </button>

              <button type="button" style={buttonBase}
                onClick={handleManageBillingClick}
                disabled={isOpeningBilling}
                aria-label="Open billing portal">
                <BiLabel
                  en={isOpeningBilling ? "Opening…" : "Manage billing"}
                  vi={isOpeningBilling ? "Đang mở…" : "Quản lý thanh toán"}
                />
              </button>

              <button type="button" style={buttonBase} onClick={handlePricingClick}>
                <BiLabel en="Pricing" vi="Bảng giá" />
              </button>

              {placementFlagEnabled ? (
                <button
                  type="button"
                  style={buttonBase}
                  onClick={handlePlacementClick}
                  aria-label="Placement test"
                >
                  {placementInfo?.completedAt ? (
                    <BiLabel
                      en={`Retake placement test${placementInfo.cefr ? ` · last result ${placementInfo.cefr}` : ""}`}
                      vi={`Làm lại bài đánh giá${placementInfo.cefr ? ` · kết quả ${placementInfo.cefr}` : ""}`}
                    />
                  ) : (
                    <BiLabel en="Take placement test" vi="Làm bài đánh giá" />
                  )}
                </button>
              ) : null}

              {pronunciationFlagEnabled ? (
                <button
                  type="button"
                  style={buttonBase}
                  onClick={() => nav("/speech/history")}
                  aria-label="My pronunciation history"
                >
                  <BiLabel
                    en="My pronunciation history"
                    vi="Lịch sử phát âm của tôi"
                  />
                </button>
              ) : null}

              <button
                type="button"
                style={buttonBase}
                onClick={() => {
                  // Defer one tick so this click finishes bubbling before Radix
                  // mounts the Dialog overlay — otherwise Radix's pointer-down-
                  // outside handler fires on the same event and closes it.
                  setTimeout(() => setShowGiftModal(true), 0);
                }}
              >
                <BiLabel en="Redeem gift code" vi="Kích hoạt mã quà tặng" />
              </button>

              <button type="button" style={primaryButton}
                onClick={() => void handleSignOut()} disabled={isSigningOut}>
                <BiLabel
                  en={isSigningOut ? "Signing out…" : "Sign out"}
                  vi={isSigningOut ? "Đang đăng xuất…" : "Đăng xuất"}
                />
              </button>
            </div>
          </div>
        </div>

        {/* ── Info grid ───────────────────────────────────────── */}
        <div className="mb-account-grid" style={grid}>

          <div style={panel()}>
            <div style={labelStyle}>Email</div>
            <div style={{ ...valueStyle, fontSize: 18 }}>{email || "—"}</div>
            <p style={subStyle}>Your authenticated account email.</p>
            <p style={subViStyle}>Email tài khoản đã xác thực của bạn.</p>
          </div>

          <div style={panel()}>
            <div style={labelStyle}>Session</div>
            <div style={valueStyle}>
              {sessionLabel}
              <span style={valueViStyle}>{sessionViLabel}</span>
            </div>
            <p style={subStyle}>Current session state.</p>
            <p style={subViStyle}>Trạng thái phiên hiện tại.</p>
          </div>

          <div style={panel()}>
            <div style={labelStyle}>Current access</div>
            <div style={valueStyle}>
              {accessLabel.en}
              <span style={valueViStyle}>{accessLabel.vi}</span>
            </div>
            <p style={subStyle}>
              {entitlementLoading
                ? "Checking your subscription…"
                : isPremium
                  ? `Premium is active — status: ${ent?.status || "active"}.`
                  : "Free access — no active premium subscription found."}
            </p>
            <p style={subViStyle}>
              {entitlementLoading
                ? "Đang kiểm tra gói đăng ký…"
                : isPremium
                  ? "Premium đang hoạt động."
                  : "Chưa có gói premium nào đang hoạt động."}
            </p>
          </div>

          <div style={panel()}>
            <div style={labelStyle}>Subscription status</div>
            <div style={valueStyle}>
              {entitlementStatusLabels.en}
              <span style={valueViStyle}>{entitlementStatusLabels.vi}</span>
            </div>
            <p style={subStyle}>
              Source: <b>{ent?.source || "—"}</b>
              {" · "}
              Renews: <b>{expiryText}</b>
              {" · "}
              Cancel at period end: <b>{cancelAtPeriodEnd ? "Yes" : "No"}</b>
            </p>
            <p style={subViStyle}>
              Nguồn: <b>{ent?.source || "—"}</b>
              {" · "}
              Gia hạn: <b>{expiryText}</b>
              {" · "}
              Hủy cuối kỳ: <b>{cancelAtPeriodEnd ? "Có" : "Không"}</b>
            </p>
          </div>

          <div style={panel(2)}>
            <div style={labelStyle}>About your subscription</div>
            <p style={subStyle}>
              Your subscription is managed through Stripe. Use{" "}
              <strong>Manage billing</strong> to update your payment method,
              switch plans, or cancel. Changes take effect immediately or at
              the end of the current billing period.
            </p>
            <p style={subViStyle}>
              Gói đăng ký của bạn được quản lý qua Stripe. Nhấn{" "}
              <strong>Quản lý thanh toán</strong> để cập nhật phương thức thanh
              toán, chuyển gói hoặc hủy đăng ký.
            </p>
          </div>

        </div>

        {/* ── My Progress (streaks) ────────────────────────────── */}
        <div style={{ marginTop: 18 }}>
          <StreakHistoryPanel />
        </div>

        {/* ── Legal + account deletion ─────────────────────────── */}
        <div style={{ ...card, marginTop: 18 }}>
          <div style={labelStyle}>Legal & account</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...buttonBase, textDecoration: "none" } as React.CSSProperties}
            >
              <BiLabel en="Privacy Policy" vi="Chính sách bảo mật" />
            </a>
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...buttonBase, textDecoration: "none" } as React.CSSProperties}
            >
              <BiLabel en="Terms of Use" vi="Điều khoản sử dụng" />
            </a>
            <button
              type="button"
              style={{
                ...buttonBase,
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
                ...buttonBase,
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
                Mercy's memory has been reset. She'll start fresh on your next lesson.
              </p>
              <p style={{ ...subViStyle, color: "#065f46", margin: "4px 0 0" }}>
                Bộ nhớ của Mercy đã được xóa. Cô ấy sẽ bắt đầu lại từ buổi học tiếp theo.
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
              <p style={{ ...subStyle, color: "#92400e", fontWeight: 700, marginTop: 0 }}>
                This clears everything Mercy remembers about you — past lessons, strengths, weaknesses, and personality notes. Your account and progress stay.
              </p>
              <p style={{ ...subViStyle, color: "#92400e", marginBottom: 10 }}>
                Thao tác này sẽ xóa mọi thứ Mercy nhớ về bạn — các bài học trước, điểm mạnh, điểm yếu, và ghi chú về tính cách. Tài khoản và tiến độ của bạn được giữ nguyên.
              </p>
              <p style={{ ...subStyle, margin: "4px 0" }}>
                Type <strong>RESET</strong> to confirm:
              </p>
              <p style={{ ...subViStyle, margin: "2px 0 8px" }}>
                Nhập <strong>RESET</strong> để xác nhận.
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
                    ...buttonBase,
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
                  style={buttonBase}
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
              <p style={{ ...subStyle, color: "#991b1b", fontWeight: 700, marginTop: 0 }}>
                This permanently deletes your account, memory, notebook, and all
                associated data. This cannot be undone.
              </p>
              <p style={{ ...subViStyle, color: "#991b1b", marginBottom: 10 }}>
                Thao tác này sẽ xóa vĩnh viễn tài khoản, bộ nhớ, sổ tay và toàn
                bộ dữ liệu liên quan. Không thể hoàn tác.
              </p>
              <p style={{ ...subStyle, margin: "4px 0" }}>
                Type <strong>DELETE</strong> to confirm:
              </p>
              <p style={{ ...subViStyle, margin: "2px 0 8px" }}>
                Nhập <strong>DELETE</strong> để xác nhận.
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
                    ...buttonBase,
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
                  style={buttonBase}
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

      <GiftCodeModal open={showGiftModal} onOpenChange={setShowGiftModal} />
    </div>
  );
}