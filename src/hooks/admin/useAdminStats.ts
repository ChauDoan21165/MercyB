// src/hooks/admin/useAdminStats.ts
/**
 * MercyBlade Blue Launch Map — v83.4 (AUTHORITATIVE)
 * Generated: 2025-12-22 (+0700)
 * Reporter: teacher GPT
 *
 * PURPOSE:
 * Minimal, reliable hook to fetch Admin KPIs from the `admin-stats` Edge Function.
 * Deterministic auth: always attach Bearer token if session exists.
 */

import { useCallback, useEffect, useMemo, useState } from "react";

// NOTE: Keep this import path aligned with your repo.
import { supabase } from "@/lib/supabaseClient";

export interface AdminStats {
  totalUsers: number;
  activeToday: number;
  totalRooms: number;
  revenueMonth: number;
}

export interface UseAdminStatsState {
  loading: boolean;
  error: string | null;
  stats: AdminStats | null;
  lastUpdatedAt: string | null;
  refresh: () => Promise<void>;
}

function normalizeError(err: unknown): string {
  if (!err) return "Unknown error";
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || "Error";
  try {
    return JSON.stringify(err);
  } catch {
    return "Unknown error";
  }
}

export function useAdminStats(): UseAdminStatsState {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Get session token (this is what Edge Function expects as Authorization)
      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      if (sessionErr) {
        setError(sessionErr.message || "Failed to read auth session");
        setStats(null);
        setLastUpdatedAt(null);
        return;
      }

      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        // Deterministic message: user is not logged in
        setError("Not logged in. Please sign in before opening /admin.");
        setStats(null);
        setLastUpdatedAt(null);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke("admin-stats", {
        body: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (fnError) {
        setError(fnError.message || "Failed to fetch admin stats");
        setStats(null);
        setLastUpdatedAt(null);
        return;
      }

      if (!data?.ok) {
        setError(data?.error || "Admin stats returned ok=false");
        setStats(null);
        setLastUpdatedAt(null);
        return;
      }

      const s = data?.stats as Partial<AdminStats> | undefined;

      const safeStats: AdminStats = {
        totalUsers: Number(s?.totalUsers ?? 0),
        activeToday: Number(s?.activeToday ?? 0),
        totalRooms: Number(s?.totalRooms ?? 0),
        revenueMonth: Number(s?.revenueMonth ?? 0),
      };

      setStats(safeStats);
      setLastUpdatedAt(new Date().toISOString());
    } catch (e) {
      setError(normalizeError(e));
      setStats(null);
      setLastUpdatedAt(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return useMemo(
    () => ({
      loading,
      error,
      stats,
      lastUpdatedAt,
      refresh,
    }),
    [loading, error, stats, lastUpdatedAt, refresh]
  );
}
