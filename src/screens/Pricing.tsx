// PATH: src/screens/Pricing.tsx
//
// CANONICAL: live pricing page. Wired at /pricing + /upgrade via AppRouter.tsx:63.
// Do not delete — survivor of src/screens/ scaffold cleanup (R3 #722). Uses
// formatPrice + MONTHLY_PRICE_VND + YEARLY_PRICE_VND from @/lib/pricing/displayPrices.

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyEntitlement,
  openBillingPortal,
  startCheckoutOrOpenPortal,
} from "@/lib/billing";
import {
  trackCheckoutStarted,
  trackPaywallShown,
  trackPricingViewed,
} from "@/lib/analytics";
import { getPlatform } from "@/lib/platform";
import { APPLE_MANAGE_SUBSCRIPTIONS_URL } from "@/lib/iap";
import IapPlanCard from "@/components/pricing/IapPlanCard";
import { SavingsBadge } from "@/components/pricing/SavingsBadge";
import {
  computeYearlySavingsPct,
  formatPrice,
  MONTHLY_PRICE_VND,
  YEARLY_PRICE_VND,
} from "@/lib/pricing/displayPrices";
import PaywallExperiment from "@/components/pricing/PaywallExperiment";
import SeoMeta from "@/components/seo/SeoMeta";
import { useAuth } from "@/providers/AuthProvider";

type PlanKey = "level0" | "month" | "year";
type PaidPlanKey = "month" | "year";
type PlanAccent = "plain" | "highlight";

type Plan = {
  key: PlanKey;
  eyebrow: string;
  title: string;
  titleVi: string;
  price: string;
  subtitleEn: string;
  subtitleVi: string;
  bodyEn: string;
  bodyVi: string;
  cta: string;
  accent: PlanAccent;
  bullets?: string[];
  bulletsVi?: string[];
  savingsBadge?: string;
};

type EntitlementResponse = {
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

const PAGE_MAX = 980;

const DIRECT_ONE_MONTH_PRICE_ID = "price_1TCKY02K1tPxy04uCHQNbvik";
const DIRECT_ONE_YEAR_PRICE_ID  = "price_1TCKSF2K1tPxy04uNeKcQWp5";

function env(name: string): string {
  return String(
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[name] ?? "",
  ).trim();
}

function pickEnv(...names: string[]): string {
  for (const name of names) {
    const value = env(name);
    if (value) return value;
  }
  return "";
}

function isUsablePriceId(value: string): boolean {
  if (!value) return false;
  if (!value.startsWith("price_")) return false;
  if (value.includes("REPLACE_WITH_REAL")) return false;
  return true;
}

function resolvePriceId(...candidates: string[]): string {
  for (const candidate of candidates) {
    const value = String(candidate ?? "").trim();
    if (isUsablePriceId(value)) return value;
  }
  return "";
}

function getPlanPriceId(plan: PaidPlanKey, monthPriceId: string, yearPriceId: string): string {
  return plan === "month" ? monthPriceId : yearPriceId;
}

function normalizeUiErrorMessage(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("unable to retrieve stripe price") || lower.includes("no such price")) {
    return "We couldn't load pricing. Please refresh or try again.";
  }
  if (lower.includes("tierid or priceid is required") || lower.includes("priceid is required")) {
    return "Checkout could not start because the Stripe price is missing from the request.";
  }
  return message;
}

// ── Bilingual helpers ─────────────────────────────────────────────────────────
const viStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 500,
  color: "#64748b",
  lineHeight: 1.5,
  marginTop: 2,
};

