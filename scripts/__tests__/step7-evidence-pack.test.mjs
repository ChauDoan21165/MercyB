import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const TMP_ROOTS = [];

function makeTempDir() {
  const dir = mkdtempSync(join(tmpdir(), "step7-evidence-pack-"));
  TMP_ROOTS.push(dir);
  return dir;
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

afterEach(() => {
  for (const dir of TMP_ROOTS.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("step7-evidence-pack", () => {
  it("writes the required blocked real-run packet shape without live Azure secrets", () => {
    const outDir = makeTempDir();
    const result = spawnSync(
      "node",
      [
        "scripts/step7-evidence-pack.mjs",
        "--validation-id=real-run-shape-test",
        `--out=${outDir}`,
        "--run-live-azure",
      ],
      {
        cwd: process.cwd(),
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
        },
        encoding: "utf8",
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain(`Step 7 evidence pack written: ${outDir}`);
    expect(result.stdout).toContain("liveAzurePreconditionsReady=false");
    expect(result.stdout).toContain("liveAzureSmokeStatus=blocked_missing_preconditions");

    const manifest = readJson(join(outDir, "manifest.json"));
    expect(manifest.validationId).toBe("real-run-shape-test");
    expect(manifest.status).toBe("blocked_or_ready_for_manual_steps");
    expect(manifest.artifacts).toMatchObject({
      liveAzureSmokeLog: "live-azure-smoke.log",
      nativeEarScoringCsv: "native-ear-scores.csv",
      ownerAcceptance: "owner-acceptance.md",
    });
    expect(manifest.validationStatus).toMatchObject({
      liveAzureSmokeRequested: true,
      liveAzurePreconditionsReady: false,
      liveAzureSmokeStatus: "blocked_missing_preconditions",
      nativeEarEvidenceAttached: false,
      step7Complete: false,
    });
    expect(manifest.blockers.join("\n")).toContain("blocked-by-owner");

    const liveAzureLog = readFileSync(join(outDir, "live-azure-smoke.log"), "utf8");
    expect(liveAzureLog).toContain("result=blocked_missing_preconditions");
    expect(liveAzureLog).toContain("No live request was sent.");
    expect(liveAzureLog).toContain("STEP7_LIVE_AZURE_SMOKE=missing");
    expect(liveAzureLog).toContain("authReady=false");

    const nativeEarScores = readFileSync(join(outDir, "native-ear-scores.csv"), "utf8");
    const nativeEarLines = nativeEarScores.trimEnd().split("\n");
    expect(nativeEarLines).toHaveLength(11);
    expect(nativeEarLines[0]).toContain("coverage_target");
    expect(nativeEarLines[0]).toContain("learner_feedback_summary");
    expect(nativeEarScores).toContain("S7-010");
    expect(nativeEarScores).toContain("poor audio or no-match control");
    expect(nativeEarScores).toContain("Do not fill until a real reviewer scores this case");
    expect(readFileSync(join(outDir, "owner-acceptance.md"), "utf8")).toContain(
      "owner_acceptance_status=not_accepted",
    );
  });
});
