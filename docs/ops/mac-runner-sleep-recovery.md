# Mac GitLab Runner Sleep Recovery

Last verified: 2026-05-28 on `admin`'s Mac runner.

## Summary

The runner failures are caused by the Mac host sleeping while it is acting as a GitLab Docker executor. That sleep boundary makes Docker Desktop's VM and socket unavailable, so GitLab Runner reaches `prepare_executor`, cannot prepare the Docker executor, and reports `runner_system_failure`.

This is not a repository build failure. It is a host availability failure.

## Confirmed Evidence

Host state observed during the incident review:

- `pmset -g custom` had `sleep 1` on both AC and battery. That means the host was configured to enter system sleep after 1 minute of idle time.
- `pmset -g log` showed actual sleep events on 2026-05-28, including `Idle Sleep` at 18:11:09 local and clamshell sleeps at 16:34:22 and 18:17:20 local.
- `pmset -g assertions` showed no persistent `PreventSystemSleep` assertion from `gitlab-runner`, Docker Desktop, or `caffeinate`. The only active sleep prevention was the normal `powerd` display-on assertion.
- Docker Desktop was running when inspected, but its settings store had `"AutoStart": false`.
- Docker Desktop logs showed the engine/VM lifecycle changing around the same failure window:
  - `2026-05-28T15:30:43Z` / `09:30:43` local: Docker entered `Idle:shutdown`, `Docker:stopping`, then `Docker:stopped`.
  - `2026-05-28T15:45:21Z` / `09:45:21` local: a GitLab Runner helper image request caused Docker to start the VM again.
  - `2026-05-28T22:30:40Z` / `16:30:40` local: Docker recorded pause/unpause handling and then `POST /shutdown`, closing guest services including the Docker API proxy control socket.
- `gitlab-runner --version` reported GitLab Runner 19.0.0 on `darwin/arm64`, configured with the Docker executor in `~/.gitlab-runner/config.toml`.
- At the time of the 2026-05-28 review, no GitLab Runner launchd service was installed or loaded:
  - `brew services list` showed `gitlab-runner none`.
  - `launchctl print gui/501/com.gitlab.gitlab-runner` returned "Could not find service".
  - `launchctl print system/com.gitlab.gitlab-runner` returned "Could not find service".
  - No `*gitlab*runner*.plist` was present in `/Library/LaunchDaemons` or `~/Library/LaunchAgents`.

Conclusion: macOS sleep is confirmed. Docker Desktop engine pause/shutdown across that boundary is confirmed. The runner also lacked a launchd supervisor, so even after wake it had no reliable host-level service recovery path.

### Update — 2026-05-29: stock launchd plist installed (still insufficient)

A launchd supervisor has since been added, so the "no supervisor" gap above is partially closed — but with the weaker variant this doc warns against:

- `~/Library/LaunchAgents/gitlab-runner.plist` was created `2026-05-29 06:37` with `Label = gitlab-runner`, `KeepAlive = true`, `RunAtLoad = true`. It execs `/opt/homebrew/bin/gitlab-runner run` directly against `~/.gitlab-runner/config.toml`.
- This is the **stock** service (see "Install GitLab Runner Under launchd → Stock fallback"), **not** the Docker-readiness wrapper. It starts `gitlab-runner run` immediately on load and on wake with no `until docker info` gate, so after a sleep→wake boundary the runner can come back online and pick up a job before Docker Desktop has finished recreating its socket — the exact `runner_system_failure` failure mode this doc exists to prevent.
- Recommended: migrate to the `com.gitlab.gitlab-runner.plist` Docker-readiness wrapper documented below (it runs `open -gj -a Docker`, blocks on `until docker info`, then execs the runner). Do not keep both plists loaded — they compete for the same `config.toml` and can spawn duplicate runner processes; unload `gitlab-runner.plist` before loading the wrapper, per that section.

## Prevention Configuration

Apply these settings on the Mac that owns the registered runner.

### 1. Keep the Runner Host Awake

For a dedicated CI runner, disable system sleep while allowing the display to sleep:

```bash
sudo pmset -a sleep 0
sudo pmset -a disksleep 0
sudo pmset -a displaysleep 10
sudo pmset -a powernap 0
sudo pmset -a tcpkeepalive 1
sudo pmset -a womp 1
```

Verify:

```bash
pmset -g custom
pmset -g assertions
```

Expected result:

- `sleep 0` for AC and battery.
- `disksleep 0` for AC and battery.
- No recurring idle sleep entries in `pmset -g log`.

