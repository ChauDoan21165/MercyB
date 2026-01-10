// src/lib/useEntitlements.ts
import { useEffect, useMemo, useState } from "react";
import { mercyAuth } from "@/lib/mercyAuth";

type Ent = {
  vip_tier: string;
  vip_rank: number;
  features: Record<string, any>;
  updated_at: string;
};

export function useEntitlements() {
  const [data, setData] = useState<Ent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      const { data, error } = await mercyAuth
        .from("my_entitlements")
        .select("vip_tier,vip_rank,features,updated_at")
        .single();

      if (!alive) return;

      if (error) {
        // best-effort: do not throw
        setData(null);
        setLoading(false);
        return;
      }

      setData(data as any);
      setLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, []);

  const features = useMemo(() => (data?.features ?? {}) as Record<string, any>, [data]);

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
