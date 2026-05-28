# First-week metrics spec — Stage 3 launch

What gets measured in the **first 7 days** after a launch wave goes live. The companion to [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) (which scopes *what* we can measure under MercyBlade's privacy stance) and [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) (which scopes *when* a variant test concludes).

This spec scopes the *day-1 through day-7* read — the interval after [`launch-window-operations.md`](./launch-window-operations.md) hands off and before the [`week-1-retrospective.md`](./week-1-retrospective.md) gets filled. It names: which numbers get collected, how often, on what surface, and what threshold separates *"signal"* from *"noise"* at MercyBlade's ~100-user organic-only scale.

> **Hard rule.** Every measurement below is compatible with the privacy stance in [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) — no third-party pixels, no per-user attribution chain, no PII in any spreadsheet, no `mb.marketing.*` localStorage namespace. If a future measurement proposal violates that posture, it is rejected here for the same reasons it is rejected there. This spec **does not** re-litigate the privacy boundary; it lives downstream of that boundary.

---

## §1 What the first-week read is for

Three uses, in order of priority:

1. **Detect regressions early.** If a launch deploy slipped a bug past [`prelaunch-checklist.md`](./prelaunch-checklist.md), the first-week error rate is where it shows up. The metrics here are an early-warning system.
2. **Calibrate the platform-side numbers** at MercyBlade's actual scale — TikTok's reach floor at this account-age and audience size, Facebook's organic surfacing for a brand-new page, Zalo's seed-forward behavior. Future variant tests' thresholds are read against this calibrated baseline.
3. **Surface qualitative patterns.** Comment themes, FAQ-question repeats, mis-readings of the framing copy. These don't have numeric thresholds; they live in the retro free-text section.

What the read is **NOT for**:

- **Variant decisions.** Per [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md), TikTok's window is 7 days *minimum* and Facebook's is 14; reading variant performance at day 7 is the *earliest* legal read for TikTok and is *too early* for Facebook. The week-1 retro can note observed trends; it cannot conclude them.
- **Funnel metrics.** No per-user attribution chain exists; per-click-to-signup-to-retention numbers are categorically rejected per [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) "Behavior cohort analysis — REJECTED".
- **Active-user counts.** DAU / WAU / MAU require session continuity the app does not record and that this spec does not propose to add.

---

## §2 The measurements

Three families: platform-side, site-side, manual.

### §2.1 Platform-side counts

Source: the platform's own analytics dashboard, read by the operator (Chau) as the poster of the content.

| Platform | What to collect | Source | Frequency |
|---|---|---|---|
| TikTok | Per-video: views, likes, shares, comments, saves, average view duration, profile-link clicks | TikTok Studio → Analytics → per-video | Day 1, day 3, day 7 |
| Facebook | Per-post: reach, engagements, link-clicks, comments, shares (public + private), save count | Page → Meta Business Suite → Posts | Day 1, day 4, day 7 |
| Zalo | Per-seed conversation: reactions, follow-up replies (manual count) | Manual — the source thread | Day 1, day 4, day 7 |

**Privacy posture:** these are aggregate counts on the platform side; the platform tracks its own engagement; the operator reads them as the poster. No counts cross into MercyBlade infrastructure. See [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) §1.

**Where the numbers land:** the operator's private spreadsheet (NOT in MercyBlade infrastructure; NOT shared publicly per [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) "The private spreadsheet caveat"). One row per post per read date.

### §2.2 Site-side counts (Netlify + Sentry)

Source: infrastructure-side aggregate logs that already exist for ops purposes. Read with a marketing question in mind, but unchanged in their privacy properties.

| Surface | What to collect | Source | Frequency |
|---|---|---|---|
| Netlify deploy analytics (if enabled) | Daily request count for `/weak-at`; daily count for `/`; country distribution; UTM-parameter distribution from request URLs | Netlify dashboard → Analytics → Top pages + URL filters | Day 1, day 4, day 7 |
| Netlify deploy state | Any failed deploy in the past 7 days; rollback events; SHA of the currently-published deploy | Netlify dashboard → Deploys | Day 1, day 7 |
| Sentry issue feed | New error groups created since the launch deploy; total event count attributable to the launch deploy; high-severity groups (5+ events / 5+ users) | Sentry → project `mercyblade-web` ([[project_sentry_infra_access]]) → Issues, filter by date range | Day 1, day 3, day 7 |
| Sentry breadcrumb volume | Stage 3 breadcrumb categories (`stage3b.perf.engine`, `stage3b.perf.ui_mount`) — total count + slow-path occurrences if any (engine > 50 ms or UI mount > 100 ms) | Sentry → search for category | Day 7 |
| Cloudflare Storage analytics (for `room-audio` bucket cache hit rate, optional) | Cache hit ratio for audio served via the Cloudflare-fronted bucket — relevant only if the launch posts drove audio playback | Cloudflare dashboard | Day 7 |

**Privacy posture:** Netlify edge logs carry timestamp + URL + country + status code per [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) §4 (the doc was written when Vercel was the host; the same edge-log shape applies on Netlify per the post-migration realignment). No session continuity, no fingerprinting. Sentry events are bounded per the Stage 3B invariant (only `durationMs` + count payloads; no source tags, no user IDs).

> **Note on the Netlify ↔ Vercel migration.** The measurement-plan.md document references "Vercel edge logs" because it was written pre-migration. Per [`../runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) §1, the current host is Netlify; the equivalent log surface is Netlify Analytics (paid add-on; check whether it's enabled at read time). If Netlify Analytics is not enabled, the site-side aggregate-request-count row is **not available** and the manual observation row (§2.3) carries more weight.

### §2.3 Manual qualitative observation

Source: the operator's eyes on the platforms during the launch window and the days after.

| Surface | What to log | Frequency |
|---|---|---|
| Top 5 most-engaged comments per platform | Verbatim text (operator translates to EN if originally VI, retains both), sentiment (positive / neutral / negative / confused), whether responded to | Day 7 roll-up |
| FAQ-question repeats | Any single question asked by 3+ commenters across the launch wave. These are signals that the FAQ at [`stage-3-content-kit/faq.md`](./stage-3-content-kit/faq.md) is incomplete | Day 7 roll-up |
| Mis-readings of the framing copy | Cases where a commenter interpreted the caption in a way the operator did not intend. These are signals the framing copy itself needs revision (a Variant B+ in a future wave) | Day 7 roll-up |
| Zalo forward-on observations | The operator messages 5 recipients per seeded card: *"Did you forward this on to anyone? Why / why not?"* — count, log answers as initials + paraphrase | Day 7 roll-up |

**Privacy posture:** initials, not handles. Paraphrase, not quotes (unless the commenter posted publicly on a platform where the comment is publicly visible — then quoting that public comment is acceptable; private messages are paraphrased only). No screenshots. The spreadsheet is for Chau only.

---

## §3 Signal vs. noise thresholds

Numeric thresholds for "did this post produce signal" vs. "did it produce noise." These are calibrated to MercyBlade's actual organic-only scale; they will NOT match thresholds from a paid-amplification or a larger-scale playbook.

**Per [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) "Sample-size honesty"** — the thresholds below are deliberately loose. They are "obviously different to the naked eye," not "statistically significant in a formal sense." We do not compute p-values; the audience is too small for formal tests to mean anything.

### §3.1 TikTok per-video

| Reading | Signal | Noise |
|---|---|---|
| Views by day 7 | ≥ 500 | < 200 (per decision-criteria.md "Both lose" threshold) |
| Comments | ≥ 10 substantive (not "first!" / emoji-only) | < 3 |
| Saves | ≥ 5 | < 2 |
| Profile-link clicks | ≥ 20 | < 5 |
| Average view duration | ≥ 60% of total video length | < 30% |

A post that hits "Signal" on at least 3 of 5 rows above carries readable data. A post that hits "Noise" on 3+ rows is a candidate for the [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) "Both lose" decision once the 7-day window closes.

### §3.2 Facebook per-post

| Reading | Signal | Noise |
|---|---|---|
| Reach by day 7 | ≥ 200 (recall the 14-day window per decision-criteria.md; day-7 is mid-window) | < 80 |
| Engagements | ≥ 15 substantive | < 5 |
| Link-clicks | ≥ 10 | < 3 |
| Shares (public + private) | ≥ 3 | 0 |
| Comments | ≥ 3 substantive | < 2 |

A post that hits "Signal" on at least 3 of 5 rows is on track for a readable 14-day window. A post that hits "Noise" on 3+ rows at day 7 is unlikely to recover by day 14; flag for the retro.

### §3.3 Zalo per-card

| Reading | Signal | Noise |
|---|---|---|
| Reactions on seed thread by day 7 | ≥ 3 per seeded conversation | 0–1 |
| Recipients reporting they forwarded (out of the 5 surveyed per card) | ≥ 2 | 0 |
| Follow-up replies from recipients (questions, comments) | ≥ 1 | 0 |

Zalo's threshold band is narrower because the per-card N is by-design tiny (5 seeded conversations); any signal at all is meaningful and any zero is a meaningful negative.

### §3.4 Site-side error thresholds

| Reading | Signal of a problem | Noise (no action) |
|---|---|---|
| New Sentry error groups attributable to the launch deploy by day 1 | ≥ 1 group with ≥ 10 events affecting ≥ 5 users | < 3 events total across all new groups |
| New Sentry error groups by day 7 | ≥ 1 group whose event count is growing day-over-day | groups whose count is flat or decreasing |
| Stage 3B slow-path breadcrumbs (engine > 50 ms) per 100 page-loads | ≥ 5 | < 1 |
| `/weak-at` daily request count (if Netlify Analytics enabled) | Sustained ≥ 50/day after launch — readable signal | < 10/day — below the post-launch echo, noise |

Any Signal-row trip = open the retro early to root-cause; do not wait for day 7. Sentry RLS alert rules `17072095` / `17072096` cover the RLS-violation case independently.

### §3.5 Stage 3B viewCount

`mb.stage3b.viewCount` is per-device, never sent off-device. It is **not** a site-side metric and cannot be aggregated. But for the operator running the prelaunch-checklist on their own device during the launch week, it carries one operator-side signal:

| Reading | Meaning |
|---|---|
| `mb.stage3b.viewCount` increments on the operator's device each time they reload `/weak-at` with at least one populated section | The viewCount write-path is alive; the surface is rendering populated state on the operator's own device |
| `mb.stage3b.viewCount` does not increment on a reload that produced an empty state | Expected — viewCount only writes when at least one row renders, per `src/stage-3b/viewCount.ts` |

This is a single-device smoke check the operator runs at day-1 / day-3 / day-7. It does not aggregate.

---

## §4 Collection cadence (week-1 calendar)

| Day | Reads | Output |
|---|---|---|
| Day 0 (launch day) | Already covered by [`prelaunch-checklist.md`](./prelaunch-checklist.md) + [`launch-window-operations.md`](./launch-window-operations.md) §6 day-1 close review | Operator scratch sheet |
| Day 1 | Platform-side day-1 counts (§2.1); Netlify deploy state (§2.2); Sentry day-1 read (§2.2) | Row per post in spreadsheet |
| Day 3 | Platform-side day-3 (TikTok only); Sentry day-3 (delta from day 1) | Row per post |
| Day 4 | Platform-side day-4 (Facebook + Zalo); Netlify edge-log read | Row per post |
| Day 7 | Full platform-side day-7; full site-side day-7; manual qualitative roll-up (§2.3) | Roll-up summary → input to retro |
| Day 8+ | No more reads in week-1 scope. Hand off to retro (file `week-1-retrospective.md`). | Retro doc filled |

If a Signal threshold from §3 trips at day 1 or day 3, the cadence is **not** "wait for day 7." Open the retro early; investigate; act.

---

## §5 What this spec deliberately refuses to introduce

For each rejection, the same reasoning that lives in [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) applies. Re-stated here in week-1 terms so the rejection list is self-contained when this spec is read alone.

| Proposal | REJECTED because |
|---|---|
| Install Plausible / GA4 / Pixel / Clarity for the week-1 read | Same vector as the original launch — third-party tracking. The launch's privacy claim ("nothing leaves your phone for the diagnostic") becomes structurally false the moment analytics ships, regardless of consent gating. |
| Drop a first-party cookie to attribute clicks-to-signups for the week-1 window | Same as measurement-plan.md "Server-side cookie-based attribution — REJECTED". Creates a per-user attribution chain incompatible with the no-PII-for-marketing rule. |
| Add a `mb.launch.*` localStorage namespace to track per-device launch-engagement on the operator's own machine | Same as measurement-plan.md "A `mb.marketing.*` localStorage namespace — REJECTED". Even on the operator's own device, introducing a marketing-namespace key in production sets a precedent that drifts. The operator scratch sheet is the right surface for the operator's own observations. |
| Send a Sentry `captureMessage` event per launch post viewed | Same as measurement-plan.md "Sentry custom events for marketing — REJECTED". Cost balloon + Stage 3B breadcrumb-invariant violation. |
| Configure email open / click tracking for any launch-adjacent email | No marketing email is sent during the launch window (per [`launch-window-operations.md`](./launch-window-operations.md) §B + `CLAUDE.md` "Email system — Unsubscribe system is still being built"). Email-based measurement is deferred until the unsubscribe system ships. |
| Per-user retention curves for first-week users | Requires per-user identity continuity through the funnel; the app does not store the source attribution at signup; even if it did, the measurement-plan.md cohort-analysis rejection applies. |

If the question is *"how do we know if the launch worked?"* — the honest answer is: **week-1 platform-side counts plus the qualitative comment / forward-on signals, plus a day-7 / day-14 / day-30 retro cadence**. The signal at this scale is shaped like *"did the right kind of comments show up; did the right kind of audience pick it up; did the privacy claim survive contact with users; did anything regress on the site"* — not shaped like a SaaS conversion funnel.

---

## §6 Cross-reference to decision-criteria

The week-1 metrics above feed directly into the variant-test decision framework in [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md), but with explicit timing constraints:

| Decision | Earliest legal read date | Source data |
|---|---|---|
| TikTok variant A vs. B — "B wins" / "A wins" / "Tie" | Day 7 (per decision-criteria.md TikTok window) | §2.1 day-7 read |
| TikTok variant — "Both lose" | Day 7 (when reach < 200 per variant per decision-criteria.md "Both lose" threshold) | §2.1 day-7 read + §3.1 noise rows |
| Facebook variant A vs. B — any outcome | Day 14 (per decision-criteria.md FB window) — **outside week-1 scope** | Read again at day 14, see decision-criteria.md |
| Zalo card variant — any outcome | Day 14 (per decision-criteria.md Zalo window) — **outside week-1 scope** | Read again at day 14 |
| Pull a post mid-window (active brand damage) | Anytime — covered by [`launch-window-operations.md`](./launch-window-operations.md) §5 | Operator judgment, not numeric |

**Implication:** the week-1 retro can conclude TikTok variant outcomes but **cannot conclude Facebook / Zalo variant outcomes**. The Facebook / Zalo variant decision happens at a *day-14 retro* that this spec does not define. If a week-4 retro doc ships later, that's where the longer-window decisions land.

---

## §7 What the operator records (template row)

For the spreadsheet — one row per post per read-date. Per [`measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) "What to write down per variant test":

| Column | Example |
|---|---|
| Content piece | TikTok Script 1 |
| Variant | A or B |
| Platform | TikTok-VN |
| Posted-at (ICT timestamp) | 2026-05-28 19:30 ICT |
| Read date | 2026-06-04 (day 7) |
| Reach (views / impressions) | 612 |
| Engagements (likes + comments + saves) | 47 |
| Shares | 6 |
| Comments (substantive, not emoji-only) | 8 |
| UTM-tagged click-throughs (Netlify edge logs) | 19 |
| Sentry events attributable | 0 |
| Notes (operator qualitative) | "Hit 'Signal' on 4/5 §3.1 rows. Two comments asked 'is the data private' — FAQ Q2 candidate to surface in a follow-up post." |

That is the entire record. No PII, no session IDs, no per-click rows.

---

## §8 References

- [`prelaunch-checklist.md`](./prelaunch-checklist.md) — !79; the morning-of, before-the-post checklist.
- [`launch-window-operations.md`](./launch-window-operations.md) — the during-window operating procedure; hands off to this spec at hour +72.
- [`week-1-retrospective.md`](./week-1-retrospective.md) — the fillable retro template this spec's day-7 roll-up feeds into.
- [`launch-readme.md`](./launch-readme.md) — the index doc tying the launch docs together.
- [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) — the privacy-respecting measurement framework; this spec lives downstream of that boundary.
- [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — variant-test thresholds + windows; the week-1 metrics here feed §6 above.
- [`stage-3-content-kit/faq.md`](./stage-3-content-kit/faq.md) — the bilingual FAQ whose repeats §2.3 surfaces.
- [`../runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) §1 — current host is Netlify (post-migration); the doc this spec's site-side rows reference.
- `[[project_sentry_infra_access]]` — Sentry org / project / RLS alert IDs.
- `[[project_marketing_consent_is_tracking]]` — tracking consent is per-device localStorage, NOT email opt-out; the source of the §5 rejection re-statements.

---

**End of first-week metrics spec.** This file is updated when a launch surfaces a measurement category the spec didn't cover — or when an emerging measurement tool (Plausible-style, privacy-respecting) becomes worth installing under the marketing-consent gate.
