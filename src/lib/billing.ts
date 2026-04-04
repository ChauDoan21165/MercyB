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
  ok?: boolean;
  already_subscribed?: boolean;
  url?: string | null;
  checkout_url?: string | null;
  checkoutUrl?: string | null;
  action?: string | null;
  mode?: string | null;
  message?: string | null;
  current_price_id?: string | null;
  requested_price_id?: string | null;
  tier_id?: string | null;
};

type ChangePlanResponse = {
  ok?: boolean;
  changed?: boolean;
  action?: string | null;
  change_type?: "upgrade" | "downgrade" | "lateral";
  message?: string | null;
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

type JsonLike = {
  error?: string;
  detail?: unknown;
  message?: string;
};

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("User is not authenticated");
  }

  return session.access_token;
}

function extractErrorMessage(payload: JsonLike | null | undefined, fallback: string): string {
  if (!payload) return fallback;

  if (typeof payload.detail === "string" && payload.detail.trim()) {
    return payload.detail;
  }

  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error;
  }

  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message;
  }

  if (payload.detail && typeof payload.detail === "object") {
    const detail = payload.detail as Record<string, unknown>;
    if (typeof detail.message === "string" && detail.message.trim()) {
      return detail.message;
    }
    if (typeof detail.error === "string" && detail.error.trim()) {
      return detail.error;
    }
  }

  return fallback;
}

async function invokeWithAuth<T>(fn: string, body?: unknown): Promise<T> {
  const token = await getAccessToken();

  const { data, error } = await supabase.functions.invoke(fn, {
    body,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    throw new Error(error.message || `${fn} failed`);
  }

  return data as T;
}

function getCheckoutUrl(payload: CheckoutResponse): string {
  return payload.url || payload.checkout_url || payload.checkoutUrl || "";
}

export async function fetchMyEntitlement(): Promise<EntitlementResponse> {
  return invokeWithAuth<EntitlementResponse>("me-entitlement");
}

export async function openBillingPortal(): Promise<{ mode: "portal" }> {
  const data = await invokeWithAuth<PortalResponse>("create-billing-portal-session");

  if (!data?.url) {
    throw new Error("Billing portal URL was missing.");
  }

  window.location.assign(data.url);
  return { mode: "portal" };
}

export async function startCheckoutOrOpenPortal(
  params: StartBillingParams,
): Promise<StartBillingResult> {
  const successUrl =
    params.successUrl ?? `${window.location.origin}/billing/success`;
  const cancelUrl =
    params.cancelUrl ?? `${window.location.origin}/pricing`;

  const requestedPriceId = String(params.priceId ?? "").trim();
  const requestedTierId = String(params.tierId ?? "").trim();

  if (!requestedPriceId && !requestedTierId) {
    throw new Error("tierId or priceId is required.");
  }

  const entitlement = await fetchMyEntitlement().catch(() => null);
  const isPremium = entitlement?.is_premium === true;
  const currentPriceId = String(entitlement?.price_id ?? "").trim();

  if (isPremium && requestedPriceId && currentPriceId && requestedPriceId === currentPriceId) {
    return { mode: "noop" };
  }

  const body = {
    ...(requestedTierId ? { tier_id: requestedTierId } : {}),
    ...(requestedPriceId ? { price_id: requestedPriceId } : {}),
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  const token = await getAccessToken();

  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/billing-stripe-change-plan`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(body),
    },
  );

  const raw = (await response.json().catch(() => null)) as
    | CheckoutResponse
    | ChangePlanResponse
    | JsonLike
    | null;

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(raw as JsonLike, `billing-stripe-change-plan failed (${response.status})`),
    );
  }

  const payload = raw as CheckoutResponse & ChangePlanResponse;

  if (payload.action === "noop" || payload.changed === false) {
    return { mode: "noop" };
  }

  if (payload.action === "change_plan") {
    return {
      mode: "change_plan",
      changeType: payload.change_type ?? undefined,
    };
  }

  if (payload.already_subscribed) {
    return openBillingPortal();
  }

  const checkoutUrl = getCheckoutUrl(payload);

  if (payload.action === "checkout" || payload.mode === "checkout" || checkoutUrl) {
    if (!checkoutUrl) {
      throw new Error("Checkout URL was missing.");
    }

    window.location.assign(checkoutUrl);
    return { mode: "checkout" };
  }

  if (payload.message) {
    throw new Error(payload.message);
  }

  throw new Error("Unexpected billing response.");
}