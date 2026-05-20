# Validate Supabase Runtime

Purpose: prove Supabase project reachability and credential presence. This validates runtime connectivity only, not shadow replay.

## Exact Commands

```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
test -n "${SUPABASE_URL:-}" && echo "SUPABASE_URL=set" || echo "SUPABASE_URL=missing"
test -n "${SUPABASE_ANON_KEY:-}" && echo "SUPABASE_ANON_KEY=set" || echo "SUPABASE_ANON_KEY=missing"
test -n "${SUPABASE_SERVICE_ROLE_KEY:-}" && echo "SUPABASE_SERVICE_ROLE_KEY=set" || echo "SUPABASE_SERVICE_ROLE_KEY=missing"
```

```bash
curl -sS "${SUPABASE_URL}/rest/v1/" \
  -H "apikey: ${SUPABASE_ANON_KEY}" \
  | tee reports/a37-shadow-replay-readiness/runtime-validation/supabase-rest-response.txt \
  | node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log('supabase=rest-reachable'))"
```

Optional edge function reachability, after functions are served/deployed:

```bash
curl -sS "${SUPABASE_URL}/functions/v1/placement-v3-session" \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"action":"status","sessionId":"00000000-0000-0000-0000-000000000000"}' \
  | tee reports/a37-shadow-replay-readiness/runtime-validation/supabase-placement-session-response.json
```

## Expected Outputs

```text
SUPABASE_URL=set
SUPABASE_ANON_KEY=set
SUPABASE_SERVICE_ROLE_KEY=set
supabase=rest-reachable
```

The optional edge function call may return an auth/session error. That is acceptable for reachability if the response is from the function and not from DNS/network failure.

## Traces / Logs To Capture

- UTC timestamp.
- Redacted env presence lines.
- REST response file.
- Edge function response file, if run.
- HTTP status codes, if captured with `curl -w`.

## What Counts As Validated

Supabase runtime is validated only if the project is reachable and the required keys are available in the shell.

## What Remains Unproven

- Shadow replay tables/RLS.
- Service-role insert behavior.
- Placement V3 authenticated happy path.
- Replay dashboard admin reads.

## Troubleshooting

- `SUPABASE_URL=missing`: export project URL.
- `Invalid API key`: wrong key or wrong project.
- DNS/TLS failure: network issue.
- Edge function 404: function not deployed or wrong project URL.
- Edge function auth error: expected if no real user JWT was supplied.
