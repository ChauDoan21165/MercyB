// File: supabase/functions/billing-google-attach-purchase/index.ts

import { createAdminClient } from "../_billing/client.ts";
import { error, json } from "../_billing/http.ts";
import { registerProviderEvent } from "../_billing/provider-events.ts";
import type { BillingEnvironment } from "../_billing/types.ts";

type JsonRecord = Record<string, unknown>;

type GoogleExternalAccountIdentifiers = {
  obfuscatedExternalAccountId?: string;
  obfuscatedExternalProfileId?: string;
};

type GoogleOfferDetails = {
  basePlanId?: string;
  offerId?: string;
  offerTags?: string[];
};

type GoogleAutoRenewingPlan = {
  autoRenewEnabled?: boolean;
};

type GoogleLineItem = {
  productId?: string;
  expiryTime?: string;
  offerDetails?: GoogleOfferDetails;
  autoRenewingPlan?: GoogleAutoRenewingPlan;
};

type GoogleCanceledUserInitiatedCancellation = {
  cancelTime?: string;
};

type GoogleCanceledStateContext = {
  userInitiatedCancellation?: GoogleCanceledUserInitiatedCancellation;
};

type GooglePausedStateContext = {
  autoResumeTime?: string;
};

type GoogleSubscriptionPurchaseV2 = {
  kind?: string;
  startTime?: string;
  regionCode?: string;
  subscriptionState?: string;
  latestOrderId?: string;
  acknowledgementState?: string;
  lineItems?: GoogleLineItem[];
  externalAccountIdentifiers?: GoogleExternalAccountIdentifiers;
  linkedPurchaseToken?: string;
  canceledStateContext?: GoogleCanceledStateContext;
  pausedStateContext?: GooglePausedStateContext;
  testPurchase?: Record<string, unknown>;
};

type CanonicalStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "canceled"
  | "past_due"
  | "paused"
  | "expired"
  | "incomplete";

type ProviderEventResult = {
  id: string;
  isNew: boolean;
  deliveryCount: number;
  processStatus: string;
};

const GOOGLE_ANDROID_PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";

function normalizeEnvironment(value: unknown): BillingEnvironment {
  return value === "sandbox" || value === "test" ? value : "production";
}

function firstNonEmptyString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return null;
}

function toIsoOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function nowIso(): string {
  return new Date().toISOString();
}

function base64UrlEncode(input: Uint8Array | string): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const cleaned = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

async function signJwtRs256(payload: JsonRecord, privateKeyPem: string): Promise<string> {
  const encodedHeader = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(privateKeyPem),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  return `${signingInput}.${base64UrlEncode(new Uint8Array(signature))}`;
}

function getGoogleCredentials(): { clientEmail: string; privateKey: string } {
  const rawJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
  if (rawJson) {
    const parsed = JSON.parse(rawJson);
    const clientEmail = firstNonEmptyString(parsed.client_email);
    const privateKey = firstNonEmptyString(parsed.private_key);
    if (clientEmail && privateKey) {
      return { clientEmail, privateKey };
    }
  }

  const clientEmail = firstNonEmptyString(Deno.env.get("GOOGLE_CLIENT_EMAIL"));
  const privateKey = firstNonEmptyString(Deno.env.get("GOOGLE_PRIVATE_KEY"))?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Missing Google service account credentials. Set GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_CLIENT_EMAIL + GOOGLE_PRIVATE_KEY.",
    );
  }

  return { clientEmail, privateKey };
}

async function getGoogleAccessToken(): Promise<string> {
  const { clientEmail, privateKey } = getGoogleCredentials();
  const now = Math.floor(Date.now() / 1000);

  const assertion = await signJwtRs256(
    {
      iss: clientEmail,
      scope: GOOGLE_ANDROID_PUBLISHER_SCOPE,
      aud: GOOGLE_OAUTH_TOKEN_URL,
      iat: now,
      exp: now + 3600,
    },
    privateKey,
  );

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to obtain Google access token: ${response.status} ${text}`);
  }

  const payload = await response.json();
  const accessToken = firstNonEmptyString(payload.access_token);
  if (!accessToken) {
    throw new Error("Google OAuth response did not include access_token");
  }

  return accessToken;
}

async function fetchGoogleSubscriptionPurchase(
  packageName: string,
  purchaseToken: string,
): Promise<GoogleSubscriptionPurchaseV2> {
  const accessToken = await getGoogleAccessToken();
  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Google subscription lookup failed: ${response.status} ${text}`);
  }

  return JSON.parse(text) as GoogleSubscriptionPurchaseV2;
}

