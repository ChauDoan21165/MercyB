# Week-1 retrospective — Stage 3 launch (TEMPLATE)

Fillable template. Chau (or any future operator) opens this file on **day 7+** after the launch wave, copies it to `reports/launch-week-1-YYYY-MM-DD.md`, and fills it in.

The template is deliberately **mixed-format**: tickable boxes for things that are present-or-absent, free-text for things that need a sentence or three. There is no rigid 1-2-3-4-5 score. The retro's value is in the *naming* of what happened, not in compressing it into a number.

Pairs with [`prelaunch-checklist.md`](./prelaunch-checklist.md) (the morning-of), [`launch-window-operations.md`](./launch-window-operations.md) (the during-window), and [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) (the day-1 through day-7 data collection).

> **Hard rule.** No outcome promises in this file or in any retro filled from it ("we will succeed if…", "next launch will hit X"). The retro records what happened, names one specific change for week 2, and stops. Forecasts that survive contact with launches at MercyBlade's scale are rare and brittle.

---

## §0 Header

Fill in before writing anything else:

| Field | Value |
|---|---|
| Retro author | ______________________ |
| Date filled (calendar) | ______________________ |
| Days since launch (should be ≥ 7) | ______________________ |
| Launch wave | (e.g. "Stage 3 — first 3 posts: TikTok Script 1, Facebook Post 1, Zalo Card 1") |
| Posts in scope (one row per post) | ______________________ |
| Launch deploy SHA | ______________________ |
| Last-good deploy SHA pre-launch (from `prelaunch-checklist.md` §0) | ______________________ |
| Source spreadsheet (operator-only link, NOT pasted in repo) | ______________________ |

---

## §1 What we shipped vs. what we measured

The honest read: did the launch ship what the prelaunch / launch-window docs anticipated, and did the measurement spec capture what the launch actually surfaced?

### 1.1 What we shipped

| Surface | Planned | Actual | Notes |
|---|---|---|---|
| Web deploy (Netlify) | per `prelaunch-checklist.md` Phase 1.3 | ☐ Matched ☐ Drifted | ______________________ |
| Posts published (per platform) | per `stage-3-content-kit/` | ☐ All ☐ Some — list below | ______________________ |
| UTM scheme applied | per `measurement-plan.md` | ☐ All links ☐ Some — list missing | ______________________ |
| Captions match spec verbatim | per `prelaunch-checklist.md` Phase 4.2 | ☐ Yes ☐ Edited on the fly — note why | ______________________ |
| Operator scratch sheet started | per `launch-window-operations.md` §1 | ☐ Yes ☐ No | ______________________ |

### 1.2 What we measured (and what we couldn't)

| Measurement | Plan | Actual | Gap reason |
|---|---|---|---|
| Platform-side counts (TikTok / Facebook / Zalo) | per `first-week-metrics-spec.md` §2.1 | ☐ Full ☐ Partial | ______________________ |
| Netlify site-side counts (Analytics enabled?) | per `first-week-metrics-spec.md` §2.2 | ☐ Available ☐ Not enabled | ______________________ |
| Sentry first-week issue read | per `first-week-metrics-spec.md` §2.2 | ☐ Done ☐ Skipped | ______________________ |
| Manual qualitative observation (comments, forwards) | per `first-week-metrics-spec.md` §2.3 | ☐ Done ☐ Skipped | ______________________ |
| Stage 3B viewCount smoke check on operator's own device at day 1/3/7 | per `first-week-metrics-spec.md` §3.5 | ☐ Done ☐ Skipped | ______________________ |

**Free-text — the read-vs-collected gap:**

> ______________________________________________________________________
> ______________________________________________________________________

---

## §2 What surprised us — good

