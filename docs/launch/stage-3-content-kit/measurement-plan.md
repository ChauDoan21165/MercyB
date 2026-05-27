# Measurement plan — Stage 3 launch

How to read the A/B variant tests in [`ab-variants.md`](./ab-variants.md) without violating MercyBlade's privacy stance. This file is the explicit boundary doc: what we measure, where, and what we deliberately refuse to measure.

## Privacy stance (the constraint that shapes every decision below)

MercyBlade's `/weak-at` surface and the broader app honor a strict privacy posture:

- **No third-party tracking pixels** (no Facebook Pixel, no Google Analytics 4, no TikTok Pixel, no Clarity, no Hotjar).
- **No PII collected for marketing attribution.** Email addresses, IPs, device fingerprints — none.
- **No localStorage analytics.** The only `localStorage` write Stage 3 allows is `mb.stage3b.viewCount`, used internally for performance instrumentation, NOT for marketing attribution.
- **No Sentry telemetry for marketing events.** Sentry is for error monitoring; using it as an analytics backend is rejected.
- **No marketing-consent gating on tracking — because the tracking does not exist.** Per `project_marketing_consent_is_tracking`, Pixel/GA4/UTM tracking IS the thing the marketing-consent UI gates today. The simplest way to honor that consent default is to *not install the tracking in the first place* for this launch.

If a proposed measurement violates any of the above, it is **rejected** below with a written reason. The privacy constraint is the load-bearing wall; measurement is the room built around it.

---

## What we CAN measure — and where

### 1. Platform-native engagement counts (TikTok, Facebook, Zalo)

The platforms already track engagement on content posted to them. That tracking belongs to the platform, governed by the platform's own privacy policy that the user accepted when they joined the platform. Reading those counts as a poster does NOT make MercyBlade a tracker.

| Platform | Available counts | Where to read |
|---|---|---|
| TikTok | Views, likes, shares, comments, saves, average view duration, profile-link clicks (when account is in Business mode) | TikTok Studio → Analytics → per-video |
| Facebook | Reach, engagements, comments, shares (public + private-share), click-through on links | Page Manager → Insights → Posts |
| Zalo | No public-poster analytics dashboard. Engagement is **manually counted** (forwards observed, reactions tallied in the source thread). | Manual — see §3 below. |

**Privacy boundary:** these are aggregate counts on the platform side. MercyBlade reads them as a poster, never receives them via API import into any MercyBlade system, never joins them to a learner's identity. Reading aggregate engagement on a post you authored is the same posture as a journalist reading their own article's pageview count.

### 2. UTM parameters on inbound URLs (landing-page attribution)

Each post's outbound URL carries UTM parameters:

```
https://mercyblade.com/weak-at?utm_source=tiktok&utm_medium=script1&utm_campaign=stage-3-launch&utm_content=A
```

What the parameters do — and don't do:

| Layer | Behavior |
|---|---|
| **The platform side** (TikTok / Facebook / Zalo) | The platform records click-throughs against the parameterized URL it sent. The platform attributes the click. **This is platform tracking, not MercyBlade tracking.** |
| **The user's browser** | The browser navigates to `mercyblade.com/weak-at?utm_...`. The full URL appears in the user's address bar. Standard HTTP. |
| **MercyBlade's app** | The app *does not read, parse, store, or forward* the UTM params. They sit in `window.location.search` as inert text. No `localStorage` write, no fetch, no Sentry crumb. The route works identically with or without them. |
| **Server-side log** (Vercel) | Vercel's edge logs record the requested URL by default. These logs are retained per Vercel's standard policy. They are read by Chau only, for SRE purposes — not used for marketing attribution. |

**Privacy posture:** UTM parameters are inert decoration on the URL. The *attribution* happens entirely on the originating platform's side — Facebook knows you clicked a Facebook link; that's between you and Facebook. MercyBlade never reads or writes the value to a marketing system.

