# RECON — Generalizing the VI/EN lesson-content schema to an N-native-language axis

**Branch:** `schema-generalize-recon` · **Date:** 2026-05-17 · **Status:** RECON ONLY — no code changed, no PR.
**Coordination check:** `gh pr list --state open` → only #235 (draft, subscription-tracking sync, unrelated). Recent `git log` shows no JA/ZH C2 renumber or normalizer work in flight. **Zero conflict** with this work stream.
**Prior recon:** `RECON-native-lang-picker.md` is **not present in this worktree** (not at root, not in `reports/` or `docs/`). This recon was built bottom-up from current code (source-of-truth hierarchy favors current reality over a missing prior doc). Where the brief cites "recon §6 / §X", findings below are independently re-derived and the relevant claims confirmed against code.

---

## §0 — Executive summary

**What this is about.** Lesson pedagogy prose (cultural notes, tips, intros, register notes, roleplay prompts, glosses, idioms) is stored as hardcoded `*_vi` / `*_en` sibling pairs and selected by a binary `pick(uiLanguage: "vi"|"en", en, vi)` helper. To ever teach a language to a non-Vietnamese native audience (Korean-for-Koreans, etc.), this 2-valued axis must generalize to N native languages. Today only Vietnamese-native exists; the two "EN-native" modules (Spanish, Vietnamese-for-foreigners) already **lie** to the schema to cope.

**Recommended option: C now → B later.**
Ship a thin abstraction (Option C): introduce a `nativeLanguage` plumbing field + one central `getNativeContent()` accessor, route the ~20 pedagogy selection sites through it, hardcode `nativeLanguage='vi'`. Zero behavior change, ~6–10 files, independently green. Defer the full map migration (Option B) behind that seam until a real second native language is greenlit. Option A is rejected (it renames the binary without removing it).

**Total cost (honest).**
- **Recommended path (C, phased):** PR-A ≈ **0.5–1 day** agent + **~1 h** Chau review (pure refactor, behavior-identical). PR-B (fix the two `title.vi` lies + reconcile the 2nd renderer) ≈ **0.5 day** + **~1 h** review. Total ≈ **1–1.5 days / ~2 h review**.
- **Option B big-bang (for comparison):** ≈ **3–5 days** agent + **4–6 h** Chau review (22 files, every normalizer re-verified against the VI/EN/target-language traps documented in §1, all 4 test files rewritten).

**Top-3 risks.**
1. **Suffix-driven migration silently corrupts data.** `register_notes`, `roleplay_prompts`, `idiom_glosses.{literal,meaning,example}` carry **no `_vi` suffix** — the unsuffixed base *is* the implicit Vietnamese. Korean vocab `meaning` (no suffix) = Vietnamese; Korean dialogue `meaning` = English — same key, different language by context. Any mechanical `_vi → _<lang>` rename misses these and mislabels content.
2. **Two renderers, divergent logic.** `LessonRenderer.tsx` (with fallback badges) and `mercy-guide/tabs/LanguageLessonsView.tsx` (inline ternaries, **no** badge) independently reimplement selection. A generalization that touches one and not the other widens an existing behavioral split.
3. **The EN-native modules abuse the schema in *opposite* ways.** Spanish: `title.vi`=English, `title.en`=Spanish-target, pedagogy→`*En` slots, page hardcodes `uiLanguage="en"`. Vietnamese-for-foreigners: `title.vi`=English, `title.en`=English subtitle, pedagogy→`*Vi` slots, relies on the `"vi"` default. Each needs bespoke migration; a uniform rule breaks one of them.

**Go / no-go:** **GO on Option C PR-A** (low risk, fixes the scattered-selection debt, ships the plumbing). **NO-GO on Option B big-bang** until Chau confirms a second native language is actually on the roadmap — see §8.

