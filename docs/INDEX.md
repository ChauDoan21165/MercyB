# docs/ tree inventory

> **Last regenerated:** 2026-05-27
>
> **Purpose:** internal navigation aid for future sessions (human + agent) doing architectural work. Lists every doc currently tracked by the !92 doc-drift detector, every substantive untracked doc that *might* belong there, and the procedure for adding a new path to !92's tracked list.
>
> **Not a learner-facing doc.** English-only. If a section gets stale, re-run the survey commands at the bottom of this file and patch — don't rewrite from scratch.
>
> **Related:**
>
> - `tests/docs/post-migration-doc-drift.test.ts` — the canonical tracked list (!92)
> - `docs/architecture/system-overview.md` — what `src/` looks like at a system level
> - `docs/onboarding/README.md` — entry point for a new contributor

## Tracked by !92's drift detector (24 paths)

Each path was verified to exist on `origin/main` at the time this file was generated. Title and last-modified date are read from each file's header + `git log -1`.

### Root-level (4)

| Path | Last modified | Title / 1-line summary |
|---|---|---|
| `CLAUDE.md` | 2026-05-27 | Project instructions for Claude Code — mission, five non-negotiables, operating discipline, architecture pointers. |
| `README.md` | 2026-05-27 | Product README — bilingual-first product framing, tech stack table (Netlify host, GitLab repo, Supabase backend), getting-started pointer. |
| `SETUP.md` | 2026-05-27 | Development setup — Node 22+, npm, optional Supabase / Netlify / Vercel / glab / Capacitor CLIs, env-var checklist. |
| `PRINCIPLES.md` | 2026-05-27 | Standing principles — "always clean before moving on", recon-vs-editorial, gate before merge, single-OAuth-provider lesson. |

### GitHub-workflow docs (2)

| Path | Last modified | Title / 1-line summary |
|---|---|---|
| `.github/workflows/DEPLOYMENT.md` | 2026-05-27 | Deployment guide — post-2026-05-27 rewrite for the Vercel → Netlify migration. Authoritative reference for production-deploy paths. |
| `.github/workflows/ROLLBACK.md` | 2026-05-27 | Rollback guide — post-2026-05-27 rewrite. Netlify deploy-history is the primary rollback surface; Vercel paths documented as recovery-only. |

### Architecture (12)

| Path | Last modified | Title / 1-line summary |
|---|---|---|
| `docs/architecture/system-overview.md` | 2026-05-27 | Reference map of every major system in `src/` + the Supabase surface it talks to. Read after `CLAUDE.md`, before any cross-system change. |
| `docs/architecture/data-flow.md` | 2026-05-27 | How data actually moves — learner signal flow, entitlement derivation, room-content pipeline. Sibling of `system-overview.md`. |
| `docs/architecture/systems/ai-tutor.md` | 2026-05-27 | Deep dive — `guide-assistant` edge-function path + the two-layer tutor surface. |
| `docs/architecture/systems/billing-entitlement.md` | 2026-05-27 | Deep dive — Stripe/Apple/Google webhooks, family plans, entitlement state read/write rules. |
| `docs/architecture/systems/mercy-guide.md` | 2026-05-27 | Deep dive — the dockable in-context Teacher Mercy panel. |
| `docs/architecture/systems/native-shells.md` | 2026-05-27 | Deep dive — Capacitor 8 iOS + Android shells, the one-bundle-two-shells contract. |
| `docs/architecture/systems/observability.md` | 2026-05-27 | Deep dive — Sentry route-gate, monitoring + perf seams. |
| `docs/architecture/systems/onboarding-language-pair.md` | 2026-05-27 | Deep dive — anon entry point at mercyblade.com, pair-pick → home flow. |
| `docs/architecture/systems/placement-v3.md` | 2026-05-27 | Deep dive — server-side 2PL IRT adaptive placement engine. |
| `docs/architecture/systems/search-rooms.md` | 2026-05-27 | Deep dive — room registry (~488 JSON files) + the rooms-search surface. |
| `docs/architecture/systems/study-os-stage-3.md` | 2026-05-27 | Deep dive — Stage 3A/3B/3C/3D Study OS bricks. |

### Runbooks (1)

