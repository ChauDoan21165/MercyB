// src/pages/Billing.tsx
// Mercy Blade — Billing / Upgrade UI (minimal, wired to Supabase Edge Function)

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import { getUserTierContext, type UserTierContext, type VipKey } from "@/lib/auth";

type CheckoutVipKey = Exclude<VipKey, "free">;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
);

function isPaidTier(v: VipKey): v is CheckoutVipKey {
  return v === "vip1" || v === "vip3" || v === "vip9";
}

export default function Billing() {
  const [ctx, setCtx] = useState<UserTierContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyVip, setBusyVip] = useState<CheckoutVipKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentVip = ctx?.vipKey ?? "free";

  const tiers = useMemo(
    () =>
      [
        { vipKey: "vip1" as const, label: "VIP 1", desc: "Unlock VIP1 rooms." },
        { vipKey: "vip3" as const, label: "VIP 3", desc: "Unlock VIP3 rooms." },
        { vipKey: "vip9" as const, label: "VIP 9", desc: "Unlock VIP9 rooms." },
      ] as const,
    [],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const next = await getUserTierContext(supabase);
        if (!alive) return;
        setCtx(next);
      } catch (e: any) {
        if (!alive) return;
        setError(e?.message ?? "Failed to load billing status");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function startCheckout(vipKey: CheckoutVipKey) {
    setError(null);
    setBusyVip(vipKey);

    try {
      const {
        data: { session },
        error: sessErr,
      } = await supabase.auth.getSession();

      if (sessErr) throw sessErr;
      if (!session?.access_token) {
        throw new Error("Please sign in before upgrading.");
      }

      // ✅ FIX: use plain fetch (NO supabase.functions.invoke)
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tier: vipKey }),
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Checkout failed");
      }

      const data = await res.json();
      const checkoutUrl = data?.checkout_url;

      if (!checkoutUrl || typeof checkoutUrl !== "string") {
        throw new Error("Missing checkout_url from create-checkout-session");
      }

      window.location.assign(checkoutUrl);
    } catch (e: any) {
      setError(e?.message ?? "Checkout failed");
    } finally {
      setBusyVip(null);
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
            Current access: <b>{currentVip.toUpperCase()}</b>
            {ctx?.subscriptionStatus ? (
              <>
                {" "}
                · status: <b>{String(ctx.subscriptionStatus)}</b>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {tiers.map((t) => {
          const isCurrent = currentVip === t.vipKey;
          const disabled = busyVip !== null || isCurrent;

          return (
            <div
              key={t.vipKey}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: 14,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{t.label}</div>
                {isCurrent ? (
                  <span style={{ fontSize: 12, opacity: 0.75 }}>Current</span>
                ) : (
                  <span style={{ fontSize: 12, opacity: 0.75 }}>Upgrade</span>
                )}
              </div>

              <div style={{ marginTop: 8, opacity: 0.85, minHeight: 44 }}>{t.desc}</div>

              <button
                type="button"
                disabled={disabled}
                onClick={() => startCheckout(t.vipKey)}
                style={{
                  marginTop: 12,
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: disabled ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)",
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontWeight: 700,
                }}
              >
                {busyVip === t.vipKey ? "Opening Stripe…" : isCurrent ? "Active" : `Upgrade to ${t.label}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