> **DECISION LOCKED (2026-05-17, Chau):** A second native-language audience **is** on the roadmap within **~2 quarters**. Selected branch: **PR-A now → PR-B → schedule PR-C (Option B map migration) behind the accessor seam.** Option A and "stop after PR-B" are off the table. The accessor seam (PR-A) is now mandatory plumbing, not optional insurance — it converts the eventual N=2 work from a ~2× hacked-then-unwound cost into a single localized change behind `getNativeContent` (see §7).

---

## §1 — VI/EN sibling-field inventory (3 categories)

The selection axis is *which L1 the learner thinks in*. The `_vi`/`_en` pairs are **already an L1-keyed pair hardcoded to 2 values**. But not every `vi`-named slot is L1 pedagogy — three distinct categories:

### Category A — Target-language script sitting in a `vi`/`en`-named slot (legitimate; MUST NOT migrate to the native axis)

| Field | Module | What it holds | Cite |
|---|---|---|---|
| `LessonSentence.en` | French, German | **French / German target text** (e.g. `"en":"Bonjour, je m'appelle Marie."`) — routed to `native`, not `en` | `french/lessons.ts:82`, `french/normalize.ts:32-34`; `german/lessons.ts:89`, `german/normalize.ts:31-32` |
| `title.native` / `title.romanization` | Chinese (`你好`/pinyin) | Target script + romanization in the title object | `chinese/normalize.ts:34-35` |
| `…Translation.{hangul,japanese,chinese}` | KO/JA/ZH | Target-script answer paired with a genuine `vietnamese` prompt | `korean/normalize.ts:98` |

These are orthogonal to native language. A naive suffix migration that touches `en` would corrupt French/German sentences.

### Category B — Mislabeled / the field name lies about its content

| Field | Module | Lie | Cite |
|---|---|---|---|
| `KoreanVocabEntry.meaning` | Korean | Generic name; content is **Vietnamese** gloss; hard-wired `vi: v.meaning`. No `_vi` suffix → invisible to suffix-based detection | `korean/lessons.ts:4-7`, `korean/normalize.ts:44` |
| `KoreanDialogueLine.meaning` vs `text_vi` | Korean | `meaning` = **English** gloss; `text_vi` = the Vietnamese. Residual `vi: d.text_vi ?? d.meaning` leaks English into the VI slot when `text_vi` absent | `korean/lessons.ts:21-29`, `korean/normalize.ts:50` |
| `title.vi` (Spanish) | Spanish | Holds the **English** title; `title.en` holds the **Spanish target** subtitle | `spanish/normalize.ts:116` (verified) |
| `title.vi` / `title.en` (Vietnamese-for-foreigners) | Vietnamese | **Both** hold English (`title_en` and English `subtitle`) | `vietnamese/normalize.ts:21-24` (verified) |
| `…Translation.vi` (Spanish) | Spanish | Receives an **English** prompt (module is L1=English) | `spanish/normalize.ts:82` |
| ZH/JA `title.vi` fallback | Chinese, Japanese | `title_vi ?? topic|title` → **English** in `title.vi` when `title_vi` absent (intentional, test-pinned) | `chinese/normalize.ts:32`, `japanese/normalize.ts:29` |

**The "title.vi lies in 2 modules" — characterized precisely:** the two unconditional liars are **Spanish** (`title:{ vi: lesson.title /*EN*/, en: lesson.subtitle /*Spanish target*/ }`, `spanish/normalize.ts:116`) and **Vietnamese-for-foreigners** (`title:{ vi: lesson.title_en /*EN*/, en: lesson.subtitle /*EN tagline*/ }`, `vietnamese/normalize.ts:22-23`). Both are *EN-native modules* — the lesson title is never Vietnamese because the audience is foreigners. They diverge: Spanish puts the Spanish target string in `title.en` and routes pedagogy into the correctly-named `*En` slots with `uiLanguage="en"` forced; Vietnamese puts an English tagline in `title.en`, routes pedagogy into the **`*Vi`** slots, still uses the deprecated single `intro` slot, and relies on the `"vi"` default. A third *conditional* lie (ZH/JA `title.vi` ← English `topic`/`title` fallback) is benign on the happy path but real.