| Path | Last modified | Title / 1-line summary |
|---|---|---|
| `docs/runbooks/disaster-recovery.md` | 2026-05-27 | Playbook for third-party-provider outages — GitHub suspension, Vercel migration, Supabase lockout. Reference for identity-layer incidents, not code bugs. |

### Onboarding (4) + contributing (1)

| Path | Last modified | Title / 1-line summary |
|---|---|---|
| `docs/onboarding/README.md` | 2026-05-27 | First stop for a new contributor (human or agent). |
| `docs/onboarding/local-setup.md` | 2026-05-27 | Bare-metal "fresh clone to dev server running" — the gotchas `SETUP.md` doesn't cover. |
| `docs/onboarding/your-first-contribution.md` | 2026-05-27 | Senior-to-junior walkthrough for shipping a first change. |
| `docs/onboarding/glossary.md` | 2026-05-27 | Every project-specific term — grouped by domain, alphabetical within. |
| `docs/contributing/agent-handoff.md` | 2026-05-27 | Short briefing for a Claude / GPT / human agent joining mid-project. Read **before** the first dispatch. |

### Accessibility (1)

| Path | Last modified | Title / 1-line summary |
|---|---|---|
| `docs/ACCESSIBILITY.md` | 2026-05-27 | Implementation guide for shipped a11y systems. Gaps tracked under `docs/a11y/audit.md` (canonical audit source). |

## Other substantive docs in `docs/` (NOT in !92's tracked list)

Candidates for being added to the drift detector later. Filtered to files with more than 50 lines of content. The list is *narrative-substantive*, not exhaustive — design docs, runbooks, taxonomies, audits.

### Likely "should be tracked" — load-bearing reference docs

| Path | Lines | 1-line summary |
|---|---|---|
| `docs/audio-system.md` | 589 | Self-healing, governed audio automation system — the canonical "how audio works in MercyBlade." |
| `docs/MERCY_BLADE_ROOM_SPECIFICATION.md` | 529 | Master room/level spec — patterns ANY new room must follow. |
| `docs/ai-tutor/TUTOR_CONTRACT.md` | 543 | Protocol contract (locked) for the AI tutor — sibling of the architecture deep-dive. |
| `docs/app/TEACHER_MERCY_LEARNING_OS.md` | 486 | Master implementation spec for the Teacher Mercy smart-study architecture. |
| `docs/stage-3a/local-weakness-map-design.md` | 470 | Stage 3A design doc — sibling of the study-os deep dive. |
| `docs/REACT_PERFORMANCE_OPTIMIZATION.md` | 488 | React perf optimization checklist (status: all 25 prompts completed). |
| `docs/a11y/audit.md` | (large) | Canonical WCAG 2.1 AA audit + per-finding status. Already referenced by `docs/ACCESSIBILITY.md`. |

### Likely "leave untracked" — process / one-shot / time-bound

| Path | Lines | Why probably leave untracked |
|---|---|---|
| `docs/curriculum/kids-100-lesson-image-roadmap.md` | 946 | Production roadmap for image generation — internal team artifact, not a reference doc. |
| `docs/mercy-kids-pages-roadmap.md` | 580 | Same shape — version-3 fixed-order kids roadmap. |
| `docs/placement-test-v3-design.md` | 877 | Design draft for A22 — superseded by `docs/architecture/systems/placement-v3.md` once that landed. |
| `docs/placement-test-wireframes.md` | 415 | Wireframes — historical reference, not load-bearing. |
| `docs/placement-vn-l1-interference-taxonomy.md` | 400 | Taxonomy artifact — read once during design, not part of the contract. |
| `docs/placement/v5/*.md` (4 files) | 350–384 each | V5 planning docs — pre-implementation, may or may not ship. |
| `docs/l1-taxonomies/{spec,vi-grammar,vi-writing}.md` | 727–734 | Taxonomy design drafts — referenced by code paths but rarely re-read. |
| `docs/copy/bilingual-audit.md` | 600 | One-shot diagnostic catalog — doesn't change with the codebase. |
| `docs/runbooks/pg-dump-activation.md` | 635 | One-time activation guide for the C7 backup pipeline — superseded once activated. |
| `docs/launch/prelaunch-checklist.md` | 448 | 20-min tickable launch checklist — time-bound. |
| `docs/security/rls-audit-surface.md` | 433 | Read-only diagnostic snapshot — produced once, dated. |
| `docs/axis-2/tone-production-design.md` | 500 | Design draft (C6 PR 1) — superseded by implementation. |

