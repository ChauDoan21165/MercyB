// src/lib/useEntitlements.ts
import { useEffect, useMemo, useState } from "react";
import { mercyAuth } from "@/lib/mercyAuth";

type Ent = {
  vip_tier: string;
  vip_rank: number;
  features: Record<string, any>;
  updated_at: string;
};

function tierFromRank(rank: number): string {
  if (rank >= 9) return "vip9";
  if (rank >= 3) return "vip3";
  if (rank >= 1) return "vip1";
  return "free";
}

function safeSetLS(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

export function useEntitlements() {
  const [data, setData] = useState<Ent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);

      if (!mercyAuth) {
        if (!alive) return;
        setData(null);
        setLoading(false);
        return;
      }

      // 1) Get authed user id (needed for mb_user_effective_rank)
      const {
        data: userRes,
        error: userErr,
      } = await mercyAuth.auth.getUser();

      const userId = userRes?.user?.id ?? null;

      // 2) Fetch canonical vip_rank from the view
      let vipRank = 0;
      if (!userErr && userId) {
        const { data: rankData, error: rankErr } = await mercyAuth
          .from("mb_user_effective_rank")
          .select("vip_rank")
          .eq("user_id", userId);

        // rankData might be array (normal) or object (if you later switch to single/maybeSingle)
        const r =
          Array.isArray(rankData)
            ? (rankData?.[0] as any)?.vip_rank
            : (rankData as any)?.vip_rank;

        if (!rankErr && typeof r === "number" && Number.isFinite(r)) {
          vipRank = r;
        }
      }

      // 3) Best-effort fetch features from my_entitlements (if exists)
      let features: Record<string, any> = {};
      let updatedAt = new Date().toISOString();
      try {
        const { data: entData, error: entErr } = await mercyAuth
          .from("my_entitlements")
          .select("features,updated_at")
          .single();

        if (!entErr && entData) {
          const f = (entData as any)?.features;
          if (f && typeof f === "object") features = f;
          const ua = (entData as any)?.updated_at;
          if (typeof ua === "string" && ua) updatedAt = ua;
        }
      } catch {
        // ignore
      }

      const ent: Ent = {
        vip_rank: vipRank,
        vip_tier: tierFromRank(vipRank),
        features,
        updated_at: updatedAt,
      };

      // 4) IMPORTANT: persist so your existing room gate logic sees it
      safeSetLS("mb.vip_rank", String(vipRank));
      safeSetLS("mb.user.vip_rank", String(vipRank));
      safeSetLS("mb.profile.vip_rank", String(vipRank));

      if (!alive) return;
      setData(ent);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const features = useMemo(
    () => (data?.features ?? {}) as Record<string, any>,
    [data]
  );

  function hasFlag(key: string, fallback = false) {
    const v = features[key];
    if (typeof v === "boolean") return v;
    return fallback;
  }

  function getLimit(key: string, fallback: number) {
    const v = features[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v)))
      return Number(v);
    return fallback;
  }

  return { ent: data, features, loading, hasFlag, getLimit };
}