# P1 Investigation — "Nói thử ngay" CTA does nothing (A14e)

**Reviewer:** A14e (read-only investigation)
**Worktree:** `/private/tmp/A14e-landing-cta-broken` off `origin/main` @ `10f0b1533`
**Date:** 2026-05-19 / late session
**Trigger:** Chau clicked the orange "Nói thử ngay" CTA on mercyblade.com (incognito, anon) → nothing happened.

---

## TL;DR

```
╔══════════════════════════════════════════════════════════════╗
║ ⚠️  PREMISE MISMATCH IN THE DISPATCH                         ║
║      Sentry event was for /onboarding chunk → DIFFERENT BUTTON║
║      "Nói thử ngay" goes to `/?trypron=1`, not /onboarding    ║
╚══════════════════════════════════════════════════════════════╝
```

The "Nói thử ngay" CTA's click path is **client-side localStorage + React Router navigation** — no `/onboarding` route involved. The Sentry chunk-load event Chau referenced was from the **other** button on the same page (`<Link to="/onboarding">` "Tôi học ngoại ngữ"). Three live hypotheses for what Chau actually experienced; all require DevTools data to discriminate. **Not a P0** — the code path is intact on `main`; this is most likely an environment / runtime issue, not a missing handler.

---

## 1. The exact onClick code (Phase 1)

**File:** `src/pages/MarketingLandingPage.tsx:86-89`

```tsx
const tryPronunciation = () => {
  writeAnonymousPair("vi", ["en"]);
  nav("/?trypron=1");
};
```

**Button:** `src/pages/MarketingLandingPage.tsx:143-150`

```tsx
<button
  type="button"
  lang="vi"
  className="mb-ml-btn mb-ml-btn-trial"
  onClick={tryPronunciation}
>
  Nói thử ngay →
</button>
```

**Two-step path:**
1. `writeAnonymousPair("vi", ["en"])` — `src/lib/languagePair/anonymousPair.ts:84` — writes `{ native: "vi", targets: ["en"] }` to `localStorage[PAIR_KEY]` + mirrors native into `localStorage[NATIVE_MIRROR_KEY]`. Storage failures (private mode / quota) are silently swallowed.
2. `nav("/?trypron=1")` — React Router push to root with query param.

**No edge function call. No modal. No dynamic import on this code path.**

---

## 2. What happens after `nav("/?trypron=1")`

**Route definition** (`src/router/AppRouter.tsx:721-731`):

```tsx
<Route
  path="/"
  element={
    <AnonymousOnboardingGate
      firstTimeAnonymous={<LazyPage><MarketingLandingPage /></LazyPage>}
    >
      <LazyPage><Home /></LazyPage>
    </AnonymousOnboardingGate>
  }
/>
```

**Gate logic** (`src/router/AnonymousOnboardingGate.tsx:72-78`):

```tsx
if (hasResolvedRef.current && !effectiveUser && !hasAnonymousPair()) {
  return firstTimeAnonymous !== undefined ? <>{firstTimeAnonymous}</> : <Navigate to="/onboarding" replace />;
}
return <>{children}</>;
```

So the gate switches between MarketingLanding and Home **based on `hasAnonymousPair()`**. After step 1 writes the pair, `hasAnonymousPair()` returns true on the next render → gate switches to render Home.

**Home is lazy-loaded:** `const Home = lazyWithRetry(() => import("@/pages/Home"))` (`src/router/AppRouter.tsx:41`).

**Home reads `?trypron=1`** (`src/pages/Home.tsx:103-…`): seeds `tryOneWordRequestId` so MercyGuide opens its pronunciation tab reactively on mount.

---

## 3. CRITICAL FINDING — the dispatch conflated two buttons

The dispatch context referenced the Sentry event:
- `TypeError: Failed to fetch dynamically imported module: .../OnboardingPage-Dr48fc_7.js`
- `route: /onboarding`

**But "Nói thử ngay" does NOT navigate to `/onboarding`.** It navigates to `/?trypron=1` (root).

