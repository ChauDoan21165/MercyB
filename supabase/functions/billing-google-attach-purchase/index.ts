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
  const purchaseToken = typeof body.purchaseToken === "string" ? body.purchaseToken.trim() : "";
  const productId = typeof body.productId === "string" ? body.productId.trim() : "";
  const environment = normalizeEnvironment((body as Record<string, unknown>).environment);

  if (!appUserId) {
    return error("appUserId is required", 400);
  }

  if (!purchaseToken || !productId) {
    return error("purchaseToken and productId are required", 400);
  }

  const eventKey = ["attach", "google", appUserId, purchaseToken].join(":");

  try {
    const supabase = createAdminClient();
    const result = await registerProviderEvent(supabase, {
      provider: "google",
      environment,
      eventKey,
      providerEventId: purchaseToken,
      eventType: "attach_purchase_requested",
      payload: body,
      metadata: {
        scaffold_only: true,
        route: "billing-google-attach-purchase",
      },
    });

    return json({
      ok: true,
      queued: true,
      provider: "google",
      environment,
      event: result,
      next_step:
        "TODO: verify Google purchase -> normalize provider fields -> upsert public.subscriptions",
    }, { status: 202 });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
