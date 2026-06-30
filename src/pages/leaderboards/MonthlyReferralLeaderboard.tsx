// src/pages/leaderboards/MonthlyReferralLeaderboard.tsx — /leaderboard/referral
//
// Public monthly referral leaderboard. Anon-viewable. Tabs: this month
// / last month / all time. Mobile-first; bilingual VI primary.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import {
  getMonthlyTop,
  getAllTimeTop,
  monthStartIso,
  lastMonthStartIso,
  type MonthlyLeaderboardRow,
  type AllTimeLeaderboardRow,
  type Period,
} from "@/lib/referral/leaderboardClient";
import { getOptInStatus } from "@/lib/referral/leaderboardOptIn";
import { REFERRAL_LB_COPY } from "@/components/leaderboard/referralLeaderboardCopy";

type Row =
  | (MonthlyLeaderboardRow & { _kind: "monthly" })
  | (AllTimeLeaderboardRow & { _kind: "allTime" });

export default function MonthlyReferralLeaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>("this_month");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [optedIn, setOptedIn] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    void (async () => {
      let result: Row[];
      if (period === "all_time") {
        const list = await getAllTimeTop(100);
        result = list.map((r) => ({ ...r, _kind: "allTime" as const }));
      } else {
        const monthStart =
          period === "this_month" ? monthStartIso() : lastMonthStartIso();
        const list = await getMonthlyTop(monthStart, 100);
        result = list.map((r) => ({ ...r, _kind: "monthly" as const }));
      }
      if (cancelled) return;
      setRows(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [period]);

  useEffect(() => {
    if (!user?.id) {
      setOptedIn(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      const status = await getOptInStatus(user.id);
      if (cancelled) return;
      setOptedIn(status.optedIn);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const isLoading = rows === null;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          {REFERRAL_LB_COPY.pageTitle.vi}
        </h1>
        <p className="text-sm text-slate-600">
          {REFERRAL_LB_COPY.pageTitle.en}
        </p>
        <p className="mt-2 text-sm text-slate-600">
          {REFERRAL_LB_COPY.pageIntro.vi}
        </p>
      </header>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label={REFERRAL_LB_COPY.pageTitle.vi}
        className="mb-3 flex gap-2 overflow-x-auto"
      >
        <PeriodTab active={period === "this_month"} onClick={() => setPeriod("this_month")}>
          {REFERRAL_LB_COPY.thisMonth.vi}
        </PeriodTab>
        <PeriodTab active={period === "last_month"} onClick={() => setPeriod("last_month")}>
          {REFERRAL_LB_COPY.lastMonth.vi}
        </PeriodTab>
        <PeriodTab active={period === "all_time"} onClick={() => setPeriod("all_time")}>
          {REFERRAL_LB_COPY.allTime.vi}
        </PeriodTab>
      </div>

      {/* Header card with caller status */}
      <div className="mb-3 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">
            {REFERRAL_LB_COPY.pageTitle.vi}
          </h2>
        </div>

        {user && !optedIn && (
          <p className="mt-3 text-xs text-amber-700">
            {REFERRAL_LB_COPY.notOnBoard.vi}{" "}
            <Link
              to="/account#referral-leaderboard"
              className="font-medium underline"
            >
              {REFERRAL_LB_COPY.optInTitle.vi}
            </Link>
          </p>
        )}

        {!user && (
          <p className="mt-3 text-xs text-slate-700">
            <Link
              to="/signin"
              className="font-medium text-indigo-700 underline"
            >
              {REFERRAL_LB_COPY.signupCta.vi}
            </Link>
          </p>
        )}
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          {REFERRAL_LB_COPY.loading.vi}
        </p>
      ) : rows.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          {REFERRAL_LB_COPY.empty.vi}
        </p>
      ) : (
        <ol className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {rows.map((row) => {
            return (
              <li
                key={`${row._kind}-${row.rank}-${row.display_name}`}
                className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5 last:border-b-0"
              >
                <span
                  className={
                    "w-8 shrink-0 text-right text-xs font-mono " +
                    (row.rank <= 3
                      ? "text-amber-600 font-bold"
                      : "text-slate-600")
                  }
                >
                  #{row.rank}
                </span>
                <span className="flex-1 truncate text-sm text-slate-800">
                  {row.display_name}
                </span>
                <span className="w-16 text-right text-sm tabular-nums text-slate-700">
                  {row._kind === "monthly"
                    ? row.total_referrals_this_month
                    : row.total_referrals}
                </span>
                <span className="hidden w-16 text-right text-xs tabular-nums text-slate-600 sm:inline-block">
                  {row._kind === "monthly"
                    ? row.successful_conversions
                    : row.total_premium_conversions}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

function PeriodTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={
        "rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition " +
        (active
          ? "bg-indigo-600 text-white"
          : "bg-slate-100 text-slate-700 hover:bg-slate-200")
      }
    >
      {children}
    </button>
  );
}
