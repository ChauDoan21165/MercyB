#!/usr/bin/env node
// scripts/check-required-checks.mjs
//
// Defensive verifier for the GitHub branch-protection ruleset that
// enforces the project's required CI checks.
//
// Why this exists: branch-protection rulesets are GitHub-side config,
// not in-repo files. If the ruleset is accidentally edited (a check
// removed, a name typo introduced, the ruleset disabled), nothing in
// the repo would catch it. This script reads the live ruleset state
// via `gh api` and asserts the expected set of required checks is
// present. Run it whenever you suspect drift or as part of a
// quarterly hygiene sweep.
//
// USAGE
//   node scripts/check-required-checks.mjs
//
// EXPECTED OUTPUT (success)
//   ✅ ruleset 16546337 enforces all 4 required checks:
//        - Build and Test
//        - Lint Code
//        - Validate Rooms
//        - Module Boundaries
//
// FAILURE MODES (non-zero exit, actionable error)
//   - gh CLI not authenticated → exit 2
//   - ruleset 16546337 not found → exit 3
//   - one or more expected checks missing → exit 1
//   - extra unexpected checks (drift the OTHER way) → exit 1 with warning
//
// REQUIRES
//   - gh CLI authenticated (gh auth status)
//   - Read access to the repo's branch-protection settings
//
// Per A13-promote — the architectural counterpart to making the gate
// observable (A13 PRs #887-#920) is making it enforced. This script
// is the "make sure it stays enforced" guard.

import { spawnSync } from "node:child_process";

const RULESET_ID = "16546337";
const REPO = "ChauDoan21165/MercyB";

// Order matters only for human readability; set membership is what's
// actually checked. Don't reorder casually — the names appear in
// commit messages + CI status comments and operators search for them.
const REQUIRED_CHECKS = [
  "Build and Test",
  "Lint Code",
  "Validate Rooms",
  "Module Boundaries",
];

function gh(args) {
  const r = spawnSync("gh", args, { encoding: "utf8" });
  if (r.status !== 0) {
    return { ok: false, status: r.status, stderr: r.stderr ?? "" };
  }
  return { ok: true, stdout: r.stdout };
}

// 1. auth check
const who = gh(["auth", "status"]);
if (!who.ok) {
  process.stderr.write(
    "error: gh CLI not authenticated. Run `gh auth login` first.\n",
  );
  process.exit(2);
}

// 2. fetch ruleset
const r = gh([
  "api",
  `repos/${REPO}/rulesets/${RULESET_ID}`,
  "--jq",
  "{name: .name, target: .target, rules: [.rules[] | select(.type==\"required_status_checks\") | .parameters.required_status_checks[] | .context]}",
]);

if (!r.ok) {
  process.stderr.write(
    `error: failed to fetch ruleset ${RULESET_ID}. ` +
      `Confirm the ruleset still exists and your token has admin:read.\n` +
      `gh stderr: ${r.stderr}\n`,
  );
  process.exit(3);
}

const ruleset = JSON.parse(r.stdout);
const actual = new Set(ruleset.rules);
const expected = new Set(REQUIRED_CHECKS);

const missing = REQUIRED_CHECKS.filter((c) => !actual.has(c));
const unexpected = [...actual].filter((c) => !expected.has(c));

if (missing.length === 0 && unexpected.length === 0) {
  process.stdout.write(
    `✅ ruleset ${RULESET_ID} (${ruleset.name}) enforces all ${REQUIRED_CHECKS.length} required checks:\n`,
  );
  for (const c of REQUIRED_CHECKS) process.stdout.write(`     - ${c}\n`);
  process.exit(0);
}

if (missing.length > 0) {
  process.stderr.write(
    `❌ ruleset ${RULESET_ID} is MISSING ${missing.length} required check(s):\n`,
  );
  for (const c of missing) process.stderr.write(`     - ${c}\n`);
  process.stderr.write(
    `\nFix via gh CLI (see reports/MODULE-BOUNDARIES-PROMOTION-A13.md for full instructions).\n`,
  );
}

if (unexpected.length > 0) {
  process.stderr.write(
    `\n⚠️  ruleset ${RULESET_ID} has ${unexpected.length} UNEXPECTED required check(s) ` +
      `(not in this script's REQUIRED_CHECKS list):\n`,
  );
  for (const c of unexpected) process.stderr.write(`     - ${c}\n`);
  process.stderr.write(
    `If these are intentional, update REQUIRED_CHECKS in this script. ` +
      `If not, remove them via the GitHub UI.\n`,
  );
}

process.exit(1);
