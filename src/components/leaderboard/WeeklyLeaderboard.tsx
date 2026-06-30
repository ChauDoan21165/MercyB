// src/components/leaderboard/WeeklyLeaderboard.tsx
//
// Public weekly pronunciation leaderboard. Renders top 100 opted-in
// users with the caller's row highlighted when present. Anon users
// can view but not appear (the spec calls this out as the viral-
// acquisition surface).
//
// Visually distinct from LeaderboardCard.tsx (engagement points): this
// uses a sky/cyan palette and a 3-column ranked list layout.

import React, { useEffect, useMemo, useState } from "react";
import { Trophy, Medal } from "lucide-react";
import { Link } from "react-router-dom";
import {
  getTopHundred,
  getMyRank,
  type LeaderboardRow,
  type MyRankRow,
} from "@/lib/leaderboard/weeklyLeaderboardClient";
import { useAuth } from "@/providers/AuthProvider";
import { WEEKLY_LB_COPY } from "./weeklyLeaderboardCopy";

interface WeeklyLeaderboardProps {
  /** When false, hides the per-row "You" highlight. Default true. */
  highlightOwnRow?: boolean;
}

export function WeeklyLeaderboard({
  highlightOwnRow = true,
}: WeeklyLeaderboardProps) {
  const { user } = useAuth();
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [my, setMy] = useState<MyRankRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const list = await getTopHundred();
      if (cancelled) return;
      setRows(list);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user?.id || !highlightOwnRow) {
      setMy(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const r = await getMyRank();
      if (cancelled) return;
      setMy(r);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id, highlightOwnRow]);

  const myUserId = user?.id;
  const isLoading = rows === null;

  const myRowInTop = useMemo(() => {
    if (!myUserId || !rows) return null;
    return rows.find((r) => r.user_id === myUserId) ?? null;
  }, [myUserId, rows]);

  return (
    <div className="space-y-3">
      <header className="rounded-xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50 p-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-sky-600" />
          <h2 className="text-base font-semibold text-slate-900">
            {WEEKLY_LB_COPY.pageTitle.vi}
          </h2>
        </div>
        <p className="mt-0.5 text-xs text-slate-600">
          {WEEKLY_LB_COPY.pageTitle.en} · {WEEKLY_LB_COPY.thisWeek.vi}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          {WEEKLY_LB_COPY.pageIntro.vi}
        </p>

        {highlightOwnRow && my && my.onBoard && my.opted_in && my.rank !== null && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            <Medal className="h-3.5 w-3.5" />
            {WEEKLY_LB_COPY.yourRank(my.rank).vi}
          </p>
        )}

        {highlightOwnRow && user && my && (!my.onBoard || !my.opted_in) && (
          <p className="mt-3 text-xs text-amber-700">
            {WEEKLY_LB_COPY.notOnBoard.vi}{" "}
            <Link to="/account" className="font-medium underline">
              {WEEKLY_LB_COPY.optInTitle.vi}
            </Link>
          </p>
        )}

        {highlightOwnRow && !user && (
          <p className="mt-3 text-xs text-slate-600">
            <Link to="/signin" className="font-medium text-sky-700 underline">
              {WEEKLY_LB_COPY.signInToOptIn.vi}
            </Link>
          </p>
        )}
      </header>

      {isLoading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          {WEEKLY_LB_COPY.loading.vi}
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          {WEEKLY_LB_COPY.empty.vi}
        </p>
      ) : (
        <ol className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {rows.map((row) => {
            const isMe = highlightOwnRow && row.user_id === myUserId;
            return (
              <li
                key={row.user_id}
                className={
                  "flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-b-0 " +
                  (isMe ? "bg-sky-50 font-medium" : "")
                }
              >
                <span
                  className={
                    "w-8 shrink-0 text-right text-xs font-mono " +
                    (row.rank <= 3 ? "text-amber-600 font-bold" : "text-slate-600")
                  }
                >
                  #{row.rank}
                </span>
                <span className="flex-1 truncate text-sm text-slate-800">
                  {row.display_name}
                  {isMe && (
                    <span className="ml-1.5 text-[10px] uppercase tracking-wide text-sky-600">
                      {WEEKLY_LB_COPY.yourRow.vi}
                    </span>
                  )}
                </span>
                <span className="w-16 text-right text-sm tabular-nums text-slate-700">
                  {Math.round(row.total_score)}
                </span>
                <span className="hidden w-16 text-right text-xs tabular-nums text-slate-600 sm:inline-block">
                  {row.attempts_count}
                  <span className="ml-1">×</span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {/* Footer-style hint when caller is on the board but not in the top
          slice we fetched. */}
      {highlightOwnRow &&
        my?.onBoard &&
        my.opted_in &&
        my.rank !== null &&
        !myRowInTop && (
          <p className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs text-sky-800">
            {WEEKLY_LB_COPY.yourRank(my.rank).vi} · {Math.round(my.total_score)}{" "}
            {WEEKLY_LB_COPY.score.vi.toLowerCase()}
          </p>
        )}
    </div>
  );
}
