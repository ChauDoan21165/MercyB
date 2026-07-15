# Gatekeeper Setup

These steps create a Tier 1 auto-merge account and a separate Tier 2 reviewer account. The Tier 2 account must not be able to merge `main`.

## 1. Create Accounts

Create two GitLab accounts:

- `mercy-tier1-gatekeeper`: Tier 1 merge bot.
- `mercy-tier2-reviewer`: Tier 2 reviewer bot or human-operated reviewer lane.

Use separate email addresses and enable 2FA on both accounts.

## 2. Invite Accounts

In GitLab:

1. Open the MercyB project.
2. Go to `Manage > Members`.
3. Select `Invite members`.
4. Invite `mercy-tier1-gatekeeper` as `Maintainer`.
5. Invite `mercy-tier2-reviewer` as `Developer`.
6. Confirm both users appear in the project member list with those exact roles.

The Tier 1 account needs Maintainer because `main` is protected for Maintainer-only merge. The Tier 2 account stays Developer so it can review and comment without merge authority.

## 3. Protect Main

In GitLab:

1. Open `Settings > Repository`.
2. Expand `Branch rules` or `Protected branches`.
3. Review every existing protected branch rule before editing `main`.
4. Delete any wildcard rule that matches `main`, such as `*` or `ma*`, before applying the new settings. If the wildcard rule is needed for other branches, recreate it afterward with a pattern that does not match `main`.
5. Select or add the `main` branch rule.
6. Set `Allowed to merge` to `Maintainers`.
7. Set `Allowed to push and merge` to `No one`.
8. Save the rule.
9. Re-check all protected branch rules and confirm no wildcard rule matching `main` allows Developers to merge or push.

GitLab documents that `Allowed to merge` controls who can merge through merge requests, while `Allowed to push and merge` grants both push and merge rights. With `main` set to Maintainers-only merge and no direct push, Developer-role users cannot merge or push `main`. If multiple protected branch rules match, GitLab applies the most permissive rule, so wildcard rules must not weaken `main`.

References:

- https://docs.gitlab.com/user/project/repository/branches/protected/
- https://docs.gitlab.com/user/project/repository/branches/protection_rules/

## 4. Generate Tokens

For `mercy-tier1-gatekeeper`:

1. Sign in as `mercy-tier1-gatekeeper`.
2. Open `User Settings > Access tokens`.
3. Create a token named `tier1-gatekeeper`.
4. Give it the `api` scope.
5. Set an expiry date.
6. Copy the token once.

For `mercy-tier2-reviewer`:

1. Sign in as `mercy-tier2-reviewer`.
2. Open `User Settings > Access tokens`.
3. Create a token named `tier2-reviewer`.
4. Give it the `api` scope only if a reviewer automation will use it. For human-only review, do not install this token anywhere.
5. Set an expiry date.
6. Copy the token once.

## 5. Install CI Variables

In GitLab:

1. Open `Settings > CI/CD`.
2. Expand `Variables`.
3. Add `GATEKEEPER_TOKEN` with the `mercy-tier1-gatekeeper` token.
4. Mark it `Masked` and `Protected`.
5. Add `R0_SCHEDULE_ID` with value `4336200`, or rely on the script default.
6. Leave `GATEKEEPER_ENABLED` unset globally. Add `GATEKEEPER_ENABLED=1` only to the gatekeeper schedule or manual web pipeline when Chau wants it active.

R1 state:

- Do not add `SUPABASE_SERVICE_ROLE_KEY` to CI variables for the gatekeeper.
- The gatekeeper is intentionally R0-only because service-role keys never enter CI variables.

Do not install the Tier 2 Developer token in the Tier 1 gatekeeper job. If a future Tier 2 reviewer job is added, install that token as `TIER2_REVIEWER_TOKEN`, masked and protected, and keep it out of any job that can merge.

## 6. Create Schedule

In GitLab:

1. Open `Build > Pipeline schedules`.
2. Select `New schedule`.
3. Name it `tier1-gatekeeper`.
4. Target branch: `main`.
5. Cadence: Chau-selected.
6. Add schedule variable `GATEKEEPER_ENABLED=1`.
7. Save disabled until ready, or save enabled only after Chau has confirmed the R0 policy.

The job is off by default because `.gitlab-ci.yml` only runs it when `GATEKEEPER_ENABLED == "1"`.
