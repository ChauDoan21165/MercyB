import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { afterEach, describe, expect, it } from "vitest";

const TMP_ROOTS = [];
const scriptPath = resolve("scripts/verify-step20-human-rater-benchmark.mjs");
const header = [
  "run_id",
  "scenario_id",
  "system_label_blinded",
  "rater_id",
  "rater_role",
  "relevant_qualification",
  "rater_vietnamese_proficiency",
  "rater_english_proficiency",
  "conflict_of_interest",
  "consent_confirmed",
  "rated_at_utc",
  "pedagogical_correctness_1_to_5",
  "vn_en_specificity_1_to_5",
  "communicative_usefulness_1_to_5",
  "tutor_warmth_1_to_5",
  "safety_honesty_1_to_5",
  "real_session_continuity_1_to_5",
  "privacy_consent_issue_yes_no",
  "register_politeness_issue_yes_no",
  "critical_failure_yes_no",
  "critical_failure_type",
  "verdict_pass_partial_fail_critical_fail",
  "notes",
  "evidence_ref",
];

function makeTempRoot() {
  const dir = mkdtempSync(join(tmpdir(), "step20-human-rater-"));
  TMP_ROOTS.push(dir);
  return dir;
}

function writeFile(root, relativePath, content) {
  const path = join(root, relativePath);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
}

function baseDocs(status = "blocked") {
  const blockedDoc = [
    "# Step 20",
    "Status: blocked_by_owner",
    "Evidence state: benchmark-ready, not evidence-closed",
    "Result: blocked_by_owner_missing_real_ratings",
    "Decision: blocked_pending_real_ratings",
  ].join("\n");

  const closedDoc = [
    "# Step 20",
    "Status: evidence-closed",
    "Evidence state: evidence-closed",
    "Step 20 benchmark status: passed",
    "Result: passed",
    "Decision: accept_step20_closeout",
  ].join("\n");

  return status === "closed" ? closedDoc : blockedDoc;
}

function writePacket(root, { docsStatus = "blocked", completedRows = "" } = {}) {
  const doc = baseDocs(docsStatus);
  writeFile(root, "reports/ladder/step20-real-human-rater-benchmark.md", doc);
  writeFile(root, "reports/ladder/step20-human-rater-benchmark/sample-packet.md", doc);
  writeFile(root, "reports/ladder/step20-human-rater-benchmark/pass-fail-calculation.md", doc);
  writeFile(root, "reports/ladder/step20-human-rater-benchmark/owner-acceptance.md", doc);
  writeFile(root, "reports/ladder/step20-human-rater-benchmark/rater-score-sheet-template.csv", `${header.join(",")}\n`);
  writeFile(
    root,
    "reports/ladder/step20-human-rater-benchmark/completed-score-sheets.csv",
    `${header.join(",")}\n${completedRows}`,
  );
}

function runVerifier(root) {
  return spawnSync("node", [scriptPath], {
    cwd: root,
    encoding: "utf8",
  });
}

afterEach(() => {
  for (const dir of TMP_ROOTS.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

describe("verify-step20-human-rater-benchmark", () => {
  it("keeps the benchmark owner-blocked when completed score sheets are empty", () => {
    const root = makeTempRoot();
    writePacket(root);

    const result = runVerifier(root);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("status=blocked_by_owner_missing_real_ratings");
    expect(result.stdout).toContain("completed_rows=0");
  });

  it("rejects evidence-closed claims without real completed score rows", () => {
    const root = makeTempRoot();
    writePacket(root, { docsStatus: "closed" });

    const result = runVerifier(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("forbidden closed/pass claim without 72 completed real rows");
  });

  it("rejects any partial non-empty completed score sheet before Step 20 pass calculation", () => {
    const root = makeTempRoot();
    writePacket(root, { completedRows: `${",".repeat(header.length - 1)}\n` });

    const result = runVerifier(root);

    expect(result.status).toBe(1);
    expect(result.stderr).toContain("partial completed score sheet has 1 rows");
  });
});
