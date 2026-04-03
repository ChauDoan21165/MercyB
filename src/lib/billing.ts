import { supabase } from "@/lib/supabaseClient";

type EntitlementResponse = {
  is_premium?: boolean;
  status?: string | null;
  source?: string | null;
  expires_at?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end?: boolean | null;
  price_id?: string | null;
  plan_name?: string | null;
  vip_tier?: string | null;
};

type CheckoutResponse = {
  already_subscribed?: boolean;
  url?: string;
  checkout_url?: string;
  checkoutUrl?: string;
  action?: string;
  message?: string;
  current_price_id?: string | null;
  requested_price_id?: string | null;
};

type ChangePlanResponse = {
  ok?: boolean;
  changed?: boolean;
  action?: string;
  change_type?: "upgrade" | "downgrade" | "lateral";
  message?: string;
  previous_price_id?: string | null;
  requested_price_id?: string | null;
};

type PortalResponse = {
  url?: string;
};

type StartBillingParams = {
  tierId?: string;
  priceId?: string;
  successUrl?: string;
  cancelUrl?: string;
};

type StartBillingResult =
  | { mode: "checkout" }
  | { mode: "portal" }
  | { mode: "change_plan"; changeType?: "upgrade" | "downgrade" | "lateral" }
  | { mode: "noop" };

function getSupabaseUrl(): string {
  return String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
}

function getSupabaseAnonKey(): string {
  return String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();
}

function extractErrorMessage(
  json: { error?: string; detail?: unknown; message?: string },
  fallback: string,
): string {
  if (typeof json.detail === "string" && json.detail.trim()) return json.detail;
  if (typeof json.error === "string" && json.error.trim()) return json.error;
  if (typeof json.message === "string" && json.message.trim()) return json.message;

  if (json.detail && typeof json.detail === "object") {
    const record = json.detail as Record<string, unknown>;
    if (typeof record.message === "string" && record.message.trim()) {
      return record.message;
    }
  }

  return fallback;
}

function getCheckoutUrl(payload: CheckoutResponse): string {
  return payload.url || payload.checkout_url || payload.checkoutUrl || "";
}

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.access_token) {
    throw new Error("You must be signed in.");
  }

  return session.access_token;
}

async function authedPost<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const accessToken = await getAccessToken();
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(anonKey ? { apikey: anonKey } : {}),
    },
    body: JSON.stringify(body),
  });

  const json = (await response.json().catch(() => ({}))) as T & {
    error?: string;
    detail?: unknown;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(json, `Request failed: ${response.status}`),
    );
  }

  return json;
}

export async function fetchMyEntitlement(): Promise<EntitlementResponse> {
  const accessToken = await getAccessToken();
  const supabaseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL");
  }

  const response = await fetch(`${supabaseUrl}/functions/v1/me-entitlement`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(anonKey ? { apikey: anonKey } : {}),
    },
  });

  const json = (await response.json().catch(() => ({}))) as EntitlementResponse & {
    error?: string;
    detail?: unknown;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(json, `Entitlement request failed: ${response.status}`),
    );
  }

  return json;
}

export async function openBillingPortal(): Promise<{ mode: "portal" }> {
  const portal = await authedPost<PortalResponse>(
    "create-billing-portal-session",
    {},
  );

  if (!portal.url) {
    throw new Error("Billing portal URL was missing.");
  }

  window.location.assign(portal.url);
  return { mode: "portal" };
}

export async function startCheckoutOrOpenPortal(
  params: StartBillingParams,
): Promise<StartBillingResult> {
  const successUrl =
    params.successUrl ?? `${window.location.origin}/billing/success`;

  const cancelUrl =
    params.cancelUrl ?? `${window.location.origin}/pricing`;

  const entitlement = await fetchMyEntitlement().catch(() => null);
  const isPremium = entitlement?.is_premium === true;
  const currentPriceId = String(entitlement?.price_id ?? "").trim();

  const requestedPriceId = String(params.priceId ?? "").trim();
  const requestedTierId = String(params.tierId ?? "").trim();

  if (!requestedPriceId && !requestedTierId) {
    throw new Error("tierId or priceId is required.");
  }

  if (isPremium) {
    if (requestedPriceId && currentPriceId && requestedPriceId === currentPriceId) {
      return { mode: "noop" };
    }

    const changePlan = await authedPost<ChangePlanResponse>(
      "billing-stripe-change-plan",
      {
        ...(requestedTierId ? { tier_id: requestedTierId } : {}),
        ...(requestedPriceId ? { price_id: requestedPriceId } : {}),
      },
    );

    if (changePlan.changed === false || changePlan.action === "noop") {
      return { mode: "noop" };
    }

    return {
      mode: "change_plan",
      changeType: changePlan.change_type,
    };
  }

  const checkout = await authedPost<CheckoutResponse>(
    "billing-stripe-checkout-session",
    {
      ...(requestedTierId ? { tier_id: requestedTierId } : {}),
      ...(requestedPriceId ? { price_id: requestedPriceId } : {}),
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
    return { mode: "portal" };
  }

  const checkoutUrl = getCheckoutUrl(checkout);

  if (!checkoutUrl) {
    throw new Error("Checkout URL was missing.");
  }

  window.location.assign(checkoutUrl);
  return { mode: "checkout" };
}