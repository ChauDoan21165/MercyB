# MercyBlade Strategy — V3 (Canonical)

> Canonical strategy doc. Supersedes the prior NORTH_STAR / long-form
> STRATEGY framing. The 20-step ladder at the bottom is the instrument;
> everything above it is the thesis, the priorities, and the operating
> rules. Operational *status* (which Definition-of-Done bars are closed,
> per-system file locations) lives outside this doc — see CURRENT-STATE /
> docs/architecture — so this stays a strategy file, not a status log.

## Who Chau is (context for every decision)

Vietnamese journalist. Article 117 warrant. Exiled. Currently in Grande
Prairie, Alberta. Solo founder, 57, rebuilding from zero.

MercyBlade isn't a startup hobby — it's survival. The state strategy
against exiled dissidents is patient: wait for runway to end, family
pressure to mount, morale to fall. The counter-strategy is simple — don't
fail, don't burn out, don't slow down, build something that compounds.
Every day MercyBlade gets stronger, the patient strategy weakens.

This shapes every call: pace, priorities, what gets cut, what ships. It's
also why **Vietnamese → English** is the home market and the identity
moat — not because the other directions aren't real product, but because
this is the audience Chau can reach and serve like no competitor can.

---

## The thesis, in two beats

**Beat 1 — what the moat actually is.**
The intelligence ladder creates the *wedge*. The moat forms only when that
VN↔EN depth **fuses** with proprietary learner data, daily habit, trusted
correction, and community distribution. The components commoditize —
foundation models will hand anyone phoneme scoring, tone tracking, and
interference detection. The *fusion* is what's hard to copy, and the
proprietary inputs are what compound. Depth alone, even well-integrated, is
a 12-month head start; depth fused with the four banked assets is the
business.

**Beat 2 — what decides survival.**
**The intelligence ladder earns the right to be opened. The retention loop
decides whether MercyBlade becomes a company.** Duolingo does not win on
intelligence — it wins on habit, trust, and being the default. We can have
better Vietnamese intelligence and still lose if learners don't return
tomorrow. So intelligence opens the door; retention keeps the house. Build
both. Declare victory only on the second.

Then: ship to the stores and market. Depth-first. No language expansion
until the pair proves out.

---

## Retention is the gate, not a sidecar

This is the operating principle that everything else serves. Earlier
framing filed retention under "track separately" — which quietly tells the
build to keep shipping satisfying intelligence and defer the messy habit
work forever. Corrected:

**No learner-facing capability counts as a win until it moves retention or
a measured outcome.** Shipping is a *technical* milestone. Moving D1/D7 is
a *product* win. If the tone-feedback MVP ships and doesn't lift return
rate, it's a technical win and an open question — not a product win.

The one exception: **data-flywheel infrastructure** is judged differently.
The capture/labeling pipeline won't move D1/D7 directly, but it's the asset
we're banking — it's gated on whether it compounds the moat, not on this
week's retention number.

Lead with two questions, never "what rung are we on?":

1. **Outcome** — did the learner measurably improve? (native-rated pre/post
   speaking, "I passed the interview / talked to grandma," test deltas)
2. **Habit** — do they come back? (D1/D7/D30, weekly active practice)

---

## Success metrics & targets

**The single most important number: Monthly Active Paying Users** (MAU with
an active subscription). VN→EN is the loudest sub-metric. This is the
number the retention gate and the outcome work both serve — it sits
directly downstream of Beat 2.

**Year-1 targets:**

| Metric | Target |
|---|---|
| MAU paying users | 1,000 → 10,000 |
| Day-30 retention | > 25% |
| Paid conversion from free | > 3% |
| ARPU | > $5 / month |
| Net Promoter Score | > 40 |
| Public success stories | > 10 / month |

**Vanity metrics to ignore:** total downloads, signups without engagement,
social followers that don't convert, time-in-app that doesn't produce
learning outcomes.

---

## Two directions, two jobs

Build both — it's nearly free this month with agents and a token budget
that expires unused. But they are **not co-primary.** Different buyers,
distribution, margins, and technical stacks. Bet the go-to-market on one.

| | **VN→EN — the commercial spearhead** | **EN→VN — the believability engine** |
|---|---|---|
| Role | Where the business lives | Proof-of-depth, credibility weapon, margin |
| Market | Vietnam English learners, ~$38M (2024) → ~$120M+ (2033) | ~4.5M diaspora, tiny but high WTP |
| Distribution | **The 220K live here.** | **Near zero** — different buyer, built later via PR |
| Killer problem | interference, Vietlish, VN-accented English pronunciation | tone, VN pronunciation, family shame |
| Duolingo | Absent — no VN-course AI | Weak — Hanoi-only, no tone feedback |
| Monetization | Price-sensitive — a design problem, not a market problem | Emotional, higher disposable income |

