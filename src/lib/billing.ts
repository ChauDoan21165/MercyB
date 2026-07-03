// PATH: src/lib/billing.ts

import { supabase } from "@/lib/supabaseClient";

export type EntitlementResponse = {
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

export type CheckoutResponse = {
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

export type ChangePlanResponse = {
  ok?: boolean;
  changed?: boolean;
  action?: string | null;
  change_type?: "upgrade" | "downgrade" | "lateral";
  message?: string | null;
  previous_price_id?: string | null;
  requested_price_id?: string | null;
};

export type PortalResponse = {
  url?: string | null;
};

export type StartBillingParams = {
  tierId?: string;
  priceId?: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type StartBillingResult =
  | { mode: "checkout" }
  | { mode: "portal" }
  | { mode: "change_plan"; changeType?: "upgrade" | "downgrade" | "lateral" }
  | { mode: "noop" };

type JsonLike = {
  error?: string;
  detail?: unknown;
  message?: string;
};

type BillingResponse = CheckoutResponse & ChangePlanResponse & JsonLike;
type JsonObject = Record<string, unknown>;
type FunctionBody =
  | File
  | Blob
  | ArrayBuffer
  | FormData
  | ReadableStream<Uint8Array>
  | JsonObject
  | string;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

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

function extractErrorMessage(
  payload: JsonLike | null | undefined,
  fallback: string,
): string {
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

  if (isRecord(payload.detail)) {
    const detail = payload.detail;

    if (typeof detail.message === "string" && detail.message.trim()) {
      return detail.message;
    }

    if (typeof detail.error === "string" && detail.error.trim()) {
      return detail.error;
    }
  }

  return fallback;
}

async function invokeWithAuth<T>(fn: string, body?: FunctionBody): Promise<T> {
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
  const value = payload.url ?? payload.checkout_url ?? payload.checkoutUrl ?? "";
  return typeof value === "string" ? value : "";
}

async function parseJsonResponse(response: Response): Promise<BillingResponse | null> {
  const raw: unknown = await response.json().catch(() => null);
  if (!isRecord(raw)) return null;
  return raw as BillingResponse;
}

function getSupabaseFunctionUrl(functionName: string): string {
  const baseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();

  if (!baseUrl) {
    throw new Error("VITE_SUPABASE_URL is missing.");
  }

  return `${baseUrl}/functions/v1/${functionName}`;
}

function getSupabaseAnonKey(): string {
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

  if (!anonKey) {
    throw new Error("VITE_SUPABASE_ANON_KEY is missing.");
  }

  return anonKey;
}

export async function fetchMyEntitlement(): Promise<EntitlementResponse> {
  return invokeWithAuth<EntitlementResponse>("me-entitlement");
}

export async function openBillingPortal(): Promise<{ mode: "portal" }> {
  const data =
    await invokeWithAuth<PortalResponse>("create-billing-portal-session");

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

  const entitlement = await fetchMyEntitlement().catch(
    (): EntitlementResponse | null => null,
  );
  const isPremium = entitlement?.is_premium === true;
  const currentPriceId = String(entitlement?.price_id ?? "").trim();

  if (
    isPremium &&
    requestedPriceId &&
    currentPriceId &&
    requestedPriceId === currentPriceId
  ) {
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
    getSupabaseFunctionUrl("billing-stripe-change-plan"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        apikey: getSupabaseAnonKey(),
      },
      body: JSON.stringify(body),
    },
  );

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(
        payload,
        `billing-stripe-change-plan failed (${response.status})`,
      ),
    );
  }

  if (payload?.action === "noop" || payload?.changed === false) {
    return { mode: "noop" };
  }

  if (payload?.action === "change_plan") {
    return {
      mode: "change_plan",
      changeType: payload.change_type ?? undefined,
    };
  }

  // ── DUPLICATE SUBSCRIPTION GUARD ──────────────────────────────
  // Backend returns action:"manage_billing" (or "already_subscribed",
  // or already_subscribed:true) when the user already has an
  // active/trialing/past_due Stripe subscription. Send them to the
  // billing portal instead of starting a new checkout session.
  //
  // The two action-string forms cover backend response-shape
  // variation observed across older and newer code paths in
  // billing-stripe-change-plan; the boolean field is a third
  // historical signal kept for backwards compatibility.
  if (
    payload?.action === "manage_billing" ||
    payload?.action === "already_subscribed" ||
    payload?.already_subscribed
  ) {
    return openBillingPortal();
  }
  // ──────────────────────────────────────────────────────────────

  const checkoutUrl = getCheckoutUrl(payload ?? {});

  if (
    payload?.action === "checkout" ||
    payload?.mode === "checkout" ||
    Boolean(checkoutUrl)
  ) {
    if (!checkoutUrl) {
      throw new Error("Checkout URL was missing.");
    }

    window.location.assign(checkoutUrl);
    return { mode: "checkout" };
  }

  if (typeof payload?.message === "string" && payload.message.trim()) {
    throw new Error(payload.message);
  }

  throw new Error("Unexpected billing response.");
}
