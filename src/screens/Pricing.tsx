// File: src/screens/Pricing.tsx

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

type PlanKey = "free" | "month" | "year";
type PaidPlanKey = "month" | "year";
type PlanAccent = "plain" | "highlight";

type Plan = {
  key: PlanKey;
  eyebrow: string;
  title: string;
  price: string;
  subtitleEn: string;
  subtitleVi: string;
  bodyEn: string;
  bodyVi: string;
  cta: string;
  accent: PlanAccent;
  bullets?: string[];
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

function env(name: string): string {
  return String(
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.[name] ??
      "",
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

function getPlanPriceId(
  plan: PaidPlanKey,
  monthPriceId: string,
  yearPriceId: string,
): string {
  return plan === "month" ? monthPriceId : yearPriceId;
}

function normalizeUiErrorMessage(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("unable to retrieve stripe price") ||
    lower.includes("no such price")
  ) {
    return "We couldn’t load pricing. Please refresh or try again.";
  }

  if (
    lower.includes("tierid or priceid is required") ||
    lower.includes("priceid is required")
  ) {
    return "Checkout could not start because the Stripe price is missing from the request.";
  }

  return message;
}

export default function Pricing() {
  const navigate = useNavigate();

  const ONE_MONTH_PRICE_ID = resolvePriceId(
    pickEnv(
      "VITE_STRIPE_PRICE_ONE_MONTH",
      "VITE_STRIPE_PRICE_MONTHLY",
      "VITE_STRIPE_MONTHLY_PRICE_ID",
    ),
  );

  const ONE_YEAR_PRICE_ID = resolvePriceId(
    pickEnv(
      "VITE_STRIPE_PRICE_ONE_YEAR",
      "VITE_STRIPE_PRICE_YEARLY",
      "VITE_STRIPE_YEARLY_PRICE_ID",
    ),
  );

  const [busyPlan, setBusyPlan] = useState<PaidPlanKey | null>(null);
  const [manageBusy, setManageBusy] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [entitlement, setEntitlement] = useState<EntitlementResponse | null>(
    null,
  );
  const [entitlementLoading, setEntitlementLoading] = useState(true);
  const [showAlreadySubscribedPanel, setShowAlreadySubscribedPanel] =
    useState(false);

  const trackedPricingViewed = useRef(false);
  const trackedPaywallShown = useRef(false);

  const canceled = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("canceled") === "1";
  }, []);

  const configWarning = useMemo(() => {
    const missing: string[] = [];

    if (!ONE_MONTH_PRICE_ID) missing.push("monthly Stripe price_id");
    if (!ONE_YEAR_PRICE_ID) missing.push("yearly Stripe price_id");

    return missing.length > 0 ? `Missing config: ${missing.join(", ")}` : "";
  }, [ONE_MONTH_PRICE_ID, ONE_YEAR_PRICE_ID]);

  const plans = useMemo<Plan[]>(
    () => [
      {
        key: "free",
        eyebrow: "Start free / Bắt đầu",
        title: "Free / Miễn phí",
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
      },
      {
        key: "month",
        eyebrow: "Flexible / Linh hoạt",
        title: "Full Access — Monthly / Toàn quyền — Tháng",
        price: "200 000 VND / month",
        subtitleEn: "Flexible recurring access with monthly billing.",
        subtitleVi: "Toàn quyền truy cập linh hoạt với thanh toán hàng tháng.",
        bodyEn:
          "Good for learners who want every premium room without a longer commitment.",
        bodyVi:
          "Phù hợp cho người học muốn mở toàn bộ phòng premium mà chưa cần cam kết dài hạn.",
        cta: "Upgrade monthly",
        accent: "plain",
        bullets: [
          "Unlock all premium rooms",
          "Good for trying the full experience",
          "Flexible monthly billing",
        ],
      },
      {
        key: "year",
        eyebrow: "Best value / Tiết kiệm nhất",
        title: "Full Access — Yearly / Toàn quyền — Năm",
        price: "2 000 000 VND / year",
        subtitleEn: "Save more and stay fully unlocked all year.",
        subtitleVi: "Tiết kiệm hơn và giữ toàn bộ quyền truy cập suốt cả năm.",
        bodyEn:
          "Best long-term value for steady learning without billing friction.",
        bodyVi:
          "Giá trị tốt nhất cho hành trình dài hạn với ít gián đoạn thanh toán hơn.",
        cta: "Upgrade yearly",
        accent: "highlight",
        bullets: [
          "Best long-term value",
          "Full premium access all year",
          "Less billing friction",
        ],
        savingsBadge: "Save 17% • 2 months free",
      },
    ],
    [],
  );

  const hasPremium = entitlement?.is_premium === true;
  const currentPriceId = String(entitlement?.price_id ?? "").trim();

  useEffect(() => {
    if (trackedPricingViewed.current) return;

    trackPricingViewed({
      screen: "pricing",
      path: window.location.pathname,
    });

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
        if (mounted) {
          setEntitlementLoading(false);
        }
      }
    }

    void loadEntitlement();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (entitlementLoading) return;
    if (hasPremium) return;
    if (trackedPaywallShown.current) return;

    trackPaywallShown("pricing", {
      screen: "pricing",
      path: window.location.pathname,
    });

    trackedPaywallShown.current = true;
  }, [entitlementLoading, hasPremium]);

  useEffect(() => {
    if (!entitlementLoading && hasPremium) {
      navigate("/billing", { replace: true });
    }
  }, [entitlementLoading, hasPremium, navigate]);

  async function refreshEntitlement() {
    const latestEntitlement = await fetchMyEntitlement().catch(() => null);

    if (latestEntitlement) {
      setEntitlement(latestEntitlement as EntitlementResponse);
      setShowAlreadySubscribedPanel(latestEntitlement.is_premium === true);
    }
  }

  async function handleManageSubscription() {
    setErrorText("");
    setManageBusy(true);

    try {
      await openBillingPortal();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to open billing portal.";

      if (
        message.toLowerCase().includes("sign in") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("auth")
      ) {
        navigate("/signin");
        return;
      }

      setErrorText(normalizeUiErrorMessage(message));
    } finally {
      setManageBusy(false);
    }
  }

  function isCurrentPlan(plan: PaidPlanKey): boolean {
    const targetPriceId = getPlanPriceId(
      plan,
      ONE_MONTH_PRICE_ID,
      ONE_YEAR_PRICE_ID,
    );
    return !!currentPriceId && currentPriceId === targetPriceId;
  }

  async function handlePaidPlan(plan: PaidPlanKey) {
    const priceId = getPlanPriceId(plan, ONE_MONTH_PRICE_ID, ONE_YEAR_PRICE_ID);

    setErrorText("");

    if (!priceId) {
      setErrorText(
        plan === "month"
          ? "Monthly Stripe price_id is not configured."
          : "Yearly Stripe price_id is not configured.",
      );
      return;
    }

    setBusyPlan(plan);

    try {
      if (hasPremium && isCurrentPlan(plan)) {
        setShowAlreadySubscribedPanel(true);
        setErrorText("");
        return;
      }

      trackCheckoutStarted({
        screen: "pricing",
        plan,
        price_id: priceId,
        path: window.location.pathname,
        mode: hasPremium ? "change_plan" : "checkout",
      });

      await startCheckoutOrOpenPortal({
        priceId,
      });

      await refreshEntitlement();

      if (hasPremium) {
        alert(
          plan === "month"
            ? "Plan update requested for monthly."
            : "Plan update requested for yearly.",
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to continue.";

      if (
        message.toLowerCase().includes("sign in") ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("auth")
      ) {
        navigate("/signin");
        return;
      }

      if (
        message.toLowerCase().includes("already subscribed") ||
        message.toLowerCase().includes("already have") ||
        message.toLowerCase().includes("current plan")
      ) {
        setShowAlreadySubscribedPanel(true);
        await refreshEntitlement();
        setErrorText("");
        return;
      }

      setErrorText(normalizeUiErrorMessage(message));
    } finally {
      setBusyPlan(null);
    }
  }

  function getPaidButtonText(plan: PaidPlanKey, isBusy: boolean): string {
    if (entitlementLoading) return "Checking access...";
    if (isBusy) {
      return hasPremium ? "Updating plan..." : "Opening secure checkout...";
    }

    if (!hasPremium) {
      return plan === "month" ? "Upgrade monthly" : "Upgrade yearly";
    }

    if (isCurrentPlan(plan)) {
      return "Current plan";
    }

    return plan === "month" ? "Switch to monthly" : "Switch to yearly";
  }

  function renderCard(plan: Plan) {
    const commonCardStyle: React.CSSProperties = {
      minHeight: 460,
      borderRadius: 18,
      border: "1px solid rgba(15,23,42,0.10)",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      textAlign: "left",
      boxShadow:
        plan.accent === "highlight"
          ? "0 12px 34px rgba(16,185,129,0.14)"
          : "0 6px 20px rgba(15,23,42,0.05)",
      background:
        plan.accent === "highlight"
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
      fontSize: 13,
      fontWeight: 800,
      color: plan.accent === "highlight" ? "#065f46" : "#0f766e",
      background:
        plan.accent === "highlight"
          ? "rgba(16,185,129,0.16)"
          : "rgba(13,148,136,0.10)",
      visibility: plan.eyebrow ? "visible" : "hidden",
    };

    const titleStyle: React.CSSProperties = {
      fontSize: 20,
      fontWeight: 900,
      lineHeight: 1.25,
      color: "#111827",
      margin: 0,
    };

    const priceStyle: React.CSSProperties = {
      fontSize: 28,
      fontWeight: 900,
      lineHeight: 1.15,
      color: "#111827",
      margin: 0,
      minHeight: 32,
    };

    const subStyle: React.CSSProperties = {
      fontSize: 15,
      fontWeight: 800,
      color: "#334155",
      margin: 0,
    };

    const bodyStyle: React.CSSProperties = {
      fontSize: 15,
      lineHeight: 1.6,
      color: "#475569",
      margin: 0,
    };

    const bulletListStyle: React.CSSProperties = {
      margin: 0,
      paddingLeft: 18,
      color: "#334155",
      lineHeight: 1.7,
      fontSize: 14,
      fontWeight: 600,
    };

    const actionStyle: React.CSSProperties = {
      marginTop: "auto",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 14,
      minHeight: 48,
      padding: "12px 16px",
      border: "1px solid rgba(15,23,42,0.12)",
      background: plan.key === "free" ? "#ffffff" : "#0f172a",
      color: plan.key === "free" ? "#0f172a" : "#ffffff",
      fontSize: 15,
      fontWeight: 900,
      cursor: "pointer",
      width: "100%",
    };

    if (plan.key === "free") {
      return (
        <div key={plan.key} style={commonCardStyle}>
          <div style={badgeStyle}>{plan.eyebrow || "placeholder"}</div>
          <h3 style={titleStyle}>{plan.title}</h3>
          <p style={priceStyle} aria-hidden="true" />
          <p style={subStyle}>{plan.subtitleEn}</p>
          <p style={bodyStyle}>{plan.bodyEn}</p>
          <p style={bodyStyle}>{plan.subtitleVi}</p>
          <p style={bodyStyle}>{plan.bodyVi}</p>

          {plan.bullets?.length ? (
            <ul style={bulletListStyle}>
              {plan.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            style={actionStyle}
            onClick={() => navigate("/rooms")}
          >
            {plan.cta}
          </button>
        </div>
      );
    }

    const paidKey = plan.key as PaidPlanKey;
    const isBusy = busyPlan === paidKey;
    const currentPlan = isCurrentPlan(paidKey);

    return (
      <div
        key={plan.key}
        style={{
          ...commonCardStyle,
          opacity: isBusy ? 0.75 : 1,
        }}
      >
        <div style={badgeStyle}>{plan.eyebrow || "placeholder"}</div>
        <h3 style={titleStyle}>{plan.title}</h3>
        <p style={priceStyle}>{plan.price}</p>
        <p style={subStyle}>{plan.subtitleEn}</p>
        <p style={bodyStyle}>{plan.bodyEn}</p>
        <p style={bodyStyle}>{plan.subtitleVi}</p>
        <p style={bodyStyle}>{plan.bodyVi}</p>

        {plan.bullets?.length ? (
          <ul style={bulletListStyle}>
            {plan.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        ) : null}

        {plan.savingsBadge ? (
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#065f46",
              background: "rgba(16,185,129,0.10)",
              borderRadius: 12,
              padding: "8px 10px",
            }}
          >
            {plan.savingsBadge}
          </div>
        ) : plan.key === "year" ? (
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#065f46",
              background: "rgba(16,185,129,0.10)",
              borderRadius: 12,
              padding: "8px 10px",
            }}
          >
            Better long-term value for steady practice.
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => handlePaidPlan(paidKey)}
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

  return (
    <div
      style={{
        maxWidth: PAGE_MAX,
        margin: "0 auto",
        padding: "12px 16px 40px",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg,#f8fafc 0%, #eefbf7 100%)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 20,
          padding: 20,
          marginBottom: 18,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            lineHeight: 1.08,
            fontWeight: 950,
            color: "#111827",
          }}
        >
          Get full access to all premium rooms
        </h1>

        <p style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7 }}>
          Choose a plan that fits your learning pace. Upgrade anytime.
        </p>

        <p style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7 }}>
          Chọn gói phù hợp với tốc độ học của bạn. Có thể nâng cấp bất cứ lúc nào.
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 14,
            color: "#475569",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span>Secure Stripe checkout</span>
          <span>•</span>
          <span>Cancel anytime</span>
          <span>•</span>
          <span>No hidden fees</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 10,
            marginTop: 18,
          }}
        >
          {[
            "Full access to all premium rooms",
            "Instant unlock after successful payment",
            "Manage or cancel anytime in Stripe",
          ].map((bullet) => (
            <div
              key={bullet}
              style={{
                borderRadius: 14,
                border: "1px solid rgba(15,23,42,0.08)",
                background: "rgba(255,255,255,0.80)",
                padding: "10px 12px",
                fontSize: 14,
                fontWeight: 700,
                color: "#334155",
              }}
            >
              ✓ {bullet}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginTop: 18,
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/rooms")}
            style={{
              borderRadius: 14,
              minHeight: 46,
              padding: "12px 16px",
              border: "1px solid rgba(13,148,136,0.15)",
              background: "#2aa198",
              color: "#fff",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Browse rooms
          </button>

          {hasPremium ? (
            <button
              type="button"
              onClick={handleManageSubscription}
              disabled={manageBusy || entitlementLoading}
              style={{
                borderRadius: 14,
                minHeight: 46,
                padding: "12px 16px",
                border: "1px solid rgba(15,23,42,0.12)",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 900,
                cursor: manageBusy ? "wait" : "pointer",
                opacity: manageBusy ? 0.85 : 1,
              }}
            >
              {manageBusy ? "Opening portal..." : "Manage subscription"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handlePaidPlan("year")}
              disabled={busyPlan !== null || entitlementLoading}
              style={{
                borderRadius: 14,
                minHeight: 46,
                padding: "12px 16px",
                border: "1px solid rgba(15,23,42,0.12)",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 900,
                cursor: busyPlan ? "wait" : "pointer",
                opacity: busyPlan ? 0.85 : 1,
              }}
            >
              {busyPlan === "year" ? "Opening..." : "Upgrade now"}
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              borderRadius: 14,
              minHeight: 46,
              padding: "12px 16px",
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#fff",
              color: "#111827",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Back to home
          </button>
        </div>
      </div>

      {showAlreadySubscribedPanel && hasPremium ? (
        <div
          style={{
            marginBottom: 14,
            padding: "14px 16px",
            borderRadius: 14,
            border: "1px solid rgba(13, 148, 136, 0.22)",
            background: "rgba(240, 253, 250, 0.96)",
            color: "#115e59",
          }}
        >
          <div style={{ fontWeight: 900, marginBottom: 6 }}>
            You already have premium access.
          </div>
          <div style={{ lineHeight: 1.6, marginBottom: 10 }}>
            Choose another paid plan to switch immediately, or open Stripe to
            manage billing and cancellation.
          </div>
          <button
            type="button"
            onClick={handleManageSubscription}
            disabled={manageBusy}
            style={{
              borderRadius: 12,
              minHeight: 42,
              padding: "10px 14px",
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#0f172a",
              color: "#fff",
              fontWeight: 900,
              cursor: manageBusy ? "wait" : "pointer",
              opacity: manageBusy ? 0.85 : 1,
            }}
          >
            {manageBusy ? "Opening portal..." : "Manage subscription"}
          </button>
        </div>
      ) : null}

      {canceled ? (
        <div
          style={{
            marginBottom: 14,
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid rgba(245, 158, 11, 0.25)",
            background: "rgba(255, 251, 235, 0.95)",
            color: "#92400e",
            fontWeight: 700,
          }}
        >
          Checkout was canceled. No changes were made.
        </div>
      ) : null}

      {configWarning ? (
        <div
          style={{
            marginBottom: 14,
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid rgba(245, 158, 11, 0.25)",
            background: "rgba(255, 251, 235, 0.95)",
            color: "#92400e",
            fontWeight: 700,
          }}
        >
          {configWarning}
        </div>
      ) : null}

      {errorText ? (
        <div
          style={{
            marginBottom: 14,
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid rgba(239,68,68,0.20)",
            background: "rgba(254,242,242,0.95)",
            color: "#991b1b",
            fontWeight: 700,
          }}
        >
          {errorText}
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
          alignItems: "stretch",
        }}
      >
        {plans.map(renderCard)}
      </div>

      <p
        style={{
          marginTop: 16,
          fontSize: 14,
          color: "#64748b",
          lineHeight: 1.6,
        }}
      >
        New subscribers are routed through the centralized billing helper.
        Existing subscribers use the same billing layer for checkout and billing
        management via Stripe Billing Portal.
      </p>
    </div>
  );
}