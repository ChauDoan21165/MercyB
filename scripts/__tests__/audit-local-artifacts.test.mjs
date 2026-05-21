import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { afterAll, describe, expect, it } from "vitest";
import {
  AUDIT_ITEMS,
  EXIT_CODES,
  SCHEMA_VERSION,
  audit,
  parseArgs,
  pathState,
  renderTerminal,
} from "../audit-local-artifacts.mjs";

const roots = [];
const scriptPath = path.resolve("scripts/audit-local-artifacts.mjs");

function run(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trimEnd();
}

function write(root, filePath, content = "") {
  const fullPath = path.join(root, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}

function pkg(scripts = {}) {
  return `${JSON.stringify({ scripts }, null, 2)}\n`;
}

function createRepo({ scripts = {}, trackedFiles = [], untrackedFiles = [] } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "audit-local-artifacts-"));
  roots.push(root);
  run("git", ["init", "-q"], root);
  run("git", ["config", "user.email", "test@example.com"], root);
  run("git", ["config", "user.name", "Test User"], root);
  write(root, "package.json", pkg(scripts));
  for (const file of trackedFiles) {
    write(root, file, `tracked ${file}\n`);
  }
  run("git", ["add", "package.json", ...trackedFiles], root);
  run("git", ["commit", "-qm", "initial"], root);
  for (const file of untrackedFiles) {
    write(root, file, `untracked ${file}\n`);
  }
  return root;
}

function completeScripts() {
  return {
    "validate:tests": "node scripts/validate-tests.mjs",
    "mb:status": "node scripts/morning-status.mjs",
    "ops:morning": "node scripts/ops-morning.mjs",
    "pr:ready": "node scripts/pr-ready.mjs",
    "test:resume": "vitest run src/pages/placement/v3/__tests__/ResultsPage.resumeSmoke.test.tsx",
    "verify:v3-placement": "node scripts/verify-v3-placement.mjs",
    "release:v3-placement": "node scripts/release-v3-placement.mjs",
    "test:mobile-audio": "vitest run src/lib/speech/__tests__/mobileSafariSpeakingRuntime.test.ts",
    "verify:mobile-audio": "node scripts/verify-mobile-audio.mjs",
  };
}

function allAuditFiles() {
  return [...new Set(AUDIT_ITEMS.flatMap((item) => item.files))];
}

function cli(args, cwd) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: "utf8",
  });
}

