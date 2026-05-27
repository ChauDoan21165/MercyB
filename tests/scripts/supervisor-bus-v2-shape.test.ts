// tests/scripts/supervisor-bus-v2-shape.test.ts
//
// Shape / safety test for the supervisor-bus v2 scripts:
//   - scripts/supervisor/dispatch-template.sh
//   - scripts/supervisor/fleet-dashboard.sh
//   - scripts/supervisor/dispatch-log.sh
//   - scripts/supervisor/agent-state.sh (extended with report-done)
//
// These scripts are operator tools that read/write state under
// $HOME/.mercyb/. They MUST NOT echo Supabase keys, raw connection
// strings, or any other secret to stdout/stderr. They MUST stay
// backward-compatible with the !78 surface (mark / mark-idle / list /
// idle for agent-state.sh; the other three scripts are new).
//
// String-level inspection only. We do NOT run glab, jq, or the scripts
// themselves from vitest.

import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");

function readScript(rel: string): string {
  return readFileSync(path.join(REPO_ROOT, rel), "utf8");
}

const DISPATCH_TEMPLATE = readScript("scripts/supervisor/dispatch-template.sh");
const FLEET_DASHBOARD = readScript("scripts/supervisor/fleet-dashboard.sh");
const DISPATCH_LOG = readScript("scripts/supervisor/dispatch-log.sh");
const AGENT_STATE = readScript("scripts/supervisor/agent-state.sh");

// Patterns that would indicate an accidental secret leak.
const CONN_STRING_LITERAL = /postgres(ql)?:\/\/[A-Za-z0-9_-]+(?::[^@\s]+)?@/;
const SERVICE_KEY_LITERAL = /sb_secret_[A-Za-z0-9_-]+/;
const SERVICE_KEY_LEGACY_JWT_LITERAL = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/;

/**
 * Strip bash quoted-string content and comments. Strings BEFORE
 * comments — a `#` inside a single-quoted sed expression like
 * `'s/^#//'` would otherwise eat the rest of the line. Same fix as the
 * !78 supervisor-script-shape test.
 */
