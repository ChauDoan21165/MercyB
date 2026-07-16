import type { SupabaseClient } from "jsr:@supabase/supabase-js@2";
import {
  type AppleRenewalInfo,
  type AppleTransaction,
  deriveAppleStatus,
  isoOrNull,
} from "../_shared/apple-billing.ts";
import type { BillingEnvironment, BillingProvider } from "./types.ts";

type JsonRecord = Record<string, unknown>;

export type StoreSubscriptionStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "revoked";

export type AppleProjectionInput = {
  notificationType: string;
  subtype?: string | null;
  environment: BillingEnvironment;
  transaction: AppleTransaction;
  renewalInfo?: AppleRenewalInfo | null;
  payload: unknown;
};

export type GoogleRtdnPayload = {
  version?: string;
  packageName?: string;
  eventTimeMillis?: string;
  subscriptionNotification?: {
    version?: string;
    notificationType?: number;
    purchaseToken?: string;
    subscriptionId?: string;
  };
  testNotification?: {
    version?: string;
  };
};

export type GoogleExternalAccountIdentifiers = {
  obfuscatedExternalAccountId?: string;
  obfuscatedExternalProfileId?: string;
};

export type GoogleOfferDetails = {
  basePlanId?: string;
  offerId?: string;
  offerTags?: string[];
};

export type GoogleAutoRenewingPlan = {
  autoRenewEnabled?: boolean;
};

export type GoogleLineItem = {
  productId?: string;
  expiryTime?: string;
  offerDetails?: GoogleOfferDetails;
  autoRenewingPlan?: GoogleAutoRenewingPlan;
};

export type GoogleCanceledUserInitiatedCancellation = {
  cancelTime?: string;
};

export type GoogleCanceledStateContext = {
  userInitiatedCancellation?: GoogleCanceledUserInitiatedCancellation;
};

export type GooglePausedStateContext = {
  autoResumeTime?: string;
};

