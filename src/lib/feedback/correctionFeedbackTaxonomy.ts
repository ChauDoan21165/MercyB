export const CANONICAL_CORRECTIVE_FEEDBACK_MOVES = [
  'recast',
  'explicit_correction',
  'metalinguistic_clue',
  'elicitation',
  'clarification_request',
  'repetition_prompt',
] as const;

export const PRODUCT_CORRECTIVE_FEEDBACK_MOVES = [
  'pronunciation_recast_repeat',
  'delayed_recap',
  'density_cap_queue',
] as const;

export type CanonicalCorrectiveFeedbackMove =
  (typeof CANONICAL_CORRECTIVE_FEEDBACK_MOVES)[number];

export type ProductCorrectiveFeedbackMove =
  (typeof PRODUCT_CORRECTIVE_FEEDBACK_MOVES)[number];

export type CorrectiveFeedbackMove =
  | CanonicalCorrectiveFeedbackMove
  | ProductCorrectiveFeedbackMove;

const VALID_MOVES = new Set<string>([
  ...CANONICAL_CORRECTIVE_FEEDBACK_MOVES,
  ...PRODUCT_CORRECTIVE_FEEDBACK_MOVES,
]);

export type CorrectiveFeedbackMoveParseResult =
  | { ok: true; move: CorrectiveFeedbackMove }
  | { ok: false; reason: 'unknown_feedback_move'; value: string };

export function parseCorrectiveFeedbackMove(
  value: string,
): CorrectiveFeedbackMoveParseResult {
  const normalized = value.trim().toLowerCase();
  if (VALID_MOVES.has(normalized)) {
    return { ok: true, move: normalized as CorrectiveFeedbackMove };
  }
  return {
    ok: false,
    reason: 'unknown_feedback_move',
    value,
  };
}

export type CorrectiveFeedbackMoveSerializeResult =
  | { ok: true; value: CorrectiveFeedbackMove }
  | { ok: false; reason: 'unknown_feedback_move'; value: string };

export function serializeCorrectiveFeedbackMove(
  value: string,
): CorrectiveFeedbackMoveSerializeResult {
  const parsed = parseCorrectiveFeedbackMove(value);
  if (!parsed.ok) return parsed;
  return { ok: true, value: parsed.move };
}
