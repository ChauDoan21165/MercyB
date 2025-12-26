// src/lib/authService.ts
// Version: MB-BLUE-93.6 — 2025-12-23 (+0700)
//
// PURPOSE:
// - Centralized Supabase authentication helpers
// - Email/password signup, signin, signout, current user fetch
//
// NOTES:
// - User creation behavior depends on Supabase Dashboard setting:
//   Confirm email ON  → user appears only after email confirmation
//   Confirm email OFF → user appears immediately

import { supabase } from "./supabaseClient";

export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Sign up error:", error);
    throw error;
  }

  return data;
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

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
