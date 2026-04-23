// src/lib/placement/persistence.ts
//
// Supabase writer for placement-test completion. Called from two places:
//
//   1. Results screen, after the adult test completes (or Finish Early)
//      method: 'test'
//   2. Who-for screen, when the user picks "My child (4–10)"
//      method: 'self_report_kid' (no test was taken)
//
// Writes to three tables:
//   - user_placements   (append-only audit row)
//   - profiles          (latest-result snapshot update)
//   - mb_user_weakness_profile  (one UPSERT per weakness flag)
//
// Error-resilience: every write is independent. A failure in one does
// not block the others, and no failure blocks the UI from advancing to
// the Results screen. The returned SavePlacementResult reports per-write
// status for observability.

import { supabase } from '@/lib/supabaseClient';
import type { QuestionResponse, ResultCEFR } from './engine';

export type PlacementMethod = 'test' | 'self_report_kid';

export type SavePlacementInput = {
  userId: string;
  method: PlacementMethod;
  cefr: ResultCEFR;
  /** Final numeric estimate (0.5..6.5). Null for kid self-report since
   *  no test was taken. */
  score: number | null;
  recommendedRoomId: string;
  /** Full per-question log from the engine. Empty array for kid self-report. */
  questionResponses: QuestionResponse[];
  /** Diagnostic tags (deduped). Empty array for kid self-report. */
  weaknessFlags: string[];
  /** Total elapsed time on the test in ms. Null for kid self-report. */
  elapsedMs: number | null;
};

export type SavePlacementResult = {
  /** True when user_placements insert AND profiles update both succeeded. */
  ok: boolean;
  userPlacementsInserted: boolean;
  profileUpdated: boolean;
  weaknessRowsWritten: number;
  errors: string[];
};

const WEAKNESS_CATEGORY = 'vietnamese_l1_interference';
// mb_user_weakness_profile.mastery_level is numeric. Existing writers in
// server/host/renderer.ts don't set this field, but our placement detector
// wants to surface "struggling" signal. 0 = no mastery, 1 = full mastery;
// 0.2 = struggling (detected gap, no practice yet).
const INITIAL_MASTERY_STRUGGLING = 0.2;
const INITIAL_SEVERITY = 1.0;

/**
 * Write the placement result to Supabase. Never throws — collects errors
 * and returns them for caller-side logging. Designed to be fire-and-report
 * from the UI: the Results screen shows local state immediately, the
 * write result is observed separately.
 */
export async function savePlacementResult(
  input: SavePlacementInput,
): Promise<SavePlacementResult> {
  const result: SavePlacementResult = {
    ok: false,
    userPlacementsInserted: false,
    profileUpdated: false,
    weaknessRowsWritten: 0,
    errors: [],
  };

  // 1. Audit row — user_placements
  try {
    const { error } = await supabase.from('user_placements').insert({
      user_id: input.userId,
      placement_method: input.method,
      cefr: input.cefr,
      score: input.score,
      recommended_room_id: input.recommendedRoomId,
      // jsonb columns accept arrays/objects directly via supabase-js
      question_responses: input.questionResponses as never,
      weakness_flags: input.weaknessFlags as never,
      elapsed_ms: input.elapsedMs,
    });
    if (error) {
      result.errors.push(`user_placements.insert: ${error.message}`);
    } else {
      result.userPlacementsInserted = true;
    }
  } catch (err) {
    result.errors.push(
      `user_placements.insert threw: ${(err as Error)?.message ?? String(err)}`,
    );
  }

  // 2. Snapshot update — profiles
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        placement_cefr: input.cefr,
        placement_score: input.score,
        placement_starting_room: input.recommendedRoomId,
        placement_completed_at: new Date().toISOString(),
        placement_weaknesses: input.weaknessFlags as never,
      } as never)
      .eq('id', input.userId);
    if (error) {
      result.errors.push(`profiles.update: ${error.message}`);
    } else {
      result.profileUpdated = true;
    }
  } catch (err) {
    result.errors.push(
      `profiles.update threw: ${(err as Error)?.message ?? String(err)}`,
    );
  }

  // 3. Weakness profile — one row per flag, UPSERT by (user_id, category, key_pattern)
  // Matches the pattern already used by server/host/renderer.ts.
  const nowIso = new Date().toISOString();
  for (const tag of input.weaknessFlags) {
    try {
      const { data: existing } = await supabase
        .from('mb_user_weakness_profile')
        .select('user_id, category, key_pattern, frequency')
        .eq('user_id', input.userId)
        .eq('category', WEAKNESS_CATEGORY)
        .eq('key_pattern', tag)
        .maybeSingle();

      if (!existing) {
        const { error } = await supabase
          .from('mb_user_weakness_profile')
          .insert({
            user_id: input.userId,
            category: WEAKNESS_CATEGORY,
            key_pattern: tag,
            frequency: 1,
            last_seen: nowIso,
            mastery_level: INITIAL_MASTERY_STRUGGLING,
            severity_score: INITIAL_SEVERITY,
          });
        if (error) {
          result.errors.push(
            `mb_user_weakness_profile.insert[${tag}]: ${error.message}`,
          );
        } else {
          result.weaknessRowsWritten += 1;
        }
        continue;
      }

      const currentFreq = Number(
        (existing as { frequency?: number | null }).frequency ?? 0,
      );
      const nextFreq = (Number.isFinite(currentFreq) ? currentFreq : 0) + 1;

      const { error } = await supabase
        .from('mb_user_weakness_profile')
        .update({
          frequency: nextFreq,
          last_seen: nowIso,
        })
        .eq('user_id', input.userId)
        .eq('category', WEAKNESS_CATEGORY)
        .eq('key_pattern', tag);
      if (error) {
        result.errors.push(
          `mb_user_weakness_profile.update[${tag}]: ${error.message}`,
        );
      } else {
        result.weaknessRowsWritten += 1;
      }
    } catch (err) {
      result.errors.push(
        `mb_user_weakness_profile[${tag}] threw: ${(err as Error)?.message ?? String(err)}`,
      );
    }
  }

  result.ok = result.userPlacementsInserted && result.profileUpdated;
  return result;
}