**Commercial focus = VN→EN.** Prove D1/D7/D30 and willingness-to-pay here.
**VN→EN sells.**

**EN→VN makes them believe.** In a market drowning in GPT-wrapper apps,
grading Vietnamese tones — which nobody else does and which is genuinely
hard — is the public proof that the whole product has real depth. That
proof transfers credibility to the VN→EN sell: if they can do the
impossible tone thing, their English correction must be serious too. Build
it because it's nearly free, it banks the most-defensible niche, and it's
the believability engine for the main product and the journalist network.
Anchor feature: the **family-bridge** ("speak to grandma without shame") —
pulled forward, not buried.

---

## What "one engine" actually means

**Shared:** the contrastive *framework* (model the L1→L2 bridge), the
data-capture pipeline, the regression/abstention discipline, the
text-correction-rule architecture.

**Not shared:** the acoustic scorers. VN→EN = phoneme/acoustic
classification. EN→VN = F0 pitch-contour tone tracking. Different signal
problems, different models. Keep the tone files and the
English-pronunciation files strictly isolated — that lane isolation is the
firewall against dependency hell. Never let the two scorers share threshold
logic.

---

## Competitive thesis (verified mid-2026; re-verify quarterly)

Duolingo's AI conversation (Video Call with Lily, Roleplay) is a **paid Max
feature (~$168/yr), not free**, covering only
English/French/Spanish/Italian/German/Portuguese (+ a few "English for X"
courses). **Vietnamese: none, either direction.** Its own VN course is
volunteer-built, Hanoi-only, tone-weak. On the VN↔EN pair, Duolingo's best
AI tooling is both paid and structurally absent.

**The two real threats:**

- **Foundation models, not Duolingo, set the clock.** When native
  tonal-audio ships, the depth commoditizes and Duolingo inherits it free.
  **Assume ~12–18 months as planning discipline — not prophecy.** The
  timeline is unknowable; the discipline is the point. And note: a model
  that can *technically* hear tones still may not ship a *trustworthy*
  Vietnamese tutor. That gap — between raw capability and a trusted,
  VN-calibrated product — is exactly where the fused system lives.
- **Human tutors** (iTalki, diaspora teachers) own the high-stakes "sound
  right to family/work/citizenship" job. Our edge isn't out-teaching them —
  it's availability, low-shame practice, and price.

---

## Trust floor + warmth engine (both required)

- **Trust floor:** when confidence is low, abstain. Never confidently
  wrong. One wrong tone correction in a high-context culture costs more
  than ten right ones earn.
- **Warmth engine:** correction and abstention must feel like an
  encouraging bilingual teacher — visible progress, low-shame,
  identity-affirming.
- **Refinement:** abstention must **never dead-end the conversation.** "I'm
  not sure, let's skip that" kills the magic. Abstention redirects into
  engaging practice — it stays a game. Graceful redirect, not a clinical
  halt.

---

## Strategic weighting

**Spend the edge (MOAT):** the contrastive cluster — VN→EN: interference,
Vietlish, VN-accented English pronunciation, register; EN→VN: tone, VN
pronunciation, family-bridge, register — plus the VN twists in Steps
9/10/14/15.

**Build only enough not to lose (PARITY):** static lessons, basic tutor,
topic-retention, cross-session memory, learning-style, open chat,
encourage-vs-challenge. Foundation models and free Duolingo cover these;
perfection is wasted edge, especially as the tech commoditizes.

---

## Smallest viable moat per direction

- **VN→EN:** interference correction + VN-accented English pronunciation +
  Vietlish + a retention loop that demonstrably brings learners back.
- **EN→VN:** 3-tone feedback + basic VN pronunciation + the family-bridge
  as anchor.

Defer the long tail (16, 17, 19, parts of 14/15) until the core proves
daily-use and willingness-to-pay. Ship fast, instrument outcomes +
abstention rate + retention, let the data choose what's next.

---

## Business model & pricing

**Vietnamese-native (Vietnamese market):**

- **Free** — 50+ rooms, no ads, builds habit
- **Basic — 99,000₫/mo (~$4)** — all rooms, offline, no ads
- **Premium — 199,000₫/mo (~$8)** — Basic + AI feedback + pronunciation
  scoring + test prep
- **Annual — 1,490,000₫ (~$60)** — 40% off vs monthly
- **Lifetime — 2,990,000₫ (~$120)** — captures the "no subscriptions" crowd

The Vietnamese affordability floor is **non-negotiable** and independent of
any other pair's pricing.

**English-native:** likely USD $9.99–14.99/mo (higher purchasing power);
exact tiers are Chau's decision — do not invent specifics.

**Payment must support:** MoMo, ZaloPay, VNPay, bank transfer, credit card,
Apple Pay, Google Pay.

