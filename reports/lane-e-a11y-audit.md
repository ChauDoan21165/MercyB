# Lane E6 — Accessibility Audit (Report Only)

**Scope:** `src/components/ui/*`, shared layout components, main pages — for a mobile-first
(375–414px) Vietnamese-learner audience.
**Stance:** Report only. No source edits, no fixes, no test files. Every "Suggested fix" is for a LATER lane.
**Standards referenced:** WCAG 2.1 AA, repo's own `src/config/a11y.ts` (44px touch target), `src/design-system/tokens.ts` (`touchTarget`).

---

## Summary

The codebase has a real a11y foundation — `SkipToContent` is mounted in `AppRouter`, `EmailBlock`
labels its email/password inputs and gives OTP inputs `aria-label`, `MarketingLandingPage` is a model
page (proper `lang` per element, `aria-labelledby` sections, clean `h1→h2→h3` order), `button.tsx`
composes the shared `touchTarget` token so the default button is 44px-compliant, and Radix primitives
(Dialog/Sheet/AlertDialog) ship correct focus trap + Escape + focus restore for free.

The gaps are concentrated in: (1) **reduced-motion is declared but never enforced** — the global
infinite presence animations have zero `prefers-reduced-motion` guard; (2) **the skip-link target
is missing on the most common shell** (`AppShell`'s `<main>` has no `id="main-content"`), so the
skip link silently no-ops on every AppShell route; (3) **bilingual VI·EN strings inside a single
`lang="vi"` document are not language-tagged**, so screen readers mispronounce the English half; and
(4) icon-only buttons in non-UI-library surfaces and a few base primitives below the 44px floor.

**Gaps found: 14** (P0: 3, P1: 6, P2: 5)

---

## P0 — Blockers

### P0-1 — Global infinite animations have no `prefers-reduced-motion` guard
- **File:** `src/index.css` (e.g. lines ~199, 219, 247, 251, 271 — `mercy-breathe`, `halo-pulse`, `wing-flutter-left/right`, `wave-expand`, all `… infinite`)
- **Issue:** `src/index.css` contains **0** `@media (prefers-reduced-motion: reduce)` blocks (verified by grep), yet ships multiple always-on `infinite` keyframe animations on the Mercy presence/halo/wings. `src/config/a11y.ts` exposes `enableReducedMotion: true` and `getA11YConfig()` reads the media query, but nothing in the global stylesheet acts on it. `src/App.css` only has the inverse `@media (prefers-reduced-motion: no-preference)` gate for its own animations — the `index.css` presence animations are unconditional.
- **Why it matters:** WCAG 2.3.3 (Animation from Interactions) and vestibular-disorder safety. Continuous looping motion behind the primary character can trigger nausea/dizziness; a user who has explicitly set "reduce motion" at the OS level still gets full animation. This is the single most user-harmful gap and it contradicts the app's own stated config.
- **Suggested fix (later lane):** Add a single `@media (prefers-reduced-motion: reduce) { .mercy-breathe, .halo-pulse, .wing-flutter-left, .wing-flutter-right, .wave-expand { animation: none !important; } }` block to `src/index.css` (or a `motion-reduce:` Tailwind variant on the elements). Wire `getA11YConfig().prefersReducedMotion` to gate JS-driven motion where CSS can't reach.

### P0-2 — Skip-link target absent on the primary `AppShell` (`SkipToContent` no-ops)
- **Files:** `src/components/layout/AppShell.tsx:103` (`<main className={…}>` — no `id`); target consumer `src/components/a11y/SkipToContent.tsx:40` resolves `document.getElementById('main-content')`.
- **Issue:** `SkipToContent` is mounted once globally in `src/router/AppRouter.tsx:630` and jumps to `#main-content`. Several pages set `id="main-content"` on their own `<main>` (Home, MarketingLanding, Pricing, placement v3, ParentDashboard, Onboarding, WeakAt), but `AppShell`'s `<main>` — the wrapper used by the broad route set — does **not**. On any AppShell route without its own tagged `<main>`, pressing the skip link focuses nothing / scrolls nowhere.
- **Why it matters:** WCAG 2.4.1 (Bypass Blocks). Keyboard and switch-control users on mobile rely on the skip link to bypass the sticky header; a dangling target makes the documented mechanism silently fail and is worse than no skip link (it appears to work, then doesn't).
- **Suggested fix (later lane):** Add `id="main-content" tabIndex={-1}` to the `<main>` in `AppShell.tsx`. Audit for double-id collisions on pages that already set it (only one `#main-content` per document is valid).

### P0-3 — Bilingual VI·EN strings render inside `lang="vi"` with no language switch
- **Files:** `index.html:2` sets `<html lang="vi">`; mixed strings appear throughout, e.g. `src/components/layout/AppShell.tsx` brand split, `src/components/layout/GlobalHeader.tsx:117` `"Sign out / Đăng xuất"`, `:128` `"Copy UUID"`, `:153` `"Sign in / Đăng nhập"`; `src/components/auth/EmailBlock.tsx:559` `aria-label="6-digit code from your email"`.
- **Issue:** The document is globally Vietnamese. English UI text and English `aria-label`s embedded in that document are not wrapped with `lang="en"`, so a Vietnamese TTS engine attempts to pronounce English words with Vietnamese phonotactics (and vice-versa). `MarketingLandingPage.tsx` does this correctly (`<p lang="en">`, `<h1 lang="vi">`) and is the pattern to copy — the rest of the app does not.
- **Why it matters:** WCAG 3.1.2 (Language of Parts). For a Vietnamese-learner audience this is acute: the screen reader's mispronunciation of the English half defeats the bilingual learning intent and can make navigation labels unintelligible. Vietnamese-first is a product non-negotiable.
- **Suggested fix (later lane):** For mixed strings, split into `<span lang="vi">…</span><span lang="en">…</span>`, or adopt the existing `src/components/Bilingual.tsx` helper everywhere bilingual chrome is rendered. For mixed `aria-label`s, prefer a single-language label or set `lang` on the host element.

---

## P1 — Important

### P1-1 — `GlobalHeader` status pill and UUID chip are not interactive but carry control-like `aria-label`s
- **File:** `src/components/layout/GlobalHeader.tsx:96` (signed-in `<div aria-label="Signed in status">`), `:131` (`<span aria-label="User UUID">`). Same pattern in `src/components/layout/AppHeader.tsx:82`.
- **Issue:** Non-interactive `<div>`/`<span>` carry `aria-label`, which AT may announce as standalone elements without a role, producing confusing "Signed in status" / "User UUID" announcements with no actionable context. Also note both header files are marked **LEGACY/OPTIONAL** in their headers — confirm they still mount before investing fix effort.
- **Why it matters:** WCAG 4.1.2 (Name, Role, Value). Labels on role-less containers add noise for screen-reader users.
- **Suggested fix (later lane):** Drop the `aria-label` from purely visual containers; if the status must be announced, use a visually-hidden text node or `role="status"` with `aria-live="polite"`. Verify mount status first (these are flagged legacy).

### P1-2 — `Input` primitive has no built-in label association or `aria-invalid` channel
- **File:** `src/components/ui/input.tsx` (whole file — bare `<input>` passthrough).
- **Issue:** `Input` is a styling passthrough with no enforced label linkage. It relies entirely on each call site to provide `htmlFor`/`id` or `aria-label`. `EmailBlock.tsx` does this correctly via `useId`, but there is no guard for the ~hundreds of other consumers, and no convention for surfacing validation state to AT (`aria-invalid`, `aria-describedby`).
- **Why it matters:** WCAG 1.3.1 / 3.3.2 (Labels/Instructions) and 3.3.1 (Error Identification). Unlabeled inputs are the single most common form-a11y failure; an opt-in primitive will accumulate unlabeled instances.
- **Suggested fix (later lane):** Audit `Input` consumers for missing label association (grep call sites for an adjacent `<Label htmlFor>` or `aria-label`). Optionally document the `form.tsx` (`FormField`/`FormLabel`/`FormMessage`) wrapper as the required pattern, which already wires `aria-describedby`/`aria-invalid`.

### P1-3 — `Toggle` primitive sizes are all below the 44px touch floor
- **File:** `src/components/ui/toggle.tsx:16–19` (`default: h-10`, `sm: h-9`, `lg: h-11`); `default` is also used by `toggle-group` consumers.
- **Issue:** The shared `touchTarget` token (`min-h-[44px] min-w-[44px]`, `src/design-system/tokens.ts:110`) is composed into `button.tsx` but **not** into `toggle.tsx`. `h-10` = 40px, `h-9` = 36px — both under the repo's own 44px standard (`A11Y_CONFIG.minTouchTargetSize = 44`). Icon-only toggles (no horizontal padding to compensate) are the worst case at 375–414px.
- **Why it matters:** WCAG 2.5.5 / 2.5.8 (Target Size). Sub-44px tap targets cause mis-taps on phones — directly hurts the mobile-first mandate.
- **Suggested fix (later lane):** Compose `touchTarget` into `toggleVariants` sizes as `button.tsx` does, keeping visual weight via padding/rounding rather than shrinking the hit area. Same review for `toggle-group`.

### P1-4 — `Switch` and `Checkbox` hit areas are sub-44px with no label-extends-target convention
- **Files:** `src/components/ui/switch.tsx:12` (`h-6 w-11` ≈ 24×44px — height fails), `src/components/ui/checkbox.tsx:14` (`h-4 w-4` = 16×16px).
- **Issue:** Both control bodies are far below 44px. These are acceptable *only* when an associated `<Label>` is clickable and itself extends the target — but neither primitive enforces or documents that, and `label.tsx` uses `peer-*` styling that implies pairing without guaranteeing target size.
- **Why it matters:** WCAG 2.5.8 (Target Size, Minimum, AA). A 16px checkbox is a frequent mis-tap source on touch.
- **Suggested fix (later lane):** Document/enforce a clickable `<Label>` wrapper that provides the 44px row target (e.g. `min-h-[44px] flex items-center gap-…`), and add a Storybook example showing the compliant pattern. Do not shrink — extend via label.

### P1-5 — `Drawer` (vaul) content has no enforced accessible name / description
- **File:** `src/components/ui/drawer.tsx:25–44` (`DrawerContent` renders children + a drag handle, with no required `DrawerTitle`).
- **Issue:** Unlike the Radix `Dialog`/`Sheet` (which warn loudly when `DialogTitle`/`Description` are missing), the vaul-based `Drawer` will mount a modal surface even when consumers omit `DrawerTitle`/`DrawerDescription`, leaving the dialog with no accessible name. The drag-handle `<div>` (`drawer.tsx:39`) also has no `aria-label` / role hint for the dismiss affordance.
- **Why it matters:** WCAG 4.1.2 / 1.3.1. A nameless modal is announced as just "dialog" with no context; on mobile the bottom-sheet drawer is a primary pattern.
- **Suggested fix (later lane):** Require `DrawerTitle` (visually-hidden if needed) per drawer; add `aria-hidden="true"` to the purely-decorative drag handle or give the sheet an explicit `aria-label`. Verify each `DrawerContent` consumer includes a title.

### P1-6 — `GlobalHeader.copyUuid` falls back to `window.prompt` with no AT-friendly status
- **File:** `src/components/layout/GlobalHeader.tsx:46–59` and the `"Copied ✓"` swap at `:128`.
- **Issue:** The copy-confirmation is a purely visual text swap (`Copied ✓`) with no `aria-live` region, so screen-reader users get no confirmation that the copy succeeded; the clipboard failure path uses a blocking native `window.prompt`. (Legacy file — verify mount before fixing.)
- **Why it matters:** WCAG 4.1.3 (Status Messages). State changes that aren't announced are invisible to AT.
- **Suggested fix (later lane):** Announce via a polite live region (the app already standardizes `liveRegionPolite` in `a11y.ts`); reconsider the `window.prompt` fallback. Confirm header is still live first.

---

## P2 — Polish

### P2-1 — `compact` button variant is an explicit sub-44px opt-out — needs a lint guard, not just a comment
- **File:** `src/components/ui/button.tsx:42` (`compact: "h-8 …"` = 32px).
- **Issue:** Well-documented as a "pointer-guaranteed contexts only" escape hatch, but nothing prevents a `compact` button from landing on a mobile primary flow. The guardrail is a comment.
- **Why it matters:** WCAG 2.5.8. The escape hatch is sound; enforcement is missing.
- **Suggested fix (later lane):** Add an ESLint rule or a Storybook/visual check flagging `size="compact"` outside an allowlisted admin/desktop directory.

### P2-2 — Tooltip-only affordances will be inaccessible to touch and keyboard
- **File:** `src/components/ui/tooltip.tsx` (thin Radix passthrough) — risk is at consumer sites.
- **Issue:** Radix tooltips are hover/focus driven and do not fire on touch; any control that conveys essential info **only** via tooltip is invisible on phones. The primitive is fine; consumer usage needs auditing.
- **Why it matters:** WCAG 1.4.13 / 1.1.1. Touch users (the whole mobile audience) never see hover tooltips.
- **Suggested fix (later lane):** Audit tooltip consumers; ensure no tooltip carries information not also available as a visible label or `aria-label`.

### P2-3 — Several `lucide-react` icon buttons across pages rely on `title` alone
- **Files:** representative — `src/components/layout/AppShell.tsx:93–97` icon `<Button asChild><Link title aria-label>` (this one is correct: has both `title` and `aria-label`); risk surfaces are page-level icon buttons in `src/pages/*` using only `title`.
- **Issue:** `title` is not a reliable accessible name (inconsistent AT support, never shown on touch). The UI library sets a good example (`AppShell` Map button has `aria-label`); page-level icon buttons should be swept to confirm each has `aria-label`.
- **Why it matters:** WCAG 4.1.2 / 1.1.1. Icon-only controls without a programmatic name are unusable with AT.
- **Suggested fix (later lane):** Grep `src/pages` for icon-only buttons with `title=` but no `aria-label=` and add accessible names.

### P2-4 — Focus-ring color token is defined in JS config but contrast vs. brand backgrounds is unverified
- **File:** `src/config/a11y.ts:17` (`focusRingColor: '#4BB7FF'`) vs. the rainbow-gradient brand surfaces (e.g. `AppShell.tsx:80` gradient logo, `index.css` background modes).
- **Issue:** A single light-blue focus ring (`#4BB7FF`) may not meet 3:1 non-text contrast against the lighter rainbow/white surfaces. **Flagging only — not measuring**, per audit scope.
- **Why it matters:** WCAG 1.4.11 (Non-text Contrast) / 2.4.7 (Focus Visible). An invisible focus ring on bright surfaces defeats keyboard navigation.
- **Suggested fix (later lane):** Have a contrast-checking lane measure the focus ring against each background mode; consider a dual light/dark ring or an outer offset halo for guaranteed visibility.

### P2-5 — Heading-order risk on composed pages (Home is large; sections may skip levels)
- **Files:** `src/pages/Home.tsx` (1201 lines, single `<main>` at :936); contrast with the clean `MarketingLandingPage.tsx` h1→h2→h3.
- **Issue:** Large composed pages that assemble many sub-components are prone to heading-level skips (e.g. an `h1` followed by an `h3`). Not confirmed line-by-line here; flagged as a review target because the page mixes many widgets.
- **Why it matters:** WCAG 1.3.1 / 2.4.6 (Headings and Labels). Screen-reader users navigate by heading outline; skipped levels break the mental model.
- **Suggested fix (later lane):** Run an automated heading-order check (axe) on Home and other large composed pages; normalize to sequential levels.

---

## Notable strengths (do NOT regress)

- `src/components/a11y/SkipToContent.tsx` mounted globally in `AppRouter` (fix P0-2 to make it land).
- `src/components/auth/EmailBlock.tsx` — `useId`-paired labels, OTP `aria-label`s, explicit Clarity masking.
- `src/pages/MarketingLandingPage.tsx` — exemplary per-element `lang`, `aria-labelledby` sections, clean heading order. Use as the template for P0-3.
- `src/components/ui/button.tsx` — composes the shared `touchTarget` token; default button is 44px-compliant by construction.
- Radix `Dialog`/`Sheet`/`AlertDialog` + `StandardConfirmDialog` — focus trap, Escape, focus restore, and required Title/Description come for free; `StandardConfirmDialog` correctly threads a `lang` prop.
- `src/config/a11y.ts` + `src/design-system/tokens.ts` — a real, centralized a11y contract already exists; most fixes are "honor the contract you already wrote."
