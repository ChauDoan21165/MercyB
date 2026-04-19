// src/components/billing/BillingStatusCard.tsx

import { useEffect, useMemo, useState } from "react";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { fetchMyEntitlement } from "@/lib/billing";

type SubscriptionDisplay = {
  status: string | null;
  current_period_end: string | null;
};

function formatStatus(status: string | null): string {
  switch (status) {
    case "active":       return "Active";
    case "trialing":     return "Trialing";
    case "past_due":     return "Past due";
    case "canceled":     return "Canceled";
    case "paused":       return "Paused";
    case "revoked":      return "Revoked";
    case "grace_period": return "Grace period";
    default:             return "No subscription";
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
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDisplay | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the canonical entitlement endpoint — same source of truth
        // as the rest of the app, not a direct DB query
        const ent = await fetchMyEntitlement();

        if (cancelled) return;

        setSubscription({
          status: ent?.status ?? null,
          current_period_end: ent?.current_period_end ?? ent?.expires_at ?? null,
        });
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load billing status.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();

    return () => { cancelled = true; };
  }, []);

  const statusLabel = useMemo(
    () => formatStatus(subscription?.status ?? null),
    [subscription?.status],
  );

  const renewalLabel = useMemo(() => {
    const status = subscription?.status ?? null;
    if (!status) return "—";
    if (
      status === "active" ||
      status === "trialing" ||
      status === "past_due" ||
      status === "grace_period" ||
      status === "canceled"
    ) {
      return formatDate(subscription?.current_period_end ?? null);
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
        <p className="text-sm text-muted-foreground">Loading billing status…</p>
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
              No active Stripe subscription found.
            </p>
          )}
        </>
      )}
    </section>
  );
}