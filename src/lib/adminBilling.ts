// src/lib/adminBilling.ts

import { supabase } from "@/lib/supabaseClient";

type AdminCancelResponse = {
  success?: boolean;
  subscription_id?: string;
  status?: string;
  cancel_at_period_end?: boolean;
  error?: string;
};

type AdminPortalResponse = {
  success?: boolean;
  url?: string;
  error?: string;
};

function isValidStripeSubscriptionId(value: string): boolean {
  return /^sub_[A-Za-z0-9]+$/.test(value);
}

function isValidStripeCustomerId(value: string): boolean {
  return /^cus_[A-Za-z0-9]+$/.test(value);
}

function extractErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === "object" && "error" in data) {
    const err = (data as Record<string, unknown>).error;
    if (typeof err === "string" && err.trim()) return err.trim();
  }
  return fallback;
}

export async function adminCancelSubscription(
  subscriptionId: string,
  cancelImmediately = false,
): Promise<AdminCancelResponse> {
  const trimmed = String(subscriptionId || "").trim();

  if (!trimmed) {
    throw new Error("subscriptionId is required.");
  }

  if (!isValidStripeSubscriptionId(trimmed)) {
    throw new Error(
      `Invalid Stripe subscription ID format: "${trimmed}". Expected sub_...`,
    );
  }

  const { data, error } = await supabase.functions.invoke(
    "admin-billing-cancel-subscription",
    {
      body: {
        subscription_id: trimmed,
        cancel_immediately: cancelImmediately,
      },
    },
  );

  if (error) throw error;

  const errorMessage = extractErrorMessage(data, "");
  if (errorMessage) throw new Error(errorMessage);

  return (data ?? {}) as AdminCancelResponse;
}

export async function adminOpenPortal(
  customerId: string,
): Promise<AdminPortalResponse> {
  const trimmed = String(customerId || "").trim();

  if (!trimmed) {
    throw new Error("customerId is required.");
  }

  if (!isValidStripeCustomerId(trimmed)) {
    throw new Error(
      `Invalid Stripe customer ID format: "${trimmed}". Expected cus_...`,
    );
  }

  const returnUrl = `${window.location.origin}/admin/subscriptions`;

  const { data, error } = await supabase.functions.invoke(
    "admin-billing-portal-session",
    {
      body: {
        customer_id: trimmed,
        return_url: returnUrl,
      },
    },
  );

  if (error) throw error;

  const errorMessage = extractErrorMessage(data, "");
  if (errorMessage) throw new Error(errorMessage);

  const url = (data as AdminPortalResponse | null)?.url;
  if (!url) throw new Error("Portal URL missing.");

  // Try popup first — if browser blocks it, fall back to same-tab navigation
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.assign(url);
  }

  return (data ?? {}) as AdminPortalResponse;
}