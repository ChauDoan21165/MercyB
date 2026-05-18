// src/components/feedback/MercyAnswerFeedback.tsx
//
// Shared 👍/👎 capture for Mercy teacher answers. One owner, two mounts:
// the in-room chat (ConversationThread) and writing feedback
// (WritingPracticeSessionPage). It writes to mercy_feedback_events via
// sendMercyFeedback so we can finally read real machine-translated VN
// samples (the table was empty: the only thumbs UI was dead demo code).
//
// Deliberately calls sendMercyFeedback DIRECTLY rather than through the
// useMercyFeedback hook — that hook is ChatMessage-coupled and its only
// consumer (MercyChat.tsx) is dead/unmounted; routing through it would
// be dead-code wiring with no runtime effect (CLAUDE.md trap).
//
// Contract:
//   - answerText = the VIETNAMESE text the learner is judging (the half
//     they actually read), so answer_text_snapshot holds the thing the
//     "reads like machine translation" complaint is about.
//   - Telemetry must never break the surface it is attached to: every
//     network path is wrapped + swallowed.
//   - User-facing copy is thầy↔em register (Mercy = thầy, learner = em).

import { useCallback, useState } from "react";

import { sendMercyFeedback } from "@/lib/send-feedback";
import { getAnonId, getSessionId } from "@/lib/feedback-ids";
import { breadcrumbMercyFeedbackDownvote } from "@/lib/monitoring/breadcrumbs";

export type MercyFeedbackSurface = "in_room_chat" | "writing_feedback";

export interface MercyAnswerFeedbackProps {
  /** The Vietnamese answer text the learner is rating. */
  answerText: string;
  /** Stable id for the rated response (dedupe key server-side). */
  responseId: string;
  /** Stable id for the message/turn. */
  msgId: string;
  /** Conversation/grouping key. */
  conversationId: string;
  /** Which surface this is mounted on (analytics dimension). */
  surface: MercyFeedbackSurface;
  /** Telemetry mode tag. */
  mode: string;
  /** Defaults to "vi" — the learner reads the Vietnamese half. */
  lang?: string;
  /** Optional, when the caller knows the generating model. */
  modelName?: string | null;
}

type ReasonKey =
  | "vi_machine_translated"
  | "not_what_i_asked"
  | "hard_to_understand"
  | "other";

const REASON_CHIPS: ReadonlyArray<{ key: ReasonKey; label: string }> = [
  // The signal this whole workstream exists to capture — first.
  { key: "vi_machine_translated", label: "Tiếng Việt đọc như dịch máy" },
  { key: "not_what_i_asked", label: "Chưa đúng ý em hỏi" },
  { key: "hard_to_understand", label: "Khó hiểu" },
  { key: "other", label: "Khác" },
];

const OTHER_MAX = 300;

const wrapStyle: React.CSSProperties = {
  marginTop: 8,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
};

const iconBtnStyle: React.CSSProperties = {
  minWidth: 34,
  height: 32,
  padding: "0 10px",
  borderRadius: 9999,
  border: "1px solid rgba(0,0,0,0.14)",
  background: "white",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
};

const promptStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.5)",
};

const chipStyle: React.CSSProperties = {
  padding: "5px 11px",
  borderRadius: 9999,
  border: "1px solid rgba(0,0,0,0.16)",
  background: "rgba(0,0,0,0.02)",
  color: "rgba(0,0,0,0.72)",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

const doneStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "rgba(22,101,52,0.9)",
};

const otherInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 160,
  padding: "6px 10px",
  borderRadius: 10,
  border: "1px solid rgba(0,0,0,0.16)",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
};

