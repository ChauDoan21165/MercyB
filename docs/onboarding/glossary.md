# Glossary

> Every project-specific term that appears in our docs but isn't
> standard English. Skim once to get a feel for the vocabulary;
> reference later when a doc uses a term you're not sure about.
>
> Terms are grouped by domain. Within each group, terms are
> alphabetical.

---

## Strategic / product terms

### A-side, C-side
The two main "lanes" of work that the planner agents (A1, A2, …,
C1, C2, …) operate on. **A-side** is the *Vietnamese-learners-
studying-English* flagship pair (~95% of effort). **C-side** is
the *English-native-learning-target-language* axis
(~5% of effort, covering KO / JA / ZH / FR / DE / ES / Vietnamese-
for-foreigners). See `docs/architecture/system-overview.md`
§"Conventions" for the full lane map (also includes **Kids** and
**Platform**).

### CC1, CC2, CC4B, …
Older labels for Claude Code agent instances ("CC" = Claude
Code), now mostly superseded by the A/C lane labels. Some memory
entries still use them. See memory: `feedback_universal_report_prefix`
and `feedback_all_agents_report_prefix`.

### Definition of Done (DoD)
The §15 section of `CURRENT-STATE.md` — a checklist of artefacts that
must land on `origin/main` before the flagship is "done enough to
start serious work on a second pair". Each criterion is testable,
not vibes. Currently 9 of 13 boxes ticked.

### Doctrine
A docstring at the top of a load-bearing file that explains
**why** the code is the way it is. Examples:
`src/router/AnonymousOnboardingGate.tsx`,
`src/lib/roomAudioResolver.ts`,
`src/lib/ai-tutor/types.ts`. "Doctrine block" is the comment;
"doctrine" alone often refers to the rule the block encodes.

### Duolingo competition strategy
The Competitive thesis in `STRATEGY.md` (V3) — the positioning thesis that
MercyBlade wins over Duolingo for Vietnamese↔English by depth,
real teacher persona, L1 awareness, and honest outcomes — NOT by
matching Duolingo on gamification. The competitive thesis: *"what
Duolingo structurally cannot be"*.

### Lane
An owner-grouping of work. Four lanes: A-side, C-side, Kids, Platform.
See `docs/architecture/system-overview.md` §"Conventions".

### Pair matrix
MercyBlade is a 2-native × 8-target matrix product — up to 16
learning pairs. The "matrix" is the product surface; the "pair"
is one cell. See `STRATEGY.md` §4 ("The Learning-Pair Matrix").

### Stage 3 (3A / 3B / 3C / 3D)
The four-brick **Study OS** sequence in `layer-model.md`. 3A = Local
Weakness Map ("What I'm Weak At"). 3B = Suggested Practice (soft,
dismissible suggestions). 3C = Review Queue (local spaced
repetition). 3D = Mastery Map (deferred). All four operate
**local-only** by design (no Supabase, no `mercy_user_facts`
write, no placement writeback). See
`docs/architecture/systems/study-os-stage-3.md`.

### Vietnamese-first
The product principle that Vietnamese is the primary language for
every learner-facing surface; English is secondary. The reverse
track (English speakers learning Vietnamese / KO / JA / …) is
real product but is not "Vietnamese-first" — it's a different
axis of the same matrix. See `CLAUDE.md` non-negotiable #1.

### Vinglish
The English-with-Vietnamese-L1-interference dialect. The detector
(`src/lib/feedback/vinglish-detector.ts`) is the one that catches
calque patterns specific to VN→EN.

---

## Architecture / technical terms

### Adapter (in Stage 3A context)
A small pure module that **mirrors** a signal from a source (the
L1 detector, placement, or pronunciation scoring) into a local
`localStorage` ring buffer for Stage 3A to read. Three of them:
`l1TagAdapter.ts`, `placementSnapshotAdapter.ts`,
`pronunciationAdapter.ts`, all under `src/lib/stage-3a/adapters/`.
Adapters NEVER write to Supabase.

### AI_TUTOR_ENABLED
A const flag in `src/lib/ai-tutor/types.ts`, currently `false`.
When false, the entire next-generation AI Tutor library is
tree-shaken out of production. The live tutor today goes through
the `guide-assistant` edge function instead. See
`docs/architecture/systems/ai-tutor.md`.

