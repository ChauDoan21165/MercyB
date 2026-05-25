# `VietnameseL1Profile` — Unified L1 Data Structure Spec

**Status:** design draft (C4) · docs only, no runtime code
**Owner:** Chau (gates the open questions in §7)
**Last updated:** 2026-05-24
**Branch:** `docs/c4-l1profile-spec`

This document specifies a **single data structure** that unifies the Vietnamese-L1
material now scattered across `src/lib/pronunciation/`, `src/lib/feedback/`, and
`src/data/placement/`. It is the schema home that C1 (grammar taxonomy —
shipped at `docs/l1-taxonomies/vi-grammar.md`, 734 lines, 12 families),
C2 (writing taxonomy), and C3 (phoneme-map expansion) feed into.

Per STRATEGY §4 (matrix product, 2 native × 8 target, up to 16 pairs), the
schema is designed for **portability**: Vietnamese is the proof case, the same
shape extends to a `SpanishL1Profile`, `KoreanL1Profile`, etc., without
reshaping consumers.

---

## 0. Inherited locked decisions

Settled upstream — these are contracts, not open questions.

- **Severity is consumer-side, not engine-side.** The detector engine remains
  first-match-wins via the ordered `VN_RULES` registry. `severity` tells the
  *tutor* how to behave on a match (intervene / hint / log) per C1's tier
  table (`vi-grammar.md` §"Severity tiers"). It is **not** a rule-selection
  tie-breaker.
- **Severity spelling: `'low' | 'medium' | 'high'`.** Locked by C4 (this
  spec) to resolve the `'med'` vs `'medium'` split between
  `vnL1Interference.ts` (`'med'`) and `vi-grammar.md` (`'medium'`). Chose
  `'medium'` because (a) C1 already uses it, (b) it's the unambiguous full
  word, (c) placement is the smaller side to migrate (37 entries vs C1's
  open-ended authoring + every future L1 profile authoring against the
  schema). Phase-1 includes a one-time `'med' → 'medium'` codemod on
  `vnL1Interference.ts`.
- **Tag namespace: `snake_case`.** Locked by Chau, matches
  `src/lib/feedback/rule-packs/vi/rules.ts` convention (`vi_l1_*`). C1's
  family IDs (`article-omission-overuse` kebab-case) and placement's
  pattern IDs (`final-consonant-cluster-reduction` kebab-case) both
  normalise to snake_case under this lock — `article_omission_overuse`,
  `final_consonant_cluster_reduction`. Phase-1 includes the rename
  codemod on both surfaces.
- **C1's `vi-grammar.md` is the reference shape for the grammar-family
  layer.** Its end-matter format note (§"Format note for A4 (schema
  designer)") explicitly hands the schema call to this spec. The
  `GrammarErrorFamily` interface C1 sketches is adopted verbatim below
  as `GrammarFamily`, modulo the severity-spelling lock above.

---

## 1. Problem statement

MercyBlade already carries serious Vietnamese-L1 specificity — 60+ rule
patterns in the feedback detector, ~30 phoneme tips + minimal-pair drill
sets in the pronunciation layer, 37 placement-grade interference patterns,
and ~50 long-form teacher-voice explanations. The work is real. The
**organization** of that work is not.

Today the same phenomenon shows up under different identities in different
files. "Final `-s` / `-ed` not pronounced" lives as `final-s` and `final-ed`
in `PHONEME_TIPS` (a teaching tip), as `vi_l1_3rd_person_s` /
`vi_l1_past_ed` / `vi_l1_plural_s` in the feedback detector (three rules,
each with bilingual short text + a long teacher-voice card), and as
`inflectional-s-ed-inaudible` + `missing-subject-verb-agreement` +
`plural-s-omission` + `past-tense-unmarked` in the placement taxonomy.
Each carries its own severity, CEFR span, examples, and tag namespace.
There is no shared identity, no shared bilingual contract, no place a new
consumer can ask *"what does Vietnamese-L1 say about this phenomenon?"*
without joining four files by hand.

Five consumers already use this material — the feedback detector
(`src/lib/feedback/rule-packs/vi/index.ts` → `L1RulePack`), the pronunciation
scorer (`src/lib/pronunciation/scorer.ts` → `getAcceptedVariants`), the
essay-feedback panel (`src/components/writing/EssayFeedbackPanel.tsx`), the
placement engine (consumes `VN_L1_INTERFERENCE_PATTERNS`), and Mercy Speak's
drill cards (`PROBLEM_PAIRS_*`). Two more are imminent: the AI Tutor's
`promptAssembly.ts` already declares an unused `_l1Patterns: string[]`
parameter at line 231 with the placeholder *"V4 L1 interference map —
consumed read-only; pattern list injected here"* — but has no schema to
inject. And the upcoming C5 eval harness needs a stable surface to assert
*"Vietnamese-L1 rule `X` fires on input `Y`"* without coupling to internal
detector layout. The schema gap is blocking concrete work, not theoretical.

