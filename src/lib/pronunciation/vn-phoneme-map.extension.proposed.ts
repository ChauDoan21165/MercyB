/**
 * PROPOSAL ONLY — not imported. See docs/l1-taxonomies/vn-phoneme-gaps.md
 * for rationale. Merging into vn-phoneme-map.ts is a separate review step.
 *
 * This file enumerates additional Vietnamese-L1 → English-pronunciation
 * substitution rules and word overrides that the audit (C3, 2026-05-24)
 * found missing from the live `vn-phoneme-map.ts`. Six gap categories
 * were covered: southern dialect, final consonant clusters, vowel
 * quality, word stress, connected speech, intonation. Intonation is not
 * encodable as a string-replace rule and is intentionally absent here.
 *
 * Shape contract: every entry conforms to `PhonemeSubRule` (re-imported)
 * or to the `Array<{ variant; credit }>` shape used by `WORD_OVERRIDES`.
 * Credit values follow the live file's curated bands (0.55, 0.60, 0.65,
 * 0.70, 0.75, 0.80, 0.85). Items at 0.55 are below the live file's
 * stated "treat as wrong" floor of 0.60 and would be excluded on merge
 * unless deliberately accepted as marginal — they are kept here for the
 * reviewer's judgement.
 *
 * Inherited decisions (from C1's vi-grammar.md and the C4 namespace lock-in
 * coming next):
 *   - Severity is a CONSUMER-side signal (tutor behaviour on a match), not
 *     a tie-breaker for which rule wins. First-match-wins remains the
 *     engine contract. For phonology, the underlying signal stays partial
 *     credit (a gradient), and the consumer derives high/medium/low from
 *     credit bands — see the "Severity contract" section in the markdown.
 *   - Tag namespace: this file deliberately omits per-rule `tag` /
 *     `id` fields. If C4 locks a snake_case tag namespace (matching
 *     src/lib/feedback/rule-packs/vi/rules.ts), a suggested tag-per-rule
 *     mapping is enumerated in the markdown's format-note section. Adding
 *     the field is a one-line schema change at merge time.
 *
 * No runtime imports this file. Adding it to vn-phoneme-map.ts (or
 * exposing it via a separate consumer) is out of scope for the audit.
 */

import type { PhonemeSubRule } from './vn-phoneme-map';

// ────────────────────────────────────────────────────────────────────────
// Proposed sound-level substitution rules.
//
// Order matters at consume-time (one substitution per variant at a time
// in getAcceptedVariants). Final-cluster rules use the `$` suffix anchor
// convention from the live file.
// ────────────────────────────────────────────────────────────────────────

export const PROPOSED_PHONEME_SUBSTITUTIONS: PhonemeSubRule[] = [
  // ── Gap 1: Southern Vietnamese dialect ────────────────────────────────
  // WIRED into vn-phoneme-map.ts. See git history.

  // ── Gap 2: Final consonant cluster simplification ─────────────────────
  // WIRED into vn-phoneme-map.ts. See git history.

  // ── Anything-else: Dark L vocalization / drop ─────────────────────────
  { target: 'l$', substitute: 'w', credit: 0.65,
    labelEn: 'final dark -l → w-glide (feel → feew, full → fuw)',
    labelVi: 'âm "l" cuối thành "w" (feel → feew)' },
  // 0.55 is below the live file's stated wrong-floor; merge-time decision.
  { target: 'l$', substitute: '', credit: 0.55,
    labelEn: 'final dark -l dropped (full → fu, well → we) — marginal',
    labelVi: 'bỏ âm "l" cuối (full → fu) — biên thấp' },
];

// ────────────────────────────────────────────────────────────────────────
// Proposed word overrides.
//
// Additive to the existing WORD_OVERRIDES table. Where a key already
// exists in the live map (`very`, `love`), this entry proposes
// ADDITIONAL variants — getAcceptedVariants's dedupe-by-highest-credit
// makes the merge safe.
// ────────────────────────────────────────────────────────────────────────

export const PROPOSED_WORD_OVERRIDES: Record<
  string,
  Array<{ variant: string; credit: number }>
