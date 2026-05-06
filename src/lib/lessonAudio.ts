// Path: src/lib/lessonAudio.ts
//
// Storage-key helpers for the language-lessons audio bundle uploaded to the
// Supabase `room-audio` public bucket. Mirrors the scheme defined in
// `scripts/build-audio-manifest.ts` — keep these two in sync; if the manifest
// builder changes its slug derivation, this file must change too.
//
// Path scheme:
//   ${level.toLowerCase()}/${lang}/${slug}/${unit}_${i+1}[_${speaker}].mp3
//
// `lang` is the ISO short code (fr/de/ja/ko/zh).
// `slug`:
//   - numeric lesson ids (Asian languages)  → `l${id}`
//   - string lesson ids   (French / German) → `l<id-with-prefix-stripped>`

export type LessonAudioLang = "fr" | "de" | "ja" | "ko" | "zh";

export type LessonAudioLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

const LANG_LONG_NAME: Record<LessonAudioLang, string> = {
  fr: "french",
  de: "german",
  ja: "japanese",
  ko: "korean",
  zh: "chinese",
};

export function lessonStorageSlug(
  lang: LessonAudioLang,
  lessonId: string | number,
  level: LessonAudioLevel,
): string {
  if (typeof lessonId === "number") return `l${lessonId}`;
  const longName = LANG_LONG_NAME[lang];
  let s = lessonId;
  s = s.replace(new RegExp(`^${longName}_${level.toLowerCase()}_`), "");
  s = s.replace(new RegExp(`^${longName}_fluency_`), "");
  s = s.replace(new RegExp(`^${longName}_`), "");
  return `l${s}`;
}

export function lessonAudioBase(
  lang: LessonAudioLang,
  lessonId: string | number,
  level: LessonAudioLevel,
): string {
  return `${level.toLowerCase()}/${lang}/${lessonStorageSlug(lang, lessonId, level)}`;
}

export type LessonAudioUnit =
  | { kind: "sentence"; index: number }
  | { kind: "vocab"; index: number }
  | { kind: "dialogue_short"; index: number; speaker: "A" | "B" }
  | { kind: "dialogue_long"; index: number; speaker: "A" | "B" }
  | { kind: "idiom"; index: number };

export function lessonAudioKey(audioBase: string, unit: LessonAudioUnit): string {
  switch (unit.kind) {
    case "sentence":
      return `${audioBase}/sentence_${unit.index}.mp3`;
    case "vocab":
      return `${audioBase}/vocab_${unit.index}.mp3`;
    case "dialogue_short":
      return `${audioBase}/dialogue_short_${unit.index}_${unit.speaker}.mp3`;
    case "dialogue_long":
      return `${audioBase}/dialogue_long_${unit.index}_${unit.speaker}.mp3`;
    case "idiom":
      return `${audioBase}/idiom_${unit.index}.mp3`;
  }
}

// Match the dialogue-short speaker rule used by the manifest builder:
// labels like "A", "B", or named roles where any leading "B" maps to B,
// everything else to A.
export function dialogueShortSpeakerLetter(speaker: string | undefined | null): "A" | "B" {
  return (speaker ?? "").trim().toUpperCase().startsWith("B") ? "B" : "A";
}