The unification goal is **not** to rewrite the runtime — the feedback
detector's `L1RulePack` shape is already pack-agnostic and ships fine.
The goal is a single **read-only profile object** (`VietnameseL1Profile`)
that bundles all layers behind one import, exposes a stable
cross-layer phenomenon ID for consumers that span layers (AI Tutor,
placement grader), and gives C1/C2/C3 an obvious place to land.

---

## 2. Proposed schema

The full interface in one TypeScript block. Sub-types follow as a single
self-contained tree. Each layer is optional except `interference` — the
L1↔target contrast is what makes the profile worth anything; a profile
without it is just a generic grammar reference.

```ts
// ────────────────────────────────────────────────────────────────────────
// VietnameseL1Profile — single read-only object bundling all L1 layers.
// Shape is L1-agnostic. The "Vietnamese" in the type name documents
// intent; rename + alias for Spanish/Korean/etc. profiles (§5).
// ────────────────────────────────────────────────────────────────────────

export type CEFR = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

/** Three-tier severity. Locked spelling: full words, no abbreviations.
 *  Consumer-side signal that controls tutor behaviour on a match
 *  (high = correct every time, medium = offer rewrite, low = log silently).
 *  NOT a rule-selection tie-breaker — the detector stays first-match-wins. */
export type Severity = 'low' | 'medium' | 'high';

/** Bilingual string — target language + learner's native language.
 *  For VN profile the native key is `vi`; for KO profile it would be `ko`. */
export interface FeedbackLabel {
  /** Target language (English, for VN→EN). Always present. */
  en: string;
  /** Native language. Key matches the profile's `nativeLangCode`. */
  vi: string;
}

/** Cross-layer phenomenon ID. A single key that may link
 *  a phoneme tip, a grammar rule, a writing pattern, and a placement
 *  taxonomy entry that all describe the same underlying L1 effect.
 *  Stable, **snake_case** (per §0 namespace lock), namespaced by layer
 *  when needed.
 *  Examples:
 *    - 'final_s_inaudible'      (phonology + grammar overlap)
 *    - 'tense_unmarked'         (grammar + placement overlap)
 *    - 'topic_comment_fronting' (writing + placement overlap)
 *  Not every layer entry needs one — only those that span layers. */
export type PhenomenonId = string;

// ── Phonology layer ────────────────────────────────────────────────────
//   Source of truth for pronunciation scorer + Mercy Speak drills.

export interface PhonemeSubstitutionRule {
  /** Target English sound (rough spelling, not IPA — matches existing data). */
  target: string;
  /** What L1 speakers often say instead. */
  substitute: string;
  /** Partial-credit weight 0..1. */
  credit: number;
  label: FeedbackLabel;
  /** Optional cross-layer link. */
  phenomenon?: PhenomenonId;
}

export interface PhonemeTip {
  /** Stable key for dedup + lookup. Not shown to users. */
  phoneme: string;
  /** One short native-language sentence framing the L1 gap.
   *  Card lede in the existing UI. */
  nativeConfusion: string;
  /** Bilingual "how to make this sound correctly". */
  articulation: FeedbackLabel;
  /** 3–5 target words for drill. */
  practiceWords: string[];
  /** What L1 speakers typically produce instead — self-diagnosis aid. */
  commonErrors: string[];
  /** Optional cross-layer link. */
  phenomenon?: PhenomenonId;
}

export interface ProblemPair {
  target: string;
  contrast: string;
  /** Matches a PhonemeTip.phoneme where applicable. */
  phoneme: string;
  /** Pre-recorded model audio path, or null → fall back to TTS. */
  audioTarget: string | null;
  audioContrast: string | null;
  /** One-sentence native-language explanation of why the pair collapses. */
  nativeWhyConfused: string;
}

export interface PhonologyLayer {
  /** Word-level partial-credit substitutions (`PHONEME_SUBSTITUTIONS`). */
  substitutions: PhonemeSubstitutionRule[];
  /** Whole-word overrides (`WORD_OVERRIDES`). */
  wordOverrides: Record<string, Array<{ variant: string; credit: number }>>;
  /** Teaching tips per phoneme (`PHONEME_TIPS`). */
  tips: PhonemeTip[];
  /** Drill sets grouped by phoneme focus (`PROBLEM_PAIRS_TH_T`, etc.). */
  problemPairs: Record<string, ProblemPair[]>;
}

// ── Grammar layer ──────────────────────────────────────────────────────
//   Source of truth for the feedback detector's runtime rule pack.
//   Backwards-compatible with the existing `L1RulePack` shape — this is
//   the same object, embedded as a layer.

/** A pure rule function. The detector engine in
 *  `src/lib/feedback/l1-error-detector.ts` is target-language-specific
 *  (English grammar helpers live there) but pack-agnostic. */
export type L1Rule = (args: RuleArgs) => RuleHit | null;

export interface RuleArgs {
  userTokens: string[];
  expectedTokens: string[];
  userText: string;
  expectedText: string;
  rawUser: string;
  rawExpected: string;
  ctx: { subjectGender?: 'male'|'female'|null;
         timeframe?: 'past'|'present'|'future'|null;
         isQuestion?: boolean };
}

export interface RuleHit {
  /** Pack-local tag, e.g. 'vi_l1_3rd_person_s'. */
  tag: string;
  replacements: Record<string, string>;
}

/** Long-form teacher-voice card for one grammar rule. Today's
 *  `L1VnExplanation` shape, renamed for the unified schema. */
export interface GrammarExplanation {
  /** Matches a rule's `tag`. */
  tag: string;
  /** Short-form bilingual feedback shown after an answer.
   *  Supports {FIX}, {USER_PREP}, etc. placeholders. */
  shortForm: FeedbackLabel;
  /** Native-language rule name. */
  nameNative: string;
  /** 2–4 sentences of native-language teacher voice. ≤300 chars. */
  longFormNative: string;
  /** Word-for-word gloss showing the L1→target transfer process. */
  exampleWrongNativeGloss: string;
  /** Optional region-aware addendum (e.g. Northern/Southern Vietnamese). */
  dialectNote?: string;
  /** True when the underlying L1 grammar claim needs native-speaker review. */
  needsReview: boolean;
  /** CEFR band where this rule typically fires. */
  cefr: CEFR[];
  severity: Severity;
  /** Optional cross-layer link. */
  phenomenon?: PhenomenonId;
}

/** Curated grammar **family** — coarser-grained than a rule.
 *  Lifted from C1's `vi-grammar.md` end-matter `GrammarErrorFamily`
 *  format note. A family groups multiple `grammar.rules` that share
 *  an L1 root (e.g. `article_omission_overuse` covers `vi_l1_missing_article`
 *  plus over-correction patterns that detect separately). Carries the
 *  rich example bank C1's doc supplies: 8–15 paired examples per family
 *  with optional per-example `whyViL1` glosses — what the prompt-tuning
 *  layer and AI Tutor consume, distinct from the runtime detector's
 *  short-form feedback strings. */
export interface GrammarFamily {
  /** Stable id, snake_case (per §0 lock). C1 uses kebab in vi-grammar.md;
   *  Phase-1 codemod renames to snake_case at ingestion time. */
  id: string;
  /** One-line summary in target language (English for VN→EN). */
  descriptionEn: string;
  /** One-line summary in native language. */
  descriptionVi: string;
  severity: Severity;
  /** One sentence: why this tier, per C1's "tutor behaviour" mapping. */
  severityRationale: string;
  examples: Array<{
    learnerProduces: string;
    targetForm: string;
    /** Optional gloss on the Vietnamese root of this specific example. */
    whyViL1?: string;
  }>;
  /** Optional list of `grammar.rules` tags that fire under this family.
   *  Empty when no detector rule exists yet (some C1 families predate
   *  detector coverage — see vi-grammar.md "report item 4"). */
  ruleTags?: string[];
  /** Optional cross-layer link to phonology / writing / interference. */
  phenomenon?: PhenomenonId;
}

export interface GrammarLayer {
  /** Ordered rule registry. First match wins. (`VN_RULES`) */
  rules: L1Rule[];
  /** Tag → explanation. Both short-form and long-form lookups. */
  explanations: GrammarExplanation[];
  /** Curated higher-level families with rich example banks.
   *  Optional because a freshly-bootstrapped L1 profile may have rules
   *  but no curated family taxonomy yet. */
  families?: GrammarFamily[];
}

// ── Writing layer (C2 lands here) ──────────────────────────────────────
//   Document-/paragraph-level patterns. Empty in v1; C2 populates it.

export interface WritingPattern {
  /** Stable kebab-case id, namespaced if needed. */
  id: string;
  /** Discourse / register / cohesion / paragraph-shape / speech-act. */
  category: 'discourse' | 'register' | 'cohesion' | 'paragraph-shape'
          | 'pragmatics' | 'genre';
  name: FeedbackLabel;
  description: FeedbackLabel;
  /** Why this happens given the L1↔target contrast. Native-language. */
  nativeRoot: string;
  examples: Array<{ incorrect: string; corrected: string;
                    nativeGloss?: string; context?: string }>;
  cefr: CEFR[];
  severity: Severity;
  /** Genres where it appears most: email, IELTS-task-2, cover-letter, etc. */
  genres: string[];
  remediation: string;
  /** Optional cross-layer link. */
  phenomenon?: PhenomenonId;
}

export interface WritingLayer {
  patterns: WritingPattern[];
}

// ── Interference map (placement + AI Tutor consume this) ───────────────
//   The "atlas" of L1 transfer phenomena. Spans all layers; today's
//   `VN_L1_INTERFERENCE_PATTERNS` is the v0 of this.

export interface InterferencePattern {
  id: string;
  category: 'phonology' | 'morphology' | 'syntax'
          | 'lexicon' | 'discourse' | 'pragmatics';
  name: FeedbackLabel;
  description: FeedbackLabel;
  /** L1-root explanation: why this happens given the contrast. */
  nativeRoot: string;
  examples: Array<{ incorrect: string; corrected: string;
                    nativeGloss?: string; context?: string }>;
  cefr: CEFR[];
  severity: Severity;
  remediation: string;
  /** Free-form lesson-routing tags. */
  lessonTags: string[];
  /** Cross-layer link to a grammar tag / phoneme key / writing id.
   *  Required when the entry duplicates a sibling layer's phenomenon. */
  phenomenon?: PhenomenonId;
  /** Optional citation handles for the source research. */
  sources?: string[];
}

export interface InterferenceMap {
  patterns: InterferencePattern[];
}

// ── Profile metadata — required ────────────────────────────────────────

export interface L1ProfileMetadata {
  /** ISO 639-1, lowercase. Identifies the learner's native language. */
  nativeLangCode: string;       // 'vi'
  /** Native-language display name. */
  nativeLangName: string;       // 'Tiếng Việt'
  /** Target language code. */
  targetLangCode: string;       // 'en'
  /** Semver. Bump on any layer addition or string edit. */
  version: string;              // '1.0.0'
  /** ISO date the profile was last reviewed end-to-end by a native speaker. */
  lastReviewed: string;         // '2026-05-24'
  /** Reviewer handle / role. */
  lastReviewedBy: string;       // 'Chau Doan (founder)'
  /** Sources backing the L1 claims — published research, teaching notes. */
  citations: string[];
}

// ── The profile itself ─────────────────────────────────────────────────

export interface L1Profile {
  meta: L1ProfileMetadata;
  /** Required: the L1↔target atlas. */
  interference: InterferenceMap;
  /** Optional layers — present iff that surface is built for this pair. */
  phonology?: PhonologyLayer;
  grammar?: GrammarLayer;
  writing?: WritingLayer;
}

/** Named alias documents intent. Identical shape; the schema is L1-agnostic. */
export type VietnameseL1Profile = L1Profile;
```

