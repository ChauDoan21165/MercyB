// src/pages/Unsubscribe.tsx — Route /unsubscribe (public, no auth).
//
// Accepts ?token=<48-hex-char> from the email link. On mount, calls the
// `unsubscribe_by_token` RPC, which flips all email_*_enabled flags off
// and stamps email_unsubscribed_at. Renders one of three states:
//   loading  — initial fetch
//   success  — confirmation + link to /account/notifications for granular
//              re-subscription
//   error    — invalid token / token not found / network — with retry +
//              support contact
//
// Bilingual VI primary throughout. No auth required — the token IS the
// credential. Page never reveals whether the token mapped to an existing
// user beyond ok/not-ok.

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  unsubscribeByToken,
  type UnsubscribeResult,
} from "@/services/emailPreferences";

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "calc(100vh - 72px)",
  padding: "20px 16px 80px",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 520,
  border: "1px solid rgba(0,0,0,0.10)",
  borderRadius: 20,
  padding: 28,
  background: "white",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
};

const headingStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: -0.3,
  margin: "0 0 4px",
  color: "rgba(10,10,10,0.94)",
};

const linkBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "#111827",
  color: "white",
  borderRadius: 9999,
  minHeight: 44,
  padding: "0 22px",
  fontWeight: 700,
  fontSize: 14,
  textDecoration: "none",
};

type Status = "loading" | "success" | "invalid" | "not_found" | "rpc_error" | "missing_token";

function statusFromResult(result: UnsubscribeResult | null): Status {
  if (!result) return "loading";
  if (result.ok) return "success";
  if (result.message === "invalid_token") return "invalid";
  if (result.message === "token_not_found") return "not_found";
  return "rpc_error";
}

export default function UnsubscribePage(): React.ReactElement {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [result, setResult] = useState<UnsubscribeResult | null>(null);

  useEffect(() => {
    let alive = true;
    if (!token.trim()) return;
    void unsubscribeByToken(token).then((r) => {
      if (alive) setResult(r);
    });
    return () => {
      alive = false;
    };
  }, [token]);

  const status: Status = !token.trim() ? "missing_token" : statusFromResult(result);

  return (
    <div style={wrap}>
      <div style={cardStyle} data-testid="unsubscribe-card">
        {status === "loading" ? (
          <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
            Đang xử lý… · Processing…
          </p>
        ) : null}

        {status === "success" ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 6 }} aria-hidden>
              ✓
            </div>
            <h1 style={headingStyle}>Bạn đã unsubscribe</h1>
            <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0" }}>
              You've been unsubscribed.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#1f2937",
                marginTop: 14,
                lineHeight: 1.55,
              }}
            >
              Bạn sẽ không nhận thêm email marketing nào từ MercyBlade. Bạn vẫn có thể
              dùng app bình thường — đăng nhập và học như mọi khi.
            </p>
            <p
              style={{
                fontSize: 12,
                color: "#94a3b8",
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              You won't receive any more marketing emails from MercyBlade. Your account is
              unchanged — sign in and keep learning as usual.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
              <Link
                to="/account/notifications"
                style={linkBtn}
                data-testid="unsubscribe-resubscribe-link"
              >
                Quản lý từng loại email · Manage preferences
              </Link>
              <Link
                to="/"
                style={{
                  ...linkBtn,
                  background: "white",
                  color: "#111827",
                  border: "1px solid rgba(0,0,0,0.12)",
                  fontWeight: 600,
                }}
              >
                Về trang chủ · Home
              </Link>
            </div>
          </>
        ) : null}

        {status === "missing_token" || status === "invalid" ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 6 }} aria-hidden>
              ⚠️
            </div>
            <h1 style={headingStyle}>Liên kết không hợp lệ</h1>
            <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0" }}>
              Invalid unsubscribe link.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#1f2937",
                marginTop: 14,
                lineHeight: 1.55,
              }}
            >
              Liên kết unsubscribe của bạn thiếu hoặc sai định dạng. Hãy mở lại email
              gần nhất từ MercyBlade và bấm vào nút unsubscribe ở chân email.
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
              Your unsubscribe link is missing or malformed. Open the most recent email
              from MercyBlade and click the unsubscribe link in the footer.
            </p>
            <div style={{ marginTop: 20 }}>
              <a href="mailto:admin@mercyblade.com" style={linkBtn}>
                Liên hệ hỗ trợ · Contact support
              </a>
            </div>
          </>
        ) : null}

        {status === "not_found" ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 6 }} aria-hidden>
              ℹ️
            </div>
            <h1 style={headingStyle}>Liên kết đã hết hạn hoặc không khớp</h1>
            <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0" }}>
              Link expired or didn't match an account.
            </p>
            <p
              style={{
                fontSize: 14,
                color: "#1f2937",
                marginTop: 14,
                lineHeight: 1.55,
              }}
            >
              Liên kết unsubscribe này không khớp với tài khoản nào. Có thể tài khoản
              đã bị xóa hoặc liên kết đã bị thay đổi. Đăng nhập rồi vào{" "}
              <Link
                to="/account/notifications"
                style={{ color: "#1e3a8a", fontWeight: 700 }}
              >
                Tùy chọn email
              </Link>{" "}
              để tắt email từng loại.
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
              This unsubscribe link doesn't match any account. Sign in and use{" "}
              <Link to="/account/notifications" style={{ color: "#1e3a8a", fontWeight: 700 }}>
                Notification preferences
              </Link>{" "}
              to opt out by category.
            </p>
          </>
        ) : null}

        {status === "rpc_error" ? (
          <>
            <div style={{ fontSize: 40, marginBottom: 6 }} aria-hidden>
              ⚠️
            </div>
            <h1 style={headingStyle}>Lỗi tạm thời</h1>
            <p style={{ fontSize: 14, color: "#475569", margin: "4px 0 0" }}>
              Temporary error.
            </p>
            <p style={{ fontSize: 14, color: "#1f2937", marginTop: 14, lineHeight: 1.55 }}>
              Hệ thống không xử lý được yêu cầu unsubscribe. Vui lòng thử lại sau vài
              phút, hoặc gửi email cho chúng tôi.
            </p>
            <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>
              We couldn't process your unsubscribe request. Try again in a few minutes
              or email us.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
              <button
                type="button"
                style={{ ...linkBtn, border: "none", cursor: "pointer" }}
                onClick={() => {
                  setResult(null);
                  void unsubscribeByToken(token).then(setResult);
                }}
                data-testid="unsubscribe-retry"
              >
                Thử lại · Retry
              </button>
              <a
                href="mailto:admin@mercyblade.com"
                style={{
                  ...linkBtn,
                  background: "white",
                  color: "#111827",
                  border: "1px solid rgba(0,0,0,0.12)",
                  fontWeight: 600,
                }}
              >
                Liên hệ · Contact
              </a>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
