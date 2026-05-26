export type BillingProvider = "stripe" | "apple" | "google";
export type BillingEnvironment = "production" | "sandbox" | "test";

export interface RegisterProviderEventInput {
  provider: BillingProvider;
  environment: BillingEnvironment;
  eventKey: string;
  providerEventId?: string | null;
  eventType?: string | null;
  eventCreatedAt?: string | null;
  payload?: unknown;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface RegisterProviderEventResult {
  id: string;
  isNew: boolean;
  deliveryCount: number;
  processStatus: string;
}
