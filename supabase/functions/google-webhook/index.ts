// supabase/functions/google-webhook/index.ts
//
// C4 fix — verify the Google-signed Pub/Sub OIDC JWT before logging
// the RTDN. Tampered or wrong-issuer messages now return 401 and
// never reach `registerProviderEvent`.
//
// Pub/Sub push delivery includes:
//   Authorization: Bearer <Google-signed JWT>
// We verify:
//   - signature (RS256, key from googleapis.com/oauth2/v3/certs)
//   - iss == accounts.google.com
//   - aud == GOOGLE_PUBSUB_AUDIENCE
//   - email == GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL
//   - email_verified == true
//   - exp not past
//
// The original logging behaviour on the success path is preserved;
// the only change is `metadata.signature_verified` now flips to true.

import { createAdminClient } from "../_billing/client.ts";
import { sha256Hex } from "../_billing/crypto.ts";
import { error, json } from "../_billing/http.ts";
import { registerProviderEvent } from "../_billing/provider-events.ts";
import type { BillingEnvironment } from "../_billing/types.ts";
import { verifyGooglePubsubAuth } from "../_billing/verifyGoogleJwt.ts";

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

function getRequiredEnv(name: string): string | null {
  const v = Deno.env.get(name);
  return v && v.length > 0 ? v : null;
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

  // ── C4: signature verification ─────────────────────────────────────────
  // Pub/Sub push includes an OIDC JWT in Authorization. Without
  // GOOGLE_PUBSUB_AUDIENCE + GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL the
  // function refuses to start the verifier — a deployment without
  // those env vars is misconfiguration, not "trust the request".
  const expectedAudience = getRequiredEnv("GOOGLE_PUBSUB_AUDIENCE");
  const expectedEmail = getRequiredEnv("GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL");
  if (!expectedAudience || !expectedEmail) {
    console.error(
      "[google-webhook] missing GOOGLE_PUBSUB_AUDIENCE or GOOGLE_PUBSUB_SERVICE_ACCOUNT_EMAIL",
    );
    return error("Webhook is not configured", 500);
  }

  const verification = await verifyGooglePubsubAuth(
    req.headers.get("authorization"),
    {
      expectedAudience,
      expectedEmail,
    },
  );

  if (!verification.ok || !verification.claims) {
    try {
      const supabase = createAdminClient();
      await registerProviderEvent(supabase, {
        provider: "google",
        environment: "production",
        eventKey: `google-webhook:rejected:${await sha256Hex(rawBody || "{}")}`,
        providerEventId: null,
        eventType: "google_webhook_signature_rejected",
        payload: { rawBodySize: rawBody.length },
        headers,
        metadata: {
          route: "google-webhook",
          signature_verified: false,
          rejection_reason: verification.reason ?? "unknown",
        },
      });
    } catch (logErr) {
      console.warn("[google-webhook] failed to log rejection:", logErr);
    }
    return error("Signature verification failed", 401, {
      reason: verification.reason,
    });
  }

  const pubSubPayload = body && typeof body === "object"
    ? decodePubSubData(body as Record<string, unknown>)
    : null;
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
        signature_verified: true,
        verified_email: verification.claims.email,
      },
    });

    return json({
      ok: true,
      accepted: true,
      provider: "google",
      environment,
      event: result,
      next_step:
        "TODO: resolve stable subscription identity from verified RTDN payload, then project into public.subscriptions",
    }, { status: 202 });
  } catch (err) {
    return error(err instanceof Error ? err.message : "Unexpected error", 500);
  }
});
