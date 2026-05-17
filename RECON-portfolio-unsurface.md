# RECON — Portfolio Un-surface (6 off-mission language tracks)

**Agent:** portfolio-unsurface-agent
**Branch:** `portfolio-unsurface` (worktree `/private/tmp/MercyB-portfolio-unsurface`, off fresh `origin/main` @ f66eefc5)
**Decision:** PAUSE, not REMOVE. Keep all files + routes (direct-URL access preserved); strip only the prominent UI surface.
**Trigger:** Spanish + Korean content audits found both tracks reachable in 2 clicks from Home, despite STRATEGY.md §4 listing all six under *Explicitly NOT serving*.

---

## 1. Canonical anchor

STRATEGY.md §4 line 78 (verbatim):

> Native English speakers learning Korean/Japanese/Chinese/French/German/Spanish (not the mission — those tabs exist in code, **are deferred or removed from marketing**)

RECON-spanish-audit.md line 122 endorses the exact action:

> "…if truly dormant, the cleaner move is to **drop the LanguageSwitcher/Index entry points so the content rests behind direct URLs only**."

---

## 2. Surface map — where the 6 are prominent

Exhaustive grep (`to="/languages`, `href="/languages`, `nav("/languages`, `navigate("/languages`, sitemap, footer, nav, header):

| Surface | File | Status |
|---|---|---|
| **A. LanguageSwitcher** (7-card grid) | `src/components/LanguageSwitcher.tsx` — mounted at `src/pages/Home.tsx:1070` (only mount) | **PROMINENT — un-surface** |
| **B. LanguagesIndexPage** (`/languages` hero + 7 cards) | `src/pages/languages/LanguagesIndexPage.tsx` | **PROMINENT — un-surface** |
| C. Routes `/languages/{lang}` | `src/router/AppRouter.tsx:898–921` | **KEEP — direct URL stays** |
| D. Footer / nav / header / sitemap links | — | **NONE EXIST.** No component links to `/languages` or any `/languages/{lang}` outside A, B, and the router. |
| E. Store data + `LearningLanguage` type | `src/store/languageProgress.tsx:36–62` | **KEEP UNTOUCHED** — sole consumer of the `EUROPEAN_LANGUAGES`/`ASIAN_LANGUAGES` exports is LanguageSwitcher; the type powers routes/pages we must preserve. |
| F. Content files `src/languages/*` | (6 dirs, ~10k lines) | **KEEP UNTOUCHED** (ground rule). |

**Conclusion:** the entire prominent surface is exactly **2 files** (A + B). `/languages` index itself is *already* effectively direct-URL-only (nothing links to it; the switcher cards `nav()` straight to `/languages/{id}`). The real public funnel is **Home → LanguageSwitcher → `/languages/{lang}`**.

---

## 3. Authoritative lesson counts (from in-repo constants) vs. stale copy

| Lang | Constant | LanguagesIndexPage card says | Store `totalLessons` |
|---|---|---|---|
| French | `FRENCH_TOTAL_LESSONS = 151` | "50 lessons" | (none → 50 fallback) |
| German | `GERMAN_TOTAL_LESSONS = 151` | "50 lessons" | (none → 50) |
| Chinese | `CHINESE_TOTAL_LESSONS = 149` | "50 lessons … A1 → B2" | (none → 50) |
| Japanese | `JAPANESE_TOTAL_LESSONS = 151` | "50 lessons … A1 → B2" | (none → 50) |
| Korean | `KOREAN_TOTAL_LESSONS = 151` | "50 lessons … A1 → B2" | (none → 50) |
| Spanish | `SPANISH_TOTAL_LESSONS = 109` | "110 lessons … A1 to C2" | `110` |
| Vietnamese *(KEEP)* | `VIETNAMESE_TOTAL_LESSONS = 536` | "96 short lessons …" | `47` |

**Stale-count handling:** every stale number above (Spanish 110→109, Korean "50 A1→B2"→151 A1→C2, +4 siblings all "50") lives **inside the 6 cards/tabs being deleted** — they are removed *by deletion*, not by patching. No number needs a "fix"; deleting the card is the fix. The store's `spanish: totalLessons: 110` (line 52) is pre-existing staleness that this PR makes fully unsurfaced — **left untouched** (out of scope, no surface renders it post-PR, store edits risk the kept routes). Flagged, not fixed. Vietnamese card copy is out of scope (kept track, not flagged).