### Category C — True native-audience pedagogy prose (the actual migration target)

Genuine VI-for-VN-learners text with an EN-audience sibling — these are exactly what a `nativeLanguage` axis generalizes:
`title_vi/title_en`, `intro_vi/intro_en` → `introVi/introEn`, `cultural_notes_vi/_en`, `tip_advice_vi/_en`, `register_notes`/`register_notes_en`, `roleplay_prompts`/`roleplay_prompts_en`, `idiom_glosses.{literal,meaning,example}` + `*_en`, `pronunciation_focus`/`_en`, `pronunciation_vi`/`_en`, `instruction_vi`/`_en`, `NormalizedSentence.vi`, `NormalizedVocabEntry.vi`, `NormalizedDialogueLine.vi`. Contract: `LessonRenderer.types.ts:147-166`.

**Load-bearing-binary hazards (break under N):**
- **Asymmetric naming:** `register_notes`, `roleplay_prompts`, `idiom_glosses.literal/meaning/example` have the **VI base unsuffixed**, only the `_en` sibling suffixed. There is no `_vi` to rename — generalization must treat "unsuffixed base = the default native language," not detect by suffix.
- **`title: { vi, en, native?, romanization? }`** is a fixed 2-slot struct, not a map. It is the single biggest structural blocker — the two title lies are the *symptom* of a contract that was never N-language.
- **`NormalizedSentence.en` is overloaded:** English gloss for KO/ZH/JA, but the *unused* slot for FR/DE (no English sentence gloss exists for those — target text is in `native`, VI gloss in `vi`).
- **Korean vocab `meaning`** (no suffix) must be hand-listed in any migration; heuristics cannot find it.

---

## §2 — Selection-site inventory (pick / uiLanguage)

**One canonical source, confirmed.** `src/contexts/UiLanguageContext.tsx` — localStorage key `"mercyblade.lessonUiLang"` (`:35`), default `"vi"`, exposed via `useUiLanguage()` (`:93-99`), provider mounted once at `main.tsx:545`, single global toggle rendered at `AppRouter.tsx:561`. No route param, no profile field, no competing key. Two intentional overrides: `SpanishLessonsPage.tsx:207` forces `uiLanguage="en"`; `VietnameseLessonsPage.tsx:170` sets `dualTitle` and inherits the `"vi"` default.

**The selection primitive** (`LessonRenderer.tsx:137-153`, verified):
```ts
function pick<T>(uiLang:"vi"|"en", en:T|undefined, vi:T|undefined){ return uiLang==="en" ? (en??vi) : (vi??en); }
function isFallback(uiLang:"vi"|"en", en, vi){ return uiLang==="en" ? !en&&!!vi : !vi&&!!en; }
function FallbackBadge({other}:{other:"vi"|"en"}){ /* muted "vi"/"en" pill */ }
```

**Two renderers reimplement selection independently:**
- `LessonRenderer.tsx` — ~20 `pick()` sites, with `isFallback`+`FallbackBadge`. (titles `:219`; intro `:292`; sentence gloss `:345`; pron-focus `:353`; vocab gloss/phonetic `:416/:422`; cultural `:512`; tip `:534`; register `:558`; roleplay `:585`; exercise hint/instruction/prompt `:670/:688/:708`; dialogue gloss `:793`; idiom `:837-839`.)
- `mercy-guide/tabs/LanguageLessonsView.tsx` — inline `uiLang==="en"?…:…` ternaries, **no fallback badge** (title `:286-288`, sentence gloss `:313`, cultural `:344-346`, tip `:367-369`, vocab `:171-173`). Used by the French/German Mercy-guide tabs only. **Behavioral divergence** the generalization must reconcile.