### Other directories worth knowing exist

`docs/admin/`, `docs/agent-briefs/`, `docs/app-store-submission/`, `docs/billing/`, `docs/billing-foundation/`, `docs/handoff/`, `docs/migration/`, `docs/observability/`, `docs/placement/`, `docs/schema-drift/`, `docs/session-summaries/`, `docs/stage-3ab/`, `docs/stage-3b/`, `docs/testing/`.

Most contain time-bound process artifacts (session summaries, agent briefs, migration plans). Worth a `find ./docs -type d` scan when you're hunting context, not worth enumerating per file here.

## How to add a path to !92's tracked list

When a new doc joins the load-bearing reference set:

1. **Edit** `tests/docs/post-migration-doc-drift.test.ts` — append the path to the `TRACKED_PATHS` array (currently around line 67–91).
2. **Verify** the four drift rules apply cleanly to the doc — read the rule names + spot-check the doc doesn't trip any rule today.
3. **Run** `npx vitest run tests/docs/post-migration-doc-drift.test.ts` — must pass.
4. **Update this file** — add a row to the appropriate "Tracked by !92" section above.

If a tracked path is *removed* (the doc is deleted / renamed):

1. Update both `TRACKED_PATHS` and this file in the same MR.
2. The drift detector has a precondition test that asserts each tracked path exists — letting a tracked path go missing without updating the list will turn the suite red.

## Regenerating this file

The two surveys below give the data this file is built on. If anything looks stale, paste these into a shell and patch:

```bash
# All tracked paths exist on main + their titles
for p in $(awk '/^const TRACKED_PATHS/,/^\];/{ if ($0 ~ /^  "/) print $0 }' tests/docs/post-migration-doc-drift.test.ts | sed 's/[",]//g' | xargs); do
  printf "%-60s | %s\n" "$p" "$(git log -1 --format=%ad --date=short -- "$p")"
done

# Substantive untracked docs (>50 lines)
find docs -type f -name "*.md" | while read f; do
  lines=$(wc -l < "$f")
  [ "$lines" -gt 50 ] && echo "$lines $f"
done | sort -rn
```

## Cross-reference: docs by L0–L7 layer

> Parallel to !99's restructured `ROADMAP.md`. The flat file list
> above tells you *what exists*. This section tells you *which
> docs sit in which layer of the L0–L7 model*, so you can find
> the right doc when you know the layer you're working in.
>
> A doc may appear under more than one layer when it substantively
> covers both. Docs that apply across every layer (collaboration
> rules, product framing, navigation aids) are listed once under
> § Cross-cutting at the bottom rather than repeated.
>
> Layers without a dedicated doc carry an explicit
> *"No dedicated docs — see ROADMAP §<layer>"* line. Those are
> either expected (L7 is emergent by design) or real gaps flagged
> for future authoring (L4, L5, L6).

### L0 — Foundation

