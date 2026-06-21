import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { classifyCiFailure } from "../factory/classify-ci-failure.mjs";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const guardScript = join(repoRoot, "scripts/factory/guard-clean-commit.sh");

function run(command, args, cwd) {
  return spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: { ...process.env, HUSKY: "0" },
  });
}

function makeTempGitRepo() {
  const dir = mkdtempSync(join(tmpdir(), "mercyb-guard-"));
  run("git", ["init"], dir);
  run("git", ["config", "user.email", "test@example.com"], dir);
  run("git", ["config", "user.name", "Factory Test"], dir);
  writeFileSync(join(dir, "README.md"), "baseline\n");
  run("git", ["add", "README.md"], dir);
  run("git", ["commit", "-m", "baseline"], dir);
  return dir;
}

describe("classify-ci-failure", () => {
  it("classifies heap exhaustion as retryable infra OOM", () => {
    expect(classifyCiFailure("FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory")).toMatchObject({
      classification: "infra_oom",
      retryRecommended: true,
      holdForHuman: false,
    });
  });

  it("classifies orphan checks as real failures that need a human", () => {
    expect(classifyCiFailure("node scripts/ci/check-new-orphans.mjs\nnew orphan: src/example.ts")).toMatchObject({
      classification: "real_orphan",
      retryRecommended: false,
      holdForHuman: true,
    });
  });

  it("classifies TypeScript and ESLint failures before unknown", () => {
    expect(classifyCiFailure("src/app.ts(10,4): error TS2322: Type 'string' is not assignable")).toMatchObject({
      classification: "real_type_error",
    });
    expect(classifyCiFailure("eslint .\n12:7  error  no-unused-vars  @typescript-eslint/no-unused-vars")).toMatchObject({
      classification: "real_lint_error",
    });
  });
});

describe("guard-clean-commit", () => {
  it("passes in a clean temporary repo", () => {
    const dir = makeTempGitRepo();
    try {
      const result = run("bash", [guardScript], dir);
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("OK");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails on blocked untracked local paths", () => {
    const dir = makeTempGitRepo();
    try {
      mkdirSync(join(dir, ".local"), { recursive: true });
      writeFileSync(join(dir, ".local/state.json"), "{}\n");
      const result = run("bash", [guardScript], dir);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(".local/state.json");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("fails on blocked staged files", () => {
    const dir = makeTempGitRepo();
    try {
      mkdirSync(join(dir, "src/pages/home/__tests__"), { recursive: true });
      writeFileSync(join(dir, "src/pages/home/__tests__/Home.lazyBoundaries.test.ts"), "test\n");
      run("git", ["add", "src/pages/home/__tests__/Home.lazyBoundaries.test.ts"], dir);
      const result = run("bash", [guardScript], dir);
      expect(result.status).toBe(1);
      expect(result.stderr).toContain("src/pages/home/__tests__/Home.lazyBoundaries.test.ts");
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe("factory shell script shape", () => {
  it("clean-stale-workers protects runner and reconciler by default", () => {
    const text = readFile("scripts/factory/clean-stale-workers.sh");
    expect(text).toContain("gitlab-runner");
    expect(text).toContain("--include-reconciler");
    expect(text).toContain("cmd ~ /reconciler/");
    expect(text).toContain("MERCYB_STALE_WORKER_MIN_AGE_SECONDS");
    expect(text).toContain("age >= min_age_seconds");
  });

  it("watch-6h is read-only and uses caffeinate when available", () => {
    const text = readFile("scripts/factory/watch-6h.sh");
    expect(text).toContain("caffeinate -dimsu -t");
    expect(text).toContain("mercyb-6h-watch.log");
    expect(text).not.toMatch(/\b(git push|git merge|glab mr merge|deploy:cf-pages:main)\b/);
  });
});

function readFile(path) {
  return spawnSync("node", ["-e", "process.stdout.write(require('fs').readFileSync(process.argv[1], 'utf8'))", path], {
    cwd: repoRoot,
    encoding: "utf8",
  }).stdout;
}
