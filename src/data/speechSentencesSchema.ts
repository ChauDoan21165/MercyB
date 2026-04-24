// src/data/speechSentencesSchema.ts
//
// Single source of truth for the shape of src/data/speech-sentences.json.
// Zod parses the JSON at import time — a malformed file throws at module
// load, not at runtime when a user hits the drill. That's the contract:
// the JSON is the one place to edit sentences, and the schema is the
// one place that knows what a valid sentence looks like.
//
// If/when we move sentences to Supabase, the consumer-facing types
// exported here stay stable; only the loader at the bottom swaps.

import { z } from 'zod';

import raw from './speech-sentences.json';

export const SENTENCE_CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2'] as const;
export type SentenceCefr = (typeof SENTENCE_CEFR_LEVELS)[number];

// ID pattern: s_<cefr-lower>_<3-digit>. Example: s_a1_001, s_b2_014.
const ID_PATTERN = /^s_(a1|a2|b1|b2)_\d{3}$/;

export const SpeechSentenceSchema = z.object({
  id: z.string().regex(ID_PATTERN, 'id must match s_<cefr>_<nnn>'),
  cefr: z.enum(SENTENCE_CEFR_LEVELS),
  target_en: z.string().min(1),
  target_vi: z.string().min(1),
  context: z.string().min(1),
  /** Short notes to coaches / future difficulty-tuning. Never shown to users. */
  difficulty_hints: z.array(z.string().min(1)).default([]),
});

export type SpeechSentence = z.infer<typeof SpeechSentenceSchema>;

export const SpeechSentencesFileSchema = z.object({
  version: z.literal(1),
  sentences: z.array(SpeechSentenceSchema).min(1),
});

export type SpeechSentencesFile = z.infer<typeof SpeechSentencesFileSchema>;

/**
 * Parse the bundled JSON at import time. Throws ZodError on malformed
 * data, which surfaces as a build failure in CI — the whole point of
 * doing it here instead of on first use.
 */
function loadAndValidate(): SpeechSentencesFile {
  const parsed = SpeechSentencesFileSchema.safeParse(raw);
  if (!parsed.success) {
    // Flatten zod issues into a single readable line — avoids dumping
    // the whole JSON into the console when dev-server prints the stack.
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(
      `[speech-sentences.json] schema validation failed:\n${issues}`,
    );
  }
  return parsed.data;
}

const validated = loadAndValidate();

export const SPEECH_SENTENCES: SpeechSentence[] = validated.sentences;

/** Filter helper — returns sentences at the requested level, preserving order. */
export function sentencesForCefr(
  cefr: SentenceCefr | 'ALL',
): SpeechSentence[] {
  if (cefr === 'ALL') return SPEECH_SENTENCES;
  return SPEECH_SENTENCES.filter((s) => s.cefr === cefr);
}

/** Parse a ?cefr=X value from a URLSearchParams entry. Returns 'ALL' for missing/invalid. */
export function parseCefrParam(raw: string | null | undefined): SentenceCefr | 'ALL' {
  if (!raw) return 'ALL';
  const upper = raw.toUpperCase();
  return (SENTENCE_CEFR_LEVELS as readonly string[]).includes(upper)
    ? (upper as SentenceCefr)
    : 'ALL';
}
