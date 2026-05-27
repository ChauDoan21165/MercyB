# Decision criteria — when to stop iterating

The companion doc to [`ab-variants.md`](./ab-variants.md) and [`measurement-plan.md`](./measurement-plan.md). Names the explicit rules for when a variant test ends, when a winner is declared, and when *both* variants get retired.

The default failure mode in marketing experimentation is *running tests forever* — every variant gets compared to a fresh idea, no decision ever lands, energy drains. This file exists to make endings explicit.

---

## The four possible outcomes of a variant test

Every A/B test concludes in exactly one of these four states:

| Outcome | Meaning | Action |
|---|---|---|
| **B wins** | B beat A on the named success signal by the named margin, at the named sample size. | Adopt B as the new shipped baseline. Archive A as historical reference. Move on. |
| **A wins** | B failed to beat A by the named margin OR A beat B by the named margin (less common but possible). | Keep A. Document the negative result in this kit's history log. Don't re-run the same variant. |
| **Tie** | Both variants performed within the noise floor of each other at the test's sample size. | Pick A by default (the "no change needed" tiebreaker). Move on. |
| **Both lose** | Both variants underperformed prior baseline expectations badly enough that the content piece itself is the problem, not the variant. | Retire the content piece. Don't repost. Audit the upstream framing in `ab-variants.md` for a re-write. |

The fourth outcome is the one that gets skipped most often. If a TikTok script gets fewer than 200 views across both variants over 7 days, the answer is *not* "let's test a Script-C variant"; the answer is *"this script doesn't work on this platform; move energy elsewhere"*.

---

## Thresholds per platform

Each platform has its own sample-size floor + time window + effect-size threshold. The thresholds are calibrated to MercyBlade's organic-only posture (no paid amplification means small N's are realistic).

### TikTok-VN