---

## 3. Mapping — where each existing file lands

One line per inventory item. No reshaping intended at the data level; the
mapping is *which layer's source-of-truth the file becomes*, not "rewrite it".

| Existing file | Becomes |
|---|---|
| `src/lib/pronunciation/vn-phoneme-map.ts` → `PHONEME_SUBSTITUTIONS`, `WORD_OVERRIDES` | `phonology.substitutions`, `phonology.wordOverrides` |
| same file → `PHONEME_TIPS` | `phonology.tips` |
| same file → `PROBLEM_PAIRS_TH_T` / `_R_L` / `_ED_ENDINGS` / `_S_PLURALS` | `phonology.problemPairs` (keyed by drill name) |
| same file → `getAcceptedVariants`, `inferPhonemeForWord` | Stay as helper functions in the pronunciation engine; consume the profile. **Not** part of the profile data. |
| `src/lib/feedback/l1-error-detector.ts` → `L1WeaknessTag` union + rule functions + English-grammar helpers | Rules functions become `grammar.rules` entries; helpers stay in the target-language-specific engine (per existing rule-pack-types.ts contract). |
| `src/lib/feedback/l1-vn-explanations.ts` → `L1_VN_EXPLANATIONS` long-form cards | Merged into `grammar.explanations` (as the long-form fields of `GrammarExplanation`). |
| `src/lib/feedback/rule-packs/vi/rules.ts` → `VN_RULES` ordered registry | `grammar.rules` (same order). |
| `src/lib/feedback/rule-packs/vi/explanations.ts` → `VN_EXPLANATIONS` short-form | Merged into `grammar.explanations` (as the `shortForm` field). |
| `src/lib/feedback/rule-pack-types.ts` → `L1RulePack` + `validateRulePack` | The `L1RulePack` shape is **subsumed** by `GrammarLayer` + `L1ProfileMetadata`. `validateRulePack` generalises into `validateL1Profile` (future work). |
| `src/data/placement/vnL1Interference.ts` → `VN_L1_INTERFERENCE_PATTERNS` (37 entries) | `interference.patterns`. The `vietnameseRoot` field renames to `nativeRoot`. |
| `docs/placement-vn-l1-interference-taxonomy.md` | Stays — narrative reference doc. The structured data moves into `interference`; the prose stays where it is and cites the same IDs. |
| **C1** `docs/l1-taxonomies/vi-grammar.md` (shipped — 734 lines, 12 families, end-matter format note) | Becomes `grammar.families` via the mechanical transform C1's format note describes. Per-family `whyViL1` example glosses survive unchanged. Existing detector `grammar.rules` + `grammar.explanations` stay; families link to them via `ruleTags`. |
| **C2** (upcoming `docs/l1-taxonomies/vi-writing.md`) | Populates `writing.patterns` (currently empty in v1). |
| **C3** (upcoming `docs/l1-taxonomies/vn-phoneme-expansion.md`) | Extends `phonology.*` — new phonemes, new problem pairs, regional phonology. |

