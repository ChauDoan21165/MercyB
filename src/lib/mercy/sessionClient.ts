// src/lib/mercy/sessionClient.ts
//
// Thin Supabase wrapper for the per-user `mercy_unified_sessions` row.
// One row per user holds:
//   - session_type: 'unified' | 'classic' | 'speak_only'
//   - context_summary: small jsonb blob the chat keeps current
// RLS already restricts reads/writes to auth.uid() = user_id, so the
// client just calls upsert/select and trusts policy.
//
// Pure data access — no React. UI hooks live in their own file.

import { supabase } from "../supabaseClient";

export type MercySessionType = "unified" | "classic" | "speak_only";

export type MercyContextSummary = {
  /** Last lesson the learner was in. */
  lessonId?: string;
  /** Last classified intent — useful for re-entry. */
  lastIntent?: string;
  /** Last sentence checked / reviewed. */
  lastSentence?: string;
  /** UI accent the learner picked, if any. */
  preferredVoice?: "mercy" | "josh";
  /** Free-form notes the chat keeps for itself. */
  notes?: Record<string, unknown>;
};

export type MercyUnifiedSession = {
  user_id: string;
  session_type: MercySessionType;
  started_at: string;
  last_message_at: string;
  context_summary: MercyContextSummary;
};

/**
 * Read the current user's unified-session row. Returns null when not
 * signed in or when no row exists yet (first visit).
 */
export async function loadSession(): Promise<MercyUnifiedSession | null> {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) return null;

  const { data, error } = await supabase
    .from("mercy_unified_sessions")
    .select("*")
    .eq("user_id", uid)
    .maybeSingle();

  if (error) {
    console.warn("[mercy.sessionClient] loadSession error:", error.message);
    return null;
  }
  return (data as MercyUnifiedSession) ?? null;
}

/**
 * Toggle the session_type (unified ↔ classic). Used by the settings
 * pane so existing users can opt back into the legacy multi-tab UI.
 * Inserts a row on first call.
 */
export async function setSessionType(
  type: MercySessionType,
): Promise<MercyUnifiedSession | null> {
  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) return null;

  const { data, error } = await supabase
    .from("mercy_unified_sessions")
    .upsert(
      {
        user_id: uid,
        session_type: type,
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .maybeSingle();

  if (error) {
    console.warn("[mercy.sessionClient] setSessionType error:", error.message);
    return null;
  }
  return (data as MercyUnifiedSession) ?? null;
}

/**
 * Patch the context_summary jsonb. Called by the chat after each
 * meaningful turn so a returning user resumes mid-thought.
 */
export async function patchContext(
  patch: Partial<MercyContextSummary>,
): Promise<void> {
  const current = await loadSession();
  const merged: MercyContextSummary = {
    ...(current?.context_summary ?? {}),
    ...patch,
  };

  const { data: userData } = await supabase.auth.getUser();
  const uid = userData?.user?.id;
  if (!uid) return;

  const { error } = await supabase
    .from("mercy_unified_sessions")
    .upsert(
      {
        user_id: uid,
        session_type: current?.session_type ?? "unified",
        context_summary: merged,
        last_message_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

  if (error) {
    console.warn("[mercy.sessionClient] patchContext error:", error.message);
  }
}

/** Default for first-time users — assume the new unified flow. */
export const DEFAULT_SESSION_TYPE: MercySessionType = "unified";
