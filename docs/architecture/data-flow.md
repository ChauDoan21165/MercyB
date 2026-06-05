# Data Flow

> How data actually moves through the app. Tracks three flows:
>
> 1. **Learner signal** — from an anonymous visitor's first localStorage write
>    through Stage 3A's read-only mirrors into Stage 3B's suggested-practice
>    engine and on to a `/practice/*` route.
> 2. **Supabase boundary** — what lives on the device vs. what hits the
>    backend, and what the *boundary contracts* are (writeback, sync,
>    semantic memory).
> 3. **Entitlement derivation** — how a user's "active vs. inactive" is
>    computed, every time, in every gate.
>
> Cross-reference: [system-overview.md](./system-overview.md) for *where the
> code lives*. This doc explains *what flows between systems*.

---

## 1. Learner-signal flow: anon → Stage 3A → Stage 3B → practice

This is the spine of the Study OS sequence (`layer-model.md` Stage 3). It is
designed local-only (`study-os-stage-3.md` "Study OS Summary Boundary"),
which means every hop until the final practice route operates on
device state, not backend state.

### 1a. Anonymous visitor — the localStorage seam

When an anonymous visitor lands on `/`, the app needs **just enough**
identity to do useful work without forcing signup:

- **Auth identity (Supabase JWT)** is bootstrapped lazily by
  `src/lib/auth/anonymousBootstrap.ts` if the
  `anonymous_auth_enabled` flag is on. The JWT is what lets the cloud
  pronunciation scorer return per-phoneme detail; without it, the
  Speak tab silently degrades to the local scorer.
- **Language pair** (native + target) is stored in `localStorage`
  via `src/lib/languagePair/anonymousPair.ts`. The presence of a
  stored pair is what `AnonymousOnboardingGate` checks to decide
  *"first-time anon → marketing landing"* vs. *"returning anon →
  Home"*.
- **Stage 3A signal buffers** (described below) accumulate in
  `localStorage` from the very first lesson the visitor touches. No
  signup is required. Per-device, per-browser; not synced across
  devices by design.

The data shape:

```text
localStorage
├── supabase.auth.token            ← Supabase session (anon or signed)
├── mb.lang.pair                   ← { native: "vi", target: "en" }
├── mb.stage3a.l1.recent           ← ring buffer of L1 tags (cap 50)
├── mb.stage3a.placement.snapshot  ← latest placement v3 snapshot
├── mb.stage3a.pron.recent         ← ring buffer of phoneme attempts
└── mb.marketing.consent           ← tracking consent (NOT email)
```

Every Stage 3A key is prefixed `mb.stage3a.*`. The contract for any
new adapter: same prefix, same boundary rules.

### 1b. Stage 3A — read-only signal mirroring

Stage 3A's job is to *mirror* signals from three sources into local
ring buffers, **without** doing anything with them. It is descriptive,
not prescriptive.

```text
                         ┌──────────────────────────────┐
                         │  AI Tutor turn / room reply  │
 L1 detector  ──────────▶│   (per-turn weaknessTag)     │
 (§4 in overview)        └──────────────┬───────────────┘
                                        │  appendL1Tag()
                                        ▼
                         localStorage: mb.stage3a.l1.recent
                         (capped at 50 most recent entries)


                         ┌──────────────────────────────┐
                         │   Placement v3 completion    │
 Placement edge fn ─────▶│  (CEFR + flagged patterns)   │
 (§8 in overview)        └──────────────┬───────────────┘
                                        │  setPlacementSnapshot()
                                        ▼
                         localStorage: mb.stage3a.placement.snapshot


                         ┌──────────────────────────────┐
                         │   Pronunciation drill turn   │
 Cloud scorer ──────────▶│  (phoneme attempt + score)   │
 (§5 in overview)        └──────────────┬───────────────┘
                                        │  appendPronAttempt()
                                        ▼
                         localStorage: mb.stage3a.pron.recent
```

Implementation: `src/lib/stage-3a/adapters/{l1TagAdapter,placementSnapshotAdapter,pronunciationAdapter}.ts`.

**Hard rules (per-adapter, enforced in code + tests):**

- No Supabase writes.
- No network / fetch.
- No `mercy_user_facts` touch.
- No placement-state writeback (see §2c below for the precise rule).
- `localStorage` only; tolerates SSR / private-mode / disabled storage
  by silently no-op'ing.
