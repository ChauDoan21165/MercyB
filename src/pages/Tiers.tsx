// FILE: src/pages/Tiers.tsx
// VERSION: MB-BLUE-99.11z-tiers-split-simple-prices — 2026-01-21 (+0700)
//
// GOAL:
// - Clean pricing grid (simple English study tiers)
// - Split styles to ./Tiers.styles.ts
// - Fetch Stripe prices from /functions/v1/get-tier-prices
// - If fetch fails, show REAL fallback prices (so user never sees “—”)
// - Keep checkout wiring inside onUpgrade() (unchanged)

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { S } from "./Tiers.styles";

type TierKey = "free" | "vip1" | "vip3" | "vip9";

type StripePriceDTO = {
  id: string;
  currency: string;
  unit_amount: number | null; // cents
  recurring: { interval: string } | null;
  nickname: string | null;
};

type TierPrices = {
  vip1: StripePriceDTO | null;
  vip3: StripePriceDTO | null;
  vip9: StripePriceDTO | null;
};

const FALLBACK: Record<Exclude<TierKey, "free">, { unit_amount: number; currency: string; interval: string }> = {
  // ✅ PUT YOUR REAL PRICES HERE (cents)
  vip1: { unit_amount: 400, currency: "usd", interval: "month" },
  vip3: { unit_amount: 800, currency: "usd", interval: "month" },
  vip9: { unit_amount: 2000, currency: "usd", interval: "month" }, // if VIP9 is $20/mo
};

function formatMoney(unitAmount: number | null | undefined, currency: string | null | undefined) {
  if (unitAmount == null) return "—";
  const cur = (currency || "usd").toUpperCase();
  const value = unitAmount / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(value);
  } catch {
    return `${value.toFixed(2)} ${cur}`;
  }
}

function formatInterval(interval: string | null | undefined) {
  const t = (interval || "").toLowerCase();
  if (t === "month") return "per month";
  if (t === "year") return "per year";
  return "subscription";
}

