import { isoNow, logWebhook } from "./core.ts";
import type { DBClient, StripeWebhookEvent } from "./types.ts";

function isMissingStripeWebhookEventsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const maybe = error as { code?: string; message?: unknown };

  return (
    maybe.code === "PGRST205" &&
    String(maybe.message ?? "").includes("public.stripe_webhook_events")
  );
}

export async function hasProcessedStripeWebhookEvent(
  supabase: DBClient,
  eventId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("stripe_webhook_events")
    .select("processed_at")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    if (isMissingStripeWebhookEventsTable(error)) {
      console.warn(
        "stripe-webhook stripe_webhook_events table missing; skipping replay short-circuit",
        error,
      );
      return false;
    }

    throw error;
  }

  return !!(data as { processed_at?: string | null } | null)?.processed_at;
}

export async function upsertStripeWebhookEventResult(params: {
  supabase: DBClient;
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">;
  processed: boolean;
  errorMessage?: string | null;
}): Promise<boolean> {
  const payload = {
    event_id: params.event.id,
    type: params.event.type,
    livemode:
      typeof params.event.livemode === "boolean"
        ? params.event.livemode
        : null,
    processed_at: params.processed ? isoNow() : null,
    error: params.errorMessage ?? null,
  };

  const { error } = await params.supabase
    .from("stripe_webhook_events")
    .upsert(payload, { onConflict: "event_id" });

  if (!error) return true;

  if (isMissingStripeWebhookEventsTable(error)) {
    console.warn(
      "stripe-webhook stripe_webhook_events table missing; skipping result mark",
      error,
    );
    return true;
  }

  logWebhook("error", "failed to upsert stripe webhook event result", {
    event_id: params.event.id,
    event_type: params.event.type,
    processed: params.processed,
    error_message: params.errorMessage ?? null,
    error,
  });

  throw error;
}

export async function markStripeWebhookEventProcessed(
  supabase: DBClient,
  event: Pick<StripeWebhookEvent, "id" | "type" | "livemode">,
): Promise<boolean> {
  return await upsertStripeWebhookEventResult({
    supabase,
    event,
    processed: true,
    errorMessage: null,
  });
}