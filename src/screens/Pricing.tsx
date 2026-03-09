// FILE: Pricing.tsx
// PATH: src/screens/Pricing.tsx
// VERSION: v1.2

import React, { useEffect } from "react";

export default function Pricing() {
  // These should be set in your env (Vercel / .env)
  const STRIPE_PRICING_TABLE_ID = (import.meta as any).env
    ?.VITE_STRIPE_PRICING_TABLE_ID as string | undefined;
  const STRIPE_PUBLISHABLE_KEY = (import.meta as any).env
    ?.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

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
    color: "rgba(0,0,0,0.92)",
  };

  const sub: React.CSSProperties = {
    opacity: 0.85,
    margin: "0 0 18px",
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.78)",
  };

  const hero: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 18,
    padding: 20,
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(235,247,255,0.90))",
    boxShadow: "0 12px 28px rgba(0,0,0,0.05)",
  };

  const heroTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.15,
    fontWeight: 900,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.4,
  };

  const heroBody: React.CSSProperties = {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 1.7,
    color: "rgba(0,0,0,0.72)",
  };

  const grid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
    margin: "18px 0 18px",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 16,
    padding: 16,
    background: "rgba(255,255,255,0.86)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
  };

  const featuredCard: React.CSSProperties = {
    ...card,
    border: "1px solid rgba(0,128,120,0.20)",
    background:
      "linear-gradient(180deg, rgba(240,255,250,0.98), rgba(245,250,255,0.95))",
    boxShadow: "0 12px 24px rgba(0,128,120,0.08)",
  };

  const badge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "6px 10px",
    borderRadius: 9999,
    background: "rgba(0,128,120,0.10)",
    border: "1px solid rgba(0,128,120,0.16)",
    fontSize: 12,
    fontWeight: 900,
    color: "rgba(0,95,90,0.88)",
    marginBottom: 10,
  };

  const tierTitle: React.CSSProperties = {
    fontSize: 18,
    margin: 0,
    fontWeight: 800,
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: 10,
    color: "rgba(0,0,0,0.88)",
  };

  const price: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: 0.2,
    whiteSpace: "nowrap",
    color: "rgba(0,0,0,0.92)",
  };

  const small: React.CSSProperties = {
    marginTop: 8,
    opacity: 0.9,
    lineHeight: 1.65,
    fontSize: 14,
    color: "rgba(0,0,0,0.72)",
  };

  const note: React.CSSProperties = {
    marginTop: 10,
    fontSize: 13,
    opacity: 0.8,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.68)",
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

  const sectionTitle: React.CSSProperties = {
    margin: "26px 0 10px",
    fontSize: 22,
    fontWeight: 900,
    color: "rgba(0,0,0,0.88)",
    letterSpacing: -0.2,
  };

  return (
    <div style={page}>
      <h1 style={h1}>Pricing / Bảng giá</h1>

      <div style={hero}>
        <h2 style={heroTitle}>Start free. Continue when you are ready.</h2>
        <div style={heroBody}>
          Mercy Blade begins with free rooms.
          <br />
          When you want to go deeper, you can unlock <b>Full Access</b> for your
          journey — or choose <b>Lifetime</b> and keep Mercy Blade with you for
          the long term.
          <br />
          <br />
          Mercy Blade bắt đầu với các phòng miễn phí.
          <br />
          Khi bạn muốn đi sâu hơn, bạn có thể mở khóa <b>Toàn Quyền Truy Cập</b>
          cho hành trình của mình — hoặc chọn <b>Trọn Đời</b> để Mercy Blade đồng
          hành cùng bạn lâu dài.
        </div>
      </div>

      <div style={grid}>
        <div style={card}>
          <h2 style={tierTitle}>
            <span>Free / Miễn phí</span>
            <span style={price}>CA$0</span>
          </h2>
          <div style={small}>
            Start with limited rooms.
            <br />
            Begin gently and feel the atmosphere.
            <br />
            <br />
            Bắt đầu với các phòng giới hạn.
            <br />
            Đi nhẹ nhàng và cảm nhận không gian của Mercy Blade.
          </div>
        </div>

        <div style={featuredCard}>
          <div style={badge}>⭐ Recommended / Gợi ý</div>
          <h2 style={tierTitle}>
            <span>Full Access / Toàn quyền truy cập</span>
            <span style={price}>3 Months</span>
          </h2>
          <div style={small}>
            Unlock the full journey for a focused season of growth.
            <br />
            Best for learners who want real continuity.
            <br />
            <br />
            Mở khóa toàn bộ hành trình trong 3 tháng tập trung phát triển.
            <br />
            Phù hợp nhất cho người học muốn đi tiếp một cách nghiêm túc và liền mạch.
          </div>
        </div>

        <div style={card}>
          <h2 style={tierTitle}>
            <span>Lifetime / Trọn đời</span>
            <span style={price}>One time</span>
          </h2>
          <div style={small}>
            Keep Mercy Blade with you for the long term.
            <br />
            One payment, lasting access.
            <br />
            <br />
            Giữ Mercy Blade đồng hành cùng bạn lâu dài.
            <br />
            Một lần thanh toán, sử dụng bền lâu.
          </div>
        </div>
      </div>

      <div style={note}>
        The cards above explain the plan structure clearly. The exact Stripe
        checkout options shown below should match this same structure:
        <b> Free / Full Access / Lifetime</b>.
        <br />
        <br />
        Các thẻ ở trên dùng để giải thích rõ cấu trúc gói. Những lựa chọn Stripe
        bên dưới nên được đồng bộ theo cùng cấu trúc:
        <b> Miễn phí / Toàn quyền truy cập / Trọn đời</b>.
      </div>

      <h3 style={sectionTitle}>Checkout / Thanh toán</h3>

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
          <code>VITE_STRIPE_PRICING_TABLE_ID</code> and{" "}
          <code>VITE_STRIPE_PUBLISHABLE_KEY</code>
        </div>
      )}
    </div>
  );
}