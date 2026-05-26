// src/components/offline/OfflineIndicator.tsx
//
// Step 8 (Performance) — top-of-page banner that announces offline
// status. Vietnamese-first copy (CLAUDE.md non-negotiable #1).
//
// The component renders nothing while online, so mounting it in
// main.tsx alongside <AppRouter /> is safe — zero footprint when
// connection is healthy.

import React, { useEffect, useState } from "react";

import { isOnline, subscribeOnlineStatus } from "@/lib/offline/offlineDetector";

const wrapStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
  padding: "8px 12px",
  background: "#1f2937",
  color: "#fde68a",
  fontSize: 13,
  fontWeight: 600,
  textAlign: "center",
  boxShadow: "0 2px 6px rgba(15,23,42,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
};

const enLineStyle: React.CSSProperties = {
  display: "block",
  marginTop: 2,
  fontSize: 11,
  fontWeight: 500,
  opacity: 0.75,
};

export default function OfflineIndicator(): React.ReactElement | null {
  const [online, setOnline] = useState<boolean>(() => isOnline());

  useEffect(() => {
    return subscribeOnlineStatus(setOnline);
  }, []);

  if (online) return null;

  return (
    <div role="status" aria-live="polite" style={wrapStyle} data-testid="offline-indicator">
      <span aria-hidden>📴</span>
      <span>
        Đang ở chế độ offline — bạn vẫn có thể học những bài đã tải.
        <span style={enLineStyle}>
          You're offline — you can still study any lesson that's already
          downloaded.
        </span>
      </span>
    </div>
  );
}
