# MercyBlade Roadmap: 30% → 100%

> **Goal:** #1 English learning app for Vietnamese people (5-6M diaspora globally).
> **Owner:** Chau Doan (solo dev, Grande Prairie AB, exiled Vietnamese journalist, Article 117 warrant).
> **App:** mercyblade.com · Bundle `com.chaudoan.mercyblade` · App ID `6762480486`
> **Last updated:** 24 Apr 2026

Each step is worth ~5%. Steps are intentionally coarse — the work inside each step is what agents tackle in parallel "rounds."

---

## STEP 0 — WHERE YOU ARE (30%)

**You have:** 122 users, 6 paying (Stripe), iOS Build 6 uploaded 24 Apr 11:00 AM, 35 L1 rules, 100 sentences, pronunciation scorer, admin dashboard, session tracking (PR #44), speech history, TTS playback, admin analytics. Infrastructure solid. mercyblade.com live.

**Why only 30%:** Product works but content is thin, no viral loop, tiny user base, no app store presence yet, no Vietnamese-specific marketing.

---

## STEP 1 → 35% — iOS + Android Live in Stores

Build 6 approved by Apple. Google Play Build 3 approved. Both stores searchable for "English Vietnamese" keywords.

**Why 5%:** Mobile = 80% of Vietnamese diaspora device usage. Without app stores, you're invisible.

- Agents: low — you + Apple/Google reviewers
- Timeline: 1 week
- Blocker: Apple review cycles (24–48h × possibly 2-3 rejections)

---

## STEP 2 → 40% — Content Depth v1

- 100 sentences → 500 sentences
- 35 L1 rules → 60 rules (each with Vietnamese explanation of *why* VN speakers make the mistake)
- 10 micro-lessons → 30 micro-lessons

**Why 5%:** Vietnamese-specific content is the moat. Duolingo has generic content; you have VN-specific.

- Agents: 3 parallel (sentences, rules, micro-lessons)
- Timeline: 3-4 days
- Blocker: Content quality review (Chau as editor)

---

## STEP 3 → 45% — Pronunciation Excellence

- Phoneme-level feedback (not just word-level)
- VN-EN sound pair drills (th/t, r/l, -ed endings, -s plurals)
- Daily pronunciation challenge (60-second drill)
- Weekly pronunciation leaderboard
- STT accuracy scoring with Vietnamese accent model

**Why 5%:** Vietnamese speakers care MOST about pronunciation (shame factor). ELSA charges $100/yr and doesn't do VN-specific. Undercut at 200K VND/month.

- Agents: 4 parallel (phoneme engine, drill UI, leaderboard, accent model)
- Timeline: 1 week
- Blocker: Speech recognition API costs

---

## STEP 4 → 50% — Retention Engine

- Streaks v2 (freeze days, vacation mode, streak insurance)
- Daily challenges with XP
- Weekly leaderboard (friends + global)
- Push notifications (time, lesson, streak-warning)
- Email re-engagement (7d, 14d, 30d lapsers)
- "Weakest skill" auto-recommended daily lesson
- **Richer lesson format** (structured sections: Hook / Why / Pattern / Practice / Takeaway, 5-question quiz per lesson, Vietnamese TTS voiceover per lesson). Deferred from Round 5 Step 2 — Step 2 added lesson *count* in the existing shape; Step 4 upgrades the *shape* when retention UX is designed end-to-end.

**Why 5%:** Retention = revenue. D30 15% → 30% doubles LTV without new acquisition.

- Agents: 5 parallel
- Timeline: 1 week
- Blocker: iOS notification permissions

---

## STEP 5 → 55% — Marketing Infrastructure

- 20 SEO landing pages targeting "học tiếng Anh [topic]"
- Vietnamese blog (journalist background is edge — weekly cadence)
- Facebook Pixel + UTM tracking
- Referral system (share → both get 7 days free)
- Vietnamese YouTube shorts ("3 lỗi tiếng Anh người Việt hay sai")
- Press outreach: 5 VN diaspora outlets (Nguoi Viet, SBTN, VietBF)

**Why 5%:** Journalist network untapped. Blog + SEO compounds. Referral = viral loop.

- Agents: 3 parallel (landing pages, blog system, referral)
- Timeline: 1 week
- Blocker: Chau's time for writing/video (can't agent this)

---

## STEP 6 → 60% — Social + Community

- User profiles + progress sharing
- Study groups (private rooms)
- Comments on lessons
- "Ask a question" (community first, AI fallback)
- Weekly challenge with cash prize (500K VND ≈ $20)
- Discord or Zalo integration
- User-generated sentences (Chau approves)

**Why 5%:** Vietnamese culture is communal. Solo apps fail in VN market.

- Agents: 4 parallel
- Timeline: 1.5 weeks
- Blocker: Moderation policy

---

## STEP 7 → 65% — AI Teacher Mercy v2

- Voice conversations (multi-turn)
- Personalized lesson plans (Mercy builds curriculum from placement + weaknesses)
- Writing feedback (essay → rubric grading)
- Mock interviews
- Memory layer (Mercy remembers each user across sessions)
- Bilingual switching (VN when needed, EN when teaching)

**Why 5%:** Unique weapon. No competitor has VN-aware AI teacher with memory. ChatGPT is generic. Duolingo has no voice. ELSA has no conversation.

- Agents: 5 parallel
- Timeline: 2 weeks
- Blocker: API costs scale with usage

---

## STEP 8 → 70% — Scale & Performance

- CDN: sub-1s load in VN, US, AU, DE, FR
- Offline mode (core 100 lessons)
- App size <50MB, launch <2s
- Supabase read replicas
- API queue + rate limiting
- Sentry or equivalent
- Load test target: 10K concurrent

