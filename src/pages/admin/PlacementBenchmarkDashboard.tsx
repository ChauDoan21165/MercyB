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
import { aggregateBenchmarkRuns } from "@/lib/placementBenchmark/aggregateMetrics";
import { findWorstLatencySteps } from "@/lib/placementBenchmark/latencyAnalyzer";
import { analyzeProviderUsage } from "@/lib/placementBenchmark/providerAnalysis";
import { detectBenchmarkRegressions } from "@/lib/placementBenchmark/regressionDetector";
import type { BenchmarkRunMetric, BenchmarkStepMetric } from "@/lib/placementBenchmark/types";
import { supabase } from "@/lib/supabaseClient";

interface ReportResponse {
  ok: boolean;
  error?: string;
  runs?: DbRun[];
  steps?: DbStep[];
}

interface DbRun {
  id: string;
  suite_id: string;
  scenario_id: string;
  started_at: string;
  completed_at: string;
  status: string;
  total_duration_ms: number;
  total_tokens_input: number;
  total_tokens_output: number;
  estimated_cost_usd: number;
}

interface DbStep {
  run_id: string;
  scenario_id: string;
  step_id: string;
  modality: string;
  provider: string;
  model: string | null;
  started_at: string;
  completed_at: string;
  duration_ms: number;
  status: string;
  tokens_input: number;
  tokens_output: number;
  estimated_cost_usd: number;
  attempts: string[];
  failover: boolean;
  error_code: string | null;
  error_message: string | null;
  cefr_estimate: string | null;
}

const wrap: React.CSSProperties = {
  width: "100%",
  minHeight: "100vh",
  padding: "24px 24px 80px",
  background: "#f8fafc",
};
const container: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: 18,
};
const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.08)",
  borderRadius: 8,
  padding: 18,
  boxShadow: "0 2px 8px rgba(15,23,42,0.03)",
};
const grid: React.CSSProperties = {
  display: "grid",
  gap: 12,
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
};
const label: React.CSSProperties = {
  color: "#64748b",
  fontSize: 12,
  fontWeight: 800,
  textTransform: "uppercase",
};
const value: React.CSSProperties = {
  color: "#0f172a",
  fontSize: 24,
  fontWeight: 900,
  marginTop: 4,
};

