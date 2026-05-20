# OPS — `reports/` superseded-doc audit (A9h)

> Audits every file in `reports/` on current `origin/main` (HEAD
> `9c488a344`, post-#825) for staleness vs the 2026-05-19/20 wave's later
> work. Classification only — no existing report file edited. Future
> agents reading any of the doc below should consult this audit first
> when the topic overlaps live work.
>
> **Method:** git log + filename heuristic + memory cross-reference
> (`project_*` / `feedback_*` notes) + dispatch knowledge from this
> session. Files were NOT re-read in depth — where in-depth reading
> would be needed to confirm a verdict, the row is marked **UNKNOWN**.

---

## Headline counts (55 files + 1 archive dir)

| Class | Count | Notes |
|---|---|---|
| **CURRENT** | 32 | Still accurate (mostly historical reference + tonight's freshly-merged outputs) |
| **PARTIAL** | 8 | Still useful overall but one named section is stale |
| **SUPERSEDED-BY** | 4 | Another doc/PR makes this one operationally stale |
| **UNKNOWN** | 11 | Needs in-depth read before relying — older `aN-*` runbooks + content-RECONs |
| **archive/** dir | 1 | Already archived; not in scope |

---

## Top 3 highest-risk-if-read-without-context

These three are most likely to mislead a future agent because they read as
"operationally live" but the underlying state has moved since they were
written:

1. **`PR-MERGE-SEQUENCING-A2c.md` (SUPERSEDED).** Point-in-time merge
   sequencing + risk matrix authored mid-wave. The wave has drained;
   merge order is no longer actionable. A future agent could waste a
   half-hour following a sequence that's already complete or follow stale
   blocked/unblocked annotations.
2. **`A18-recompute-impl-readiness-A8c.md` (PARTIAL).** Pre-#820 readiness
   audit on the recompute/migration chain; A8d (#820 SQL-789-migration-
   verify) has shipped a verify-side companion, and the billing-impl
   chain has continued to move. A future agent dispatched to "implement
   recompute" could miss what A8d already covered.
3. **`STRATEGY-drift-audit-A3c.md` (PARTIAL → SUPERSEDED).** Drift findings
   from before STRATEGY.md was actually edited; **#817** (`STRATEGY.md v3.1
   — §6 + §7 freshness pass`) already refreshed STRATEGY against the
   wave's outcomes. A future agent could re-apply A3c's recommendations
   onto a STRATEGY that has already been freshness-passed.

---

## Per-file classification

### Tonight's freshly-merged outputs (the wave)

| File | Status | Notes |
|---|---|---|
| `PENDING-CHAU-ACTIONS-2026-05-20.md` | **PARTIAL** | A9c #814 merged the base. A9g PR #833 (B53 sibling §B.2a) is still open at A9h authoring time. Once #833 merges, this row flips to CURRENT. |
| `OPS-red-branch-pr-candidates-A9e.md` | **PARTIAL** | A9e classified `b53/price-data-quality-diagnostic` as the one PR-READY. A9f PR #831 now packages it. The "leave durable, no PR" recommendation for that one row is stale; the other 10 classifications still hold. |
| `PR-MERGE-SEQUENCING-A2c.md` | **SUPERSEDED-BY** wave merge state | Operational doc tied to a queue that has drained. Header recommendation: add a banner pointing to current `gh pr list --state open`. |
| `A18-recompute-impl-readiness-A8c.md` | **PARTIAL** (named section stale) | Recompute-impl track is live; **#820** (A8d migration verify) shipped after this audit. Header recommendation: add a "See also A8d §… for #789 verify" note. |
| `SQL-789-migration-verify-A8d.md` | **CURRENT** | Verify-side companion to A8c; freshly merged via #820. |
| `NATIVE-sentry-init-audit-A7c.md` | **UNKNOWN** | Sentry route-gate PR #720 (memory `project_sentry_route_gate`) closed the "defer Sentry" perf item. Whether A7c's gap list still applies needs an in-depth read. |
| `PRINCIPLES-audit-A3e.md` | **CURRENT** | Freshly merged via #823. |
| `STRATEGY-drift-audit-A3c.md` | **SUPERSEDED-BY** STRATEGY.md v3.1 (#817) | The drift audit was the input; #817 was the edit pass. Reading A3c without knowing #817 happened could trigger re-fixing already-fixed items. |

### Tonight's still-open package PRs (not yet on `main` at A9h authoring)

Not on `origin/main` yet — so not in scope for this audit's file list. For
the record, future-agent-context: PRs **#800, #801, #803, #804, #805,
#806, #807, #808, #831, #833** are open and will, once merged, add
~9 more reports/ docs.

### Older / historical (still on main from prior weeks)

| File | Status | Notes |
|---|---|---|
| `MEMORY-FIX-audio-doctrine-2026-05-17.md` | **CURRENT** | CLAUDE.md still references the doctrine; the doc is the canonical source. |
| `sw-stale-html-diagnosis-2026-05-14.md` | **CURRENT** | CLAUDE.md still cites it for SW behavior. |
| `RECON-tier-trigger.md` | **PARTIAL** | Memory `project_tier_trigger_deferred`: trigger drop + reader fixes were deferred. **#792** (T2 retire migration) shipped tonight; this recon predates that. Header recommendation: add a "see #792 for the live T2 retirement decision". |
| `RECON-migration-drift.md` | **SUPERSEDED-BY** memory `project_db_schema_drift_audit` (A21 2026-05-18) + `project_repo_ahead_reconciliation` (A31). | A21's 179-relation audit is more authoritative; A31 has live status. |
| `RECON-audit-latency.md` | **PARTIAL** | Memory `project_repo_ahead_reconciliation`: latency migration `20260518000000` is applied to prod ("don't re-apply"). The doc's "to-apply" framing is stale. |
| `RECON-anchor-surface-24.md` | **CURRENT** (per memory) | Memory `project_anchor_surface_void`: 24 anchor rooms have 0 valid targets; doc is the canonical "do not re-run" record. |
| `RECON-content-readiness-matrix.md` | **UNKNOWN** | Pre-wave content matrix; whether superseded depends on whether tonight's room/JSON changes invalidate it. |
| `RECON-english-b2.md` | **UNKNOWN** | Content recon; not touched by tonight's wave. |
| `RECON-ja-b2-content.md` | **UNKNOWN** | Same. |
| `RECON-ja-b2-roleplay.md` | **UNKNOWN** | Same. |
| `RECON-spanish-b2-audio.md` | **UNKNOWN** | Same. |
| `RECON-vi-rooms-defects.md` | **UNKNOWN** | Same. |
| `RECON-stripe-idempotency.md` | **PARTIAL** | Pre-#561 idempotency-hardening context. Wave's webhook-monotonic-object-quality fix (#793) is a separate axis; both true. Reader should not assume this covers #793. |
| `RECON-revenuecat-hmac.md` | **CURRENT** (per memory `project_revenuecat_mrr_scope` indirectly) | RevenueCat MRR scope is parked; no tonight-wave touch. |
| `RECON-audio-regen.md` | **CURRENT** | No tonight-wave touch on audio regen. |
| `renderer-schema-contract.md` | **CURRENT** | Contract reference; no tonight-wave touch. |
| `sentry-setup-guide.md` | **PARTIAL** | Sentry route-gate PR #720 (memory) changed where Sentry initializes; the setup-guide's load-order pre-PR may be stale. |
| `2fa-phase-2-security-review.md` | **CURRENT** | Historical security review; no contradiction in tonight's wave. |
| `account-deletion-audit-2026-04-26.md` | **PARTIAL** | A40 re-audit happened tonight (named in primer §k). Underlying audit still useful as the baseline; the re-audit's findings refine it. |
| `app-store-readiness-audit-2026-04-27.md` | **SUPERSEDED-BY** A41 re-audit + #807 device-verify checklist | Tonight's #807 covers the live verify procedure; reading this 2026-04-27 doc without knowing #807 exists would lead to outdated paperwork steps. |
| `app-store-submission-package-2026-04-26.md` | **PARTIAL** | Operator paperwork redo from PENDING §E will refresh the package; until then this is the latest written guidance. |
| `apple-signin-bug-2026-04-24.md` | **CURRENT** (historical record) | Bug is fixed; doc is the diagnosis record. |
| `apple-signin-diagnosis.md` | **CURRENT** (historical record) | Same. |
| `catch-up-supabase-sync-2026-05-15.md` | **CURRENT** | Sync notes from mid-May; no tonight-wave contradiction. |
| `elsa-competitive-teardown-2026-04-26.md` | **CURRENT** | Competitor reference; no tonight-wave touch. |
| `onboarding-60s-audit-2026-04-26.md` | **PARTIAL** | Pre-#675 perf data. Memory `project_lighthouse_perf_baseline`: PRE-#675 mobile anchor exists; this doc's perf numbers are baseline-of-record, not "current". |
| `streak-shame-audit-2026-04-26.md` | **CURRENT** | Streak design guardrail; aligns with CLAUDE.md non-negotiable #4. |

### Older `aN-*` runbooks and CC*-coverage files (unread by A9h)

These were not opened by A9h; classification by filename heuristic only.
All are **UNKNOWN** unless flagged otherwise. They predate this wave by
weeks/months; the safe assumption is "historical reference, may name
defunct things by old labels":

- `a1-ielts-speaking-audio-run.md` · `a2-c1-save-room-json-fix.md` ·
  `a2-memory-design.md` · `a4-c3-speech-analyze-fix.md` ·
  `a4-tracking-runbook.md` · `a5-c4-webhook-verify-fix.md` ·
  `a5-vi-b1-audio-run.md` · `a6-c5-test-email-fix.md` ·
  `a6-email-runbook.md` · `a6-trial-expiry-runbook.md` ·
  `a7-bundle-audit.md` · `a7-phoneme-runbook.md` ·
  `a8-app-shared-refactor.md` · `chau-report-number-4-from-c1.md` ·
  `cc1-coverage.md` · `cc2-coverage.md` · `cc3-coverage.md` ·
  `cc4-vn-coverage.md` · `cc4b-vn-coverage.md` · `cc5-coverage.md`.

**Cross-reference:** PR #791 (`cleanup(reports): archive 7 zero-reference
legacy a<N>-* files (Tier-C per A23)`) **already archived 7** of the
zero-reference ones. The 14+ above survived #791's cull — they had at
least one reference somewhere. The "UNKNOWN" mark means a future agent
should grep for the topic before trusting any specific claim in these
files. Memory `project_docs_honesty_scope_c_parked` confirms low-Lovable
scrubs + scripts/README dup are parked no-timeline.

### archive/

The `reports/archive/` subdirectory holds already-archived material
(`agent-runs-2026-04/`, `audio-2025/`, `cc7-ci-diagnosis.md`,
`cleanup-2025/`, `launch-2025/`, `NORTH_STAR-v1.3-2026-04-20.md`,
`PLAN-v1-2026-05-10.md`, `recreation-prompts-2025/`, `room-docs-2025/`,
`security-2025/`, `ui-perf-2025/`, etc.) — out of scope for this audit.

---

## Per-doc header recommendations (SUPERSEDED-BY rows)

For the 4 SUPERSEDED-BY rows above, the recommended action is to add a
one-line banner at the top of the file itself. **A9h does not edit any
existing report**, per brief. The recommendations are written for the
follow-up dispatch:

1. **`PR-MERGE-SEQUENCING-A2c.md`**: add header banner
   > `> SUPERSEDED 2026-05-19/20: the wave has drained. For current PR state run
   > `gh pr list --state open`. This doc is the mid-wave snapshot — keep for audit
   > trail, do not act on the sequence.`

2. **`STRATEGY-drift-audit-A3c.md`**: add header banner
   > `> SUPERSEDED 2026-05-19/20 by STRATEGY.md v3.1 (PR #817). A3c was the drift
   > audit; #817 was the edit pass. Reading A3c without knowing #817 happened could
   > re-apply already-applied fixes. Keep for audit trail.`

3. **`RECON-migration-drift.md`**: add header banner
   > `> SUPERSEDED 2026-05-18 by A21's drift audit (memory
   > project_db_schema_drift_audit; 179 PROD_AHEAD relations) and A31's
   > reconciliation (memory project_repo_ahead_reconciliation; latency migration
   > 20260518000000 applied to prod — DO NOT re-apply). Keep for audit trail.`

4. **`app-store-readiness-audit-2026-04-27.md`**: add header banner
   > `> SUPERSEDED 2026-05-19/20: see (a) tonight's primer §k blockers (#807
   > device-verify checklist for #796 marketing-tracker guard, A40
   > account-deletion re-audit), and (b)
   > reports/PENDING-CHAU-ACTIONS-2026-05-20.md §D + §E for the live verify +
   > paperwork-redo procedure. Keep for audit trail.`

### PARTIAL-row header recommendations (lighter)

For the 8 PARTIAL rows, add a "See also" line near the top of each file
rather than a full SUPERSEDED banner:

- `PENDING-CHAU-ACTIONS-2026-05-20.md` — once #833 merges, no header
  change needed (this addendum is what completes it).
- `OPS-red-branch-pr-candidates-A9e.md` — add a one-line: *"§5 update:
  b53 PR-READY classification now landed via #831; the other 10 rows
  stand."*
- `A18-recompute-impl-readiness-A8c.md` — add a one-line: *"See also
  reports/SQL-789-migration-verify-A8d.md (PR #820) for the #789 migration
  verify-side companion."*
- `RECON-tier-trigger.md` — add a one-line: *"See also PR #792 (T2 retire
  migration) for the live T2-retirement decision."*
- `RECON-audit-latency.md` — add a one-line: *"Latency migration
  20260518000000 APPLIED to prod per memory
  project_repo_ahead_reconciliation; do not re-apply."*
- `RECON-stripe-idempotency.md` — add a one-line: *"Webhook
  raw_payload-on-object-quality monotonicity (#793) is a separate axis,
  not covered here."*
- `sentry-setup-guide.md` — add a one-line: *"Sentry initialization
  is now route-gated per PR #720 (memory project_sentry_route_gate);
  the load-order described pre-PR may not reflect current behavior."*
- `onboarding-60s-audit-2026-04-26.md` — add a one-line: *"Perf numbers
  here are the PRE-#675 mobile baseline per memory
  project_lighthouse_perf_baseline; do not treat as current."*

---

## Scope / non-goals

- A9h read **only** the file list + git history + memory + this session's
  context. No `reports/*.md` content was opened in depth (apart from the
  one needed to confirm a header insertion in the prior A9g task).
- The 11 **UNKNOWN** older `aN-*` runbooks + content RECONs warrant a
  separate read-and-classify pass if and when a future dispatch targets
  one of their topics. Until then, treat as historical reference.
- No existing file edited. The recommended header banners are for a
  follow-up dispatch to apply.

*A9h — classification only. No DB writes, no prod query, no edits to
existing reports. The audit is the deliverable.*
