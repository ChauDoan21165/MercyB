import { supabase } from "@/integrations/supabase/client";
import type { SubscriptionRow } from "./types";

export async function getSubscriptionsByUserId(
  userId: string
): Promise<SubscriptionRow[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("user_id, provider, status, current_period_end, cancel_at_period_end, ended_at")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Failed to load subscriptions: ${error.message}`);
  }

  return (data ?? []) as SubscriptionRow[];
}