- Idempotent on identical inputs — duplicate appends are dropped, not
  double-counted.

The detector's tag enum (`L1WeaknessTag` in
`src/lib/feedback/l1-error-detector.ts`) is the **public contract**
between §4 and the adapters. Renaming or removing a tag breaks
downstream readers.

### 1c. Stage 3B — Suggested Practice (not on `main` as of this audit)

Stage 3B reads Stage 3A's local buffers, applies the `(c+)` trigger
semantics (context-triggered AND learner-controllable), and surfaces
**one** soft suggestion when there's fresh evidence + a useful next
action. Operational rules from `layer-model.md` §"3B":

```text
                ┌──────────────────────────────────┐
                │   Stage 3A localStorage buffers  │
                └──────────────────┬───────────────┘
                                   │  (cap-bound reads)
                                   ▼
                ┌──────────────────────────────────┐
                │  3B engine: rank → filter → pick │
                │  • fresh signal? (recency cap)   │
                │  • next-action exists?           │
                │  • not already suggested today?  │
                └──────────────────┬───────────────┘
                                   │
                                   ▼
                ┌──────────────────────────────────┐
                │  One soft suggestion in learner  │
                │  language ("You may want to…")   │
                └──────────────────┬───────────────┘
                                   │  on-tap
                                   ▼
                       /practice/<area>/<focus>
```

**Strategic guardrails (`layer-model.md` §"3B" + `STRATEGY.md` (V3 — Competitive thesis)):**

- No daily requirement / no streak language / no XP loop.
- No shame or guilt copy.
- No pushy modal.
- **No server write.**
- No global learner score.
- Dismissible every time; learner can turn suggestions off entirely.