function BiText({ en, vi }: { en: string; vi: string }) {
  // EN-primary in DOM order (the buttons it sits in use this shape
  // consistently); VI is the typographically-smaller peer below. Both
  // languages declare `lang` so a screen-reader voice phoneticises
  // each correctly. WCAG 3.1.2 — finding P4 in docs/a11y/audit.md.
  return (
    <span style={{ display: "block" }}>
      <span lang="en">{en}</span>
      <span lang="vi" style={viStyle}>{vi}</span>
    </span>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Platform gate — iOS uses Apple IAP via RevenueCat per Apple 3.1.1.
  // Web + Android keep the existing Stripe flow unchanged.
  const platform = getPlatform();
  const isIos = platform === "ios";

  const ONE_MONTH_PRICE_ID = resolvePriceId(
    pickEnv("VITE_STRIPE_PRICE_ONE_MONTH", "VITE_STRIPE_PRICE_MONTHLY", "VITE_STRIPE_MONTHLY_PRICE_ID"),
    DIRECT_ONE_MONTH_PRICE_ID,
  );

  const ONE_YEAR_PRICE_ID = resolvePriceId(
    pickEnv("VITE_STRIPE_PRICE_ONE_YEAR", "VITE_STRIPE_PRICE_YEARLY", "VITE_STRIPE_YEARLY_PRICE_ID"),
    DIRECT_ONE_YEAR_PRICE_ID,
  );

  const [busyPlan, setBusyPlan]       = useState<PaidPlanKey | null>(null);
  const [manageBusy, setManageBusy]   = useState(false);
  const [errorText, setErrorText]     = useState("");
  const [planChangedText, setPlanChangedText] = useState("");
  const [entitlement, setEntitlement] = useState<EntitlementResponse | null>(null);
  const [entitlementLoading, setEntitlementLoading] = useState(true);
  const [showAlreadySubscribedPanel, setShowAlreadySubscribedPanel] = useState(false);

  // In-flight refs — prevent duplicate actions even if state hasn't updated yet
  const busyPlanRef   = useRef<PaidPlanKey | null>(null);
  const manageBusyRef = useRef(false);

  const trackedPricingViewed = useRef(false);
  const trackedPaywallShown  = useRef(false);

  const canceled = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("canceled") === "1";
  }, []);

  // ?ab=1 opt-in for the Step 9 paywall A/B framework. Default
  // behavior is unchanged: without the query param, the existing
  // bilingual pricing layout renders. With the param, the
  // PaywallExperiment container picks one of five variants
  // deterministically and falls back to the existing layout for
  // the implicit "control" bucket.
  const useExperiment = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("ab") === "1";
  }, []);

  const configWarning = useMemo(() => {
    const missing: string[] = [];
    if (!ONE_MONTH_PRICE_ID) missing.push("monthly Stripe price_id");
    if (!ONE_YEAR_PRICE_ID)  missing.push("yearly Stripe price_id");
    return missing.length > 0 ? `Missing config: ${missing.join(", ")}` : "";
  }, [ONE_MONTH_PRICE_ID, ONE_YEAR_PRICE_ID]);

  const plans = useMemo<Plan[]>(() => [
    {
      key: "level0",
      eyebrow: "Free",
      title: "Level 0",
      titleVi: "Miễn phí",
      price: "",
      subtitleEn: "Explore a limited set of rooms.",
      subtitleVi: "Khám phá một số phòng giới hạn.",
      bodyEn: "Start gently and get a feel for the experience first.",
      bodyVi: "Bắt đầu nhẹ nhàng và làm quen với trải nghiệm trước.",
      cta: "Browse rooms",
      accent: "plain",
      bullets: [
        "Explore the experience before upgrading",
        "Good for first-time visitors",
        "No billing required",
      ],
      bulletsVi: [
        "Khám phá trước khi nâng cấp",
        "Phù hợp cho người mới ghé thăm",
        "Không cần thẻ thanh toán",
      ],
    },
    {
      key: "month",
      eyebrow: "Flexible",
      title: "Full Access — Monthly",
      titleVi: "Toàn quyền — Hàng tháng",
      price: `${formatPrice(MONTHLY_PRICE_VND, "VND")} / month`,
      subtitleEn: "Flexible recurring access with monthly billing.",
      subtitleVi: "Toàn quyền truy cập linh hoạt với thanh toán hàng tháng.",
      bodyEn: "Good for learners who want every premium room without a longer commitment.",
      bodyVi: "Phù hợp cho người học muốn mở toàn bộ phòng premium mà chưa cần cam kết dài hạn.",
      cta: "Upgrade monthly",
      accent: "plain",
      bullets: [
        "Unlock all premium rooms",
        "Good for trying the full experience",
        "Flexible monthly billing",
      ],
      bulletsVi: [
        "Mở khóa mọi phòng premium",
        "Phù hợp cho người muốn thử trọn vẹn",
        "Thanh toán linh hoạt hàng tháng",
      ],
    },
    {
      key: "year",
      eyebrow: "Best value",
      title: "Full Access — Yearly",
      titleVi: "Toàn quyền — Hàng năm",
      price: `${formatPrice(YEARLY_PRICE_VND, "VND")} / year`,
      subtitleEn: "Save more and stay fully unlocked all year.",
      subtitleVi: "Tiết kiệm hơn và giữ toàn bộ quyền truy cập suốt cả năm.",
      bodyEn: "Best long-term value for steady learning without billing friction.",
      bodyVi: "Giá trị tốt nhất cho hành trình dài hạn với ít gián đoạn thanh toán hơn.",
      cta: "Upgrade yearly",
      accent: "highlight",
      bullets: [
        "Best long-term value",
        "Full premium access all year",
        "Less billing friction",
      ],
      bulletsVi: [
        "Giá trị dài hạn tốt nhất",
        "Trọn quyền premium cả năm",
        "Ít gián đoạn thanh toán hơn",
      ],
      // Replaced the legacy "Save 17%" string with the SavingsBadge
      // component (rendered in the card body below). This field is
      // intentionally left unset so the per-card render path skips the
      // generic string and uses the computed badge instead.
    },
  ], []);

  const hasPremium      = entitlement?.is_premium === true;
  const currentPriceId  = String(entitlement?.price_id ?? "").trim();

  useEffect(() => {
    if (trackedPricingViewed.current) return;
    trackPricingViewed({ screen: "pricing", path: window.location.pathname });
    trackedPricingViewed.current = true;
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadEntitlement() {
      try {
        setEntitlementLoading(true);
        const result = await fetchMyEntitlement();
        if (!mounted) return;
        setEntitlement(result as EntitlementResponse);
        setShowAlreadySubscribedPanel(result?.is_premium === true);
      } catch {
        if (!mounted) return;
        setEntitlement(null);
        setShowAlreadySubscribedPanel(false);
      } finally {
        if (mounted) setEntitlementLoading(false);
      }
    }
    void loadEntitlement();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (entitlementLoading) return;
    if (hasPremium) return;
    if (trackedPaywallShown.current) return;
    trackPaywallShown("pricing", { screen: "pricing", path: window.location.pathname });
    trackedPaywallShown.current = true;
  }, [entitlementLoading, hasPremium]);

  useEffect(() => {
    if (!entitlementLoading && hasPremium) {
      navigate("/billing", { replace: true });
    }
  }, [entitlementLoading, hasPremium, navigate]);

  async function refreshEntitlement() {
    const latest = await fetchMyEntitlement().catch(() => null);
    if (latest) {
      setEntitlement(latest as EntitlementResponse);
      setShowAlreadySubscribedPanel(latest.is_premium === true);
    }
  }

  async function handleManageSubscription() {
    // Hard guard — ignore duplicate taps
    if (manageBusyRef.current) return;
    manageBusyRef.current = true;

    setErrorText("");
    setPlanChangedText("");
    setManageBusy(true);

    try {
      await openBillingPortal();
      // If we reach here, redirect didn't happen — reset
      manageBusyRef.current = false;
      setManageBusy(false);
    } catch (error) {
      manageBusyRef.current = false;
      const message = error instanceof Error ? error.message : "Unable to open billing portal.";
      if (message.toLowerCase().includes("sign in") ||
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("auth")) {
        navigate("/signin");
        return;
      }
      setErrorText(normalizeUiErrorMessage(message));
      setManageBusy(false);
    }
  }

  function isCurrentPlan(plan: PaidPlanKey): boolean {
    const targetPriceId = getPlanPriceId(plan, ONE_MONTH_PRICE_ID, ONE_YEAR_PRICE_ID);
    return !!currentPriceId && currentPriceId === targetPriceId;
  }

  async function handlePaidPlan(plan: PaidPlanKey) {
    // Hard guard — ignore duplicate taps including taps on a different plan
    if (busyPlanRef.current !== null) return;

    const priceId = getPlanPriceId(plan, ONE_MONTH_PRICE_ID, ONE_YEAR_PRICE_ID);

    setErrorText("");
    setPlanChangedText("");

    if (!priceId) {
      setErrorText(
        plan === "month"
          ? "Monthly Stripe price_id is not configured."
          : "Yearly Stripe price_id is not configured.",
      );
      return;
    }

    if (hasPremium && isCurrentPlan(plan)) {
      setShowAlreadySubscribedPanel(true);
      setErrorText("");
      return;
    }

    busyPlanRef.current = plan;
    setBusyPlan(plan);

    try {
      trackCheckoutStarted({
        screen: "pricing",
        plan,
        price_id: priceId,
        path: window.location.pathname,
        mode: hasPremium ? "change_plan" : "checkout",
      });

      await startCheckoutOrOpenPortal({ priceId });

      // If we reach here, redirect didn't happen (e.g. change_plan noop)
      await refreshEntitlement();

      if (hasPremium) {
        setPlanChangedText(
          plan === "month"
            ? "Plan updated to monthly billing."
            : "Plan updated to yearly billing.",
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to continue.";

      if (message.toLowerCase().includes("sign in") ||
          message.toLowerCase().includes("unauthorized") ||
          message.toLowerCase().includes("auth")) {
        navigate("/signin");
        return;
      }

      if (message.toLowerCase().includes("already subscribed") ||
          message.toLowerCase().includes("already have") ||
          message.toLowerCase().includes("current plan")) {
        setShowAlreadySubscribedPanel(true);
        await refreshEntitlement();
        setErrorText("");
        return;
      }

      setErrorText(normalizeUiErrorMessage(message));
    } finally {
      busyPlanRef.current = null;
      setBusyPlan(null);
    }
  }

  function getPaidButtonText(plan: PaidPlanKey, isBusy: boolean): React.ReactNode {
    if (entitlementLoading) return (
      <BiText en="Checking access…" vi="Đang kiểm tra quyền truy cập…" />
    );
    if (isBusy) return hasPremium
      ? <BiText en="Updating plan…" vi="Đang cập nhật gói…" />
      : <BiText en="Opening secure checkout…" vi="Đang mở trang thanh toán bảo mật…" />;
    if (!hasPremium) return plan === "month"
      ? <BiText en="Upgrade monthly" vi="Nâng cấp hàng tháng" />
      : <BiText en="Upgrade yearly" vi="Nâng cấp hàng năm" />;
    if (isCurrentPlan(plan)) return (
      <BiText en="Current plan" vi="Gói hiện tại" />
    );
    return plan === "month"
      ? <BiText en="Switch to monthly" vi="Chuyển sang hàng tháng" />
      : <BiText en="Switch to yearly" vi="Chuyển sang hàng năm" />;
  }

  function renderCard(plan: Plan) {
    const isHighlight = plan.accent === "highlight";

    const commonCardStyle: React.CSSProperties = {
      minHeight: 460,
      borderRadius: 18,
      border: "1px solid rgba(15,23,42,0.10)",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      textAlign: "left",
      boxShadow: isHighlight
        ? "0 12px 34px rgba(16,185,129,0.14)"
        : "0 6px 20px rgba(15,23,42,0.05)",
      background: isHighlight
        ? "linear-gradient(180deg, rgba(236,253,245,0.98) 0%, rgba(240,253,250,0.96) 100%)"
        : "#ffffff",
      position: "relative",
      overflow: "hidden",
    };

    const badgeStyle: React.CSSProperties = {
      alignSelf: "flex-start",
      minHeight: 28,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 800,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: isHighlight ? "#065f46" : "#0f766e",
      background: isHighlight ? "rgba(16,185,129,0.16)" : "rgba(13,148,136,0.10)",
      visibility: plan.eyebrow ? "visible" : "hidden",
    };

    const titleStyle: React.CSSProperties = {
      fontSize: 19,
      fontWeight: 900,
      lineHeight: 1.2,
      color: "#111827",
      margin: 0,
    };

    const titleViStyle: React.CSSProperties = {
      display: "block",
      fontSize: 13,
      fontWeight: 500,
      color: "#64748b",
      marginTop: 3,
    };

    const priceStyle: React.CSSProperties = {
      fontSize: 26,
      fontWeight: 900,
      lineHeight: 1.15,
      color: "#111827",
      margin: 0,
      minHeight: 32,
    };

    const subEnStyle: React.CSSProperties = {
      fontSize: 14,
      fontWeight: 700,
      color: "#334155",
      margin: 0,
      lineHeight: 1.5,
    };

    const subViStyle: React.CSSProperties = {
      fontSize: 12,
      fontWeight: 400,
      color: "#64748b",
      margin: "2px 0 0",
      lineHeight: 1.5,
    };

    const bodyEnStyle: React.CSSProperties = {
      fontSize: 14,
      lineHeight: 1.6,
      color: "#475569",
      margin: 0,
    };

    const bodyViStyle: React.CSSProperties = {
      fontSize: 12,
      lineHeight: 1.5,
      color: "#64748b",
      margin: "2px 0 0",
    };

    const bulletListStyle: React.CSSProperties = {
      margin: 0,
      paddingLeft: 18,
      color: "#334155",
      lineHeight: 1.7,
      fontSize: 14,
      fontWeight: 600,
    };

    // Vietnamese bullet companion — pairs with the `bulletsVi?: string[]`
    // field on `Plan`. Tolerates missing / shorter VI arrays gracefully —
    // falls back to EN-only render if the VI string at the same index is
    // absent. Color is slate-500 (#64748b, 4.78:1 contrast on white) per
    // the !64 a11y-contrast audit; do NOT switch to slate-400 even though
    // sibling muted styles still use it — the audit test forbids the
    // failing slate-400 hex in audit-fixed files (which this file is,
    // post-!58 batch-2 alignment).
    const bulletViStyle: React.CSSProperties = {
      display: "block",
      fontSize: 12,
      fontWeight: 400,
      color: "#64748b",
      marginTop: 2,
      lineHeight: 1.5,
    };

    const actionStyle: React.CSSProperties = {
      marginTop: "auto",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      minHeight: 52,
      padding: "10px 16px",
      border: "1px solid rgba(15,23,42,0.12)",
      background: plan.key === "level0" ? "#ffffff" : "#0f172a",
      color: plan.key === "level0" ? "#0f172a" : "#ffffff",
      fontSize: 14,
      fontWeight: 900,
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
    };

    if (plan.key === "level0") {
      return (
        <div key={plan.key} style={commonCardStyle}>
          <div style={badgeStyle}>{plan.eyebrow}</div>
          <h3 style={titleStyle}>
            <span lang="en">{plan.title}</span>
            <span lang="vi" style={titleViStyle}>{plan.titleVi}</span>
          </h3>
          <p style={priceStyle} aria-hidden="true" />
          <div>
            <p lang="en" style={subEnStyle}>{plan.subtitleEn}</p>
            <p lang="vi" style={subViStyle}>{plan.subtitleVi}</p>
          </div>
          <div>
            <p lang="en" style={bodyEnStyle}>{plan.bodyEn}</p>
            <p lang="vi" style={bodyViStyle}>{plan.bodyVi}</p>
          </div>
          {plan.bullets?.length ? (
            <ul style={bulletListStyle}>
              {plan.bullets.map((bullet, i) => (
                <li key={bullet}>
                  <span lang="en">{bullet}</span>
                  {plan.bulletsVi?.[i] ? (
                    <span lang="vi" style={bulletViStyle}>{plan.bulletsVi[i]}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          <button type="button" style={actionStyle} onClick={() => navigate("/rooms")}>
            {plan.cta}
          </button>
        </div>
      );
    }

    const paidKey    = plan.key as PaidPlanKey;
    const isBusy     = busyPlan === paidKey;
    const currentPlan = isCurrentPlan(paidKey);

    return (
      <div key={plan.key} style={{ ...commonCardStyle, opacity: isBusy ? 0.75 : 1 }}>
        <div style={badgeStyle}>{plan.eyebrow}</div>
        <h3 style={titleStyle}>
          <span lang="en">{plan.title}</span>
          <span lang="vi" style={titleViStyle}>{plan.titleVi}</span>
        </h3>
        <p lang="en" style={priceStyle}>{plan.price}</p>
        <div>
          <p lang="en" style={subEnStyle}>{plan.subtitleEn}</p>
          <p lang="vi" style={subViStyle}>{plan.subtitleVi}</p>
        </div>
        <div>
          <p lang="en" style={bodyEnStyle}>{plan.bodyEn}</p>
          <p lang="vi" style={bodyViStyle}>{plan.bodyVi}</p>
        </div>
        {plan.bullets?.length ? (
          <ul style={bulletListStyle}>
            {plan.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        ) : null}
        {plan.key === "year" ? (
          <SavingsBadge
            monthlyAmount={MONTHLY_PRICE_VND}
            yearlyAmount={YEARLY_PRICE_VND}
            currency="VND"
            variant="full"
          />
        ) : plan.savingsBadge ? (
          <div style={{ fontSize: 13, fontWeight: 800, color: "#065f46", background: "rgba(16,185,129,0.10)", borderRadius: 12, padding: "8px 10px" }}>
            {plan.savingsBadge}
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void handlePaidPlan(paidKey)}
          disabled={isBusy || manageBusy || entitlementLoading || currentPlan}
          aria-busy={isBusy}
          style={{
            ...actionStyle,
            cursor: currentPlan ? "default" : isBusy ? "wait" : "pointer",
            opacity: currentPlan ? 0.7 : isBusy ? 0.85 : 1,
            background: currentPlan ? "#334155" : actionStyle.background,
          }}
        >
          {getPaidButtonText(paidKey, isBusy)}
        </button>
      </div>
    );
  }

  const defaultPricingMarkup = (
    <main
      id="main-content"
      tabIndex={-1}
      style={{ maxWidth: PAGE_MAX, margin: "0 auto", padding: "12px 16px 40px" }}
    >

      {/* ── Hero banner ─────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg,#f8fafc 0%, #eefbf7 100%)",
        border: "1px solid rgba(15,23,42,0.08)",
        borderRadius: 20,
        padding: 20,
        marginBottom: 18,
      }}>
        <h1 lang="en" style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontWeight: 950, color: "#111827" }}>
          Get full access to all premium rooms
        </h1>
        <p lang="vi" style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
          Mở toàn bộ phòng học premium của MercyBlade
        </p>

        <p lang="en" style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7, fontSize: 15 }}>
          Choose a plan that fits your learning pace. Upgrade anytime.
        </p>
        <p lang="vi" style={{ margin: "3px 0 0", fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>
          Chọn gói phù hợp với tốc độ học của bạn. Có thể nâng cấp bất cứ lúc nào.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14, color: "#475569", fontSize: 13, fontWeight: 700 }}>
          <span>{isIos ? "Billed through your Apple ID" : "Secure Stripe checkout"}</span>
          <span>•</span>
          <span>Cancel anytime</span>
          <span>•</span>
          <span>No hidden fees</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: 18 }}>
          {[
            { en: "Full access to all premium rooms",          vi: "Toàn quyền truy cập phòng premium" },
            { en: "Instant unlock after successful payment",   vi: "Mở khóa ngay sau khi thanh toán thành công" },
            isIos
              ? { en: "Manage or cancel in Apple ID settings",   vi: "Quản lý hoặc hủy trong Cài đặt Apple ID" }
              : { en: "Manage or cancel anytime in Stripe",      vi: "Quản lý hoặc hủy bất cứ lúc nào qua Stripe" },
          ].map(({ en, vi }) => (
            <div key={en} style={{ borderRadius: 14, border: "1px solid rgba(15,23,42,0.08)", background: "rgba(255,255,255,0.80)", padding: "10px 12px" }}>
              <div lang="en" style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>✓ {en}</div>
              <div lang="vi" style={{ fontSize: 11, fontWeight: 400, color: "#64748b", marginTop: 2 }}>{vi}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 18 }}>
          <button type="button" onClick={() => navigate("/rooms")}
            style={{ borderRadius: 14, minHeight: 46, padding: "12px 16px", border: "1px solid rgba(13,148,136,0.15)", background: "#2aa198", color: "#fff", fontWeight: 900, cursor: "pointer" }}>
            Browse rooms
          </button>

          {hasPremium ? (
            <button type="button"
              onClick={() => {
                if (isIos) {
                  try { window.open(APPLE_MANAGE_SUBSCRIPTIONS_URL, "_blank", "noopener,noreferrer"); }
                  catch { window.location.href = APPLE_MANAGE_SUBSCRIPTIONS_URL; }
                  return;
                }
                void handleManageSubscription();
              }}
              disabled={!isIos && (manageBusy || entitlementLoading)}
              style={{ borderRadius: 14, minHeight: 46, padding: "12px 16px", border: "1px solid rgba(15,23,42,0.12)", background: "#0f172a", color: "#fff", fontWeight: 900, cursor: manageBusy ? "wait" : "pointer", opacity: manageBusy ? 0.85 : 1 }}>
              <BiText
                en={isIos ? "Manage in Apple" : (manageBusy ? "Opening portal…" : "Manage subscription")}
                vi={isIos ? "Quản lý qua Apple" : (manageBusy ? "Đang mở cổng thanh toán…" : "Quản lý gói đăng ký")}
              />
            </button>
          ) : (
            <button type="button"
              onClick={() => {
                if (isIos) {
                  const el = document.getElementById("mb-plans-grid");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  return;
                }
                void handlePaidPlan("year");
              }}
              disabled={!isIos && (busyPlan !== null || entitlementLoading)}
              style={{ borderRadius: 14, minHeight: 46, padding: "12px 16px", border: "1px solid rgba(15,23,42,0.12)", background: "#0f172a", color: "#fff", fontWeight: 900, cursor: busyPlan ? "wait" : "pointer", opacity: busyPlan ? 0.85 : 1 }}>
              <BiText
                en={isIos ? "See plans" : (busyPlan === "year" ? "Opening…" : "Upgrade now")}
                vi={isIos ? "Xem các gói" : (busyPlan === "year" ? "Đang mở…" : "Nâng cấp ngay")}
              />
            </button>
          )}

          <button type="button" onClick={() => navigate("/")}
            style={{ borderRadius: 14, minHeight: 46, padding: "12px 16px", border: "1px solid rgba(15,23,42,0.12)", background: "#fff", color: "#111827", fontWeight: 900, cursor: "pointer" }}>
            Back to home
          </button>
        </div>
      </div>

      {/* ── Already subscribed panel ─────────────────────────── */}
      {showAlreadySubscribedPanel && hasPremium ? (
        <div style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 14, border: "1px solid rgba(13,148,136,0.22)", background: "rgba(240,253,250,0.96)", color: "#115e59" }}>
          <div style={{ fontWeight: 900, marginBottom: 2 }}>
            You already have premium access.
          </div>
          <div style={{ fontSize: 12, color: "#5eead4", marginBottom: 8 }}>
            Bạn đã có quyền truy cập premium.
          </div>
          <div style={{ lineHeight: 1.6, marginBottom: 10, fontSize: 14 }}>
            {isIos
              ? "Manage or cancel your subscription in Apple ID settings."
              : "Choose another paid plan to switch immediately, or open Stripe to manage billing and cancellation."}
          </div>
          <button type="button"
            onClick={() => {
              if (isIos) {
                try { window.open(APPLE_MANAGE_SUBSCRIPTIONS_URL, "_blank", "noopener,noreferrer"); }
                catch { window.location.href = APPLE_MANAGE_SUBSCRIPTIONS_URL; }
                return;
              }
              void handleManageSubscription();
            }}
            disabled={!isIos && manageBusy}
            style={{ borderRadius: 12, minHeight: 42, padding: "10px 14px", border: "1px solid rgba(15,23,42,0.12)", background: "#0f172a", color: "#fff", fontWeight: 900, cursor: manageBusy ? "wait" : "pointer", opacity: manageBusy ? 0.85 : 1 }}>
            <BiText
              en={isIos ? "Manage in Apple" : (manageBusy ? "Opening portal…" : "Manage subscription")}
              vi={isIos ? "Quản lý qua Apple" : (manageBusy ? "Đang mở cổng thanh toán…" : "Quản lý gói đăng ký")}
            />
          </button>
        </div>
      ) : null}

      {/* ── Plan changed confirmation ────────────────────────── */}
      {planChangedText ? (
        <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(13,148,136,0.22)", background: "rgba(240,253,250,0.96)", color: "#115e59", fontWeight: 700 }}>
          {planChangedText}
        </div>
      ) : null}

      {/* ── Checkout canceled notice ─────────────────────────── */}
      {canceled ? (
        <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(245,158,11,0.25)", background: "rgba(255,251,235,0.95)", color: "#92400e" }}>
          <div style={{ fontWeight: 700 }}>Checkout was canceled. No changes were made.</div>
          <div style={{ fontSize: 12, color: "#b45309", marginTop: 2 }}>Thanh toán đã bị hủy. Không có thay đổi nào được thực hiện.</div>
        </div>
      ) : null}

      {/* ── Config warning ───────────────────────────────────── */}
      {configWarning ? (
        <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(245,158,11,0.25)", background: "rgba(255,251,235,0.95)", color: "#92400e", fontWeight: 700 }}>
          {configWarning}
        </div>
      ) : null}

      {/* ── Error banner ────────────────────────────────────── */}
      {errorText ? (
        <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 14, border: "1px solid rgba(239,68,68,0.20)", background: "rgba(254,242,242,0.95)" }}>
          <div style={{ fontWeight: 700, color: "#991b1b" }}>{errorText}</div>
          <div style={{ fontSize: 12, color: "#b91c1c", marginTop: 2 }}>Có lỗi xảy ra. Vui lòng thử lại.</div>
        </div>
      ) : null}

      {/* ── Yearly vs Monthly comparison block ──────────────────
          Spelled out so the savings math is unambiguous: 12× monthly
          on the left, yearly on the right (highlighted), with the
          delta + percent saved between them. VN-first copy. */}
      {!isIos ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            gap: 12,
            alignItems: "stretch",
            margin: "8px 0 18px",
          }}
          aria-label="Monthly vs yearly comparison"
        >
          {(() => {
            const monthlyTotal = MONTHLY_PRICE_VND * 12;
            const savings = monthlyTotal - YEARLY_PRICE_VND;
            const pct = computeYearlySavingsPct(MONTHLY_PRICE_VND, YEARLY_PRICE_VND);
            const cellBase: React.CSSProperties = {
              borderRadius: 14,
              padding: "12px 14px",
              border: "1px solid rgba(15,23,42,0.10)",
              background: "#ffffff",
            };
            const cellHighlight: React.CSSProperties = {
              ...cellBase,
              background: "linear-gradient(180deg, rgba(236,253,245,0.98) 0%, rgba(240,253,250,0.96) 100%)",
              borderColor: "rgba(16,185,129,0.30)",
              boxShadow: "0 8px 22px rgba(16,185,129,0.12)",
            };
            const labelEnStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" };
            const labelViStyle: React.CSSProperties = { fontSize: 11, fontWeight: 500, color: "#64748b", marginTop: 1 };
            const figureStyle: React.CSSProperties = { fontSize: 22, fontWeight: 950, color: "#0f172a", marginTop: 6, lineHeight: 1.1 };
            const subFigureStyle: React.CSSProperties = { fontSize: 12, color: "#64748b", marginTop: 4 };
            const arrowStyle: React.CSSProperties = {
              alignSelf: "center",
              justifySelf: "center",
              fontSize: 22,
              fontWeight: 900,
              color: "#0f766e",
              padding: "0 8px",
              userSelect: "none",
            };

            return (
              <>
                <div style={cellBase}>
                  <div style={labelEnStyle}>If paid monthly</div>
                  <div style={labelViStyle}>Nếu trả theo tháng (12 tháng)</div>
                  <div style={figureStyle}>{formatPrice(monthlyTotal, "VND")}</div>
                  <div style={subFigureStyle}>
                    {formatPrice(MONTHLY_PRICE_VND, "VND")} × 12 tháng
                  </div>
                </div>

                <div style={arrowStyle} aria-hidden>
                  →
                </div>

                <div style={cellHighlight}>
                  <div style={{ ...labelEnStyle, color: "#065f46" }}>Yearly plan</div>
                  <div style={{ ...labelViStyle, color: "#0f766e" }}>Gói hàng năm</div>
                  <div style={figureStyle}>{formatPrice(YEARLY_PRICE_VND, "VND")}</div>
                  <div style={{ ...subFigureStyle, color: "#0f766e", fontWeight: 700 }}>
                    Tiết kiệm {pct}% — chỉ {formatPrice(YEARLY_PRICE_VND / 12, "VND")}/tháng
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                    Save {pct}% · ≈ {formatPrice(YEARLY_PRICE_VND / 12, "VND")}/month
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, fontWeight: 700, color: "#065f46" }}>
                    You save {formatPrice(savings, "VND")} per year
                  </div>
                  <div style={{ fontSize: 11, color: "#0f766e", marginTop: 1 }}>
                    Tiết kiệm {formatPrice(savings, "VND")} mỗi năm
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      ) : null}

      {/* ── Plan cards ──────────────────────────────────────── */}
      <div id="mb-plans-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, alignItems: "stretch" }}>
        {isIos ? (
          <>
            {renderCard(plans[0])}
            <IapPlanCard onEntitlementGranted={() => { void refreshEntitlement(); }} />
          </>
        ) : (
          plans.map(renderCard)
        )}
      </div>

      <p lang="en" style={{ marginTop: 16, fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
        {isIos
          ? "Subscriptions are billed through your Apple ID and managed in Apple ID → Subscriptions."
          : "Payments are processed securely through Stripe. Existing subscribers are managed through Stripe Billing Portal."}
      </p>

      {/* Subscription disclosure — required by Apple 3.1.2(c) + Google Play */}
      <div style={{ marginTop: 20, padding: 14, borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", background: "#f8fafc", fontSize: 12, lineHeight: 1.6, color: "#475569" }}>
        <p lang="en" style={{ marginTop: 0, marginBottom: 6 }}>
          <strong>Auto-renewing subscription.</strong> Your subscription renews automatically at the end of each billing period at the price shown above unless you cancel at least 24 hours before the renewal date. You can manage or cancel your subscription at any time from the billing portal (web) or Apple account settings (iOS).
        </p>
        <p lang="vi" style={{ margin: "0 0 8px", color: "#64748b" }}>
          Gói đăng ký tự động gia hạn. Gói sẽ tự động gia hạn vào cuối mỗi kỳ thanh toán với mức giá niêm yết trừ khi bạn hủy ít nhất 24 giờ trước ngày gia hạn. Bạn có thể quản lý hoặc hủy bất cứ lúc nào.
        </p>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <a href="/terms"   target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}><span lang="vi">Điều khoản sử dụng</span> / <span lang="en">Terms of Use (EULA)</span></a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}><span lang="vi">Chính sách quyền riêng tư</span> / <span lang="en">Privacy Policy</span></a>
        </div>
      </div>
    </main>
  );

  return (
    <>
      <SeoMeta
        title="Bảng giá MercyBlade — Học tiếng Anh cho người Việt"
        description="Các gói học tiếng Anh MercyBlade dành cho người Việt. Dùng thử miễn phí 7 ngày, hủy bất cứ lúc nào."
        canonical="https://mercyblade.com/pricing"
      />
      {useExperiment ? (
        <PaywallExperiment
          userId={user?.id ?? null}
          trialExpiresAt={entitlement?.expires_at ?? null}
          onSelectPlan={(key) => void handlePaidPlan(key)}
          controlFallback={defaultPricingMarkup}
        />
      ) : (
        defaultPricingMarkup
      )}
    </>
  );
}