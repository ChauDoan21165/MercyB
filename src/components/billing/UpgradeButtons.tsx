// PATH: src/components/billing/UpgradeButtons.tsx
//
// FIX:
// - Do NOT create a second Supabase client here (keeps auth/session consistent).
// - Use supabase.functions.invoke("create-checkout-session") so apikey header is included.
// - Send { tier: "vip1"|"vip3"|"vip9" } (your function accepts tier or tier_id; NOT vip_key).
// - Better error surfacing (shows status + message).

import React from "react";
import type { VipKey } from "@/lib/auth";
import { getUserTierContext } from "@/lib/auth";

// ✅ Use the shared client (single source of truth for auth/session)
import { supabase } from "@/lib/supabaseClient";

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

      // ✅ IMPORTANT: use invoke (adds apikey header automatically)
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        {
          headers: {
            // Explicit Authorization avoids regressions if supabase-js changes behavior
            Authorization: `Bearer ${token}`,
          },
          body: {
            tier: targetVip, // ✅ correct field
            period: "monthly",
            success_url: window.location.origin + "/billing/success",
            cancel_url: window.location.origin + "/billing/cancel",
          },
        },
      );

      if (error) {
        const status = (error as any)?.status;
        const msg =
          (error as any)?.message ||
          (error as any)?.context?.message ||
          "Edge Function returned an error";
        throw new Error(status ? `${msg} (${status})` : msg);
      }

      const checkoutUrl = (data as any)?.checkout_url;
      if (!checkoutUrl) throw new Error("Missing checkout_url");

      window.location.href = checkoutUrl;
    } catch (e: any) {
      setErr(e?.message ?? "Checkout failed");
    } finally {
      setLoadingKey(null);
    }
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ opacity: 0.85 }}>
        Current: <b>{vipKey.toUpperCase()}</b>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 12,
        }}
      >
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
                title={
                  isDowngradeOrSame
                    ? "Downgrades are handled in Stripe portal"
                    : ""
                }
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

      {err ? <div style={{ color: "tomato", marginTop: 8 }}>{err}</div> : null}
    </div>
  );
}
