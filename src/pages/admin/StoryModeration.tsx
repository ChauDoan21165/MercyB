// /admin/stories — moderation queue for user-submitted testimonials.
// Mounted under <AdminRoute> + <AdminLayout> so admin auth is enforced
// before this component renders. RLS additionally enforces
// `get_admin_level() >= 9` for any UPDATE.
//
// Lists pending stories by default. Admins can:
//   - Approve  → status='published', published_at=now()
//   - Reject   → status='rejected', stash a `rejection_reason`
//   - Archive  → status='archived'  (preserved for audit, hidden publicly)
//
// Filter: status (pending/approved/published/rejected/archived/all) and
// tag. The DB index on status='published' isn't relevant here; admins
// query mostly the small `pending` queue.

import React, { useCallback, useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import {
  STORY_TAGS,
  excerpt,
  type StoryStatus,
  type StoryTag,
  type UserStoryRow,
} from "@/lib/stories/types";

const STATUS_OPTIONS: ReadonlyArray<{ value: StoryStatus | "all"; label: string }> = [
  { value: "pending", label: "Đang chờ duyệt" },
  { value: "published", label: "Đã đăng" },
  { value: "rejected", label: "Đã từ chối" },
  { value: "archived", label: "Đã ẩn" },
  { value: "approved", label: "Đã duyệt (chưa đăng)" },
  { value: "all", label: "Tất cả" },
];

export default function StoryModeration(): React.ReactElement {
  const [rows, setRows] = useState<UserStoryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StoryStatus | "all">("pending");
  const [tagFilter, setTagFilter] = useState<StoryTag | "">("");

  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchRows = useCallback(async () => {
    let query = supabase
      .from("user_stories")
      .select("*")
      .order("submitted_at", { ascending: false })
      .limit(200);

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    if (tagFilter) {
      query = query.contains("tags", [tagFilter]);
    }

    const { data, error: queryError } = await query;
    if (queryError) {
      setError(queryError.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as UserStoryRow[]);
  }, [statusFilter, tagFilter]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  async function approve(row: UserStoryRow) {
    setBusyId(row.id);
    const now = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("user_stories")
      .update({
        status: "published",
        approved_at: row.approved_at ?? now,
        published_at: now,
      })
      .eq("id", row.id);
    setBusyId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
  }

  async function reject(row: UserStoryRow) {
    const reason = window.prompt("Lý do từ chối (tuỳ chọn):") ?? null;
    setBusyId(row.id);
    const { error: updateError } = await supabase
      .from("user_stories")
      .update({
        status: "rejected",
        rejection_reason: reason && reason.trim() ? reason.trim() : null,
      })
      .eq("id", row.id);
    setBusyId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
  }

  async function archive(row: UserStoryRow) {
    setBusyId(row.id);
    const { error: updateError } = await supabase
      .from("user_stories")
      .update({ status: "archived" })
      .eq("id", row.id);
    setBusyId(null);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setRows((prev) => (prev ? prev.filter((r) => r.id !== row.id) : prev));
  }

  const counts = useMemo(() => {
    if (!rows) return null;
    return rows.length;
  }, [rows]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">Duyệt câu chuyện học viên</h1>
        <p className="mt-1 text-sm text-slate-600">
          {counts == null ? "Đang tải…" : `${counts} câu chuyện theo bộ lọc.`}
        </p>
      </header>

      <section className="mb-5 grid grid-cols-2 gap-3" aria-label="Bộ lọc">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StoryStatus | "all")}
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
            Thẻ
          </label>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value as StoryTag | "")}
            className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm"
          >
            <option value="">Tất cả</option>
            {STORY_TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
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
        <p className="text-sm text-slate-500">Không có câu chuyện nào.</p>
      )}

      <ul className="space-y-3">
        {(rows ?? []).map((row) => (
          <li
            key={row.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <header className="flex items-start gap-3">
              {row.display_avatar_url ? (
                <img
                  src={row.display_avatar_url}
                  alt=""
                  className="h-10 w-10 flex-none rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                  {row.display_name.trim().charAt(0).toUpperCase() || "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{row.display_name}</p>
                {row.profession && (
                  <p className="text-xs text-slate-500">{row.profession}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {new Date(row.submitted_at).toLocaleString("vi-VN")} ·{" "}
                  <span className="font-mono uppercase">{row.status}</span>
                </p>
              </div>
            </header>

            {(row.ielts_band_before != null || row.vstep_level_before) && (
              <p className="mt-2 text-xs font-semibold text-emerald-700">
                {row.ielts_band_before != null
                  ? `IELTS ${row.ielts_band_before} → ${row.ielts_band_after ?? "?"}`
                  : `VSTEP ${row.vstep_level_before} → ${row.vstep_level_after ?? "?"}`}
              </p>
            )}

            <p className="mt-3 whitespace-pre-line text-sm text-slate-700">
              {excerpt(row.story_text_vi, 400)}
            </p>

            {row.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {row.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {row.rejection_reason && (
              <p className="mt-2 text-xs text-red-700">
                Lý do từ chối: {row.rejection_reason}
              </p>
            )}

            <footer className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busyId === row.id || row.status === "published"}
                onClick={() => approve(row)}
                className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-bold text-white disabled:opacity-50"
              >
                Duyệt & đăng
              </button>
              <button
                type="button"
                disabled={busyId === row.id || row.status === "rejected"}
                onClick={() => reject(row)}
                className="rounded-full border border-red-400 px-3 py-1 text-xs font-bold text-red-700 disabled:opacity-50"
              >
                Từ chối
              </button>
              <button
                type="button"
                disabled={busyId === row.id || row.status === "archived"}
                onClick={() => archive(row)}
                className="rounded-full border border-slate-500 px-3 py-1 text-xs font-bold text-slate-700 disabled:opacity-50"
              >
                Ẩn (lưu trữ)
              </button>
            </footer>
          </li>
        ))}
      </ul>
    </main>
  );
}
