import { useEffect, useState, useCallback, useMemo } from "react";
import {
  listFeedback,
  setFeedbackAdminStatus,
  type FeedbackRow,
  type FeedbackAdminStatus,
} from "@/lib/admin/feedbackTriageClient";

const STATUS_OPTIONS: FeedbackAdminStatus[] = [
  "new", "triaged", "in_progress", "shipped", "wontfix",
];

export default function FeedbackTriagePage() {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FeedbackAdminStatus | "all">("new");

  const reload = useCallback(async () => {
    setLoading(true);
    const list = await listFeedback({
      adminStatus: filterStatus === "all" ? undefined : filterStatus,
      limit: 200,
    });
    setRows(list);
    setLoading(false);
  }, [filterStatus]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const grouped = useMemo(() => {
    const byTag = new Map<string, FeedbackRow[]>();
    for (const r of rows) {
      if (r.sentimentTags.length === 0) {
        const list = byTag.get("(untagged)") ?? [];
        list.push(r);
        byTag.set("(untagged)", list);
      } else {
        for (const t of r.sentimentTags) {
          const list = byTag.get(t) ?? [];
          list.push(r);
          byTag.set(t, list);
        }
      }
    }
    return Array.from(byTag.entries()).sort(
      ([, a], [, b]) => b.length - a.length,
    );
  }, [rows]);

  const onChangeStatus = async (id: string, status: FeedbackAdminStatus) => {
    await setFeedbackAdminStatus(id, status);
    await reload();
  };

  const exportCsv = () => {
    const header = ["id", "created_at", "sentiment", "tags", "admin_status", "message"].join(",");
    const lines = rows.map((r) => [
      r.id,
      r.createdAt,
      r.sentiment ?? "",
      `"${r.sentimentTags.join(";")}"`,
      r.adminStatus,
      `"${r.message.replace(/"/g, '""').slice(0, 500)}"`,
    ].join(","));
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedback-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-4 py-6 max-w-5xl">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Feedback triage</h1>
        <button
          type="button"
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="text-xs px-3 py-1.5 rounded border border-black/15 hover:bg-black/5 disabled:opacity-50"
        >
          Export CSV
        </button>
      </header>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["new", "triaged", "in_progress", "shipped", "wontfix", "all"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              filterStatus === s
                ? "bg-black text-white border-black"
                : "bg-white text-black/70 border-black/15 hover:border-black/30"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-black/50">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-black/50">No feedback in this filter.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(([tag, list]) => (
            <section key={tag}>
              <h2 className="text-sm font-semibold text-black/70 mb-2">
                {tag}{" "}
                <span className="text-xs text-black/45 font-normal">
                  ({list.length})
                </span>
              </h2>
              <div className="flex flex-col gap-2">
                {list.map((r) => (
                  <div key={r.id} className="rounded border border-black/10 bg-white p-3">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="text-xs text-black/50">
                        {new Date(r.createdAt).toLocaleString()} ·{" "}
                        {r.sentiment ?? "no-sentiment"}
                      </div>
                      <select
                        value={r.adminStatus}
                        onChange={(e) =>
                          onChangeStatus(r.id, e.target.value as FeedbackAdminStatus)
                        }
                        className="text-xs border border-black/15 rounded px-2 py-1 bg-white"
                        aria-label="Change admin status"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{r.message}</p>
                    {r.sentimentTags.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {r.sentimentTags.map((t) => (
                          <span key={t} className="text-xs px-1.5 py-0.5 rounded bg-black/5">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {r.adminNotes ? (
                      <p className="text-xs text-black/55 mt-2 italic">
                        Admin notes: {r.adminNotes}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
