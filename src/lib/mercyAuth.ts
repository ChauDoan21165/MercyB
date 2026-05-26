// src/lib/mercyAuth.ts
import { supabase } from "@/lib/supabaseClient";

const mercyLoginUrl = String(import.meta.env.VITE_MERCY_LOGIN_URL ?? "").trim();

/**
 * Compatibility shim:
 * - Keep export name stable for old imports.
 * - Do NOT create a second Supabase client.
 * - Canonical client lives in "@/lib/supabaseClient".
 */
export const mercyAuth = supabase;

export function redirectToMercyLogin(returnTo: string) {
  if (!mercyLoginUrl) {
    console.warn("[mercyAuth] Missing VITE_MERCY_LOGIN_URL; cannot redirect.");
    return;
  }

  const url = `${mercyLoginUrl}?returnTo=${encodeURIComponent(returnTo)}`;
  window.location.assign(url);
}

export async function getMercyUserId(): Promise<string | null> {
  try {
    const { data, error } = await mercyAuth.auth.getSession();
    if (error) return null;
    return data.session?.user?.id ?? null;
  } catch {
    return null;
  }
}