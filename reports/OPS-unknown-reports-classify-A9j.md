# OPS — A9h UNKNOWN reports classification (A9j)

> Classifies the **UNKNOWN** rows flagged by A9h (PR #839) into CURRENT,
> SUPERSEDED-BY, PARTIAL, or ARCHIVE. Method: read each file head-to-mid;
> cross-check `git log --all` for shipping commits on the same topic
> since the recon date.
>
> **Headline-count discrepancy with A9h:** A9h's table reported
> "11 UNKNOWN" but the per-file body has **7 explicit UNKNOWN rows**
> (1 tonight audit + 6 content RECONs). The remaining ~20 older
> `aN-*` / `cc*-coverage` files were grouped under a single UNKNOWN
> paragraph at the bottom of A9h. A9j classifies the 7 explicit rows
> in depth, then disposes of the older block in §"Older `aN-*` /
> `cc*-coverage` group".

---

## Headline (7 explicit UNKNOWN rows)

| Class | Count | Files |
|---|---|---|
| **CURRENT** | 2 | `NATIVE-sentry-init-audit-A7c.md` · `RECON-content-readiness-matrix.md` |
| **SUPERSEDED-BY** | 3 | `RECON-english-b2.md` · `RECON-ja-b2-roleplay.md` · `RECON-vi-rooms-defects.md` |
| **PARTIAL** | 1 | `RECON-ja-b2-content.md` |
| **UNKNOWN (still)** | 1 | `RECON-spanish-b2-audio.md` |

**Net follow-up: 4 banner PRs needed** (3 SUPERSEDED + 1 PARTIAL).

---

## Per-file classification

### 1. `NATIVE-sentry-init-audit-A7c.md` — **CURRENT**

- **Date:** 2026-05-19 (tonight, PR #816).
- **Read:** JS fork (#271) intact at `src/lib/monitoring/sentryInit.ts:200–256`; native bridge wired but never end-to-end verified on a real device; iOS dSYM upload to Sentry has no CI step. Estimates: 1 PR (iOS dSYM upload) + 1 manual device-verify task. Android ProGuard non-issue (release build `minifyEnabled false`).
- **Cross-check:** #271 confirmed on main; #740 (configHealth Sentry gate) merged; #808 (sourcemap smoke) open. No later commit invalidates A7c's gap list.
- **Verdict:** CURRENT. No banner. The "iOS dSYM upload CI" gap A7c names is a real follow-up that has not shipped.

### 2. `RECON-content-readiness-matrix.md` — **CURRENT** (canonical, Chau-locked)

- **Date:** 2026-05-17.
- **Read:** the matrix Chau ruled canonical for the Duolingo-onboarding build (locked #14). Two natives × eight targets, 8 🟢 / 4 🟡 / 1 🟠 / 1 ⚪ / 0 🔴. Onboarding badge legend documented.
- **Cross-check:** no later commit overrides the matrix. The "M4 empty-VI fallback" work (#633) is downstream of, not contradicting, this matrix's badging convention.
- **Verdict:** CURRENT — strategic input doc, do not banner.

### 3. `RECON-english-b2.md` — **SUPERSEDED-BY** the shipped English B2 corpus

- **Date:** 2026-05-17.
- **Recon proposed:** 14 English B2 rooms (`english_b2_b201.json … english_b2_b214.json`), sample room drafted in §6, audio ≈ $0.50–$0.90 budget. Status: "Phase 1 recon complete — awaiting go before authoring."
- **Cross-check:** all 14 files **`english_b2_b201.json` through `english_b2_b214.json`** exist on `origin/main` today (verified `ls public/data/`). The recon's recommendation was acted on; the recon itself is now history.
- **Verdict:** SUPERSEDED-BY the on-main `english_b2_b2*.json` corpus.
- **Recommended banner:**

  > **SUPERSEDED 2026-05-17 or later:** Phase 1 recon's recommendation was acted on; all 14 proposed rooms (`english_b2_b201.json …  english_b2_b214.json`) now live on `main` (verified by A9j 2026-05-19). Keep for audit trail of the original gap analysis + topic design.

### 4. `RECON-ja-b2-content.md` — **PARTIAL** (scoping doc still useful)

- **Date:** 2026-05-17.
- **Recon framed:** B2 doesn't mirror A2/B1; brief's assumptions need a scope decision before Phase 2. Lists Group A (grammar, 5 lessons) vs Group B (roleplay, 41 lessons) gaps.
- **Cross-check:** #512 shipped B2 deferred fields (`register_notes_en` + `roleplay_prompts_en` + idiom fields, 574 keys). #555 shipped Group A VI siblings (lessons 46–50). #567 shipped Group B roleplay (lessons 51–91). The scoping concerns are now closed.
- **Verdict:** PARTIAL — the scoping framework is durable reference; the "scope decision needed" status is stale.
- **Recommended "See also":**

  > **See also:** the scoping decision has shipped via #512 (deferred fields) → #555 (Group A 46–50 VI siblings) → #567 (Group B 51–91 roleplay `pronunciation_focus _vi+_en`). The "awaiting scope decision" status here is closed.

### 5. `RECON-ja-b2-roleplay.md` — **SUPERSEDED-BY** #567

- **Date:** 2026-05-17.
- **Recon proposed:** author `pronunciation_focus` (VI base) + `pronunciation_focus_en` for the 41 JA B2 roleplay lessons 51–91 (205 examples total). Status: "Phase 1 recon — awaiting approval before Phase 2 authoring."
- **Cross-check:** **#567** (`feat(japanese): pronunciation_focus _vi+_en for JA B2 roleplay lessons 51–91 (#555 follow-up)`) shipped exactly this scope.
- **Verdict:** SUPERSEDED-BY PR #567.
- **Recommended banner:**

  > **SUPERSEDED by PR #567** (`feat(japanese): pronunciation_focus _vi+_en for JA B2 roleplay lessons 51–91 (#555 follow-up)`). Phase 2 authoring shipped; the "awaiting approval" status is closed. Keep for audit trail of the recon-stage scoping.

### 6. `RECON-spanish-b2-audio.md` — **UNKNOWN (still)**

- **Date:** 2026-05-17.
- **Recon proposed:** generate ES B2 audio via `scripts/generate-spanish-audio.ts --level=b2` against the Supabase `public.lessons` table; cost ~$0.00–$0.12, well below the $50 decision line. Recommendation: "agent generates + uploads (smoke test first, then full run)."
- **Cross-check:** **#436** shipped 25 Spanish B2 lessons. Audio generation is a separate operational step (running the script, uploading to Supabase) — *not* a code change. No git log entry confirms the script was run; this is an off-tree operational artifact (Supabase bucket state). A9j cannot verify Supabase bucket state from origin/main alone.
- **Verdict:** UNKNOWN (still). To resolve, a future dispatch should query the Supabase `room-audio` bucket (or wherever Spanish B2 audio lands) for `b2NN_0M_es.mp3`-class files. If present, banner as SUPERSEDED. If absent, banner as still-pending operational work.
- **No banner applied** by this audit. Flag for follow-up.

### 7. `RECON-vi-rooms-defects.md` — **SUPERSEDED-BY** #557

- **Date:** 2026-05-17.
- **Recon scope:** 6 defect classes from VI-rooms-audit §10; 5 of 6 small, non-gated; only one (audio gen for 4 English-learning rooms) needs a production-upload confirmation gate.
- **Cross-check:** **#557** (`fix(rooms): VI-rooms concrete defect cleanup — audio, garble, dupe, doc drift`) shipped — matches the recon's scope verbatim by title.
- **Verdict:** SUPERSEDED-BY PR #557.
- **Recommended banner:**

  > **SUPERSEDED by PR #557** (`fix(rooms): VI-rooms concrete defect cleanup — audio, garble, dupe, doc drift`). The 5-of-6 non-gated fixes shipped; the 6th (Spanish/English audio gen) tracked separately. Keep for audit trail of the defect inventory.

---

## Older `aN-*` / `cc*-coverage` group (the bulk-UNKNOWN paragraph in A9h)

A9h's bottom paragraph flagged ~20 older files (`a1-…` through `a8-…`,
`cc1-coverage.md` through `cc5-coverage.md`, `chau-report-number-4-…`)
as UNKNOWN without per-file rows. **A9j does not classify these
individually** — the cost/value tradeoff favors a different disposition:

- These files predate the 2026-05-19/20 wave by weeks. PR #791 already
  archived 7 zero-reference siblings (`cleanup(reports): archive 7
  zero-reference legacy a<N>-* files (Tier-C per A23)`); the survivors
  have at least one cross-reference somewhere.
- They are runbooks for one-shot operations (an audio run, a fix, a
  webhook verify) — operationally completed long ago. Their durable
  value is as audit trail, not as live guidance.
- **Recommended disposition:** treat as `ARCHIVE`-class. A future
  dispatch can either (a) move them to `reports/archive/agent-runs-2026-04/`
  (matching the existing archive structure) or (b) prepend a single shared
  "ARCHIVE — operation complete" banner. Either is a one-PR sweep.
- **No banner applied** by this audit for these files. Flag for a
  separate "older runbooks archive" dispatch.

**Per-file list (for the future archive-sweep dispatch):**

`a1-ielts-speaking-audio-run.md`, `a2-c1-save-room-json-fix.md`,
`a2-memory-design.md`, `a4-c3-speech-analyze-fix.md`,
`a4-tracking-runbook.md`, `a5-c4-webhook-verify-fix.md`,
`a5-vi-b1-audio-run.md`, `a6-c5-test-email-fix.md`,
`a6-email-runbook.md`, `a6-trial-expiry-runbook.md`,
`a7-bundle-audit.md`, `a7-phoneme-runbook.md`,
`a8-app-shared-refactor.md`, `chau-report-number-4-from-c1.md`,
`cc1-coverage.md`, `cc2-coverage.md`, `cc3-coverage.md`,
`cc4-vn-coverage.md`, `cc4b-vn-coverage.md`, `cc5-coverage.md`.

---

## Net follow-up: 4 banner PRs

Three SUPERSEDED-BY banners and one PARTIAL "See also" line, matching
A9h/A9i format:

| File | Class | Banner |
|---|---|---|
| `RECON-english-b2.md` | SUPERSEDED-BY | "Phase 1 recon acted on; 14 `english_b2_b2*.json` rooms now on main." |
| `RECON-ja-b2-roleplay.md` | SUPERSEDED-BY | "PR #567 shipped Phase 2 authoring." |
| `RECON-vi-rooms-defects.md` | SUPERSEDED-BY | "PR #557 shipped the defect cleanup." |
| `RECON-ja-b2-content.md` | PARTIAL | "Scope decision shipped via #512 → #555 → #567; status closed." |

`RECON-spanish-b2-audio.md` needs a Supabase-bucket check before its
banner is written (the work is operational/off-tree, not git-visible).

The older `aN-*` / `cc*-coverage` block warrants a separate archive
sweep, not individual banners.

## Scope / non-goals

- A9j read each of the 7 explicit UNKNOWN files head-to-mid; did not
  open the older `aN-*` / `cc*-coverage` files.
- No existing file edited. The 4 recommended banners are for a follow-up
  dispatch to apply (matching A9i pattern).
- No prod query. No Supabase read.
- A9h's headline-count discrepancy ("11 UNKNOWN" vs 7 explicit rows)
  noted but not retroactively corrected — A9h stands as-is in its audit
  trail.

*A9j — classification only. Apply the 4 recommended banners via a
follow-up dispatch using the same edit-only pattern as A9i.*
