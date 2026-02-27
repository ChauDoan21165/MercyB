// FILE: src/lib/useEntitlements.ts
import { useEffect, useMemo, useState } from "react";
import { mercyAuth } from "@/lib/mercyAuth";

type Ent = {
  vip_tier: string;
  vip_rank: number;
  features: Record<string, any>;
  updated_at: string;
};

function tierFromRank(r: number): string {
  if (r >= 9) return "vip9";
  if (r >= 3) return "vip3";
  if (r >= 1) return "vip1";
  return "free";
}

function safeSetLS(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function parseVipRank(x: any): number {
  if (typeof x === "number" && Number.isFinite(x)) return x;
  if (typeof x === "string" && x.trim() && !Number.isNaN(Number(x))) return Number(x);
  return 0;
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

      try {
        // 1) Get authed user id
        const { data: userRes, error: userErr } = await mercyAuth.auth.getUser();
        const userId = userRes?.user?.id ?? null;

        // If not signed in, clear ent
        if (!userId) {
          if (!alive) return;
          setData(null);
          setLoading(false);
          return;
        }

        // 2) Canonical vip rank from view: mb_user_effective_rank
        let vipRank = 0;
        {
          const { data: rankData, error: rankErr } = await mercyAuth
            .from("mb_user_effective_rank")
            .select("vip_rank")
            .eq("user_id", userId)
            // IMPORTANT: view may return array; maybeSingle normalizes if possible
            .maybeSingle();

          if (!rankErr && rankData) {
            // maybeSingle => object, but keep array-safe fallback anyway
            vipRank = parseVipRank((rankData as any)?.vip_rank);
          } else {
            vipRank = 0;
          }
        }

        // 3) Best-effort entitlements row (features, updated_at, etc.)
        // If this fails, we still return a minimal ent object using vipRank.
        let ent: Ent | null = null;
        {
          const { data: entData, error: entErr } = await mercyAuth
            .from("my_entitlements")
            .select("vip_tier,vip_rank,features,updated_at")
            .maybeSingle();

          if (!entErr && entData) {
            const features = (entData as any)?.features ?? {};
            const updated_at = String((entData as any)?.updated_at ?? "");
            ent = {
              vip_tier: String((entData as any)?.vip_tier ?? tierFromRank(vipRank)),
              vip_rank: vipRank, // FORCE canonical
              features: typeof features === "object" && features ? features : {},
              updated_at,
            };
          }
        }

        if (!ent) {
          ent = {
            vip_tier: tierFromRank(vipRank),
            vip_rank: vipRank,
            features: {},
            updated_at: new Date().toISOString(),
          };
        }

        // 4) Write the same keys your app reads later
        safeSetLS("mb.vip_rank", String(vipRank));
        safeSetLS("mb.user.vip_rank", String(vipRank));
        safeSetLS("mb.profile.vip_rank", String(vipRank));

        if (!alive) return;
        setData(ent);
        setLoading(false);
      } catch {
        if (!alive) return;
        setData(null);
        setLoading(false);
      }
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
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) return Number(v);
    return fallback;
  }

  return { ent: data, features, loading, hasFlag, getLimit };
}