export type GoogleSubscriptionPurchaseV2 = {
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

export type ProjectionResult =
  | {
      action: "upserted";
      provider: BillingProvider;
      userId: string;
      providerSubscriptionId: string;
      status: StoreSubscriptionStatus;
      currentPeriodEndAt: string | null;
    }
  | { action: "ignored"; reason: string };

const APP_ID = "mercy_blade";

function firstNonEmptyString(...values: unknown[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
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

function normalizeAppleStatus(args: {
  notificationType: string;
  derivedStatus: string;
  transaction: AppleTransaction;
  renewalInfo?: AppleRenewalInfo | null;
}): StoreSubscriptionStatus {
  const type = args.notificationType.toUpperCase();
  if (type === "REFUND" || type === "REVOKE" || args.transaction.revocationDate) {
    return "revoked";
  }
  if (type === "EXPIRED" || type === "GRACE_PERIOD_EXPIRED") {
    return "expired";
  }
  if (args.renewalInfo?.gracePeriodExpiresDate) {
    return "grace_period";
  }
  if (args.renewalInfo?.isInBillingRetryPeriod === true || type === "DID_FAIL_TO_RENEW") {
    return "past_due";
  }
  if (args.derivedStatus === "trialing") return "trialing";
  if (args.derivedStatus === "expired") return "expired";
  if (args.derivedStatus === "revoked") return "revoked";
  if (args.derivedStatus === "past_due") return "past_due";
  return "active";
}

async function resolveExistingUserId(
  admin: SupabaseClient,
  provider: BillingProvider,
  providerSubscriptionId: string,
): Promise<string | null> {
  const { data, error } = await admin
    .from("subscriptions")
    .select("user_id")
    .eq("provider", provider)
    .eq("provider_subscription_id", providerSubscriptionId)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`subscriptions user lookup: ${error.message}`);
  }

  return firstNonEmptyString((data as { user_id?: unknown } | null)?.user_id);
}

async function upsertCanonicalSubscription(
  admin: SupabaseClient,
  provider: BillingProvider,
  providerSubscriptionId: string,
  row: JsonRecord,
): Promise<JsonRecord> {
  const existingQuery = await admin
    .from("subscriptions")
    .select("id")
    .eq("provider", provider)
    .eq("provider_subscription_id", providerSubscriptionId)
    .limit(1)
    .maybeSingle();

  if (existingQuery.error) {
    throw new Error(`Failed to query subscriptions: ${existingQuery.error.message}`);
  }

  if ((existingQuery.data as { id?: unknown } | null)?.id) {
    const updateResult = await admin
      .from("subscriptions")
      .update(row)
      .eq("id", (existingQuery.data as { id: string }).id)
      .select("*")
      .single();

    if (updateResult.error) {
      throw new Error(`Failed to update subscription: ${updateResult.error.message}`);
    }

    return updateResult.data as JsonRecord;
  }

  const insertResult = await admin
    .from("subscriptions")
    .insert(row)
    .select("*")
    .single();

  if (insertResult.error) {
    throw new Error(`Failed to insert subscription: ${insertResult.error.message}`);
  }

  return insertResult.data as JsonRecord;
}

export async function projectAppleNotification(
  admin: SupabaseClient,
  input: AppleProjectionInput,
): Promise<ProjectionResult> {
  const providerSubscriptionId = firstNonEmptyString(
    input.transaction.originalTransactionId,
  );
  if (!providerSubscriptionId) {
    return { action: "ignored", reason: "missing_original_transaction_id" };
  }

  const userId =
    firstNonEmptyString(input.transaction.appAccountToken) ??
    await resolveExistingUserId(admin, "apple", providerSubscriptionId);
  if (!userId) {
    throw new Error("Apple notification could not resolve user_id");
  }

  const derived = deriveAppleStatus({
    transaction: input.transaction,
    renewalInfo: input.renewalInfo ?? null,
  });
  const status = normalizeAppleStatus({
    notificationType: input.notificationType,
    derivedStatus: derived.status,
    transaction: input.transaction,
    renewalInfo: input.renewalInfo ?? null,
  });
  const currentPeriodStartAt = isoOrNull(input.transaction.purchaseDate);
  const currentPeriodEndAt = isoOrNull(input.transaction.expiresDate);
  const canceledAt =
    status === "revoked"
      ? isoOrNull(input.transaction.revocationDate)
      : derived.canceledAt;
  const endedAt =
    status === "expired" || status === "revoked"
      ? currentPeriodEndAt ?? canceledAt ?? nowIso()
      : null;

  const row = {
    app_id: APP_ID,
    user_id: userId,
    customer_id: userId,
    subscription_id: providerSubscriptionId,
    provider: "apple",
    provider_subscription_id: providerSubscriptionId,
    provider_customer_id: userId,
    provider_transaction_id: input.transaction.transactionId ?? null,
    provider_original_transaction_id: providerSubscriptionId,
    provider_product_id: input.transaction.productId ?? null,
    product_id: input.transaction.productId ?? null,
    provider_price_id: input.transaction.productId ?? null,
    environment: input.environment,
    status,
    current_period_start: currentPeriodStartAt,
    current_period_start_at: currentPeriodStartAt,
    current_period_end: currentPeriodEndAt,
    current_period_end_at: currentPeriodEndAt,
    cancel_at_period_end: derived.cancelAtPeriodEnd,
    cancel_at: derived.cancelAtPeriodEnd ? currentPeriodEndAt : null,
    canceled_at: canceledAt,
    ended_at: endedAt,
    provider_metadata: {
      apple_notification_type: input.notificationType,
      apple_notification_subtype: input.subtype ?? null,
      apple_environment:
        input.transaction.environment ?? input.renewalInfo?.environment ?? null,
      apple_signed_date:
        input.transaction.signedDate ?? input.renewalInfo?.signedDate ?? null,
      apple_web_order_line_item_id:
        input.transaction.webOrderLineItemId ?? null,
      apple_subscription_group_id:
        input.transaction.subscriptionGroupIdentifier ?? null,
      renewal_info: input.renewalInfo ?? null,
    },
    raw_payload: input.payload,
    updated_at: nowIso(),
  };

  await upsertCanonicalSubscription(admin, "apple", providerSubscriptionId, row);
  return {
    action: "upserted",
    provider: "apple",
    userId,
    providerSubscriptionId,
    status,
    currentPeriodEndAt,
  };
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

function deriveGoogleStatus(
  purchase: GoogleSubscriptionPurchaseV2,
  lineItem: GoogleLineItem | null,
): StoreSubscriptionStatus {
  switch (purchase.subscriptionState ?? "") {
    case "SUBSCRIPTION_STATE_ACTIVE":
      return "active";
    case "SUBSCRIPTION_STATE_IN_GRACE_PERIOD":
      return "grace_period";
    case "SUBSCRIPTION_STATE_CANCELED":
      return "active";
    case "SUBSCRIPTION_STATE_ON_HOLD":
      return "past_due";
    case "SUBSCRIPTION_STATE_PAUSED":
      return "paused";
    case "SUBSCRIPTION_STATE_EXPIRED":
      return "expired";
    case "SUBSCRIPTION_STATE_PENDING":
    case "SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED":
      return "revoked";
    default: {
      const expiry = toIsoOrNull(lineItem?.expiryTime);
      if (expiry && new Date(expiry).getTime() > Date.now()) return "active";
      return "expired";
    }
  }
}

function buildGoogleProviderPriceId(
  lineItem: GoogleLineItem | null,
  fallbackProductId: string,
): string {
  const productId =
    firstNonEmptyString(lineItem?.productId, fallbackProductId) ??
      fallbackProductId;
  const basePlanId =
    firstNonEmptyString(lineItem?.offerDetails?.basePlanId) ?? "base";
  const offerId = firstNonEmptyString(lineItem?.offerDetails?.offerId) ?? "base";
  return `google:${productId}:${basePlanId}:${offerId}`;
}

export async function projectGoogleRtdn(
  admin: SupabaseClient,
  args: {
    environment: BillingEnvironment;
    packageName: string;
    rtdn: GoogleRtdnPayload;
    purchase: GoogleSubscriptionPurchaseV2;
  },
): Promise<ProjectionResult> {
  const subscription = args.rtdn.subscriptionNotification;
  if (!subscription) {
    return { action: "ignored", reason: "not_subscription_notification" };
  }

  const purchaseToken = firstNonEmptyString(subscription.purchaseToken);
  const requestedProductId = firstNonEmptyString(subscription.subscriptionId);
  if (!purchaseToken || !requestedProductId) {
    return { action: "ignored", reason: "missing_purchase_token_or_product_id" };
  }

  const userId =
    firstNonEmptyString(
      args.purchase.externalAccountIdentifiers?.obfuscatedExternalAccountId,
    ) ?? await resolveExistingUserId(admin, "google", purchaseToken);
  if (!userId) {
    throw new Error("Google RTDN could not resolve user_id");
  }

  const lineItem = getPrimaryLineItem(args.purchase, requestedProductId);
  const status = deriveGoogleStatus(args.purchase, lineItem);
  const providerProductId =
    firstNonEmptyString(lineItem?.productId, requestedProductId) ??
      requestedProductId;
  const currentPeriodStartAt = toIsoOrNull(args.purchase.startTime) ?? nowIso();
  const currentPeriodEndAt = toIsoOrNull(lineItem?.expiryTime);
  const canceledAt = toIsoOrNull(
    args.purchase.canceledStateContext?.userInitiatedCancellation?.cancelTime,
  );
  const providerPriceId = buildGoogleProviderPriceId(lineItem, requestedProductId);
  const autoRenewEnabled = lineItem?.autoRenewingPlan?.autoRenewEnabled;

  const row = {
    app_id: APP_ID,
    user_id: userId,
    customer_id: userId,
    subscription_id: purchaseToken,
    provider: "google",
    provider_subscription_id: purchaseToken,
    provider_customer_id: userId,
    provider_product_id: providerProductId,
    product_id: providerProductId,
    provider_price_id: providerPriceId,
    provider_transaction_id: args.purchase.latestOrderId ?? null,
    provider_original_transaction_id:
      args.purchase.linkedPurchaseToken ?? purchaseToken,
    environment: args.environment,
    status,
    current_period_start: currentPeriodStartAt,
    current_period_start_at: currentPeriodStartAt,
    current_period_end: currentPeriodEndAt,
    current_period_end_at: currentPeriodEndAt,
    cancel_at_period_end:
      status === "active" && autoRenewEnabled === false,
    cancel_at:
      status === "active" && autoRenewEnabled === false
        ? currentPeriodEndAt
        : null,
    canceled_at: canceledAt,
    ended_at:
      status === "expired" || status === "revoked"
        ? currentPeriodEndAt ?? canceledAt ?? nowIso()
        : null,
    billing_interval: null,
    billing_interval_count: null,
    quantity: 1,
    currency_code: null,
    provider_metadata: {
      packageName: args.packageName,
      googleNotificationType: subscription.notificationType ?? null,
      googleSubscriptionState: args.purchase.subscriptionState ?? null,
      googleAcknowledgementState: args.purchase.acknowledgementState ?? null,
      latestOrderId: args.purchase.latestOrderId ?? null,
      regionCode: args.purchase.regionCode ?? null,
      linkedPurchaseToken: args.purchase.linkedPurchaseToken ?? null,
      pausedAutoResumeTime:
        args.purchase.pausedStateContext?.autoResumeTime ?? null,
      testPurchase: args.purchase.testPurchase ?? null,
      externalAccountIdentifiers:
        args.purchase.externalAccountIdentifiers ?? null,
      activeLineItem: lineItem,
    },
    raw_payload: {
      rtdn: args.rtdn,
      purchase: args.purchase,
    },
    updated_at: nowIso(),
  };

  await upsertCanonicalSubscription(admin, "google", purchaseToken, row);
  return {
    action: "upserted",
    provider: "google",
    userId,
    providerSubscriptionId: purchaseToken,
    status,
    currentPeriodEndAt,
  };
}
