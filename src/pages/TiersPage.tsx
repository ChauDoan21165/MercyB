// FILE: src/pages/TiersPage.tsx
// MB-BLUE-102.0 — 2026-01-14 (+0700)
//
// TIERS PAGE (PAY WALL):
// - Shows VIP1 / VIP3 / VIP9 cards
// - Uses Supabase Edge Function create-checkout-session (Bearer JWT)
// - Shows current tier from useUserAccess()
// - Works even if user is signed out (asks them to sign in first)

import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useUserAccess } from "@/hooks/useUserAccess";

type TierKey = "VIP1" | "VIP3" | "VIP9";

type TierPlan = {
  key: TierKey;
  priceLabel: string;
  title: string;
  bullets: string[];
  highlight?: boolean;
};

function safeReturnTo(pathname: string, search: string) {
  const p = `${pathname || "/"}${search || ""}`;
  // prevent weird redirects
  if (!p.startsWith("/")) return "/";
  if (p.startsWith("/admin")) return "/";
  return p;
}

export default function TiersPage() {
  const access = useUserAccess();
  const navigate = useNavigate();
  const loc = useLocation();

  const [busyKey, setBusyKey] = useState<TierKey | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const plans: TierPlan[] = useMemo(
    () => [
      {
        key: "VIP1",
        priceLabel: "$9 / month",
        title: "VIP1 — Starter",
        bullets: [
          "Unlock more rooms",
          "Bilingual text learning",
          "Audio inside rooms (where available)",
        ],
      },
      {
        key: "VIP3",
        priceLabel: "$19 / month",
        title: "VIP3 — Serious Learner",
        bullets: [
          "More rooms + deeper sets",
          "Faster progress (more practice rooms)",
          "Priority fixes (your feedback moves faster)",
        ],
      },
      {
        key: "VIP9",
        priceLabel: "$29 / month",
        title: "VIP9 — Premium",
        bullets: [
          "Unlock everything",
          "Mercy Host Voice (daily minutes) (coming soon)",
          "Highest priority support",
        ],
        highlight: true,
      },
    ],
    []
  );

  const currentTier = String(access.tier || "free").toLowerCase();
  const returnTo = useMemo(() => {
    const q = new URLSearchParams(loc.search);
    const r = q.get("returnTo");
    if (r && r.startsWith("/")) return safeReturnTo(r, "");
    return safeReturnTo(loc.pathname, loc.search);
  }, [loc.pathname, loc.search]);

  async function goSignin() {
    const q = new URLSearchParams();
    q.set("returnTo", returnTo);
    navigate(`/signin?${q.toString()}`);
  }

  async function startCheckout(tierKey: TierKey) {
    setErr(null);
    setBusyKey(tierKey);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;

      if (!token) {
        setBusyKey(null);
        await goSignin();
        return;
      }

      // Call Supabase Edge Function (JWT required)
      const supaUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
      if (!supaUrl) throw new Error("Missing VITE_SUPABASE_URL");

      const res = await fetch(`${supaUrl}/functions/v1/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tierKey, // IMPORTANT: your Edge Function should accept tierKey or map from it
          // optional: allow return URL if your function supports it
          returnTo,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = json?.error || json?.message || `Checkout failed (${res.status})`;
        throw new Error(msg);
      }

      const checkoutUrl = json?.checkout_url || json?.url;
      if (!checkoutUrl) throw new Error("No checkout_url returned");

      window.location.href = checkoutUrl;
    } catch (e: any) {
      setErr(String(e?.message || e || "Failed to start checkout"));
      setBusyKey(null);
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-3xl font-black tracking-tight">Choose your tier</div>
        <div className="mt-2 text-sm opacity-70">
          Current tier: <b>{String(currentTier).toUpperCase()}</b>
          {access.isHighAdmin ? (
            <span className="ml-2 inline-block px-2 py-0.5 rounded-full border text-xs font-bold">
              ADMIN BYPASS
            </span>
          ) : null}
        </div>
      </div>

      {err ? (
        <div className="mb-6 rounded-xl border p-4 text-sm">
          <b>⚠ Checkout error:</b> {err}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div
            key={p.key}
            className={`rounded-2xl border bg-white p-5 shadow-sm ${
              p.highlight ? "ring-2 ring-black/10" : ""
            }`}
          >
            <div className="text-xs font-black opacity-60">{p.key}</div>
            <div className="mt-1 text-xl font-black">{p.title}</div>
            <div className="mt-2 text-sm font-bold opacity-80">{p.priceLabel}</div>

            <ul className="mt-4 text-sm leading-relaxed list-disc pl-5">
              {p.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <button
              type="button"
              className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-black ${
                p.highlight ? "bg-black text-white" : "bg-black/90 text-white"
              }`}
              onClick={() => startCheckout(p.key)}
              disabled={busyKey !== null}
              title="Go to Stripe Checkout"
            >
              {busyKey === p.key ? "Starting…" : "Upgrade / Subscribe"}
            </button>

            <div className="mt-3 text-xs opacity-60">
              If you already paid, refresh after webhook tier sync.
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-sm opacity-75">
        Tip: If a room is locked, it should send you here automatically with <code>?returnTo=...</code>.
      </div>
    </div>
  );
}
