# Day-1 close-review — Stage 3 launch (TEMPLATE)

Fillable template. Operationalizes §6 of [`launch-window-operations.md`](./launch-window-operations.md) — the **hour +24 close-of-day-1 review** that gates the transition from active monitoring (hour 0 — +24) to passive monitoring (hour +24 — +72).

Chau (or any future operator) opens this file at the **hour +24 mark** after the first post goes live, copies it to `reports/launch-day-1-YYYY-MM-DD.md`, and fills it in. The review is short by design — under 20 minutes — because the launch window is still open and the operator may need to act on what the review surfaces.

Pairs with [`prelaunch-checklist.md`](./prelaunch-checklist.md) (the morning-of), [`launch-window-operations.md`](./launch-window-operations.md) (the during-window), [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) (the day-1-through-day-7 data collection), and [`week-1-retrospective.md`](./week-1-retrospective.md) (the day-7+ retro). This file sits between the launch-window-operations §6 gate and the first-week-metrics-spec §4 day-1 read.

> **Hard rule.** The day-1 close-review does NOT conclude variant outcomes, does NOT predict week-1 results, and does NOT make architectural decisions. It answers three Boolean go/no-go questions, snapshots the day-1 metrics, and names one specific carry-over for day 2. Everything else defers to the week-1 retrospective.

