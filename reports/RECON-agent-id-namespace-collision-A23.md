# RECON — Agent-ID namespace collision in `reports/` (A23)

**Date:** 2026-05-19
**Agent:** A23 (current fleet)
**Branch:** `a23/agent-id-naming-collision` — operator artifact, no PR
**Trigger:** A12's prerequisite check false-found "A5/A6 docs" that were actually
unrelated April/May-2026 fleet work, because the old `a<N>-*` filename prefix
aliases against current agent IDs.

---

## TL;DR

`reports/` contains **20** legacy files named with a bare `a<digit>-` prefix
(`a1-…` through `a9-…`). That prefix encodes an **ephemeral per-fleet dispatch
coordinate** as if it were a **permanent filename namespace**. Agent numbers are
recycled every fleet — the April-2026 "A5" was a security/audio agent; the
2026-05-19 "A5" is the entitlements-schema agent on `b67/`. Any prereq check
that greps/`ls`-filters by bare `A<N>` (as A12 did) matches the stale files as
if they were the current agent's docs. **Confirmed live collision:** on
`origin/b67/entitlements-schema-spec`, `reports/` holds *both*
`RECON-entitlements-table-schema-A5.md` (current A5) and 5 stale `a5-*.md`
files (April/May fleet) side by side.

**Collision count: 20 files across 9 aliased IDs (a1–a9).** All 9 prefixes
collide with currently-in-use agent IDs.

**Recommendation:** adopt the B16 convention strictly (topic-first,
`RECON-<topic>-A<N>.md`, agent ID = provenance suffix only; never prereq-check
by bare `A<N>`). Migrate the 20 legacy files in **3 risk tiers** — 7 archive
freely, 5 archive with link fixups, **8 are load-bearing in live
source/config/edge-function comments** and must NOT be moved without
coordinated comment rewrites.

---

## 1. The collision, concretely

On `origin/b67/entitlements-schema-spec`, `git ls-tree reports/ | grep -i A5`:

```
reports/RECON-entitlements-table-schema-A5.md   <- CURRENT A5 (entitlements schema, B16 convention)
reports/a5-c1-r3-audio-run.md                   <- STALE  "A5" (C1 R3 audio gen, 2026-05-07, #331)
reports/a5-c4-webhook-verify-fix.md             <- STALE  "A5" (webhook sig verify, 2026-04-25, #126)
reports/a5-mercy-memory-wired.md                <- STALE  "A5" (mercy memory wiring, 2026-04-25, #97)
reports/a5-offline-strategy.md                  <- STALE  "A5" (offline SW strategy, 2026-04-24, #93)
reports/a5-vi-b1-audio-run.md                   <- STALE  "A5" (VI B1 audio gen, 2026-05-07, #332)
```

Every `a5-*` file is headed `# A5 — …`. They are five different prior agents
that all happened to be labeled "A5" in their respective dispatch fleets, none
of which is the current entitlements-schema A5. A prerequisite check of the
form `ls reports/ | grep -i a5` or `grep -l 'A5' reports/*.md` returns 6 hits
where only 1 is the current agent — exactly the A12 false-find.

The same aliasing exists for **a6** (4 files, the other half of A12's
"A5/A6 docs" false-find) and for **a1–a4, a7–a9**.

---

## 2. Root cause

The agent ID `A<N>` is an **ephemeral coordinate**, not a stable identity:

- It is assigned per dispatch fleet and **recycled** every fleet.
- "A5" in the 2026-04-24 fleet, the 2026-05-07 fleet, and the 2026-05-19
  fleet are three unrelated agents doing unrelated work.
- A filename whose **primary sort key is the agent number** (`a5-…`) therefore
  aliases across time. The number tells you nothing durable; the *topic* does.

The current B16 convention (`RECON-<topic>-A<N>.md`) inverts this correctly:
the **topic is the primary key** (and the existing "recon unique filenames"
rule already guarantees topic uniqueness), with `-A<N>` demoted to a
**provenance suffix**. A prereq check then greps by *topic* (stable) instead of
by bare *agent number* (aliased) — collision-free by construction. The legacy
files predate B16 and put the aliased coordinate first.

---

## 3. Full collision inventory (20 files)

