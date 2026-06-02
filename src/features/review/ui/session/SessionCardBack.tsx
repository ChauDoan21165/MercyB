// src/features/review/ui/session/SessionCardBack.tsx — Lane D / D5
//
// The BACK of a review card: the answer-language text + pronunciation (labeled
// per the answer language), optional example, optional Vietnamese note, and the
// grade buttons. Presentational, prop-driven, pure.

import React from "react";
import type {
  LanguageCode,
  ReviewGrade,
  ReviewItem,
} from "@/features/review/types";
import {
  scriptClass,
  fontSizeClass,
  langTag,
  pronunciationLabel,
} from "@/features/review/render";
import { GradeButtons, type GradePreview } from "./GradeButtons";

export interface SessionCardBackProps {
  item: ReviewItem;
  /** Prompt language (front) — shown small as context above the answer. */
  promptLang: LanguageCode;
  /** Answer language of the active flow (back text language). */
  answerLang: LanguageCode;
  /** Per-grade interval preview (days) to label the grade buttons. */
  previews: GradePreview;
  /** Fired with the chosen grade. */
  onGrade: (grade: ReviewGrade) => void;
  /** Optional read-only audio playback. */
  onPlayAudio?: (key: string) => void;
}

export function SessionCardBack({
  item,
  promptLang,
  answerLang,
  previews,
  onGrade,
  onPlayAudio,
}: SessionCardBackProps) {
  const pronLabel = pronunciationLabel(answerLang);

  return (
    <div className="flex flex-col gap-5" data-testid="card-back">
      {/* Prompt as quiet context. */}
      <p
        lang={langTag(promptLang)}
        className="text-center text-sm text-gray-400"
        data-testid="card-back-prompt"
      >
        {item.front}
      </p>

      {/* The answer. */}
      <div className="flex flex-col items-center gap-2">
        <p
          lang={langTag(answerLang)}
          className={`text-center font-semibold text-gray-900 ${scriptClass(
            answerLang,
          )} ${fontSizeClass(answerLang, item.back)}`}
          data-testid="card-back-text"
        >
          {item.back}
        </p>

        {item.pronunciation ? (
          <p
            className="text-center text-sm text-gray-500"
            data-testid="card-back-pron"
          >
            {pronLabel ? <span className="text-gray-400">{pronLabel}: </span> : null}
            {item.pronunciation}
          </p>
        ) : null}

        {item.audioKey && onPlayAudio ? (
          <button
            type="button"
            onClick={() => onPlayAudio(item.audioKey as string)}
            aria-label="Nghe phát âm"
            className="mt-1 rounded-full border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            🔊 Nghe
          </button>
        ) : null}
      </div>

      {item.example ? (
        <p
          lang={langTag(answerLang)}
          className="rounded-lg bg-gray-50 px-3 py-2 text-center text-sm italic text-gray-600"
          data-testid="card-back-example"
        >
          {item.example}
        </p>
      ) : null}

      {item.noteVi ? (
        <p
          lang="vi"
          className="text-center text-sm text-gray-600"
          data-testid="card-back-note"
        >
          {item.noteVi}
        </p>
      ) : null}

      <GradeButtons previews={previews} onGrade={onGrade} />
    </div>
  );
}
