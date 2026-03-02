import React, { useEffect } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "stripe-pricing-table": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "pricing-table-id"?: string;
        "publishable-key"?: string;
        "client-reference-id"?: string;
      };
    }
  }
}

export default function Pricing() {
  // If you're using Stripe pricing table, the script must exist once.
  useEffect(() => {
    const id = "stripe-pricing-table-js";
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://js.stripe.com/v3/pricing-table.js";
    document.head.appendChild(s);
  }, []);

  const wrap: React.CSSProperties = {
    padding: 24,
    maxWidth: 980,
    margin: "0 auto",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(255,255,255,0.9)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  };

  const h1: React.CSSProperties = { fontSize: 28, fontWeight: 900, margin: 0 };
  const sub: React.CSSProperties = { marginTop: 8, opacity: 0.8, lineHeight: 1.5 };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 12,
    marginTop: 16,
  };

  const tierTitle: React.CSSProperties = { fontSize: 18, fontWeight: 800, margin: 0 };
  const tierBody: React.CSSProperties = { marginTop: 8, opacity: 0.85, lineHeight: 1.5 };

  // TODO: set these from env or constants if you have them
  const STRIPE_PRICING_TABLE_ID = (import.meta as any).env?.VITE_STRIPE_PRICING_TABLE_ID || "";
  const STRIPE_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY || "";

  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={h1}>Pricing / Bảng giá</h1>
        <p style={sub}>
          Choose the plan that matches your pace. <br />
          Chọn gói phù hợp với nhịp tiến bộ của bạn.
        </p>

        <div style={grid}>
          <div style={card}>
            <h2 style={tierTitle}>Pro / Chuyên nghiệp</h2>
            <p style={tierBody}>
              For consistent progress and deeper practice. <br />
              Dành cho luyện tập đều đặn và đào sâu kỹ năng.
            </p>
          </div>

          <div style={card}>
            <h2 style={tierTitle}>Elite / Tinh hoa</h2>
            <p style={tierBody}>
              For high mastery, advanced guidance, and priority features. <br />
              Dành cho bậc cao, hướng dẫn nâng cao và tính năng ưu tiên.
            </p>
          </div>
        </div>

        {/* Stripe pricing table embed (optional) */}
        {STRIPE_PRICING_TABLE_ID && STRIPE_PUBLISHABLE_KEY ? (
          <div style={{ marginTop: 16 }}>
            <stripe-pricing-table
              pricing-table-id={STRIPE_PRICING_TABLE_ID}
              publishable-key={STRIPE_PUBLISHABLE_KEY}
            />
          </div>
        ) : (
          <p style={{ marginTop: 16, opacity: 0.7 }}>
            Stripe pricing-table env vars missing. Set
            <code> VITE_STRIPE_PRICING_TABLE_ID</code> and
            <code> VITE_STRIPE_PUBLISHABLE_KEY</code> to enable the embed.
          </p>
        )}
      </div>
    </div>
  );
}