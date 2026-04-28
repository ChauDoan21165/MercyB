// src/pages/xp/XPHistoryPage.tsx — /xp
//
// Auth-gated. Shows current XP + level + progress to next level + the
// last 30 awarded events + 14-day per-day chart.
//
// Respects user_xp.gamification_enabled — if false, renders a quiet
// opt-out panel rather than the full surface.

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { levelForXP, levelProgress, MAX_LEVEL, xpToNextLevel } from "@/lib/xp/levels";
import { labelFor, type XPEventType } from "@/lib/xp/eventTypes";

interface UserXPState {
  total_xp: number;
  current_level: number;
  gamification_enabled: boolean;
}

interface XPEventRow {
  id: string;
  event_type: string;
  xp_amount: number;
  source_id: string | null;
  occurred_at: string;
}

export default function XPHistoryPage() {
  const { user } = useAuth();
  const [xpState, setXpState] = useState<UserXPState | null>(null);
  const [events, setEvents] = useState<XPEventRow[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) return;
    setLoading(true);

    (async () => {
      const [xpResp, eventsResp] = await Promise.all([
        supabase
          .from("user_xp")
          .select("total_xp, current_level, gamification_enabled")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("xp_events")
          .select("id, event_type, xp_amount, source_id, occurred_at")
          .eq("user_id", user.id)
          .order("occurred_at", { ascending: false })
          .limit(30),
      ]);

      if (cancelled) return;

      const xpRow = (xpResp.data ?? null) as Partial<UserXPState> | null;
      const total = typeof xpRow?.total_xp === "number" ? xpRow.total_xp : 0;
      setXpState({
        total_xp: total,
        current_level:
          typeof xpRow?.current_level === "number"
            ? xpRow.current_level
            : levelForXP(total),
        gamification_enabled: xpRow?.gamification_enabled !== false,
      });

      setEvents((eventsResp.data ?? []) as XPEventRow[]);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const dailyChart = useMemo(() => {
    if (!events) return [];
    const days: { iso: string; xp: number }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 13; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push({ iso: d.toISOString().slice(0, 10), xp: 0 });
    }
    for (const e of events) {
      const day = e.occurred_at.slice(0, 10);
      const slot = days.find((d) => d.iso === day);
      if (slot) slot.xp += e.xp_amount;
    }
    return days;
  }, [events]);

  if (!user?.id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-sm text-black/60">
        Đăng nhập để xem XP của bạn.
      </div>
    );
  }

  if (loading || !xpState) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 text-sm text-black/55">
        Đang tải XP…
      </div>
    );
  }

  if (!xpState.gamification_enabled) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold">Trang XP đang tắt</h1>
        <p className="mt-2 text-sm text-black/65">
          Bạn đã tắt phần XP. Mercy tôn trọng — không ép bạn dùng nếu không muốn.
        </p>
      </div>
    );
  }

  const progress = levelProgress(xpState.total_xp);
  const toNext = xpToNextLevel(progress.current);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">XP của bạn</h1>
        <p className="text-sm italic text-black/55">Your XP and level</p>
      </header>

      <section className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-xs uppercase tracking-wide text-emerald-700">
          Tổng XP / Total XP
        </p>
        <div className="mt-1 flex items-end gap-3">
          <span className="text-3xl font-bold text-emerald-900 tabular-nums">
            {xpState.total_xp.toLocaleString("vi-VN")}
          </span>
          <span className="pb-1 text-sm text-emerald-800">
            Level {xpState.current_level}
            {xpState.current_level >= MAX_LEVEL ? " (max)" : ""}
          </span>
        </div>

        {progress.span > 0 && (
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-200">
              <div
                className="h-full bg-emerald-600 transition-all"
                style={{ width: `${Math.round(progress.fraction * 100)}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-emerald-800">
              Còn {toNext - progress.into} XP nữa để lên Level {progress.next}.
            </p>
          </div>
        )}
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-sm font-semibold text-black/85">
          14 ngày qua
        </h2>
        <DailyXPChart data={dailyChart} />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-black/85">
          Lần nhận XP gần nhất
        </h2>
        {events && events.length === 0 && (
          <p className="text-sm italic text-black/55">
            Chưa có sự kiện nào — bắt đầu một bài học để nhận XP đầu tiên.
          </p>
        )}
        <ul className="space-y-2">
          {(events ?? []).map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 text-sm"
            >
              <span className="text-black/85">
                {labelFor(e.event_type as XPEventType)}
              </span>
              <span className="flex items-center gap-3 text-xs text-black/55">
                <span>{new Date(e.occurred_at).toLocaleString("vi-VN")}</span>
                <span className="font-semibold text-emerald-700 tabular-nums">
                  +{e.xp_amount} XP
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function DailyXPChart({ data }: { data: { iso: string; xp: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.xp));
  return (
    <div className="flex h-24 items-end gap-1 rounded-lg border border-black/10 bg-white p-3">
      {data.map((d) => {
        const pct = (d.xp / max) * 100;
        const date = new Date(d.iso);
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        return (
          <div
            key={d.iso}
            className="flex flex-1 flex-col items-center justify-end gap-1"
            title={`${label}: ${d.xp} XP`}
          >
            <div
              className="w-full rounded-t bg-emerald-500"
              style={{ height: `${pct}%`, minHeight: d.xp > 0 ? 2 : 0 }}
            />
            <span className="text-[9px] text-black/45">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