**Categorization:**
- **UI chrome — stays uiLanguage-tied:** `RENDERER_LABELS[uiLanguage]` (headings/aria/units, `LessonRenderer.tsx:78-131,185`), count chips, CEFR pill, dialogue toggles, all `FallbackBadge` text, page hero/loading/empty strings, `LanguageLessonsView` static blurbs.
- **Lesson pedagogy — must move to the native-language axis:** intro, sentence gloss, pronunciation focus, vocab gloss, vocab phonetic, exercise hint/instruction/prompt, cultural notes, tip advice, register notes, roleplay prompts, dialogue gloss, idiom literal/meaning/example. **Duplicated across both renderers.**
- **Hybrid — Chau decision:** lesson `title` (pedagogy-adjacent; plus the `dualTitle` Vietnamese special-case), French/German **category** titles (`title_en/title_vi`), LanguagesIndex marketing card copy.

**Key conceptual finding:** `uiLanguage` currently conflates **two axes** — chrome language *and* pedagogy-native language. They coincide today only because VN users want VN chrome + VN pedagogy, and the two EN-native modules each pin one end. The whole system "just works" because `uiLanguage` has exactly 2 values, Spanish hardcodes `"en"`, and Vietnamese leans on the `"vi"` default. Splitting these two axes is the *actual* substance of this refactor — not the field rename.

**Normalizer pick-pattern map (7 modules):** Chinese/French/German/Japanese are a **consistent cluster** — identical 8-field `*_vi`/`*_en` pedagogy mapping, no intro slot, English-fallback into `title.vi` only. **Korean** diverges: the only foreign module on modern `introVi/introEn`; residual EN→`vi` short-dialogue leak path. **Spanish** diverges: only `*En` slots populated (all English), English title in `title.vi`, modern `introEn`, page forces `uiLanguage="en"`. **Vietnamese** diverges most: legacy `intro` slot, English content mis-filed into `*Vi` pedagogy slots (the inverse of Spanish's correct convention).

---

## §3 — Schema option comparison

Scored 1 (poor) – 5 (excellent).

| Criterion | A — Rename suffix (`_vi`→`_native` + `nativeLanguage` tag) | B — Pluralize to map (`{ vi, en, ko?… }`) | C — Hybrid (accessor seam, defer schema) |
|---|---|---|---|
| **Migration cost** | 2 — touches contract + 7 normalizers + the asymmetric-unsuffixed bases (`register_notes` etc. have no `_vi` to rename — special-cased anyway); still 2 slots so not actually generalized | 1 — ~22 files: contract reshapes, 7 normalizers rebuilt, 2 renderers, `uiLanguage` union widened, all 4 test files rewritten | **5 — ~6–10 files, behavior-identical, independently green** |
| **Future flexibility** | 2 — `_native`+`_en` is still binary; supports "one native per lesson + EN fallback" but **not** one lesson serving VI *and* KO learners | **5 — true N**; `field[l1] ?? field.en ?? …` | 4 — accessor hides shape; Option B drops in behind it later with localized blast radius |
| **Type safety** | 3 — loses the compile-time "exactly vi+en exist" guarantee, gains nothing | 2 — `Record<L1,string>` makes every access optional; runtime presence checks everywhere | **4 — keeps current types; accessor return is `string\|undefined`, same as today** |
| **Runtime cost** | 5 — negligible | 4 — one map lookup per field (negligible but non-zero; more allocations in normalizers) | **5 — one function call, same as inline `pick`** |
| **Reversal cost if N stays 2** | 3 — renamed-for-nothing, churn with no benefit | 1 — strictly worse than today: indirection + lost type guarantee for a 0-user feature | **5 — ≈ free; accessor + plumbing field are net-positive even at N=2 (de-dupes 2 renderers)** |
| **Fixes present-day debt** | 1 — no | 3 — yes but coupled to a risky big-bang | **5 — yes: centralizes 2 divergent renderers, gives the title lies a clean home (`nativeLanguage='en'` tag)** |

**Recommendation: C now, B as the eventual target.** Rationale aligns with the project's operating discipline (`CLAUDE.md`: *small diffs over smart diffs*, *don't solve uncertainty with more code*, *restore before redesign*) and the standing project memory that native-language is *future plumbing — no real user choice yet*. C fixes the real debt (scattered/divergent selection, the two title lies) at low risk, ships the `nativeLanguage` plumbing, and keeps the expensive reshape deferred behind a stable seam until a 2nd native language is actually committed. **A is rejected:** it pays migration cost to rename a binary that stays binary.