**Why this is OK under the "no tracking" rule:** the constraint is *MercyBlade does not track marketing events*. The platform tracks its own outbound clicks regardless of whether MercyBlade names the link. UTM params just let the platform categorize click-throughs by content variant on the platform-side dashboard.

### 3. Manual platform observation (Zalo + cross-platform survey)

Zalo has no poster-facing analytics. For Zalo variant tests, the read is manual:

| Observation | How |
|---|---|
| Forward-on rate | Chau seeds Card A into N₁ Zalo conversations and Card B into N₂ conversations; one week later, ask 5 recipients per arm whether the card was forwarded onward. Count, log in a private spreadsheet. |
| Sentiment | Read replies in the seed conversations. Categorize as positive / neutral / negative; no PII captured beyond the manual read. |
| Surface-level engagement | Reactions tallied in the source conversation thread (Zalo shows reaction counts to the sender). |

**The private spreadsheet caveat:** the manual log lives in a Google Sheet or Notion page **owned by Chau personally**, not in any MercyBlade system. Names / handles can be coded as initials or hashed; no quoted message text. The spreadsheet is a personal research tool, not infrastructure.

### 4. Aggregate landing-page traffic via Vercel edge logs (optional, lightweight)

Vercel records per-deployment edge logs by default. These already exist; they are not new instrumentation. They can answer the question *"did `/weak-at` traffic spike after a post went live?"* at aggregate-by-day resolution without any per-user tracking.

| What's available | How |
|---|---|
| Daily request count for `/weak-at` | Vercel dashboard → Logs → filter by path. |
| Time-of-day distribution | Same; built-in. |
| UTM parameter distribution | Grep the requested URLs over a date range for `utm_source=tiktok` vs `utm_source=facebook` etc. |
| Geographic distribution (country-level only) | Vercel's edge logs include the request's country code by default. Aggregate, not per-user. |

**Privacy posture:** edge logs are infra-side, not marketing-side. The same logs already exist for any deployment, used for performance + error triage. Reading them with a marketing question in mind does not change their privacy properties.

**What edge logs do NOT carry:** session continuity (no cross-request linking), no fingerprinting, no email, no auth state. A request line is *"timestamp, URL, country, status code"*. That is the maximum resolution.

### 5. Plausible (rejected by default; flagged as conditional)

Plausible is a privacy-respecting analytics tool (no cookies, no PII, aggregate-only) often considered as a GA4 replacement.

**Status for this launch: NOT installed; not a current-launch dependency.**

If Chau later installs Plausible, the rule should be:

- **Scope: marketing landing pages only.** `/` and `/weak-at` are the candidates. The AI Tutor, the Kids surface, account pages, and billing pages are EXPLICITLY EXCLUDED.
- **Consent: Plausible's no-cookie design means no GDPR consent banner is required**, but the marketing-consent UI (per `project_marketing_consent_is_tracking`) should still be the gate that controls whether the Plausible script loads at all.
- **No A/B testing tools.** Plausible's goal limit is page-level aggregate counts; do not add tools like Optimizely or VWO on top, which would re-introduce cookies + experimentation IDs.

**This document does NOT recommend Plausible installation as a precondition for the variant tests.** The platform-native + UTM + edge-log triangle already gives enough signal to make the variant decisions in `decision-criteria.md`.

---

## What we CANNOT measure — and the rejection reasons

Each rejected measurement is documented with the specific privacy rule it would violate.

### Facebook Pixel — REJECTED

Would require installing the `fbq` script on `mercyblade.com`, which sends user-level events (cookies, IP, browser fingerprint) back to Facebook. Violates "no third-party tracking pixels" and would make every landing-page visit a Facebook-side tracked event regardless of marketing-consent state.

**Alternative:** UTM parameters + Facebook's own outbound-click counter (§2 above). Less precise, fully compliant.

### Google Analytics 4 — REJECTED

Same vector. GA4 sends per-event hits to Google with cookie + client ID. Even with IP anonymization, the cookie-based session tracking is rejected.

**Alternative:** Vercel edge logs (§4) for aggregate page-view counts.