export default function Tiers() {
  const [tierPrices, setTierPrices] = useState<TierPrices | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const res = await fetch("/functions/v1/get-tier-prices", { method: "GET" });
        const j = await res.json().catch(() => null);
        if (!alive) return;
        if (res.ok && j?.ok && j?.prices) setTierPrices(j.prices as TierPrices);
      } catch {
        // ignore: fallback prices will show
      }
    };

    void load();
    return () => {
      alive = false;
    };
  }, []);

  const vip1 = useMemo(() => tierPrices?.vip1 ?? null, [tierPrices]);
  const vip3 = useMemo(() => tierPrices?.vip3 ?? null, [tierPrices]);
  const vip9 = useMemo(() => tierPrices?.vip9 ?? null, [tierPrices]);

  const vip1Price = formatMoney(vip1?.unit_amount ?? FALLBACK.vip1.unit_amount, vip1?.currency ?? FALLBACK.vip1.currency);
  const vip3Price = formatMoney(vip3?.unit_amount ?? FALLBACK.vip3.unit_amount, vip3?.currency ?? FALLBACK.vip3.currency);
  const vip9Price = formatMoney(vip9?.unit_amount ?? FALLBACK.vip9.unit_amount, vip9?.currency ?? FALLBACK.vip9.currency);

  const vip1Interval = formatInterval(vip1?.recurring?.interval ?? FALLBACK.vip1.interval);
  const vip3Interval = formatInterval(vip3?.recurring?.interval ?? FALLBACK.vip3.interval);
  const vip9Interval = formatInterval(vip9?.recurring?.interval ?? FALLBACK.vip9.interval);

  const onStartFree = useCallback(() => {
    window.location.href = "/";
  }, []);

  const onUpgrade = useCallback((tier: TierKey) => {
    // TODO: call your existing Stripe Checkout flow (Supabase Edge Function)
    // e.g. startCheckout(tier)
    console.log("upgrade:", tier);
  }, []);

  const isSmall = typeof window !== "undefined" ? window.matchMedia("(max-width: 980px)").matches : false;
  const isTiny = typeof window !== "undefined" ? window.matchMedia("(max-width: 720px)").matches : false;

  const gridStyle = useMemo(
    () =>
      ({
        ...(S.grid as React.CSSProperties),
        gridTemplateColumns: isTiny ? "1fr" : isSmall ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))",
      }) as React.CSSProperties,
    [isSmall, isTiny]
  );

  return (
    <div style={S.page as React.CSSProperties}>
      <main style={S.shell as React.CSSProperties} aria-label="Mercy Blade tiers">
        <nav style={S.nav as React.CSSProperties} aria-label="Top navigation">
          <Link to="/" style={S.navLink as React.CSSProperties}>
            ← Back
          </Link>
          <span style={{ color: "rgba(15,23,42,.35)" }}>|</span>
          <Link to="/" style={S.navLink as React.CSSProperties}>
            Home
          </Link>
        </nav>

        <header>
          <h1 style={S.h1 as React.CSSProperties}>Mercy Blade — Tiers</h1>
          <p style={S.sub as React.CSSProperties}>Simple English learning. Upgrade only if you want more rooms.</p>
          <p style={S.tip as React.CSSProperties}>
            Tip: If Pay fails, sign in first at{" "}
            <Link to="/signin" style={S.navLink as React.CSSProperties}>
              /signin
            </Link>
            .
          </p>
        </header>

        <section style={gridStyle} aria-label="Pricing tiers">
          {/* FREE */}
          <article style={S.card as React.CSSProperties} aria-label="Free tier">
            <div style={S.cardTop as React.CSSProperties}>
              <div style={S.badgeRow as React.CSSProperties}>
                <div style={S.badge as React.CSSProperties}>Free</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>Free</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "rgba(15,23,42,.72)" }}>Try rooms, learn basics.</div>
            </div>

            <div style={S.priceBlock as React.CSSProperties}>
              <div style={S.priceBig as React.CSSProperties}>Free</div>
              <div style={S.priceSmall as React.CSSProperties}>No card • Free forever</div>
            </div>

            <div style={S.cardBody as React.CSSProperties}>
              <ul style={S.ul as React.CSSProperties}>
                <li>Access Free rooms</li>
                <li>Bilingual reading (EN/VI) where available</li>
                <li>Community chat (where enabled)</li>
              </ul>
            </div>

            <div style={S.cardBottom as React.CSSProperties}>
              <button type="button" style={{ ...(S.btn as React.CSSProperties), ...(S.btnPrimary as React.CSSProperties) }} onClick={onStartFree}>
                Start Free
              </button>
              <Link to="/tiers/free" style={{ fontWeight: 800, color: "#2563eb", textDecoration: "none", whiteSpace: "nowrap" }}>
                Details →
              </Link>
            </div>
          </article>

          {/* VIP1 */}
          <article style={S.card as React.CSSProperties} aria-label="VIP1 tier">
            <div style={S.cardTop as React.CSSProperties}>
              <div style={S.badgeRow as React.CSSProperties}>
                <div style={S.badge as React.CSSProperties}>VIP1</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>VIP1</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "rgba(15,23,42,.72)" }}>More rooms. Faster progress.</div>
            </div>

            <div style={S.priceBlock as React.CSSProperties}>
              <div style={S.priceBig as React.CSSProperties}>{vip1Price}</div>
              <div style={S.priceSmall as React.CSSProperties}>{vip1Interval} • subscription</div>
            </div>

            <div style={S.cardBody as React.CSSProperties}>
              <ul style={S.ul as React.CSSProperties}>
                <li>Unlock VIP1 rooms</li>
                <li>More guided practice</li>
                <li>More topics</li>
              </ul>
            </div>

            <div style={S.cardBottom as React.CSSProperties}>
              <button
                type="button"
                style={{ ...(S.btn as React.CSSProperties), ...(S.btnPrimary as React.CSSProperties) }}
                onClick={() => onUpgrade("vip1")}
              >
                Upgrade to VIP1
              </button>
              <Link to="/tiers/vip1" style={{ fontWeight: 800, color: "#2563eb", textDecoration: "none", whiteSpace: "nowrap" }}>
                Details →
              </Link>
            </div>
          </article>

          {/* VIP3 */}
          <article style={S.card as React.CSSProperties} aria-label="VIP3 tier">
            <div style={S.cardTop as React.CSSProperties}>
              <div style={S.badgeRow as React.CSSProperties}>
                <div style={S.badge as React.CSSProperties}>VIP3</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>VIP3</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "rgba(15,23,42,.72)" }}>Deep practice. More variety.</div>
            </div>

            <div style={S.priceBlock as React.CSSProperties}>
              <div style={S.priceBig as React.CSSProperties}>{vip3Price}</div>
              <div style={S.priceSmall as React.CSSProperties}>{vip3Interval} • subscription</div>
            </div>

            <div style={S.cardBody as React.CSSProperties}>
              <ul style={S.ul as React.CSSProperties}>
                <li>Unlock VIP1 + VIP3 rooms</li>
                <li>More advanced rooms</li>
                <li>More repeat-after-me practice</li>
              </ul>
            </div>

            <div style={S.cardBottom as React.CSSProperties}>
              <button
                type="button"
                style={{ ...(S.btn as React.CSSProperties), ...(S.btnPrimary as React.CSSProperties) }}
                onClick={() => onUpgrade("vip3")}
              >
                Upgrade to VIP3
              </button>
              <Link to="/tiers/vip3" style={{ fontWeight: 800, color: "#2563eb", textDecoration: "none", whiteSpace: "nowrap" }}>
                Details →
              </Link>
            </div>
          </article>

          {/* VIP9 */}
          <article style={S.card as React.CSSProperties} aria-label="VIP9 tier">
            <div style={S.cardTop as React.CSSProperties}>
              <div style={S.badgeRow as React.CSSProperties}>
                <div style={S.badge as React.CSSProperties}>VIP9</div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 900 }}>VIP9</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "rgba(15,23,42,.72)" }}>Everything unlocked.</div>
            </div>

            <div style={S.priceBlock as React.CSSProperties}>
              <div style={S.priceBig as React.CSSProperties}>{vip9Price}</div>
              <div style={S.priceSmall as React.CSSProperties}>{vip9Interval} • subscription</div>
            </div>

            <div style={S.cardBody as React.CSSProperties}>
              <ul style={S.ul as React.CSSProperties}>
                <li>Unlock VIP1 + VIP3 + VIP9 rooms</li>
                <li>All premium rooms</li>
                <li>Best for daily learners</li>
              </ul>
            </div>

            <div style={S.cardBottom as React.CSSProperties}>
              <button
                type="button"
                style={{ ...(S.btn as React.CSSProperties), ...(S.btnPrimary as React.CSSProperties) }}
                onClick={() => onUpgrade("vip9")}
              >
                Go VIP9
              </button>
              <Link to="/tiers/vip9" style={{ fontWeight: 800, color: "#2563eb", textDecoration: "none", whiteSpace: "nowrap" }}>
                Details →
              </Link>
            </div>
          </article>
        </section>

        <footer style={S.footer as React.CSSProperties} aria-label="Tier notes">
          <p style={{ margin: "14px 0 6px" }}>Payment uses Stripe Checkout via Supabase Edge Function.</p>
          <p style={{ margin: 0 }}>After checkout, your VIP access updates automatically.</p>
        </footer>
      </main>
    </div>
  );
}
