# STRATEGY drift audit — post-2026-05-19 wave (A3c)

> Agent: A3c · Branch: `docs/strategy-drift-audit` · Date: 2026-05-19
> Labels: docs, strategy, drift-audit, READ-ONLY
> Trigger: PRINCIPLES §9 (status docs drift) + 216 commits to `main` since STRATEGY v3.0 (2026-05-17, commit `005b060e2`).
> Scope: `STRATEGY.md` only. PRINCIPLES.md is rules, not status; not audited here.
>
> **This file does NOT edit STRATEGY.md.** Per PRINCIPLES §14, strategy is Chau's — Claude surfaces drift, Chau decides whether to land it. The proposed §6 and §7 rewrites below are diffs-as-text Chau can apply (or reject) in one pass.

## Verdict — is v3.1 warranted now?

**Recommend: tag a v3.1 update of `STRATEGY.md` covering §6 + §7 only.** §6 is the section the document itself says ("Update This Section Regularly") to refresh every 1-2 weeks, and it is now 2 days stale across multiple specific lines (lesson totals are still right, but schema-generalization framing and roadmap progress are not). §7 has one cell whose stated % is no longer defensible. The rest of the doc (§1-5, §8-15) shows zero strategic drift in the audited window — leave it.

Concrete proposal in §B and §C below; minimal-touch rewrite that does not re-relitigate §4 (the matrix) or §11 (the moat).

---

## §A. Section-by-section read of STRATEGY.md

For each section, the answer to "is this still true on 2026-05-19?" with citations.

| Section | Lines | Verdict | Evidence |
|---|---|---|---|
| §1 Mission | 12-21 | **Unchanged.** | Nothing shipped contradicts "matrix product, outcomes over engagement". |
| §2 Who Chau Is | 24-32 | **Unchanged.** | Personal-context section; not status-driven. |
| §3 Positioning | 36-44 | **Unchanged.** | Per-pair positioning frame holds. |
| §4 The Learning-Pair Matrix | 48-72 | **Unchanged.** | No re-surfacing/un-surfacing PR touched language tracks in the audit window. `LanguageSwitcher`, `/languages` index, per-language pages all live on `origin/main`. PR #675 (bilingual VI-first landing) actively reinforces the matrix. |
| §5 Product Strategy | 75-95 | **Unchanged.** | No PR contradicted the "what we win on" / "what we don't do" list. |
| **§6 Current State** | **98-126** | **STALE — needs §B rewrite.** | Detailed per-line evidence below. |
| **§7 Roadmap** | **129-150** | **One cell stale — see §C.** | Step 8 % and Step 9 status no longer accurate. |
| §8 Business Model | 154-179 | **Unchanged.** | Pricing/payments unchanged in audit window. English-native tiers still `TODO`. |
| §9 Distribution Strategy | 183-217 | **Unchanged.** | No channel decision shipped. |
| §10 Success Metrics | 221-243 | **Unchanged.** | MAU paying users still unverified — keep. |
| §11 Competitive Moat | 247-269 | **Unchanged.** | Counts cited (470+, 862+, 536) still accurate (see §B audit-vs-actual). |
| §12 Risks | 273-287 | **Unchanged.** | |
| §13 Decision Framework | 291-308 | **Unchanged.** | |
| §14 How Future Sessions Use This | 312-342 | **Unchanged.** | |
| §15 Changelog | 346-395 | Append v3.1 entry on landing (see §E). | |

### §6 per-line audit (the section worth rewriting)

