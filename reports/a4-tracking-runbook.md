> ⚠️ **ARCHIVE-CLASS (April 2026)** — historical runbook/recon kept in
> place due to live cross-references outside `reports/`. Do not act on
> this document without verifying current state. See
> `reports/archive/agent-runs-2026-04/README.md` for context.

# A4 — UTM + Facebook Pixel + GA4 Runbook

**Status:** shipped (this branch — pending push)
**Step:** Roadmap step 5 (Marketing)
**Owner:** A4 track

## What this gives marketing

- **UTM attribution.** Campaign URLs like
  `https://mercyblade.com/?utm_source=facebook&utm_campaign=spring2026`
  are captured on first touch, stored for the session, and merged
  into the user's signup metadata. Marketing can answer
  "which channel does each new user come from?" without a tracker.
- **Facebook Pixel.** `PageView`, `CompleteRegistration`,
  `StartTrial`, `Purchase` events fire to Meta's ad platform for
  conversion-based campaign optimization.
- **GA4.** `page_view`, `sign_up`, `begin_trial`, `purchase` events
  flow into the existing Google Analytics property. Coexists with
  the older `src/lib/analytics.ts` event router — once `gtag` is on
  `window`, all paywall / checkout events that file already routes
  start hitting GA4 automatically.

All three are **off** in dev and staging unless the env vars below
are set.

## Setting env vars in production

Add to the **Vercel project** (or whichever host serves
mercyblade.com), under Environment Variables → Production:

```
VITE_FB_PIXEL_ID=<your meta pixel id, digits only, e.g. 1234567890>
VITE_GA4_MEASUREMENT_ID=<your GA4 measurement id, e.g. G-ABC123XYZ>
```

Empty / unset = full no-op. No script tags load. No `fbq` / `gtag`
on `window`. Safe to leave unset on dev and staging.

After setting, redeploy (the values are baked into the bundle at
build time by Vite's `import.meta.env` substitution).

To verify in production:

1. Open https://mercyblade.com/?utm_source=test
2. Open DevTools → Network → filter on `fbevents` and `gtag`
3. Both scripts should load with HTTP 200
4. DevTools → Application → Session Storage:
   `mb_utm_first_touch` = `{"utm_source":"test", ...}`

## How UTM flows from URL to user metadata

```
campaign URL with ?utm_source=…
        │
        ▼
main.tsx boot → bootMarketingTracking()
        │
        ▼
initMarketingTracking()  ← gated on consent + env vars
        │
        ├─ captureUtmFromCurrentUrl()  → sessionStorage[mb_utm_first_touch]
        │      (first touch wins; existing value never overwritten)
        ├─ initPixel()                 → window.fbq + Meta script tag
        ├─ initGa4()                   → window.gtag + gtag.js
        └─ pixelTrackPageView() + gaPageView()
        │
        ▼
[user navigates around, clicks Sign Up]
        │
        ▼
signup form → attachUtmToSignup({ display_name, ... })
        │
        ▼
supabase.auth.signUp({ email, password, options: { data: <merged> } })
        │
        ▼
profiles row carries utm_source / utm_medium / utm_campaign for
later cohort analysis (next step: A5/Marketing dashboard).
```

**First-touch wins** — if a user clicks an ad, browses 5 pages, then
signs up, we attribute to the original ad. We never overwrite.

**Per-session, not per-device** — `sessionStorage` clears when the
tab closes. A user who returns through a different channel next
week attributes to the new channel. This matches the standard
"campaign attribution" framing.

## Privacy posture

### Consent gate

`isMarketingTrackingEnabled()` reads `localStorage[mb_marketing_opt_out]`.

- **Default:** ON (no key set). Tracking loads.
- **Opt-out:** `setMarketingConsent(false)` writes `"1"` to that key.
  `initMarketingTracking()` short-circuits — no Pixel, no GA4, no
  UTM capture.

The opt-out is per-device (localStorage), not per-session. To stop
tracking mid-session the user must reload after opting out.

### GDPR / CCPA / LGPD

MercyBlade currently markets **inside Vietnam and the United
States only** (per project memory `project_distribution.md`).

- **Vietnam** has no equivalent of GDPR's strict-consent requirement
  for first-party analytics. Default-on is acceptable.
- **US** (CCPA / state laws) requires *opt-out* for sale of personal
  info, not opt-in for analytics. Default-on is acceptable.
- **EU / UK / Brazil** require explicit *opt-in* before any
  non-essential cookies / trackers. **If we open EU traffic, do
  these two things first:**
  1. Flip the default in `isMarketingTrackingEnabled()` from
     "ON unless opted out" to "OFF unless opted in."
  2. Add a consent banner UI that calls `setMarketingConsent(true)`
     when the user accepts.

The plumbing is already there — only the default and the banner
component need to change. Test infrastructure
(`__resetMarketingConsentForTests`) already covers both directions.

### CAN-SPAM

CAN-SPAM applies to email, not on-site analytics, and is handled
separately by the email infrastructure (admin@mercyblade.com from-
address, unsubscribe link in templates — see project CLAUDE.md).

## Sample test URLs

```
# Single source
https://mercyblade.com/?utm_source=facebook

# Full ad
https://mercyblade.com/?utm_source=facebook&utm_medium=cpc&utm_campaign=spring2026&utm_term=ielts&utm_content=ad-variant-A

# Organic email
https://mercyblade.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly_digest

# TikTok bio link
https://mercyblade.com/?utm_source=tiktok&utm_medium=social&utm_campaign=bio_link
```

After opening any of these, verify:
- `sessionStorage.getItem('mb_utm_first_touch')` returns the JSON.
- A second visit with a different `utm_source` does NOT overwrite —
  first touch is sticky.

## Files touched in this branch

- **New:** `src/lib/tracking/utm.ts`
- **New:** `src/lib/tracking/pixel.ts`
- **New:** `src/lib/tracking/ga4.ts`
- **New:** `src/lib/tracking/__tests__/utm.test.ts` (16 tests)
- **New:** `src/lib/tracking/__tests__/pixel.test.ts` (9 tests)
- **New:** `src/lib/tracking/__tests__/ga4.test.ts` (6 tests)
- **New:** `src/lib/tracking/__tests__/initMarketingTracking.test.ts` (7 tests)
- **Edited:** `src/services/behaviorTrackingFlag.ts` — added
  `isMarketingTrackingEnabled`, `setMarketingConsent`,
  `initMarketingTracking`. Existing `isTrackingEnabled` unchanged.
- **Edited:** `src/main.tsx` — calls `initMarketingTracking()` at
  boot. (No `App.tsx` exists in this codebase; main.tsx is the
  closest equivalent mount point.)
- **Edited:** `index.html` — added documentation comment markers
  for the runtime-injected slots. No script tags hard-coded.

## Verification

```bash
npm run typecheck    # clean
npx vitest run       # 1471 / 1471 pass (38 new tracking tests)
```

## Follow-ups (not this PR)

- Wire `attachUtmToSignup(formData)` into the actual signup form
  (Auth UI lives in `src/pages/auth/...`).
- Wire `pixelTrackSignUp()` / `gaSignUp()` into the post-signup
  callback so Meta and GA see the conversion event.
- Wire `pixelTrackPurchase(amount)` / `gaPurchase(amount)` into
  the entitlement-success callback (already an `entitlement_success`
  event in `src/lib/analytics.ts`).
- Build the consent banner UI when EU traffic opens.