There are **three** CTAs on this landing page:

| Button | Component | Target route | Lazy chunk |
|---|---|---|---|
| `Tôi học ngoại ngữ` | `<Link to="/onboarding">` (line 114-120) | `/onboarding` | **`OnboardingPage`** ← matches Sentry event |
| `I'm learning Vietnamese` | `<Link to="/onboarding?direction=vn">` (line 121-128) | `/onboarding?direction=vn` | `OnboardingPage` |
| `Nói thử ngay` | `onClick={tryPronunciation}` (line 143-150) | `/?trypron=1` (then renders Home) | **`Home`** ← NOT OnboardingPage |

The Sentry event is from one of the first two buttons (or a bot exploring `/onboarding` directly). It is **NOT evidence of what happens when Chau clicks "Nói thử ngay"**.

**Also worth noting:** the Sentry event's URL was `mercyblade-9ciyeu8wa-mercy-blade.vercel.app` — a **Vercel preview URL**, not production `mercyblade.com`. Different deploy, possibly different chunk hashes.

---

## 4. Three live hypotheses for "Nói thử ngay → nothing happened"

### Hypothesis A — `localStorage.setItem` silently failed in incognito (LIKELY)

`writeAnonymousPair` wraps the storage write in a try/catch (`anonymousPair.ts:89-98`) and swallows any throw:

```ts
try {
  window.localStorage.setItem(PAIR_KEY, JSON.stringify({ native, targets }));
  window.localStorage.setItem(NATIVE_MIRROR_KEY, native);
} catch {
  // ignore — see doc above
}
```

If the write threw (Safari private-mode + storage-quota, third-party storage blocked, or browser-extension shim that returns a no-op `setItem`), `hasAnonymousPair()` returns false on the next render → the gate keeps showing MarketingLandingPage. **The URL changes to `/?trypron=1` but the visible page doesn't.** From Chau's perspective: "I clicked the button and nothing happened."

**Confirms with DevTools:** open DevTools → Application → Local Storage → mercyblade.com. After clicking, check that `mercy-anon-pair` (or whatever the canonical `PAIR_KEY` resolves to) contains `{"native":"vi","targets":["en"]}`. If absent → Hypothesis A confirmed.

### Hypothesis B — `Home` chunk failed to load (PLAUSIBLE)

