// PATH: src/components/admin/users/AdminUsersFilters.tsx

import React from "react";
import type { AdminUsersFiltersState } from "@/types/adminUsers";

type Props = {
  filters: AdminUsersFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<AdminUsersFiltersState>>;
  environmentOptions: string[];
  statusOptions: string[];
  planOptions: string[];
};

export default function AdminUsersFilters({
  filters,
  setFilters,
  environmentOptions,
  statusOptions,
  planOptions,
}: Props) {
  const filtersCard: React.CSSProperties = {
    marginTop: 18,
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.92)",
    padding: "16px 16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  };

  const filtersGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "2fr repeat(5, minmax(130px, 1fr))",
    gap: 10,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.5,
    color: "rgba(0,0,0,0.45)",
    marginBottom: 6,
    textTransform: "uppercase",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(0,0,0,0.12)",
    background: "rgba(255,255,255,0.96)",
    padding: "12px 12px",
    fontSize: 14,
    color: "rgba(0,0,0,0.82)",
    outline: "none",
  };

  const chipRow: React.CSSProperties = {
    marginTop: 12,
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  };

  const chip = (active: boolean): React.CSSProperties => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 9999,
    border: active
      ? "1px solid rgba(16,185,129,0.28)"
      : "1px solid rgba(0,0,0,0.10)",
    background: active
      ? "rgba(236,253,245,0.94)"
      : "rgba(255,255,255,0.92)",
    color: active ? "rgba(6,95,70,0.92)" : "rgba(0,0,0,0.72)",
    fontWeight: 900,
    fontSize: 13,
    cursor: "pointer",
  });

  const set = (patch: Partial<AdminUsersFiltersState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div style={filtersCard}>
      <div style={filtersGrid}>
        <div>
          <div style={labelStyle}>Search</div>
          <input
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search by email, plan, status, user id…"
            style={inputStyle}
          />
        </div>

        <div>
          <div style={labelStyle}>Environment</div>
          <select
            value={filters.environment}
            onChange={(e) => set({ environment: e.target.value })}
            style={inputStyle}
          >
            {environmentOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All" : option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={labelStyle}>Status</div>
          <select
            value={filters.status}
            onChange={(e) => set({ status: e.target.value })}
            style={inputStyle}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All" : option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={labelStyle}>Plan</div>
          <select
            value={filters.plan}
            onChange={(e) => set({ plan: e.target.value })}
            style={inputStyle}
          >
            {planOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "All" : option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div style={labelStyle}>Admin</div>
          <select
            value={filters.admin}
            onChange={(e) => set({ admin: e.target.value })}
            style={inputStyle}
          >
            <option value="all">All</option>
            <option value="admin">Admins only</option>
            <option value="non_admin">Non-admins</option>
          </select>
        </div>

        <div>
          <div style={labelStyle}>Sort</div>
          <select
            value={filters.sort}
            onChange={(e) => set({ sort: e.target.value })}
            style={inputStyle}
          >
            <option value="created_desc">Newest first</option>
            <option value="created_asc">Oldest first</option>
            <option value="email_asc">Email A → Z</option>
            <option value="email_desc">Email Z → A</option>
            <option value="plan_asc">Plan</option>
            <option value="status_asc">Status</option>
            <option value="period_desc">Period end</option>
            <option value="amount_desc">Highest amount</option>
          </select>
        </div>
      </div>

      <div style={chipRow}>
        <button type="button" style={chip(filters.status === "active")} onClick={() => set({ status: "active" })}>
          Active
        </button>
        <button type="button" style={chip(filters.status === "trialing")} onClick={() => set({ status: "trialing" })}>
          Trialing
        </button>
        <button type="button" style={chip(filters.plan === "month")} onClick={() => set({ plan: "month" })}>
          Monthly
        </button>
        <button type="button" style={chip(filters.plan === "year")} onClick={() => set({ plan: "year" })}>
          Yearly
        </button>
        <button
          type="button"
          style={chip(
            filters.search === "canceling_soon" &&
              filters.environment === "production",
          )}
          onClick={() =>
            set({
              search: "canceling_soon",
              environment: "production",
            })
          }
        >
          Canceling soon
        </button>
        <button
          type="button"
          style={chip(false)}
          onClick={() =>
            set({
              search: "",
              environment: "production",
              status: "all",
              plan: "all",
              admin: "all",
              sort: "created_desc",
            })
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}