If this machine is a laptop and must sometimes run on battery, keep it plugged in while it is registered as an active runner. Clamshell sleep can still happen when the lid is closed if external-display power/session conditions are not met, so prefer leaving the lid open or using a true desktop host for always-on CI.

### 2. Disable Docker Desktop Resource Saver

Docker Desktop was configured with resource saver enabled and `autoPauseTimeoutSeconds` set to 300 seconds in the expanded settings log. That is acceptable for a developer laptop, but not for a CI executor that needs the Docker API socket to remain warm.

In Docker Desktop:

1. Open Settings.
2. Go to Resources.
3. Disable Resource Saver.
4. Apply and restart Docker Desktop.

Verify from logs after restart:

```bash
rg -n '"useResourceSaver":false|useResourceSaver' \
  ~/Library/Containers/com.docker.docker/Data/log/host/com.docker.backend.log
```

The important operational check is that Docker does not return to `Idle:shutdown` while the runner is online:

```bash
rg -n 'Idle:shutdown|Docker:stopped|POST /shutdown|pause resuming' \
  ~/Library/Containers/com.docker.docker/Data/log/host/com.docker.backend.log \
  ~/Library/Containers/com.docker.docker/Data/log/vm/console.log
```

### 3. Enable Docker Desktop Auto-Start

The inspected setting was `"AutoStart": false`. Enable Docker Desktop at login so a reboot or user-session restart brings the Docker socket back without manual intervention.

In Docker Desktop:

1. Open Settings.
2. Go to General.
3. Enable "Start Docker Desktop when you sign in".
4. Apply and restart Docker Desktop.

Verify:

```bash
plutil -p "$HOME/Library/Group Containers/group.com.docker/settings-store.json" | rg AutoStart
```

Expected result:

```text
"AutoStart" => 1
```

### 4. Install GitLab Runner Under launchd

The runner was configured but not supervised by launchd. The preferred service for this Mac is a launchd wrapper that opens Docker Desktop, waits until `docker info` succeeds, and only then starts GitLab Runner.

Do not keep both the stock `gitlab-runner install` plist and the wrapper below. They would compete for the same runner config and can create duplicate runner processes.

If a stock service already exists, unload it before installing the wrapper:

```bash
gitlab-runner stop 2>/dev/null || true
launchctl unload "$HOME/Library/LaunchAgents/gitlab-runner.plist" 2>/dev/null || true
launchctl unload "$HOME/Library/LaunchAgents/com.gitlab.gitlab-runner.plist" 2>/dev/null || true
```

Create `~/bin/gitlab-runner-docker-ready`:

```bash
#!/usr/bin/env bash
set -euo pipefail

open -gj -a Docker

until docker info >/dev/null 2>&1; do
  sleep 5
done

exec /opt/homebrew/bin/gitlab-runner run \
  --working-directory "$HOME/.gitlab-runner" \
  --config "$HOME/.gitlab-runner/config.toml"
```

Then create `~/Library/LaunchAgents/com.gitlab.gitlab-runner.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
  "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.gitlab.gitlab-runner</string>
  <key>ProgramArguments</key>
  <array>
    <string>/Users/admin/bin/gitlab-runner-docker-ready</string>
  </array>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/Users/admin/.gitlab-runner/launchd.out.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/admin/.gitlab-runner/launchd.err.log</string>
  <key>WorkingDirectory</key>
  <string>/Users/admin/.gitlab-runner</string>
</dict>
</plist>
```

Load it:

```bash
chmod +x "$HOME/bin/gitlab-runner-docker-ready"
launchctl load "$HOME/Library/LaunchAgents/com.gitlab.gitlab-runner.plist"
launchctl start com.gitlab.gitlab-runner
```

Verify launchd sees it:

```bash
launchctl list | rg -i 'gitlab|runner'
docker info
```

Stock fallback, if the wrapper is not wanted:

```bash
gitlab-runner install \
  --working-directory "$HOME/.gitlab-runner" \
  --config "$HOME/.gitlab-runner/config.toml"
gitlab-runner start
gitlab-runner status
```

The stock fallback is less robust because it can start before Docker Desktop has finished recreating its socket after login or wake.

## Is `caffeinate` the Right Answer?

`caffeinate` is a valid guardrail, but it is not the durable fix for an always-on runner.

The local man page says that `caffeinate` creates power assertions and that `-i` prevents idle sleep while the command runs. That is useful for a temporary runner session:

