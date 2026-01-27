import React from "react";
import { createClient } from "@supabase/supabase-js";
import { getUserTierContext, type VipKey } from "@/lib/auth";

// If you already have a shared supabase client, use that instead.
// This is safe for Vite if you have VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY.
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!,
);

type Plan = { vipKey: Exclude<VipKey, "free">; label: string; blurb: string };

const PLANS: Plan[] = [
  { vipKey: "vip1", label: "VIP 1", blurb: "Starter access" },
  { vipKey: "vip3", label: "VIP 3", blurb: "Serious learner" },
  { vipKey: "vip9", label: "VIP 9", blurb: "Full access" },
];

function rankOf(v: VipKey) {
  if (v === "vip1") return 1;
  if (v === "vip3") return 3;
  if (v === "vip9") return 9;
  return 0;
}

export function UpgradeButtons() {
  const [vipKey, setVipKey] = React.useState<VipKey>("free");
  const [loadingKey, setLoadingKey] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const ctx = await getUserTierContext(supabase);
        if (alive) setVipKey(ctx.vipKey);
      } catch (e: any) {
        if (alive) setErr(e?.message ?? "Failed to load tier");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function startCheckout(targetVip: "vip1" | "vip3" | "vip9") {
    setErr(null);
    setLoadingKey(targetVip);

    try {
      const { data: sess } = await supabase.auth.getSession();
      const token = sess?.session?.access_token;
      if (!token) throw new Error("Not signed in");

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vip_key: targetVip, // ✅ keep payload tiny + stable
          period: "monthly",  // optional; safe if your function ignores it
          success_url: window.location.origin + "/billing/success",
          cancel_url: window.location.origin + "/billing/cancel",
        }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || j?.message || `Checkout failed (${res.status})`);

      const checkoutUrl = j?.checkout_url;
      if (!checkoutUrl) throw new Error("Missing checkout_url");

      window.location.href = checkoutUrl;
    } catch (e: any) {
      setErr(e?.message ?? "Checkout failed");
      setLoadingKey(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ opacity: 0.85 }}>
        Current: <b>{vipKey.toUpperCase()}</b>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {PLANS.map((p) => {
          const isCurrent = p.vipKey === vipKey;
          const isDowngradeOrSame = rankOf(p.vipKey) <= rankOf(vipKey);
          const disabled = loadingKey !== null || isCurrent;

          return (
            <div
              key={p.vipKey}
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700 }}>{p.label}</div>
              <div style={{ opacity: 0.8, marginTop: 4 }}>{p.blurb}</div>

              <button
                style={{ marginTop: 10, width: "100%" }}
                disabled={disabled || isDowngradeOrSame}
                onClick={() => startCheckout(p.vipKey)}
                title={isDowngradeOrSame ? "Downgrades are handled in Stripe portal" : ""}
              >
                {isCurrent
                  ? "Current"
                  : loadingKey === p.vipKey
                    ? "Redirecting…"
                    : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      {err ? (
        <div style={{ color: "tomato", marginTop: 8 }}>
          {err}
        </div>
      ) : null}
    </div>
  );
}
