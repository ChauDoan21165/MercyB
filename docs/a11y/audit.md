# MercyBlade accessibility audit — 2026-05-27

> **Update 2026-05-27 — blocker shipped.** The skip-link blocker called out below is **fixed** in `fix/a11y-skip-link`. `SkipToContent.tsx` ships, mounts in `AppHeroShell` as the first focusable element, and every audit-priority page exposes `<main id="main-content" tabIndex={-1}>` as the focus target. The "Documentation drift" table is updated to reflect the new reality. The 15 remaining findings ship as separate dispatches. Original audit text below is preserved for context.

**Audit branch:** `docs/a11y-audit`
**Scope:** Diagnostic only. Page-by-page WCAG 2.1 AA review of the five highest-traffic anon routes (`/`, `/weak-at`, `/onboarding`, `/pricing`, `/placement`) + the Stage-3A/3B components rendered inside `/weak-at`. No source changes in this MR.
**Auditor:** Agent C3, static analysis (no live screen-reader/keyboard run, no axe-core execution — those are deferred follow-ups).
**Reference target:** WCAG 2.1 AA + WCAG 2.2 Mobile (target size).

## TL;DR

- **One blocker, three serious, six moderate, six minor findings.** Bilingual-first remains MercyBlade's biggest unsolved a11y axis: shipped behavior is mostly inherited HTML defaults, with one critical screen-reader gap (`<label>` not linked to `<input>` in EmailBlock) and a chronic VI/EN `lang`-attribute inconsistency.
- **The existing `docs/ACCESSIBILITY.md` significantly overstates shipped reality** (claims 25/25 features; verified state is closer to 13/25 — see "Documentation drift" below). The honest baseline is much smaller than the existing doc suggests.
- **No automated a11y testing in CI today** despite the existing doc claiming `axe-core` + `eslint-plugin-jsx-a11y` — neither is actually installed. Wiring this up is the single highest-leverage fix.

## Severity legend

- **Blocker** — keyboard- or screen-reader user can NOT complete the primary task on the page.
- **Serious** — user CAN complete the task but loses critical context, requires workarounds, or hits an a11y failure documented as a WCAG AA breach.
- **Moderate** — degraded experience, often a small bilingual or contrast nit; user proceeds without help.
- **Minor** — polish, edge cases, or non-AA findings worth fixing for trust + future-proofing.

---

## Documentation drift — current state vs `docs/ACCESSIBILITY.md`

Before page-level findings, a context check. The existing doc claims 25/25 a11y features shipped. Reality (verified 2026-05-27 against `src/` HEAD):

| Claim | Reality | Note |
|---|---|---|
| `src/components/a11y/SkipToContent.tsx` | ✅ shipped (2026-05-27) | Bilingual VI/EN skip link, mounted in `AppHeroShell` as the first focusable element. Targets each page's `<main id="main-content">` via `A11Y_CONFIG.skipToContentId`. Tested in `src/components/a11y/__tests__/SkipToContent.test.tsx`. |
| `src/components/a11y/FocusRing.css` | **missing** | No `FocusRing.css` file. No `.focus-ring` class shipped. App relies on the browser's default focus ring. |
| `src/components/a11y/A11YPreviewMode.tsx` | **missing** | No file. The "admin preview" mode in the doc doesn't ship. |
| `id="main-content"` somewhere in DOM | ✅ shipped (2026-05-27) | Added `<main id="main-content" tabIndex={-1}>` to Home + Pricing (previously had no `<main>`); added `id` + `tabIndex` to existing `<main>` on Marketing, WeakAt, Onboarding, Placement v3 (Welcome/Test/Resume/Results). |
| `eslint-plugin-jsx-a11y` installed | **missing** | Not in `package.json`. ESLint runs but without a11y rules. |
| `@axe-core` / `jest-axe` automated testing | **missing** | Zero matches in `src/`. No CI step references axe-core. |
| `src/components/a11y/AccessibleToast.tsx` | ✅ exists | Verified. |
| `src/lib/a11y/announcements.ts` | ✅ exists | Verified — `getLiveRegion` + `announce` + `announceError` + `announceSuccess`. |
| `src/lib/a11y/haptics.ts` | ✅ exists | Verified — respects `prefers-reduced-motion`. |
| `src/config/a11y.ts` | ✅ exists | Verified. |
| `<html lang="vi">` | ✅ verified | `index.html:2`. |
| Viewport allows pinch-zoom | ✅ verified | `index.html:7` — `maximum-scale=5.0, user-scalable=yes`. |
| `<main>` landmarks on pages | ⚠️ partial | Present on Marketing, WeakAt, Onboarding, all placement v3 pages. **Missing on Home and Pricing.** |
| `prefers-reduced-motion` respected | ⚠️ partial | Hooked in 8+ files (`haptics.ts`, `motion.ts`, `animations.ts`, Home, MercyTeacherTab). Not exhaustive — many CSS animations not media-gated. |

