// FILE: src/billing/recomputeAndPersistEntitlement.ts

import type { EntitlementResult, SubscriptionRow } from "./types";

export type SupabaseLike = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (column: string, value: string) => Promise<{
        data?: unknown;
        error?: { message: string } | null;
      }>;
    };
    update: (values: unknown) => {
      eq: (column: string, value: string) => Promise<{
        data?: unknown;
        error?: { message: string } | null;
      }>;
    };
  };
};

async function getSupabase(): Promise<SupabaseLike> {
  const dynamicImport = Function("path", "return import(path)") as (
    path: string,
  ) => Promise<unknown>;

  const mod = await dynamicImport("@/integrations/supabase/client");

  return (mod as { supabase: unknown }).supabase as SupabaseLike;
}

/**
 * Recompute a user's entitlement from `subscriptions` and persist the
 * derived `premium_*` columns to `profiles`.
 *
 * @param client Optional injected Supabase-like client. Defaults to the
 *   real browser singleton via `getSupabase()` — existing callers pass
 *   only `userId` and are unaffected (zero behavior change). The param
 *   exists purely as a test seam: the default path goes through
 *   `Function("path","return import(path)")(...)`, a runtime-constructed
 *   import that vitest's `vi.mock` cannot intercept, so injecting the
 *   client is the only way to unit-test the read→derive→write
 *   orchestration. The follow-up tests-only PR exercises this seam (kept
 *   separate per one-PR-per-concern: this PR is the refactor only).
 */
export async function recomputeAndPersistEntitlement(
  userId: string,
  client?: SupabaseLike,
): Promise<EntitlementResult> {
  const { deriveEntitlementFromSubscriptions } = await import(
    "./subscriptionRepository"
  );

  const supabase = client ?? (await getSupabase());

  const { data, error } = await supabase
    .from("subscriptions")
    .select("status,current_period_end,provider")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to load subscriptions: ${error.message}`);
  }

  const entitlement = deriveEntitlementFromSubscriptions(
    (data ?? []) as Array<
      Pick<SubscriptionRow, "status" | "current_period_end" | "provider">
    >,
  );

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      premium_status: entitlement.status,
      premium_expires_at: entitlement.expires_at,
      premium_source: entitlement.source,
    })
    .eq("id", userId);

  if (updateError) {
    throw new Error(`Failed to persist entitlement: ${updateError.message}`);
  }

  return entitlement;
}