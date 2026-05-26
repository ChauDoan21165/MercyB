> ⚠️ **ARCHIVE-CLASS (April 2026)** — historical runbook/recon kept in
> place due to live cross-references outside `reports/`. Do not act on
> this document without verifying current state. See
> `reports/archive/agent-runs-2026-04/README.md` for context.

# A2 — C1 fix: `save-room-json` admin auth + filename allowlist

**Date:** 2026-04-25
**Branch:** `security/a2-save-room-json-auth`
**Severity addressed:** P0 — anonymous arbitrary file write to `/public/data/`

## What was vulnerable

Pre-fix `supabase/functions/save-room-json/index.ts`:

```ts
serve(async (req) => {
  ...
  const { filename, content } = await req.json()
  if (!filename || !content) return 400
  const filepath = `./public/data/${filename}`
  await Deno.writeTextFile(filepath, content)
  return 200
})
```

Five overlapping problems:

1. **No authentication.** Anyone with the Supabase project URL could
   `POST /functions/v1/save-room-json` and have it succeed.
2. **No authorization.** Even if a JWT had been required, no role check
   limited writes to admins.
3. **No filename validation.** `filename` was concatenated straight
   into a filesystem path. `"../../etc/passwd"` would have been
   accepted at the validator layer.
4. **No content validation.** Any string went through. Could include
   HTML, JS, or binary-encoded payloads.
5. **No observability.** The only log line was `console.log` on
   success — no audit-trail row, no log of failed/abusive attempts.

The brief noted that A3's audit confirmed this is exploitable in
production right now.

## What changed

Two files now make up the function:

```
supabase/functions/save-room-json/
├── index.ts        — HTTP handler (auth, RPC, audit log, file write)
├── validation.ts   — pure-function validators (allowlist, pattern, size, content-type)
└── __tests__/
    └── validation.test.ts — 20 vitest tests against validation.ts
```

### `index.ts` — handler layer

- **Auth (401).** Extracts `Authorization: Bearer <jwt>`; calls
  `supabase.auth.getUser(token)`. Missing or invalid token → 401
  with audit log entry.
- **Authorization (403).** Calls
  `supabase.rpc('get_admin_level', { _user_id })`; if the result is
  `< 9`, returns 403. Matches the level-9 threshold used by
  `developer_*` and analytics RPCs.
- **Method (405).** Anything other than `POST` (or the `OPTIONS`
  preflight) returns 405.
- **Body parsing (400).** Rejects malformed JSON before any further
  processing.
- **Validation passthrough.** Calls `validatePayload` from
  `validation.ts` and returns the first failure verbatim.
- **File write.** On full pass, calls `Deno.writeTextFile`. (See
  "Caller analysis" below — this write is, in practice, a no-op
  for production deploys because edge-function filesystems are
  ephemeral.)
- **Audit log.** Every attempt — success, 4xx, 5xx — writes one
  row to `api_request_logs` (Round 12 table) and one row to
  `audit_logs` (with `type='save_room_json_attempt'`,
  `metadata={filename, status_code}`). Audit-log failures never
  affect the user-facing response.

### `validation.ts` — pure-function layer

- `ALLOWED_FILES: readonly string[]` — **starts empty by design**.
  See "Caller analysis" below; until Chau confirms a real consumer,
  every otherwise-valid request returns 400 *"Filename not allowed"*.
