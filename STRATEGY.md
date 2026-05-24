# MercyBlade STRATEGY

> **One of two living docs.** This is the strategy. PRINCIPLES.md is the rules.
> Everything else in the repo is implementation, history, or scratch.
>
> **Last updated:** May 19, 2026
> **Owner:** Chau Doan (founder, solo)
> **Read order:** This document first, then PRINCIPLES.md, then code.

---

## 1. The Mission

**Make MercyBlade the language-learning app that learners publicly credit for their fluency, their exam score, their job abroad, their life change — across every learning pair it serves.**

MercyBlade is a **matrix product**: a learner picks a native language and a target language, and gets a course tailored to *that pair*, not a generic course translated into their language.

The **Vietnamese → English** pair is the home market and the loudest success metric. When the doc talks about "outcomes," the proof case is still a Vietnamese student who credits MercyBlade for an IELTS score or a job abroad — that is where ~95% of effort goes and where the identity moat lives. But the mission is the matrix: every pair that has content is real product, held to the same standard.

Not most users. Not most revenue. **Most outcomes.** Everything else follows from that.

---

## 2. Who Chau Is (Context for Every Future Session)

Vietnamese journalist. Article 117 warrant. Exiled. The Vietnamese government wants him silenced. Currently in Grande Prairie, Alberta. Solo founder. 57. Rebuilding from zero.

MercyBlade isn't a startup hobby. It's survival.

The Vietnamese state strategy against dissidents abroad is patient: wait for runway to end, family pressure to mount, depression to set in. Chau's counter-strategy is simple: don't fail. Don't burn out. Don't slow down. Build something that compounds. Every day MercyBlade gets stronger, the patient strategy weakens.

This context matters because it shapes every decision: pace, priorities, what gets cut, what gets shipped. It is also why the **Vietnamese → English** pair is the home market and the identity moat — not because the other pairs aren't real product, but because this is the audience Chau can reach and serve like no competitor can. Read more in PRINCIPLES.md.

---

## 3. The Positioning

One platform, audience-specific positioning per pair:

> **For Vietnamese learners** preparing for IELTS, TOEIC, VSTEP, or real English fluency, MercyBlade is the only app designed specifically for them — pronunciation coaching for Vietnamese-speaker pain points, grammar targeting Vietnamese transfer errors, content rooted in Vietnamese cultural context, built by a Vietnamese founder for the Vietnamese diaspora. Unlike Duolingo (generic, translated to Vietnamese) or Cambly (expensive human tutors), MercyBlade combines AI-powered personalized teaching with deep Vietnamese-market specificity at a price Vietnamese learners can afford.

> **For English speakers learning Vietnamese, Japanese, Korean, Chinese, French, German, or Spanish**, MercyBlade is a real, structured A1–C2 course for that pair — deep "rooms"/lesson content, a consistent AI teacher (Mercy), and the same outcomes-first design — not a gamified streak treadmill.

The platform is common. The positioning is per-pair. The depth and marketing investment are not equal across pairs today (see §4) — but every pair with content is positioned honestly as real product, never as a hidden or deprecated surface.

---

## 4. The Learning-Pair Matrix

MercyBlade is **not** a single-audience app with a deferred expansion. It is a matrix:

- **Native languages supported:** Vietnamese, English
- **Target languages supported:** English, Japanese, Korean, Chinese, French, German, Spanish, Vietnamese
- **Up to 16 learning pairs.** A user picks their native language and their target language via a Duolingo-style onboarding flow (onboarding implementation is a separate future dispatch — see §7).

Every pair that has content is real product. None is hidden, deprecated, or "off-mission." Built content stays user-discoverable (`LanguageSwitcher`, the `/languages` index, per-language pages). Burying shipped work users could benefit from has no upside and was a mistake the v3.0 reset corrected (see §15).

### Effort allocation (this is the real prioritization, not an audience hierarchy)

- **Vietnamese-native side — ~95% of effort today.** Home market, deepest content, identity moat, the audience Chau can reach (220K-follower diaspora distribution). New authoring, marketing, and pronunciation/grammar specialization concentrate here. The Vietnamese → English pair is the flagship.
- **English-native side — the remaining ~5%.** Content already built across the target-language tracks (Korean, Japanese, Chinese, French, German, Spanish, and Vietnamese-for-foreigners — see §6 for verified counts). Maintained and kept discoverable, but **not the focus of new authoring** today. This is an effort decision, not a product-scope decision: these pairs are in scope; they are simply not where the next lesson gets written first.

