# Cost Monitoring — operator guide

`/admin/cost-monitoring` is the single source of truth for what MercyBlade is spending on third-party services. Use it before any pricing change, feature flag flip, or "should we keep that integration on?" debate.

## What's measured

| Category | Source table | Unit | Pricing source |
|---|---|---|---|
| **OpenAI / Gemini** (Mercy chat) | `ai_usage_logs` | VND already stored on every row | Recorded at write time by `ai-chat` edge function |
| **ElevenLabs TTS** | `mercy_tts_usage` (cache misses only) | characters × $0.00018 | Creator plan list price |
| **Resend** (email) | `email_sends_log` (`status='sent'` only) | $0.0004 / email | Resend paid tier ($20 / 50k) |
| **Azure Speech** (phoneme analysis) | `speech_attempts` | $0.000833 / attempt (3-sec estimate) | Standard Speech-to-Text |

Costs not yet tracked here:
- **Supabase Postgres + edge functions** — included in the Pro plan ceiling; will become important when usage approaches the cap.
- **Vercel bandwidth** — included in the Hobby/Pro tier; flagged separately if we exit the free tier.

## How to read each metric

### KPI strip (top of page)

- **Hôm nay / Today** — total VND across all four categories for the current UTC day. Updates every 60 s.
- **Dự kiến tháng / Monthly forecast** — average of the last 7 days × 30. Quick gut check on whether the current trajectory will blow the budget.
- **Doanh thu tháng / Monthly revenue** — sum of `recognized_monthly_revenue_vnd` across active subscriptions, joined through `ai_product_catalog`. Same source as `check_ai_budget`.
- **Cost ÷ Revenue** — forecast cost ÷ monthly revenue. **Healthy at < 30%; investigate at > 50%; rethink pricing at > 70%.** When revenue is zero (early launch), shows `—`.

### 7-day stacked bar

Each color is a category. Eyeballing the bar lets you see at a glance *which* provider is driving spend:

- Tall **blue (OpenAI)** → users are chatting more with Mercy. If sustained, consider lowering per-conversation token caps.
- Tall **green (ElevenLabs)** → TTS feature flag is producing cache misses. The cache fills quickly; if green stays high after a week, audit the cache-key derivation.
- Tall **orange (Resend)** → email volume spiked. Check `email_sends_log` campaigns — usually a re-engagement run.
- Tall **red (Azure)** → speech-attempt volume up. That's usually *good* (users practicing) but verify the user base actually grew.

### 30-day table + CSV

Daily total per category in fixed columns (`date,openai_vnd,elevenlabs_vnd,resend_vnd,azure_vnd,total_vnd`). The CSV is RFC-4180 (CRLF, no quoting) — open in Sheets or pipe to your bookkeeping pipeline.

### Per-feature breakdown

Average daily VND across the last 7 days, per category. Use this when deciding which feature flag to flip dark during a cost spike — if `elevenlabs` averages 200k VND/day and `openai` averages 80k VND/day, darkening ElevenLabs first frees more budget per click.

### Top 10 most expensive users

Per-user cost over the last 30 days. The first column is a truncated user_id (hover for full UUID). Watch for:

- **One user dominating** → could be an automated client / abuse. Cross-check with `ai_usage_logs.feature` to see what they're hitting.
- **Same user across all categories** → genuine power user; consider upgrading them to a higher tier or asking if they want enterprise terms.

## Alerts

The page evaluates a forecast vs. a USD threshold (default $100/month, editable inline). The threshold is converted to VND with the displayed FX rate.

| State | Condition | What to do |
|---|---|---|
| `OK` (green) | forecast < 75% of cap | Nothing — keep an eye on the chart. |
| `Watch` (yellow) | 75% ≤ forecast < 100% | Read the per-feature breakdown. Identify the category climbing fastest. Consider tightening rate limits. |
| `Alert` (red) | forecast ≥ 100% | Same as Watch + decide which feature flag to darken (or which user to throttle). Bump the threshold only if you're consciously accepting the higher run rate. |

Escalation is logged to `console.warn` on transitions UP (`ok→watch`, `ok→alert`, `watch→alert`) and stored in `localStorage` (`mb.admin.cost.prevAlertLevel`) so the page does not re-fire on every refresh tick. Wiring an admin email send is a future step — the helper `shouldDispatchEmail()` exists for that integration.

## Pricing decision log

Append a row when costs trigger a change. Keep it short — *what changed, why, when*.

| Date | Change | Reason | Cost impact |
|---|---|---|---|
| 2026-04-26 | Added `/admin/cost-monitoring` | Pre-launch sustainability check; no pricing change | None — observability only |
|  |  |  |  |

## How to update pricing constants

If a vendor changes pricing or we move to a different plan tier:

1. Edit `PRICING_USD` in `src/lib/admin/costMonitoring.ts`.
2. Update the matching row in this guide's table at the top.
3. Add a row to the pricing decision log.
4. Run `npm run typecheck && npx vitest run src/lib/admin/__tests__/`. The constant change should not break tests; if it does, fix the assertion (it was protecting the old number).

## How to bump the FX rate

`DEFAULT_USD_VND_RATE` lives at the top of `src/lib/admin/costMonitoring.ts`. Mid-2026 mid-market is around 25 000 VND/USD; if the State Bank of Vietnam rate moves significantly, bump it. Future enhancement: cache a real FX feed for 24 h and pass through the `usdVndRate` argument that all aggregators already accept.

## Common questions

**Q: My OpenAI bar is bigger than what Stripe shows.**
A: `ai_usage_logs.estimated_cost_vnd` is recorded at write time using a per-model markup. Stripe sees the wholesale price. The dashboard intentionally over-estimates so we never get a surprise invoice.

**Q: ElevenLabs cost is zero but I know we used TTS today.**
A: Cache hits are NOT logged in `mercy_tts_usage`. A green-zero day means the cache absorbed everything — that's the success state. Cost climbs only when new strings or new voices show up.

**Q: A user with no email is at the top of "most expensive users."**
A: They have an account but no email captured. Cross-check with `profiles.id = <uuid>` to see who they are, then ask why their email is missing.