```bash
caffeinate -is gitlab-runner run \
  --working-directory "$HOME/.gitlab-runner" \
  --config "$HOME/.gitlab-runner/config.toml"
```

Use it when:

- Running the runner manually for a short session.
- Validating that sleep prevention fixes the failure pattern.
- Keeping a temporary job alive while permanent settings are being applied.

Do not use it as the only fix because:

- It dies when the shell/session dies unless launchd supervises it.
- It does not enable Docker Desktop auto-start.
- It does not disable Docker Desktop Resource Saver.
- It does not create a deterministic recovery path after reboot or user logout.

For this runner, the durable fix is `pmset sleep 0`, Docker Desktop auto-start, Docker Resource Saver off, and a launchd-supervised runner that waits for Docker readiness.

## Recovery Checklist

Use this when pipelines fail in `prepare_executor` with `runner_system_failure`, Docker socket errors, or "Cannot connect to the Docker daemon".

### 1. Stop Taking New Jobs

In GitLab, pause the Mac runner if failures are repeating. This prevents a stream of red pipelines while the host is recovering.

### 2. Confirm Host Sleep or Docker Socket Loss

```bash
date
pmset -g log | egrep -i ' Sleep | Wake | DarkWake |Idle Sleep|Clamshell Sleep|Maintenance Sleep' | tail -80
pmset -g assertions
docker info
docker context ls
```

If `docker info` fails, Docker Desktop or its socket is not ready.

### 3. Restart Docker Desktop Cleanly

```bash
osascript -e 'quit app "Docker"'
sleep 10
open -gj -a Docker

until docker info >/dev/null 2>&1; do
  sleep 5
done

docker ps
```

If Docker does not recover, use Docker Desktop's Troubleshoot menu to restart Docker Desktop, then rerun `docker info`.

### 4. Restart GitLab Runner

If the Docker-readiness launchd wrapper is installed:

```bash
launchctl kickstart -k "gui/$(id -u)/com.gitlab.gitlab-runner"
launchctl list | rg -i 'gitlab|runner'
```

If the stock GitLab Runner service is installed instead:

```bash
gitlab-runner restart
gitlab-runner status
```

If running manually:

```bash
caffeinate -is gitlab-runner run \
  --working-directory "$HOME/.gitlab-runner" \
  --config "$HOME/.gitlab-runner/config.toml"
```

### 5. Verify Runner and Docker Executor Health

```bash
gitlab-runner verify
docker run --rm node:22-bullseye-slim node --version
```

Then unpause the runner in GitLab and rerun the failed pipeline.

### 6. Capture Evidence Before Closing the Incident

Append the important lines to the incident note or MR:

```bash
pmset -g custom
pmset -g assertions
pmset -g log | egrep -i ' Sleep | Wake | DarkWake |Idle Sleep|Clamshell Sleep|Maintenance Sleep' | tail -80
rg -n 'Idle:shutdown|Docker:stopped|POST /shutdown|pause resuming|starting VM' \
  ~/Library/Containers/com.docker.docker/Data/log/host/com.docker.backend.log \
  ~/Library/Containers/com.docker.docker/Data/log/vm/console.log
gitlab-runner status
docker info
```

## Green-State Checklist

The Mac runner is healthy when all of these are true:

- `pmset -g custom` shows `sleep 0`.
- Docker Desktop General settings have auto-start enabled.
- Docker Desktop Resource Saver is disabled.
- `docker info` succeeds without manually opening Docker.
- `gitlab-runner status` reports the service is running.
- `launchctl list | rg -i 'gitlab|runner'` shows a loaded runner service.
- A trivial Docker executor pipeline completes after the Mac has sat idle longer than the previous failure interval.

---

# Doubled-ref CI glitch (Tests=0 / malformed merge-request ref)

A separate, intermittent failure on the same Mac runner. Documented here because
it is a **runner/environment** problem, not a repo-config bug, and it shares the
build-dir-corruption failure mode the sleep issue can also cause.

## Symptom

- A merge-request pipeline reports **`Tests=0`** (no tests run) — which **stalls
  auto-merge**, since the merge gate never sees a green test job.
- The job's "Getting source from Git repository" phase shows a **malformed,
  prefix-doubled fetch ref**: `refs/heads/refs/merge-requests/N/head` (the
  correct form is `refs/merge-requests/N/head`).
- **Intermittent** — it bites *some* MR pipelines, not all (e.g. it hit the !316
  pipeline). A config bug would be deterministic; intermittency points at runner
  state.

