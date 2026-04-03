import React, { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  adminCancelSubscription,
  adminOpenPortal,
} from "@/lib/adminBilling";

type SubscriptionRow = {
  id: string;
  user_id: string | null;
  app_id: string | null;
  provider: string | null;
  status: string | null;
  customer_id: string | null;
  subscription_id: string | null;
  price_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type StatusFilter =
  | "all"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "inactive";

type ExpiryFilter = "all" | "expiring_7d" | "expiring_30d" | "expired";

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function statusTone(status: string | null | undefined): {
  bg: string;
  fg: string;
  border: string;
} {
  switch (String(status ?? "").toLowerCase()) {
    case "active":
      return {
        bg: "rgba(16,185,129,0.10)",
        fg: "#065f46",
        border: "rgba(16,185,129,0.20)",
      };
    case "trialing":
      return {
        bg: "rgba(59,130,246,0.10)",
        fg: "#1d4ed8",
        border: "rgba(59,130,246,0.20)",
      };
    case "past_due":
      return {
        bg: "rgba(245,158,11,0.12)",
        fg: "#92400e",
        border: "rgba(245,158,11,0.25)",
      };
    case "canceled":
    case "cancelled":
      return {
        bg: "rgba(107,114,128,0.12)",
        fg: "#374151",
        border: "rgba(107,114,128,0.22)",
      };
    case "inactive":
    default:
      return {
        bg: "rgba(239,68,68,0.10)",
        fg: "#991b1b",
        border: "rgba(239,68,68,0.20)",
      };
  }
}

function statusLabel(status: string | null | undefined): string {
  switch (String(status ?? "").toLowerCase()) {
    case "active":
      return "Active";
    case "trialing":
      return "Trialing";
    case "past_due":
      return "Past due";
    case "canceled":
    case "cancelled":
      return "Canceled";
    case "inactive":
      return "Inactive";
    default:
      return status ? String(status) : "—";
  }
}

function priceLabel(priceId: string | null | undefined): string {
  const v = String(priceId ?? "").trim();
  if (!v) return "—";
  if (v === "price_1TCKY02K1tPxy04uCHQNbvik") return "Monthly";
  if (v === "price_1TCKSF2K1tPxy04uNeKcQWp5") return "Yearly";
  return v;
}

function getExpiresValue(row: SubscriptionRow): string | null {
  return row.current_period_end || null;
}

function getExpiresTime(row: SubscriptionRow): number | null {
  const value = getExpiresValue(row);
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function isExpiringSoon(row: SubscriptionRow, days: number): boolean {
  const expiresAt = getExpiresTime(row);
  if (!expiresAt) return false;

  const now = Date.now();
  const diff = expiresAt - now;
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

function isExpired(row: SubscriptionRow): boolean {
  const expiresAt = getExpiresTime(row);
  if (!expiresAt) return false;
  return expiresAt < Date.now();
}

async function copyText(value: string): Promise<void> {
  if (!value) return;
  await navigator.clipboard.writeText(value);
}

export default function AdminSubscriptions() {
  const [rows, setRows] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>("all");
  const [copyFlash, setCopyFlash] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const loadRows = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setErrorText("");

    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select(
          "id,user_id,app_id,provider,status,customer_id,subscription_id,price_id,current_period_start,current_period_end,cancel_at_period_end,created_at,updated_at",
        )
        .order("updated_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setRows((data ?? []) as SubscriptionRow[]);
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Failed to load subscriptions.",
      );
      setRows([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRows(false);
  }, [loadRows]);

  useEffect(() => {
    if (!copyFlash) return;
    const t = window.setTimeout(() => setCopyFlash(""), 1200);
    return () => window.clearTimeout(t);
  }, [copyFlash]);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (statusFilter !== "all") {
        const rowStatus = String(row.status ?? "").toLowerCase();
        if (rowStatus !== statusFilter) return false;
      }

      if (expiryFilter === "expiring_7d" && !isExpiringSoon(row, 7)) {
        return false;
      }

      if (expiryFilter === "expiring_30d" && !isExpiringSoon(row, 30)) {
        return false;
      }

      if (expiryFilter === "expired" && !isExpired(row)) {
        return false;
      }

      if (!q) return true;

      const haystack = [
        row.user_id,
        row.app_id,
        row.provider,
        row.status,
        row.customer_id,
        row.subscription_id,
        row.price_id,
      ]
        .map((v) => String(v ?? "").toLowerCase())
        .join(" ");

      return haystack.includes(q);
    });
  }, [rows, query, statusFilter, expiryFilter]);

  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter(
      (r) => String(r.status ?? "").toLowerCase() === "active",
    ).length;
    const trialing = rows.filter(
      (r) => String(r.status ?? "").toLowerCase() === "trialing",
    ).length;
    const pastDue = rows.filter(
      (r) => String(r.status ?? "").toLowerCase() === "past_due",
    ).length;
    const canceled = rows.filter((r) => {
      const s = String(r.status ?? "").toLowerCase();
      return s === "canceled" || s === "cancelled";
    }).length;
    const expiringSoon = rows.filter((r) => isExpiringSoon(r, 7)).length;

    return { total, active, trialing, pastDue, canceled, expiringSoon };
  }, [rows]);

  async function handleCancelAtPeriodEnd(subscriptionId: string) {
    const confirmed = window.confirm("Cancel this subscription at period end?");
    if (!confirmed) return;

    try {
      setLoadingAction(`cancel:${subscriptionId}`);
      await adminCancelSubscription(subscriptionId, false);
      await loadRows(true);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to schedule cancellation",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleCancelNow(subscriptionId: string) {
    const confirmed = window.confirm(
      "Cancel this subscription immediately? Paid access will end now.",
    );
    if (!confirmed) return;

    try {
      setLoadingAction(`cancel-now:${subscriptionId}`);
      await adminCancelSubscription(subscriptionId, true);
      await loadRows(true);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to cancel immediately",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handlePortal(customerId: string) {
    try {
      setLoadingAction(`portal:${customerId}`);
      await adminOpenPortal(customerId);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to open portal");
    } finally {
      setLoadingAction(null);
    }
  }

  const wrap: React.CSSProperties = {
    width: "100%",
    minHeight: "100%",
  };

  const stack: React.CSSProperties = {
    display: "grid",
    gap: 16,
  };

  const card: React.CSSProperties = {
    border: "1px solid rgba(15,23,42,0.08)",
    borderRadius: 18,
    background: "#fff",
    padding: 18,
    boxShadow: "0 8px 24px rgba(15,23,42,0.05)",
  };

  const title: React.CSSProperties = {
    margin: 0,
    fontSize: 30,
    lineHeight: 1.08,
    fontWeight: 950,
    color: "#111827",
  };

  const sub: React.CSSProperties = {
    margin: "10px 0 0",
    color: "#475569",
    lineHeight: 1.7,
    fontSize: 14,
  };

  const controls: React.CSSProperties = {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
  };

  const input: React.CSSProperties = {
    minHeight: 44,
    minWidth: 280,
    flex: "1 1 280px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    padding: "10px 12px",
    fontSize: 14,
    outline: "none",
    background: "#fff",
    color: "#111827",
  };

  const select: React.CSSProperties = {
    minHeight: 44,
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    padding: "10px 12px",
    fontSize: 14,
    background: "#fff",
    color: "#111827",
  };

  const button: React.CSSProperties = {
    minHeight: 44,
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#0f172a",
    color: "#fff",
    fontWeight: 900,
    padding: "10px 14px",
    cursor: "pointer",
  };

  const copyButton: React.CSSProperties = {
    minHeight: 28,
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#fff",
    color: "#111827",
    fontWeight: 800,
    fontSize: 12,
    padding: "4px 8px",
    cursor: "pointer",
    marginTop: 6,
  };

  const actionButtonBase: React.CSSProperties = {
    minHeight: 32,
    borderRadius: 10,
    border: "1px solid rgba(15,23,42,0.12)",
    background: "#fff",
    color: "#111827",
    fontWeight: 800,
    fontSize: 12,
    padding: "6px 10px",
    cursor: "pointer",
  };

  const portalButtonStyle: React.CSSProperties = {
    ...actionButtonBase,
  };

  const cancelButtonStyle: React.CSSProperties = {
    ...actionButtonBase,
    border: "1px solid rgba(239,68,68,0.18)",
    color: "#991b1b",
    background: "rgba(254,242,242,0.9)",
  };

  const cancelNowButtonStyle: React.CSSProperties = {
    ...actionButtonBase,
    border: "1px solid rgba(239,68,68,0.24)",
    color: "#991b1b",
    background: "rgba(239,68,68,0.10)",
  };

  const disabledActionButtonStyle: React.CSSProperties = {
    opacity: 0.55,
    cursor: "not-allowed",
  };

  const statGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  };

  const statCard: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
    background: "linear-gradient(180deg,#f8fafc 0%, #ffffff 100%)",
    padding: 14,
  };

  const tableWrap: React.CSSProperties = {
    overflowX: "auto",
    borderRadius: 16,
    border: "1px solid rgba(15,23,42,0.08)",
  };

  const table: React.CSSProperties = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    minWidth: 1440,
    background: "#fff",
  };

  const th: React.CSSProperties = {
    textAlign: "left",
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: "uppercase",
    color: "#64748b",
    background: "#f8fafc",
    padding: "12px 14px",
    borderBottom: "1px solid rgba(15,23,42,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1,
  };

  const td: React.CSSProperties = {
    padding: "12px 14px",
    borderBottom: "1px solid rgba(15,23,42,0.06)",
    verticalAlign: "top",
    color: "#0f172a",
    fontSize: 14,
    lineHeight: 1.5,
  };

  const mono: React.CSSProperties = {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 12,
    color: "#334155",
    wordBreak: "break-all",
  };

  return (
    <div style={wrap}>
      <div style={stack}>
        <div style={card}>
          <h1 style={title}>Admin Subscriptions</h1>
          <p style={sub}>
            Canonical Stripe subscription view from{" "}
            <code>public.subscriptions</code>. Use this page to verify active
            access, plan changes, expiry dates, cancellation state, and
            subscriptions that are expiring soon.
          </p>
          {copyFlash ? (
            <div
              style={{
                marginTop: 10,
                fontSize: 13,
                fontWeight: 800,
                color: "#065f46",
              }}
            >
              Copied: {copyFlash}
            </div>
          ) : null}
        </div>

        <div style={statGrid}>
          <div style={statCard}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
              Total
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 28,
                fontWeight: 950,
                color: "#111827",
              }}
            >
              {loading ? "…" : stats.total}
            </div>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
              Active
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 28,
                fontWeight: 950,
                color: "#065f46",
              }}
            >
              {loading ? "…" : stats.active}
            </div>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
              Trialing
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 28,
                fontWeight: 950,
                color: "#1d4ed8",
              }}
            >
              {loading ? "…" : stats.trialing}
            </div>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
              Past due
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 28,
                fontWeight: 950,
                color: "#92400e",
              }}
            >
              {loading ? "…" : stats.pastDue}
            </div>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
              Expiring in 7d
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 28,
                fontWeight: 950,
                color: "#b45309",
              }}
            >
              {loading ? "…" : stats.expiringSoon}
            </div>
          </div>

          <div style={statCard}>
            <div style={{ fontSize: 12, color: "#64748b", fontWeight: 800 }}>
              Canceled
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 28,
                fontWeight: 950,
                color: "#475569",
              }}
            >
              {loading ? "…" : stats.canceled}
            </div>
          </div>
        </div>

        <div style={card}>
          <div style={controls}>
            <input
              style={input}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by user_id, subscription_id, customer_id, price_id, app_id..."
            />

            <select
              style={select}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past due</option>
              <option value="canceled">Canceled</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              style={select}
              value={expiryFilter}
              onChange={(e) => setExpiryFilter(e.target.value as ExpiryFilter)}
            >
              <option value="all">All expiry</option>
              <option value="expiring_7d">Expiring in 7 days</option>
              <option value="expiring_30d">Expiring in 30 days</option>
              <option value="expired">Expired</option>
            </select>

            <button
              type="button"
              style={button}
              onClick={() => void loadRows(true)}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {errorText ? (
            <div
              style={{
                marginTop: 14,
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(239,68,68,0.20)",
                background: "rgba(254,242,242,0.95)",
                color: "#991b1b",
                fontWeight: 700,
              }}
            >
              {errorText}
            </div>
          ) : null}
        </div>

        <div style={card}>
          <div
            style={{
              marginBottom: 12,
              color: "#475569",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            {loading
              ? "Loading subscriptions..."
              : `${filteredRows.length} row(s)`}
          </div>

          <div style={tableWrap}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>Status</th>
                  <th style={th}>Plan</th>
                  <th style={th}>User</th>
                  <th style={th}>Subscription</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Actions</th>
                  <th style={th}>App</th>
                  <th style={th}>Provider</th>
                  <th style={th}>Period start</th>
                  <th style={th}>Period end</th>
                  <th style={th}>Expires</th>
                  <th style={th}>Cancel at period end</th>
                  <th style={th}>Updated</th>
                </tr>
              </thead>

              <tbody>
                {!loading && filteredRows.length === 0 ? (
                  <tr>
                    <td style={td} colSpan={13}>
                      No subscriptions found.
                    </td>
                  </tr>
                ) : null}

                {filteredRows.map((row) => {
                  const tone = statusTone(row.status);
                  const expiringSoon7d = isExpiringSoon(row, 7);
                  const expired = isExpired(row);

                  const portalActionKey = `portal:${row.customer_id ?? ""}`;
                  const cancelActionKey = `cancel:${row.subscription_id ?? ""}`;
                  const cancelNowActionKey = `cancel-now:${row.subscription_id ?? ""}`;

                  const portalLoading = loadingAction === portalActionKey;
                  const cancelLoading = loadingAction === cancelActionKey;
                  const cancelNowLoading = loadingAction === cancelNowActionKey;

                  const isCanceledStatus =
                    String(row.status ?? "").toLowerCase() === "canceled" ||
                    String(row.status ?? "").toLowerCase() === "cancelled";

                  const cancelDisabled =
                    !row.subscription_id ||
                    isCanceledStatus ||
                    Boolean(row.cancel_at_period_end) ||
                    cancelLoading;

                  const cancelNowDisabled =
                    !row.subscription_id ||
                    isCanceledStatus ||
                    cancelNowLoading;

                  const portalDisabled = !row.customer_id || portalLoading;

                  return (
                    <tr
                      key={row.id}
                      style={{
                        background: expired
                          ? "rgba(254,242,242,0.55)"
                          : expiringSoon7d
                            ? "rgba(255,251,235,0.75)"
                            : "#fff",
                      }}
                    >
                      <td style={td}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            minHeight: 28,
                            padding: "5px 10px",
                            borderRadius: 999,
                            border: `1px solid ${tone.border}`,
                            background: tone.bg,
                            color: tone.fg,
                            fontWeight: 900,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {statusLabel(row.status)}
                        </span>
                      </td>

                      <td style={td}>
                        <div style={{ fontWeight: 800 }}>
                          {priceLabel(row.price_id)}
                        </div>
                        <div style={mono}>{row.price_id || "—"}</div>
                        {row.price_id ? (
                          <button
                            type="button"
                            style={copyButton}
                            onClick={async () => {
                              await copyText(row.price_id || "");
                              setCopyFlash("price_id");
                            }}
                          >
                            Copy price_id
                          </button>
                        ) : null}
                      </td>

                      <td style={td}>
                        <div style={mono}>{row.user_id || "—"}</div>
                        {row.user_id ? (
                          <button
                            type="button"
                            style={copyButton}
                            onClick={async () => {
                              await copyText(row.user_id || "");
                              setCopyFlash("user_id");
                            }}
                          >
                            Copy user_id
                          </button>
                        ) : null}
                      </td>

                      <td style={td}>
                        <div style={mono}>{row.subscription_id || "—"}</div>
                        {row.subscription_id ? (
                          <button
                            type="button"
                            style={copyButton}
                            onClick={async () => {
                              await copyText(row.subscription_id || "");
                              setCopyFlash("subscription_id");
                            }}
                          >
                            Copy subscription_id
                          </button>
                        ) : null}
                      </td>

                      <td style={td}>
                        <div style={mono}>{row.customer_id || "—"}</div>
                        {row.customer_id ? (
                          <button
                            type="button"
                            style={copyButton}
                            onClick={async () => {
                              await copyText(row.customer_id || "");
                              setCopyFlash("customer_id");
                            }}
                          >
                            Copy customer_id
                          </button>
                        ) : null}
                      </td>

                      <td style={td}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                            minWidth: 132,
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              if (row.customer_id) {
                                void handlePortal(row.customer_id);
                              }
                            }}
                            disabled={portalDisabled}
                            style={{
                              ...portalButtonStyle,
                              ...(portalDisabled
                                ? disabledActionButtonStyle
                                : {}),
                            }}
                          >
                            {portalLoading ? "Opening..." : "Portal"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (row.subscription_id) {
                                void handleCancelAtPeriodEnd(
                                  row.subscription_id,
                                );
                              }
                            }}
                            disabled={cancelDisabled}
                            style={{
                              ...cancelButtonStyle,
                              ...(cancelDisabled
                                ? disabledActionButtonStyle
                                : {}),
                            }}
                          >
                            {row.cancel_at_period_end
                              ? "Cancel Scheduled"
                              : cancelLoading
                                ? "Scheduling..."
                                : "Cancel End"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (row.subscription_id) {
                                void handleCancelNow(row.subscription_id);
                              }
                            }}
                            disabled={cancelNowDisabled}
                            style={{
                              ...cancelNowButtonStyle,
                              ...(cancelNowDisabled
                                ? disabledActionButtonStyle
                                : {}),
                            }}
                          >
                            {cancelNowLoading ? "Cancelling..." : "Cancel Now"}
                          </button>
                        </div>
                      </td>

                      <td style={td}>{row.app_id || "—"}</td>
                      <td style={td}>{row.provider || "—"}</td>
                      <td style={td}>
                        {formatDateTime(row.current_period_start)}
                      </td>
                      <td style={td}>{formatDateTime(row.current_period_end)}</td>

                      <td style={td}>
                        <div>{formatDateTime(getExpiresValue(row))}</div>
                        {expired ? (
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              fontWeight: 800,
                              color: "#991b1b",
                            }}
                          >
                            Expired
                          </div>
                        ) : expiringSoon7d ? (
                          <div
                            style={{
                              marginTop: 6,
                              fontSize: 12,
                              fontWeight: 800,
                              color: "#92400e",
                            }}
                          >
                            Expiring soon
                          </div>
                        ) : null}
                      </td>

                      <td style={td}>
                        <b>{row.cancel_at_period_end ? "Yes" : "No"}</b>
                      </td>

                      <td style={td}>{formatDateTime(row.updated_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}