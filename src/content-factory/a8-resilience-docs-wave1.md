# MercyBlade Resilience Docs — Wave 1

**Product line:** R4 resilience docs (Content Factory Charter §6)
**Author:** A8 · **Wave:** 1 · **Status:** draft (Chau spot-check welcome)
**Scope:** core-path failure inventory, graceful-degradation patterns,
golden-flow gate reference, recovery runbooks. Pure docs — no engine wiring.

---

## What "resilience" means here

From the company lessons log (Rule 3): *"Core path must survive optional
failures. Nice features must fail softly."*

This document catalogs **what the core paths are, how each can fail, what
the user sees when they do, and how to confirm recovery**. It is the
reference a developer reaches for when something is broken in production and
they need to triage fast.

---

## 1. Core paths and their fail-soft contracts

Each core path has a **primary** and at least one **fallback**. The contract
is: if the primary fails, the fallback must run silently and the product must
remain usable.

### 1.1 Room audio — Supabase CDN

| Layer | Mechanism | User sees on failure |
|-------|-----------|----------------------|
| Primary | `getPublicUrl('room-audio', filename)` via Supabase | Audio plays |
| Fallback | `{ url: '/audio/{key}', fallback: true }` (silent) | Silent audio button |
| SW cache | Workbox caches `/sign/` + `/public/` patterns after first play | Offline plays from cache |

**How it fails:** Supabase CDN unreachable, bucket policy changed, key
missing from bucket.

**How to detect:** `resolveRoomAudioUrl` emits
`console.warn('[roomAudioResolver] falling back to local …')` on every
signing error. Sentry alert on this pattern catches bucket-wide failures.

**Recovery:** Confirm bucket is PUBLIC in Supabase Dashboard → Storage.
Re-upload any missing files. The SW cache means users who have played the
audio before remain unaffected offline.

**Invariant never to break:** `tryResolveLocal` must return `null` for all
`kids/*`, `music/*`, and room-audio keys (they all route through Supabase,
not local). Re-localizing bloats the bundle past Google Play's 200 MB limit.

---

### 1.2 TTS — Azure primary, ElevenLabs fallback

| Layer | Mechanism | User sees on failure |
|-------|-----------|----------------------|
| Primary | Azure Speech Services (`/api/tts` → `mercy-tts` edge fn) | Vietnamese audio plays |
| Fallback | ElevenLabs (`mercy-tts` internal fallback) | Audio plays (different voice) |
| Tertiary | No audio (silent); `x-tts-fallback-reason` header set | Silent play button |

**How it fails:** Azure cold-start timeout (rare, ~2 s), Azure 5xx, key
expiry, ElevenLabs quota exceeded.

**Detecting:** Golden-flow check TTS (flow 2) asserts:
```
response.headers()["x-tts-provider"] === "azure"
response.headers()["x-tts-fallback-reason"] === undefined
```
A red TTS flow means the primary path is broken or the fallback was invoked.

**Recovery:** Deploy `mercy-tts` edge function after any env-var change
(`supabase functions deploy mercy-tts --project-ref buemdfxyhxunzpgdoqin`).
The `/api/tts` Vercel/Netlify function is a thin proxy — the logic lives in
the edge function. A 502 from `/api/tts` almost always means the Pages
function layer, not Supabase.

**Known quirk:** The `/api/tts` Netlify function passes through a raw 502
if the edge function returns one. The fix (typed 503 with retry-after,
shipped in !757) wraps this so clients get a retryable 503, never a raw 502.

---

### 1.3 AI conversation — premium gate, graceful 403

| Layer | Mechanism | User sees on failure |
|-------|-----------|----------------------|
| Auth gate | `supabase.auth.getUser(token)` in `api/mercy-ai.ts` | 401 if token invalid |
| Tier gate | `me-entitlement` edge fn → `is_premium` | 403 `{ error: "Premium required" }` |
| AI call | Claude (primary), with timeout | AI reply |
| Fallback | `{ error: "…" }` JSON, never silent | Error shown in UI |

**How it fails:** Token expired (common after ~1 hour idle), Anthropic API
downtime, entitlement edge-function cold-start timeout.

**Detecting:** Golden-flow check GATE (flow 4) asserts the free-user path
returns 403 with `"Premium required"`. Golden-flow check FOLLOW (flow 3)
asserts the premium path returns 200 with a context-aware reply.

**Tier-gate invariant:** The 403 body MUST NOT contain `reply` or `cost`
fields (golden-flow check 4 asserts this). Leaking even an empty `reply`
field would expose a billing bypass surface.

**Recovery:** Expired JWT: user re-signs in. Anthropic downtime: the UI
shows the error string; the core product (rooms, lessons) is unaffected
because this is an optional premium feature.

---