---

## §4 — Migration plan for Option C (→ B later)

**Order of operations (each commit independently green & shippable):**

1. **PR-A — accessor + plumbing, zero behavior change.**
   - Add `NativeLang` type (`'vi'` only today, widened later) + `getNativeContent(lesson, field, nativeLang): string|undefined` + `getNativeList(...)` for array fields, in a new `src/components/languages/nativeContent.ts`. Internally: today `nativeLang==='vi' ? viSlot ?? enSlot : enSlot ?? viSlot` — i.e. exactly the current `pick()` semantics, parameterized on a *native* axis instead of *ui* axis.
   - Introduce `nativeLanguage` resolution (see §5): a `useNativeLanguage()` hook returning `'vi'` (hardcoded) + a localStorage seam mirroring `mercyblade.lessonUiLang`.
   - Re-point **LessonRenderer.tsx**'s pedagogy `pick()` sites at `getNativeContent`; **leave chrome `pick()`/`RENDERER_LABELS` on `uiLanguage`** (this is where the two axes split). `isFallback`/`FallbackBadge` keep working (accessor exposes which slot answered).
   - **Net:** behavior byte-identical (native resolves to `'vi'`, same as the old default). Fully green: `typecheck:ci` + `vitest` + `vite build`.

2. **PR-B — reconcile the 2nd renderer + retire the title lies.**
   - Route `LanguageLessonsView.tsx`'s inline ternaries through the same `getNativeContent`; it gains the fallback-badge behavior (closes the divergence).
   - Tag the two EN-native modules with `nativeLanguage: 'en'` at the normalizer boundary; the accessor then resolves their pedagogy correctly **without** the `title.vi`-stuffing lie. Replace the Spanish `uiLanguage="en"` hardcode and the Vietnamese `dualTitle` hack with the explicit `nativeLanguage` signal. The `title:{vi,en}` struct can stay structurally (the lie was *semantic*, now resolved by the tag); a later cleanup may rename to `title:{native,romanization}` under B.

3. **PR-C — (only if a 2nd native language is greenlit) Option B map migration**, behind the now-stable accessor: change `getNativeContent` internals + the contract field shape + 7 normalizers; **callers don't change** because they already go through the accessor. This is the payoff of the seam.

**Backwards-compat window:** Under C, old `*Vi`/`*En` fields are **kept indefinitely** — the accessor reads them; nothing is renamed. There is no compat *window* because there is no breaking change until PR-C, at which point the accessor signature is unchanged and old fields can be dual-written for one release then dropped.

**Auto-sync impact: NONE (verified).** `scripts/sync-lessons-to-supabase.ts:137-152` upserts `content: lesson as Record<string,unknown>` into a single `jsonb` column, keyed on `(language, level, lesson_index)` (`onConflict` at the unique constraint). `supabase/migrations_manual/20260510000000_create_lessons_table.sql:9-21`: the `lessons` table is `language/level/lesson_index/content jsonb` — **no `*_vi`/`*_en` columns; content is opaque to Postgres.** Any field rename or shape change is invisible to sync and needs **no Supabase migration**. (Confirmed by direct read.) `sync-lessons.yml` keys on the same triple and is field-name-agnostic.

