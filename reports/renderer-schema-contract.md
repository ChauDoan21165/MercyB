# LessonRenderer Schema Contract — Canonical Reference

**Status:** authoritative reference · **Generated:** 2026-05-17 · **Branch:** `renderer-schema-docs` · **Code basis:** `origin/main @ 29bc2b75` (post #523, #520/#521, #501/#502, #499, #514, #529)

**Source of truth:**
- `src/components/languages/LessonRenderer.tsx` (878 lines — renderer + inline `pick()` / `isFallback()` / `FallbackBadge`)
- `src/components/languages/LessonRenderer.types.ts` (183 lines — `NormalizedLesson` contract)
- `src/languages/{korean,japanese,chinese,french,german,spanish,vietnamese}/normalize.ts` (7 normalizers)

> Why this doc exists: across 30+ PRs this session the renderer's schema contract was re-derived ad hoc by each recon agent. This is the single place to look instead. If code and this doc diverge, the code wins — file an update.

---

## 1. TL;DR — the five rules

1. **The renderer is field-name-pure.** It reads only `NormalizedLesson` field names. *All* per-language aliasing (`s.korean`, `e.japanese`, `lesson.topic`, French/German content-in-`s.en`, Spanish gender markers) happens at the normalizer boundary. There is **no** `s.en ?? s.english` or `isKorean(lang)` branching inside the renderer.
2. **Bilingual fields are `*Vi` + optional `*En` independent siblings — never translations of each other.** They share *intent*, not wording. The renderer shows one via `pick(uiLanguage, en, vi)`; it never shows both (single-language rule #523). The lone exception is the `dualTitle` prop (Vietnamese-for-foreigners only).
3. **`FallbackBadge` fires only for "prose pedagogy" + `pronunciationFocus` + `dialogue_long`.** It tells the learner "this isn't in your selected UI language because the authored version is missing." Glosses (sentence/vocab/short-dialogue), exercise scaffolding, and `grammar` are picked **silently with no badge** — by design (#523: a second-language gloss line was duplication, not a learner aid).
4. **Target-language content is never collapsed and never badged.** `native`, `romanization`, `title.native`, `title.romanization`, `idiom.idiom`, and `grammar.point`/`.explanation` are *the lesson itself* — they pass through verbatim, independent of `uiLanguage`.
5. **`uiLanguage` defaults to `"vi"`** so the six pre-existing modules don't regress. Only `SpanishLessonsPage` passes `"en"` (hard-coded; English-source module). Every page except Vietnamese-for-foreigners passes the page's live toggle value; Vietnamese-for-foreigners passes `dualTitle` instead.

---

## 2. Per-field reference table

`pick(uiLang, en, vi)` = `uiLang === "en" ? (en ?? vi) : (vi ?? en)`. `isFallback` is true when the preferred-language value is absent and the other is present. "Swaps?" = does the rendered value change with `uiLanguage`.

| Rendered field | Normalized field(s) | Swaps w/ uiLanguage? | FallbackBadge? | Required? | Renderer lines |
|---|---|---|---|---|---|
| Lesson number badge | `id` | no | no | **required** (`number`) | 204 |
| Title (primary) | `title.en` / `title.vi` via `pick` | yes (unless `dualTitle`) | **yes** (unless `dualTitle`) | **both required** (`string`) | 210–217 |
| Title subtitle line | `title.en` | only shown when `dualTitle` | no | — | 227–229 |
| Title native | `title.native` | **no** (target text) | no | optional | 230–238 |
| Title romanization | `title.romanization` | **no** (target text) | no | optional | 233–237 |
| CEFR pill | `level` (label localized by `cefrPillLabel(level, uiLanguage)`) | label only (chrome) | no | **required** (`CefrLevel`) | 218–222 |
| Count chips | array `.length` + `RENDERER_LABELS[uiLanguage]` | units only (chrome) | no | — | 241–264 |
| Intro | `pick(introEn, introVi)` then `?? intro` (legacy) | yes (`introEn`/`introVi`) | **yes** — *but never for legacy `intro`* | all optional; `intro` `@deprecated` | 284–301 |
| Sentence — native | `sentences[].native` | **no** (target text) | no | array **required** (may be empty); `native` required | 323–325 |
| Sentence — romanization | `sentences[].romanization` | **no** | no | optional | 327–331 |
| Sentence — gloss | `pick(s.en, s.vi)` | yes | **NO** (intentional, #523) | optional | 337–344 |
| Sentence — pronunciation focus | `pick(s.pronunciationFocusEn, s.pronunciationFocus)` — `string[]`, joined `" · "` | yes | **YES** | optional | 345–369 |
| Sentence — note | `sentences[].note` | **no** (as-authored) | no | optional | 370–374 |
| Vocab — native | `vocabulary[].native` | **no** (target text) | no | array optional; `native` required | 400–402 |
| Vocab — romanization | `vocabulary[].romanization` | **no** | no | optional | 403–407 |
| Vocab — gloss | `pick(v.en, v.vi)` | yes | **NO** | optional | 408–413 |
| Vocab — phonetic | `pick(v.phoneticEn, v.phonetic)` | yes | **NO** | optional | 414–421 |
| Dialogue — speaker | `dialogue[].speaker` | **no** | no | array optional; `speaker` required | 766–768 |
| Dialogue — native | `dialogue[].native` | **no** (target text) | no | required | 769 |
| Dialogue — romanization | `dialogue[].romanization` | **no** | no | optional | 770–774 |
| Dialogue — gloss (short) | `pick(d.en, d.vi)` | yes | **NO** (`showFallbackBadge=false` for short) | optional | 775–794 |
| Dialogue — gloss (long) | `pick(d.en, d.vi)` | yes | **YES** (`showFallbackBadge=true` for long) | optional | 775–794 |
| Dialogue long | `dialogueLong[]` (opt-in toggle, **no audio**) | per-line, as above | yes (long) | optional | 463–479 |
| Exercise — fill-blank | `question`, `answer` shown; hint `pick(hintEn, hint)` | hint swaps | **NO** | array optional | 662–677 |
| Exercise — matching | `pairs[].a/.b` shown; instruction `pick(instructionEn, instruction)` | instruction swaps | **NO** | — | 680–698 |
| Exercise — translation | prompt `pick(ex.en, ex.vi)`; `native` (+ `romanization`) shown as answer | prompt swaps | **NO** | `vi` required, `en` optional | 700–717 |
| Cultural notes | `pick(culturalNotesEn, culturalNotesVi)` | yes | **YES** (badge by heading) | optional | 504–524 |
| Tip / advice | `pick(tipAdviceEn, tipAdviceVi)` | yes | **YES** (badge by heading) | optional | 526–546 |
| Register notes | `pick(registerNotesEn, registerNotesVi)` — italic meta-note | yes | **YES** (badge in label) | optional | 548–573 |
| Roleplay prompts | `pick(roleplayPromptsEn, roleplayPromptsVi)` — `string[]`, bullet list | yes | **YES** (badge by heading) | optional | 575–611 |
| Idiom — idiom | `idiomGlosses[].idiom` | **no** (target text) | no | array optional; `idiom`/`literal`/`meaning` required | 841–843 |
| Idiom — literal | `pick(g.literalEn, g.literal)` | yes | no (badge is meaning-only) | `literal` required, `literalEn` optional | 826, 852–856 |
| Idiom — meaning | `pick(g.meaningEn, g.meaning)` | yes | **YES** (the *only* idiom badge) | `meaning` required, `meaningEn` optional | 827, 857–864 |
| Idiom — example | `pick(g.exampleEn, g.example)` | yes | no | optional | 828, 865–867 |
| Grammar | `grammar[].point` / `.explanation` | **no** (as-authored, single language) | no | array optional; both fields required | 624–642 |
| Audio | `audioBase`, `audioKinds` (drives `LessonAudioButton`) | n/a (not text) | n/a | both optional | 311–322, 389–398 |

### FallbackBadge — fires vs. silent

- **Fires** (preferred lang missing → other shown → muted `VI`/`EN` pill): title (non-`dualTitle`), intro (non-legacy), sentence `pronunciationFocus`, cultural notes, tip/advice, register notes, roleplay prompts, idiom **meaning line only**, `dialogue_long` gloss.
- **Silent `pick()` (no badge, by design #523):** sentence gloss, vocab gloss, vocab phonetic, **short** dialogue gloss, exercise hint/instruction/translation prompt, idiom literal/example, grammar (no `pick` at all).

The asymmetry is intentional and worth internalizing: the *gloss* of a target sentence/word is duplication-prone (the target text + romanization are the lesson), so a missing-language gloss degrades silently. `pronunciationFocus` is genuinely audience-specific pedagogy, so its fallback is surfaced.

---

## 3. Single-language rule (#523)

**Promise:** the global VI/EN toggle shows **only the active language**. A user who wants the other language switches modes; the renderer never shows both side by side.

Implemented via `pick()` everywhere (one value, never both):

- **Before #523:** sentence gloss rendered *both* `s.en` and `s.vi` (one as primary, one as muted secondary); the title always showed `title.vi` as primary plus `title.en` as a subtitle line for every module.
- **After #523:** sentence/vocab/dialogue glosses are a single `pick()`. Title is a single `pick(uiLanguage, title.en, title.vi)` with a `FallbackBadge`.

**`dualTitle` is the only exception, and it is NOT bilingual duplication.** It is set *only* by `VietnameseLessonsPage` (`src/pages/languages/VietnameseLessonsPage.tsx:170`). On that page `title.vi` holds the English lesson title and `title.en` holds an English *subtitle/description* — both are the learner's language (English-speaking learners of Vietnamese), so collapsing to one would drop the subtitle. With `dualTitle=true`: `title.vi` renders as primary, `title.en` as the secondary line, and **no FallbackBadge** is computed. Every other caller leaves `dualTitle=false`.

`FallbackBadge` is the safety valve of this rule: when single-language display would show content that isn't actually in the user's selected language (because the authored version for that language is missing), the muted `VI`/`EN` pill admits it rather than silently misleading the learner — for the prose/pedagogy surfaces only (see §2).

Smoke tests: `src/components/languages/__tests__/singleLanguageRender.smoke.test.tsx` and `uiLanguageToggle.smoke.test.tsx` guard this.

---

## 4. Pronunciation-focus structure (#520 / #521)

```ts
// NormalizedSentence
pronunciationFocus?: string[];    // hints calibrated for Vietnamese-speaker learners
pronunciationFocusEn?: string[];  // hints calibrated for English-speaker learners — independent sibling
```

- **It is an array of short strings**, not prose. The renderer joins with `" · "` and prefixes a `Volume2` icon (`LessonRenderer.tsx:345–369`).
- `pick(uiLanguage, pronunciationFocusEn, pronunciationFocus)`; renders nothing if the picked array is empty/absent.
- **`FallbackBadge` fires** here (unlike the sentence gloss): pronunciation focus is audience-specific pedagogy, so a language fallback is surfaced.
- Normalizer source field (all of ko/ja/zh/fr/de): `pronunciation_focus` → `pronunciationFocus`, `pronunciation_focus_en` → `pronunciationFocusEn`. **Spanish maps `pronunciationFocus` only** (`s.pronunciation_focus`, no `_en`).
- **#520** authored VI `pronunciation_focus` for Japanese A1; **#521** for Chinese A1 (filling the inverse of the #519 EN-mode gap — these modules had EN-calibrated content but no VI).

Authored content examples:
- VI: `["Bật hơi ở 'k' đầu câu", "Thanh điệu xuống ở cuối"]`
- EN: `["Aspirate the initial 'k'", "Falling tone on the final syllable"]`

---

## 5. Idiom subfield contract (#502)

`NormalizedIdiomGloss` (`LessonRenderer.types.ts:96–107`), rendered by `IdiomGlossList` as an inline accordion (collapsed = idiom; expanded = literal / meaning / example). Tooltips were rejected in #496 §7 as mobile-hostile at 375 px.

| Subfield | Type | Required | `pick` pair | Badge |
|---|---|---|---|---|
| `idiom` | `string` | **required** | none — target text, verbatim | no |
| `literal` / `literalEn` | `string` / `string?` | `literal` required | `pick(literalEn, literal)` | no |
| `meaning` / `meaningEn` | `string` / `string?` | `meaning` required | `pick(meaningEn, meaning)` | **YES — the only idiom badge** |
| `example` / `exampleEn` | `string?` / `string?` | optional | `pick(exampleEn, example)` | no |

The single `fallback` is computed once from `isFallback(uiLanguage, g.meaningEn, g.meaning)` and rendered next to the **meaning** line only (`LessonRenderer.tsx:829, 860–862`). literal/example fall back silently.

**Per-language source:** ko/ja/zh/fr/de map `idiom_glosses[]` 1:1 incl. `literal_en`/`meaning_en`/`example_en`. **Spanish has a different shape** (`normalize.ts:152–157`): `meaning ← g.figurative`, `example ← g.usage`, and **no `*En` siblings** (Spanish is English-source; base slots already hold English).

`literal` is rendered italic/muted, `meaning` as the primary line, `example` italic/muted. Examples:
- VI: idiom `"水到渠成"`, literal `"nước đến thì kênh thành"`, meaning `"thuận theo tự nhiên thì việc sẽ thành"`
- EN: literal `"when the water arrives, the channel forms"`, meaning `"things fall into place when conditions are ripe"`

**#501** was the register-notes pilot; **#502** added Chinese C1 `roleplay_prompts_en` + idiom `*_en` (the deferred-field follow-up).

---

## 6. Register-notes contract (#501)

```ts
registerNotesVi?: string;  // register / tone meta-advice for Vietnamese-speaker learners
registerNotesEn?: string;  // independent sibling for English-speaker learners
```

- Rendered as a **small italic meta-note**, not a card (per the #496-locked decision), under the tip card (`LessonRenderer.tsx:548–573`).
- `pick(uiLanguage, registerNotesEn, registerNotesVi)`; **`FallbackBadge` fires**, rendered *inside* the uppercase "Register"/"Văn phong" label span (not after the heading like cultural/tip).
- Normalizer source: `register_notes` → `registerNotesVi`, `register_notes_en` → `registerNotesEn` (ko/ja/zh/fr/de). **Spanish:** `registerNotesEn ← lesson.register_note` (no Vi; English-source).
- **#501** was the pilot — Chinese C1 `register_notes_en` batch 1.

Example — VI: `"Đây là văn phong trang trọng; tránh dùng với bạn bè."` · EN: `"This is formal register — avoid it with close friends."`

---

## 7. Roleplay-prompts contract (#502)

```ts
roleplayPromptsVi?: string[];  // speaking-practice prompts for Vietnamese-speaker learners
roleplayPromptsEn?: string[];  // independent sibling for English-speaker learners
```

- **Array of prompt strings.** Rendered as a bulleted list in an indigo ("speaking" family) card (`LessonRenderer.tsx:575–611`). **No interactivity is wired** — it is a static practice card.
- `pick(uiLanguage, roleplayPromptsEn, roleplayPromptsVi)`; renders nothing if the picked array is empty/absent. **`FallbackBadge` fires** next to the heading.
- Normalizer source: `roleplay_prompts` → `roleplayPromptsVi`, `roleplay_prompts_en` → `roleplayPromptsEn` (ko/ja/zh/fr/de). **Spanish:** `roleplayPromptsEn ← lesson.roleplay_prompts` (no Vi).
- **#502** added Chinese C1 `roleplay_prompts_en`.

Example — VI: `["Đóng vai khách hàng phàn nàn về món ăn", "Xin lỗi và đề nghị giải pháp"]` · EN: `["Play a customer complaining about a dish", "Apologize and offer a solution"]`

---

## 8. Target-language preservation — never collapsed, never badged

These carry the **language being learned** (or as-authored content) and are completely independent of `uiLanguage`. They never go through `pick()`, never collapse, never get a `FallbackBadge`. They *are* the lesson:

| Field | What it holds | Per-language source (`native`/equivalent) |
|---|---|---|
| `sentences[].native` | target sentence | ko `s.korean` · ja `e.japanese` · zh `s.chinese` · **fr `s.en`** · **de `s.en`** · es `s.spanish` |
| `sentences[].romanization` | target reading | ko `s.romanized` · zh `s.pinyin` · es `s.pronunciation` (ja/fr/de: none) |
| `vocabulary[].native` | target word | ko `v.hangul` · ja `v.japanese` · zh `v.chinese` · fr/de `v.word` · es `formatVocabWord(v.word, v.gender)` (appends `(m)`/`(f)`/`(m/f)`/`(n)`) |
| `vocabulary[].romanization` | target reading | zh `v.pinyin` (others: none) |
| `dialogue[].native` | target line | ko `d.hangul ?? d.text_ko` · ja `d.japanese` · zh `d.chinese` · fr/de `d.text` · es `d.spanish` |
| `dialogue[].romanization` | target reading | zh `d.pinyin` · es `d.pronunciation` |
| `title.native` / `.romanization` | target title + reading | **zh only** (`lesson.title` chars, `lesson.pinyin`) |
| `idiomGlosses[].idiom` | the idiom in target language | as-authored |
| `grammar[].point` / `.explanation` | grammar, single language as authored | ja `lesson.grammar` passthrough · es `normalizeSpanishGrammar` (examples appended into `explanation`) |

> **Trap:** French and German put the *target-language* content in `s.en` (legacy field name) — `native: s.en` in `french/normalize.ts:33` and `german/normalize.ts:32`. This is the most counter-intuitive aliasing in the codebase. The renderer never sees it; it only sees `NormalizedSentence.native`.

### Per-language gloss/sibling presence cheat-sheet

| Module | sentence `vi` | sentence `en` | `*En` siblings authored | `uiLanguage` at call site | Notes |
|---|---|---|---|---|---|
| Korean | `s.vi` | `s.en` | cultural/tip/register/roleplay/idiom `_en` | page toggle | short-dialogue `vi = text_vi ?? meaning` (post-#514, ×544 `text_vi` authored) |
| Japanese | — (none) | `e.english` | `_en` siblings | page toggle | no sentence `vi`, no romanization; has `grammar` |
| Chinese | `s.vi` | `s.english` | `_en` siblings | page toggle | full romanization (pinyin) everywhere; `title.native`/`romanization` |
| French | `s.vi` | — (`s.en` is the target!) | `_en` siblings | page toggle | exercises have two shapes (nested 1-20 / flat 21-50) |
| German | `s.vi` | — (`s.en` is the target!) | `_en` siblings | page toggle | `dialogue_long` has no `en` (Incidental G, #496) |
| Spanish | — (none) | `s.english` | base slots hold EN; **no `*En`** | **`"en"` hard-coded** | English-source; idiom shape remapped; `grammar` via `normalizeSpanishGrammar` |
| Vietnamese-for-foreigners | n/a | n/a | n/a | n/a — **`dualTitle`** | English-source; `title.vi`=EN title, `title.en`=EN subtitle |

---

## 9. Drift catch — code vs. existing comments

Audited the in-file doc comments against current code on `origin/main @ 29bc2b75`. Four divergences found. **All are comment-only and low-risk; none affect runtime.** A small comment-only PR is recommended (see below).

**D1 — Stale section list in `LessonRenderer.tsx` header (lines 8–20).**
The header enumerates `header / stats / intro / sentences / vocab / dialogue / exercises / cultural / tip / grammar` and stops at `grammar`. The actual render order (lines 504–642) is `… cultural → tip → register → roleplay → idiom → grammar`. **`register`, `roleplay`, and `idiom` sections are missing entirely** — they were added by #499/#501/#502 and the header was never updated. Re-deriving the render order from this comment would be wrong.

**D2 — "5 language module(s)" is stale.**
`LessonRenderer.tsx:3` ("used by all 5 language module pages") and `LessonRenderer.types.ts:4` ("All 5 language modules normalize…"). There are **7 normalizers** (`src/languages/{korean,japanese,chinese,french,german,spanish,vietnamese}/normalize.ts`) and **7 page callers**. The count became wrong when Spanish (the 6th, English-source) and Vietnamese-for-foreigners (the 7th, `dualTitle`) were added.

**D3 — `DialogueLineRows` rationale comment is stale post-#514/#529 (the important one).**
`LessonRenderer.tsx:738–743` justifies `showFallbackBadge=false` for short dialogue with: *"the Korean short-dialogue normalizer puts English in the vi-named slot for **all 151 lessons**."* Post-#514 the Korean normalizer is `vi: d.text_vi ?? d.meaning` (`korean/normalize.ts:50`) and #514 authored `text_vi` for ~544 dialogue lines. **For authored lines `vi` is now genuine Vietnamese, not English** — "all 151 lessons" is no longer true. #529 already corrected the *equivalent* comments inside `korean/normalize.ts` ("post-#514") but did **not** propagate the fix to this downstream comment in the renderer. The `showFallbackBadge=false` decision itself is still defensible (lines lacking `text_vi` still fall back to English `meaning`, which a badge would mislabel as "vi"), but the stated reason is factually outdated. This is exactly the re-derivation hazard this doc exists to prevent.

**D4 — Header line 14 predates #523.**
`LessonRenderer.tsx:14`: *"sentences: slate card; native + romanization + en + vi + focus chips + note"*. Post-#523 the sentence card renders a **single** gloss (`pick(s.en, s.vi)`), not `en + vi`. Minor, but consistent with D1/D3 — the header block as a whole predates the #499/#523 expansion.

### Recommended fix (comment-only PR — Phase 2)

A single comment-only commit on this branch addresses D1–D4 with zero behavior change:
- `LessonRenderer.tsx` header: add `register / roleplay / idiom` to the section list in render order; fix line 14 to "single gloss (pick en/vi)"; fix the "5 … pages" count.
- `LessonRenderer.tsx:738–743`: rewrite the `showFallbackBadge` rationale to reflect `vi = text_vi ?? meaning` (badge stays off because un-authored lines still fall back to English `meaning`).
- `LessonRenderer.types.ts:4`: fix the "All 5 language modules" count.

`grammar` is **not** Japanese-specific (Spanish emits it via `normalizeSpanishGrammar`); the header line 20 "(Japanese-specific)" parenthetical should also be dropped — folded into the same commit.

---

## Appendix — `NormalizedLesson` required vs. optional (type contract)

From `LessonRenderer.types.ts:119–179`:

**Required:** `id: number`, `level: CefrLevel`, `title: { vi: string; en: string; native?; romanization? }`, `sentences: NormalizedSentence[]` (the array is required; may be empty).

**Optional:** `intro` *(`@deprecated`, language-agnostic, never badged)*, `introVi`, `introEn`, `vocabulary[]`, `dialogue[]`, `exercises[]`, `culturalNotesVi/En`, `tipAdviceVi/En`, `grammar[]`, `registerNotesVi/En`, `roleplayPromptsVi/En`, `idiomGlosses[]`, `dialogueLong[]`, `audioBase`, `audioKinds`.

`CefrLevel = "A1" | "A1+" | "A2" | "B1" | "B2" | "C1" | "C2"`.

Within sub-records: `NormalizedSentence.native`, `NormalizedDialogueLine.{speaker,native}`, `NormalizedVocabEntry.native`, `NormalizedIdiomGloss.{idiom,literal,meaning}`, `NormalizedGrammarPoint.{point,explanation}`, `NormalizedExerciseTranslation.{vi,native}`, `NormalizedExerciseFillBlank.{question,answer}` are required; everything else in those records is optional.

`NormalizedAudioKinds`: `sentence?: "sentence" | "phrase"`, `dialogue?: "dialogue_short" | "dialogue_vi"` — set at the normalizer boundary so the renderer stays field-name-pure (Vietnamese-for-foreigners uses `phrase`/`dialogue_vi`; the other six default to `sentence`/`dialogue_short`).
