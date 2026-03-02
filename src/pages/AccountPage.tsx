import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AccountPage() {
  const nav = useNavigate();

  // ✅ Keep this "safe": show something even if you haven't wired auth state here.
  // If you already have a real user object somewhere, replace this with your real source.
  const email = useMemo(() => {
    try {
      // common places people store it during dev:
      const fromLS =
        localStorage.getItem("email") ||
        localStorage.getItem("user_email") ||
        localStorage.getItem("mb_email") ||
        "";
      return fromLS || "—";
    } catch {
      return "—";
    }
  }, []);

  const plan = useMemo(() => {
    try {
      // optional: if you store plan in localStorage later
      return localStorage.getItem("mb_plan") || "Free";
    } catch {
      return "Free";
    }
  }, []);

  const status = "Active";

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100vh",
    background: "white",
  };

  const container: React.CSSProperties = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 16px 80px",
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 18,
    padding: 22,
    background: "rgba(255,255,255,0.92)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
  };

  const headerRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 14,
    flexWrap: "wrap",
  };

  const h1: React.CSSProperties = {
    margin: 0,
    fontSize: 36,
    fontWeight: 950,
    letterSpacing: -0.8,
    color: "rgba(0,0,0,0.86)",
  };

  const subtitle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.60)",
    maxWidth: 520,
  };

  const actions: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  };

  const pillBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.95)",
    color: "rgba(0,0,0,0.80)",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
  };

  // ✅ Pricing button: visible but NOT harsh
  const pricingBtn: React.CSSProperties = {
    ...pillBtn,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(0,0,0,0.03)",
  };

  const grid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  };

  const gridSingle: React.CSSProperties = {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 14,
  };

  const box: React.CSSProperties = {
    border: "1px solid rgba(0,0,0,0.10)",
    borderRadius: 14,
    padding: 16,
    background: "rgba(255,255,255,0.86)",
  };

  const label: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: 0.8,
    fontWeight: 950,
    color: "rgba(0,0,0,0.45)",
    textTransform: "uppercase",
  };

  const value: React.CSSProperties = {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
  };

  const valueSub: React.CSSProperties = {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.60)",
  };

  const miniRow: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const footer: React.CSSProperties = {
    marginTop: 14,
    color: "rgba(0,0,0,0.55)",
    fontSize: 13,
    lineHeight: 1.6,
  };

  const onSignOut = () => {
    // ✅ If you have real auth sign out, do it here, then nav("/signin")
    nav("/signin");
  };

  return (
    <div style={wrap}>
      <div style={container}>
        <div style={card}>
          <div style={headerRow}>
            <div>
              <h1 style={h1}>Account</h1>
              <p style={subtitle}>
                Your identity and access inside Mercy Blade.
                <br />
                <span style={{ display: "inline-block", marginTop: 4 }}>
                  Danh tính và quyền truy cập của bạn trong Mercy Blade.
                </span>
              </p>
            </div>

            <div style={actions}>
              {/* ✅ Pricing (soft, but visible) */}
              <Link to="/pricing" style={pricingBtn} aria-label="Open pricing">
                💳 Pricing
                <span style={{ opacity: 0.7, fontWeight: 800 }}> / Giá gói</span>
              </Link>

              {/* Upgrade */}
              <Link to="/upgrade" style={pillBtn} aria-label="Upgrade">
                Upgrade <span style={{ opacity: 0.7, fontWeight: 800 }}>/ Nâng cấp</span>
              </Link>

              {/* Sign out */}
              <button type="button" style={pillBtn} onClick={onSignOut} aria-label="Sign out">
                Sign out <span style={{ opacity: 0.7, fontWeight: 800 }}>/ Đăng xuất</span>
              </button>
            </div>
          </div>

          <div style={gridSingle}>
            <div style={box}>
              <div style={label}>Email</div>
              <div style={value}>{email}</div>
            </div>
          </div>

          <div style={grid}>
            <div style={box}>
              <div style={label}>Plan</div>
              <div style={value}>{plan}</div>
              <div style={valueSub}>
                Keep it simple. Upgrade anytime.
                <br />
                Giữ đơn giản. Nâng cấp bất cứ lúc nào.
              </div>
            </div>

            <div style={box}>
              <div style={label}>Status</div>
              <div style={value}>{status}</div>
              <div style={valueSub}>
                You’re signed in and ready to continue your journey.
                <br />
                Bạn đã đăng nhập và sẵn sàng tiếp tục hành trình.
              </div>
            </div>
          </div>

          <div style={miniRow}>
            <Link to="/tiers" style={pillBtn}>
              Browse tiers <span style={{ opacity: 0.7, fontWeight: 800 }}>/ Xem gói</span>
            </Link>
            <Link to="/rooms" style={pillBtn}>
              Browse rooms <span style={{ opacity: 0.7, fontWeight: 800 }}>/ Xem phòng</span>
            </Link>
            <Link to="/" style={pillBtn}>
              Home <span style={{ opacity: 0.7, fontWeight: 800 }}>/ Trang chủ</span>
            </Link>
          </div>

          <div style={footer}>
            Mercy Blade is built for calm progress — small steps, every day.
            <br />
            Mercy Blade được xây dựng cho tiến bộ bình tĩnh — từng bước nhỏ, mỗi ngày.
          </div>
        </div>
      </div>
    </div>
  );
}