| File | Created | PR | Documents | Header claims | Aliases current ID? | External citations | Tier |
|---|---|---|---|---|---|---|---|
| `a1-ielts-speaking-audio-run.md` | 2026-05-07 | #337 | IELTS speaking band 5/7 audio gen, 30 topics | `# A1` | yes (A1 in active use) | none | C |
| `a2-c1-save-room-json-fix.md` | 2026-04-25 | #123 | security: admin auth + filename allowlist on save-room-json | `# A2` | yes | **edge fn** save-room-json `index.ts`+`validation.ts` | **A** |
| `a2-memory-design.md` | 2026-04-24 | #90 | episodic user-fact memory design | `# A2` | yes | **src** `lib/mercy/factExtractor.ts` | **A** |
| `a3-c2-feedback-reply-fix.md` | 2026-04-25 | #124 | security: harden send-feedback-reply | `# A3` | yes | none | C |
| `a4-c3-speech-analyze-fix.md` | 2026-04-25 | #125 | security: JWT identity + rate limit on speech-analyze | `# A4` | yes | report-only | B |
| `a4-recommendation-design.md` | 2026-04-24 | #78 | weakest-skill recommendation engine v2 | `# A4` | yes | none | C |
| `a4-tracking-runbook.md` | 2026-04-24 | #86 | UTM + FB Pixel + GA4 consent-gated tracking | `# A4` | yes | **src** `services/behaviorTrackingFlag.ts`, `index.html` | **A** |
| `a5-c1-r3-audio-run.md` | 2026-05-07 | #331 | C1 R3 audio gen, 5 langs, 1434 clips | `# A5` | **yes — confirmed live (b67)** | none | C |
| `a5-c4-webhook-verify-fix.md` | 2026-04-25 | #126 | security: apple/google webhook sig verify | `# A5` | **yes — confirmed live (b67)** | **edge fn** `_billing/verifyAppleJws.ts` | **A** |
| `a5-mercy-memory-wired.md` | 2026-04-25 | #97 | wire mercy_user_facts into ai-chat prompt | `# A5` | **yes — confirmed live (b67)** | report-only (cites a2-memory-design) | B |
| `a5-offline-strategy.md` | 2026-04-24 | #93 | service worker + offline lesson cache | `# A5` | **yes — confirmed live (b67)** | none | C |
| `a5-vi-b1-audio-run.md` | 2026-05-07 | #332 | Vietnamese B1 audio gen, 150 lessons | `# A5` | **yes — confirmed live (b67)** | report-only | B |
| `a6-c5-test-email-fix.md` | 2026-04-25 | #127 | security: remove dead test-email edge fn | `# A6` | yes | report-only | B |
| `a6-email-runbook.md` | 2026-04-24 | #81 | re-engagement email 7/14/30d skeleton | `# A6` | yes | `.claude/roadmap.md` | **A** |
| `a6-sentry-runbook.md` | 2026-04-24 | #94 | Sentry SDK skeleton runbook | `# A6` | yes | none | C |
| `a6-trial-expiry-runbook.md` | 2026-04-25 | #102 | trial expiry D-3/D-1/D+1 funnel | `# A6` | yes | **edge fn** `account-conversion-welcome/templates/welcome.json` | **A** |
| `a7-bundle-audit.md` | 2026-04-24 | #92 | bundle audit + lazy-load improvements | `# A7` | yes | **config** `vite.config.ts`, `AUDIT_LATENCY.md` | **A** |
| `a7-phoneme-runbook.md` | 2026-04-24 | #76 | VN-EN sound-pair drills + minimal pairs | `# A7` | yes | **src** `soundPairDrills.ts`, `SoundPairDrillCard.tsx`, `.claude/roadmap.md` | **A** |
| `a8-app-shared-refactor.md` | 2026-05-13 | #421 | app-shared extraction recon (deferred) | `# A8` | yes | report-only | B |
| `a9-chau-report.md` | 2026-05-06 | — | Chau report from A9 | `# A9` | yes | none | C |

Aliased IDs: **a1, a2, a3, a4, a5, a6, a7, a8, a9 — all 9 collide** with
currently-active agent IDs. a5 (5 files) and a6 (4 files) are the
A12-confirmed false-find vectors.

---

## 4. Recommendation — convention going forward

1. **Topic-first, agent-suffix-only (the B16 convention), enforced.**
   All current-agent reports MUST be `reports/RECON-<topic>-A<N>.md`.
   The `<topic>` is the stable primary key; `-A<N>` is provenance metadata,
   never the sort/grep key.

2. **Never prereq-check by bare `A<N>`.** Operators and dispatching agents
   verifying "did A<N> already do X" must grep by **topic**
   (`ls reports/ | grep -i <topic>`), never by agent number
   (`ls reports/ | grep -i a5`). The bare-number grep is unsound by design
   because the number is recycled. Add this line to the existing
   "recon unique filenames" operating rule and to `CLAUDE.md`:
   > Agent ID is a provenance *suffix*, never a filename prefix or sort key.
   > Prerequisite checks grep by topic, never by bare `A<N>`.