> = {
  // ── Gap 1: Southern Vietnamese dialect ──────────────────────────────
  // WIRED into vn-phoneme-map.ts. `have → hay` (0.55) and `love → loy`
  // (0.55) were dropped per the 0.60 wrong-floor contract. See git
  // history for the merge.

  // ── Gap 3: Vowel quality drift ──────────────────────────────────────
  sheep:   [{ variant: 'ship',     credit: 0.65 },
            { variant: 'sip',      credit: 0.55 }],
  feet:    [{ variant: 'fit',      credit: 0.65 }],
  seat:    [{ variant: 'sit',      credit: 0.65 }],
  leave:   [{ variant: 'live',     credit: 0.65 },
            { variant: 'lib',      credit: 0.55 }],
  fool:    [{ variant: 'full',     credit: 0.70 },
            { variant: 'fu',       credit: 0.55 }],
  pool:    [{ variant: 'pull',     credit: 0.70 },
            { variant: 'pu',       credit: 0.55 }],
  bad:     [{ variant: 'bed',      credit: 0.65 },
            { variant: 'bet',      credit: 0.55 }],
  bag:     [{ variant: 'beg',      credit: 0.65 }],
  cat:     [{ variant: 'ket',      credit: 0.55 }], // TODO: verify
  cup:     [{ variant: 'cop',      credit: 0.65 },
            { variant: 'kap',      credit: 0.55 }],
  bird:    [{ variant: 'bert',     credit: 0.55 },
            { variant: 'bet',      credit: 0.50 }], // below floor — review-only
  about:   [{ variant: 'abowt',    credit: 0.70 },
            { variant: 'ebowt',    credit: 0.70 }],

  // ── Gap 4: Word stress (limited — see report) ───────────────────────
  computer:   [{ variant: 'kompiuter',  credit: 0.70 },
               { variant: 'com-poo-ter', credit: 0.70 }],
  hotel:      [{ variant: 'hoten',      credit: 0.65 }],
  photograph: [{ variant: 'foto-graf',  credit: 0.70 }],
  economic:   [{ variant: 'e-co-no-mic', credit: 0.70 }],

  // ── Gap 5: Connected speech (citation form for contraction targets) ─
  // Gap-5 connected-speech variants with whitespace deferred to Phase 2.
  // The live scorer's tokenize() splits on \s+, so multi-token variants
  // cannot match. Re-enable here after getAcceptedVariants /
  // scorePronunciation grow multi-token support. C3 audit, 2026-05.
  gonna:    [{ variant: 'going-to',     credit: 0.85 }],
  wanna:    [{ variant: 'want-to',      credit: 0.85 }],
  gotta:    [{ variant: 'got-to',       credit: 0.85 }],
  because:  [{ variant: 'becos',        credit: 0.80 },
             { variant: 'bee-cos',      credit: 0.75 },
             { variant: 'bee-cause',    credit: 0.75 }],
  tomorrow: [{ variant: 'to-mor-row',   credit: 0.80 },
             { variant: 'to-mo-row',    credit: 0.75 }],

  // ── Anything-else: dark L, ch/sh, dʒ, initial-cluster epenthesis ────
  feel:        [{ variant: 'feew',      credit: 0.65 },
                { variant: 'fee',       credit: 0.55 }],
  school:      [{ variant: 'schoo',     credit: 0.60 },
                { variant: 'skuw',      credit: 0.60 },
                { variant: 'sukul',     credit: 0.55 }],
  full:        [{ variant: 'fuw',       credit: 0.65 },
                { variant: 'fu',        credit: 0.55 }],
  well:        [{ variant: 'weu',       credit: 0.65 },
                { variant: 'we',        credit: 0.50 }],
  chair:       [{ variant: 'share',     credit: 0.60 }],
  george:      [{ variant: 'jorj',      credit: 0.65 },
                { variant: 'joe-rge',   credit: 0.65 }],
  'thank-you': [{ variant: 'tan-cu',    credit: 0.70 },
                { variant: 'thang-kiu', credit: 0.70 }],
  please:      [{ variant: 'puh-lease', credit: 0.70 },
                { variant: 'pi-lis',    credit: 0.65 }],
};
