/**
 * Path: src/pages/Billing.tsx
 * File: Billing.tsx
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyEntitlement,
  openBillingPortal,
  startCheckoutOrOpenPortal,
} from "@/lib/billing";
import { getPlatform } from "@/lib/platform";
import { APPLE_MANAGE_SUBSCRIPTIONS_URL } from "@/lib/iap";
import {
  formatPrice,
  MONTHLY_PRICE_VND,
  YEARLY_PRICE_VND,
} from "@/lib/pricing/displayPrices";

type PlanKey = "month" | "year";

type Entitlement = {
  is_premium?: boolean;
  status?: string | null;
  source?: string | null;
  expires_at?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  price_id?: string | null;
  plan_name?: string | null;
  vip_tier?: string | null;
};

type UiMessage = {
  en: string;
  vi: string;
};

const VIETNAMESE_SUB_STYLE: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 400,
  color: "#64748b",
  marginTop: 2,
};

function env(name: string): string {
  return String((import.meta.env as Record<string, string | undefined>)?.[name] ?? "").trim();
}

function pickEnv(...names: string[]): string {
  for (const name of names) {
    const value = env(name);
    if (value) return value;
  }
  return "";
}

function isUsablePriceId(value: string): boolean {
  return !!value && value.startsWith("price_") && !value.includes("REPLACE_WITH_REAL");
}

function resolvePriceId(...candidates: string[]): string {
  for (const candidate of candidates) {
    const value = String(candidate ?? "").trim();
    if (isUsablePriceId(value)) return value;
  }
  return "";
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function getExpiryValue(ent: Entitlement | null): string | null {
  if (!ent) return null;
  return ent.current_period_end || ent.expires_at || null;
}

function getStatusLabel(status: string | null | undefined): React.ReactNode {
  let en = "Inactive";
  let vi = "Chưa kích hoạt";

  switch (status) {
    case "active":
    case "trialing":
      en = "Active";    vi = "Đang hoạt động";      break;
    case "past_due":
      en = "Past due";  vi = "Quá hạn thanh toán";   break;
    case "grace_period":
      en = "Grace period"; vi = "Thời gian gia hạn"; break;
    case "paused":
      en = "Paused";    vi = "Đã tạm dừng";          break;
    case "canceled":
      en = "Canceled";  vi = "Đã hủy";               break;
    case "expired":
      en = "Expired";   vi = "Đã hết hạn";            break;
    case "revoked":
      en = "Revoked";   vi = "Đã bị thu hồi";         break;
  }

  return (
    <span>
      {en}
      <span style={{ color: "#64748b", fontWeight: 400, fontSize: 12 }}>
        {" "}({vi})
      </span>
    </span>
  );
}

function isCanceledLike(status: string | null | undefined): boolean {
  return ["canceled", "expired", "revoked"].includes(String(status ?? "").toLowerCase());
}

function hasActiveBillingAccess(status: string | null | undefined): boolean {
  return ["active", "trialing", "past_due", "grace_period"].includes(
    String(status ?? "").toLowerCase(),
  );
}

function getPlanPriceId(plan: PlanKey, monthPriceId: string, yearPriceId: string): string {
  return plan === "month" ? monthPriceId : yearPriceId;
}

function normalizeUiErrorMessage(message: string): UiMessage {
  const lower = message.toLowerCase();

  if (lower.includes("unable to retrieve stripe price") || lower.includes("no such price")) {
    return {
      en: "We couldn't load pricing. Please refresh or try again.",
      vi: "Không thể tải thông tin giá. Vui lòng làm mới hoặc thử lại.",
    };
  }

  if (lower.includes("tierid or priceid is required") || lower.includes("priceid is required")) {
    return {
      en: "Checkout request is missing the Stripe price ID.",
      vi: "Yêu cầu thanh toán đang thiếu Stripe price ID.",
    };
  }

  if (lower.includes("billing portal")) {
    return {
      en: "We couldn't open billing right now. Please try again.",
      vi: "Hiện không thể mở trang thanh toán. Vui lòng thử lại.",
    };
  }

  if (lower.includes("invalid jwt")) {
    return {
      en: "Your session expired. Please sign in again, then retry billing.",
      vi: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại rồi thử thanh toán tiếp.",
    };
  }

  if (lower.includes("canceled subscription")) {
    return {
      en: "Your earlier subscription ended, so we're opening a fresh checkout instead.",
      vi: "Gói đăng ký trước đó đã kết thúc, nên hệ thống sẽ mở một lần thanh toán mới.",
    };
  }

  return {
    en: message,
    vi: "Có lỗi xảy ra. Vui lòng thử lại.",
  };
}

function getPlanButtonLabel(args: {
  loading: boolean;
  busyPlan: PlanKey | null;
  plan: PlanKey;
  isCurrent: boolean;
  hasActiveAccess: boolean;
  isCanceledLikeStatus: boolean;
}): React.ReactNode {
  const { loading, busyPlan, plan, isCurrent, hasActiveAccess, isCanceledLikeStatus } = args;

  if (loading) {
    return (
      <div>
        Checking...
        <span style={{ ...VIETNAMESE_SUB_STYLE, color: "inherit" }}>Đang kiểm tra…</span>
      </div>
    );
  }

  if (busyPlan === plan) {
    return (
      <div>
        Processing...
        <span style={{ ...VIETNAMESE_SUB_STYLE, color: "inherit" }}>Đang xử lý…</span>
      </div>
    );
  }

  if (isCurrent) {
    return (
      <div>
        Current plan
        <span style={{ ...VIETNAMESE_SUB_STYLE, color: "inherit" }}>Gói hiện tại</span>
      </div>
    );
  }

  const isSwitch = hasActiveAccess && !isCanceledLikeStatus;

  const labelEn = isSwitch
    ? plan === "month" ? "Switch to monthly" : "Switch to yearly"
    : plan === "month" ? "Subscribe monthly"  : "Subscribe yearly";

  const labelVi = isSwitch
    ? plan === "month" ? "Chuyển sang gói tháng" : "Chuyển sang gói năm"
    : plan === "month" ? "Đăng ký theo tháng" : "Đăng ký theo năm";

  return (
    <div>
      {labelEn}
      <span style={{ ...VIETNAMESE_SUB_STYLE, color: "inherit", opacity: 0.85 }}>
        {labelVi}
      </span>
    </div>
  );
}

async function wait(ms: number) {
  await new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function pollEntitlementAfterBilling(): Promise<Entitlement | null> {
  const delays = [0, 1200, 2500, 4500];
  for (const delay of delays) {
    if (delay > 0) await wait(delay);
    const data = await fetchMyEntitlement().catch((): Entitlement | null => null);
    if (data) return data;
  }
  return null;
}

export default function Billing() {
  const navigate = useNavigate();

  // Platform gate — iOS uses Apple IAP via RevenueCat per Apple 3.1.1.
  // Stripe subscribe / manage buttons must not render on iOS.
  const isIos = getPlatform() === "ios";

  const monthPriceId = resolvePriceId(
    pickEnv("VITE_STRIPE_PRICE_ONE_MONTH", "VITE_STRIPE_PRICE_MONTHLY", "VITE_STRIPE_MONTHLY_PRICE_ID"),
  );

  const yearPriceId = resolvePriceId(
    pickEnv("VITE_STRIPE_PRICE_ONE_YEAR", "VITE_STRIPE_PRICE_YEARLY", "VITE_STRIPE_YEARLY_PRICE_ID"),
  );

  const [ent, setEnt]             = useState<Entitlement | null>(null);
  const [loading, setLoading]     = useState(true);
  const [busyPlan, setBusyPlan]   = useState<PlanKey | null>(null);
  const [manageBusy, setManageBusy] = useState(false);
  const [errorText, setErrorText]   = useState<UiMessage | null>(null);
  const [successText, setSuccessText] = useState<UiMessage | null>(null);

  // Ref-based in-flight guards — block duplicate taps before state updates
  const busyPlanRef   = useRef<PlanKey | null>(null);
  const manageBusyRef = useRef(false);

  const isPremium      = ent?.is_premium === true;
  const currentPriceId = String(ent?.price_id ?? "").trim();
  const hasActiveAccess = hasActiveBillingAccess(ent?.status);
  const canceledLike   = isCanceledLike(ent?.status);

  const planName = useMemo(() => {
    if (!ent) return "Free Plan";
    if (ent.plan_name && ent.plan_name.trim()) return ent.plan_name.trim();
    return isPremium ? "Premium" : "Free Plan";
  }, [ent, isPremium]);

  const expiryText = useMemo(() => formatDateTime(getExpiryValue(ent)), [ent]);

  function isCurrentPlan(plan: PlanKey): boolean {
    const target = getPlanPriceId(plan, monthPriceId, yearPriceId);
    return !!currentPriceId && currentPriceId === target;
  }

  async function refreshEntitlement(options?: { silent?: boolean }) {
    if (!options?.silent) setLoading(true);
    setErrorText(null);
    try {
      const data = await fetchMyEntitlement();
      setEnt(data);
    } catch (error) {
      setEnt(null);
      setErrorText(
        normalizeUiErrorMessage(
          error instanceof Error ? error.message : "Unable to load billing status.",
        ),
      );
    } finally {
      if (!options?.silent) setLoading(false);
    }
  }

  useEffect(() => {
    void refreshEntitlement();
  }, []);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const billingState = query.get("billing");

    if (billingState === "updated") {
      setSuccessText({
        en: "Your plan was updated. Refreshing billing status...",
        vi: "Gói của bạn đã được cập nhật. Đang làm mới trạng thái thanh toán…",
      });

      void pollEntitlementAfterBilling().then((data) => {
        if (data) {
          setEnt(data);
          setSuccessText({
            en: "Your subscription is up to date.",
            vi: "Gói đăng ký của bạn đã được cập nhật đầy đủ.",
          });
        } else {
          setSuccessText({
            en: "Payment succeeded. Billing may take a moment to sync.",
            vi: "Thanh toán đã thành công. Hệ thống có thể cần thêm một chút thời gian để đồng bộ.",
          });
        }
      });
    }
  }, []);

  async function handlePlan(plan: PlanKey) {
    // Hard guard — block duplicate taps including cross-plan taps
    if (busyPlanRef.current !== null) return;

    const priceId = getPlanPriceId(plan, monthPriceId, yearPriceId);

    if (!priceId) {
      setErrorText({
        en: plan === "month"
          ? "Monthly Stripe price_id is not configured in root .env."
          : "Yearly Stripe price_id is not configured in root .env.",
        vi: plan === "month"
          ? "Stripe price_id cho gói tháng chưa được cấu hình trong root .env."
          : "Stripe price_id cho gói năm chưa được cấu hình trong root .env.",
      });
      return;
    }

    setErrorText(null);
    setSuccessText(null);
    busyPlanRef.current = plan;
    setBusyPlan(plan);

    try {
      const result = await startCheckoutOrOpenPortal({
        priceId,
        successUrl: `${window.location.origin}/billing/success?billing=updated&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/billing`,
      });

      if (result.mode === "change_plan") {
        setSuccessText({
          en: "Your plan was updated. Refreshing billing status...",
          vi: "Gói của bạn đã được cập nhật. Đang làm mới trạng thái thanh toán…",
        });

        const refreshed = await pollEntitlementAfterBilling();
        if (refreshed) {
          setEnt(refreshed);
        } else {
          await refreshEntitlement({ silent: true });
        }

        setSuccessText({
          en: "Your billing status is up to date.",
          vi: "Trạng thái thanh toán của bạn đã được cập nhật.",
        });
        return;
      }

      if (result.mode === "noop") {
        setSuccessText({
          en: "You are already on that plan.",
          vi: "Bạn đã ở đúng gói này rồi.",
        });
        await refreshEntitlement({ silent: true });
      }

      // mode === "checkout" or "portal" → page is navigating away
      // Do NOT reset busyPlanRef here — keep button locked during navigation
    } catch (error) {
      // Only reset on error — not during successful navigation
      busyPlanRef.current = null;
      setBusyPlan(null);
      setErrorText(
        normalizeUiErrorMessage(
          error instanceof Error ? error.message : "Unable to continue.",
        ),
      );
      return;
    }

    // Only reach here for noop/change_plan — safe to reset
    busyPlanRef.current = null;
    setBusyPlan(null);
  }

  async function handleManageBilling() {
    // Hard guard — ignore duplicate taps
    if (manageBusyRef.current) return;
    manageBusyRef.current = true;

    setErrorText(null);
    setSuccessText(null);
    setManageBusy(true);

    try {
      await openBillingPortal();
      // If redirect didn't happen, reset
      manageBusyRef.current = false;
      setManageBusy(false);
    } catch (error) {
      manageBusyRef.current = false;
      setManageBusy(false);
      setErrorText(
        normalizeUiErrorMessage(
          error instanceof Error ? error.message : "Unable to open billing portal.",
        ),
      );
    }
  }

  // ── Styles ──────────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    border: "1px solid rgba(15,23,42,0.10)",
    borderRadius: 18,
    background: "#fff",
    padding: 18,
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
  };

  const primaryButton: React.CSSProperties = {
    minHeight: 52,
    borderRadius: 14,
    border: "1px solid #0f172a",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 700,
    padding: "10px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const secondaryButton: React.CSSProperties = {
    minHeight: 52,
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#fff",
    color: "#111827",
    fontWeight: 700,
    padding: "10px 16px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  };

  const monthIsCurrent = isCurrentPlan("month");
  const yearIsCurrent  = isCurrentPlan("year");

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 60px" }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{ ...card, marginBottom: 16, background: "linear-gradient(180deg,#f8fafc 0%, #eefbf7 100%)" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(22px, 5.2vw, 32px)", lineHeight: 1.1, fontWeight: 950, color: "#111827" }}>
          Billing
          <span style={{ ...VIETNAMESE_SUB_STYLE, fontSize: 16, fontWeight: 500, color: "#94a3b8" }}>
            Quản lý thanh toán
          </span>
        </h1>

        <p style={{ margin: "10px 0 0", color: "#475569", lineHeight: 1.5 }}>
          Manage your subscription and payment methods.
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 13, color: "#94a3b8", lineHeight: 1.5 }}>
          Quản lý gói đăng ký và phương thức thanh toán của bạn.
        </p>

        {canceledLike ? (
          <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 14, background: "rgba(254,249,195,0.55)", border: "1px solid rgba(234,179,8,0.25)", color: "#854d0e", fontWeight: 700 }}>
            Your previous subscription ended. Choose a plan below to start a fresh subscription.
            <span style={{ ...VIETNAMESE_SUB_STYLE, color: "#854d0e" }}>
              Gói đăng ký cũ đã kết thúc. Vui lòng chọn một gói bên dưới để bắt đầu lại.
            </span>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <button type="button" onClick={() => void refreshEntitlement()} disabled={loading} style={secondaryButton}>
            Refresh access
            <span style={VIETNAMESE_SUB_STYLE}>Làm mới quyền truy cập</span>
          </button>

          {isIos ? (
            <button
              type="button"
              onClick={() => {
                try {
                  window.open(APPLE_MANAGE_SUBSCRIPTIONS_URL, "_blank", "noopener,noreferrer");
                } catch {
                  window.location.href = APPLE_MANAGE_SUBSCRIPTIONS_URL;
                }
              }}
              style={primaryButton}
            >
              Manage in Apple
              <span style={{ ...VIETNAMESE_SUB_STYLE, color: "rgba(255,255,255,0.7)" }}>
                Quản lý qua Apple
              </span>
            </button>
          ) : (
            <button type="button" onClick={() => void handleManageBilling()} disabled={manageBusy} style={primaryButton}>
              {manageBusy ? "Opening…" : "Manage billing"}
              <span style={{ ...VIETNAMESE_SUB_STYLE, color: "rgba(255,255,255,0.7)" }}>
                {manageBusy ? "Đang mở cổng thanh toán…" : "Quản lý thanh toán"}
              </span>
            </button>
          )}

          <button type="button" onClick={() => navigate("/pricing")} style={secondaryButton}>
            View plans
            <span style={VIETNAMESE_SUB_STYLE}>Xem gói</span>
          </button>
        </div>
      </div>

      {/* ── Success banner ───────────────────────────────────── */}
      {successText ? (
        <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(16,185,129,0.20)", background: "rgba(236,253,245,0.95)", color: "#065f46", fontWeight: 700 }}>
          {successText.en}
          <span style={{ ...VIETNAMESE_SUB_STYLE, color: "#065f46" }}>{successText.vi}</span>
        </div>
      ) : null}

      {/* ── Error banner ─────────────────────────────────────── */}
      {errorText ? (
        <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(239,68,68,0.20)", background: "rgba(254,242,242,0.95)", color: "#991b1b", fontWeight: 700 }}>
          {errorText.en}
          <span style={{ ...VIETNAMESE_SUB_STYLE, color: "#991b1b" }}>{errorText.vi}</span>
        </div>
      ) : null}

      {/* ── Cards ───────────────────────────────────────────── */}
      {/* min(100%, 280px) keeps auto-fit safe on 320px viewports: the grid
          can't demand a column wider than its container, so it collapses
          to 1 col instead of overflowing. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: 16 }}>

        {/* Current access */}
        <div style={card}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5, color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>
            Current access
            <span style={VIETNAMESE_SUB_STYLE}>Quyền truy cập hiện tại</span>
          </div>

          <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>
            {loading ? "..." : planName}
          </div>

          <div style={{ marginTop: 10, color: "#475569", lineHeight: 1.7, fontSize: 14 }}>
            <span style={{ fontWeight: 700 }}>Status</span>
            <span style={{ ...VIETNAMESE_SUB_STYLE, marginBottom: 4 }}>Trạng thái</span>
            <b>{loading ? "..." : getStatusLabel(ent?.status)}</b>

            <br />

            <span style={{ fontWeight: 700 }}>Renews</span>
            <span style={{ ...VIETNAMESE_SUB_STYLE, marginBottom: 4 }}>Gia hạn tiếp theo</span>
            <b>{loading ? "..." : expiryText}</b>

            <br />

            <span style={{ fontWeight: 700 }}>Auto-renew</span>
            <span style={{ ...VIETNAMESE_SUB_STYLE, marginBottom: 4 }}>Tự động gia hạn</span>
            <b>{loading ? "..." : ent?.cancel_at_period_end ? "Off — cancels at period end" : "On"}</b>
          </div>
        </div>

        {/* Monthly plan — hidden on iOS per Apple 3.1.1 (IAP-only) */}
        {!isIos && (
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>
              Monthly
              <span style={VIETNAMESE_SUB_STYLE}>Hàng tháng</span>
            </div>

            <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>{formatPrice(MONTHLY_PRICE_VND, "VND")}</div>

            <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.4, fontSize: 14 }}>
              Flexible recurring access with monthly billing.
              <span style={{ ...VIETNAMESE_SUB_STYLE, color: "#94a3b8", fontSize: 12 }}>
                Truy cập linh hoạt, thanh toán hàng tháng.
              </span>
            </div>

            <button
              type="button"
              onClick={() => void handlePlan("month")}
              disabled={loading || manageBusy || busyPlan === "month" || monthIsCurrent}
              style={{ ...primaryButton, width: "100%", marginTop: 16, opacity: monthIsCurrent ? 0.7 : 1, background: monthIsCurrent ? "#334155" : "#0f172a" }}
            >
              {getPlanButtonLabel({ loading, busyPlan, plan: "month", isCurrent: monthIsCurrent, hasActiveAccess, isCanceledLikeStatus: canceledLike })}
            </button>
          </div>
        )}

        {/* Yearly plan — hidden on iOS per Apple 3.1.1 (IAP-only) */}
        {!isIos && (
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>
              Yearly
              <span style={VIETNAMESE_SUB_STYLE}>Hàng năm</span>
            </div>

            <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>{formatPrice(YEARLY_PRICE_VND, "VND")}</div>

            <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.4, fontSize: 14 }}>
              Best long-term value with full premium access all year.
              <span style={{ ...VIETNAMESE_SUB_STYLE, color: "#94a3b8", fontSize: 12 }}>
                Giá trị tốt nhất với quyền Premium trong cả năm.
              </span>
            </div>

            <div style={{ marginTop: 10, fontSize: 12, fontWeight: 800, color: "#065f46", background: "rgba(16,185,129,0.1)", borderRadius: 10, padding: "6px 10px", display: "inline-block" }}>
              Save 17% • 2 months free
              <span style={{ display: "block", fontSize: 10, fontWeight: 400, color: "#047857" }}>
                Tiết kiệm 17% • Tặng 2 tháng
              </span>
            </div>

            <button
              type="button"
              onClick={() => void handlePlan("year")}
              disabled={loading || manageBusy || busyPlan === "year" || yearIsCurrent}
              style={{ ...primaryButton, width: "100%", marginTop: 16, opacity: yearIsCurrent ? 0.7 : 1, background: yearIsCurrent ? "#334155" : "#0f172a" }}
            >
              {getPlanButtonLabel({ loading, busyPlan, plan: "year", isCurrent: yearIsCurrent, hasActiveAccess, isCanceledLikeStatus: canceledLike })}
            </button>
          </div>
        )}

        {/* iOS-only — direct users to /pricing where Apple IAP card renders */}
        {isIos && (
          <div style={card}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>
              Subscribe
              <span style={VIETNAMESE_SUB_STYLE}>Đăng ký</span>
            </div>
            <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.5, fontSize: 14 }}>
              Subscriptions on iOS are billed through your Apple ID.
              <span style={{ ...VIETNAMESE_SUB_STYLE, color: "#94a3b8", fontSize: 12 }}>
                Trên iOS, gói đăng ký được thanh toán qua Apple ID.
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/pricing")}
              style={{ ...primaryButton, width: "100%", marginTop: 16 }}
            >
              See plans
              <span style={{ ...VIETNAMESE_SUB_STYLE, color: "rgba(255,255,255,0.7)" }}>
                Xem các gói
              </span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
