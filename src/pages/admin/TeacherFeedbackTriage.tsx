// src/pages/admin/TeacherFeedbackTriage.tsx
//
// /admin/teacher-feedback — admin view of every open teacher review.
// Mounted under <AdminRoute>/<AdminLayout> so admin auth (level >= 1)
// is enforced before render. RLS additionally enforces level >= 9 for
// any UPDATE on teacher_feedback / content_review_status.
//
// Three actions per row:
//   - Apply correction → feedback.status='correction_applied',
//                         content_review_status.status='approved'.
//                         The actual content edit is a manual admin
//                         step OUTSIDE this UI.
//   - Reject feedback   → feedback.status='rejected_by_admin' (requires admin_response).
//   - Request revision  → feedback.status='admin_acknowledged',
//                         content_review_status.status='needs_revision'.

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import {
  CONTENT_TYPE_LABEL_VI,
  DECISION_LABEL_VI,
  ISSUE_LABEL_VI,
  type ContentType,
  type TeacherFeedbackRow,
} from "@/lib/teacher-portal/types";

interface ReviewerProfile {
  id: string;
  preferred_name: string | null;
  email: string | null;
}

const SEVERITY_OPTIONS: ReadonlyArray<string> = ["", "1", "2", "3", "4", "5"];
const CONTENT_TYPE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "", label: "Tất cả" },
  { value: "vstep", label: "VSTEP" },
  { value: "toeic", label: "TOEIC" },
  { value: "ielts", label: "IELTS" },
  { value: "cultural", label: "Văn hoá Việt" },
  { value: "profession", label: "Nghề nghiệp" },
  { value: "room", label: "Phòng học" },
];

