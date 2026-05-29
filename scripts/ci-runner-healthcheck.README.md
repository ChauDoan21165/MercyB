# CI runner healthcheck

`ci-runner-healthcheck.sh` is the source copy for the local Mac CI runner monitor installed at `~/bin/mercyb-ci-runner-healthcheck.sh`.

Create `~/.mercyb-runner-paused` when the local runner is intentionally stopped because cloud GitLab runners are handling the project:

```sh
touch ~/.mercyb-runner-paused
brew services stop gitlab-runner
```

Remove the marker before using the local runner again:

```sh
rm -f ~/.mercyb-runner-paused
brew services start gitlab-runner
```

When the marker exists, the monitor exits silently before checking Docker or `gitlab-runner`. When the marker is absent, Docker or runner failures still trigger the normal macOS notification and log entry.

Test the pause and Docker-crash paths with:

```sh
npx vitest run scripts/__tests__/ci-runner-healthcheck.test.mjs
```