Platform substrate: auth, deploy, security hardening, native
identity, release gates. See [`ROADMAP.md` §L0](../ROADMAP.md#l0--foundation).

| Path | Covers what (re: L0) |
|---|---|
| `SETUP.md` | Local development environment — Node 22+, npm, optional CLIs (Supabase / Netlify / Vercel / glab / Capacitor). |
| `.github/workflows/DEPLOYMENT.md` | Production deploy paths post-Vercel→Netlify migration. |
| `.github/workflows/ROLLBACK.md` | Rollback runbook. Netlify deploy-history primary; Vercel recovery-only. |
| `docs/runbooks/disaster-recovery.md` | Provider-outage playbook (GitHub suspension, Vercel migration, Supabase lockout). |
| `docs/architecture/systems/native-shells.md` | Capacitor 8 iOS + Android shells; bundle-id divergence; the one-bundle-two-shells contract. |
| `docs/architecture/systems/observability.md` | Sentry route-gate, monitoring + perf seams. |
| `docs/architecture/systems/billing-entitlement.md` | Stripe/Apple/Google webhooks, entitlement read/write — the billing substrate underneath L2. |
| `docs/onboarding/local-setup.md` | Bare-metal "fresh clone to dev server running" — gotchas SETUP.md doesn't cover. |

### L1 — Bilingual + Privacy Substrate

VI/EN parity, shame-language guardrails, local-only behavioral
signal, no surveillance, no streaks/XP/badges. Substrate, never
"finished." See [`ROADMAP.md` §L1](../ROADMAP.md#l1--bilingual--privacy-substrate).

| Path | Covers what (re: L1) |
|---|---|
| `docs/architecture/systems/onboarding-language-pair.md` | Anonymous pair-pick entry; the VI/EN substrate that gates Home. |
| `docs/architecture/data-flow.md` | Local-only behavioral signal flow (Stage 3A buffers, Supabase boundary, what stays on-device). |
| `docs/ACCESSIBILITY.md` | A11Y implementation. A11Y is part of the substrate, not optional polish. |

### L2 — Learning OS

Rooms, AI Tutor, placement v3, L1 detector consumption,
pronunciation boundaries. Active / stabilizing.
See [`ROADMAP.md` §L2](../ROADMAP.md#l2--learning-os).

| Path | Covers what (re: L2) |
|---|---|
| `docs/architecture/systems/search-rooms.md` | Room registry (~488 JSON files) + the rooms-search surface. |
| `docs/architecture/systems/ai-tutor.md` | Live `guide-assistant` edge-function path + the two-layer tutor surface (incl. §15 Bar #3 L1 injection). |
| `docs/architecture/systems/mercy-guide.md` | Dockable in-context Teacher Mercy panel — the tutor UI surface. |
| `docs/architecture/systems/placement-v3.md` | Server-side 2PL IRT adaptive placement engine. |
| `docs/architecture/data-flow.md` | The learner-signal pipeline; entitlement derivation read path. |
| `docs/architecture/systems/billing-entitlement.md` | Entitlement read/write rules — what L2 surfaces gate on. |

### L3 — Diagnostic Signal Layer

Stage 3A Local Weakness Map + Stage 3B Suggested Practice.
Shipped passive; closes ~30% of the diagnostic loop. See
[`ROADMAP.md` §L3](../ROADMAP.md#l3--diagnostic-signal-layer).

| Path | Covers what (re: L3) |
|---|---|
| `docs/architecture/systems/study-os-stage-3.md` | Stage 3A/3B/3C/3D Study OS bricks — adapter contracts, aggregator, `/weak-at` route, `(c+)` trigger semantics. |
| *(also)* `docs/architecture/data-flow.md` | Stage 3A localStorage buffer flow + the read-side of `/weak-at`. |
| *(also, untracked but load-bearing)* `docs/stage-3a/local-weakness-map-design.md` | Stage 3A design doc — sibling of the deep-dive; "Likely should be tracked" per the inventory above. |

### L4 — Diagnostic Intervention Layer

The planner that biases what the learner SEES NEXT based on weakness
signals. **NEXT engineering target.** See
[`ROADMAP.md` §L4](../ROADMAP.md#l4--diagnostic-intervention-layer).

| Path | Covers what (re: L4) |
|---|---|
| `docs/architecture/L4-diagnostic-intervention-layer.md` | Design + first-build scope + open questions for the rule engine that maps L3 signals to L5/Stage-3B actions. Authored per !113 / !122 flagged gap; companion to L6. |

### L5 — Pedagogy Layer

Curriculum, sequencing, SRS policy, L1-transfer-aware scheduling,
motivation-aware pacing. Research-required, owner-decision-heavy.
See [`ROADMAP.md` §L5](../ROADMAP.md#l5--pedagogy-layer).

**No dedicated docs — see ROADMAP §L5.** Expected (the layer is
research-blocked, not engineering-blocked) but a real gap: when
pedagogy decisions land, they need a decision-record artifact
(*"what is the success metric for good planning?"*, *"what does a
well-planned week look like?"*) before L4 can ground its
heuristics. Flagged for future authoring once Chau / a pedagogy
adviser commits to a position.

- [`docs/architecture/L5-pedagogy-decision-record.md`](./architecture/L5-pedagogy-decision-record.md) — Decision-record stub. Captures the 3 deferred decisions surfaced by !122 (threshold / sequencing / mastery). All entries [PENDING] — not yet decidable.

### L6 — Parent / Teacher / Family Intelligence

Diaspora-parent diagnostic transparency. Parallel-track candidate
(not sequential successor to L5). See
[`ROADMAP.md` §L6](../ROADMAP.md#l6--parent--teacher--family-intelligence)
and the preserved Stage 5 Parent/Teacher View detail in
[`ROADMAP.md` § Layer detail: L6](../ROADMAP.md#layer-detail-l6--parent--teacher--family-intelligence).

**No dedicated docs — see ROADMAP §L6.** Flagged as a real gap:
this is the highest-differentiation-per-effort layer in the
roadmap, but no design doc, market sketch, or copy spec exists.
A first L6 doc would be a candidate for "Likely should be tracked"
status from day one.

- [`docs/architecture/L6-parent-teacher-family-layer.md`](./architecture/L6-parent-teacher-family-layer.md) — Design + market + copy. First L6 artifact; scope contract for Stage 5 authoring. Closes the gap !113 flagged.

### L7 — Differentiation

Positional identity ("the product MercyBlade IS"), not comparative.
Emerges from L4+L5+L6; not directly buildable. See
[`ROADMAP.md` §L7](../ROADMAP.md#l7--differentiation).

**No dedicated docs — see ROADMAP §L7.** NOT a gap: this layer is
emergent by design. Documenting it standalone would be a category
error — there is no L7 *system* to deep-dive. The three positional
statements live in the ROADMAP and surface through L2/L3/L4/L6
docs as those layers ship.

### Cross-cutting (apply across L0–L7)

These docs are not layer-specific — they describe the rules,
mission, and navigation that every layer shares. Listed here once
rather than repeated under every L0–L7 entry above.

| Path | Why cross-cutting |
|---|---|
| `CLAUDE.md` | Project mission, the five non-negotiables, operating discipline, architecture pointers. |
| `STRATEGY.md` *(repo root)* | The canonical living strategy doc — pair matrix (§4), product strategy (§5), Definition of Done (§15), Duolingo competition strategy (§12). |
| `PRINCIPLES.md` | 19 collaboration principles — apply to every layer's work. |
| `ROADMAP.md` *(repo root)* | The L0–L7 layer model itself + cross-cutting constraints (Study OS boundaries, local-only posture, §15 relationship, Rule). |
| `README.md` | Product README — bilingual-first product framing + tech stack table. |
| `docs/architecture/system-overview.md` | Reference map of every major system in `src/` + the Supabase surface. Cross-layer index. |
| `docs/onboarding/README.md` | First stop for a new contributor — cross-layer reading order. |
| `docs/onboarding/your-first-contribution.md` | Senior-to-junior walkthrough — process across all layers. |
| `docs/onboarding/glossary.md` | Project-specific terms — touches every layer's vocabulary. |
| `docs/contributing/agent-handoff.md` | Agent briefing (Claude / GPT / human) — read **before** the first dispatch on any layer. |

### Real layer gaps (summary, for future authoring)

- **L4 — Diagnostic Intervention Layer**: no dedicated docs. When
  L4 engineering starts, author a deep-dive sibling to
  `docs/architecture/systems/study-os-stage-3.md` describing the
  planner's contract, the bias mechanism, the placement-resampling
  hook, and the tutor-suggestion modification.
- **L5 — Pedagogy Layer**: no dedicated docs (expected — research-
  blocked). When pedagogy decisions land, author a
  decision-record artifact at `docs/pedagogy/decisions.md` (or
  similar) documenting the success metric, well-planned-week
  shape, L1-transfer weighting, and motivation-aware pacing
  signal set.
- **L6 — Parent / Teacher / Family Intelligence**: no dedicated
  docs. Highest-differentiation-per-effort opportunity. A first
  doc (design + market + copy direction) would be a "Likely should
  be tracked" candidate from day one.

L7 deliberately has no docs. L4 / L5 / L6 gaps are real and will
need to be closed as those layers move from "next" / "research-
required" / "parallel-track candidate" to "in flight."
