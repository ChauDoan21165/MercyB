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

import React, { useCallback, useMemo, useState } from "react";
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

  const handleOpen = useCallback(() => {
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

          <SpeechDrillSession
            sentences={sentences}
            onComplete={(n) => setCompleted(n)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
