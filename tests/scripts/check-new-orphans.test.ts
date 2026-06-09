import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SCRIPT = path.join(REPO_ROOT, "scripts/ci/check-new-orphans.mjs");

let tmpRoot: string;
let repo: string;

function git(args: string[]): string {
  return execFileSync("git", args, { cwd: repo, encoding: "utf8" });
}

function write(rel: string, content: string): void {
  const fullPath = path.join(repo, rel);
  mkdirSync(path.dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, content);
}

function commit(message: string): string {
  git(["add", "."]);
  git(["commit", "-m", message]);
  return git(["rev-parse", "HEAD"]).trim();
}

function runCheck(base: string): { status: number; output: string } {
  try {
    const output = execFileSync("node", [SCRIPT], {
      cwd: repo,
      encoding: "utf8",
      env: {
        ...process.env,
        CI_MERGE_REQUEST_DIFF_BASE_SHA: base,
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { status: 0, output };
  } catch (error) {
    const err = error as { status?: number; stdout?: Buffer; stderr?: Buffer };
    return {
      status: err.status ?? 1,
      output: `${err.stdout?.toString("utf8") ?? ""}${err.stderr?.toString("utf8") ?? ""}`,
    };
  }
}

beforeEach(() => {
  tmpRoot = mkdtempSync(path.join(tmpdir(), "mercyb-orphan-check-"));
  repo = path.join(tmpRoot, "repo");
  mkdirSync(repo, { recursive: true });
  git(["init", "-b", "main"]);
  git(["config", "user.email", "test@example.com"]);
  git(["config", "user.name", "Orphan Check Test"]);
});

afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
});

describe("check-new-orphans.mjs", () => {
  it("treats files matched by a static import.meta.glob consumer as imported", () => {
    write(
      "src/lib/tutor/speakTopicLibrary.ts",
      [
        "type SpeakTopicModule = { speakTopics: readonly unknown[] };",
        'const speakTopicModules = import.meta.glob<SpeakTopicModule>("./autoTopics/*.ts", {',
        "  eager: true,",
        "});",
        "export const count = Object.keys(speakTopicModules).length;",
        "",
      ].join("\n"),
    );
    const base = commit("base glob consumer");

    write("src/lib/tutor/autoTopics/foodOrdering.ts", "export const speakTopics = [] as const;\n");
    commit("add auto-registered topic");

    const result = runCheck(base);

    expect(result.status).toBe(0);
    expect(result.output).toContain("no new orphan files");
    expect(result.output).not.toContain("foodOrdering.ts");
  });

  it("still fails a newly added source file that no import or glob consumes", () => {
    write("src/lib/tutor/speakTopicLibrary.ts", "export const count = 0;\n");
    const base = commit("base without consumer");

    write("src/lib/tutor/manualTopicOrphan.ts", "export const speakTopics = [] as const;\n");
    commit("add orphan topic");

    const result = runCheck(base);

    expect(result.status).toBe(1);
    expect(result.output).toContain("src/lib/tutor/manualTopicOrphan.ts");
  });
});