export function MercyAnswerFeedback({
  answerText,
  responseId,
  msgId,
  conversationId,
  surface,
  mode,
  lang = "vi",
  modelName = null,
}: MercyAnswerFeedbackProps) {
  const [phase, setPhase] = useState<"idle" | "reason" | "other" | "done">(
    "idle",
  );
  const [busy, setBusy] = useState(false);
  const [otherText, setOtherText] = useState("");

  const submit = useCallback(
    async (vote: "up" | "down", feedbackReason: string | null) => {
      if (busy) return;
      setBusy(true);
      try {
        await sendMercyFeedback({
          appKey: "mercy_blade",
          anonId: getAnonId(),
          sessionId: getSessionId(),
          conversationId,
          responseId,
          msgId,
          vote,
          feedbackReason,
          answerText,
          modelName,
          lang,
          mode,
          path:
            typeof window !== "undefined" ? window.location.pathname : "/",
        });
      } catch (err) {
        // Telemetry failure must never surface to the learner.
        if (import.meta.env.DEV) {
          console.warn("[MercyAnswerFeedback] send failed:", err);
        }
      } finally {
        setBusy(false);
        setPhase("done");
      }
    },
    [
      busy,
      conversationId,
      responseId,
      msgId,
      answerText,
      modelName,
      lang,
      mode,
    ],
  );

  const onDown = useCallback(() => {
    // Fire the breadcrumb on the click itself so downvote *frequency*
    // is visible in Sentry even if the learner never picks a reason or
    // the DB write fails. Reason (when chosen) lives in the DB row.
    breadcrumbMercyFeedbackDownvote({ surface, lang });
    setPhase("reason");
  }, [surface, lang]);

  if (phase === "done") {
    return (
      <div style={wrapStyle}>
        <span style={doneStyle} data-testid="mercy-feedback-done">
          Cảm ơn em đã góp ý — thầy sẽ chỉnh lại.
        </span>
      </div>
    );
  }

  return (
    <div style={wrapStyle} data-testid="mercy-answer-feedback">
      {phase === "idle" ? (
        <div style={rowStyle}>
          <span style={promptStyle}>Câu trả lời này có giúp được em không?</span>
          <button
            type="button"
            aria-label="Câu trả lời hữu ích"
            style={iconBtnStyle}
            disabled={busy}
            onClick={() => void submit("up", null)}
            data-testid="mercy-feedback-up"
          >
            👍
          </button>
          <button
            type="button"
            aria-label="Câu trả lời chưa tốt"
            style={iconBtnStyle}
            disabled={busy}
            onClick={onDown}
            data-testid="mercy-feedback-down"
          >
            👎
          </button>
        </div>
      ) : null}

      {phase === "reason" ? (
        <>
          <span style={promptStyle}>Chưa ổn ở đâu hả em?</span>
          <div style={rowStyle}>
            {REASON_CHIPS.map((c) => (
              <button
                key={c.key}
                type="button"
                style={chipStyle}
                disabled={busy}
                onClick={() => {
                  if (c.key === "other") {
                    setPhase("other");
                    return;
                  }
                  void submit("down", c.key);
                }}
                data-testid={`mercy-feedback-reason-${c.key}`}
              >
                {c.label}
              </button>
            ))}
            <button
              type="button"
              style={{ ...chipStyle, border: "none", background: "none" }}
              disabled={busy}
              onClick={() => void submit("down", null)}
              data-testid="mercy-feedback-skip"
            >
              Bỏ qua
            </button>
          </div>
        </>
      ) : null}

      {phase === "other" ? (
        <div style={rowStyle}>
          <input
            type="text"
            value={otherText}
            maxLength={OTHER_MAX}
            placeholder="Em nói rõ hơn giúp thầy nhé…"
            style={otherInputStyle}
            disabled={busy}
            onChange={(e) => setOtherText(e.target.value)}
            data-testid="mercy-feedback-other-input"
          />
          <button
            type="button"
            style={chipStyle}
            disabled={busy}
            onClick={() =>
              void submit(
                "down",
                otherText.trim()
                  ? `other:${otherText.trim().slice(0, OTHER_MAX)}`
                  : "other",
              )
            }
            data-testid="mercy-feedback-other-send"
          >
            Gửi
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default MercyAnswerFeedback;
