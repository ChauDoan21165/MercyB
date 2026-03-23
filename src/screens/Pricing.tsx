// src/screens/Pricing.tsx

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  trackCheckoutStarted,
  trackEvent,
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
};

const PAGE_MAX = 980;

/**
 * Replace these with your real Stripe price IDs if you do not want to depend on env vars.
 * The file will prefer env values when present, then fall back to these.
 */
const DIRECT_ONE_MONTH_PRICE_ID = "price_REPLACE_WITH_REAL_ONE_MONTH";
const DIRECT_ONE_YEAR_PRICE_ID = "price_REPLACE_WITH_REAL_ONE_YEAR";

function env(name: string): string {
  return String((import.meta as any).env?.[name] ?? "").trim();
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

function extractErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback;

  const record = payload as Record<string, unknown>;
  const error = typeof record.error === "string" ? record.error : "";
  const message = typeof record.message === "string" ? record.message : "";
  const detail = record.detail;

  if (error && message) return `${error}: ${message}`;
  if (error) return error;
  if (message) return message;

  if (detail && typeof detail === "object") {
    const detailRecord = detail as Record<string, unknown>;
    const detailMessage =
      typeof detailRecord.message === "string" ? detailRecord.message : "";
    if (detailMessage) return detailMessage;
  }

  return fallback;
}

