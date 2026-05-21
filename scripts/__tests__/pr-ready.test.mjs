import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

import {
  buildModel,
  checkPackageScripts,
  checkScope,
  classifyDiffCheck,
  formatJson,
  formatTerminal,
  helpText,
  parseArgs,
} from "../pr-ready.mjs";

const scripts = {
  "pr:ready": "node scripts/pr-ready.mjs",
  "typecheck:app": "tsc",
  build: "vite build",
  "mb:status": "node scripts/morning-status.mjs",
};

const gitInfo = {
  branch: "feature",
  commit: "abc123",
  dirty: false,
  staged: 0,
  unstaged: 0,
  untracked: 0,
  statusLines: [],
};

const okPackage = { ok: true, scripts, error: "" };
const okCommand = () => ({ exitCode: 0, durationMs: 1, output: "" });
const failCommand = () => ({ exitCode: 1, durationMs: 1, output: "bad whitespace" });

function model(overrides = {}) {
  return buildModel({
    root: "/repo",
    base: "origin/main",
    packageRead: okPackage,
    gitInfo,
    baseFiles: ["package.json", "scripts/pr-ready.mjs", "scripts/__tests__/pr-ready.test.mjs"],
    commandRunner: okCommand,
    generatedAt: "2026-05-21T12:00:00.000Z",
    ...overrides,
  });
}

describe("pr-ready gate", () => {
  it("help output includes Usage", () => expect(helpText()).toContain("Usage"));
  it("help output includes Options", () => expect(helpText()).toContain("Options"));
  it("help output includes Exit codes", () => expect(helpText()).toContain("Exit codes"));
  it("help output includes Examples", () => expect(helpText()).toContain("Examples"));
  it("parses --json", () => expect(parseArgs(["--json"]).options.json).toBe(true));
  it("parses --help", () => expect(parseArgs(["--help"]).options.help).toBe(true));
  it("parses --base", () => expect(parseArgs(["--base", "origin/main"]).options.base).toBe("origin/main"));
  it("rejects unknown args", () => expect(parseArgs(["--wat"]).ok).toBe(false));
  it("rejects invalid base", () => expect(parseArgs(["--base", "bad ref"]).ok).toBe(false));

  it("passes required package scripts when present", () => {
    expect(checkPackageScripts(scripts).filter((check) => check.status === "FAIL")).toEqual([]);
  });

  it("fails missing pr:ready script", () => {
    const copy = { ...scripts };
    delete copy["pr:ready"];
    expect(checkPackageScripts(copy).find((check) => check.name === "script:pr:ready").status).toBe("FAIL");
  });

  it("fails missing typecheck script", () => {
    const copy = { ...scripts };
    delete copy["typecheck:app"];
    expect(checkPackageScripts(copy).find((check) => check.name === "script:typecheck:app").status).toBe("FAIL");
  });

  it("fails missing build script", () => {
    const copy = { ...scripts };
    delete copy.build;
    expect(checkPackageScripts(copy).find((check) => check.name === "script:build").status).toBe("FAIL");
  });

  it("allows missing optional mb:status as MISSING", () => {
    const copy = { ...scripts };
    delete copy["mb:status"];
    expect(checkPackageScripts(copy).find((check) => check.name === "script:mb:status").status).toBe("MISSING");
  });

  it("passes scoped changed files", () => {
    expect(checkScope({ baseFiles: ["package.json"], worktreeFiles: ["scripts/pr-ready.mjs"] }).status).toBe("PASS");
  });

  it("fails unrelated changed files", () => {
    expect(checkScope({ baseFiles: ["src/unrelated.ts"], worktreeFiles: [] }).status).toBe("FAIL");
  });

  it("fails untracked contamination", () => {
    expect(checkScope({ baseFiles: [], worktreeFiles: ["tmp.log"] }).unexpected).toEqual(["tmp.log"]);
  });

  it("classifies git diff check pass", () => {
    expect(classifyDiffCheck({ exitCode: 0, durationMs: 1, output: "" }).status).toBe("PASS");
  });

  it("classifies git diff check failure", () => {
    expect(classifyDiffCheck({ exitCode: 1, durationMs: 1, output: "bad" }).status).toBe("FAIL");
  });

  it("model exits 0 when ready", () => expect(model().exitCode).toBe(0));
  it("model exits nonzero on missing package script", () => {
    const bad = { ok: true, scripts: { build: "x", "typecheck:app": "x" }, error: "" };
    expect(model({ packageRead: bad }).exitCode).toBe(1);
  });

  it("model exits nonzero on dirty unscoped file", () => {
    const dirty = { ...gitInfo, dirty: true, untracked: 1, statusLines: ["?? notes.txt"] };
    expect(model({ gitInfo: dirty }).exitCode).toBe(1);
  });

  it("model exits nonzero on git diff check failure", () => expect(model({ commandRunner: failCommand }).exitCode).toBe(1));
  it("model exits invalid configuration on malformed package", () => {
    expect(model({ packageRead: { ok: false, scripts: {}, error: "bad json" } }).exitCode).toBe(3);
  });

  it("terminal output includes blockers", () => {
    expect(formatTerminal(model({ commandRunner: failCommand }))).toContain("Top Blockers");
  });

  it("terminal output prints None when no blockers", () => {
    expect(formatTerminal(model())).toContain("Top Blockers\nNone");
  });

  it("JSON output is valid", () => {
    expect(() => JSON.parse(formatJson(model()))).not.toThrow();
  });

  it("JSON output contains schema", () => {
    expect(JSON.parse(formatJson(model())).schemaVersion).toBe("pr-ready/v2");
  });

  it("JSON output contains changed files", () => {
    expect(JSON.parse(formatJson(model())).changedFiles).toContain("package.json");
  });

  it("JSON output contains exit code", () => {
    expect(JSON.parse(formatJson(model())).exitCode).toBe(0);
  });

  it("spawned help works", () => {
    const result = spawnSync("node", ["scripts/pr-ready.mjs", "--help"], { cwd: process.cwd(), encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Usage");
  });

  it("spawned json works", () => {
    const result = spawnSync("node", ["scripts/pr-ready.mjs", "--json", "--base", "HEAD"], { cwd: process.cwd(), encoding: "utf8" });
    expect(() => JSON.parse(result.stdout)).not.toThrow();
  });

  it("exit nonzero on failed required checks", () => {
    expect(model({ commandRunner: failCommand }).topBlockers[0].check).toBe("git diff --check");
  });
});
