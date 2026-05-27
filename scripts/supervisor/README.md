# Supervisor tooling

Bash scripts that externalize the supervisor's bus when many Claude
Code / agent terminals are running in parallel and the human operator
becomes the cut-paste bottleneck.

| Script | Reads | Writes | Network |
|---|---|---|---|
| `merge-clean.sh`        | open MRs from GitLab                                  | `glab mr merge` (only with `--yes`) | yes — GitLab API |
| `mr-status.sh`          | open MRs from GitLab                                  | nothing                             | yes — GitLab API |
| `agent-state.sh`        | `~/.mercyb/agent-state.json` + `dispatch-log.jsonl`   | both files (atomic)                 | no |
| `dispatch-template.sh`  | argv only                                             | nothing                             | no |
| `fleet-dashboard.sh`    | composes `mr-status.sh` + `agent-state.sh list`       | nothing                             | yes — via mr-status |
| `dispatch-log.sh`       | `~/.mercyb/dispatch-log.jsonl`                        | nothing                             | no |

All of them are **read-only with respect to this repository**. None
edit source files, run migrations, or touch Supabase. They are operator
tools, not pipeline tools.

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
agent-state.sh mark C1 working          # call at start of dispatch
agent-state.sh mark-idle C1             # call when reporting done (no log entry)
agent-state.sh report-done C1 78        # call after `glab mr create` (logs entry + marks idle)
agent-state.sh list                     # pretty table of all agents
agent-state.sh idle                     # just the idle agent names, one per line
```

Valid statuses: `idle`, `working`, `blocked`, `reporting`. The `mark`
subcommand also records the current git branch and working directory of
the calling shell, so `list` shows "agent C1, working on
feat/supervisor-tools in ~/MercyB-c1-supervisor-tools".

`report-done <agent> <mr>` is the recommended close-out call: it
atomically appends one JSON line to `~/.mercyb/dispatch-log.jsonl`
recording who finished what, then flips the agent to idle. Use it
right after `glab mr create` returns the MR number. If you forget,
`mark-idle <agent>` still works — you just lose the audit trail for
that dispatch.

Override the state file location with `MERCYB_STATE_DIR=...` if you
need to test in isolation. Both `agent-state.json` and
`dispatch-log.jsonl` move with the env var.

## `dispatch-template.sh`

Generates a starter dispatch brief on stdout. Operator pastes it into
the target agent's terminal, fills in the variable parts (deliverables,
read-first list), and sends.

```bash
dispatch-template.sh C3 "fix the next a11y serious finding"
dispatch-template.sh C3 "fix a11y" | pbcopy    # straight to clipboard
```

The emitted brief already includes:

- worktree-claim + `npm ci` sleep boilerplate
- `agent-state.sh mark <agent> working` at the top
- `agent-state.sh report-done <agent> <MR>` at the bottom
- standard gate checklist (typecheck:ci, lint, vitest, bash -n)
- the universal report-banner block

The script does **not** talk to GitLab, look up agent state, or pick a
worktree path beyond a placeholder. It is pure text generation.

## `fleet-dashboard.sh`

Single-screen view that composes `mr-status.sh` + `agent-state.sh list`
plus a one-line derived summary (`N idle agents · M MRs awaiting merge
· K MRs running`). Designed for a single watch loop:

```bash
watch -n 30 scripts/supervisor/fleet-dashboard.sh
```

It shells out to the other supervisor scripts rather than reimplementing
their logic — if `merge-clean.sh` ever gets a smarter "ready" gate, the
dashboard inherits it for free. Read-only: never calls `mark`,
`report-done`, or `merge`.

## `dispatch-log.sh`

Reads `~/.mercyb/dispatch-log.jsonl` and prints the rolling timeline.
Defaults to the last 24 hours; flags widen or narrow the window.

```bash
dispatch-log.sh                          # last 24h
dispatch-log.sh --agent C3               # filter by agent
dispatch-log.sh --since 2026-05-27       # since date (ISO or YYYY-MM-DD)
dispatch-log.sh --agent C3 --since 2026-05-27
dispatch-log.sh --all                    # no time window
```

Output is TSV-aligned, one row per matching dispatch, oldest at top so
the timeline reads chronologically:

```
2026-05-27T22-00-00Z  C1     !78    feat/supervisor-tools
2026-05-27T22-30-00Z  C3     !79    feat/a11y-fix
```

A malformed log file (one line that isn't valid JSON) is an exit-3
error rather than a partial print — the timeline shouldn't lie.

### `~/.mercyb/dispatch-log.jsonl` schema

One JSON object per line. Append-only; rotation/pruning is manual (just
delete or rename the file).

```json
{
  "ts": "2026-05-27T22-00-00Z",
  "agent": "C1",
  "mr": 78,
  "branch": "feat/supervisor-tools",
  "worktree": "/Users/admin/MercyB-c1-supervisor-tools",
  "action": "done"
}
```

| Field      | Type             | Notes |
|---|---|---|
| `ts`       | string (ISO)     | UTC, hyphen-separated time portion (matches `agent-state.sh`'s `iso_ts`). Sortable as a string. |
| `agent`    | string           | The agent label passed to `report-done`. |
| `mr`       | number or string | Cast to number when the input is purely digits; otherwise preserved as the original string. |
| `branch`   | string           | Git branch of the worktree the calling shell was in. |
| `worktree` | string           | `pwd` of the calling shell. |
| `action`   | string           | Always `"done"` today. Reserved for future verbs (`blocked`, `re-dispatch`). |

Writes use a single `printf >>` of one line — atomic up to PIPE_BUF on
POSIX, so concurrent agents won't interleave bytes.

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

# Watch the queue + fleet in one tmux pane:
watch -n 30 scripts/supervisor/fleet-dashboard.sh

# Or just the MR queue:
watch -n 30 scripts/supervisor/mr-status.sh

# See who is free for a new dispatch:
agent-state.sh idle

# Generate a dispatch brief and pipe to clipboard:
dispatch-template.sh C3 "fix the next a11y serious finding" | pbcopy

# After a long dispatch round, merge everything that's clearly safe:
merge-clean.sh           # eyeball the dry-run
merge-clean.sh --yes     # commit the merges

# What did the fleet ship today?
dispatch-log.sh
dispatch-log.sh --agent C3 --since 2026-05-27
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

Two shape tests pin the surface (no real `glab` / `jq` is invoked from
CI):

- `tests/scripts/supervisor-script-shape.test.ts` — covers the !78
  surface (`merge-clean.sh`, `mr-status.sh`, the !78 form of
  `agent-state.sh`).
- `tests/scripts/supervisor-bus-v2-shape.test.ts` — covers the v2
  surface (`dispatch-template.sh`, `fleet-dashboard.sh`,
  `dispatch-log.sh`, the new `report-done` subcommand on
  `agent-state.sh`).

Shared rules across both:

- `--help` is reachable on every script.
- Every script exits non-zero on bad input.
- No script echoes a Supabase key, database URL, or other secret.
- `merge-clean.sh` defaults to dry-run.
- `report-done` validates the MR number as a positive integer and
  appends to `~/.mercyb/dispatch-log.jsonl` (HOME, not repo).

Run with `npx vitest run tests/scripts/`.
