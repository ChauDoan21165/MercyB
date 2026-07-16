import { describe, expect, it } from "vitest";
import {
  type GoogleRtdnPayload,
  type GoogleSubscriptionPurchaseV2,
  projectAppleNotification,
  projectGoogleRtdn,
} from "../store-webhook-projection";

type Call = {
  op: "insert" | "update";
  table: string;
  row: Record<string, unknown>;
  filters: Record<string, unknown>;
};

class FakeTable {
  private selected = "";
  private filters: Record<string, unknown> = {};
  private pendingInsert: Record<string, unknown> | null = null;
  private pendingUpdate: Record<string, unknown> | null = null;

  constructor(
    private readonly client: FakeSupabase,
    private readonly table: string,
  ) {}

  select(columns: string) {
    this.selected = columns;
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters[column] = value;
    return this;
  }

  limit() {
    return this;
  }

  insert(row: Record<string, unknown>) {
    this.pendingInsert = row;
    return this;
  }

  update(row: Record<string, unknown>) {
    this.pendingUpdate = row;
    return this;
  }

  maybeSingle() {
    if (this.table !== "subscriptions") {
      return { data: null, error: null };
    }

    const key = `${String(this.filters.provider)}:${String(
      this.filters.provider_subscription_id,
    )}`;
    const existing = this.client.existingSubscriptions.get(key) ?? null;

    if (!existing) return { data: null, error: null };
    if (this.selected === "user_id") {
      return { data: { user_id: existing.user_id }, error: null };
    }
    return { data: { id: existing.id }, error: null };
  }

  single() {
    const row = this.pendingInsert ?? this.pendingUpdate ?? {};
    if (this.pendingInsert) {
      this.client.calls.push({
        op: "insert",
        table: this.table,
        row: this.pendingInsert,
        filters: { ...this.filters },
      });
    }
    if (this.pendingUpdate) {
      this.client.calls.push({
        op: "update",
        table: this.table,
        row: this.pendingUpdate,
        filters: { ...this.filters },
      });
    }
    return {
      data: { id: "sub-row-id", ...row },
      error: null,
    };
  }
}

class FakeSupabase {
  readonly calls: Call[] = [];
  readonly existingSubscriptions = new Map<
    string,
    { id: string; user_id: string }
  >();

  from(table: string) {
    return new FakeTable(this, table);
  }
}

const USER_ID = "11111111-1111-4111-8111-111111111111";
const START_MS = Date.parse("2026-07-01T00:00:00.000Z");
const END_MS = Date.parse("2026-08-01T00:00:00.000Z");

