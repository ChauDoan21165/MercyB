/**
 * Room-scoped "Practice pronunciation / Luyện phát âm" affordance.
 *
 * Compact outline button that lives next to a room's keyword pill row.
 * Click → opens a modal containing <SpeechDrillSession> seeded with the
 * room's keywords (wrapped in carrier sentences via keywordToSentence).
 *
 * Gated by the same DB feature flag as /speak (`pronunciationScoringEnabled`).
 * When OFF: the button does not render — the room renders exactly as today.
 *
 * Scope of this PR: button + modal + OPEN/CLOSE analytics only. Per-attempt
 * persistence to `speech_attempts` is Wave 2 Step 3's track and lands in a
 * separate PR — SpeechDrill will grow an onAttempt seam there and both
 * /speak and this modal will pick it up automatically.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Mic } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFeatureFlag } from "@/hooks/useFeatureFlag";
import { keywordsToSentences } from "@/lib/speech/keywordToSentence";
import { trackEvent } from "@/lib/analytics";
import {
  SpeechDrillSession,
  type SessionSentence,
} from "@/components/speech/SpeechDrillSession";

/**
 * Local error boundary for the pronunciation modal body. Catches render
 * errors thrown by SpeechDrillSession or its children so they can't bubble
 * to the global error boundary in main.tsx (which would mount a fatal
 * overlay). Shows a friendly bilingual fallback instead.
 */
class PracticeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: unknown) {
    // eslint-disable-next-line no-console
    console.warn("[RoomPronunciationPractice] caught render error", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "20px 8px",
            textAlign: "center",
            fontSize: 14,
            fontWeight: 600,
            color: "#92400e",
            lineHeight: 1.6,
          }}
        >
          Pronunciation not available right now.
          <br />
          <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>
            Phát âm tạm thời không khả dụng. Vui lòng thử lại sau.
          </span>
        </div>
      );
    }
    return this.props.children;
  }
}

export type RoomPronunciationPracticeProps = {
  roomId: string;
  /** EN keywords from the room — passed straight from `kw.en[]` in RoomRenderer. */
  keywordsEn: string[];
  /**
   * Optional VI translations, aligned by index with `keywordsEn`.
   * Used only when a single-word keyword's VI label differs from the EN —
   * for now we ignore (carrier sentence is `Từ này là {keyword}.`) since
   * the keyword itself is the English target.
   */
  keywordsVi?: string[];
};

const buttonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 12px",
  marginTop: 8,
  border: "1px solid #fde68a",
  background: "#fffbeb",
  color: "#92400e",
  borderRadius: 9999,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  // Defensive: surrounding room CSS sometimes creates stacking contexts
  // (mb-zoomWrap uses CSS transforms) that can let a sibling/overlay
  // swallow clicks. Force this button onto its own layer with
  // pointer-events explicitly enabled so clicks always reach it.
  position: "relative",
  zIndex: 1,
  pointerEvents: "auto",
};

const buttonStyleHover: React.CSSProperties = {
  background: "#fef3c7",
};

const labelEn: React.CSSProperties = {
  fontWeight: 700,
};

const labelVi: React.CSSProperties = {
  fontWeight: 500,
  opacity: 0.85,
  fontSize: 12,
};

export function RoomPronunciationPractice({
  roomId,
  keywordsEn,
  keywordsVi: _keywordsVi,
}: RoomPronunciationPracticeProps) {
  const { enabled, loading } = useFeatureFlag("pronunciationScoringEnabled", false);
  const [open, setOpen] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Build the carrier-sentence list once per render of the button. Cheap.
  const sentences = useMemo<SessionSentence[]>(() => {
    return keywordsToSentences(keywordsEn).map((carrier) => ({
      target_en: carrier.target_en,
      target_vi: carrier.target_vi,
      meta: { keyword: carrier.keyword },
    }));
  }, [keywordsEn]);

  const handleOpen = useCallback((e?: React.MouseEvent) => {
    // Defensive: stop the click from bubbling to any ancestor handler.
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCompleted(0);
    setOpen(true);
    trackEvent("room_pronunciation_practice_opened", {
      room_id: roomId,
      keyword_count: sentences.length,
    });
  }, [roomId, sentences.length]);

  const handleClose = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) return;
      setOpen(false);
      trackEvent("room_pronunciation_practice_closed", {
        room_id: roomId,
        sentences_completed: completed,
      });
    },
    [roomId, completed],
  );

  // While the modal is open, intercept any unhandled promise rejection
  // before it reaches main.tsx's global handler. The global handler treats
  // chunk-load-shaped messages as a signal to schedule
  // window.location.reload() after ~900ms — which is what was producing the
  // "click → page washes white → reload" symptom when SpeechDrillSession's
  // mount path or downstream Supabase call rejected.
  // Capture-phase + stopImmediatePropagation ensures we run before, and
  // block, the global bubble-phase listener on the same window.
  useEffect(() => {
    if (!open) return;
    const onRejection = (e: PromiseRejectionEvent) => {
      // eslint-disable-next-line no-console
      console.warn(
        "[RoomPronunciationPractice] swallowed unhandled rejection while modal open:",
        e.reason,
      );
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("unhandledrejection", onRejection, true);
    return () =>
      window.removeEventListener("unhandledrejection", onRejection, true);
  }, [open]);

  // Hide entirely when flag off, when feature-flag check is mid-flight,
  // or when the room has no keywords to practise.
  if (loading) return null;
  if (!enabled) return null;
  if (sentences.length === 0) return null;

  return (
    <>
      <button
        type="button"
        style={hovered ? { ...buttonStyle, ...buttonStyleHover } : buttonStyle}
        onClick={handleOpen}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label="Practice pronunciation for this room"
        data-testid="room-pronunciation-practice-button"
      >
        <Mic size={14} aria-hidden />
        <span style={labelEn}>Practice pronunciation</span>
        <span aria-hidden>·</span>
        <span style={labelVi}>Luyện phát âm</span>
      </button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          style={{ maxWidth: 560 }}
          data-testid="room-pronunciation-practice-modal"
        >
          <DialogHeader>
            <DialogTitle>Practice pronunciation</DialogTitle>
            <DialogDescription>
              Luyện phát âm — {sentences.length} từ khoá / keyword
              {sentences.length === 1 ? "" : "s"}
            </DialogDescription>
          </DialogHeader>

          <PracticeErrorBoundary>
            <SpeechDrillSession
              sentences={sentences}
              onComplete={(n) => setCompleted(n)}
            />
          </PracticeErrorBoundary>
        </DialogContent>
      </Dialog>
    </>
  );
}
