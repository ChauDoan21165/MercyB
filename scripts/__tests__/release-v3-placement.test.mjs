import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  buildStatusModel,
  checkRequiredFiles,
  checkRequiredScripts,
  classifyCommand,
  formatJson,
  formatTerminal,
  helpText,
  main,
  parseArgs,
} from "../release-v3-placement.mjs";

const SCRIPT = path.resolve("scripts/release-v3-placement.mjs");

let repo;

function write(rel, text) {
  const abs = path.join(repo, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
}

function setupRepo(scripts = {}) {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), "mb-v3-release-"));
  write("package.json", JSON.stringify({
    scripts: {
      "test:resume": "vitest run src/pages/placement/v3/__tests__/ResultsPage.resumeSmoke.test.tsx",
      "verify:v3-placement": "node scripts/verify-v3-placement.mjs",
      "typecheck:app": "tsc -p tsconfig.typecheck.json --noEmit",
      build: "vite build",
      ...scripts,
    },
  }, null, 2));
  write("scripts/verify-v3-placement.mjs", "#!/usr/bin/env node\n");
  write("scripts/__tests__/verify-v3-placement.test.mjs", "it('passes',()=>{})\n");
}

function result(exitCode = 0, output = "", durationMs = 1) {
  return { exitCode, stdout: output, stderr: "", output, durationMs, command: "mock", error: null };
}

function runner(overrides = {}) {
  const calls = [];
  const fn = (command, args) => {
    const key = [command, ...args].join(" ");
    calls.push(key);
    return overrides[key] || result(0, "ok\n");
  };
  fn.calls = calls;
  return fn;
}

beforeEach(() => setupRepo());
afterEach(() => fs.rmSync(repo, { recursive: true, force: true }));

describe("release-v3-placement args and help", () => {
  it("parses json", () => {
    expect(parseArgs(["--json"]).options.json).toBe(true);
  });

  it("parses help", () => {
    expect(parseArgs(["--help"]).options.help).toBe(true);
  });

  it("parses skip-build", () => {
    expect(parseArgs(["--skip-build"]).options.skipBuild).toBe(true);
  });

  it("rejects unknown args", () => {
    expect(parseArgs(["--bad"]).error).toContain("Unknown argument");
  });

  it("help includes Usage", () => {
    expect(helpText()).toContain("Usage");
  });

  it("help includes Options", () => {
    expect(helpText()).toContain("Options");
  });

  it("help includes Examples", () => {
    expect(helpText()).toContain("Examples");
  });

  it("help documents silent json", () => {
    expect(helpText()).toContain("npm run --silent release:v3-placement -- --json");
  });

  it("spawned help exits zero", () => {
    const run = spawnSync("node", [SCRIPT, "--help"], { encoding: "utf8" });
    expect(run.status).toBe(0);
    expect(run.stdout).toContain("Usage");
  });
});

describe("release-v3-placement prerequisites", () => {
  it("passes required scripts when present", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(repo, "package.json"), "utf8"));
    expect(checkRequiredScripts(pkg).every((check) => check.status === "PASS")).toBe(true);
  });

  it("fails when test:resume is missing", () => {
    setupRepo({ "test:resume": undefined });
    const pkg = JSON.parse(fs.readFileSync(path.join(repo, "package.json"), "utf8"));
    delete pkg.scripts["test:resume"];
    expect(checkRequiredScripts(pkg).find((check) => check.name === "script:test:resume").status).toBe("FAIL");
  });

  it("fails when verify:v3-placement is missing", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(repo, "package.json"), "utf8"));
    delete pkg.scripts["verify:v3-placement"];
    expect(checkRequiredScripts(pkg).find((check) => check.name === "script:verify:v3-placement").status).toBe("FAIL");
  });

  it("fails malformed scripts", () => {
    expect(checkRequiredScripts({ scripts: null })[0].status).toBe("FAIL");
  });

  it("passes required files when present", () => {
    expect(checkRequiredFiles(repo).every((check) => check.status === "PASS")).toBe(true);
  });

  it("fails missing verifier script file", () => {
    fs.rmSync(path.join(repo, "scripts/verify-v3-placement.mjs"));
    expect(checkRequiredFiles(repo).find((check) => check.name.includes("verify-v3-placement.mjs")).status).toBe("FAIL");
  });

  it("fails missing verifier test file", () => {
    fs.rmSync(path.join(repo, "scripts/__tests__/verify-v3-placement.test.mjs"));
    expect(checkRequiredFiles(repo).find((check) => check.name.includes("verify-v3-placement.test.mjs")).status).toBe("FAIL");
  });
});

describe("release-v3-placement command classification", () => {
  it("classifies passing command", () => {
    expect(classifyCommand("x", "cmd", result(0)).status).toBe("PASS");
  });

  it("classifies failing command", () => {
    expect(classifyCommand("x", "cmd", result(1, "failed\n")).status).toBe("FAIL");
  });

  it("classifies command error", () => {
    expect(classifyCommand("x", "cmd", { ...result(1), error: "spawn failed" }).details).toBe("spawn failed");
  });
});

