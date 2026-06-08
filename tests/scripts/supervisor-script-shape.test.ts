// tests/scripts/supervisor-script-shape.test.ts
//
// Shape / safety test for the supervisor tooling scripts.
//
// These scripts are operator tools that talk to GitLab and read/write
// $HOME/.mercyb/agent-state.json. They MUST NOT echo Supabase keys, a
// raw Postgres connection string, or any other secret to stdout/stderr
// — even though they don't intentionally handle secrets, an honest
// shape-test prevents a future edit from regressing into a leak.
//
// We also pin the destructive-default discipline: `merge-clean.sh` MUST
// be dry-run by default and only act when `--yes` is passed. This
// mirrors `scripts/db-backup/restore.sh`.
//
// This is a string-level inspection of the bash files, not an execution
// test. We do NOT run `glab` or `jq` from vitest.

import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function readScript(rel: string): string {
  return readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

const MERGE_CLEAN = readScript("scripts/supervisor/merge-clean.sh");
const MR_STATUS = readScript("scripts/supervisor/mr-status.sh");
const AGENT_STATE = readScript("scripts/supervisor/agent-state.sh");
const POST_MERGE_REAPER = readScript("scripts/supervisor/post-merge-worktree-reaper.sh");

// Patterns that would indicate an accidental secret leak.
const CONN_STRING_LITERAL = /postgres(ql)?:\/\/[A-Za-z0-9_-]+(?::[^@\s]+)?@/;
const SERVICE_KEY_LITERAL = /sb_secret_[A-Za-z0-9_-]+/;
const SERVICE_KEY_LEGACY_JWT_LITERAL = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;

/**
 * Strip bash comments and quoted-string content so we can look for
 * unsafe constructs only in actual executable code. Mirrors the helper
 * in tests/scripts/db-backup-script-shape.test.ts but reorders the
 * passes — strings BEFORE comments — so a `#` that lives inside a
 * single-quoted string (e.g. `sed -e 's/^#//'`) doesn't get treated as
 * a comment marker and eat the rest of the line.
 */
function stripCommentsAndStrings(src: string): string {
  return (
    src
      // Single-quoted strings first (no interpolation, no escapes).
      .replace(/'(?:[^']|'\\'')*'/g, "''")
      // Then double-quoted strings.
      .replace(/"(?:\\.|[^"\\])*"/g, '""')
      // Now any remaining `#` is genuinely a comment marker.
      .replace(/(^|[^"'])#.*$/gm, "$1")
  );
}

const ALL_SCRIPTS: Array<{ rel: string; src: string }> = [
  { rel: "scripts/supervisor/merge-clean.sh", src: MERGE_CLEAN },
  { rel: "scripts/supervisor/mr-status.sh", src: MR_STATUS },
  { rel: "scripts/supervisor/agent-state.sh", src: AGENT_STATE },
  { rel: "scripts/supervisor/post-merge-worktree-reaper.sh", src: POST_MERGE_REAPER },
];

describe("supervisor scripts — shared shape", () => {
  for (const { rel, src } of ALL_SCRIPTS) {
    describe(rel, () => {
      it("has the bash shebang", () => {
        expect(src.startsWith("#!/usr/bin/env bash")).toBe(true);
      });

      it("uses the strict-bash prelude (set -euo pipefail)", () => {
        expect(src).toMatch(/set -euo pipefail/);
      });

      it("does not enable shell trace (set -x)", () => {
        // `set -x` would log every command including arguments, which
        // could surface secrets through the env at debug time.
        expect(src).not.toMatch(/^\s*set\s+-x\s*$/m);
        expect(src).not.toMatch(/^\s*set\s+-[a-z]*x[a-z]*\s*$/m);
      });

      it("supports --help (case in the arg parser)", () => {
        expect(src).toMatch(/--help/);
        expect(src).toMatch(/-h\b/);
      });

      it("exits non-zero on an unknown flag / subcommand", () => {
        // We pin the literal "unknown" branch and a non-zero `exit 1`
        // inside it. Together that proves the default path is "error,
        // exit non-zero" rather than "ignore, exit 0".
        expect(src).toMatch(/unknown/);
        const exits = src.match(/^\s*exit\s+1\s*$/gm) ?? [];
        expect(
          exits.length,
          `${rel} must have at least one explicit "exit 1" path`,
        ).toBeGreaterThanOrEqual(1);
      });

      it("never echoes a Supabase service-role key", () => {
        const code = stripCommentsAndStrings(src);
        const banned = [
          /\becho\b[^|;&]*\$\{?SUPABASE_SERVICE_ROLE_KEY\b/i,
          /\bprintf\b[^|;&]*\$\{?SUPABASE_SERVICE_ROLE_KEY\b/i,
          /\becho\b[^|;&]*\$\{?SUPABASE_DB_URL\b/i,
          /\bprintf\b[^|;&]*\$\{?SUPABASE_DB_URL\b/i,
          /\becho\b[^|;&]*\$\{?DATABASE_URL\b/i,
          /\bprintf\b[^|;&]*\$\{?DATABASE_URL\b/i,
        ];
        for (const re of banned) {
          expect(code, `${rel} must never echo a credential — pattern: ${re}`)
            .not.toMatch(re);
        }
      });

      it("does not embed a literal Postgres connection string", () => {
        const stripped = stripCommentsAndStrings(src);
        expect(stripped).not.toMatch(CONN_STRING_LITERAL);
      });

      it("does not embed a literal Supabase service-role key", () => {
        const stripped = stripCommentsAndStrings(src);
        expect(stripped).not.toMatch(SERVICE_KEY_LITERAL);
        expect(stripped).not.toMatch(SERVICE_KEY_LEGACY_JWT_LITERAL);
      });
    });
  }
});

describe("merge-clean.sh — destructive-default discipline", () => {
  it("defaults to dry-run (ASSUME_YES starts at 0)", () => {
    expect(MERGE_CLEAN).toMatch(/ASSUME_YES=0/);
  });

  it("only flips ASSUME_YES on the --yes flag", () => {
    // Both the parser case AND the runtime guard around `glab mr merge`.
    expect(MERGE_CLEAN).toMatch(/--yes\)/);
    expect(MERGE_CLEAN).toMatch(/ASSUME_YES.*-eq\s+1/);
  });

  it("calls glab mr merge only inside the ASSUME_YES=1 branch", () => {
    // We require that every occurrence of `glab mr merge` in EXECUTABLE
    // code is preceded by an `ASSUME_YES` check. Mentions of "glab mr
    // merge" in the doc-comment header don't count, so we strip
    // comments before checking. This is a coarse text check, not a
    // control-flow check, but it catches the common regression: someone
    // hoisting the merge call out of the gate "for clarity".
    const code = stripCommentsAndStrings(MERGE_CLEAN);
    const mergeCalls = code.match(/glab\s+mr\s+merge/g) ?? [];
    expect(mergeCalls.length).toBeGreaterThan(0);
    const firstMergeIdx = code.search(/glab\s+mr\s+merge/);
    const firstYesIdx = code.search(/ASSUME_YES/);
    expect(firstYesIdx).toBeGreaterThan(-1);
    expect(firstYesIdx).toBeLessThan(firstMergeIdx);
  });

  it("guards against destructive titles (DROP / REVOKE / destructive / REQUIRES_OWNER_DECISION)", () => {
    expect(MERGE_CLEAN).toMatch(/REQUIRES_OWNER_DECISION/);
    expect(MERGE_CLEAN).toMatch(/DROP/);
    expect(MERGE_CLEAN).toMatch(/REVOKE/);
    expect(MERGE_CLEAN).toMatch(/destructive/i);
  });

  it("requires a successful pipeline before merging", () => {
    expect(MERGE_CLEAN).toMatch(/pipeline_status/);
    // Pin the literal comparison form `!= "success"`. The double-quoted
    // string "success" disappears under stripCommentsAndStrings, so we
    // assert against the un-stripped source here — that's fine because
    // a literal string in source code IS the gate.
    expect(MERGE_CLEAN).toMatch(/pipeline_status[^\n]*!=\s*"success"/);
  });

  it("prints a final summary line", () => {
    expect(MERGE_CLEAN).toMatch(/Summary/);
    expect(MERGE_CLEAN).toMatch(/merged=/);
    expect(MERGE_CLEAN).toMatch(/skipped=/);
  });

  it("fires the post-merge worktree reaper after a successful merge", () => {
    expect(MERGE_CLEAN).toMatch(/post-merge-worktree-reaper\.sh/);
    expect(MERGE_CLEAN).toMatch(/MERCYB_POST_MERGE_REAPER:-1/);
    expect(MERGE_CLEAN).toMatch(/MERCYB_REAPER_REASON="merge-clean !\$\{iid\}"/);
    expect(MERGE_CLEAN).toMatch(/post-merge-worktree-reaper\.sh"\s+--live/);
  });
});

describe("post-merge-worktree-reaper.sh — safety shape", () => {
  it("defaults to dry-run unless --live is passed", () => {
    expect(POST_MERGE_REAPER).toMatch(/MODE="dry-run"/);
    expect(POST_MERGE_REAPER).toMatch(/--live\)/);
    expect(POST_MERGE_REAPER).toMatch(/MODE="live"/);
  });

  it("hard-protects MercyB and MercyB-keystore", () => {
    expect(POST_MERGE_REAPER).toMatch(/MercyB/);
    expect(POST_MERGE_REAPER).toMatch(/MercyB-keystore/);
    expect(POST_MERGE_REAPER).toMatch(/is_protected_path/);
  });

  it("requires an approved roots allowlist before removal", () => {
    expect(POST_MERGE_REAPER).toMatch(/MERCYB_REAPER_WORKTREE_ROOTS/);
    expect(POST_MERGE_REAPER).toMatch(/is_allowed_root/);
    expect(POST_MERGE_REAPER).toMatch(/outside-approved-roots/);
  });

  it("skips dirty, active, locked, detached, and unmerged worktrees", () => {
    expect(POST_MERGE_REAPER).toMatch(/dirty-worktree/);
    expect(POST_MERGE_REAPER).toMatch(/active-process/);
    expect(POST_MERGE_REAPER).toMatch(/locked-worktree/);
    expect(POST_MERGE_REAPER).toMatch(/no-branch/);
    expect(POST_MERGE_REAPER).toMatch(/merge-base --is-ancestor/);
  });

  it("logs before and after root disk space", () => {
    expect(POST_MERGE_REAPER).toMatch(/print_df "before"/);
    expect(POST_MERGE_REAPER).toMatch(/print_df "after"/);
    expect(POST_MERGE_REAPER).toMatch(/df -h \//);
  });
});

describe("agent-state.sh — schema discipline", () => {
  it("stores state under ~/.mercyb (HOME, not repo)", () => {
    expect(AGENT_STATE).toMatch(/HOME\/\.mercyb/);
    // Defense-in-depth: never write to a path that contains the repo's
    // scripts/ dir. We exclude the `sed` usage line that strips the
    // header from the script itself.
    const code = stripCommentsAndStrings(AGENT_STATE);
    expect(code).not.toMatch(/scripts\/supervisor\/agent-state\.json/);
  });

  it("supports the four documented subcommands", () => {
    expect(AGENT_STATE).toMatch(/\bmark\)/);
    expect(AGENT_STATE).toMatch(/\bmark-idle\)/);
    expect(AGENT_STATE).toMatch(/\blist\)/);
    expect(AGENT_STATE).toMatch(/\bidle\)/);
  });

  it("validates status values against the documented enum", () => {
    expect(AGENT_STATE).toMatch(/idle\|working\|blocked\|reporting/);
  });

  it("uses an atomic temp-file rename for writes", () => {
    expect(AGENT_STATE).toMatch(/mktemp/);
    expect(AGENT_STATE).toMatch(/\bmv\b/);
  });
});

describe("mr-status.sh — read-only discipline", () => {
  it("does not call glab mr merge / close / update", () => {
    // mr-status is observational. The only `glab` calls allowed are
    // list and view.
    const code = stripCommentsAndStrings(MR_STATUS);
    expect(code).not.toMatch(/glab\s+mr\s+merge/);
    expect(code).not.toMatch(/glab\s+mr\s+close/);
    expect(code).not.toMatch(/glab\s+mr\s+update/);
  });

  it("sorts output by MR number descending", () => {
    // Pin the sort flags so a future "clean-up" doesn't silently
    // re-sort the output by author and break the watch-loop UX. We
    // allow anything (including quoted pipe delimiters like `-t '|'`)
    // between `sort` and `-nr`, as long as it stays on one line.
    expect(MR_STATUS).toMatch(/\bsort\b[^\n]*-nr\b/);
  });
});

describe("supervisor scripts exist as files", () => {
  for (const { rel } of ALL_SCRIPTS) {
    it(`${rel} is present`, () => {
      const st = statSync(path.join(REPO_ROOT, rel));
      expect(st.isFile()).toBe(true);
      expect(st.size).toBeGreaterThan(100);
    });
  }
});
