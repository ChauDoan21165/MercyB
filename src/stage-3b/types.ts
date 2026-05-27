/**
 * Stage 3B — Suggested Practice types.
 *
 * Engine output shape consumed by the Day-5+ Suggested Practice UI.
 * Lives in its own file so Day-5 components can import the type
 * without pulling the engine implementation into their bundle.
 */

export type SuggestedPracticeKind = "l1" | "placement" | "pronunciation";

export interface SuggestedPracticeItem {
  /** Stable composite identifier — `${kind}:${sourceTag}`. */
  id: string;
  /** Which Stage 3A source this item came from. */
  kind: SuggestedPracticeKind;
  /** Raw engineer-tag from the source (e.g. `vi_l1_3rd_person_s`, `TH_T`). */
  sourceTag: string;
  /** Vietnamese learner-facing label (from `stage-3a/taxonomy.ts`). */
  viLabel: string;
  /** English learner-facing label (from `stage-3a/taxonomy.ts`). */
  enLabel: string;
  /** Short Vietnamese sentence explaining WHY this was suggested. */
  rationale: string;
}
