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

function decodePubSubData(body: Record<string, unknown>): unknown {
  const data = body?.message && typeof body.message === "object"
    ? (body.message as Record<string, unknown>).data
    : null;

  if (typeof data !== "string" || !data) return null;

  try {
    const decoded = atob(data);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
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
  const pubSubPayload = body && typeof body === "object" ? decodePubSubData(body as Record<string, unknown>) : null;

  // Scaffold only:
  // - no Google signature verification yet
  // - no RTDN normalization yet
  // - no mutation of public.subscriptions yet
  const messageId = typeof body?.message?.messageId === "string" ? body.message.messageId : null;
  const environment = normalizeEnvironment(
    typeof pubSubPayload === "object" && pubSubPayload !== null
      ? (pubSubPayload as Record<string, unknown>).environment
      : undefined,
  );
  const eventKey = messageId ?? `google-webhook:${await sha256Hex(rawBody || JSON.stringify(body))}`;

  try {
    const supabase = createAdminClient();
    const result = await registerProviderEvent(supabase, {
      provider: "google",
      environment,
      eventKey,
      providerEventId: messageId,
      eventType: typeof pubSubPayload === "object" && pubSubPayload !== null
        ? ((pubSubPayload as Record<string, unknown>).notificationType as string | undefined) ?? "google_webhook_received"
        : "google_webhook_received",
      payload: {
        envelope: body,
        decodedMessage: pubSubPayload,
      },
      headers,
      metadata: {
        scaffold_only: true,
        route: "google-webhook",
        signature_verified: false,
      },
    });

    return json({
      ok: true,
      accepted: true,
      provider: "google",
      environment,
      event: result,
      next_step:
        "TODO: verify Google RTDN message, resolve stable subscription identity, then project into public.subscriptions",
    }, { status: 202 });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
