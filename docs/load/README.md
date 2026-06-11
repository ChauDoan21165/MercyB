# MercyBlade Load Testing

Breaking-point k6 scripts for the public, read-only API surface.

> **NEVER run against `mercyblade.com` or any production URL without Chau's explicit approval.**  
> The runner blocks known production domains automatically.

---

## What is tested

| Script | Endpoint(s) | Why safe |
|--------|------------|----------|
| `static-rooms.js` | `GET /data/{roomId}.json` | Static files, 487 rooms, no auth |
| `api-probes.js` | `GET /api/mercy-ai`, `OPTIONS /api/tts`, `OPTIONS /api/mercy/grammar` | No AI calls: GET hint + CORS preflights only |
| `spa-shell.js` | `GET /`, `/signin`, `/signup`, `/pricing` | All return `index.html`, no auth |

**Not tested** (excluded intentionally):
- `POST /api/tts` — triggers Azure/ElevenLabs billing
- `POST /api/mercy/grammar` — triggers OpenAI/Deepseek billing
- `POST /api/mercy-ai` — requires auth + AI cost
- Any Supabase edge function — requires service-role or auth token

---

## Setup

### Option A — Install k6 natively (recommended)

```bash
# macOS
brew install k6

# Verify
k6 version
```

Other platforms: https://k6.io/docs/get-started/installation/

### Option B — Docker (if k6 unavailable)

```bash
docker pull grafana/k6
# The runner script auto-detects Docker and uses it.
```

---

## Running tests

```bash
# All three scripts vs local preview (default — safest)
npm run preview          # builds + serves on :4173
./scripts/load/run.sh

# Against Vite dev server (slower, HMR overhead — not representative)
./scripts/load/run.sh --target http://localhost:3107

# Single script only
./scripts/load/run.sh --script static-rooms

# Dry run — prints k6 commands without executing
./scripts/load/run.sh --dry-run
```

Reports are saved to `reports/load/` as `{script}-{timestamp}.json`.

---

## VU stages (all three scripts)

```
0m ──1m──> 50 VUs  (warm-up ramp)
1m ──3m──  50 VUs  (hold: baseline)
4m ──2m──> 200 VUs (medium-load ramp)
6m ──3m──  200 VUs (hold: normal peak)
9m ──2m──> 500 VUs (breaking-point ramp)
11m──3m──  500 VUs (hold: stress zone)
14m──1m──> 0 VUs   (cool-down)
```

Total wall clock: **~15 minutes per script**.  
Full suite (3 scripts sequential): ~45 minutes.

---

## Reading the numbers

### Pass/fail: thresholds

k6 exits non-zero if any threshold is breached. The scripts enforce:

| Metric | Threshold | What it means |
|--------|-----------|---------------|
| `http_req_failed` | `< 1%` | No more than 1 in 100 requests fails (5xx / network error) |
| `http_req_duration` p95 | `< 400ms` (rooms/API), `< 600ms` (SPA) | 95th percentile response time |
| `http_req_duration` p99 | `< 1200ms` (rooms), `< 800ms` (API), `< 1500ms` (SPA) | 99th percentile response time |
| `shell_ttfb_ms` p95 | `< 200ms` | Time-To-First-Byte for page loads |

A **red threshold** in the terminal output means something broke at scale.

### Key metrics to watch in terminal output

```
✓ http_req_failed..................: 0.12%   ← want < 1%
✓ http_req_duration (p95)..........: 312ms   ← want < 400ms
✗ http_req_duration (p99)..........: 1450ms  ← BREACH — investigate
  vus............................... 500      ← current virtual users
  iterations........................ 42,831   ← total requests sent
```

### Where things usually break

- **Static rooms** degrade at high VUs if Netlify CDN saturates → check `http_req_duration` p99 jump between 200→500 VUs
- **API OPTIONS** rarely fail but slow down when the Netlify function cold-starts under load
- **SPA shell** TTFB spikes reveal CDN edge cache misses — acceptable on localhost, flags a CDN config issue on staging

### Comparing runs

```bash
# Show all saved reports
ls reports/load/

# Quick numeric diff (requires jq)
jq '.metrics.http_req_duration.values' reports/load/static-rooms-*.json
```

---

## CI integration (future)

The runner exits `0` on pass, `1` on threshold breach — plug it into CI as:

```yaml
- run: ./scripts/load/run.sh --target $STAGING_URL --script spa-shell
```

Gated by: explicit `$STAGING_URL` must not match `mercyblade.com`.

---

## File index

```
scripts/load/
  static-rooms.js   Breaking-point: GET /data/{roomId}.json
  api-probes.js     Breaking-point: safe API GETs + OPTIONS preflights
  spa-shell.js      Breaking-point: SPA index.html routes
  run.sh            Runner with --target, --script, --dry-run, prod guard
docs/load/
  README.md         This file
reports/load/       Auto-created; gitignored; JSON summary per run
```
