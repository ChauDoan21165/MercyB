# V4 EXECUTION PLAN — Operating Orders for CEO-1

Source strategy: MercyBlade-Strategy-V4.md (canonical).
This file turns the V4 roadmap into concrete, sequenced work.
Owner of this file: CEO (Claude chat) via Chau. CEO-1 executes.

---

## HOW CEO-1 USES THIS FILE

- Work top-down through phases. Phase 0 blocks everything — finish it first.
- Inside a phase, run workstreams IN PARALLEL on file-disjoint agents.
- Each task has DONE-WHEN criteria. A task is not done when the MR merges —
  it is done when DONE-WHEN is verified true in production or against prod data.
- Standing priority rule (from V4): trust-floor bugs outrank feature work,
  always. If a new trust-floor bug appears, it preempts the current phase.
- Auto-merge authority unchanged: green MRs yes, EXCEPT billing / auth /
  destructive SQL / store-submission config — those wait for Chau.
- Call Chau (say command) only for items on the CHAU-ONLY list or interactive
  prompts. Everything else: decide and proceed.
- Report format, end of each day, appended to board:
  `V4-EXEC STATUS: Phase X — done: [...] — in flight: [...] — blocked: [...] — next: [...]`

---

## CHAU-ONLY TASKS (CEO-1 cannot do these — surface them, never block on them silently)

- C1. Set env vars in Cloudflare Pages dashboard (list comes from API-port agent).
- C2. Apple Developer account actions: certificates, App Store Connect,
      TestFlight invites, tax/banking completion (CIBC format, CRA number).
- C3. Pricing decisions: final EN-native USD tiers; approve any iOS IAP price
      offset above the VN web price.
- C4. Recruit the beta cohort (100–300 learners) from his channels; approve
      the invite message wording.
- C5. Approve the free-taste experiment flag flip (Phase 1, after cost data).
- C6. Record/approve success-story content; approve any public marketing copy.
- C7. Password-manager / 2FA / recovery-code sweep (resilience R1).

---

## PHASE 0 — UNBLOCK (target: days, not weeks)

The engine is the product. Nothing in later phases matters until the
conversation engine runs end-to-end in production.

