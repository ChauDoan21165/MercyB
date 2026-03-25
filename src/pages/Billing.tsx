import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { useEntitlements } from "@/lib/useEntitlements";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";

type CheckoutTierId =
  | "3d5a977c-4fde-4afc-99a4-4b37c3555839"
  | "a2863250-1798-443e-b1d3-d20e3db06281";

type SubscriptionRow = {
  status: string | null;
  current_period_end: string | null;
  provider: string | null;
  provider_subscription_id: string | null;
  updated_at: string | null;
};

const MONTHLY_TIER_ID =
  "3d5a977c-4fde-4afc-99a4-4b37c3555839" as const;
const YEARLY_TIER_ID =
  "a2863250-1798-443e-b1d3-d20e3db06281" as const;

function getCurrentPlanLabel(
  ent: ReturnType<typeof useEntitlements>["ent"],
): string {
  if (!ent || ent.is_premium !== true) {
    return "FREE";
  }

  if (typeof ent.plan_name === "string" && ent.plan_name.trim()) {
    return ent.plan_name.toUpperCase();
  }

  if (ent.status === "trialing") return "TRIAL";
  if (ent.vip_tier === "vip9") return "ONE YEAR";
  if (ent.vip_tier === "vip1") return "ONE MONTH";

  return "PREMIUM";
}

function formatSubscriptionStatus(status: string | null): string {
  switch (status) {
    case "active":
      return "Active";
    case "trialing":
      return "Trialing";
    case "past_due":
      return "Past due";
    case "canceled":
      return "Canceled";
    case "paused":
      return "Paused";
    case "revoked":
      return "Revoked";
    case "grace_period":
      return "Grace period";
    default:
      return "No subscription";
  }
}

function formatDisplayDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function isManageableStatus(status: string | null): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export default function Billing() {
  const { user, isLoading: authLoading } = useAuth();
  const { ent, loading: entitlementsLoading } = useEntitlements();

  const [busyTierId, setBusyTierId] = useState<CheckoutTierId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);

  const isPremium = ent?.is_premium === true;
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

  useEffect(() => {
    let cancelled = false;

    async function loadSubscription() {
      if (authLoading) return;

      if (!user) {
        if (!cancelled) {
          setSubscription(null);
          setSubscriptionError(null);
          setSubscriptionLoading(false);
        }
        return;
      }

      try {
        setSubscriptionLoading(true);
        setSubscriptionError(null);

        const { data, error: subscriptionFetchError } = await supabase
          .from("subscriptions")
          .select(
            "status,current_period_end,provider,provider_subscription_id,updated_at",
          )
          .eq("app_id", "mercy_blade")
          .eq("user_id", user.id)
          .eq("provider", "stripe")
          .order("updated_at", { ascending: false, nullsFirst: false })
          .limit(1)
          .maybeSingle();

        if (subscriptionFetchError) {
          throw subscriptionFetchError;
        }

        if (!cancelled) {
          setSubscription((data as SubscriptionRow | null) ?? null);
        }
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : "Failed to load billing status";
          setSubscriptionError(message);
          setSubscription(null);
        }
      } finally {
        if (!cancelled) {
          setSubscriptionLoading(false);
        }
      }
    }

    void loadSubscription();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user]);

  const startCheckout = useCallback(async (tierId: CheckoutTierId) => {
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
  }, []);

  if (authLoading) {
    return (
      <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
        <h1 style={{ fontSize: 28, margin: "8px 0 4px" }}>Billing</h1>
        <div style={{ opacity: 0.8 }}>Loading billing…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const subscriptionStatusLabel = formatSubscriptionStatus(subscription?.status ?? null);
  const renewalLabel = formatDisplayDate(subscription?.current_period_end ?? null);
  const showManageButton =
    isManageableStatus(subscription?.status ?? null) || isPremium;

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 8,
        }}
      >
        <h1 style={{ fontSize: 28, margin: 0 }}>Billing</h1>

        <Link
          to="/account"
          style={{
            padding: "10px 12px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.18)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Back to account
        </Link>
      </div>

      <div style={{ opacity: 0.8, marginBottom: 12 }}>
        {entitlementsLoading ? (
          <span>Loading…</span>
        ) : (
          <span>
            Current access: <b>{currentPlanLabel}</b>
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

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: 14,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Subscription status
        </div>

        <div style={{ opacity: 0.85, marginBottom: 12 }}>
          View your current subscription state and manage billing in Stripe.
        </div>

        {subscriptionLoading ? (
          <div style={{ opacity: 0.8 }}>Loading billing status…</div>
        ) : subscriptionError ? (
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
            {subscriptionError}
          </div>
        ) : (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 12,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
                  Status
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {subscriptionStatusLabel}
                </div>
              </div>

              <div
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: 12,
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 6 }}>
                  {subscription?.status === "canceled"
                    ? "Access until"
                    : "Renews / expires"}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {renewalLabel}
                </div>
              </div>
            </div>

            {showManageButton ? (
              <>
                <div style={{ opacity: 0.85, marginBottom: 12 }}>
                  Update your payment method, review invoices, or cancel your
                  plan in Stripe Billing Portal.
                </div>
                <ManageSubscriptionButton />
              </>
            ) : (
              <div style={{ opacity: 0.75 }}>
                No manageable Stripe subscription found yet.
              </div>
            )}
          </>
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
                onClick={() => void startCheckout(t.tierId)}
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