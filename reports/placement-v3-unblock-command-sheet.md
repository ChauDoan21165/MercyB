# Placement V3 Unblock Command Sheet

Copy/paste commands for Placement V3 release operations. Run from the relevant worktree/branch unless noted.

## Check PR CI

```bash
gh pr view 949 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 943 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 944 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 946 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 947 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 950 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 951 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 952 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 953 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
gh pr view 954 --json number,title,isDraft,mergeStateStatus,statusCheckRollup,url
```

## Check Draft Status

```bash
gh pr list --state open --json number,title,isDraft,headRefName,mergeStateStatus
gh pr view <PR_NUMBER> --json number,title,isDraft,headRefName,baseRefName,mergeStateStatus
```

## Rebase A PR Branch

```bash
git fetch origin
git switch <branch-name>
git status --short
git rebase origin/main
npm run typecheck
npm run build
git push --force-with-lease
```

## Run Local Verification

```bash
npm run typecheck
npm run typecheck:ci
npm run lint
npm run build
```

## Run Placement V3 Vertical E2E With Explicit Flags

```bash
VITE_PLACEMENT_TEST_ENABLED=true \
VITE_PLACEMENT_V3_UI_ENABLED=true \
VITE_SUPABASE_URL=https://placeholder.invalid.supabase.co \
VITE_SUPABASE_ANON_KEY=placeholder-anon-key-not-real \
npm run test:e2e -- placement-v3-vertical
```

## Run Drift Simulation Checks

Use the command defined by #943. Until that PR documents a stable command, first inspect scripts:

```bash
git switch feat/a36-grading-drift-detection
rg -n "drift|replay" package.json scripts tests docs supabase src
npm run typecheck
npm run build
```

## Run Endurance Checks

Use the command defined by #954. Until that PR documents a stable command, first inspect scripts:

```bash
git switch feat/a33-placement-v3-endurance-burnin
rg -n "endurance|burn|regression|placement-v3" package.json scripts tests docs
npm run typecheck
npm run build
```

## Run Data-Quality Audits

Use the command defined by #951. Until that PR documents a stable command, first inspect scripts:

```bash
git switch feat/a3-placement-v3-data-quality
rg -n "data-quality|integrity|placement-v3" package.json scripts tests docs src supabase
npm run typecheck
npm run build
```

## Run B1 Repeat Tests

Use #950 commands if listed in its PR body. Generic safe baseline:

```bash
git switch feat/b1-test-stability-burndown
npm test
npm run typecheck
npm run build
```

## Run A2 Env Verifier

Use #953 commands if listed in its PR body. Generic discovery:

```bash
git switch feat/a2-placement-v3-observability
rg -n "env|forensic|observability|placement-v3" package.json scripts tests docs src supabase
npm run typecheck
npm run build
```

## Run Disk Audit

Do not delete dirty worktrees. Audit first:

```bash
git worktree list
du -sh /tmp/mercyb-* 2>/dev/null || true
for d in /tmp/mercyb-*; do [ -d "$d/.git" ] || [ -f "$d/.git" ] && (cd "$d" && echo "== $d ==" && git status --short); done
```

## Update PR Evidence JSON

```bash
for n in 943 944 946 947 949 950 951 952 953 954; do
  gh pr view "$n" --json number,title,state,isDraft,mergedAt,headRefName,baseRefName,mergeStateStatus,statusCheckRollup,url \
    > "reports/placement-v3-readiness-evidence/pr-$n.json"
done
```
