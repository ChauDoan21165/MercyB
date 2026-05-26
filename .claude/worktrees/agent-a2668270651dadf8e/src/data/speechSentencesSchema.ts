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

/**
 * Round 5 topic labels. New records written after 2026-04-28 use one of
 * the first 6 values (work/daily/texting/email/shopping/money). The rest
 * are the free-form `context` values already present in the original 100
 * records — kept in the allow-list so legacy rows still validate. When
 * more topics appear in future rounds, extend this array.
 */
export const SENTENCE_TOPICS = [
  // Round 5 — CC1 batch (daily life & work)
  'work',
  'daily',
  'texting',
  'email',
  'shopping',
  'money',
  // Legacy context labels present in the original 100 records — kept so
  // those rows still validate. Do not add new legacy labels here; any
  // new record should use one of the Round-5 topics above.
  'greeting',
  'numbers',
  'introduction',
  'family',
  'food',
  'feeling',
  'opinion',
  'routine',
  'travel',
  'experience',
  'abstract',
  'conditional',
  'complex_tense',
  'hypothetical',
  'nuance',
] as const;
export type SentenceTopic = (typeof SENTENCE_TOPICS)[number];

export const SpeechSentenceSchema = z.object({
  id: z.string().regex(ID_PATTERN, 'id must match s_<cefr>_<nnn>'),
  cefr: z.enum(SENTENCE_CEFR_LEVELS),
  target_en: z.string().min(1),
  target_vi: z.string().min(1),
  context: z.string().min(1),
  /** Short notes to coaches / future difficulty-tuning. Never shown to users. */
  difficulty_hints: z.array(z.string().min(1)).default([]),
  /**
   * L1-interference rule IDs the sentence exercises. Match the tags in
   * src/lib/feedback/l1-error-detector.ts (L1WeaknessTag). Optional —
   * pre-Round-5 records predate the detector wiring and leave this absent.
   */
  l1_rule_ids: z.array(z.string().min(1)).optional(),
  /**
   * Short Vietnamese-facing note on a tricky grammar or cultural point.
   * Shown to learners next to the translation in future lesson UI. Null
   * or omitted when nothing is tricky.
   */
  vn_note: z.string().min(1).nullable().optional(),
  /**
   * Author flag — set true when the writer is uncertain about the
   * translation, CEFR level, or cultural fit and wants Chau to review
   * before the sentence ships to learners.
   */
  needs_review: z.boolean().optional(),
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
