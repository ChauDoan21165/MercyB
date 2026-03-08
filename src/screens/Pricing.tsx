// FILE: Pricing.tsx
// PATH: src/screens/Pricing.tsx
// VERSION: v1.1

import React, { useEffect } from "react";

export default function Pricing() {
  // These should be set in your env (Vercel / .env)
  const STRIPE_PRICING_TABLE_ID = (import.meta as any).env?.VITE_STRIPE_PRICING_TABLE_ID as
    | string
    | undefined;
  const STRIPE_PUBLISHABLE_KEY = (import.meta as any).env?.VITE_STRIPE_PUBLISHABLE_KEY as
    | string
    | undefined;

  useEffect(() => {
    const id = "stripe-pricing-table-js";
    if (document.getElementById(id)) return;

    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://js.stripe.com/v3/pricing-table.js";
    document.body.appendChild(s);
  }, []);

  const page: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 16px 80px",
  };

  const h1: React.CSSProperties = {
    fontSize: 34,
    lineHeight: 1.15,
    margin: "8px 0 8px",
    fontWeight: 800,
  };

  const sub: React.CSSProperties = {
    opacity: 0.85,
    margin: "0 0 18px",
    fontSize: 15,
    lineHeight: 1.5,
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    margin: "18px 0 18px",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 16,
    background: "rgba(255,255,255,0.03)",
  };

  const tierTitle: React.CSSProperties = {
    fontSize: 18,
    margin: 0,
    fontWeight: 800,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
  };

  const price: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
  };

  const small: React.CSSProperties = {
    marginTop: 8,
    opacity: 0.9,
    lineHeight: 1.6,
    fontSize: 14,
  };

  const note: React.CSSProperties = {
    marginTop: 10,
    fontSize: 13,
    opacity: 0.75,
    lineHeight: 1.55,
  };

  const warn: React.CSSProperties = {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255, 180, 0, 0.35)",
    background: "rgba(255, 180, 0, 0.08)",
    fontSize: 13,
    lineHeight: 1.55,
  };

  return (
    <div style={page}>
      <h1 style={h1}>Pricing / Bảng giá</h1>

      <p style={sub}>
        Two simple plans. Click below to checkout with Stripe.
        <br />
        Hai gói đơn giản. Bấm bên dưới để thanh toán qua Stripe.
      </p>

      <div style={grid}>
        <div style={card}>
          <h2 style={tierTitle}>
            <span>Pro / Chuyên nghiệp</span>
            <span style={price}>CA$17</span>
          </h2>
          <div style={small}>
            VIP3 equivalent / Tương đương VIP3
            <br />
            Monthly / Hàng tháng
          </div>
        </div>

        <div style={card}>
          <h2 style={tierTitle}>
            <span>Elite / Tinh hoa</span>
            <span style={price}>CA$39</span>
          </h2>
          <div style={small}>
            VIP9 equivalent / Tương đương VIP9
            <br />
            Monthly / Hàng tháng
          </div>
        </div>
      </div>

      <div style={note}>
        Prices shown here are in CAD for clarity. Final amount is always confirmed in Stripe checkout.
        <br />
        Giá hiển thị là CAD cho dễ hiểu. Số tiền cuối cùng luôn được xác nhận trong trang thanh toán Stripe.
      </div>

      {STRIPE_PRICING_TABLE_ID && STRIPE_PUBLISHABLE_KEY ? (
        <div style={{ marginTop: 18 }}>
          {React.createElement("stripe-pricing-table", {
            "pricing-table-id": STRIPE_PRICING_TABLE_ID,
            "publishable-key": STRIPE_PUBLISHABLE_KEY,
          })}
        </div>
      ) : (
        <div style={warn}>
          Stripe pricing-table env vars missing.
          <br />
          Set:
          <br />
          <code>VITE_STRIPE_PRICING_TABLE_ID</code> and <code>VITE_STRIPE_PUBLISHABLE_KEY</code>
        </div>
      )}
    </div>
  );
}