import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  SCHEMA_VERSION,
  CHECKS,
  parseArgs,
  helpText,
  runCheck,
  runAll,
  formatTerminal,
  formatJson,
} from "../doctor.mjs";

function mockRunner(exitCode = 0, stdout = "ok") {
  return vi.fn((command, args, options) => {
    if (exitCode !== 0) {
      const error = new Error("mock failure");
      error.status = exitCode;
      error.stderr = stdout;
      throw error;
    }
    return stdout;
  });
}

describe("doctor args and help", () => {
  it("parses --json", () => expect(parseArgs(["--json"]).options.json).toBe(true));
  it("parses --help", () => expect(parseArgs(["--help"]).options.help).toBe(true));
  it("parses -h", () => expect(parseArgs(["-h"]).options.help).toBe(true));
  it("rejects unknown args", () => expect(parseArgs(["--bad"]).ok).toBe(false));
  it("help text includes Usage", () => expect(helpText()).toContain("Usage"));
  it("help text includes Options", () => expect(helpText()).toContain("Options"));
  it("help text includes Exit codes", () => expect(helpText()).toContain("Exit codes"));
  it("help text includes Examples", () => expect(helpText()).toContain("Examples"));
  it("help text references doctor command", () => expect(helpText()).toContain("npm run doctor"));
  it("help text references --json flag", () => expect(helpText()).toContain("--json"));
  it("help text references --help flag", () => expect(helpText()).toContain("--help"));
});

describe("doctor checks list", () => {
  it("includes validate-rooms, not validate-room", () => {
    const names = CHECKS.map((c) => c.name);
    expect(names).toContain("validate-rooms");
    expect(names).not.toContain("validate-room");
  });
  it("includes node, npm, typecheck, lint, build", () => {
    const names = CHECKS.map((c) => c.name);
    expect(names).toEqual(["node", "npm", "typecheck", "lint", "validate-rooms", "build"]);
  });
  it("CHECKS is frozen", () => expect(Object.isFrozen(CHECKS)).toBe(true));
  it("all checks have name, command, args", () => {
    for (const check of CHECKS) {
      expect(check).toHaveProperty("name");
      expect(check).toHaveProperty("command");
      expect(check).toHaveProperty("args");
      expect(Array.isArray(check.args)).toBe(true);
    }
  });
});

