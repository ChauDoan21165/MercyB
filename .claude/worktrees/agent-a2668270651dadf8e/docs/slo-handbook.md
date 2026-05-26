# SLO handbook

How MercyBlade tracks reliability, when to act on it, and how the math works.

## TL;DR

- We define **SLOs** (e.g. "99% of `azure-phoneme` requests succeed within 3s over 28 days").
- Each SLO has an **error budget** = `100% - target_percent`. For 99%, the budget is 1% of requests.
- The **burn rate** says how fast we're consuming the budget vs a steady linear pace.
- When the burn rate spikes, an alert email goes to `admin@mercyblade.com` and an **incident** is auto-opened.
- The `/admin/slo` dashboard lets you toggle a `slo_pause_active` flag to signal "pause non-critical work."

## Current SLOs

Defined in `src/config/slos.ts` (and mirrored in `supabase/functions/_shared/sloConfig.ts` for the cron):

| ID                  | Target | Window | Source            | Notes                                            |
|---------------------|--------|--------|-------------------|--------------------------------------------------|
| `azure_phoneme_p99` | 99.0%  | 28d    | `latency_events`  | success+duration ≤ 3000 ms                       |
| `ai_chat_p99`       | 99.0%  | 28d    | `latency_events`  | success+duration ≤ 5000 ms                       |
| `mercy_tts_p99`     | 99.0%  | 28d    | `latency_events`  | success+duration ≤ 8000 ms                       |
| `app_crash_rate`    | 99.9%  | 7d     | `sentry_snapshot` | needs external Sentry → DB writer (pending)      |
| `db_query_p95`      | 99.0%  | 1d     | `pg_stat_snapshot`| needs pg_stat_statements snapshot writer (pending) |

The two snapshot-sourced SLOs show as **No data** until a writer populates `sentry_crash_rate_snapshots` and `db_p95_snapshots`. Plan: a future scheduled function pulls Sentry's session-health API once an hour and inserts a row via `snapshot_app_crash_rate(percent, n)`. Same for DB P95.

## Reading the dashboard

Status bands (in `src/config/slos.ts → BUDGET_STATUS_BANDS`):

- **Healthy** — ≤50% of the budget consumed. Keep shipping.
- **Warning** — 50–80% consumed. Review recent merges. Don't add risky features.
- **Critical** — 80–100% consumed. Pause non-critical work. Investigate top contributors via `/admin/slo/<id>`.
- **Exhausted** — 100%+ consumed. SLO has been missed for the window. Reliability work is the only priority until back to healthy.
- **No data** — under 20 samples in the window. Don't trust the number.

## Burn-rate math

The thresholds come from the Google SRE workbook:

- **Fast window** (1 hour): if the bad-rate measured over the last hour, divided by the SLO's allowed bad-rate, is ≥ **14.4×**, page immediately. At that pace, a 28-day budget exhausts in <2 days.
- **Slow window** (6 hours): if the 6-hour bad-rate is ≥ **6×** the allowed rate, alert. ~5 days to exhaustion.

Both windows are evaluated each cron run. Either trigger fires the alert. The fast trigger wins when both fire (it's the more urgent signal).

## When the alert fires

Email subject: `🔥 SLO burn rate alert: {name} is burning at N× normal`. Body includes:

- Current actual % and budget remaining
- Burn rate and which window triggered
- A suggested action (pause non-critical merges, investigate recent change to the underlying operation)

Dedup: max 1 alert per SLO per 6 hours. Sustained burns produce repeating alerts past the dedup window — that's intentional, the second alert means "still bad."

## Incident lifecycle

- **Auto-open**: on the first cron run where an SLO's status is `critical` or `exhausted` and no open incident exists.
- **Auto-update**: peak burn rate is bumped if a later check sees a higher rate.
- **Auto-resolve**: when the SLO has been `healthy` for ≥4 hours AND no burn alerts have fired in that 4-hour window.

Incidents are cosmetic — they don't gate anything by themselves. They give post-mortems a clean timeline.

## "Pause non-critical work"

Toggling the dashboard button flips `feature_flags.slo_pause_active` to `true`. Today this is **read by no automation** — it's a signal future code can branch on:

```ts
import { readSloPauseFlag } from "@/lib/admin/incidentLog";
const { active } = await readSloPauseFlag();
if (active) {
  // skip enabling a new experiment, raise the bar for opening risky PRs, etc.
}
```

Phase 2 will wire CI to read this and block non-critical merges.

## When to renegotiate vs fix

If an SLO is **regularly** in critical/exhausted, there are two responses:

1. **Fix** — the SLO is correct, the system is wrong. Latency regressions, capacity issues, error rates climbing. Pause non-critical merges and ship reliability fixes.
2. **Renegotiate** — the SLO target was set too aggressively for the underlying system's nature. e.g. mercy-tts cache misses are inherently slow (~5s); demanding 99% within 8s might just not be realistic if cache hit rate isn't where we want it. In that case: change `target_percent` or `good_threshold_ms` in `src/config/slos.ts` and document why in the commit message.

The bar for option 2: at least one full SLO window of evidence + an honest write-up of why the target is wrong. Don't relax the SLO just to make the dashboard green.

## Data retention

- `slo_burn_alerts`: 90 days (auto-cleaned by `delete_old_slo_data()`)
- `sentry_crash_rate_snapshots`: 30 days
- `db_p95_snapshots`: 30 days
- `slo_incidents` (resolved): 180 days

Cron job: `slo-cleanup-daily` at 02:30 UTC.

## Adding a new SLO

1. Add a row to `SLOS` in `src/config/slos.ts` AND in `supabase/functions/_shared/sloConfig.ts` (mirror).
2. Decide the data source. If it's a new operation in `latency_events`, add the operation to `MONITORED_OPERATIONS` in `src/config/latencyThresholds.ts` first.
3. Pick the threshold from real data — read 2 weeks of `latency_aggregates` first, set `good_threshold_ms` ≈ the P95 you observe, and `target_percent` = 99% (default).
4. Run `npm test src/lib/admin/__tests__/errorBudget.test.ts` to confirm the new SLO doesn't break the canonical math.
5. Deploy: `supabase functions deploy error-budget-alert`.

## Why this exists

A solo dev shipping 50+ PRs in one night with parallel agents is at high risk of slow reliability erosion. Sentry catches crashes (a known unknown). Latency monitoring catches request slowdowns (PR #185). Error budgets are the strategic layer: "are we trending toward unreliable?"

The first time you discover you've burned half your monthly budget in 5 days, you'll wish you'd had this dashboard a week earlier. Build it before you need it.
