# Stage 4 / 5 — Consolidated Decision Queue

> **Purpose:** every decision blocking Stage 4 / 5 build, in one
> place. Chau reads ONE doc, makes the decidable-now calls in one
> sitting. Research-blocked items flagged as not-yet-actionable.
>
> **Sources:** !131 (L4), !126 + this MR's L5 backfill, !122 (L6).
> **Not a decision-maker.** No answer pre-filled.

---

## Snapshot — what Chau can do in one sitting

| Category | Count |
|---|---|
| **Decidable now (Chau A/B/C or YES/NO tonight)** | **18** |
| **Cross-layer (one decision unblocks multiple)** | **3** |
| **Research-blocked (needs data / pedagogy / product call)** | **11** |

The **18 decidable-now** entries are the load-bearing output —
Chau can make every one of them in one sitting without needing
data we don't have. The 3 cross-layer items have outsized leverage:
answering them clears multiple downstream blockers. The 11
research-blocked items are listed for visibility; they need
data / lit / product input first.

---

## Decidable now

> Every entry: Chau picks A / B / C (or YES / NO), and the
> downstream layer build can proceed. No data we don't have.
>
> Each entry below lists a **one-line consequence per option** so
> the choice can be made in seconds. Consequences describe what
> shipping that option means for the learner / app — they are
> *not* recommendations. Chau decides. (Drafted, not decided.)

### From L6 (!122) — Parent / Teacher / Family

1. **L6-Q1 Access model.** **A** Kid-initiated invite. **B** Paywall-implied. → !122 #1.
   - **A consequence:** Parents only see kids who explicitly invite them; honors kid agency, lower conversion on the parent-pay path.
   - **B consequence:** Parent subscription auto-grants parent view (payment IS access); faster conversion, weaker kid-agency story, leans surveillance-y.
2. **L6-Q2 Parent view default language.** **A** VI-primary. **B** Follow `lessonUiLang`. **C** Detect from signup; default A. → !122 #2.
   - **A consequence:** Parents always read VI first regardless of kid's UI; clearest for VN parents, mismatches bilingual families.
   - **B consequence:** Parent view follows the kid's `lessonUiLang` live; risks parent seeing a language they can't read if the kid toggled.
   - **C consequence:** One-time detection at signup defaults to A; drift-resistant; requires a settings override surface to design.
3. **L6-Q3 Visibility scope.** **A** Category buckets only. **B** Tags + 90-sec VN explainer videos (the wedge). → !122 #3.
   - **A consequence:** Parent sees only high-level buckets (grammar / pronunciation / etc.); ships fastest; weak pitch — "what is this actually telling me?"
   - **B consequence:** Per-tag VN explainer videos turn the parent page into the marketing wedge ("VN parent finally understands"); large content-authoring + per-tag video pipeline to maintain.
4. **L6-Q4 Time signals.** **A** Show practice-time/day. **B** Hide. → !122 #4.
   - **A consequence:** Minutes/day visible to parents; risks streak-shaming + parent pressure; directly conflicts with non-negotiable #4 (outcomes over engagement).
   - **B consequence:** Time hidden; honors the outcomes-not-engagement principle; some parents will ask "is my kid even using it?" and churn.
5. **L6-Q5 Numeric scores.** **A** Numeric. **B** Qualitative only. **C** Numeric in expanded, qualitative in summary. → !122 #5.
   - **A consequence:** Hard percentages / counts; easy parent comparison; risks reductive "is my kid in the top X%?" narrative.
   - **B consequence:** Qualitative bands ("improving", "needs practice") only; kinder framing; VN test-prep parents may distrust "fuzzy" reporting.
   - **C consequence:** Qualitative summary card + drill-down to numbers; honors both audiences; doubles the parent-view UI surface to design + maintain.
6. **L6-Q6 Initial-scope audience.** **A** Persona A+B only. **B** Include Persona C class-view. **C** A+B first; C as named-timeline follow-up. → !122 #6.
   - **A consequence:** Parent-only v1; smaller surface, faster MVP; teacher / institutional market deferred indefinitely.
   - **B consequence:** Class-view at v1; bigger initial design + RLS surface; opens teacher / school sales sooner.
   - **C consequence:** A+B v1 with C named on the roadmap; honest pacing for both audiences; harder to negotiate teacher deals before C ships.