export default function Pricing() {
  const navigate = useNavigate();

  const SUPABASE_URL = pickEnv("VITE_SUPABASE_URL");
  const SUPABASE_ANON_KEY = pickEnv("VITE_SUPABASE_ANON_KEY");

  const ONE_MONTH_PRICE_ID = resolvePriceId(
    pickEnv(
      "VITE_STRIPE_PRICE_ONE_MONTH",
      "VITE_STRIPE_PRICE_MONTHLY",
      "VITE_STRIPE_MONTHLY_PRICE_ID",
    ),
    DIRECT_ONE_MONTH_PRICE_ID,
  );

  const ONE_YEAR_PRICE_ID = resolvePriceId(
    pickEnv(
      "VITE_STRIPE_PRICE_ONE_YEAR",
      "VITE_STRIPE_PRICE_YEARLY",
      "VITE_STRIPE_YEARLY_PRICE_ID",
    ),
    DIRECT_ONE_YEAR_PRICE_ID,
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

    if (!SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
    if (!ONE_MONTH_PRICE_ID) {
      missing.push("monthly Stripe price_id (env or DIRECT_ONE_MONTH_PRICE_ID)");
    }
    if (!ONE_YEAR_PRICE_ID) {
      missing.push("yearly Stripe price_id (env or DIRECT_ONE_YEAR_PRICE_ID)");
    }

    return missing.length > 0 ? `Missing config: ${missing.join(", ")}` : "";
  }, [SUPABASE_URL, ONE_MONTH_PRICE_ID, ONE_YEAR_PRICE_ID]);

  const plans = useMemo<Plan[]>(
    () => [
      {
        key: "free",
        eyebrow: "Start here / Bắt đầu",
        title: "Free / Miễn phí",
        price: "",
        subtitleEn: "Start with limited rooms.",
        subtitleVi: "Bắt đầu với các phòng giới hạn.",
        bodyEn: "Begin gently and explore the atmosphere first.",
        bodyVi: "Bắt đầu nhẹ nhàng và cảm nhận không gian trước khi nâng cấp.",
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
        subtitleEn: "Try full access with flexible monthly billing.",
        subtitleVi: "Trải nghiệm toàn quyền truy cập với thanh toán hàng tháng linh hoạt.",
        bodyEn:
          "Good for learners who want every premium room without a longer commitment.",
        bodyVi:
          "Phù hợp cho người học muốn mở toàn bộ phòng premium mà chưa cần cam kết dài hạn.",
        cta: "Try full access",
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
        bodyEn: "Best long-term value for steady learning without billing friction.",
        bodyVi: "Giá trị tốt nhất cho hành trình dài hạn với ít gián đoạn thanh toán hơn.",
        cta: "Unlock full access",
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
        const accessToken = await getAccessToken({ redirectOnMissing: false });
        const result = await fetchEntitlement(accessToken);
        if (!mounted) return;
        setEntitlement(result);
        setShowAlreadySubscribedPanel(result.is_premium === true);
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

  async function getAccessToken(options?: {
    redirectOnMissing?: boolean;
  }): Promise<string> {
    const redirectOnMissing = options?.redirectOnMissing ?? true;

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(sessionError.message);
    }

    const accessToken = session?.access_token;
    if (!accessToken) {
      if (redirectOnMissing) {
        navigate("/signin");
      }
      throw new Error("Please sign in to continue.");
    }

    return accessToken;
  }

  async function fetchEntitlement(
    accessToken: string,
  ): Promise<EntitlementResponse> {
    if (!SUPABASE_URL) {
      throw new Error("Supabase URL is missing.");
    }

    const response = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/me-entitlement`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          ...(SUPABASE_ANON_KEY ? { apikey: SUPABASE_ANON_KEY } : {}),
        },
      },
    );

    const raw = await response.text();
    let payload: Record<string, unknown> = {};

    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(raw || "Entitlement returned a non-JSON response.");
    }

    if (!response.ok) {
      throw new Error(
        extractErrorMessage(payload, `Entitlement failed (${response.status})`),
      );
    }

    return payload as EntitlementResponse;
  }

  async function createBillingPortalSession(
    accessToken: string,
  ): Promise<string> {
    if (!SUPABASE_URL) {
      throw new Error("Supabase URL is missing.");
    }

    const response = await fetch(
      `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/create-billing-portal-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...(SUPABASE_ANON_KEY ? { apikey: SUPABASE_ANON_KEY } : {}),
        },
        body: JSON.stringify({}),
      },
    );

    const raw = await response.text();
    let payload: Record<string, unknown> = {};

    try {
      payload = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(raw || "Billing portal returned a non-JSON response.");
    }

    if (!response.ok) {
      throw new Error(
        extractErrorMessage(
          payload,
          `Billing portal failed (${response.status})`,
        ),
      );
    }

    const portalUrl = typeof payload.url === "string" ? payload.url : "";

    if (!portalUrl) {
      throw new Error("Billing portal URL missing from response.");
    }

    return portalUrl;
  }

  async function handleManageSubscription() {
    setErrorText("");
    setManageBusy(true);

    try {
      const accessToken = await getAccessToken();
      const portalUrl = await createBillingPortalSession(accessToken);
      window.location.assign(portalUrl);
    } catch (error) {
      setErrorText(
        error instanceof Error
          ? error.message
          : "Unable to open billing portal.",
      );
    } finally {
      setManageBusy(false);
    }
  }

  async function handlePaidPlan(plan: PaidPlanKey) {
    const priceId = plan === "month" ? ONE_MONTH_PRICE_ID : ONE_YEAR_PRICE_ID;

    setErrorText("");

    if (hasPremium) {
      setShowAlreadySubscribedPanel(true);
      await handleManageSubscription();
      return;
    }

    if (!priceId) {
      setErrorText(
        plan === "month"
          ? "Monthly Stripe price_id is not configured."
          : "Yearly Stripe price_id is not configured.",
      );
      return;
    }

    if (!SUPABASE_URL) {
      setErrorText("Supabase URL is missing.");
      return;
    }

    setBusyPlan(plan);

    try {
      const accessToken = await getAccessToken();

      trackCheckoutStarted({
        screen: "pricing",
        plan,
        price_id: priceId,
        path: window.location.pathname,
      });

      const successUrl =
        `${window.location.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl =
        `${window.location.origin}${window.location.pathname}?canceled=1`;

      const response = await fetch(
        `${SUPABASE_URL.replace(/\/$/, "")}/functions/v1/billing-stripe-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            ...(SUPABASE_ANON_KEY ? { apikey: SUPABASE_ANON_KEY } : {}),
          },
          body: JSON.stringify({
            price_id: priceId,
            success_url: successUrl,
            cancel_url: cancelUrl,
            quantity: 1,
          }),
        },
      );

      const raw = await response.text();
      let payload: Record<string, unknown> = {};

      try {
        payload = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(raw || "Checkout returned a non-JSON response.");
      }

      if (!response.ok) {
        throw new Error(
          extractErrorMessage(payload, `Checkout failed (${response.status})`),
        );
      }

      if (payload.already_subscribed === true) {
        setShowAlreadySubscribedPanel(true);
        const latestEntitlement = await fetchEntitlement(accessToken).catch(
          () => null,
        );

        if (latestEntitlement) {
          setEntitlement(latestEntitlement);
          setShowAlreadySubscribedPanel(latestEntitlement.is_premium === true);
        }

        const portalUrl = await createBillingPortalSession(accessToken);
        window.location.assign(portalUrl);
        return;
      }

      const checkoutUrl =
        typeof payload.url === "string"
          ? payload.url
          : typeof payload.checkout_url === "string"
            ? payload.checkout_url
            : typeof payload.checkoutUrl === "string"
              ? payload.checkoutUrl
              : "";

      if (!checkoutUrl) {
        throw new Error("Checkout URL missing from response.");
      }

      trackEvent("checkout_redirected", {
        screen: "pricing",
        plan,
        price_id: priceId,
        path: window.location.pathname,
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Unable to start checkout.",
      );
    } finally {
      setBusyPlan(null);
    }
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
          disabled={isBusy || manageBusy || entitlementLoading}
          aria-busy={isBusy}
          style={{
            ...actionStyle,
            cursor: isBusy ? "wait" : "pointer",
            opacity: isBusy ? 0.85 : 1,
          }}
        >
          {entitlementLoading
            ? "Checking access..."
            : isBusy
              ? hasPremium
                ? "Opening portal..."
                : "Opening secure checkout..."
              : hasPremium
                ? "Manage subscription"
                : plan.cta}
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
          Unlock every premium room in Mercy Blade
        </h1>

        <p style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7 }}>
          Get instant full access after payment. Choose flexible monthly billing
          or save more with yearly access.
        </p>

        <p style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7 }}>
          Mở khóa toàn bộ phòng premium ngay sau khi thanh toán. Chọn gói tháng
          linh hoạt hoặc tiết kiệm hơn với gói năm.
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
            👉 Browse rooms
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
              {manageBusy ? "Opening portal..." : "Manage Subscription"}
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
              {busyPlan === "year" ? "Opening..." : "Unlock full access"}
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
            🌿 Back to Home
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
            Manage or cancel your subscription anytime in Stripe.
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
            {manageBusy ? "Opening portal..." : "Manage Subscription"}
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
        Paid plans open Stripe Checkout for new subscribers, and route existing
        subscribers to Stripe Billing Portal instead of creating overlapping
        subscriptions.
      </p>
    </div>
  );
}