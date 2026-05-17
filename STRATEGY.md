# MercyBlade STRATEGY

> **One of two living docs.** This is the strategy. PRINCIPLES.md is the rules.
> Everything else in the repo is implementation, history, or scratch.
>
> **Last updated:** May 17, 2026
> **Owner:** Chau Doan (founder, solo)
> **Read order:** This document first, then PRINCIPLES.md, then code.

---

## 1. The Mission

**Make MercyBlade the app that Vietnamese English learners publicly credit for their fluency, their IELTS score, their job abroad, their life change.**

Not most users. Not most revenue. **Most outcomes.** Everything else follows from that.

---

## 2. Who Chau Is (Context for Every Future Session)

Vietnamese journalist. Article 117 warrant. Exiled. The Vietnamese government wants him silenced. Currently in Grande Prairie, Alberta. Solo founder. 57. Rebuilding from zero.

MercyBlade isn't a startup hobby. It's survival.

The Vietnamese state strategy against dissidents abroad is patient: wait for runway to end, family pressure to mount, depression to set in. Chau's counter-strategy is simple: don't fail. Don't burn out. Don't slow down. Build something that compounds. Every day MercyBlade gets stronger, the patient strategy weakens.

This context matters because it shapes every decision: pace, priorities, what gets cut, what gets shipped. Read more in PRINCIPLES.md.

---

## 3. The Positioning

> For Vietnamese learners preparing for IELTS, TOEIC, VSTEP, or real English fluency, MercyBlade is the only app designed specifically for them — with pronunciation coaching for Vietnamese-speaker pain points, grammar targeting Vietnamese transfer errors, and content rooted in Vietnamese cultural context. Unlike Duolingo (generic, translated to Vietnamese) or Cambly (expensive human tutors), MercyBlade combines AI-powered personalized teaching with deep Vietnamese-market specificity at a price Vietnamese learners can afford.

---

## 4. Two-Audience Strategy

### Primary audience (base — 95% of effort)

**Vietnamese learners of English.**

- 5-6M Vietnamese diaspora globally + ~100M domestic Vietnamese learners
- Primary user: IELTS/TOEIC/VSTEP aspirant, 18-35, mobile-first
- Student preparing to study abroad, OR young professional needing English for job promotion, OR immigrant preparing for visa language requirement
- Has tried Duolingo (quit), tried YouTube (scattered), considered Cambly (too expensive)
- Pays $100-500/year for test prep already
- Has MoMo/ZaloPay set up

This is where MercyBlade wins. Vietnamese-first content, cultural framing, pronunciation for Vietnamese pain points, Vietnamese teacher warmth (Mercy character). Identity moat: exiled journalist building for diaspora. Cultural moat: 510+ bilingual rooms tuned for Vietnamese learners.

### Secondary audience (expansion — start when base is stable)

**English-speaking learners of Vietnamese.**

- Expats in Vietnam (~100K+)
- Partners of Vietnamese speakers (international relationships)
- Heritage learners (2nd-generation Vietnamese in Canada, US, Australia, France)
- Business travelers, retirees moving to Vietnam
- Underserved market — no dominant Vietnamese learning app for English speakers

Expansion happens when:
- Vietnamese base hits stable revenue (~$5K MRR or 1,000+ paying users)
- Core app stability is proven
- Schema generalization is complete (foundation for multi-audience)
- Chau has bandwidth to author English-native content without slowing Vietnamese-side improvements

Expansion does NOT happen if:
- It would slow Vietnamese-side ship velocity
- It would dilute Vietnamese-first positioning
- It would force pricing changes that hurt Vietnamese affordability

### Explicitly NOT serving