7. **L6-Q7 Pricing.** **A** Bundle in Premium. **B** Separate Family tier. **C** Free 7-day preview, Premium-bundled after. → !122 #7.
   - **A consequence:** Existing Premium gets parent view "free"; zero new tier complexity; loses the price-discrimination lever family customers represent.
   - **B consequence:** Separate Family tier captures parent willingness-to-pay; multiplies tier complexity, weakens the "few tiers" hygiene.
   - **C consequence:** 7-day preview then bundled into Premium; converts curious parents who'd never sign up cold; preview expiry creates a wall-hit moment that can churn the parent.
8. **L6-Q8 Weekly digest email.** **A** Weekly opt-in. **B** Monthly. **C** Never. → !122 #8.
   - **A consequence:** Weekly digest reinforces parent habit; large copy + automation surface; risks generic "you're not using it" tone if signals are weak.
   - **B consequence:** Monthly cadence is less spammy; weaker product surface — parent forgets MercyB exists between emails.
   - **C consequence:** No digest; parent must open the app; lowest noise, highest parent-side churn risk.
9. **L6-Q10 Mercy persona in parent view.** **A** Mercy speaks. **B** Neutral data. **C** Mercy in digest only; in-app neutral. → !122 #10.
   - **A consequence:** Mercy voice everywhere; consistent character story; risks parents feeling lectured by what they read as a kid-targeted persona.
   - **B consequence:** Neutral data voice respects parents as a professional audience; loses the brand-defining warmth that distinguishes MercyB from a dashboard.
   - **C consequence:** Mercy in email (warm hook), neutral in-app (data-dense); best-of-both; two voices to keep coherently styled.

### From L4 (!131) — Diagnostic Intervention

10. **L4-Q1 Rule storage.** **A** Hard-coded TS rule table. **B** JSON in `public/data/`. **C** Supabase table + admin surface. → !131 #1.
    - **A consequence:** Rules live in code; type-safe + deploy-gated; non-engineer rule authors are blocked from touching them.
    - **B consequence:** JSON in `public/data/`; pedagogy team can edit + push without code; rule changes still require a full deploy; bundle grows.
    - **C consequence:** Supabase + admin UI; rule edits are live with no deploy; biggest infra build (table + RLS + admin surface); opens authoring to non-engineers.
11. **L4-Q4 Re-suggestion after dismiss.** **A** Never re-surface. **B** Re-evaluate next session. (Option C "L5 per-rule" → X2.) → !131 #4.
    - **A consequence:** Dismiss is permanent kill; strong learner-agency signal; risk: learner dismisses a critical rule by accident and never sees it again.
    - **B consequence:** Dismissed rules reappear if still relevant next session; recovers from accidental dismiss; risks reading as naggy.
12. **L4-Q5 Attribution surface (eng shape).** **A** L4 emits the `reason` string verbatim. **B** L4 emits structured reason; consumer composes. (Option C "L5-authored content" → X2.) → !131 #5.
    - **A consequence:** L4 owns the rendered copy; one source of truth; copy changes ship as L4 changes; consumers render dumbly.
    - **B consequence:** L4 emits id + params; each consumer localizes / restyles independently; flexible across surfaces; risks divergent rendering across consumers.
13. **L4-Q6 L1 tag vs placement conflict.** **A** L1 recent wins (live > stale). **B** Placement wins until next run. **C** Both fire; consumer arbitrates. → !131 #6.
    - **A consequence:** Fresh L1 evidence overrides placement; respects current learner state; weakens the placement-test commitment.
    - **B consequence:** Placement honored until re-tested; predictable learner experience; ignores fresh evidence between tests.
    - **C consequence:** Both signals fire and the consumer decides; flexible; bug surface — different consumers will arbitrate differently and learners get inconsistent advice.
14. **L4-Q7 Frequency cap.** **A** ≤1/session. **B** ≤1/surface. **C** No cap; rule TTLs handle. → !131 #7.
    - **A consequence:** At most one intervention per session anywhere; gentle; a learner with three active issues sees only one of them.
    - **B consequence:** One per surface (room / dashboard / etc.); more interventions overall; risks crowding multiple cards.
    - **C consequence:** No cap; TTLs alone control reappearance; clean in theory; entirely dependent on per-rule TTL tuning being right.
