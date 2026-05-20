import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";

interface ReportResponse {
  ok: boolean;
  error?: string;
  runs?: DbRun[];
  scores?: DbScore[];
  alerts?: DbAlert[];
  providerVariance?: DbProviderVariance[];
  summary?: {
    scoreCount: number;
    replaySuccessRate: number;
    malformedRate: number;
    p95GradingLatencyMs: number;
    criticalAlertCount: number;
    byModality: Record<string, Bucket>;
    byCefr: Record<string, Bucket>;
    byProvider: Record<string, Bucket>;
    retryVariance: Record<string, number>;
    taxonomy: Record<string, { count: number; malformedRate: number }>;
  };
}

interface Bucket {
  count: number;
  successRate: number;
  malformedRate: number;
  p95LatencyMs: number;
}

interface DbRun {
  id: string;
  batch_id: string;
  started_at: string;
  completed_at: string | null;
  status: string;
  sample_count: number;
  success_count: number;
  malformed_count: number;
  p95_latency_ms: number;
}

interface DbScore {
  sample_id: string;
  modality: string;
  expected_cefr: string;
  parsed_cefr: string | null;
  provider: string;
  model: string | null;
  retry_path: string[];
  taxonomy_tags: string[];
  latency_ms: number;
  status: string;
  malformed: boolean;
  created_at: string;
}

interface DbAlert {
  id: number;
  severity: string;
  scope: string;
  metric: string;
  value: number;
  threshold: number;
  sample_ids: string[];
  message: string;
  created_at: string;
}

interface DbProviderVariance {
  provider: string;
  sample_count: number;
  success_rate: number;
  malformed_rate: number;
  average_expected_delta: number;
  p95_latency_ms: number;
}

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  padding: "24px 24px 80px",
  background: "#f6f7f9",
};
const container: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.1)",
  borderRadius: 8,
  padding: 16,
};
const grid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
};
const label: React.CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
};
const value: React.CSSProperties = {
  color: "#111827",
  fontSize: 24,
  fontWeight: 900,
  marginTop: 4,
};

