// src/components/certificates/CertificateToast.tsx
//
// Listens for `mb:certificate:earned` and shows a calm celebration
// toast. Suppresses the toast when `metadata.backfilled === true` so
// retroactive grants stay quiet.
//
// Mounted once at the router level alongside <MilestoneObserver />.
// Rendering is plain DOM (no portal, no animation library) — the
// component manages a small auto-dismissing stack of in-flight toasts.

import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import {
  CERTIFICATE_EARNED_EVENT,
  type CertificateEarnedDetail,
} from "@/lib/certificates/eventBus";
import { certificateMeta } from "@/lib/certificates/catalog";
import type { EarnedCertificate } from "@/lib/certificates/types";

const CERTIFICATES_FLAG_KEY = "certificates_enabled";
const TOAST_TTL_MS = 6000;

interface ActiveToast {
  key: string;
  certificate: EarnedCertificate;
}

export function CertificateToast(): React.ReactElement | null {
  const { enabled } = useFeatureFlag(CERTIFICATES_FLAG_KEY, false);
  const [stack, setStack] = useState<ActiveToast[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const handler = (ev: Event) => {
      const detail = (ev as CustomEvent<CertificateEarnedDetail>).detail;
      const cert = detail?.certificate;
      if (!cert) return;

      // Suppress retroactive grants entirely.
      if (cert.metadata?.backfilled === true) return;

      const key = `${cert.id}-${Date.now()}`;
      setStack((prev) => [...prev, { key, certificate: cert }]);

      window.setTimeout(() => {
        setStack((prev) => prev.filter((t) => t.key !== key));
      }, TOAST_TTL_MS);
    };

    window.addEventListener(CERTIFICATE_EARNED_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(
        CERTIFICATE_EARNED_EVENT,
        handler as EventListener,
      );
    };
  }, [enabled]);

  if (!enabled || stack.length === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 60,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {stack.map((t) => (
        <CertificateToastCard key={t.key} certificate={t.certificate} />
      ))}
    </div>
  );
}

function CertificateToastCard({
  certificate,
}: {
  certificate: EarnedCertificate;
}): React.ReactElement {
  const meta = certificateMeta(certificate.certificate_type);
  return (
    <div
      data-testid="certificate-toast"
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: "12px 14px",
        boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        minWidth: 280,
      }}
    >
      <span style={{ fontSize: 22, lineHeight: 1.2 }} aria-hidden>
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
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 12,
            color: "#64748b",
            lineHeight: 1.4,
          }}
        >
          {meta?.label_en ?? "Certificate earned"}
        </p>
        <Link
          to="/certificates"
          style={{
            display: "inline-block",
            marginTop: 6,
            fontSize: 12,
            color: "#0f172a",
            textDecoration: "underline",
          }}
        >
          Xem bộ sưu tập
        </Link>
      </div>
    </div>
  );
}

export default CertificateToast;