15. **L4-Q8 First rule's domain.** **A** VN L1 past-tense marker. **B** Pronunciation final-consonant-cluster. **C** Topic-comment fronting. → !131 #8.
    - **A consequence:** Past-tense marker (`đã`); high-frequency VN-L1 error; strongest "Vietnamese-first" demo on a text-only signal — easy to detect, cheap to ship.
    - **B consequence:** Final-consonant cluster pronunciation; audio-heavy signal; demands a mature Stage 3A pronunciation adapter; visceral demo but the hardest infra path.
    - **C consequence:** Topic-comment fronting; subtler syntactic error, smaller affected population; sophisticated demo on a low-frequency surface.
16. **L4-Q9 Read-loop posture.** **A** Synchronously on read. **B** On signal-change (ring-buffer write hook). **C** Periodic debounce. → !131 #9.
    - **A consequence:** Rules evaluate live on every read; freshest possible data; runtime cost on every read path.
    - **B consequence:** Re-evaluate only when signals change; cheap; risks stale UI if a signal-change hook misses an edge.
    - **C consequence:** Periodic debounce; predictable load; introduces latency between a signal firing and the intervention surfacing.
17. **L4-Q10 L5 prerequisite gate (meta).** **A** Ship L4 scope-1 with hard-coded defaults for L5-blocked Qs. **B** Block until L5 ratifies Q2+Q3 minimum. → !131 #10. **See X1 below.**
    - **A consequence:** L4 ships now with stub thresholds; L5 ratifies later by tuning constants; risk: ship-first defaults harden into de facto pedagogy.
    - **B consequence:** L4 blocks on L5; correct sequencing; pushes the demo-able L4 surface back weeks.

---

## Cross-layer

> Single decisions whose answers cascade across multiple layers.
> Outsized leverage — answer one of these and several downstream
> blockers go away.

### X1. Ship L4 / L6 before L5 lands, or block on L5?

Two related questions, same shape:

- **L4-Q10 (above):** ship L4 scope-1 with hard-coded defaults for
  the L5-blocked entries, or block L4 until L5 ratifies them.