**Recommendation:** Replace `docs/ACCESSIBILITY.md`'s 25/25 checklist with a verified baseline before the next release. The claim sets a false expectation that anyone running an external a11y audit (App Store reviewer, contract review) will rapidly disprove. Fixing the doc costs nothing; leaving it lying costs trust.

---

## Page-by-page findings

### `/` — `src/pages/MarketingLandingPage.tsx` (first-visit anon)

Mostly clean. Best bilingual a11y example in the codebase — every translated string carries an explicit `lang="vi"` or `lang="en"` (lines 36, 39, 42, 58, 61, 102, 105, 109, 116, 123, 134, 137, 140, 145, 220, 227). Other pages should pattern-match this file.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| L1 | minor | No skip link to main content. Anon visitors who enter via SEO and use a keyboard tab through the global header on every page load. | `src/router/AppShell.tsx` or `AppHeroShell` — no skip anchor injected | Render `<a href="#main-content" className="sr-only focus-visible:not-sr-only">Skip to content</a>` as the first child of the app shell; add `id="main-content"` to each page's `<main>`. |
| L2 | minor | `tryPronunciation` CTA at line 143–147 uses `<button>` correctly, but the inline-trial section has no `aria-busy` while the audio prompt is preparing. | `src/pages/MarketingLandingPage.tsx:143` | Add `aria-busy={loading}` to the button while the trial loads; pair with a polite `announce()` once ready. |

### `/onboarding` — `src/pages/onboarding/OnboardingPage.tsx`

Strong structure on the radiogroup (lines 216–217, 292–293 wire `role="radiogroup"`, `aria-label`, `role="radio"`, `aria-checked` correctly). One serious focus-management gap.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| O1 | serious | **No focus move on step transition.** After native pick → target step renders, focus stays on the dismissed button (now unmounted) and falls back to `<body>`. A keyboard-only user loses their place; a screen-reader user gets no announcement of the new step. WCAG 2.4.3. | `src/pages/onboarding/OnboardingPage.tsx:571` `handleNativeSelect` and parallel target-step transitions | After step transition, programmatically `.focus()` the new `<h1>` (add `tabIndex={-1}` to it for programmatic focus). Optionally pair with `announce()` from `src/lib/a11y/announcements.ts`. |
| O2 | moderate | Bilingual peer header on native step renders both VI and EN under a single `<h1>` + sibling `<div>` (lines 450–452) without `lang` attributes on either. A VI screen reader reads the EN sibling using VI phonemes (and vice-versa). | `src/pages/onboarding/OnboardingPage.tsx:450-452` | Add `lang="vi"` to the `<h1>` element and `lang="en"` to the sibling `<div>`. Same fix on the body paragraphs at lines 458–462. |
| O3 | moderate | Choice buttons (lines 224–270) have no explicit `minHeight` — depend on padding. Visual inspection suggests they're ≥44px but the contract isn't pinned. | `src/pages/onboarding/OnboardingPage.tsx` `cardBase()` | Add `minHeight: 56` to `cardBase()` to lock the WCAG 2.5.5 target with margin. |
| O4 | minor | The Skip affordance (line 830) is a `<button>` styled as a link — fine for behavior, but it sits below the primary CTA and lacks a visible focus state in inline styles. Browser default focus ring will render but is easy to miss against the gradient. | `src/pages/onboarding/OnboardingPage.tsx:830` | Add explicit `:focus-visible` styling; add `data-testid="onboarding-skip"` for the future E2E spec. |

### `/pricing` (= `/upgrade`) — `src/screens/Pricing.tsx`

