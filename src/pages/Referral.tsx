// src/pages/Referral.tsx
//
// A9 — Dedicated /referral page.
//
// AccountPage already embeds <ReferralCard /> + <ApplyReferralCodeForm />,
// but a referrer needs a single shareable URL to brag about their code.
// /referral is that page: same components, plus a "your earnings" panel
// that surfaces pending vs completed referrals and total free days.
//
// Bilingual (Vietnamese-first, English fallback).

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gift, Hourglass, CheckCircle2, Calendar } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { ReferralCard } from "@/components/referral/ReferralCard";
import { ApplyReferralCodeForm } from "@/components/referral/ApplyReferralCodeForm";
import {
  getReferralStats,
  type ReferralStats,
} from "@/lib/referral/referralClient";

export default function ReferralPage() {
  const { user, isLoading } = useAuth();
  const nav = useNavigate();
  const [stats, setStats] = useState<ReferralStats | null>(null);

  // RequireAuth wraps the route in AppRouter, but defend in case this
  // page is mounted standalone (Storybook, tests, deep-link race).
  useEffect(() => {
    if (!isLoading && !user) {
      nav("/signin?redirect=/referral", { replace: true });
    }
  }, [isLoading, user, nav]);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const s = await getReferralStats(user.id);
      if (!cancelled) setStats(s);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (!user) return null;

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-6">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Mời bạn bè
        </h1>
        <p className="text-sm text-muted-foreground">
          Invite friends — both of you get 7 free days.
        </p>
      </header>

      {/* Earnings — shown above the share card so users see the payoff first. */}
      <EarningsPanel stats={stats} />

      <section className="mt-5">
        <ReferralCard userId={user.id} />
      </section>

      <section className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Bạn có mã từ bạn bè?
        </h2>
        <ApplyReferralCodeForm userId={user.id} />
      </section>

      <section className="mt-8 rounded-lg border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Cách hoạt động</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Bạn bè đăng ký bằng mã của bạn → cả hai cùng được 7 ngày miễn phí.</li>
          <li>Phần thưởng cho bạn được kích hoạt khi bạn mới dùng app đến ngày 3.</li>
          <li>Tối đa 90 ngày miễn phí mỗi năm.</li>
        </ol>
        <p className="mt-3 text-[11px] opacity-80">
          Friends sign up with your code → both get 7 free days. Your reward
          activates once they reach Day 3. Max 90 free days per year.
        </p>
      </section>
    </main>
  );
}

function EarningsPanel({ stats }: { stats: ReferralStats | null }) {
  if (!stats) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Đang tải…
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <Tile
        icon={<Calendar className="h-4 w-4" />}
        label="Ngày miễn phí"
        labelEn="Free days earned"
        value={stats.totalDaysEarned}
      />
      <Tile
        icon={<CheckCircle2 className="h-4 w-4" />}
        label="Đã thành công"
        labelEn="Completed"
        value={stats.completedOwnerRewards}
      />
      <Tile
        icon={<Hourglass className="h-4 w-4" />}
        label="Đang chờ"
        labelEn="Pending"
        value={stats.pendingOwnerRewards}
      />
    </div>
  );
}

function Tile({
  icon,
  label,
  labelEn,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  labelEn: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-primary/15 bg-primary/5 p-3">
      <div className="flex items-center gap-1.5 text-primary">
        {icon}
        <Gift className="h-3 w-3 opacity-60" />
      </div>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      <p className="text-[11px] font-medium text-foreground">{label}</p>
      <p className="text-[10px] text-muted-foreground">{labelEn}</p>
    </div>
  );
}