### Anonymous bootstrap
The flag-gated `signInAnonymously()` call at app boot
(`src/lib/auth/anonymousBootstrap.ts`) that gives a visitor a
real Supabase JWT *before* signup, so cloud features (pronunciation
scoring) work for anonymous users. Gated behind
`anonymous_auth_enabled` flag for kill-switch safety.

### AnonymousOnboardingGate
The root-route gate (`src/router/AnonymousOnboardingGate.tsx`)
that decides what a visitor sees at `/`. First-time anonymous +
no stored pair + no CTA signal → marketing landing. Returning
anonymous OR signed-in → Home. The doctrine block at the file
head is load-bearing — `STRATEGY.md` §6 documents the
2026-05-18 doctrine update.

### Boot error buffer
The bounded in-memory queue (`src/lib/monitoring/bootErrorBuffer.ts`)
that catches `window.error` / `unhandledrejection` before Sentry is
initialized. On first capture it triggers Sentry activation; once
Sentry is up, the buffer flushes. 10-second hard cap. See
`docs/architecture/systems/observability.md`.

### calculateScore
The room-search ranking function in
`src/lib/search/roomSearch.ts:119–122`. **Has a known +0.5
`hasData` ranking issue documented in the search-rooms deep-dive.**
Not proposed for fix in this doc series — requires a ranking-policy
decision.

### CC2 lane
The Kids surface. CC2 is the current owner. Other agents do not
touch kids files without explicit redirection.

### Crisis gate
The pre-LLM keyword check in `supabase/functions/guide-assistant/index.ts`
that returns the `SAFE_RESPONSE` (`_shared/crisisResponse.ts`)
when input contains self-harm / medical-crisis keywords. Runs
before any AI call. EN + VN keyword sets.

### `current_period_end`
The Supabase `subscriptions` table column that the entitlement
derivation uses to decide expiry. Combined with `status` and
`provider`, this is the **only** input to entitlement. **Never
gate on `price_id`** and **never gate on `profiles.tier`**. See
`docs/architecture/systems/billing-entitlement.md`.

### Detector / L1 detector
The per-turn function (`detectErrors` in
`src/lib/feedback/l1-error-detector.ts`) that flags Vietnamese L1
transfer errors in English output. Produces `L1WeaknessTag`
strings; eval baseline at `evals/.baseline.json`.

### Directional writeback contract
The rule (the **Placement Writeback Boundary** in `placement-v3.md`)
that **only the placement engine
itself** may write to `profiles.placement_*` /
`placement_sessions` / `placement_responses`. Stage 3A's
placement snapshot adapter is a *read-side mirror only* — it
reads the server's authoritative state into localStorage but
never writes back.

### `entitlement_events`
The Supabase table that records every webhook event processed
(per provider, per event_id) for idempotency. Replays are
silently no-ops via `hasProcessedEvent`. See
`docs/architecture/systems/billing-entitlement.md`.

### Fluid Compute
Vercel's default function runtime since Edge Functions were
deprecated. Pre-2026-05-27 migration, this repo ran the
Vercel-style serverless functions under `api/*` on Vercel's Fluid
Compute. Post-migration the primary host is Netlify; Vercel is
retained as the documented recovery host
(`docs/runbooks/disaster-recovery.md`). Today's `api/*` entries
(per `vercel.json`) are `mercy/grammar`, `mercy-ai`,
`mercy-feedback`, `mercy-guide`, `tts` — **NOT the Stripe webhook**.
The Stripe webhook is a separate **Supabase edge function** at
`supabase/functions/stripe-webhook/` (see
`docs/architecture/systems/billing-entitlement.md` §5d for the
verified treatment).

### `getMeEntitlement`
The browser-side helper (`src/lib/getMeEntitlement.ts`) that
invokes the `me-entitlement` Supabase edge function and returns
the user's current entitlement. Cached under `qk.entitlement(userId)`
in TanStack Query so concurrent callers share one request.

### Guide-assistant
The live production AI tutor edge function
(`supabase/functions/guide-assistant/index.ts`). The "next-generation"
tutor at `src/lib/ai-tutor/*` is dark / not yet live. See
`docs/architecture/systems/ai-tutor.md` for the dual-layer reality.