If `localStorage` write succeeded and the gate flipped to render Home, Home is lazy-loaded via `lazyWithRetry`. If Home's chunk hash on the current deploy doesn't exist (e.g., stale CDN, stale SW cache serving an old `index.html` that references a dead `Home-*.js`), Tier-1A `lazyWithRetry` catches → `cacheBustingReload`. The page navigates to `/?trypron=1&_cb=<ts>` and reloads. **Chau would see a reload flash + a fresh page load** — but if it lands back on MarketingLandingPage (because the gate's pair check fired before the recovery completed, or the recovery clobbered localStorage somehow), Chau sees "nothing meaningful happened."

**Confirms with DevTools:** Network tab. After clicking, look for a request to `/assets/Home-*.js` returning 404 or a CORS-blocked status. Console tab: any "Failed to fetch dynamically imported module" log.

### Hypothesis C — Service Worker stale shell (PLAUSIBLE)

The SW (`sw.js`, registered in `src/main.tsx`) caches the previous deploy's `index.html`. On `nav("/?trypron=1")`, React Router does client-side navigation (no full reload) so the SW isn't re-consulted for HTML — but the JS chunks referenced by the in-memory `index.html` are still the previous deploy's hashes. **This wouldn't break a client-side route nav** (we're already past the HTML load), but might affect Home's chunk fetch.

**Confirms with DevTools:** Application → Service Workers. Look at the registered SW's controller. Then Network tab → reload → check if the document came from `(ServiceWorker)`. If yes, unregister + reload to test.

---

## 5. Hypotheses ruled OUT by the code

- **`onClick` throws before navigation:** the inline function does only `writeAnonymousPair` (try/catch wrapped) + `nav(...)`. Neither can throw an uncaught exception. Ruled out without DevTools needed.
- **Lazy import path wrong:** verified `lazyWithRetry(() => import("@/pages/Home"))` matches the file at `src/pages/Home.tsx`. The chunk-name pattern `Home-*.js` is what Vite emits. Ruled out.
- **Router treats same-path nav as no-op:** `/` → `/?trypron=1` has different search params; React Router v6+ treats this as a re-render. Ruled out.

---

## 6. What's needed to confirm root cause (Chau-operator data)

Open `https://mercyblade.com/` in a fresh incognito with DevTools open BEFORE clicking. Then:

1. **Console tab** — visible immediately on click:
   - Any red errors? Especially `TypeError: Failed to fetch dynamically imported module`?
   - Any `[supabase-slow-query]`, `[ErrorBoundary]`, `[chunkReload]` warnings?
2. **Network tab** — filter to "Fetch/XHR" and "JS":
   - After click, look for `Home-*.js` requests. Status code? CORS?
   - Look for `mercy-anon-pair` or similar localStorage writes (shows in Application tab, not Network).
3. **Application tab → Local Storage → `https://mercyblade.com`**:
   - After click, refresh the panel — is `mercy-anon-pair` populated?
4. **Application tab → Service Workers**:
   - Is `/sw.js` activated? What version?
5. **URL bar**:
   - After click, does the URL change from `https://mercyblade.com/` to `https://mercyblade.com/?trypron=1`?

**If URL changed but page didn't:** Hypothesis A or B is likely.
**If URL didn't change:** the click handler errored before `nav()` ran — most likely `writeAnonymousPair` threw uncatchably (but it can't, per the code), OR the button's `onClick` never fired (CSS pointer-events:none, an overlay element on top, etc.).

---

## 7. Verdict + no-op for now

**Not a P0.** The code path is intact on `main`:
- `tryPronunciation` is correctly wired to `onClick`
- `writeAnonymousPair` is correctly imported and called
- Gate re-evaluation is correctly reactive to localStorage state
- Home is correctly lazy-loaded with retry recovery

**A14 cannot reproduce without browser-side evidence.** Any fix dispatched now would be speculation about which hypothesis is right.

**Recommended next step:** Chau opens incognito DevTools, clicks the button, captures the data in §6, and reports back. Then A14 (or another agent) dispatches a targeted fix.

**Premature-fix candidates flagged but NOT shipped:**
- (Hypothesis A) Surface a Sentry beacon when `writeAnonymousPair` actually catches a throw — would tell us if the storage write is silently failing for real users. Small instrumentation PR; not worth opening until evidence supports the hypothesis.
- (Hypothesis B) Add per-tier `chunkRecoveryTier` discriminator (A14d finding 7) so Sentry can tell Home-chunk-fail from OnboardingPage-chunk-fail when triaging this kind of report.

---

## 8. What this investigation did NOT do

- Did not open a fix PR (per dispatch read-only constraint).
- Did not widen scope to look at other CTAs even though the dispatch's premise mismatch suggests the "Tôi học ngoại ngữ" button + bot Sentry event MIGHT have the actual problem worth fixing — A14e is scoped to "Nói thử ngay" only.
- Did not touch ErrorBoundary, lazyWithRetry, or the SW.
- Did not run the dev server or attempt to reproduce locally; the code reads clean on `main` and any environment-specific failure won't reproduce without Chau's production cookies + storage state.

---

## 9. References

- Button + onClick: `src/pages/MarketingLandingPage.tsx:68-150`
- `writeAnonymousPair`: `src/lib/languagePair/anonymousPair.ts:84-99`
- Gate logic: `src/router/AnonymousOnboardingGate.tsx`
- Route definition: `src/router/AppRouter.tsx:721-731`
- Home lazy import: `src/router/AppRouter.tsx:41`
- Tier-1A chunk recovery: `src/lib/lazyWithRetry.ts`
- A14c production triage: PR #904
- A14d chunk-recovery instrumentation audit: PR #926
