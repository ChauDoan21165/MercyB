// src/features/review/ui/session/SessionCardFront.tsx — Lane D / D5
//
// The FRONT of a review card: the prompt-language text + a "Hiện đáp án"
// (reveal) button. Presentational, prop-driven, pure. Per-language sizing comes
// from the D7 render utils so CJK/Hangul/diacritics render correctly at 375px.

import React from "react";
import type { LanguageCode, ReviewItem } from "@/features/review/types";
import {
  scriptClass,
  fontSizeClass,
  langTag,
} from "@/features/review/render";

export interface SessionCardFrontProps {
  item: ReviewItem;
  /** Prompt language of the active flow (front text language). */
  promptLang: LanguageCode;
  /** Reveal the back of the card. */
  onReveal: () => void;
  /** Optional read-only audio playback (leader wires the pipeline later). */
  onPlayAudio?: (key: string) => void;
}

export function SessionCardFront({
  item,
  promptLang,
  onReveal,
  onPlayAudio,
}: SessionCardFrontProps) {
  return (
    <div className="flex flex-col items-center gap-6" data-testid="card-front">
      <p
        lang={langTag(promptLang)}
        className={`text-center font-semibold text-gray-900 ${scriptClass(
          promptLang,
        )} ${fontSizeClass(promptLang, item.front)}`}
        data-testid="card-front-text"
      >
        {item.front}
      </p>

      {item.audioKey && onPlayAudio ? (
        <button
          type="button"
          onClick={() => onPlayAudio(item.audioKey as string)}
          aria-label="Nghe phát âm"
          className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          🔊 Nghe
        </button>
      ) : null}

      <button
        type="button"
        onClick={onReveal}
        aria-label="Hiện đáp án"
        className="w-full rounded-xl bg-emerald-600 px-6 py-3 text-base font-medium text-white hover:bg-emerald-700 active:scale-[0.99]"
      >
        Hiện đáp án
      </button>
    </div>
  );
}
