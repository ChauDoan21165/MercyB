# Renderer Expansion Scoping Proposal

**Status:** Decision document — Chau decides once. No code/content changes in this PR.
**Audit baseline:** `origin/main` HEAD `84d03a7c` (#493). Includes #485–#488, #490–#493.
**Author:** renderer-expansion-scoping-agent · documentation-only

---

## 0. TL;DR for the decision

Across 7 languages and 6 CEFR levels (**1,398 lessons**), the campaign has authored a large body of pedagogy fields that **never reach the screen**. The renderer is a clean 3-layer pipeline (contract → per-language normalizer → field-name-pure renderer). Surfacing a deferred field means changing exactly 3 places, and the per-language *raw* types **already declare every deferred field** — so the work is normalizer-mapping + one renderer section per field, **not** type surgery.

**The single most important finding (honest reconciliation):** of the 9 deferred field types the brief listed, only **4 are real "dead-data" with authored content** worth unlocking: `register_notes`, `roleplay_prompts`, `idiom_glosses`, `dialogue_long`. The other 5 (`intro_en`, `chinese_traditional`, `tone_notes_en`, `character_notes_en`, dialogue-line `pronunciation_focus_en`) **do not exist in any source file** — they would be net-new authoring projects, not render-path unlocks. Spending renderer effort on them now would itself be the dead-data failure mode inverted.

Top 3 recommendations (detail in §8–§9):

1. **Ship a #457-style schema-only PR first** (extend `NormalizedLesson` only; type-only, additive, zero runtime risk). Precedent: commit `95588464` was *1 file, +35 lines*.
2. **Pilot `idiom_glosses`** as the first surfaced field — highest pedagogical value per unit cost, present in 6 languages, structured (not free prose), already has authored `_en` sub-fields in French (`literal_en`/`meaning_en` ×317) and German (`meaning_en`/`example_en` ×294/138).
3. **Defer `intro_en` and the three Chinese/Japanese-specific fields** — they are not dead-data; treat as separate authoring dispatches only if Chau wants the content to exist at all.

---

## 1. Method

Per the brief's "read the source, do not guess" rule:

- **Exact lesson data:** every `src/languages/<lang>/lessons-<level>.ts` (42 files) was evaluated through the project's own `tsx` runtime (`/tmp/dump_lessons.mjs`) — not regex — so all counts below are exact, not approximate. A pure-regex first pass under-counted Spanish/Vietnamese (non-JSON TS literals); the `tsx` evaluation eliminated that error class.
- **Types:** all 7 `src/languages/<lang>/lessons.ts` raw types + the shared contract `src/components/languages/LessonRenderer.types.ts`.
- **Mapping:** all 7 `src/languages/<lang>/normalize.ts`.
- **Render:** `src/components/languages/LessonRenderer.tsx` (587 lines) + `LessonAudioButton.tsx`, and the wiring (`LanguageLessonsView.tsx`, page modules).
- **History:** `git log/show` for the contract-evolution PRs (#427, #457, #460, #461, #462).

All line refs below were read at HEAD `84d03a7c` and are cited verbatim.

---

## 2. The render-path architecture (the 3 places any field must touch)

The renderer is deliberately a clean pipeline. From `LessonRenderer.tsx:1-6`:

> *Field-name-pure: takes a NormalizedLesson + LessonTheme. Per-language field-name aliasing happens at the normalizer boundary, NOT here — no `s.en ?? s.english` fallback chains, no `isKorean(lang)` branching.*

```
raw <Lang>Lesson           per-language normalize.ts            shared renderer
(src/languages/<l>/   ──►   normalize<Lang>Lesson(): ──────►    LessonRenderer.tsx
 lessons.ts + data)         NormalizedLesson                    (field-name-pure)
        │                          │                                   │
   already declares          maps raw → contract              renders contract fields
   deferred fields           (the gap is here)                (one section per field)
```

**Layer 1 — the contract** `src/components/languages/LessonRenderer.types.ts:101-133`. `NormalizedLesson` currently exposes, as pedagogy: `intro?` (110, single string, **no Vi/En split**), `culturalNotesVi?/En?` (116-119), `tipAdviceVi?/En?` (121-124), `grammar?` (125). **There is no `registerNotes`, `roleplayPrompts`, `idiomGlosses`, `dialogueLong`, or `introEn` on the contract.** Sub-types: `NormalizedSentence` (17-28, has `pronunciationFocus?`/`pronunciationFocusEn?`), `NormalizedDialogueLine` (42-48, **no pronunciation fields**), `NormalizedVocabEntry` (30-40).

**Layer 2 — the normalizers.** Each maps a subset of raw fields to the contract. The deferred fields are explicitly *not* mapped — most bluntly documented in `spanish/normalize.ts:18-21`:

> *dialogue_long, roleplay_prompts, register_notes, idiom_glosses, regional_variants are NOT emitted to the normalized shape — they aren't part of the shared NormalizedLesson contract yet. Raw data persists in Supabase for a future contract extension.*

**Layer 3 — the renderer.** `LessonRenderer.tsx` renders exactly: header (160-227), intro card (234-240), sentences (242-327), vocab (329-376), dialogue (378-424), exercises (426-445), cultural card (447-467), tip card (469-489), grammar card (491-509). The bilingual machinery is `pick()` (116-118), `isFallback()` (122-124), `FallbackBadge` (126-132). **No section exists for any deferred field.**

**Key sizing finding:** the per-language *raw* types already declare every deferred field — `spanish/lessons.ts:217,222-225`, `german/lessons.ts:165-170`, `french/lessons.ts:131-136`, `chinese/lessons.ts:125-128`, `japanese/lessons.ts:72-75`, `korean/lessons.ts:84-87`. So expansion needs **no per-language `lessons.ts` edits** — only (1) extend `NormalizedLesson`, (2) add normalizer mapping lines, (3) add a renderer section. The cost is lower than the brief's framing implies.

---

## 3. Lesson inventory (exact, tsx-evaluated)

| Language | A1 | A2 | B1 | B2 | C1 | C2 | **Total** |
|---|--:|--:|--:|--:|--:|--:|--:|
| Spanish | 14 | 15 | 20 | 25 | 20 | 15 | **109** |
| German | 20 | 10 | 15 | 46 | 40 | 20 | **151** |
| French | 20 | 10 | 15 | 46 | 40 | 20 | **151** |
| Chinese | 15 | 15 | 15 | 44 | 40 | 20 | **149** |
| Japanese | 15 | 15 | 15 | 46 | 40 | 20 | **151** |
| Korean | 15 | 15 | 15 | 46 | 40 | 20 | **151** |
| Vietnamese | 96 | 50 | 250 | 40 | 50 | 50 | **536** |
| **All** | | | | | | | **1,398** |

Vietnamese is the L1-source module: a different schema (`phrases` not `sentences`, singular `cultural_note`/`tip`/`intro`, no `_vi`/`_en` split — `vietnamese/normalize.ts:38-39` maps to the `*Vi` slots only). It is not a translation target and is excluded from the deferred-field analysis except where noted.

---

## 4. Per-field inventory across all 7 languages

Counts = lessons (all levels combined) carrying the *raw* field. "En authored" = a populated `_en` sibling (or `_en` sub-keys) already in source. "Normalizer" = mapped in `normalize.ts`. "Renderer" = has a UI surface.

### 4.1 Lesson-level pedagogy fields

| Field | ES | DE | FR | ZH | JA | KO | En authored? | Normalizer? | Renderer? |
|---|--:|--:|--:|--:|--:|--:|---|---|---|
| `cultural_notes_vi` | —¹ | 151 | 151 | 73 | 95 | 95 | DE 151, FR 141, ZH/JA/KO 30/30/54² | ✅ all 6 (`*/normalize.ts`) | ✅ blue card `LessonRenderer.tsx:447-467` |
| `tip_advice_vi` | —¹ | 151 | 151 | 73 | 95 | 95 | DE 151, FR 141, ZH/JA/KO 30/30/54² | ✅ all 6 | ✅ amber card `:469-489` |
| `intro` / `intro_vi` | 103 (`intro`) | 0 | 0 | 0 | 0 | 151 (`intro_vi`) | **none** | partial: ES `:117`, KO `:27`, VI `:25` | ⚠️ mono-lingual card `:234-240` (no `pick()`) |
| `register_notes` | 1 (`register_note`) | 95 | 99 | 83 | 95 | 85 | **DE 85, FR 94** | ❌ none | ❌ none |
| `roleplay_prompts` | 0 | 75 | 89 | 73 | 87 | 85 | **FR 84** | ❌ none | ❌ none |
| `idiom_glosses` | 1 | 75 | 89 | 73 | 83 | 84 | **FR `literal_en`/`meaning_en` ×317, DE `meaning_en` ×294 / `example_en` ×138** | ❌ none | ❌ none |
| `dialogue_long` | 0³ | 75 | 89 | 73 | 85 | 85 | FR `en` ×1048, KO `vi` ×1275 | ❌ none | ❌ none |
| `regional_variants` | 16 | 0 | 0 | 0 | 0 | 0 | none (`latam`/`peninsular`/`meaning`/`note`) | ❌ none | ❌ none |
| `grammar` | 90 | 0 | 0 | 0 | 50 | 0 | n/a | ✅ ES `:91-105`, JA passthrough `:43` | ✅ violet card `:491-509` |

¹ Spanish uses singular `cultural_note`/`tip` (`spanish/lessons.ts`) → mapped straight into the **En** slots (`spanish/normalize.ts:142-143`) because the Spanish module is English-source (`uiLanguage="en"`). So Spanish *does* render culture/tip, just via a different raw field name.
² Korean `cultural_notes_en` = 54 at this HEAD (C1 40 + C2 14). The remaining 41 are in **PR #489 (Korean B2), which is OPEN, not merged** — see Incidental Findings F. Korean `cultural_notes_vi` = 95 (B2 41 + C1 40 + C2 14).
³ Spanish `dialogue_long` is declared (`spanish/lessons.ts:217`) but populated in 0 lessons at this HEAD.

### 4.2 Sentence/example-level (`pronunciation_focus`)

`pronunciationFocus`/`pronunciationFocusEn` on `NormalizedSentence` **is fully wired and rendered** (`LessonRenderer.tsx:294-318`, `pick()` + fallback badge). Authored `_en` at sentence/example level:

Exact counts in the sentence/example container (the one `NormalizedSentence` maps from):

| | ES | DE | FR | ZH | JA¹ | KO |
|---|--:|--:|--:|--:|--:|--:|
| `pronunciation_focus` (raw) | 249 | 711 | 723 | 434 | 60 | 140 |
| `pronunciation_focus_en` (raw) | 0 | 711 | 673 | 150 | 94 | 140 |

¹ Japanese uses the `examples` container (`japanese/normalize.ts:27-32`), not `sentences`. (German/French also carry `pronunciation_focus(_en)` inside `exercises` — DE 388/61, FR 45/45 — but those route through the exercise path, not the sentence row.) This is the *only* deferred-type item from the brief that is already a solved render path. No action needed except continued authoring (out of this brief's scope).

### 4.3 Dialogue-line `pronunciation_focus_en` (brief item) — **does not exist**

`NormalizedDialogueLine` (`LessonRenderer.types.ts:42-48`) has no pronunciation field, and **no `<dialogue>` or `<dialogue_long>` container in any of the 7 languages carries `pronunciation_focus` / `pronunciation_focus_en`** (verified across all nested schemas). This brief item is net-new authoring + a contract change, not a dead-data unlock.

### 4.4 Chinese-/Japanese-specific brief items — **do not exist**

`chinese_traditional`, `tone_notes` / `tone_notes_en`, `character_notes` / `character_notes_en` appear in **zero** source files. Chinese vocab is `{chinese, english, pinyin, vi}` (`chinese/lessons.ts`; `chinese/normalize.ts:42-47`) — no traditional-character field. Japanese vocab is `{japanese, english}` only (`japanese/normalize.ts:33-36`) — no character-notes field. These are not deferred *data*; they are unbuilt *features*. Reported honestly per Hard Rule 11.

---

## 5. Honest reconciliation: brief list vs. source reality

| Brief-listed deferred type | Reality | Verdict |
|---|---|---|
| `register_notes_en` | Raw `register_notes` in 5 langs; `_en` authored DE 85 / FR 94 | **Real dead-data — unlock** |
| `roleplay_prompts_en` | Raw in 5 langs; `_en` authored FR 84 | **Real dead-data — unlock** |
| `idiom_glosses_en` | Raw in 6 langs; `_en` sub-fields authored FR 317 / DE 294 | **Real dead-data — unlock (highest value)** |
| `dialogue_long_en` | Raw in 5 langs; FR has `en` ×1048, KO `vi` ×1275 | **Real dead-data — unlock** |
| `intro_en` | `intro_vi` exists Korean-only (151); **no `intro_en` anywhere**; intro renders mono-lingually | Net-new authoring + render change |
| `chinese_traditional` | Not in any file | Net-new feature, not dead-data |
| `tone_notes_en` | Not in any file | Net-new feature, not dead-data |
| `character_notes_en` | Not in any file | Net-new feature, not dead-data |
| dialogue-line `pronunciation_focus_en` | Not in any file | Net-new feature, not dead-data |

So the renderer-expansion question is really about **4 fields**, plus a separate decision on whether to author `intro_en` and the 3 net-new field types at all.

---

## 6. Per-field render-path proposal (the 4 real ones + intro)

For each: required `NormalizedLesson` extension, normalizer mapping, renderer surface, field level, cross-language consistency.

### 6.1 `idiom_glosses` → `idiomGlosses?` *(recommended pilot)*

- **Contract:** add `idiomGlosses?: NormalizedIdiomGloss[]` to `NormalizedLesson` (after line 125), plus a new sub-type `NormalizedIdiomGloss = { idiom: string; literal: string; meaning: string; example?: string; literalEn?: string; meaningEn?: string; exampleEn?: string }`.
- **Cross-language consistency:** shapes nearly agree — FR/DE/ZH/JA/KO all `{idiom, literal, meaning, example}` (Chinese `chinese/lessons.ts:128`, Japanese `:75`, Korean `:87`); FR adds `literal_en`/`meaning_en`, DE adds `meaning_en`/`example_en`. Normalizer absorbs the variance (field-name purity). Spanish's is a different shape (`{idiom, figurative, literal, usage}`, only 1 lesson) — map `figurative→meaning`, `usage→example`.
- **Normalizer:** one `.map()` line per `normalize.ts` (6 langs) — e.g. `idiomGlosses: lesson.idiom_glosses?.map(g => ({...}))`.
- **Renderer:** one new card after the tip card (`:489`), same `pick()`/`FallbackBadge` pattern. Field level: **lesson**.
- **Unlocks:** ~405 lessons; FR/DE already have bilingual sub-fields → real EN value on day one.

### 6.2 `register_notes` → `registerNotesVi?/En?`

- **Contract:** add `registerNotesVi?: string; registerNotesEn?: string` (after 124). String, not array — mirrors `tipAdvice` exactly.
- **Normalizer:** map `register_notes → registerNotesVi`, `register_notes_en → registerNotesEn` (6 langs). Spanish: singular `register_note` (1 lesson) → `registerNotesVi`.
- **Renderer:** one card, identical to the tip card (`:469-489`) with a different heading/icon. Field level: **lesson**.
- **Unlocks:** ~458 lessons; EN authored DE 85 / FR 94 (rest VI-only, fallback badge handles it).

### 6.3 `roleplay_prompts` → `roleplayPromptsVi?/En?`

- **Contract:** add `roleplayPromptsVi?: string[]; roleplayPromptsEn?: string[]` (string array — distinct from the prose fields).
- **Normalizer:** passthrough arrays (6 langs).
- **Renderer:** a card rendering a list; "try this" scenario styling (see §7). Field level: **lesson**.
- **Unlocks:** ~409 lessons; EN authored FR 84 only.

### 6.4 `dialogue_long` → `dialogueLong?`

- **Contract:** reuse `NormalizedDialogueLine[]` — add `dialogueLong?: NormalizedDialogueLine[]` (after 113).
- **Cross-language inconsistency (important):** FR/KO `dialogue_long` lines have `{speaker,text,vi,en}` (FR `en` ×1048); DE has `{speaker,text,vi}` (**no en**); ZH `{speaker,chinese,english,pinyin,vi}`; JA `{speaker,japanese,english}`. The normalizer must alias each to `NormalizedDialogueLine` — non-trivial but exactly the work `dialogue` already does.
- **Renderer:** either a second purple card or a toggle on the existing dialogue card (see §7). Field level: **lesson** (array of lines).
- **Unlocks:** ~407 lessons. Highest raw volume (~5,000 lines) — biggest layout impact.

### 6.5 `intro_en` (NOT dead-data — flagged)

- Today `intro` is **mono-lingual** (`LessonRenderer.types.ts:110` single string; `LessonRenderer.tsx:234-240` no `pick()`). Korean feeds `intro_vi` (`korean/normalize.ts:27`) so Korean intros render **in Vietnamese to English-UI users with no fallback badge** — a latent bilingual-correctness gap (Incidental Finding D).
- To support EN: change contract `intro?` → `introVi?/introEn?` (or add `introEn?`), add `pick()` at `:234-240`, and map in 3 normalizers. **But `intro_en` content does not exist** — this is an authoring dispatch first, render change second. Recommend: fix the mono-lingual *bug* (badge it) regardless; defer `intro_en` content decision.

---

## 7. UI design sketch (prose, no mockups)

- **`register_notes`** — a dedicated card, visually identical to the existing Study-tip card (`LessonRenderer.tsx:469-489`): rounded border, tinted background, uppercase heading + icon, `pick()` + `FallbackBadge`. Suggested heading "Register / Tone" (`vi`: "Văn phong"), a distinct accent (slate or indigo) so it reads as *meta-advice* not content. Prose, so no expand needed.
- **`roleplay_prompts`** — a card with a "Try this" affordance: heading "Practice" / "Luyện nói", each prompt a list row with a speech-bubble icon, slightly indented, in the dialogue (purple) family so learners associate it with speaking. Array → `<ul>`. No tooltip; the prompts are short imperatives.
- **`idiom_glosses`** — *not* inline tooltips (mobile-hostile at 375 px, the app's hard constraint). Use a compact card: each gloss a 2-line block — bold `idiom`, then `literal` (muted) and `meaning` (primary), `example` italic below. EN siblings via `pick()` per sub-field. This is structured data, so a small definition-list layout reads better than prose. High pedagogical value, low layout risk.
- **`dialogue_long`** — **toggle on the existing dialogue card**, not a second card: a "Short / Extended" segmented control in the purple card header; default Short. Rationale: ~5,000 extra lines would otherwise double scroll length on mobile and bury the cultural/tip cards. A toggle keeps the lesson scannable and respects mobile-first.
- **`intro_en`** (if ever authored) — keep the existing amber header card position (`:234-240`); just add `pick()` + badge. No layout change, only language selection.
- **`tone_notes` / `character_notes` / `chinese_traditional`** — not designed here: they have no data. If authored later: `tone_notes`/`character_notes` as a small sub-annotation under the vocab/sentence row (not a card); `chinese_traditional` as a settings-level toggle (Simplified ⇄ Traditional) applied at the normalizer, never a per-row parenthetical (clutter at 375 px).
- **dialogue-line `pronunciation_focus_en`** (if ever authored) — reuse the exact sentence-row treatment (`:294-318`): Volume2 icon, `·`-joined chips, accent color, fallback badge. Consistency over novelty.

---

## 8. Priority ranking

Scored 1 (low) – 5 (high). "Reach" = languages with authored content that benefits.

| Field | Content unlocked | Pedagogical value | Impl. cost | Cross-lang reach | **Priority** |
|---|--:|--:|--:|--:|--:|
| `idiom_glosses` | ~405 lessons | 5 (idioms are high-leverage at B2–C2) | 2 (structured, FR/DE bilingual ready) | 6 langs | **1 — pilot** |
| `register_notes` | ~458 lessons | 4 (register is core C1/C2 skill) | 1 (clone tip card) | 5 langs (EN: DE,FR) | **2** |
| `roleplay_prompts` | ~409 lessons | 4 (speaking practice = outcomes) | 2 (array card) | 5 langs (EN: FR) | **3** |
| `dialogue_long` | ~407 lessons / ~5k lines | 4 (extended input) | 4 (cross-lang shape variance + mobile layout/toggle) | 5 langs | **4** |
| `intro_en` | 0 (no content) | 3 | 3 (contract+render+author) | 1 (KO has `intro_vi` only) | **5 — author first** |
| `chinese_traditional` | 0 | 4 (if targeting TW/HK) | 5 (data + toggle + audio implications) | 1 | **6 — product call** |
| dialogue-line `pron_focus_en` | 0 | 2 | 3 | 0 | **7 — defer** |
| `tone_notes`/`character_notes` | 0 | 3 | 4 | 0 | **8 — defer** |

---

## 9. Risk surface

`NormalizedLesson` is a **central shared contract touching all 7 language modules and the side-panel** (`LanguageLessonsView.tsx`, routed through it by #460). All proposed contract changes are **additive optional fields** — the #457 precedent (`95588464`, *1 file, +35 lines, "type-only, additive"*) proves this is a zero-runtime-risk change class: existing normalizers that don't set the new fields stay valid, and the renderer renders nothing when a field is absent (the established `&&` / `pick()→null` pattern). The real risk is concentrated in two places: (1) **`dialogue_long` cross-language shape variance** (DE has no `en`; ZH/JA use different keys) — a normalizer bug there shows wrong/empty text in 5 languages at once, so it needs per-language spot-checks; (2) **mobile layout regression** — `dialogue_long` (~5k lines) and stacked new cards can push the cultural/tip cards far below the fold on 375 px screens, violating the mobile-first non-negotiable, which is why §7 recommends a toggle not a second card. Normalizer changes cannot affect already-merged B2-Phase-2 work because they only *add* output keys; no existing mapping line is modified. No production language page passes the new fields until its normalizer is updated, so rollout is naturally per-language and reversible.

---

## 10. Recommended implementation order

1. **PR-A — Schema-only contract extension** (model: #457 `95588464`). Add the optional fields + sub-types to `LessonRenderer.types.ts` only. Type-only, additive, no normalizer/renderer change. Mergeable instantly, unblocks parallel work, zero risk. *Also fold in the `intro` mono-lingual badge fix (Incidental D) if cheap.*
2. **PR-B — Pilot: `idiom_glosses` end-to-end, one language (French).** French has authored `literal_en`/`meaning_en` (×317) so the bilingual path is exercised for real. One normalizer line + one renderer card. Validates the card design on mobile before fan-out.
3. **PR-C — `idiom_glosses` fan-out** to DE/ZH/JA/KO/ES normalizers (renderer already done in PR-B). Pure normalizer PRs, one per language or batched.
4. **PR-D — `register_notes`** (contract already in PR-A): renderer card + 6 normalizer lines. Lowest cost (clones the tip card).
5. **PR-E — `roleplay_prompts`**: array card + normalizer passthrough.
6. **PR-F — `dialogue_long`**: the toggle UI + careful per-language normalizer aliasing + mobile QA. Last because highest layout/QA cost.
7. **Separate track (not renderer expansion):** `intro_en` authoring dispatch; product decision on `chinese_traditional` / tone / character notes.

Rule of thumb honored: **one scope per PR**. Schema-only first means every later PR is small and individually revertible.

---

## 11. Incidental findings (flagged, not fixed — per brief §4)

- **A.** `chinese_traditional`, `tone_notes(_en)`, `character_notes(_en)`, and dialogue-line `pronunciation_focus_en` — listed in the brief as known deferred types — **do not exist in any source file**. Not dead-data; net-new features. (Hard Rule 11: reported, not padded.)
- **B.** **Spanish & Vietnamese use a pre-bilingual schema:** singular `cultural_note`/`tip`/`intro` with no `_vi`/`_en` split (`spanish/lessons.ts:213,222`; `vietnamese/lessons.ts:31`). Spanish works only because `spanish/normalize.ts:142-143` stuffs them into the `*En` slots and the page forces `uiLanguage="en"`. Any future Spanish bilingual story needs a schema migration, not just renderer work.
- **C.** **French `cultural_notes_en`/`tip_advice_en` = 141/151** (10 lessons have `_vi` but no `_en`). Likely B2-chunk gaps. Falls back to VI with badge — cosmetic, but a content TODO.
- **D.** **`intro` renders mono-lingually.** `LessonRenderer.tsx:234-240` has no `pick()`/badge. Korean's `intro_vi` (`korean/normalize.ts:27`) therefore shows **Vietnamese to English-UI users with no fallback indicator** — a real bilingual-correctness gap independent of `intro_en` ever existing. Cheap fix; recommend folding into PR-A.
- **E.** Korean `dialogue` has two shapes (`{hangul,meaning}` ×604 and `{text_ko,text_en,text_vi}` ×60). **Already handled** correctly by `korean/normalize.ts:42-44` — noting for completeness, not a bug.
- **F.** **Audit baseline excludes PR #489.** #489 (Korean B2, 82 fields: `cultural_notes_en`+`tip_advice_en` ×41) is **OPEN, not merged**. At HEAD `84d03a7c` Korean `cultural_notes_en` = 54, not 95. When #489 merges, Korean lesson-level EN coverage rises by 41 each; the inventory deltas in §4.1 should be re-read then. No other counts are affected.
- **G.** German `dialogue_long` lines lack an `en` key entirely (`{speaker,text,vi}`), unlike French/Korean. Confirms the §6.4 / §9 cross-language-variance risk concretely.

---

## 12. Open questions for Chau (only you can answer)

1. **Do `intro_en`, `tone_notes`, `character_notes`, `chinese_traditional` content projects exist on the roadmap at all?** If no, the renderer should not reserve UI for them and this proposal's scope is firmly the 4 dead-data fields.
2. **`dialogue_long` UX:** toggle on the existing dialogue card (recommended, mobile-safe) vs. a separate progression/section? This is a learning-flow call, not a technical one.
3. **Single vs. split implementation PRs:** the recommended order is 6 PRs (schema-only → pilot → fan-out → 3 fields). Acceptable, or do you want fewer/larger PRs?
4. **`idiom_glosses` as the pilot field** — agreed, or do you want `register_notes` first (cheaper, less pedagogical upside)?
5. **Spanish bilingual future (Finding B):** is Spanish-for-English-speakers permanently English-source, or is a `_vi`/`_en` migration on the roadmap? Affects whether normalizers should special-case it long-term.
6. **Should the `intro` mono-lingual badge fix (Finding D) ship now** (folded into the schema-only PR) independent of the larger decision?

*End of proposal. No code or content changed in this PR.*
