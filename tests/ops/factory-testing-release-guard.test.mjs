import { describe, expect, it } from "vitest";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  BLOCKED_PROCESS_PATTERNS,
  evaluateRelease,
  findBlockedProcesses,
  parseProcessTable,
} from "../../scripts/ops/factory-testing-release-guard.mjs";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const guardScript = path.join(repoRoot, "scripts/ops/factory-testing-release-guard.mjs");

describe("factory testing release guard", () => {
  it("records the exact process names that deny testing-mode release", () => {
    expect(BLOCKED_PROCESS_PATTERNS).toEqual([
      "remote-worker-ci-feeder",
      "ci-pump",
      "ci-pending-pump",
      "ci-backlog-controller",
      "c2-strict-ci-worthy",
    ]);
  });

  it("denies testing-mode release when a feeder or CI pump process is alive", () => {
    const processCommands = parseProcessTable(`
      101 /bin/zsh /Users/admin/autorun/remote-worker-ci-feeder --branch automation/c2-strict-ci-worthy
      102 node scripts/ops/ci-pending-pump.mjs
      103 npm run test
    `);

    const result = evaluateRelease({ mode: "testing", processTable: processCommands.join("\n") });

    expect(result.allowed).toBe(false);
    expect(result.blocked.map((item) => item.pattern)).toEqual([
      "remote-worker-ci-feeder",
      "c2-strict-ci-worthy",
      "ci-pending-pump",
    ]);
  });

  it("allows non-testing modes even when old automation is present", () => {
    const result = evaluateRelease({
      mode: "development",
      processTable: "201 node /tmp/ci-pump.mjs\n",
    });

    expect(result.allowed).toBe(true);
    expect(result.reason).toBe("guard only applies in testing mode");
  });

  it("can run as a CLI against an injected process table", () => {
    const temp = mkdtempSync(path.join(tmpdir(), "factory-release-guard-"));
    try {
      const psFixture = path.join(temp, "ps.txt");
      writeFileSync(psFixture, "301 node /Users/admin/autorun/ci-backlog-controller.mjs\n");

      const denied = spawnSync("node", [guardScript, "--mode", "testing"], {
        cwd: repoRoot,
        env: {
          ...process.env,
          FACTORY_RELEASE_GUARD_PS_FILE: psFixture,
        },
        encoding: "utf8",
      });

      expect(denied.status).toBe(1);
      expect(denied.stderr).toContain("deny release");
      expect(denied.stderr).toContain("ci-backlog-controller");
    } finally {
      rmSync(temp, { recursive: true, force: true });
    }
  });

  it("matches every blocked pattern in command lines", () => {
    const matches = findBlockedProcesses([
      "remote-worker-ci-feeder",
      "ci-pump",
      "ci-pending-pump",
      "ci-backlog-controller",
      "c2-strict-ci-worthy",
    ]);

    expect(matches.map((item) => item.pattern)).toEqual(BLOCKED_PROCESS_PATTERNS);
  });
});
