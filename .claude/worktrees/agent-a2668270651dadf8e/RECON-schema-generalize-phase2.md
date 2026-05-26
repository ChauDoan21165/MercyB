# Phase 2 — Sub-PR breakdown (Option C, decomposed)

**Decision context:** `RECON-schema-generalize.md` §0 — Option C now → B later; second native-language audience confirmed on roadmap (~2 quarters, locked 2026-05-17).
**Branching:** every sub-PR is cut fresh off `origin/main`. Merge stays Chau's. Push + PR-open authorized upfront.
**Invariant across all sub-PRs:** existing `*_vi` / `*_en` source fields and `*Vi` / `*En` contract slots stay **alive** — no deletions until PR-C. `_vi`/`_en` data is never touched.
**Auto-sync invariant:** `scripts/sync-lessons-to-supabase.ts` upserts raw `lessons-*.ts` source verbatim into an opaque `jsonb` column keyed on `(language, level, lesson_index)`. None of A1–A4 touch `lessons-*.ts`, the normalizers' *source field names*, or the sync script ⇒ **auto-sync impact = zero**, re-confirmed at each sub-PR boundary below.

The recon's two-PR plan (PR-A accessor+plumbing+renderer, PR-B renderer-reconcile+title-lies) is re-decomposed into four independently-shippable sub-PRs. Each is green per commit, shippable on its own, and **does not depend on any later sub-PR landing**. Earlier→later dependency (e.g. A2 needs A1's module) is satisfied purely by merge order, which is Chau's.

---

## PR-A1 — Native-language selection seam (pure addition, zero behavior change) ← **THIS PR**

**What:** introduce the seam every later sub-PR routes through, with no call sites yet.
- `src/components/languages/nativeContent.ts` — `NativeLang` type, `NativeSlots<T>` record shape (intentionally Option-B-ready: widen the union + record later, callers unchanged), `getNativeContent()`, `isNativeFallback()`. Semantics are byte-identical to the legacy `pick(uiLanguage,en,vi)` / `isFallback` so the eventual repoint is provably behavior-preserving.
- `src/contexts/NativeLanguageContext.tsx` — `NativeLanguageProvider` + `useNativeLanguage()`, localStorage `mercyblade.nativeLang`, default `'vi'`. Mirrors `UiLanguageContext` exactly (lazy sync init, same-tab reactivity via context, cross-tab via `storage` event).
- `src/main.tsx` — mount `<NativeLanguageProvider>` (inert: no consumer yet; makes A2 a pure swap, keeps A2 from having to touch boot).
- `src/components/languages/__tests__/nativeContent.test.ts` — resolution + fallback both directions, undefined-when-empty, Option-B record forward-compat.
- Lands `RECON-schema-generalize.md` + `RECON-schema-generalize-phase2.md` at root for traceability.

**Behavior change:** none. The provider has no consumer; the accessor has no call site. Existing 4 binary tests untouched and green.
**Files:** 4 new + `main.tsx` + 2 docs. **Auto-sync: zero** (no `lessons-*.ts`/normalizer/sync touched).
**Dependency:** none. Independently shippable.

## PR-A2 — Repoint `LessonRenderer` pedagogy selection onto the seam (behavior-identical)