describe("store webhook projection", () => {
  it("projects a verified Apple renewal into canonical subscriptions with both period column pairs", async () => {
    const admin = new FakeSupabase();

    const result = await projectAppleNotification(admin as never, {
      notificationType: "DID_RENEW",
      environment: "production",
      transaction: {
        originalTransactionId: "apple-original-1",
        transactionId: "apple-tx-2",
        productId: "mercy.premium.monthly",
        purchaseDate: START_MS,
        expiresDate: END_MS,
        appAccountToken: USER_ID,
      },
      renewalInfo: { autoRenewStatus: 1 },
      payload: { notificationType: "DID_RENEW" },
    });

    expect(result).toMatchObject({
      action: "upserted",
      provider: "apple",
      userId: USER_ID,
      providerSubscriptionId: "apple-original-1",
      status: "active",
    });

    const write = admin.calls.find((call) => call.op === "insert");
    expect(write?.row).toMatchObject({
      user_id: USER_ID,
      provider: "apple",
      provider_subscription_id: "apple-original-1",
      provider_transaction_id: "apple-tx-2",
      status: "active",
      current_period_start: "2026-07-01T00:00:00.000Z",
      current_period_start_at: "2026-07-01T00:00:00.000Z",
      current_period_end: "2026-08-01T00:00:00.000Z",
      current_period_end_at: "2026-08-01T00:00:00.000Z",
    });
  });

  it("updates the existing Apple subscription row on repeated delivery instead of appending a duplicate", async () => {
    const admin = new FakeSupabase();
    admin.existingSubscriptions.set("apple:apple-original-1", {
      id: "existing-sub-id",
      user_id: USER_ID,
    });

    await projectAppleNotification(admin as never, {
      notificationType: "DID_CHANGE_RENEWAL_STATUS",
      subtype: "AUTO_RENEW_DISABLED",
      environment: "production",
      transaction: {
        originalTransactionId: "apple-original-1",
        transactionId: "apple-tx-2",
        productId: "mercy.premium.monthly",
        purchaseDate: START_MS,
        expiresDate: END_MS,
      },
      renewalInfo: { autoRenewStatus: 0, signedDate: START_MS },
      payload: { notificationType: "DID_CHANGE_RENEWAL_STATUS" },
    });

    expect(admin.calls.some((call) => call.op === "insert")).toBe(false);
    const update = admin.calls.find((call) => call.op === "update");
    expect(update?.filters).toEqual({ id: "existing-sub-id" });
    expect(update?.row).toMatchObject({
      provider: "apple",
      provider_subscription_id: "apple-original-1",
      user_id: USER_ID,
      status: "active",
      cancel_at_period_end: true,
      cancel_at: "2026-08-01T00:00:00.000Z",
    });
  });

  it("does not write a malformed Apple payload without an original transaction id", async () => {
    const admin = new FakeSupabase();

    const result = await projectAppleNotification(admin as never, {
      notificationType: "DID_RENEW",
      environment: "production",
      transaction: {
        originalTransactionId: "",
        transactionId: "apple-tx-2",
        productId: "mercy.premium.monthly",
        purchaseDate: START_MS,
      },
      payload: {},
    });

    expect(result).toEqual({
      action: "ignored",
      reason: "missing_original_transaction_id",
    });
    expect(admin.calls).toEqual([]);
  });

  it("projects a verified Google RTDN renewal lookup into canonical subscriptions with both period column pairs", async () => {
    const admin = new FakeSupabase();
    const rtdn: GoogleRtdnPayload = {
      packageName: "com.mercyapps.mercyblade",
      subscriptionNotification: {
        notificationType: 2,
        purchaseToken: "google-token-1",
        subscriptionId: "mercy.premium.yearly",
      },
    };
    const purchase: GoogleSubscriptionPurchaseV2 = {
      startTime: "2026-07-01T00:00:00Z",
      subscriptionState: "SUBSCRIPTION_STATE_ACTIVE",
      latestOrderId: "GPA.1234-5678",
      externalAccountIdentifiers: {
        obfuscatedExternalAccountId: USER_ID,
      },
      lineItems: [
        {
          productId: "mercy.premium.yearly",
          expiryTime: "2027-07-01T00:00:00Z",
          offerDetails: { basePlanId: "yearly", offerId: "base" },
          autoRenewingPlan: { autoRenewEnabled: true },
        },
      ],
    };

    const result = await projectGoogleRtdn(admin as never, {
      environment: "production",
      packageName: "com.mercyapps.mercyblade",
      rtdn,
      purchase,
    });

    expect(result).toMatchObject({
      action: "upserted",
      provider: "google",
      userId: USER_ID,
      providerSubscriptionId: "google-token-1",
      status: "active",
    });

    const write = admin.calls.find((call) => call.op === "insert");
    expect(write?.row).toMatchObject({
      user_id: USER_ID,
      provider: "google",
      provider_subscription_id: "google-token-1",
      provider_transaction_id: "GPA.1234-5678",
      product_id: "mercy.premium.yearly",
      current_period_start: "2026-07-01T00:00:00.000Z",
      current_period_start_at: "2026-07-01T00:00:00.000Z",
      current_period_end: "2027-07-01T00:00:00.000Z",
      current_period_end_at: "2027-07-01T00:00:00.000Z",
    });
  });

  it("does not write Google test notifications without a subscription payload", async () => {
    const admin = new FakeSupabase();

    const result = await projectGoogleRtdn(admin as never, {
      environment: "production",
      packageName: "com.mercyapps.mercyblade",
      rtdn: { packageName: "com.mercyapps.mercyblade", testNotification: {} },
      purchase: {},
    });

    expect(result).toEqual({
      action: "ignored",
      reason: "not_subscription_notification",
    });
    expect(admin.calls).toEqual([]);
  });
});
