# Stale Netlify ship-to-prod runbook

Last verified as stale: 2026-06-12

> **STALE:** MercyBlade production deploys now use the guarded Cloudflare Pages path in `.gitlab-ci.yml` (`deploy-cloudflare-pages`) and `scripts/deploy-cloudflare-pages-main.sh`. The old Netlify publish job was retired because it targets the dead origin. Keep this file only as historical context for the old Netlify build-gating posture.

Netlify builds for `mercyblade.com` are skipped by default. Normal pushes and merge requests should not burn Netlify build credits, and the old Netlify publish path is no longer the production release path.

## Current release flow

1. Merge the change you want to ship into `main`.
2. Wait for the `main` pipeline to go green.
3. From a main pipeline with `MERCYB_CF_DEPLOY_ENABLED=1`, click **Play** on `deploy-cloudflare-pages`.
4. Watch the job log until `scripts/deploy-cloudflare-pages-main.sh` finishes successfully.
5. Click **Play** on `golden-flows-prod` in the same main pipeline, or run `npm run verify:golden-flows` locally with the production golden-flow secrets.
6. Confirm production via `version.json` and the golden-flow result before declaring the deploy done.

## Where `MERCYB_ALLOW_NETLIFY_BUILD=1` is set

This variable is **not** part of the normal production release path.

- Leave it unset for ordinary pushes, merge requests, and manual production releases.
- Only set it in GitLab CI/CD when you deliberately want to allow a Netlify build for a one-off recovery or diagnostic run.
- The safe place to set it is the GitLab **Run pipeline** UI under **Variables** or the project CI/CD variables UI for a deliberately controlled manual run.

## How to confirm Netlify did not auto-build

- A normal agent push or MR should not create a Netlify build because `scripts/netlify-ignore-build.sh` exits `0` by default.
- The repo hardening also routes `production`, `deploy-preview`, and `branch-deploy` contexts through the ignore script in `netlify.toml`.
- If no one clicked **Play** on `deploy-cloudflare-pages`, the production deploy was not intentional.

## How to confirm the deploy was intentional

- The GitLab deploy job name is `deploy-cloudflare-pages`.
- The job must be started manually from the green `main` pipeline.
- The deploy is intentional only when a human explicitly clicked **Play** on that job.
- The job runs the guarded Cloudflare Pages script from canonical `/Users/admin/MercyB` main, then production is verified by `golden-flows-prod`.

## Warnings

- Normal pushes and merge requests should not trigger Netlify builds.
- No dashboard access is needed for this runbook.
- Dashboard changes, if ever required, are separate admin-only operations and are not part of the normal ship-to-prod flow.