export default function TeacherFeedbackTriage(): React.ReactElement {
  const [rows, setRows] = useState<TeacherFeedbackRow[] | null>(null);
  const [reviewers, setReviewers] = useState<Record<string, ReviewerProfile>>({});
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<string>("");
  const [contentTypeFilter, setContentTypeFilter] = useState<string>("");
  const [reviewerFilter, setReviewerFilter] = useState<string>("");

  const fetchRows = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from("teacher_feedback")
      .select("*")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(500);

    if (queryError) {
      setError(queryError.message);
      setRows([]);
      return;
    }
    const fetched = (data ?? []) as TeacherFeedbackRow[];
    setRows(fetched);

    const reviewerIds = Array.from(new Set(fetched.map((r) => r.reviewer_id)));
    if (reviewerIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, preferred_name, email")
        .in("id", reviewerIds);
      const map: Record<string, ReviewerProfile> = {};
      for (const p of (profiles ?? []) as ReviewerProfile[]) {
        map[p.id] = p;
      }
      setReviewers(map);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    return rows.filter((r) => {
      if (severityFilter && r.severity !== severityFilter) return false;
      if (contentTypeFilter && r.content_type !== contentTypeFilter) return false;
      if (reviewerFilter && r.reviewer_id !== reviewerFilter) return false;
      return true;
    });
  }, [rows, severityFilter, contentTypeFilter, reviewerFilter]);

  async function applyCorrection(row: TeacherFeedbackRow) {
    setBusyId(row.id);
    try {
      const now = new Date().toISOString();
      const { error: feedbackError } = await supabase
        .from("teacher_feedback")
        .update({ status: "correction_applied", resolved_at: now })
        .eq("id", row.id);
      if (feedbackError) throw new Error(feedbackError.message);

      const { error: statusError } = await supabase
        .from("content_review_status")
        .update({ status: "approved", last_reviewed_at: now })
        .eq("content_id", row.content_id)
        .eq("content_type", row.content_type);
      if (statusError) {
        console.warn("[TeacherFeedbackTriage] update status failed:", statusError.message);
      }

      try {
        await supabase.functions.invoke("teacher-notifications", {
          body: {
            action: "content_updated",
            content_id: row.content_id,
            content_type: row.content_type,
            reviewer_id: row.reviewer_id,
          },
        });
      } catch (notifyErr) {
        console.warn("[TeacherFeedbackTriage] notification failed:", notifyErr);
      }

      setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Lỗi không xác định.";
      setError(message);
    } finally {
      setBusyId(null);
    }
  }

  async function rejectFeedback(row: TeacherFeedbackRow) {
    const adminResponse = window.prompt(
      "Lý do từ chối phản hồi của giáo viên (bắt buộc):",
    );
    if (!adminResponse || !adminResponse.trim()) {
      return;
    }
    setBusyId(row.id);
    try {
      const now = new Date().toISOString();
      const { error: updateError } = await supabase
        .from("teacher_feedback")
        .update({
          status: "rejected_by_admin",
          admin_response: adminResponse.trim(),
          resolved_at: now,
        })
        .eq("id", row.id);
      if (updateError) throw new Error(updateError.message);
      setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Lỗi không xác định.";
      setError(message);
    } finally {
      setBusyId(null);
    }
  }

  async function requestRevision(row: TeacherFeedbackRow) {
    setBusyId(row.id);
    try {
      const { error: updateError } = await supabase
        .from("teacher_feedback")
        .update({ status: "admin_acknowledged" })
        .eq("id", row.id);
      if (updateError) throw new Error(updateError.message);

      const { error: statusError } = await supabase
        .from("content_review_status")
        .update({ status: "needs_revision" })
        .eq("content_id", row.content_id)
        .eq("content_type", row.content_type);
      if (statusError) {
        console.warn("[TeacherFeedbackTriage] update status failed:", statusError.message);
      }

      try {
        await supabase.functions.invoke("teacher-notifications", {
          body: {
            action: "revision_requested",
            content_id: row.content_id,
            content_type: row.content_type,
            reviewer_id: row.reviewer_id,
          },
        });
      } catch (notifyErr) {
        console.warn("[TeacherFeedbackTriage] notification failed:", notifyErr);
      }

      setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Lỗi không xác định.";
      setError(message);
    } finally {
      setBusyId(null);
    }
  }

  const reviewerOptions = useMemo(() => {
    const ids = Array.from(new Set((rows ?? []).map((r) => r.reviewer_id)));
    return ids.map((id) => ({
      value: id,
      label:
        reviewers[id]?.preferred_name ??
        reviewers[id]?.email ??
        id.slice(0, 8),
    }));
  }, [rows, reviewers]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          Triage phản hồi giáo viên
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          {filtered == null
            ? "Đang tải…"
            : `${filtered.length} phản hồi đang chờ xử lý.`}
        </p>
      </header>

      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Bộ lọc">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Mức độ
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {SEVERITY_OPTIONS.map((sev) => (
              <option key={sev || "all"} value={sev}>
                {sev || "Tất cả"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Loại nội dung
          </label>
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {CONTENT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Giáo viên
          </label>
          <select
            value={reviewerFilter}
            onChange={(e) => setReviewerFilter(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">Tất cả</option>
            {reviewerOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {filtered && filtered.length === 0 && !error && (
        <p className="text-sm text-slate-600">Không có phản hồi nào.</p>
      )}

      <ul className="space-y-3">
        {(filtered ?? []).map((row) => {
          const reviewer = reviewers[row.reviewer_id];
          const reviewerLabel =
            reviewer?.preferred_name ??
            reviewer?.email ??
            row.reviewer_id.slice(0, 8);
          return (
            <li
              key={row.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <header className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="break-all font-mono text-sm font-bold text-slate-900">
                    {row.content_id}
                  </p>
                  <p className="text-xs text-slate-600">
                    {CONTENT_TYPE_LABEL_VI[row.content_type as ContentType] ?? row.content_type}
                    {" · "}
                    Mức độ {row.severity}
                    {" · "}
                    Giáo viên: {reviewerLabel}
                  </p>
                </div>
                <p className="text-xs font-semibold uppercase text-emerald-700">
                  {DECISION_LABEL_VI[row.decision]}
                </p>
              </header>

              {row.issues.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {row.issues.map((issue, idx) => (
                    <span
                      key={`${row.id}-${idx}`}
                      className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800"
                      title={issue.note ?? ""}
                    >
                      {ISSUE_LABEL_VI[issue.category] ?? issue.category}
                      {issue.note ? ` · ${issue.note}` : ""}
                    </span>
                  ))}
                </div>
              )}

              {row.suggested_correction && (
                <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800">
                  {row.suggested_correction}
                </pre>
              )}

              <p className="mt-2 text-xs text-slate-600">
                {new Date(row.created_at).toLocaleString("vi-VN")}
              </p>

              <footer className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => applyCorrection(row)}
                  className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
                >
                  Áp dụng chỉnh sửa
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => requestRevision(row)}
                  className="rounded-full border border-amber-500 px-3 py-1 text-xs font-bold text-amber-700 disabled:opacity-50"
                >
                  Yêu cầu chỉnh sửa lại
                </button>
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => rejectFeedback(row)}
                  className="rounded-full border border-red-400 px-3 py-1 text-xs font-bold text-red-700 disabled:opacity-50"
                >
                  Từ chối phản hồi
                </button>
              </footer>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
