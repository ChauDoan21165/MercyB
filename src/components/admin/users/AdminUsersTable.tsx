// PATH: src/components/admin/users/AdminUsersTable.tsx

import React from "react";
import type { AdminUsersRow } from "@/types/adminUsers";

type Props = {
  loading: boolean;
  error: string | null;
  rows: AdminUsersRow[];
  onSelectRow: (row: AdminUsersRow) => void;
  formatMoney: (amount: number, currency?: string) => string;
  formatDate: (value: string | null) => string;
};

export default function AdminUsersTable({
  loading,
  error,
  rows,
  onSelectRow,
  formatMoney,
  formatDate,
}: Props) {
  const tableCard: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.94)",
    padding: "16px 16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const chartTitle: React.CSSProperties = {
    margin: 0,
    fontSize: 20,
    lineHeight: 1.1,
    fontWeight: 900,
    color: "rgba(0,0,0,0.86)",
    letterSpacing: -0.35,
  };

  const chartHelp: React.CSSProperties = {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 13,
    lineHeight: 1.55,
    color: "rgba(0,0,0,0.58)",
  };

  const tableWrap: React.CSSProperties = {
    marginTop: 14,
    overflowX: "auto",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "white",
  };

  const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 1100,
  };

  const th: React.CSSProperties = {
    padding: "12px 12px",
    textAlign: "left",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.48)",
    background: "rgba(247,249,252,0.98)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 1,
  };

  const td: React.CSSProperties = {
    padding: "12px 12px",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    fontSize: 14,
    color: "rgba(0,0,0,0.82)",
    verticalAlign: "top",
  };

  const rowStyle = (row: AdminUsersRow): React.CSSProperties => {
    if (row.anomalyFlags.includes("missing_profile")) {
      return { background: "rgba(254,242,242,0.72)" };
    }
    if (row.anomalyFlags.includes("canceling_soon")) {
      return { background: "rgba(255,251,235,0.82)" };
    }
    if (row.environment === "sandbox") {
      return { background: "rgba(248,250,252,0.72)" };
    }
    return { background: "white" };
  };

  const emailStyle: React.CSSProperties = {
    cursor: "copy",
    fontWeight: 800,
  };

  const rowBtn: React.CSSProperties = {
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: 0,
    padding: 0,
    margin: 0,
    cursor: "pointer",
    color: "inherit",
    font: "inherit",
  };

  const badge = (kind: "active" | "trialing" | "month" | "year" | "admin" | "plain" | "warn"): React.CSSProperties => {
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 9999,
      padding: "6px 10px",
      fontSize: 12,
      fontWeight: 900,
      border: "1px solid rgba(0,0,0,0.10)",
      whiteSpace: "nowrap",
    };

    switch (kind) {
      case "active":
        return {
          ...base,
          background: "rgba(236,253,245,0.95)",
          color: "rgba(6,95,70,0.94)",
          border: "1px solid rgba(16,185,129,0.20)",
        };
      case "trialing":
        return {
          ...base,
          background: "rgba(239,246,255,0.96)",
          color: "rgba(30,64,175,0.92)",
          border: "1px solid rgba(59,130,246,0.20)",
        };
      case "month":
        return {
          ...base,
          background: "rgba(245,243,255,0.96)",
          color: "rgba(91,33,182,0.92)",
          border: "1px solid rgba(139,92,246,0.20)",
        };
      case "year":
        return {
          ...base,
          background: "rgba(255,247,237,0.96)",
          color: "rgba(154,52,18,0.92)",
          border: "1px solid rgba(249,115,22,0.20)",
        };
      case "admin":
        return {
          ...base,
          background: "rgba(255,250,235,0.96)",
          color: "rgba(146,64,14,0.94)",
          border: "1px solid rgba(245,158,11,0.20)",
        };
      case "warn":
        return {
          ...base,
          background: "rgba(254,242,242,0.96)",
          color: "rgba(153,27,27,0.92)",
          border: "1px solid rgba(239,68,68,0.20)",
        };
      default:
        return {
          ...base,
          background: "rgba(248,250,252,0.96)",
          color: "rgba(51,65,85,0.90)",
        };
    }
  };

  return (
    <div style={tableCard}>
      <h2 style={chartTitle}>Members list</h2>
      <p style={chartHelp}>
        Filterable row view for support, billing audits, and quick manual checks. Click an email to copy it.
      </p>

      {loading ? (
        <div style={{ marginTop: 14, fontSize: 14, color: "rgba(0,0,0,0.60)" }}>
          Loading users dashboard…
        </div>
      ) : error ? (
        <div
          style={{
            marginTop: 14,
            borderRadius: 14,
            border: "1px solid rgba(220,38,38,0.20)",
            background: "rgba(254,242,242,0.90)",
            padding: "12px 14px",
            color: "rgba(127,29,29,0.92)",
            fontWeight: 700,
          }}
        >
          Failed to load admin users dashboard: {error}
        </div>
      ) : (
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Email</th>
                <th style={th}>Status</th>
                <th style={th}>Plan</th>
                <th style={th}>Amount</th>
                <th style={th}>Environment</th>
                <th style={th}>Period end</th>
                <th style={th}>Created</th>
                <th style={th}>Flags</th>
                <th style={th}>User ID</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td style={td} colSpan={9}>
                    No rows match the current filters.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.subscriptionId} style={rowStyle(row)}>
                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        <div
                          style={emailStyle}
                          title="Click to copy email"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (row.email && row.email !== "unknown") {
                              void navigator.clipboard.writeText(row.email);
                            }
                          }}
                        >
                          {row.email || "unknown"}
                        </div>
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        <span
                          style={badge(
                            row.status === "trialing"
                              ? "trialing"
                              : row.status === "active"
                                ? "active"
                                : "plain",
                          )}
                        >
                          {row.status}
                        </span>
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        <span
                          style={badge(
                            row.planInterval === "year"
                              ? "year"
                              : row.planInterval === "month"
                                ? "month"
                                : "plain",
                          )}
                        >
                          {row.planInterval}
                        </span>
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        {row.amountCents > 0
                          ? formatMoney((row.amountCents * row.quantity) / 100, row.currencyCode)
                          : "—"}
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        {row.environment}
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        {formatDate(row.currentPeriodEnd)}
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        {formatDate(row.createdAt)}
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {row.cancelAtPeriodEnd ? (
                            <span style={badge("warn")}>Cancel at period end</span>
                          ) : null}
                          {row.isAdmin ? (
                            <span style={badge("admin")}>Admin L{row.adminLevel}</span>
                          ) : null}
                          {row.anomalyFlags.includes("missing_profile") ? (
                            <span style={badge("warn")}>Missing profile</span>
                          ) : null}
                          {row.anomalyFlags.includes("unknown_email") ? (
                            <span style={badge("warn")}>Unknown email</span>
                          ) : null}
                        </div>
                      </button>
                    </td>

                    <td style={td}>
                      <button type="button" style={rowBtn} onClick={() => onSelectRow(row)}>
                        <code style={{ fontSize: 12, color: "rgba(0,0,0,0.62)" }}>
                          {row.userId}
                        </code>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}