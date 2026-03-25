export type CanonicalSubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'expired'
  | 'revoked';

export type AppleEnvironment = 'Sandbox' | 'Production' | 'Xcode';

export type AppleTransaction = {
  appAppleId?: number;
  bundleId?: string;
  currency?: string;
  environment?: AppleEnvironment;
  expiresDate?: number;
  inAppOwnershipType?: string;
  isUpgraded?: boolean;
  offerIdentifier?: string;
  offerType?: number;
  originalPurchaseDate?: number;
  originalTransactionId: string;
  price?: number;
  productId: string;
  purchaseDate: number;
  quantity?: number;
  revocationDate?: number;
  revocationReason?: number;
  signedDate?: number;
  storefront?: string;
  storefrontId?: string;
  subscriptionGroupIdentifier?: string;
  transactionId: string;
  transactionReason?: string;
  type?: string;
  webOrderLineItemId?: string;
  appAccountToken?: string;
};

export type AppleRenewalInfo = {
  autoRenewProductId?: string;
  autoRenewStatus?: 0 | 1;
  environment?: AppleEnvironment;
  expirationIntent?: number;
  gracePeriodExpiresDate?: number;
  isInBillingRetryPeriod?: boolean;
  offerIdentifier?: string;
  offerType?: number;
  originalTransactionId?: string;
  priceIncreaseStatus?: number;
  productId?: string;
  recentSubscriptionStartDate?: number;
  renewalDate?: number;
  signedDate?: number;
};

export type CanonicalSubscriptionRecord = {
  provider: 'apple';
  provider_customer_id: string | null;
  provider_subscription_id: string;
  provider_price_id: string;
  status: CanonicalSubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  metadata: Record<string, unknown>;
};

export type AppleDerivedState = {
  status: CanonicalSubscriptionStatus;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  trialStart: string | null;
  trialEnd: string | null;
};

export function isoOrNull(ms?: number): string | null {
  return typeof ms === 'number' && Number.isFinite(ms)
    ? new Date(ms).toISOString()
    : null;
}

export function isTrialTransaction(tx: AppleTransaction): boolean {
  return tx.offerType === 1;
}

export function deriveAppleStatus(args: {
  transaction: AppleTransaction;
  renewalInfo?: AppleRenewalInfo | null;
  now?: Date;
}): AppleDerivedState {
  const now = args.now ?? new Date();
  const tx = args.transaction;
  const renewal = args.renewalInfo ?? null;

  const currentPeriodEnd = tx.expiresDate ? new Date(tx.expiresDate) : null;
  const currentPeriodStart = new Date(tx.purchaseDate);
  const revoked = typeof tx.revocationDate === 'number';
  const expired = currentPeriodEnd ? currentPeriodEnd.getTime() <= now.getTime() : false;
  const inGrace = Boolean(
    renewal?.gracePeriodExpiresDate && renewal.gracePeriodExpiresDate > now.getTime(),
  );
  const inRetry = renewal?.isInBillingRetryPeriod === true;
  const autoRenewOff = renewal?.autoRenewStatus === 0;
  const trialing = isTrialTransaction(tx) && !revoked && !expired;

  if (revoked) {
    return {
      status: 'revoked',
      cancelAtPeriodEnd: false,
      canceledAt: isoOrNull(tx.revocationDate),
      trialStart: trialing ? currentPeriodStart.toISOString() : null,
      trialEnd: trialing ? isoOrNull(tx.expiresDate) : null,
    };
  }

  if (expired) {
    return {
      status: 'expired',
      cancelAtPeriodEnd: autoRenewOff,
      canceledAt: autoRenewOff ? isoOrNull(renewal?.signedDate ?? tx.signedDate) : null,
      trialStart: trialing ? currentPeriodStart.toISOString() : null,
      trialEnd: trialing ? isoOrNull(tx.expiresDate) : null,
    };
  }

  if (inGrace || inRetry) {
    return {
      status: 'past_due',
      cancelAtPeriodEnd: autoRenewOff,
      canceledAt: autoRenewOff ? isoOrNull(renewal?.signedDate ?? tx.signedDate) : null,
      trialStart: trialing ? currentPeriodStart.toISOString() : null,
      trialEnd: trialing ? isoOrNull(tx.expiresDate) : null,
    };
  }

  if (autoRenewOff) {
    return {
      status: 'canceled',
      cancelAtPeriodEnd: true,
      canceledAt: isoOrNull(renewal?.signedDate ?? tx.signedDate),
      trialStart: trialing ? currentPeriodStart.toISOString() : null,
      trialEnd: trialing ? isoOrNull(tx.expiresDate) : null,
    };
  }

  return {
    status: trialing ? 'trialing' : 'active',
    cancelAtPeriodEnd: false,
    canceledAt: null,
    trialStart: trialing ? currentPeriodStart.toISOString() : null,
    trialEnd: trialing ? isoOrNull(tx.expiresDate) : null,
  };
}

export function mapAppleToCanonical(args: {
  transaction: AppleTransaction;
  renewalInfo?: AppleRenewalInfo | null;
  providerCustomerId?: string | null;
  raw?: Record<string, unknown>;
  now?: Date;
}): CanonicalSubscriptionRecord {
  const tx = args.transaction;
  const derived = deriveAppleStatus({
    transaction: tx,
    renewalInfo: args.renewalInfo,
    now: args.now,
  });

  return {
    provider: 'apple',
    provider_customer_id: args.providerCustomerId ?? tx.appAccountToken ?? null,
    provider_subscription_id: tx.originalTransactionId,
    provider_price_id: tx.productId,
    status: derived.status,
    current_period_start: isoOrNull(tx.purchaseDate),
    current_period_end: isoOrNull(tx.expiresDate),
    cancel_at_period_end: derived.cancelAtPeriodEnd,
    canceled_at: derived.canceledAt,
    trial_start: derived.trialStart,
    trial_end: derived.trialEnd,
    metadata: {
      apple_environment: tx.environment ?? args.renewalInfo?.environment ?? null,
      apple_transaction_id: tx.transactionId,
      apple_web_order_line_item_id: tx.webOrderLineItemId ?? null,
      apple_subscription_group_id: tx.subscriptionGroupIdentifier ?? null,
      apple_offer_identifier: tx.offerIdentifier ?? args.renewalInfo?.offerIdentifier ?? null,
      apple_offer_type: tx.offerType ?? args.renewalInfo?.offerType ?? null,
      raw: args.raw ?? null,
    },
  };
}

export function shouldProjectIncoming(args: {
  current: Pick<CanonicalSubscriptionRecord, 'status' | 'current_period_end'> & {
    metadata?: Record<string, unknown> | null;
  };
  incoming: CanonicalSubscriptionRecord;
}): boolean {
  const currentEnd = args.current.current_period_end
    ? new Date(args.current.current_period_end).getTime()
    : 0;
  const incomingEnd = args.incoming.current_period_end
    ? new Date(args.incoming.current_period_end).getTime()
    : 0;

  if (args.incoming.status === 'revoked' && args.current.status !== 'revoked') {
    return true;
  }

  if (incomingEnd !== currentEnd) {
    return incomingEnd > currentEnd;
  }

  const currentSigned = Number(args.current.metadata?.apple_signed_date ?? 0);
  const incomingSigned = Number(args.incoming.metadata?.apple_signed_date ?? 0);
  return incomingSigned >= currentSigned;
}