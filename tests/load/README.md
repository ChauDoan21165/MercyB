# API load tests (k6)

[k6](https://k6.io) load scripts for MercyBlade API/load readiness. These are
**not** part of the unit/CI suite — they are run on demand against a **staging or
local** target.

## Scripts

| Script | Endpoint | Notes |
| --- | --- | --- |
| `mercy-ai.load.js` | `POST /api/mercy-ai` | OpenAI proxy. Sends real inference requests (cost + rate limits). |
| `tts.load.js` | `POST /api/tts` | Azure Speech TTS. Sends real synthesis requests. Default payload is Vietnamese to exercise language-aware voice routing. |
| `lib/options.js` | — | Shared VU-level + threshold builder. |
| `lib/env.js` | — | Base-URL guard, auth headers, JSON payload override. |

Supabase Edge Functions are intentionally **not** scripted here: they can only be
exercised safely read-only or against staging fixtures, and no such safe target
is wired in this repo yet (see "Blocked" below).

## Virtual-user levels

Choose a level with `LOAD_LEVEL` (`50` | `200` | `500`). Each ramps up → holds →
ramps down. Thresholds fail the run if `http_req_failed` rate ≥ 5% or
`http_req_duration` p95 ≥ 3s.

| `LOAD_LEVEL` | Peak VUs | Hold |
| --- | --- | --- |
| `50` (default) | 50 | 1m |
| `200` | 200 | 2m |
| `500` | 500 | 2m |

Override ramp timings with `RAMP_UP` / `RAMP_DOWN` (default `30s`).

## Environment variables

| Var | Required | Purpose |
| --- | --- | --- |
| `BASE_URL` | **yes** | API base URL. **Must be staging/local — never production.** The scripts abort in `setup()` if unset. |
| `MERCY_JWT` | no | Bearer token sent as `Authorization`. |
| `LOAD_LEVEL` | no | `50` \| `200` \| `500` (default `50`). |
| `MERCY_AI_PAYLOAD` / `TTS_PAYLOAD` | no | JSON string overriding the default request body to match the live contract. |

## Running

```bash
# install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/
LOAD_LEVEL=50 BASE_URL=https://staging.example.dev MERCY_JWT=$TOKEN \
  k6 run tests/load/mercy-ai.load.js

LOAD_LEVEL=200 BASE_URL=https://staging.example.dev MERCY_JWT=$TOKEN \
  k6 run tests/load/tts.load.js
```

Syntax check without k6 installed (validates JS only, not k6 imports):

```bash
node --check tests/load/mercy-ai.load.js
node --check tests/load/tts.load.js
node --check tests/load/lib/options.js
node --check tests/load/lib/env.js
```

## Safety

- **Never run against production.** `BASE_URL` is required precisely so a run
  cannot fall back to a default/prod host.
- These scripts perform **no database writes** — they only POST to inference
  endpoints. They still cost money (OpenAI/Azure) and consume rate limit, so use
  a staging target and the lowest level that answers your question.

## Blocked / not-yet-runnable

- **k6 is not installed** in this environment, so only `node --check` syntax
  validation was run here. Run `k6 run …` (commands above) once k6 is installed
  and a staging `BASE_URL` exists.
- **No staging target is wired** in the repo. Until one exists, treat the run
  commands above as the documented-but-unexecuted runtime. Do not point them at
  production to "make them run".
