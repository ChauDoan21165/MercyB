# Supervisor tooling

Three bash scripts that externalize the supervisor's bus when many
Claude Code / agent terminals are running in parallel and the human
operator becomes the cut-paste bottleneck.

| Script | Reads | Writes | Network |
|---|---|---|---|
| `merge-clean.sh` | open MRs from GitLab | `glab mr merge` (only with `--yes`) | yes — GitLab API |
| `mr-status.sh`   | open MRs from GitLab | nothing                              | yes — GitLab API |
| `agent-state.sh` | `~/.mercyb/agent-state.json` | same file (atomic write) | no |

All three are **read-only with respect to this repository**. None of
them edit source files, run migrations, or touch Supabase. They are
operator tools, not pipeline tools.

## Requirements

- `glab` CLI authenticated against `gitlab.com` as the project owner:
  ```bash
  brew install glab            # macOS
  glab auth login              # follow prompts; use SSH for git operations
  ```
- `jq` (JSON parser):
  ```bash
  brew install jq              # macOS
  ```
- `bash` 4+ (macOS default `/bin/bash` is 3.2; the scripts use
  `#!/usr/bin/env bash` so a newer bash on `PATH` is picked up. Homebrew
  installs to `/opt/homebrew/bin/bash`).

If `glab` or `jq` is missing, the scripts print a single ERROR line and
exit 2.

## Put them on `PATH`

```bash
# Add this to ~/.zshrc or ~/.bashrc (adjust the path to your checkout):
export PATH="$HOME/MercyB/scripts/supervisor:$PATH"
```

After reloading the shell, you can call them by short name:

```bash
merge-clean.sh
mr-status.sh
agent-state.sh list
```

The scripts themselves do not modify `PATH` — that's an operator
decision.

## `merge-clean.sh`

Iterates every open MR, classifies it, and auto-merges the ones that
are unambiguously safe.

**Default mode is DRY-RUN.** It will print what it WOULD merge and exit
without calling `glab mr merge`. Pass `--yes` to actually merge.

```bash
merge-clean.sh           # dry-run — shows what would merge
merge-clean.sh --yes     # actually merges eligible MRs
```

An MR is "eligible to auto-merge" only if ALL of these are true:

1. State is `opened`.
2. Not a draft.
3. No merge conflicts.
4. Head pipeline status is `success`.
5. Title does NOT contain (case-insensitive): `REQUIRES_OWNER_DECISION`,
   `DROP`, `REVOKE`, or `destructive`.
6. Description does NOT contain `REQUIRES_OWNER_DECISION`.

Anything that fails one of those gates is **skipped** with a one-line
reason. You can still merge skipped MRs by hand in the UI; this script
is the conservative path, not the only path.

Final line is a summary:

```
Summary (dry-run): would-merge=3 skipped=5
  !1234  SKIP  draft
  !1230  SKIP  conflicts
  !1229  SKIP  pipeline=failed
  !1225  SKIP  title contains REQUIRES_OWNER_DECISION
  !1224  SKIP  state=closed
```

## `mr-status.sh`

A live snapshot of the MR queue, one line per open MR, sorted by MR
number descending. Output is pipe-delimited for human eyes:

```
!1234 | cd12536  | feat(supervisor): add merge-clean…              | ready
!1233 | a47-bot  | docs: post-migration realignment                 | draft
!1230 | c7-bot   | chore: rotate webhook secrets                    | conflicts
!1229 | c3-bot   | test: stage-3a coverage                          | pipeline-running
```

Designed for a `watch` loop in a corner terminal:

```bash
watch -n 30 scripts/supervisor/mr-status.sh
```

Exit code is 0 whether or not there are open MRs. Empty queue = empty
output (no "no MRs" line), which keeps the watch window quiet when the
queue is clear.

## `agent-state.sh`

A tiny key-value store in `$HOME/.mercyb/agent-state.json` for the
"which agent is doing what right now" question. NOT in the repo.

```bash
agent-state.sh mark C1 working      # call at start of dispatch
agent-state.sh mark-idle C1         # call when reporting done
agent-state.sh list                 # pretty table of all agents
agent-state.sh idle                 # just the idle agent names, one per line
```

Valid statuses: `idle`, `working`, `blocked`, `reporting`. The `mark`
subcommand also records the current git branch and working directory of
the calling shell, so `list` shows "agent C1, working on
feat/supervisor-tools in ~/MercyB-c1-supervisor-tools".

Override the state file location with `MERCYB_STATE_DIR=...` if you
need to test in isolation.

## Dispatch-template integration

Add these two lines to the agent dispatch template:

```text
At the start of your run, call:
  scripts/supervisor/agent-state.sh mark <YOUR_LABEL> working

When you finish (success or blocked), call:
  scripts/supervisor/agent-state.sh mark-idle <YOUR_LABEL>
  # or `mark <YOUR_LABEL> blocked` if you're stopping with an open question
```

This is the cheapest possible bus: every agent self-reports its own
state when it transitions, the supervisor reads `agent-state.sh list`
to see the fleet.

## Patterns

```bash
# Quick "is anything mergeable right now" check:
merge-clean.sh | grep WOULD-MERGE

# Watch the queue in one tmux pane:
watch -n 30 scripts/supervisor/mr-status.sh

# See who is free for a new dispatch:
agent-state.sh idle

# After a long dispatch round, merge everything that's clearly safe:
merge-clean.sh           # eyeball the dry-run
merge-clean.sh --yes     # commit the merges
```

## What this is NOT

- **Not a CI replacement.** Pipelines are still authoritative; this
  script only auto-merges MRs whose pipelines went green on their own.
- **Not a policy engine.** The "destructive" / "REQUIRES_OWNER_DECISION"
  banlist is a thin tripwire, not a security boundary. Anything that
  could go wrong if auto-merged is the caller's responsibility to
  guard with the title prefix.
- **Not a queue manager.** No retry, no de-dupe, no scheduling.
  Run it from the supervisor terminal whenever you want a sweep.

## Tests

`tests/scripts/supervisor-script-shape.test.ts` is the only test. It
inspects the bash files as strings (no real `glab` or `jq` is invoked
from CI) and asserts:

- `--help` is reachable on every script.
- Every script exits non-zero on bad input.
- No script echoes a Supabase key, database URL, or other secret.
- `merge-clean.sh` defaults to dry-run.

Run with `npx vitest run tests/scripts/supervisor-script-shape.test.ts`.
