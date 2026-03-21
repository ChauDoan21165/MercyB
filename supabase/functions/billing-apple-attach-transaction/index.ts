import { createAdminClient } from "../_billing/client.ts";
import { error, json } from "../_billing/http.ts";
import { registerProviderEvent } from "../_billing/provider-events.ts";
import type { BillingEnvironment } from "../_billing/types.ts";

function normalizeEnvironment(value: unknown): BillingEnvironment {
  return value === "sandbox" || value === "test" ? value : "production";
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return error("Expected JSON body", 400);
  }

  const appUserId = typeof body.appUserId === "string" ? body.appUserId.trim() : "";
  const transactionId = typeof body.transactionId === "string" ? body.transactionId.trim() : "";
  const originalTransactionId = typeof body.originalTransactionId === "string"
    ? body.originalTransactionId.trim()
    : "";
  const environment = normalizeEnvironment((body as Record<string, unknown>).environment);

  if (!appUserId) {
    return error("appUserId is required", 400);
  }

  if (!transactionId && !originalTransactionId) {
    return error("transactionId or originalTransactionId is required", 400);
  }

  const providerEventId = transactionId || originalTransactionId;
  const eventKey = ["attach", "apple", appUserId, providerEventId].join(":");

  try {
    const supabase = createAdminClient();
    const result = await registerProviderEvent(supabase, {
      provider: "apple",
      environment,
      eventKey,
      providerEventId,
      eventType: "attach_transaction_requested",
      payload: body,
      metadata: {
        scaffold_only: true,
        route: "billing-apple-attach-transaction",
      },
    });

    return json({
      ok: true,
      queued: true,
      provider: "apple",
      environment,
      event: result,
      next_step:
        "TODO: verify/resolve Apple transaction -> normalize provider fields -> upsert public.subscriptions",
    }, { status: 202 });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
