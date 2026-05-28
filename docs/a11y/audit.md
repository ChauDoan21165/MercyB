# MercyBlade accessibility audit — 2026-05-27

> **Update 2026-05-27 — blocker shipped.** The skip-link blocker called out below is **fixed** in `fix/a11y-skip-link`. `SkipToContent.tsx` ships, mounts in `AppHeroShell` as the first focusable element, and every audit-priority page exposes `<main id="main-content" tabIndex={-1}>` as the focus target. The "Documentation drift" table is updated to reflect the new reality. The 15 remaining findings ship as separate dispatches. Original audit text below is preserved for context.
>
> **Update 2026-05-27 — serious finding "EmailBlock label linking" shipped.** Fix in `fix/a11y-form-label-linking`. The audit named two label/input pairs in `EmailBlock` — re-grepping the codebase surfaced **six** more sibling-style pairs with the same defect across auth-flow forms (`PhoneOtp`, `ResetPasswordPage`, legacy `Reset`). All eight now use `useId()` for instance-unique ids + `htmlFor`/`id` linkage. The orphaned `aria-label` on each input was removed — the visible `<label>` is now the canonical accessible name source. WCAG 1.3.1 + 3.3.2 covered. A pinned `FormLabelLinkage.a11y.test.tsx` guards against future regression on these forms.
>
> **Update 2026-05-27 — serious finding O1 "Onboarding focus on step transition" shipped.** Fix in `fix/a11y-onboarding-focus-management`. Each step's `<h1>` is now programmatically focusable (`tabIndex={-1}`); on `step` change, a `useEffect` focuses the new heading and announces its text via the shared polite live region (`@/lib/a11y/announcements`). Initial mount is intentionally skipped so a sighted keyboard user tabbing in from the header isn't snapped to the h1. WCAG 2.4.3 covered. Pinned by `OnboardingPage.focus.test.tsx` — 5 tests covering initial-mount-no-steal + `tabIndex` contract + focus-moves-on-VI-pick + focus-moves-on-EN-pick + announce-payload.
>
> **Update 2026-05-27 — moderate finding O2 "Onboarding bilingual lang attrs" shipped.** Fix in `fix/a11y-next-serious-finding`. The pre-pick native step renders VI and EN as peers (locked #14, both audiences present). Each language now carries its own `lang` attribute: `<h1 lang="vi">`, sibling `<div lang="en">`, body `<p lang="vi">` + `<p lang="en">`. A VI screen-reader voice now pronounces VI text using Vietnamese phonemes and the EN sibling using English phonemes, instead of mangling one with the other's phoneme set. WCAG 3.1.2 covered. Pinned by `OnboardingPage.lang.test.tsx` — 6 tests covering each `lang` attribute, DOM order (VI before EN per locked #14), and no spurious regression on post-pick single-language steps. **All 5 originally-named "serious" rows in this audit are now de facto resolved** — picked O2 from the moderate tier per the dispatch's fallback rule.
>
> **Audit hygiene note:** the P1 (Pricing missing `<main>`) and H1 (Home missing `<main>`) rows in the per-page tables below were marked "serious" but were de facto resolved by !70 (`fix/a11y-skip-link`) — the top-of-file banner already names this, but the row strikethroughs were missed. Striking them through here for consistency.
>
> **Update 2026-05-27 — moderate finding W2 "WeakAt taxonomy lang attrs" shipped.** Fix in `fix/a11y-weakat-taxonomy-lang`. Second of three sibling lang-attr fixes (O2 done, **P4** still pending — Pricing VI text). `LocalWeaknessMap` tags every taxonomy paragraph: L1 + placement + pronunciation rows each carry `<p lang="vi">` for `shortVi`/`exampleVi` and `<p lang="en">` for `shortEn`/`exampleEn`. Pronunciation meta + QuietMeta (both VI-only) carry `lang="vi"`. Section headings tag VI `<h3>` + EN subtitle. Global empty state tagged. `SuggestedPracticeList` mirrors the pattern: list h3 + subtitle, every row's `viLabel`/`enLabel`/`rationale` (engine-emitted VI), empty state. WCAG 3.1.2. Pinned by `LocalWeaknessMap.lang.test.tsx` (6 tests) + `SuggestedPracticeList.lang.test.tsx` (5 tests) — both include a sweep test that asserts every non-empty `<p>` in the rendered fixture declares a language.
>
> **Update 2026-05-27 — moderate finding P4 "Pricing VI lang attrs" shipped — closes the O2/W2/P4 trio.** Fix in `fix/a11y-pricing-vi-lang`. Third and last of the inline lang-attr sweep. `src/screens/Pricing.tsx` is now fully tagged: hero h1 + VI subtitle, the bilingual EN/VI hero paragraph pair, the feature-grid checkmark rows, every plan card title's EN/VI span pair, every plan's subtitle/body/price `<p>`, the shared `BiText` button component, the auto-renewal disclosure pair, the legal-link anchors (split into per-language spans), the iOS-vs-web billing notice. WCAG 3.1.2. Pinned by `Pricing.lang.test.tsx` (7 tests) including the sibling sweep guard. **All three sibling lang-attr fixes (O2/W2/P4) are now shipped — the inline pattern has been repeated 3× across `OnboardingPage`, `LocalWeaknessMap`/`SuggestedPracticeList`, and `Pricing`. Extracting a shared `<Bilingual>` wrapper is the natural next step** per the Rule of Three; that extraction is deliberately deferred to its own dispatch.

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
| O1 | ~~serious~~ **RESOLVED 2026-05-27** | ~~No focus move on step transition.~~ Shipped in `fix/a11y-onboarding-focus-management`: `StepHeader`'s `<h1>` is programmatically focusable via `tabIndex={-1}`; a `useEffect` on `step` calls `headingRef.current.focus()` + `announce(headingText)`. Initial mount intentionally skipped (no auto-steal). Tested in `OnboardingPage.focus.test.tsx`. |
| O2 | ~~moderate~~ **RESOLVED 2026-05-27** | ~~Bilingual peer header on native step renders both VI and EN under a single `<h1>` + sibling `<div>` without `lang` attributes on either.~~ Shipped in `fix/a11y-next-serious-finding`: `<h1 lang="vi">`, sibling `<div lang="en">`, body `<p lang="vi">` + `<p lang="en">`. Tested in `OnboardingPage.lang.test.tsx`. |
| O3 | moderate | Choice buttons (lines 224–270) have no explicit `minHeight` — depend on padding. Visual inspection suggests they're ≥44px but the contract isn't pinned. | `src/pages/onboarding/OnboardingPage.tsx` `cardBase()` | Add `minHeight: 56` to `cardBase()` to lock the WCAG 2.5.5 target with margin. |
| O4 | minor | The Skip affordance (line 830) is a `<button>` styled as a link — fine for behavior, but it sits below the primary CTA and lacks a visible focus state in inline styles. Browser default focus ring will render but is easy to miss against the gradient. | `src/pages/onboarding/OnboardingPage.tsx:830` | Add explicit `:focus-visible` styling; add `data-testid="onboarding-skip"` for the future E2E spec. |

### `/pricing` (= `/upgrade`) — `src/screens/Pricing.tsx`

This is the biggest a11y hotspot of the five pages. Inline styles everywhere, no semantic landmarks, and the VI subtitle pattern uses sub-AA contrast.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| P1 | ~~serious~~ **RESOLVED 2026-05-27** | ~~No `<main>` landmark.~~ Shipped in `fix/a11y-skip-link` (!70). `<main id="main-content" tabIndex={-1}>` wraps the page body. Row marked stale in audit-hygiene pass during `fix/a11y-next-serious-finding`. |
| P2 | ✅ shipped (this MR) | **Sub-AA contrast on VI subtitles.** ~~`color: "#94a3b8"` (slate-400) on white with `fontSize: 11-13px` measures 3.13:1, fails WCAG AA 4.5:1 for normal text. Used 8+ times for the VI translation peer of EN copy — every paying visitor sees this.~~ All 8 inline `color: "#94a3b8"` declarations replaced with `"#64748b"` (slate-500, **4.78:1** on white). Pinned by `src/components/__tests__/a11y-contrast.test.ts`. | `src/screens/Pricing.tsx:119, 477, 501, 516, 646, 653, 675, 824` | ~~Switch to `#64748b` (slate-500) → 4.78:1 on white. Or bold the affected lines and treat as "large" copy where 3:1 suffices.~~ |
| P3 | moderate | Plan-card CTA button (line 753) has `minHeight: 42` — below WCAG 2.5.5 mobile target of 44×44. | `src/screens/Pricing.tsx:753` | Bump to `minHeight: 44`. |
| P4 | ~~moderate~~ **RESOLVED 2026-05-27** | ~~Inline styles use no `lang=` on VI text. SR users hear English voice over Vietnamese.~~ Shipped in `fix/a11y-pricing-vi-lang`: hero, feature grid, plan cards, BiText buttons, auto-renewal disclosure, legal-link anchors, iOS/web billing notice — every bilingual block split into per-language spans/paragraphs with `lang` declarations. Pinned by `Pricing.lang.test.tsx` (7 tests + sweep). Closes the O2/W2/P4 inline trio. |
| P5 | moderate | No `<h1>` audit issue — the hero h1 (line 643) is correct — but headings jump from `h1` to `h3` in several plan cards (no `h2`). Skipping levels confuses SR outline. | `src/screens/Pricing.tsx` (multiple `<h3>` in plan cards) | Promote plan-card titles to `<h2>` or wrap them in an `<h2>` section header. |
| P6 | minor | `aria-busy={isBusy}` is set on the checkout button (line 618) — good — but no `aria-live` region announces "Loading checkout" to SR users. | `src/screens/Pricing.tsx:614` | When `isBusy` flips true, call `announce("Đang chuyển đến trang thanh toán")` from `@/lib/a11y/announcements`. |

### `/weak-at` — `src/pages/WeakAt.tsx` + `LocalWeaknessMap` + `SuggestedPracticeList`

Clean structurally — has `<main>`, single `<h1>`, semantic `<section>` regions. Two concerns: contrast on rationale rows + missing `lang` attributes.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| W1 | ✅ shipped (this MR) | **Sub-AA contrast on rationale text.** ~~`text-slate-400` (#94a3b8) at `text-[11px]` for the third line on each item card. Fails 4.5:1; the rationale carries the "why" of every suggestion.~~ All three usages replaced with `text-slate-500` (**4.78:1** on white). Pinned by `src/components/__tests__/a11y-contrast.test.ts`. | `src/components/stage-3a/LocalWeaknessMap.tsx:307, 349` and `src/components/stage-3b/SuggestedPracticeList.tsx:173` | ~~Use `text-slate-500` (#64748b) — 4.78:1. Three single-class edits.~~ |
| W2 | ~~moderate~~ **RESOLVED 2026-05-27** | ~~The component renders Vietnamese taxonomy strings (`shortVi`) directly alongside English (`shortEn`) without `lang` attributes.~~ Shipped in `fix/a11y-weakat-taxonomy-lang`: every taxonomy `<p>` across `LocalWeaknessMap` + `SuggestedPracticeList` (L1/placement/pronunciation rows, section headings, empty states, VI meta lines) carries `lang="vi"` or `lang="en"`. Tested in `LocalWeaknessMap.lang.test.tsx` + `SuggestedPracticeList.lang.test.tsx` (sweep tests pin the contract). |
| W3 | minor | Empty-state copy (LocalWeaknessMap line 392-407, SuggestedPracticeList line 194-205) — the SR-visible text reads bilingually but again with no `lang` attribution. | same files | Same VI/EN `lang` fix as W2. |
| W4 | minor | Icon buttons inside `LocalWeaknessMap` rows (the chevron at line 164–166) are wrapped in a `<button>` with `aria-expanded` ✓ but the chevron `<span>` is `aria-hidden` only — the button's accessible name comes from the row content, which is good. No fix needed; documenting the audit result. | — | Verified clean. |

### Home — `src/pages/Home.tsx` (returning anon / signed-in)

Largest single file (~970 lines). Mixed: strong on aria-labels for the Mercy panel state-machine (lines 76, 188–189, 321–322), weak on landmark structure.

| # | Severity | Finding | Location | Proposed fix |
|---|---|---|---|---|
| H1 | ~~serious~~ **RESOLVED 2026-05-27** | ~~No `<main>` landmark.~~ Shipped in `fix/a11y-skip-link` (!70). `<main id="main-content" tabIndex={-1} style={frame}>` wraps the page body; the existing `<section aria-label="Homepage hero">` is now a child. Row marked stale in audit-hygiene pass during `fix/a11y-next-serious-finding`. |
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
| `/onboarding` | yes | ✅ focus moves on step transition (O1 RESOLVED 2026-05-27) | yes (post-blocker) |
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

- ~~**EmailBlock** (`src/components/auth/EmailBlock.tsx:676, 692`) renders visible `<label>` text and a paired `<input>` with `aria-label`, but the label and input are **not** programmatically linked via `htmlFor` / `id`. Result: clicking the visible label text does not focus the input. SR users get a label via `aria-label`, but the redundant visible label is a non-functional decoration.~~ **RESOLVED 2026-05-27** in `fix/a11y-form-label-linking`. Fix also covered the same defect in `PhoneOtp.tsx` (phone + SMS-code), `ResetPasswordPage.tsx` (new + confirm password), and legacy `Reset.tsx` (new + confirm password) — 8 input/label pairs total. All use `useId()` for instance-unique ids.
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

**Status (updated 2026-05-27):**

**Wave 0 — !68 (P2 + W1, 11 locations):** ✅ shipped — Pricing × 8 hex + Stage-3A × 2 class + Stage-3B × 1 class, all → `#64748b` / `text-slate-500`. Pinned by `src/components/__tests__/a11y-contrast.test.ts`.

**Wave 1 — !72 (Home / Account / AI-Tutor, 14 locations):** ✅ shipped — 14 text-content occurrences across 6 files, all → `text-slate-500` / `#64748b`:

| File | Locations | Form |
|---|---|---|
| `src/components/home/FocusAreasCard.tsx` | 3 | Tailwind class |
| `src/components/home/FocusAreasMicroLessonDialog.tsx` | 2 | Tailwind class |
| `src/components/ai-tutor/ConversationMode.tsx` | 1 | Tailwind class |
| `src/components/ai-tutor/CorrectionMode.tsx` | 3 | Tailwind class |
| `src/components/ai-tutor/TutorMemoryCard.tsx` | 1 | Tailwind class |
| `src/pages/account/NotificationPreferences.tsx` | 4 | inline `#94a3b8` hex |

**Wave-1 documented exceptions (intentional design, NOT fixed):**

| File:line | Why exempt |
|---|---|
| `src/pages/Home.tsx:1125` | Decorative `<ChevronRight aria-hidden="true">` icon. WCAG 1.4.3 applies to text; 1.4.11 (graphical objects 3:1) applies to non-decorative graphics. `aria-hidden` makes this neither — screen readers skip it entirely. |
| `src/pages/AccountPage.tsx:767, 785, 801, 814` | Decorative `▾` disclosure chevrons, all `aria-hidden`. Same reasoning. |
| `src/components/home/WeeklyProgressWidget.tsx:53` | `scoreColor()`'s `null` branch — the score number renders at `fontSize: 26` + `fontWeight: 950`. WCAG large-text threshold (≥18pt or ≥14pt bold) is 3:1, not 4.5:1; slate-400 on white = 3.13:1 PASSES. |
| `src/components/ai-tutor/ConversationMode.tsx:276` | `disabled:text-slate-400` on a disabled CTA. WCAG SC 1.4.3 explicitly exempts inactive UI components. |
| `src/components/ai-tutor/CorrectionMode.tsx:150` | Same — `disabled:text-slate-400` on a disabled submit button. |

The static guard's regex skips `disabled:` / `dark:` / `hover:` / `focus:` / `group-*:` / `peer-*:` variant prefixes and lines containing `aria-hidden`, so these exceptions don't need a per-line allow-list. The `WeeklyProgressWidget` null-score is in a file outside `CONTRAST_FIXED_FILES`; if/when that file is brought into the guard, a per-line exception entry will be needed.

**Wave 2 — !83 (Progress / Billing / Listening, 26 locations):** ✅ shipped — 26 text-content `#94a3b8` hex literals across 7 files, all → `#64748b`:

| File | Locations | Form |
|---|---|---|
| `src/pages/Progress.tsx` | 10 | inline `#94a3b8` hex |
| `src/pages/Billing.tsx` | 5 | inline `#94a3b8` hex |
| `src/pages/BillingSuccess.tsx` | 3 | inline `#94a3b8` hex |
| `src/pages/BillingSuccessPage.tsx` | 2 | inline `#94a3b8` hex |
| `src/components/pricing/IapPlanCard.tsx` | 2 | inline `#94a3b8` hex |
| `src/pages/listening/Library.tsx` | 2 | inline `#94a3b8` hex |
| `src/pages/listening/ClipPlayer.tsx` | 2 | inline `#94a3b8` hex |

**Wave-2 documented exceptions (intentional design, NOT fixed):**

| File:line | Why exempt |
|---|---|
| `src/pages/Progress.tsx` `scoreColor()` null branch | The hex is returned for `n === null` and consumed in two AA-compliant contexts: (1) the score number renders at `fontSize: 56` + `fontWeight: 950` — WCAG large-text threshold 3:1, slate-400 on white = 3.13:1 PASSES; (2) chart `<Bar>` fills — WCAG 1.4.11 non-text contrast 3:1, same 3.13:1 PASSES. Keeping the lighter shade preserves visual hierarchy ("no data yet" reads as quieter than a real low score, which uses slate-500). Marked in-source with `// a11y-contrast:exception`. |

**Inline exception-marker mechanism (added in !83):** the contrast test has a third escape hatch — an inline `// a11y-contrast:exception` marker on the same line as a `text-slate-400` / `#94a3b8` literal. Used sparingly for one-off cases where the literal IS the intended design and the WCAG threshold is genuinely met (typically large-text or non-text contexts). Every marker must pair with a rationale comment on the line(s) above AND an entry in this audit doc. Two other escape hatches still apply: variant prefixes (`disabled:` / `dark:` / etc.) and `aria-hidden` decorative elements.

**Wave 3 — !88 (LessonRenderer + leaderboard, 15 locations):** ✅ shipped — 14 → `text-slate-500` + 1 → `text-slate-600`, across 4 files:

| File | Locations | Form | Token chosen |
|---|---|---|---|
| `src/components/languages/LessonRenderer.tsx` | 9 | Tailwind class | `text-slate-500` (4.78:1 on white) |
| `src/components/languages/LessonRenderer.tsx` | 1 | Tailwind class | `text-slate-600` (6.12:1 on `bg-slate-100`) |
| `src/components/leaderboard/WeeklyLeaderboard.tsx` | 2 | Tailwind class | `text-slate-500` |
| `src/components/leaderboard/LeaderboardCard.tsx` | 3 | Tailwind class | `text-slate-500` |
| `src/pages/leaderboards/MonthlyReferralLeaderboard.tsx` | 1 | Tailwind class | `text-slate-500` |

**Wave 3 used a per-location darker token for the first time.** `LessonRenderer.tsx`'s `FallbackBadge` is a `text-[9px]` chip on `bg-slate-100` — at that background lightness, slate-500 only clears 4.32:1 (FAILS 4.5:1). The single chip uses `text-slate-600` (6.12:1) instead. Every other wave-3 location is on white-or-near-white and slate-500 clears with margin.

**Wave-3 documented exceptions:** none.

**Wave-3 bilingual split:** unusually mixed because LessonRenderer is the multi-language lesson surface (any of VI/EN/JA/KO/ZH/FR/DE/ES can be the lesson's native script).
- **Explicit VI peer content:** 3 of 15 (`leaderboardCopy.*.vi` on `LeaderboardCard` lines 123 / 152 / 236).
- **Language-agnostic:** 12 of 15 — rank numerals (`#1`, `#2`, …), attempts counts, romanization spans (any non-Roman script), phonetic transcriptions (IPA), register labels (`FORMAL` / `INFORMAL` / …), example sentences in the lesson's own native language. These darken for every learner regardless of language pair — including Vietnamese learners studying any of the supported targets.

**Wave 4 — !97 (forms + certificates, 27 locations):** ✅ shipped — 23 Tailwind-class form fixes + 3 hex certificate fixes + 1 canvas `fillStyle` fix, across 11 files:

| File | Locations | Form |
|---|---|---|
| `src/components/corporate/CorporateAccountForm.tsx` | 6 | Tailwind class |
| `src/components/corporate/InviteSeatsForm.tsx` | 1 | Tailwind class |
| `src/components/family/InviteFamilyMemberForm.tsx` | 1 | Tailwind class |
| `src/components/family/FamilyPlanCard.tsx` | 1 | Tailwind class |
| `src/components/gift/PurchaseGiftForm.tsx` | 3 | Tailwind class |
| `src/components/gift/MyGiftsList.tsx` | 1 | Tailwind class |
| `src/components/contribute/ContributeSentenceForm.tsx` | 5 | Tailwind class |
| `src/pages/stories/ShareStory.tsx` | 5 | Tailwind class |
| `src/components/certificates/Certificate.tsx` | 1 | inline `#94a3b8` hex (VI subtitle on certificate UI) |
| `src/pages/certificates/CertificatesGalleryPage.tsx` | 2 | inline `#94a3b8` hex (date label + footer link wrapper) |
| `src/lib/certificates/certificateExport.ts` | 1 | canvas `ctx.fillStyle` (VI subtitle painted onto exported PDF/PNG at 22px regular — normal text on canvas, same 4.5:1 threshold applies) |

**Wave-4 documented exceptions:** none.

**Wave-4 bilingual split** — forms-heavy mix differs from wave 3:
- **Explicit VI text:** Certificate.tsx VI subtitle + certificateExport.ts canvas VI subtitle + FamilyPlanCard.tsx VI subtitle (3 of 27).
- **EN labels paired with VI primary copy** (dominant form pattern): all 6 CorporateAccountForm hints, InviteSeatsForm "Invite seats", all 5 ContributeSentenceForm EN labels ("English sentence" / "Vietnamese translation" / "Context" / "CEFR" / "Suggested L1 rule"), all 5 ShareStory EN sub-prompts, PurchaseGiftForm "/ mo" suffix — **18 of 27**. These EN labels sit next to bold VI primary labels; darkening them helps users who can't fully read the EN label still see the form's structure.
- **Bilingual VI / EN hints** (parenthetical "tuỳ chọn / optional", "Mã / Code", etc.): 4 of 27.
- **Language-neutral** (dates, conditional warning state, link wrappers): 2 of 27.

Net VI-positive: 25 of 27 directly benefit Vietnamese learners (either VI text or EN-paired-with-VI labels they navigate forms by).

**Notable canvas-text fix:** `certificateExport.ts` paints the VI subtitle onto the user-exported PDF / PNG certificate. That asset is what learners share with employers, family, or social platforms — the contrast story extends to non-DOM rendering. Fixing this is a 1-line `ctx.fillStyle` change that improves every certificate exported from this MR forward (already-exported PNGs are unchanged).

**Wave 5 — this MR (speech-history + admin, 13 fixes + 4 exceptions):** ✅ shipped — 12 → `slate-500` + 1 → `slate-600` (on `bg-slate-100`) + 4 chart-border `a11y-contrast:exception` markers (non-text 1.4.11 3:1 already met), across 10 files:

| File | Fix locations | Exception locations | Form |
|---|---|---|---|
| `src/pages/speech/SpeechHistoryPage.tsx` | 4 (`scoreColor` null + `trendColor.insufficient` + VI empty-state + 11px caption) | — | inline `#94a3b8` hex |
| `src/pages/admin/InterviewPromptsModeration.tsx` | 2 | — | Tailwind class |
| `src/pages/admin/StoryModeration.tsx` | 1 | — | Tailwind class |
| `src/pages/admin/TeacherFeedbackTriage.tsx` | 1 | — | Tailwind class |
| `src/pages/admin/BehavioralAnalytics.tsx` | 2 | — | inline `#94a3b8` hex |
| `src/pages/admin/RetentionDashboard.tsx` | 2 → `#64748b` + **1 → `#475569`** (TIER_COLOR n/a fg on `bg-slate-100`) | — | inline hex |
| `src/pages/admin/LatencyMonitoring.tsx` | — | 1 (STATUS_BORDER `insufficient_data`) | inline hex (border) |
| `src/pages/admin/FrontendPerformance.tsx` | — | 1 (RATING_COLOR `no_data`) | inline hex (border) |
| `src/pages/admin/SloDetail.tsx` | — | 1 (STATUS_BORDER `no_data`) | inline hex (border) |
| `src/pages/admin/SloDashboard.tsx` | — | 1 (STATUS_BORDER `no_data`) | inline hex (border) |

**Wave-5 documented exceptions** (4, all chart-border non-text uses where slate-400 on white = 3.13:1 PASSES WCAG 1.4.11 3:1; marked in-source with `// a11y-contrast:exception`):

| File:identifier | Consumer | WCAG citation |
|---|---|---|
| `LatencyMonitoring.tsx` `STATUS_BORDER.insufficient_data` | `borderColor:` on status badge | 1.4.11 non-text 3:1 → 3.13:1 PASSES |
| `FrontendPerformance.tsx` `RATING_COLOR.no_data` | `borderColor:` on rating chip | 1.4.11 non-text 3:1 → 3.13:1 PASSES |
| `SloDetail.tsx` `STATUS_BORDER.no_data` | `borderColor:` on SLO status badge | 1.4.11 non-text 3:1 → 3.13:1 PASSES |
| `SloDashboard.tsx` `STATUS_BORDER.no_data` | `borderColor:` on SLO dashboard status badge | 1.4.11 non-text 3:1 → 3.13:1 PASSES |

**Wave 5 audience framing:** admin dashboards are owner-only (only Chau is admin level 10 in prod), so the "many users see this" framing doesn't apply — the fixes still matter for Chau's daily use, but the wave-5 contrast story is **internal-tooling polish**, not learner-facing accessibility. `SpeechHistoryPage` is the exception: it's a signed-in learner surface and DOES darken VI/EN copy users see (`emptyState.vi`, the score number's null state, the trend "insufficient" badge).

**Wave 5 also confirmed the wave-3 slate-100 precedent.** `RetentionDashboard.tsx`'s `TIER_COLOR.n/a` cell renders a text fg on a `bg-slate-100` background — slate-500 fails at 4.0:1 here, slate-600 clears 6.4:1. Same pattern as wave 3's `LessonRenderer` `FallbackBadge`. Future waves that touch any `bg-slate-100`/`bg-slate-200` site should pre-emptively pick slate-600.

**Remaining footprint (out of this MR's scope — wave-6+ sweep):**

After waves 0+1+2+3+4+5, whole-codebase grep finds **~85 remaining bare `text-slate-400`** + **~45 remaining `#94a3b8` hex** usages. The long tail is increasingly:
- Non-text contexts (chart fills, `no_data` indicators, canvas `fillStyle` on misc components) governed by 1.4.11 3:1.
- The `MarketingLandingPage` inline `<style>` block (one-off CSS file).
- Scattered one-offs in routes that haven't been audited.

**Recommended next waves:**

- **Wave 6** — `MarketingLandingPage` inline `<style>` block (one-off CSS file; outside the Tailwind/inline-React patterns; learner-facing landing page so contrast matters for first impressions).
- **Wave 7 (cleanup)** — long-tail non-text reclassification: walk each remaining usage and either exempt (with `a11y-contrast:exception` marker) when it's genuinely 1.4.11 non-text or fix when it's text we missed. Goal: take `CONTRAST_FIXED_FILES` from the 41 files at end-of-wave-5 up to near-total coverage of the codebase, treating exception markers as the long-tail mechanism.

Each wave appends its file paths to `CONTRAST_FIXED_FILES` in the contrast test as it ships.

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
3. **Serious — EmailBlock label linking:** ~~add `htmlFor` + `id` to the existing `<label>` / `<input>` pairs. ~6-line diff. Covers WCAG 1.3.1 + 3.3.2.~~ **SHIPPED 2026-05-27**; the fix also swept three sibling auth components flagged during implementation (`PhoneOtp`, `ResetPasswordPage`, legacy `Reset`).
4. **Serious — `<main>` landmarks on Home + Pricing:** ~4-line diff.
5. **Serious — Onboarding focus move on step transition:** ~~add `tabIndex={-1}` to `<h1>` + a useEffect that focuses it on step change. ~10-line diff. Covers WCAG 2.4.3.~~ **SHIPPED 2026-05-27** in `fix/a11y-onboarding-focus-management`. `StepHeader` accepts a `headingRef`; OnboardingPage focuses the new step's `<h1>` and announces its text on transition. Initial render gated to avoid auto-steal.
6. **Documentation honesty:** replace `docs/ACCESSIBILITY.md`'s 25/25 with a verified baseline (this audit's findings as starting point).
7. **Moderate — bilingual `<lang>` wrapper:** introduce `<Bilingual>` component + migrate WeakAt + Onboarding + Home cards. ~30 lines new, ~50 lines edited. **Inline trio shipped 2026-05-27:** Onboarding (O2) in `fix/a11y-next-serious-finding`; WeakAt (W2) in `fix/a11y-weakat-taxonomy-lang`; Pricing (P4) in `fix/a11y-pricing-vi-lang`. **Next step — extract a shared `<Bilingual>` wrapper.** The inline pattern is now repeated 3× (Rule of Three satisfied): single h1+p / span/span / p+p shapes recur across all three surfaces. A `<Bilingual vi="…" en="…" />` helper would deduplicate ~60 lines and give a single place to evolve the lang-attribute contract. Home cards (H2-adjacent) still pending — should land in the same MR as the `<Bilingual>` extraction so the wrapper has its third real consumer on day one.
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