| Line | Current text (paraphrased) | Status as of 2026-05-19 | Source |
|---|---|---|---|
| 102 | "As of May 17, 2026 (end-of-day re-audit)" | **Stale date** — 2 days old. | trivial |
| 108-115 | Lesson counts table (VI→EN 470+, VN-for-foreigners 536, KO 151, JA 151, FR 151, DE 151, ZH 149, ES 109) | **Still correct.** All 7 `*_TOTAL_LESSONS` constants in `src/languages/*/lessons.ts` match. `public/data/*.json` rooms = 486 (the "+" already absorbs the +10 drift since v3.0). | `grep TOTAL_LESSONS src/languages/*/lessons.ts`; `ls public/data/*.json \| wc -l` |
| 119 | "Roadmap progress: ~65-70% (`.claude/roadmap.md` figure, last recomputed 25 Apr / Round 9)" | **Likely +1-3 pts.** Step 8 hardening (#720, #740, #732, #722, in-flight #794/#795) + entitlement consolidation (#774, #802, in-flight #789/#792) advanced Steps 8 and 9 materially. No formal recompute happened. Keep as a band, not a point estimate. | git log + open-PR list |
| 120 | "Schema generalization: ✅ Phase 2 seam fully landed today — PR-A1 (#540), PR-A2 (#543), PR-A3 (#550)" | **True but now misleadingly narrow.** This line describes the language-pedagogy schema (KO/JA/FR/DE/ZH bilingual surface). A second, distinct schema-generalization landed today on the billing side: PR #802 = `_shared/entitlement.ts` additive (B13ph3 PR-A). They are unrelated layers and should be named separately so a future reader doesn't conflate them. | commit `cff975a54` |
| 121 | "CI/CD: Green and stable. Restored via #536. ~17 PRs merged green after it." | **Out-of-date denominator.** Past 2 days alone added a real Sentry-wiring hardening pass (#714, #723, #720, #740) and a Deno edge-type gate (#725, #726). Pipeline is materially more robust, not just "still holding". | commit log |
| 122 | "Doctrine & docs: CLAUDE.md doctrine fixed (#537). Root markdown consolidated 74→16 (#549). Canonical STRATEGY.md + PRINCIPLES.md landed (#546)." | **Still true; needs append.** PR #783 ("session-end principles refresh") is in flight; once merged this line should reference it. | gh pr list |
| 123 | "Strategy (§4): The #553 un-surfacing... reverted in code by PR #582... This v3.0 doc rewrite fixes the upstream cause." | **Still true, historically.** Keep as-is. No fresh §4-shaped event. | — |
| 124 | "App stores: Apple Build 8 uploaded April 25, status unverified. Google Play Build 4 Live in Closed Testing as of April 25, status unverified." | **Status still unverified, but the line is now describing a 24-day-old upload.** Two native-relevant PRs since (#665 SW + safe-area merged; #796 tracker-native-guard in flight) reinforce that native is being kept honest, not regressing. The right edit is to acknowledge no fresh upload happened, not to claim a fresher status. | memory `project_distribution` (web-only as of 2026-04-21); commit log |
| 125 | "Paying users: Last documented at 6 on April 24. Current unverified." | **Still unverified.** Two ongoing customer remediations in flight (gift victims PR #799/#803; mylinh PR #801/#805) but no verified cohort count change. Leave the "unverified" framing; tighten the date language so it doesn't imply a stale claim is fresh truth. | gh pr list 799/801/803/805 |

### §7 per-cell audit

| Step | Line | Current cell | Audit verdict | Evidence |
|---|---|---|---|---|
| 1 — Stores | 133 | "~60% (Build 8 uploaded)" | **Hold.** No fresh build. Native readiness work (#665, #796) is back-end-of-native, not a store-side push. | commit log |
| 2 — Content Depth v1 | 134 | "✅ Complete" | **Hold.** | constants unchanged |
| 3 — Pronunciation | 135 | "~50% (drills shipped, STT pending)" | **Hold.** No phoneme/STT PR in the audited window. | grep `STT\|phoneme` commits — none |
| 4 — Retention Engine | 136 | "~85%" | **Hold.** Email-broadcast / unsubscribe surface unchanged in window; #687 privacy toggle is orthogonal. | — |
| 5 — Marketing Infra | 137 | "~70%" | **Possibly bumpable.** SEO PR #747 (canonical + hreflang + SeoMeta wired into marketing pages) landed since v3.0; #675 bilingual VI-first landing already on main. But the % is a band, not a delta; deferring re-scoring to next strategy-relevant change is fine. | commit log |
| 6 — Social + Community | 138 | "~65%" | **Hold.** | — |
| 7 — Mercy v2 | 139 | "~70%" | **Hold.** PR #763 scoped `/mercy/chat` stub as Option B (decision, no code shipped); #732/#728/#724/#721 placement v2 not a Mercy step. | — |
| **8 — Scale & Performance** | **140** | **"~80% (SW, Sentry, bundle audit)"** | **Stale.** Sentry route-gate (#720), Sentry boot-gate (#740), placement orchestrator/state-machine (#732, #728, #724, #721), dead-code sweep R3 (#722) all merged in window; in flight: #794 lazy MercyGuidePanel, #795 lazy zod/sonner/date-fns. The web vector is materially closer to ~90%. Native side has #665 (SW+safe-area) merged, #796 (native tracker guard) in flight — closer to ~70%, lagging. Brief's "~90% web / ~70% native" reading is consistent with the evidence. | commit log + open-PR list |
| **9 — Monetization Depth** | **141** | **"Pending"** | **No longer "Pending".** Concrete monetization-layer code shipped: #770 invoice period_end, #787 redeem-gift-code honest errors, #774 premium gates read entitlement, #802 `_shared/entitlement.ts` additive (B13ph3 PR-A). In flight: #789 entitlements table per A5 spec, #792 retire dormant T2 trigger, #793 monotonic raw_payload, #786 formatMoney zero-decimal. Plus PR #799 + #803 (gift-victim remediation) and PR #801 + #805 (mylinh remediation). This is a real "Phase A merged + Phase B in flight" state, not "Pending". | commit log + open-PR list |
| 10 — Pair-selection onboarding | 142 | "Schema foundation landed; Duolingo-style native+target picker is a separate future dispatch" | **Hold.** No onboarding-flow PR in window. | — |
| 11 — Differentiation Moats | 143 | "Pending" | **Hold.** | — |
| 12-14 — Years | 144 | "Business operations" | **Hold.** | — |

---

## §B. Proposed §6 rewrite (one swap-in block)

Replace lines 102-126 of `STRATEGY.md` (everything under "### As of May 17, 2026 (end-of-day re-audit)") with the block below. Date and §A audit table are the only inputs; lesson counts come from `grep TOTAL_LESSONS src/languages/*/lessons.ts`; PR refs are from `git log origin/main`.

```markdown
### As of May 19, 2026 (post-money-path wave re-audit)

- **Verified content inventory** (canonical `*_TOTAL_LESSONS` constants in
  `src/languages/*/lessons.ts`, plus `public/data/` room files — re-verified
  for this v3.1 sweep on 2026-05-19; unchanged since v3.0):

  | Track | Lessons | Pair orientation |
  |---|---|---|
  | Vietnamese → English (rooms) | 486 bilingual room JSON files | Home market / flagship |
  | Vietnamese-for-foreigners | 536 (`VIETNAMESE_TOTAL_LESSONS`) | English-native → Vietnamese |
  | Korean | 151 (`KOREAN_TOTAL_LESSONS`) | Bilingual (title_vi + title_en) |
  | Japanese | 151 (`JAPANESE_TOTAL_LESSONS`) | Bilingual (title_vi + title_en) |
  | French | 151 (`FRENCH_TOTAL_LESSONS`) | Bilingual (title_vi + title_en) |
  | German | 151 (`GERMAN_TOTAL_LESSONS`) | Bilingual (title_vi + title_en) |
  | Chinese | 149 (`CHINESE_TOTAL_LESSONS`) | Bilingual (title_vi + title_en) |
  | Spanish | 109 (`SPANISH_TOTAL_LESSONS`) | English-native → Spanish |

  The six target-language tracks KO/JA/ZH/FR/DE/ES still total **862 A1–C2
  lessons**. No new authoring landed in the 2026-05-17 → 2026-05-19 window;
  the wave was hardening + remediation, not content.

- **Roadmap progress:** still in the ~65-70% band (`.claude/roadmap.md`,
  last formally recomputed 25 Apr / Round 9). Past two days advanced Steps
  8 and 9 materially (see §7) without closing a formal +5% gate.

- **Schema generalization — language-pedagogy layer:** ✅ Phase 2 seam
  landed on 2026-05-17 — PR-A1 (#540), PR-A2 (#543), PR-A3 (#550). This is
  the foundation for the Duolingo-style pair-selection onboarding
  (Roadmap Step 10).

- **Schema generalization — billing/entitlement layer (new):** ✅ Phase A
  landed 2026-05-19 — `_shared/entitlement.ts` additive module (#802,
  B13ph3 PR-A, zero importers); paired with #774 (premium gates read
  entitlement, not stale `profiles.tier`). Phase B in flight: entitlements
  table per A5 spec (#789), retire dormant T2 trigger (#792), monotonic
  raw_payload (#793). Same "schema generalization" English word; different
  layer from the language-pedagogy one above — don't conflate.

- **CI/CD:** Green and stable, and materially hardened in the audit window.
  Sentry SDK wiring re-landed in `production-deploy.yml` (#714, #723) and
  route-gated so static legal/marketing pages no longer fetch the SDK
  (#720 / #740); Deno type-check gate added for edge functions (#725 /
  #726). Pipeline is more robust than v3.0 described, not just "still
  holding".

- **Doctrine & docs:** Doctrine fixed (#537). Root markdown consolidated
  74→16 (#549). Canonical STRATEGY.md + PRINCIPLES.md landed (#546).
  Session-end principles refresh in flight (#783).

- **Strategy (§4):** No fresh §4-shaped event in the audit window. The
  #553 un-surfacing → #582 revert history is closed; the v3.0 doc rewrite
  fixed the upstream cause. The matrix is intact.

- **Customer remediation in flight (money-path, not §4):** Gift-victim
  silent-failure cohort (forward fix #787 merged; historical-victim
  package PR #799 + outreach ops PR #803). Mylinh paid-but-free case
  (apply package PR #801 + Stripe Dashboard pre-flight PR #805). Both
  are operator runbooks — no automated SQL path, Chau executes via SQL
  Editor. No new lessons; just doing right by users we already had.

- **App stores:** No fresh upload since Apple Build 8 (April 25) / Google
  Play Build 4 (April 25). Native-side hardening continued without a
  store-side push: SW + safe-area net (#665), marketing-tracker native
  guard in flight (#796). Memory `project_distribution`: web-only at
  mercyblade.com as the live distribution surface today.

- **Paying users:** Last documented at 6 on April 24. Cohort still
  unverified (no agent dashboard access; Chau-only verification). Two
  remediation cases above are subsets of that cohort, not net-new users.
```

(The above block is the proposed §6 replacement. Diff size: ~25 lines. Strictly additive on the schema-generalization-billing-layer paragraph; everything else is a freshness pass.)

---

## §C. Proposed §7 cell updates

Two cells need editing. Everything else stays.

### Step 8 (line 140)

**From:**

```
| 8 | 70 | Scale & Performance | ~80% (SW, Sentry, bundle audit) | 1.5 |
```

**To:**

```
| 8 | 70 | Scale & Performance | ~90% web / ~70% native (Sentry route-gated #720/#740, placement v2 PR7-10 #721/#724/#728/#732, dead-code sweep R3 #722; native: SW+safe-area #665, tracker-guard #796 in flight) | 1.5 |
```

### Step 9 (line 141)

**From:**

```
| 9 | 75 | Monetization Depth | Pending | 1 |
```

**To:**

```
| 9 | 75 | Monetization Depth | Phase A merged 2026-05-19 (#774 entitlement gates, #802 _shared/entitlement.ts, #787 honest gift errors, #770 invoice period_end); Phase B in flight (#789 entitlements table, #792 T2 retirement, #793 monotonic payload, #786 currency unit fix) | 1 |
```

Both cells stay within the existing table format; no row added, no row removed; the % column unchanged for Step 9 because "% complete" is not the right metric for "Pending → Phase A merged + Phase B in flight" until the table itself is rescored.

---

## §D. Strategic-content drift check (§4, §5, §11, §13)

Per the brief and PRINCIPLES §14: default is **nothing flagged**. STRATEGY is not rewritten from a chat; only flag if a shipped contradiction exists.

Audit window: 216 commits, 2026-05-17 → 2026-05-19.

| Section | Could anything in the window contradict it? | Verdict |
|---|---|---|
| §4 The Matrix | Any PR re-hide a built track, kill a language route, or add a 17th pair? | **No.** `LanguageSwitcher`, `/languages` index, per-language pages all present on `origin/main`. No new target-language onboarding. Matrix intact. |
| §5 Product Strategy | Any PR add Duolingo-style streak-shaming, add a vanity metric to the success-feature list, or introduce an AI-chat surface without a learning job? | **No.** PR #763 explicitly scoped `/mercy/chat` as a stub (Option B = stub, not "add AI chat"). PR #687 added a *tracking opt-out*, which reinforces §5's "no dark patterns" stance, not weakens it. |
| §11 Competitive Moat | Any change to the cited content counts that breaks the "470+ / 862+ / 536" claims? Any new moat surface that should be named? | **No.** Counts re-verified above (§A line 108-115 row). Customer-remediation runbooks (#799/#801/#803/#805) are quiet credibility-builders, not a moat to claim publicly. |
| §13 Decision Framework | Any decision shipped in the window that needed a question the framework doesn't ask? | **No.** The money-path remediation flow tested Q1 (does it help a learner succeed? — yes, by undoing a silent loss) and Q7 (does it un-surface anything? — no). Framework handled it. |

**Result:** zero strategic content drift in the audit window. Hold §4, §5, §11, §13 as-is. Do not re-litigate the matrix.

---

## §E. Suggested §15 changelog entry (only if Chau lands v3.1)

```markdown
### May 19, 2026 — v3.1: §6 + §7 freshness pass (no strategic change)

Per PRINCIPLES §9 (status docs drift), §6 and §7 refreshed against 2 days
of post-v3.0 shipped reality. No §4 / §5 / §11 / §13 change — the matrix,
product strategy, moat, and decision framework all held against the
2026-05-17 → 2026-05-19 wave.

- §6: date moved to 2026-05-19; lesson counts re-verified (unchanged);
  added a "billing/entitlement schema generalization" paragraph distinct
  from the existing "language-pedagogy schema generalization" so the two
  layers don't get conflated; CI hardening evidence expanded (#714, #720,
  #723, #725, #726, #740); customer-remediation in-flight subsection added
  (gift victims PR #799/#803, mylinh PR #801/#805) framed as "doing right
  by users we already had", not new lessons; app-store + paying-user lines
  kept as "unverified" with date language tightened.
- §7 Step 8: cell expanded — ~90% web / ~70% native, with PR cites for the
  delta since v3.0.
- §7 Step 9: status flipped from "Pending" to "Phase A merged / Phase B in
  flight" with PR cites; % column left at 75 pending a formal recompute.
- Source-of-truth audit doc: `reports/STRATEGY-drift-audit-A3c.md`
  (PR #<assigned on push>).
```

---

## §F. Apply path (if Chau decides to land v3.1)

1. Open `STRATEGY.md`.
2. Replace lines 102-126 (the `### As of May 17, 2026...` block) with §B above.
3. Replace the Step 8 row and Step 9 row of the §7 table with §C above (two-line edit).
4. Append the §E entry to the §15 changelog (top, above the existing v3.0 entry).
5. Single commit, conventional message: `docs(strategy): v3.1 freshness pass — §6 + §7 (A3c)`.
6. Single PR.

If Chau decides v3.1 is NOT warranted right now, this audit doc stands as the record of "what would have changed and why we held".