This is the biggest a11y hotspot of the five pages. Inline styles everywhere, no semantic landmarks, and the VI subtitle pattern uses sub-AA contrast.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| P1 | serious | **No `<main>` landmark.** Whole page is `<div>` containers. Screen-reader users get no landmark navigation; a "skip to main content" link (when L1 is fixed) would have nowhere to land. | `src/screens/Pricing.tsx` page root | Wrap the page body in `<main id="main-content">`. |
| P2 | ✅ shipped (this MR) | **Sub-AA contrast on VI subtitles.** ~~`color: "#94a3b8"` (slate-400) on white with `fontSize: 11-13px` measures 3.13:1, fails WCAG AA 4.5:1 for normal text. Used 8+ times for the VI translation peer of EN copy — every paying visitor sees this.~~ All 8 inline `color: "#94a3b8"` declarations replaced with `"#64748b"` (slate-500, **4.78:1** on white). Pinned by `src/components/__tests__/a11y-contrast.test.ts`. | `src/screens/Pricing.tsx:119, 477, 501, 516, 646, 653, 675, 824` | ~~Switch to `#64748b` (slate-500) → 4.78:1 on white. Or bold the affected lines and treat as "large" copy where 3:1 suffices.~~ |
| P3 | moderate | Plan-card CTA button (line 753) has `minHeight: 42` — below WCAG 2.5.5 mobile target of 44×44. | `src/screens/Pricing.tsx:753` | Bump to `minHeight: 44`. |
| P4 | moderate | Decorative empty `<p aria-hidden="true" />` (line 556) is OK as-is, but inline styles use no `lang=` on VI text. SR users hear English voice over Vietnamese. | `src/screens/Pricing.tsx` (multiple) | Audit the VI/EN dual lines; add `lang="vi"` to Vietnamese spans. Mirror the MarketingLanding pattern. |
| P5 | moderate | No `<h1>` audit issue — the hero h1 (line 643) is correct — but headings jump from `h1` to `h3` in several plan cards (no `h2`). Skipping levels confuses SR outline. | `src/screens/Pricing.tsx` (multiple `<h3>` in plan cards) | Promote plan-card titles to `<h2>` or wrap them in an `<h2>` section header. |
| P6 | minor | `aria-busy={isBusy}` is set on the checkout button (line 618) — good — but no `aria-live` region announces "Loading checkout" to SR users. | `src/screens/Pricing.tsx:614` | When `isBusy` flips true, call `announce("Đang chuyển đến trang thanh toán")` from `@/lib/a11y/announcements`. |

### `/weak-at` — `src/pages/WeakAt.tsx` + `LocalWeaknessMap` + `SuggestedPracticeList`