---

## 4. Consumer surface

How each consumer reads the profile. **No** consumer mutates it.

### 4.1 Feedback detector
**Today:** imports `VN_RULE_PACK` from `rule-packs/vi/index.ts`.
**Under spec:** imports `vietnameseL1Profile` and reads `.grammar`. The
detector engine in `l1-error-detector.ts` is unchanged — same `RuleArgs`
contract, same first-match-wins evaluation, same English-grammar helpers.
The pack-shape work already done in `rule-pack-types.ts` is preserved
verbatim, just rehomed.

### 4.2 Pronunciation scorer (`src/lib/pronunciation/scorer.ts`)
**Today:** imports `PHONEME_SUBSTITUTIONS`, `WORD_OVERRIDES`,
`getAcceptedVariants`.
**Under spec:** imports `vietnameseL1Profile.phonology` and passes
`substitutions` + `wordOverrides` into the (unchanged) `getAcceptedVariants`
helper. The helper itself is language-agnostic and stays in the scorer.

### 4.3 Mercy Speak drill cards
**Today:** imports `PROBLEM_PAIRS_*` and `PHONEME_TIPS`.
**Under spec:** imports `vietnameseL1Profile.phonology.problemPairs` and
`.tips`. Drill cards key off `phoneme` (unchanged).