describe("release-v3-placement status model", () => {
  it("release happy path passes", () => {
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner(), generatedAt: "T" });
    expect(model.exitCode).toBe(0);
    expect(model.exitReason).toBe("READY");
  });

  it("runs test:resume", () => {
    const r = runner();
    buildStatusModel({ repoRoot: repo, options: {}, runner: r, generatedAt: "T" });
    expect(r.calls).toContain("npm run test:resume");
  });

  it("runs verify:v3-placement", () => {
    const r = runner();
    buildStatusModel({ repoRoot: repo, options: {}, runner: r, generatedAt: "T" });
    expect(r.calls).toContain("npm run verify:v3-placement");
  });

  it("runs typecheck:app", () => {
    const r = runner();
    buildStatusModel({ repoRoot: repo, options: {}, runner: r, generatedAt: "T" });
    expect(r.calls).toContain("npm run typecheck:app");
  });

  it("runs build", () => {
    const r = runner();
    buildStatusModel({ repoRoot: repo, options: {}, runner: r, generatedAt: "T" });
    expect(r.calls).toContain("npm run build");
  });

  it("runs git diff check", () => {
    const r = runner();
    buildStatusModel({ repoRoot: repo, options: {}, runner: r, generatedAt: "T" });
    expect(r.calls).toContain("git diff --check");
  });

  it("fails when test:resume command fails", () => {
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner({ "npm run test:resume": result(1, "resume failed\n") }), generatedAt: "T" });
    expect(model.topBlockers[0].check).toBe("test:resume");
  });

  it("fails when verify:v3-placement command fails", () => {
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner({ "npm run verify:v3-placement": result(1, "verify failed\n") }), generatedAt: "T" });
    expect(model.topBlockers.some((blocker) => blocker.check === "verify:v3-placement")).toBe(true);
  });

  it("fails when typecheck:app command fails", () => {
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner({ "npm run typecheck:app": result(1, "typecheck failed\n") }), generatedAt: "T" });
    expect(model.topBlockers.some((blocker) => blocker.check === "typecheck:app")).toBe(true);
  });

  it("fails when build command fails", () => {
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner({ "npm run build": result(1, "build failed\n") }), generatedAt: "T" });
    expect(model.topBlockers.some((blocker) => blocker.check === "build")).toBe(true);
  });

  it("fails when git diff check fails", () => {
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner({ "git diff --check": result(1, "space error\n") }), generatedAt: "T" });
    expect(model.topBlockers.some((blocker) => blocker.check === "git diff check")).toBe(true);
  });

  it("skip-build skips build only", () => {
    const r = runner();
    const model = buildStatusModel({ repoRoot: repo, options: { skipBuild: true }, runner: r, generatedAt: "T" });
    expect(model.checks.find((check) => check.name === "build").status).toBe("SKIPPED");
    expect(r.calls).not.toContain("npm run build");
    expect(r.calls).toContain("npm run typecheck:app");
  });

  it("nonzero failure on required blocker", () => {
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner({ "npm run test:resume": result(1, "no\n") }), generatedAt: "T" });
    expect(model.exitCode).toBe(1);
  });

  it("no zero-check false green", () => {
    fs.rmSync(path.join(repo, "package.json"));
    const model = buildStatusModel({ repoRoot: repo, options: {}, runner: runner(), generatedAt: "T" });
    expect(model.checks.length).toBeGreaterThan(0);
    expect(model.exitCode).toBe(1);
  });
});

describe("release-v3-placement output", () => {
  it("release JSON validity", () => {
    const text = formatJson(buildStatusModel({ repoRoot: repo, options: {}, runner: runner(), generatedAt: "T" }));
    expect(JSON.parse(text).schemaVersion).toBe("v3-placement-release/v1");
  });

  it("terminal output includes release title", () => {
    expect(formatTerminal(buildStatusModel({ repoRoot: repo, options: {}, runner: runner(), generatedAt: "T" }))).toContain("V3 Placement Release Gate");
  });

  it("terminal output includes blockers", () => {
    expect(formatTerminal(buildStatusModel({ repoRoot: repo, options: {}, runner: runner({ "npm run build": result(1, "bad\n") }), generatedAt: "T" }))).toContain("Top Blockers");
  });

  it("main json writes parseable json", () => {
    let stdout = "";
    const code = main(["--json"], {
      repoRoot: repo,
      runner: runner(),
      generatedAt: "T",
      stdout: { write: (value) => { stdout += value; } },
      stderr: { write: () => {} },
    });
    expect(code).toBe(0);
    expect(JSON.parse(stdout).exitReason).toBe("READY");
  });

  it("main help exits zero", () => {
    expect(main(["--help"], { stdout: { write: () => {} }, stderr: { write: () => {} } })).toBe(0);
  });

  it("main invalid arg exits four", () => {
    expect(main(["--bad"], { stdout: { write: () => {} }, stderr: { write: () => {} } })).toBe(4);
  });

  it("main returns nonzero on required blocker", () => {
    const code = main([], {
      repoRoot: repo,
      runner: runner({ "npm run test:resume": result(1, "bad\n") }),
      stdout: { write: () => {} },
      stderr: { write: () => {} },
    });
    expect(code).toBe(1);
  });
});
