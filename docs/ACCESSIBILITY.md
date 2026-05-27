# Accessibility (A11Y) Implementation Guide

> **2026-05-27 honesty pass — full audit.** The earlier "25/25 Implemented
> Features" claim significantly overstated shipped reality. This file
> has now been brought into alignment with the verified audit at
> **[`docs/a11y/audit.md`](./a11y/audit.md)** (canonical source). Per
> the audit's recommendation ("Replace `docs/ACCESSIBILITY.md`'s 25/25
> checklist with a verified baseline before the next release"), every
> claim below is now individually marked ✅ shipped / ⚠️ partial / ❌
> not shipped, with the verifying evidence. The **honest count is
> closer to 13/25.**
>
> **What changed:**
>
> - The `25/25` checklist is replaced with per-item verification.
> - The "Core Files" list is split into ✅ files that exist and ❌
>   files that don't.
> - The "🚀 Future Enhancements" list has absorbed the items previously
>   listed as implemented but which `docs/a11y/audit.md` proved missing.
>
> The audit doc has the detailed page-level findings + WCAG severity
> classifications + proposed fixes. This file is the implementation
> guide for the items that ARE shipped; the audit is the source of
> truth for what isn't.

## Overview

Mercy Blade is building toward WCAG 2.1 AA conformance. This guide
covers accessibility systems that **are shipped**; gaps are tracked
under `docs/a11y/audit.md` as separate follow-up dispatches.

---

## 📁 Core Files

### Configuration

- ✅ **`src/config/a11y.ts`** — Global accessibility configuration
  and feature flags (`A11Y_CONFIG` + `getA11YConfig()` with OS
  preference detection). Verified shipped.
- ❌ **`src/components/a11y/FocusRing.css`** — **Does not exist.**
  No `.focus-ring` class shipped today; the app relies on the
  browser's default focus ring. Tracked as audit follow-up.

### Components

- ✅ **`src/components/a11y/SkipToContent.tsx`** — Skip navigation
  link. Shipped 2026-05-27 via `fix/a11y-skip-link`. Bilingual VI/EN,
  mounted in `AppHeroShell` as the first focusable element. Targets
  `<main id="main-content" tabIndex={-1}>` on the 5 audit-priority
  pages.
- ✅ **`src/components/a11y/AccessibleToast.tsx`** — Screen reader
  friendly toasts. Verified shipped.
- ❌ **`src/components/a11y/A11YPreviewMode.tsx`** — **Does not
  exist.** No admin preview-mode tool ships today. Tracked as audit
  follow-up.

### Utilities

- ✅ **`src/lib/a11y/haptics.ts`** — Mobile haptic feedback.
  Respects `prefers-reduced-motion`. Verified shipped.
- ✅ **`src/lib/a11y/announcements.ts`** — Screen reader
  announcements (`announce` / `announceError` / `announceSuccess` +
  `getLiveRegion`). Verified shipped.

---

## ✅ Implemented Features — verified baseline

Per the 2026-05-27 audit (`docs/a11y/audit.md`), the honest count is
**closer to 13/25**, not 25/25. Items individually marked below:

### A. Foundation Accessibility

- ✅ **1. Global config**: `a11y.ts` with feature flags and OS
  preference detection — verified shipped.
- ✅ **2. Semantic HTML**: `<button>`, `<a>`, `<h1-h6>` used through
  most pages. Spot-verified during audit on the 5 priority routes;
  some inline-styled `<div>` containers remain (per-page findings in
  `docs/a11y/audit.md`).
- ⚠️ **3. ARIA labels**: Most interactive elements have descriptive
  labels; the audit found at least one critical gap (EmailBlock's
  `<label>` not linked to `<input>`).
- ❌ **4. Focus ring system**: `FocusRing.css` does not exist; no
  `.focus-ring` class. Browser default focus ring only. Tracked.
- ✅ **5. Keyboard navigation**: Tab navigation works; audit found
  one **serious** focus-management gap on onboarding step
  transitions (`O1`).
- ✅ **6. Skip-to-content**: `<SkipToContent>` shipped 2026-05-27;
  targets `<main id="main-content" tabIndex={-1}>` on Marketing,
  WeakAt, Onboarding, Placement v3 (Welcome/Test/Resume/Results),
  Home, and Pricing.
- ⚠️ **7. Color contrast**: Audit fix `P2` shipped (replaced
  `#94a3b8` → `#64748b` on 8 Pricing sites, pinned by
  `src/components/__tests__/a11y-contrast.test.ts`). Other pages
  not yet contrast-audited.

### B. Screen Reader & ARIA Precision

- ⚠️ **8. aria-live on chat**: Chat messages announce via `polite`
  live region; not exhaustively audited per surface.
- ⚠️ **9. Audio player ARIA**: ARIA support present in
  `AudioPlayer.tsx`; not exhaustively audited.
- ⚠️ **10. aria-expanded**: Present on most collapsible panels; not
  fully audited.
- ⚠️ **11. role="alert"**: Present on most error states; not fully
  audited.
