# AI Tutor Smoke Evidence Archive

Use this archive for the completed authorized A3 synthetic smoke evidence. Never record secret values, raw API keys, smoke token values, production learner text, or unredacted credentials. Real provider execution must end BLOCKED.

## Date/time

- UTC: `2026-05-23T18:38:57Z`
- Local timezone: `2026-05-23 12:38:57 MDT`
- Evidence prepared by: Fixer

## main HEAD

- Branch: `main`
- Commit SHA: `e43d83b2787de85a9b060e65a8f5bf9c0c355e12`
- Commit subject: `test(placement): add typed v4 telemetry harness (#1026)`
- Dirty status: archive file updated for smoke evidence closeout

## Deployed function

- Function name: `ai-tutor`
- Deployment target: not provided by A3 evidence
- Deployment command/source: not provided by A3 evidence
- Deployed version/SHA: not provided by A3 evidence
- Deployment timestamp: not provided by A3 evidence

## Secrets touched

Record names only. Never record values.

- Secret names:
  - `TUTOR_SMOKE_TOKEN`
  - `DEEPSEEK_API_KEY`
  - `REAL_PROVIDER_ENABLED`
- Set/update/delete action: smoke enablement and re-block reported by A3
- Operator authorization reference: A3 authorized one synthetic smoke

## Smoke request

Mark input as synthetic. Redact token.

- Endpoint: `/functions/v1/ai-tutor`
- Method: `POST`
- Headers:
  - Authorization: `[REDACTED]`
  - `x-tutor-smoke-token`: `[REDACTED]`
- Smoke token source: `x-tutor-smoke-token` header
- `body.smokeToken` used: `NO`
- Synthetic input summary: one synthetic sentence correction request
- Synthetic/non-learner/no PII: `YES`
- Learner text included: `NO`
- Batch: `NO`
- Retry: `NO`
- Raw request body stored: `NO`
- Redacted request body:

```json
{
  "mode": "sentence_correction",
  "userPrompt": "[SYNTHETIC] She go to the market every morning."
}
```

## Response body

```json
{
  "ok": true,
  "content": "{\"corrected\": \"She goes to the market every morning.\"}",
  "usage": {
    "prompt_tokens": 53,
    "completion_tokens": 14,
    "total_tokens": 67
  },
  "requestId": "759512eb-d63d-4648-b4dd-cda50f14611a"
}
```

## HTTP status

- Status: `200`
- Expected status: `200`
- Pass/fail: `PASS`

## requestId

- requestId: `759512eb-d63d-4648-b4dd-cda50f14611a`
- Source field: smoke response/request evidence

## Server log fields

Record fields only, not secrets or raw learner text.

- timestamp: not provided by A3 evidence
- requestId: `759512eb-d63d-4648-b4dd-cda50f14611a`
- function: `ai-tutor`
- provider mode: real provider smoke, then re-blocked
- provider selected: DeepSeek, per secret name and A3 smoke context
- gate state: allowed for exactly one synthetic smoke
- error code: none for smoke response
- latency: not provided by A3 evidence
- token/cost metadata: prompt `53`, completion `14`, total `67`
- redaction confirmed: token redacted, API key not stored, no learner text included

## Review verdict table

| Lane | Verdict | Note |
| --- | --- | --- |
| A2 contract | `PASS` | Archive note resolved after this patch. |
| A4 audit | `PASS` | Final audit pass recorded. |
| A5 risk | `APPROVE` | Post-smoke risk approved. |
| A6 validation | `PASS` | 324/324 tests pass after spy hardening. |
| A7 safety/privacy | `PASS` | Safety note resolved by direct spy evidence. |
| A8 cost/reliability | `PASS` | Cost/reliability pass. |

## A4 audit verdict

- Verdict: `PASS`
- Report reference: A4 post-readiness audit verdict
- Required follow-up: none recorded

## A5 risk verdict

- Verdict: `APPROVE`
- Report reference: A5 post-smoke risk verdict
- Required follow-up: none recorded

## A6 validation verdict

- Verdict: `PASS`
- Report reference: A6 post-smoke validation verdict
- Required follow-up: 324/324 tests passed after spy hardening

## A7 safety/privacy verdict

- Verdict: `PASS`
- Report reference: A7 safety note resolved by spy evidence
- Required follow-up: none recorded

## A8 cost/reliability verdict

- Verdict: `PASS`
- Report reference: A8 cost/reliability verdict
- Required follow-up: none recorded

## Re-block command confirmation

- Command executed: not provided by A3 evidence
- Timestamp: not provided by A3 evidence
- Confirmation output: `REAL_PROVIDER_ENABLED=false`; `ai-tutor` redeployed
- Gate state: Gate 4 `provider_disabled` active
- Secrets now blocked: `REAL_PROVIDER_ENABLED=false`
- Real provider execution state: `BLOCKED`

## 503 service_disabled verification

- Endpoint: `ai-tutor`
- Method: not provided by A3 evidence
- HTTP status: `503`
- Error kind: `service_disabled`
- Response body:

