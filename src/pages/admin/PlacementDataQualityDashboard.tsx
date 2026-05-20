import React, { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, GitBranch, ListChecks, RefreshCw } from "lucide-react";

import { useAdminAccess } from "@/hooks/admin/useAdminAccess";
import { supabase } from "@/lib/supabaseClient";
import type {
  PlacementDataQualityDashboardIssue,
  PlacementDataQualityDashboardRun,
} from "@/types/placementDataQuality";

const card = "rounded-lg border border-slate-200 bg-white p-4 shadow-sm";
const stat = "text-2xl font-semibold text-slate-950";
const label = "text-xs font-medium uppercase tracking-wide text-slate-500";

type IssueBucket = {
  title: string;
  matcher: (issue: PlacementDataQualityDashboardIssue) => boolean;
};

const buckets: IssueBucket[] = [
  { title: "Taxonomy conflicts", matcher: (i) => i.audit_kind === "taxonomy_consistency" },
  { title: "Orphan recommendations", matcher: (i) => i.category.includes("recommendation") || i.category.includes("orphan") },
  { title: "Duplicate prompts", matcher: (i) => i.category.includes("duplicate_prompt") },
  { title: "CEFR inconsistencies", matcher: (i) => i.category.includes("cefr") || i.category.includes("level") },
  { title: "Unresolved integrity issues", matcher: (i) => !i.resolved_at },
];

export default function PlacementDataQualityDashboard() {
  const admin = useAdminAccess();
  const [runs, setRuns] = useState<PlacementDataQualityDashboardRun[]>([]);
  const [issues, setIssues] = useState<PlacementDataQualityDashboardIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [runsResp, issuesResp] = await Promise.all([
        supabase
          .from("placement_v3_integrity_runs")
          .select("id, run_id, status, started_at, finished_at, total_issues, blocker_count, error_count, warning_count, info_count")
          .order("started_at", { ascending: false })
          .limit(20),
        supabase
          .from("placement_v3_integrity_issues")
          .select("id, run_id, audit_kind, category, severity, file_path, message, resolved_at")
          .is("resolved_at", null)
          .order("created_at", { ascending: false })
          .limit(100),
      ]);
      if (runsResp.error) throw runsResp.error;
      if (issuesResp.error) throw issuesResp.error;
      setRuns((runsResp.data ?? []) as PlacementDataQualityDashboardRun[]);
      setIssues((issuesResp.data ?? []) as PlacementDataQualityDashboardIssue[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (admin.loading || admin.permissions.level < 9) return;
    void loadData();
  }, [admin.loading, admin.permissions.level]);

  const latest = runs[0] ?? null;
  const bucketCounts = useMemo(
    () => buckets.map((b) => ({ title: b.title, count: issues.filter(b.matcher).length })),
    [issues],
  );
  const auditHistory = runs.slice(0, 8);

  if (!admin.loading && admin.permissions.level < 9) return <Navigate to="/admin" replace />;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-950">Placement V3 Data Quality</h1>
            <p className="mt-1 text-sm text-slate-600">
              Corpus integrity, taxonomy consistency, recommendation graph, and prompt/rubric alignment.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadData()}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        {error ? (
          <section className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className={card}>
            <p className={label}>Issue counts</p>
            <p className={stat}>{loading ? "..." : latest?.total_issues ?? 0}</p>
          </div>
          <div className={card}>
            <p className={label}>Blockers</p>
            <p className={stat}>{latest?.blocker_count ?? 0}</p>
          </div>
          <div className={card}>
            <p className={label}>Errors</p>
            <p className={stat}>{latest?.error_count ?? 0}</p>
          </div>
          <div className={card}>
            <p className={label}>Warnings</p>
            <p className={stat}>{latest?.warning_count ?? 0}</p>
          </div>
          <div className={card}>
            <p className={label}>Info</p>
            <p className={stat}>{latest?.info_count ?? 0}</p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className={card}>
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-600" />
              <h2 className="text-base font-semibold text-slate-950">Current Issue Buckets</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {bucketCounts.map((bucket) => (
                <div key={bucket.title} className="rounded-md border border-slate-100 bg-slate-50 p-3">
                  <p className="text-sm font-medium text-slate-700">{bucket.title}</p>
                  <p className="mt-1 text-xl font-semibold text-slate-950">{bucket.count}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={card}>
            <div className="mb-3 flex items-center gap-2">
              <GitBranch size={18} className="text-slate-700" />
              <h2 className="text-base font-semibold text-slate-950">Audit History</h2>
            </div>
            <div className="space-y-2">
              {auditHistory.length ? auditHistory.map((run) => (
                <div key={run.run_id} className="flex items-center justify-between rounded-md border border-slate-100 p-3 text-sm">
                  <span className="font-medium text-slate-900">{run.run_id}</span>
                  <span className="text-slate-600">{run.total_issues} issues</span>
                </div>
              )) : (
                <p className="text-sm text-slate-600">No persisted audit runs yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className={card}>
          <div className="mb-3 flex items-center gap-2">
            <ListChecks size={18} className="text-slate-700" />
            <h2 className="text-base font-semibold text-slate-950">Unresolved Integrity Issues</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-3">Severity</th>
                  <th className="py-2 pr-3">Category</th>
                  <th className="py-2 pr-3">File</th>
                  <th className="py-2 pr-3">Message</th>
                </tr>
              </thead>
              <tbody>
                {issues.length ? issues.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100">
                    <td className="py-2 pr-3 font-medium">{item.severity}</td>
                    <td className="py-2 pr-3">{item.category}</td>
                    <td className="py-2 pr-3 font-mono text-xs">{item.file_path}</td>
                    <td className="py-2 pr-3">{item.message}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-600">
                      <CheckCircle2 className="mx-auto mb-2 text-emerald-600" size={22} />
                      No unresolved issues returned from the latest persisted data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