- `MAX_CONTENT_BYTES = 1_000_000` — 1 MB cap.
- `SAFE_FILENAME_RE = /^[a-z0-9][a-z0-9_-]{0,79}\.json$/` —
  defence-in-depth; even if the allowlist is updated incorrectly, a
  filename containing `/`, `\`, `..`, uppercase, Unicode, or a
  non-`.json` extension is rejected.
- `rejectContentType` — only `application/json` (with optional
  charset) accepted; anything else → 400.
- `rejectSize` — counts UTF-8 bytes (not character length, so a
  4-byte emoji repeated past the cap still trips); empty content
  → 400; oversized → 413.
- `validatePayload` — orchestrator, runs in this order: content-type
  → filename → size. Order is intentional (cheapest checks first;
  filename rejection short-circuits before TextEncoder size pass to
  prevent CPU amplification with bogus filenames).

## Filename allowlist

**Current state: empty.** The fix audit grepped for callers across
the worktree:

```
grep -rln 'save-room-json\|saveRoomJson\|save_room_json' src/ scripts/
```

No matches in `src/` or `scripts/`. Two doc references found
(`mercy_core_logic.txt`, `PRODUCTION_READINESS_REPORT.md`) which
list the function name in inventories but do not call it.

Additionally, `Deno.writeTextFile('./public/data/<x>')` from inside
a Supabase edge function writes to the **container's** filesystem,
not to the deployed `public/data/` directory in the repo. Edge
function containers are ephemeral; any successful write is silently
discarded when the container recycles. So even pre-fix, this function
did not actually persist room data. Its threat profile was:

- Successful 200 responses to attackers (giving them confidence to
  pivot to other endpoints).
- Disk fill within the hot container until eviction.
- Hosting attacker-chosen content briefly until eviction.

**Recommendation for callers needing updates:** none. There are
none. If a future caller is added, the allowlist update should
happen in the same PR as the caller code, with both sides linking to
this report.

## Recommendation for follow-up

The function appears to be fully orphaned. Before the next round, I
recommend:

1. **Confirm orphan status.** Search the production Supabase Functions
   logs for the last invocation of `save-room-json`. If there's been
   no real call in the last 30 days, proceed to step 2.
2. **Delete the function.** The cleanest fix is deletion — this
   migration locks it down, but a deleted function is even safer.
   Note that `supabase functions delete save-room-json` would need
   a separate, explicit Chau approval since it's a deploy.

Step 2 is out of scope for this PR per the brief
("DO NOT remove the function (other code may call it)"). The lock-down
path is what shipped here.

## Manual smoke (for QA after deploy)

```bash
# 1. No auth → 401
curl -i -X POST https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/save-room-json \
     -H "Content-Type: application/json" \
     -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     -d '{"filename":"foo.json","content":"{}"}'
# Expect: 401 Unauthorized

# 2. Auth as a non-admin user → 403
TOKEN="<non-admin user JWT>"
curl -i -X POST .../save-room-json \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     -d '{"filename":"foo.json","content":"{}"}'
# Expect: 403 Forbidden

# 3. Auth as admin (level >= 9), path traversal filename → 400
TOKEN="<admin user JWT>"
curl -i -X POST .../save-room-json \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     -d '{"filename":"../../etc/passwd","content":"{}"}'
# Expect: 400 "Invalid filename"

# 4. Admin, valid filename pattern, but not on allowlist → 400
curl -i -X POST .../save-room-json \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -H "apikey: $VITE_SUPABASE_ANON_KEY" \
     -d '{"filename":"addiction_support_free.json","content":"{}"}'
# Expect: 400 "Filename not allowed"
```

## Verify gates

- `npm run typecheck` → clean.
- `npx vitest run supabase/functions/save-room-json` → 20/20 pass.
- `npx vitest run` (full suite) → **2610/2610 pass**.

## Files changed

| File | Change |
| --- | --- |
| `supabase/functions/save-room-json/index.ts` | Rewritten: auth + admin RPC + audit log + file write |
| `supabase/functions/save-room-json/validation.ts` | New: pure validators + allowlist (empty by design) |
| `supabase/functions/save-room-json/__tests__/validation.test.ts` | New: 20 vitest tests |
| `reports/a2-c1-save-room-json-fix.md` | This report |

## Out of scope (per brief)

- Removing the function entirely (deferred to a follow-up).
- Touching other edge functions.
- Changing the success response shape (preserved verbatim:
  `{ success: true, message, path }`).
