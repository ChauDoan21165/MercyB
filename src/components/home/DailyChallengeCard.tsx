// src/components/home/DailyChallengeCard.tsx
//
// "Mercy đã chuẩn bị thử thách hôm nay" — top-of-Home card that
// surfaces the daily pronunciation challenge until the user
// completes it. Hides itself once the user has a completion for the
// current local day so the home page stays uncluttered.
//
// Gating:
//   - The whole card is gated by the `daily_challenge_enabled`
//     feature flag (default OFF until ramp).
//   - Anonymous users still see the prompt — clicking it routes to
//     /challenge, which handles the sign-in nudge for recording.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles } from "lucide-react";

import { useAuth } from "@/providers/AuthProvider";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { supabase } from "@/lib/supabaseClient";
import { fetchTodaysCompletion } from "@/lib/challenges/dailyChallenge";

type Props = {
  /** When true, render the phone-tight padding/sizes. */
  isPhone?: boolean;
};

export default function DailyChallengeCard({ isPhone = false }: Props) {
  const { user, isLoading: authLoading } = useAuth();
  const { enabled, loading: flagLoading } = useFeatureFlag(
    "daily_challenge_enabled",
    false,
  );
  const userId = user?.id ?? null;
  const [completedToday, setCompletedToday] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!userId) {
        if (!cancelled) setCompletedToday(false);
        return;
      }
      const row = await fetchTodaysCompletion(supabase, userId);
      if (!cancelled) setCompletedToday(Boolean(row));
    };
    if (!authLoading) void run();
    return () => {
      cancelled = true;
    };
  }, [authLoading, userId]);

  if (flagLoading || authLoading) return null;
  if (!enabled) return null;
  if (completedToday) return null;

  return (
    <Link
      to="/challenge"
      aria-label="Today's pronunciation challenge"
      data-testid="daily-challenge-card"
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          width: "100%",
          borderRadius: 20,
          padding: isPhone ? "16px 18px" : "18px 22px",
          background:
            "linear-gradient(150deg, #FFEDD5 0%, #FED7AA 50%, #FDBA74 100%)",
          border: "1px solid rgba(234,88,12,0.22)",
          boxShadow: "0 12px 30px rgba(234,88,12,0.14)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: "rgba(67,20,7,0.94)",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 9999,
            background: "rgba(67,20,7,0.92)",
            display: "grid",
            placeItems: "center",
            color: "#FFF7ED",
            flexShrink: 0,
          }}
        >
          <Sparkles size={22} aria-hidden />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: isPhone ? 17 : 19, fontWeight: 950, letterSpacing: -0.2 }}>
            Mercy đã chuẩn bị thử thách cho hôm nay
          </div>
          <div style={{ marginTop: 2, fontSize: 12, fontWeight: 700, opacity: 0.7 }}>
            Today&apos;s pronunciation challenge
          </div>
          <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, opacity: 0.85 }}>
            Một câu, một phút. Chạm để thử ngay.
          </div>
        </div>
        <ChevronRight size={22} aria-hidden style={{ flexShrink: 0 }} />
      </div>
    </Link>
  );
}