### 4.4 Placement engine
**Today:** imports `VN_L1_INTERFERENCE_PATTERNS`,
`getVnL1PatternById`, `getVnL1PatternsByCategory`.
**Under spec:** imports `vietnameseL1Profile.interference.patterns`. The
`by-id` / `by-category` helpers become generic methods (or local utilities)
that take an `InterferenceMap` argument.

### 4.5 AI Tutor — `promptAssembly.ts`
**Today:** `assembleContextBlock` accepts `_l1Patterns: string[]` at
line 231 but **doesn't consume it** — the L1 injection point at line 253 is
a TODO comment.
**Under spec:** the caller passes a small projection of the profile.
Per C1's `vi-grammar.md`, `grammar.families` is the right shape to feed
the tutor — each family carries the bilingual one-liner + the example
bank the LLM prompt benefits from. The projection is *(family id,
severity, `descriptionVi`)* for each phenomenon the learner has hit
recently. Severity drives behaviour: `high` → "correct every time + show
rewrite"; `medium` → "offer rewrite if learner asks"; `low` → omit from
the injection entirely (it's logged for periodic summaries, not surfaced
mid-conversation). The prompt assembler injects those lines into the
Vietnamese system prompt under the existing *"Lần trước bạn học về:"* /
*"Bạn đang cần cải thiện:"* block, framed in Vietnamese teacher voice.
The profile is read-only; the projection is the consumer's call, not
the schema's.

