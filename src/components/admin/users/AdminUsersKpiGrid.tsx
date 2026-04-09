// PATH: src/components/admin/users/AdminUsersKpiGrid.tsx

import React from "react";
import type { AdminUsersKpis } from "@/types/adminUsers";

type Props = {
  kpis: AdminUsersKpis;
  formatMoney: (amount: number, currency?: string) => string;
};

function KpiCard({
  label,
  value,
  help,
}: {
  label: string;
  value: string | number;
  help?: string;
}) {
  const card: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(0,0,0,0.08)",
    background: "rgba(255,255,255,0.90)",
    padding: "16px 16px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.45)",
  };

  const valueStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 30,
    lineHeight: 1.05,
    fontWeight: 950,
    color: "rgba(0,0,0,0.88)",
    letterSpacing: -0.7,
  };

  const helpStyle: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 1.5,
    color: "rgba(0,0,0,0.60)",
  };

  return (
    <div style={card}>
      <div style={labelStyle}>{label}</div>
      <div style={valueStyle}>{value}</div>
      {help ? <div style={helpStyle}>{help}</div> : null}
    </div>
  );
}

export default function AdminUsersKpiGrid({ kpis, formatMoney }: Props) {
  const kpiGrid: React.CSSProperties = {
    marginTop: 18,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 12,
  };

  return (
    <div style={kpiGrid}>
      <KpiCard label="Production active" value={kpis.productionActiveCount} help="Real active paid production subscriptions." />
      <KpiCard label="Production trialing" value={kpis.productionTrialCount} help="Trials not yet converted." />
      <KpiCard label="Free users" value={kpis.freeUsersCount} help="Profiles without an active production subscription." />
      <KpiCard label="Monthly" value={kpis.monthlyCount} help="Production active subscriptions billed monthly." />
      <KpiCard label="Yearly" value={kpis.yearlyCount} help="Production active subscriptions billed yearly." />
      <KpiCard label="Canceling soon" value={kpis.cancelingSoonCount} help="Active production users with cancel_at_period_end." />
      <KpiCard label="Estimated MRR" value={formatMoney(kpis.estimatedMrr)} help="Yearly plans normalized to monthly." />
      <KpiCard label="Estimated ARR" value={formatMoney(kpis.estimatedArr)} help="Simple annualized recurring revenue." />
      <KpiCard label="Conversion" value={`${kpis.conversionPct.toFixed(0)}%`} help="Active ÷ (active + trialing)." />
      <KpiCard label="Churn risk" value={`${kpis.churnRiskPct.toFixed(0)}%`} help="Canceling soon ÷ active." />
      <KpiCard label="Missing profile" value={kpis.missingProfileCount} help="Subscriptions with no matching profile row." />
      <KpiCard label="Unknown email" value={kpis.unknownEmailCount} help="Rows still missing identity email." />
    </div>
  );
}