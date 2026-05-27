// Weekly leaderboard card for Home / dashboard.
//
// Renders three sections:
//   1. Title row + subtitle (bilingual via leaderboardCopy)
//   2. Top 10 list — rank · username · points
//   3. Your-rank strip — the 5-row neighbor band centred on the caller,
//      OR a "not on the board yet" empty state if the synthetic row from
//      the RPC is the only thing returned.
//
// The card mounts behind the `mercyblade_leaderboard_enabled` runtime
// feature flag (flag check is owned by the caller; this component
// assumes it should render when mounted).
//
// Visual style mirrors FocusAreasCard (radius 20, soft gradient shell,
// bilingual EN-over-VN labels). Indigo palette is used so this card
// reads distinct from the existing teal (library) / pink (teacher) /
// amber (focus) cards — no new tokens, all Tailwind defaults.

import React, { useEffect, useState } from "react";
import { Trophy, Flame } from "lucide-react";

import {
  getWeeklyTop10,
  getMyWeeklyRank,
  type LeaderboardEntry,
  type LeaderboardNeighborEntry,
} from "@/lib/leaderboard/leaderboardClient";
import { useAuth } from "@/providers/AuthProvider";
import { leaderboardCopy } from "./leaderboardCopy";

const shellBase =
  "w-full rounded-[20px] border border-indigo-200/70 bg-gradient-to-br from-indigo-50 to-white shadow-[0_10px_28px_rgba(79,70,229,0.08)] text-left";

