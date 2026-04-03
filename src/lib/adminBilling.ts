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

export async function adminCancelSubscription(
  subscriptionId: string,
  cancelImmediately = false,
): Promise<AdminCancelResponse> {
  const trimmed = String(subscriptionId || "").trim();
  if (!trimmed) {
    throw new Error("subscriptionId is required");
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
  if ((data as AdminCancelResponse | null)?.error) {
    throw new Error((data as AdminCancelResponse).error as string);
  }

  return (data ?? {}) as AdminCancelResponse;
}

export async function adminOpenPortal(
  customerId: string,
): Promise<AdminPortalResponse> {
  const trimmed = String(customerId || "").trim();
  if (!trimmed) {
    throw new Error("customerId is required");
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
  if ((data as AdminPortalResponse | null)?.error) {
    throw new Error((data as AdminPortalResponse).error as string);
  }

  const url = (data as AdminPortalResponse | null)?.url;
  if (!url) {
    throw new Error("Portal URL missing");
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return (data ?? {}) as AdminPortalResponse;
}