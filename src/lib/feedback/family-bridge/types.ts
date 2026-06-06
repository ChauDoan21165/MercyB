type _InterferenceExplanationsModule =
  typeof import("./interference-explanations");

/**
 * Family-Bridge explainer content — schema (Stage 5 / L6 content authoring).
 *
 * APPROVED schema (Chau, 2026-06-05). E1 owns this type. It is the shared
 * foundation the interference-library lane (E2) imports — do not fork it.
 *
 * What this is
 * ------------
 * Per-pattern, FAMILY-FACING Vietnamese explainer content. It answers,
 * for a Vietnamese parent / grandparent (not the learner):
 *   - why a Vietnamese speaker makes this English mistake,
 *   - how the family can help,
 *   - and reassurance that it is normal and fixable.
 *
 * This is the "speak-to-grandma-without-shame" content from
 * `docs/architecture/L6-parent-teacher-family-layer.md` Decision **L6-Q3**
 * ("specific weakness tags + VN explainer … per-tag content is a separate
 * workstream that backfills into the existing slots"). The L6 parent view
 * reads it.
 *
 * v1 is TEXT-ONLY. The 90-second explainer-video script is intentionally
 * NOT in this schema yet — banked for v2 once the text set is validated
 * (keeps Chau's per-tag validation load to one artifact).
 *
 * What this is NOT (so it never collides with learner-facing copy)
 * ----------------------------------------------------------------
 *  - NOT `VN_EXPLANATIONS` (`rule-packs/vi/explanations.ts`) — that is the
 *    learner's answer-time bubble (≤1 short paragraph, addressed to "you").
 *  - NOT `L1_VN_EXPLANATIONS` (`l1-vn-explanations.ts`) — that is the
 *    learner-facing teacher-voice detail (≤300 chars, addressed to "you").
 *  Family-Bridge is addressed to the LEARNER'S FAMILY, in their language.
 *
 * Anchoring
 * ---------
 * Every entry's `tag` MUST reference a pattern ID that already exists, so
 * the content joins to the detector / aggregator output L6 consumes:
 *  - `grammar_rule`   → an `L1WeaknessTag` ('vi_l1_*') in
 *                       `src/lib/feedback/l1-error-detector.ts`. (E1's set.)
 *  - `grammar_family` → a `GrammarFamily.id` in `src/lib/l1-profiles/vi.ts`.
 *  - `interference`   → a `VNL1Pattern` / `PhenomenonId` in the same profile.
 *                       (E2's set.)
 *  - `pronunciation`  → a phoneme-gap id (later scope).
 *
 * Voice contract (inherits the Round-5 CC4 brief + L6 audience posture)
 * --------------------------------------------------------------------
 *  - Warm, respectful, family register. Never "this is wrong" — frame as
 *    "đây là điều rất nhiều người Việt mình gặp".
 *  - Vietnamese-first prose (NOT translated from English). Hanoi-standard
 *    written form; Saigon words only when natural.
 *  - Everyday vocabulary, no linguistic jargon, no English jargon dropped
 *    into the Vietnamese.
 *  - Encouraging, never corrective; the family is a helper, not a grader.
 *  - No political content, no regional prejudice. (CLAUDE.md #1, #2, #4.)
 *  - Chau is the native validation gate. Nothing renders to a parent until
 *    he approves (`validated === true`).
 */

/** CEFR band of the underlying pattern. Mirrors the project-wide union. */
export type FamilyBridgeCefr = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

/** Which existing ID namespace `tag` points into. */
export type FamilyBridgeSource =
  | "grammar_rule" // L1WeaknessTag (vi_l1_*) — E1's vi grammar families set
  | "grammar_family" // GrammarFamily.id in l1-profiles/vi.ts
  | "interference" // VNL1Pattern / PhenomenonId — E2's set
  | "pronunciation"; // phoneme-gap id (later)

/**
 * Chau is the native validation gate. `validated` is the per-item flag the
 * brief asks for; the parent view filters on `validated === true`.
 */
export type FamilyBridgeReviewStatus =
  | "draft" // authored, not yet looked at
  | "needs_chau" // flagged for Chau's native-speaker review
  | "approved"; // Chau approved — only these may render to a parent

/** Mobile-display budget for the parent-view one-liner. */
export const FAMILY_BRIDGE_SUMMARY_MAX_CHARS = 160;

export interface FamilyBridgeExplanation {
  // ── Anchor ────────────────────────────────────────────────────────────
  /** Existing pattern ID. MUST match a real id in the named `source`. */
  tag: string;
  source: FamilyBridgeSource;
  /** CEFR band, copied from the underlying pattern's metadata. */
  cefr: FamilyBridgeCefr;

  // ── Naming (for the parent-view chip + heading) ──────────────────────
  /** Friendly Vietnamese name of the pattern, family-facing. */
  patternNameVi: string;
  /** Short English label (mirrors the in-product tag label). */
  patternLabelEn: string;

  // ── Family-facing content (the deliverable) ──────────────────────────
  /**
   * ONE warm, learner-facing summary sentence. ≤ 160 chars.
   * NOTE: "parent" in the field name is legacy from the L6 design — this
   * copy is learner-facing and is NOT shown to family. Name kept stable
   * because E2's merged interference entries already use it.
   */
  parentSummaryVi: string;
  /** Why a Vietnamese speaker makes this — L1 transfer reason, shame-free. */
  whyVi: string;
  /** How the family can help — encouraging, concrete, never "correct them". */
  howToHelpVi: string;
  /** Closing reassurance, grandma-safe. */
  encouragementVi: string;
  /** One everyday example: what the learner says → the natural version. */
  example: {
    learnerSays: string;
    naturalForm: string;
    /** Word-for-word VN gloss showing the friendly VN→EN transfer. */
    glossVi: string;
  };

  // ── Validation (Chau is the gate) ────────────────────────────────────
  /** True ONLY after Chau approves. The parent view filters on this. */
  validated: boolean;
  reviewStatus: FamilyBridgeReviewStatus;
  /** Set when a VN grammar/cultural claim needs Chau's eyes before shipping. */
  reviewNote?: string;

  // ── Provenance ───────────────────────────────────────────────────────
  /** Content version; bump on edits to approved entries. */
  version: string;
}