| Parameter | Value | Reasoning |
|---|---|---|
| Minimum reach per variant | **N ≥ 500 impressions** | TikTok's organic distribution is bursty; below 500 the noise floor is unreadable. |
| Test window | **7 days from post** | TikTok's algorithmic decay is fast; meaningful engagement after day 7 is rare and not representative. |
| Effect-size threshold | **B beats A by ≥30% on primary metric** | At N=500, a 30% effect with a binomial-rate primary metric is well above the noise floor (rough χ² intuition; we don't compute p-values). |
| Primary metric | Per variant, per the success signal in [`ab-variants.md`](./ab-variants.md). | Each script names its own primary metric — view-through duration / save count / share count / etc. |
| Tiebreaker | **A wins on tie.** | The shipped baseline is the default. |
| "Both lose" threshold | **Reach < 200 per variant after 7 days** | If TikTok didn't push it, no copy change will fix it. |

### Facebook (diaspora)

| Parameter | Value | Reasoning |
|---|---|---|
| Minimum reach per variant | **N ≥ 300 reach** | Facebook organic is even thinner than TikTok for new pages; 300 is the practical floor. |
| Test window | **14 days from post** | Facebook posts have a longer half-life than TikTok; engagement at days 8–14 is meaningful. |
| Effect-size threshold | **B beats A by ≥40% on primary metric** | Higher threshold than TikTok because Facebook organic noise is higher relative to N. |
| Primary metric | Per [`ab-variants.md`](./ab-variants.md) per post. | |
| Tiebreaker | **A wins on tie.** | Same default-is-baseline rule. |
| "Both lose" threshold | **Reach < 100 per variant after 14 days** | If Facebook didn't surface it, the post died regardless. |

### Zalo

| Parameter | Value | Reasoning |
|---|---|---|
| Minimum sample per variant | **5 seed conversations forwarded out** | Zalo has no public reach metric; manual seed count is the unit. |
| Test window | **14 days from seed** | Zalo's forward dynamics are slower; 14 days is enough for a card to propagate or not. |
| Effect-size threshold | **B's forward-on rate beats A's by ≥50%** | Higher than Facebook because the per-card N is lower; the effect has to be obvious to be readable. |
| Primary metric | Forward-on rate = (recipients reporting they forwarded the card) / (recipients reached). | |
| Tiebreaker | **A wins on tie.** | |
| "Both lose" threshold | **Forward-on rate < 10% for both variants** | If 9 out of 10 recipients don't forward either card, neither hook is doing its job. |

### Press one-pager + FAQ

These two files are not variant-tested. Press materials are one-shot artifacts; the FAQ is a reference doc. No A/B is proposed and none should be invented.

---

## Sample-size honesty (why these thresholds are loose)

A real product-team A/B test would use formal statistical tests — power analyses, p-values, confidence intervals. MercyBlade is one founder + organic-only distribution; the numbers we get are too small for formal tests to be meaningful.

So the criteria above are deliberately **loose**:

- **N=500 / 30% effect** on TikTok is not "statistically significant" in any formal sense. It's "obviously different to the naked eye." That's what we can read at this scale.
- **A wins on tie** is the default because the cost of changing the shipped baseline (re-recording a script, re-drafting a post) is non-trivial, and a tie does not pay back that cost.
- **No multi-arm tests.** Don't run B vs B' vs B''; just A vs B. Multi-arm at small N is statistically worthless and operationally exhausting.

If a future stakeholder pushes for rigor — *"we should run a proper power-analyzed test with 5,000 users per arm"* — the answer is *"we don't have 5,000 users per arm. We have ~500 per arm if we're lucky. The criteria fit the scale."*

---

## Cadence — testing order, not parallelism

Do NOT run all 15 variant pairs simultaneously. Reasons:

1. Cognitive overhead. Tracking 15 concurrent reads is impossible at one-founder scale.
2. Cross-contamination. If two TikTok variant tests run on the same audience same week, the second is biased by the first.
3. The variant tests are designed *sequentially*, not as a batch — each variant's hypothesis builds on the prior tests' conclusions.

### Recommended order

| Wave | Tests | Why |
|---|---|---|
| **Wave 1 (weeks 1–2)** | TikTok Script 1 A/B; Facebook Post 1 A/B; Zalo Card 1 A/B | The diagnostic frame across all three platforms. Calibrate the measurement workflow + read confidence before more complex variant pairs. |
| **Wave 2 (weeks 3–4)** | TikTok Script 2 A/B; Facebook Post 2 A/B; Zalo Card 2 A/B | The prescriptive frame. Wave 1's findings inform whether to keep the established conventions or change. |
| **Wave 3 (weeks 5–6)** | TikTok Script 5 A/B; Facebook Post 5 A/B; Zalo Card 3 A/B | The anti-shame / older-learner / no-streak posture. The most differentiated message; saved for last so prior waves earn the audience first. |
| **Wave 4 (weeks 7+, conditional)** | Remaining variants — Scripts 3 + 4, Posts 3 + 4, Cards 4 + 5 | Only run if waves 1–3 didn't produce a clean winner across the kit. If they did, ship the winners and stop. |

**Total estimated time to "kit is settled"**: 6–8 weeks of organic posting, conditional on engagement reaching the thresholds above.

### What "settled" means

The kit is settled when:

- Each of the 5 piece-types (TikTok / Facebook / Zalo / press / FAQ) has a chosen baseline.
- For TikTok / Facebook / Zalo, the chosen baseline is one of: A (default), B (B won), or "retired" (both lost).
- The decision is logged in a one-line entry per piece in the kit's history log (file: `history.md`, created at first decision; doesn't need to exist yet).

After settled, *no further variant testing on the kit* for at least 3 months. Audience drifts on the scale of quarters; running fresh variants weekly burns energy and audience attention without reading anything.

---

## What to do mid-test if a variant is *obviously* failing

Sometimes a B variant launches and within 24 hours it's clear B is bombing — view duration is half of A, comments are confused or hostile, the hypothesis was wrong. Two options:

| If… | Then… |
|---|---|
| B is just underperforming A | **Let the test run to its window.** Premature stops are how confirmation bias creeps in. The 7- or 14-day data is the data; cutting short biases toward A. |
| B is *actively damaging brand* (negative-sentiment thread, misinterpretation, factual error spotted) | **Pull the post. Log a "both lose" outcome.** Edit `ab-variants.md` to document why the variant was retired. Do NOT replace it with a new B-prime variant in the same wave — wait until the next quarter. |

The second case is rare but real. The Facebook Post 2 B treatment (learner-voice "I tried it" narrative) is the highest "actively damaging" risk in the kit, because it's the closest to the no-fabricated-testimonials line. If any reader interprets that post as a sock-puppet testimonial, pull it.

---

## What to do when both variants underperform expectations

The fourth outcome — *"both lose"* — is the easiest to miss and the most important to act on. Symptoms:

