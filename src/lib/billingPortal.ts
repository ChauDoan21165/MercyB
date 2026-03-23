// src/lib/billingPortal.ts

import { supabase } from "@/integrations/supabase/client";

type BillingPortalResponse = {
  url: string;
};

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

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error("Missing VITE_SUPABASE_URL");
  }

  if (!anonKey) {
    throw new Error("Missing VITE_SUPABASE_ANON_KEY");
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/create-billing-portal-session`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        return_url: returnUrl,
      }),
    },
  );

  const payload = (await response.json()) as Partial<BillingPortalResponse> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error || "Failed to open billing portal");
  }

  if (!payload.url) {
    throw new Error("Billing portal did not return a URL");
  }

  window.location.assign(payload.url);
}