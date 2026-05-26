// Idempotent vocabulary auto-add.
//
// Called from lesson encounter sites (pronunciation drills, IELTS reading
// passages, profession packs) when the learner sees a new word worth
// retaining. We never block the calling flow — every error is swallowed
// and logged via console.warn so a transient supabase hiccup can't
// crash a lesson.
//
// Idempotency model: the (user_id, word) UNIQUE constraint makes the
// underlying INSERT a no-op when the row already exists. We additionally
// pre-check via a select to avoid sending a UPSERT/INSERT when we know
// the row exists — this matters because INSERT on a duplicate triggers
// a constraint violation that the supabase-js client surfaces as an
// error; for callers who pass an `onAdded` callback we only want to
// fire it the FIRST time the word lands.

import { supabase } from "@/lib/supabaseClient";

export type EnsureVocabularyInput = {
  user_id: string;
  word: string;
  ipa?: string | null;
  definition_vi?: string | null;
  definition_en?: string | null;
  example_sentence?: string | null;
  /** Origin tag (e.g. "phoneme:th", "ielts:reading:passage_42"). */
  source?: string | null;
};

export type EnsureVocabularyResult =
  | { ok: true; added: true; id: string }
  | { ok: true; added: false; reason: "already_exists" | "anon" | "empty_word" }
  | { ok: false; error: string };

/**
 * Ensure a vocabulary row exists for (user, word). Safe to call from
 * anywhere; never throws.
 */
export async function ensureVocabulary(
  input: EnsureVocabularyInput,
): Promise<EnsureVocabularyResult> {
  const word = (input.word ?? "").trim();
  if (!word) return { ok: true, added: false, reason: "empty_word" };
  if (!input.user_id) return { ok: true, added: false, reason: "anon" };

  // Pre-check — cheaper than a constraint-violation round-trip and
  // lets us return `added: false` cleanly for callers that gate
  // celebration UI on the "first time" event.
  try {
    const { data: existing, error: selectErr } = await supabase
      .from("user_vocabulary")
      .select("id")
      .eq("user_id", input.user_id)
      .eq("word", word)
      .maybeSingle();
    if (selectErr) {
      return { ok: false, error: extractMessage(selectErr) };
    }
    if (existing && (existing as { id?: string }).id) {
      return { ok: true, added: false, reason: "already_exists" };
    }
  } catch (err) {
    return { ok: false, error: extractMessage(err) };
  }

  // Insert — RLS gates user_id to auth.uid(); we still pass it so the
  // row populates correctly when called server-side under a service
  // key (admin tooling, edge functions).
  try {
    const row = {
      user_id: input.user_id,
      word,
      ipa: input.ipa ?? null,
      definition_vi: input.definition_vi ?? "",
      definition_en: input.definition_en ?? "",
      example_sentence: input.example_sentence ?? null,
      source: input.source ?? null,
    };
    const { data, error: insertErr } = await supabase
      .from("user_vocabulary")
      .insert(row)
      .select("id")
      .single();
    if (insertErr) {
      // 23505 = unique_violation — race between the pre-check and the
      // insert. Treat as "already there" and return cleanly.
      const code = (insertErr as { code?: string }).code;
      if (code === "23505") {
        return { ok: true, added: false, reason: "already_exists" };
      }
      return { ok: false, error: extractMessage(insertErr) };
    }
    return { ok: true, added: true, id: (data as { id: string }).id };
  } catch (err) {
    return { ok: false, error: extractMessage(err) };
  }
}

function extractMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (err && typeof err === "object") {
    const m = (err as Record<string, unknown>).message;
    if (typeof m === "string") return m;
  }
  return String(err);
}
