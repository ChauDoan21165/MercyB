// FILE: src/billing/recomputeAndPersistEntitlement.ts

import type { EntitlementResult, SubscriptionRow } from "./types";

type SupabaseLike = {
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

export async function recomputeAndPersistEntitlement(
  userId: string,
): Promise<EntitlementResult> {
  const { deriveEntitlementFromSubscriptions } = await import(
    "./subscriptionRepository"
  );

  const supabase = await getSupabase();

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