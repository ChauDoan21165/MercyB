import { supabase } from "@/lib/supabase";

type CheckoutResponse = {
  already_subscribed?: boolean;
  url?: string;
  checkout_url?: string;
  checkoutUrl?: string;
};

type PortalResponse = {
  url?: string;
};

async function authedPost<T>(path: string, body: Record<string, unknown>) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("You must be signed in.");
  }

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${path}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  const json = (await response.json().catch(() => ({}))) as T & {
    error?: string;
    detail?: string;
  };

  if (!response.ok) {
    throw new Error(json.detail || json.error || `Request failed: ${response.status}`);
  }

  return json;
}

export async function startCheckoutOrOpenPortal(params: {
  tierId: string;
  successUrl?: string;
  cancelUrl?: string;
}) {
  const successUrl =
    params.successUrl ??
    `${window.location.origin}/billing/success`;

  const cancelUrl =
    params.cancelUrl ??
    `${window.location.origin}/pricing`;

  const checkout = await authedPost<CheckoutResponse>(
    "billing-stripe-checkout-session",
    {
      tier_id: params.tierId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    },
  );

  if (checkout.already_subscribed) {
    const portal = await authedPost<PortalResponse>(
      "create-billing-portal-session",
      {},
    );

    if (!portal.url) {
      throw new Error("Billing portal URL was missing.");
    }

    window.location.assign(portal.url);
    return { mode: "portal" as const };
  }

  const checkoutUrl = checkout.url || checkout.checkout_url || checkout.checkoutUrl;

  if (!checkoutUrl) {
    throw new Error("Checkout URL was missing.");
  }

  window.location.assign(checkoutUrl);
  return { mode: "checkout" as const };
}