"Vietnamese-first" means: when effort is allocated, Vietnamese-native learners win the tie. It does **not** mean other pairs are second-class product or candidates for un-surfacing.

### Explicitly NOT serving

- Complete beginners who want a gamified, bite-sized A1 tour of many languages at once (different app category — that's Duolingo). MercyBlade serves a learner committed to *one* pair with real depth.
- Generic global learners with no chosen pair (the matrix requires a native + target choice; an undifferentiated "learn languages" audience dilutes every pair).
- Any audience that requires competing head-on with Duolingo on Duolingo's axis (gamification, streak mechanics, generic translation).

> Note: native English speakers learning Korean/Japanese/Chinese/French/German/Spanish/Vietnamese are **served**, not excluded. The earlier "Explicitly NOT serving" bullet that listed them was the mistranslation v3.0 reverses.

---

## 5. The Product Strategy

### What makes MercyBlade win (applies to whichever pair the user picks)

1. **Real depth, not bite-sized** — "rooms"/lessons with substantial material across A1–C2, not 30-second streak fillers. True for every pair.
2. **A consistent AI teacher (Mercy)** — warm, memorable, bilingual to the user's native language. The teacher persona is the through-line across all pairs.
3. **Pair-specific pronunciation & transfer-error work** — for Vietnamese → English: phoneme-level scoring on Vietnamese pain points (th, r, l, final consonants, stress, intonation) and grammar targeting Vietnamese transfer errors (articles, tenses, plurals, question inversion). The *same class of work* is done pair-by-pair as each track is built (e.g. Spanish ser/estar early, German loanword traps) — pain points are pair-specific, the discipline is universal.
4. **Test-prep specialization where the pair has a dominant exam** — IELTS/TOEIC/VSTEP for Vietnamese → English. Other pairs get exam tracks if and when a dominant target exam justifies it.
5. **Cultural fit** — examples use the learner's world, not Western defaults. For Vietnamese → English: phở, Honda Wave, Tết, TCH. Each pair gets context fit appropriate to its audience as it is authored.
6. **Identity moat (Vietnamese side)** — exiled journalist + Vietnamese diaspora trust. Specific to the Vietnamese audience; see §11.

### What MercyBlade does NOT do

- ❌ Compete with Duolingo on gamification (lose that game)
- ❌ Compete with Cambly on live tutors (different price point)
- ❌ Serve an undifferentiated "all global learners" audience with no chosen pair (dilutes every pair)
- ❌ Ship features that boost vanity metrics but not outcomes
- ❌ Add "AI chat" without a specific learning job to do
- ❌ Hide or un-surface shipped, working content for any pair
- ❌ Copy Western app aesthetics if the learner's own context serves them better

---

## 6. Current State (Update This Section Regularly)

> Update this section every 1-2 weeks. Reality drift = strategy drift.

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

---

## 7. The Roadmap (Compressed from .claude/roadmap.md)

| Step | % | Theme | Status | Weeks |
|------|---|-------|--------|-------|
| 1 | 35 | iOS + Android in Stores | ~60% (Build 8 uploaded) | 1 |
| 2 | 40 | Content Depth v1 | ✅ Complete | 1 |
| 3 | 45 | Pronunciation Excellence | ~50% (drills shipped, STT pending) | 1 |
| 4 | 50 | Retention Engine | ~85% (streaks, XP, leaderboard, email skeleton) | 1 |
| 5 | 55 | Marketing Infrastructure | ~70% (SEO, blog, referral, tracking) | 1 |
| 6 | 60 | Social + Community | ~65% (profiles, study groups, UGC) | 1.5 |
| 7 | 65 | AI Teacher Mercy v2 | ~70% (conversation, memory, writing, interviews) | 2 |
| 8 | 70 | Scale & Performance | ~90% web / ~70% native (Sentry route-gated #720/#740, placement v2 PR7-10 #721/#724/#728/#732, dead-code sweep R3 #722; native: SW+safe-area #665, tracker-guard #796 in flight) | 1.5 |
| 9 | 75 | Monetization Depth | Phase A merged 2026-05-19 (#774 entitlement gates, #802 _shared/entitlement.ts, #787 honest gift errors, #770 invoice period_end); Phase B in flight (#789 entitlements table, #792 T2 retirement, #793 monotonic payload, #786 currency unit fix) | 1 |
| 10 | 80 | Pair-selection onboarding + deepen lighter pairs | Schema foundation landed; Duolingo-style native+target picker is a separate future dispatch | 2-4 |
| 11 | 85 | Differentiation Moats | Pending | 3-4 |
| 12-14 | 90-100 | Growth / #1 in VN / Market Leader | Business operations, not code | Years |

**Step 10 reframed (v3.0):** This is *not* "en→vi as a sequel to vi→en." The matrix is already the product (§4). Step 10 is two concrete pieces of work: (a) ship the Duolingo-style onboarding so a user explicitly picks native + target, and (b) deepen the English-native pairs whose content is lighter today — once the Vietnamese side is stable enough to free the bandwidth. It is a *deepening + UX* step, not a scope-expansion step.

**To 75%:** 4-5 months continuous shipping.
**To 85% (code ceiling):** ~6-9 months.
**100%:** 3-5 years (business outcomes, not code).

---

## 8. The Business Model

### Pricing (Vietnamese-native users — Vietnamese market)

- **Free:** 50+ rooms, no ads, builds habit
- **Basic: 99,000 VND/month (~$4)** — all rooms, offline, no ads
- **Premium: 199,000 VND/month (~$8)** — Basic + AI feedback + pronunciation scoring + test prep
- **Annual: 1,490,000 VND (~$60)** — 40% discount vs monthly
- **Lifetime: 2,990,000 VND (~$120)** — captures "no subscriptions" crowd

### Pricing (English-native users)

- Likely USD-priced at a higher tier ($9.99-14.99/month) since this audience has higher purchasing power
- Vietnamese pricing for Vietnamese-native users persists regardless — the Vietnamese affordability floor is non-negotiable and independent of any other pair's pricing
- Exact English-native tiers: TODO: Chau decide (not yet finalized — do not invent specifics)

### Payment

Must support: MoMo, ZaloPay, VNPay, bank transfer, credit card, Apple Pay, Google Pay.

### Unit economics target

- Customer acquisition cost: <$2
- Lifetime value: >$50
- Monthly cost per user (AI + hosting): <$1
- Gross margin: >80%

---

## 9. Distribution Strategy

### Primary channels (Vietnamese-native side — ~95% of distribution effort, dominate these)

1. **TikTok** — short clips, pronunciation tips, "Vietnamese people say ___ wrong"
2. **Facebook groups** — IELTS study groups, English teacher groups (be helpful, not spammy)
3. **Chau's existing audience** — 220K Facebook followers in Vietnam (primary asset, Vietnamese-side moat)

### Secondary channels (Vietnamese-native side)

4. **YouTube** — long-form SEO, "IELTS Speaking 7.0 guide for Vietnamese"
5. **Zalo** — community, announcements, support
6. **Partnerships** — Vietnamese IELTS prep centers (IDP, British Council, local schools)
7. **Journalist network** — diaspora outlets (Nguoi Viet, SBTN, VietBF)

### English-native side (lighter, ongoing — not gated behind a "phase")

8. **Reddit** — r/learnvietnamese, r/Vietnam expat communities, target-language learning subs
9. **TikTok English-side** — content for English speakers learning VI/JA/KO/etc.
10. **Expat blogs** — guest posts on expat-in-Vietnam communities

These channels are active surfaces for the English-native pairs, run at the ~5% effort level — not a future phase that is currently switched off.

### Skip (low ROI)

- Twitter/X (low Vietnamese usage)
- LinkedIn (wrong demographic)
- Google Ads (expensive for this market)

### Content types that work in Vietnam

- Before/after pronunciation clips (goes viral)
- "Common mistake Vietnamese speakers make" (educational + shareable)
- Student success stories (testimonials)
- Mercy teacher personality content

---

## 10. Success Metrics

### The single most important number

**Monthly Active Paying Users** (MAU with an active subscription) — Vietnamese → English is the loudest sub-metric.

### Year 1 targets

| Metric | Target |
|---|---|
| MAU paying users | 1,000 → 10,000 |
| Day-30 retention | >25% |
| Paid conversion from free | >3% |
| ARPU (avg revenue per user) | >$5/month |
| Net Promoter Score | >40 |
| Public success stories per month | >10 |

### Vanity metrics to ignore

- Total downloads
- Signups without engagement
- Social media followers not converting to users
- Time-in-app (if not producing learning outcomes)

---

## 11. Competitive Moat

### Vietnamese-side moat (audience-specific — cannot be copied)

1. **Vietnamese founder making product for Vietnamese users** — cultural fit can't be faked
2. **Exiled journalist identity** — story, trust, network. Unique to Chau. This is **Vietnamese-audience-specific positioning**, not a global moat — it earns trust with the Vietnamese diaspora, not with an English speaker learning Korean.
3. **220K-follower diaspora distribution from day 1** — most apps spend $50K+ to get this; specific to the Vietnamese audience
4. **Vietnamese-specific pronunciation + grammar content** — requires domain expertise
5. **470+ bilingual Vietnamese → English rooms of curated content** — expensive to replicate

### Platform-wide moat (helps every pair)

6. **Broad multi-target coverage** — 862+ A1–C2 lessons across Korean/Japanese/Chinese/French/German/Spanish plus 536 Vietnamese-for-foreigners lessons; few competitors offer real depth across this many pairs
7. **AI-powered personalized teaching** — the Mercy teacher persona and per-pair feedback
8. **ElevenLabs Mercy + Josh voices** — consistent brand voice across pairs
9. **Real "rooms"/lesson depth format** — structurally different from streak-based competitors

### Things competitors CAN copy quickly (don't rely on these for moat)

- Spaced repetition
- AI chat
- Generic gamification
- Basic pronunciation scoring

---

## 12. The Duolingo Competition Strategy

Duolingo is already strong at lessons, streaks, gamification, AI roleplay, and broad course scale. MercyB should not compete by copying Duolingo. MercyB wins by owning a sharper lane:

**"Personal Teacher Mercy — Vietnamese-first AI teacher system."**

### Positioning

| | Duolingo | MercyB |
|---|---|---|
| **Audience** | Broad global, any language | Vietnamese learners (home) + selected pairs |
| **Approach** | Gamified lesson treadmill | Personal AI teacher who knows you |
| **Depth** | Bite-sized 3-minute units | Real depth, pair-specific content |
| **Culture** | Generic Western defaults | Vietnamese cultural context (phở, Honda Wave, Tết) |
| **Kid entry** | Requires reading + complex UI | Picture + speak only — works for age 2+ |
| **Memory** | Streak counters | Safe summary: what you're strong at, what you're weak at, what to study next |
| **Differentiation** | Scale + gamification | Teacher Mercy personality + Vietlish diagnosis |

### Duolingo's weaknesses MercyB exploits

1. **Generic for everyone** → MercyB is specific to Vietnamese learners and families.
2. **Gamification, not learning depth** → MercyB focuses on outcomes, not engagement metrics.
3. **No real teacher relationship** → Teacher Mercy is a consistent, warm persona across the product.
4. **No Vietnamese cultural awareness** → MercyB explains errors through Vietnamese thinking patterns (Vietlish).
5. **Complex kid mode** → Mercy Kids is picture + speak only. No reading required.

### What MercyB does NOT do

- ❌ Copy Duolingo feature-for-feature (lose that game)
- ❌ Add streaks as the primary retention mechanic
- ❌ Make Mercy Kids complex
- ❌ Put advanced AI Tutor modes into Kids
- ❌ Make Study OS a giant PR — ship one brick at a time
- ❌ Add unsafe memory sync
- ❌ Expose provider secrets client-side
- ❌ Store raw audio or full transcripts
- ❌ Do Placement writeback

### Winning sentence

> MercyB wins by becoming the Vietnamese-first personal AI teacher: simple enough for a 2-year-old, deep enough to fix adult Vietlish, and smart enough to guide the next lesson.

---

## 13. Risks

### External

- **Duolingo targets Vietnam harder** → respond by doubling down on Vietnamese specificity
- **Vietnamese state cyber attacks** → see strategic-defenses.md threat model
- **Vietnamese regulatory changes** (data, payments, content) → stay local, partner with Vietnamese legal advice

### Internal

- **Strategy drift via AI advice** → READ THIS FILE FIRST every session, don't pivot on conversation. *(v3.0 exists because an AI session did exactly this — see §16.)*
- **Effort drift away from the Vietnamese side** → ~95% effort stays Vietnamese-native; the matrix being real product does not mean equal investment
- **Founder burnout** → AI automation and small team, not growth at all costs
- **Content quality drift** → periodic audit, kill underperforming rooms
- **Tech debt accumulates** → refactor sprints every quarter

---

## 14. Decision Framework

When facing any decision — feature request, design choice, business option — ask in order:

1. **Does this help a learner succeed at their chosen language pair?**
2. **Does this reinforce the Mercy brand and teacher warmth?**
3. **Does this work on a 375px phone?**
4. **Can 1 person build/maintain this with AI help?**
5. **Is the effort justified by the impact?**
6. **Does this contradict Section 4 (the matrix) or Section 5 (product strategy)?**

If any answer is no, reconsider or reject.

For effort-allocation decisions across pairs, additionally ask:

7. **Does this serve the user's chosen learning pair, or does it un-surface / second-class a pair that has content?** Un-surfacing shipped content for any pair is rejected (this is the v3.0 lesson).
8. **Given ~95% of effort is Vietnamese-native, does this pull new-authoring bandwidth off the Vietnamese side without a clear reason?** If yes, it competes with the home market — justify it explicitly.
9. **Does this require pricing changes that hurt Vietnamese affordability?** If yes, separate the pricing per §8 — the Vietnamese floor is independent.

---

## 15. How Future Sessions Should Use This Document

### When starting a new Claude session (web chat)

The session should:
1. Clone the repo: `git clone --depth 1 https://github.com/ChauDoan21165/MercyB.git /home/claude/MercyB`
2. Read this file (STRATEGY.md) first
3. Read PRINCIPLES.md second
4. Then engage with the question

### When starting a new Claude Code session (terminal)

This file auto-loads via CLAUDE.md reference. No paste needed.

### When facing a strategic question

Re-read Sections 4 (the matrix), 5 (product), 11 (moat), 13 (decision framework). The answer is usually in there.

### When feeling lost or off-track

Re-read Section 1 (Mission). If the work doesn't serve the mission, stop doing it.

### When tempted to change strategy

Strategy that changes constantly isn't strategy. Real change requires:
- User data (paying user behavior, retention, churn reasons)
- Market signals (competitor moves, price changes, regulatory shifts)
- Personal capacity changes (health, family, energy)
- Time (six months of execution data > any single conversation)

NOT advice from an AI in a chat window. AI advice is a tactical input. Strategy is a long-term commitment. **v3.0 of this doc exists because an AI session did the opposite — it rewrote the product definition from a conversation it mistranslated. Do not repeat that.**

---

## 16. Changelog

### May 24, 2026 — Duolingo competition strategy added

- Added §12: The Duolingo Competition Strategy — positioning table, Duolingo weaknesses to exploit, what NOT to do, winning sentence.
- Renumbered subsequent sections (Risks → §13, Decision Framework → §14, etc.).

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
- Source-of-truth audit doc: `reports/STRATEGY-drift-audit-A3c.md` (PR #812).

### May 17, 2026 — v3.0: Strategic reset (matrix product, not 1+1)

The v2.0/v2.1 framing of MercyBlade as a Vietnamese-English-learning app with deferred expansion was a mistranslation introduced by an earlier Claude session and not approved by Chau. Reality: MercyBlade is a matrix product — 2 native languages × 8 target languages, up to 16 learning pairs. Vietnamese-native users remain the home market (~95% of effort). PR #582 reverted the code consequence of v2.0/v2.1's mistranslation (re-surfaced the KO/JA/ZH/FR/DE/ES tracks #553 had hidden). This doc rewrite fixes the upstream cause.

- §1 Mission: rewritten — multi-pair language-learning product; Vietnamese → English remains the loudest success metric, but the mission is the matrix.
- §3 Positioning: rewritten — common platform, per-pair positioning.
- §4: deleted the "Two-Audience Strategy" framing; replaced with "The Learning-Pair Matrix" (2 native × 8 target, up to 16 pairs, ~95% effort Vietnamese-native, ~5% English-native built-and-maintained). Removed the KO/JA/ZH/FR/DE/ES "Explicitly NOT serving" exclusion.
- §5: items rewritten to apply to whichever pair the user picks.
- §6: replaced "off-mission" framing with a verified content-inventory table (counts read from `src/languages/*/lessons.ts` canonical constants per locked #7/#15).
- §7: Roadmap Step 10 reframed — pair-selection onboarding + deepening lighter pairs, not an en→vi sequel.
- §8: pricing split clarified; English-native tiers marked TODO: Chau decide.
- §11: moat split into Vietnamese-audience-specific (exiled-journalist identity, 220K diaspora reach) vs platform-wide (multi-pair coverage, AI teaching). Replaced stale "510+" with verified "470+".
- §13: decision framework expansion sub-questions rewritten around "serve the user's chosen pair" + the un-surfacing prohibition.

### May 17, 2026 — v2.2: Reverted §4 un-surfacing decision

- Reverted §4 un-surfacing decision. Languages built (KO, JA, ZH, FR, DE, ES) remain user-discoverable. Vietnamese English learners stay primary audience (95% effort), but content already built stays surfaced for the minority who want it.
- Reverted PR #553 in code (squash commit `c3b554e7`): restored `src/components/LanguageSwitcher.tsx`, the `/languages` index (`LanguagesIndexPage.tsx`), the `AppRouter` route, `Home.tsx`, and the EN-chrome smoke test to their pre-#553 state. Removed `RECON-portfolio-unsurface.md` (it was added by #553).
- §4: removed the "Native English speakers learning Korean/Japanese/Chinese/French/German/Spanish …" bullet from "Explicitly NOT serving"; added the "Built language tracks (secondary content surfaces — kept discoverable)" subsection so the doc is honest about why these stay surfaced.
- §6: corrected the Strategy line — the un-surfacing is reverted, not in effect.
- Trail correction: the v2.1 entry below states "§4 body was edited by [#553]" — that is **inaccurate**. #553 changed only code/router/tests and added a RECON file; STRATEGY §4 prose was never touched by #553 (the NOT-serving bullet was introduced by #546). Logged here for the audit trail; the v2.1 historical entry is left as-written.

### May 17, 2026 — v2.1 (Same-day §6 re-audit)

- Re-audited §6 per locked principle #9 (status docs drift): 25 PRs (#529–#553) merged after v2.0 landed the same day; §6 refreshed to end-of-day reality.
- §6: schema-generalization Phase 2 marked complete (PR-A1/A2/A3 all merged — was "PR-A2 next"); CI marked stable (17 PRs green post-#536); shipped-work summary expanded from 3 items to a themed list; app-store + paying-user claims left explicitly unverified (no dashboard access).
- Removed the "What's running right now (agents)" subsection — volatile by nature (stale within hours); live truth is `git worktree list`.
- Noted the §4 change shipped by #553 (6 off-mission language tracks un-surfaced, VN-for-foreigners deferred); §4 body was edited by that PR — logged here for the trail.

### May 17, 2026 — v2.0 (Two-Audience Update)

- Consolidated NORTH_STAR.md + PLAN.md + .claude/roadmap.md into single STRATEGY.md
- Added Section 4: Two-Audience Strategy (Vietnamese base + English-speaking expansion)
- Updated "Explicitly NOT serving" section to reflect expansion as planned future state
- Added Section 6: Current State (live status snapshot, update regularly)
- Compressed roadmap from .claude/roadmap.md into Section 7
- Added Section 13 decision framework questions specific to expansion decisions
- Captured 220K Facebook follower asset as competitive moat (Section 11)
- Captured Chau's context (exiled journalist, Article 117) in Section 2

> **v3.0 note on the v2.0 entry:** the "Two-Audience Strategy" added in v2.0 is the framing v3.0 reverses. Kept here for the audit trail, not as current direction.

### April 20, 2026 — v1.0 to v1.3 (original NORTH_STAR.md)

- See NORTH_STAR.md changelog for v1.0-v1.3 history
- Audio cleanup, Supabase migration, notebook feature, responsive UI
- Audio cutover complete via getPublicUrl + workbox cache
- Kids/music invariant later reversed (d2951ddd, April 21) for Google Play 200MB limit — corrected in CLAUDE.md doctrine fix (#537)

---

*This document is living. Update Section 6 (Current State) every 1-2 weeks. Update other sections when real strategy changes — not when an AI suggests a pivot in chat. Never let it become stale dogma; it's a compass, not a cage.*