export default function LeaderboardCard() {
  const { user } = useAuth();
  const [top, setTop] = useState<LeaderboardEntry[] | null>(null);
  const [neighbors, setNeighbors] = useState<LeaderboardNeighborEntry[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getWeeklyTop10(), getMyWeeklyRank(user?.id)])
      .then(([t, n]) => {
        if (cancelled) return;
        setTop(t);
        setNeighbors(n);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (loading && !top) {
    return <LoadingCard />;
  }

  const safeTop = top ?? [];
  const safeNeighbors = neighbors ?? [];
  const me = safeNeighbors.find((n) => n.isMe);
  const isInTop10 = me ? safeTop.some((t) => t.userId === me.userId) : false;
  const showNotOnBoard =
    !!me && me.points === 0 && !safeTop.some((t) => t.userId === me.userId);

  return (
    <div className={shellBase} style={{ padding: "16px 18px" }}>
      <Header />

      {safeTop.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SectionHeader
            en={leaderboardCopy.topListHeader.en}
            vi={leaderboardCopy.topListHeader.vi}
          />
          <ol className="mt-2 flex flex-col gap-1.5">
            {safeTop.map((entry) => (
              <Row
                key={entry.userId || `top-${entry.rank}`}
                entry={entry}
                highlight={!!me && entry.userId === me.userId}
              />
            ))}
          </ol>

          {/* Your spot — only render if user has a row AND isn't in top 10
              (otherwise their highlighted row above is enough). */}
          {user && me && !isInTop10 && !showNotOnBoard && (
            <>
              <div className="mt-4">
                <SectionHeader
                  en={leaderboardCopy.yourRankHeader.en}
                  vi={leaderboardCopy.yourRankHeader.vi}
                />
              </div>
              <ol className="mt-2 flex flex-col gap-1.5">
                {safeNeighbors.map((entry) => (
                  <Row
                    key={entry.userId || `nb-${entry.rank}`}
                    entry={entry}
                    highlight={entry.isMe}
                  />
                ))}
              </ol>
            </>
          )}

          {showNotOnBoard && (
            <div className="mt-4 rounded-[14px] border border-indigo-200/60 bg-white/70 px-3 py-3">
              <div className="text-sm font-bold text-indigo-900">
                {leaderboardCopy.notOnBoardTitle.en}
              </div>
              <div className="text-[12px] font-semibold text-indigo-700/70">
                {leaderboardCopy.notOnBoardTitle.vi}
              </div>
              <div className="mt-1 text-[13px] font-semibold leading-snug text-slate-600">
                {leaderboardCopy.notOnBoardBody.en}
              </div>
              <div className="mt-0.5 text-[12px] font-medium leading-snug text-slate-500">
                {leaderboardCopy.notOnBoardBody.vi}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Sub-views ─────────────────────────────────────────────────────────────

function Header() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-[52px] w-[52px] flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-indigo-400 to-indigo-500 shadow-[0_8px_20px_rgba(79,70,229,0.20)]">
        <Trophy className="h-6 w-6 text-white" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[18px] font-black tracking-tight text-indigo-900">
          {leaderboardCopy.title.en}
        </div>
        <div className="mt-0.5 text-[12px] font-semibold text-indigo-700/70">
          {leaderboardCopy.title.vi}
        </div>
        <div className="mt-1.5 text-[13px] font-semibold leading-snug text-slate-600">
          {leaderboardCopy.subtitle.en}
        </div>
        <div className="mt-0.5 text-[12px] font-medium leading-snug text-slate-500">
          {leaderboardCopy.subtitle.vi}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ en, vi }: { en: string; vi: string }) {
  return (
    <div className="mt-3">
      <div className="text-[12px] font-black uppercase tracking-wider text-indigo-700/80">
        {en}
      </div>
      <div className="text-[11px] font-semibold text-indigo-600/60">{vi}</div>
    </div>
  );
}

function Row({
  entry,
  highlight,
}: {
  entry: LeaderboardEntry | LeaderboardNeighborEntry;
  highlight: boolean;
}) {
  const displayName =
    entry.username && entry.username.trim().length > 0
      ? entry.username
      : leaderboardCopy.anonymousLabel.en;

  const rowClass = highlight
    ? "flex items-center gap-3 rounded-[14px] border border-indigo-300 bg-indigo-100/80 px-3 py-2"
    : "flex items-center gap-3 rounded-[14px] border border-indigo-200/60 bg-white/70 px-3 py-2";

  return (
    <li className={rowClass}>
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[12px] font-black text-indigo-800">
        {entry.rank}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-slate-800">
          {displayName}
          {highlight && (
            <span className="ml-2 rounded-full bg-indigo-500 px-1.5 py-0.5 text-[10px] font-black uppercase text-white">
              {leaderboardCopy.youAreHere.en}
            </span>
          )}
        </div>
        <div className="truncate text-[11px] text-slate-500">
          {entry.lessonsCompleted} {leaderboardCopy.lessonsLabel.en}
          {entry.streakDays > 0 && (
            <>
              {" · "}
              <Flame className="inline h-3 w-3 text-orange-500" aria-hidden />{" "}
              {entry.streakDays} {leaderboardCopy.streakLabel.en}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-[14px] font-black text-indigo-700">
          {entry.points}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600/60">
          {leaderboardCopy.pointsLabel.en}
        </div>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="mt-3 rounded-[14px] border border-indigo-200/60 bg-white/70 px-3 py-3">
      <div className="text-sm font-bold text-indigo-900">
        {leaderboardCopy.emptyTitle.en}
      </div>
      <div className="text-[12px] font-semibold text-indigo-700/70">
        {leaderboardCopy.emptyTitle.vi}
      </div>
      <div className="mt-1 text-[13px] font-semibold leading-snug text-slate-600">
        {leaderboardCopy.emptyBody.en}
      </div>
      <div className="mt-0.5 text-[12px] font-medium leading-snug text-slate-500">
        {leaderboardCopy.emptyBody.vi}
      </div>
    </div>
  );
}

function LoadingCard() {
  return (
    <div
      className={`${shellBase} animate-pulse`}
      style={{ padding: "16px 18px", minHeight: 92 }}
      aria-busy="true"
      aria-label={leaderboardCopy.loadingLabel.en}
    />
  );
}
