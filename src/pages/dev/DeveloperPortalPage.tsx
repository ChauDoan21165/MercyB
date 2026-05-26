/**
 * /dev/api — Developer Portal page (Step 11 shell).
 *
 * Public-facing intro to the MercyBlade Public API:
 *   - "Build with MercyBlade" pitch (one paragraph, VN-first below)
 *   - Sign-in CTA → claim/manage developer accounts (UI for that lives
 *     in a deeper Account → Developer panel — TODO)
 *   - Generate-API-key flow (placeholder; the actual creation RPC + UI
 *     lands in a follow-up since it requires admin approval today)
 *   - Rate-limit info
 *   - 3 endpoint docs with curl examples
 *   - "Email Chau" upgrade CTA
 *
 * Auth-not-required: the page is public so partners can read it without
 * signing in. Key generation lives behind RequireAuth in a future
 * sibling page.
 */

import React from "react";

import { PRODUCT_CONFIG } from "@/config/product";

const wrap: React.CSSProperties = {
  maxWidth: 920,
  margin: "0 auto",
  padding: "24px 16px 56px",
  color: "#0f172a",
  fontFamily: "system-ui, -apple-system, sans-serif",
  lineHeight: 1.6,
};

const h1Style: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 950,
  letterSpacing: -0.5,
  lineHeight: 1.15,
  margin: 0,
};

const h1ViStyle: React.CSSProperties = {
  display: "block",
  marginTop: 4,
  fontSize: 14,
  fontWeight: 500,
  color: "#64748b",
};

const h2Style: React.CSSProperties = {
  marginTop: 32,
  fontSize: 22,
  fontWeight: 800,
  letterSpacing: -0.2,
  color: "#0f172a",
};

const sectionStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 18,
  borderRadius: 14,
  background: "#ffffff",
  border: "1px solid rgba(15,23,42,0.08)",
};

const codeBlockStyle: React.CSSProperties = {
  marginTop: 12,
  padding: "12px 14px",
  borderRadius: 10,
  background: "#0f172a",
  color: "#f1f5f9",
  fontSize: 13,
  fontFamily: "ui-monospace, SF Mono, Menlo, Monaco, monospace",
  overflowX: "auto",
  whiteSpace: "pre",
  lineHeight: 1.55,
};

const inlineCodeStyle: React.CSSProperties = {
  padding: "1px 6px",
  borderRadius: 4,
  background: "rgba(15,23,42,0.08)",
  fontFamily: "ui-monospace, SF Mono, Menlo, Monaco, monospace",
  fontSize: 13,
};

const ctaButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 9999,
  padding: "10px 18px",
  fontWeight: 800,
  fontSize: 14,
  background: "#0f172a",
  color: "white",
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
};

const PUBLIC_API_BASE = `https://${PRODUCT_CONFIG.domain}/functions/v1/public-api`;

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/sentence-of-the-day",
    summary: "Today's community-contributed bilingual sentence.",
    summaryVi: "Câu song ngữ MercyBlade chọn cho hôm nay.",
    curl: `curl -H "Authorization: Bearer mb_YOUR_KEY" \\
  ${PUBLIC_API_BASE}/api/v1/sentence-of-the-day`,
  },
  {
    method: "POST",
    path: "/api/v1/l1-detect",
    summary:
      "Detect Vietnamese-L1-interference patterns in an English sentence.",
    summaryVi:
      "Phát hiện các lỗi tiếng Anh chịu ảnh hưởng từ tiếng Việt.",
    curl: `curl -X POST \\
  -H "Authorization: Bearer mb_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"I student","l1_code":"vi"}' \\
  ${PUBLIC_API_BASE}/api/v1/l1-detect`,
  },
  {
    method: "GET",
    path: "/api/v1/public-stats",
    summary: "Aggregate community counts (no PII).",
    summaryVi: "Số liệu cộng đồng tổng hợp (không có dữ liệu cá nhân).",
    curl: `curl -H "Authorization: Bearer mb_YOUR_KEY" \\
  ${PUBLIC_API_BASE}/api/v1/public-stats`,
  },
];

