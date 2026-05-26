// PATH: src/components/admin/users/AdminUserDetailDrawer.tsx

import React from "react";
import type { AdminUsersRow } from "@/types/adminUsers";

type Props = {
  row: AdminUsersRow | null;
  open: boolean;
  onClose: () => void;
  formatMoney: (amount: number, currency?: string) => string;
  formatDate: (value: string | null) => string;
};

export default function AdminUserDetailDrawer({
  row,
  open,
  onClose,
  formatMoney,
  formatDate,
}: Props) {
  if (!open || !row) return null;

  const overlay: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.28)",
    zIndex: 90,
    display: "flex",
    justifyContent: "flex-end",
  };

  const drawer: React.CSSProperties = {
    width: "min(540px, 96vw)",
    height: "100%",
    background: "rgba(255,255,255,0.98)",
    borderLeft: "1px solid rgba(0,0,0,0.10)",
    boxShadow: "-12px 0 40px rgba(0,0,0,0.12)",
    overflowY: "auto",
    padding: "20px 18px 28px",
  };

  const topRow: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.05,
    fontWeight: 950,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -0.8,
  };

  const sub: React.CSSProperties = {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.6,
    color: "rgba(0,0,0,0.60)",
  };

  const closeBtn: React.CSSProperties = {
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.96)",
    padding: "10px 12px",
    fontWeight: 900,
    cursor: "pointer",
  };

  const section: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(250,251,252,0.96)",
    padding: "14px 14px",
  };

  const sectionTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 16,
    fontWeight: 900,
    color: "rgba(0,0,0,0.82)",
  };

  const grid: React.CSSProperties = {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "minmax(110px, 140px) 1fr",
    gap: "10px 12px",
  };

  const keyStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.46)",
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.84)",
    overflowWrap: "anywhere",
  };

  const actionRow: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  };

  const actionBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.96)",
    color: "rgba(0,0,0,0.78)",
    fontWeight: 900,
    cursor: "pointer",
  };

  const badge = (warn = false): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 9999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 900,
    whiteSpace: "nowrap",
    border: warn
      ? "1px solid rgba(239,68,68,0.20)"
      : "1px solid rgba(0,0,0,0.10)",
    background: warn
      ? "rgba(254,242,242,0.96)"
      : "rgba(248,250,252,0.96)",
    color: warn ? "rgba(153,27,27,0.92)" : "rgba(51,65,85,0.90)",
  });

  return (
    <div style={overlay} onClick={onClose}>
      <div style={drawer} onClick={(e) => e.stopPropagation()}>
        <div style={topRow}>
          <div>
            <h2 style={title}>{row.email || "unknown"}</h2>
            <div style={sub}>Subscription detail and anomaly inspection.</div>
          </div>

          <button type="button" style={closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Identity</h3>
          <div style={grid}>
            <div style={keyStyle}>Email</div>
            <div style={valueStyle}>{row.email || "unknown"}</div>

            <div style={keyStyle}>User ID</div>
            <div style={valueStyle}>
              <code>{row.userId}</code>
            </div>

            <div style={keyStyle}>Admin</div>
            <div style={valueStyle}>
              {row.isAdmin ? `Yes · level ${row.adminLevel}` : "No"}
            </div>

            <div style={keyStyle}>Environment</div>
            <div style={valueStyle}>{row.environment}</div>
          </div>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Billing</h3>
          <div style={grid}>
            <div style={keyStyle}>Status</div>
            <div style={valueStyle}>{row.status}</div>

            <div style={keyStyle}>Plan</div>
            <div style={valueStyle}>{row.planInterval}</div>

            <div style={keyStyle}>Amount</div>
            <div style={valueStyle}>
              {row.amountCents > 0
                ? formatMoney((row.amountCents * row.quantity) / 100, row.currencyCode)
                : "—"}
            </div>

            <div style={keyStyle}>Subscription ID</div>
            <div style={valueStyle}>
              <code>{row.subscriptionId}</code>
            </div>

            <div style={keyStyle}>Created</div>
            <div style={valueStyle}>{formatDate(row.createdAt)}</div>

            <div style={keyStyle}>Period end</div>
            <div style={valueStyle}>{formatDate(row.currentPeriodEnd)}</div>

            <div style={keyStyle}>Cancel at end</div>
            <div style={valueStyle}>{row.cancelAtPeriodEnd ? "Yes" : "No"}</div>
          </div>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Anomalies</h3>
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {row.anomalyFlags.length === 0 ? (
              <span style={badge(false)}>No anomaly flags</span>
            ) : (
              row.anomalyFlags.map((flag) => (
                <span key={flag} style={badge(true)}>
                  {flag}
                </span>
              ))
            )}
          </div>
        </div>

        <div style={section}>
          <h3 style={sectionTitle}>Quick actions</h3>
          <div style={actionRow}>
            <button
              type="button"
              style={actionBtn}
              onClick={() => {
                if (row.email && row.email !== "unknown") {
                  void navigator.clipboard.writeText(row.email);
                }
              }}
            >
              Copy email
            </button>

            <button
              type="button"
              style={actionBtn}
              onClick={() => {
                void navigator.clipboard.writeText(row.userId);
              }}
            >
              Copy user ID
            </button>

            <button
              type="button"
              style={actionBtn}
              onClick={() => {
                void navigator.clipboard.writeText(row.subscriptionId);
              }}
            >
              Copy subscription ID
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}