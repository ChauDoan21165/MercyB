// src/lib/tutor/learnerProfileBuilder.ts
//
// LADDER STEP 14 FULL — Learner history profile builder from server telemetry.
//
// DESIGN: Pure module — no Supabase, no side-channel I/O. Callers supply
// server data via ServerProfileInput; this module transforms it into a
// persisted LearnerHistoryProfile.
//
// WHY PURE: The Study OS boundary (src/lib/tutor/tests/studyOsBoundary.test.ts)
// prohibits Supabase calls inside src/lib/tutor/**. Server reads live in the
// wiring layer (see WIRING SPEC below). This module is fully unit-testable.
//
// DATA SOURCES (for the wiring layer)
// =====================================
// - interferenceTagCounts: read from public.conversation_events
//     SELECT error_details, created_at WHERE event_type IN
//     ('error_detected','correction_accepted','correction_rejected')
//     ORDER BY created_at DESC LIMIT 200 — RLS user-scoped (user_id via JWT)
//     Extract: error_details.errorType (or .interferencePattern or .tag)
//
// - sessionCount: COUNT(*) from public.conversations WHERE user_id = auth.uid()
//
// Both tables are LIVE post-B1 migration 20260716000000_conversation_capture.sql.
// Use the browser Supabase client (src/lib/supabaseClient) which is RLS-scoped.
// Wrap every call in try/catch — fail-soft to {} / 0 on any error.
//
// ─────────────────────────────────────────────────────────────────────────────
// WIRING SPEC (for A1 — engine + page wiring; A2 does NOT edit these files)
// ─────────────────────────────────────────────────────────────────────────────
//
// Surface 1 — AiTutor.tsx (src/pages/AiTutor.tsx)
// ─────────────────────────────────────────────────
// WHERE:  The `loadMemory` function (lines 1800-1801) + its useEffect (1805).
//         `recallUserId` is already available at line 1810.
//
// ADD (after line 1801 — inside loadMemory):
//
//   import { supabase } from "@/lib/supabaseClient";
//   import { syncProfileWithServerData, type ServerProfileInput }
//     from "@/lib/tutor/learnerProfileBuilder";
//   import { recommendNextLessons } from "@/lib/tutor/nextLessonRecommender";
//
//   // 1. Fetch server interference data (fail-soft: use {} / 0 on error)
//   const serverInput = await fetchServerProfileInput(recallUserId, supabase);
//   // 2. Merge with local profile + persist to localStorage
//   const profile = syncProfileWithServerData(TUTOR_PRODUCT, target, serverInput);
//   // 3. Surface top recommendation in TutorMemoryCard (no new UI component needed)
//   const recs = recommendNextLessons(profile);
//   if (recs[0]?.ruleFired !== "cold-start:abstain") {
//     setMemory(prev =>
//       prev ? { ...prev, nextRecommendedFocus: recs[0].lessonTitle,
//                         suggestedNextFocus:    recs[0].lessonTitle } : prev
//     );
//   }
//
// `fetchServerProfileInput` (add as a helper, e.g. in
//  src/lib/ai-conversation/serverInterferenceMemory.ts next to loadServerInterferenceTags):
//
//   export async function fetchServerProfileInput(
//     userId: string | null | undefined,
//     client: typeof supabase,
//   ): Promise<ServerProfileInput> {
//     if (!userId) return { interferenceTagCounts: {}, sessionCount: 0 };
//     try {
//       const [eventsRes, countRes] = await Promise.all([
//         client.from("conversation_events")
//           .select("error_details, created_at")
//           .in("event_type", ["error_detected","correction_accepted","correction_rejected"])
//           .not("error_details", "is", null)
//           .order("created_at", { ascending: false })
//           .limit(200),
//         client.from("conversations")
//           .select("*", { count: "exact", head: true })
//           .eq("user_id", userId),
//       ]);
//       const tagCounts: Record<string, number> = {};
//       for (const row of eventsRes.data ?? []) {
//         const d = row.error_details as Record<string, unknown> | null;
//         const tag = typeof d?.errorType === "string" ? d.errorType.trim() : null;
//         if (tag) tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
//       }
//       return { interferenceTagCounts: tagCounts,
//                sessionCount: Math.max(0, countRes.count ?? 0) };
//     } catch { return { interferenceTagCounts: {}, sessionCount: 0 }; }
//   }
//
// Surface 2 — MercyGuidePanel.tsx (src/components/mercy-guide/MercyGuidePanel.tsx)
// ─────────────────────────────────────────────────────────────────────────────────
// WHERE:  The `journeyTitle` prop (line 131) passed to MercyGuideTab (line 169).
//
// ADD (inside a session-init useEffect):
//   const profile = syncProfileWithServerData(...);
//   const recs = recommendNextLessons(profile);
//   const title = recs[0]?.ruleFired !== "cold-start:abstain"
//     ? recs[0].lessonTitle : undefined;
//   // Pass: <MercyGuidePanel journeyTitle={title} ...>
//   // MercyGuideTab already renders journeyTitle (line 183) — no new UI needed.
//
// SAFETY CONTRACT (both surfaces)
// ────────────────────────────────
// 1. Fetch server data only when userId is non-null (authenticated learner).
// 2. Always guard on recs[0].ruleFired !== "cold-start:abstain" before surfacing.
// 3. Both surfaces degrade gracefully when serverInput is empty ({}+0) — they fall
//    back to the device-local profile. The learner never sees an error.
// ─────────────────────────────────────────────────────────────────────────────

