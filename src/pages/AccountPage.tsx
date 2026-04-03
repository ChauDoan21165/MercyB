// src/pages/AccountPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/lib/useEntitlements";

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleString();
}

function getStatusLabel(status: string | null | undefined): string {
  switch (status) {
    case "active":
      return "Đang hoạt động";
    case "trialing":
      return "Đang hoạt động";
    case "grace_period":
      return "Đang trong thời gian gia hạn";
    case "past_due":
      return "Quá hạn thanh toán";
    case "paused":
      return "Đã tạm dừng";
    case "expired":
      return "Đã hết hạn";
    case "revoked":
      return "Đã bị thu hồi";
    case "canceled":
      return "Đã hủy";
    case "inactive":
    default:
      return "Chưa kích hoạt";
  }
}

function getExpiryValue(ent: any): string | null {
  if (!ent) return null;

  return (
    ent.current_period_end ||
    ent.expires_at ||
    ent.expiry_at ||
    ent.period_end ||
    null
  );
}

function getCancelAtPeriodEnd(ent: any): boolean {
  return Boolean(ent?.cancel_at_period_end);
}

function getIsPaidStatus(ent: any): boolean {
  const status = String(ent?.status ?? "").trim().toLowerCase();
  return status === "active" || status === "trialing" || status === "past_due";
}