export default function DeveloperPortalPage() {
  return (
    <div style={wrap}>
      <header>
        <h1 style={h1Style}>
          Build with {PRODUCT_CONFIG.name}
          <span style={h1ViStyle}>Phát triển ứng dụng cùng {PRODUCT_CONFIG.name}</span>
        </h1>
        <p style={{ marginTop: 14, color: "#475569", fontSize: 16 }}>
          {PRODUCT_CONFIG.name} exposes a small public API so other apps can
          embed MercyBlade community signals: today's bilingual sentence,
          Vietnamese-L1 error detection, and aggregate stats. Bearer-auth,
          1,000 requests / hour by default, no PII.
        </p>
        <p style={{ marginTop: 6, color: "#94a3b8", fontSize: 13 }}>
          API công khai dành cho các đối tác muốn nhúng cộng đồng người
          học của {PRODUCT_CONFIG.name}: câu song ngữ trong ngày, phát hiện
          lỗi tiếng Anh do tiếng Việt, và số liệu tổng hợp.
        </p>
      </header>

      <section style={sectionStyle}>
        <h2 style={{ ...h2Style, marginTop: 0 }}>Get a key</h2>
        <p>
          Sign in with the email you want associated with the developer
          account, then request a key. The raw key is shown <strong>once</strong>
          — copy it immediately. We only store the SHA-256 hash.
        </p>
        <p style={{ color: "#64748b", fontSize: 13 }}>
          Đăng nhập bằng email muốn dùng cho tài khoản dev, rồi xin key.
          Key được hiển thị <strong>một lần duy nhất</strong> — copy ngay. Chúng
          tôi chỉ lưu mã SHA-256 (không lưu key gốc).
        </p>
        <div style={{ marginTop: 14, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/signin?next=/dev/api" style={ctaButtonStyle}>
            Sign in to claim a key
          </a>
          <a
            href={`mailto:${PRODUCT_CONFIG.supportEmail}?subject=API%20key%20request`}
            style={{ ...ctaButtonStyle, background: "white", color: "#0f172a", border: "1px solid #cbd5e1" }}
          >
            Email {PRODUCT_CONFIG.supportEmail}
          </a>
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ ...h2Style, marginTop: 0 }}>Rate limit</h2>
        <p>
          Default budget: <code style={inlineCodeStyle}>1,000 requests / hour</code> per
          key, sliding window. Every response carries
          {" "}<code style={inlineCodeStyle}>X-RateLimit-Limit</code>,
          {" "}<code style={inlineCodeStyle}>X-RateLimit-Remaining</code>, and
          {" "}<code style={inlineCodeStyle}>X-RateLimit-Reset</code> headers.
          Over-budget requests return HTTP 429 with{" "}
          <code style={inlineCodeStyle}>Retry-After</code>.
        </p>
        <p style={{ color: "#64748b", fontSize: 13 }}>
          Need higher limits? Email {PRODUCT_CONFIG.supportEmail} with your
          use case.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ ...h2Style, marginTop: 0 }}>Endpoints</h2>
        {ENDPOINTS.map((ep) => (
          <div key={ep.path} style={{ marginTop: 18 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
              <span
                style={{
                  display: "inline-block",
                  marginRight: 8,
                  padding: "2px 8px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  background: ep.method === "GET" ? "#dbeafe" : "#dcfce7",
                  color: ep.method === "GET" ? "#1e40af" : "#166534",
                }}
              >
                {ep.method}
              </span>
              <code style={{ ...inlineCodeStyle, fontSize: 14 }}>{ep.path}</code>
            </h3>
            <p style={{ margin: "6px 0 0", fontSize: 14 }}>{ep.summary}</p>
            <p style={{ margin: "2px 0 0", color: "#64748b", fontSize: 12 }}>
              {ep.summaryVi}
            </p>
            <pre style={codeBlockStyle}>
              <code>{ep.curl}</code>
            </pre>
          </div>
        ))}
      </section>

      <section style={{ ...sectionStyle, background: "#fffbeb", borderColor: "#fde68a" }}>
        <h2 style={{ ...h2Style, marginTop: 0, color: "#92400e" }}>
          What we don't expose
        </h2>
        <ul style={{ margin: 0, paddingLeft: 20, color: "#78350f" }}>
          <li>No user identifiers, emails, or any PII.</li>
          <li>Sentence submitter identity is stripped from public responses.</li>
          <li>No room-level content beyond what's already public on {PRODUCT_CONFIG.domain}.</li>
        </ul>
      </section>
    </div>
  );
}