### 0.1 Port /api/mercy-ai and /api/tts to CF Pages Functions  [CRITICAL PATH]
- CF Pages Functions format: functions/api/*.ts, onRequestPost(context),
  secrets via context.env (never process.env), Workers runtime (no Node-only
  APIs, use fetch). Preserve request/response contracts exactly.
- In /api/tts: add language routing so Vietnamese text uses an Azure vi-VN
  voice (fixes BUG3) and verify Azure path is actually hit (fixes BUG2).
- Output: list of remaining functions/ files that would break deploys once
  the mv-functions-aside step is removed (list only, do not port).
- Output: new deploy command without the mv dance + exact env var list → C1.
- DONE-WHEN: curl to both endpoints on mercyblade.com returns valid responses
  with real keys; Vietnamese sample text returns vi-VN audio.

### 0.2 Conversation engine integration (A1 orchestrator)
- Integrate all merged leaf modules into conversationEngine.ts.
- Merge stragglers: !626 (AI client), !623 (pronunciation adapter — if
  failure is f0PitchExtractor timeout, retry job, don't touch code),
  !622 (final 4 themes — fix pipeline).
- DONE-WHEN: a full 10-turn conversation completes in PRODUCTION on a premium
  test account: topic held, corrections sane, telemetry events visible,
  capture consent-gated, 50-turn cap enforced.

### 0.3 Trust-floor bug sweep
- BUG1 (semantic-nonsense corrections): fix belongs in the GPT-4o quality-
  gate prompt INSIDE the integrated engine — schedule immediately after 0.2,
  not before. Add a regression case to contract tests.
- BUG2/BUG3: resolved by 0.1 — verify, don't assume.
- DONE-WHEN: all three bugs have a failing-then-passing test or documented
  prod verification.

### 0.4 Deploy + verify
- Deploy after each merge wave (standard command until 0.1 lands, new
  command after). Verify /ai-tutor 200, hard-reload service worker note.
- DONE-WHEN: prod bundle matches main HEAD; smoke pass on auth, /ai-tutor,
  one paid flow.

### 0.5 Cleanup (fill idle capacity only)
- Revert canary subscription current_period_end (chaudoan@yahoo.com,
  397a6ab7) to 2026-05-09 01:19:27+00 — billing-adjacent: prepare the SQL,
  Chau executes.
- Rotate R2 API token; delete old CDGPG_Key GPG keys.

---

## PHASE 1 — MEASURE + SMALLEST VIABLE MOAT (start as Phase 0 winds down)

V4 rule: nothing counts as a win until it moves retention or a measured
outcome. Phase 1 makes that measurable.

### 1.1 Measurement floor
- Wire onboarding telemetry (logTelemetry → real trackEvent/gtag; it
  currently only console.logs — known dark spot).
- Add web-vitals RUM → GA4 (LCP/INP/CLS/TTFB from real users), flag ON prod.
- Retention dashboard: D1/D7/D30 per V4 definition (retention_loop WIN,
  3 distinct client-stamped local-days in rolling 7d). One query or view,
  read-only, anon REVOKEd, Chau can run it weekly.
- DONE-WHEN: Chau can answer "what is D1/D7 this week" from one place.

### 1.2 Data flywheel verification (Moat 3)
- Verify conversationCapture writes real consented sessions in prod.
- Define the feedback loop: monthly job/agent that mines captured errors for
  new interference candidates → guard queue → live rules. First cycle run
  manually as proof.
- DONE-WHEN: ≥1 new interference rule shipped that originated from captured
  prod data, with provenance noted.

### 1.3 Free-taste experiment readiness (do not flip without C5)
- Instrument cost-per-conversation-session (tokens + TTS) in telemetry.
- Build the flag path: N free conversation turns/week for free tier,
  one-flag flip, entitlement isolation verified.
- DONE-WHEN: cost/session number reported to Chau + flag tested in dev.

### 1.4 Retention loop hardening
- Flip CONVERSATION_RETENTION_HOOKS ON in prod once engine is stable (0.2
  done + 48h clean).
- Fix the known broken unsubscribe tokens in weekly-progress and
  streak-reminder emails and close the send-redeem-email open relay —
  these emails are the retention channel and currently violate CASL.
- DONE-WHEN: retention emails send, unsubscribe works, relay closed.

### 1.5 k6 + Playwright budgets (idle capacity)
- k6 scripts vs API endpoints at 50/200/500 VUs (read-only targets).
- Playwright perf budgets in CI (route interactive < 4s throttled,
  main bundle < 250KB gzip).
- DONE-WHEN: breaking-point numbers reported; budget gate live in pipeline.

---

## PHASE 2 — STORES, IN PARALLEL (starts now, not after Phase 1)

V4: ship to stores in parallel with engine completion. Web app stays the
primary, censorship-resistant channel forever.

### 2.1 Submission blockers
- Account-deletion guard: verify complete end-to-end (submission blocker).
- Audit against current App Store / Play data-safety + privacy-label
  requirements; generate the label answers from actual code behavior
  (capture consent, analytics, email).
- DONE-WHEN: blocker checklist all green; Chau has label answers ready.

### 2.2 Payment architecture per V4 (platform-tax fix)
- Web checkout (existing Stripe + VN methods) confirmed as primary path;
  app reads entitlement from account — verify on iOS/Android builds.
- iOS IAP products created for compliance (config prepared; Chau executes
  in App Store Connect — C2/C3). Apple Small Business Program enrollment
  noted for Chau.
- HARD RULE: no steering/link-out tricks that risk the listing. Implement
  exactly what current store rules allow at submission time — agent must
  verify current rules, not assume.
- DONE-WHEN: a fresh iOS build purchases via IAP sandbox AND recognizes a
  web-purchased entitlement.

### 2.3 Builds
- Capacitor iOS/Android builds green on Node 24 pipeline, audio paths
  verified on device (TTS, recording, pronunciation).
- TestFlight build delivered to Chau (C2).
- DONE-WHEN: Chau runs a full lesson + conversation on a real phone from
  TestFlight/internal track.

---

## PHASE 3 PREP — BETA COHORT + STORY ENGINE (agents support, Chau leads)

Trickle acquisition starts NOW per V4 — not at launch.

### 3.1 Cohort infrastructure
- Invite/access codes for 300 beta learners (existing gift-code rails),
  cohort-tagged in analytics so their D1/D7/D30 reads separately.
- One feedback surface: in-app "Tell Chau" button → table Chau reads
  (no new vendor, no cost).
- Weekly cohort report auto-generated to board: actives, D1/D7, top errors
  hit, conversation sessions, abstention rate.
- DONE-WHEN: first weekly report generated from real cohort data.

### 3.2 Success-story pipeline
- Consent-gated story capture: when a learner hits a milestone (streak,
  level-up, first 10-turn conversation), prompt: "Chia sẻ câu chuyện của
  bạn?" → stored for Chau's review (C6).
- DONE-WHEN: ≥2 reviewable stories in the queue.

### 3.3 Marketing assets bank (idle capacity, low priority)
- Demo clips: tone-grading demo, family-bridge demo, ELSA comparison page
  draft using the V4 positioning line ("ELSA fixes your sounds. MercyBlade
  fixes your English.") — drafts only, Chau approves all public copy (C6).

---

## RESILIENCE TRACK (continuous, one small task per week)

- R1. Credential sweep: inventory all vendor accounts, 2FA everywhere,
  recovery codes offline (Chau executes — C7; agent prepares the checklist).
- R2. Repo mirror beyond GitLab (second remote, push on merge to main).
- R3. Backup restore DRILL: actually restore a nightly DB backup to a scratch
  project and verify row counts — a backup never restored is a hope.
- R4. Exit-path docs per vendor (CF Pages, Supabase, R2, GitLab): one page
  each — how we leave in 48h. Live in docs/resilience/.
- R5. PWA parity check each release: every store feature works on web.
- DONE-WHEN (track-level): restore drill passed once; mirror live; docs exist.

---

## METRIC GATES (from V4 — CEO-1 enforces)

- Floor breach rule: if cohort D-metrics sit below V4 floor (D1 25% / D7 10%
  / D30 5%) for two consecutive measured weeks → STOP new capability work,
  reassign all agents to retention diagnosis. Alert Chau.
- Cost rule: monthly AI+hosting cost/user must stay < $1. Cost/session
  telemetry (1.3) feeds this. Breach → diagnose driver before any
  re-platform talk (V4 master rule).
- Token rule: learner-tomorrow test on every dispatch; ≤10 concurrent
  agents; no idle agents; file-disjoint ownership.

---

## SEQUENCING SUMMARY

Week 1:        0.1 → 0.4 deploy → 0.2 → 0.3   (+ 2.1, R2 in parallel)
Week 2:        1.1, 1.2, 1.4                   (+ 2.2, 2.3, R3)
Week 3:        1.3 + cost data → C5 decision   (+ 3.1, R4)
Week 4:        3.1 live cohort + first weekly report; 3.2; store submission
               when C2/C3 complete.
Continuous:    trust-floor preemption, resilience track, metric gates,
               daily V4-EXEC STATUS line on the board.

The single sentence that resolves every priority conflict:
**the engine running trustworthily in production for a measurable cohort
beats everything else.**