> **What this template is NOT.** It is not a substitute for the §6 launch-window-operations.md table — that table stays as the in-flight gate during the window. This file is the **filled record** of running that gate, plus the day-1 metric snapshot and the carry-over decision. Fill it AFTER the §6 gate passes (or after the operator decides the window stays open because §6 didn't pass).

---

## §0 Header

Fill in before writing anything else:

| Field | Value |
|---|---|
| Reviewer | ______________________ |
| Launch wave | (e.g. "Stage 3 — TikTok Script 1, Facebook Post 1, Zalo Card 1") |
| Posted-at timestamp (ICT, per `prelaunch-checklist.md` §6) | ______________________ |
| Review timestamp (should be ~ posted-at + 24 h) | ______________________ |
| Launch deploy SHA | ______________________ |
| Last-good deploy SHA pre-launch (from `prelaunch-checklist.md` §0) | ______________________ |
| Window status entering this review | ☐ Active (any §6 row was failing) ☐ Closed (§6 all-pass; transitioning to passive) |
| Operator scratch-sheet link (private, NOT in repo) | ______________________ |

---

## §1 §6 close-of-day-1 gate — recorded result

Copy the table from [`launch-window-operations.md`](./launch-window-operations.md) §6 here and tick each row against the actual state at the review timestamp. **If any row fails, the window stays open** per §6's hard rule.

| Check | Expected | Actual | Pass / Fail |
|---|---|---|---|
| All operator scratch-sheet sections have entries | populated | ______________________ | ☐ |
| No kill-switch event open (no pulled-post or rollback in flight) | clear | ______________________ | ☐ |
| Sentry feed shows no new HIGH-severity group from the launch deploy | clean | ______________________ | ☐ |
| Platform-side counts noted in scratch sheet (TikTok views, FB reach, Zalo reactions) | noted | ______________________ | ☐ |
| Netlify edge-log `/weak-at` request count over the last 24 h noted (or "Netlify Analytics not enabled" per `first-week-metrics-spec.md` §2.2) | noted | ______________________ | ☐ |
| Any planned follow-up posts queued for hour +24 — +72 still appropriate given hour 0 — +24 signal | confirmed | ______________________ | ☐ |
| Operator has gotten or scheduled some sleep before hour +24 — +72 | yes | ______________________ | ☐ |

**Overall gate result:** ☐ All-pass → window closes, transition to passive monitoring per `launch-window-operations.md` §7 ☐ Any-fail → window stays open, continue active monitoring until next review (≤ 4 h later)

> **Note.** Even when the overall gate passes, the rest of this template still gets filled. The gate is necessary, not sufficient — §2 / §3 / §4 / §5 capture data the gate doesn't.

---

## §2 Three Boolean go/no-go gates

Three independent yes/no answers. Each has a binary trigger. Each has an explicit action if the answer is "no."

### §2.1 Kill-switch readiness intact?

Per [`launch-window-operations.md`](./launch-window-operations.md) §5 — both kill-switch options (pull-the-post AND rollback-the-deploy) must remain executable for the next 48 h.

| Sub-check | Yes / No |
|---|---|
| Last-good Netlify deploy ID still recorded and reachable | ☐ Yes ☐ No |
| Netlify dashboard auth still working (operator can re-publish a prior deploy without re-login dance) | ☐ Yes ☐ No |
| Operator has platform-side delete-post access for every platform a launch post is live on | ☐ Yes ☐ No |
| No DNS / Cloudflare / Sentry account change in the last 24 h that would break the §5 escalation paths | ☐ Yes ☐ No |

**Overall:** ☐ Yes (kill switch ready) ☐ No (kill switch broken — STOP, fix before proceeding to §3+)

**If No** — name what's broken and the immediate fix:

> ______________________________________________________________________

### §2.2 Error-budget intact?

Per [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §3.4 site-side error thresholds — Sentry has not surfaced a Signal-row regression attributable to the launch deploy.

| Sub-check | Yes / No |
|---|---|
| Zero new Sentry error groups with ≥ 10 events affecting ≥ 5 users in the first 24 h | ☐ Yes ☐ No |
| Zero new error groups whose first-event timestamp matches the launch deploy SHA | ☐ Yes ☐ No |
| Stage 3B slow-path breadcrumbs (`stage3b.perf.engine` > 50 ms or `stage3b.perf.ui_mount` > 100 ms) < 5 per 100 page-loads | ☐ Yes ☐ No / ☐ N/A (Sentry breadcrumb volume too low to read) |
| Sentry RLS alert rules `17072095` / `17072096` (per [[project_sentry_infra_access]]) — no firings tied to the launch deploy | ☐ Yes ☐ No |

**Overall:** ☐ Yes (error budget intact) ☐ No (regression attributable to launch — investigate; rollback path open per `launch-window-operations.md` §5.2)

**If No** — link the Sentry issue group(s) and the rollback decision:

> ______________________________________________________________________

### §2.3 No P0 incidents in the last 24 h?

P0 = anything that would have triggered an abort criterion in [`prelaunch-checklist.md`](./prelaunch-checklist.md) §A had it been live at hour 0. Examples: site returns 5xx, sign-in fails on known-good account, Supabase call fires from `/weak-at`, `mb.marketing.*` localStorage key appeared.

| Sub-check | Yes / No |
|---|---|
| `https://mercyblade.com` returns 200 right now | ☐ Yes ☐ No |
| `https://mercyblade.com/weak-at` returns 200 right now | ☐ Yes ☐ No |
| Sign-in on the operator's known-good account still works | ☐ Yes ☐ No |
| Re-running [`prelaunch-checklist.md`](./prelaunch-checklist.md) Phase 3 (privacy verification) on a fresh device — Network panel still shows zero Supabase calls during `/weak-at` | ☐ Yes ☐ No |
| No production incident filed under `reports/incident-YYYY-MM-DD.md` in the last 24 h | ☐ Yes ☐ No |

**Overall:** ☐ Yes (no P0) ☐ No (P0 in flight — see `disaster-recovery.md` §2.x for the matching provider runbook)

**If No** — name the incident + the recovery path open:

> ______________________________________________________________________

---

## §3 Launch-day metric snapshot (against first-week-metrics-spec.md thresholds)

Day-1 reads per [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §4 day-1 cadence, scored against §3 signal/noise thresholds. **This is a snapshot, not a conclusion** — variant decisions stay deferred until §6 of this file.

### §3.1 Platform-side day-1 counts (per post in the launch wave)

| Post | Platform | Views / Reach | Engagements | Shares | Substantive comments | §3 threshold trip — Signal / Noise / Neither |
|---|---|---|---|---|---|---|
| ______ | ______ | ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ | ______ | ______ |
| ______ | ______ | ______ | ______ | ______ | ______ | ______ |

**Reminder:** TikTok needs ≥ 500 views by day 7 for Signal — at day 1, expect partial. Facebook needs ≥ 200 reach by day 7 for Signal — at day 1, expect partial. Zalo's reaction count is the only same-day signal.

### §3.2 Site-side day-1 reads

| Metric | Reading | §3 threshold trip — Signal of a problem / Noise |
|---|---|---|
| New Sentry error groups in 24 h, attributable to launch deploy | ______ | ______ |
| Total Sentry events in 24 h attributable to launch deploy | ______ | ______ |
| Netlify deploy state — any failed / rolled-back deploy since launch SHA | ______ | ______ |
| `/weak-at` request count, last 24 h (or "Analytics not enabled") | ______ | ______ |
| `/` request count, last 24 h (or "Analytics not enabled") | ______ | ______ |

### §3.3 Stage 3B viewCount smoke check (operator's own device)

Per [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §3.5 — operator-side smoke check, does not aggregate.

| Sub-check | Yes / No |
|---|---|
| Operator's own device shows `mb.stage3b.viewCount` increments on a reload of `/weak-at` with at least one populated section | ☐ Yes ☐ No |
| Reloading `/weak-at` with an empty state does NOT increment | ☐ Yes ☐ No |

---

## §4 What surprised us — day-1 only

**Brief free-text — bullets only, one line each.** Long-form day-1 surprises go in the week-1 retro §2/§3, not here. The day-1 review captures the *unexpected*, not the *examined*.

### §4.1 Good surprises (day 1)

> - ______________________________________________________________________
> - ______________________________________________________________________

### §4.2 Bad surprises (day 1)

> - ______________________________________________________________________
> - ______________________________________________________________________

---

## §5 Kill-switch events in the first 24 h (if any)

Recorded for the week-1 retro's §3 / §5.3 — and as evidence the kill switch worked at all.

| Event | When (ICT) | What | Reason | Linked Sentry / scratch-sheet entry |
|---|---|---|---|---|
| Post pulled | ______ | (which post) | ______________________ | ______________________ |
| Deploy rolled back | ______ | (from SHA → to SHA) | ______________________ | ______________________ |
| Both (per §5.3 of launch-window-operations.md) | ______ | ______________________ | ______________________ | ______________________ |

If no kill-switch events occurred, tick: ☐ **None.**

---

## §6 One named change to carry into day 2

The day-1 equivalent of the week-1 retro's §6 one-change rule, scoped to the next 24 h. **Exactly one change** — multi-change carryovers become wish lists that don't ship.

**The change:**

> ______________________________________________________________________

**Why this one over the others:**

> ______________________________________________________________________

**Surface affected** (a follow-up post, a small caption tweak on an existing post, a scratch-sheet column added, a Sentry filter added — be specific):

> ______________________________________________________________________

**Owner + deadline:** Chau by default; deadline = posted-at + 48 h.

> ______________________________________________________________________

**Specifically NOT changing in day 2** (consider and reject explicitly):

- ______________________
- ______________________

**Common patterns** (delete if not relevant — pick at most one for the actual carryover):

- Adjust the day-2 / day-3 follow-up post in the launch wave's queue
- Add an FAQ-paste reply to a question repeated by ≥ 3 commenters in 24 h
- Tighten a Sentry filter that produced noise in the day-1 read
- Reseed a Zalo conversation that didn't get reactions in 24 h
- Pull a comment-thread reply that read defensively (per `launch-window-operations.md` §A)

---

## §7 Decisions explicitly deferred to week-1 (not day-1)

Day-1 cannot make these calls. Name them here so they don't drift into day-1 by default.

| Decision | Why day-1 can't make it | When week-1 retro reads it |
|---|---|---|
| TikTok variant A vs. B outcome | Day-1 N is far below the ≥ 500 floor per [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) TikTok thresholds; the 7-day window is the earliest legal read | Day 7+ (per `first-week-metrics-spec.md` §6) |
| Facebook variant A vs. B outcome | Day-1 N is far below the ≥ 300 floor; FB window is 14 days | Day 14 retro (out of scope of week-1 retro) |
| Zalo card forward-on rate | Forward-chain dynamics need ≥ 1 week; 24 h is forwarder-immediate-reaction only | Day 14 retro |
| "Should we ship a follow-up post on the same hypothesis" | Requires reading whether the day-1 audience matched the kit's targeted audience — a week-1 question | Week-1 retro §6 |
| "Should we install Plausible / switch metrics tooling" | Week-1 read needs to be insufficient before this is even askable | Week-1 retro §7 |
| Any change to `landing-page-variants.md` Variant pick | Requires the variant-test reads from the platform A/B kit, which need their full windows | Conditional retro, ≥ week 7 |
| Any kit-wide doc amendments (this file, the retro template, the metrics spec) | Per `launch-readme.md` §8 — amendments wait one week of post-retro reflection; hot-fix amendments bias toward over-correction | Week-1 retro §8 |

**Common additions** (delete if not relevant):

- ______________________
- ______________________

---

## §8 Process notes (operator-facing, micro-amendments only)

**Day-1 amendments are forbidden.** If the day-1 review surfaces a process gap, log it here as a candidate for the week-1 retro §8 to consider. Do NOT amend any of the launch docs in flight during a launch window.

| Suggested amendment surface | Note (for the week-1 retro to consider) |
|---|---|
| `prelaunch-checklist.md` | ______________________ |
| `launch-window-operations.md` | ______________________ |
| `first-week-metrics-spec.md` | ______________________ |
| `day-1-close-review.md` (this file) | ______________________ |
| `week-1-retrospective.md` | ______________________ |

If nothing surfaced, tick: ☐ **No process gaps observed in the first 24 h.**

---

## §9 Anti-checklist — what this day-1 review deliberately does NOT do

Consistent with the [`week-1-retrospective.md`](./week-1-retrospective.md) §10 anti-checklist; day-1-scoped.

| Not done | Why |
|---|---|
| Conclude any variant outcome | Day-1 N is below the [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) thresholds for every platform |
| Predict week-1 outcomes | Outcome promises are forbidden per the file-header hard rule; the snapshot is for triage, not forecasting |
| Recommend any change beyond §6's one named carryover | Multi-change carryovers become wish lists; one-change discipline applies at every horizon |
| Amend any launch doc in flight | Per `launch-readme.md` §8 — amendments wait one week of post-retro reflection; hot-fixing docs mid-launch is over-correction |
| Per-user attribution / retention analysis | No per-user chain exists; [[project_marketing_consent_is_tracking]] privacy posture intact |
| Rate the launch as success / failure | Single-summary ratings compress out the signal at every horizon, day-1 included |
| Loop in a committee | Decision-rights per `decision-criteria.md` = Chau alone; no committee at day-1 either |
| Cite paid-amplification thresholds | Organic-only per `measurement-plan.md` |
| Conclude that "the launch is over" | The launch window runs to hour +72 per `launch-window-operations.md` §0; day-1 closes ACTIVE monitoring only, not the launch itself |
| Trigger a kill-switch event from the review itself | The review records kill-switch events that already happened (§5); it does not initiate them. Kill-switch decisions belong in the live launch-window-operations §5 path, not in a post-hoc review |

---

## §10 Sign-off

Once §1 (the §6 gate) is recorded AND §2 (the three Boolean gates) are all "Yes" AND §3 / §4 / §5 / §6 / §7 are filled:

| Field | Value |
|---|---|
| §1 §6 gate result recorded (pass or fail) | ☐ |
| §2 three Boolean gates all "Yes" — OR — explicit "No" with documented investigation + action path | ☐ |
| §3 snapshot filled for every post in the launch wave | ☐ |
| §6 one named change for day 2 is a specific deliverable, not a vague intention | ☐ |
| §7 deferred decisions named explicitly so they don't drift | ☐ |
| Review saved to `reports/launch-day-1-YYYY-MM-DD.md` (NOT this template file) | ☐ |
| Calendar slot scheduled for the week-1 retro at posted-at + 7 days | ☐ |

**Reviewer signature (just type your name):** ______________________

---

## §A References

- [`launch-window-operations.md`](./launch-window-operations.md) §6 — the close-of-day-1 review table this template operationalizes.
- [`launch-window-operations.md`](./launch-window-operations.md) §5 — kill-switch options whose readiness §2.1 checks.
- [`launch-window-operations.md`](./launch-window-operations.md) §7 — passive monitoring the §1 all-pass outcome transitions into.
- [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §3 — signal/noise thresholds the §3 snapshot scores against.
- [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §4 — the day-1 / day-3 / day-4 / day-7 collection cadence.
- [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §6 — variant-decision earliest-legal-read calendar.
- [`prelaunch-checklist.md`](./prelaunch-checklist.md) §A — the abort matrix whose criteria define P0 in §2.3.
- [`prelaunch-checklist.md`](./prelaunch-checklist.md) §5.2 — rollback commands referenced by §2.1.
- [`week-1-retrospective.md`](./week-1-retrospective.md) §6 + §10 — the one-change discipline and anti-checklist this template mirrors at day-1 scope.
- [`launch-readme.md`](./launch-readme.md) §8 — the "amendments wait one week of post-retro reflection" rule §8 enforces at day-1.
- [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — variant-test thresholds + windows that §7 cites for explicit deferrals.
- [`../runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) §2.x — per-provider escalation paths §2.3 routes "No" answers to.
- `[[project_sentry_infra_access]]` — Sentry org + RLS alert IDs referenced in §2.2.

---

**End of day-1 close-review template.** Each filled review becomes a `reports/launch-day-1-YYYY-MM-DD.md`. The template itself is never filled in-place — copy first, then fill.
