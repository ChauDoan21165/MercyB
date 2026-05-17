// FILE: check-manifest-delta.test.mjs
// PATH: scripts/__tests__/check-manifest-delta.test.mjs
/**
 * Integration tests for the pre-commit manifest-delta guard.
 *
 * Each case builds a throwaway git repo, drops the real helper script
 * into <tmp>/scripts/, mutates the working tree / index the way the
 * pre-commit hook would see it, then runs the helper as the hook does
 * (`node scripts/check-manifest-delta.mjs`) and asserts exit code + msg.
 *
 * The "cross-contamination" case reproduces the live incident from
 * reports/RECON-pre-commit-hook-audit.md (vip6_fi_5_mp3.json deleted by a
 * parallel agent in a shared checkout, never staged here).
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HELPER_SRC = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../check-manifest-delta.mjs"
);

let repo;

function git(args) {
  const r = spawnSync("git", args, { cwd: repo, encoding: "utf8" });
  if (r.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed: ${r.stderr || r.stdout}`);
  }
  return r.stdout;
}

function manifestTs(entries) {
  const body = Object.entries(entries)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)}`)
    .join(",\n");
  return (
    `/** AUTO-GENERATED — DO NOT EDIT */\n` +
    `export const PUBLIC_ROOM_MANIFEST: Record<string, string> = {\n` +
    `${body}\n};\n`
  );
}

function write(rel, contents) {
  const abs = path.join(repo, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, contents);
}

/** Run the helper exactly as the hook does. */
function runGuard() {
  return spawnSync("node", ["scripts/check-manifest-delta.mjs"], {
    cwd: repo,
    encoding: "utf8",
  });
}

beforeEach(() => {
  repo = fs.mkdtempSync(path.join(os.tmpdir(), "mb-mdguard-"));
  git(["init", "-q"]);
  git(["config", "user.email", "test@example.com"]);
  git(["config", "user.name", "Manifest Guard Test"]);
  git(["config", "commit.gpgsign", "false"]);

  // Ship the real helper into the sandbox repo.
  fs.mkdirSync(path.join(repo, "scripts"), { recursive: true });
  fs.copyFileSync(HELPER_SRC, path.join(repo, "scripts/check-manifest-delta.mjs"));

  // Baseline: two rooms, manifest committed and in sync.
  write("public/data/intro_free.json", JSON.stringify({ id: "intro_free" }));
  write(
    "public/data/vip6_fi_5_mp3.json",
    JSON.stringify({ id: "vip6_fi_5_mp3" })
  );
  write(
    "src/lib/roomManifest.ts",
    manifestTs({
      intro_free: "data/intro_free.json",
      vip6_fi_5_mp3: "data/vip6_fi_5_mp3.json",
    })
  );
  git(["add", "-A"]);
  git(["commit", "-qm", "baseline"]);
});

afterEach(() => {
  fs.rmSync(repo, { recursive: true, force: true });
});

describe("check-manifest-delta — pre-commit guard", () => {
  it("passes a legitimate room-add (room JSON staged, delta matches)", () => {
    // Author adds a room and stages it; regen adds the manifest key.
    write("public/data/career_b2.json", JSON.stringify({ id: "career_b2" }));
    git(["add", "public/data/career_b2.json"]);
    write(
      "src/lib/roomManifest.ts",
      manifestTs({
        intro_free: "data/intro_free.json",
        vip6_fi_5_mp3: "data/vip6_fi_5_mp3.json",
        career_b2: "data/career_b2.json",
      })
    );

    const r = runGuard();
    expect(r.status).toBe(0);
  });

  it("BLOCKS cross-contamination: parallel-agent delete not staged here", () => {
    // Reproduce the recon incident: another branch deleted this room in the
    // shared working tree; it is NOT staged in this (markdown-only) commit.
    fs.rmSync(path.join(repo, "public/data/vip6_fi_5_mp3.json"));
    write("NOTES.md", "memory edit only");
    git(["add", "NOTES.md"]);
    // regen drops the deleted room's key:
    write(
      "src/lib/roomManifest.ts",
      manifestTs({ intro_free: "data/intro_free.json" })
    );

    const r = runGuard();
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("vip6_fi_5_mp3.json");
    expect(r.stderr).toContain("Principle #13");
    expect(r.stderr).toContain("--no-verify");
    expect(r.stderr).toContain("git stash");
    expect(r.stderr).toContain("RECON-pre-commit-hook-audit.md");
  });

  it("passes a legitimate delete (git rm staged → delta explained)", () => {
    git(["rm", "-q", "public/data/vip6_fi_5_mp3.json"]);
    write(
      "src/lib/roomManifest.ts",
      manifestTs({ intro_free: "data/intro_free.json" })
    );

    const r = runGuard();
    expect(r.status).toBe(0);
  });

  it("passes a legitimate rename (both sides staged via git mv)", () => {
    git(["mv", "public/data/vip6_fi_5_mp3.json", "public/data/vip6_fi_5.json"]);
    write(
      "src/lib/roomManifest.ts",
      manifestTs({
        intro_free: "data/intro_free.json",
        vip6_fi_5: "data/vip6_fi_5.json",
      })
    );

    const r = runGuard();
    expect(r.status).toBe(0);
  });

  it("passes a content-only edit (no manifest delta at all)", () => {
    // The 32 `M vip6_*` retag case: content changes, filename unchanged,
    // manifest identical → zero delta → must not block.
    write(
      "public/data/vip6_fi_5_mp3.json",
      JSON.stringify({ id: "vip6_fi_5_mp3", tier: 6 })
    );
    git(["add", "public/data/vip6_fi_5_mp3.json"]);
    // manifest file untouched (regen would produce identical bytes)

    const r = runGuard();
    expect(r.status).toBe(0);
  });

  it("fails safe when HEAD manifest is present but unparseable", () => {
    git(["rm", "-q", "public/data/vip6_fi_5_mp3.json"]);
    // Corrupt the committed manifest by amending history is heavy; instead
    // re-commit a garbage manifest so HEAD has an unparseable one.
    write("src/lib/roomManifest.ts", "export const PUBLIC_ROOM_MANIFEST = ;\n");
    git(["add", "-A"]);
    git(["commit", "-qm", "corrupt manifest"]);
    // Now working tree regen produces a valid manifest.
    write(
      "src/lib/roomManifest.ts",
      manifestTs({ intro_free: "data/intro_free.json" })
    );

    const r = runGuard();
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("Could not parse HEAD");
  });
});
