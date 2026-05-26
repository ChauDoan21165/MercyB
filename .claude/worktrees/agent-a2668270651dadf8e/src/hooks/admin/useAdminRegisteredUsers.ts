// PATH: src/hooks/admin/useAdminRegisteredUsers.ts
//
// Calls the admin-list-registered-users edge function (auth.users-first
// admin user list). Defensive: any failure leaves rows empty + surfaces
// error string. Pagination is page/perPage with hasMore (listUsers
// doesn't return totalCount).

import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import type {
  RegisteredUserRow,
  RegisteredUserSubscriptionStatus,
} from "@/types/adminUsers";

const FUNCTION_NAME = "admin-list-registered-users";
const DEFAULT_PER_PAGE = 100;

interface RawUser {
  id?: string;
  email?: string | null;
  created_at?: string;
  last_sign_in_at?: string | null;
  provider?: string | null;
  has_profile?: boolean;
  is_admin?: boolean;
  subscription_status?: string;
  current_period_end?: string | null;
}

interface RawResponse {
  ok?: boolean;
  error?: string;
  users?: RawUser[];
  pagination?: {
    page?: number;
    perPage?: number;
    hasMore?: boolean;
    returned?: number;
  };
}

function normaliseStatus(raw: unknown): RegisteredUserSubscriptionStatus {
  const s = String(raw ?? "").trim().toLowerCase();
  if (s === "active" || s === "trialing" || s === "free") return s;
  return "unknown";
}

function normaliseRow(raw: RawUser): RegisteredUserRow | null {
  const id = typeof raw.id === "string" ? raw.id : "";
  if (!id) return null;
  return {
    id,
    email: typeof raw.email === "string" ? raw.email : null,
    createdAt: typeof raw.created_at === "string" ? raw.created_at : "",
    lastSignInAt:
      typeof raw.last_sign_in_at === "string" ? raw.last_sign_in_at : null,
    provider: typeof raw.provider === "string" ? raw.provider : null,
    hasProfile: Boolean(raw.has_profile),
    isAdmin: Boolean(raw.is_admin),
    subscriptionStatus: normaliseStatus(raw.subscription_status),
    currentPeriodEnd:
      typeof raw.current_period_end === "string" ? raw.current_period_end : null,
  };
}

export function useAdminRegisteredUsers(initialPerPage = DEFAULT_PER_PAGE) {
  const [users, setUsers] = useState<RegisteredUserRow[]>([]);
  const [page, setPage] = useState(1);
  const [perPage] = useState(initialPerPage);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (nextPage: number) => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: invokeError } = await supabase.functions.invoke<RawResponse>(
          FUNCTION_NAME,
          { body: { page: nextPage, perPage } },
        );

        if (invokeError) {
          throw new Error(invokeError.message || "Failed to load registered users.");
        }
        if (!data?.ok) {
          throw new Error(data?.error || "Edge function returned an error.");
        }

        const rows = (data.users ?? [])
          .map(normaliseRow)
          .filter((r): r is RegisteredUserRow => r !== null);

        setUsers(rows);
        setPage(nextPage);
        setHasMore(Boolean(data.pagination?.hasMore));
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : String(e));
        setUsers([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [perPage],
  );

  const refresh = useCallback(() => {
    void fetchPage(page);
  }, [fetchPage, page]);

  const goToPage = useCallback(
    (next: number) => {
      const clamped = Math.max(1, Math.floor(next));
      void fetchPage(clamped);
    },
    [fetchPage],
  );

  useEffect(() => {
    void fetchPage(1);
    // initial load only — explicit refresh / page changes use goToPage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    page,
    perPage,
    hasMore,
    loading,
    error,
    refresh,
    goToPage,
  };
}
