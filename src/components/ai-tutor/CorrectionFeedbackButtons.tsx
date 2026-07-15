// src/components/ai-tutor/CorrectionFeedbackButtons.tsx
//
// Lane A — learner feedback capture on a displayed tutor correction.
//
// Renders a "helpful / not helpful" thumbs pair BELOW a correction, but ONLY
// when the correction carries a rule-or-detector id (its provenance). No id →
// no buttons (this component returns null). That contract is load-bearing: the
// durable learning-event sink's DB CHECK constraint rejects any `feedback_*`
// row without a rule_or_detector_id, so we never surface a control that could
// mint an un-attributable event.
//
// On tap we record ONE learning event through the existing producer
// (`recordLearningEvent`) — which queues it to localStorage where the durable
// sink (WP-PHASE2-01, VITE_LEARNING_EVENT_SINK_ENABLED) drains it to Supabase.
// We carry the same session address every existing event carries (session_id is
// auto-filled by recordLearningEvent from the local session); the sink schema
// has no turn column, so session_id + client_ts are the address fields, exactly
// as for every other event type.
//
// One tap per correction: after the first choice the pair LOCKS (further taps
// are ignored, no second event). This keeps the signal one-vote-per-correction,
// which is what the rule-quality consumer (WP-001) needs.

import { useState } from "react";
import {
  recordLearningEvent,
  type LearningEvent,
  type LearningEventInput,
  type LearningEventProduct,
} from "@/lib/tutor/learningEvents";

type Choice = "helpful" | "not_helpful";

type Props = {
  /**
   * Provenance of the displayed correction. Null/empty → no buttons render.
   * The caller must pass an engine-applied rule/detector id for the correction
   * on screen (see CorrectionMode's resolution).
   */
  ruleOrDetectorId: string | null | undefined;
  /** Product surface. Adult AI Tutor by default (this is not a kids surface). */
  product?: LearningEventProduct;
  /** Target language of the correction, carried into the event payload. */
  targetLanguage?: string | null;
  /** Persisted WP-CELL-ID-1 UUID when this correction is curriculum-anchored. */
  cellId?: string | null;
  /** Injectable for tests; defaults to the real queue producer. */
  record?: (event: LearningEventInput) => LearningEvent | null;
};

export function isCorrectionFeedbackEnabled(): boolean {
  try {
    return import.meta.env?.VITE_FEEDBACK_BUTTONS_ENABLED === "true";
  } catch {
    return false;
  }
}

export default function CorrectionFeedbackButtons({
  ruleOrDetectorId,
  product = "ai_tutor",
  targetLanguage,
  cellId,
  record = recordLearningEvent,
}: Props) {
  const [choice, setChoice] = useState<Choice | null>(null);

  if (!isCorrectionFeedbackEnabled()) return null;

  // Hard gate: no provenance → no feedback affordance at all.
  const id = typeof ruleOrDetectorId === "string" ? ruleOrDetectorId.trim() : "";
  if (!id) return null;

  function vote(next: Choice) {
    // One tap per correction — once a choice is locked in, ignore further taps
    // (no toggle, no second event). See file header.
    if (choice) return;
    setChoice(next);
    record({
      eventType: next === "helpful" ? "feedback_helpful" : "feedback_not_helpful",
      product,
      targetLanguage: targetLanguage ?? null,
      ruleOrDetectorId: id,
      cellId: cellId ?? null,
      // session_id is filled by recordLearningEvent from the local session,
      // the same address every existing event carries.
    });
  }

  const locked = choice !== null;

  return (
    <div
      data-testid="correction-feedback"
      data-rule-id={id}
      className="flex items-center gap-3 rounded-[14px] border border-slate-200 bg-slate-50/70 px-4 py-3"
    >
      <span className="text-xs font-bold text-slate-600">
        Góp ý này có ích không?
        <span className="ml-1 font-medium text-slate-400">· Was this helpful?</span>
      </span>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          data-testid="correction-feedback-helpful"
          aria-pressed={choice === "helpful"}
          disabled={locked}
          onClick={() => vote("helpful")}
          className={`min-h-9 rounded-full border px-3 py-1.5 text-sm font-bold transition disabled:cursor-not-allowed ${
            choice === "helpful"
              ? "border-emerald-300 bg-emerald-100 text-emerald-800"
              : "border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 disabled:opacity-50"
          }`}
        >
          <span aria-hidden="true">👍</span>
          <span className="ml-1.5">Có ích</span>
        </button>
        <button
          type="button"
          data-testid="correction-feedback-not-helpful"
          aria-pressed={choice === "not_helpful"}
          disabled={locked}
          onClick={() => vote("not_helpful")}
          className={`min-h-9 rounded-full border px-3 py-1.5 text-sm font-bold transition disabled:cursor-not-allowed ${
            choice === "not_helpful"
              ? "border-rose-300 bg-rose-100 text-rose-800"
              : "border-slate-200 bg-white text-slate-600 hover:bg-rose-50 disabled:opacity-50"
          }`}
        >
          <span aria-hidden="true">👎</span>
          <span className="ml-1.5">Chưa ích</span>
        </button>
      </div>
      {locked && (
        <span
          data-testid="correction-feedback-thanks"
          className="text-xs font-bold text-emerald-700"
        >
          ✓ Đã ghi nhận · Recorded
        </span>
      )}
    </div>
  );
}
