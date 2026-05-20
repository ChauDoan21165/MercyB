import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Activity, BarChart3, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";

type EnduranceRunRow = {
  run_id: string;
  branch: string | null;
  mode: string;
  started_at: string;
  completed_at: string | null;
  total_iterations: number;
  passed_iterations: number;
  failed_iterations: number;
  metadata: Record<string, unknown> | null;
};

type EnduranceMetricRow = {
  run_id: string;
  iteration: number;
  scenario: string;
  duration_ms: number;
  heap_used_mb: number | null;
  retries: number;
  fallbacks: number;
  timeouts: number;
  completion_state: string | null;
};

type EnduranceFailureRow = {
  run_id: string;
  category: string;
  severity: string;
  signature: string;
  message: string | null;
  created_at: string;
};

type IntegrityViolationRow = {
  run_id: string | null;
  violation_type: string;
  severity: string;
  message: string;
  created_at: string;
};

function avg(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function fmtDate(value: string | null): string {
  if (!value) return "running";
  return new Date(value).toLocaleString("en-CA");
}

export default function PlacementEnduranceDashboard() {
  const [runs, setRuns] = useState<EnduranceRunRow[]>([]);
  const [metrics, setMetrics] = useState<EnduranceMetricRow[]>([]);
  const [failures, setFailures] = useState<EnduranceFailureRow[]>([]);
  const [violations, setViolations] = useState<IntegrityViolationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const [runRes, metricRes, failureRes, violationRes] = await Promise.all([
        supabase
          .from("placement_v3_endurance_runs")
          .select("run_id,branch,mode,started_at,completed_at,total_iterations,passed_iterations,failed_iterations,metadata")
          .order("started_at", { ascending: false })
          .limit(20),
        supabase
          .from("placement_v3_endurance_metrics")
          .select("run_id,iteration,scenario,duration_ms,heap_used_mb,retries,fallbacks,timeouts,completion_state")
          .order("recorded_at", { ascending: false })
          .limit(500),
        supabase
          .from("placement_v3_endurance_failures")
          .select("run_id,category,severity,signature,message,created_at")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("placement_v3_integrity_violations")
          .select("run_id,violation_type,severity,message,created_at")
          .order("created_at", { ascending: false })
          .limit(100),
      ]);
      for (const response of [runRes, metricRes, failureRes, violationRes]) {
        if (response.error) throw response.error;
      }
      setRuns((runRes.data ?? []) as EnduranceRunRow[]);
      setMetrics((metricRes.data ?? []) as EnduranceMetricRow[]);
      setFailures((failureRes.data ?? []) as EnduranceFailureRow[]);
      setViolations((violationRes.data ?? []) as IntegrityViolationRow[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load endurance metrics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const summary = useMemo(() => {
    const durationValues = metrics.map((m) => m.duration_ms).filter(Number.isFinite);
    const heapValues = metrics
      .map((m) => typeof m.heap_used_mb === "number" ? m.heap_used_mb : null)
      .filter((value): value is number => typeof value === "number");
    return {
      totalRuns: runs.reduce((sum, run) => sum + run.total_iterations, 0),
      passRate: runs.reduce((sum, run) => sum + run.passed_iterations, 0),
      avgLatency: avg(durationValues),
      heapDelta: heapValues.length > 1
        ? Math.round((heapValues[0] - heapValues[heapValues.length - 1]) * 100) / 100
        : 0,
      retries: metrics.reduce((sum, metric) => sum + metric.retries, 0),
      fallbacks: metrics.reduce((sum, metric) => sum + metric.fallbacks, 0),
      timeouts: metrics.reduce((sum, metric) => sum + metric.timeouts, 0),
    };
  }, [runs, metrics]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">Placement v3 Endurance</h1>
            <p className="text-sm font-medium text-slate-500">
              Long-run placement stability, latency, memory, retry, fallback, and integrity metrics.
            </p>
          </div>
          <Button type="button" variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
            Refresh
          </Button>
        </div>

        {error ? (
          <div role="alert" className="mt-4 rounded border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">
            {error}
          </div>
        ) : null}

        <section className="mt-5 grid gap-3 md:grid-cols-4">
          <Stat icon={Activity} label="Executions" value={String(summary.totalRuns)} />
          <Stat icon={BarChart3} label="Avg latency" value={`${summary.avgLatency} ms`} />
          <Stat icon={Database} label="Heap delta" value={`${summary.heapDelta} MB`} />
          <Stat icon={AlertTriangle} label="Retries / fallbacks" value={`${summary.retries} / ${summary.fallbacks}`} />
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Panel title="Run History">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Run</th>
                    <th>Mode</th>
                    <th>Started</th>
                    <th>Done</th>
                    <th>Pass</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.map((run) => (
                    <tr key={run.run_id} className="border-t border-slate-100">
                      <td className="py-2 font-mono text-xs">{run.run_id}</td>
                      <td>{run.mode}</td>
                      <td>{fmtDate(run.started_at)}</td>
                      <td>{fmtDate(run.completed_at)}</td>
                      <td>{run.passed_iterations}/{run.total_iterations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Failure Clusters">
            <div className="space-y-3">
              {failures.length === 0 ? <Empty label="No failures recorded." /> : null}
              {failures.slice(0, 12).map((failure) => (
                <div key={`${failure.run_id}-${failure.signature}-${failure.created_at}`} className="rounded border border-slate-100 p-3">
                  <div className="flex justify-between gap-3 text-sm font-bold">
                    <span>{failure.category}</span>
                    <span className="text-xs uppercase text-slate-500">{failure.severity}</span>
                  </div>
                  <div className="mt-1 font-mono text-xs text-slate-500">{failure.signature}</div>
                  {failure.message ? <div className="mt-1 text-sm text-slate-600">{failure.message}</div> : null}
                </div>
              ))}
            </div>
          </Panel>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          <Panel title="Recent Latency / Memory">
            <div className="space-y-2">
              {metrics.slice(0, 30).map((metric) => (
                <div key={`${metric.run_id}-${metric.iteration}`} className="grid grid-cols-[72px_1fr_80px_80px] gap-2 text-sm">
                  <span className="font-mono text-xs">#{metric.iteration}</span>
                  <span>{metric.scenario}</span>
                  <span>{metric.duration_ms} ms</span>
                  <span>{metric.heap_used_mb ?? "-"} MB</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Integrity Violations">
            <div className="space-y-3">
              {violations.length === 0 ? <Empty label="No integrity violations recorded." /> : null}
              {violations.slice(0, 15).map((violation) => (
                <div key={`${violation.violation_type}-${violation.created_at}`} className="rounded border border-slate-100 p-3">
                  <div className="flex justify-between gap-3 text-sm font-bold">
                    <span>{violation.violation_type}</span>
                    <span className="text-xs uppercase text-slate-500">{violation.severity}</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{violation.message}</div>
                </div>
              ))}
            </div>
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Stat(props: { icon: typeof Activity; label: string; value: string }) {
  const Icon = props.icon;
  return (
    <div className="rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500">
        <Icon className="h-4 w-4" aria-hidden />
        {props.label}
      </div>
      <div className="mt-2 text-2xl font-black">{props.value}</div>
    </div>
  );
}

function Panel(props: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4">
      <h2 className="text-base font-black">{props.title}</h2>
      <div className="mt-3">{props.children}</div>
    </section>
  );
}

function Empty(props: { label: string }) {
  return <div className="rounded bg-slate-50 p-3 text-sm font-medium text-slate-500">{props.label}</div>;
}
