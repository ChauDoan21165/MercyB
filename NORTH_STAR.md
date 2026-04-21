# MercyBlade North Star
**The #1 English Learning App for Vietnamese People**

> Last updated: April 20, 2026
> Owner: Chau (founder)
> Purpose: Give any future AI session (Claude Code, Claude web) the context to make decisions aligned with the mission. Read this first before any major work.

---

## 🎯 The Mission

**Make MercyBlade the app that Vietnamese English learners publicly credit for their fluency, their IELTS score, their job abroad, their life change.**

Not "most users." Not "most revenue." **Most outcomes.** Everything else follows from that.

---

## 🧭 The Positioning Statement

> For Vietnamese learners preparing for IELTS, TOEIC, VSTEP, or real English fluency, MercyBlade is the only app designed specifically for them — with pronunciation coaching for Vietnamese-speaker pain points, grammar targeting Vietnamese transfer errors, and content rooted in Vietnamese cultural context. Unlike Duolingo (generic, translated to Vietnamese) or Cambly (expensive human tutors), MercyBlade combines AI-powered personalized teaching with deep Vietnamese-market specificity at a price Vietnamese learners can afford.

---

## 🛡️ Non-Negotiable Principles

These override any feature request or short-term revenue opportunity.

### 1. Vietnamese-first, always
- Every feature, word, button, notification designed for Vietnamese learners
- Never generic English-learning features that happen to be translated
- If non-Vietnamese users feel slightly out of place using the app, that's **correct**

### 2. Outcomes > engagement
- We measure success by whether users get better at English, not how long they stay in the app
- No dark gamification, no manipulation, no streak-shaming
- If a feature boosts retention but hurts learning, reject it

### 3. Vietnamese teacher warmth
- Mercy (the teacher character) is warm, patient, respectful — like a favorite Vietnamese teacher
- Tone is encouraging, never punishing for mistakes
- Vietnamese cultural values: collective learning, respect, humility, family-adjacent trust

### 4. Mobile-first, phone-everything
- 90%+ of Vietnamese users are on phones
- Every feature must work perfectly at 375-414px width
- Offline-capable when possible (many users on limited data plans)
- Install size matters (keep under 500 MB ideally)

### 5. Kids mode is sacred
- Kids content is offline-first, no login friction, age-appropriate
- Never show monetization CTAs, save-to-notebook buttons, or adult content to kids
- Parents trust us with their children — don't break that trust

### 6. Price for Vietnamese purchasing power
- Never translate US prices to VND
- Target: 99k VND/mo basic, 199k VND/mo premium, annual ~1.5M VND
- Payment methods: MoMo, ZaloPay, VNPay, bank transfer (not just Stripe)
- Free tier generous enough to build habit, limited enough to drive conversion

### 7. Ship to real users, not to hypothetical perfection
- Weekly releases, small changes, listen to user feedback
- 3 Vietnamese user conversations per week, minimum
- Feature-flag risky changes, stage rollouts (VIP tier → free tier)

---

## 🎨 The Product Strategy

### What makes MercyBlade win

1. **Test-prep specialization** — IELTS, TOEIC, VSTEP tracks, not "general English"
2. **Pronunciation scoring** — phoneme-level, targets Vietnamese pain points (th, r, l, final consonants, stress, intonation)
3. **Grammar for Vietnamese transfer errors** — articles (a/an/the), verb tenses, plurals, question inversion
4. **Mercy the teacher character** — consistent, warm, memorable, bilingual
5. **Real content, not bite-sized** — "rooms" with deep material, not 30-second lessons
6. **Cultural fit** — examples use Vietnamese contexts (phở, Honda Wave, Tết, TCH), not Western defaults

### What MercyBlade does NOT do
- ❌ Compete with Duolingo on gamification (lose that game)
- ❌ Compete with Cambly on live tutors (different price point)
- ❌ Try to serve all global learners (dilutes Vietnamese focus)
- ❌ Ship features that boost vanity metrics but not outcomes
- ❌ Add "AI chat" without a specific learning job to do
- ❌ Copy Western app aesthetics if Vietnamese aesthetics serve users better

