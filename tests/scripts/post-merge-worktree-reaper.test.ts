import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SCRIPT = path.join(REPO_ROOT, "scripts/supervisor/post-merge-worktree-reaper.sh");

let tmpRoot: string;
let repo: string;
let worktreeRoot: string;

function git(args: string[], cwd = repo): string {
  return execFileSync("git", args, { cwd, encoding: "utf8" });
}

function runReaper(args: string[] = [], cwd = repo, extraEnv: NodeJS.ProcessEnv = {}): string {
  return execFileSync(SCRIPT, args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      MERCYB_REAPER_SKIP_PROCESS_CHECK: "1",
      MERCYB_REAPER_BUILDS_DIR: "",
      ...extraEnv,
    },
  });
}

function commitFile(cwd: string, rel: string, content: string, message: string): void {
  writeFileSync(path.join(cwd, rel), content);
  git(["add", rel], cwd);
  git(["commit", "-m", message], cwd);
}

beforeEach(() => {
  tmpRoot = mkdtempSync(path.join(tmpdir(), "mercyb-reaper-test-"));
  repo = path.join(tmpRoot, "repo");
  worktreeRoot = path.join(tmpRoot, "worktrees");

  git(["init", "-b", "main", repo], tmpRoot);
  git(["config", "user.email", "test@example.com"]);
  git(["config", "user.name", "Reaper Test"]);
  writeFileSync(path.join(repo, "base.txt"), "base\n");
  git(["add", "base.txt"]);
  git(["commit", "-m", "base"]);
});

afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe("post-merge-worktree-reaper.sh", () => {
  it("dry-runs by default and does not remove a merged clean worktree", () => {
    const mergedPath = path.join(worktreeRoot, "merged");
    git(["branch", "merged-branch"]);
    git(["worktree", "add", mergedPath, "merged-branch"]);
    const canonicalMergedPath = realpathSync(mergedPath);
    commitFile(mergedPath, "merged.txt", "merged\n", "merged branch work");
    git(["merge", "--ff-only", "merged-branch"]);

    const out = runReaper(["--merged-ref", "main", "--roots", worktreeRoot]);

    expect(out).toContain("mode=dry-run");
    expect(out).toContain(`DRY-RUN would-remove path=${canonicalMergedPath}`);
    expect(existsSync(mergedPath)).toBe(true);
  });

  it("removes a clean worktree whose branch is merged into the target ref", () => {
    const mergedPath = path.join(worktreeRoot, "merged-live");
    git(["branch", "merged-live-branch"]);
    git(["worktree", "add", mergedPath, "merged-live-branch"]);
    const canonicalMergedPath = realpathSync(mergedPath);
    commitFile(mergedPath, "merged-live.txt", "merged live\n", "merged live branch work");
    git(["merge", "--ff-only", "merged-live-branch"]);

    const out = runReaper(["--live", "--merged-ref", "main", "--roots", worktreeRoot]);

    expect(out).toContain("before df -h /");
    expect(out).toContain("after df -h /");
    expect(out).toContain(`REMOVE path=${canonicalMergedPath}`);
    expect(out).toContain("safe=clean-and-merged-into-main");
    expect(existsSync(mergedPath)).toBe(false);
  });

  it("does not remove unmerged, dirty, or locked worktrees", () => {
    const unmergedPath = path.join(worktreeRoot, "unmerged");
    const dirtyPath = path.join(worktreeRoot, "dirty");
    const lockedPath = path.join(worktreeRoot, "locked");

    git(["branch", "unmerged-branch"]);
    git(["worktree", "add", unmergedPath, "unmerged-branch"]);
    const canonicalUnmergedPath = realpathSync(unmergedPath);
    commitFile(unmergedPath, "unmerged.txt", "unmerged\n", "unmerged branch work");

    git(["branch", "dirty-branch"]);
    git(["worktree", "add", dirtyPath, "dirty-branch"]);
    const canonicalDirtyPath = realpathSync(dirtyPath);
    commitFile(dirtyPath, "dirty.txt", "dirty\n", "dirty branch work");
    git(["merge", "--ff-only", "dirty-branch"]);
    writeFileSync(path.join(dirtyPath, "local-only.txt"), "do not delete\n");

    git(["branch", "locked-branch"]);
    git(["worktree", "add", lockedPath, "locked-branch"]);
    const canonicalLockedPath = realpathSync(lockedPath);
    commitFile(lockedPath, "locked.txt", "locked\n", "locked branch work");
    git(["merge", "--ff-only", "locked-branch"]);
    git(["worktree", "lock", lockedPath, "--reason", "active runner"]);

    const out = runReaper(["--live", "--merged-ref", "main", "--roots", worktreeRoot]);

    expect(out).toContain(`SKIP unmerged path=${canonicalUnmergedPath}`);
    expect(out).toContain(`SKIP dirty-worktree path=${canonicalDirtyPath}`);
    expect(out).toContain(`SKIP locked-worktree path=${canonicalLockedPath}`);
    expect(existsSync(unmergedPath)).toBe(true);
    expect(existsSync(dirtyPath)).toBe(true);
    expect(existsSync(lockedPath)).toBe(true);
  });

  it("removes non-current numeric runner build dirs but keeps the current pipeline dir", () => {
    const buildsRoot = path.join(tmpRoot, "gitlab-runner-builds");
    const staleOne = path.join(buildsRoot, "111");
    const current = path.join(buildsRoot, "222");
    const staleTwo = path.join(buildsRoot, "333");
    mkdirSync(staleOne, { recursive: true });
    mkdirSync(current, { recursive: true });
    mkdirSync(staleTwo, { recursive: true });
    writeFileSync(path.join(staleOne, "artifact.txt"), "old\n");
    writeFileSync(path.join(current, "artifact.txt"), "current\n");
    writeFileSync(path.join(staleTwo, "artifact.txt"), "old\n");

    const out = runReaper(
      ["--live", "--merged-ref", "main", "--roots", worktreeRoot, "--builds-dir", buildsRoot],
      repo,
      { CI_PIPELINE_ID: "222" },
    );
    const canonicalBuildsRoot = realpathSync(buildsRoot);

    expect(out).toContain(`REMOVE build-dir path=${canonicalBuildsRoot}/111`);
    expect(out).toContain(`SKIP build-dir current-pipeline path=${realpathSync(current)}`);
    expect(out).toContain(`REMOVE build-dir path=${canonicalBuildsRoot}/333`);
    expect(existsSync(staleOne)).toBe(false);
    expect(existsSync(current)).toBe(true);
    expect(existsSync(staleTwo)).toBe(false);
  });
});
