// src/data/bilingualSentencesSchema.ts
//
// Zod schema for `bilingual-sentences.json` — the Round 5 bilingual
// sentence library covering higher-stakes and higher-CEFR contexts
// (travel, medical, immigration, school, news, relationships, plus
// work / daily / texting / email / shopping / money from CC1).
//
// This is a SEPARATE file from `speech-sentences.json`. The speech
// library is the locked pronunciation-drill dataset (A1–B2, id pattern
// `s_<cefr>_<nnn>`); this library adds topic + L1-rule tagging + VN
// review flags and extends CEFR into C1. Do not merge the two.
//
// If the JSON fails schema validation at import time, the build breaks
// in CI — by design. The JSON is the single place editors touch;
// everything enforceable lives here.

import { z } from 'zod';

import raw from './bilingual-sentences.json';

export const BILINGUAL_CEFR_LEVELS = ['A2', 'B1', 'B2', 'C1'] as const;
export type BilingualCefr = (typeof BILINGUAL_CEFR_LEVELS)[number];

export const BILINGUAL_TOPICS = [
  'travel',
  'medical',
  'immigration',
  'school',
  'news',
  'relationships',
] as const;
export type BilingualTopic = (typeof BILINGUAL_TOPICS)[number];

// ID pattern: bs_<3-digit-sequence>. Stable numeric order across the
// 200 Round-5 sentences; readable in test failure output.
const ID_PATTERN = /^bs_\d{3}$/;

// L1 rule IDs track `vi_l1_*` slugs from WEAKNESS_CATALOG. Kept loose
// here (non-enum) so new rules shipped by CC3 on a later round don't
// block sentence authoring — the companion test asserts each rule id
// exists in the catalog.
const L1_RULE_PATTERN = /^vi_l1_[a-z0-9_]+$/;

export const BilingualSentenceSchema = z.object({
  id: z.string().regex(ID_PATTERN, 'id must match bs_<nnn>'),
  cefr_level: z.enum(BILINGUAL_CEFR_LEVELS),
  topic: z.enum(BILINGUAL_TOPICS),
  text_en: z.string().min(1),
  vn_translation: z.string().min(1),
  /**
   * Weakness catalog tag(s) this sentence exercises. Empty array is
   * legal (e.g. a news headline with no obvious L1-specific pattern).
   */
  l1_rule_ids: z.array(z.string().regex(L1_RULE_PATTERN)).default([]),
  /**
   * Optional context hint for a VN reviewer — not shown to users.
   * Use it to flag a deliberate translation choice, an idiom, or a
   * high-stakes domain term.
   */
  vn_note: z.string().min(1).optional(),
  /**
   * True when Chau (or a VN reviewer) should double-check the
   * translation before publication. High-stakes domains (immigration,
   * medical) default to true across the batch.
   */
  needs_review: z.boolean().optional(),
});

export type BilingualSentence = z.infer<typeof BilingualSentenceSchema>;

export const BilingualSentencesFileSchema = z.object({
  version: z.literal(1),
  sentences: z.array(BilingualSentenceSchema).min(1),
});

export type BilingualSentencesFile = z.infer<typeof BilingualSentencesFileSchema>;

function loadAndValidate(): BilingualSentencesFile {
  const parsed = BilingualSentencesFileSchema.safeParse(raw);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  • ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(
      `[bilingual-sentences.json] schema validation failed:\n${issues}`,
    );
  }
  return parsed.data;
}

const validated = loadAndValidate();

export const BILINGUAL_SENTENCES: BilingualSentence[] = validated.sentences;

/** Filter helper — returns sentences at the requested level. */
export function bilingualSentencesForCefr(
  cefr: BilingualCefr | 'ALL',
): BilingualSentence[] {
  if (cefr === 'ALL') return BILINGUAL_SENTENCES;
  return BILINGUAL_SENTENCES.filter((s) => s.cefr_level === cefr);
}

/** Filter helper — returns sentences for a given topic. */
export function bilingualSentencesForTopic(
  topic: BilingualTopic | 'ALL',
): BilingualSentence[] {
  if (topic === 'ALL') return BILINGUAL_SENTENCES;
  return BILINGUAL_SENTENCES.filter((s) => s.topic === topic);
}