import type { TutorProduct } from "@/lib/ai-tutor/learningMemory";
import {
  createEmptyLearnerHistoryProfile,
  loadLearnerHistoryProfile,
  saveLearnerHistoryProfile,
  recordInterferencePattern,
} from "@/lib/tutor/learnerHistoryProfile";
import type { LearnerHistoryProfile, VietEnInterferenceTag } from "@/lib/tutor/learnerHistoryProfile";

// ---------------------------------------------------------------------------
// Input type — caller supplies server-fetched data
// ---------------------------------------------------------------------------

/**
 * Server-side aggregate data for a single learner.
 * Supplied by the wiring layer (see WIRING SPEC fetchServerProfileInput above).
 *
 * Both fields default to safe-empty on any Supabase error in the caller.
 */
export type ServerProfileInput = {
  /** tag → observed-count from conversation_events error_details. */
  interferenceTagCounts: Record<string, number>;
  /** Total conversation rows for this user. 0 on error. */
  sessionCount: number;
};

// ---------------------------------------------------------------------------
// Pure profile builder
// ---------------------------------------------------------------------------

/**
 * Build a LearnerHistoryProfile from already-fetched server data.
 *
 * Returns null when serverInput contains no signal (all zeros/empty) so the
 * caller knows the server leg had nothing to contribute.
 */
export function buildProfileFromServerData(
  product: TutorProduct,
  targetLanguage: string,
  serverInput: ServerProfileInput,
  now = Date.now(),
): LearnerHistoryProfile | null {
  const tagEntries = Object.entries(serverInput.interferenceTagCounts);
  if (tagEntries.length === 0 && serverInput.sessionCount === 0) return null;

  let profile = createEmptyLearnerHistoryProfile(product, targetLanguage, now);
  profile = { ...profile, sessionCount: Math.max(0, serverInput.sessionCount) };

  // Apply interference counts in descending frequency so the most-observed
  // patterns appear first after repeated recordInterferencePattern calls.
  const sorted = tagEntries.sort((a, b) => b[1] - a[1]);
  for (const [tag, count] of sorted) {
    for (let i = 0; i < count; i++) {
      profile = recordInterferencePattern(profile, tag as VietEnInterferenceTag, now);
    }
  }

  return profile;
}

// ---------------------------------------------------------------------------
// Merge + persist
// ---------------------------------------------------------------------------

/**
 * Full sync cycle:
 * 1. Load the existing device-local profile (carries topicMastery, preferredMode).
 * 2. Build a server-derived profile from the supplied ServerProfileInput.
 * 3. Merge: server interference leads (cross-device signal), device-local mastery
 *    is preserved verbatim.
 * 4. Save the merged result to localStorage and return it.
 *
 * Pure: no I/O, no Supabase. Caller fetches server data and passes it here.
 * Always returns a valid profile — never throws.
 */
export function syncProfileWithServerData(
  product: TutorProduct,
  targetLanguage: string,
  serverInput: ServerProfileInput,
  now = Date.now(),
): LearnerHistoryProfile {
  const localProfile =
    loadLearnerHistoryProfile(product, targetLanguage) ??
    createEmptyLearnerHistoryProfile(product, targetLanguage, now);

  const serverProfile = buildProfileFromServerData(product, targetLanguage, serverInput, now);

  if (!serverProfile) {
    // No server signal — return local profile unchanged.
    return localProfile;
  }

  // Server interference replaces local (cross-device data wins);
  // local topicMastery + preferredMode preserved (engine-populated).
  const merged: LearnerHistoryProfile = {
    ...localProfile,
    sessionCount: Math.max(localProfile.sessionCount, serverProfile.sessionCount),
    interferencePatterns: serverProfile.interferencePatterns,
    updatedAt: now,
  };

  return saveLearnerHistoryProfile(merged, now);
}
