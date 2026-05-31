# Worktree Isolation — Collision Signals & False Alarms

Last verified: 2026-05-30, during a multi-agent (parallel Claude Code) working session on `admin`'s Mac.

## Summary

Parallel agents work in separate `git worktree` checkouts that all share **one** `.git` object store and worktree registry. Worktrees give branch- and working-tree isolation cheaply, but three recurring **collision signals** show up across a fleet. Two of them are *false alarms* that waste a hotfix dispatch if you react to the surface symptom; one is a *real* disruption that silently kills in-flight work. This runbook is how to tell them apart and what to do.

The throughline: **confirm with `git` plumbing before alarming, and prefer a persistent worktree path over `/private/tmp`.**

---

## Signal 1 — A worktree vanishes mid-run (REAL disruption)

### What it looks like

A command that was running inside a worktree suddenly fails for no code reason:

- A long task (e.g. `vitest run`) exits non-zero with **no test summary** — it was killed mid-stream.
- The next `cd <worktree>` returns `no such file or directory`; the shell cwd resets to the main checkout.
- `git worktree list` no longer shows the path, and `ls <path>` is gone from disk.

### Confirmed evidence (2026-05-30)

- A worktree at `/private/tmp/mercyb-b4-test-sharding` was deleted **while `vitest run` was finishing inside it**. The run reported `EXIT=1` with all visible test lines green but **no `Test Files … Duration …` summary block** — the classic shape of a process whose working directory was yanked out from under it, not a test failure.
- A re-run in a **persistent** location (`~/MercyB-b4-test-sharding`) immediately passed: `589 files / 10173 tests, all green`, confirming the earlier `EXIT=1` was the deletion artifact.
- A *sibling* `/private/tmp` worktree (`mercyb-b4-topic-comment-golden`) **survived** the same window — so it was **not** a blanket `/tmp` wipe. The likeliest cause is another agent running `git worktree prune` (or `git worktree remove`) after manually `rm`-ing a stale `/private/tmp` sibling, or macOS temp-dir cleanup reaping an idle `/private/tmp` path.

### How to confirm (don't misread it)

- A bare `EXIT=1` with **no tool summary** + a `cd` failure is the tell. Don't re-diagnose it as a test/lint failure — check the worktree still exists first: `git worktree list | grep <path>` and `ls -d <path>`.
- If the **branch** still exists (`git branch --list <name>`) but the **worktree dir** is gone, only the working tree was lost — your commits are safe in `.git`. Recreate the worktree on the same branch and continue.

### Mitigation

- **Create worktrees under `~/MercyB-<label>`, not `/private/tmp/…`.** Every persistent worktree in this repo (`~/MercyB-c3-…`, etc.) survives; the `/private/tmp` ones are the ones that disappear. This session's recreated worktree in `~` was never touched again.
- Before pruning, scope it: `git worktree list` + confirm the target is genuinely stale (HEAD at `origin/main`, no unpushed work) — see [worktree-prune-check discipline]. Never `git worktree prune` blind while other agents may hold `/private/tmp` worktrees with live processes.
- Commit early and push often, so a vanished working tree costs nothing.

---

## Signal 2 — Stale shared `node_modules` → false RED (FALSE alarm)

### What it looks like

A fresh worktree's typecheck/build/test fails with `Cannot find package 'X'` or `Module not found`, suggesting "main is broken" — when main is fine.

### Why it happens

Fresh worktrees have **no `node_modules`** (it's gitignored). The fleet convention is to **symlink the main repo's `node_modules`** into the worktree for gate runs:

```bash
ln -s /Users/admin/MercyB/node_modules <worktree>/node_modules
```

That symlink goes **stale** the moment the worktree's `package.json` / `package-lock.json` differs from what the shared `node_modules` was installed against (a dependency was added/removed on a branch, or the shared tree is mid-`npm ci`). The resulting "module not found" is a **symlink-staleness artifact, not a real regression.** A transient variant was seen this session: an initial `npx vitest` failed with `Cannot find package 'vitest'` and then succeeded unchanged moments later.

### How to confirm (before flagging "main broken")

- Reproduce in an **un-symlinked** worktree with a real install:
  ```bash
  rm <worktree>/node_modules        # drop the symlink
  npm ci --legacy-peer-deps         # isolated, in-worktree install
  ```
  If the gate goes green after a clean `npm ci`, it was the stale symlink — **do not** dispatch a hotfix for "main is red." (Reacting to this misdirected a hotfix once.)

### Mitigation

- Symlink the shared `node_modules` **only** for read-only gate runs on a branch whose deps match main.
- If the task changes or needs dependencies, **drop the symlink and `npm ci` inside the worktree** (Chau-endorsed; zero shared-state risk). Never run `npm install` against, or `git reset`, the **shared** main repo while another agent may be using it.

---

## Signal 3 — Same-worktree concurrent-CC write collision (confirm, don't assume)

### What it looks like

Two agents appear to be editing the same files: a file is "modified since you read it," mtimes drift under your feet, and `ps | grep claude` shows several processes.

### How to confirm (avoid the false alarm)

`ps | grep claude` process count is **not** evidence — most of those are Claude **desktop-app** noise, not coding agents. Likewise a bare mtime change can be a harmless auto-regenerated artifact. Confirm a *real* collision with plumbing:

- **Porcelain truth**: `git status --porcelain` — compare what's *committed* vs what's *actively changing*. A file you didn't touch showing as modified is the signal.
- **Recent writes**: `find <dir> -mmin -2` — what was actually written in the last two minutes.
- **History**: `git reflog` / `git log` — did another branch/commit land here?
- **Known auto-regenerated files are NOT collisions**: `src/lib/roomManifest.ts`, the sitemap, and `version.json` are regenerated by prebuild hooks — their churn is expected, not a second agent.

### Mitigation

- One agent per working tree. If a course-correction or pasted command references **another agent's worktree, branch, or `A<N>`/`C<N>` label**, refuse and re-confirm — don't execute it.
- If you detect a genuine second writer in your tree (mtime drift **and** "modified since read" **and** porcelain shows un-authored changes), **stand down** and surface it rather than racing edits.

---

## Quick reference

| Symptom | Likely signal | First check | Action |
| --- | --- | --- | --- |
| Long command `EXIT=1`, no summary, `cd` now fails | 1 — worktree deleted | `git worktree list`, `ls -d <path>` | Recreate worktree on same branch (commits are safe); move to `~/`, not `/private/tmp` |
| `Cannot find package` / `Module not found` on a fresh branch | 2 — stale symlink | `rm node_modules && npm ci` in-worktree | Re-run gate; do **not** flag "main red" until reproduced clean |
| File "modified since read", mtime drift, many `claude` procs | 3 — maybe a 2nd writer | `git status --porcelain`, `find -mmin -2`, reflog | Confirm before alarming; ignore auto-regenerated files; stand down on a real collision |

## Related discipline

- Prefer persistent `~/MercyB-<label>` worktrees over `/private/tmp` for any task with a long-running command.
- Branch every worktree off a fresh `origin/main` (`git fetch` first), never a stale local `main`.
- Scope every `git worktree prune` / `remove` to a verified-stale target.
