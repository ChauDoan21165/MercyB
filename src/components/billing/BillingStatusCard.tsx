// src/components/billing/BillingStatusCard.tsx

import { useEffect, useMemo, useState } from "react";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { supabase } from "@/integrations/supabase/client";

type SubscriptionRow = {
  status: string | null;
  current_period_end: string | null;
  provider: string | null;
  provider_subscription_id: string | null;
  updated_at?: string | null;
};

function formatStatus(status: string | null): string {
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

function formatDate(value: string | null): string {
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

export function BillingStatusCard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionRow | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          if (!cancelled) {
            setSubscription(null);
            setLoading(false);
          }
          return;
        }

        const { data, error: subscriptionError } = await supabase
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

        if (subscriptionError) throw subscriptionError;

        if (!cancelled) {
          setSubscription((data as SubscriptionRow | null) ?? null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load billing status");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const statusLabel = useMemo(
    () => formatStatus(subscription?.status ?? null),
    [subscription?.status],
  );

  const renewalLabel = useMemo(() => {
    if (!subscription?.status) return "—";

    if (subscription.status === "canceled") {
      return formatDate(subscription.current_period_end);
    }

    if (
      subscription.status === "active" ||
      subscription.status === "trialing" ||
      subscription.status === "past_due" ||
      subscription.status === "grace_period"
    ) {
      return formatDate(subscription.current_period_end);
    }

    return "—";
  }, [subscription?.current_period_end, subscription?.status]);

  const showManageButton = isManageableStatus(subscription?.status ?? null);

  return (
    <section className="rounded-xl border p-5 space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Billing</h2>
        <p className="text-sm text-muted-foreground">
          View your subscription status and manage your Stripe billing details.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading billing status...</p>
      ) : error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="mt-1 text-base font-medium">{statusLabel}</p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                {subscription?.status === "canceled" ? "Access until" : "Renews / expires"}
              </p>
              <p className="mt-1 text-base font-medium">{renewalLabel}</p>
            </div>
          </div>

          {showManageButton ? (
            <ManageSubscriptionButton />
          ) : (
            <p className="text-sm text-muted-foreground">
              No manageable Stripe subscription found.
            </p>
          )}
        </>
      )}
    </section>
  );
}