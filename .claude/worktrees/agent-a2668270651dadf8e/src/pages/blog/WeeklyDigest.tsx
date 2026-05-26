// Public weekly community digest archive (A9).
//
// Public, no auth required. Reads the latest weekly_digest_data row
// from Supabase via the singleton client. Anon SELECT is allowed by
// the RLS policy on weekly_digest_data — see migration 20260517.
//
// Route shapes (both supported):
//   /blog/weekly-digest                  → latest week
//   /blog/weekly-digest/:weekStart       → archived week (YYYY-MM-DD)
//
// SEO + share-card copy: "X người Việt luyện Anh tuần này".

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";

type DigestRow = {
  week_starts_on: string;
  total_attempts_this_week: number;
  total_unique_active_users_this_week: number;
  new_users_this_week: number;
  top_phoneme_improved: string | null;
  top_phoneme_improvement_points: number | null;
  top_topic_practiced: string | null;
  top_topic_attempt_count: number | null;
  refreshed_at: string;
};

type LoadState =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "loaded"; row: DigestRow };

const VN_MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

function fmtDateVi(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return `${d.getUTCDate()} ${VN_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function fmtNumber(n: number): string {
  return n.toLocaleString("vi-VN");
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function WeeklyDigest() {
  const { weekStart } = useParams<{ weekStart?: string }>();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    (async () => {
      try {
        const query = supabase
          .from("weekly_digest_data")
          .select("*");
        const { data, error } = weekStart
          ? await query.eq("week_starts_on", weekStart).maybeSingle()
          : await query
              .order("week_starts_on", { ascending: false })
              .limit(1)
              .maybeSingle();
        if (cancelled) return;
        if (error) {
          setState({ status: "error", message: error.message });
          return;
        }
        if (!data) {
          setState({ status: "empty" });
          return;
        }
        setState({ status: "loaded", row: data as DigestRow });
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setState({ status: "error", message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [weekStart]);

  const heroLine = useMemo(() => {
    if (state.status !== "loaded") return null;
    return `${fmtNumber(state.row.total_unique_active_users_this_week)} người Việt luyện Anh tuần này`;
  }, [state]);

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <header className="mb-6">
        <Link to="/blog" className="text-xs text-black/50 hover:text-black/80">
          ← Blog
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          Cộng đồng MercyBlade — tuần qua
        </h1>
        <p className="text-sm text-black/55 italic">
          MercyBlade community — this week in numbers
        </p>
      </header>

      {state.status === "loading" && (
        <p className="text-sm text-black/55">Đang tải dữ liệu cộng đồng…</p>
      )}

      {state.status === "empty" && (
        <p className="text-sm text-black/65">
          Tuần này chưa có dữ liệu. Quay lại vào thứ Hai tuần sau nhé.
        </p>
      )}

      {state.status === "error" && (
        <p className="text-sm text-rose-700">
          Không tải được dữ liệu — {state.message}
        </p>
      )}

      {state.status === "loaded" && (
        <DigestView row={state.row} heroLine={heroLine ?? ""} />
      )}

      <footer className="mt-12 pt-6 border-t border-black/10 text-xs text-black/55">
        Tổng hợp công khai, không có dữ liệu cá nhân của ai.
      </footer>
    </div>
  );
}

function DigestView({
  row,
  heroLine,
}: {
  row: DigestRow;
  heroLine: string;
}) {
  const weekEnd = addDays(row.week_starts_on, 6);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6">
        <p className="text-xs uppercase tracking-wide text-emerald-700">
          Tuần {fmtDateVi(row.week_starts_on)} — {fmtDateVi(weekEnd)}
        </p>
        <h2 className="text-2xl font-bold mt-2 text-emerald-900">
          {heroLine}
        </h2>
        <p className="text-sm text-emerald-800 italic mt-1">
          {row.total_unique_active_users_this_week.toLocaleString("en-US")}{" "}
          Vietnamese learners practicing English with MercyBlade this week.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat
          label_vi="Lượt phát âm"
          label_en="Pronunciation attempts"
          value={fmtNumber(row.total_attempts_this_week)}
        />
        <Stat
          label_vi="Người học cùng"
          label_en="Active learners"
          value={fmtNumber(row.total_unique_active_users_this_week)}
        />
        <Stat
          label_vi="Người mới gia nhập"
          label_en="New learners"
          value={fmtNumber(row.new_users_this_week)}
        />
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-5">
        <h3 className="text-sm font-semibold text-black/90 mb-1">
          Âm khó nhất cộng đồng tiến bộ tuần này
        </h3>
        <p className="text-xs text-black/55 italic mb-2">
          Hardest sound the community improved on this week
        </p>
        {row.top_phoneme_improved && row.top_phoneme_improvement_points != null ? (
          <p className="text-sm text-black/85">
            <span className="font-mono text-base">
              /{row.top_phoneme_improved}/
            </span>{" "}
            — trung bình tăng{" "}
            <strong>
              {row.top_phoneme_improvement_points >= 0 ? "+" : ""}
              {row.top_phoneme_improvement_points} điểm
            </strong>{" "}
            so với tuần trước
          </p>
        ) : (
          <p className="text-sm text-black/55 italic">
            Chưa đủ dữ liệu để chọn âm khó tuần này.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-black/10 bg-white p-5">
        <h3 className="text-sm font-semibold text-black/90 mb-1">
          Phòng được luyện nhiều nhất
        </h3>
        <p className="text-xs text-black/55 italic mb-2">
          Most-practiced room
        </p>
        {row.top_topic_practiced && row.top_topic_attempt_count != null ? (
          <p className="text-sm text-black/85">
            <strong>{row.top_topic_practiced}</strong> —{" "}
            {fmtNumber(row.top_topic_attempt_count)} lượt luyện
          </p>
        ) : (
          <p className="text-sm text-black/55 italic">
            Chưa có phòng nào nổi bật tuần này.
          </p>
        )}
      </section>

      <section className="rounded-xl border border-black/10 bg-black/[.02] p-5 text-center">
        <p className="text-sm text-black/75">
          Bạn cũng muốn cùng cộng đồng luyện tuần sau?
        </p>
        <Link
          to="/login"
          className="inline-block mt-3 px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold"
        >
          Tham gia MercyBlade
        </Link>
      </section>
    </div>
  );
}

function Stat({
  label_vi,
  label_en,
  value,
}: {
  label_vi: string;
  label_en: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4">
      <div className="text-2xl font-bold text-black/90">{value}</div>
      <div className="text-xs text-black/70 mt-1">{label_vi}</div>
      <div className="text-[10px] text-black/45 italic">{label_en}</div>
    </div>
  );
}
