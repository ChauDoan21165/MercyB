// src/lib/ai-tutor/studyPath.ts
//
// LADDER STEP 15 wiring (A1) — turns the pure interference sequencer into a
// study-path view model for the UI. The sequencer + scorer live in
// src/lib/sequencing/** (A3, pure); this module is the A1 wiring layer that
// joins their output to the VN_L1 pattern catalogue for display.
//
// Pure: no React, no Supabase, no IndexedDB. The caller loads the device-local
// LearnerHistoryProfile and passes it in (+ a real `now`).

import { deriveMasteryProfile } from "@/lib/sequencing/masteryScorer";
import { sequenceInterferencePatterns } from "@/lib/sequencing/interferenceSequencer";
import { VN_L1_INTERFERENCE_PATTERNS } from "@/data/placement/vnL1Interference";
import type { LearnerHistoryProfile } from "@/lib/tutor/learnerHistoryProfile";

/** One display row in the study path. */
export type StudyPathItem = {
  patternId: string;
  /** Human label from the VN_L1 catalogue. */
  name: string;
  /** One-line description from the catalogue. */
  shortDescription: string;
  /** Remediation hint from the catalogue. */
  remediation: string;
  /** Why this pattern is prioritised now (from the sequencer). */
  rationale: string;
};

/**
 * Build the ordered study-path items (highest-priority first) from a learner's
 * device-local history. Empty history is safe — the sequencer falls back to the
 * default curriculum order (severity high → medium → low), so this always
 * returns the full catalogue ordered, never throws.
 *
 * @param now real epoch ms (drives spaced-repetition due-ness; pass Date.now()).
 */
export function sequenceToStudyItems(
  historyProfile: LearnerHistoryProfile,
  now: number,
): StudyPathItem[] {
  const profile = deriveMasteryProfile(historyProfile, VN_L1_INTERFERENCE_PATTERNS, now);
  const sequence = sequenceInterferencePatterns(profile, VN_L1_INTERFERENCE_PATTERNS, now);
  const byId = new Map(VN_L1_INTERFERENCE_PATTERNS.map((p) => [p.id, p]));
  const items: StudyPathItem[] = [];
  for (const entry of sequence.entries) {
    const pattern = byId.get(entry.patternId);
    if (!pattern) continue; // sequencer only emits known ids, but stay defensive
    items.push({
      patternId: entry.patternId,
      name: pattern.name,
      shortDescription: pattern.shortDescription,
      remediation: pattern.remediation,
      rationale: entry.rationale,
    });
  }
  return items;
}
