# L6 — Parent / Teacher / Family Layer

> **Layer source:** `layer-model.md` §L6 (Parent / Teacher / Family
> Intelligence) — *parallel-track candidate, not sequential
> successor to L5*.
>
> **Strategic anchor:** `STRATEGY.md` (V3 — Competitive thesis) —
> diagnostic transparency, not gamified motivation. Vietnamese diaspora +
> in-country parent market is *"large, sticky, pays, refers."*
>
> **Why this doc exists:** !113's L0–L7 cross-reference flagged
> L6 as a real doc gap — *"highest differentiation-per-effort
> layer; first design + market + copy doc would be Likely should
> be tracked from day one."* This is that first doc. It is the
> design + market + copy artifact that grounds Stage 5 / L6
> authoring whenever it begins. It is **not** a roadmap; it is
> a scope contract for the team that picks up Stage 5.

---

## What L6 is

A surface that explains the learner's progress to **the people
who matter to that learner** — in the language those people
speak, without shame, gamification, or behind-framing.

> *"Mercy explains your progress to people who matter to you,
> not just to you."*

For the Vietnamese diaspora, learning is heavily parent-mediated.
The competitive function (per `STRATEGY.md` (V3 — Competitive thesis)
+ the Duolingo Competition Strategy table) is **diagnostic transparency, not
gamified motivation** — *"Here is what this learner actually
struggles with"* — which Duolingo cannot offer because they do
not have a mastery model.

No competitor today shows a Vietnamese-speaking parent a
1-sentence honest summary of why their kid keeps getting a
specific English pattern wrong, in Vietnamese, with a 90-second
Vietnamese explainer video. **That gap is the wedge.**

---

## Audience

Three concrete personas. They span family-mediated diaspora
learning, family-mediated in-country learning, and institutional
teacher use.

### Persona A — Diaspora parent (US / Canada / AU)

Vietnamese-first speaker, English may be limited. Age 35–55.
Kid age 8–14, English-native at school but parent wants signal
on academic / IELTS-prep direction.

- **Needs to see:** weekly Vietnamese summary; one or two
  specific patterns the kid is working on (with the Vietnamese
  explainer); evidence the practice is real.
- **Doesn't want:** Western-app leaderboards, surveillance
  ("at 11pm your kid…"), English-only copy.
- **Would recommend to:** other Vietnamese parents at temple /
  church / Tết gatherings if the surface feels *respectful*.

### Persona B — Parent in Vietnam (paying Premium)

Vietnamese-first, some English. Age 30–45. Kid age 6–12; parent
paying ~199,000 VND/month wants to verify the spend.

- **Needs to see:** weekly evidence *"my kid learned X."* Will
  cancel quickly if it feels like a black box.
- **Doesn't want:** abstract metrics, numeric scores without
  translation, UI that assumes ed-tech literacy.
- **Would recommend to:** the next friend whose kid is starting
  English, if they can retell one weekly story at coffee.

### Persona C — IELTS prep teacher (Hanoi class of 8)

English-proficient (C1+). Age 25–35. Already uses Cambly /
class-tracking tools.

- **Needs to see:** class roster; per-student weakness summary;
  IELTS-band trajectory. Saving 30 min/week of manual tracking
  is the win condition.
- **Doesn't want:** another login; per-student detail that
  doesn't aggregate at class level; setup that needs IT.
- **Would recommend to:** the prep center owner, if it saves
  the documented 30 min/week.

---

## What L6 is NOT

Bright lines, per `CLAUDE.md` non-negotiable #2 (Kids mode
sacred) + `study-os-stage-3.md` (Study OS Summary Boundary) +
`placement-v3.md` (Placement Writeback Boundary) + L1's substrate posture:

- **Not a gamified parent dashboard.** No leaderboards, streak
  comparisons, or XP totals visible to the parent.
- **Not a class leaderboard for Persona C.** Ranking students
  against each other is shame mechanics on the kid.
- **Not surveillance.** No per-utterance timestamps, transcripts,
  or audio replays — the Study OS Summary Boundary forbids it.