What the launch produced that the prelaunch docs did not anticipate, on the positive side. Examples of categories (delete any that don't apply, add as needed):

- An unexpected audience segment engaged (a sub-cohort none of the variant tests targeted)
- A specific framing line was quoted back / paraphrased / referenced by commenters in a way that signaled it landed
- A platform behaved better than the calibrated baseline (TikTok pushed harder than the §3.1 noise floor predicted)
- An organic repost / press pickup happened
- The privacy claim drew a positive reaction (someone verified it themselves and posted their DevTools screenshot)
- The bilingual framing crossed audiences the way the kit hoped it would (diaspora replies in English under a VI-primary post)

**Fill freely. One bullet per surprise. Verify each — only record what you can point at evidence for.**

> ______________________________________________________________________
> ______________________________________________________________________
> ______________________________________________________________________
> ______________________________________________________________________

---

## §3 What surprised us — bad

What the launch produced that the prelaunch docs did not anticipate, on the negative side. Categories (delete what doesn't apply):

- A platform underperformed worse than the §3 noise floors predicted
- A specific caption / framing line was misread by a substantial fraction of commenters (a Variant C+ candidate — caption itself needs revision)
- A Sentry regression slipped past the prelaunch checks
- A privacy edge case was raised in a comment that the launch claims didn't anticipate
- An audience segment expected the product to do something it doesn't (gap between framing and reality)
- A kill-switch was triggered (post pulled, deploy rolled back) — note the time + the chain of decisions
- An anti-pattern from `launch-window-operations.md` §A was tripped (this is a process problem, not a content problem — record honestly)

**Fill freely. One bullet per surprise. Be specific about what was wrong, not vague.**

> ______________________________________________________________________
> ______________________________________________________________________
> ______________________________________________________________________
> ______________________________________________________________________

---

## §4 Feedback patterns — top 3 themes

From the operator scratch sheet + the manual qualitative section of [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §2.3, identify the **three most-repeated themes** in comments / DMs / replies.

| # | Theme | # of times seen | Platform(s) | Notable comment text (paraphrased; initials only) | Action implication |
|---|---|---|---|---|---|
| 1 | ______________________ | ______ | ______ | ______________________ | ______________________ |
| 2 | ______________________ | ______ | ______ | ______________________ | ______________________ |
| 3 | ______________________ | ______ | ______ | ______________________ | ______________________ |

**Cross-reference:** themes that match a question in [`stage-3-content-kit/faq.md`](./stage-3-content-kit/faq.md) signal the FAQ should be surfaced more prominently. Themes that do NOT match the FAQ are candidates to ADD to the FAQ in a follow-up commit.

**Privacy:** paraphrase, never quote private DMs verbatim. Public comments on a public platform are quotable but tag with initials of the commenter, not handles.

---

## §5 Variant performance (if any data exists)

**Only fill if at least one variant test in the launch wave has a TikTok-grade 7-day window's worth of data.** Per [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md), Facebook and Zalo variants need 14 days; the week-1 retro **cannot conclude** them. Leave those rows blank and revisit at a day-14 retro.

### 5.1 TikTok variants — earliest legal read

| Pair | Variant A reach | Variant A primary metric | Variant B reach | Variant B primary metric | Effect-size | Outcome |
|---|---|---|---|---|---|---|
| TikTok Script 1 A vs. B | ______ | ______ | ______ | ______ | ______ | ☐ B wins ☐ A wins ☐ Tie ☐ Both lose ☐ Mid-window pull |
| TikTok Script 2 A vs. B | ______ | ______ | ______ | ______ | ______ | ☐ same options |
| (add rows as needed) | | | | | | |

Apply the [`decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) thresholds: **B beats A by ≥30% on primary metric at N ≥ 500 per variant**; tie defaults to A; both-lose if reach < 200 per variant.

### 5.2 Facebook / Zalo — defer

| Pair | Status |
|---|---|
| Facebook Post 1 A vs. B | ☐ Day-7 noted; **decision deferred to day-14 retro** per decision-criteria.md FB window |
| Zalo Card 1 A vs. B | ☐ Day-7 noted; **decision deferred to day-14 retro** per decision-criteria.md Zalo window |

### 5.3 Variant pull events

| Variant | Pulled mid-window? | Day | Reason | Logged in `ab-variants.md`? |
|---|---|---|---|---|
| ______ | ☐ Yes ☐ No | ______ | ______________________ | ☐ Yes ☐ No |

---

## §6 One specific change to ship in week 2

Per the discipline rule — name **exactly one** change for week 2. Multi-change retros become wish lists that don't ship.

**The change:**

> ______________________________________________________________________

**Why this one over the others:**

> ______________________________________________________________________

**What ships it:** (a specific MR / commit / dispatch — name the deliverable, not just the intention)

> ______________________________________________________________________

**Owner + deadline:** (Chau by default; deadline = end of week 2 from this retro's date)

> ______________________________________________________________________

**Specifically NOT shipping in week 2:** (the items considered and rejected — name them so they're not silently reconsidered)

- ______________________
- ______________________
- ______________________

---

## §7 Three decisions deferred until week 4+

The decisions that the week-1 data is NOT enough to make. Name them explicitly so they don't drift into week 2 by default. Each must include:

- The decision (what's being decided)
- Why week-1 data can't make it (specifically — too small N, wrong window, requires Facebook/Zalo data, requires a paid tool that isn't installed, etc.)
- The earliest legal read-date (calendar)

| # | Decision | Why deferred | Earliest read |
|---|---|---|---|
| 1 | ______________________ | ______________________ | ______________________ |
| 2 | ______________________ | ______________________ | ______________________ |
| 3 | ______________________ | ______________________ | ______________________ |

**Common deferral patterns** (delete if not relevant):

- Facebook / Zalo variant decisions (need day-14 per decision-criteria.md windows)
- "Should we ship Variant C of the landing page?" (needs the Variant A vs. B platform tests' week-1 reads, plus the bilingual landing copy A/B → §5.3 of `landing-page-variants.md` is the proposal doc)
- "Should we install Plausible?" (week-1 site-side reads need to come up short before this is even a question — see `first-week-metrics-spec.md` §5)
- "Should we send a follow-up email?" (gated on unsubscribe system shipping; see `CLAUDE.md` Email system)
- "Should we open the Stage 3 source revision PR for the landing copy?" (per `landing-page-variants.md` — a separate dispatch after Chau picks a winner)

---

## §8 Process notes (operator-facing, not user-facing)

Notes for the next launch wave's prelaunch / window / metrics docs. These are amendments-in-spirit; they get applied in follow-up MRs against the relevant doc.

| Doc | Suggested amendment |
|---|---|
| `prelaunch-checklist.md` | ______________________ |
| `launch-window-operations.md` | ______________________ |
| `first-week-metrics-spec.md` | ______________________ |
| `stage-3-content-kit/` (any sub-file) | ______________________ |
| `landing-page-variants.md` | ______________________ |
| `runbooks/disaster-recovery.md` | ______________________ |

**No amendments shipped from this retro automatically.** Each suggested amendment becomes a follow-up MR if and only if it survives one week of post-retro reflection. Hot-fix amendments to a launch's own docs in the retro itself bias toward over-correction.

---

## §9 Bilingual operator note (VI / EN parity)

If any operator-facing language in the launch produced confusion that crossed languages — a VI line was unclear to a diaspora-EN-speaker, an EN line was unclear to a VN-resident-VI-speaker — record it here. This is the section that protects the bilingual parity invariant that the rest of the launch kit asserts.

| Source line | Audience that misread | What they thought it said | What it should say | Fix path |
|---|---|---|---|---|
| ______________________ | ______________________ | ______________________ | ______________________ | ______________________ |

---

## §10 Anti-checklist — what this retro deliberately does NOT do

| Not done | Why |
|---|---|
| Per-user retention analysis | No per-user attribution chain exists; rejected by `first-week-metrics-spec.md` §5 + `measurement-plan.md`. |
| Forecast next-launch outcomes | Outcome promises are the discipline rule above; the retro records, it does not predict. |
| Recommend code changes beyond §6's one named change | Multi-change retros become wish lists. |
| Conclude Facebook / Zalo variant outcomes | Window is 14 days per decision-criteria.md; week-1 is too early. |
| Rate the launch as success / failure / mixed | "Did anything regress; what surprised us; what's the one named follow-up" is the read at this scale. Single-summary scores compress out the signal. |
| Loop in a committee | Decision-rights per decision-criteria.md §"Decision-rights" = Chau alone. No committee at this scale. |
| Cite paid-amplification thresholds | This kit is organic-only per `measurement-plan.md`. |
| Auto-archive the launch posts | Archival is a separate decision; some posts stay live for ongoing traffic, some come down, but the call belongs in the next dispatch, not the retro. |

---

## §11 Sign-off

Once §1–§9 are filled (§5 partially if Facebook/Zalo data unavailable; §10 untouched — it's reference text):

| Field | Value |
|---|---|
| All §1–§9 sections filled or explicitly marked N/A | ☐ |
| §6 one-change-for-week-2 is a specific deliverable (MR / commit / dispatch), not a vague intention | ☐ |
| §7 three-decisions-deferred are each tied to an earliest-read calendar date | ☐ |
| Source spreadsheet link recorded in §0 (operator-only, NOT in repo) | ☐ |
| Retro saved to `reports/launch-week-1-YYYY-MM-DD.md` (NOT this template file) | ☐ |
| Calendar slot scheduled for day-14 retro IF Facebook / Zalo variants in scope | ☐ |

**Retro author signature (just type your name):** ______________________

---

## §A References

- [`prelaunch-checklist.md`](./prelaunch-checklist.md) — the morning-of checklist whose §0 deploy-SHA fields this retro's §0 mirrors.
- [`launch-window-operations.md`](./launch-window-operations.md) — the during-window doc whose operator scratch-sheet contents feed this retro's §1 + §3 + §4.
- [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) — the day-1-through-7 measurement spec this retro's §1.2 + §4 + §5 read against.
- [`launch-readme.md`](./launch-readme.md) — the index tying these docs together.
- [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — the variant-test thresholds + windows that gate §5's "earliest legal read."
- [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) — the privacy boundary every section honors.
- [`stage-3-content-kit/ab-variants.md`](./stage-3-content-kit/ab-variants.md) — where §5.3 logs any mid-window pull decision.
- [`stage-3-content-kit/faq.md`](./stage-3-content-kit/faq.md) — the FAQ §4 cross-references.
- [`landing-page-variants.md`](./landing-page-variants.md) — the landing-copy proposal whose Variant-pick decision is named as a likely §7 deferred item.

---

**End of week-1 retrospective template.** Each filled retro becomes a `reports/launch-week-1-YYYY-MM-DD.md`. The template itself is never filled in-place — copy first, then fill.
