// FILE: src/lib/useEntitlements.ts
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

      // ✅ FIX: don't "return an object" from inside the effect (it does nothing).
      // Just set state and exit.
      if (!mercyAuth) {
        if (!alive) return;
        setData(null);
        setLoading(false);
        return;
      }

      const { data: raw, error } = await mercyAuth
        .from("my_entitlements")
        .select("vip_tier,vip_rank,features,updated_at")
        .maybeSingle(); // ✅ object-or-null; avoids array shape surprises

      if (!alive) return;

      if (error) {
        setData(null);
        setLoading(false);
        return;
      }

      // ✅ Defensive: if backend ever returns array, normalize to first row.
      const normalized = Array.isArray(raw) ? (raw[0] ?? null) : raw;

      setData((normalized as any) ?? null);
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