**What:** in `LessonRenderer.tsx`, the ~20 *pedagogy* `pick(uiLanguage,…)` sites (intro, sentence/vocab/dialogue gloss, pronunciation focus, vocab phonetic, exercise hint/instruction/prompt, cultural notes, tip advice, register notes, roleplay prompts, idiom literal/meaning/example) → `getNativeContent({ vi, en }, nativeLang)` with `nativeLang` from `useNativeLanguage()`. **UI chrome stays on `uiLanguage`** (`RENDERER_LABELS`, count chips, CEFR pill, dialogue toggles, badge text). Fallback badge → `isNativeFallback`. This is where the two conflated axes split.
**Behavior change:** none — `nativeLang` resolves `'vi'` (= the old `uiLanguage` default for pedagogy), output byte-identical. All 4 existing test files stay green **unchanged** (the recon's central argument for cheap deferral).
**Files:** `LessonRenderer.tsx` (+ possibly a test asserting the split). **Auto-sync: zero** (renderer not synced).
**Dependency:** needs A1 merged. Independent of A3/A4.

## PR-A3 — Per-module `nativeLanguage` tag + retire the two `title.vi` lies (same-context cleanup)

**What:** the title-lie cleanup folds here per Chau — "same context" = the per-module native tag mechanism. `spanish/normalize.ts` + `vietnamese/normalize.ts` tag their output `nativeLanguage:'en'` and stop stuffing English into `title.vi`/`*Vi`; replace the `SpanishLessonsPage` `uiLanguage="en"` hardcode and the `VietnameseLessonsPage` `dualTitle` hack with the honest native tag the renderer (post-A2) already honors.
**Behavior change:** end-user rendering identical (the lies render correctly *by accident* today; this makes it correct *by design*). `_vi`/`_en` source fields untouched.
**Files:** `spanish/normalize.ts`, `vietnamese/normalize.ts`, `SpanishLessonsPage.tsx`, `VietnameseLessonsPage.tsx`, tests. **Auto-sync: zero** (normalizers are not the sync input — raw `lessons-*.ts` is).
**Dependency:** needs A1 (+A2 for the renderer to honor the tag). Independent of A4.

> **Split (Chau, 2026-05-17) — A3 shipped as two PRs:**
> - **PR-A3 (shipped):** Spanish honest `nativeLanguage="en"` tag (provable no-op — was implicit via the `nativeLanguage` default) + the title moved onto the native axis in `LessonRenderer` (`pick`/`isFallback` → `getNativeContent`/`isNativeFallback`; helpers deleted). Provably **byte-identical for every caller** — no caller passes a `nativeLanguage` that diverges from its `uiLanguage` on the non-`dualTitle` title path. RECON §8 title-routing question is **resolved** (title = pedagogy-adjacent → native axis). Files: `SpanishLessonsPage.tsx`, `LessonRenderer.tsx`, `singleLanguageRender.smoke.test.tsx`.
> - **PR-A3b (deferred):** the Vietnamese-for-foreigners flip. Setting `nativeLanguage="en"` there alone surfaces a data lie — `vietnamese/normalize.ts` stuffs the (English) `cultural_note`/`tip`/`title_en` into the `*Vi`/`title.vi` slots, so the flip would add a *misleading* "VI" fallback badge on Culture/Tip with unchanged prose. A3b couples the `*Vi`→`*En` + `title.vi`→`title.en` normalizer honesty (and the `dualTitle`/subtitle restructure it entangles — the title-struct blocker, §8) with the page tag so the audience never sees the bad badge. Files: `vietnamese/normalize.ts`, `VietnameseLessonsPage.tsx`, tests.

## PR-A4 — Reconcile `LanguageLessonsView` onto the seam (close the 2nd-renderer divergence)

**What:** `mercy-guide/tabs/LanguageLessonsView.tsx`'s inline `uiLang==="en"?…:…` ternaries → `getNativeContent`; it gains fallback-badge parity with `LessonRenderer` (today it silently falls back with no badge — an existing UX inconsistency the recon flagged as risk #2).
**Behavior change:** adds the missing fallback badge in the Mercy-guide French/German tabs (the *only* visible delta in the whole of Phase 2; flag for Chau at A4 review).
**Files:** `LanguageLessonsView.tsx`, its test. **Auto-sync: zero.**
**Dependency:** needs A1. Independent of A2/A3.

---

## Sequencing & coordination

Merge order **A1 → A2 → A3 → A4** (A2/A3/A4 each cut off `origin/main` *after* their dependency merges — Chau controls merge cadence). PR-C (Option B map migration) is **not** in this phase; it slots behind the now-stable `getNativeContent` seam within the ~2-quarter window and must be serialized against language-content authoring PRs (it touches all 7 normalizers).

**Open at recon time:** PR #235 (draft, subscription-tracking, unrelated). No normalizer / C2-renumber work in flight. Many sibling worktrees exist but none on `schema-generalize-phase2*`. Re-check `gh pr list` before each later sub-PR.

*This phase is implementation. RECON-schema-generalize.md remains the spec; this file is the build plan.*