### `hasData`
A boolean on each `RoomMeta` indicating whether the room has
authored content (vs. a placeholder). Surfaces in
`src/lib/search/roomSearch.ts` as a `+0.5` ranking bonus — see
"calculateScore" above for the known issue.

### IRT / 2PL IRT
**Item Response Theory**, specifically the **two-parameter
logistic** variant. The math underlying placement v3's adaptive
ability estimation. See
`docs/architecture/systems/placement-v3.md`. Pure math kernel at
`supabase/functions/placement-session/engine/irt.ts`.

### L1 (and L1 profile, L1 detector, L1 signal)
**L1** = a learner's first language. **L1 profile** is the data
structure documenting common interference patterns from L1 into
the target language — e.g. `vietnameseL1Profile` in
`src/lib/l1-profiles/vi.ts` for VN→EN learners,
`englishL1Profile` in `src/lib/l1-profiles/en.ts` for EN→VN. **L1
detector** is the rule pack that flags those patterns in real
input. **L1 signal** is one detection result (a `L1WeaknessTag` +
metadata).

### Lane (in agent context)
See "A-side, C-side" above.

### Local-only posture
The strategic constraint from `layer-model.md` §"Local-Only Posture"
that Stage 3 reads + writes only `localStorage`, never Supabase.
"Broken only when a *named, high-value reason* emerges — not when
it feels ready, not when it would be convenient."

### Locked #14, Locked #16, Locked #7
References to Chau's locked dispatch directives ("Locked #N").
- **#14**: the anonymous picker is the entry point pre-signup.
- **#16**: when push is authorized in the dispatch, push without
  re-confirming. (`PRINCIPLES.md` §16.)
- **#7** and **#15**: content-readiness honesty + privilege-frozen
  profile columns.
These are referenced by file-head comments and by memory entries.

### `me-entitlement`
The Supabase edge function (`supabase/functions/me-entitlement/`)
that derives and returns the current user's entitlement. The
canonical read path; browser code goes through
`getMeEntitlement` → `useEntitlementQuery` rather than computing
entitlement client-side.

### Mercy / Teacher Mercy / Mercy Kids
- **Mercy** is the AI teacher persona — the brand voice. Lives in
  `src/lib/teacher-mercy/*` + `src/config/mercyPersona.ts`.
- **Teacher Mercy** is the canonical full name (not "host" — that's
  a legacy term).
- **Mercy Kids** is the kids surface that uses a simplified version
  of Mercy. Sacred (CLAUDE.md non-negotiable #2). CC2's lane.

### Mercy Guide
The floating in-room tutor panel (`src/components/mercy-guide/`)
that surfaces Mercy *inside* a lesson. Hosts 5 tabs (Teacher /
Suggest / Speak / Logic / Guide). Distinct from the AI Tutor
(which is one specific tab inside this panel). See
`docs/architecture/systems/mercy-guide.md`.

### `mercy_user_facts`
A Supabase table that stores **semantic person memory** — what
Mercy remembers about a learner *as a person* (name, goals,
ongoing context). Owned by the teacher-mercy engine. **Not the
same as Stage 3A's behavioral signal** (which is local-only and
never syncs into this table). See the **Study OS Summary Boundary**
in `study-os-stage-3.md`.

### Mock provider
The deterministic test-double provider for the dark AI Tutor
library (`src/lib/ai-tutor/mockProvider.ts`). When
`AI_TUTOR_ENABLED` is false, this is the *only* "provider" — no
real OpenAI/Anthropic/DeepSeek call.

### Pair-aware rendering
Home's behavior of rendering a different surface based on the
visitor's (native, target) language pair. Pair comes from
`mercyblade.languagePair` localStorage (anon) or
`profiles.native_language` + `profiles.target_languages`
(signed-in). See
`docs/architecture/systems/onboarding-language-pair.md`.

### Picker (the picker)
The 3-step onboarding FSM at `/onboarding` —
`native` → `target` → `start_with`. The anonymous-first entry
point per Locked #14. See `src/pages/onboarding/OnboardingPage.tsx`.