export default function PlacementBenchmarkDashboard() {
  const admin = useAdminAccess();
  const level = admin.permissions.level;
  const [runs, setRuns] = useState<BenchmarkRunMetric[]>([]);
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
        const response = await fetch(`${baseUrl}/functions/v1/placement-v3-benchmark-report`, {
          headers: {
            apikey: anonKey,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const body = (await response.json()) as ReportResponse;
        if (!response.ok || !body.ok) {
          throw new Error(body.error ?? `Report request failed: ${response.status}`);
        }
        if (alive) setRuns(mapDbRows(body.runs ?? [], body.steps ?? []));
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

  const steps = useMemo(() => runs.flatMap((run) => run.steps), [runs]);
  const metrics = useMemo(() => aggregateBenchmarkRuns(runs), [runs]);
  const provider = useMemo(() => analyzeProviderUsage(steps), [steps]);
  const worst = useMemo(() => findWorstLatencySteps(steps, 8), [steps]);
  const regressions = useMemo(() => {
    const sorted = [...runs].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    const midpoint = Math.floor(sorted.length / 2);
    if (midpoint < 2) return [];
    return detectBenchmarkRegressions({
      baseline: sorted.slice(0, midpoint),
      current: sorted.slice(midpoint),
    });
  }, [runs]);

  if (admin.loading || loading) return <div style={wrap}>Loading placement benchmark data...</div>;
  if (level < 9) return <div style={wrap}>Admin level 9 required.</div>;

  return (
    <div style={wrap} data-testid="placement-benchmark-dashboard">
      <div style={container}>
        <header>
          <h1 style={{ margin: 0, fontSize: 28 }}>Placement V3 Benchmarks</h1>
          <p style={{ margin: "6px 0 0", color: "#475569" }}>
            Production-readiness latency, cost, provider routing, and regression data.
          </p>
        </header>

        {error ? <div style={{ ...card, borderColor: "#ef4444" }}>{error}</div> : null}

        <section style={grid} data-testid="benchmark-kpis">
          <Kpi title="P50 latency" value={`${metrics.p50LatencyMs} ms`} />
          <Kpi title="P95 latency" value={`${metrics.p95LatencyMs} ms`} />
          <Kpi title="Avg cost/session" value={`$${metrics.averageCostUsd.toFixed(4)}`} />
          <Kpi title="Failover rate" value={`${(provider.failoverRate * 100).toFixed(1)}%`} />
          <Kpi title="Runs" value={String(metrics.runCount)} />
          <Kpi title="Errors" value={`${(metrics.errorRate * 100).toFixed(1)}%`} />
        </section>

        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Provider Distribution</h2>
          <div style={{ height: 260 }} data-testid="provider-distribution-chart">
            <ResponsiveContainer>
              <BarChart data={Object.entries(provider.providerCounts).map(([name, count]) => ({ name, count }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f766e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section style={card}>
          <h2 style={{ marginTop: 0 }}>Token and Cost Trends</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <Th>Scenario</Th>
                  <Th>Started</Th>
                  <Th>Input tokens</Th>
                  <Th>Output tokens</Th>
                  <Th>Cost</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {runs.slice(0, 20).map((run) => (
                  <tr key={run.runId}>
                    <Td>{run.scenarioId}</Td>
                    <Td>{new Date(run.startedAt).toLocaleString()}</Td>
                    <Td>{run.totalTokensInput}</Td>
                    <Td>{run.totalTokensOutput}</Td>
                    <Td>${run.estimatedCostUsd.toFixed(4)}</Td>
                    <Td>{run.status}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={grid}>
          <div style={card}>
            <h2 style={{ marginTop: 0 }}>Worst Steps</h2>
            {worst.map((row) => (
              <div key={`${row.scenarioId}:${row.stepId}`} style={{ padding: "10px 0", borderTop: "1px solid #e2e8f0" }}>
                <strong>{row.stepId}</strong>
                <div style={{ color: "#475569", fontSize: 13 }}>
                  {row.scenarioId} · {row.modality} · {row.provider} · {row.durationMs} ms
                </div>
              </div>
            ))}
          </div>
          <div style={card} data-testid="benchmark-regression-warnings">
            <h2 style={{ marginTop: 0 }}>Regression Warnings</h2>
            {regressions.length === 0 ? (
              <p style={{ color: "#475569" }}>No regression warnings in the selected window.</p>
            ) : (
              regressions.map((warning) => (
                <div key={warning.metric} style={{ padding: "10px 0", borderTop: "1px solid #e2e8f0" }}>
                  <strong>{warning.metric}</strong>
                  <div style={{ color: "#475569", fontSize: 13 }}>
                    {warning.baseline} → {warning.current} ({warning.deltaPercent}%)
                  </div>
                </div>
              ))
            )}
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

function Th({ children }: { children: React.ReactNode }) {
  return <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #cbd5e1" }}>{children}</th>;
}

function Td({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: 10, borderBottom: "1px solid #e2e8f0" }}>{children}</td>;
}

function mapDbRows(dbRuns: DbRun[], dbSteps: DbStep[]): BenchmarkRunMetric[] {
  return dbRuns.map((run) => {
    const steps: BenchmarkStepMetric[] = dbSteps
      .filter((step) => step.run_id === run.id)
      .map((step) => ({
        runId: step.run_id,
        scenarioId: step.scenario_id,
        stepId: step.step_id,
        modality: step.modality as BenchmarkStepMetric["modality"],
        provider: step.provider as BenchmarkStepMetric["provider"],
        model: step.model,
        startedAt: step.started_at,
        completedAt: step.completed_at,
        durationMs: Number(step.duration_ms ?? 0),
        status: step.status as BenchmarkStepMetric["status"],
        tokensInput: Number(step.tokens_input ?? 0),
        tokensOutput: Number(step.tokens_output ?? 0),
        estimatedCostUsd: Number(step.estimated_cost_usd ?? 0),
        attempts: (step.attempts ?? []) as BenchmarkStepMetric["attempts"],
        failover: Boolean(step.failover),
        errorCode: step.error_code,
        errorMessage: step.error_message,
        cefrEstimate: step.cefr_estimate,
      }));
    return {
      runId: run.id,
      suiteId: run.suite_id,
      scenarioId: run.scenario_id,
      startedAt: run.started_at,
      completedAt: run.completed_at,
      status: run.status as BenchmarkRunMetric["status"],
      totalDurationMs: Number(run.total_duration_ms ?? 0),
      totalTokensInput: Number(run.total_tokens_input ?? 0),
      totalTokensOutput: Number(run.total_tokens_output ?? 0),
      estimatedCostUsd: Number(run.estimated_cost_usd ?? 0),
      steps,
    };
  });
}