async function acknowledgeGoogleSubscriptionPurchase(
  packageName: string,
  productId: string,
  purchaseToken: string,
): Promise<void> {
  const accessToken = await getGoogleAccessToken();
  const url =
    `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${encodeURIComponent(packageName)}/purchases/subscriptions/${encodeURIComponent(productId)}/tokens/${encodeURIComponent(purchaseToken)}:acknowledge`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google subscription acknowledge failed: ${response.status} ${text}`);
  }
}

function getPrimaryLineItem(
  purchase: GoogleSubscriptionPurchaseV2,
  requestedProductId: string,
): GoogleLineItem | null {
  const lineItems = Array.isArray(purchase.lineItems) ? purchase.lineItems : [];
  const exact = lineItems.find((item) => item?.productId === requestedProductId);
  if (exact) return exact;

  const withExpiry = [...lineItems]
    .filter((item) => item?.expiryTime)
    .sort((a, b) => {
      const aTime = new Date(a.expiryTime ?? 0).getTime();
      const bTime = new Date(b.expiryTime ?? 0).getTime();
      return bTime - aTime;
    });

  return withExpiry[0] ?? lineItems[0] ?? null;
}

function deriveCanonicalStatus(
  purchase: GoogleSubscriptionPurchaseV2,
  lineItem: GoogleLineItem | null,
): CanonicalStatus {
  switch (purchase.subscriptionState ?? "") {
    case "SUBSCRIPTION_STATE_ACTIVE":
      return "active";
    case "SUBSCRIPTION_STATE_IN_GRACE_PERIOD":
      return "grace_period";
    case "SUBSCRIPTION_STATE_CANCELED":
      return "canceled";
    case "SUBSCRIPTION_STATE_ON_HOLD":
      return "past_due";
    case "SUBSCRIPTION_STATE_PAUSED":
      return "paused";
    case "SUBSCRIPTION_STATE_EXPIRED":
      return "expired";
    case "SUBSCRIPTION_STATE_PENDING":
    case "SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED":
      return "incomplete";
    default: {
      const expiry = toIsoOrNull(lineItem?.expiryTime);
      if (expiry && new Date(expiry).getTime() > Date.now()) {
        return "active";
      }
      return "expired";
    }
  }
}

function isPremiumStatus(status: CanonicalStatus | string, currentPeriodEndAt: string | null): boolean {
  if (status === "active" || status === "trialing" || status === "grace_period") {
    return true;
  }

  if (status === "canceled" && currentPeriodEndAt) {
    return new Date(currentPeriodEndAt).getTime() > Date.now();
  }

  return false;
}

function buildProviderPriceId(lineItem: GoogleLineItem | null, fallbackProductId: string): string {
  const productId = firstNonEmptyString(lineItem?.productId, fallbackProductId) ?? fallbackProductId;
  const basePlanId = firstNonEmptyString(lineItem?.offerDetails?.basePlanId) ?? "base";
  const offerId = firstNonEmptyString(lineItem?.offerDetails?.offerId) ?? "base";
  return `google:${productId}:${basePlanId}:${offerId}`;
}

function buildSubscriptionRow(args: {
  appUserId: string;
  purchaseToken: string;
  requestedProductId: string;
  packageName: string;
  environment: BillingEnvironment;
  purchase: GoogleSubscriptionPurchaseV2;
}): JsonRecord {
  const { appUserId, purchaseToken, requestedProductId, packageName, environment, purchase } = args;
  const lineItem = getPrimaryLineItem(purchase, requestedProductId);

  const status = deriveCanonicalStatus(purchase, lineItem);
  const providerProductId = firstNonEmptyString(lineItem?.productId, requestedProductId) ?? requestedProductId;
  const currentPeriodStartAt = toIsoOrNull(purchase.startTime) ?? nowIso();
  const currentPeriodEndAt = toIsoOrNull(lineItem?.expiryTime);
  const canceledAt = toIsoOrNull(purchase.canceledStateContext?.userInitiatedCancellation?.cancelTime);
  const providerCustomerId =
    firstNonEmptyString(purchase.externalAccountIdentifiers?.obfuscatedExternalAccountId, appUserId) ?? appUserId;
  const providerPriceId = buildProviderPriceId(lineItem, requestedProductId);

  return {
    user_id: appUserId,
    status,
    provider: "google",
    provider_subscription_id: purchaseToken,
    provider_customer_id: providerCustomerId,
    provider_product_id: providerProductId,
    provider_price_id: providerPriceId,
    environment,
    current_period_start_at: currentPeriodStartAt,
    current_period_end_at: currentPeriodEndAt,
    canceled_at: canceledAt,
    cancel_at: status === "canceled" ? currentPeriodEndAt : null,
    ended_at: status === "expired" ? currentPeriodEndAt : null,
    billing_interval: null,
    billing_interval_count: null,
    quantity: 1,
    currency_code: null,
    provider_metadata: {
      packageName,
      googleSubscriptionState: purchase.subscriptionState ?? null,
      googleAcknowledgementState: purchase.acknowledgementState ?? null,
      latestOrderId: purchase.latestOrderId ?? null,
      regionCode: purchase.regionCode ?? null,
      linkedPurchaseToken: purchase.linkedPurchaseToken ?? null,
      pausedAutoResumeTime: purchase.pausedStateContext?.autoResumeTime ?? null,
      testPurchase: purchase.testPurchase ?? null,
      externalAccountIdentifiers: purchase.externalAccountIdentifiers ?? null,
      activeLineItem: lineItem,
      rawPurchase: purchase,
      entitlement_is_active: isPremiumStatus(status, currentPeriodEndAt),
    },
  };
}

async function upsertCanonicalSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  row: JsonRecord,
): Promise<JsonRecord> {
  const provider = String(row.provider);
  const providerSubscriptionId = String(row.provider_subscription_id);

  const existingQuery = await supabase
    .from("subscriptions")
    .select("id")
    .eq("provider", provider)
    .eq("provider_subscription_id", providerSubscriptionId)
    .limit(1)
    .maybeSingle();

  if (existingQuery.error) {
    throw new Error(`Failed to query subscriptions: ${existingQuery.error.message}`);
  }

  if (existingQuery.data?.id) {
    const updateResult = await supabase
      .from("subscriptions")
      .update(row)
      .eq("id", existingQuery.data.id)
      .select("*")
      .single();

    if (updateResult.error) {
      throw new Error(`Failed to update subscription: ${updateResult.error.message}`);
    }

    return updateResult.data as JsonRecord;
  }

  const insertResult = await supabase
    .from("subscriptions")
    .insert(row)
    .select("*")
    .single();

  if (insertResult.error) {
    throw new Error(`Failed to insert subscription: ${insertResult.error.message}`);
  }

  return insertResult.data as JsonRecord;
}

async function getProviderEventMetadata(
  supabase: ReturnType<typeof createAdminClient>,
  eventId: string,
): Promise<JsonRecord> {
  const result = await supabase
    .from("billing_provider_events")
    .select("metadata")
    .eq("id", eventId)
    .single();

  if (result.error) {
    throw new Error(`Failed to load provider event metadata: ${result.error.message}`);
  }

  return (result.data?.metadata && typeof result.data.metadata === "object")
    ? result.data.metadata as JsonRecord
    : {};
}

async function markProviderEventProcessed(
  supabase: ReturnType<typeof createAdminClient>,
  eventId: string,
  metadataPatch: JsonRecord,
): Promise<void> {
  const currentMetadata = await getProviderEventMetadata(supabase, eventId);

  const { error: updateError } = await supabase
    .from("billing_provider_events")
    .update({
      process_status: "processed",
      processed_at: nowIso(),
      processing_error: null,
      metadata: {
        ...currentMetadata,
        ...metadataPatch,
      },
    })
    .eq("id", eventId);

  if (updateError) {
    throw new Error(`Failed to mark provider event processed: ${updateError.message}`);
  }
}

async function markProviderEventFailed(
  supabase: ReturnType<typeof createAdminClient>,
  eventId: string,
  err: Error,
): Promise<void> {
  await supabase
    .from("billing_provider_events")
    .update({
      process_status: "failed",
      processed_at: nowIso(),
      processing_error: err.message,
    })
    .eq("id", eventId);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return error("Method not allowed", 405);
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return error("Expected JSON body", 400);
  }

  const record = body as JsonRecord;
  const appUserId = firstNonEmptyString(record.appUserId) ?? "";
  const purchaseToken = firstNonEmptyString(record.purchaseToken) ?? "";
  const productId = firstNonEmptyString(record.productId) ?? "";
  const packageName =
    firstNonEmptyString(
      record.packageName,
      Deno.env.get("GOOGLE_PLAY_PACKAGE_NAME"),
      Deno.env.get("GOOGLE_PACKAGE_NAME"),
    ) ?? "";
  const environment = normalizeEnvironment(record.environment);

  if (!appUserId) {
    return error("appUserId is required", 400);
  }

  if (!purchaseToken || !productId) {
    return error("purchaseToken and productId are required", 400);
  }

  if (!packageName) {
    return error("packageName is required or set GOOGLE_PLAY_PACKAGE_NAME", 400);
  }

  const eventKey = ["attach", "google", appUserId, purchaseToken].join(":");
  const requestMetadata = {
    route: "billing-google-attach-purchase",
    packageName,
  };

  const supabase = createAdminClient();
  let eventId: string | null = null;

  try {
    const event = await registerProviderEvent(supabase, {
      provider: "google",
      environment,
      eventKey,
      providerEventId: purchaseToken,
      eventType: "attach_purchase_requested",
      payload: record,
      metadata: requestMetadata,
    }) as ProviderEventResult;

    eventId = event.id;

    const purchase = await fetchGoogleSubscriptionPurchase(packageName, purchaseToken);

    if (purchase.acknowledgementState === "ACKNOWLEDGEMENT_STATE_PENDING") {
      await acknowledgeGoogleSubscriptionPurchase(packageName, productId, purchaseToken);
    }

    const subscriptionRow = buildSubscriptionRow({
      appUserId,
      purchaseToken,
      requestedProductId: productId,
      packageName,
      environment,
      purchase,
    });

    const savedSubscription = await upsertCanonicalSubscription(supabase, subscriptionRow);
    const currentPeriodEndAt = firstNonEmptyString(savedSubscription.current_period_end_at);
    const status = String(savedSubscription.status ?? subscriptionRow.status);

    await markProviderEventProcessed(supabase, event.id, {
      scaffold_only: false,
      subscription_id: savedSubscription.id ?? null,
      provider_subscription_id: purchaseToken,
      canonical_status: status,
    });

    return json({
      ok: true,
      queued: false,
      provider: "google",
      environment,
      event,
      subscription: {
        id: savedSubscription.id ?? null,
        provider: savedSubscription.provider ?? "google",
        providerSubscriptionId: savedSubscription.provider_subscription_id ?? purchaseToken,
        providerCustomerId: savedSubscription.provider_customer_id ?? appUserId,
        providerProductId: savedSubscription.provider_product_id ?? productId,
        providerPriceId: savedSubscription.provider_price_id ?? null,
        status,
        currentPeriodEndAt,
      },
      entitled: isPremiumStatus(status, currentPeriodEndAt),
    }, { status: 200 });
  } catch (err) {
    const normalizedError = err instanceof Error ? err : new Error("Unexpected error");

    if (eventId) {
      await markProviderEventFailed(supabase, eventId, normalizedError);
    }

    return error(normalizedError.message, 500);
  }
});