// FILE: src/pages/UpgradePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

type SummaryRow = {
  app_id: string | null;
  plan_key: "free" | "vip1" | "vip3" | "vip9";
  rank: number;
};

type Choice = {
  key: "vip1" | "vip3" | "vip9";
  rank: 1 | 3 | 9;
  title: string;
  tagline: string;
  enabled: boolean;
  reason?: string;
};

export default function UpgradePage() {
  const nav = useNavigate();
  const [summary, setSummary] = useState<SummaryRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      const { data, error } = await supabase
        .from("account_summary_v")
        .select("app_id, plan_key, rank")
        .limit(1)
        .maybeSingle();

      if (!alive) return;
      if (error) {
        setErr(error.message);
        setSummary(null);
      } else {
        setSummary((data as any) ?? null);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const allowVip9 = (appId?: string | null) => (appId ?? "") === "mercy_blade";

  const choices: Choice[] = useMemo(() => {
    const r = summary?.rank ?? 0;
    const appId = summary?.app_id ?? null;

    const base: Omit<Choice, "enabled" | "reason">[] = [
      { key: "vip1", rank: 1, title: "VIP1", tagline: "Unlock core premium rooms" },
      { key: "vip3", rank: 3, title: "VIP3", tagline: "Deeper practice + more rooms" },
      { key: "vip9", rank: 9, title: "VIP9", tagline: "Full Mercy Blade access" },
    ];

    return base.map((c) => {
      if (r >= c.rank) return { ...c, enabled: false, reason: "You already have this tier (or higher)." };
      if (c.key === "vip9" && !allowVip9(appId))
        return { ...c, enabled: false, reason: "VIP9 is only available in Mercy Blade." };
      return { ...c, enabled: true };
    });
  }, [summary]);

  async function onChoose(tierKey: "vip1" | "vip3" | "vip9") {
    try {
      setErr(null);
      setBusyKey(tierKey);

      const origin = window.location.origin;

      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          // send both names to be resilient
          tier_key: tierKey,
          tier: tierKey,
          success_url: `${origin}/account`,
          cancel_url: `${origin}/upgrade`,
        },
      });

      if (error) throw error;
      if (!data?.checkout_url) throw new Error(data?.error || "No checkout_url returned");

      window.location.href = data.checkout_url;
    } catch (e: any) {
      setErr(e?.message || String(e));
      setBusyKey(null);
    }
  }

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>Upgrade</h1>
        <button onClick={() => nav("/account")} style={{ padding: "8px 10px" }}>
          Back to Account
        </button>
      </div>

      <div style={{ marginTop: 8, opacity: 0.8, fontSize: 14 }}>
        {loading ? "Loading your plan…" : `Current: ${(summary?.plan_key ?? "free").toUpperCase()} (rank ${summary?.rank ?? 0})`}
      </div>

      {err ? (
        <div style={{ marginTop: 10, padding: 10, borderRadius: 10, border: "1px solid rgba(255,0,0,0.35)" }}>
          {err}
        </div>
      ) : null}

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {choices.map((c) => (
          <div key={c.key} style={{ border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{c.title}</div>
            <div style={{ marginTop: 6, opacity: 0.85, fontSize: 13 }}>{c.tagline}</div>

            {!c.enabled && c.reason ? (
              <div style={{ marginTop: 10, opacity: 0.7, fontSize: 12 }}>{c.reason}</div>
            ) : null}

            <button
              disabled={!c.enabled || busyKey !== null}
              onClick={() => onChoose(c.key)}
              style={{ marginTop: 12, padding: "10px 12px", width: "100%", borderRadius: 12 }}
            >
              {busyKey === c.key ? "Opening checkout…" : `Choose ${c.title}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
