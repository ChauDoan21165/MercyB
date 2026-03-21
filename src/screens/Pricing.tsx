// src/pages/Pricing.tsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

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
  const [errorText, setErrorText] = useState("");

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
        eyebrow: "",
        title: "Free / Miễn phí",
        price: "",
        subtitleEn: "Start with limited rooms.",
        subtitleVi: "Bắt đầu với các phòng giới hạn.",
        bodyEn: "Begin gently and feel the atmosphere.",
        bodyVi: "Đi nhẹ nhàng và cảm nhận không gian của Mercy Blade.",
        cta: "Browse rooms",
        accent: "plain",
      },
      {
        key: "month",
        eyebrow: "Recommended / Gợi ý",
        title: "Full Access / Toàn quyền truy cập",
        price: "200 000 VND / month",
        subtitleEn: "One Month / 1 tháng",
        subtitleVi: "Mở khóa toàn bộ hành trình trong 1 tháng.",
        bodyEn:
          "Best for learners who want flexibility without a long commitment.",
        bodyVi:
          "Phù hợp cho người học muốn linh hoạt mà chưa cần cam kết dài hạn.",
        cta: "Choose monthly",
        accent: "highlight",
      },
      {
        key: "year",
        eyebrow: "",
        title: "Full Access / Toàn quyền truy cập",
        price: "2 000 000 VND / year",
        subtitleEn: "1 Year / 1 năm",
        subtitleVi: "Đồng hành cùng Mercy Blade trong dài hạn.",
        bodyEn: "Best value for steady, lasting access.",
        bodyVi: "Giá trị tốt nhất cho quyền truy cập ổn định và lâu dài.",
        cta: "Choose yearly",
        accent: "plain",
      },
    ],
    [],
  );

  async function handlePaidPlan(plan: PaidPlanKey) {
    const priceId = plan === "month" ? ONE_MONTH_PRICE_ID : ONE_YEAR_PRICE_ID;

    setErrorText("");

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
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(sessionError.message);
      }

      const accessToken = session?.access_token;
      if (!accessToken) {
        navigate("/signin");
        return;
      }

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
      minHeight: 360,
      borderRadius: 18,
      border: "1px solid rgba(15,23,42,0.10)",
      padding: 18,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      textAlign: "left",
      boxShadow:
        plan.accent === "highlight"
          ? "0 10px 30px rgba(16,185,129,0.10)"
          : "0 6px 20px rgba(15,23,42,0.05)",
      background:
        plan.accent === "highlight"
          ? "linear-gradient(180deg, rgba(236,253,245,0.98) 0%, rgba(240,253,250,0.96) 100%)"
          : "#ffffff",
    };

    const badgeStyle: React.CSSProperties = {
      alignSelf: "flex-start",
      minHeight: 28,
      padding: "6px 10px",
      borderRadius: 999,
      fontSize: 13,
      fontWeight: 800,
      color: "#0f766e",
      background: "rgba(13,148,136,0.10)",
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

        <button
          type="button"
          onClick={() => handlePaidPlan(paidKey)}
          disabled={isBusy}
          aria-busy={isBusy}
          style={{
            ...actionStyle,
            cursor: isBusy ? "wait" : "pointer",
            opacity: isBusy ? 0.85 : 1,
          }}
        >
          {isBusy ? "Opening checkout..." : plan.cta}
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
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 950,
            color: "#111827",
          }}
        >
          Choose your plan
        </h1>

        <p style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7 }}>
          When you want to go deeper, you can unlock{" "}
          <strong>Full Access for One Month</strong> or choose{" "}
          <strong>1 Year</strong> for longer continuity.
        </p>

        <p style={{ margin: "12px 0 0", color: "#475569", lineHeight: 1.7 }}>
          Mercy Blade bắt đầu với các phòng miễn phí. Khi bạn muốn đi sâu hơn,
          bạn có thể mở khóa <strong>Toàn Quyền Truy Cập trong 1 tháng</strong>{" "}
          hoặc chọn <strong>1 năm</strong> để đồng hành dài lâu hơn.
        </p>

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
        The paid cards now skip the blocked client-side subscription tier query
        and open Stripe checkout directly through the existing{" "}
        <code>billing-stripe-checkout-session</code> function for the signed-in
        user.
      </p>
    </div>
  );
}