### Placement v3 (vs v4, vs v5)
Versioned placement engine iterations. **v3** is the production
adaptive 2PL IRT engine that just shipped §15 Bar #5. v4 and v5
are next-generation iterations (different from v3 — they're not
just numerical bumps; they're separate engine codebases). Import
discipline: do not import across version boundaries — each version
is self-contained.

### Platform fork (Sentry)
The `sentryInit.ts:200–257` branch that uses `@sentry/capacitor`
on native and `@sentry/react` on web. Without the fork, native
init can hang and silently drop every event. See
`docs/architecture/systems/observability.md`.

### `profiles.tier`
The legacy tier column on the `profiles` table. **Read-only from
the browser** since the #578 RLS freeze. New code reads
**entitlement** (the `me-entitlement` derived state), not
`profiles.tier`. See
`docs/architecture/systems/billing-entitlement.md`.

### Pronunciation v1 vs cloud scorer
**Cloud scorer** is Azure-backed phoneme accuracy
(`src/lib/pronunciation/cloudScorer.ts`); requires a JWT. **Local
scorer** is the Needleman-Wunsch fallback (`scorer.ts`); runs
without auth but doesn't return per-phoneme detail.

### Re-land
A PR that re-applies work from a previous PR that was lost (often
because the previous PR was squash-merged on top of a stale base
or the work was orphaned by a force-push). Commit messages will
say things like *"re-land #1189"*. Memory:
`feedback_stacked_pr_squash_orphan`.

### Recompute (recompute entitlement)
The pipeline (`recomputeAndPersistEntitlement.ts`) that runs on
every subscription webhook: read `subscriptions` for the user,
derive entitlement, persist `profiles.premium_*`. Idempotent on
identical inputs. See
`docs/architecture/systems/billing-entitlement.md`.

### Ring buffer
A capped, FIFO list used by Stage 3A's adapters. New entries
push out the oldest when the cap is reached. See
`docs/architecture/systems/study-os-stage-3.md` §5c for caps.

### Room
A lesson unit. ~488 JSON files under `public/data/*.json`
(adult-side corpus); kids rooms live separately
(`src/data/kids/`). Loaded via the room registry and rendered by
the room pipeline. See `ROOM_GUIDE.md` and
`docs/architecture/systems/search-rooms.md`.

### Room registry
The in-memory `RoomMeta[]` index built from `public/data/*.json`
at registry-generate time. Single source of truth for room
discovery + search. Lives in `src/lib/rooms/roomRegistry.ts`,
regenerated by the `rooms:check` prebuild hook.

### Route-gate (Sentry route-gate)
The mechanism (`src/lib/monitoring/sentryActivation.ts`) that
defers the ~156 KB Sentry chunk until one of three triggers
proves monitoring is needed this session: a boot error, an auth
verification, or an explicit `captureError` call. Without the gate,
static legal pages would pay the chunk cost for no reason.

### Service-role key (Supabase)
The high-privilege Supabase API key that bypasses RLS. **Never
in a file in the repo.** Lives in macOS Keychain under
`mb-supabase-service-role` for agents who need it. See memory:
`project_agent_infra_access`.

### Stage 3A signals
The behavioral signal buffers that Stage 3A's adapters write
into localStorage: `mb.stage3a.l1.recent` (L1 detector tags),
`mb.stage3a.placement.snapshot` (placement completion), and
`mb.stage3a.pronunciation.recent` (phoneme attempts).

### `subscriptions` (table)
The Supabase table storing one row per active or expired
subscription, per user, per provider. The **only** input to
entitlement derivation. Webhook-fed; idempotency via
`entitlement_events`. See
`docs/architecture/systems/billing-entitlement.md`.

### `tier` (and tier scripts, tier ceremonies)
Two different uses. (1) `profiles.tier` is the legacy premium-level
column (0 = free). (2) In Mercy's progression scripts
(`tierScripts.ts`, `tierCeremonies.ts`) "tier" refers to a learner's
*progression tier* in the lesson curriculum, not their billing
tier. Context disambiguates; in billing docs, tier always means
billing.

### `toAudioKey`
The pure, **idempotent** function (`src/lib/roomAudioResolver.ts`)
that normalizes any audio reference into a canonical key. The
while-loop on the `audio/` prefix is load-bearing — call sites
use it defensively, and "simplifying" it has broken playback
before. See `CLAUDE.md` "Audio resolution pipeline".

### VAR / vipN / `vip6_…`
Historical filename pattern for room JSON files (e.g.
`zhuge_liang_grand_strategy_vip9_vol2.json`). The `vipN` prefix
is **a filename pattern only** — there is no VIP tier in
MercyBlade. CLAUDE.md non-negotiable #5.

### Vinglish
See above under "Strategic / product terms".

### Vite `--strictPort`
The flag on `npm run dev` that makes Vite refuse to fall back if
port 3107 is in use. Deliberate — falling back silently is how
you debug your changes on the wrong port for an hour. Kill the
stale PID instead.

### Vinglish detector
The dialect detector at `src/lib/feedback/vinglish-detector.ts` —
catches Vinglish (VN-L1-interfered English) patterns specific to
the Vietnamese→English direction.

### Weakness map / weak-at
The Stage 3A surface that aggregates the local signal buffers
and surfaces "what you're weakest at" descriptively. **Read-only,
local-only, no recommendations** — Stage 3A is descriptive; Stage
3B is the suggesting one. See
`docs/architecture/systems/study-os-stage-3.md`.

### Weakness recommender (v1)
The server-state version of the same idea
(`src/lib/weakness/recommendationEngine.ts`) that reads from
`mb_user_weakness_profile` (Supabase view) and was in production
before Stage 3A's adapters landed. The two coexist — v1 is server
state; Stage 3A is local signal. See
`docs/architecture/systems/study-os-stage-3.md`.

---

## Operational / process terms

### Agent specialty tags (A1 / A2 / A3 / …)
Coarse role labels for agent dispatches. **A1 — Audit Sentinel**,
**A2 — Ops Restorer**, **A3 — Clean Extractor**, **A4 — Release
Gatekeeper**, **A5 — Merge Watcher**, **A6 — Mobile Diagnostics**.
See `PRINCIPLES.md` §18.

### Brief (the brief)
The prompt a planner gives an agent to start a task. Briefs
contain: agent id, worktree path, branch name, read-first list,
deliverables, constraints, gates, push authorization. See
`docs/contributing/agent-handoff.md` §6.

### Bar (Bar #1, Bar #6, …)
A criterion in `CURRENT-STATE.md` §15 (Definition of Done). E.g. Bar
#1 = "L1 grammar coverage gap closed"; Bar #6 = "Native crash
telemetry confirmed on-device". Each tick requires a named
artefact on `origin/main`.

### Cap sync (`npx cap sync`)
The Capacitor command that copies `dist/` into the native
projects and reinstalls pods. Required after every `npm run
build` if you're going to test on a native device. See
`docs/architecture/systems/native-shells.md`.

### Dispatch
A task assignment from a planner to an agent. "Dispatching A3"
means giving A3 a brief.

### Eval baseline
The `evals/.baseline.json` file — the golden pass-rate target
for the L1 detector against `evals/vi-grammar-cases.json`. §15
Bar #2 gates on this staying ≥ 95%.

### Gates (CI gates)
The three required checks every PR must pass: typecheck:ci, lint,
test. CI runs them; you run them locally with the same commands.
Sometimes informally extended to mean any pre-merge check
(e2e, rooms:check, validate-rooms).

### `gh` vs `glab`
**`gh`** is the GitHub CLI; **`glab`** is the GitLab CLI. This
repo is on GitLab now (since the 2026-05 migration), so the
canonical command is `glab mr create`, not `gh pr create`. The
former GitHub remote is preserved as `old-origin`.

### MR / PR
**Merge Request** (GitLab) vs **Pull Request** (GitHub). Same
concept; the migration left both terms in our docs. Treat them
as synonyms; current commands use MR.

### Memory (agent memory, `MEMORY.md`)
The persistent file-based memory store at
`~/.claude/projects/-Users-admin-MercyB/memory/`. Auto-loaded
every session for AI agents. Cited in our docs as
`[[memory_slug]]` or "memory: `project_foo_bar`". Not publicly
visible; cross-referenced so agents can navigate.

### Owner-gated
A criterion that depends on a human action (Chau testing on a
real device, Chau verifying an email, Chau ratifying content) —
not on code shipping. §15 Bar #6 ("native crash telemetry
confirmed on-device") is owner-gated.

### Place / placement / placement test
The adaptive English-level test that gives a Vietnamese learner
a CEFR band + flagged L1 interference patterns + recommended
starting room. Currently v3 in production. See
`docs/architecture/systems/placement-v3.md`.

### `prepare` (npm script)
Runs automatically after `npm install`. Installs git pre-commit
hooks via `scripts/setup-hooks.sh`. The reason you don't have to
manually `bash scripts/setup-hooks.sh` after cloning.

### Re-audit weekly (status docs drift)
The cadence from `PRINCIPLES.md` §9 — `STRATEGY.md` §6 ("Current
State") gets re-verified against actual code reality every 1–2
weeks. Optimistic claims that survive a week tend to be true.

### Re-land
See "Re-land" under architecture terms.

### Sub-skill / Skill (in the agent context)
A user-invocable workflow. The `Skill` tool invocation surface
has, e.g., `tech`, `email`, `content`, `supabase`, `sentry:*`,
`vercel:*`, `stripe:*`. See `docs/contributing/agent-handoff.md`
§2.

### Subagent
A nested Claude / GPT agent launched by another agent (via the
`Agent` tool) for a sub-task. Has its own context, separate from
the parent.

### Worktree
A second working directory for the same git repo, with its own
HEAD. Created with `git worktree add <path> -b <branch>
origin/main`. Used to keep parallel agents from colliding
on a single working directory. `PRINCIPLES.md` §13 makes
worktree isolation mandatory for parallel agent work.

---

## Acronyms

- **A1 / A2 / … / C1 / C2 / …** — agent ids (planner-side labels).
- **CC1 / CC2 / …** — older Claude Code agent ids; see top of this
  glossary.
- **CASL** — Canadian Anti-Spam Legislation. Email compliance.
  Memory: `feedback_compliance_risk_framing`.
- **CEFR** — Common European Framework of Reference for Languages
  (A1 / A2 / B1 / B2 / C1 / C2 bands).
- **DI** — Dependency Injection. The placement v3 kernel is
  DI-pure (every dependency passed in; no module-level imports of
  Deno globals or Supabase clients).
- **DoD** — Definition of Done (`CURRENT-STATE.md` §15).
- **DSN** — Data Source Name. The Sentry config URL.
- **EAP** — Expected A Posteriori estimator. One of the θ
  estimators in placement v3.
- **FSM** — Finite State Machine. The onboarding picker is one.
- **IAP** — In-App Purchase (Apple's StoreKit). Required for iOS
  subscriptions per App Store guideline 3.1.1.
- **IELTS / TOEIC / VSTEP** — English exams the Vietnamese
  flagship targets. VSTEP is the Vietnam-specific one.
- **IRT** — Item Response Theory. Underpins placement v3.
- **JWT** — JSON Web Token. Supabase auth tokens are JWTs.
- **MLE** — Maximum Likelihood Estimation. The other θ estimator
  in placement v3 (EAP → MLE hand-off after enough data).
- **MR** — Merge Request (GitLab); see "MR / PR" above.
- **PII** — Personally Identifiable Information.
- **PR** — Pull Request (GitHub); see "MR / PR" above.
- **PWA** — Progressive Web App. We register a service worker in
  prod.
- **RLS** — Row-Level Security (Postgres).
- **RPC** — Remote Procedure Call.
- **SDK** — Software Development Kit.
- **SLO** — Service Level Objective. See `docs/slo-handbook.md`.
- **SPA** — Single-Page Application.
- **SSR** — Server-Side Rendering. **MercyBlade does NOT have
  SSR** — it's a SPA. The host (Netlify primary post-2026-05-27
  migration; Vercel as documented recovery — `vercel.json` retained)
  rewrites everything to a static `index.html`. Memory:
  `project_server_host_dead_not_ssr`.
- **STT** — Speech-to-Text.
- **SW** — Service Worker. Registered in production only.
- **TLS** — Transport Layer Security.
- **TTS** — Text-to-Speech.
- **UI** — User Interface.
- **UTM** — URL Tracking parameter (e.g. `utm_source`, gated by
  marketing consent).
- **WAF** — Web Application Firewall. Netlify's Edge Functions /
  rules surface and Cloudflare's WAF are the two layers we touch
  today; Vercel Firewall applies only on the documented recovery
  host.

---

## When this glossary is wrong

If you hit a term in our docs that isn't here, and you had to
google it or ask: **that's the single best one-line PR you can
open.** Add the term, define it, ship.

The same goes if a definition here is stale or wrong. The repo
moves; the glossary needs to move with it.
