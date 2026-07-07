import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const script = path.join(repoRoot, "scripts/admin/aak-factory-seeder.mjs");

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function run(args) {
  return spawnSync(process.execPath, [script, ...args], { encoding: "utf8" });
}

describe("AAK factory seeder", () => {
  it("creates deterministic dry-run manifest and filters only approved backlog items", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-factory-seeder-"));
    const input = path.join(tempDir, "backlog.json");
    const outputDir = path.join(tempDir, "out");
    writeJson(input, {
      workpacks: [
        {
          id: "ZZZ-NOT-APPROVED",
          title: "Skip me",
          status: "draft",
        },
        {
          id: "AAA-APPROVED",
          title: "First approved",
          approved: true,
          owner: "Admin",
          scope: "factory-seeding",
          brief: "Keep Vietnamese and English text intact.",
          acceptance_criteria: ["deterministic output", "dry-run path exists"],
          artifact_path: "/tmp/aaa.md",
        },
      ],
    });

    const first = run(["--input", input, "--output-dir", outputDir]);
    expect(first.status).toBe(0);
    const firstManifest = fs.readFileSync(path.join(outputDir, "seed-manifest.json"), "utf8");
    const second = run(["--input", input, "--output-dir", outputDir]);
    expect(second.status).toBe(0);
    expect(fs.readFileSync(path.join(outputDir, "seed-manifest.json"), "utf8")).toBe(firstManifest);

    const manifest = readJson(path.join(outputDir, "seed-manifest.json"));
    expect(manifest.dry_run).toBe(true);
    expect(manifest.database_writes).toBe("none");
    expect(manifest.source_item_count).toBe(2);
    expect(manifest.approved_item_count).toBe(1);
    expect(manifest.skipped_item_count).toBe(1);
    expect(manifest.jobs.map((job) => job.id)).toEqual(["AAA-APPROVED"]);
    expect(manifest.jobs[0].brief).toBe("Keep Vietnamese and English text intact.");

    const summary = readJson(path.join(outputDir, "dry-run-summary.json"));
    expect(summary.dry_run).toBe(true);
    expect(summary.applied_job_count).toBe(0);
    expect(fs.existsSync(path.join(outputDir, "prompts", "AAA-APPROVED.prompt.md"))).toBe(false);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("emits prompt files without applying jobs", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-factory-seeder-prompts-"));
    const input = path.join(tempDir, "backlog.jsonl");
    const outputDir = path.join(tempDir, "out");
    fs.writeFileSync(
      input,
      `${JSON.stringify({
        id: "PROMPT-001",
        approval_status: "approved",
        title: "Prompt job",
        brief: "Nguon tieng Viet giu nguyen. English source stays intact.",
      })}\n`,
    );

    const result = run(["--input", input, "--output-dir", outputDir, "--emit-prompts"]);
    expect(result.status).toBe(0);
    const promptPath = path.join(outputDir, "prompts", "PROMPT-001.prompt.md");
    expect(fs.readFileSync(promptPath, "utf8")).toContain("Nguon tieng Viet giu nguyen. English source stays intact.");
    expect(readJson(path.join(outputDir, "seed-manifest.json")).database_writes).toBe("none");

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("delegates job row creation only when apply-jobs is explicit", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-factory-seeder-apply-"));
    const input = path.join(tempDir, "backlog.json");
    const outputDir = path.join(tempDir, "out");
    const callsFile = path.join(tempDir, "calls.txt");
    const fakeTool = path.join(tempDir, "mf-factory-job-add");
    writeJson(input, [
      {
        id: "APPLY-001",
        status: "approved",
        title: "Apply job",
        brief: "Create a factory job row through local tooling.",
      },
    ]);
    fs.writeFileSync(
      fakeTool,
      `#!/usr/bin/env bash\nprintf '%s\\n' "$@" >> ${JSON.stringify(callsFile)}\necho task_added=42\n`,
      { mode: 0o755 },
    );

    const dryRun = run(["--input", input, "--output-dir", outputDir, "--job-add-tool", fakeTool]);
    expect(dryRun.status).toBe(0);
    expect(fs.existsSync(callsFile)).toBe(false);

    const apply = run(["--input", input, "--output-dir", outputDir, "--job-add-tool", fakeTool, "--apply-jobs"]);
    expect(apply.status).toBe(0);
    expect(fs.readFileSync(callsFile, "utf8")).toContain("--mission-slug");
    const summary = readJson(path.join(outputDir, "dry-run-summary.json"));
    expect(summary.dry_run).toBe(false);
    expect(summary.database_writes).toBe("delegated_to_local_factory_tool");
    expect(summary.applied_job_count).toBe(1);

    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it("rejects conflicting dry-run and apply-jobs flags", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "aak-factory-seeder-flags-"));
    const input = path.join(tempDir, "backlog.json");
    writeJson(input, [{ id: "FLAGS-001", approved: true }]);

    const result = run(["--input", input, "--dry-run", "--apply-jobs"]);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain("cannot combine --dry-run and --apply-jobs");

    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