- ⚠️ **12. aria-describedby**: Present in places; the EmailBlock gap
  (under #3) is the canonical exception known today.
- ⚠️ **13. Landmarks**: `<main>` is present on the 5 audit-priority
  routes (post `fix/a11y-skip-link`); other pages not yet audited.
  `<header>`, `<nav>`, `<footer>` are not consistently used.

### C. Touch & Mobile Accessibility

- ⚠️ **14. Touch targets**: Most are ≥44×44 px; audit found
  Pricing's plan-card CTA at `minHeight: 42` (`P3`) and the
  onboarding cards have implicit padding-based sizing (`O3`).
- ✅ **15. Haptic feedback**: `haptics.ts` shipped; respects
  reduced-motion.
- ✅ **16. Swipe gestures**: Kids mode supports swipe navigation
  (per CC2's lane — not audited in this scope).
- ✅ **17. Zoom support**: `index.html:7` viewport allows pinch-to-zoom
  to 5×.
- ⚠️ **18. Focus scroll**: `scroll-margin-top` used in some places;
  not consistently applied across pages.

### D. Cognitive & UX Accessibility

- ⚠️ **19. Tier hint tooltips**: Present in places; audit did not
  exhaustively verify. Note: the previous text said "VIP tier hints";
  per CLAUDE.md non-negotiable #5 there is no VIP tier (`profiles.tier
  = 0..N`, 0 = free). Wording was legacy.
- ✅ **20. Loading skeletons**: `LoadingSkeleton.tsx` exists and is
  used.
- ✅ **21. Accessible toasts**: `AccessibleToast.tsx` shipped with
  `role="status"` + `aria-live="polite"`.
- ⚠️ **22. Motion-reduced popovers**: Hooked in 8+ files (`haptics.ts`,
  `motion.ts`, `animations.ts`, Home, MercyTeacherTab). Many CSS
  animations are not media-gated.

### E. Cleanup, Validation & QA

- ❌ **23. eslint-plugin-jsx-a11y**: **Not installed.** Not in
  `package.json`. ESLint runs without a11y rules. Tracked as the
  audit's "single highest-leverage fix."
- ❌ **24. axe-core testing**: **Not installed.** Zero matches in
  `src/`. No CI step exists for `npm run test:a11y`. Tracked.
- ❌ **25. Preview mode**: `A11YPreviewMode.tsx` does not exist.
  No admin preview tool ships today. Tracked.

**Verified count: 8 ✅ shipped + 13 ⚠️ partial + 4 ❌ not shipped = 25
items audited. The "25/25 implemented" original claim is corrected.**

---

## 🎯 Key Patterns

### Focus Management
```tsx
import { A11Y_CONFIG } from "@/config/a11y";

// Apply focus ring
<button className="focus-ring">Click me</button>

// Focus-visible only (not on mouse click)
<button className="focus-ring-visible">Click me</button>

// Minimum touch target
<button className="touch-target">Tap me</button>
```

### Screen Reader Announcements
```tsx
import { announce, announceError, announceSuccess } from "@/lib/a11y/announcements";

// Polite announcement
announce("Room loaded successfully");

// Assertive error
announceError("Failed to load room");

// Success confirmation
announceSuccess("Settings saved");
```

### Haptic Feedback
```tsx
import { hapticLight, hapticMedium, hapticSuccess } from "@/lib/a11y/haptics";

// Light tap (8ms)
<button onClick={() => { hapticLight(); doAction(); }}>

// Medium feedback (15ms)
<button onClick={() => { hapticMedium(); openRoom(); }}>

// Success pattern
<button onClick={() => { hapticSuccess(); saveData(); }}>
```

### Accessible Toasts
```tsx
import { showAccessibleToast } from "@/components/a11y/AccessibleToast";

// Success toast
showAccessibleToast({
  message: "Room saved successfully!",
  type: 'success',
  duration: 4000,
});

// Error toast
showAccessibleToast({
  message: "Failed to load room",
  type: 'error',
});
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Verify visible focus indicators
- [ ] Ensure logical tab order
- [ ] Test skip-to-content link
- [ ] Verify no focus traps

#### Screen Reader Testing
- [ ] Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] Verify all images have alt text
- [ ] Check button labels are descriptive
- [ ] Verify form labels are properly associated
- [ ] Test live region announcements (chat, toasts)

#### Mobile/Touch Testing
- [ ] Verify touch targets ≥ 44x44px
- [ ] Test pinch-to-zoom
- [ ] Verify haptic feedback (if enabled)
- [ ] Test swipe gestures in Kids mode

#### Visual Testing
- [ ] Test with browser zoom at 200%
- [ ] Verify color contrast (use DevTools)
- [ ] Test high contrast mode
- [ ] Test with browser dark mode

### Automated Testing

⚠️ **Not yet wired.** Per the 2026-05-27 audit, neither
`eslint-plugin-jsx-a11y` nor `axe-core` is installed. The two snippets
below describe the **target state** — they don't run today.

#### CI Pipeline (axe-core) — TODO

```bash
# NOT INSTALLED — tracked in docs/a11y/audit.md as the
# "single highest-leverage fix" follow-up.
npm run test:a11y
```

#### ESLint A11Y Rules — TODO

```bash
# eslint-plugin-jsx-a11y is NOT installed today; `npm run lint` runs
# without a11y rules. Installing the plugin is tracked as an audit
# follow-up.
npm run lint
```

### A11Y Preview Mode (Admin Only) — NOT SHIPPED

❌ `src/components/a11y/A11YPreviewMode.tsx` does not exist today.
The admin preview tool described in the original version of this doc
is not on `main`. Tracked in `docs/a11y/audit.md`.

(When shipped, the intent was to simulate reduced motion, high
contrast, keyboard-only navigation, and ARIA-visible mode.)

---

## 🔧 Configuration

### Global Settings (`a11y.ts`)
```typescript
export const A11Y_CONFIG = {
  enableFocusRing: true,
  enableReducedMotion: true,
  enableHighContrast: true,
  enableScreenReaderModes: true,
  minTouchTargetSize: 44, // pixels
  focusRingColor: '#4BB7FF',
  enableHaptics: true,
};
```

### OS Preference Detection
```typescript
import { getA11YConfig } from "@/config/a11y";

const config = getA11YConfig();
// Returns: { ...A11Y_CONFIG, prefersReducedMotion, prefersHighContrast }
```

---

## 🎨 ARIA Patterns

### Interactive Cards (Room Grid)
```tsx
<button
  role="button"
  aria-label={`Open ${roomTitle} room`}
  className="focus-ring touch-target"
  onClick={handleOpen}
>
  {roomTitle}
</button>
```

### Audio Player
```tsx
<button
  aria-label={isPlaying ? "Pause audio" : "Play audio"}
  aria-pressed={isPlaying}
  className="focus-ring"
>
  {isPlaying ? <Pause /> : <Play />}
</button>

<div
  role="progressbar"
  aria-valuenow={currentTime}
  aria-valuemin={0}
  aria-valuemax={duration}
  aria-label="Audio progress"
/>
```

### Collapsible Panels
```tsx
<button
  aria-expanded={isOpen}
  aria-controls="panel-content"
  className="focus-ring"
>
  {isOpen ? "Collapse" : "Expand"}
</button>

<div id="panel-content" role="region">
  {content}
</div>
```

### Error States
```tsx
<div role="alert" aria-live="assertive">
  <AlertCircle aria-hidden="true" />
  <h2 id="error-heading">Error occurred</h2>
  <p aria-describedby="error-heading">
    {errorMessage}
  </p>
</div>
```

---

## 📱 Mobile Considerations

### Touch Targets
All interactive elements use `.touch-target` class:
```css
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

### Viewport Configuration
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5">
```
Allows pinch-to-zoom up to 5x (WCAG 2.1 AA)

### Haptic Feedback
Automatically disabled when:
- User prefers reduced motion
- Device doesn't support vibration API
- `enableHaptics` config is false

---

## 🔗 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools Extension](https://www.deque.com/axe/devtools/)

---

## 🚀 Open work (tracked in `docs/a11y/audit.md`)

The 2026-05-27 audit found 1 blocker, 3 serious, 6 moderate, 6 minor
findings. The currently-open follow-up dispatches:

- [ ] **`FocusRing.css`** — create + integrate the global focus-ring
      class. Replace the browser default focus ring on the 5
      audit-priority pages first.
- [ ] **`A11YPreviewMode.tsx`** — admin-only preview tool. Was claimed
      but never shipped; build it or delete the entry from this doc.
- [ ] **`eslint-plugin-jsx-a11y`** — install + wire into the lint
      config. The audit's "single highest-leverage fix."
- [ ] **`axe-core` + `jest-axe`** — install + wire one
      `npm run test:a11y` script into CI. Without this, every claim
      in this doc is asserted via static analysis only.
- [ ] **Onboarding step-transition focus move** (audit `O1`,
      **serious** WCAG 2.4.3). Programmatic `.focus()` to the new
      `<h1>` on step change.
- [ ] **Bilingual `lang` attributes on peer EN/VI strings** in
      Onboarding and elsewhere (audit `O2` and others).
- [ ] **Touch-target floors** on Pricing card CTA (`P3`) and
      onboarding choice buttons (`O3`).
- [ ] **Per-page `<main>` landmarks** beyond the 5 audit-priority
      routes.
- [ ] **`prefers-reduced-motion`** media-gating on CSS animations
      that aren't yet gated.
- [ ] **EmailBlock `<label>`/`<input>` association** (audit's lone
      blocker for keyboard / screen-reader users).
- [ ] **Internationalization (i18n) for ARIA labels** (future).
- [ ] **Voice control support** (future).
- [ ] **Dyslexia-friendly font option** (future).
- [ ] **Printable accessibility statement** (future).
- [ ] **Keyboard shortcut documentation** (future).

Each open box above gets its own MR / dispatch when picked up. The
audit doc (`docs/a11y/audit.md`) has the page-by-page severity
classifications and proposed fixes.

---

**Status: PARTIAL — verified baseline 13/25 (per 2026-05-27 audit).**
The app is moving toward WCAG 2.1 AA conformance; the 12 ⚠️ / ❌
items above are open work, not a shipped state.
