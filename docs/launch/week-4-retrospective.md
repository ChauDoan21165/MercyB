# Week-4 retrospective — Stage 3 launch (TEMPLATE)

Fillable template for the **week-4 retro** — the next milestone after [`week-1-retrospective.md`](./week-1-retrospective.md). Its job is to land the three decisions that the week-1 retro explicitly deferred (per [`week-1-retrospective.md`](./week-1-retrospective.md) §7) and to surface any new decisions that emerged in weeks 2–4.

Operator copies this template to `reports/launch-week-4-YYYY-MM-DD.md` and fills it. The template itself is never filled in-place.

> **Hard rule.** Fill at week 4, not earlier. Even if a decision *seems* ready at week 2 or week 3, **premature decisions are reversed twice as often** as decisions made at their scheduled read-date. The deferral calendar is part of the discipline — early reads under-bake; late reads slip into "later" forever. Week 4 is the contract.

> **What this template is NOT.** Not a "week-1 retro do-over." If a week-1 decision was made and shipped, it stays made; this retro does not relitigate it. The scope here is **the three week-1 deferrals + new week-2-through-4 decisions only**.

Pairs with [`prelaunch-checklist.md`](./prelaunch-checklist.md), [`launch-window-operations.md`](./launch-window-operations.md), [`day-1-close-review.md`](./day-1-close-review.md), [`first-week-metrics-spec.md`](./first-week-metrics-spec.md), and [`week-1-retrospective.md`](./week-1-retrospective.md).

---

## §0 Header

| Field | Value |
|---|---|
| Retro author | ______________________ |
| Date filled (calendar) | ______________________ |
| Weeks since launch (should be ≥ 4) | ______________________ |
| Linked week-1 retro filename (`reports/launch-week-1-YYYY-MM-DD.md`) | ______________________ |
| Source spreadsheet link (operator-only, NOT in repo) | ______________________ |

---

## §1 Week-1 deferrals — landed at week 4

The three decisions the week-1 retro `§7` deferred. Each section's *title* is verbatim from [`week-1-retrospective.md`](./week-1-retrospective.md) §7 "Common deferral patterns." If the actual week-1 retro deferred a different decision, rename the section to match what was deferred — the slot stays.

### §1.1 "Should we ship Variant C of the landing page?"

**Context** — week-1 retro deferred this because the platform A/B variant reads (TikTok day-7, Facebook day-14, Zalo day-14 per [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md)) had not yet settled, and the landing-copy variant decision per [`landing-page-variants.md`](./landing-page-variants.md) is downstream of those reads. By week 4, all three platform windows have closed.

**Decision:** ☐ Ship Variant C ☐ Stay on Variant A ☐ Defer to month 3 (with reason)

**Rationale (1–3 sentences; reference which platform reads tipped the call):**

> ______________________________________________________________________
> ______________________________________________________________________

**If "Ship Variant C":** name the follow-up MR (source-revision PR per [`landing-page-variants.md`](./landing-page-variants.md) §"Source revision implementation notes") and the owner.

> ______________________________________________________________________

### §1.2 "Should we install Plausible?"