This is the **first** new consumer wiring. The exact projection shape +
prompt copy is a follow-up dispatch (C6?), not part of this spec.

### 4.6 C5 eval harness (future)
The eval harness needs three stable surfaces:
- **List rules** — iterate `grammar.explanations` for tag coverage.
- **Run a rule against fixture input** — replay through the existing
  detector engine, no profile mutation.
- **Assert phenomenon-level coverage** — *"every phenomenon listed in
  `interference` is reachable by at least one `grammar.rules` entry **or**
  one `phonology.tips` entry **or** is explicitly tagged `writing`-only"*.

The cross-layer `PhenomenonId` field is what makes #3 cheap. Without it,
the harness would have to fuzzy-match strings.

---

## 5. Portability — extending to a second L1

The schema names are deliberately L1-agnostic. To ship a `SpanishL1Profile`:

1. Author a `spanishL1Profile: L1Profile` object literal with
   `meta.nativeLangCode = 'es'`.
2. In every `FeedbackLabel`, the `vi` key is replaced by `es`. **This is
   the one shape change** — the `FeedbackLabel` interface should generalise
   to `{ [targetCode]: string; [nativeCode]: string }` (open question §7.3),
   or `{ en: string; native: string }` with the native code recorded in
   `meta`. Both work; one is chosen at unification time, not in this spec.
3. Populate `interference.patterns` with Spanish-L1 transfer entries
   (ser/estar confusion, gendered article transfer, dropped-subject habit).
   The placement taxonomy methodology in
   `docs/placement-vn-l1-interference-taxonomy.md` is the template — same
   category set, same severity scale, same CEFR distribution table.
4. Populate `grammar.rules` + `grammar.explanations` with Spanish-L1
   rules (same `L1Rule` signature; the English-grammar helpers in the
   detector engine are unchanged).
5. Phonology is optional — Spanish can launch without phoneme drills
   and ship them later; the `phonology` field is nullable.
6. Writing is optional — empty for v1 of every L1, populated by per-L1
   C2-equivalent dispatches.

The detector engine, the scorer engine, the prompt assembler, and the
placement engine all consume `L1Profile` — none of them know whether the
profile is for Vietnamese, Spanish, or Korean. That is the moat in
STRATEGY §11: every additional pair gets the same depth surface without
re-architecting the runtime. Vietnamese is the proof case; the proof is
the schema's neutrality, not a Vietnamese-only commitment.

