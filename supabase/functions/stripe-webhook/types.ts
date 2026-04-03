// supabase/functions/stripe-webhook/types.ts

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

/* ============================================================================
 * Minimal DB typing for Deno compatibility
 * ========================================================================== */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BillingProvider = "stripe" | "apple" | "google";
export type BillingEnvironment = "production" | "sandbox";
export type SharedSubscriptionStatus =
  | "active"
  | "trialing"
  | "grace_period"
  | "past_due"
  | "paused"
  | "expired"
  | "revoked";

export type CanonicalSubscriptionRow = {
  user_id: string;
  provider: BillingProvider;

  provider_customer_id: string | null;
  provider_subscription_id: string | null;
  provider_transaction_id: string | null;
  provider_original_transaction_id: string | null;

  product_id: string | null;
  provider_product_id: string | null;
  provider_price_id: string | null;

  environment: BillingEnvironment | null;
  status: SharedSubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean | null;
  canceled_at: string | null;
  ended_at: string | null;
  metadata?: Json | null;
  provider_metadata?: Json | null;
  raw_payload?: unknown;
};

export type EntitlementSnapshot = {
  status: "active" | "inactive";
  expires_at: string | null;
  source: BillingProvider | null;
};

export type Database = {
  public: {
    Tables: {
      subscriptions: {
        Row: {
          user_id: string;
          provider: BillingProvider;

          provider_customer_id: string | null;
          provider_subscription_id: string | null;
          provider_transaction_id: string | null;
          provider_original_transaction_id: string | null;

          product_id: string | null;
          provider_product_id: string | null;
          provider_price_id: string | null;

          environment: BillingEnvironment | null;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          canceled_at: string | null;
          ended_at: string | null;
          metadata: Json | null;
          provider_metadata: Json | null;
          raw_payload: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          provider: BillingProvider;

          provider_customer_id?: string | null;
          provider_subscription_id?: string | null;
          provider_transaction_id?: string | null;
          provider_original_transaction_id?: string | null;

          product_id?: string | null;
          provider_product_id?: string | null;
          provider_price_id?: string | null;

          environment?: BillingEnvironment | null;
          status: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          canceled_at?: string | null;
          ended_at?: string | null;
          metadata?: Json | null;
          provider_metadata?: Json | null;
          raw_payload?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["subscriptions"]["Insert"]
        >;
      };

      entitlement_events: {
        Row: {
          event_id: string;
          provider: BillingProvider;
          event_type: string;
          user_id: string | null;
          payload: Json | null;
        };
        Insert: {
          event_id: string;
          provider: BillingProvider;
          event_type: string;
          user_id?: string | null;
          payload?: Json | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["entitlement_events"]["Insert"]
        >;
      };

      stripe_webhook_events: {
        Row: {
          event_id: string;
          created_at: string | null;
          type: string | null;
          livemode: boolean | null;
          processed_at: string | null;
          error: string | null;
        };
        Insert: {
          event_id: string;
          created_at?: string | null;
          type?: string | null;
          livemode?: boolean | null;
          processed_at?: string | null;
          error?: string | null;
        };
        Update: {
          event_id?: string;
          created_at?: string | null;
          type?: string | null;
          livemode?: boolean | null;
          processed_at?: string | null;
          error?: string | null;
        };
      };

      email_outbox: {
        Row: {
          id: string;
          app_key: string | null;
          correlation_id: string | null;
          template_key: string | null;
          to_email: string | null;
          status: string | null;
          provider: string | null;
          variables: Record<string, string> | null;
          last_error: string | null;
          updated_at: string | null;
        };
        Insert: {
          app_key?: string | null;
          correlation_id?: string | null;
          template_key?: string | null;
          to_email?: string | null;
          status?: string | null;
          provider?: string | null;
          variables?: Record<string, string> | null;
          last_error?: string | null;
          updated_at?: string | null;
        };
        Update: {
          app_key?: string | null;
          correlation_id?: string | null;
          template_key?: string | null;
          to_email?: string | null;
          status?: string | null;
          provider?: string | null;
          variables?: Record<string, string> | null;
          last_error?: string | null;
          updated_at?: string | null;
        };
      };

      profiles: {
        Row: {
          id: string;
          email: string | null;
          stripe_customer_id: string | null;
          premium_status: string | null;
          premium_expires_at: string | null;
          premium_source: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          stripe_customer_id?: string | null;
          premium_status?: string | null;
          premium_expires_at?: string | null;
          premium_source?: string | null;
        };
        Update: {
          email?: string | null;
          stripe_customer_id?: string | null;
          premium_status?: string | null;
          premium_expires_at?: string | null;
          premium_source?: string | null;
        };
      };
    };
  };
};

export type DBClient = SupabaseClient<Database>;

/* ============================================================================
 * Types
 * ========================================================================== */

export type SupportedEventType =
  | "checkout.session.completed"
  | "invoice.paid"
  | "invoice.payment_failed"
  | "customer.subscription.created"
  | "customer.subscription.updated"
  | "customer.subscription.deleted";

export type StripeObjectMetadata = {
  supabase_user_id?: string | null;
  user_id?: string | null;
  tier_id?: string | null;
  vip_key?: string | null;
  email?: string | null;
  price_id?: string | null;
};

export type StripeWebhookEvent<TObject = unknown> = {
  id: string;
  type: string;
  created?: number;
  livemode?: boolean;
  data: {
    object: TObject;
  };
};

export type CheckoutSessionLike = {
  id?: string | null;
  mode?: string | null;
  status?: string | null;
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  subscription?: string | null;
  customer?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  client_reference_id?: string | null;
  metadata?: StripeObjectMetadata | null;
};

export type InvoiceLineLike = {
  period?: {
    start?: number | null;
    end?: number | null;
  } | null;
  price?: {
    id?: string | null;
    product?: string | null;
    recurring?: {
      interval?: string | null;
      interval_count?: number | null;
    } | null;
  } | null;
};

export type InvoiceLike = {
  id?: string | null;
  subscription?: string | null;
  customer?: string | null;
  customer_email?: string | null;
  customer_details?: {
    email?: string | null;
  } | null;
  amount_paid?: number | null;
  amount_due?: number | null;
  currency?: string | null;
  lines?: {
    data?: InvoiceLineLike[] | null;
  } | null;
};

export type SubscriptionItemLike = {
  price?: {
    id?: string | null;
    product?: string | null;
    recurring?: {
      interval?: string | null;
      interval_count?: number | null;
    } | null;
  } | null;
};

export type SubscriptionLike = {
  id?: string | null;
  customer?: string | null;
  status?: string | null;
  current_period_start?: number | null;
  current_period_end?: number | null;
  cancel_at_period_end?: boolean | null;
  canceled_at?: number | null;
  ended_at?: number | null;
  metadata?: StripeObjectMetadata | null;
  items?: {
    data?: SubscriptionItemLike[] | null;
  } | null;
};

export type StripeFreshness = {
  object_time_ms: number | null;
  event_created: number | null;
  event_id: string | null;
  event_type: string | null;
  event_priority: number | null;
};

export type ExistingSubscriptionRow =
  & Pick<
    CanonicalSubscriptionRow,
    | "user_id"
    | "provider"
    | "provider_customer_id"
    | "provider_subscription_id"
    | "provider_transaction_id"
    | "provider_original_transaction_id"
    | "product_id"
    | "provider_product_id"
    | "provider_price_id"
    | "environment"
    | "status"
    | "current_period_start"
    | "current_period_end"
    | "cancel_at_period_end"
    | "canceled_at"
    | "ended_at"
  >
  & {
    metadata?: Json | null;
    provider_metadata?: Json | null;
    raw_payload?: unknown;
  };

export type ComparableSubscriptionWrite = Pick<
  Database["public"]["Tables"]["subscriptions"]["Insert"],
  | "user_id"
  | "provider"
  | "provider_customer_id"
  | "provider_subscription_id"
  | "provider_transaction_id"
  | "provider_original_transaction_id"
  | "product_id"
  | "provider_product_id"
  | "provider_price_id"
  | "environment"
  | "status"
  | "current_period_start"
  | "current_period_end"
  | "cancel_at_period_end"
  | "canceled_at"
  | "ended_at"
>;

export type FilterableQuery = {
  is(column: string, value: null): unknown;
  eq(column: string, value: string | boolean): unknown;
};

export type EmailRoute = {
  originalTo: string;
  forcedTo: string | null;
  finalTo: string;
};

export type UpsertSharedSubscriptionMonotonicResult = {
  stateChanged: boolean;
  shouldRecomputeBeforeFinalMark: boolean;
};