# CI runner health monitor

The local Mac runner health monitor lives at:

- Repo source: `scripts/ci-runner-healthcheck.sh`
- Installed copy: `~/bin/mercyb-ci-runner-healthcheck.sh`
- LaunchAgent label: `com.mercyb.ci-runner-healthcheck`
- Default log: `~/Library/Logs/MercyB/ci-runner-healthcheck.log`

The monitor alerts when `docker info` fails or when `gitlab-runner` is not reported as running by either `gitlab-runner status` or `brew services list`.

## Intentional pause marker

Cloud GitLab runners are preferred for this project. When the local Mac runner is intentionally paused, create this marker before stopping the service:

```sh
touch ~/.mercyb-runner-paused
brew services stop gitlab-runner
```

While `~/.mercyb-runner-paused` exists, the monitor exits silently before checking Docker or `gitlab-runner`. This prevents false alarms for an intentional local pause.

Remove the marker before relying on the local runner again:

```sh
rm -f ~/.mercyb-runner-paused
brew services start gitlab-runner
```

With the marker absent, Docker crashes or runner service failures still produce the normal macOS notification and log entry.

## Local simulation

Run the focused test for both expected states:

```sh
npx vitest run scripts/__tests__/ci-runner-healthcheck.test.mjs
```

The test injects fake Docker, GitLab Runner, Brew, and notification commands. It verifies:

- intentional pause marker present: no notification and no log
- Docker down with no marker: notification and log are emitted