describe("doctor runCheck", () => {
  it("passes when runner succeeds", () => {
    const result = runCheck(CHECKS[0], { cwd: "/tmp", runner: mockRunner(0, "v22.0.0") });
    expect(result.status).toBe("PASS");
    expect(result.exitCode).toBe(0);
    expect(result.name).toBe("node");
    expect(result.details).toBe("v22.0.0");
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
  it("fails when runner throws", () => {
    const result = runCheck(CHECKS[0], { cwd: "/tmp", runner: mockRunner(1, "command not found") });
    expect(result.status).toBe("FAIL");
    expect(result.exitCode).toBe(1);
    expect(result.details).toContain("command not found");
    expect(result.action).toContain("Fix node");
  });
  it("includes command string in result", () => {
    const result = runCheck(CHECKS[0], { cwd: "/tmp", runner: mockRunner(0, "") });
    expect(result.command).toBe("node -v");
  });
  it("reports duration on failure", () => {
    const result = runCheck(CHECKS[0], { cwd: "/tmp", runner: mockRunner(2, "") });
    expect(result.durationMs).toBeGreaterThanOrEqual(0);
  });
  it("redacts stderr on failure", () => {
    const result = runCheck(CHECKS[1], {
      cwd: "/tmp",
      runner: mockRunner(1, "Bearer ghp_1234567890abcdef1234567890abcdef12345678 secret exposed"),
    });
    expect(result.details).not.toContain("ghp_");
    expect(result.details).toContain("[redacted]");
  });
});

describe("doctor runAll", () => {
  it("all checks pass", () => {
    const model = runAll({ cwd: "/tmp", runner: mockRunner(0, "ok") });
    expect(model.exitCode).toBe(0);
    expect(model.exitReason).toBe("PASS");
    expect(model.failedCount).toBe(0);
    expect(model.totalCount).toBe(6);
    expect(model.summary).toBe("all 6 checks passed");
    expect(model.results).toHaveLength(6);
    expect(model.schemaVersion).toBe(SCHEMA_VERSION);
  });
  it("reports failure when one check fails", () => {
    let call = 0;
    const runner = vi.fn((command, args, options) => {
      call++;
      if (call === 4) {
        const error = new Error("lint failed");
        error.status = 1;
        error.stderr = "lint error";
        throw error;
      }
      return "ok";
    });
    const model = runAll({ cwd: "/tmp", runner });
    expect(model.exitCode).toBe(1);
    expect(model.exitReason).toBe("FAIL");
    expect(model.failedCount).toBe(1);
    expect(model.summary).toBe("1/6 check(s) failed");
    expect(model.results[3].status).toBe("FAIL");
    expect(model.results[3].name).toBe("lint");
  });
  it("reports all 6 check names in order", () => {
    const model = runAll({ cwd: "/tmp", runner: mockRunner(0, "ok") });
    expect(model.results.map((r) => r.name)).toEqual(["node", "npm", "typecheck", "lint", "validate-rooms", "build"]);
  });
});

describe("doctor formatTerminal", () => {
  it("produces readable output", () => {
    const model = runAll({ cwd: "/tmp", runner: mockRunner(0, "v22") });
    const output = formatTerminal(model);
    expect(output).toContain("Doctor Health Check");
    expect(output).toContain("DOCTOR PASS");
    expect(output).toContain("node: PASS");
    expect(output).toContain("runtime:");
  });
  it("shows FAIL status in terminal output", () => {
    const runner = vi.fn((cmd, args, opts) => {
      if (args?.[1] === "validate-rooms") {
        const err = new Error("fail");
        err.status = 2;
        err.stderr = "validation error";
        throw err;
      }
      return "ok";
    });
    const model = runAll({ cwd: "/tmp", runner });
    const output = formatTerminal(model);
    expect(output).toContain("DOCTOR FAIL");
    expect(output).toContain("validate-rooms: FAIL");
    expect(output).toContain("exit 2");
    expect(output).toContain("1/6 check(s) failed");
  });
});

describe("doctor formatJson", () => {
  it("produces valid JSON", () => {
    const model = runAll({ cwd: "/tmp", runner: mockRunner(0, "ok") });
    const json = formatJson(model);
    const parsed = JSON.parse(json);
    expect(parsed.schemaVersion).toBe(SCHEMA_VERSION);
    expect(parsed.exitCode).toBe(0);
    expect(parsed.results).toHaveLength(6);
  });
  it("JSON contains all expected top-level keys", () => {
    const model = runAll({ cwd: "/tmp", runner: mockRunner(0, "ok") });
    const parsed = JSON.parse(formatJson(model));
    expect(Object.keys(parsed)).toEqual([
      "schemaVersion", "generatedAt", "results", "failedCount",
      "totalCount", "summary", "exitCode", "exitReason", "runtimeMs",
    ]);
  });
  it("result objects have expected shape", () => {
    const model = runAll({ cwd: "/tmp", runner: mockRunner(0, "ok") });
    const parsed = JSON.parse(formatJson(model));
    for (const r of parsed.results) {
      expect(r).toHaveProperty("name");
      expect(r).toHaveProperty("command");
      expect(r).toHaveProperty("status");
      expect(r).toHaveProperty("exitCode");
      expect(r).toHaveProperty("durationMs");
      expect(r).toHaveProperty("details");
      expect(r).toHaveProperty("action");
    }
  });
});

describe("doctor output safety", () => {
  it("redacts Bearer tokens from failure details", () => {
    const runner = vi.fn(() => {
      const err = new Error("fail");
      err.status = 1;
      err.stderr = "Authorization: Bearer sk-abcdefghijklmnopqrstuvwxyz1234567890ABCDEF";
      throw err;
    });
    const model = runAll({ cwd: "/tmp", runner });
    const output = formatTerminal(model);
    expect(output).not.toContain("sk-");
    expect(output).toContain("[redacted]");
  });
  it("JSON output does not contain raw secrets", () => {
    const runner = vi.fn(() => {
      const err = new Error("fail");
      err.status = 1;
      err.stderr = "token=12345678901234567890123456789012";
      throw err;
    });
    const model = runAll({ cwd: "/tmp", runner });
    const json = formatJson(model);
    expect(json).not.toContain("12345678901234567890123456789012");
    expect(json).toContain("[redacted]");
  });
});

describe("doctor self-consistency", () => {
  it("runAll with passing runner exits 0", () => {
    expect(runAll({ cwd: "/tmp", runner: mockRunner(0, "ok") }).exitCode).toBe(0);
  });
  it("runAll with failing runner exits 1", () => {
    expect(runAll({ cwd: "/tmp", runner: mockRunner(1, "fail") }).exitCode).toBe(1);
  });
  it("totalCount equals CHECKS length", () => {
    const model = runAll({ cwd: "/tmp", runner: mockRunner(0, "ok") });
    expect(model.totalCount).toBe(CHECKS.length);
  });
});
