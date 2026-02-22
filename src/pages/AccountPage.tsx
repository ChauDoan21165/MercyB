// FILE: src/pages/AccountPage.tsx
// PURPOSE: Account page UI (Tailwind).
// NOTE: Keep auth access flexible (auth.user OR auth.session.user) for legacy compatibility.
// FIX: show real plan (VIP rank) by reading public.mb_user_effective_rank.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

type EffectiveRankRow = {
  user_id: string;
  vip_rank: number;
};

export default function AccountPage() {
  const nav = useNavigate();
  const auth = useAuth() as any;

  const user = auth?.user ?? auth?.session?.user ?? null;

  // Try common client names. (We’ll harden AuthProvider if none exists.)
  const supabase =
    auth?.supabase ?? auth?.client ?? auth?.sb ?? auth?.supabaseClient ?? null;

  const [vipRank, setVipRank] = useState<number | null>(null);
  const [rankLoading, setRankLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    async function loadRank() {
      if (!user?.id || !supabase) {
        setVipRank(null);
        return;
      }

      setRankLoading(true);
      try {
        const { data, error } = await supabase
          .from("mb_user_effective_rank")
          .select("user_id,vip_rank")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!alive) return;

        if (error) {
          // Don’t crash Account page; just fall back.
          setVipRank(null);
          return;
        }

        const row = data as EffectiveRankRow | null;
        const rank =
          row && typeof row.vip_rank === "number" ? row.vip_rank : null;

        setVipRank(rank);
      } catch {
        if (!alive) return;
        setVipRank(null);
      } finally {
        if (!alive) return;
        setRankLoading(false);
      }
    }

    loadRank();
    return () => {
      alive = false;
    };
  }, [supabase, user?.id]);

  const email = useMemo(() => {
    const e = user?.email;
    if (typeof e === "string" && e.trim()) return e.trim();
    return user ? "Signed in" : "—";
  }, [user]);

  const onSignOut = useCallback(async () => {
    try {
      const fn = auth?.signOut ?? auth?.logout;
      if (typeof fn === "function") {
        await fn();
      }
    } catch {
      // ignore
    } finally {
      nav("/signin");
    }
  }, [auth, nav]);

  const planLabel = useMemo(() => {
    if (!user) return "Signed out";
    if (rankLoading) return "Checking…";
    const r = typeof vipRank === "number" ? vipRank : 0;
    return r >= 1 ? `VIP ${r}` : "Free";
  }, [user, rankLoading, vipRank]);

  const statusLabel = useMemo(() => {
    if (!user) return "Not signed in";
    const r = typeof vipRank === "number" ? vipRank : 0;
    return r >= 1 ? "Active (VIP)" : "Active";
  }, [user, vipRank]);

  const pill =
    "px-4 py-2 rounded-full border border-black/15 font-semibold text-sm hover:bg-black/5 active:bg-black/10 transition";

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-10">
      <div className="rounded-2xl border border-black/10 bg-white shadow-sm p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-black tracking-tight mb-2">Account</h1>
            <p className="text-sm opacity-70">
              Your identity and access inside Mercy Blade.
            </p>
          </div>

          <div className="flex gap-2">
            <Link className={pill} to="/upgrade">
              Upgrade
            </Link>
            <button type="button" className={pill} onClick={onSignOut}>
              Sign out
            </button>
          </div>
        </div>

        {/* Info Blocks */}
        <div className="mt-8 grid gap-4">
          {/* Email */}
          <div className="rounded-xl border border-black/10 bg-white/70 p-5">
            <div className="text-xs font-bold tracking-wider uppercase opacity-60">
              Email
            </div>
            <div className="mt-2 text-lg font-semibold break-all">{email}</div>
          </div>

          {/* Plan + Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-black/10 bg-white/70 p-5">
              <div className="text-xs font-bold tracking-wider uppercase opacity-60">
                Plan
              </div>
              <div className="mt-2 text-lg font-semibold">{planLabel}</div>
              <div className="mt-2 text-sm opacity-70">
                {planLabel.startsWith("VIP")
                  ? "Your VIP access is active."
                  : "Keep it simple. Upgrade anytime."}
              </div>

              {/* Optional tiny debug hint if client missing */}
              {user && !supabase ? (
                <div className="mt-3 text-xs text-red-600/80">
                  Note: Supabase client not found in AuthProvider — plan may not
                  auto-refresh.
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-black/10 bg-white/70 p-5">
              <div className="text-xs font-bold tracking-wider uppercase opacity-60">
                Status
              </div>
              <div className="mt-2 text-lg font-semibold">{statusLabel}</div>
              <div className="mt-2 text-sm opacity-70">
                {user
                  ? "You’re signed in and ready to continue your journey."
                  : "Please sign in to access your rooms."}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Link className={pill} to="/tiers">
              Browse tiers
            </Link>
            <Link className={pill} to="/rooms">
              Browse rooms
            </Link>
            <Link className={pill} to="/">
              Home
            </Link>
          </div>

          {/* Mercy tone */}
          <div className="pt-6 text-sm text-black/60">
            Mercy Blade is built for calm progress — small steps, every day.
          </div>
        </div>
      </div>
    </div>
  );
}