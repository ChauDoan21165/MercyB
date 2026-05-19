# C3 fix — speech-analyze hardening

**Status:** code complete, pending push
**Owner:** A4
**Triggered by:** A3 edge-function audit (2026-04-25) — finding C3
**Branch:** `security/a4-speech-analyze-hardening`

---

## Threat model — what A3 found

The previous `supabase/functions/speech-analyze/index.ts` had two
overlapping vulnerabilities:

1. **Spoofable identity.** The function read `userId` from the multipart
   form body and trusted it. Anyone could attribute a speech analysis
   to any user. Concrete impact: analytics fraud (poisoning leaderboards,
   inflating practice metrics), and — critically — bypassing any
   per-user rate limit that might be added later, since the attacker
   could rotate the `userId` value freely.

2. **Open OpenAI cost.** No rate limit, no budget check. Whisper bills
   $0.006 / minute. A scripted attacker submitting 30s clips at
   100 RPS could spend $1,080 / hour against the project's OpenAI
   account. The function had no audit trail, so detection would lag.

A third concern — no audit log for rejected calls — meant abuse
patterns (oversize files, malformed mime types) were invisible.

## What changed

### 1. Identity from JWT, not form data

```diff
- const userId = String(formData.get("userId") ?? "").trim() || null;
+ const user = await getUserFromAuthHeader(req);
+ if (!user) return json({ error: "auth_required" }, 401);
+ const userId = user.id;
```

The form-data `userId` field is silently ignored. Any caller that
wants to attribute work to a user must present a valid Supabase
auth JWT in `Authorization: Bearer …`.

The shared helper `getUserFromAuthHeader` already validates the JWT
through `supabase.auth.getUser(token)` — no DIY JWT decoding here.

### 2. Per-user rate limit — 30 calls / hour

Implemented via `_shared/rateLimit.ts` (`rate_limits` table, no new
infra). 31st call in a rolling hour returns `429`:

```ts
await rateLimit(`speech-analyze:${userId}`, 30, 60 * 60 * 1000);
```

Window is keyed by user-id, so attackers can't rotate the id (it's
JWT-derived now). Cap of 30 × 30s × $0.006/min ≈ **$0.09 / hour /
user** ceiling on Whisper spend.

The helper's existing fail-open posture on infrastructure errors is
preserved — a Supabase outage doesn't break speech analysis for the
whole user base. Deliberate over-limit is rejected.

### 3. OpenAI budget gate — `check_ai_budget` RPC

Same RPC the `ai-chat` function uses:

```ts
const reserveVnd = Math.max(1, Math.ceil(estimatedCostUsd * USD_TO_VND));
const budget = await checkAiBudget(userId, reserveVnd);
if (!budget.allowed) return json({ error: "budget_exceeded" }, 402);
```

The reserve is computed from the audio's *estimated* duration (bytes
÷ assumed bitrate) so a user near their budget ceiling can't slip a
30s call through by mis-stating the size — the function does its own
estimation pre-Whisper.

`402 Payment Required` mirrors the HTTP status convention; the React
caller can map it to an "upgrade or wait" UI.

### 4. Audio validation — 5 MB hard cap, mime allowlist, 30s heuristic

```ts
const MAX_BYTES = 5 * 1024 * 1024;
const DURATION_HEURISTIC_BYTES = 800 * 1024; // ≈30s @ 96kbps webm/opus
const ALLOWED_MIME_TYPES = new Set([
  "audio/webm", "audio/webm;codecs=opus",
  "audio/mp4", "audio/mpeg", "audio/mp3",
  "audio/wav", "audio/wave", "audio/x-wav",
  "audio/ogg",
]);
```

Rejected pre-Whisper, so an attacker can't burn budget on bad input:

| Failure mode | Status | Body |
|---|---|---|
| Empty / missing audio | `400` | `Empty audio file` / `Missing audio file` |
| > 5 MB | `413` | `audio_too_large` |
| > 30 s estimate (>800 KB) | `413` | `audio_too_long` |
| Mime not in allowlist | `415` | `unsupported_audio_format` |

**Strict 30 s enforcement** would require server-side decoding
(ffprobe, etc.) — out of scope for this PR. The byte heuristic is a
pragmatic first cut; abuse patterns will surface in
`speech_analysis_logs.status = 'invalid_audio'` rows.

### 5. Audit log — every invocation, not just success

New table `speech_analysis_logs`
(migration `20260506000000_speech_analysis_logs.sql`):

| Column | Notes |
|---|---|
| `id` | uuid |
| `user_id` | from JWT — authoritative |
| `audio_seconds` | NULL when rejected pre-Whisper |
| `openai_cost_usd` | NULL when rejected pre-Whisper |
| `status` | `ok` / `no_speech` / `rate_limited` / `budget_exceeded` / `invalid_audio` / `whisper_error` / `auth_required` |
| `error_msg` | Truncated to 500 chars |
| `created_at` | default now() |

RLS: owner-read only; admin investigations route through the service
role (server-side). Inserts come exclusively from the edge function
via the service role.

The pre-existing `mb_pronunciation_attempts` insert is kept as-is so
downstream analytics that consumes it doesn't break.

## What didn't change

- **Success response shape** is byte-identical. The React caller
  (`<TalkingFacePlayButton>`, `<SpeechDrillPage>`, etc.) needs no
  updates.
- **Whisper integration** — same `whisper-1` model, same endpoint.
- **No other edge functions** touched (per brief).

## Verification

| Test | Expected |
|---|---|
| `curl` without `Authorization` header | `401 auth_required` |
| `curl` with valid JWT + small webm | `200`, normal response shape |
| 31 calls in 1 hour with same JWT | 31st returns `429 rate_limit_exceeded`, `Retry-After: 3600` |
| 6 MB upload | `413 audio_too_large` |
| 1 MB upload (heuristic-over-30s) | `413 audio_too_long` |
| `audio/x-m4a` mime | `415 unsupported_audio_format` |
| User over `check_ai_budget` | `402 budget_exceeded` with bilingual message |

Manual `supabase functions deploy speech-analyze` then run the matrix
above against staging before flipping to prod.

`speech_analysis_logs` should contain one row per call (success and
rejection alike) — query
`SELECT status, COUNT(*) FROM speech_analysis_logs GROUP BY status`
to verify the audit trail is being written.

## Files in this PR

- New: `supabase/migrations/20260506000000_speech_analysis_logs.sql`
- Edited: `supabase/functions/speech-analyze/index.ts` (full rewrite — same outer contract)
- New: `reports/a4-c3-speech-analyze-fix.md` (this file)

No other files touched.

## Follow-ups (out of scope, separate PRs)

- Server-side audio decoding for strict 30s enforcement (ffprobe binary
  in the Deno runtime).
- Admin dashboard surface for `speech_analysis_logs` (cost roll-ups,
  per-user abuse view).
- Mirror the same `check_ai_budget` + per-user rate-limit pattern on
  any other Whisper / OpenAI-cost edge function discovered during the
  A3 audit (track the next one to A5/A6).
