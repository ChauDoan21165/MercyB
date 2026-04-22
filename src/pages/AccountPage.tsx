// src/pages/AccountPage.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/lib/useEntitlements";
import { GiftCodeModal } from "@/components/GiftCodeModal";

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

  const handleRefreshClick = useCallback((): void => {
    void refreshEntitlements();
  }, [refreshEntitlements]);

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
    fontSize: 34,
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

              <button type="button" style={buttonBase} onClick={() => setShowGiftModal(true)}>
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
        <div style={grid}>

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
      </div>

      <GiftCodeModal open={showGiftModal} onOpenChange={setShowGiftModal} />
    </div>
  );
}