---

## 4. File-by-file edit plan (Phase 2)

### Edit 1 — `src/components/LanguageSwitcher.tsx`

Component is data-driven from `EUROPEAN_LANGUAGES` + `ASIAN_LANGUAGES` and renders two category sections. **Hazard:** `renderCategory` reads `languages[0].category` (line 53) → crashes on an empty array. So we cannot just filter the store; we render Vietnamese only and drop the now-pointless 2-category scaffold.

- **Line 4–10 import:** drop `EUROPEAN_LANGUAGES` (becomes unused → lint break). Keep `ASIAN_LANGUAGES` (Vietnamese lives there, `category:"asian"`), `TOTAL_LESSONS_PER_LANGUAGE`, `useLanguageProgress`, `type LearningLanguage`.
- **Lines 298–299** (the two `renderCategory(...)` calls): replace with a single call rendering Vietnamese only:
  `renderCategory("Vietnamese for foreigners", "Tiếng Việt cho người nước ngoài", vietnameseOnly)`
  where `const vietnameseOnly = ASIAN_LANGUAGES.filter((l) => l.id === "vietnamese");` (defined just before the `return`). `renderCategory` body is unchanged and safe (1-element, non-empty).
- **Lines 276–296 header** ("Learning languages / Ngôn ngữ đang học"): copy still accurate for one entry; leave as-is (smallest diff). *Optional polish:* the 2-col grid (`gridTemplateColumns:"1fr 1fr"`, line 98) renders the lone card half-width — single-column is nicer but is a cosmetic decision; **default = leave the grid** (smallest safe diff), note for sign-off.

Net: ~6 changed lines, no new behavior, no crash path. Vietnamese card + its `/languages/vietnamese` CTA still work.

### Edit 2 — `src/pages/languages/LanguagesIndexPage.tsx`

- **`CARDS` array (lines 46–131):** delete the 6 off-mission card objects (`french` 47–58, `german` 59–70, `chinese` 71–82, `japanese` 83–94, `korean` 95–106, `spanish` 119–130). **Keep only `vietnamese` (107–118).** Final array = 1 element.
- **`HERO_EN` (line 19)** = `"Real-life lessons in Korean, Japanese, Chinese, French, German & more"` → rewrite to drop the 6, e.g. `"Survival Vietnamese for life in Vietnam"`. (`HERO_VI` line 15 "Practical language learning" is generic — keep.)
- **`SUBTITLE_VI` (lines 20–21)** references "other languages … for Vietnamese speakers" → rewrite to the Vietnamese-only reality, e.g. *"A small survival-speaking Vietnamese course for foreigners living in Vietnam."*
- **`SUBTITLE_EN` (lines 28–29)** explicitly lists "Korean, Japanese, Chinese, French, German, Spanish, and survival Vietnamese" → rewrite to Vietnamese-only, audience-appropriate EN.
- Unused-symbol sweep: `Globe` is imported (line 10) but already unused pre-change (no behavior change; do not touch). `ACCENT_CLASSES` keeps only `green` in use — TS/lint don't flag unused object keys, leave the map intact (smallest diff).

Net: page renders one Vietnamese card + de-narrowed hero. `/languages` stays a valid route (now Vietnamese-only), all 7 `/languages/{lang}` direct URLs unchanged.

### Edit 3 — `src/pages/languages/__tests__/uiChromeEn.smoke.test.tsx` (the only test that breaks)

Two `it("Hub: …")` blocks render `LanguagesIndexPage` and assert deleted French-card blurbs + the old subtitle:

- **VI Hub block, lines 127–143:**
  - 129 `toContain("chào hỏi, số đếm, câu giao tiếp")` — French VI blurb, **deleted** → fails. Replace with a Vietnamese-card assertion (e.g. the kept VN blurb substring `"627 audio-backed"` / new `"Bắt đầu học"` already on 130).
  - 132–134 `not.toContain("greetings, numbers, everyday phrases, grammar, food")` — still valid (French EN blurb gone) — keep or drop.
  - 137–139 `toContain(SUBTITLE_VI old text)` → update to the **new** SUBTITLE_VI.
  - 140–142 `not.toContain("…Korean, Japanese, Chinese, French, German, Spanish")` — still valid, strengthen as the regression guard that the 6 never reappear.
