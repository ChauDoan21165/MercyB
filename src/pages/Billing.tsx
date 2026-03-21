// src/pages/Billing.tsx
import { useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useEntitlements } from "@/lib/useEntitlements";

type CheckoutTierId =
  | "3d5a977c-4fde-4afc-99a4-4b37c3555839"
  | "a2863250-1798-443e-b1d3-d20e3db06281";

const MONTHLY_TIER_ID =
  "3d5a977c-4fde-4afc-99a4-4b37c3555839" as const;
const YEARLY_TIER_ID =
  "a2863250-1798-443e-b1d3-d20e3db06281" as const;

function getCurrentPlanLabel(
  ent: ReturnType<typeof useEntitlements>["ent"],
): string {
  if (!ent || ent.is_premium !== true || ent.status !== "active") {
    return "FREE";
  }

  if (typeof ent.plan_name === "string" && ent.plan_name.trim()) {
    return ent.plan_name.toUpperCase();
  }

  if (ent.vip_tier === "vip9") return "ONE YEAR";
  if (ent.vip_tier === "vip1") return "ONE MONTH";

  return "PREMIUM";
}

export default function Billing() {
  const [busyTierId, setBusyTierId] = useState<CheckoutTierId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { ent, loading } = useEntitlements();

  const isPremium = ent?.is_premium === true && ent.status === "active";
  const currentPlanLabel = getCurrentPlanLabel(ent);

  const tiers = useMemo(
    () =>
      [
        {
          tierId: MONTHLY_TIER_ID,
          label: "One Month",
          price: "200,000 VND",
          desc: "Full MercyBlade access for 1 month.",
        },
        {
          tierId: YEARLY_TIER_ID,
          label: "One Year",
          price: "2,000,000 VND",
          desc: "Full MercyBlade access for 1 year.",
        },
      ] as const,
    [],
  );

  async function startCheckout(tierId: CheckoutTierId) {
    setError(null);
    setBusyTierId(tierId);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session?.access_token) {
        throw new Error("Please sign in before upgrading.");
      }

      const successUrl = `${window.location.origin}/billing/success`;
      const cancelUrl = `${window.location.origin}/billing`;

      const { data, error: invokeError } = await supabase.functions.invoke(
        "billing-stripe-checkout-session",
        {
          body: {
            tier_id: tierId,
            success_url: successUrl,
            cancel_url: cancelUrl,
          },
        },
      );

      if (invokeError) throw invokeError;

      const checkoutUrl =
        data && typeof data === "object"
          ? (data as { checkout_url?: unknown }).checkout_url
          : null;

      if (!checkoutUrl || typeof checkoutUrl !== "string") {
        throw new Error("Missing checkout_url from billing-stripe-checkout-session");
      }

      window.location.assign(checkoutUrl);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Checkout failed";
      setError(message);
    } finally {
      setBusyTierId(null);
    }
  }

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, margin: "8px 0 4px" }}>Billing</h1>

      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        {loading ? (
          <span>Loading…</span>
        ) : (
          <span>
            Current access: <b>{isPremium ? currentPlanLabel : "FREE"}</b>
            {ent?.status ? (
              <>
                {" "}
                · status: <b>{String(ent.status)}</b>
              </>
            ) : null}
            {ent?.source ? (
              <>
                {" "}
                · source: <b>{String(ent.source)}</b>
              </>
            ) : null}
          </span>
        )}
      </div>

      {error ? (
        <div
          style={{
            background: "rgba(255,0,0,0.08)",
            border: "1px solid rgba(255,0,0,0.25)",
            padding: 12,
            borderRadius: 12,
            marginBottom: 12,
            whiteSpace: "pre-wrap",
          }}
        >
          {error}
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 12,
        }}
      >
        {tiers.map((t) => {
          const disabled = busyTierId !== null;

          return (
            <div
              key={t.tierId}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: 14,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 18, fontWeight: 700 }}>{t.label}</div>
                <span style={{ fontSize: 13, opacity: 0.8 }}>{t.price}</span>
              </div>

              <div style={{ marginTop: 8, opacity: 0.85, minHeight: 44 }}>
                {t.desc}
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => startCheckout(t.tierId)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: disabled
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(255,255,255,0.12)",
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {busyTierId === t.tierId
                  ? "Opening Stripe…"
                  : `Choose ${t.label}`}
              </button>
            </div>
          );
        })}
      </div>

      <div
        style={{ marginTop: 14, opacity: 0.7, fontSize: 12, lineHeight: 1.4 }}
      >
        Tip: after payment completes, Stripe calls your webhook → webhook updates
        your subscription state → backend recomputes entitlement → app reads{" "}
        <code>me-entitlement</code>.
      </div>
    </div>
  );
}