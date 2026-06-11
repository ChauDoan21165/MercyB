// src/lib/ai-conversation/serverInterferenceMemory.ts
//
// Step-12 cross-DEVICE recall (server-side leg). The client-side leg (!830)
// reads device-local correction aggregates from IndexedDB; that only follows a
// learner on the same browser. This module reads the learner's most frequent
// recent interference tags from their consent-captured conversation events
// (public.conversation_events, RLS user-scoped) so a returning learner on a
// DIFFERENT device gets the same recall.
//
// FAIL-SOFT by contract: every path returns []/null on any error, empty result,
// or absent table, so callers degrade cleanly to client-only recall until the
// richer B1 capture tables are fully live. Server recall is additive, never a
// dependency.

import { supabase } from "@/lib/supabaseClient";
import type { MemorySummary } from "@/lib/ai-tutor/learningMemory";
import type { ConversationLearnerMemory } from "@/lib/ai-conversation/client";

/** Events whose error_details may carry an interference tag. */
const TAGGED_EVENT_TYPES = ["error_detected", "correction_accepted", "correction_rejected"] as const;

/** Pull a safe interference tag out of a captured event's jsonb error_details. */
function extractTag(details: unknown): string | null {
  if (!details || typeof details !== "object") return null;
  const record = details as Record<string, unknown>;
  const raw = record.errorType ?? record.interferencePattern;
  const tag = typeof raw === "string" ? raw.trim() : "";
  return tag || null;
}

/**
 * Read the learner's top recent interference tags from server-captured
 * conversation events (most-frequent first). RLS scopes the query to the
 * caller's own conversations. Returns [] on any failure / empty / no user.
 */
export async function loadServerInterferenceTags(
  userId: string | null | undefined,
  limit = 3,
): Promise<string[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from("conversation_events")
      .select("error_details, created_at")
      .in("event_type", TAGGED_EVENT_TYPES as unknown as string[])
      .not("error_details", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error || !Array.isArray(data)) return [];
    const counts = new Map<string, number>();
    for (const row of data) {
      const tag = extractTag((row as { error_details?: unknown }).error_details);
      if (tag) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, Math.max(0, limit))
      .map(([tag]) => tag);
  } catch {
    return [];
  }
}

/**
 * Merge server (cross-device) interference tags with the device-local memory
 * summary into the prompt-ready ConversationLearnerMemory. Server tags lead
 * (they reflect cross-device history); device-local tags fill in; deduped and
 * capped. Returns null when there is nothing to recall (first-ever learner on a
 * fresh device with no server history) so the prompt gets no spurious note.
 */
export function mergeRecallMemory(
  serverTags: string[],
  summary: MemorySummary | null,
  limit = 3,
): ConversationLearnerMemory | null {
  const clientTags = summary?.commonMistakePatterns ?? [];
  const interferencePatterns = [
    ...new Set(
      [...serverTags, ...clientTags]
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean),
    ),
  ].slice(0, Math.max(0, limit));
  const recentFocus = summary?.lastPracticedTopic || summary?.nextRecommendedFocus || null;
  if (interferencePatterns.length === 0 && !recentFocus) return null;
  return { interferencePatterns, recentFocus };
}
