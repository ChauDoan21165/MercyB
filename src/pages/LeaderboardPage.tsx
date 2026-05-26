// src/pages/LeaderboardPage.tsx — /leaderboard
//
// Public weekly pronunciation leaderboard. Anon-viewable; signed-in
// users see their own row highlighted and a link to opt in via Account.

import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { WeeklyLeaderboard } from "@/components/leaderboard/WeeklyLeaderboard";
import { WEEKLY_LB_COPY } from "@/components/leaderboard/weeklyLeaderboardCopy";
import { useAuth } from "@/providers/AuthProvider";

export default function LeaderboardPage() {
  const { user } = useAuth();
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {WEEKLY_LB_COPY.pageTitle.vi}
          </h1>
          <p className="text-sm text-slate-500">{WEEKLY_LB_COPY.pageTitle.en}</p>
        </div>
        {user && (
          <Button asChild size="sm" variant="ghost">
            <Link to="/account">{WEEKLY_LB_COPY.optInTitle.vi}</Link>
          </Button>
        )}
      </header>

      <WeeklyLeaderboard />
    </div>
  );
}