3. **The 20 `a<N>-*` files are not "current A<N>" anything.** They are the
   2026-04/05 fleet. They must be visibly disambiguated so a future
   grep-by-number reader is not misled (banner) and/or removed from the active
   `reports/` grep surface (archive) — see migration plan §5.

4. **Archive layout reuse.** `reports/archive/` already partitions history as
   `reports/archive/<topic>-YYYY/`. Add `reports/archive/agent-runs-2026-04/`
   for the legacy fleet (single dated folder preserves the fleet grouping and
   matches the existing dated-archive pattern).

---

## 5. Migration plan (operator-run; NOT executed in this branch — see §6)

The 20 files split into 3 risk tiers. **8 are load-bearing in live
source/config/edge-function comments** — a naive `git mv` orphans those
breadcrumbs (the comments would cite a path that no longer exists).

### Tier C — zero external citation: archive freely (7 files)

`git mv` into `reports/archive/agent-runs-2026-04/`, no other change needed:

```
a3-c2-feedback-reply-fix.md
a4-recommendation-design.md
a5-c1-r3-audio-run.md
a5-mercy-memory-wired.md      (cites a2-memory-design.md; nothing cites IT)
a5-offline-strategy.md
a6-sentry-runbook.md
a9-chau-report.md
```

### Tier B — cited only by other reports: archive + fix the citing report links (5 files)

```
a4-c3-speech-analyze-fix.md
a5-vi-b1-audio-run.md
a6-c5-test-email-fix.md
a8-app-shared-refactor.md      (cites a7-bundle-audit.md)
```
*(a5-mercy-memory-wired listed in C; its only inbound is none — it is an
outbound citer, safe in C.)* For each, `git mv` then update the
`reports/<file>` reference in the citing report(s) in the **same commit**.

### Tier A — load-bearing in live source/config: DO NOT silently move (8 files)

| File | Cited by (live, non-report) |
|---|---|
| `a2-c1-save-room-json-fix.md` | `supabase/functions/save-room-json/index.ts`, `…/validation.ts` |
| `a2-memory-design.md` | `src/lib/mercy/factExtractor.ts:14` |
| `a4-tracking-runbook.md` | `src/services/behaviorTrackingFlag.ts:29`, `index.html` |
| `a5-c4-webhook-verify-fix.md` | `supabase/functions/_billing/verifyAppleJws.ts:21` |
| `a6-email-runbook.md` | `.claude/roadmap.md` |
| `a6-trial-expiry-runbook.md` | `supabase/functions/account-conversion-welcome/templates/welcome.json` |
| `a7-bundle-audit.md` | `vite.config.ts:76`, `AUDIT_LATENCY.md` |
| `a7-phoneme-runbook.md` | `src/lib/pronunciation/soundPairDrills.ts:13`, `src/components/speech/SoundPairDrillCard.tsx`, `.claude/roadmap.md` |

Two safe options for Tier A (operator picks one; **option (i) is recommended**
as the smaller, lower-risk diff):

- **(i) Leave in place + prepend a 1-line HISTORICAL banner.** Add to the top
  of each file:
  `> HISTORICAL — "A<N>" here is the 2026-04/05 dispatch fleet, NOT the current
  A<N>. Do not treat as current-agent work.`
  Zero code churn, kills the false-find for any reader, breadcrumbs stay valid.
- **(ii) Archive + rewrite every citing comment** to the new path, in one
  reviewed PR (this touches live edge functions + `vite.config.ts` + `src/`,
  so it needs the normal typecheck/build gates and review — not an operator
  artifact). Higher churn; only do this if §4.4's "remove from active grep
  surface" is judged worth the source-comment edits.

**Net plan:** Tier C + Tier B → `reports/archive/agent-runs-2026-04/`
(12 files, mechanical). Tier A → option (i) banner-in-place (8 files), or
defer to a reviewed archival PR. Either way the bare-`a<N>-` prefix stops
being a current-ID alias.

---

## 6. What this branch ships

**The report only.** Per the dispatch (operator artifact, no PR) and the
codebase's "small diffs over smart diffs / checkpoint every risky step"
discipline, the migration is **documented, not executed**:

- Moving 12+ files and rewriting live edge-function / `vite.config.ts` / `src/`
  comments is a reviewed change, not an operator artifact.
- 8 files are load-bearing; an unreviewed `git mv` on this branch would orphan
  source-comment breadcrumbs with no gate to catch it.

The operator can execute Tier C/B mechanically and choose option (i)/(ii) for
Tier A. This document is the spec for that work.
