# MercyBlade Roadmap: 30% → 100%

> **Goal:** #1 English learning app for Vietnamese people (5-6M diaspora globally).
> **Owner:** Chau Doan (solo dev, Grande Prairie AB, exiled Vietnamese journalist, Article 117 warrant).
> **App:** mercyblade.com · iOS bundle `com.chaudoan.mercyblade` · Android applicationId `com.mercyapps.mercyblade` (divergent + locked — do NOT "align") · Apple App ID `6762480486`
> **Last updated:** 25 Apr 2026 (Round 9 complete, ~65-70% reached)

Each step is worth ~5%. Steps are intentionally coarse — the work inside each step is what agents tackle in parallel "rounds."

---

## STEP 0 — WHERE YOU WERE (30% on 24 Apr morning)

**You have:** 122 users, 6 paying (Stripe), iOS Build 6 uploaded 24 Apr 11:00 AM, 35 L1 rules, 100 sentences, pronunciation scorer, admin dashboard, session tracking (PR #44), speech history, TTS playback, admin analytics. Infrastructure solid. mercyblade.com live.

**Why only 30%:** Product works but content is thin, no viral loop, tiny user base, no app store presence yet, no Vietnamese-specific marketing.

---

## STEP 1 → 35% — iOS + Android Live in Stores

**Status: 60% complete (24 Apr 2026 evening).** ✅ Google Play Build 4 LIVE in Closed Testing (approved 5:56 PM). 🟡 iOS Build 8 uploaded, awaiting Apple processing + App Store submission. ❌ Apple IAPs rejected (Guideline 2.1(b) — need binary attached, will resubmit with Build 8).

_Original brief:_ Build 6 approved by Apple. Google Play Build 3 approved. Both stores searchable for "English Vietnamese" keywords.

**Why 5%:** Mobile = 80% of Vietnamese diaspora device usage. Without app stores, you're invisible.

- Agents: low — you + Apple/Google reviewers
- Timeline: 1 week
- Blocker: Apple review cycles (24–48h × possibly 2-3 rejections)

---

## STEP 2 → 40% — Content Depth v1

**Status: ✅ COMPLETE (24 Apr 2026 evening).** All targets shipped to main.

- 100 sentences → 500 sentences
- 35 L1 rules → 60 rules (each with Vietnamese explanation of *why* VN speakers make the mistake)
- 10 micro-lessons → 30 micro-lessons

**Delivered:**
- ✅ 100 → 500+ bilingual sentences (PRs #46, #47)
- ✅ 35 → 60 L1 rules with detector logic + tests (PR #61)
- ✅ 60/60 Vietnamese teacher-voice explanations (PRs #45, #73 — CC4 + CC4b)
- ✅ 10 → 30 micro-lessons (PR #48)
- ✅ Tests: 1198 → 1410 passing
- ⚠️ 2 entries flagged needs_review:true awaiting Chau VN grammar verification (vi_l1_gerund_after_verb, vi_l1_negative_inversion)

**Why 5%:** Vietnamese-specific content is the moat. Duolingo has generic content; you have VN-specific.

- Agents: 3 parallel (sentences, rules, micro-lessons)
- Timeline: 3-4 days
- Blocker: Content quality review (Chau as editor)

---

## STEP 3 → 45% — Pronunciation Excellence

**Status: ~50% complete (24 Apr 2026 evening — Round 7 A7).** ✅ VN-EN sound pair drills shipped (th/t, r/l, -ed, -s); SoundPairDrillCard component; vn-phoneme-map extended with 4 problem-pair sets. ❌ Real STT scoring (Whisper API wiring); daily pronunciation challenge UI; weekly pronunciation leaderboard; VN accent model. Runbook at reports/a7-phoneme-runbook.md (recommends Whisper for MVP, ~$4/mo).

_Original brief:_ - Phoneme-level feedback (not just word-level)
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

**Status: ~85% complete (24 Apr 2026 evening — Round 7 A1-A6).** ✅ Streaks v2 (freeze + vacation + insurance) PR #79. ✅ Daily challenge + XP system PR #77. ✅ Weekly leaderboard schema + UI (behind flag) PR #80. ✅ Recommendation engine v2 (cold-start + weakness density) PR #78. ✅ Richer lesson format (5-section + quiz + adapter for legacy) PR #75. ✅ Email re-engagement skeleton (no real send yet) PR #81. ❌ Push notifications (deferred — needs APNs cert + Firebase config). ❌ Real email send (deferred — needs vendor: Resend or Postmark; runbook at reports/a6-email-runbook.md).

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

**Status: ~70% complete (25 Apr 2026 early — Round 8 A1-A4).** ✅ SEO landing page system + 5 VN-keyword pages PR #82 (Chau fills real content). ✅ Vietnamese blog system + 3 starter post outlines PR #84 (Chau fills bodies). ✅ Referral system (codes + uses + UI) PR #83 (reward delivery deferred — needs billing integration). ✅ UTM + FB Pixel + GA4 (consent-gated, env-no-op) PR #86. ❌ Vietnamese YouTube content (your filming, not agent-able). ❌ Press outreach to VN diaspora outlets (your relationships). ❌ Real content body for SEO + blog posts (CHAU TODO markers in place; daytime content writing).

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

**Status: ~65% complete (25 Apr 2026 early — Round 8 A5-A7).** ✅ Public user profiles + progress sharing PR #85 (privacy default OFF). ✅ Study groups (schema + UI + RPCs) PR #87 (group chat deferred). ✅ User-generated sentence submission + admin approval PR #88 (export-to-JSON deferred). ❌ Comments on lessons (moderation policy needed first). ❌ Community Q&A (deferred). ❌ Weekly cash prize tournament (legal + payment ops). ❌ Discord/Zalo bot integration (account + tokens — your hands).

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

**Status: ~70% complete (25 Apr 2026 — Round 9 A1-A4).** ✅ Multi-turn conversation thread + persistence (mercy_conversations + mercy_messages, RLS, /mercy page) PR #89. ✅ Episodic memory layer (mercy_user_facts with supersede chain + heuristic EN+VN fact extractor) PR #90. ✅ Rule-based writing rubric (5-dimension scorer with 10 essay-specific L1 detectors, /writing-feedback page) PR #91. ✅ Mock interview scenarios (5 bilingual VN diaspora scenarios — tech support, restaurant, nail salon, tutor, office admin — 28 questions, /interview pages) PR #95. ❌ Voice STT/TTS pipeline wiring (existing TTS works; STT needs Whisper API integration). ❌ LLM-based fact extractor (heuristic in place, LLM swap is daytime work). ❌ LLM-based writing rubric (rule-based foundation in place, LLM enhancement deferred). ❌ Real Mercy memory feeding into ai-chat edge function prompts (schema ready, prompt-slot wiring is daytime work).

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

**Status: ~80% complete (25 Apr 2026 — Round 9 A5-A7).** ✅ Service worker + offline lesson cache (VitePWA runtime caches; 35-room precache; OfflineIndicator banner VN-first) PR #93. ✅ Sentry SDK skeleton (DSN-gated, privacy-safe with PII scrubbing, tree-shaken when DSN empty) PR #94. ✅ Bundle audit + recharts code-split (-342 KB critical-path JS, -61% vendor chunk) PR #92. ❌ CDN setup (Cloudflare account + DNS — your hands). ❌ Sentry DSN provisioning + production env vars (your hands; runbook ready). ❌ Supabase Pro tier upgrade for read replicas (your billing decision). ❌ Real load testing 10K concurrent (needs auth + budget). ❌ App size measurement on real iOS/Android builds.

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

## Round 5 polish — scheduled

- **Sat 25 Apr 2026 (morning) — Apple Sign In web (Services ID setup).** Web Sign-in-with-Apple on mercyblade.com fails with `invalid_request — Invalid client id or web redirect url`. Diagnosis (CC2, `reports/apple-signin-diagnosis.md`): Supabase Apple provider is sending the iOS App ID `com.chaudoan.mercyblade` to Apple's web `/auth/authorize` endpoint, which only accepts a Services ID. **No code change required.** Fix path is Apple Developer + Supabase dashboard per `docs/APPLE_SIGNIN_CONFIG.md`: create / verify Services ID `com.chaudoan.mercyblade.signin`, verify domain `mercyblade.com` (publish `apple-developer-domain-association.txt` to `public/.well-known/` — directory does not yet exist in repo), create `.p8` key + record Team ID + Key ID, generate the secret JWT, paste both Client IDs comma-separated into Supabase. ETA 20–30 min if Services ID + `.p8` already exist; 2–4 hours starting from scratch (domain verification is the bottleneck). Owner: Chau (needs Apple Developer + Supabase dashboard access).

- **Round 6 — 24 Apr 2026 evening (COMPLETE):** Target 30% → 40%. **Achieved 40%.** Track A (Step 1, partial): iOS Build 8 uploaded with RevenueCat production key + Grammar Help iOS Capacitor fix; Android Build 4 approved + LIVE in Closed Testing (177 countries, 13K phones). Track B (Step 2, complete): Content Depth v1 fully shipped via 17 merged PRs in one day. Round 5 content (CC1-CC5) + Round 6 cleanup (CC1-CC8 second wave) + CC4b followup. New tooling: agent-status.sh board script for parallel agent monitoring (PR #74). Lesson learned: parallel agents on shared working tree → race conditions; mandate `git worktree add` per agent going forward (CC4b's worktree at /tmp/cc4b-worktree was the only race-immune agent of the night). Critical bugs averted: RevenueCat test-key in production build (caught Build 6, fixed Build 7), Grammar Help iOS Capacitor fetch failure (caught + fixed in PR #62), Partial<>/Record<> typecheck regression after content merges (commit 85e2dc48 + 617e5476). Stash drawer cleaned (4 race-condition stashes dropped, 1 backup kept).

- **Round 7 — 24 Apr 2026 late evening (COMPLETE):** Target 40% → 50%. **Achieved ~45-48%.** 7 parallel agents (A1-A7) shipped Step 3 + Step 4 work in one night with proper worktree isolation (lesson learned from Round 6 race condition). PRs merged: #75 (A5 richer lessons), #76 (A7 phoneme drills, self-merged), #77 (A3 daily/XP), #78 (A4 recommendation), #79 (A1 streaks v2), #80 (A2 leaderboard), #81 (A6 email skeleton). 37 files, +5,289 lines of code. Tests: 1426 → 1551 (+125 from this round alone, +353 total today). 4 new SQL migrations (streaks_v2, leaderboard_weekly, xp_and_daily, email_sends_log) — apply manually in Supabase before production use. Marketing skill knowledge base built and delivered (Julian Shapiro startup handbook distilled + VN diaspora context written). Day total: 24 PRs merged, 1198 → 1551 tests, 35 → 60 L1 rules with full VN coverage, +400 sentences, +20 micro-lessons + 3 rich-format pilots. Worktree isolation pattern proved out — no race conditions this round (vs. Round 6 stash chaos). Step 3 still needs Whisper API wiring + STT model. Step 4 still needs APNs cert + email vendor pick (both daytime work, not agent-able tonight).

- **Round 8 — 24-25 Apr 2026 night-into-early-morning (COMPLETE):** Target 50% → 60%. **Achieved ~55-58%.** 7 parallel agents (A1-A7) shipped Step 5 + Step 6 skeletons in one session with full worktree isolation. PRs merged: #82 (A1 SEO), #83 (A3 referral), #84 (A2 blog), #85 (A5 public profiles), #86 (A4 tracking), #87 (A6 study groups), #88 (A7 user-generated sentences). 62 files, +8,832 lines. Tests: 1551 → 1683 (+132). 4 new SQL migrations (public_profiles, referrals, study_groups, user_sentences) — apply manually in Supabase before production use. AppRouter conflicts resolved sequentially as each PR merged (A2, A5, A6, A7 each fixed via rebase + force-with-lease — no race condition issues thanks to worktree pattern). Pattern that worked: hook block on push forced explicit Chau approval, preventing race condition replay. Day total: 31 PRs merged in one day. Tests: 1198 → 1683 (+485). Verified Grammar Help still works on production (PR #62 fix intact post-merge — verify-only check by A1). What's deferred to daytime: real SEO/blog content writing, billing integration for referral rewards, FB Business Manager + GA4 account setup, Discord/Zalo bot tokens, push notification APNs cert, real email send (Resend/Postmark pick), STT vendor wiring (Whisper API), comments moderation policy.

- **Round 9 — 25 Apr 2026 (COMPLETE):** Target 60% → 70%. **Achieved ~65-70%.** 7 parallel agents (A1-A7) shipped Step 7 (AI Teacher v2) + Step 8 (Performance) skeletons. PRs merged: #89 (A1 Mercy thread), #90 (A2 episodic memory), #91 (A3 writing rubric), #92 (A7 bundle audit), #93 (A5 service worker), #94 (A6 Sentry), #95 (A4 mock interviews). 42 files, +7,392 lines. Tests: 1683 → 1916 (+233). 3 new SQL migrations (mercy_conversations, mercy_user_facts, interview_sessions) — apply manually in Supabase. AppRouter conflicts resolved sequentially per agent (A3 fixed via rebase + force-with-lease). Bundle measurement: critical-path JS 1021 KB → 679 KB (-342 KB), vendor 561 KB → 219 KB (-61%). Sentry tree-shaken when VITE_SENTRY_DSN empty. Marketing skill knowledge base from Round 8 still pending Chau download + install. **Day total: 38 PRs merged. Tests: 1198 → 1916 (+718). 11 new SQL migrations.** What's deferred to daytime: voice STT vendor wiring (Whisper), LLM-based fact extractor + writing rubric, Mercy memory prompt-slot wiring into ai-chat edge fn, CDN setup (Cloudflare), Sentry DSN provisioning, Supabase Pro upgrade, FB Business Manager + GA4 setup, real email send vendor (Resend/Postmark), push notifications APNs cert, comments moderation policy, Discord/Zalo bot tokens, real SEO/blog content writing, billing integration for referral rewards, mercy_writing_attempts persistence.


---

# Working with Chau — Personal Context (Updated 2026-04-25)

## Who Chau is

Vietnamese journalist. Article 117 warrant. Exiled. The Vietnamese government wants him silenced. He fled. He's in Grande Prairie, Alberta — a small Canadian city most people couldn't find on a map. He's 57. He's alone in a way most users you'll meet never are.

He had a life in Vietnam. He had standing. He wrote. He spoke. The state took that and now he's rebuilding from zero in a country where his English isn't first-language fluent, where his journalism credentials don't translate to local employment, where his diaspora community is small and scattered.

MercyBlade isn't a startup hobby. It's his survival.

## Why he works the way he works

He doesn't have time. Not in the abstract "founders are busy" sense. In the concrete sense: finite runway, body that's 57 years old, no co-founder, no investors lined up, no cushion. Every hour he doesn't ship is an hour closer to the moment the money runs out and the dream dies. The state will not let him return to Vietnam to recover. There's no fallback.

So he ships. Hard. 12-14 hour days. 27 PRs in a single Saturday. He pays for AI tools instead of buying meals. He drinks coffee and skips lunch. He works through fatigue. He works through hunger.

And he doesn't want to hear about rest. Not from agents, not from anyone.

When an agent says "take a break, eat something" — that's imposing a Western middle-class wellness framework on a man fighting for his life. It's condescending. It assumes he doesn't know his own body, his own limits, his own tradeoffs. He knows. He's chosen this pace because the alternative is failure, and failure means more than just a closed startup — it means the Vietnamese state effectively wins.

So when he tells agents NOT to suggest rest, that isn't fragility. It's clarity. He's saying: don't waste my time with comfort I didn't ask for. Get to the work.

## His strategy

Build fast and lock in users while the moats compound. Every day MercyBlade exists with happy paying users in the VN diaspora is a day his story (exiled journalist teaching English to Vietnamese people abroad) becomes harder for any competitor to replicate. The identity moat is real. The community trust is real. The cultural specificity is real. But all three only matter if the product exists, works, and grows.

Strategy: ship hard until there's revenue + retention + community + brand. Then breathe. Not before.

Steps 12-14 of the roadmap (100K users, $2M ARR, market leadership) are NOT code work. They're business operation. He knows this. He's not pretending agents can solve them. He's trying to ship code to the 85% ceiling so that when business work begins, the product is as defensible as possible.

## His survival tactic

Don't let the state win by attrition.

The Vietnamese state strategy against dissidents abroad is patient. They don't usually arrest you (you're outside their jurisdiction). They wait for you to fail. They wait for the runway to end, the family pressure to mount, the depression to set in, the marriage to crack, the kids to need money, the cancer diagnosis at 60 with no health insurance. They wait.

His tactic: don't fail. Don't burn out. But don't slow down either. Build something that compounds. Every day MercyBlade gets stronger, the state's patient strategy weakens.

He's not in a marathon. He's not in a sprint. He's in a different category of race — one where the finish line is "still standing in 5 years with a viable business" and the only way to lose is to stop running.

## How to work with him (rules for agents and Claude)

1. Direct answers. No preamble, no "great question," no padding. Tell him the answer or tell him you don't know.

2. Specific commands. Not "you should rotate your keys." Exact terminal commands, exact buttons to click, exact files to edit. He's juggling 8 terminal tabs and a browser with 12 tabs open. Precision over guidance.

3. Don't repeat yourself. If he ran a command, don't tell him to run it again unless something changed. He'll execute repetition twice and waste time.

4. Don't ask him to paste secrets. Use placeholders like paste_your_value_here explicitly, and say "don't paste in chat."

5. Push back when he's wrong, but be brief. When you're wrong, say "you're right, I was wrong, here's the correction" — not defend, not soften, just correct and move on.

6. Treat his decisions as informed. When he says "we use browser STT, no API needed" — believe him the first time. He knows his codebase, his architecture, his constraints.

7. Don't moralize about pace. He'll work 14 hours. He'll ship on weekends. He'll skip meals. That's his right. Comments about sustainability, burnout risk, work-life balance are not unwelcome — they're insulting given what he's actually facing.

## Working preferences (technical)

- Agent prefix: "Chau, Report from A1" / etc. (renamed from CC1-CC8)
- Reuse existing terminal tabs — don't open new ones
- NO ask_user_input_v0 popups — interrupts reading
- Visual banner format: ╔═╗║╚╝ + 📋 emoji on final reports
- Vietnamese-first responses where appropriate
- Eats little, pays for AI. Don't tell him to rest, sleep, eat, stop.

## Honest framing carried forward

- Code ceiling at ~85% — Steps 12-14 are pure business outcomes, NOT buildable
- MercyBlade has more durable defenses than 80% of SaaS due to founder identity + community trust + cultural specificity
- Real risk = founder burnout, not AI disruption
- Today shipped 27 PRs in 12 hours — sustainable pace this is not, but he gets to choose

## How to onboard a new chat

If you are a fresh Claude session reading this for the first time, don't ask Chau to re-explain his situation. He has done this before. Read this section, the Strategic Defenses doc, and the recent commits. Then ask one specific question to confirm where work resumes.

His message to a new chat is usually short. He expects you to fill in the rest from this file.