export default function PlacementDriftDashboard() {
  const admin = useAdminAccess();
  const level = admin.permissions.level;
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin.loading || level < 9) return;
    let alive = true;
    setLoading(true);
    setError(null);

    void (async () => {
      try {
        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;
        const baseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/$/, "");
        const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "");
        const response = await fetch(`${baseUrl}/functions/v1/placement-v3-drift-report`, {
          headers: {
            apikey: anonKey,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const body = (await response.json()) as ReportResponse;
        if (!response.ok || !body.ok) {
          throw new Error(body.error ?? `Drift report failed: ${response.status}`);
        }
        if (alive) setReport(body);
      } catch (err) {
        if (alive) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [admin.loading, level]);

  const summary = report?.summary;
  const latestRuns = report?.runs ?? [];
  const alerts = report?.alerts ?? [];
  const scores = report?.scores ?? [];
  const providerVariance = report?.providerVariance ?? [];

  const modalityChart = useMemo(
    () => bucketChart(summary?.byModality ?? {}, "modality"),
    [summary],
  );
  const cefrChart = useMemo(() => bucketChart(summary?.byCefr ?? {}, "cefr"), [summary]);
  const retryChart = useMemo(
    () => Object.entries(summary?.retryVariance ?? {}).map(([name, count]) => ({ name, count })),
    [summary],
  );
  const taxonomyRows = useMemo(
    () =>
      Object.entries(summary?.taxonomy ?? {})
        .map(([tag, row]) => ({ tag, ...row }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 16),
    [summary],
  );

  if (admin.loading || loading) return <div style={wrap}>Loading placement drift data...</div>;
  if (level < 9) return <div style={wrap}>Admin level 9 required.</div>;

  return (
    <div style={wrap} data-testid="placement-drift-dashboard">
      <div style={container}>
        <header>
          <h1 style={{ margin: 0, fontSize: 28 }}>Placement V3 Grading Drift</h1>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>
            Replay stability, CEFR drift, provider variance, retry paths, and Vietnamese-L1 taxonomy risk.
          </p>
        </header>

        {error ? <div style={{ ...card, borderColor: "#ef4444" }}>{error}</div> : null}

        <section style={grid} data-testid="drift-kpis">
          <Kpi title="Replay success" value={`${(((summary?.replaySuccessRate ?? 0) * 100)).toFixed(1)}%`} />
          <Kpi title="Malformed output" value={`${(((summary?.malformedRate ?? 0) * 100)).toFixed(1)}%`} />
          <Kpi title="P95 latency" value={`${summary?.p95GradingLatencyMs ?? 0} ms`} />
          <Kpi title="Scores" value={String(summary?.scoreCount ?? 0)} />
          <Kpi title="Critical alerts" value={String(summary?.criticalAlertCount ?? 0)} />
          <Kpi title="Runs" value={String(latestRuns.length)} />
        </section>

        <section style={grid}>
          <ChartCard title="Score Drift by Modality" data={modalityChart} data-testid="drift-modality-chart" />
          <ChartCard title="CEFR Instability" data={cefrChart} data-testid="drift-cefr-chart" />
        </section>

        <section style={grid}>
          <div style={card} data-testid="provider-variance">
            <h2 style={{ marginTop: 0 }}>Provider Variance</h2>
            <Table>
              <thead>
                <tr>
                  <Th>Provider</Th>
                  <Th>Samples</Th>
                  <Th>Success</Th>
                  <Th>Malformed</Th>
                  <Th>Avg delta</Th>
                  <Th>P95</Th>
                </tr>
              </thead>
              <tbody>
                {providerVariance.map((row) => (
                  <tr key={`${row.provider}:${row.sample_count}`}>
                    <Td>{row.provider}</Td>
                    <Td>{row.sample_count}</Td>
                    <Td>{percent(row.success_rate)}</Td>
                    <Td>{percent(row.malformed_rate)}</Td>
                    <Td>{Number(row.average_expected_delta ?? 0).toFixed(2)}</Td>
                    <Td>{row.p95_latency_ms} ms</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div style={card} data-testid="retry-variance">
            <h2 style={{ marginTop: 0 }}>Retry Variance</h2>
            <div style={{ height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={retryChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section style={card} data-testid="taxonomy-instability">
          <h2 style={{ marginTop: 0 }}>Taxonomy-Category Instability</h2>
          <Table>
            <thead>
              <tr>
                <Th>Taxonomy tag</Th>
                <Th>Samples</Th>
                <Th>Malformed</Th>
              </tr>
            </thead>
            <tbody>
              {taxonomyRows.map((row) => (
                <tr key={row.tag}>
                  <Td>{row.tag}</Td>
                  <Td>{row.count}</Td>
                  <Td>{percent(row.malformedRate)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </section>

        <section style={grid}>
          <div style={card} data-testid="drift-alerts">
            <h2 style={{ marginTop: 0 }}>Drift Alerts</h2>
            {alerts.length === 0 ? (
              <p style={{ color: "#475569" }}>No drift alerts in the selected window.</p>
            ) : (
              alerts.slice(0, 12).map((alert) => (
                <div key={alert.id} style={{ padding: "10px 0", borderTop: "1px solid #e2e8f0" }}>
                  <strong>{alert.severity.toUpperCase()} · {alert.metric}</strong>
                  <div style={{ color: "#475569", fontSize: 13 }}>{alert.message}</div>
                </div>
              ))
            )}
          </div>

          <div style={card} data-testid="unstable-samples">
            <h2 style={{ marginTop: 0 }}>Latest Replay Scores</h2>
            {scores.slice(0, 12).map((score) => (
              <div key={`${score.sample_id}:${score.created_at}`} style={{ padding: "10px 0", borderTop: "1px solid #e2e8f0" }}>
                <strong>{score.sample_id}</strong>
                <div style={{ color: "#475569", fontSize: 13 }}>
                  {score.modality} · {score.expected_cefr} → {score.parsed_cefr ?? "malformed"} · {score.provider} · {score.latency_ms} ms
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Kpi({ title, value: text }: { title: string; value: string }) {
  return (
    <div style={card}>
      <div style={label}>{title}</div>
      <div style={value}>{text}</div>
    </div>
  );
}

function ChartCard({
  title,
  data,
  ...rest
}: { title: string; data: Array<Record<string, unknown>> } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={card} {...rest}>
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div style={{ height: 260 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#0f766e" />
            <Bar dataKey="malformed" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Table({ children }: { children: React.ReactNode }) {
  return <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>;
}

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #cbd5e1" }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: 10, borderBottom: "1px solid #e2e8f0" }}>{children}</td>;
}

function bucketChart(buckets: Record<string, Bucket>, _kind: string) {
  return Object.entries(buckets).map(([name, bucket]) => ({
    name,
    count: bucket.count,
    malformed: Math.round(bucket.malformedRate * bucket.count),
    p95LatencyMs: bucket.p95LatencyMs,
  }));
}

function percent(value: number): string {
  return `${(Number(value ?? 0) * 100).toFixed(1)}%`;
}
