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
 * Plain fixed-position overlay instead of Radix Dialog.
 * Radix DialogContent does not paint inside this room page's stacking
 * context (likely mb-zoomWrap transform). Plain overlay with explicit
 * z-index escapes the issue. See PR #258 / launch day debug session.
 *
 * Scope of this PR: button + modal + OPEN/CLOSE analytics only. Per-attempt
 * persistence to `speech_attempts` is Wave 2 Step 3's track and lands in a
 * separate PR — SpeechDrill will grow an onAttempt seam there and both
 * /speak and this modal will pick it up automatically.
 */

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Mic } from "lucide-react";

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

  const titleId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Build the carrier-sentence list once per render of the button. Cheap.
  const sentences = useMemo<SessionSentence[]>(() => {
    return keywordsToSentences(keywordsEn).map((carrier) => ({
      target_en: carrier.target_en,
      target_vi: carrier.target_vi,
      meta: { keyword: carrier.keyword },
    }));
  }, [keywordsEn]);

  const isEmpty = sentences.length === 0;

  const handleOpen = useCallback(() => {
    setCompleted(0);
    setOpen(true);
    trackEvent("room_pronunciation_practice_opened", {
      room_id: roomId,
      keyword_count: sentences.length,
    });
  }, [roomId, sentences.length]);

  const handleClose = useCallback(() => {
    setOpen(false);
    trackEvent("room_pronunciation_practice_closed", {
      room_id: roomId,
      sentences_completed: completed,
    });
  }, [roomId, completed]);

  // While the modal is open: lock body scroll, focus the close button,
  // listen for Escape. On close/unmount: restore scroll, return focus
  // to the trigger button. All cleanup is paired so nothing leaks if
  // the component unmounts while the modal is still open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => {
      closeRef.current?.focus();
    }, 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      // Return focus to the trigger after the modal closes.
      triggerRef.current?.focus();
    };
  }, [open, handleClose]);

  // Hide entirely when flag off or feature-flag check is mid-flight.
  // Note: we deliberately NO LONGER short-circuit on empty sentences.
  // When the room's keyword fetch is loading or has 403'd, premium
  // users still see the button — clicking opens the modal with a
  // bilingual "loading or unavailable" fallback inside the body.
  if (loading) return null;
  if (!enabled) return null;

  return (
    <>
      <button
        ref={triggerRef}
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

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 2147483000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          data-testid="room-pronunciation-practice-modal"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              maxWidth: 560,
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                gap: 12,
              }}
            >
              <div>
                <h2
                  id={titleId}
                  style={{ margin: 0, fontSize: 18, fontWeight: 800 }}
                >
                  Practice pronunciation
                </h2>
                <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>
                  Luyện phát âm
                  {!isEmpty
                    ? ` — ${sentences.length} từ khoá / keyword${sentences.length === 1 ? "" : "s"}`
                    : null}
                </div>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={handleClose}
                aria-label="Close"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  border: "1px solid #e2e8f0",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {isEmpty ? (
              <div
                data-testid="room-pronunciation-practice-empty"
                style={{
                  padding: "20px 8px",
                  textAlign: "center",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#92400e",
                  lineHeight: 1.6,
                }}
              >
                Pronunciation content is loading or unavailable.
                <br />
                <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.85 }}>
                  Nội dung phát âm đang tải hoặc không khả dụng.
                </span>
              </div>
            ) : (
              <SpeechDrillSession
                sentences={sentences}
                onComplete={(n) => setCompleted(n)}
              />
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