### TikTok Pixel — REJECTED

Same vector. TikTok-specific tracking installed on the landing page would send user-level events back to TikTok.

**Alternative:** TikTok's own analytics on the post (§1) + UTM parameter on the outbound URL.

### Clarity / Hotjar / FullStory (session recording) — REJECTED

Would record full user sessions including DOM and (depending on config) input events. Even with PII redaction, the recording-the-user-without-meaningful-consent posture is incompatible with MercyBlade's stance.

**No alternative offered.** If we need to understand "where did the user struggle on the landing page", the right tool is to ask 3 named beta users to walk through it on a video call. Aggregate session recording for unknown visitors is rejected categorically.

### Server-side cookie-based attribution (first-party UTM-to-user-ID join) — REJECTED

Would require dropping a first-party cookie on first visit, then joining the cookie to a future signup. Even though first-party cookies are technically less invasive than third-party, they create a per-user attribution chain that's incompatible with the "no PII for marketing" rule.

**Alternative:** UTM stays on the URL until the user navigates away; no persistent cookie attempt. If a learner signs up after clicking a UTM-tagged link, that signup's source is unknown — and that is acceptable. The variant test reads on platform-side engagement, not on funnel attribution.

### A `mb.marketing.*` localStorage namespace — REJECTED

A future temptation: write the first-arrival UTM source to `localStorage` so subsequent app visits can attribute. Rejected because:

1. It violates "no localStorage analytics".
2. It would conflate marketing attribution with the `mb.stage3a.*` + `mb.stage3b.*` keyspace that the QA plan asserts contains *only* diagnostic + counter data.
3. It would create a privacy regression visible to any user who reads their own localStorage.

**No alternative.** Marketing attribution stops at the landing-page boundary. Anyone clicking through and using the product is attribution-anonymous from that point.

### Sentry custom events for marketing — REJECTED

Sentry has the technical capability to capture custom events (`Sentry.captureMessage("post_clicked")`). Rejected because:

1. Sentry is funded by per-event volume; using it for marketing events would balloon spend.
2. Sentry's user-context system would associate events with the active user's session if any context is set elsewhere — privacy regression.
3. The Stage 3B Sentry breadcrumb invariant (only `stage3b.perf.*` categories, only durations + counts, no source tags / no rationale strings / no user IDs) would be violated.

**No alternative through Sentry.** Use platform-native + UTM (§§1–2).

### Bitly / branch.io / linktr.ee — REJECTED

Link shorteners + deep-link services drop their own cookies and track click-throughs at a per-user level. Even when used "just to count clicks", they create a third-party data flow about MercyBlade's visitors that MercyBlade has no control over.

**Alternative:** plain `https://mercyblade.com/weak-at?utm_source=...` URLs. Slightly less pretty in TikTok captions; fully compliant. The URL is already short.

### Behavior cohort analysis (e.g. "users who clicked Post 4 are X% more likely to sign up") — REJECTED

Would require the per-user attribution chain that's rejected above. Even cohort-level analysis presumes a join between marketing source and downstream behavior at the user level.

**No alternative.** The variant tests in `decision-criteria.md` are scoped to *content-level* effects (does Post 4 B outperform A on shares?) not *funnel-level* effects (does Post 4 B convert better through to signup?). The latter requires the per-user chain and is out of scope.

---

## The measurement triangle (summary)

The three legs of the measurement that ARE compatible with the privacy stance:

```
                Platform-native counts (§1)
                       /          \
                      /            \
                     /              \
    UTM-tagged URLs (§2) ───── Vercel edge logs (§4)
       (passive decoration)         (infra-side aggregate)
                     \              /
                      \            /
                       \          /
            Manual observation (§3, especially Zalo)
```

These three legs are independent enough that each one's noise is uncorrelated with the others; combining them de-risks single-source error. For Zalo where the platform-native leg is absent, the manual + edge-log legs carry the read alone (decision criteria adjusted accordingly in `decision-criteria.md`).

---