afterAll(() => {
  for (const root of roots) {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

describe("audit-local-artifacts args", () => {
  it("help output is supported", () => {
    expect(parseArgs(["--help"]).options.help).toBe(true);
  });

  it("json output is supported", () => {
    expect(parseArgs(["--json"]).options.json).toBe(true);
  });

  it("rejects invalid args", () => {
    expect(parseArgs(["--bad"]).error).toContain("Unknown argument");
  });
});

describe("audit-local-artifacts file states", () => {
  it("classifies tracked safe artifact", () => {
    const root = createRepo({ trackedFiles: ["scripts/morning-status.mjs"] });
    expect(pathState(root, "scripts/morning-status.mjs")).toBe("TRACKED");
  });

  it("classifies missing backing file", () => {
    const root = createRepo();
    expect(pathState(root, "scripts/validate-tests.mjs")).toBe("MISSING");
  });

  it("classifies untracked file", () => {
    const root = createRepo({ untrackedFiles: ["scripts/validate-tests.mjs"] });
    expect(pathState(root, "scripts/validate-tests.mjs")).toBe("UNTRACKED");
  });

  it("classifies modified tracked file", () => {
    const root = createRepo({ trackedFiles: ["scripts/morning-status.mjs"] });
    write(root, "scripts/morning-status.mjs", "changed\n");
    expect(pathState(root, "scripts/morning-status.mjs")).toBe("MODIFIED");
  });
});

describe("audit-local-artifacts reports", () => {
  it("uses the schema version", () => {
    const root = createRepo();
    expect(audit({ cwd: root }).schemaVersion).toBe(SCHEMA_VERSION);
  });

  it("reports missing package script", () => {
    const root = createRepo({ trackedFiles: allAuditFiles() });
    const report = audit({ cwd: root });
    expect(report.artifacts.find((artifact) => artifact.name === "validate:tests").scripts[0].state).toBe("MISSING");
  });

  it("reports package script present but backing file missing", () => {
    const root = createRepo({ scripts: { "validate:tests": "node scripts/validate-tests.mjs" } });
    const artifact = audit({ cwd: root }).artifacts.find((item) => item.name === "validate:tests");
    expect(artifact.scripts[0].state).toBe("PRESENT");
    expect(artifact.files[0].state).toBe("MISSING");
    expect(artifact.safeToDependOn).toBe(false);
  });

  it("reports backing file present but package script missing", () => {
    const root = createRepo({ trackedFiles: ["scripts/validate-tests.mjs", "scripts/__tests__/validate-tests.test.mjs"] });
    const artifact = audit({ cwd: root }).artifacts.find((item) => item.name === "validate:tests");
    expect(artifact.scripts[0].state).toBe("MISSING");
    expect(artifact.files[0].state).toBe("TRACKED");
    expect(artifact.safeToDependOn).toBe(false);
  });

  it("marks fully safe inventory safe", () => {
    const root = createRepo({ scripts: completeScripts(), trackedFiles: allAuditFiles() });
    const report = audit({ cwd: root });
    expect(report.exitCode).toBe(EXIT_CODES.CLEAN);
    expect(report.artifacts.every((artifact) => artifact.safeToDependOn)).toBe(true);
  });

  it("exits unsafe when any audited required artifact is missing", () => {
    const root = createRepo({ scripts: completeScripts(), trackedFiles: allAuditFiles().filter((file) => file !== "scripts/validate-tests.mjs") });
    expect(audit({ cwd: root }).exitCode).toBe(EXIT_CODES.UNSAFE);
  });

  it("has no zero-check false green", () => {
    const root = createRepo();
    const report = audit({ cwd: root });
    expect(report.artifacts.length).toBeGreaterThan(0);
    expect(report.exitCode).toBe(EXIT_CODES.UNSAFE);
  });

  it("renders terminal output", () => {
    const root = createRepo();
    expect(renderTerminal(audit({ cwd: root }))).toContain("Local Artifact Audit");
  });

  it("lists command value if present", () => {
    const root = createRepo({ scripts: { "mb:status": "node scripts/morning-status.mjs" } });
    expect(renderTerminal(audit({ cwd: root }))).toContain("command=node scripts/morning-status.mjs");
  });

  it("lists unsafe dependencies", () => {
    const root = createRepo();
    expect(audit({ cwd: root }).unsafeArtifacts.length).toBeGreaterThan(0);
  });

  it("does not execute audited scripts", () => {
    const scripts = completeScripts();
    const root = createRepo({ scripts, trackedFiles: allAuditFiles() });
    write(root, "scripts/morning-status.mjs", "require('fs').writeFileSync('EXECUTED', 'yes');\n");
    run("git", ["add", "scripts/morning-status.mjs"], root);
    run("git", ["commit", "-qm", "make target executable"], root);
    audit({ cwd: root });
    expect(fs.existsSync(path.join(root, "EXECUTED"))).toBe(false);
  });

  it("does not modify audited artifacts", () => {
    const root = createRepo({ scripts: completeScripts(), trackedFiles: allAuditFiles() });
    const before = run("git", ["status", "--porcelain"], root);
    audit({ cwd: root });
    const after = run("git", ["status", "--porcelain"], root);
    expect(after).toBe(before);
  });
});

describe("audit-local-artifacts CLI", () => {
  it("help exits 0", () => {
    const root = createRepo();
    expect(cli(["--help"], root).status).toBe(0);
  });

  it("help output includes usage", () => {
    const root = createRepo();
    expect(cli(["--help"], root).stdout).toContain("Usage");
  });

  it("JSON output is valid", () => {
    const root = createRepo();
    expect(() => JSON.parse(cli(["--json"], root).stdout)).not.toThrow();
  });

  it("JSON reports unsafe exit reason", () => {
    const root = createRepo();
    expect(JSON.parse(cli(["--json"], root).stdout).exitReason).toBe("UNSAFE");
  });

  it("UNSAFE exit behavior is nonzero", () => {
    const root = createRepo();
    expect(cli([], root).status).toBe(EXIT_CODES.UNSAFE);
  });

  it("safe exit behavior is zero", () => {
    const root = createRepo({ scripts: completeScripts(), trackedFiles: allAuditFiles() });
    expect(cli([], root).status).toBe(EXIT_CODES.CLEAN);
  });

  it("invalid arg exits usage error", () => {
    const root = createRepo();
    expect(cli(["--unknown"], root).status).toBe(EXIT_CODES.USAGE_ERROR);
  });

  it("malformed package exits invalid configuration", () => {
    const root = createRepo();
    write(root, "package.json", "{");
    expect(cli([], root).status).toBe(EXIT_CODES.INVALID_AUDIT_CONFIGURATION);
  });
});