- **EN Hub block, lines 173–190:**
  - 175–177 `toContain("greetings, numbers, everyday phrases, grammar, food")` — deleted French EN blurb → **fails**. Replace with kept VN EN blurb substring.
  - 180 `not.toContain("chào hỏi…")` — keep.
  - 183–185 `toContain("real-world context across Korean, Japanese, Chinese, French, German, Spanish")` — that string is the **deleted** SUBTITLE_EN → **fails**. Update to new SUBTITLE_EN; invert into a `not.toContain` guard for the old 6-language string.
  - 186–189 `not.toContain` audience-exclusion — re-validate against rewritten copy.

The 5 per-language-page loops in the same file (`LESSON_PAGES`, lines 49–55; describes at 106 & 146) render the **pages**, not the hub — **unaffected**.

---

## 5. Test impact assessment (full)

| Test file | Renders | Impact |
|---|---|---|
| `src/pages/languages/__tests__/uiChromeEn.smoke.test.tsx` | LanguagesIndexPage + 5 pages | **MUST UPDATE** — 2 Hub `it` blocks (see Edit 3). Per-page loops unaffected. |
| `src/pages/languages/__tests__/heroSubtitle.smoke.test.tsx` | 5 language **pages** only | **Unaffected** — pages untouched. |
| `src/components/languages/__tests__/singleLanguageRender.smoke.test.tsx` | `LessonRenderer` (JA/ZH lessons) | **Unaffected** — renderer/content untouched. |
| `src/components/languages/__tests__/uiLanguageToggle.smoke.test.tsx` | `LessonRenderer` + provider | **Unaffected.** |
| LanguageSwitcher | — | **No test exists** (grep: zero). No Home test mounts it. Zero test impact from Edit 1. |

Only **1 test file** changes.

---

## 6. Verification plan

Standard gates + surface proof:

1. `npm run typecheck:ci` (catches the dropped `EUROPEAN_LANGUAGES` import / any unused symbol) — green.
2. `npm run lint` — green (unused-import is the main risk; addressed in Edit 1).
3. `npx vitest run src/pages/languages/__tests__/uiChromeEn.smoke.test.tsx` — green with updated assertions.
4. `npx vitest run src/pages/languages/__tests__ src/components/languages/__tests__` — the other 3 smoke files stay green untouched (proves no collateral).
5. `npm run build` (rooms:check prebuild + vite build) — green.
6. **Direct-URL preservation proof (the core invariant):** after build, `grep -n 'path="/languages/\(spanish\|korean\|japanese\|chinese\|french\|german\|vietnamese\)"' src/router/AppRouter.tsx` → all 8 routes still present and unmodified (diff must show **zero** lines changed in `AppRouter.tsx`). Optional runtime spot-check: `npm run preview`, hit `/languages/spanish` and `/languages/korean` directly → pages render (content + routes intact); confirm neither appears in Home's LanguageSwitcher nor as a `/languages` card.

---

## 7. Honest count of files touched

**3 files** changed in Phase 2:

1. `src/components/LanguageSwitcher.tsx` (~6 lines)
2. `src/pages/languages/LanguagesIndexPage.tsx` (delete 6 card objects + rewrite 3 copy constants)
3. `src/pages/languages/__tests__/uiChromeEn.smoke.test.tsx` (2 Hub `it` blocks)

**Zero** changes to: `AppRouter.tsx` (routes preserved), `languageProgress.tsx` (store/type preserved), any `src/languages/*` content file, the 5 per-language pages, the other 3 smoke tests.

Single PR, single commit (per locked #16).

---

## 8. Open questions for Phase-1 sign-off

1. **Scope confirm:** brief says "keep Vietnamese in the switcher." Note Vietnamese-for-foreigners is itself the *deferred secondary* audience per STRATEGY §4 (not off-mission, but not yet active). Default per brief = keep it surfaced. Alternative = also drop `<LanguageSwitcher />` from Home entirely (cleaner Home for the primary Vietnamese-learner audience). **Default: keep, per brief.**
2. **Switcher grid polish:** lone Vietnamese card renders half-width in the 2-col grid. Default = leave (smallest diff). Switch to single-column on request.
3. New copy strings (HERO_EN / SUBTITLE_VI / SUBTITLE_EN) are drafted in §4 — confirm wording before Phase 2 (these are the only user-visible *new* text).

**Phase 1 complete. Awaiting recon approval before Phase 2 edits.**
