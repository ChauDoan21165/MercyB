# Feedback emitter eras

This note documents the historical row signatures for AI Tutor correction-feedback events in `public.learning_events`.

## Era 1: ungated emitter

- Window: 2026-07-09 through the first production deploy after !2737.
- Source: !2563 introduced the original correction-feedback emitter.
- Gate: no `VITE_FEEDBACK_BUTTONS_ENABLED` gate.
- Row signature:
  - `event_type in ('feedback_helpful', 'feedback_not_helpful')`
  - `payload->>'cell_id'` is null
  - `rule_or_detector_id` often contains chip-tag rule ids such as `vi_l1_past_ed` or `vi_l1_missing_be`
  - `session_id` starts with `local-`
  - `app_version` is null

## Era 2: gated attributed emitter

- Window: first production deploy after !2737 onward.
- Source: !2737 / merge commit `cb7588806bcf0604c749e53215b5e6ce351ab017` relanded correction-feedback attribution.
- Gate: `VITE_FEEDBACK_BUTTONS_ENABLED` must be enabled.
- Row signature:
  - `event_type in ('feedback_helpful', 'feedback_not_helpful')`
  - `rule_or_detector_id` comes from the engine `appliedRuleIds`, not chip/register display tags
  - `payload->>'cell_id'` is populated when the correction is anchored to a persisted WP-CELL-ID-1 UUID

## Era 2 cutover evidence

Operational cutover is the Cloudflare Pages production deployment for merge commit `cb75888`:

- GitLab MR !2737 merged at `2026-07-15T22:31:55Z`.
- GitLab merge commit: `cb7588806bcf0604c749e53215b5e6ce351ab017`.
- Cloudflare Pages production deployment list shows deployment `094e0818-680d-41df-b32c-0b8a1b8fb86b`, branch `main`, source `cb75888`, environment `Production`.
- Production was confirmed serving bundle `index-DLx-Vz0c.js` with the !2737 code at `2026-07-15T23:48:00Z`.

Use `2026-07-15T23:48:00Z` as the conservative analysis cutover when splitting persisted feedback rows. The Cloudflare deployment happened after the GitLab merge and before that served-bundle confirmation; Wrangler's deployment list identifies the deployment and commit but does not expose an exact `created_on` timestamp in its JSON output.

## Analysis query

```sql
select
  case
    when created_at < timestamptz '2026-07-15T23:48:00Z' then 'era_1_ungated'
    else 'era_2_gated_attributed'
  end as feedback_era,
  count(*) as row_count,
  count(*) filter (where payload->>'cell_id' is not null) as rows_with_cell_id,
  count(*) filter (where app_version is null) as rows_with_null_app_version,
  count(*) filter (where session_id like 'local-%') as rows_with_local_session_id,
  min(created_at) as first_created_at,
  max(created_at) as last_created_at
from public.learning_events
where event_type in ('feedback_helpful', 'feedback_not_helpful')
group by 1
order by 1;
```