**Unit economics target:** CAC < $2 · LTV > $50 · monthly cost/user (AI +
hosting) < $1 · gross margin > 80%.

---

## Roadmap

- **Phase 1 — now:** Reach the smallest viable moat on VN→EN; bank EN→VN
  cheaply while tokens are free. Capture, label, and guard learner data
  from day one — the flywheel starts now.
- **Phase 2 — App Store + Google Play.** Clear store blockers early
  (account-deletion guard is a submission blocker, in flight) so submission
  isn't gated on ladder completion.
- **Phase 3 — marketing.** The 220K, the journalist network, the "only app
  that grades Vietnamese tones" angle. Where banked trust + distribution
  convert.
- **Expansion discipline:** no new languages **until VN↔EN proves
  retention, trust, and revenue.** Depth-first, not expansion-first. The
  architecture can support other pairs; the strategy won't pursue them
  until the pair is won. This is discipline, not dogma — it preserves
  optionality by refusing to spend it early.

---

## Current position

Step 7 of 20 — frontier, both directions in motion. VN→EN interference
library closed (459 cases, 0 drift); Vietlish converting to live rules;
VN-accented English pronunciation is the next frontier piece. EN→VN tone
scorer built/calibrated; 3-tone learner MVP shipping flag-gated.
Notifications merged (device-test pending), gamification flip-safe, SM-2
live. Production data secured; Supabase recovery in progress.

---

## What this strategy does NOT measure (track separately)

- **Trust/precision** — always-on. Status: 459 cases / 0 drift; guard queue
  draining false positives.
- **Distribution/brand** — win on depth in the pair. Assets: 220K VN
  followers, journalist network.

*(Retention used to live here. It's now the gate above — promoted out of
the sidecar on purpose.)*

---

## Honest caveats

- "Ceiling" (Step 20) = as good as a great bilingual human tutor in a
  single VN↔EN session, not "perfect AI." Approximate, not a checkbox.
- Steps aren't strictly sequential; the number tracks intelligence level
  reached, not build order, and is **not** percent-complete. Keep it
  internal.
- Evaluation cost rises sharply at the high rungs (11, 13, 18, 20). Proving
  "better than a bilingual teacher" needs human eval loops — budget for it
  or those rungs stall.
- The depth has a shelf life. That's the plan, not a flaw: the ladder buys
  the window, the fused assets are the business.
- This is a profitable, focused-depth business, not a venture-scale land
  grab. Read a high rung as "the wedge is sharp," never as "we've won" —
  the retention loop decides that.

---

## The 20-step ladder (the instrument)

MOAT = Duolingo can't/doesn't do this for VN↔EN · PARITY = build only
enough not to lose. Status: CLOSED · FRONTIER · PLANNED.

| # | Step | Weight | Status |
|---|---|---|---|
| 1 | Static lessons, no per-learner intelligence | PARITY | CLOSED |
| 2 | Basic AI tutor that answers but doesn't know the learner | PARITY | CLOSED |
| 3 | Rough pronunciation + tone-direction feedback (the wedge) | MOAT | CLOSED |
| 4 | Detects ONE high-frequency VN→EN interference error | MOAT | CLOSED |
| 5 | Detects 4–6 common interference errors, every correction right | MOAT + TRUST GATE | CLOSED |
| 6 | 10+ interference patterns, precision held | MOAT (deepest) | CLOSED |
| 7 | Real signal-level phoneme + tone grading (both directions) | MOAT | FRONTIER |
| 8 | Conversation stays on topic 4+ turns, no repetition | PARITY | PLANNED |
| 9 | Conversation pivots on what the learner said | PARITY core / MOAT twist | PLANNED |
| 10 | Notices emotional state, adjusts (VN-calibrated warmth) | PARITY core / MOAT twist | PLANNED |
| 11 | Catches awkward Vietlish — correct but unnatural | MOAT (sharpest) | PLANNED (seeding) |
| 12 | Cross-session memory of the specific learner | PARITY | PLANNED |
| 13 | Family-bridge / parent view, in Vietnamese, without shame | MOAT — **EN→VN anchor, pull forward** | PLANNED |
| 14 | Plans next lesson from history + interference profile | MOAT-leaning | PLANNED |
| 15 | Dynamic curriculum sequenced by interference mastery | PARITY core / MOAT twist | PLANNED |
| 16 | Detects learning style, adapts presentation | PARITY (low leverage) | PLANNED |
| 17 | Open-ended in-character conversation, never breaks | PARITY | PLANNED |
| 18 | Catches cultural / register errors (VN politeness tiers) | MOAT | PLANNED |
| 19 | Knows when to encourage vs challenge, unprompted | PARITY | PLANNED |
| 20 | CEILING — real-world VN↔EN communicative competence | — | — |
