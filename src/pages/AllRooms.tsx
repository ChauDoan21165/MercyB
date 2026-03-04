// FILE: AllRooms.tsx
// PATH: src/pages/AllRooms.tsx
//
// Rooms utility hub (UI-only quick links)
// Fix:
// 1) "Refresh /rooms" now actually refreshes (React Router won't re-navigate to same path).
// 2) Bilingual EN / VI copy throughout.

import React, { useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type CardProps = {
  titleEN: string;
  titleVI: string;
  bodyEN: string;
  bodyVI: string;
  actionEN: string;
  actionVI: string;
  to?: string;
  onClick?: () => void;
  rightSlot?: React.ReactNode;
};

function DualText({
  en,
  vi,
  muted = false,
  strong = false,
}: {
  en: string;
  vi: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        gap: 2,
        lineHeight: 1.15,
        color: muted ? "rgba(0,0,0,0.62)" : "rgba(0,0,0,0.86)",
        fontWeight: strong ? 900 : 700,
      }}
    >
      <span>{en}</span>
      <span style={{ fontWeight: strong ? 850 : 650 }}>{vi}</span>
    </span>
  );
}

function ActionButton({ labelEN, labelVI }: { labelEN: string; labelVI: string }) {
  return (
    <div
      style={{
        marginTop: 10,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        borderRadius: 9999,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "rgba(255,255,255,0.92)",
        padding: "10px 14px",
        fontWeight: 900,
        letterSpacing: -0.2,
        color: "rgba(0,0,0,0.84)",
        boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      <DualText en={labelEN} vi={labelVI} strong />
      <span style={{ opacity: 0.7 }}>→</span>
    </div>
  );
}

function QuickCard({
  titleEN,
  titleVI,
  bodyEN,
  bodyVI,
  actionEN,
  actionVI,
  to,
  onClick,
  rightSlot,
}: CardProps) {
  const cardStyle: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.82)",
    padding: 18,
    boxShadow: "0 18px 40px rgba(0,0,0,0.06)",
    textDecoration: "none",
    color: "inherit",
    position: "relative",
    overflow: "hidden",
    cursor: onClick ? "pointer" : "default",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 950,
    letterSpacing: -0.3,
    color: "rgba(0,0,0,0.88)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  const bodyStyle: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.68)",
  };

  const inner = (
    <div style={cardStyle} aria-label={`${titleEN} / ${titleVI}`}>
      <div style={titleStyle}>
        <DualText en={titleEN} vi={titleVI} strong />
        {rightSlot ? <div>{rightSlot}</div> : null}
      </div>

      <p style={bodyStyle}>
        <span style={{ display: "block" }}>{bodyEN}</span>
        <span style={{ display: "block" }}>{bodyVI}</span>
      </p>

      <div style={{ marginTop: 8 }}>
        <ActionButton labelEN={actionEN} labelVI={actionVI} />
      </div>
    </div>
  );

  // If it's a link, wrap in Link (keeps right-click/open-in-new-tab behavior)
  if (to) {
    return (
      <Link to={to} style={{ textDecoration: "none", color: "inherit" }} onClick={onClick}>
        {inner}
      </Link>
    );
  }

  // Otherwise clickable card (refresh action)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      style={{ outline: "none" }}
      aria-label={`${titleEN} / ${titleVI}`}
    >
      {inner}
    </div>
  );
}