**Hypothetical:** a `KoreanL1Profile` for English-native learners of Korean
would invert direction — `meta.targetLangCode = 'ko'`,
`meta.nativeLangCode = 'en'`. The schema is symmetric on direction; only
the rule-pack engine (which knows the *target* language's grammar) needs a
parallel implementation for non-English targets. That work is out of scope
here.

---

## 6. Migration — phasing without breaking runtime

The existing files all ship green. The migration is **reshape in place
under a new import surface**, not rewrite.

### Phase 0 — this spec (now)
Schema published. No code changes. C1/C2/C3 author against this shape.

### Phase 1 — add the profile object, keep old exports
- Two one-time codemods (locked in §0):
  1. `vnL1Interference.ts`: replace every `severity: 'med'` with
     `severity: 'medium'` (37 entries).
  2. ID namespace rename: kebab-case → snake_case across
     `vnL1Interference.ts` IDs, `vi-grammar.md` family IDs, and any
     consumer that string-matches them. Keep a deprecation alias
     `getPatternByOldId(oldKebabId)` for one release if any external
     callers exist (grep shows none today; confirm at codemod time).
- New file `src/lib/l1-profiles/vietnamese.ts` exports
  `vietnameseL1Profile: L1Profile` built **by re-exporting** the existing
  data:
  ```ts
  // illustrative — not part of this spec's deliverable
  grammar: { rules: VN_RULES,
             explanations: merge(VN_EXPLANATIONS, L1_VN_EXPLANATIONS),
             families: ingestC1Families('docs/l1-taxonomies/vi-grammar.md') }
  phonology: { substitutions: PHONEME_SUBSTITUTIONS, wordOverrides: WORD_OVERRIDES,
               tips: PHONEME_TIPS, problemPairs: { th_t: PROBLEM_PAIRS_TH_T, ... } }
  interference: { patterns: VN_L1_INTERFERENCE_PATTERNS }
  ```
- Old exports stay live; nothing breaks. Both surfaces are reachable.
- Tests added: `validateL1Profile(vietnameseL1Profile).length === 0`.

### Phase 2 — flip consumers one at a time
For each consumer (scorer → drill cards → essay panel → placement →
feedback detector), open a small PR that switches imports from the old
file to `vietnameseL1Profile.<layer>`. Each PR is verifiable in isolation
(same data, same behavior).

### Phase 3 — collapse to single source
Once every consumer is on `vietnameseL1Profile.*`, delete the old top-level
exports (`PHONEME_SUBSTITUTIONS`, `VN_RULE_PACK`, `VN_L1_INTERFERENCE_PATTERNS`).
The data still lives in the same files (or moves to a single
`src/lib/l1-profiles/vietnamese/*` tree) but only the profile object is
exported. **Principle 1** (clean code before moving on): no parallel
duplicate surface left behind.

### Phase 4 — AI Tutor wiring (first new consumer)
`promptAssembly.ts` drops the `_l1Patterns: string[]` placeholder and
consumes a projection of `vietnameseL1Profile`. Scope of the projection is
a separate dispatch — this spec doesn't decide the prompt copy.

### Phase 5 — second L1 (proves portability)
Author a minimal `spanishL1Profile` or `koreanL1Profile` (interference + a
single grammar rule). No new content for the lighter pairs is in scope
here; this phase is **architecture-proof**, not content shipping.

---

## 7. Locked decisions (Q1–Q5)

Five decisions ratified by Chau on 2026-05-24. These are contracts;
do not re-litigate without satisfying the named re-open gate. The
original "open question" framing has been superseded.

### Q1 — `FeedbackLabel` shape: keep `{en, vi}` fixed for v1

Generalize at Phase 5 when a second L1 (Spanish / Korean) ships and
shows what the "native" label slot actually needs. The cost of
generalizing now is a global rename across every consumer site reading
`.vi` today; the cost of generalizing later is one codemod plus one
type-bridge — same total cost, but doing it later means having
evidence about what the second L1 actually needs.

C1 independently chose parallel fields `descriptionEn` /
`descriptionVi` inside `GrammarFamily`. The spec keeps `{en, vi}` for
`FeedbackLabel` and parallel fields for `GrammarFamily` to honour C1's
authored shape; the unification happens at Phase 5, not now.

**Re-open gate:** a second L1 profile begins authoring (Phase 5 in §6)
and the label-shape choice needs evidence from a real second
native-language slot.

### Q2 — Profile on-disk location: `src/lib/l1-profiles/`

The profile contains rule **functions** — the existing
`src/lib/feedback/rule-packs/vi/rules.ts` is TypeScript-with-functions,
not pure JSON. `public/data/` is for things the browser fetches at
runtime; rule functions cannot live there. Treating the profile as
runtime code is correct for what it actually is.

**Re-open gate:** the grammar layer's `rules` field is migrated to a
data-only DSL (no functions; addressed conditionally by future-work
item if pursued), making the profile JSON-shaped and Supabase-storable.
Not on any current roadmap.

### Q3 — `interference.patterns` role: duplicate (cross-linked) — atlas role

The placement test consumes `vnL1Interference.ts` to predict which
patterns a learner will struggle with **before** there is detector
evidence. That requires a complete atlas, not a sparse one. The
cross-link via `PhenomenonId` (§2 schema decision, §4 consumer
decision) handles the duplication without drift.

Concretely: a phenomenon may have an entry in
`interference.patterns` (placement-consumed prediction atlas) AND in
`grammar.rules` + `grammar.explanations` (detector + tutor) AND in
`phonology.tips` (Mercy Speak). All four share one `PhenomenonId` so
`validateL1Profile()` can assert "no orphan interference entry" and
the C5 eval harness can assert "every interference entry is reachable
from at least one sibling layer" without fuzzy string matching.

**Re-open gate:** drift between `interference` and the sibling layers
is observed in CI (the `validateL1Profile` cross-link check
introduced in §8 item 3 is the early-warning), and the cost of dual
maintenance starts to outweigh the placement-atlas-completeness
benefit.

### Q4 — `lessonTags` location: separate file, `lesson-routing-tags.ts`

Lesson routing is a product concern that changes faster than the L1
profile. Keeping them separate means the profile stays stable while
lesson routing iterates. The new file is keyed on `PhenomenonId`,
giving the routing surface everything it needs without forcing the
profile to know about lessons.

Migration impact: `vnL1Interference.ts`'s current `lessonTags: string[]`
field moves out of `InterferencePattern` into the new
`lesson-routing-tags.ts` at Phase-1 codemod time. The Phase-1 codemod
list in §6 acquires a third entry for this move.

**Re-open gate:** a second consumer needs lesson tags that don't fit
the `PhenomenonId` keying (e.g. a per-rule tag a single phenomenon
shouldn't carry), and an in-profile field would be cleaner than
extending the routing file's keying.

### Q5 — `dialectNote` shape: single optional string for v1

C3's southern-dialect gap audit produced 8 entries — enough to warrant
noting dialect, not enough to warrant structuring it. The current
`l1-vn-explanations.ts` shape (`dialect_note?: string`) is preserved
unchanged in the spec as `dialectNote?: string`. Promote to a richer
`dialectVariants: Record<dialect, FeedbackLabel>` map only when one of
the gates below trips.

**Re-open gate:** (a) a second dialect lands with ≥20 entries, **or**
(b) the tutor consumer needs to switch behaviour per detected dialect
(e.g. region-specific feedback, region-specific drill selection).
Neither is true today.

### Closed earlier in §0 (kept here for audit trail)

- **Severity spelling — `'med'` vs `'medium'`.** Closed by C4 →
  `'medium'`.
- **Tag namespace — kebab vs snake vs lowercase-dashes.** Closed by
  Chau → `snake_case`.
- **Is severity a tie-breaker for which rule fires?** Closed by C1 →
  no. First-match-wins stays; severity is consumer-side.
- **CEFR span — array vs range?** De facto closed → `CEFR[]` array.
  Existing placement data uses array; C1's families don't expose a
  CEFR field at all; array preserves both. Revisit only if a consumer
  needs range semantics.
- **Versioning — per-layer or profile-wide?** De facto closed →
  profile-wide. C1 + Phase-1 mechanics work with one `meta.version`;
  per-layer adds complexity without a named consumer asking for it.

### Future re-open gates (summary)

| Q  | Locked answer                                    | Trigger that re-opens it                                                                       |
|----|--------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Q1 | `FeedbackLabel = {en, vi}` fixed                 | Second L1 (Spanish / Korean) begins authoring and a real native-label slot needs evidence.    |
| Q2 | Profile lives at `src/lib/l1-profiles/`          | `grammar.rules` migrates to a function-free DSL (not on any current roadmap).                 |
| Q3 | `interference` duplicates layers, cross-linked   | CI `validateL1Profile()` flags drift, or dual-maintenance cost outweighs atlas completeness.  |
| Q4 | `lessonTags` moved to `lesson-routing-tags.ts`   | A second consumer needs lesson tags incompatible with `PhenomenonId` keying.                  |
| Q5 | `dialectNote?: string` single field              | A second dialect lands with ≥20 entries, **or** tutor needs per-dialect behaviour switching.  |

---

## 8. Future work

Cap: 6.

1. **Phase-1 codemods (locked in §0).** `'med' → 'medium'` on
   `vnL1Interference.ts` (37 entries); kebab-case → snake_case ID rename
   across `vnL1Interference.ts`, C1's `vi-grammar.md`, and any
   cross-referencing consumer. Grep first to confirm no external
   string-matchers break.
2. **Profile builder + C1 ingestor.** One codemod walks every existing
   inventory file and emits the `vietnameseL1Profile` object literal
   (machine-verifiable against today's exports); a second parser ingests
   C1's `vi-grammar.md` into `GrammarFamily[]`, preserving every
   `whyViL1` gloss and heuristically joining family IDs to `L1WeaknessTag`
   for human-reviewed `ruleTags` links.
3. **`validateL1Profile()` generic validator** (extension of today's
   `validateRulePack`) — checks `phenomenon` cross-links resolve, no
   orphan `tag` in `grammar.explanations`, no `interference.patterns`
   entry without an `id` or citation when `severity >= 'medium'`.
4. **C5 eval-harness coverage assertion.** Fails CI when an
   `interference` entry has no reachable layer entry via `phenomenon`.
5. **Profile diff/changelog tool.** Human-readable diff between two
   profile versions so C1/C2/C3 dispatches land with a clear "what
   changed" summary.
6. **Minimal-viable-profile template + one-time backfill of cross-layer
   `phenomenon` links** so a Spanish or Korean dispatch starts from a
   structured skeleton, and every "final-s" / "past-ed" / "TH" entry
   already shares an ID across phonology + grammar + interference.

---

*End of spec. No PR opened — waiting for Chau on §7.*