function stripCommentsAndStrings(src: string): string {
  return (
    src
      .replace(/'(?:[^']|'\\'')*'/g, "''")
      .replace(/"(?:\\.|[^"\\])*"/g, '""')
      .replace(/(^|[^"'])#.*$/gm, "$1")
  );
}

const NEW_SCRIPTS: Array<{ rel: string; src: string }> = [
  { rel: "scripts/supervisor/dispatch-template.sh", src: DISPATCH_TEMPLATE },
  { rel: "scripts/supervisor/fleet-dashboard.sh", src: FLEET_DASHBOARD },
  { rel: "scripts/supervisor/dispatch-log.sh", src: DISPATCH_LOG },
];

describe("supervisor bus v2 — shared shape", () => {
  for (const { rel, src } of NEW_SCRIPTS) {
    describe(rel, () => {
      it("has the bash shebang", () => {
        expect(src.startsWith("#!/usr/bin/env bash")).toBe(true);
      });

      it("uses the strict-bash prelude (set -euo pipefail)", () => {
        expect(src).toMatch(/set -euo pipefail/);
      });

      it("does not enable shell trace (set -x)", () => {
        expect(src).not.toMatch(/^\s*set\s+-x\s*$/m);
        expect(src).not.toMatch(/^\s*set\s+-[a-z]*x[a-z]*\s*$/m);
      });

      it("supports --help (case in the arg parser)", () => {
        expect(src).toMatch(/--help/);
        expect(src).toMatch(/-h\b/);
      });

      it("exits non-zero on an unknown flag / subcommand", () => {
        expect(src).toMatch(/unknown/);
        const exits = src.match(/^\s*exit\s+1\s*$/gm) ?? [];
        expect(
          exits.length,
          `${rel} must have at least one explicit "exit 1" path`,
        ).toBeGreaterThanOrEqual(1);
      });

      it("never echoes a Supabase service-role key or database URL", () => {
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

describe("dispatch-template.sh — output discipline", () => {
  it("requires both <agent> and <objective> arguments", () => {
    expect(DISPATCH_TEMPLATE).toMatch(/missing required <agent>/);
    expect(DISPATCH_TEMPLATE).toMatch(/missing required <objective>/);
  });

  it("includes the agent-state mark working hook in the emitted brief", () => {
    expect(DISPATCH_TEMPLATE).toMatch(/agent-state\.sh\s+mark\s+\$AGENT\s+working/);
  });

  it("includes the agent-state report-done hook at the end of the brief", () => {
    expect(DISPATCH_TEMPLATE).toMatch(/agent-state\.sh\s+report-done\s+\$AGENT/);
  });

  it("includes the clean-old-worktree pattern", () => {
    // The emitted brief contains `rm -f "$w/node_modules"` — but the
    // source heredoc escapes the `$` as `\$` so dispatch-template's own
    // shell doesn't expand it. Match either form.
    expect(DISPATCH_TEMPLATE).toMatch(/rm\s+-f\s+["']?\\?\$w\/node_modules/);
  });

  it("includes the standard gate checklist", () => {
    expect(DISPATCH_TEMPLATE).toMatch(/typecheck:ci/);
    expect(DISPATCH_TEMPLATE).toMatch(/lint/);
    expect(DISPATCH_TEMPLATE).toMatch(/vitest/);
  });

  it("includes the universal report-banner block", () => {
    expect(DISPATCH_TEMPLATE).toMatch(/Report from \$AGENT/);
    expect(DISPATCH_TEMPLATE).toMatch(/Done:/);
    expect(DISPATCH_TEMPLATE).toMatch(/Undone:/);
  });
});

describe("fleet-dashboard.sh — composition discipline", () => {
  it("shells out to the existing mr-status.sh", () => {
    expect(FLEET_DASHBOARD).toMatch(/mr-status\.sh/);
  });

  it("shells out to the existing agent-state.sh list", () => {
    expect(FLEET_DASHBOARD).toMatch(/agent-state\.sh"\s+list/);
  });

  it("renders three labelled sections (queue / fleet / summary)", () => {
    expect(FLEET_DASHBOARD).toMatch(/MR queue/);
    expect(FLEET_DASHBOARD).toMatch(/Agent fleet/);
    expect(FLEET_DASHBOARD).toMatch(/Summary/);
  });

  it("derives the summary counts from captured output, not extra API calls", () => {
    // The captured mr-status output is held in MR_LINES; the captured
    // agent-state output is in AGENT_LINES. The summary must reference
    // both rather than re-shelling out to glab or jq directly.
    expect(FLEET_DASHBOARD).toMatch(/MR_LINES/);
    expect(FLEET_DASHBOARD).toMatch(/AGENT_LINES/);
    // No extra glab call in the summary section.
    const code = stripCommentsAndStrings(FLEET_DASHBOARD);
    // The only references to `glab` should arrive transitively via the
    // called scripts, which means `glab` should NOT appear directly in
    // fleet-dashboard.sh's code path.
    expect(code).not.toMatch(/\bglab\b/);
  });

  it("does not call agent-state.sh mark / report-done (read-only)", () => {
    const code = stripCommentsAndStrings(FLEET_DASHBOARD);
    expect(code).not.toMatch(/agent-state\.sh"?\s+(mark|mark-idle|report-done)\b/);
  });
});

describe("dispatch-log.sh — read-only + filter discipline", () => {
  it("reads ~/.mercyb/dispatch-log.jsonl, never writes to it", () => {
    expect(DISPATCH_LOG).toMatch(/dispatch-log\.jsonl/);
    const code = stripCommentsAndStrings(DISPATCH_LOG);
    // No append or write redirection to the log file path.
    expect(code).not.toMatch(/>>\s*"?\$\{?LOG_FILE/);
    expect(code).not.toMatch(/>\s*"?\$\{?LOG_FILE/);
  });

  it("supports --agent and --since filters", () => {
    expect(DISPATCH_LOG).toMatch(/--agent\)/);
    expect(DISPATCH_LOG).toMatch(/--since\)/);
  });

  it("supports --all to disable the 24h default window", () => {
    expect(DISPATCH_LOG).toMatch(/--all\)/);
  });

  it("normalizes a bare YYYY-MM-DD to start-of-day UTC", () => {
    expect(DISPATCH_LOG).toMatch(/normalize_since/);
    expect(DISPATCH_LOG).toMatch(/T00-00-00Z/);
  });

  it("refuses to read a malformed JSONL log instead of partial-printing", () => {
    expect(DISPATCH_LOG).toMatch(/malformed JSON/i);
    expect(DISPATCH_LOG).toMatch(/exit\s+3/);
  });

  it("respects MERCYB_STATE_DIR env override for test isolation", () => {
    expect(DISPATCH_LOG).toMatch(/MERCYB_STATE_DIR/);
  });
});

describe("agent-state.sh — v2 extensions (backward-compatible)", () => {
  it("still supports the !78 subcommands (mark, mark-idle, list, idle)", () => {
    expect(AGENT_STATE).toMatch(/\bmark\)/);
    expect(AGENT_STATE).toMatch(/\bmark-idle\)/);
    expect(AGENT_STATE).toMatch(/\blist\)/);
    expect(AGENT_STATE).toMatch(/\bidle\)/);
  });

  it("adds the new report-done subcommand", () => {
    expect(AGENT_STATE).toMatch(/report-done\)/);
    expect(AGENT_STATE).toMatch(/cmd_report_done/);
  });

  it("report-done validates the MR number as a positive integer", () => {
    expect(AGENT_STATE).toMatch(/positive integer/);
    expect(AGENT_STATE).toMatch(/\^\[0-9\]\+\$/);
  });

  it("appends ONE JSON line to dispatch-log.jsonl per report-done call", () => {
    expect(AGENT_STATE).toMatch(/DISPATCH_LOG_FILE/);
    expect(AGENT_STATE).toMatch(/>>\s*"?\$\{?DISPATCH_LOG_FILE/);
    // Use jq -cn to produce a SINGLE compact JSON object (one line).
    expect(AGENT_STATE).toMatch(/jq\s+-cn/);
  });

  it("dispatch log lives in MERCYB_STATE_DIR (HOME), not the repo", () => {
    expect(AGENT_STATE).toMatch(/DISPATCH_LOG_FILE="\$STATE_DIR\/dispatch-log\.jsonl"/);
    const code = stripCommentsAndStrings(AGENT_STATE);
    expect(code).not.toMatch(/scripts\/supervisor\/dispatch-log\.jsonl/);
  });

  it("never echoes a secret in the new subcommand", () => {
    const code = stripCommentsAndStrings(AGENT_STATE);
    expect(code).not.toMatch(/\becho\b[^|;&]*\$\{?DATABASE_URL/);
    expect(code).not.toMatch(/\bprintf\b[^|;&]*\$\{?SUPABASE_SERVICE_ROLE_KEY/);
  });
});

describe("v2 scripts exist as files", () => {
  for (const { rel } of NEW_SCRIPTS) {
    it(`${rel} is present`, () => {
      const st = statSync(path.join(REPO_ROOT, rel));
      expect(st.isFile()).toBe(true);
      expect(st.size).toBeGreaterThan(100);
    });
  }
});