- **Not a parent override.** Cannot raise practice quota, lock
  features, or grant rewards. L6 reads only.
- **Not a Placement writeback path.** Only the placement engine
  writes `profiles.placement_*`; L6 is a downstream reader.
- **Not a kids-mode bypass.** Kids mode stays offline-first / no
  login. The parent surface lives on the adult-side and reads
  via a consented bridge — never inside the kids app.

---

## Data dependencies

L6 reads from L3 (Study OS) and L4 (Diagnostic Intervention).
Some signals exist today; some don't.

### Available today (L3)

- L1 detector tag stream (`mb.stage3a.l1.recent`, cap 50).
- Placement v3 snapshots (`mb.stage3a.placement.snapshot`).
- Pronunciation phoneme attempts (`mb.stage3a.pron.recent`,
  cap 100, with optional pain-point axis).
- The aggregated weakness map that powers `/weak-at` — parent
  view reads the same aggregator output.

### L4-blocked (don't exist yet)

- *"What pattern has the planner been steering toward this
  week?"* — needs L4's intervention engine. Without it, L6 can
  show *flagged*, not *worked-on*.
- *"Is intervention working?"* — needs L4 + L5 to attribute
  improvement. Without both, L6 shows descriptive change
  ("count fell from 12 to 4") but cannot say *"Mercy helped."*
- Sequencing for "this week's focus" — L5 decides priority,
  L4 acts. Without both, no planned weekly arc.

### L5-blocked (don't exist yet)

- *"Is this improvement significant?"* — pedagogy threshold.
- "Well-explained week" narrative structure.

L6 first-build can ship on L3 aggregates alone, framed
descriptively. The full *"Mercy plans → Mercy explains"* thesis
(`layer-model.md` §L7) needs L4 + L5.

---

## Privacy + safety

The same boundary posture as L1 and L3, extended to a new
audience.

### What a parent CAN see

- **Aggregate counts.** Rooms completed this week, attempts,
  pronunciation accuracy by band (not per-utterance).
- **Per-pattern weakness tags.** `vi_l1_topic_comment_fronting`,
  `final_consonant_cluster_reduction`, etc. With a Vietnamese
  short-description from `L1_VN_EXPLANATIONS` (the same source
  the in-product chip uses).
- **Placement CEFR result + flagged patterns.** Read-only, from
  the placement engine's own writeback.
- **Trend lines.** Detector-firing counts per week, descending
  is improvement. Numeric or qualitative — Open Question #5.

### What a parent CANNOT see

- **Specific learner input verbatim.** No transcripts, no audio
  replays, no free-text the kid typed.
- **Per-utterance timestamps.** Surveillance risk.
- **Raw tutor responses to the kid.** The session is the kid's;
  the aggregate is the parent's.
- **Other learners' data.** Persona C's class view shows the
  teacher's roster only; per-student detail respects each kid's
  consent.

### Who grants access — see Open Question #1

Two paths: **kid-initiated invite** (code-based, consent-first,
higher friction, matches family-decided-together culture) vs
**paywall-implied** (parent buys, kid uses, no separate consent;
lower friction; fine for younger kids, contentious for 12–14).

### Data flow

- Parent view is an **adult-side surface** — auth-gated,
  alongside the existing Account / Pricing surfaces.
- **Read-only consumer** of the same aggregator output that
  powers `/weak-at`.