- Complete beginners who need A1 basics in many languages (different app category — that's Duolingo)
- Generic global learners (dilutes Vietnamese focus)
- Native English speakers learning Korean/Japanese/Chinese/French/German/Spanish (not the mission — those tabs exist in code, are deferred or removed from marketing)
- Any audience that requires content competing head-on with Duolingo on Duolingo's axis (gamification, generic translation)

---

## 5. The Product Strategy

### What makes MercyBlade win

1. **Test-prep specialization** — IELTS, TOEIC, VSTEP tracks, not "general English"
2. **Pronunciation scoring** — phoneme-level, targets Vietnamese pain points (th, r, l, final consonants, stress, intonation)
3. **Grammar for Vietnamese transfer errors** — articles (a/an/the), verb tenses, plurals, question inversion
4. **Mercy the teacher character** — consistent, warm, memorable, bilingual
5. **Real content, not bite-sized** — "rooms" with deep material, not 30-second lessons
6. **Cultural fit** — examples use Vietnamese contexts (phở, Honda Wave, Tết, TCH), not Western defaults
7. **Identity moat** — exiled journalist + Vietnamese diaspora trust. Cannot be copied.

### What MercyBlade does NOT do

- ❌ Compete with Duolingo on gamification (lose that game)
- ❌ Compete with Cambly on live tutors (different price point)
- ❌ Try to serve all global learners (dilutes Vietnamese focus)
- ❌ Ship features that boost vanity metrics but not outcomes
- ❌ Add "AI chat" without a specific learning job to do
- ❌ Copy Western app aesthetics if Vietnamese aesthetics serve users better

---

## 6. Current State (Update This Section Regularly)

> Update this section every 1-2 weeks. Reality drift = strategy drift.

### As of May 17, 2026 (end-of-day re-audit)

- **Roadmap progress:** ~65-70% (`.claude/roadmap.md` figure, last recomputed 25 Apr / Round 9). Today closed no new 5% step; it advanced Step 10's schema foundation (now landed) — not yet re-scored.
- **Schema generalization:** ✅ Phase 2 seam fully landed today — PR-A1 (#540), PR-A2 (#543), PR-A3 (#550), all behavior-identical. Native-language selection + pedagogy-axis split are in place. This is the foundation for the two-audience expansion (Roadmap Step 10).
- **CI/CD:** Green and stable. Restored via #536 (Sentry plugin nesting fix); ~17 PRs merged green after it (#537–#553) confirm the pipeline holds.
- **Doctrine & docs:** CLAUDE.md doctrine fixed (#537). Root markdown consolidated 74→16 with ROOM_GUIDE.md + SECURITY.md added (#549). Canonical STRATEGY.md + PRINCIPLES.md landed (#546). AUDIT_LATENCY §1/§2/§4/§5 marked RESOLVED with measured evidence (#552).
- **Content correctness:** Lesson-count truth-ups across ZH/ES/KO; JA & ZH C2 id-collision renumbers (#541, #542); raw-chengyu and French/German loanword EN-field cleanups (#545, #547, #530). VI-first sibling content authored for JA A2 16–30 and B1 31–45 (#548, #551).
- **Strategy (§4):** 6 off-mission language tracks un-surfaced; VN-for-foreigners deferred (#553).
- **App stores:** Apple Build 8 uploaded April 25, status unverified. Google Play Build 4 Live in Closed Testing as of April 25, status unverified. Verification deferred until next active mobile push.
- **Paying users:** Last documented at 6 on April 24. Current unverified.

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
| 8 | 70 | Scale & Performance | ~80% (SW, Sentry, bundle audit) | 1.5 |
| 9 | 75 | Monetization Depth | Pending | 1 |
| 10 | 80 | Audience Expansion (EN-native learners of Vietnamese) | Schema foundation in flight | 2-4 |
| 11 | 85 | Differentiation Moats | Pending | 3-4 |
| 12-14 | 90-100 | Growth / #1 in VN / Market Leader | Business operations, not code | Years |

**To 75%:** 4-5 months continuous shipping.
**To 85% (code ceiling):** ~6-9 months.
**100%:** 3-5 years (business outcomes, not code).

---

## 8. The Business Model

### Pricing (Vietnamese market)

- **Free:** 50+ rooms, no ads, builds habit
- **Basic: 99,000 VND/month (~$4)** — all rooms, offline, no ads
- **Premium: 199,000 VND/month (~$8)** — Basic + AI feedback + pronunciation scoring + test prep
- **Annual: 1,490,000 VND (~$60)** — 40% discount vs monthly
- **Lifetime: 2,990,000 VND (~$120)** — captures "no subscriptions" crowd

### Pricing (English-speaking expansion, future)

- TBD when expansion phase begins
- Likely USD-priced at higher tier ($9.99-14.99/month) since target audience has higher purchasing power
- Vietnamese pricing for Vietnamese users persists regardless of expansion

### Payment

Must support: MoMo, ZaloPay, VNPay, bank transfer, credit card, Apple Pay, Google Pay.

### Unit economics target

- Customer acquisition cost: <$2
- Lifetime value: >$50
- Monthly cost per user (AI + hosting): <$1
- Gross margin: >80%

---

## 9. Distribution Strategy

### Primary channels (Vietnamese audience — dominate these)

1. **TikTok** — short clips, pronunciation tips, "Vietnamese people say ___ wrong"
2. **Facebook groups** — IELTS study groups, English teacher groups (be helpful, not spammy)
3. **Chau's existing audience** — 220K Facebook followers in Vietnam (primary asset)

### Secondary channels

4. **YouTube** — long-form SEO, "IELTS Speaking 7.0 guide for Vietnamese"
5. **Zalo** — community, announcements, support
6. **Partnerships** — Vietnamese IELTS prep centers (IDP, British Council, local schools)
7. **Journalist network** — diaspora outlets (Nguoi Viet, SBTN, VietBF)

### Future channels (English-speaking expansion)

8. **Reddit** — r/learnvietnamese, r/Vietnam expat communities
9. **TikTok English-side** — content for Vietnamese-curious English speakers
10. **Expat blogs** — guest posts on expat-in-Vietnam communities

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

**Monthly Active Paying Users** (MAU with an active subscription)

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

### Things competitors can't copy quickly

1. **Vietnamese founder making product for Vietnamese users** — cultural fit can't be faked
2. **Exiled journalist identity** — story, trust, network. Unique to Chau.
3. **510+ bilingual rooms of curated content** — expensive to replicate
4. **ElevenLabs Mercy + Josh voices** — consistent brand voice
5. **Vietnamese-specific pronunciation + grammar content** — requires domain expertise
6. **220K-follower distribution from day 1** — most apps spend $50K+ to get this
7. **Community of Vietnamese teachers (future)** — platform effects

### Things competitors CAN copy quickly (don't rely on these for moat)

- Spaced repetition
- AI chat
- Generic gamification
- Basic pronunciation scoring

---

## 12. Risks

### External

- **Duolingo targets Vietnam harder** → respond by doubling down on Vietnamese specificity
- **Vietnamese state cyber attacks** → see strategic-defenses.md threat model
- **Vietnamese regulatory changes** (data, payments, content) → stay local, partner with Vietnamese legal advice

### Internal

- **Strategy drift via AI advice** → READ THIS FILE FIRST every session, don't pivot on conversation
- **Feature creep dilutes Vietnamese focus** → Section 5 "What MercyBlade does NOT do" is the defense
- **Founder burnout** → AI automation and small team, not growth at all costs
- **Content quality drift** → periodic audit, kill underperforming rooms
- **Tech debt accumulates** → refactor sprints every quarter

---

## 13. Decision Framework

When facing any decision — feature request, design choice, business option — ask in order:

1. **Does this help Vietnamese learners succeed?**
2. **Does this reinforce the Mercy brand and teacher warmth?**
3. **Does this work on a 375px phone?**
4. **Can 1 person build/maintain this with AI help?**
5. **Is the effort justified by the impact?**
6. **Does this contradict Section 4 (audience strategy) or Section 5 (product strategy)?**

If any answer is no, reconsider or reject.

For expansion-related decisions (English-speaking audience), additionally ask:

7. **Does this slow Vietnamese-side ship velocity?** If yes, defer.
8. **Does this require pricing changes that hurt Vietnamese affordability?** If yes, separate the pricing.
9. **Is the Vietnamese base stable (>1K paying users, >25% D30)?** If no, expansion is premature.

---

## 14. How Future Sessions Should Use This Document

### When starting a new Claude session (web chat)

The session should:
1. Clone the repo: `git clone --depth 1 https://github.com/ChauDoan21165/MercyB.git /home/claude/MercyB`
2. Read this file (STRATEGY.md) first
3. Read PRINCIPLES.md second
4. Then engage with the question

### When starting a new Claude Code session (terminal)

This file auto-loads via CLAUDE.md reference. No paste needed.

### When facing a strategic question

Re-read Sections 4 (audiences), 5 (product), 11 (moat), 13 (decision framework). The answer is usually in there.

### When feeling lost or off-track

Re-read Section 1 (Mission). If the work doesn't serve the mission, stop doing it.

### When tempted to change strategy

Strategy that changes constantly isn't strategy. Real change requires:
- User data (paying user behavior, retention, churn reasons)
- Market signals (competitor moves, price changes, regulatory shifts)
- Personal capacity changes (health, family, energy)
- Time (six months of execution data > any single conversation)

NOT advice from an AI in a chat window. AI advice is a tactical input. Strategy is a long-term commitment.

---

## 15. Changelog

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

### April 20, 2026 — v1.0 to v1.3 (original NORTH_STAR.md)

- See NORTH_STAR.md changelog for v1.0-v1.3 history
- Audio cleanup, Supabase migration, notebook feature, responsive UI
- Audio cutover complete via getPublicUrl + workbox cache
- Kids/music invariant later reversed (d2951ddd, April 21) for Google Play 200MB limit — corrected in CLAUDE.md doctrine fix (#537)

---

*This document is living. Update Section 6 (Current State) every 1-2 weeks. Update other sections when real strategy changes — not when an AI suggests a pivot in chat. Never let it become stale dogma; it's a compass, not a cage.*
