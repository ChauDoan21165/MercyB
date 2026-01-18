// FILE: src/pages/admin/AdminFeedbackPage.tsx
// MB-BLUE-101.12a — 2026-01-14 (+0700)
//
// ADMIN: Feedback Viewer (read-only)
// - Lists public.app_feedback (RLS: admin read policy)
// - Filter by room_id, search message/email
// - Simple paging (load more)

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserAccess } from "@/hooks/useUserAccess";

type FeedbackRow = {
  id: string;
  created_at: string;
  room_id: string | null;
  user_id: string | null;
  user_email: string | null;
  message: string;
};

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminFeedbackPage() {
  const access = useUserAccess();
  const accessLoading = access.loading || access.isLoading;

  const isAdmin = !!(access.isAdmin || access.isHighAdmin || (access.adminLevel ?? 0) >= 9);

  const [roomFilter, setRoomFilter] = useState("");
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [pageSize] = useState(30);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const normalizedRoom = useMemo(() => roomFilter.trim(), [roomFilter]);
  const normalizedQ = useMemo(() => q.trim(), [q]);

  // Reset paging when filters change
  useEffect(() => {
    setPage(0);
    setRows([]);
    setHasMore(true);
  }, [normalizedRoom, normalizedQ]);

  useEffect(() => {
    if (accessLoading) return;
    if (!isAdmin) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr(null);

      try {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        let query = supabase
          .from("app_feedback")
          .select("id, created_at, room_id, user_id, user_email, message")
          .order("created_at", { ascending: false })
          .range(from, to);

        if (normalizedRoom) {
          query = query.ilike("room_id", `%${normalizedRoom}%`);
        }

        if (normalizedQ) {
          // Search in message OR email OR room_id (cheap + good enough)
          // Note: Supabase OR syntax uses comma-separated filters
          const escaped = normalizedQ.replace(/,/g, " "); // avoid breaking OR
          query = query.or(
            `message.ilike.%${escaped}%,user_email.ilike.%${escaped}%,room_id.ilike.%${escaped}%`,
          );
        }

        const { data, error } = await query;

        if (cancelled) return;

        if (error) {
          setErr(error.message || "DB error");
          setLoading(false);
          return;
        }

        const batch = (Array.isArray(data) ? data : []) as FeedbackRow[];

        setRows((prev) => {
          if (page === 0) return batch;
          // de-dupe by id
          const seen = new Set(prev.map((r) => r.id));
          const merged = [...prev];
          for (const r of batch) if (!seen.has(r.id)) merged.push(r);
          return merged;
        });

        setHasMore(batch.length === pageSize);
      } catch (e: any) {
        if (cancelled) return;
        setErr(String(e?.message || e || "DB error"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [accessLoading, isAdmin, page, pageSize, normalizedRoom, normalizedQ]);

  if (accessLoading) {
    return (
      <div className="p-6">
        <div className="text-sm opacity-70 font-semibold">Checking admin access…</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-sm font-semibold">Not authorized.</div>
        <div className="text-sm opacity-70 mt-2">This page is for admins only.</div>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Feedback Inbox</h1>
          <div className="text-sm opacity-70 mt-1">
            Read-only. Rows come from <code className="px-1 rounded bg-black/5">public.app_feedback</code>.
          </div>
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          <a
            href="/"
            className="px-3 py-2 rounded-xl border bg-white font-semibold text-sm hover:shadow-sm"
          >
            ← Home
          </a>
          <a
            href="/admin"
            className="px-3 py-2 rounded-xl border bg-white font-semibold text-sm hover:shadow-sm"
          >
            Admin
          </a>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border bg-white p-4 md:p-5">
        <div className="flex gap-3 flex-wrap items-end">
          <div className="min-w-[220px] flex-1">
            <label className="block text-xs font-bold opacity-70">Room filter</label>
            <input
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              placeholder="e.g. corporate_long_cycle_planning or vip9"
              className="mt-1 w-full px-3 py-2 rounded-xl border bg-white text-sm outline-none"
            />
          </div>

          <div className="min-w-[220px] flex-1">
            <label className="block text-xs font-bold opacity-70">Search</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="message / email / room"
              className="mt-1 w-full px-3 py-2 rounded-xl border bg-white text-sm outline-none"
            />
          </div>

          <button
            type="button"
            className="px-3 py-2 rounded-xl border bg-white font-bold text-sm"
            onClick={() => {
              setRoomFilter("");
              setQ("");
            }}
          >
            Clear
          </button>
        </div>

        {err ? <div className="mt-3 text-sm text-red-600">DB: {err}</div> : null}
        {loading ? <div className="mt-3 text-sm opacity-70">Loading…</div> : null}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-3 font-extrabold">Time</th>
                <th className="py-2 pr-3 font-extrabold">Room</th>
                <th className="py-2 pr-3 font-extrabold">User</th>
                <th className="py-2 pr-3 font-extrabold">Message</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading ? (
                <tr>
                  <td className="py-4 opacity-70" colSpan={4}>
                    No feedback yet (or filters too strict).
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={r.id} className="border-b align-top">
                    <td className="py-3 pr-3 whitespace-nowrap opacity-80">{fmtDate(r.created_at)}</td>
                    <td className="py-3 pr-3">
                      <div className="font-bold">{r.room_id || "—"}</div>
                      <div className="text-xs opacity-60">{r.id}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="font-semibold">{r.user_email || "—"}</div>
                      <div className="text-xs opacity-60">{r.user_id || ""}</div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="whitespace-pre-wrap leading-relaxed">{r.message}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs opacity-70">Loaded: {rows.length}</div>

          <div className="flex gap-2 items-center">
            <button
              type="button"
              className="px-3 py-2 rounded-xl border bg-white font-bold text-sm"
              onClick={() => setPage(0)}
              disabled={loading || page === 0}
            >
              Newest
            </button>

            <button
              type="button"
              className="px-3 py-2 rounded-xl border bg-white font-bold text-sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={loading || page === 0}
            >
              Prev
            </button>

            <button
              type="button"
              className="px-3 py-2 rounded-xl border bg-white font-bold text-sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={loading || !hasMore}
              title={!hasMore ? "No more rows" : "Load next page"}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
