// src/lib/authService.ts
// Version: MB-BLUE-100.0 — 2026-01-03 (+0700)
//
// PURPOSE:
// - Centralized Supabase authentication helpers
// - Email/password signup, signin, signout, current user fetch
// - VIP helper reads DB view: public.current_user_vip (RLS-protected)

import { supabase } from "./supabaseClient";
import type { VipKey } from "./auth";

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    console.error("Sign up error:", error);
    throw error;
  }
  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Sign in error:", error);
    throw error;
  }
  return data; // data.session, data.user
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Sign out error:", error);
    throw error;
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Get user error:", error);
    throw error;
  }

  return user;
}

/**
 * VIP SOURCE OF TRUTH:
 * - Reads public.current_user_vip (view)
 * - Returns vip_key or "free"
 */
export async function getCurrentVipKey(): Promise<VipKey> {
  try {
    const { data, error } = await supabase
      .from("current_user_vip")
      .select("vip_key")
      .maybeSingle();

    if (error) throw error;

    const raw = String((data as any)?.vip_key ?? "free").toLowerCase();
    if (raw === "vip1" || raw === "vip3" || raw === "vip9") return raw;
    return "free";
  } catch (e) {
    console.warn("getCurrentVipKey: fallback to free", e);
    return "free";
  }
}
