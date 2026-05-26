// src/components/UpdatePrompt.tsx

import { useVersionCheck } from "@/hooks/useVersionCheck";

export function UpdatePrompt() {
  const { updateAvailable, applyUpdate, dismissUpdate } = useVersionCheck();

  if (!updateAvailable) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000002, // above Teacher Mercy (1000000) and Feedback (1000001)
        background: "#111",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
        display: "flex",
        gap: 10,
        alignItems: "center",
        maxWidth: "calc(100vw - 32px)",
        fontSize: 14,
      }}
    >
      <span>New version available / Có bản mới</span>
      <button
        onClick={applyUpdate}
        style={{
          background: "#e11d74",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 8,
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Reload
      </button>
      <button
        onClick={dismissUpdate}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          color: "#aaa",
          border: "none",
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
}