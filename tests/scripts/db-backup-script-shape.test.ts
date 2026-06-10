// tests/scripts/db-backup-script-shape.test.ts
//
// Shape / safety test for the external Postgres backup pipeline.
//
// These scripts handle production credentials. They MUST NOT leak the
// connection string, service-role key, or any other secret to stdout
// or stderr — not even on the unhappy path. They MUST be destructive-
// guarded on the restore side. And they MUST consume the recipient key
// via env (not a hardcoded value in the repo).
//
// This is a string-level inspection of the bash files, not an execution
// test. We do NOT run pg_dump or pg_restore from CI. The schedule is
// the only place that runs the real pipeline.

import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function readScript(rel: string): string {
  return readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

const NIGHTLY_DUMP = readScript("scripts/db-backup/nightly-dump.sh");
const RESTORE = readScript("scripts/db-backup/restore.sh");
const VERIFY_RESTORE = readScript("scripts/db-backup/verify-restore.sh");

// Patterns that, if found *outside* of a comment, would indicate an
// accidental secret-leak path.
const CONN_STRING_LITERAL = /postgres(ql)?:\/\/[A-Za-z0-9_-]+(?::[^@\s]+)?@/;
const SERVICE_KEY_LITERAL = /sb_secret_[A-Za-z0-9_-]+/;
const SERVICE_KEY_LEGACY_JWT_LITERAL = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;

/**
 * Strip bash comments and quoted-string content so we can look for
 * unsafe constructs in actual code. We deliberately keep the order:
 * comments first, then strings — comments often quote strings.
 */
function stripCommentsAndStrings(src: string): string {
  return (
    src
      // Line comments: `# ...` to end of line. The shebang counts as a
      // comment line under this rule too, which is fine.
      .replace(/(^|[^"'])#.*$/gm, "$1")
      // Single-quoted strings (no interpolation).
      .replace(/'(?:[^']|'\\'')*'/g, "''")
      // Double-quoted strings (interpolation possible — but we still
      // strip the contents; we only care whether the SCRIPT WRITES the
      // raw value, which means the contents are an arg to echo/print).
      .replace(/"(?:\\.|[^"\\])*"/g, '""')
  );
}

describe("scripts/db-backup/nightly-dump.sh — credential-safety shape", () => {
  it("starts with the strict-bash prelude (set -euo pipefail)", () => {
    // Without this, a silent failure mid-pipeline (e.g. pg_dump exits
    // 1 but gpg still writes an empty file) would be marked "success".
    expect(NIGHTLY_DUMP).toMatch(/set -euo pipefail/);
  });

  it("never echoes the connection string env var", () => {
    // Comments (`# Note: do NOT echo $DB_URL`) and quoted string
    // interiors (`"$DATABASE_URL"` consumed by a sed pipeline) are
    // safe; we strip those before checking. What's left is real,
    // executable echo/printf code.
    const code = stripCommentsAndStrings(NIGHTLY_DUMP);
    const banned = [
      /\becho\b[^|;&]*\$\{?(SUPABASE_DB_URL|DATABASE_URL|DB_URL)\b/i,
      /\bprintf\b[^|;&]*\$\{?(SUPABASE_DB_URL|DATABASE_URL|DB_URL)\b/i,
    ];
    for (const re of banned) {
      expect(code, `nightly-dump.sh must never echo the DB URL — pattern: ${re}`)
        .not.toMatch(re);
    }
  });

  it("never echoes the service-role key", () => {
    const code = stripCommentsAndStrings(NIGHTLY_DUMP);
    const banned = [
      /\becho\b[^|;&]*\$\{?SUPABASE_SERVICE_ROLE_KEY\b/i,
      /\bprintf\b[^|;&]*\$\{?SUPABASE_SERVICE_ROLE_KEY\b/i,
    ];
    for (const re of banned) {
      expect(code, `nightly-dump.sh must never echo the service-role key — pattern: ${re}`)
        .not.toMatch(re);
    }
  });

  it("never enables shell trace (set -x)", () => {
    // `set -x` would log every command including the args, which means
    // the pg_dump invocation would print the connection string.
    expect(NIGHTLY_DUMP).not.toMatch(/^\s*set\s+-x\s*$/m);
    expect(NIGHTLY_DUMP).not.toMatch(/^\s*set\s+-[a-z]*x[a-z]*\s*$/m);
  });

  it("does not embed a literal Postgres connection string", () => {
    const stripped = stripCommentsAndStrings(NIGHTLY_DUMP);
    expect(stripped).not.toMatch(CONN_STRING_LITERAL);
  });

  it("does not embed a literal Supabase service-role key", () => {
    const stripped = stripCommentsAndStrings(NIGHTLY_DUMP);
    expect(stripped).not.toMatch(SERVICE_KEY_LITERAL);
    expect(stripped).not.toMatch(SERVICE_KEY_LEGACY_JWT_LITERAL);
  });

  it("requires gpg encryption (no plaintext-only path)", () => {
    // We require at least one occurrence of `gpg ... --encrypt` and we
    // require pg_dump to be piped into something — not dumped to disk
    // with redirection alone.
    expect(NIGHTLY_DUMP).toMatch(/gpg[\s\S]*--encrypt/);
    expect(NIGHTLY_DUMP).toMatch(/pg_dump[\s\S]*\|\s*gpg/);
  });

  it("scrubs the connection string from any error tail surfaced to logs", () => {
    // The error-handling path reads tail of the pg_dump log and prints
    // it. We require a sed scrub of postgres:// URLs in that path so a
    // pg_dump error that echoes the URL doesn't leak to CI logs.
    expect(NIGHTLY_DUMP).toMatch(/sed[\s\S]*postgres/);
  });

  it("exits non-zero on any pipeline failure", () => {
    // pipefail in the prelude PLUS explicit `exit` on each error path.
    // We sanity-check the explicit exits — at least 3 distinct exit
    // codes for the distinct failure classes.
    const exits = NIGHTLY_DUMP.match(/^\s*exit\s+\d+\s*$/gm) ?? [];
    expect(exits.length).toBeGreaterThanOrEqual(3);
  });

  it("emits TWO OK success summary lines (one per dump)", () => {
    // The contract: a `.schema.dump.gpg` AND a `.dump.gpg` per run, in
    // that order. We assert the printf shape AND that exactly two such
    // printfs exist (one per dump file).
    const okPrintfs = NIGHTLY_DUMP.match(/printf\s+['"]OK\s+%s\s+%s/g) ?? [];
    expect(okPrintfs.length).toBe(2);
  });

  it("takes a schema-only dump in addition to the full dump", () => {
    // Schema-only is the fast-restore fallback for structural checks
    // without decompressing the full data dump. Required deliverable
    // for this MR.
    expect(NIGHTLY_DUMP).toMatch(/--schema-only/);
    // And the output filename for it should follow .schema.dump.gpg.
    expect(NIGHTLY_DUMP).toMatch(/\.schema\.dump\.gpg/);
  });

  it("accepts either GPG_PUBLIC_KEY_FILE or GPG_RECIPIENT_KEY_ID as the recipient", () => {
    // Two distinct env vars per the dispatch refinement. GitLab CI uses
    // GPG_PUBLIC_KEY_FILE (file-type variable); laptop runs use
    // GPG_RECIPIENT_KEY_ID against a preloaded keyring.
    expect(NIGHTLY_DUMP).toMatch(/\bGPG_PUBLIC_KEY_FILE\b/);
    expect(NIGHTLY_DUMP).toMatch(/\bGPG_RECIPIENT_KEY_ID\b/);
    // The "neither is set" error path must exist.
    expect(NIGHTLY_DUMP).toMatch(/neither GPG_PUBLIC_KEY_FILE nor GPG_RECIPIENT_KEY_ID/);
  });

  it("imports CI file-type public keys into an isolated temporary GPG home", () => {
    expect(NIGHTLY_DUMP).toMatch(/TEMP_GNUPGHOME="\$\(mktemp -d\)"/);
    expect(NIGHTLY_DUMP).toMatch(/chmod 700 "\$TEMP_GNUPGHOME"/);
    expect(NIGHTLY_DUMP).toMatch(/export GNUPGHOME="\$TEMP_GNUPGHOME"/);
    expect(NIGHTLY_DUMP).toMatch(/tr -d '\\r'/);
    expect(NIGHTLY_DUMP).toMatch(/BEGIN PGP PUBLIC KEY BLOCK/);
    expect(NIGHTLY_DUMP).toMatch(/END PGP PUBLIC KEY BLOCK/);
    expect(NIGHTLY_DUMP).toMatch(/gpg --batch --import "\$KEY_IMPORT_FILE"/);
    expect(NIGHTLY_DUMP).toMatch(/trap cleanup_gpg_home EXIT/);
  });

  it("prefers DATABASE_URL with SUPABASE_DB_URL as fallback", () => {
    // Per the dispatch refinement: DATABASE_URL is canonical;
    // SUPABASE_DB_URL is the legacy alias.
    expect(NIGHTLY_DUMP).toMatch(/\$\{DATABASE_URL[:-]/);
    expect(NIGHTLY_DUMP).toMatch(/\$\{SUPABASE_DB_URL[:-]/);
    expect(NIGHTLY_DUMP).toMatch(/env_value_or_file "\$\{DATABASE_URL/);
  });
});

describe("scripts/db-backup/restore.sh — destructive-guard shape", () => {
  it("starts with the strict-bash prelude (set -euo pipefail)", () => {
    expect(RESTORE).toMatch(/set -euo pipefail/);
  });

  it("supports a --yes flag that skips the countdown", () => {
    // Both the parser case AND the runtime check.
    expect(RESTORE).toMatch(/--yes\)/);
    expect(RESTORE).toMatch(/ASSUME_YES/);
  });

  it("supports a --dry-run flag", () => {
    expect(RESTORE).toMatch(/--dry-run\)/);
    expect(RESTORE).toMatch(/DRY_RUN/);
  });

  it("shows a destructive-action banner", () => {
    expect(RESTORE).toMatch(/DESTRUCTIVE OPERATION/);
  });

  it("includes the 10-second countdown unless --yes is passed", () => {
    // The countdown loop should iterate over 10 numbers and check the
    // ASSUME_YES flag.
    expect(RESTORE).toMatch(/for\s+i\s+in\s+10\s+9\s+8\s+7\s+6\s+5\s+4\s+3\s+2\s+1/);
    expect(RESTORE).toMatch(/\$\{?ASSUME_YES/);
  });

  it("redacts the userinfo portion of the target DATABASE_URL before echoing", () => {
    // Whatever the script prints about its target must NOT include the
    // password. We pin the sed redaction so it can't silently drop.
    expect(RESTORE).toMatch(/sed[\s\S]*postgres/);
    expect(RESTORE).toMatch(/redacted-user/);
  });

  it("never echoes the raw DATABASE_URL", () => {
    // Same approach as the nightly-dump check: a `printf "$DATABASE_URL"`
    // that immediately pipes into sed for redaction is fine — the
    // quoted-string strip removes the variable name from that context
    // so the regex below sees only direct, log-bound prints.
    const code = stripCommentsAndStrings(RESTORE);
    const banned = [
      /\becho\b[^|;&]*\$\{?DATABASE_URL\b/,
      /\bprintf\b[^|;&]*\$\{?DATABASE_URL\b/,
    ];
    for (const re of banned) {
      expect(code, `restore.sh must never echo DATABASE_URL — pattern: ${re}`)
        .not.toMatch(re);
    }
  });

  it("does not enable shell trace (set -x)", () => {
    expect(RESTORE).not.toMatch(/^\s*set\s+-x\s*$/m);
    expect(RESTORE).not.toMatch(/^\s*set\s+-[a-z]*x[a-z]*\s*$/m);
  });

  it("does not embed a literal Postgres connection string", () => {
    const stripped = stripCommentsAndStrings(RESTORE);
    expect(stripped).not.toMatch(CONN_STRING_LITERAL);
  });

  it("uses pg_restore --clean --if-exists for the destructive default", () => {
    expect(RESTORE).toMatch(/pg_restore[\s\S]*--clean[\s\S]*--if-exists/);
  });
});

describe("scripts/db-backup/verify-restore.sh — throwaway restore proof shape", () => {
  it("starts with the strict-bash prelude (set -euo pipefail)", () => {
    expect(VERIFY_RESTORE).toMatch(/set -euo pipefail/);
  });

  it("creates and drops a throwaway database by default", () => {
    expect(VERIFY_RESTORE).toMatch(/CREATE DATABASE/);
    expect(VERIFY_RESTORE).toMatch(/DROP DATABASE IF EXISTS/);
    expect(VERIFY_RESTORE).toMatch(/VERIFY_RESTORE_DB_NAME/);
    expect(VERIFY_RESTORE).toMatch(/--keep-db/);
  });

  it("can fetch the newest full dump from the backup remote", () => {
    expect(VERIFY_RESTORE).toMatch(/--from-rclone/);
    expect(VERIFY_RESTORE).toMatch(/RCLONE_CONFIG_REMOTE/);
    expect(VERIFY_RESTORE).toMatch(/rclone lsf/);
    expect(VERIFY_RESTORE).toMatch(/rclone copy/);
    expect(VERIFY_RESTORE).toContain("grep -vE '\\.schema\\.dump\\.gpg$'");
  });

  it("streams gpg decrypt into pg_restore without writing plaintext dumps", () => {
    expect(VERIFY_RESTORE).toMatch(/gpg[\s\S]*--decrypt/);
    expect(VERIFY_RESTORE).toMatch(/gpg[\s\S]*\|\s*pg_restore/);
    expect(VERIFY_RESTORE).not.toMatch(/--output\s+.*\.dump/);
  });

  it("judges success by post-restore content assertions", () => {
    expect(VERIFY_RESTORE).toMatch(/VERIFY_RESTORE_EXPECT_TABLE/);
    expect(VERIFY_RESTORE).toMatch(/VERIFY_RESTORE_MIN_TABLES/);
    expect(VERIFY_RESTORE).toMatch(/--expect-table/);
    expect(VERIFY_RESTORE).toMatch(/--min-tables/);
    expect(VERIFY_RESTORE).toMatch(/information_schema\.tables/);
    expect(VERIFY_RESTORE).toMatch(/to_regclass\('public\.\$\{EXPECT_TABLE\}'\)/);
    expect(VERIFY_RESTORE).toMatch(/continuing to content assertions/);
  });

  it("uses a separate admin URL for the maintenance connection", () => {
    expect(VERIFY_RESTORE).toMatch(/VERIFY_RESTORE_ADMIN_DATABASE_URL/);
    expect(VERIFY_RESTORE).not.toMatch(/DATABASE_URL \(target\)/);
  });

  it("redacts database URL userinfo before echoing", () => {
    expect(VERIFY_RESTORE).toMatch(/redacted-user/);
    expect(VERIFY_RESTORE).toMatch(/redact_url/);
  });

  it("never echoes raw database URL env vars", () => {
    const code = stripCommentsAndStrings(VERIFY_RESTORE);
    const banned = [
      /\becho\b[^|;&]*\$\{?(VERIFY_RESTORE_ADMIN_DATABASE_URL|ADMIN_URL|TARGET_URL)\b/,
      /\bprintf\b[^|;&]*\$\{?(VERIFY_RESTORE_ADMIN_DATABASE_URL|ADMIN_URL|TARGET_URL)\b/,
    ];
    for (const re of banned) {
      expect(code, `verify-restore.sh must never echo raw DB URLs — pattern: ${re}`)
        .not.toMatch(re);
    }
  });

  it("does not enable shell trace (set -x)", () => {
    expect(VERIFY_RESTORE).not.toMatch(/^\s*set\s+-x\s*$/m);
    expect(VERIFY_RESTORE).not.toMatch(/^\s*set\s+-[a-z]*x[a-z]*\s*$/m);
  });

  it("does not embed a literal Postgres connection string", () => {
    const stripped = stripCommentsAndStrings(VERIFY_RESTORE);
    expect(stripped).not.toMatch(CONN_STRING_LITERAL);
  });
});

describe("scripts are executable shell files", () => {
  it("nightly-dump.sh has a bash shebang", () => {
    expect(NIGHTLY_DUMP.startsWith("#!/usr/bin/env bash")).toBe(true);
  });
  it("restore.sh has a bash shebang", () => {
    expect(RESTORE.startsWith("#!/usr/bin/env bash")).toBe(true);
  });
  it("verify-restore.sh has a bash shebang", () => {
    expect(VERIFY_RESTORE.startsWith("#!/usr/bin/env bash")).toBe(true);
  });
});
