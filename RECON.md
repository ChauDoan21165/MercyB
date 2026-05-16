# RECON — EN-mode UI chrome on language pages

Branch `ui-chrome-en-translations` off `origin/main` HEAD `8dff2da9` (#518 merged ✓).
No conflicting `ui-chrome-en` branch. Phase 1 — recon only, no code changes.

## TL;DR — the brief's premise is half-wrong (in our favor)

PR #517 wired **more** than the hero. `LessonRenderer` already carries a
full VI **and** EN chrome dictionary (`RENDERER_LABELS`, gated by a
`uiLanguage` prop) and **all 5 pages already pass `uiLanguage={uiLang}`**.
So the lesson-card metadata the brief lists as broken —
`từ vựng / câu / hội thoại / bài tập` and the in-card section headings
(`Từ vựng / Hội thoại / Bài tập / Văn hoá / Mẹo học / …`) —
**already flip to English today.** Verified by reading every `labels.*`
call site in `LessonRenderer.tsx` (lines 217–642) plus the prop wiring
on each page.

The one genuine gap is **`cefrPillLabels`** (the CEFR level descriptive
labels). It is a VI-only flat map consumed in places that are *not*
uiLang-aware. That single map drives every Vietnamese string the brief
actually sees: level tabs, section header, and the in-card level chip.
A small set of page-level strings on Korean/Japanese/Chinese (loading /
empty / count / aria) are also still hardcoded VI — French & German
already conditionalized those in #517.

## 1. Inventory of hardcoded VI chrome (with file:line)

### 1a. THE core gap — `cefrPillLabels` (VI-only, not uiLang-aware)

`src/components/languages/lessonThemes.ts:29-37`

```
A1   "A1 · Sơ cấp"
A1+  "A1+ · Sơ cấp vững hơn"
A2   "A2 · Cơ bản"
B1   "B1 · Trung cấp"
B2   "B2 · Trung cao"
C1   "C1 · Cao cấp"
C2   "C2 · Thuần thục"
```

Consumed (VI always, even in EN mode):

| Where | File:line | What the user sees |
|---|---|---|
| In-card level chip | `LessonRenderer.tsx:198` | "A2 · CƠ BẢN" next to every lesson — **all 5 pages** |
| Level tab buttons | `KoreanLessonsPage.tsx:155`, `JapaneseLessonsPage.tsx:139`, `ChineseLessonsPage.tsx:155`, `FrenchLessonsPage.tsx:143`, `GermanLessonsPage.tsx:156` | the "A1 · Sơ cấp … C2 · Thuần thục" tab row |
| Section header `<h2>` | `KoreanLessonsPage.tsx:164`, `JapaneseLessonsPage.tsx:148`, `ChineseLessonsPage.tsx:164` | the level title above the lesson list (FR/DE use bilingual `CategorySection` titles instead) |
| Embedded in loading copy | `Korean:175`, `Japanese:159`, `Chinese:175`, `French:152-153`, `German:165-166` | "Đang tải bài học cấp độ **A2 · Cơ bản**…" |

### 1b. Page-level VI strings — Korean / Japanese / Chinese only

(French & German already handle all of these via `uiLang === "en" ? … : …` from #517.)

| String | Korean | Japanese | Chinese | EN target |
|---|---|---|---|---|
| nav `aria-label="Chọn cấp độ"` | :133 | :122 | :133 | "Choose level" (FR/DE precedent) |
| count chip `${n} bài` / `"đang tải…"` | :169 | :153 | :169 | `${n} lessons` / "loading…" |
| loading `Đang tải bài học cấp độ X…` | :175 | :159 | :175 | "Loading X lessons…" (FR/DE precedent) |
| empty `Chưa có bài học cho cấp độ này.` | :179 | :163 | :179 | "No lessons available for this level yet." (FR/DE precedent) |
| total-count line `{N} bài · {N} lessons` | :119 | :108 (already `uiLang` cond.) | :119 | EN: just `{N} lessons` |

`Korean:119` and `Chinese:119` print `{N} bài · {N} lessons` unconditionally
(both languages always) — not *wrong* in EN, just redundant. Japanese:108
already uses `uiLang === "en" ? "lessons" : "bài"`. Minor consistency item.

### 1c. ALREADY translated in #517 — no work needed (documented so we don't "re-fix" dead targets)

- `LessonRenderer` `RENDERER_LABELS` (`LessonRenderer.tsx:71-124`): `vocabChip/sentenceChip/dialogueChip/exerciseChip`, all section headings (`vocabHeading/dialogueHeading/exercisesHeading/cultureHeading/tipHeading/registerHeading/roleplayHeading/idiomHeading/grammarHeading`), `vocabUnit`, audio aria-labels, exercise-type labels. Gated by `uiLanguage` prop; **every page already passes `uiLanguage={uiLang}`** (Korean:188, Japanese:175, Chinese:188, French:228, German via CategorySection). These flip to EN correctly today.
- French/German hero subtitle, level-nav aria, count word, loading & empty copy — already `uiLang`-conditional.

### 1d. Out of scope (confirmed)

- **Spanish** (`SpanishLessonsPage.tsx`) — English-source vertical, passes `uiLanguage="en"` and has its **own** local `CEFR_PILL_LABELS_EN` (lines 42-49). Untouched — but see §3 (it's the translation source of truth).
- **Vietnamese** (`VietnameseLessonsPage.tsx`) — VI page, stays VI.
- **Hub** (`LanguagesIndexPage.tsx`) — see §5 (decision needed).
- Inside-lesson gloss content (`_en` siblings) — separate prior campaign, already wired via `pick()`.

## 2. Translation table

**Recommendation: match the values Spanish already ships in production**
(`SpanishLessonsPage.tsx:42-49`) rather than the brief's tentative
alternatives. Source-of-truth hierarchy → current production reality.
Keeping A1–C2 letters as the primary token (CEFR is international).

| VI (current) | Brief suggested | **Recommended (= shipped Spanish)** |
|---|---|---|
| A1 · Sơ cấp | Beginner/Elementary | **A1 · Beginner** |
| A1+ · Sơ cấp vững hơn | — | **A1+ · Upper Beginner** *(no Spanish precedent — new)* |
| A2 · Cơ bản | Pre-intermediate/Basic | **A2 · Elementary** |
| B1 · Trung cấp | Intermediate | **B1 · Intermediate** |
| B2 · Trung cao | Upper-intermediate | **B2 · Upper-Intermediate** |
| C1 · Cao cấp | Advanced | **C1 · Advanced** |
| C2 · Thuần thục | Mastery/Proficient | **C2 · Mastery** |

Other strings:

| VI | EN |
|---|---|
| `bài` (count word) | `lessons` |
| `đang tải…` | `loading…` |
| `Đang tải bài học cấp độ X…` | `Loading X lessons…` |
| `Chưa có bài học cho cấp độ này.` | `No lessons available for this level yet.` |
| `Chọn cấp độ` (aria) | `Choose level` |
| `từ vựng / câu / hội thoại / bài tập` | already → `vocab / sentences / dialogues / exercises` (no change) |

EN strings for loading/empty/aria are chosen to be **byte-identical to
what FrenchLessonsPage/GermanLessonsPage already render in EN mode**, so
all 5 pages stay consistent.

## 3. Implementation approach — recommended: extend `lessonThemes.ts` (Option A)

The EN translation table already exists, shipped, in
`SpanishLessonsPage.tsx:42-49` (`CEFR_PILL_LABELS_EN`). The cleanest move
is to **centralize that map into `lessonThemes.ts`** and add a
uiLang-aware accessor:

```ts
// lessonThemes.ts (add)
export const cefrPillLabelsEn: Record<string, string> = {
  A1: "A1 · Beginner",
  "A1+": "A1+ · Upper Beginner",
  A2: "A2 · Elementary",
  B1: "B1 · Intermediate",
  B2: "B2 · Upper-Intermediate",
  C1: "C1 · Advanced",
  C2: "C2 · Mastery",
};
export function cefrPillLabel(level: string, uiLang: "vi" | "en"): string {
  const map = uiLang === "en" ? cefrPillLabelsEn : cefrPillLabels;
  return map[level] ?? cefrPillLabels[level] ?? level; // VI fallback then raw
}
```

Then:
- `LessonRenderer.tsx:198` → `cefrPillLabel(lesson.level, uiLanguage)` (it already has the `uiLanguage` prop).
- Korean/Japanese/Chinese pages → swap the 3 `cefrPillLabels[…]` sites + conditionalize aria/loading/empty/count using the same `uiLang === "en"` ternary pattern French/German already use.
- French/German pages → swap only the level-tab `cefrPillLabels[lv]` site (everything else already EN-aware).
- Spanish → optionally drop its local `CEFR_PILL_LABELS_EN` and import the shared map (DRY; flag as optional, keeps diff small if deferred).

Why not the alternatives:
- **New `src/i18n/labels.ts` + `useUiLabels()` hook (Option B):** over-engineered. The renderer dictionary already exists in `LessonRenderer`; pages already hold `uiLang` via `useLessonUiLang()`. We'd be building a framework for ~6 strings.
- **Extend `UiLanguageContext` with a dictionary (Option C):** couples copy to the context provider; heavier; no consumer needs reactivity beyond what the existing context already gives.

`useLessonUiLang()` is now a thin shim over `useUiLanguage()`
(`LessonUiLangToggle.tsx:14-17`), so every page already has reactive
`uiLang` in scope — no new plumbing required.

## 4. Affected pages — confirmed

| Page | Needs work? |
|---|---|
| Korean | YES — level tabs, section header, loading, empty, count, aria, in-card chip |
| Japanese | YES — same as Korean |
| Chinese | YES — same as Korean |
| French | minor — only level-tab `cefrPillLabels[lv]` + in-card chip |
| German | minor — only level-tab `cefrPillLabels[lv]` + in-card chip |
| Spanish | NO (already EN; optional DRY refactor) |
| Vietnamese | NO (VI page) |
| Hub `/languages` | DECISION — see §5 |

## 5. Hub (`LanguagesIndexPage`) — decision needed

The hub is a **different chrome class** and does **not** consume the
toggle at all (no `useUiLanguage()`). Its VI strings:
- 7 card `blurb_vi` (`LanguagesIndexPage.tsx:39,49,59,69,79,89,99`) — note 3 of the 7 (Vietnamese, Spanish) are *already English*.
- CTA "Bắt đầu học" (`:180`).
- `HERO_VI`/`HERO_EN`/`SUBTITLE_VI` are already English (de-narrowed in #517).

Including the hub means adding `useUiLanguage()` + a `blurb_en` per card
(4 new EN blurbs) + CTA translation. That's a separate, self-contained
chunk. **Recommendation:** include it as its own commit in the same PR
(small, ~30 lines, no shared-infra risk) — OR defer to a follow-up if
Chau wants this PR strictly scoped to "level labels / counts / metadata".
Flagging for Chau's call (default: include as final commit).

## 6. Risk surface

- **Zero behavioral change for VI users.** `cefrPillLabel(level,"vi")`
  returns the *same* `cefrPillLabels` strings byte-for-byte; the `?? lv`
  raw fallback is preserved. VI is the context default; every existing
  user stays VI until they toggle.
- `cefrPillColors` (the pill *color* classes) is **not** touched — only
  the text labels.
- All changes are display-string swaps gated on `uiLang`/`uiLanguage`
  already in scope. No data, routing, audio, or permission paths touched.
  Central file risk is low: `lessonThemes.ts` is a pure constants module;
  we add, not mutate, exports.
- Small-diff discipline: ~6 string sites/page on KO/JA/ZH, 1–2 on FR/DE,
  1 in `LessonRenderer`, +1 constants block. No "clever" refactor.

## 7. Smoke-test plan (Phase 2, per #509 §8)

Extend `src/components/languages/__tests__/uiLanguageToggle.smoke.test.tsx`
(or a sibling) to render each page (or `LessonRenderer` + the page chrome)
under `uiLang="vi"` and `uiLang="en"` and assert:
- VI mode: "Sơ cấp"/"Cơ bản"/… present, English level labels absent (byte-identical guard).
- EN mode: "Beginner"/"Elementary"/… present, "Sơ cấp"/"bài"/"Chưa có bài học" absent.
- 375px mobile: not coverable headlessly — flag as visually-unverified in PR.

## 8. Phase 2 gates

`npm run typecheck` (tsconfig.typecheck.json) + `npm run lint` +
`npm run build` (rooms:check prebuild + PWA) green per commit.
Sentry sourcemap upload unaffected (no build-config / env change; #516
vars untouched).