### 1.4 Supabase auth backend

| Layer | Mechanism | User sees on failure |
|-------|-----------|----------------------|
| Primary | `buemdfxyhxunzpgdoqin.supabase.co/auth/v1` GoTrue | Sign-in works |
| OTP path | 6-digit code entry (app uses OTP, not magic link) | Code emailed |
| Password path | Password grant (test users only) | Token returned |

**How it fails:** Supabase project unreachable (DNS failure, project paused),
email provider down, wrong `VITE_SUPABASE_URL` in the deployed bundle.

**Detecting:** Golden-flow check SIGNIN (flow 5) hits `/auth/v1/health`
directly and expects a GoTrue-shaped response (200 or 401). A DNS failure
returns HTTP 000 from curl — the check fails immediately with a connection
error, not a 4xx.

Golden-flow check AUTH CONFIG (flow 1) fetches the served JS bundle and
asserts it contains the literal project ref `buemdfxyhxunzpgdoqin`. A bundle
built with a wrong/placeholder `VITE_SUPABASE_URL` fails this check before
any user even tries to sign in — the check catches a misconfigured deploy
before it ships.

**Recovery:** Wrong project ref in bundle → redeploy with correct
`VITE_SUPABASE_URL=https://buemdfxyhxunzpgdoqin.supabase.co`.

---

### 1.5 Browser speech synthesis (adult Speak tab)

| Layer | Mechanism | User sees on failure |
|-------|-----------|----------------------|
| Primary | `window.speechSynthesis.speak()` (browser TTS) | Mercy speaks |
| Failure modes | Chrome drops utterances > ~250 chars silently; `cancel()` can pause the engine; `onvoiceschanged` fires outside gesture window | Silent Mercy |

**How it fails:** Long utterance silent drop, voices not loaded yet,
Chrome engine paused after `cancel()`.

**Mitigations in code:** `speakViaTTS` in `MercySpeakTab.tsx` chunks text
> 180 chars into sentence-sized utterances. Do NOT simplify this — the
chunking is load-bearing. The three known Chrome quirks are documented in
CLAUDE.md under "Traps this codebase hit recently."

**Kids mode exception:** Kids mode uses pre-recorded ElevenLabs mp3 (not
browser TTS). The `kids/*` keys resolve through Supabase, SW-cached for
offline. This is intentional — kids mode must be offline-capable.

---

## 2. Golden-flow production health-check gate

The five golden flows in `tests/golden-flows/prod-golden-flows.pw.ts` are
the standing smoke test that runs on every `main` push via the
`golden-flows-prod` CI job.

| # | Flow name | What it checks | JWT needed? |
|---|-----------|----------------|-------------|
| 1 | AUTH CONFIG | Served JS bundle contains real project ref `buemdfxyhxunzpgdoqin` | No |
| 2 | TTS | Vietnamese text → Azure audio, no silent fallback | No |
| 3 | FOLLOW | Mercy's opener follows learner context, not a canned response | Yes — premium |
| 4 | GATE | Free account gets 403 before any processing; no `reply`/`cost` in body | Yes — free |
| 5 | SIGNIN | GoTrue at the configured Supabase host responds to `/auth/v1/health` | No |

**Flows 1, 2, 5** run green with zero setup on every deploy.
**Flows 3, 4** need `GOLDEN_FLOW_PREMIUM_JWT` and `GOLDEN_FLOW_FREE_JWT`
(or the durable email+password path — see §2.1).

### 2.1 Durable JWT strategy

`scripts/golden-flows.sh` resolves tokens in priority order:

1. `GOLDEN_FLOW_PREMIUM_JWT` / `GOLDEN_FLOW_FREE_JWT` set directly → use
   as-is (expires ~1 hour; for one-off manual runs).
2. `GOLDEN_FLOW_PREMIUM_EMAIL` + `GOLDEN_FLOW_PREMIUM_PASSWORD` +
   `GOLDEN_FLOW_FREE_EMAIL` + `GOLDEN_FLOW_FREE_PASSWORD` +
   `GOLDEN_FLOW_SUPABASE_ANON_KEY` (or `VITE_SUPABASE_ANON_KEY`) → harness
   mints a fresh token at run-time via password grant. Never goes stale.
3. Neither set + `GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1` → dry-run; flows
   3/4 skipped, flows 1/2/5 run.

**Recommended standing setup:** set the 5 email+password+anon vars as
masked GitLab CI variables. Full five flows run on every deploy with zero
maintenance.

### 2.2 Interpreting a red gate

