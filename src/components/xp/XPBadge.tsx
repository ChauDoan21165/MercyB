// src/components/xp/XPBadge.tsx
//
// Small badge for the Home header showing "Lv 12 · 1,247 XP". Tap →
// /xp. Hidden when the user has gamification_enabled = false. Shows
// a small "+N" toast when awardXPEvent fires.

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { levelForXP, levelProgress } from "@/lib/xp/levels";
import {
  XP_AWARDED_EVENT,
  type XPAwardedDetail,
} from "@/lib/xp/awardXPEventBus";

type UserXPRow = {
  total_xp: number | null;
  current_level: number | null;
  gamification_enabled: boolean | null;
};

export function XPBadge() {
  const { user } = useAuth();
  const [total, setTotal] = useState<number | null>(null);
  const [level, setLevel] = useState<number>(1);
  const [enabled, setEnabled] = useState<boolean>(true);
  const [toast, setToast] = useState<{ amount: number; key: number } | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) {
      setTotal(null);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("user_xp")
        .select("total_xp, current_level, gamification_enabled")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      const row = (data ?? null) as UserXPRow | null;
      const t = typeof row?.total_xp === "number" ? row.total_xp : 0;
      setTotal(t);
      setLevel(
        typeof row?.current_level === "number"
          ? row.current_level
          : levelForXP(t),
      );
      setEnabled(row?.gamification_enabled !== false);
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // Listen for XP awards to update the badge live and show a toast.
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<XPAwardedDetail>).detail;
      if (!detail) return;
      setTotal(detail.total_xp);
      setLevel(detail.current_level);
      if (detail.awarded > 0) {
        setToast({ amount: detail.awarded, key: Date.now() });
      }
    }
    window.addEventListener(XP_AWARDED_EVENT, handler as EventListener);
    return () => {
      window.removeEventListener(XP_AWARDED_EVENT, handler as EventListener);
    };
  }, []);

  // Auto-dismiss toast after 2.4s.
  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  if (!user?.id || total === null || !enabled) return null;

  const progress = levelProgress(total);
  const pct = Math.round(progress.fraction * 100);

  return (
    <div className="relative inline-flex items-center">
      <Link
        to="/xp"
        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900 hover:bg-emerald-100"
        aria-label={`Level ${level}, ${total} XP. Mở trang XP.`}
      >
        <span className="font-bold">Lv {level}</span>
        <span className="text-emerald-700">·</span>
        <span className="tabular-nums">{total.toLocaleString("vi-VN")} XP</span>
        {progress.span > 0 && (
          <span
            aria-hidden
            className="ml-1 hidden h-1 w-12 overflow-hidden rounded-full bg-emerald-200 sm:inline-block"
          >
            <span
              className="block h-full bg-emerald-600 transition-all"
              style={{ width: `${pct}%` }}
            />
          </span>
        )}
      </Link>

      {toast && (
        <span
          key={toast.key}
          className="pointer-events-none absolute -top-2 right-0 -translate-y-full rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white shadow animate-[fadeIn_0.2s_ease-out]"
        >
          +{toast.amount} XP
        </span>
      )}
    </div>
  );
}
