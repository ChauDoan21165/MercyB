# Netlify ship-to-prod after build gating

Last verified: 2026-06-04

Netlify builds for `mercyblade.com` are skipped by default now. Normal pushes and merge requests should not burn Netlify build credits. Production releases are published manually from GitLab.

## Exact release flow

1. Merge the change you want to ship into `main`.
2. Wait for the `main` pipeline to go green.
3. Open the latest green `main` pipeline in GitLab.
4. Click **Play** on the manual job `deploy-netlify-publish-only`.
5. Watch the job log until it finishes successfully.
6. Confirm the job used `npm run build` and then `netlify-cli deploy --prod --dir=dist --no-build`.

## Where `MERCYB_ALLOW_NETLIFY_BUILD=1` is set

This variable is **not** part of the normal production release path.

- Leave it unset for ordinary pushes, merge requests, and manual production releases.
- Only set it in GitLab CI/CD when you deliberately want to allow a Netlify build for a one-off recovery or diagnostic run.
- The safe place to set it is the GitLab **Run pipeline** UI under **Variables** or the project CI/CD variables UI for a deliberately controlled manual run.

## How to confirm Netlify did not auto-build

- A normal agent push or MR should not create a Netlify build because `scripts/netlify-ignore-build.sh` exits `0` by default.
- The repo hardening also routes `production`, `deploy-preview`, and `branch-deploy` contexts through the ignore script in `netlify.toml`.
- If no one clicked **Play** on `deploy-netlify-publish-only`, the production deploy was not intentional.

## How to confirm the deploy was intentional

- The GitLab job name is `deploy-netlify-publish-only`.
- The job must be started manually from the green `main` pipeline.
- The deploy is intentional only when a human explicitly clicked **Play** on that job.
- The job deploys prebuilt `dist/` with `--no-build`, so it does not rely on a Netlify dashboard build.

## Warnings

- Normal pushes and merge requests should not trigger Netlify builds.
- No dashboard access is needed for this runbook.
- Dashboard changes, if ever required, are separate admin-only operations and are not part of the normal ship-to-prod flow.
