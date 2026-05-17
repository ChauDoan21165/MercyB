# MEMORY FIX — Kids/Music Audio Doctrine Correction in Auto-Loading Memory

**Agent:** audio-memory-cleanup-agent
**Date:** 2026-05-17
**Source finding:** `reports/RECON-agent-infra-audit.md` §(b) — "Wrong-content memory files — 🔴 HIGHEST PRIORITY (confirmed against current main)"
**Scope (locked #3):** Only the three named audio memory files. No bundling with RECON §(c) obsolete-recon cleanup or §(d) gitignore gaps — those are separate dispatches.
**Care level (locked #4):** Auto-loading memory shapes every future agent's behavior; treated as a doctrine change, not a code change.

---

## The regression risk averted

Three memory files in `~/.claude/projects/-Users-admin-MercyB/memory/` **auto-load every session** and asserted the *reverted* audio architecture: kids/music audio is local, the storage bucket is private + signed, and Supabase migration should be resisted. The canonical doctrine, set at commit **d2951ddd (2026-04-21, "migrate kids + music to Supabase, Google Play 200 MB fix")** and corrected in `CLAUDE.md` by **PR #537**, is the exact reverse:

> **CLAUDE.md hard invariant (since d2951ddd):** ALL audio (adult-room, `kids/*`, `music/*`) flows through the Supabase `room-audio` **public** bucket; the PWA service worker caches responses for offline-after-first-play. … re-inverting it back to local **re-bloats the bundle past Google Play's 200 MB base-module limit**.

> **STRATEGY.md changelog:** "Kids/music invariant later reversed (d2951ddd, April 21) for Google Play 200MB limit — corrected in CLAUDE.md doctrine fix (#537)."

An agent trusting auto-loaded memory over CLAUDE.md (a plausible failure — memory is presented as authoritative user context) would re-localize kids/music audio and re-bloat the Android base module past Google Play's 200 MB hard cap. This is the precise regression CLAUDE.md's "Hard invariant" / "Non-obvious invariants" / "Traps" sections were written to prevent.

---

## Phase 1 — verification (locked #15: confirmed files exist with the claimed content)

All three files were read on disk before any change. The contradicting lines match RECON §(b)'s table verbatim:

### 1. `project_audio_library.md` — **WHOLLY OBSOLETE → DELETED**

Contradicting lines (quoted):
- L3: *"user prefers bundling over streaming from Supabase"*
- L9: *"User wants audio available offline for users, no streaming dependency. Avoid Supabase Storage migration unless forced by Apple's 4 GB app-size limit."*
- L13: *"The intended architecture is bundled audio. Recommend migrating to Supabase Storage only as a last resort…"*

**Call:** The file's entire premise — "bundle, don't stream; resist Supabase" — is exactly the path d2951ddd reverted. Every substantive claim (bundled architecture, 4 GB Apple framing, Supabase-as-last-resort) is inverted. Nothing salvageable survives that is not already documented more accurately in CLAUDE.md's "Audio resolution pipeline" section. A corrected version would be a strictly worse duplicate of CLAUDE.md. Deleted.

### 2. `project_phase2_architecture.md` — **WHOLLY OBSOLETE → DELETED**

Contradicting lines (quoted):
- L9: *"Bucket privacy: **PRIVATE + signed URLs.** … Supabase createSignedUrl(path, 3600)"*
- L11: *"Music folder (244 MB): **KEEP LOCAL.**"*
- L12: *"Kids folder (271 MB): **KEEP LOCAL** (user hard rule — offline required)."*
- L22: *"Kids/music paths: short-circuit to local without hitting Supabase."*
- L28: workbox rule scoped to `…/storage/v1/object/**sign**/room-audio/*`

**Call:** Load-bearing decisions all inverted — bucket is now PUBLIC via `getPublicUrl` (not private/`createSignedUrl`), kids+music are on Supabase (not local short-circuit), workbox matches `(sign|public)` with CLAUDE.md's explicit "Don't narrow it back to /sign/". The migration this file *planned* is complete (STRATEGY.md: "Audio cutover complete via getPublicUrl + workbox cache"). The few still-true specifics (bucket name `room-audio`, resolver path `src/lib/roomAudioResolver.ts`, project ref) are already in CLAUDE.md. Obsolete as forward guidance. Deleted.

### 3. `project_bundle_shrink_plan.md` — **WHOLLY OBSOLETE → DELETED**

Contradicting lines (quoted):
- L13: *"iOS bundle currently 3.9 GB, dangerously close to Apple's 4 GB hard limit"* (wrong binding constraint — it is Google Play 200 MB)
- L23: *"Kids audio stays LOCAL (non-negotiable — kids work offline, no login)"*
- L27: *"Staged rollout: VIP9 first → VIP1-8 → free tier last"* (also contradicts `project_no_vip_tier.md`)
- L35: *"Kids audio offline = non-negotiable"*

**Call:** The kids-local "non-negotiable" is exactly the reverted rule; the VIP-tier rollout contradicts the no-VIP doctrine; the bundle-shrink it plans is complete. The only durably-useful content is generic safety discipline (show list before delete, tsc+vite build before commit, small commits) — already covered by CLAUDE.md "Git discipline" and memory `feedback_command_permissions.md`. Obsolete. Deleted.

**Why delete, not edit:** A corrected version of any of the three would only restate CLAUDE.md's audio doctrine (Hard invariant + Non-obvious invariants + Traps), which the memory-writing rule explicitly forbids ("don't save what the repo already records … CLAUDE.md"). Three files re-asserting the same canonical doctrine is redundant auto-load noise every session. CLAUDE.md is canonical and exhaustive here; `project_bundle_size_deferred.md` already carries the *current* live bundle concern (room-JSON deferral) and is correct — left untouched.

---

## Phase 2 — actions taken

**On-disk (the actual regression fix — `~/.claude/projects/-Users-admin-MercyB/memory/`, outside git, effective immediately for all future sessions):**

| Action | File |
|---|---|
| Deleted | `project_audio_library.md` |
| Deleted | `project_phase2_architecture.md` |
| Deleted | `project_bundle_shrink_plan.md` |
| Edited | `MEMORY.md` — removed the three stale index hooks ("avoid Supabase streaming…4 GB", "kids audio stays local", "private bucket…music/kids stay local") |

Post-fix bi-directional consistency check: **60 memory files = 60 MEMORY.md index lines, zero dangling refs.**

**In-repo (this PR — the doctrine-correction record):**

| Action | File |
|---|---|
| Added | `reports/MEMORY-FIX-audio-doctrine-2026-05-17.md` (this file) |

The memory directory lives at `~/.claude/` — outside the MercyBlade git repo, with no in-repo mirror — so the file deletions cannot be a git diff. This report is the in-repo, reviewable record of the doctrine correction, scoped to this concern only.

---

## Reference check before deletion (locked #15)

Repo-wide grep for the three filenames (excluding `.claude/worktrees/` and `node_modules`):

- **`PRINCIPLES.md:180`** — Principle #15 uses `project_audio_library.md, project_phase2_architecture.md` as *illustrative examples* of the kind of memory filename an agent must verify before propagating. Not a dependency: the principle is about verifying existence before acting, and deleting the files makes the example *more* apt (an agent told "update project_audio_library.md" should now correctly find it absent). **Left untouched** — editing a doctrine file (PRINCIPLES.md) is out of scope per locked #3 and #4. Flagged for Chau to decide separately whether to refresh the example.
- **`reports/RECON-agent-infra-audit.md`** §(b) — the source diagnosis that authorized this fix; a point-in-time report, not a live dependency. Untouched (its §(c)/(d) are separate dispatches per locked #3).
- **`MEMORY.md`** lines for all three — the only true dependency; updated as part of the on-disk fix above.

No other memory file or repo doc references the deleted files.
