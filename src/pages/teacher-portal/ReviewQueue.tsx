// src/pages/teacher-portal/ReviewQueue.tsx
//
// /teacher — main queue surface for teacher reviewers (admin level >= 5).
//
// RLS guarantees the teacher only sees rows with status in
// ('in_review', 'needs_revision'); the page tabs filter further by
// content_type. Vietnamese-primary copy, mobile-first (≥ 375px).
//
// Each row links to /teacher/review/<content_type>:<content_id>.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import {
  CONTENT_TYPE_LABEL_EN,
  CONTENT_TYPE_LABEL_VI,
  CONTENT_TYPES,
  type ContentReviewStatusRow,
  type ContentType,
  buildItemId,
} from "@/lib/teacher-portal/types";

const TABS: ReadonlyArray<ContentType> = CONTENT_TYPES;

export default function ReviewQueue(): React.ReactElement {
  const [rows, setRows] = useState<ContentReviewStatusRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContentType>("vstep");

  const fetchRows = useCallback(async () => {
    const { data, error: queryError } = await supabase
      .from("content_review_status")
      .select("*")
      .in("status", ["in_review", "needs_revision"])
      .order("marked_for_review_at", { ascending: true })
      .limit(500);

    if (queryError) {
      setError(queryError.message);
      setRows([]);
      return;
    }
    setRows((data ?? []) as ContentReviewStatusRow[]);
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    return rows.filter((r) => r.content_type === activeTab);
  }, [rows, activeTab]);

  const counts = useMemo(() => {
    if (!rows) return null;
    const out: Record<ContentType, number> = {
      vstep: 0,
      toeic: 0,
      ielts: 0,
      cultural: 0,
      profession: 0,
      room: 0,
    };
    for (const r of rows) {
      if (r.content_type in out) {
        out[r.content_type as ContentType] += 1;
      }
    }
    return out;
  }, [rows]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          Cổng giáo viên — Hàng đợi duyệt
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Teacher review queue — content awaiting your review.
        </p>
      </header>

      <nav
        className="mb-4 flex flex-wrap gap-2 border-b border-slate-200"
        aria-label="Phân loại nội dung"
      >
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          const count = counts ? counts[tab] : null;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={
                "px-3 py-2 text-sm font-semibold transition-colors " +
                (isActive
                  ? "border-b-2 border-emerald-600 text-emerald-700"
                  : "text-slate-600 hover:text-slate-800")
              }
              aria-current={isActive ? "page" : undefined}
            >
              {CONTENT_TYPE_LABEL_VI[tab]}
              {count != null && count > 0 ? (
                <span className="ml-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-100 px-1.5 text-xs font-bold text-emerald-700">
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {filtered && filtered.length === 0 && !error && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
          Không có mục nào cần duyệt cho {CONTENT_TYPE_LABEL_VI[activeTab]}.
          <br />
          <span className="text-xs text-slate-600">
            No items pending for {CONTENT_TYPE_LABEL_EN[activeTab]}.
          </span>
        </p>
      )}

      {filtered === null && <p className="text-sm text-slate-600">Đang tải…</p>}

      <ul className="space-y-3">
        {(filtered ?? []).map((row) => {
          const itemId = buildItemId(row.content_type as ContentType, row.content_id);
          return (
            <li
              key={itemId}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm font-bold text-slate-900 break-all">
                    {row.content_id}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    {CONTENT_TYPE_LABEL_VI[row.content_type as ContentType] ?? row.content_type}
                    {" · "}
                    <span
                      className={
                        row.status === "needs_revision"
                          ? "text-orange-600"
                          : "text-slate-600"
                      }
                    >
                      {row.status === "needs_revision"
                        ? "Cần chỉnh sửa"
                        : "Đang chờ duyệt"}
                    </span>
                    {row.marked_for_review_at ? (
                      <>
                        {" · "}
                        <time>
                          {new Date(row.marked_for_review_at).toLocaleString("vi-VN")}
                        </time>
                      </>
                    ) : null}
                  </p>
                </div>
                <Link
                  to={`/teacher/review/${itemId}`}
                  className="inline-flex flex-none items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Duyệt nội dung
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
