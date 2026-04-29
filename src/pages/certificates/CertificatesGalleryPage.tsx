// src/pages/certificates/CertificatesGalleryPage.tsx
//
// Earned-certificate gallery + "what you can earn" explainer. Reads
// from the mock RPC for now; A1 will swap the RPC out without changing
// this page.
//
// Scope rule: this page does NOT render the certificate itself
// (Certificate.tsx, export, /cert/:code verify page) — those belong to
// A2. We render small cards with a share/copy hook that links out to
// the public verify URL for each earned cert.

import * as React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

import { listEarnedCertificates } from "@/lib/certificates/rpc";
import {
  CERTIFICATE_CATALOG,
  certificateMeta,
} from "@/lib/certificates/catalog";
import {
  publicCertificateUrl,
  type EarnedCertificate,
} from "@/lib/certificates/types";

const GROUP_LABELS: Record<string, { vi: string; en: string }> = {
  xp:           { vi: "Tích lũy XP",        en: "XP milestones" },
  streak:       { vi: "Chuỗi học",          en: "Streaks" },
  rooms:        { vi: "Phòng học",          en: "Rooms" },
  vocab:        { vi: "Từ vựng",            en: "Vocabulary" },
  pronunciation:{ vi: "Phát âm",            en: "Pronunciation" },
  writing:      { vi: "Viết",               en: "Writing" },
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export function CertificatesGalleryPage(): React.ReactElement {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [earned, setEarned] = useState<EarnedCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);
    void listEarnedCertificates(userId)
      .then((rows) => {
        if (!alive) return;
        setEarned(rows);
      })
      .catch((err) => {
        console.warn("[CertificatesGallery] list failed", err);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [userId]);

  const earnedTypes = useMemo(
    () => new Set(earned.map((c) => c.certificate_type)),
    [earned],
  );

  return (
    <div
      style={{
        maxWidth: 880,
        margin: "0 auto",
        padding: "16px 16px 48px",
        color: "#0f172a",
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          Chứng chỉ tiến bộ
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            margin: "4px 0 0",
            lineHeight: 1.5,
          }}
        >
          Progress certificates — earned as you keep going.
        </p>
      </header>

      {loading ? (
        <p style={{ fontSize: 14, color: "#64748b" }}>Đang tải…</p>
      ) : earned.length === 0 ? (
        <EmptyState />
      ) : (
        <EarnedGrid earned={earned} />
      )}

      <WhatYouCanEarn earnedTypes={earnedTypes} />
    </div>
  );
}

function EmptyState(): React.ReactElement {
  return (
    <section
      data-testid="certificates-empty"
      style={{
        border: "1px dashed #cbd5e1",
        borderRadius: 16,
        padding: 20,
        textAlign: "center",
        background: "#f8fafc",
        marginBottom: 24,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 15,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        Chưa có chứng chỉ nào.
      </p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.5,
        }}
      >
        Cứ luyện tập đều đặn — Mercy sẽ tự ghi nhận khi bạn đạt cột mốc.
      </p>
    </section>
  );
}

function EarnedGrid({ earned }: { earned: EarnedCertificate[] }): React.ReactElement {
  return (
    <section
      data-testid="certificates-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 12,
        marginBottom: 24,
      }}
    >
      {earned.map((cert) => (
        <EarnedCard key={cert.id} certificate={cert} />
      ))}
    </section>
  );
}

function EarnedCard({
  certificate,
}: {
  certificate: EarnedCertificate;
}): React.ReactElement {
  const meta = certificateMeta(certificate.certificate_type);
  const url = publicCertificateUrl(certificate.certificate_code);
  const [copied, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      },
      () => {
        // ignore — user can still click the verify link.
      },
    );
  }, [url]);

  return (
    <article
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 14,
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 22 }} aria-hidden>
          {meta?.icon ?? "🎓"}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            {meta?.label_vi ?? certificate.certificate_type}
          </p>
          <p style={{ margin: "1px 0 0", fontSize: 12, color: "#64748b" }}>
            {meta?.label_en ?? ""}
          </p>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "#475569",
          lineHeight: 1.5,
        }}
      >
        {meta?.blurb_vi}
      </p>

      <p style={{ margin: 0, fontSize: 11, color: "#94a3b8" }}>
        {formatDate(certificate.earned_at)}
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginTop: 4,
        }}
      >
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12,
            color: "#0f172a",
            textDecoration: "underline",
          }}
        >
          Xem / chia sẻ
        </a>
        <button
          type="button"
          onClick={onCopy}
          style={{
            fontSize: 12,
            border: "1px solid #e2e8f0",
            background: "#f8fafc",
            color: "#0f172a",
            borderRadius: 9999,
            padding: "4px 10px",
            cursor: "pointer",
          }}
        >
          {copied ? "Đã chép link" : "Chép link"}
        </button>
      </div>
    </article>
  );
}

function WhatYouCanEarn({
  earnedTypes,
}: {
  earnedTypes: Set<string>;
}): React.ReactElement {
  const groups: Record<string, typeof CERTIFICATE_CATALOG[number][]> = {};
  for (const meta of CERTIFICATE_CATALOG) {
    (groups[meta.group] ??= []).push(meta);
  }

  return (
    <section
      data-testid="certificates-what-you-can-earn"
      style={{ marginTop: 12 }}
    >
      <h2
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#0f172a",
          margin: "0 0 8px",
        }}
      >
        Bạn có thể đạt được
      </h2>
      <p
        style={{
          fontSize: 12,
          color: "#64748b",
          margin: "0 0 12px",
          lineHeight: 1.5,
        }}
      >
        What you can earn — keep going to unlock these.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {Object.entries(groups).map(([group, items]) => (
          <div key={group}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#475569",
                margin: "0 0 6px",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {GROUP_LABELS[group]?.vi ?? group}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(180px, 1fr))",
                gap: 8,
              }}
            >
              {items.map((meta) => {
                const earned = earnedTypes.has(meta.type);
                return (
                  <div
                    key={meta.type}
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      padding: 10,
                      background: earned ? "#f0fdf4" : "#ffffff",
                      opacity: earned ? 1 : 0.85,
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#0f172a",
                      }}
                    >
                      <span aria-hidden style={{ marginRight: 6 }}>
                        {meta.icon}
                      </span>
                      {meta.label_vi}
                    </p>
                    <p
                      style={{
                        margin: "2px 0 0",
                        fontSize: 11,
                        color: "#64748b",
                      }}
                    >
                      {meta.label_en}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p
        style={{
          fontSize: 11,
          color: "#94a3b8",
          marginTop: 16,
          lineHeight: 1.5,
        }}
      >
        <Link to="/" style={{ color: "#475569", textDecoration: "underline" }}>
          ← Về trang chính
        </Link>
      </p>
    </section>
  );
}

export default CertificatesGalleryPage;
