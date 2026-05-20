# Supabase Setup Runbook

Purpose: clear the Supabase runtime/persistence blocker for future A37 shadow replay validation.

## Required Env Vars

Server/runtime:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Browser/Vite:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Where To Obtain Them

1. Open the Supabase project dashboard.
2. Copy the project URL.
3. Copy the anon public key for browser/client validation.
4. Copy the service role key only for local server/edge validation.
5. Store service role only in local shell, Supabase function secrets, or CI secrets.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser bundle.

## Minimal Permissions

- Anon key: browser reads/writes allowed by RLS only.
- Service role key: server-only edge functions and validation scripts.
- Admin dashboard/replay reads must later be restricted by admin checks and RLS.

## Local Setup Checklist

- [ ] Project URL copied.
- [ ] Anon key copied.
- [ ] Service role key copied to server-only secret storage.
- [ ] Vite public env vars are set only to URL/anon key.
- [ ] No service role key appears in client files or reports.

## Local Verification Commands

```bash
test -n "${SUPABASE_URL:-}" && echo "SUPABASE_URL=set" || echo "SUPABASE_URL=missing"
test -n "${SUPABASE_ANON_KEY:-}" && echo "SUPABASE_ANON_KEY=set" || echo "SUPABASE_ANON_KEY=missing"
test -n "${SUPABASE_SERVICE_ROLE_KEY:-}" && echo "SUPABASE_SERVICE_ROLE_KEY=set" || echo "SUPABASE_SERVICE_ROLE_KEY=missing"
```

Expected success output:

```text
SUPABASE_URL=set
SUPABASE_ANON_KEY=set
SUPABASE_SERVICE_ROLE_KEY=set
```

REST health smoke:

```bash
curl -sS "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(d.length >= 0 ? 'supabase=rest-reachable' : 'supabase=unexpected'))"
```

Expected success output:

```text
supabase=rest-reachable
```

## Common Failure Modes

- `SUPABASE_URL=missing`: project URL not exported.
- `Invalid API key`: anon key is wrong or from another project.
- `401`/`403`: wrong key type or RLS blocks the target operation.
- `SUPABASE_SERVICE_ROLE_KEY` accidentally set in Vite env: severe exposure risk.
- Edge function fails locally because env vars are exported in the shell but not passed to the function runtime.

## Rollback / Revocation Steps

```bash
unset SUPABASE_URL SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY VITE_SUPABASE_URL VITE_SUPABASE_ANON_KEY
echo "SUPABASE_URL=${SUPABASE_URL:-unset}"
echo "SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-unset}"
```

Expected output:

```text
SUPABASE_URL=unset
SUPABASE_SERVICE_ROLE_KEY=unset
```

If service role was exposed, rotate JWT secret/keys according to Supabase incident procedure and invalidate affected deploy/runtime secrets.