**Status as of this audit:** 3B exists as feat branches
(`feat/stage-3b-suggested-practice-engine`,
`feat/stage-3b-suggested-practice-ui`, `feat/stage-3b-perf-and-counter`)
but is **not** merged to `main`. There is a v1 server-state surface in
`src/lib/weakness/recommendationEngine.ts` that performs an
*analogous* role today, reading `mb_user_weakness_profile` from
Supabase — see [system-overview.md §7](./system-overview.md#7-weakness-recommendation-engine-study-os-v1-surface).

When 3B lands, expect: a new `src/lib/stage-3b/` directory; a
`SuggestedPractice` component mounted at the right surfaces; a
sibling-to-3A boundary contract identical to §1b above plus
"engine output is suggestion-shaped, not score-shaped."

### 1d. Practice route

The terminal stop. Stage 3B's suggestion routes the learner to a
`/practice/*` URL — typically `/practice/phoneme/:phonemeSlug` for
pronunciation, `/vocabulary/review` for SRS, `/speak` for the
discrimination-drill UI, or back to `/room/:roomId` for a content
room.

This is where local-only signal **becomes** server-visible — completing
the lesson writes to the relevant Supabase table (room attempts,
phoneme attempts, drill graduation, etc.). The 3A buffers
**continue** to mirror the resulting per-turn signal, closing the
loop.

---

## 2. Supabase boundary: local vs. backend

The repo has one explicit invariant about what crosses the boundary
and what does not. Get this wrong and you either break the local-only
posture (`layer-model.md` §"Local-Only Posture"), leak PII, or accidentally
create cross-surface coupling (`STRATEGY.md` (V3 — Competitive thesis)).

### 2a. What stays local-only

- **Stage 3A ring buffers.** L1 tags, placement snapshots,
  pronunciation phoneme attempts. Per-device. Never synced.
- **Anonymous language-pair selection.** `mb.lang.pair`. Promoted to
  `profiles.native_language` + target column on signup.
- **Tracking consent.** `setMarketingConsent` writes localStorage,
  gates Pixel/GA4/UTM. Per-device. Email opt-out is a separate
  server-side concern.
- **Companion / Mercy-widget UI state.** Local UI prefs that aren't
  account-portable.
- **Audio cache** (Workbox runtime + Supabase Storage URL fetches).
  Cached on first play; offline thereafter.

### 2b. What crosses to Supabase

| Direction          | Surface                                    | What flows                            |
|--------------------|--------------------------------------------|---------------------------------------|
| Browser → Postgres | `profiles`                                 | name, native_language, settings (RLS-guarded; browser `tier` writes removed) |
| Browser → Postgres | `placement_sessions`, `placement_responses` | learner answers, IRT updates          |
| Browser → Postgres | `room_attempts`, `lesson_attempts`         | completion records                    |
| Browser → Postgres | `mb_user_weakness_profile` (view)          | derived from attempts (read-only)     |
| Browser → Postgres | `mercy_user_facts`                         | semantic person memory (§2d)          |
| Browser → Storage  | `room-audio` bucket                        | reads only; public bucket             |
| Browser → Edge fn  | `azure-phoneme`, `ai-tutor`, `placement-session`, `me-entitlement`, etc. | scoring, LLM calls, placement engine |
| Browser → Edge fn  | `email-broadcast` (admin only)             | campaign send (admin-gated)           |
| Webhook → Edge fn  | `apple-webhook`, `apple-server-notifications`, `stripe-webhook` — all three are **Supabase edge functions** posted to directly by the respective providers (Stripe → `https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook`; not routed through Netlify, Vercel, or Cloudflare DNS). See [`systems/billing-entitlement.md` §5d](./systems/billing-entitlement.md) for the verified host treatment. | subscription state changes            |
| Cron → Edge fn     | `admin-daily-digest`, `email-reengagement`, `send-pending-emails`         | scheduled jobs                        |

The **browser** always uses the singleton in `src/lib/supabaseClient.ts`
(anon key). Server-side service-role clients live in the serverless
functions under `api/*` and the Supabase edge functions under
`supabase/functions/*` — never bundled to the browser.

There is **no HTML SSR** in this app (see [system-overview.md §1](./system-overview.md#1-application-shell--routing));
`npm run build` is a plain `vite build` SPA, and the host (Netlify
post-2026-05-27 migration; Vercel as documented recovery —
`vercel.json` retained for the recovery path) rewrites everything
to a static `index.html`.

### 2c. Placement writeback boundary (directional contract)

The most-misunderstood rule. From `placement-v3.md` "Placement Writeback Boundary" and the
in-file doctrine in the Stage 3A adapters:

> *"The 'no Placement writeback' invariant is a directional contract,
> not a no-writes contract. It governs who is allowed to write to
> placement state, not whether placement state is ever written."*

- ✅ **Permitted.** The placement edge function ITSELF writing to
  `profiles.placement_*` columns and to `placement_sessions` /
  `placement_responses` on its own completion. This is the engine
  recording the result of the session it just ran.
- ❌ **Prohibited.** Writebacks FROM other surfaces INTO placement
  state. Study OS, `mercy_user_facts`, episodic memory, AI Tutor,
  Mercy Kids, Stage 3A adapters, the weakness recommender —
  **none** of these may write to `profiles.placement_*`,
  `placement_sessions`, or `placement_responses`.

The placement engine is the authoritative writer of its own results;
every other system reads.

### 2d. Semantic memory vs. behavioral signal

Two different stores that are easy to conflate:

- `mercy_user_facts` (Supabase table) — **semantic** person memory.
  Things Mercy remembers about the learner as a person (name,
  goals, ongoing context). Owned by the teacher-mercy engine
  ([system-overview.md §3](./system-overview.md#3-teacher-mercy-engine)).
- Stage 3A localStorage buffers — **behavioral** signal. What the
  learner has been doing recently in study flows. Owned by the
  Stage 3A adapters ([system-overview.md §6](./system-overview.md#6-stage-3a--local-weakness-map-study-os)).

The two **must not** be cross-written. Study OS event summaries may
*later* derive from `#1109` safe local learning events, but they
must remain **counts, booleans, timestamps**, never raw learner text /
transcripts / corrected sentences / PII / child identity / placement
state.

### 2e. PWA service worker & offline cache

The PWA service worker (`registerPwaServiceWorker` IIFE in
`src/main.tsx` → `/sw.js`) runtime-caches:

- HTML — network-first (`pages` cache). Never stale `index.html`.
- Static assets — precached.
- `room-audio` URLs (`(sign|public)` pattern) — runtime cached.

This is what makes "offline after first play" work for adult-room,
`kids/*`, and `music/*` audio (all served from the Supabase
`room-audio` public bucket post-d2951ddd).

`skipWaiting: true / clientsClaim: true` ensures new deploys take
over on next install; `main.tsx` reloads exactly once on
`controllerchange`. The chunk-load-failure auto-reload path
unregisters all SWs first as a safety net.

---

## 3. Entitlement derivation: never `price_id`, never `profiles.tier`

The single rule the rest of the app gates on. Live in
`src/billing/subscriptionRepository.ts` (browser) and
`supabase/functions/_shared/entitlement.ts` (server) — parity required.

### 3a. Inputs

For each user, the derivation reads **rows in `subscriptions`**:

```ts
type SubscriptionRow = Pick<..., "status" | "current_period_end" | "provider">;
```

Three fields. Nothing else.

- `status` — `"active" | "trialing" | "grace_period" | "past_due" | ...`
  These four are *entitling* statuses (predicate
  `isEntitlingSubscription` in
  `subscriptionRepository.ts:90`). Other statuses (`canceled`,
  `unpaid`, `incomplete`, `incomplete_expired`, etc.) are not.
- `current_period_end` — ISO timestamp. The end of the user's paid
  window. Tiebreaker between multiple entitling rows: the **latest**
  `current_period_end` wins.
- `provider` — `"stripe" | "apple" | "google"` (the
  `BillingProvider` enum). Surfaced back as `source` so the UI can
  say "Apple subscription," "Stripe Sub," etc.

### 3b. Derivation rule

The pure function `deriveEntitlementFromSubscriptions(subscriptions)`
in `src/billing/subscriptionRepository.ts`:

```text
1. Filter subscriptions through isEntitlingSubscription().
2. Pick the winner: the row with the latest current_period_end among
   the entitling rows.
3. If no winner → { status: "inactive", expires_at: null, source: null }.
4. Otherwise → { status: "active",
                 expires_at: winner.current_period_end,
                 source: winner.provider }.
```

That is the entire rule.

**Things that explicitly do NOT enter the derivation:**

- `price_id`. Pricing experiments swap `price_id` constantly; gating
  on it is how you accidentally lock out paying users mid-experiment.
- `profiles.tier`. Legacy field, kept around for back-compat reads
  during the entitlement-gate migration; **do not** gate new code on
  it. Per `STRATEGY.md` §6 (entitlement Phase A), the gates now read
  the derived entitlement.
- `'vip'` audience strings. There is no VIP tier (memory:
  [[project_no_vip_tier]]); `vip*` strings in content filenames are
  historical-only.
- `created_at` of the subscription. Latest `current_period_end` wins,
  not latest insert.

### 3c. Layered modifiers (additive only)

The base rule above is wrapped by three additive layers, each in its
own function so the base remains untouched:

1. **Family-plan flow-through** (`computeEntitlementForUser`,
   `src/billing/computeEntitlement.ts`). If a user is an *active
   member* of a family plan, the owner's active entitlement flows
   through with `via_family: true` + `family_plan_id` set. Depth = 1
   (no owner-of-owner chaining). Loader failures *never* downgrade
   the caller's own entitlement.
2. **Gift stacking** (`computeEntitlementWithGifts`,
   `src/billing/computeEntitlement.ts`). Redeemed gifts have a synthetic
   window `[redeemedAt, redeemedAt + duration_months * 30 days]`. The
   *effective* gift end is `max(end)` across all redeemed gifts — not
   sum (so two 3-month gifts redeemed today still expire 3 months from
   now, not 6). Effective entitlement = `max(paid.current_period_end,
   giftEnd)`. If paid is the longer window, paid wins; if gift is
   longer, the gift becomes the active source.
3. **Corporate seat** (`getCorporateSeatEntitlement`,
   `src/billing/computeEntitlement.ts`). An active seat in a
   `corporate_accounts` row with a non-null
   `stripe_subscription_id` projects to `{ status: 'active',
   source: 'stripe', expires_at: null }`. Errors degrade to `null`,
   not to an inactive entitlement (callers fall back to subs).

The three layers are independent and the order in which you compose
them is the caller's choice. Today the typical compose order is:
`own-subs → family-flow-through → gift-stack → corporate`. The
caller picks the most-favourable outcome.

### 3d. Read path

Browser:

```text
useEntitlementQuery(userId)
   ↓
getMeEntitlement()                   ← src/lib/getMeEntitlement.ts
   ↓
edge function: me-entitlement        ← supabase/functions/me-entitlement
   ↓
deriveEntitlementFromSubscriptions(rows)   ← _shared/entitlement.ts
   ↓
{ status, expires_at, source }       ← cached under qk.entitlement(userId)
```

The browser **never** computes entitlement from the raw
`subscriptions` rows itself. Always via the edge function. The
`src/billing/computeEntitlement.ts` family/gift/corporate wrappers
above are used by edge functions and by recomputation jobs — not by
the browser render path.

### 3e. Write path

Subscription rows come from three webhook sources, each routed
through the entitlement recompute:

```text
Stripe webhook   (supabase edge fn)   ──┐
Apple webhook    (apple-webhook)      ──┼─▶  upsert into `subscriptions`
Google purchase  (billing-google-…)   ──┘            │
                                                     ▼
                                        recomputeAndPersistEntitlement
                                        (src/billing/recomputeAndPersistEntitlement.ts
                                         + _shared mirror in edge fn)
                                                     ▼
                                        persists derived entitlement
                                                     ▼
                                        (next read sees the new value)
```

> All three provider webhooks are **Supabase edge functions** (see
> [`systems/billing-entitlement.md` §5d](./systems/billing-entitlement.md)
> "Stripe webhook host — verified"). Stripe is configured to POST
> directly to
> `https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/stripe-webhook`
> — not routed through `mercyblade.com` (Netlify), not via Vercel,
> not via Cloudflare DNS as an origin. The Cloudflare zone covers
> `mercyblade.com` only; `*.supabase.co` is not proxied through it.

The recompute is idempotent + event-id-deduplicated
(`hasProcessedEvent`). Replaying a webhook does not double-write.

### 3f. The legacy `profiles.tier` deprecation

For ~3 weeks after the entitlement Phase A migration, premium gates
were reading the entitlement view directly (`#774`). The
`profiles.tier` column still exists as a read-only fallback for
back-compat but **must not be written** from the browser — the
profile RLS hardening (PR #578) blocks it server-side, and the
`fix/profiles-rls-auth-backfill` change removed the last browser
write. If you find new code writing `profiles.tier`, treat it as a
regression.

---

## Quick reference — "where does X flow?"

| Signal                                | Local? | Server? | Owner                        |
|---------------------------------------|--------|---------|------------------------------|
| L1 transfer tag from a tutor turn     | ✓      | ✓       | §4 detector → 3A buffer (local) + `mb_user_weakness_profile` (server, derived from attempts) |
| Placement CEFR + flagged patterns     | ✓      | ✓       | Placement edge fn writes `profiles.placement_*`; Stage 3A mirrors snapshot locally |
| Phoneme attempt + score               | ✓      | ✓       | Cloud scorer (Azure via edge fn) returns score; Stage 3A mirrors locally |
| Language-pair selection (anonymous)   | ✓      | —       | `mb.lang.pair` localStorage; promoted to `profiles` on signup |
| Marketing/tracking consent            | ✓      | —       | `setMarketingConsent` — never email                       |
| Email subscribe / unsubscribe         | —      | ✓       | Server-side; unsubscribe table still being built          |
| Mercy semantic memory                 | —      | ✓       | `mercy_user_facts` — owned by teacher-mercy engine        |
| Subscription state                    | —      | ✓       | `subscriptions` — webhook-fed, derive-once                |
| Entitlement (active/inactive/source)  | —      | ✓       | Derived from `subscriptions`; read via edge fn            |

If a feature wants to put something local-side that this table says
is server-side (or vice versa), pause — that's a boundary edit, not
an implementation detail.

---

## What this doc does NOT cover

- **Per-table schema details** (column types, indexes). See
  `supabase/migrations/` and memory:
  [[project_db_schema_drift_audit]] for the current drift inventory.
- **Per-feature event names** (analytics, telemetry). See
  `src/lib/tracking/`, `src/lib/analytics/`, and the onboarding
  telemetry memory ([[project_onboarding_telemetry_dark]]).
- **Per-payment-provider quirks** (Apple ASN, Stripe webhook
  delivery, Google purchase token rotation). See `docs/billing/`.
- **CDN / cache invalidation** specifics for Supabase Storage. See
  memory: [[project_supabase_audio_cdn_stale]].

When you need any of those, navigate from this doc to the right
sub-doc.
