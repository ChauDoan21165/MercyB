// PATH: src/components/admin/users/AdminUsersHeader.tsx

import React from "react";
import { Link } from "react-router-dom";

type Props = {
  refreshedAt?: string | null;
  onRefresh: () => void;
  onExportCsv: () => void;
};

export default function AdminUsersHeader({
  refreshedAt,
  onRefresh,
  onExportCsv,
}: Props) {
  const headerCard: React.CSSProperties = {
    borderRadius: 24,
    border: "1px solid rgba(0,0,0,0.08)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,249,252,0.94))",
    padding: "22px 20px",
    boxShadow: "0 14px 34px rgba(0,0,0,0.05)",
  };

  const eyebrow: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.45)",
  };

  const title: React.CSSProperties = {
    margin: "8px 0 0",
    fontSize: 38,
    lineHeight: 1.05,
    fontWeight: 950,
    color: "rgba(0,0,0,0.90)",
    letterSpacing: -1.0,
  };

  const sub: React.CSSProperties = {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 1.65,
    color: "rgba(0,0,0,0.64)",
    maxWidth: 860,
  };

  const meta: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    color: "rgba(0,0,0,0.52)",
    fontWeight: 700,
  };

  const topActions: React.CSSProperties = {
    marginTop: 14,
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  };

  const pillBtn: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 9999,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.92)",
    color: "rgba(0,0,0,0.78)",
    textDecoration: "none",
    fontWeight: 900,
    fontSize: 14,
    cursor: "pointer",
  };

  return (
    <div style={headerCard}>
      <div style={eyebrow}>Admin / Users</div>
      <h1 style={title}>Users & subscriptions dashboard</h1>
      <div style={sub}>
        Production-focused SaaS view of your members, billing state, estimated recurring
        revenue, churn-risk signals, and a filterable audit list.
      </div>
      <div style={meta}>
        Last refreshed: {refreshedAt ? new Date(refreshedAt).toLocaleString() : "—"}
      </div>

      <div style={topActions}>
        <Link to="/admin" style={pillBtn}>
          ← Back to Admin
        </Link>
        <Link to="/admin/subscriptions" style={pillBtn}>
          Billing page
        </Link>
        <button type="button" style={pillBtn} onClick={onRefresh}>
          ↻ Refresh
        </button>
        <button type="button" style={pillBtn} onClick={onExportCsv}>
          ⭳ Export CSV
        </button>
      </div>
    </div>
  );
}