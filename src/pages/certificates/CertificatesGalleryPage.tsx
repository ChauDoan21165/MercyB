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
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { useUserAccess } from "@/hooks/useUserAccess";

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

const CERTIFICATES_FLAG_KEY = "certificates_enabled";

export function CertificatesGalleryPage(): React.ReactElement | null {
  const { enabled: flagEnabled, loading: flagLoading } = useFeatureFlag(
    CERTIFICATES_FLAG_KEY,
    false,
  );
  const { user } = useAuth();
  const userId = user?.id ?? null;
  // Entitlements drive the soft premium nudge below. Hook lives above
  // the conditional returns so hook order stays stable across renders
  // (Rules of Hooks — same lesson PR #243 already pinned for this file).
  const access = useUserAccess();

  const [earned, setEarned] = useState<EarnedCertificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Rules of Hooks: every hook below must run on every render. The early
  // returns for flagLoading / !flagEnabled live AFTER this block — moving
  // them above caused the hook count to shift between renders, which
  // produced cryptic React errors (e.g. "Cannot destructure 'basename'
  // of useContext as it is null") when the flag flipped on after mount.
  useEffect(() => {
    if (!flagEnabled || !userId) {
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
  }, [flagEnabled, userId]);

  const earnedTypes = useMemo(
    () => new Set(earned.map((c) => c.certificate_type)),
    [earned],
  );

  // Conditional renders happen AFTER all hooks above to keep hook order stable.
  if (flagLoading) return null;
  if (!flagEnabled) return <CertificatesUnavailable />;

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

      {/* Premium nudge — only shown after the user has felt the value
          (≥1 earned cert), and only to non-premium accounts after the
          entitlement load resolves so it doesn't flash for paid users. */}
      {!access.isLoading &&
        !access.hasPremium &&
        earned.length > 0 ? (
        <PremiumNudge />
      ) : null}

      <WhatYouCanEarn earnedTypes={earnedTypes} />
    </div>
  );
}

function CertificatesUnavailable(): React.ReactElement {
  return (
    <div
      data-testid="certificates-unavailable"
      style={{
        maxWidth: 560,
        margin: "0 auto",
        padding: "24px 16px",
        color: "#0f172a",
        textAlign: "center",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        Tính năng chưa khả dụng
      </p>
      <p
        style={{
          margin: "6px 0 14px",
          fontSize: 13,
          color: "#64748b",
          lineHeight: 1.5,
        }}
      >
        Progress certificates aren't available yet.
      </p>
      <Link
        to="/"
        style={{
          fontSize: 13,
          color: "#0f172a",
          textDecoration: "underline",
        }}
      >
        ← Về trang chính
      </Link>
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

      <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>
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

/**
 * Soft premium nudge — value-clear, non-blocking. The caller already
 * gates on:
 *   (1) entitlements have loaded
 *   (2) user is not premium
 *   (3) user has earned at least one certificate
 * so this component itself is render-only — no flag/auth checks here.
 *
 * Tone rules:
 *   - calm, supportive ("help Mercy keep growing"), never pushy
 *   - concrete future value (more tracks, deeper progression)
 *   - explicit reassurance that earned certs are not affected
 *   - no FOMO, no "limited time", no streak shaming
 */
function PremiumNudge(): React.ReactElement {
  return (
    <aside
      data-testid="certificates-premium-nudge"
      aria-label="MercyBlade Premium"
      style={{
        marginTop: 24,
        padding: "16px 18px",
        borderRadius: 16,
        border: "1px solid #bae6fd",
        borderLeft: "4px solid #0ea5e9",
        background: "#f0f9ff",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span aria-hidden style={{ fontSize: 18, lineHeight: 1 }}>
          ✨
        </span>
        <p
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: "#0c4a6e",
          }}
        >
          Hỗ trợ Mercy phát triển
        </p>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "#0f172a",
          lineHeight: 1.55,
        }}
      >
        Bản Premium giúp Mercy mở thêm các chặng học sâu hơn và nhiều
        chứng chỉ mới — đồng thời giữ nguyên những gì bạn đã đạt được.
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "#475569",
          lineHeight: 1.5,
        }}
      >
        Premium funds new certificate tracks and deeper progression.
        Everything you've already earned stays yours.
      </p>

      <Link
        to="/pricing"
        style={{
          alignSelf: "flex-start",
          marginTop: 4,
          fontSize: 13,
          fontWeight: 600,
          color: "#0c4a6e",
          textDecoration: "none",
          padding: "8px 14px",
          borderRadius: 9999,
          background: "#ffffff",
          border: "1px solid #bae6fd",
        }}
      >
        Tìm hiểu Premium · Learn more →
      </Link>
    </aside>
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
          color: "#64748b",
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
