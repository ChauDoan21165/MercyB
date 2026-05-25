/**
 * Detector → AI Tutor chip helper.
 *
 * Bridges a single L1 detector firing (`L1DetectionResult`) into the
 * content + visibility decision for the small pattern-awareness chip
 * rendered below the AI Tutor correction response. Pure functions
 * except for the sessionStorage dedup, which is the only side effect.
 *
 * Why this lives separately from the chip component:
 *   - The severity gate, the per-tag content lookup, and the
 *     session-dedup policy are all testable without React.
 *   - The chip component stays presentational.
 *
 * Source-of-content note. The dispatch suggested sourcing the
 * Vietnamese rationale from `viL1Profile.interference.patterns[]`
 * (vietnameseRoot / shortDescription). On inspection neither is the
 * right shape for an in-conversation chip: shortDescription is
 * English; vietnameseRoot is multi-sentence academic register often
 * >300 chars. The bridge already authored for this surface is
 * `L1_VN_EXPLANATIONS` — keyed 1:1 on `L1WeaknessTag` (the same key
 * the detector emits), with a ≤300-char mobile-display budget and
 * teacher-voice Vietnamese (per Round 5 CC4 brief). That's what we
 * read here. `viL1Profile.interference.patterns` remains the
 * runtime atlas consumed by `promptAssembly` (PR #1131).
 */

import { L1_VN_EXPLANATIONS } from "@/lib/feedback/l1-vn-explanations";
import type {
  L1DetectionResult,
  L1WeaknessTag,
} from "@/lib/feedback/l1-error-detector";

/**
 * The set of `L1WeaknessTag` values that map (by concept) to
 * high-severity patterns in `viL1Profile.interference.patterns`.
 * Hand-curated against the 6 high-severity profile patterns:
 *
 *   inflectional_s_ed_inaudible
 *   past_tense_unmarked
 *   copula_be_omission
 *   question_word_order_transfer
 *   negation_no_not_placement
 *   final_consonant_cluster_reduction         (phonology — no grammar
 *                                              detector tag; absent here)
 *
 * The grammar detector emits structural tags; the phonology pattern
 * above doesn't surface from this detector, so it's not in the set.
 * Adding more tags later is additive-safe — they just start chipping.
 */
export const HIGH_SEVERITY_DETECTOR_TAGS: ReadonlySet<L1WeaknessTag> =
  new Set<L1WeaknessTag>([
    "vi_l1_3rd_person_s",
    "vi_l1_past_ed",
    "vi_l1_plural_s",
    "vi_l1_missing_be",
    "vi_l1_question_no_aux",
    "vi_l1_double_negative",
  ]);

/** Render-side content for one chip. */
export interface DetectorHintContent {
  /** Short English label derived from the detector tag. */
  nameEn: string;
  /** Vietnamese rationale, ≤300 chars (sourced from L1_VN_EXPLANATIONS). */
  rationaleVi: string;
  /** Stable id used for session dedup. */
  tag: L1WeaknessTag;
}

/**
 * Pretty English labels for the high-severity tags. The dispatch
 * specified the chip label as "short English ... family-id converted
 * to readable form (e.g. 'third_person_s' → 'Third-person -s')".
 * Mechanical conversion would produce awkward results like "3rd
 * Person S"; this small table is hand-shaped for the 6 patterns that
 * actually chip. Tags outside this table fall back to a tag-derived
 * label (never user-visible since they're filtered out anyway).
 */
const TAG_TO_NAME_EN: Partial<Record<L1WeaknessTag, string>> = {
  vi_l1_3rd_person_s: "Third-person -s",
  vi_l1_past_ed: "Past tense -ed",
  vi_l1_plural_s: "Plural -s",
  vi_l1_missing_be: "Missing 'to be'",
  vi_l1_question_no_aux: "Question without do/does/did",
  vi_l1_double_negative: "Double negative",
};

function tagFallbackLabel(tag: string): string {
  return tag
    .replace(/^vi_l1_/, "")
    .split("_")
    .map((w) => (w.length === 0 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/**
 * Decide whether a detection result deserves a chip and (if so)
 * return the content to render. Returns null when:
 *   - the detector didn't match,
 *   - the tag isn't in HIGH_SEVERITY_DETECTOR_TAGS,
 *   - no Vietnamese explanation is registered for the tag.
 *
 * The session-dedup check is intentionally a separate step (see
 * `hasShownHint` / `markHintShown`) so callers can decide when to
 * record the firing relative to mount.
 */
export function getDetectorHint(
  detection: L1DetectionResult,
): DetectorHintContent | null {
  if (!detection.matched) return null;
  const tag = detection.weaknessTag;
  if (!HIGH_SEVERITY_DETECTOR_TAGS.has(tag)) return null;
  const explanation = L1_VN_EXPLANATIONS[tag];
  if (!explanation) return null;
  return {
    tag,
    nameEn: TAG_TO_NAME_EN[tag] ?? tagFallbackLabel(tag),
    rationaleVi: explanation.explanation_vi,
  };
}

// ────────────────────────────────────────────────────────────────────────
// Session dedup (browser-only side effect).
//
// One sessionStorage key holds a JSON array of fired tags. Reload =
// reset. Never falls through to localStorage; never writes to
// Supabase. SSR / non-window environments short-circuit safely.
// ────────────────────────────────────────────────────────────────────────

const SESSION_KEY = "__mb_detector_hint_shown__";

function readShownSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? new Set(parsed.filter((x) => typeof x === "string")) : new Set();
  } catch {
    return new Set();
  }
}

function writeShownSet(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify([...set]));
  } catch {
    /* quota or disabled storage — degrade silently, chip will re-show */
  }
}

export function hasShownHint(tag: L1WeaknessTag): boolean {
  return readShownSet().has(tag);
}

export function markHintShown(tag: L1WeaknessTag): void {
  const set = readShownSet();
  set.add(tag);
  writeShownSet(set);
}

/** Test-only helper. Never called from production paths. */
export function _resetHintDedupForTesting(): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}
