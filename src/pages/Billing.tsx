import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyEntitlement,
  openBillingPortal,
  startCheckoutOrOpenPortal,
} from "@/lib/billing";

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

const DIRECT_ONE_MONTH_PRICE_ID = "price_1TCKY02K1tPxy04uCHQNbvik";
const DIRECT_ONE_YEAR_PRICE_ID = "price_1TCKSF2K1tPxy04uNeKcQWp5";

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

function getStatusLabel(status: string | null | undefined): string {
  switch (status) {
    case "active":
      return "Active";
    case "trialing":
      return "Active";
    case "past_due":
      return "Past due";
    case "grace_period":
      return "Grace period";
    case "paused":
      return "Paused";
    case "canceled":
      return "Canceled";
    case "expired":
      return "Expired";
    case "revoked":
      return "Revoked";
    default:
      return "Inactive";
  }
}

function getPlanPriceId(
  plan: PlanKey,
  monthPriceId: string,
  yearPriceId: string,
): string {
  return plan === "month" ? monthPriceId : yearPriceId;
}

export default function Billing() {
  const navigate = useNavigate();

  const monthPriceId = resolvePriceId(
    pickEnv(
      "VITE_STRIPE_PRICE_ONE_MONTH",
      "VITE_STRIPE_PRICE_MONTHLY",
      "VITE_STRIPE_MONTHLY_PRICE_ID",
    ),
    DIRECT_ONE_MONTH_PRICE_ID,
  );

  const yearPriceId = resolvePriceId(
    pickEnv(
      "VITE_STRIPE_PRICE_ONE_YEAR",
      "VITE_STRIPE_PRICE_YEARLY",
      "VITE_STRIPE_YEARLY_PRICE_ID",
    ),
    DIRECT_ONE_YEAR_PRICE_ID,
  );

  const [ent, setEnt] = useState<Entitlement | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyPlan, setBusyPlan] = useState<PlanKey | null>(null);
  const [manageBusy, setManageBusy] = useState(false);
  const [errorText, setErrorText] = useState("");

  const isPremium = ent?.is_premium === true;
  const currentPriceId = String(ent?.price_id ?? "").trim();

  const planName = useMemo(() => {
    if (!ent) return "Free";
    if (ent.plan_name && ent.plan_name.trim()) return ent.plan_name.trim();
    return isPremium ? "Premium" : "Free";
  }, [ent, isPremium]);

  const expiryText = useMemo(() => formatDateTime(getExpiryValue(ent)), [ent]);

  function isCurrentPlan(plan: PlanKey): boolean {
    const target = getPlanPriceId(plan, monthPriceId, yearPriceId);
    return !!currentPriceId && currentPriceId === target;
  }

  async function refreshEntitlement() {
    setLoading(true);
    setErrorText("");
    try {
      const data = await fetchMyEntitlement();
      setEnt(data);
    } catch (error) {
      setEnt(null);
      setErrorText(
        error instanceof Error ? error.message : "Unable to load billing status.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshEntitlement();
  }, []);

  async function handlePlan(plan: PlanKey) {
    const priceId = getPlanPriceId(plan, monthPriceId, yearPriceId);
    if (!priceId) {
      setErrorText(
        plan === "month"
          ? "Monthly Stripe price_id is not configured."
          : "Yearly Stripe price_id is not configured.",
      );
      return;
    }

    setErrorText("");
    setBusyPlan(plan);

    try {
      const result = await startCheckoutOrOpenPortal({
        priceId,
        successUrl:
          `${window.location.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/billing`,
      });

      if (result.mode === "change_plan" || result.mode === "noop") {
        await refreshEntitlement();
      }
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Unable to continue.",
      );
    } finally {
      setBusyPlan(null);
    }
  }

  async function handleManageBilling() {
    setErrorText("");
    setManageBusy(true);
    try {
      await openBillingPortal();
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

  const card: React.CSSProperties = {
    border: "1px solid rgba(15,23,42,0.10)",
    borderRadius: 18,
    background: "#fff",
    padding: 18,
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
  };

  const primaryButton: React.CSSProperties = {
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid #0f172a",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 900,
    padding: "12px 16px",
    cursor: "pointer",
  };

  const secondaryButton: React.CSSProperties = {
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#fff",
    color: "#111827",
    fontWeight: 900,
    padding: "12px 16px",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        maxWidth: 980,
        margin: "0 auto",
        padding: "24px 16px 60px",
      }}
    >
      <div
        style={{
          ...card,
          marginBottom: 16,
          background: "linear-gradient(180deg,#f8fafc 0%, #eefbf7 100%)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            lineHeight: 1.1,
            fontWeight: 950,
            color: "#111827",
          }}
        >
          Billing
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            lineHeight: 1.7,
          }}
        >
          Manage your premium access, switch plans, or open Stripe billing portal.
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
            onClick={() => void refreshEntitlement()}
            disabled={loading}
            style={secondaryButton}
          >
            {loading ? "Refreshing..." : "Refresh billing"}
          </button>

          <button
            type="button"
            onClick={() => void handleManageBilling()}
            disabled={manageBusy}
            style={primaryButton}
          >
            {manageBusy ? "Opening..." : "Manage billing"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/pricing")}
            style={secondaryButton}
          >
            Open pricing
          </button>
        </div>
      </div>

      {errorText ? (
        <div
          style={{
            marginBottom: 16,
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
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        <div style={card}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              color: "rgba(0,0,0,0.48)",
              marginBottom: 8,
            }}
          >
            Current plan
          </div>

          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: "#111827",
            }}
          >
            {loading ? "Loading..." : planName}
          </div>

          <div
            style={{
              marginTop: 10,
              color: "#475569",
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            Status: <b>{loading ? "Loading..." : getStatusLabel(ent?.status)}</b>
            <br />
            Source: <b>{loading ? "Loading..." : (ent?.source || "—")}</b>
            <br />
            Expires: <b>{loading ? "Loading..." : expiryText}</b>
            <br />
            Cancel at period end:{" "}
            <b>{loading ? "Loading..." : (ent?.cancel_at_period_end ? "Yes" : "No")}</b>
          </div>
        </div>

        <div style={card}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              color: "rgba(0,0,0,0.48)",
              marginBottom: 8,
            }}
          >
            Monthly
          </div>

          <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>
            200 000 VND
          </div>

          <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.7 }}>
            Flexible recurring access with monthly billing.
          </div>

          <button
            type="button"
            onClick={() => void handlePlan("month")}
            disabled={loading || manageBusy || busyPlan === "month" || isCurrentPlan("month")}
            style={{
              ...primaryButton,
              width: "100%",
              marginTop: 16,
              opacity: isCurrentPlan("month") ? 0.7 : 1,
              cursor: isCurrentPlan("month") ? "default" : "pointer",
              background: isCurrentPlan("month") ? "#334155" : "#0f172a",
              borderColor: isCurrentPlan("month") ? "#334155" : "#0f172a",
            }}
          >
            {loading
              ? "Checking..."
              : busyPlan === "month"
                ? "Working..."
                : isCurrentPlan("month")
                  ? "Current plan"
                  : isPremium
                    ? "Switch to monthly"
                    : "Choose monthly"}
          </button>
        </div>

        <div style={card}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              color: "rgba(0,0,0,0.48)",
              marginBottom: 8,
            }}
          >
            Yearly
          </div>

          <div style={{ fontSize: 26, fontWeight: 900, color: "#111827" }}>
            2 000 000 VND
          </div>

          <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.7 }}>
            Best long-term value with full premium access all year.
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              fontWeight: 800,
              color: "#065f46",
              background: "rgba(16,185,129,0.10)",
              borderRadius: 12,
              padding: "8px 10px",
              display: "inline-block",
            }}
          >
            Save 17% • 2 months free
          </div>

          <button
            type="button"
            onClick={() => void handlePlan("year")}
            disabled={loading || manageBusy || busyPlan === "year" || isCurrentPlan("year")}
            style={{
              ...primaryButton,
              width: "100%",
              marginTop: 16,
              opacity: isCurrentPlan("year") ? 0.7 : 1,
              cursor: isCurrentPlan("year") ? "default" : "pointer",
              background: isCurrentPlan("year") ? "#334155" : "#0f172a",
              borderColor: isCurrentPlan("year") ? "#334155" : "#0f172a",
            }}
          >
            {loading
              ? "Checking..."
              : busyPlan === "year"
                ? "Working..."
                : isCurrentPlan("year")
                  ? "Current plan"
                  : isPremium
                    ? "Switch to yearly"
                    : "Choose yearly"}
          </button>
        </div>
      </div>
    </div>
  );
}