---

## 🎯 The Target Market

**Primary user: Vietnamese IELTS/TOEIC/VSTEP aspirant, 18-35, mobile-first**

Typical:
- Student preparing to study abroad, OR
- Young professional needing English for job promotion, OR
- Immigrant preparing for visa language requirement
- Has tried Duolingo (quit), tried YouTube (scattered), considered Cambly (too expensive)
- Pays $100-500/year for test prep already
- Has MoMo/ZaloPay set up

**Secondary users (later):**
- Vietnamese parents buying English for kids (kids mode)
- Vietnamese workers at multinational companies (business English)
- Vietnamese teachers using MercyBlade as supplement

**Explicitly NOT serving:**
- Complete beginners who need A1 basics (different app category)
- Native English speakers learning Vietnamese
- Non-Vietnamese learners globally

---

## 📈 Success Metrics (North Star)

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

## 🗺️ The Roadmap (ordered by impact)

### Phase 1: Foundation ✅ (near-complete, ~this week)
- [x] **Audio cleanup** — 53 loose `.mp3`s removed from repo root + 3 byte-identical music files deduped
- [x] **Supabase audio migration** — 3550/3550 files uploaded, `roomAudioResolver` + workbox signed-URL cache shipped, local fallback verified
- [x] **Personal notebook feature** — 6 commits (migration → service → hook → SaveWordPopup → review/list/panel → integration into `MercyTeacherTab` adult branch); kids branch untouched
- [x] **Responsive UI polish** — Home, TierIndex, MercyGuidePanel, MercySpeakTab, MercyTeacherTab, GrammarWritingTab, EnglishLogicTab all scale 375–1280px
- [ ] **iOS bundle size reduction** — IN PROGRESS. Async audio refactor landed (CC #1 + #2 in parallel); Supabase path is now single-source-of-truth via `toAudioKey` → `tryResolveLocal` → `resolveRoomAudioUrl` pipeline. Awaiting runtime verification (`DevAudioTest` harness + `verify-supabase-cutover.ts` script) before removing bundled `public/audio/*.mp3`.
- [ ] **iOS app submission** — NOT YET. Blocked on bundle size reduction above.

### Phase 2: Vietnamese-First Features (next 2 weeks)
- Vietnamese pronunciation-specific drills (th, r, l, final consonants)
- Grammar rooms targeting Vietnamese transfer errors
- Vietnamese cultural context in examples
- IELTS Speaking / TOEIC / VSTEP tracks
- Vietnamese TikTok content strategy launched

### Phase 3: Mobile Experience (next month)
- iOS + Android native apps
- Push notifications in Vietnamese
- Offline mode 100%
- Background audio
- Sub-500ms interactions

### Phase 4: Learning Science (month 2)
- Spaced repetition (part of notebook feature)
- Adaptive difficulty
- Phoneme-level pronunciation scoring (Azure Speech or similar)
- Writing feedback targeting Vietnamese transfer errors

### Phase 5: Business (month 2-3)
- Vietnamese payment methods (MoMo, ZaloPay, VNPay, bank transfer)
- Vietnamese-priced tiers
- Referral program
- Regional leaderboards (Hanoi vs HCMC)
- Email/push retention sequences

### Phase 6: Distribution (month 3-6)
- TikTok content strategy (primary channel)
- Facebook groups seeding
- YouTube SEO content
- Partnerships with Vietnamese IELTS centers
- Success story program

### Phase 7: Scale & Polish (ongoing)
- Creator program (Vietnamese teachers earn revenue)
- Community (Discord/Zalo)
- Continuous room quality audit
- Tech health (Sentry, CI/CD, staging env)

---

## 💰 The Business Model

### Pricing (final)
- **Free:** 50+ rooms, no ads, builds habit
- **Basic: 99,000 VND/month (~$4)** — all rooms, offline, no ads
- **Premium: 199,000 VND/month (~$8)** — Basic + AI feedback + pronunciation scoring + test prep
- **Annual: 1,490,000 VND (~$60)** — 40% discount vs monthly
- **Lifetime: 2,990,000 VND (~$120)** — captures "no subscriptions" crowd

### Payment
Must support: MoMo, ZaloPay, VNPay, bank transfer, credit card, Apple Pay, Google Pay.

### Unit economics target
- Customer acquisition cost: <$2
- Lifetime value: >$50
- Monthly cost per user (AI + hosting): <$1
- Gross margin: >80%

---

## 🤖 AI-Native Company Operating Model

MercyBlade is built as a **1-3 person company** using AI agents to do the work of 20 employees.

### Current AI leverage
- **Claude Code:** writes app code (this is live, today)
- **ElevenLabs:** generates Mercy + Josh voices
- **Claude API:** (future) room content, grammar analysis, pronunciation feedback

### Next AI automations to add (Phase 1 completion)
1. AI-generated new rooms (Chau edits, Claude drafts)
2. AI customer support tier 1 (email + in-app)
3. AI-generated Vietnamese TikTok scripts (translate + adapt)
4. AI error monitoring and fix suggestions

### AI agent discipline
- **Plan before code** — every feature gets a plan document first
- **Parallel agents with clear scope** — one repo, multiple agents, non-overlapping file territories
- **Permission whitelist** — auto-run read, ask before write/commit/push
- **Migrations always reviewed** by human before commit
- **No pushing to production without human approval**

---

## 🇻🇳 Distribution Strategy (Vietnam)

### Primary channels (dominate these)
1. **TikTok** — short clips, pronunciation tips, "Vietnamese people say ___ wrong"
2. **Facebook groups** — IELTS study groups, English teacher groups (be helpful, not spammy)

### Secondary channels
3. **YouTube** — long-form SEO, "IELTS Speaking 7.0 guide for Vietnamese"
4. **Zalo** — community, announcements, support
5. **Partnerships** — Vietnamese IELTS prep centers (IDP, British Council, local schools)

### Skip (low ROI)
- Twitter/X (low Vietnamese usage)
- LinkedIn (wrong demographic)
- Google Ads (expensive for this market)
- Reddit (low Vietnamese usage)

### Content types that work in Vietnam
- Before/after pronunciation clips (goes viral)
- "Common mistake Vietnamese speakers make" (educational + shareable)
- Student success stories (testimonials)
- Teacher personality content (Mercy the character)

---

## 🏛️ The Competitive Moat

Things competitors can't copy quickly:

1. **Vietnamese founder making product for Vietnamese users** — cultural fit can't be faked
2. **510+ bilingual rooms of curated content** — expensive to replicate
3. **ElevenLabs Mercy + Josh voices** — consistent brand voice
4. **Vietnamese-specific pronunciation + grammar content** — requires domain expertise
5. **Community of Vietnamese teachers (future)** — platform effects
6. **Brand: Mercy the teacher character** — becomes recognizable

Things competitors CAN copy quickly (don't rely on these for moat):
- Spaced repetition
- AI chat
- Generic gamification
- Basic pronunciation scoring

---

## 🚨 The Biggest Risks

### External risks
- **Duolingo targets Vietnam harder** → respond by doubling down on Vietnamese specificity
- **OpenAI / Anthropic release consumer education apps** → focus on distribution and community, not just tech
- **Vietnamese regulatory changes** (data, payments, content) → stay local, partner with Vietnamese legal advice

### Internal risks
- **Feature creep dilutes Vietnamese focus** → North Star document (this) is the defense
- **Founder burnout** → AI automation and small team, not growth at all costs
- **Content quality drift** → periodic audit, kill underperforming rooms
- **Tech debt accumulates** → refactor sprints every quarter

---

## 🧠 Decision Framework

When facing any decision — feature request, design choice, business option — ask these in order:

1. **Does this help Vietnamese learners succeed?**
2. **Does this reinforce the Mercy brand and teacher warmth?**
3. **Does this work on a 375px phone?**
4. **Can 1 person build/maintain this with AI help?**
5. **Is the effort justified by the impact?**

If any answer is "no," reconsider or reject.

---

## 📚 The Founder's Commitments

I (Chau) commit to:

1. Talk to **3 Vietnamese users per week** (minimum)
2. Ship **something every week** (even small)
3. Review **metrics weekly** (MAU paying, retention, NPS)
4. **Say no** to features that don't serve the Vietnamese learner
5. **Build in public** — share progress in Vietnamese on social media
6. Use AI as **leverage**, not as the product itself
7. Protect **kids mode** from all monetization pressure
8. **Don't burn out** — AI does the work; I do the thinking

---

## 🎓 Learning Capture

Every session, I learn:
- A new technical concept (git, TypeScript, Supabase, etc.)
- A new AI/agent workflow pattern
- A new business/product insight

These compound. In 12 months of learning-while-building, I'll be senior-level at:
- Full-stack product development
- AI agent orchestration
- Vietnamese consumer app building
- Language-learning product design

---

## 🔑 How Future Sessions Should Use This Document

### When starting a new Claude Code session
Paste the first 3 sections (Mission, Positioning, Principles) at the top of your prompt. Then describe the specific task.

### When starting a new Claude web chat
Upload this file or paste the link. Say: "Read this, then help me with [task]."

### When facing a big decision
Re-read sections 4 (Principles), 7 (Strategy), and 11 (Decision Framework).

### When feeling lost or off-track
Re-read section 1 (Mission). If the work doesn't serve the mission, stop doing it.

---

## 📝 Changelog

### April 20, 2026 — v1.0
- Initial document created after strategic deep-dive session
- Synthesizes: responsive UI work, audio migration plan, notebook feature decision, Vietnamese market strategy discussion
- Current state: Phase 1 Foundation in progress (audio cleanup + Supabase migration + notebook feature)

### April 20, 2026 (evening) — v1.1
- Completed Phase 1 Foundation: audio cleanup, Supabase migration (3550/3550 files), notebook feature (6 commits), responsive UI, tech debt documentation
- Applied notebook table manually to Supabase (CLI repair deferred)
- 12+ commits pending push (holding for runtime tests)
- Next: runtime verification of Supabase audio cutover, then push, then iOS submission prep

### April 20, 2026 (late evening) — v1.2
- Phase 0 contract locked for async audio refactor (CC #1 + CC #2 aligned on `toAudioKey`, `tryResolveLocal`, `resolveRoomAudioUrl` with `bustCache` option)
- CC #2 shipped: `useAudioUrl` hook + 19-case vitest suite (`1d12436a`), `DevAudioTest` harness at `/dev/audio-test` dev-only route (`e9ee788d`), `scripts/verify-supabase-cutover.ts` post-deploy check with supabase-vs-fallback source reporting (`45b0021e`)
- CC #1 shipped in parallel: resolver foundation (`624cfc52`), plus consumer migrations (TalkingFacePlayButton, AudioPlayer, RoomRendererUI)
- Async audio path now single source of truth; kids/music invariant enforced at multiple layers (`toAudioKey` preserves subdir, `tryResolveLocal` short-circuits before any Supabase call)
- Next: runtime tests via harness + verify script, bundled-audio removal, iOS submission prep

---

*This document is living. Update it as the business evolves. Never let it become stale dogma — it's a compass, not a cage.*


---

## 🛠 Deferred Tech Debt

Things that aren't broken for users but need fixing eventually. Ordered by priority.

### Fix Supabase migration drift
- `supabase migration list` shows stuck 20260321 duplicate row in remote schema_migrations
- 4 migrations marked pending remotely but some may already be applied manually:
  - 20260321 (stuck duplicate)
  - 20260402
  - 20260403
  - 20260420000038
- Notebook migration (20260420225840) applied manually via SQL Editor — works, but not in CLI state

**Fix process (~30-45 min, do when no ship pressure):**
1. Audit remote schema — for each pending migration, check if tables/columns actually exist in Supabase
2. For each one already applied manually: `supabase migration repair --status applied <timestamp>`
3. For 20260321 stuck row: `supabase migration repair --status reverted 20260321`
4. Run `supabase migration list` → verify clean state
5. Confirm `supabase db push` works for future migrations

**Why deferred:** Manual SQL Editor works fine for now. CLI only needed for CI/CD automation, which we're not using yet.
**Priority:** Medium (blocks CI/CD automation)
**Est:** 30–45 min

### Fix Vite circular chunk warning
- Build output shows: `Circular chunk: ui -> vendor -> ui. Please adjust the manual chunk logic for these chunks.`
- Build completes successfully, but can cause subtle loading issues on first load for some users

**Fix:** Review `vite.config.ts` manual chunk config; decouple `ui` and `vendor` dependencies.
**Priority:** Low (not affecting users yet, may cause flaky first-load behavior)
**Est:** 20–30 min

### Add retry-with-backoff to audio upload script
- `scripts/upload-audio-to-supabase.ts` has no retry logic
- 2 of 3550 files failed on first bulk run due to transient errors (recovered manually)
- For any future bulk re-run, add retry wrapper around `uploadOne()` (3 attempts, exponential backoff)

**Priority:** Low (only matters if we re-run bulk upload)
**Est:** 15 min

### Clean up 2 failed audio uploads
- 2 files got "Bad Request" from Supabase during bulk upload:
  - `kautilya_vol2_7_en.mp3` (2.7 MB)
  - `legacy_vip4_01_en.mp3` (297 KB)
- Safety net: local fallback in audio resolver means users still hear audio from bundled files
- Root cause: unclear (transient API issue vs content issue vs naming)

**Fix:** Investigate with verbose error logging, retry individually. Document the root cause.
**Priority:** Low (fallback covers it)

### Clean up orphan_candidates.txt scratch file
- `orphan_candidates.txt` at repo root — scratch file from audio audit
- Should be deleted and added to `.gitignore`

**Fix:** `rm orphan_candidates.txt && echo "orphan_candidates.txt" >> .gitignore`
**Priority:** Very Low (just clutter)
**Est:** 2 min

### Supabase Storage signed-URL bug (blocks iOS bundle reduction)
Symptoms:
- createSignedUrl returns 400 with "new row violates row-level security policy"
- Persists with fully permissive RLS policies (authenticated ALL on storage.objects)
- authenticated_read_buckets policy on storage.buckets is present
- Valid JWT session (chaudoan@yahoo.com, 857-char token)
- Bucket is private, no size/MIME restrictions

Attempted fixes that didn't work:
- SELECT-only policy on storage.objects
- INSERT+SELECT policies
- Single ALL policy (permissive)
- Policies on storage.s3_multipart_uploads
- Policies on storage.buckets

Not yet investigated:
- Supabase docs on createSignedUrl internals
- Whether bucket was created via API vs dashboard (may matter)
- Supabase support ticket

Priority: HIGH (blocks removing 2.6 GB bundled audio, blocks iOS submission)
Est: 30-60 min fresh debugging tomorrow

### Remove bundled audio after Supabase cutover verified
- Currently both Supabase AND local audio coexist
- After runtime tests confirm Supabase path works, remove `public/audio/*` files (kids audio stays)
- This is the whole point of Phase 2 — reduce iOS bundle from 3.9 GB to ~200 MB

**Fix:** After runtime tests pass (via `DevAudioTest` harness at `/dev/audio-test` + `scripts/verify-supabase-cutover.ts`): `git rm public/audio/*.mp3` (exclude kids folder), rebuild, commit, push.
**Priority:** High (this is how we unlock iOS App Store submission — 3.9 GB → ~300 MB)
**Est:** 1 hour (careful staged removal + verification)

### Telemetry for audio fallback events
- `useAudioUrl` surfaces `error` when the resolver falls back to local; no system currently logs these.
- When a monitoring backend exists, add an `onError` callback or standalone reporter that ingests `{ key, error.message, timestamp }` so we catch Supabase degradation before users notice.
**Priority:** Low (fallback still plays)
**Est:** 30 min once monitoring exists

### Delete resolveRoomAudioUrlSync if fully unused post-migration
- CC #1 kept `resolveRoomAudioUrlSync` during the Phase 2 migration as a safety hatch for non-React callers.
- After Phase 2 consumer migration is complete, grep for callers; if zero, remove it to shrink surface area.
**Priority:** Very Low
**Est:** 10 min