```json
{
  "ok": false,
  "errorKind": "service_disabled",
  "message": "Tính năng AI Tutor hiện chưa khả dụng. Vui lòng thử lại sau.",
  "requestId": "f6595116-139f-4211-be26-3b58da3a9048"
}
```

- requestId: `f6595116-139f-4211-be26-3b58da3a9048`
- Re-block state: `REAL_PROVIDER_ENABLED=false`
- Provider execution: `BLOCKED`
- Verification result: `PASS`

## Stage 2 JWT auth evidence archive

- Archive state: `FINAL`
- PR title: `feat(ai-tutor): add JWT deny-by-default auth gate`
- Stage 2 scope: JWT auth-only, deny-by-default.
- Files changed:
  - `supabase/functions/ai-tutor/index.ts`
  - `supabase/functions/ai-tutor/__tests__/index.test.ts`
- Auth behavior added:
  - Adds JWT auth gate before body parse, provider gates, and provider calls.
  - Validates JWT shape, decodes JSON payload, rejects expired tokens when `exp` is present, and requires `sub`.
  - Missing, malformed, invalid, or no-role JWT returns HTTP `401` / `errorKind:"unauthorized"`.
  - Reads role from `role` or `user_role`.
  - Logs auth failures as metadata only: `auth_failed`, `requestId`, and safe reason.
  - Auth failure body is static and safe.
  - Valid smoke-token operator path is preserved.
  - Invalid smoke token does not bypass JWT.
- Unauthorized response behavior:
  - HTTP status: `401`
  - `errorKind`: `unauthorized`
  - Detail: `Valid Authorization header required`
  - Unauthorized requests return before body parsing and before provider execution.
- Deny-by-default state:
  - Allowed roles remain empty: `ALLOWED_ROLES=[]`.
  - No roles are authorized by default.
  - Do not add `authenticated` until A1, A4, and A7 approve learner access.
- Validation:
  - 110/110 edge tests `PASS`: 69 `index` + 41 `provider`.
  - 211/211 frontend AI Tutor tests `PASS`.
  - Typecheck clean.
  - D2-T12 JWT auth rejection tests `PASS`.
  - D2-T13 smoke bypass tests `PASS`.
  - D2-T13c fixed and audited `PASS`.
  - Unauthorized requests are blocked before provider/fetch.
  - Provider gates 1-9 preserved.
  - `executeProviderCall` unchanged.
- Reviews:
  - A2 contract: `PASS`.
  - A4 audit: `PASS`.
  - A4 D2-T13c audit: `PASS`.
  - A5 risk: `APPROVE WITH CONSTRAINTS`.
  - A6 validation: `PASS`.
  - A7/A8 covered by combined review: `PASS`.
- Provider gate confirmation:
  - Unauthorized requests do not reach `executeProviderCall`; auth failure returns before provider request construction.
  - Existing provider gate behavior remains unchanged by this archive patch.
  - Existing re-block evidence remains: HTTP `503`, `service_disabled`, `REAL_PROVIDER_ENABLED=false`.
- Authorization boundaries:
  - Deploy: `NOT AUTHORIZED / NOT RUN BY FIXER`.
  - Env/secrets changes: `NOT AUTHORIZED / NOT TOUCHED BY FIXER`.
  - Provider execution: `NOT AUTHORIZED / NOT RUN BY FIXER`.
  - UI exposure: `NOT AUTHORIZED / NOT CHANGED`.
  - Learner/student text: `NOT AUTHORIZED / NOT INCLUDED`.
  - Production traffic: `NOT AUTHORIZED / NOT USED`.
  - Additional smoke: `NOT AUTHORIZED / NOT RUN BY FIXER`.
- Redaction confirmation:
  - Secret values: `NOT STORED`.
  - JWT values: `NOT STORED`.
  - API keys: `NOT STORED`.
  - Learner/student text: `NOT STORED`.
  - Raw private auth payloads: `NOT STORED`.
- Stage 2 provider state: `REAL_PROVIDER_ENABLED=false`; real provider execution `BLOCKED`.

### Spy hardening addendum

- File added: `supabase/functions/ai-tutor/__tests__/index.spy.test.ts`.
- Spy validation: 3/3 spy tests `PASS`.
- Spy proof: unauthorized auth failures do not call `executeProviderCall`.
- Covered cases:
  - No `Authorization` header.
  - Malformed JWT.
  - Empty allowlist.
- Full validation after spy hardening: 324/324 tests `PASS`.
- Typecheck: `PASS`.
- A7/A8 prior notes: resolved by direct spy evidence.
- Redaction confirmation: no secret values, JWT values, API keys, learner/student text, or raw private auth payloads stored.
- Provider state after addendum: `REAL_PROVIDER_ENABLED=false`; real provider execution `BLOCKED`.

## Final state

- `REAL_PROVIDER_ENABLED=false; real provider execution BLOCKED`
- Smoke call count: exactly `1`
- Smoke token: `REDACTED / NOT STORED`
- Raw API key: `NOT STORED`
- Learner text: `NOT INCLUDED`
- Synthetic input clearly marked: `YES`
- Production traffic touched: `NO`
- UI exposure: `NO`
- Remaining action: none recorded
