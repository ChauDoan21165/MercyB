# Launch — index

Single entry point for the launch documentation set. A future operator who has not been in the room should be able to open this file and find every doc needed for the **before / during / after** of a launch wave, without assembling the pieces from `git log` or `git grep`.

This file is an **index**, not a runbook. Each phase below names the operative doc; this file does not duplicate any doc's content.

---

## §1 The launch-doc set, by phase

| Phase | Doc | Time horizon |
|---|---|---|
| **Pre-launch — kit assembly** | [`stage-3-content-kit/README.md`](./stage-3-content-kit/README.md) + the per-platform files in the same directory + [`landing-page-variants.md`](./landing-page-variants.md) | Weeks to months before launch |
| **Pre-launch — variant + measurement framework** | [`stage-3-content-kit/ab-variants.md`](./stage-3-content-kit/ab-variants.md) + [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md) + [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) | Set up once; referenced throughout |
| **Morning-of launch — checklist** | [`prelaunch-checklist.md`](./prelaunch-checklist.md) | Hour −1 to hour 0 |
| **During-launch — operating procedure** | [`launch-window-operations.md`](./launch-window-operations.md) | Hour 0 to hour +72 |
| **First-week reads — what to measure** | [`first-week-metrics-spec.md`](./first-week-metrics-spec.md) | Day 1 to day 7 |
| **Post-week-1 — retrospective template** | [`week-1-retrospective.md`](./week-1-retrospective.md) | Day 7+ (filled into `reports/launch-week-1-YYYY-MM-DD.md`) |

Operator opens the docs **in the order above** for any given launch wave.

---

## §2 Operator workflow — which doc, when

A linear walkthrough. The operator (Chau today) consults the doc named in each row at the time-stamp on its left.

| Time | Doc to open | What the operator does there |
|---|---|---|
| Pre-launch (weeks before) | `stage-3-content-kit/*` + `landing-page-variants.md` | Assemble the posts, the captions, the variant pairs, the landing-copy options. |
| Pre-launch (weeks before) | `stage-3-content-kit/measurement-plan.md` + `decision-criteria.md` | Internalize the privacy posture + the per-platform thresholds + the "settled" rule. |
| Pre-launch (weeks before) | `stage-3-content-kit/faq.md` | Verify the bilingual FAQ answers are current (verified against shipped code on `main`). |
| Hour −1 | `prelaunch-checklist.md` | Run §0–§5 phases. If any abort criterion trips, delay launch. |
| Hour 0 | `launch-window-operations.md` §1–§2 | Pin tabs, post the first post, watch hour 0 actively. |
| Hour +4 → +24 | `launch-window-operations.md` §4 | Light monitoring; per-channel cadence; sleep-allowance rule. |
| Hour +24 → +72 | `launch-window-operations.md` §6–§7 | Day-1 close review; passive monitoring; variant decisions remain too early. |
| Day 1 / Day 3 / Day 4 / Day 7 | `first-week-metrics-spec.md` §4 | Per-day read cadence; log to private spreadsheet. |
| Day 7+ | Copy `week-1-retrospective.md` → `reports/launch-week-1-YYYY-MM-DD.md` → fill | Retro; name one specific change for week 2; defer three to week 4+. |
| Day 14 (Facebook / Zalo variants) | `first-week-metrics-spec.md` §6 + `decision-criteria.md` per platform | Conclude FB / Zalo variant decisions (cannot be concluded earlier). |

Anytime during the launch window, if a regression or crisis surfaces:

