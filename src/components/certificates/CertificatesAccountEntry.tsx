// src/components/certificates/CertificatesAccountEntry.tsx
//
// Small "View progress certificates" link rendered on the Account
// page only when the `certificates_enabled` feature flag is ON. While
// the flag is loading we render nothing so we don't flash a link that
// might disappear.

import * as React from "react";
import { Link } from "react-router-dom";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";

const CERTIFICATES_FLAG_KEY = "certificates_enabled";

export function CertificatesAccountEntry(): React.ReactElement | null {
  const { enabled, loading } = useFeatureFlag(CERTIFICATES_FLAG_KEY, false);
  if (loading || !enabled) return null;

  return (
    <div
      data-testid="certificates-account-entry"
      style={{
        marginTop: 18,
        padding: 14,
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        background: "#ffffff",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        Chứng chỉ tiến bộ
      </p>
      <p
        style={{
          margin: "4px 0 8px",
          fontSize: 12,
          color: "#64748b",
          lineHeight: 1.5,
        }}
      >
        Progress certificates — earned from your XP, streak, and practice.
      </p>
      <Link
        to="/certificates"
        style={{
          fontSize: 13,
          color: "#0f172a",
          textDecoration: "underline",
        }}
      >
        Xem bộ sưu tập →
      </Link>
    </div>
  );
}

export default CertificatesAccountEntry;
