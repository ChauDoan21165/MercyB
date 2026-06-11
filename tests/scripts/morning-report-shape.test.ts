// tests/scripts/morning-report-shape.test.ts
//
// Shape / safety tests for scripts/host/morning-report.sh.
//
// Static tests always run (no external deps needed — they inspect the file).
// Execution tests are gated on BOARD_EXISTS so they skip cleanly on CI runners
// that don't have /Users/admin/agent-board.md.

import { execSync } from "node:child_process";
import { existsSync, readFileSync, mkdirSync, appendFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect, beforeAll } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SCRIPT = path.join(REPO_ROOT, "scripts", "host", "morning-report.sh");
const SRC = readFileSync(SCRIPT, "utf8");

const SECTION_HEADERS = [
  "--- Disk Free ---",
  "--- Worktrees (/private/tmp) ---",
  "--- Merged MRs (last 24h) ---",
  "--- Function Scoreboard ---",
  "--- Escalations for Chau ---",
  "--- Factory Lanes ---",
] as const;

const BOARD_EXISTS = existsSync("/Users/admin/agent-board.md");

// ── Utilities ────────────────────────────────────────────────────────────────

function stripComments(src: string): string {
  return src
    .split("\n")
    .filter((l) => !/^\s*#/.test(l))
    .join("\n");
}

// ── Static analysis tests (always run) ───────────────────────────────────────

describe("morning-report.sh — static shape", () => {
  it("has a bash shebang", () => {
    expect(SRC.startsWith("#!/usr/bin/env bash")).toBe(true);
  });

  it("exports PATH explicitly (cron-safe)", () => {
    expect(SRC).toMatch(/^export PATH=/m);
  });

  it("contains all 6 section header strings", () => {
    for (const hdr of SECTION_HEADERS) {
      expect(SRC, `missing section: "${hdr}"`).toContain(hdr);
    }
  });

  it("persists disk reading to .disk-last", () => {
    expect(SRC).toContain(".disk-last");
    expect(SRC).toMatch(/>\s*"\$\{DISK_LAST\}"/);
  });

  it("appends (>>) to a dated copy named with TODAY", () => {
    expect(SRC).toMatch(/>>\s*"\$\{DATED_COPY\}"/);
    expect(SRC).toContain("TODAY");
    expect(SRC).toMatch(/morning-report-\$\{TODAY\}/);
  });

  it("computes disk delta vs yesterday", () => {
    expect(SRC).toContain("vs yesterday");
    expect(SRC).toContain("_delta");
  });

  it("covers all four worktree glob patterns", () => {
    expect(SRC).toContain("agent-*");
    expect(SRC).toContain("f[0-9]*-*");
    expect(SRC).toContain("mercyb-*");
    expect(SRC).toContain("mercyB-*");
  });

  it("checks for .mb-keep marker in worktree dirs", () => {
    expect(SRC).toContain(".mb-keep");
  });

  it("uses glab api with updated_after and state=merged", () => {
    expect(SRC).toContain("state=merged");
    expect(SRC).toContain("updated_after=");
    expect(SRC).toContain("glab api");
  });

  it("greps ESCALATIONS-FOR-CHAU from the board", () => {
    expect(SRC).toContain("ESCALATIONS-FOR-CHAU");
  });

  it("greps FACTORY LANES from the board", () => {
    expect(SRC).toContain("FACTORY LANES");
  });

  it("greps FUNCTIONS: or FUNCTION SCOREBOARD from the board", () => {
    expect(SRC).toMatch(/FUNCTIONS:|FUNCTION SCOREBOARD/);
  });

  it("does not echo any secret env var patterns", () => {
    const code = stripComments(SRC);
    const banned = [
      /\becho\b[^|;&\n]*\$\{?SUPABASE_SERVICE_ROLE_KEY\b/i,
      /\becho\b[^|;&\n]*\$\{?SUPABASE_ANON_KEY\b/i,
      /\becho\b[^|;&\n]*\$\{?DATABASE_URL\b/i,
    ];
    for (const re of banned) {
      expect(code, `script must not echo secret vars — pattern: ${re}`).not.toMatch(re);
    }
  });

  it("does not embed a literal JWT or service key", () => {
    // Strip comments and look for embedded token literals.
    const code = stripComments(SRC);
    expect(code).not.toMatch(/eyJ[A-Za-z0-9_-]{20,}/);
  });

  it("does not enable shell trace (set -x)", () => {
    expect(SRC).not.toMatch(/^\s*set\s+-x\s*$/m);
    expect(SRC).not.toMatch(/^\s*set\s+-[a-z]*x[a-z]*\s*$/m);
  });

  it("is valid bash syntax", () => {
    execSync(`bash -n "${SCRIPT}"`, { stdio: "pipe" });
  });
});

// ── Execution tests (host-only — skip on CI) ─────────────────────────────────

describe.skipIf(!BOARD_EXISTS)("morning-report.sh — execution (host only)", () => {
  const REPORT_FILE = "/Users/admin/morning-report.txt";
  const DATED_DIR = "/Users/admin/reports/morning";
  const DISK_LAST = `${DATED_DIR}/.disk-last`;
  let reportContent = "";
  let today = "";

  beforeAll(() => {
    // Seed .disk-last so we get a real delta line, not "first run".
    mkdirSync(DATED_DIR, { recursive: true });
    appendFileSync(DISK_LAST, ""); // touch — keeps existing value if present

    // Run the script (timeout 30s; glab may do a network call).
    execSync(`bash "${SCRIPT}"`, { stdio: "pipe", timeout: 30_000 });

    reportContent = readFileSync(REPORT_FILE, "utf8");
    today = new Date().toISOString().slice(0, 10);
  });

  it("generated report contains all 6 section headers", () => {
    for (const hdr of SECTION_HEADERS) {
      expect(
        reportContent,
        `section "${hdr}" missing from generated report`,
      ).toContain(hdr);
    }
  });

  it("writes a dated copy to the morning reports directory", () => {
    const datedCopy = path.join(DATED_DIR, `morning-report-${today}.txt`);
    expect(existsSync(datedCopy)).toBe(true);
  });

  it("disk free line has correct format (Disk: X.Y GB free  delta: ...)", () => {
    // Format: "Disk: 79.3 GB free  delta: +2.1 GB vs yesterday"
    //      or "Disk: 79.3 GB free  delta: n/a ..."
    expect(reportContent).toMatch(/Disk: \d+\.\d+ GB free\s+delta:/);
  });

  it("disk delta matches signed-float format or first-run marker", () => {
    const diskLine = reportContent
      .split("\n")
      .find((l) => l.startsWith("Disk:"));
    expect(diskLine).toBeTruthy();
    // Either a signed float ("delta: +2.1 GB vs yesterday") or n/a
    expect(diskLine).toMatch(
      /delta: ([+-]\d+\.\d+ GB vs yesterday|n\/a)/,
    );
  });
});
