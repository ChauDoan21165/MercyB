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
 * The set of `L1WeaknessTag` values that are chip-eligible. v1 covered
 * 6 high-severity profile patterns; v2 (C5 recon) expanded to include
 * the 4 medium-severity patterns that the grammar detector actually
 * emits — article omission (6 tags), preposition selection (3 tags),
 * pronoun gender (1 tag), and there-are/there-is (1 tag). The
 * phonology pattern `final_consonant_cluster_reduction` is
 * high-severity in the profile but doesn't surface from the grammar
 * detector, so it has no tag here. `topic_comment_fronting` and
 * `plural_s_omission` from the medium tier are already covered (no
 * ruleTags for the former; `vi_l1_plural_s` for the latter was in v1
 * via dual-listing under `final_cluster_spelling_loss`).
 *
 * Frequency control is split into two layers:
 *   1. Per-tag dedup (sessionStorage) — `hasShownHint` / `markHintShown`.
 *      The same tag never chips twice in a session.
 *   2. Session-wide cap (`SESSION_CAP`) — the count of unique fired
 *      tags caps at 3, so even with 17 eligible tags a session sees
 *      at most 3 chips. Beyond the cap, `getDetectorHint` returns
 *      null. Keeps signal/noise in the 1–3 chips/session band the
 *      recon recommended.
 *
 * Adding more tags later is additive-safe — they just enter the
 * cap-gated rotation.
 */
export const HIGH_SEVERITY_DETECTOR_TAGS: ReadonlySet<L1WeaknessTag> =
  new Set<L1WeaknessTag>([
    // v1 high-severity (original 6).
    "vi_l1_3rd_person_s",
    "vi_l1_past_ed",
    "vi_l1_plural_s",
    "vi_l1_missing_be",
    "vi_l1_question_no_aux",
    "vi_l1_double_negative",
    // v2 medium-severity expansion (C5 recon).
    //   article_omission_overuse  → 7 tags
    "vi_l1_missing_article",
    "vi_l1_profession_article_copula",
    "vi_l1_a_vs_an_vowel",
    "vi_l1_geographical_article",
    "vi_l1_no_article_generic",
    "vi_l1_superlative_the",
    "vi_l1_generic_plural",
    //   preposition_selection_transfer  → 3 tags
    "vi_l1_preposition_transfer",
    "vi_l1_time_expressions",
    "vi_l1_by_vs_with",
    //   pronoun_gender_confusion  → 1 tag
    "vi_l1_possessive_gender",
    //   co_transfer_overgeneralisation  → 1 tag
    "vi_l1_there_are_singular",
  ]);

/**
 * Maximum number of unique-tag chips shown in a single session.
 * Tuned after the medium-severity expansion to keep each chip feeling
 * rare and informative (1–3 chips per session is "signal", 8+ is
 * "noise" per the C5 recon). Beyond this, `getDetectorHint` returns
 * null even for an otherwise-eligible tag. The cap counts only chips
 * that actually rendered (via `markHintShown` in DetectorHintChip's
 * useEffect), so a detection filtered out at the call site by per-tag
 * dedup doesn't burn cap budget.
 */
export const SESSION_CAP = 3;

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
 * Pretty English labels for the chip-eligible tags. The dispatch
 * specified the chip label as "short English ... family-id converted
 * to readable form (e.g. 'third_person_s' → 'Third-person -s')".
 * Mechanical conversion would produce awkward results like "3rd
 * Person S"; this table is hand-shaped for every tag in
 * HIGH_SEVERITY_DETECTOR_TAGS. Tags outside this table fall back to
 * a tag-derived label (never user-visible since they're filtered out
 * by the chip-eligibility gate anyway).
 *
 * Style: short noun phrase, lowercase verb forms ("vs"), curly quotes
 * avoided. Each label fits the chip badge (~32 char budget). The
 * Vietnamese rationale below the badge does the teaching — the label
 * is a thumbnail, not a lesson.
 */
export const TAG_TO_NAME_EN: Readonly<Partial<Record<L1WeaknessTag, string>>> = {
  // v1 — high-severity (original 6).
  vi_l1_3rd_person_s: "Third-person -s",
  vi_l1_past_ed: "Past tense -ed",
  vi_l1_plural_s: "Plural -s",
  vi_l1_missing_be: "Missing 'to be'",
  vi_l1_question_no_aux: "Question without do/does/did",
  vi_l1_double_negative: "Double negative",
  // v2 — medium-severity expansion (C5 recon).
  //   Article family
  vi_l1_missing_article: "Missing a / an / the",
  vi_l1_profession_article_copula: "Job noun needs a/an",
  vi_l1_a_vs_an_vowel: "a vs an",
  vi_l1_geographical_article: "Place-name article",
  vi_l1_no_article_generic: "Generic noun: no article",
  vi_l1_superlative_the: "Superlative: the",
  vi_l1_generic_plural: "Generic plural: no article",
  //   Preposition family
  vi_l1_preposition_transfer: "Wrong preposition",
  vi_l1_time_expressions: "Time preposition (in/on/at)",
  vi_l1_by_vs_with: "by vs with",
  //   Pronoun
  vi_l1_possessive_gender: "his vs her",
  //   Existential
  vi_l1_there_are_singular: "'there are' with singular",
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
 *   - the session-wide chip count has reached SESSION_CAP,
 *   - no Vietnamese explanation is registered for the tag.
 *
 * The cap check uses the same sessionStorage key as the per-tag
 * dedup — counting the number of UNIQUE tags already rendered this
 * session. Per-tag dedup (`hasShownHint`) remains the caller's
 * responsibility so the call site can decide when to record the
 * firing relative to mount; the cap here is an additional outer
 * gate that protects against fatigue across DIFFERENT tags.
 */
export function getDetectorHint(
  detection: L1DetectionResult,
): DetectorHintContent | null {
  if (!detection.matched) return null;
  const tag = detection.weaknessTag;
  if (!HIGH_SEVERITY_DETECTOR_TAGS.has(tag)) return null;
  // Session-wide cap. Only RENDERED chips count (markHintShown is
  // called from DetectorHintChip's useEffect, not here), so a
  // detection that's about to fire but already-shown won't bump the
  // count past the cap on a subsequent re-firing of the same tag.
  // Allow a re-emit of an already-shown tag to slip past the cap
  // check so the call site's per-tag dedup can decide the no-op —
  // this keeps the cap purely about unique tags consumed.
  const shownCount = getShownCount();
  if (shownCount >= SESSION_CAP && !hasShownHint(tag)) return null;
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

/** Number of unique tags chipped this session. Used by SESSION_CAP gate. */
export function getShownCount(): number {
  return readShownSet().size;
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
