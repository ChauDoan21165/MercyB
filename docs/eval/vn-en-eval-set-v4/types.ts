import type { EvalEntry, EvalSetMeta } from "../vn-en-eval-set-v1/types";

/**
 * v4 extension: every entry carries a `taxonomyPatternId` that maps to one of
 * the 10 patterns in `src/lib/feedback/rule-packs/en-vn-register/taxonomy.ts`.
 * The field is optional so the base type remains backwards-compatible.
 */
export type RegisterPatternId =
  | "formal_opener_peer_ban"
  | "peer_ban_to_elder"
  | "toi_self_with_elder"
  | "missing_a_particle_to_superior"
  | "blunt_request_to_superior"
  | "bare_refusal_to_superior"
  | "thanks_with_peer_form_to_superior"
  | "apology_with_peer_form_to_superior"
  | "favor_request_no_softener"
  | "direct_command_to_elder";

export type EvalEntryV4 = EvalEntry & {
  /** References `RegisterPattern.id` in `en-vn-register/taxonomy.ts`. */
  taxonomyPatternId: RegisterPatternId;
};

export type EvalSetMetaV4 = Omit<EvalSetMeta, "entries"> & {
  entries: EvalEntryV4[];
};
