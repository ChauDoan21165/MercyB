// src/pages/BillingSuccessPage.tsx

import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/lib/useEntitlements";
import { useUserAccess } from "@/hooks/useUserAccess";

type StatusLabels = { en: string; vi: string };

function getStatusLabel(status: string | null | undefined): StatusLabels {
  switch (status) {
    case "active":       return { en: "Active",        vi: "Đang hoạt động" };
    case "trialing":     return { en: "Active (trial)", vi: "Đang dùng thử" };
    case "grace_period": return { en: "Grace period",  vi: "Trong thời gian gia hạn" };
    case "past_due":     return { en: "Past due",       vi: "Quá hạn thanh toán" };
    case "paused":       return { en: "Paused",         vi: "Đã tạm dừng" };
    case "expired":      return { en: "Expired",        vi: "Đã hết hạn" };
    case "revoked":      return { en: "Revoked",        vi: "Đã bị thu hồi" };
    case "inactive":
    default:             return { en: "Inactive",       vi: "Chưa kích hoạt" };
  }
}

const viStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 400,
  color: "#64748b",
  marginTop: 3,
  lineHeight: 1.5,
};

export default function BillingSuccessPage() {
  const nav = useNavigate();
  const { user, isLoading } = useAuth();
  const access = useUserAccess();
  const { ent, loading: entitlementLoading, refreshEntitlements } = useEntitlements();

  useEffect(() => {
    if (!isLoading && !user) {
      nav("/signin", { replace: true });
    }
  }, [isLoading, user, nav]);

  useEffect(() => {
    if (!user) return;
    // V9 fix (audit-user-journey-v9 Path 4 R8): a single refresh on
    // mount can land before the Stripe webhook updates the row,
    // briefly showing "Free access" on a page that says "Your premium
    // access is now active." Mirror the polling pattern used in
    // Billing.tsx (pollEntitlementAfterBilling, lines 228–236):
    // [0, 1.2s, 2.5s, 4.5s] — caps at ~8 s of waiting.
    let cancelled = false;
    const delays = [0, 1200, 2500, 4500];
    (async () => {
      for (const delay of delays) {
        if (cancelled) return;
        if (delay > 0) {
          await new Promise((resolve) => window.setTimeout(resolve, delay));
        }
        if (cancelled) return;
        await refreshEntitlements();
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, refreshEntitlements]);

  const isPremium = access.hasPremium;

  const statusLabels = useMemo(
    () => getStatusLabel(ent?.status),
    [ent?.status],
  );

  const accessLabel = useMemo((): StatusLabels => {
    if (entitlementLoading) return { en: "Loading…", vi: "Đang tải…" };
    if (!isPremium)         return { en: "Free access", vi: "Truy cập miễn phí" };
    if (ent?.status === "trialing")
      return { en: "Premium (trial)", vi: "Cao cấp (dùng thử)" };
    return { en: "Premium access", vi: "Quyền truy cập Premium" };
  }, [ent?.status, entitlementLoading, isPremium]);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const wrap: React.CSSProperties      = { width: "100%", minHeight: "100vh", background: "white" };
  const container: React.CSSProperties = { maxWidth: 860, margin: "0 auto", padding: "32px 16px 80px" };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)", borderRadius: 20, padding: 24,
    background: "rgba(255,255,255,0.95)", boxShadow: "0 12px 32px rgba(0,0,0,0.05)",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0, fontSize: 32, fontWeight: 950,
    letterSpacing: -0.7, color: "rgba(0,0,0,0.88)",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16, marginTop: 18,
  };

  const panel: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16,
    padding: 18, background: "#fff",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 800, textTransform: "uppercase",
    letterSpacing: 0.5, color: "rgba(0,0,0,0.40)", marginBottom: 8,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 22, fontWeight: 900, color: "rgba(0,0,0,0.88)", lineHeight: 1.2,
  };

  const subStyle: React.CSSProperties = {
    marginTop: 8, fontSize: 13, lineHeight: 1.6, color: "rgba(0,0,0,0.55)",
  };

  const actions: React.CSSProperties = {
    display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18,
  };

  const buttonBase: React.CSSProperties = {
    borderRadius: 12, minHeight: 44, padding: "10px 14px",
    border: "1px solid rgba(0,0,0,0.10)", background: "#fff",
    color: "#111827", fontWeight: 800, cursor: "pointer",
    textDecoration: "none", display: "inline-flex",
    flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center",
  };

  const primaryButton: React.CSSProperties = {
    ...buttonBase, background: "#111827", color: "#fff", borderColor: "#111827",
  };
  // ────────────────────────────────────────────────────────────────────────────

  if (!user && !isLoading) return null;

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={card}>

          {/* Header */}
          <h1 style={titleStyle}>
            {entitlementLoading
              ? "Confirming your access…"
              : isPremium
                ? "Payment successful"
                : "Payment received"}
          </h1>
          <p style={{ ...viStyle, fontSize: 14, marginTop: 4 }}>
            {entitlementLoading
              ? "Đang xác nhận quyền truy cập…"
              : isPremium
                ? "Thanh toán thành công"
                : "Đã nhận thanh toán"}
          </p>

          <p style={{ marginTop: 12, marginBottom: 0, fontSize: 15, lineHeight: 1.7, color: "rgba(0,0,0,0.64)", maxWidth: 680 }}>
            {entitlementLoading
              ? "Syncing your subscription status…"
              : isPremium
                ? "Your premium access is now active. You can explore all premium rooms."
                : "Your payment is complete. If access hasn't updated yet, tap Refresh access below."}
          </p>
          <p style={{ ...viStyle, fontSize: 13, marginTop: 4 }}>
            {entitlementLoading
              ? "Đang đồng bộ trạng thái gói đăng ký…"
              : isPremium
                ? "Quyền truy cập Premium đang hoạt động. Bạn có thể vào tất cả phòng Premium."
                : "Thanh toán đã hoàn tất. Nếu quyền truy cập chưa cập nhật, hãy nhấn Làm mới quyền truy cập."}
          </p>

          {/* Status grid */}
          <div style={grid}>
            <div style={panel}>
              <div style={labelStyle}>
                Current access
                <span style={viStyle}>Quyền truy cập hiện tại</span>
              </div>
              <div style={valueStyle}>
                {accessLabel.en}
                <span style={viStyle}>{accessLabel.vi}</span>
              </div>
              <p style={subStyle}>
                {isPremium
                  ? "All premium rooms are unlocked."
                  : "No active premium subscription found yet."}
              </p>
              <p style={{ ...subStyle, ...viStyle, marginTop: 2 }}>
                {isPremium
                  ? "Tất cả phòng Premium đã được mở khóa."
                  : "Chưa tìm thấy gói Premium đang hoạt động."}
              </p>
            </div>

            <div style={panel}>
              <div style={labelStyle}>
                Subscription status
                <span style={viStyle}>Trạng thái gói đăng ký</span>
              </div>
              <div style={valueStyle}>
                {entitlementLoading ? "Loading…" : statusLabels.en}
                <span style={viStyle}>
                  {entitlementLoading ? "Đang tải…" : statusLabels.vi}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={actions}>
            <button
              type="button"
              style={buttonBase}
              onClick={() => void refreshEntitlements()}
              disabled={entitlementLoading}
            >
              {entitlementLoading ? "Refreshing…" : "Refresh access"}
              <span style={{ ...viStyle, color: "#64748b" }}>
                {entitlementLoading ? "Đang làm mới…" : "Làm mới quyền truy cập"}
              </span>
            </button>

            <Link to="/rooms" style={primaryButton}>
              Go to rooms
              <span style={{ ...viStyle, color: "rgba(255,255,255,0.65)" }}>Vào phòng học</span>
            </Link>

            <Link to="/account" style={buttonBase}>
              Account
              <span style={viStyle}>Tài khoản</span>
            </Link>

            <Link to="/billing" style={buttonBase}>
              Billing
              <span style={viStyle}>Thanh toán</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