## Operational notes for Chau

### Setting up the UTM convention

Use this scheme uniformly across all posts:

```
?utm_source=<platform>&utm_medium=<format>&utm_campaign=stage-3-launch&utm_content=<variant>
```

Where:
- `utm_source` ∈ `{tiktok, facebook, zalo, press}` — the platform.
- `utm_medium` ∈ `{script1, script2, post1, post2, card1, ...}` — which content piece.
- `utm_campaign` is fixed at `stage-3-launch` for this wave.
- `utm_content` ∈ `{A, B}` — which variant.

Example for TikTok script 1 variant B:

```
https://mercyblade.com/weak-at?utm_source=tiktok&utm_medium=script1&utm_campaign=stage-3-launch&utm_content=B
```

### Reading platform-native counts

- **TikTok:** TikTok Business account → Studio → Analytics → "Content". Filter to videos posted during the test window. Export to CSV; no API automation needed.
- **Facebook:** Page → Page Manager mobile app or desktop Meta Business Suite → Posts. Read like / share / comment / link-click columns. No API automation needed.
- **Zalo:** No dashboard. Manual count of reactions on the source thread, manual follow-up message to 5 recipients per arm asking whether the card was forwarded onward.

### Reading Vercel edge logs

- Project → Logs → date range → filter `URL contains /weak-at`.
- Group by `utm_content` query parameter for variant-level aggregate.
- Group by country code for diaspora-vs-VN-resident split.

### What to write down per variant test

In Chau's private spreadsheet (NOT in MercyBlade infrastructure):

| Column | Example |
|---|---|
| Content piece | TikTok Script 1 |
| Variant | A or B |
| Platform | TikTok-VN |
| Posted (date) | 2026-05-28 |
| Reach (impressions) | 4,120 |
| Engagement count | 142 |
| Share count | 18 |
| UTM-tagged click-throughs (Vercel logs) | 47 |
| Notes | "Cold-opened on screen recording per B treatment. No talking-head 0:00-0:04." |

That's the entire data record. No PII, no session IDs, no per-click rows.

## What this measurement plan refuses to optimize for

- **DAU / WAU / MAU.** These are product metrics, not marketing metrics. Even if they were marketing metrics, they require a per-user session chain that doesn't exist.
- **Conversion rate from post to signup.** Requires per-user attribution chain (rejected above).
- **Lifetime value per click.** Same.
- **Retention by source.** Same.

If a future stakeholder asks for any of the above, the answer is *"the measurement plan is scoped to content-level effects, not funnel-level effects, by design — see [`measurement-plan.md`](./measurement-plan.md)."*

## When to revisit this plan

- When MercyBlade ships an unsubscribe footer + email compliance gate, email becomes a measurable channel — and email opens / clicks (server-rendered) are first-party events that can be measured without re-introducing pixels. That is a separate plan, deferred until the unsubscribe system ships.
- When Plausible (or an equivalent privacy-respecting analytics tool) is installed under the marketing-consent gate, the Vercel-edge-log §4 row can be replaced by Plausible's better resolution. The trade is improved granularity for the cost of one external dependency.
- When the §15 Bar #7 testimonial gate closes (a named Vietnamese learner publicly credits MercyBlade for an outcome), outcome-based measurement becomes possible *for that specific testimonial story*. That is still a content-level, not a funnel-level, measurement.

## References

- [`ab-variants.md`](./ab-variants.md) — the variants this plan exists to measure.
- [`decision-criteria.md`](./decision-criteria.md) — the rules for when a variant test concludes.
- `project_marketing_consent_is_tracking` (memory) — the existing gate for any tracking that the app installs. This plan honors that gate by not installing tracking in the first place.
- `docs/stage-3b/qa-test-plan.md` §6 — asserts zero outbound HTTP from the `/weak-at` surface. This plan preserves that invariant.
- `docs/voice-guidelines-vn.md` — the anti-shame canon. The measurement plan does not surface user-facing scores or comparative metrics that would re-introduce shame language.
