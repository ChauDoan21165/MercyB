// tests/scripts/pg-dump-setup-script-shape.test.ts
//
// Shape / safety test for scripts/supervisor/verify-pg-dump-setup.sh.
//
// The verification script confirms the four GitLab CI/CD variables
// (DATABASE_URL, GPG_PUBLIC_KEY_FILE, RCLONE_CONFIG,
// RCLONE_CONFIG_REMOTE)
// are present + a pipeline schedule exists, by name only. **It must
// never read variable VALUES**, must never run the actual pg_dump,
// and must use `glab` (the read-only inspection CLI) rather than
// shelling out to a path that could leak secrets.
//
// This is a string-level inspection of the bash file, not an
// execution test. We do NOT run the verify script from CI — that
// would require an authenticated `glab` session, which CI doesn't
// have (the secrets it would check on are themselves the secrets
// the script protects).
//
// Companion test: tests/scripts/db-backup-script-shape.test.ts —
// the underlying pipeline (MR !69) has its own shape test for
// nightly-dump.sh + restore.sh.

import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function readScript(rel: string): string {
  return readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

const VERIFY = readScript("scripts/supervisor/verify-pg-dump-setup.sh");

// Patterns that, if found OUTSIDE of comments, would indicate an
// accidental secret-leak path.
const CONN_STRING_LITERAL = /postgres(ql)?:\/\/[A-Za-z0-9_-]+(?::[^@\s]+)?@/;
const SERVICE_KEY_LITERAL = /sb_secret_[A-Za-z0-9_-]+/;
const SERVICE_KEY_LEGACY_JWT_LITERAL =
  /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;

/**
 * Strip bash comments and quoted-string content so we look for unsafe
 * constructs in actual code only. Same shape as the existing
 * db-backup-script-shape.test.ts helper — kept consistent so future
 * contributors can compare/diff the two tests without surprise.
 */
function stripCommentsAndStrings(src: string): string {
  return src
    // Line comments: `# ...` to end of line.
    .replace(/(^|[^"'])#.*$/gm, "$1")
    // Single-quoted strings.
    .replace(/'(?:[^']|'\\'')*'/g, "''")
    // Double-quoted strings.
    .replace(/"(?:\\.|[^"\\])*"/g, '""');
}

// ──────────────────────────────────────────────────────────────────────
// File shape
// ──────────────────────────────────────────────────────────────────────

describe("scripts/supervisor/verify-pg-dump-setup.sh — file shape", () => {
  it("starts with a bash shebang", () => {
    expect(VERIFY.startsWith("#!/usr/bin/env bash")).toBe(true);
  });

  it("starts with the strict-bash prelude (set -euo pipefail)", () => {
    // Same posture as the pipeline scripts shipped in !69 — without
    // this, a silent intermediate failure (e.g. glab returns nothing
    // because auth expired) would be marked "success."
    expect(VERIFY).toMatch(/set -euo pipefail/);
  });

  it("has the executable bit set", () => {
    const stat = statSync(
      path.join(REPO_ROOT, "scripts/supervisor/verify-pg-dump-setup.sh"),
    );
    // 0o111 = any execute bit. We don't pin owner-vs-all execute; some
    // git configurations strip group/other execute and that's fine
    // because the script runs as the script-runner's own user.
    expect(stat.mode & 0o111).not.toBe(0);
  });
});

// ──────────────────────────────────────────────────────────────────────
// Required variable-name presence
// ──────────────────────────────────────────────────────────────────────
//
// The verification script's whole job is to confirm the four named
// variables exist. If the script doesn't TEXTUALLY reference each
// name, it can't check for them — a typo here would make the script
// silently report "all GREEN" while one variable is actually missing.
//
// We pin the four names with explicit regex matches. The names match
// the .gitlab-ci.yml job definitions (the pipeline reads these exact
// strings), so a divergence between the verify script and the
// pipeline is a regression we want to catch at unit-test time.

describe("scripts/supervisor/verify-pg-dump-setup.sh — variable name coverage", () => {
  for (const name of [
    "DATABASE_URL",
    "GPG_PUBLIC_KEY_FILE",
    "RCLONE_CONFIG",
    "RCLONE_CONFIG_REMOTE",
  ]) {
    it(`references the CI/CD variable name '${name}'`, () => {
      // Match the literal name as a whole token (avoids matching a
      // prefix/suffix collision).
      const re = new RegExp(`\\b${name}\\b`);
      expect(
        VERIFY,
        `verify-pg-dump-setup.sh must reference '${name}' to check its presence`,
      ).toMatch(re);
    });
  }
});

// ──────────────────────────────────────────────────────────────────────
// Safety: never read variable VALUES, never run pg_dump
// ──────────────────────────────────────────────────────────────────────

describe("scripts/supervisor/verify-pg-dump-setup.sh — safety shape", () => {
  it("never enables shell trace (set -x)", () => {
    // `set -x` would log every command including the args, which means
    // if anyone later reads a variable VALUE into a command, the value
    // ends up in CI logs.
    expect(VERIFY).not.toMatch(/^\s*set\s+-x\s*$/m);
    expect(VERIFY).not.toMatch(/^\s*set\s+-[a-z]*x[a-z]*\s*$/m);
  });

  it("does not call `glab variable get` (which would read the value)", () => {
    // `glab variable list` returns names + types but not values (in
    // recent glab versions; older versions did expose .value — we
    // explicitly forbid `glab variable get` which always returns the
    // value).
    const code = stripCommentsAndStrings(VERIFY);
    expect(
      code,
      "verify-pg-dump-setup.sh must use `glab variable list` (presence only), never `glab variable get` (which reads values)",
    ).not.toMatch(/\bglab\s+variable\s+get\b/);
  });

  it("does not read `.value` from glab JSON output", () => {
    // Even with `glab variable list -F json`, the JSON might contain a
    // .value field. We deliberately read only .key and .variable_type
    // to keep the script value-blind.
    const code = stripCommentsAndStrings(VERIFY);
    expect(
      code,
      "verify-pg-dump-setup.sh must not read `.value` from glab JSON — keep the script value-blind",
    ).not.toMatch(/\.value\b/);
  });

  it("does not invoke pg_dump or pg_restore", () => {
    // The whole point of the script is to be a pre-flight check that
    // doesn't touch the database. The first real run is the manual
    // job per §8 of pg-dump-activation.md.
    const code = stripCommentsAndStrings(VERIFY);
    expect(code).not.toMatch(/\bpg_dump\b/);
    expect(code).not.toMatch(/\bpg_restore\b/);
  });

  it("does not invoke psql against any connection string", () => {
    // Same posture as pg_dump — no DB connection inside the verify
    // script, ever.
    const code = stripCommentsAndStrings(VERIFY);
    expect(code).not.toMatch(/\bpsql\b/);
  });

  it("does not invoke gpg --encrypt or gpg --decrypt", () => {
    // The verify script never touches the key material either.
    const code = stripCommentsAndStrings(VERIFY);
    expect(code).not.toMatch(/\bgpg\b[\s\S]*--encrypt\b/);
    expect(code).not.toMatch(/\bgpg\b[\s\S]*--decrypt\b/);
  });

  it("does not invoke rclone copy / rclone sync / rclone move", () => {
    // The verify script does not upload or download anything.
    const code = stripCommentsAndStrings(VERIFY);
    expect(code).not.toMatch(/\brclone\b\s+\b(copy|sync|move|delete|rcat|rmdirs)\b/);
  });

  it("does not echo or printf any of the protected variable names with $-expansion", () => {
    // If the script accidentally does `echo "$DATABASE_URL"`, the
    // variable value ends up in stdout. The strip-strings step removes
    // the quoted-string CONTENTS (so `"...$DATABASE_URL..."` becomes
    // `""`), which is the right shape for catching real leaks —
    // anything still matching after the strip is an unquoted reference
    // that absolutely would print the value.
    const code = stripCommentsAndStrings(VERIFY);
    const banned = [
      /\becho\b[^|;&]*\$\{?DATABASE_URL\b/,
      /\bprintf\b[^|;&]*\$\{?DATABASE_URL\b/,
      /\becho\b[^|;&]*\$\{?GPG_PUBLIC_KEY_FILE\b/,
      /\bprintf\b[^|;&]*\$\{?GPG_PUBLIC_KEY_FILE\b/,
      /\becho\b[^|;&]*\$\{?RCLONE_CONFIG\b/,
      /\bprintf\b[^|;&]*\$\{?RCLONE_CONFIG\b/,
      /\becho\b[^|;&]*\$\{?RCLONE_CONFIG_REMOTE\b/,
      /\bprintf\b[^|;&]*\$\{?RCLONE_CONFIG_REMOTE\b/,
    ];
    for (const re of banned) {
      expect(
        code,
        `verify-pg-dump-setup.sh must never echo/printf a protected variable value — pattern: ${re}`,
      ).not.toMatch(re);
    }
  });

  it("does not embed a literal Postgres connection string", () => {
    const stripped = stripCommentsAndStrings(VERIFY);
    expect(stripped).not.toMatch(CONN_STRING_LITERAL);
  });

  it("does not embed a literal Supabase service-role key", () => {
    const stripped = stripCommentsAndStrings(VERIFY);
    expect(stripped).not.toMatch(SERVICE_KEY_LITERAL);
    expect(stripped).not.toMatch(SERVICE_KEY_LEGACY_JWT_LITERAL);
  });
});

// ──────────────────────────────────────────────────────────────────────
// Dependency / preflight checks
// ──────────────────────────────────────────────────────────────────────

describe("scripts/supervisor/verify-pg-dump-setup.sh — dependency preflight", () => {
  it("requires `glab` to be on PATH", () => {
    // The script's whole behavior depends on glab. It should error
    // clearly if glab isn't installed, NOT silently exit 0.
    expect(VERIFY).toMatch(/require_cmd\s+glab\b/);
  });

  it("requires `jq` to be on PATH", () => {
    // We parse glab's JSON output. Without jq, the script can't
    // function — error clearly instead of silently misreporting.
    expect(VERIFY).toMatch(/require_cmd\s+jq\b/);
  });

  it("confirms glab is authenticated before doing any work", () => {
    // `glab auth status` returns non-zero when not logged in. We
    // explicitly check this so the script doesn't conflate
    // "not authenticated" with "variable missing" — those are very
    // different actions.
    expect(VERIFY).toMatch(/glab\s+auth\s+status/);
  });

  it("uses `glab variable list` (not raw curl) for variable presence", () => {
    // glab is the canonical surface. A raw curl path would need an
    // API token in the script environment, which is exactly the
    // anti-pattern this whole pipeline avoids.
    expect(VERIFY).toMatch(/glab\s+variable\s+list/);
  });

  it("uses `glab schedule list` for schedule presence (with optional fallback)", () => {
    // The schedule check uses `glab schedule list`. Older glab
    // versions don't support `-F json`; the script falls back to
    // text-grep, which we want to confirm exists too (and ideally
    // it covers the snake_case + kebab-case variants of the
    // schedule description).
    expect(VERIFY).toMatch(/glab\s+schedule\s+list/);
  });
});

// ──────────────────────────────────────────────────────────────────────
// Exit code semantics
// ──────────────────────────────────────────────────────────────────────

describe("scripts/supervisor/verify-pg-dump-setup.sh — exit code semantics", () => {
  it("exits non-zero when any check is RED", () => {
    // The activation runbook depends on the exit code for CI/Make
    // integration. A RED finding must fail the script.
    expect(VERIFY).toMatch(/RED_COUNT.*-gt\s+0/);
    expect(VERIFY).toMatch(/exit\s+1\s*$/m);
  });

  it("exits 0 when all checks are GREEN (or only YELLOW remains)", () => {
    // YELLOW is a warning, not a failure (e.g. schedule isn't created
    // yet but variables are — that's expected mid-setup). The script
    // must NOT fail on YELLOW alone.
    expect(VERIFY).toMatch(/exit\s+0\s*$/m);
  });

  it("emits a Summary line with GREEN/YELLOW/RED counts", () => {
    // The summary line is the human-readable contract; pinning it in
    // the test catches future refactors that drop the counts.
    expect(VERIFY).toMatch(/Summary:[\s\S]*GREEN[\s\S]*YELLOW[\s\S]*RED/);
  });
});