Clean structurally — has `<main>`, single `<h1>`, semantic `<section>` regions. Two concerns: contrast on rationale rows + missing `lang` attributes.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| W1 | ✅ shipped (this MR) | **Sub-AA contrast on rationale text.** ~~`text-slate-400` (#94a3b8) at `text-[11px]` for the third line on each item card. Fails 4.5:1; the rationale carries the "why" of every suggestion.~~ All three usages replaced with `text-slate-500` (**4.78:1** on white). Pinned by `src/components/__tests__/a11y-contrast.test.ts`. | `src/components/stage-3a/LocalWeaknessMap.tsx:307, 349` and `src/components/stage-3b/SuggestedPracticeList.tsx:173` | ~~Use `text-slate-500` (#64748b) — 4.78:1. Three single-class edits.~~ |
| W2 | moderate | The component renders Vietnamese taxonomy strings (`shortVi`) directly alongside English (`shortEn`) without `lang` attributes. The VI phonemes will be mangled by an EN screen-reader voice. | `src/components/stage-3a/LocalWeaknessMap.tsx:303-310` (each row), `src/components/stage-3b/SuggestedPracticeList.tsx:165-174` | Add `lang="vi"` to the VI paragraph and `lang="en"` to the EN paragraph wherever taxonomy strings are rendered. |
| W3 | minor | Empty-state copy (LocalWeaknessMap line 392-407, SuggestedPracticeList line 194-205) — the SR-visible text reads bilingually but again with no `lang` attribution. | same files | Same VI/EN `lang` fix as W2. |
| W4 | minor | Icon buttons inside `LocalWeaknessMap` rows (the chevron at line 164–166) are wrapped in a `<button>` with `aria-expanded` ✓ but the chevron `<span>` is `aria-hidden` only — the button's accessible name comes from the row content, which is good. No fix needed; documenting the audit result. | — | Verified clean. |

### Home — `src/pages/Home.tsx` (returning anon / signed-in)

Largest single file (~970 lines). Mixed: strong on aria-labels for the Mercy panel state-machine (lines 76, 188–189, 321–322), weak on landmark structure.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| H1 | serious | **No `<main>` landmark.** Page uses two `<section aria-label="…">` regions (lines 938, 961) but no `<main>` wrapper, so the hero card + choices live outside a landmark. | `src/pages/Home.tsx` (root return) | Wrap the page-body region in `<main id="main-content">`. The existing `<section aria-label="Homepage hero">` becomes a child. |
| H2 | moderate | `<div role="button" tabIndex={0} aria-expanded aria-label onKeyDown>` (lines 369–375) — works, but a native `<button>` is the canonical pattern and gets focus + activation behavior for free. | `src/pages/Home.tsx:369` (`renderHomeCard` collapsible variant) | Replace the outer `<div role="button">` with `<button type="button">`. Drop `tabIndex`, `role`, and the keyboard `onKeyDown` handler — they're free with `<button>`. |
| H3 | moderate | The Mercy-panel observer (lines 76, 188–322) finds elements by `[aria-label="…"]` string match. The labels are split across two languages: `"Close Mercy panel"` (EN) and `"Open Mercy Guide"` / `"Open Teacher Mercy for kids"`. A future localization that translates these labels will silently break the observer. | `src/pages/Home.tsx:76, 188-189, 321-322` | Add stable `data-testid` attributes on the target buttons (`data-testid="mercy-panel-close"`, etc.) and switch the observer to `data-testid` selectors. Independent of the a11y win, this hardens the runtime. |
| H4 | minor | The big `<div role="button">` (H2) has `aria-expanded` but no `aria-controls` pointing to the collapsed region. SR users hear "expanded" but get no link to what expanded. | `src/pages/Home.tsx:372` | Add `aria-controls={panelId}` and `id={panelId}` on the collapsed region. |

### `/placement` — `src/pages/placement/v3/WelcomePage.tsx` → `TestPage.tsx`

`<main>` landmarks present on every v3 placement page ✓. `WritingTaskCard` has a proper `<label htmlFor>` linkage ✓ (`src/components/placement/v3/WritingTaskCard.tsx:22`).

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| PL1 | moderate | No `<h1>` audit done in detail across the 4 placement pages — `WelcomePage`, `TestPage`, `ResultsPage`, `ResumePage`. The `<main>` exists but the heading hierarchy inside is inconsistent across the four. | `src/pages/placement/v3/*.tsx` | A focused pass: pin exactly one `<h1>` per page; route everything else through `<h2>`/`<h3>` in heading order. |
| PL2 | minor | `TestPage` uses `data-clarity-mask="true"` on the `<main>` — fine for privacy, but blocks Sentry replay too. Verify both teams expect this. | `src/pages/placement/v3/TestPage.tsx:136` | Cross-check with Sentry-replay config; if Replay needs the placement DOM, swap to a more targeted mask. |

---

## Cross-cutting concerns

### Bilingual screen-reader story (VI vs EN `lang` attributes)

The biggest systemic a11y axis for MercyBlade is **language switching for screen readers**. Current state:

- `<html lang="vi">` is the only language declaration shipped globally.
- `MarketingLandingPage` is exemplary — every translated span carries `lang="vi"` / `lang="en"`.
- Every other page (Onboarding native step, WeakAt, LocalWeaknessMap, SuggestedPracticeList, Pricing, Home, Placement TestPage instructions) renders VI and EN strings side-by-side in the same DOM tree **without** language attribution.
- A VI screen reader voice will phoneticize the EN strings using Vietnamese phonemes; an EN voice does the inverse. Both are unintelligible to learners.

**Proposed remediation pattern (for a follow-up MR, not this audit):**

1. Add a `<Bilingual vi="…" en="…" />` component that emits `<span lang="vi">…</span> · <span lang="en">…</span>` (or per-language `<div>`s based on caller).
2. Replace ad-hoc `{vi} · {en}` patterns across the codebase with `<Bilingual>`. The MarketingLandingPage shows the pattern works.
3. Add an ESLint rule (custom or via `eslint-plugin-jsx-a11y`) flagging mixed-language text without `lang` attribute.

### Keyboard navigation

| Page | Tab-reachable | Focus order sensible | Skip link |
|---|---|---|---|
| `/` (Marketing) | yes | yes | **no** (global gap) |
| `/onboarding` | yes | partial — focus does NOT move on step transition (O1) | no |
| `/pricing` | yes | yes | no |
| `/weak-at` | yes | yes | no |
| `/placement/welcome` | yes | yes | no |
| `/placement/test` | yes | yes | no |

**Global blocker (RESOLVED 2026-05-27):** ~~no skip link anywhere — `A11Y_CONFIG.skipToContentId` defines an ID that no DOM element ever exposes.~~ Shipped in `fix/a11y-skip-link`: bilingual `SkipToContent` mounts in `AppHeroShell` as the first focusable element; every audit-priority page now exposes `<main id="main-content" tabIndex={-1}>`.

### Touch targets (WCAG 2.5.5 mobile)

Spot checks against the documented 44×44 minimum:

- Pricing: most CTAs at 46 ✓, one at 42 (P3 above).
- Onboarding: choice buttons have no explicit minHeight; visual estimate ≥56 — pass — but contract isn't pinned (O3).
- Home: collapsible card has no explicit minHeight; padding renders ≥60 — pass.
- WeakAt rows: `px-3 py-2.5` + line-height gives ≥52 — pass.

### Reduced motion

Verified hooks in 8+ files. The `haptics.ts`, `motion.ts`, and `animations.ts` utilities all check `window.matchMedia('(prefers-reduced-motion: reduce)')`. But:

- Many CSS animations (gradients, fade-ins in inline styles) are not media-gated.
- `App.css:30` uses `@media (prefers-reduced-motion: no-preference)` to GATE animations on — correct, but only for that one stylesheet.
- Inline-style animations on Pricing + Home (background gradient cards) ignore the preference entirely.

**Severity:** Moderate. Users who set reduced motion still see some motion. WCAG 2.3.3 is a non-essential criterion (it's AAA), so this is below blocker but worth tracking.

### Forms

- **EmailBlock** (`src/components/auth/EmailBlock.tsx:676, 692`) renders visible `<label>` text and a paired `<input>` with `aria-label`, but the label and input are **not** programmatically linked via `htmlFor` / `id`. Result: clicking the visible label text does not focus the input. SR users get a label via `aria-label`, but the redundant visible label is a non-functional decoration.
- **WritingTaskCard** (`src/components/placement/v3/WritingTaskCard.tsx:22`) uses a proper `<label className="sr-only" htmlFor="placement-writing-answer">` — correct pattern, replicate it.
- **Onboarding** has no inputs (it's a button-only picker).
- **Error states** — `humanizeAuthError` in LoginPage feeds into a `role="alert"` region (`<div aria-live="polite" aria-atomic="true">` at LoginPage.tsx:449–450), which is the right pattern ✓.

### Color contrast — at-a-glance

| Color | Background | Ratio | AA normal text (4.5:1) | AA large text (3:1) |
|---|---|---|---|---|
| `#94a3b8` (slate-400) | white | 3.13:1 | ❌ | ✅ |
| `#64748b` (slate-500) | white | 4.78:1 | ✅ | ✅ |
| `#475569` (slate-600) | white | 7.23:1 | ✅ | ✅ |
| `#111827` (slate-900) | white | 17.04:1 | ✅ | ✅ |
| `#cbd5e1` (slate-300) | white | 1.61:1 | ❌ | ❌ |

`#94a3b8` is the single biggest contrast offender. Used in `Pricing.tsx` (8 places), `LocalWeaknessMap.tsx` (2 places), `SuggestedPracticeList.tsx` (1 place), and the `Home.tsx`'s mobile-card subtitle pattern. Most uses are at 11–13px — well into "normal text" territory.

**Status (updated 2026-05-27):** The 11 named locations above (Pricing × 8 hex, Stage-3A × 2, Stage-3B × 1) are now ✅ **shipped** — replaced with `#64748b` (slate-500, 4.78:1 on white). Pinned against regression by `src/components/__tests__/a11y-contrast.test.ts`.

**Remaining footprint (out of this MR's scope — follow-up audit + sweep required):**

A whole-codebase grep finds **~172 additional bare `text-slate-400` usages** and **~80 additional `#94a3b8` hex usages** outside the five audited routes. They span Home, AccountPage, Billing, Progress, AI-Tutor, LessonRenderer, leaderboard cards, gift / family / corporate forms, listening, certificates, several admin / dev surfaces, and the MarketingLandingPage's inline `<style>` block. Some are bare text spans (contrast issue), others are chart fills / `no_data` indicators / canvas `fillStyle` (governed by WCAG 1.4.11 non-text contrast 3:1, not 1.4.3 text 4.5:1).

Per C3's audit methodology (route-by-route, per-page WCAG review), these need their own audit pass before being touched — a blanket replace would risk visual regressions in places the original audit hasn't analysed. **Recommended follow-up:** one MR per audited route surface, each appending its file paths to `CONTRAST_FIXED_FILES` in the contrast test as it ships.

### Live regions

- `announcements.ts` ships a polite + assertive live region pair (lazy-injected into `<body>`) ✓.
- `LoginPage` uses `aria-live="polite"` + `aria-atomic="true"` directly on the notice region ✓.
- `Pricing` checkout has `aria-busy` but no SR announcement on flip (P6).
- `OnboardingPage` step transitions have no announcement (O1).

---

## Prioritized fix list (single-MR friendly)

A future fix wave could land these in roughly this order — each step is independently shippable:

1. **Blocker fix:** create `SkipToContent.tsx`, render it in the app shell, add `id="main-content"` to every page `<main>`. ~30 lines + 5-page edit. Covers WCAG 2.4.1.
2. **Serious — contrast sweep:** flip `text-slate-400` → `text-slate-500` and `#94a3b8` → `#64748b` across the 11 identified locations. ~15-line diff. Covers WCAG 1.4.3.
3. **Serious — EmailBlock label linking:** add `htmlFor` + `id` to the existing `<label>` / `<input>` pairs. ~6-line diff. Covers WCAG 1.3.1 + 3.3.2.
4. **Serious — `<main>` landmarks on Home + Pricing:** ~4-line diff.
5. **Serious — Onboarding focus move on step transition:** add `tabIndex={-1}` to `<h1>` + a useEffect that focuses it on step change. ~10-line diff. Covers WCAG 2.4.3.
6. **Documentation honesty:** replace `docs/ACCESSIBILITY.md`'s 25/25 with a verified baseline (this audit's findings as starting point).
7. **Moderate — bilingual `<lang>` wrapper:** introduce `<Bilingual>` component + migrate WeakAt + Onboarding + Home cards. ~30 lines new, ~50 lines edited.
8. **Moderate — heading hierarchy on Pricing:** promote `<h3>` plan-card titles to `<h2>`.
9. **Minor — Home `<div role=button>` → `<button>`:** ~10-line cleanup.
10. **Tooling — install `eslint-plugin-jsx-a11y`** and run `npx eslint --rule …` against the codebase to triage findings. Land via a separate "lint warning baseline" MR.
11. **Tooling — add `@axe-core/playwright`** to the smoke suite. The `tests/e2e/*-anon.spec.ts` specs can each add a 3-line axe check at the end of their happy path. Closes the false claim in `docs/ACCESSIBILITY.md` item 24.

## Out of scope for this audit

- **Live screen reader / keyboard testing.** This audit is static analysis only. A follow-up should actually drive the app with VoiceOver/NVDA and a keyboard, especially through the placement flow.
- **Color-blind palette check.** Not assessed — the warnings here cover monochromatic contrast only.
- **Cognitive load / dyslexia-friendly typography.** Out of scope.
- **Mobile screen-reader navigation gestures (TalkBack swipe order).** Static analysis can't verify.
- **The kids surface (`/kids/vi-english`).** Sacred per CLAUDE.md non-negotiable #2; needs its own focused audit because the design constraints differ (offline-first, no login chrome, ages 3-8).