## Root cause (confirmed runner/environment — NOT `.gitlab-ci.yml`)

The ref is constructed entirely inside the GitLab Runner's source-fetch phase
(it prints `Checking out <sha> as detached HEAD (ref is refs/merge-requests/N/head)`
*before* any `before_script` runs). Evidence the repo config is not involved:

- `.gitlab-ci.yml` sets only `GIT_DEPTH: "20"` — **no** `GIT_STRATEGY`,
  `GIT_CHECKOUT`, `GIT_CLONE_PATH`, `GIT_FETCH_EXTRA_FLAGS`, `pre_get_sources_script`,
  or `CI_MERGE_REQUEST_REF_PATH` usage. `refs/heads` appears in zero git commands.
- The only script-level fetch (`scripts/ci/check-new-orphans.mjs`) does
  `git fetch origin <target-branch-name>` (a branch name, never a `refs/…` path),
  so it cannot produce the doubled prefix.

The doubled `refs/heads/` prefix is the runner mangling its own refspec — a
runner-version / git-fetch-state issue, made likely by stale reuse of the
`concurrent = 1` runner's build directory (an interrupted fetch — including one
cut off by a sleep/wake boundary, see above — can leave a bad ref behind).

## Recovery (immediate — re-fetches cleanly)

**Retry the bitten pipeline.** A fresh run re-fetches the source and the ref
resolves correctly (verified: !316's retried pipeline checked out
`refs/merge-requests/316/head` normally and ran all tests). Until the root fix
lands, **do not rely on auto-merge for the Mac runner** — when the glitch hits,
retry the pipeline to unblock.

## Root fix — update gitlab-runner + clear the stale build dir

Pick the sequence matching your install. The current runner is the
**Homebrew (Apple-Silicon) binary at `/opt/homebrew/bin/gitlab-runner`** managed
by `~/Library/LaunchAgents/gitlab-runner.plist`. Confirm the build dir first:

```bash
# builds_dir is usually <working-directory>/builds; the launchd plist sets
# --working-directory /Users/admin/MercyB, so builds default to:
grep -E 'builds_dir|working-directory' ~/.gitlab-runner/config.toml ~/Library/LaunchAgents/gitlab-runner.plist
```

### A. Homebrew install

```bash
brew services stop gitlab-runner            # or: launchctl unload ~/Library/LaunchAgents/gitlab-runner.plist
brew update && brew upgrade gitlab-runner
rm -rf /Users/admin/MercyB/builds           # clear the stale build dir holding the bad ref
brew services start gitlab-runner           # or: launchctl load ~/Library/LaunchAgents/gitlab-runner.plist
gitlab-runner --version && gitlab-runner verify
```

### B. Manual-binary install

```bash
gitlab-runner stop                          # or: launchctl unload ~/Library/LaunchAgents/gitlab-runner.plist
# Replace the binary in place (Apple Silicon = darwin-arm64; use darwin-amd64 on Intel):
sudo curl -L --output /opt/homebrew/bin/gitlab-runner \
  "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-darwin-arm64"
sudo chmod +x /opt/homebrew/bin/gitlab-runner
rm -rf /Users/admin/MercyB/builds           # clear the stale build dir
gitlab-runner start                         # or: launchctl load ~/Library/LaunchAgents/gitlab-runner.plist
gitlab-runner --version && gitlab-runner verify
```

(If your manual binary lives elsewhere — e.g. `/usr/local/bin/gitlab-runner` —
substitute that path in the `curl`/`chmod` lines.)

## Stopgap (deliberate, NOT applied) — `GIT_STRATEGY: clone`

If the glitch recurs before the runner can be updated, forcing a **fresh clone
per job** sidesteps stale-build-dir refspec corruption. Add to `.gitlab-ci.yml`
`variables:`:

```yaml
variables:
  GIT_STRATEGY: clone   # stopgap for the doubled-ref glitch — REMOVE once the runner is fixed
```

This is a **workaround, not the root fix** — it trades pipeline speed (a full
clone every job instead of incremental fetch) for avoiding the corrupted-fetch
path. It is intentionally **left unapplied**; apply only if recurrence forces it,
and remove after the runner update. Root cause remains runner/environment (Lane C
/ infra).

## Green-state check (doubled-ref glitch)

- A new MR pipeline's source phase prints `ref is refs/merge-requests/N/head`
  (single prefix, no doubled `refs/heads/`).
- The test job runs with a non-zero test count.
- `gitlab-runner --version` shows the updated version; `gitlab-runner verify` passes.