export default function AllRooms() {
  const navigate = useNavigate();
  const loc = useLocation();

  const rainbow =
    "linear-gradient(90deg,#ff4d4d 0%,#ffb84d 18%,#b6ff4d 36%,#4dffb8 54%,#4db8ff 72%,#b84dff 90%,#ff4dff 100%)";

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "calc(100vh - 60px)",
    padding: "18px 16px 64px",
  };

  const headRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 44,
    fontWeight: 950,
    letterSpacing: -1.1,
    background: rainbow,
    WebkitBackgroundClip: "text",
    color: "transparent",
    lineHeight: 1.02,
  };

  const kicker: React.CSSProperties = {
    marginTop: 4,
    marginBottom: 0,
    color: "rgba(0,0,0,0.70)",
    fontSize: 14,
    lineHeight: 1.5,
    fontWeight: 800,
  };

  const topButtons: React.CSSProperties = {
    display: "flex",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  };

  const pillBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.84)",
    textDecoration: "none",
    fontWeight: 950,
    letterSpacing: -0.2,
    boxShadow: "0 10px 22px rgba(0,0,0,0.06)",
  };

  const grid: React.CSSProperties = {
    marginTop: 16,
    borderRadius: 22,
    border: "1px solid rgba(0,0,0,0.10)",
    padding: 18,
    background:
      "radial-gradient(800px 300px at 15% 10%, rgba(255,77,77,0.10), transparent 60%), radial-gradient(800px 300px at 70% 15%, rgba(77,184,255,0.10), transparent 60%), rgba(255,255,255,0.80)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
  };

  const grid2: React.CSSProperties = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 14,
  };

  const isNarrow =
    typeof window !== "undefined" ? window.matchMedia("(max-width: 860px)").matches : false;

  const grid2Narrow: React.CSSProperties = {
    ...grid2,
    gridTemplateColumns: "1fr",
  };

  // ✅ FIX: Refresh must do something even if already on /rooms
  const onRefreshRooms = useCallback(() => {
    // Preferred: React Router v6.4+ supports navigate(0) to reload.
    try {
      // @ts-expect-error - navigate(0) is allowed in RR v6.4+, TS types vary by version.
      navigate(0);
      return;
    } catch {
      // Fallback #1: force a re-render/re-mount by changing query string
      try {
        const qs = new URLSearchParams(loc.search || "");
        qs.set("ts", String(Date.now()));
        navigate(`${loc.pathname}?${qs.toString()}`, { replace: true });
        return;
      } catch {
        // Fallback #2: hard reload
        try {
          window.location.reload();
        } catch {
          // ignore
        }
      }
    }
  }, [navigate, loc.pathname, loc.search]);

  return (
    <div style={wrap}>
      <div style={headRow}>
        <div>
          <div style={{ color: "rgba(0,0,0,0.65)", fontWeight: 900, fontSize: 14 }}>
            Mercy Blade • Utility
            <span style={{ marginLeft: 10, opacity: 0.6 }}>•</span>
            <span style={{ marginLeft: 10, opacity: 0.85 }}>Công cụ nhanh</span>
          </div>

          <h1 style={title}>Rooms</h1>

          <p style={kicker}>
            <span style={{ display: "block" }}>Browse / debug / quick entry points.</span>
            <span style={{ display: "block" }}>Duyệt / debug / lối vào nhanh.</span>
          </p>
        </div>

        <div style={topButtons} aria-label="Top quick buttons">
          <Link to="/" style={pillBtn} aria-label="Home / Trang chủ">
            <DualText en="Home" vi="Trang chủ" strong />
          </Link>
          <Link to="/pricing" style={pillBtn} aria-label="Pricing / Bảng giá">
            <DualText en="Pricing" vi="Bảng giá" strong />
          </Link>
          <Link to="/tiers" style={pillBtn} aria-label="Tier Map / Bản đồ Tier">
            <DualText en="Tier Map" vi="Bản đồ Tier" strong />
          </Link>
        </div>
      </div>

      <div style={grid} aria-label="Quick links panel">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <DualText en="Quick links" vi="Liên kết nhanh" strong />

          <Link
            to="/signin"
            style={{
              textDecoration: "underline",
              fontWeight: 900,
              color: "rgba(0,0,0,0.72)",
            }}
            aria-label="Sign in / Đăng nhập"
          >
            <DualText en="Sign in" vi="Đăng nhập" strong />
          </Link>
        </div>

        <div style={{ marginTop: 6 }}>
          <DualText
            en="This page is UI-only (no room fetch yet)."
            vi="Trang này chỉ là UI (chưa tải danh sách room)."
            muted
          />
        </div>

        <div style={isNarrow ? grid2Narrow : grid2}>
          <QuickCard
            titleEN="Go to Home"
            titleVI="Về Trang chủ"
            bodyEN="Front door page (/) with hero + progress cards."
            bodyVI="Trang chính (/) với hero + thẻ tiến độ."
            actionEN="Open Home"
            actionVI="Mở Trang chủ"
            to="/"
          />

          <QuickCard
            titleEN="Pricing"
            titleVI="Bảng giá"
            bodyEN="See subscription tiers and upgrade options."
            bodyVI="Xem gói đăng ký và tùy chọn nâng cấp."
            actionEN="Open Pricing"
            actionVI="Mở Bảng giá"
            to="/pricing"
          />

          <QuickCard
            titleEN="Tier Map"
            titleVI="Bản đồ Tier"
            bodyEN="Learning paths / tiers overview."
            bodyVI="Tổng quan lộ trình học / tier."
            actionEN="Explore tiers"
            actionVI="Khám phá tier"
            to="/tiers"
          />

          <QuickCard
            titleEN="All rooms"
            titleVI="Tất cả rooms"
            bodyEN="Main browsing page (when room list UI is enabled)."
            bodyVI="Trang duyệt chính (khi UI danh sách room bật)."
            actionEN="Reload /rooms"
            actionVI="Tải lại /rooms"
            onClick={onRefreshRooms}
            rightSlot={
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 900,
                  padding: "4px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "rgba(255,255,255,0.86)",
                  color: "rgba(0,0,0,0.62)",
                  whiteSpace: "nowrap",
                }}
              >
                EN/VI
              </span>
            }
          />
        </div>

        <div style={{ marginTop: 14, fontSize: 12, color: "rgba(0,0,0,0.55)", fontWeight: 750 }}>
          <span style={{ display: "block" }}>
            Note: the old “HOME OK (moved to /rooms)” debug banner was removed.
          </span>
          <span style={{ display: "block" }}>
            Ghi chú: banner debug “HOME OK (moved to /rooms)” đã được gỡ bỏ.
          </span>
        </div>
      </div>
    </div>
  );
}