| Which flow red | Most likely cause | First check |
|----------------|-------------------|-------------|
| Flow 1 (AUTH CONFIG) | Bundle deployed with wrong `VITE_SUPABASE_URL` | `grep buemdfxyhxunzpgdoqin` in the deployed JS |
| Flow 2 (TTS) | `mercy-tts` edge function not deployed, Azure key wrong, or Pages 502 passthrough | `x-tts-provider` header; redeploy `mercy-tts` |
| Flow 3 (FOLLOW) | Premium JWT expired, Anthropic API down, entitlement edge fn cold-start | Re-mint JWT or check Anthropic status page |
| Flow 4 (GATE) | Free JWT expired, or the premium gate regressed (free user getting 200) | Re-mint JWT; check `api/mercy-ai.ts` auth guard |
| Flow 5 (SIGNIN) | Supabase project paused or DNS failure | `curl https://buemdfxyhxunzpgdoqin.supabase.co/auth/v1/health` |

**Do not retry a red gate without investigating.** A persistent red on flow
1 or 5 is a production outage. A red on flow 2 is a TTS regression. Only
flows 3/4 can go red from an expired JWT (non-production issue).

---

## 3. Service worker resilience

The PWA service worker (`/sw.js`) uses `skipWaiting: true` / `clientsClaim:
true`. `main.tsx` posts `SKIP_WAITING` on `updatefound` and reloads once on
`controllerchange` so open tabs pick up new bundles without manual refresh.

**Stale-HTML trap:** `index.html` is excluded from the precache and uses a
`network-first` runtime cache. This prevents the SW from serving a stale
`index.html` that references old JS chunk hashes — the failure mode that
caused the 2026-05-14 stale-deploy incident.

**Recovery from stuck SW:** `scheduleOneTimeChunkReload` in `main.tsx` calls
`unregisterAllServiceWorkers()` before the recovery reload. If a user is
stuck on a stale bundle: clearing site data in DevTools → Application →
Storage resolves it. The `chunk-reload-attempted` sessionStorage key ensures
the recovery loop fires exactly once per session.

---

## 4. Audio cache / CDN stale content trap

The `room-audio` bucket is Cloudflare-fronted. After an audio file is
upserted, the CDN may serve stale bytes at the plain URL for minutes to hours.

**Pattern:** if audio sounds wrong after an update, always cache-bust the
verification probe:
```bash
curl -H "Cache-Control: no-cache" "https://buemdfxyhxunzpgdoqin.supabase.co/storage/v1/object/public/room-audio/FILENAME"
```

This is a known trap — do not assume new uploads are immediately live at the
CDN edge. Document this in any audio-upload runbook.

---

## 5. Quick-reference: "something is broken" decision tree

```
1. Is it affecting ALL users or just one?
   └─ ALL → production incident → run golden flows → check Sentry
   └─ ONE → user-specific (expired token, device issue, regional DNS)

2. Is rooms/lessons/audio broken?
   └─ Yes → check Supabase CDN, Workbox cache, browser console for
              [roomAudioResolver] fallback warnings
   └─ No  → it's an optional feature

3. Is AI/Mercy/Speak broken?
   └─ Conversation (403) → tier gate; user needs premium
   └─ Conversation (401) → token expired; re-sign-in
   └─ TTS silent → check x-tts-provider header; redeploy mercy-tts
   └─ Browser TTS silent → Chrome quirk; check chunk size (> 180 chars?)

4. Is sign-in broken?
   └─ Check AUTH CONFIG golden flow — is the bundle pointing at the real project?
   └─ Check SIGNIN golden flow — is GoTrue responding?

5. Is the deploy itself broken?
   └─ Run: GOLDEN_FLOW_ALLOW_MISSING_SECRETS=1 npm run verify:golden-flows
   └─ Flows 1/2/5 give an immediate 3-flow prod health check with no tokens.
```

---

## 6. Resilience invariants — never break these

1. **`toAudioKey` must remain idempotent.** The while-loop stripping `audio/`
   prefixes is load-bearing. Every audio key passes through it defensively.

2. **`tryResolveLocal` returns null for `kids/*`, `music/*`, all room keys.**
   Re-localizing any of these re-bloats the bundle past Google Play's 200 MB
   base-module limit. The guard is in `roomAudioResolver.ts:9–16`.

3. **The golden-flow AUTH CONFIG check asserts a POSITIVE project-ref match.**
   Never regress this to a negative absence-of-placeholder check — that check
   false-alarmed on healthy deploys (2026-06-10 incident).

4. **The tier gate must NEVER return `reply` or `cost` on a 403 response.**
   Golden-flow check 4 pins this. Any change to `api/mercy-ai.ts` that might
   affect the 403 response shape needs a golden-flow verification run.

5. **`VITE_SUPABASE_URL` must be set to the live project in every build.**
   A build with the wrong URL passes typecheck and lint — only the golden-flow
   AUTH CONFIG check catches it. Run the smoke flows after every config change.
