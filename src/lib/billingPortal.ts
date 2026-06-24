// src/lib/billingPortal.ts

import { supabase } from "@/integrations/supabase/client";

type BillingPortalResponse = {
  url: string;
};

const PORTAL_TIMEOUT_MS = 12000;

export async function openBillingPortal(returnUrl?: string): Promise<void> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session?.access_token) {
    throw new Error("You must be signed in to manage your subscription.");
  }

  const supabaseUrl = String(import.meta.env.VITE_SUPABASE_URL ?? "").trim();
  const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

  if (!supabaseUrl) throw new Error("Missing VITE_SUPABASE_URL");
  if (!anonKey) throw new Error("Missing VITE_SUPABASE_ANON_KEY");

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    PORTAL_TIMEOUT_MS,
  );

  let response: Response;
  try {
    response = await fetch(
      `${supabaseUrl}/functions/v1/create-billing-portal-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: anonKey,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ return_url: returnUrl }),
        signal: controller.signal,
      },
    );
  } catch (err) {
    const errorName =
      typeof err === "object" && err !== null && "name" in err
        ? String((err as { name?: unknown }).name)
        : "";
    const isAbort = errorName === "AbortError";
    throw new Error(
      isAbort
        ? "Billing portal request timed out. Please try again."
        : "Unable to reach billing portal. Please check your connection.",
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  // Parse JSON safely — response body may not be valid JSON on server errors
  let payload: Partial<BillingPortalResponse> & { error?: string } = {};
  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    throw new Error(
      `Billing portal returned an unexpected response (${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new Error(
      typeof payload.error === "string" && payload.error.trim()
        ? payload.error
        : "Failed to open billing portal.",
    );
  }

  if (!payload.url) {
    throw new Error("Billing portal did not return a URL.");
  }

  window.location.assign(payload.url);
}