**Why 5%:** Infrastructure for 100K users, not 122. Each second of load = 10% conversion loss. Offline = VN users on bad internet stay.

- Agents: 4 parallel
- Timeline: 1.5 weeks
- Blocker: Infra cost tier upgrades

---

## STEP 9 → 75% — Monetization Depth

- Yearly with 25% savings (up from 17%)
- Family plan (5 users, one sub)
- Corporate/school (10+ seats)
- Gift subscriptions
- Lifetime ($199 for early adopters)
- A/B test pricing tiers
- Paywall optimization (5 designs)
- Trial expiry re-engagement

**Why 5%:** Revenue needs to grow from ~$30/mo to $3000/mo to fund next phases.

- Agents: 3 parallel
- Timeline: 1 week
- Blocker: Stripe + App Store + Play Store config

---

## STEP 10 → 80% — Market Expansion

Support additional L1s: Mandarin, Khmer, Thai, Indonesian. Each L1 gets 60 rules. Multi-language UI. Regional pricing. Cultural context lessons (business English per culture).

**Why 5%:** VN diaspora is 5-6M. SE Asian market is 50M+ learners. Same infrastructure, 10× market.

- Agents: 5 parallel (one per language)
- Timeline: 2 weeks
- Blocker: Native content reviewers per language

---

## STEP 11 → 85% — Differentiation Moats

Certifications (TOEIC/IELTS), school partnerships (pilot 5), celebrity teachers, monthly $500 USD tournaments, API for third parties, ed institution licensing, branded textbook integration.

**Why 5%:** Defense against Duolingo entering VN market. Makes MercyBlade the establishment.

- Agents: 2-3
- Timeline: 3-4 weeks
- Blocker: Chau's face-to-face time (can't agent relationships)

---

## STEP 12 → 90% — Growth Machine

100K users, 50K MAU, 5K paying, top 20 Education in VN, automated content pipeline, influencer program (20 creators 10K+ followers), paid acquisition at scale, 50K SEO visits/mo.

**Why 5%:** Prove unit economics. LTV > CAC at scale. Grow profitably without funding.

- Agents: 3 (content pipeline, analytics, ad ops)
- Timeline: 2-3 months operating
- Blocker: Ad capital ($10K-50K to positive ROAS)

---

## STEP 13 → 95% — #1 in Vietnam + Diaspora

500K users, 50K paying, top 3 Education VN, #1 in diaspora searches, $500K+ ARR, 15-person team, office, press coverage.

**Why 5%:** Credibly #1. Metrics prove it. VN government may notice (risk factor — consider legal structure).

- Agents: none — ops and growth, not code
- Timeline: 6-12 months operating
- Blocker: Team hiring, Chau's personal capacity

---

## STEP 14 → 100% — Untouchable Market Leader

2M+ users, 200K+ paying, $2M+ ARR, expansion beyond VN, Series A or profitable bootstrap, story told widely, MercyBlade becomes verb, acquisition offers from Duolingo/Babbel/ByteDance.

**Why 5%:** Legacy. Not competing — you're the category. Decide: sell, scale, or stay mission-driven.

- Agents: irrelevant — running a company
- Timeline: 2-4 years out
- Blocker: none — execution compounding

---

# Summary Table

| Step | % | Theme | Weeks |
|------|---|-------|-------|
| 1 | 35 | Stores Live | 1 |
| 2 | 40 | Content Depth | 1 |
| 3 | 45 | Pronunciation | 1 |
| 4 | 50 | Retention | 1 |
| 5 | 55 | Marketing | 1 |
| 6 | 60 | Community | 1.5 |
| 7 | 65 | AI Teacher v2 | 2 |
| 8 | 70 | Scale/Perf | 1.5 |
| 9 | 75 | Monetization | 1 |
| 10 | 80 | Market Expansion | 2 |
| 11 | 85 | Moats | 3-4 |
| 12 | 90 | Growth Machine | 2-3 months |
| 13 | 95 | #1 in VN | 6-12 months |
| 14 | 100 | Market Leader | 2-4 years |

**To 75%:** 4-5 months continuous shipping.
**To 100%:** 3-5 years.

---

# Reality Check

Code is easy. Steps 1-10 shippable with AI agents in 2-3 months.

Hard part is Steps 11-14. Capital ($50K-500K), team (hiring/managing), relationships (schools, celebrities, influencers), Chau's face/story/journalist network, years not weeks.

Unique asset: **the exiled journalist building for his diaspora.** Duolingo/ELSA can't copy this. It's the compounding moat.

---

# Round Log (chronological, newest last)

- **Rounds 1-4 (before 24 Apr 2026):** Moved 25% → 30%. Shipped PR #37 (grammar ESM), #38 (RLS bugs), #39 (TTS), #40 (E2E), #41 (admin analytics), #42 (L1 20→35 rules), #44 (session/behavior tracking).
- **Round 5 — 24 Apr 2026 (in progress):** Target 30% → 35%. Track A: iOS Build 6 uploaded (waiting Apple processing), Android Build 3 pending, App Store Connect submission pending. Track B: 5 content agents CC1-CC5 spun up (2× sentences, 1× L1 rule detectors, 1× L1 VN explanations, 1× micro-lessons).
- **Round 5 decision — 24 Apr 2026:** CC5 reported that the original brief's micro-lesson schema (cefr_level / duration_seconds / sections / quiz / voiceover / sentence refs) did not match the shipped `src/lib/weakness/micro-lessons.ts` shape (tag / concept / examples / practice / tip). Call: CC5 writes the 20 new lessons in the **existing shipped shape**. Richer lesson format (quizzes, voiceover, structured sections) is deferred to Step 4 (Retention Engine) where it belongs — it's a UX/retention initiative, not a content-count initiative. Lesson: match shipped reality, don't invent schema.
