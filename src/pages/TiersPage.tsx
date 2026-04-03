import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { startCheckoutOrOpenPortal } from "@/lib/billing";

type TierCard = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  badge?: string;
  featured?: boolean;
};

const TIERS: TierCard[] = [
  {
    id: "vip1",
    name: "Monthly",
    description:
      "Flexible premium access with monthly billing and full room access.",
    priceLabel: "200 000 VND / month",
  },
  {
    id: "vip9",
    name: "Yearly",
    description:
      "Best long-term value with full premium access all year.",
    priceLabel: "2 000 000 VND / year",
    badge: "Best value",
    featured: true,
  },
];

export default function TiersPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [busyTierId, setBusyTierId] = useState<string | null>(null);
  const [errorText, setErrorText] = useState("");

  const safeBackPath = useMemo(() => {
    const p = location.pathname || "/";
    if (p.startsWith("/admin")) return "/";
    return "/";
  }, [location.pathname]);

  async function handleTier(tierId: string) {
    setErrorText("");
    setBusyTierId(tierId);

    try {
      const result = await startCheckoutOrOpenPortal({
        tierId,
        successUrl:
          `${window.location.origin}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/tiers`,
      });

      if (result.mode === "change_plan" || result.mode === "noop") {
        navigate("/billing");
      }
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Unable to continue.",
      );
    } finally {
      setBusyTierId(null);
    }
  }

  const pageCard: React.CSSProperties = {
    border: "1px solid rgba(15,23,42,0.10)",
    borderRadius: 18,
    background: "#fff",
    padding: 18,
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
  };

  const buttonStyle: React.CSSProperties = {
    minHeight: 46,
    borderRadius: 14,
    border: "1px solid #0f172a",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 900,
    padding: "12px 16px",
    cursor: "pointer",
    width: "100%",
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
          ...pageCard,
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
          Learning paths & premium tiers
        </h1>

        <p
          style={{
            margin: "12px 0 0",
            color: "#475569",
            lineHeight: 1.7,
          }}
        >
          Choose the access level that fits your learning path. New subscribers
          are sent to secure Stripe checkout. Existing subscribers are routed
          into clean plan switching instead of duplicate subscriptions.
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
            onClick={() => navigate(safeBackPath)}
            style={{
              minHeight: 46,
              borderRadius: 14,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#fff",
              color: "#111827",
              fontWeight: 900,
              padding: "12px 16px",
              cursor: "pointer",
            }}
          >
            Back home
          </button>

          <button
            type="button"
            onClick={() => navigate("/billing")}
            style={{
              minHeight: 46,
              borderRadius: 14,
              border: "1px solid rgba(15,23,42,0.12)",
              background: "#fff",
              color: "#111827",
              fontWeight: 900,
              padding: "12px 16px",
              cursor: "pointer",
            }}
          >
            Open billing
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
        {TIERS.map((tier) => (
          <div
            key={tier.id}
            style={{
              ...pageCard,
              background: tier.featured
                ? "linear-gradient(180deg, rgba(236,253,245,0.98) 0%, rgba(240,253,250,0.96) 100%)"
                : "#fff",
              boxShadow: tier.featured
                ? "0 12px 34px rgba(16,185,129,0.14)"
                : pageCard.boxShadow,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                minHeight: 28,
                padding: "6px 10px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                color: tier.featured ? "#065f46" : "#0f766e",
                background: tier.featured
                  ? "rgba(16,185,129,0.16)"
                  : "rgba(13,148,136,0.10)",
                visibility: tier.badge ? "visible" : "hidden",
              }}
            >
              {tier.badge || "badge"}
            </div>

            <h2
              style={{
                margin: "12px 0 0",
                fontSize: 22,
                fontWeight: 900,
                color: "#111827",
              }}
            >
              {tier.name}
            </h2>

            <div
              style={{
                marginTop: 8,
                fontSize: 28,
                fontWeight: 900,
                color: "#111827",
              }}
            >
              {tier.priceLabel}
            </div>

            <p
              style={{
                marginTop: 10,
                color: "#475569",
                lineHeight: 1.7,
              }}
            >
              {tier.description}
            </p>

            <button
              type="button"
              onClick={() => void handleTier(tier.id)}
              disabled={busyTierId === tier.id}
              style={{
                ...buttonStyle,
                marginTop: 16,
                opacity: busyTierId === tier.id ? 0.85 : 1,
                cursor: busyTierId === tier.id ? "wait" : "pointer",
              }}
            >
              {busyTierId === tier.id ? "Working..." : "Continue"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}