- TikTok script gets <200 reach per variant after 7 days.
- Facebook post gets <100 reach per variant after 14 days.
- Zalo card gets <10% forward-on rate for both variants.

In all three cases, the content piece itself is the problem, not the A/B choice. Action steps:

1. **Stop reposting the piece** in any form on the platform that failed.
2. **Do NOT immediately re-write it.** Audit the upstream framing first — is the hypothesis behind the piece still right? Is the platform still right for this message?
3. **Cross-check against the kit-wide constraints** in [`README.md`](./README.md). Sometimes a piece "fails" because it accidentally crossed a constraint (e.g. implied outcome claim that the audience rejected, even though we thought we'd cleared it).
4. **If the piece is salvageable**, write a new draft from scratch in a separate worktree, route it through the bilingual style guide (`docs/copy/vi-style-guide.md`), and post it under a fresh wave.
5. **If the piece is not salvageable**, mark the row in `ab-variants.md` as retired with a one-line reason. Move energy to the platforms / pieces that did work.

The goal is not "every piece succeeds." The goal is *"we know which pieces work and we doubled down on those."*

---

## Decision-rights — who calls each outcome

- **B wins / A wins / Tie**: Chau decides, alone, based on the spreadsheet. No committee.
- **Both lose**: Same.
- **Pull mid-test (active brand damage)**: Chau decides immediately, alone. No "let me wait and see."

There's no review board for these decisions because there is no marketing team. The decision discipline is Chau's; the criteria above exist to make those decisions resistible to wishful thinking.

---

## The drift-check clause

3 months after the kit is settled, re-walk the chosen baselines against the current state of the app + the audience.

- If `/weak-at` has changed materially (new sections, new copy, removed component) → the kit needs re-audit before reposting.
- If the audience has shifted (e.g. an unexpected segment started engaging — diaspora-Australia audience appears, or VN-resident high schoolers start sharing) → variant tests for the new segment may be warranted.
- If neither — keep what's settled. Don't fix what's working.

The drift check is one event per quarter, scheduled on a calendar; it is not a continuous activity.

---

## Anti-patterns to avoid

| Anti-pattern | Why it's bad |
|---|---|
| **"Just one more variant"** — extending a test indefinitely with a fresh B-prime, B-double-prime, etc. | Confirmation bias; energy drain; no decision ever lands. |
| **Reading "engagement = success"** across types of engagement | A spike in confused comments is engagement but not success. Read sentiment in addition to count. |
| **Cross-platform comparison** ("Script 1 got more shares than Post 1, so Script 1 won") | Different platforms, different audiences, different formats. Within-platform comparison is the only valid read. |
| **Re-running a "both lost" piece with a fresh variant** | If the piece bombed on the platform, the platform was wrong for the piece — or the piece needs a ground-up re-write, not a variant. |
| **Using A/B reads to argue for paid amplification** | This kit is scoped to organic. Paid amplification is a separate decision with separate criteria that don't exist yet. Don't conflate. |
| **Sharing the spreadsheet publicly** | The spreadsheet contains coded identifiers of conversations and posts. Even with PII-coded, sharing it externally crosses the privacy line. The spreadsheet is for Chau only. |

---

## What this file is NOT

- Not a substitute for editorial judgment. The criteria help avoid running tests forever; they don't replace asking *"is this piece any good?"* in the first place.
- Not a license to abandon underperforming pieces too fast. The 7-day window for TikTok exists for a reason — early signal is noise.
- Not a recommendation to test everything. Some pieces in the kit (press one-pager, FAQ) are deliberately not variant-tested. Press materials and reference docs don't benefit from A/B; their job is accuracy and discoverability.
- Not a forecast that any specific variant will win. Of 15 B variants, I would expect 3–5 to win, 5–7 to tie or lose, and 3–5 to produce ambiguous reads. That's normal at this scale.

## References

- [`ab-variants.md`](./ab-variants.md) — the 15 variant pairs this file decides between.
- [`measurement-plan.md`](./measurement-plan.md) — the privacy-respecting measurement framework. Decisions in this file are made from data collected per that plan.
- [`README.md`](./README.md) — kit-wide constraints that any winning variant must still honor (no outcome claims, no competitor trademark, VI clears shame regex, etc.).
- `docs/copy/vi-style-guide.md` — any new copy variant (B-prime in a future wave) must pass this style guide before being tested.
