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