| Trigger | Doc to open |
|---|---|
| Deploy regression suspected | `launch-window-operations.md` §5 + `prelaunch-checklist.md` §5.2 (rollback commands) |
| Hosting / DB / DNS / provider outage | [`../runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) (per-provider §2.x) |
| Crisis-content comment received | `launch-window-operations.md` §3 (fixed VI + EN safe response) |
| Active-brand-damage variant landed | `launch-window-operations.md` §5.1 + `decision-criteria.md` §"What to do mid-test if a variant is *obviously* failing" |

---

## §3 Privacy boundary — load-bearing across every doc

Every doc in this set honors the privacy posture asserted in [`stage-3-content-kit/measurement-plan.md`](./stage-3-content-kit/measurement-plan.md):

- **No third-party tracking pixels** on launch surfaces.
- **No per-user attribution chain** from post → click → signup → behavior.
- **No PII** in any operator spreadsheet — coded initials + paraphrases only.
- **No `mb.marketing.*` localStorage namespace**.
- **No custom Sentry events for marketing**.
- **Marketing-consent gate** (per [[project_marketing_consent_is_tracking]]) honored on the device side; the gate matters because the underlying tracking exists per the consent-gated GA4/Pixel/Clarity surfaces *outside* the launch scope — within the launch scope, the cleanest honor is *not to install tracking in the first place*.

If a future launch proposal violates any of the above, route it through `measurement-plan.md` first. The privacy stance is the load-bearing wall; the launch ops are the rooms built around it.

---

## §4 What this set is NOT

| Not in scope | Where it lives instead |
|---|---|
| Architecture / system docs | `docs/architecture/` + `docs/architecture/systems/` |
| Disaster-recovery runbook (provider-outage playbook) | [`../runbooks/disaster-recovery.md`](../runbooks/disaster-recovery.md) |
| Application-rollback runbook (code-level incidents) | `.github/workflows/ROLLBACK.md` per `disaster-recovery.md` prelude |
| Email system / unsubscribe gate | `CLAUDE.md` "Email system" — still being built; no marketing email during launches until shipped |
| Paid-amplification playbook | Does not exist; this kit is organic-only |
| Native app store (Apple / Google) launch | [[feedback_native_work_phasing]] — web-only today; native launches need their own runbook |
| Onboarding flow for the first 100 users | Onboarding doc set under `docs/onboarding/` |
| Kids-mode launch | Kids mode is governed by `CLAUDE.md` non-negotiable #2; the marketing landing is adult-learner only |
| Mid-week variant-test cadence beyond day 14 | [`stage-3-content-kit/decision-criteria.md`](./stage-3-content-kit/decision-criteria.md) §Cadence — covers weeks 1–6+; no separate "week-4 retro" doc has been written yet |
| Long-form post-launch reporting | The reports live under `reports/launch-week-1-YYYY-MM-DD.md` (filled from the retro template); a long-form report is a separate writeup if needed |

---

## §5 Authoring notes for the next launch wave's docs

The Stage 3 launch is the first launch the doc set was assembled for. Future launches (Stage 4, etc.) should:

- **Fork the existing docs into a `stage-N-` prefix** if the launch is fundamentally different (different audience, different platform mix). Small differences = patch the existing docs; large differences = a parallel set.
- **NOT renumber the section headers** of any existing doc — readers' references break.
- **Update this index file** to add the new launch's entry-point doc.
- **Run a week-1 retro from the existing template** even for a small launch; the discipline matters more than the launch's size.
- **Treat the index file (this file) as the spine** — keep its §1 table current.

---

## §6 Bilingual posture — operator-facing vs. user-facing

| Surface | Language posture |
|---|---|
| All docs in this set | EN only — operator-facing; the operator (Chau) is comfortable in both EN and VI |
| User-facing copy referenced by the docs (captions, landing copy, FAQ) | VI-primary, EN-secondary, per `docs/copy/vi-style-guide.md` and the bilingual-pairing rule |
| Operator's replies on platforms | VI for VN-resident audiences; EN for diaspora-EN audiences; bilingual where the post itself was bilingual (per `launch-window-operations.md` §2.2) |
| Operator scratch sheet | EN — internal note-taking; not user-facing |
| Crisis-response template | VI primary + EN mirror — both present in `launch-window-operations.md` §3.1; the operator picks the one matching the commenter's language |
| Retro doc (filled report) | EN — operator-facing |

The VI / EN parity invariant lives in the *content* the launch publishes, not in the operator's internal docs. The operator docs are EN because the operator is one person who reads EN faster.

---

## §7 Memory anchors used across this doc set

These memory entries are referenced across the launch docs. They are stable enough that the doc set assumes them:

- `[[project_sentry_infra_access]]` — Sentry org `chau-doan`, project `mercyblade-web`, region `us.sentry.io`; token in Keychain `mb-sentry-auth-token`; RLS alert IDs `17072095` / `17072096`.
- `[[project_marketing_consent_is_tracking]]` — `setMarketingConsent` gates Pixel/GA4/UTM (localStorage, per-device), NOT email; the source of the launch's "no tracking installed in the launch surface" stance.
- `[[project_sending_address]]` — `admin@mercyblade.com` for all routing.
- `[[project_marketing_landing_decisions]]` — no fabricated testimonials; canonical brand line; launch with no testimonials section.
- `[[project_android_urls]]` — Android `com.mercyapps.mercyblade` locked-divergent from iOS `com.chaudoan.mercyblade`; never align.
- `[[feedback_native_work_phasing]]` — web-only today; defer native PR work to ~2–4 weeks pre-submission.

---

## §8 What gets updated after each launch wave

After every launch wave's week-1 retro completes:

1. **The retro itself** lands in `reports/launch-week-1-YYYY-MM-DD.md` (not in this `docs/launch/` directory).
2. **Doc amendments suggested by the retro's §8 process-notes section** become **follow-up MRs**, one MR per amended doc. Each amendment waits one week of post-retro reflection before shipping; hot-fix amendments bias toward over-correction.
3. **This index file** updates only if a new doc enters the set (e.g. a `week-4-retrospective.md` template is added after the first wave proves the day-14 / day-30 read cadence).
4. **`stage-3-content-kit/`** updates only if the kit's invariants (no outcome promises, VI clears shame regex, bilingual pairing) need re-statement.

The doc set is a **living set**, not a frozen one. It absorbs lessons; it does not rewrite itself after every wave.

---

**End of launch index.** Next planned wave: Stage 3. Next planned doc-set update: post-Stage-3 week-1 retro.