export default function AccountPage() {
  const nav = useNavigate();
  const { user, isLoading, signOut } = useAuth();
  const {
    ent,
    loading: entitlementLoading,
    refreshEntitlements,
  } = useEntitlements();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [didRedirectToSignin, setDidRedirectToSignin] = useState(false);
  const [isOpeningBilling, setIsOpeningBilling] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    console.log("[AccountPage] auth state:", { user: !!user, isLoading });

    if (user) {
      if (didRedirectToSignin) setDidRedirectToSignin(false);
      return;
    }

    if (!didRedirectToSignin) {
      console.log("[AccountPage] redirecting unauthed user to signin");
      setDidRedirectToSignin(true);
      nav("/signin", { replace: true });
    }
  }, [didRedirectToSignin, isLoading, user, nav]);

  const email = useMemo(() => String(user?.email ?? "").trim(), [user?.email]);

  const isPremium = useMemo(() => {
    if (entitlementLoading) return false;
    return ent?.is_premium === true || getIsPaidStatus(ent);
  }, [ent, entitlementLoading]);

  const accessLabel = useMemo(() => {
    if (entitlementLoading) return "Loading…";
    if (!isPremium) return "Miễn phí";

    if (typeof ent?.plan_name === "string" && ent.plan_name.trim()) {
      return ent.plan_name.trim();
    }

    if (ent?.vip_tier === "vip9") return "Cao cấp";
    if (ent?.vip_tier === "vip1") return "Cao cấp";

    return "Cao cấp";
  }, [ent, entitlementLoading, isPremium]);

  const entitlementStatusLabel = useMemo(() => {
    if (entitlementLoading) return "Loading…";
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

  const statusText = isLoading
    ? "Checking session..."
    : user
      ? "Active"
      : "Redirecting...";

  const handleSignOut = useCallback(async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    console.log("[AccountPage] signing out...");

    try {
      await signOut();
      nav("/signin", { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  }, [isSigningOut, nav, signOut]);

  const handleBillingClick = useCallback((): void => {
    console.log("[AccountPage] navigating to /billing");
    nav("/billing");
  }, [nav]);

  const handleManageBillingClick = useCallback(async (): Promise<void> => {
    if (isOpeningBilling) return;

    try {
      setIsOpeningBilling(true);
      console.log("[AccountPage] opening billing portal via /billing");
      nav("/billing");
    } finally {
      setIsOpeningBilling(false);
    }
  }, [isOpeningBilling, nav]);

  const handlePricingClick = useCallback((): void => {
    console.log("[AccountPage] navigating to /pricing");
    nav("/pricing");
  }, [nav]);

  const handleRefreshClick = useCallback((): void => {
    console.log("[AccountPage] refreshing entitlements");
    void refreshEntitlements();
  }, [refreshEntitlements]);

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
  };

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 16px 80px",
  };

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
    fontSize: 36,
    fontWeight: 950,
    letterSpacing: -0.8,
    color: "rgba(0,0,0,0.86)",
  };

  const subtitle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.60)",
    maxWidth: 560,
  };

  const actions: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  };

  const buttonBase: React.CSSProperties = {
    borderRadius: 12,
    minHeight: 48,
    padding: "12px 18px",
    border: "1px solid rgba(0,0,0,0.10)",
    background: "#fff",
    color: "#111827",
    fontWeight: 800,
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    appearance: "none",
    WebkitAppearance: "none",
    userSelect: "none",
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

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: "rgba(0,0,0,0.48)",
    marginBottom: 8,
  };

  const value: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
  };

  const sub: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.60)",
  };

  if (!user && !isLoading) {
    return null;
  }

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={card}>
          <div style={headerRow}>
            <div>
              <h1 style={h1}>Account</h1>
              <p style={subtitle}>
                Premium truth on this screen comes from backend entitlement only.
                No plan name is inferred from client-side auth metadata.
              </p>
            </div>

            <div style={actions}>
              <button
                type="button"
                style={buttonBase}
                onClick={handleRefreshClick}
                disabled={entitlementLoading}
              >
                {entitlementLoading ? "Refreshing…" : "Refresh access"}
              </button>

              <button
                type="button"
                style={buttonBase}
                onClick={handleBillingClick}
                aria-label="Open billing page"
              >
                Billing
              </button>

              <button
                type="button"
                style={buttonBase}
                onClick={() => void handleManageBillingClick()}
                disabled={isOpeningBilling}
                aria-label="Open Stripe billing portal"
              >
                {isOpeningBilling ? "Opening…" : "Manage billing"}
              </button>

              <button
                type="button"
                style={buttonBase}
                onClick={handlePricingClick}
              >
                Pricing
              </button>

              <button
                type="button"
                style={primaryButton}
                onClick={() => void handleSignOut()}
                disabled={isSigningOut}
              >
                {isSigningOut ? "Signing out…" : "Sign out"}
              </button>
            </div>
          </div>
        </div>

        <div style={grid}>
          <div style={panel()}>
            <div style={label}>Email</div>
            <div style={{ ...value, fontSize: 20 }}>{email || "—"}</div>
            <div style={sub}>Authenticated account email.</div>
          </div>

          <div style={panel()}>
            <div style={label}>Session</div>
            <div style={value}>{statusText}</div>
            <div style={sub}>Session state from AuthProvider.</div>
          </div>

          <div style={panel()}>
            <div style={label}>Current access</div>
            <div style={value}>{accessLabel}</div>
            <div style={sub}>
              {entitlementLoading
                ? "Checking backend entitlement…"
                : isPremium
                  ? `Granted because backend entitlement says premium is ${ent?.status || "active"}.`
                  : "Free because backend entitlement does not currently grant premium."}
            </div>
          </div>

          <div style={panel()}>
            <div style={label}>Entitlement status</div>
            <div style={value}>{entitlementStatusLabel}</div>
            <div style={sub}>
              Raw status:{" "}
              <b>{entitlementLoading ? "Loading…" : (ent?.status || "inactive")}</b>
              <br />
              Source: <b>{ent?.source || "—"}</b>
              <br />
              Expires: <b>{expiryText}</b>
              <br />
              Cancel at period end: <b>{cancelAtPeriodEnd ? "Yes" : "No"}</b>
            </div>
          </div>

          <div style={panel(2)}>
            <div style={label}>Notes</div>
            <div style={sub}>
              Stripe webhook writes canonical truth. <code>public.subscriptions</code>{" "}
              is canonical. Backend entitlement is the only premium truth. This
              page intentionally does not read <code>user_metadata</code>,{" "}
              <code>app_metadata</code>, <code>subscription_tiers</code>, or{" "}
              <code>user_subscriptions</code> to decide premium access.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}