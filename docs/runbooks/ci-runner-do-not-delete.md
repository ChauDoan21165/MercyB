# CI Runner Do Not Delete List

This Mac is the primary self-hosted GitLab CI runner for MercyB. The runner uses the Docker executor, so Docker Desktop and the runner configuration are load-bearing production CI dependencies.

## DO NOT DELETE

Do not delete these during disk cleanup:

- `/Users/admin/Library/Containers/com.docker.docker`
- Docker Desktop app
- `~/.gitlab-runner/config.toml`

## Why

GitLab merge-request and main-branch CI jobs run on the local Mac runner. That runner depends on the Docker daemon to start each job container.

Deleting Docker Desktop data, removing the Docker Desktop app, or deleting the GitLab runner config can take CI down across all active merge requests. The failure mode is runner/system failure before project scripts can run, so the job log may be less actionable than an ordinary test failure.

## Before Cleanup

Before deleting large local files, confirm the candidate path is not one of the protected paths above and is not Docker runner state.

Safe disk cleanup should prefer removable backups, old clean worktrees, browser caches, and generated build artifacts. Docker Desktop and `~/.gitlab-runner/config.toml` require explicit Chau approval before removal or reset.