**Renderer touch points:** PR-A: `LessonRenderer.tsx` + new `nativeContent.ts` + a native-language hook/context + ~1–2 tests. PR-B: `LanguageLessonsView.tsx`, `spanish/normalize.ts`, `vietnamese/normalize.ts`, `SpanishLessonsPage.tsx`, `VietnameseLessonsPage.tsx`. Under B (PR-C): + `LessonRenderer.types.ts`, all 7 `*/normalize.ts`, `uiLanguageToggle` union.

**Test impact.** Four files hardcode the binary: `src/languages/__tests__/normalizeTitle.test.ts` (pins `title.vi===title_vi`), `__tests__/singleLanguageRender.smoke.test.tsx`, `__tests__/uiLanguageToggle.smoke.test.tsx`, `mercy-guide/tabs/__tests__/LanguageLessonsView.test.tsx`. **Under C, all four keep passing unchanged** (native='vi' ≡ old default). They only need rewriting under PR-C (Option B) — which is precisely why deferring B is cheap.

---

## §5 — `nativeLanguage` field location

Two distinct axes (see §2): **uiLanguage** (chrome) already lives in `UiLanguageContext` localStorage. **nativeLanguage** (pedagogy L1) is new and today has exactly one value.

**Recommended: Hybrid, fallback chain `URL ► user profile ► localStorage ► default('vi')`** — but implement **only localStorage + default** in Phase 2; the rest are future stubs.

- **Primary for Phase 2: localStorage**, mirroring the proven canonical pattern — add `mercyblade.nativeLang` alongside `mercyblade.lessonUiLang`, same provider style. Consistent with the *one canonical source* the recon found; zero new infra.
- **Eventual home: `profiles.native_language`** (persists cross-device) — requires a Supabase `profiles` column. **Defer:** out of scope for Phase 2, must not block, and there is no user choice to persist yet (only `'vi'`).
- **URL param**: cheap to add later for shareable/SEO deep links; not needed while N=1.
- The two EN-native modules set `nativeLanguage:'en'` at the **normalizer boundary** (per-module constant), independent of the user-level resolver — they are content-intrinsic, not user-chosen.

Today this is **pure future plumbing**: the resolver returns `'vi'` for every real user. Its value is collapsing the two divergent renderers and giving the EN-native modules an honest signal — not a user-facing feature.

---

## §6 — Phase 2 PR scope

**Phased, not one big PR.** Smallest first PR that ships value without locking design:

- **PR-A (the value PR):** accessor + `nativeLanguage` plumbing + LessonRenderer pedagogy sites re-pointed; native hardcoded `'vi'`. **~6–10 files, ~250–400 LOC, behavior-identical, no design lock-in** (the map shape is *not* decided here — only the seam). Ships immediately. ~0.5–1 day agent + ~1 h review.
- **PR-B:** reconcile `LanguageLessonsView`, retire the two `title.vi` lies via `nativeLanguage:'en'` tags. ~5 files. ~0.5 day + ~1 h review. Independently shippable; visibly fixes the badge divergence.
- **PR-C (gated on §8 Q1 = yes):** Option B map migration behind the seam — ~22 files, all tests rewritten. Only spend this once N≥2 is real.

**Coordination / conflict.** Verified: only open PR is #235 (draft, unrelated). No JA/ZH C2 renumber in flight. **PR-A/PR-B are safe now.** PR-C touches **every normalizer** — it must be serialized against any future language-content authoring PR (the project routinely runs parallel content agents per memory; a normalizer-wide reshape mid-flight would collide). Recommend PR-C only in a quiet window with an explicit "no content PRs land during this" agreement.

---

## §7 — Honest tradeoffs

**Cost today.** Recommended path PR-A+PR-B ≈ **1–1.5 days agent + ~2 h Chau review**. The review is light because PR-A is provably behavior-neutral (native≡'vi'=old default; all existing tests green unchanged) and PR-B's diff is localized to 2 EN-native modules + the 2nd renderer.