**Context** — week-1 retro deferred this because the week-1 site-side reads (per [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §2.2) needed to come up short before a measurement-tooling install was even askable. By week 4, the Netlify-Analytics-vs-Plausible gap is observable: did the operator hit "I needed data I couldn't get" repeatedly across the 4 weeks?

**Decision:** ☐ Install Plausible under marketing-consent gate ☐ Stay on Netlify Analytics + edge logs ☐ Defer to month 3 (with reason)

**Rationale (1–3 sentences; reference specific data-gaps observed in weeks 1–4):**

> ______________________________________________________________________
> ______________________________________________________________________

**If "Install Plausible":** confirm scope is **marketing landing pages only** (`/` + `/weak-at`); AI Tutor / Kids / account / billing are EXPLICITLY EXCLUDED per [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) §5. Name the install MR.

> ______________________________________________________________________

### §1.3 "Should we send a follow-up email?"

**Context** — week-1 retro deferred this because email is gated on the unsubscribe system shipping (per `CLAUDE.md` "Email system — Unsubscribe system is still being built"). By week 4, either the unsubscribe-and-footer infrastructure has shipped or it has not.

**Decision:** ☐ Send follow-up email ☐ Do not send (unsubscribe system still unshipped) ☐ Send a transactional-only message that bypasses the marketing-email pathway entirely (name it specifically)

**Rationale (1–3 sentences; cite the unsubscribe system's current shipped state):**

> ______________________________________________________________________
> ______________________________________________________________________

**If "Send follow-up email":** confirm prerequisites — `email_unsubscribes` table exists, footer unsubscribe link in template, `email_campaigns` row created, audience query verified against `profiles` cohort, `[[project_sending_address]]` honored (use `admin@mercyblade.com`, not `hello@`). Name the campaign MR and the edge function invocation.

> ______________________________________________________________________

---

## §2 New decisions surfaced in weeks 2–4

Decisions that did NOT exist at week-1 retro time and emerged from the day-7-through-day-28 operating data. Fillable; no preset count — fewer is more honest than padding.

For each new decision, name:
- **The decision** (what's being decided)
- **What surfaced it** (the specific signal in weeks 2–4 that made the decision necessary)
- **Decision:** the actual call
- **Rationale:** 1–3 sentences

### §2.1

> **Decision:** ______________________________________________________________________
>
> **What surfaced it:** ______________________________________________________________________
>
> **Decision:** ______________________________________________________________________
>
> **Rationale:** ______________________________________________________________________

### §2.2

> **Decision:** ______________________________________________________________________
>
> **What surfaced it:** ______________________________________________________________________
>
> **Decision:** ______________________________________________________________________
>
> **Rationale:** ______________________________________________________________________

(Add more sub-sections only if necessary. If there are no new decisions to record, tick: ☐ **No new decisions surfaced in weeks 2–4.** That is a valid outcome.)

---

## §3 Carry-forward to month 3+

Decisions surfaced (or re-surfaced) in weeks 2–4 that **still** can't be made at week 4 and need to wait longer. Same discipline as the week-1 §7 deferrals — name them explicitly so they don't drift into week 5 by default.

| # | Decision | Why month-3+ | Earliest legal read |
|---|---|---|---|
| 1 | ______________________ | ______________________ | ______________________ |
| 2 | ______________________ | ______________________ | ______________________ |
| 3 | ______________________ | ______________________ | ______________________ |

**Common deferral patterns at week 4** (delete if not relevant):

- **"Should we open a Stage 4 launch wave?"** — needs the Stage 3 §15 Bar #7 testimonial gate context first (a named Vietnamese learner publicly credits MercyBlade for an outcome); §15 closure is months-scale, not weeks.
- **"Should we add a second platform (YouTube Shorts, Instagram Reels)?"** — needs Stage 3's three platforms (TikTok / Facebook / Zalo) to be "settled" per [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) §"What 'settled' means" — typically week 6–8.
- **"Should we add a paid-amplification budget?"** — out of scope at any week-4 read; organic-only per [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md). A change of stance is a separate strategy decision, not a launch-retro decision.
- **"Should we re-audit the bilingual landing copy?"** — only if the Variant C decision in §1.1 produced ambiguous platform reads; otherwise stays settled.

---

## §4 Anti-checklist — what this week-4 retro deliberately does NOT do

Consistent with [`week-1-retrospective.md`](./week-1-retrospective.md) §10 and [`day-1-close-review.md`](./day-1-close-review.md) §9, scaled to week-4 horizon.

| Not done | Why |
|---|---|
| Relitigate week-1 decisions that were made and shipped | Scope here is the three week-1 deferrals + new week-2–4 decisions only; a remade week-1 decision is reversal cost without new information |
| Forecast week-8 outcomes | Same outcome-promises rule as week-1 §10 — record, do not predict |
| Conclude Stage 4 readiness | §15 Bar #7 testimonial gate is months-scale; week-4 retro is not the gating retro |
| Add a multi-week amendment plan to the launch doc set | Per [`launch-readme.md`](./launch-readme.md) §8 — amendments wait one week of post-retro reflection; hot-fix-style amendments bias toward over-correction at every horizon |
| Per-user retention / attribution analysis | No per-user chain exists; [[project_marketing_consent_is_tracking]] privacy posture intact |
| Loop in a committee | Decision-rights per [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) = Chau alone at every horizon |
| Cite paid-amplification thresholds | Organic-only per `measurement-plan.md` |
| Auto-archive launch posts that are still drawing traffic | Archive decisions belong in a separate dispatch; the retro records what's drawing traffic, not what to remove |
| Decide a follow-up launch wave's content kit | A new launch wave is a separate dispatch — see [`launch-readme.md`](./launch-readme.md) §5 "Authoring notes for the next launch wave's docs" |

---

## §5 Sign-off

| Field | Value |
|---|---|
| §1 all three deferrals decided OR explicitly re-deferred to month 3 with reason | ☐ |
| §2 new decisions documented OR explicit "no new decisions" tick | ☐ |
| §3 carry-forward items tied to a calendar earliest-read date | ☐ |
| Retro saved to `reports/launch-week-4-YYYY-MM-DD.md` (NOT this template file) | ☐ |
| Calendar slot scheduled for month-3 retro IF §3 entries exist | ☐ |

**Retro author signature (just type your name):** ______________________

---

## §A References

- [`week-1-retrospective.md`](./week-1-retrospective.md) §7 — the three deferrals this retro lands.
- [`day-1-close-review.md`](./day-1-close-review.md) §7 — the day-1-deferred-to-week-1 chain that ends here.
- [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) §2.2 + §6 — the data sources whose 4-week trajectory informs §1.2.
- [`launch-window-operations.md`](./launch-window-operations.md) — the during-window doc whose anti-pattern lessons may surface §2 new decisions.
- [`launch-readme.md`](./launch-readme.md) §8 — the "amendments wait one week of post-retro reflection" rule §4 enforces.
- [`landing-page-variants.md`](./landing-page-variants.md) §"Source revision implementation notes" — the source-revision PR §1.1 ships if "Ship Variant C."
- [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) — variant-test thresholds + "settled" definition cited in §3.
- [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) §5 — Plausible install constraints (marketing landing pages only) cited in §1.2.
- `[[project_sending_address]]` — `admin@mercyblade.com` for §1.3.
- `[[project_marketing_consent_is_tracking]]` — privacy posture honored across every section.

---

**End of week-4 retrospective template.** Each filled retro becomes `reports/launch-week-4-YYYY-MM-DD.md`. The template itself is never filled in-place — copy first, then fill.
