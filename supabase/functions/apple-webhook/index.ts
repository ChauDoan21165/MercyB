import { createAdminClient } from "../_billing/client.ts";
import { sha256Hex } from "../_billing/crypto.ts";
import { error, json } from "../_billing/http.ts";
import { registerProviderEvent } from "../_billing/provider-events.ts";
import type { BillingEnvironment } from "../_billing/types.ts";

function requestHeaders(req: Request): Record<string, string> {
  return Object.fromEntries(req.headers.entries());
}

function normalizeEnvironment(value: unknown): BillingEnvironment {
  return value === "sandbox" || value === "test" ? value : "production";
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  const rawBody = await req.text();
  const body = (() => {
    try {
      return rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return null;
    }
  })();
  if (body === null) {
    return error("Expected valid JSON body", 400);
  }
  const headers = requestHeaders(req);

  // Scaffold only:
  // - no Apple signature verification yet
  // - no signedPayload decoding yet
  // - no mutation of public.subscriptions yet
  const providerEventId = typeof body?.notificationUUID === "string" ? body.notificationUUID : null;
  const environment = normalizeEnvironment(body?.environment);
  const eventKey = providerEventId ?? `apple-webhook:${await sha256Hex(rawBody || JSON.stringify(body))}`;

  try {
    const supabase = createAdminClient();
    const result = await registerProviderEvent(supabase, {
      provider: "apple",
      environment,
      eventKey,
      providerEventId,
      eventType: typeof body?.notificationType === "string" ? body.notificationType : "apple_webhook_received",
      payload: body,
      headers,
      metadata: {
        scaffold_only: true,
        route: "apple-webhook",
        signature_verified: false,
      },
    });

    return json({
      ok: true,
      accepted: true,
      provider: "apple",
      environment,
      event: result,
      next_step:
        "TODO: verify Apple notification, derive stable subscription identifier, then project into public.subscriptions",
    }, { status: 202 });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