**Cost deferred.** If Chau ships N=2 (e.g. add Korean-native) *before* any abstraction: the binary forces a 3rd-slot hack per pedagogy field across 7 normalizers, then that hack must be unwound when the map lands — roughly **2× the Option-B cost** plus a content-correctness audit (the §1 traps re-bite every hack). Doing PR-A *first* makes the eventual N=2 a localized change behind the accessor (~Option-B cost, **no** doubling). The seam is cheap insurance.

**Reversal cost.** If Chau decides **never** to add a second native language: Option C is **net-positive even then** — it de-duplicates the two divergent renderers and removes the two `title.vi` lies, with no added indirection beyond one function call (same as today's inline `pick`). Option B in that scenario is **strictly worse than the status quo**: map indirection, lost compile-time "exactly vi+en" guarantee, every-access presence checks, all for a feature with zero users. This asymmetry is the core argument for C.

**Hidden assumptions that "just happen" to work under the binary (flagged):**
1. **Unsuffixed base = Vietnamese.** `register_notes`, `roleplay_prompts`, `idiom_glosses.{literal,meaning,example}` — no `_vi` suffix exists; the base *is* the VN copy. Suffix-driven migration silently treats these as language-neutral. (`korean/lessons.ts:59-67,106,109`.)
2. **Same key, different language by context.** Korean `meaning`: Vietnamese in vocab, English in dialogue, English/romanization in matching pairs — within one file. Cannot be auto-detected; must be hand-listed.
3. **`en` doesn't mean English.** French/German `LessonSentence.en` holds the *target* language; routed to `native`. A migration touching `en` corrupts FR/DE.
4. **EN-native modules abuse the schema in opposite directions.** Spanish→`*En`+`uiLanguage="en"` hardcode; Vietnamese→`*Vi`+`"vi"` default+`dualTitle`. No single rule fixes both.
5. **`title:{vi,en}` is a 2-slot struct, not a map.** The two title lies are the *symptom*, not the disease.
6. **The whole stack is binary-pinned:** `uiLanguage:"vi"|"en"` union, `pick()` ternary, `FallbackBadge`, `isFallback`, 4 test files, the localStorage value — each independently assumes exactly 2 languages.
7. **Two renderers, only one has fallback badges** — generalizing one without the other widens an existing UX inconsistency.

---

## §8 — Open questions only Chau can answer

1. ~~**Is a second native language actually on the roadmap, and on what horizon?**~~ **ANSWERED 2026-05-17: Yes, ~2 quarters.** → PR-A now, PR-B next, PR-C scheduled behind the seam. (Resolved; remaining open questions Q2–Q6 still stand.)
2. **Which is the realistic second native audience** — English speakers learning languages (would consume the existing `*_en` content directly), or a third L1 (Korean-for-Koreans etc., needs all-new authored prose)? The former is nearly free under C; the latter is a content project dwarfing the schema work.
3. **`title` policy:** keep `title:{vi,en}` and resolve via the `nativeLanguage` tag (PR-B, minimal), or commit now to `title:{native,romanization}` (bigger, cleaner, but a design lock-in)?
4. **Lesson `title` and French/German category titles — UI-language or native-language axis?** (The §2 "hybrid" set.) Affects whether titles follow the chrome toggle or the learner's L1.
5. **Should `nativeLanguage` ever diverge from `uiLanguage` for a real user** (e.g. a VN user who wants English chrome but Vietnamese pedagogy)? If never, the two axes can stay coupled at the resolver and the refactor shrinks further. If someday yes, PR-A's split is mandatory plumbing.
6. **Is the missing `RECON-native-lang-picker.md` expected?** This recon stands alone, but if that prior doc exists elsewhere it may carry decisions (esp. the "§6 starting point" the brief references) worth reconciling before PR-A.

---
*End RECON-schema-generalize.md — recon only; no code changed; no PR opened.*
