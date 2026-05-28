// /admin/interview-prompts — moderation queue for community interview
// prompts. Mirrors StoryModeration's shape (mounted under <AdminRoute>
// + <AdminLayout>; RLS enforces get_admin_level() >= 9 for UPDATE).
//
// Actions: Approve & publish, Reject (with reason), Edit & approve
// (inline textarea unlocks question_text_en before publishing).
//
// Filters: status, profession, question_type.

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import {
  INTERVIEW_PROMPT_PROFESSIONS,
  INTERVIEW_PROMPT_QUESTION_TYPES,
  PROFESSION_LABELS_VI,
  QUESTION_TYPE_LABELS_VI,
  DIFFICULTY_LABELS_VI,
  type InterviewPromptProfession,
  type InterviewPromptQuestionType,
  type InterviewPromptStatus,
  type UserInterviewPromptRow,
} from "@/lib/interviewPrompts/types";

const STATUS_OPTIONS: ReadonlyArray<{ value: InterviewPromptStatus | "all"; label: string }> = [
  { value: "pending", label: "Đang chờ duyệt" },
  { value: "published", label: "Đã đăng" },
  { value: "rejected", label: "Đã từ chối" },
  { value: "approved", label: "Đã duyệt (chưa đăng)" },
  { value: "all", label: "Tất cả" },
];

export default function InterviewPromptsModeration(): React.ReactElement {
  const [rows, setRows] = useState<UserInterviewPromptRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<InterviewPromptStatus | "all">("pending");
  const [professionFilter, setProfessionFilter] = useState<InterviewPromptProfession | "">("");
  const [typeFilter, setTypeFilter] = useState<InterviewPromptQuestionType | "">("");

  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<string>("");

  const fetchRows = useCallback(async () => {
    let query = supabase
      .from("user_interview_prompts")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(200);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    if (professionFilter) {
      query = query.eq("profession", professionFilter);
    }
    if (typeFilter) {
      query = query.eq("question_type", typeFilter);
    }

    const { data, error: queryError } = await query;
    if (queryError) {
      setError(queryError.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as UserInterviewPromptRow[]);
  }, [statusFilter, professionFilter, typeFilter]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  async function approve(row: UserInterviewPromptRow, overrideText?: string) {
    setBusyId(row.id);
    const now = new Date().toISOString();
    const updates: Record<string, unknown> = {
      status: "published",
      approved_at: row.approved_at ?? now,
      published_at: now,
    };
    if (overrideText && overrideText.trim() && overrideText.trim() !== row.question_text_en) {
      updates.question_text_en = overrideText.trim();
    }
    const { error: updateError } = await supabase
      .from("user_interview_prompts")
      .update(updates)
      .eq("id", row.id);
    setBusyId(null);
    setEditingId(null);
    setEditDraft("");
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
  }

  async function reject(row: UserInterviewPromptRow) {
    const reason = window.prompt("Lý do từ chối (bắt buộc):");
    if (!reason || !reason.trim()) {
      return;
    }
    setBusyId(row.id);
    const { error: updateError } = await supabase
      .from("user_interview_prompts")
      .update({
        status: "rejected",
        rejection_reason: reason.trim(),
      })
      .eq("id", row.id);
    setBusyId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
  }

  function startEdit(row: UserInterviewPromptRow) {
    setEditingId(row.id);
    setEditDraft(row.question_text_en);
  }

  const counts = useMemo(() => (rows ? rows.length : null), [rows]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">Duyệt câu hỏi phỏng vấn cộng đồng</h1>
        <p className="mt-1 text-sm text-slate-600">
          {counts == null ? "Đang tải…" : `${counts} câu hỏi theo bộ lọc.`}
        </p>
      </header>

      <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Bộ lọc">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InterviewPromptStatus | "all")}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nghề
          </label>
          <select
            value={professionFilter}
            onChange={(e) =>
              setProfessionFilter(e.target.value as InterviewPromptProfession | "")
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">Tất cả</option>
            {INTERVIEW_PROMPT_PROFESSIONS.map((p) => (
              <option key={p} value={p}>
                {PROFESSION_LABELS_VI[p]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Loại câu hỏi
          </label>
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value as InterviewPromptQuestionType | "")
            }
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">Tất cả</option>
            {INTERVIEW_PROMPT_QUESTION_TYPES.map((q) => (
              <option key={q} value={q}>
                {QUESTION_TYPE_LABELS_VI[q]}
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

      {rows && rows.length === 0 && !error && (
        <p className="text-sm text-slate-500">Không có câu hỏi nào.</p>
      )}

      <ul className="space-y-3">
        {(rows ?? []).map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
            data-testid={`prompt-row-${row.id}`}
          >
            <header className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                {PROFESSION_LABELS_VI[row.profession]}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                {DIFFICULTY_LABELS_VI[row.difficulty]}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">
                {QUESTION_TYPE_LABELS_VI[row.question_type]}
              </span>
              <span className="ml-auto font-mono uppercase text-slate-500">{row.status}</span>
            </header>

            {editingId === row.id ? (
              <textarea
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                rows={4}
                maxLength={500}
                className="mt-3 w-full rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-slate-900"
                aria-label="Sửa nội dung câu hỏi"
              />
            ) : (
              <p className="mt-3 whitespace-pre-line text-sm text-slate-800">
                {row.question_text_en}
              </p>
            )}

            {row.question_text_vi && editingId !== row.id && (
              <p className="mt-2 whitespace-pre-line text-xs text-slate-500">
                VI: {row.question_text_vi}
              </p>
            )}

            {row.context && (
              <p className="mt-2 text-xs italic text-slate-500">{row.context}</p>
            )}

            <p className="mt-2 text-[11px] text-slate-500">
              {new Date(row.submitted_at).toLocaleString("vi-VN")} · {row.upvotes_count} upvotes ·{" "}
              {row.flag_count} flags
            </p>

            {row.rejection_reason && (
              <p className="mt-2 text-xs text-red-700">
                Lý do từ chối: {row.rejection_reason}
              </p>
            )}

            <footer className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === row.id || row.status === "published"}
                onClick={() =>
                  approve(row, editingId === row.id ? editDraft : undefined)
                }
                className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
              >
                {editingId === row.id ? "Lưu sửa & đăng" : "Duyệt & đăng"}
              </button>
              {editingId !== row.id ? (
                <button
                  type="button"
                  disabled={busyId === row.id}
                  onClick={() => startEdit(row)}
                  className="rounded-full border border-amber-400 px-3 py-1 text-xs font-bold text-amber-700 disabled:opacity-50"
                >
                  Sửa
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditDraft("");
                  }}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-bold text-slate-600"
                >
                  Huỷ sửa
                </button>
              )}
              <button
                type="button"
                disabled={busyId === row.id || row.status === "rejected"}
                onClick={() => reject(row)}
                className="rounded-full border border-red-400 px-3 py-1 text-xs font-bold text-red-700 disabled:opacity-50"
              >
                Từ chối
              </button>
            </footer>
          </li>
        ))}
      </ul>
    </main>
  );
}