- Kids-mode app stays untouched (CLAUDE.md non-negotiable #2).
- The aggregator output is computed device-side; the parent
  view consumes a server-side snapshot synced on practice
  completion. **This is the first time L1's local-only posture
  is loosened** — and only for aggregates the kid has consented
  to share, never for raw learner content. Named, high-value
  reason: *diagnostic transparency for the people who matter to
  the learner.*

---

## First-build scope

The smallest L6 feature that meets the "diagnostic transparency,
not gamification" thesis. **Not a roadmap. A scope contract for
whoever picks up Stage 5 authoring.**

**Surface:** one screen, adult-side web. Route
`/parent/:learnerId`, gated by consented access (OQ #1).

**Audience served:** Persona A + B. Persona C class-view
deferred (OQ #6).

**Screen content (top to bottom):**

1. **One-sentence Vietnamese summary.** Example: *"Tuần này
   [name] đang luyện trật tự thì quá khứ. Hai buổi nữa, lỗi này
   sẽ giảm rõ rệt."* The "two more sessions" claim is gated on
   L4/L5; without those it becomes descriptive only (OQ #9).
2. **One or two weakness tags** with the 90-second Vietnamese
   explainer per tag. This is the differentiation wedge.
3. **Trend line** — detector-firing count over past 4 weeks for
   the surfaced pattern(s). Descending = improvement.
4. **One subtle CTA** — *"Hỏi Mercy về điều này"* / *"Ask Mercy
   about this"* — links into a constrained reading-only tutor
   flow. Not admin actions.

**Hard constraints:** no streaks, no XP, no leaderboard, no raw
learner input, no parent→learner writes, VI-primary copy (OQ #2),
read-only.

**Out of first-build scope:** Persona C class-view (OQ #6),
email digest (OQ #8), multi-kid aggregation, push
notifications.

Total surface: one screen + one optional follow-up tutor flow.
Smaller than Stage 3A's Local Weakness Map, deliberately.

---

## Open questions

> Every question below is **decidable by Chau YES/NO or A/B/C**,
> per the dispatch constraint. Questions that need *research*
> rather than a *decision* are flagged in the dispatch report
> (they indicate L4 or L5 must land first); they are NOT
> included here.

1. **Access model.**
   **A** Kid-initiated invite (consent-first; more friction).
   **B** Paywall-implied (parent buys, kid uses; less friction).

2. **Parent view default language.**
   **A** VI-primary always.
   **B** Follow learner's `lessonUiLang`.
   **C** Detect from parent signup; default to A.

3. **Visibility scope.**
   **A** Aggregate categories only (grammar / pronunciation /
   vocab buckets — safer, less differentiated).
   **B** Specific weakness tags + 90-second VN explainer videos
   (the differentiation wedge; more authoring work).

4. **Time signals.**
   **A** Show practice-time per day (verification-of-spend for
   Persona B; subtle gamification risk).
   **B** Hide time (purer "outcomes not engagement").

5. **Numeric scores.**
   **A** Numeric (CEFR + accuracy %).
   **B** Qualitative only ("understands past tense better").
   **C** Numeric in expanded view, qualitative in summary.

6. **Initial-scope audience.**
   **A** Persona A + B only; defer C.
   **B** Include Persona C class-view in same MR.
   **C** Ship A + B first; commit to C as named-timeline
   follow-up.

7. **Pricing.**
   **A** Bundle parent view in Premium.
   **B** Separate "Family" tier above Premium.
   **C** Free 7-day preview; Premium-bundled after.

8. **Weekly digest email.**
   **A** Weekly opt-in.
   **B** Monthly opt-in.
   **C** Never (in-app only).

9. **L4 dependency.**
   **A** Ship without L4 — show raw L3 aggregates framed
   descriptively, no attribution to "Mercy helped."
   **B** Wait for L4 — defer L6 first-build until the planner
   can ground attribution claims.

10. **Mercy persona in parent view.**
    **A** Mercy speaks to parent (warmer, persona-consistent).
    **B** Neutral data view (cleaner).
    **C** Mercy speaks only in the digest email; in-app neutral.

---

## Decisions recorded

> Follows the !126 decision-record protocol — see
> `L5-pedagogy-decision-record.md` § How to use this doc. Past
> decisions are immutable; revisions supersede; cross-link from
> code. The § Open questions list above is the historical record
> of what was open when each decision was made; entries there are
> NOT edited.

### Decision: L6-Q1 — Access model

- **Context:** § Open questions #1. How does a parent get access to the parent view? Choices were **A** kid-initiated invite (consent-first), **B** paywall-implied (parent buys, kid uses).
- **Decision:** **B** — paywall-implied access. A parent subscription auto-grants parent view; payment IS access.
- **Rationale:** Lower friction on the conversion path; aligns with the Premium-bundled pricing decision (Q7). Honors that the parent typically drives the purchase decision in the family persona segment.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Medium. Adding a consent step on top later is additive; removing the paywall coupling would require rethinking the entire access model.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #1.

### Decision: L6-Q2 — Parent view default language

- **Context:** § Open questions #2. What language does the parent view default to? Choices were **A** VI-primary always, **B** follow learner's `lessonUiLang`, **C** detect from parent signup; default to A.
- **Decision:** **C** — locale-detect at parent signup with VI fallback.
- **Rationale:** Drift-resistant (one-time detection beats live coupling that breaks when the kid toggles); Vietnamese-first when detection is ambiguous, matching the non-negotiable. Settings can override later if a diaspora parent wants EN-primary.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Detection + default is a startup-time policy; revisable per-account from settings.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #2.

### Decision: L6-Q3 — Visibility scope

- **Context:** § Open questions #3. Does the parent view show high-level category buckets only, or specific tags + 90-second VN explainer videos? Choices were **A** aggregate categories only, **B** specific weakness tags + VN videos (the differentiation wedge).
- **Decision:** **B** — specific weakness tags + 90-second VN explainer videos. **Phased delivery:** the structural surface (per-tag pages, video slots, copy scaffolding) ships in the v1 parent view; the per-tag video content authoring is a separate workstream that backfills into the existing slots.
- **Rationale:** The per-tag VN explainer videos are the marketing wedge — "the Vietnamese parent finally understands what their kid is learning" — and they distinguish MercyB from a generic dashboard. Phasing decouples the structural build (engineering) from the content authoring (production) so v1 can ship with structure + placeholder copy.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy at the structural level; the per-tag content is additive over time.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #3.

### Decision: L6-Q4 — Time signals

- **Context:** § Open questions #4. Does the parent view show practice-time per day? Choices were **A** show practice-time/day, **B** hide.
- **Decision:** **B** — hide practice-time. The parent view does not surface minutes/day or any time-on-task metric.
- **Rationale:** Non-negotiable #4 — outcomes over engagement. Time signals invite streak-shaming and parent pressure that conflict with the brand's positioning. The accepted cost (some parents will ask "is my kid using it?" and bounce) is preferable to publishing a metric that pushes the experience away from outcomes.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Time signals are derived data; surfacing them later is additive.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #4.

### Decision: L6-Q5 — Numeric scores

- **Context:** § Open questions #5. Does the parent view show numeric scores, qualitative bands, or both? Choices were **A** numeric (CEFR + accuracy %), **B** qualitative only, **C** numeric in expanded view, qualitative in summary.
- **Decision:** **C** — qualitative as the default surface, numeric on drill-in.
- **Rationale:** Honors both audiences: VN test-prep parents who distrust "fuzzy" reporting can drill into the numbers; diaspora parents who want a quick narrative get the qualitative summary up front. Accepts the doubled UI surface as a worthwhile cost for serving both personas without forcing a choice.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Both representations derive from the same underlying L3 aggregates; the choice is a presentation policy.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #5.

### Decision: L6-Q6 — Initial-scope audience

- **Context:** § Open questions #6. Does v1 include Persona C (teacher class-view), or parent-only? Choices were **A** Persona A+B only (defer C), **B** include Persona C in same MR, **C** A+B first; C as named-timeline follow-up.
- **Decision:** **C** — parent-first; class view as a named follow-up phase on the roadmap.
- **Rationale:** Ships a useful v1 to the parent personas without taking on the RLS + class-roster + per-student-view design surface in the same release. Naming C on the roadmap sets honest external expectations and preserves the option to negotiate teacher deals on a credible timeline.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Adding the C surface later is additive; v1's data model should not foreclose the multi-student-per-account shape.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #6.

### Decision: L6-Q7 — Pricing

- **Context:** § Open questions #7. How is the parent view priced? Choices were **A** bundle in Premium, **B** separate Family tier above Premium, **C** free 7-day preview, Premium-bundled after.
- **Decision:** **A** — bundled in Premium. Existing Premium subscribers get the parent view as part of their existing tier.
- **Rationale:** No new tier complexity (aligns with the project's "few tiers" hygiene). The price-discrimination opportunity a Family tier would represent is judged not worth the tier-count cost. Bundling also keeps the Q1 paywall-implied access model simple — one purchase grants both kid use and parent view.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Medium. Carving out into a separate tier later would require migrating existing Premium subscribers' entitlements.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #7.

### Decision: L6-Q8 — Weekly digest email

- **Context:** § Open questions #8. What cadence does the parent digest email ship at? Choices were **A** weekly opt-in, **B** monthly opt-in, **C** never (in-app only).
- **Decision:** **A** — weekly opt-in digest.
- **Rationale:** Maintains parent habit and surfaces MercyB regularly without becoming the only product surface. Opt-in respects email-consent posture; weekly cadence aligns with the natural "week's worth of practice" narrative that the digest will frame.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Cadence is an automation policy; opt-in is a per-account flag.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #8.

### Decision: L6-Q9 — L4 dependency (provisional)

- **Context:** § Open questions #9. Ship L6 first-build now on raw L3 aggregates (descriptive framing, no "Mercy helped" attribution), or wait until L4 lands so the weekly story can attribute? This is the L6 face of cross-layer X1.
- **Decision:** **A** — ship L6 first-build now on L3 aggregates with descriptive framing. Attribution claims are gated behind `// L5-PENDING`-tagged stubs that will activate once L4 + L5 land.
- **Rationale:** Same posture as cross-layer X1: don't gate L6 progress on L4/L5 cadence. Descriptive framing ("count fell 12 → 4") is honest and useful without attribution; the digest copy is designed so the future attribution sentence layers on additively.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Attribution copy is additive once the signal exists.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Cross-layer X1; `L5-pedagogy-decision-record.md` § Decisions made → Cross-layer X1.

### Decision: L6-Q10 — Mercy persona in parent view

- **Context:** § Open questions #10. Does Mercy speak to parents in the parent view? Choices were **A** Mercy speaks everywhere, **B** neutral data view, **C** Mercy in the digest email only; in-app neutral.
- **Decision:** **C** — Mercy voice in the digest email only; in-app parent view is neutral / data-dense.
- **Rationale:** Best-of-both. The digest email is a narrative surface where Mercy's warmth lands well; the in-app parent view is a working surface where parents want data over voice. Accepts the cost of maintaining two coherent voices in exchange for matching the register of each surface.
- **Decided by:** Chau
- **Decided when:** 2026-05-28
- **Reversibility:** Easy. Voice is a copy policy per surface; either side can be re-flavoured without engine changes.
- **Cross-link:** `STAGE-4-5-decision-queue.md` § Decidable now #9.

---

## What this doc is not

Not a roadmap (sequencing lives in `layer-model.md`). Not a launch
plan (marketing / pricing rollout in `STRATEGY.md` §8–9). Not the
final L6 spec — this is the **starting point** for the
implementation deep-dive when Stage 5 authoring begins.

## Cross-references

- `layer-model.md` §L6 + § Layer detail: L6 — the layer model + the
  preserved Stage 5 substance.
- `STRATEGY.md` (V3 — Competitive thesis) — Duolingo Competition
  Strategy; `study-os-stage-3.md` — Study OS Summary Boundary;
  `placement-v3.md` — Placement Writeback Boundary.
- `CLAUDE.md` non-negotiables #2 (Kids mode sacred) and #4
  (outcomes over engagement).
- `docs/architecture/systems/study-os-stage-3.md` — L3 deep-dive
  (the signal source L6 reads from).
- `docs/INDEX.md` § Cross-reference: docs by L0–L7 layer (the
  parent doc that points here).