- **L6-Q9 (L6 doc !122 §Open Q #9):** ship L6 first-build on raw
  L3 aggregates framed descriptively ("count fell 12 → 4"), or
  wait for L4 so the weekly story can attribute ("Mercy helped").

These two are not the same question, but the answer pattern is
analogous: either ship-now-with-fallback (A) or block-on-upstream
(B). Picking the same letter for both gives MercyB an internally
consistent posture; picking different letters is the harder
honest answer when L4 and L6 are at different readiness.

- **A consequence (both ship now with fallback):** Demo-able L4 + L6 surfaces ship in days/weeks; L5 ratifies or overrides later; consistent ship-first posture; risk that stub defaults harden across both layers.
- **B consequence (both block on L5):** Nothing ships until L5 lands; correct sequencing; demo + revenue gated entirely on L5 readiness.
- **Mixed consequence (one ships, one blocks):** Ship the more-ready layer, block the less-ready one; pragmatic for actual layer state; introduces a temporary policy split between L4 and L6 to communicate.

→ Cross-links: !131 #10, !122 #9.

### X2. "Per-rule" overrides — does L5 author per-rule policy?

Two L4 questions whose Option C explicitly hands off to L5
content / policy:

- **L4-Q4-C** Re-suggestion after dismiss: "Per-suggestion override
  (some sticky, some not) — L5 decides per-rule."
- **L4-Q5-C** Attribution surface: "Reason string is L5-authored
  content; L4 selects the id."

If Chau decides L5 owns per-rule policy across L4 (i.e. *yes,
L5 holds a rule-by-rule library that overrides L4 defaults*),
then both L4-Q4 and L4-Q5 collapse to the C variant and a new
L5 deferred decision needs to capture "rule-library shape."
If Chau decides L5 does NOT own per-rule policy, then L4-Q4 and
L4-Q5 pick A or B independently.

- **YES consequence (L5 owns per-rule policy):** L5 holds a rule-library that overrides L4 defaults; richer per-rule pedagogy; spawns a new L5 deferred decision ("rule-library shape") that must be answered; L4 collapses to a thin executor.
- **NO consequence (L4 owns its own defaults):** L4 ships with its own defaults; faster L4 path; per-rule pedagogy granularity is lost; L5 holds only meta / threshold policy.

→ Cross-links: !131 #4, !131 #5, !126 § Decisions deferred.

### X3. Threshold convergence — one number or two?

The threshold question shows up in two places:

- **L4 intervention threshold** (L5 deferred decision, backfilled
  this MR from !131 Q2): when has a signal fired enough to
  *intervene*?
- **L6 weakness-count significance** (L5 deferred decision from
  !122): when is a count fall *significant enough to mention* to
  a parent?

These could be a single threshold (one number serves both:
"significant = act on it AND report on it") or two (L4 acts
on weaker evidence than L6 reports on; e.g. L4 nudges at 3,
L6 reports at 5). The decision is whether L5's
"significance threshold" is unitary or split.

- **ONE-number consequence:** One "significance" constant serves both L4 and L6; simpler mental model + tuning surface; either L4 over-intervenes (if set at L6's bar) or L6 under-reports (if set at L4's bar).
- **TWO-number consequence:** L4 acts on weaker evidence than L6 reports on (e.g. nudge at 3, report at 5); honors that "act on" and "tell the parent about" have legitimately different bars; doubles the threshold-tuning + documentation surface.

→ Cross-links: !126 § Decisions deferred §"Weakness-count
significance threshold" and §"L4 intervention threshold defaults".

---

## Research-blocked

> Listed for visibility; not actionable tonight. Each needs data,
> pedagogy literature, or a product-tradeoff call before Chau (or
> a pedagogy adviser) can commit. They live as `[PENDING]` entries
> in `docs/architecture/L5-pedagogy-decision-record.md` until the
> input arrives.

### L5 deferred decisions (6 total, all `[PENDING]`)

- **Weakness-count significance threshold** — when is a flagged
  pattern *significant* enough to surface? → !126 §Decisions
  deferred.
- **Pattern sequencing strategy** — remediation-first vs
  coverage-first vs learner-controlled mix? → !126 §Decisions
  deferred.
- **Pattern mastery definition** — when is a pattern "done"? →
  !126 §Decisions deferred.
- **L4 intervention threshold defaults** *(backfilled this MR)*
  — when has a signal fired enough to intervene? → !126
  §Decisions deferred (new entry).
- **L4 suggestion lifetime / TTL** *(backfilled this MR)* —
  default 7 days proposed; L5 ratifies. → !126 §Decisions
  deferred (new entry).
- **L4 attribution rationale content authorship** *(backfilled
  this MR)* — who writes the VI/EN reason strings? → !126
  §Decisions deferred (new entry).

### L5 open questions blocking L5 design (5)

These are the questions whose answers unblock the deferred
decisions above:

- **Success metric for "good planning."** Competency-on-target by
  week N? Engagement minutes? Self-reported understanding? →
  !126 §Open questions.
- **"Well-planned week" structure** for a Vietnamese
  intermediate-English learner. → !126 §Open questions.
- **Remediation vs coverage weighting** — the answer constrains
  sequencing strategy + mastery definition. → !126 §Open
  questions.
- **Motivation pacing signal set (local-only)** — which Stage 3A
  buffer signals constitute a usable frustration proxy without
  breaching the surveillance ban? → !126 §Open questions.
- **Pedagogy adviser scope** — Chau-sole or external adviser? →
  !126 §Open questions.

---

## How to use this queue

1. **Decidable-now first** (18 entries). Pick A/B/C per entry; write the choice into the source layer doc's §Open questions section (or a follow-up MR).
2. **Cross-layer next** (3 entries) — each clears multiple downstream blockers.
3. **Don't pre-fill Research-blocked** — `[PENDING]` is honest until data / pedagogy input arrives (per !126 protocol rule #4).
4. **Decided entries** follow !126's decision-record protocol — never edit past decisions; revisions supersede; cross-link from code.

---

## Cross-references

- `docs/architecture/L4-diagnostic-intervention-layer.md` (!131) — L4 design; source of 10 entries.
- `docs/architecture/L5-pedagogy-decision-record.md` (!126 + this MR's backfill) — source of 11 entries (6 deferred + 5 open).
- `docs/architecture/L6-parent-teacher-family-layer.md` (!122) — L6 design; source of 10 entries.
- `ROADMAP.md` §L4 / §L5 / §L6 — canonical layer model.
- `docs/INDEX.md` § Cross-reference: docs by L0–L7 layer — parent doc that flagged this gap.
