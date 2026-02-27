// FILE: src/pages/AccountPage.tsx
// PURPOSE: Account page UI (Tailwind).
// NOTE: Keep auth access flexible (auth.user OR auth.session.user) for legacy compatibility.
// STABLE FIX: do NOT depend on AuthProvider for a Supabase client.
// - Query public.mb_user_effective_rank using the app Supabase client singleton.
// - Use .maybeSingle() so the response is an OBJECT (not an array), avoiding vip_rank parsing bugs.
// - Fallbacks keep the page usable even if RLS/network fails.

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

// ✅ CHANGE THIS PATH if your supabase client lives elsewhere.
import { supabase } from "@/lib/supabaseClient";

export default function AccountPage() {
  const nav = useNavigate();
  const auth = useAuth() as any;

  const user = auth?.user ?? auth?.session?.user ?? null;
  const userId: string | null =
    typeof user?.id === "string" && user.id ? user.id : null;

  const [vipRank, setVipRank] = useState<number | null>(null);
  const [rankLoading, setRankLoading] = useState<boolean>(false);

  const email = useMemo(() => {
    const e = user?.email;
    if (typeof e === "string" && e.trim()) return e.trim();
    return user ? "Signed in" : "—";
  }, [user]);

  // ✅ Fetch effective VIP rank from DB view (canonical).
  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!userId) {
        setVipRank(null);
        return;
      }

      setRankLoading(true);
      try {
        const { data, error } = await supabase
          .from("mb_user_effective_rank")
          .select("vip_rank")
          .eq("user_id", userId)
          // ✅ KEY FIX: ensures `data` is an object (or null), not an array
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          setVipRank(null);
          return;
        }

        // ✅ Because of maybeSingle(), `data` is { vip_rank: number } | null
        const r = (data as any)?.vip_rank;
        if (typeof r === "number" && Number.isFinite(r)) setVipRank(r);
        else setVipRank(null);
      } catch {
        if (!cancelled) setVipRank(null);
      } finally {
        if (!cancelled) setRankLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const onSignOut = useCallback(async () => {
    try {
      const fn = auth?.signOut ?? auth?.logout;
      if (typeof fn === "function") {
        await fn();
      } else {
        // extra safety: try supabase signOut directly
        try {
          await supabase.auth.signOut();
        } catch {
          // ignore
        }
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
    if (typeof vipRank === "number" && vipRank > 0) return `VIP ${vipRank}`;
    return "Free";
  }, [user, vipRank, rankLoading]);

  const statusLabel = useMemo(() => {
    if (!user) return "Not signed in";
    if (rankLoading) return "Checking…";
    if (typeof vipRank === "number" && vipRank > 0) return "Active (VIP)";
    return "Active";
  }, [user, vipRank, rankLoading]);

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
                {typeof vipRank === "number" && vipRank > 0
                  ? "You have VIP access."
                  : "Keep it simple. Upgrade anytime."}
              </div>
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