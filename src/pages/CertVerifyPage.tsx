// src/pages/CertVerifyPage.tsx
//
// Public verification page at `/cert/:code`. Displays one of four
// states (loading, verified, not_found, error) with bilingual copy.
//
// Backend: calls the `verify_certificate` Supabase RPC. The RPC
// returns rows shaped { cert_type, display_name_en, display_name_vi,
// issued_at, certificate_code }; an empty result means "not found".
// Recipient name is intentionally not surfaced by the RPC (privacy /
// public-verification): we display a neutral "MercyBlade Learner"
// label on the verify page.

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Certificate from "@/components/certificates/Certificate";
import { supabase } from "@/lib/supabaseClient";

type CertificateRecord = {
  recipientName: string;
  certType: string;
  displayNameEn: string;
  displayNameVi: string;
  issuedAt: string;
  certificateCode: string;
};

type VerifyRpcRow = {
  cert_type: string;
  display_name_en: string;
  display_name_vi: string;
  issued_at: string;
  certificate_code: string;
};

type ViewState =
  | { kind: "loading" }
  | { kind: "verified"; certificate: CertificateRecord }
  | { kind: "not_found" }
  | { kind: "error"; message: string };

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  background: "#fafaf9",
};

const container: React.CSSProperties = {
  maxWidth: 1080,
  margin: "0 auto",
  padding: "32px 16px 80px",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 28,
  fontWeight: 800,
  letterSpacing: -0.5,
  color: "#1f2937",
};

const subtitleStyle: React.CSSProperties = {
  margin: "4px 0 0",
  fontSize: 14,
  color: "#64748b",
};

const cardStyle: React.CSSProperties = {
  marginTop: 18,
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 16,
  background: "white",
  padding: 24,
  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
};

export default function CertVerifyPage(): React.ReactElement {
  const { code = "" } = useParams<{ code: string }>();
  const [state, setState] = useState<ViewState>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ kind: "loading" });

    (async () => {
      try {
        const { data, error } = await supabase.rpc("verify_certificate", {
          p_code: code,
        });

        if (cancelled) return;

        if (error) {
          setState({ kind: "error", message: error.message });
          return;
        }

        const rows = (data ?? []) as VerifyRpcRow[];
        if (rows.length === 0) {
          setState({ kind: "not_found" });
          return;
        }

        const row = rows[0];
        setState({
          kind: "verified",
          certificate: {
            recipientName: "MercyBlade Learner",
            certType: row.cert_type,
            displayNameEn: row.display_name_en,
            displayNameVi: row.display_name_vi,
            issuedAt: row.issued_at,
            certificateCode: row.certificate_code,
          },
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          kind: "error",
          message: err instanceof Error ? err.message : "Unexpected error.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div style={wrap}>
      <div style={container}>
        <header>
          <h1 style={titleStyle}>
            Certificate verification · Tra cứu chứng nhận
          </h1>
          <p style={subtitleStyle}>
            Nhập mã chứng nhận để xác minh tính xác thực do MercyBlade cấp.
            Enter a certificate code to verify a MercyBlade-issued credential.
          </p>
        </header>

        <section style={cardStyle} aria-live="polite">
          {state.kind === "loading" && <LoadingPanel code={code} />}
          {state.kind === "not_found" && <NotFoundPanel code={code} />}
          {state.kind === "error" && <ErrorPanel message={state.message} code={code} />}
          {state.kind === "verified" && (
            <VerifiedPanel
              code={code}
              certificate={state.certificate}
            />
          )}
        </section>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Panels
// ─────────────────────────────────────────────────────────────────────────────

function LoadingPanel({ code }: { code: string }): React.ReactElement {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px" }}>
      <div
        aria-hidden
        style={{
          width: 36,
          height: 36,
          margin: "0 auto 12px",
          border: "3px solid #e2e8f0",
          borderTopColor: "#92400e",
          borderRadius: "50%",
          animation: "mb-cert-spin 0.9s linear infinite",
        }}
      />
      <p style={{ margin: 0, fontWeight: 600, color: "#1f2937" }}>
        Đang xác minh · Verifying…
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
        {code ? `Mã / Code: ${code}` : "Đang tải / Loading…"}
      </p>
      <style>
        {"@keyframes mb-cert-spin { to { transform: rotate(360deg); } }"}
      </style>
    </div>
  );
}

function NotFoundPanel({ code }: { code: string }): React.ReactElement {
  return (
    <div style={{ textAlign: "center", padding: "24px 16px" }}>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#7c2d12" }}>
        Không tìm thấy chứng nhận này.
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 16, color: "#1f2937" }}>
        Certificate not found.
      </p>
      <p style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
        Mã / Code:{" "}
        <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {code || "—"}
        </code>
      </p>
      <p style={{ marginTop: 16, fontSize: 13, color: "#64748b" }}>
        Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ MercyBlade.
        <br />
        If you believe this is an error, please contact MercyBlade.
      </p>
      <p style={{ marginTop: 18 }}>
        <Link to="/" style={{ color: "#92400e", fontWeight: 600 }}>
          ← Trở về trang chủ / Back to home
        </Link>
      </p>
    </div>
  );
}

function ErrorPanel({
  message,
  code,
}: {
  message: string;
  code: string;
}): React.ReactElement {
  return (
    <div style={{ textAlign: "center", padding: "24px 16px" }}>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#b91c1c" }}>
        Đã xảy ra lỗi · Something went wrong
      </p>
      <p style={{ marginTop: 8, fontSize: 14, color: "#475569" }}>{message}</p>
      <p style={{ marginTop: 12, fontSize: 13, color: "#64748b" }}>
        Mã / Code:{" "}
        <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {code || "—"}
        </code>
      </p>
      <p style={{ marginTop: 16 }}>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            border: "1px solid #cbd5e1",
            background: "white",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 14,
            fontWeight: 600,
            color: "#1f2937",
            cursor: "pointer",
          }}
        >
          Thử lại / Retry
        </button>
      </p>
    </div>
  );
}

function VerifiedPanel({
  code,
  certificate,
}: {
  code: string;
  certificate: CertificateRecord;
}): React.ReactElement {
  return (
    <div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: 999,
          background: "#ecfdf5",
          color: "#047857",
          fontSize: 13,
          fontWeight: 700,
          marginBottom: 16,
        }}
      >
        <span aria-hidden style={{ fontSize: 14 }}>✓</span>
        Đã xác minh · Verified
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
        Mã / Code:{" "}
        <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          {code}
        </code>
      </p>

      <div style={{ marginTop: 18 }}>
        <Certificate
          recipientName={certificate.recipientName}
          certType={certificate.certType}
          displayNameEn={certificate.displayNameEn}
          displayNameVi={certificate.displayNameVi}
          issuedAt={certificate.issuedAt}
          certificateCode={certificate.certificateCode}
          language="bilingual"
        />
      </div>
    </div>
  );
}
