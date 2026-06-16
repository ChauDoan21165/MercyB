#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const packetDir = join(root, "reports", "ladder", "step20-human-rater-benchmark");

const requiredFiles = [
  join(root, "reports", "ladder", "step20-real-human-rater-benchmark.md"),
  join(packetDir, "sample-packet.md"),
  join(packetDir, "rater-score-sheet-template.csv"),
  join(packetDir, "completed-score-sheets.csv"),
  join(packetDir, "pass-fail-calculation.md"),
  join(packetDir, "owner-acceptance.md"),
];

const expectedHeader = [
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

const scenarioIds = new Set(Array.from({ length: 12 }, (_, index) => `S${String(index + 1).padStart(2, "0")}`));
const scoreColumns = [
  "pedagogical_correctness_1_to_5",
  "vn_en_specificity_1_to_5",
  "communicative_usefulness_1_to_5",
  "tutor_warmth_1_to_5",
  "safety_honesty_1_to_5",
  "real_session_continuity_1_to_5",
];
const yesNoColumns = [
  "conflict_of_interest",
  "consent_confirmed",
  "privacy_consent_issue_yes_no",
  "register_politeness_issue_yes_no",
  "critical_failure_yes_no",
];
const allowedVerdicts = new Set(["pass", "partial", "fail", "critical_fail"]);
const placeholderPattern = /\b(?:fake|synthetic|invented|placeholder|tbd|todo|sample|model-self-rating)\b/i;

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function readRequired(path) {
  try {
    return readFileSync(path, "utf8");
  } catch (error) {
    fail(`missing required file: ${path}`);
    return "";
  }
}

function csvRows(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function assertCsvHeader(path) {
  const rows = csvRows(readRequired(path));
  const header = rows[0]?.split(",") ?? [];
  if (header.join(",") !== expectedHeader.join(",")) {
    fail(`unexpected CSV header in ${path}`);
  }
  return rows.slice(1);
}

function parseCsvLine(line, path, lineNumber) {
  const cells = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(cell);
      cell = "";
      continue;
    }

    cell += char;
  }

  if (inQuotes) {
    fail(`unterminated quoted CSV field in ${path}:${lineNumber}`);
  }

  cells.push(cell);
  return cells;
}

function parseCompletedRows(path) {
  const rows = csvRows(readRequired(path));
  const header = rows[0]?.split(",") ?? [];
  const dataRows = rows.slice(1);

  return dataRows.map((line, index) => {
    const cells = parseCsvLine(line, path, index + 2);
    if (cells.length !== header.length) {
      fail(`CSV row has ${cells.length} fields, expected ${header.length} in ${path}:${index + 2}`);
    }

    return Object.fromEntries(header.map((column, cellIndex) => [column, cells[cellIndex]?.trim() ?? ""]));
  });
}

function assertNoClosedClaimWithoutRatings(text, path, completedRows) {
  const forbiddenClosedClaims = [
    /\bStatus:\s*evidence-closed\b/i,
    /\bEvidence state:\s*evidence-closed\b/i,
    /\bStep 20 benchmark status:\s*passed\b/i,
    /\bResult:\s*pass(?:ed)?\b/i,
    /\bDecision:\s*accept_step20_closeout\b/i,
  ];
  if (completedRows.length < 72) {
    for (const pattern of forbiddenClosedClaims) {
      if (pattern.test(text)) {
        fail(`forbidden closed/pass claim without 72 completed real rows in ${path}`);
      }
    }
  }
}

function assertReadyOrBlockedState(text, path, completedRows) {
  if (completedRows.length >= 72) {
    return;
  }
  if (!/\bblocked_by_owner\b|\bblocked_pending_real_ratings\b|\bbenchmark-ready\b/i.test(text)) {
    fail(`missing benchmark-ready or owner-blocked state in ${path}`);
  }
}

function assertCompletedRowsAreCalculable(rows) {
  if (rows.length === 0) {
    return;
  }

  const raterIds = new Set();
  const scenarioSystemRaters = new Map();
  const scenarioSystems = new Map();

  rows.forEach((row, index) => {
    const rowLabel = `completed-score-sheets.csv:${index + 2}`;
    for (const column of expectedHeader) {
      if (!row[column]) {
        fail(`missing ${column} in ${rowLabel}`);
      }
    }

    if (!scenarioIds.has(row.scenario_id)) {
      fail(`unexpected scenario_id ${row.scenario_id || "<blank>"} in ${rowLabel}`);
    }

    if (placeholderPattern.test(Object.values(row).join(" "))) {
      fail(`placeholder or synthetic marker found in ${rowLabel}`);
    }

    if (!/^\S{2,64}$/.test(row.rater_id)) {
      fail(`rater_id must be an owner-assigned opaque nonblank ID in ${rowLabel}`);
    }

    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(row.rated_at_utc)) {
      fail(`rated_at_utc must be ISO-8601 UTC in ${rowLabel}`);
    }

    for (const column of scoreColumns) {
      if (!/^[1-5]$/.test(row[column])) {
        fail(`${column} must be a whole number from 1 to 5 in ${rowLabel}`);
      }
    }

    for (const column of yesNoColumns) {
      if (!/^(yes|no)(?:\b|:|-)/i.test(row[column])) {
        fail(`${column} must start with yes or no in ${rowLabel}`);
      }
    }

    if (!allowedVerdicts.has(row.verdict_pass_partial_fail_critical_fail)) {
      fail(`invalid verdict ${row.verdict_pass_partial_fail_critical_fail || "<blank>"} in ${rowLabel}`);
    }

    if (/^yes\b/i.test(row.critical_failure_yes_no) && row.verdict_pass_partial_fail_critical_fail !== "critical_fail") {
      fail(`critical_failure_yes_no=yes requires verdict critical_fail in ${rowLabel}`);
    }

    raterIds.add(row.rater_id);

    const scenarioSystem = `${row.scenario_id}|${row.system_label_blinded}`;
    if (!scenarioSystemRaters.has(scenarioSystem)) {
      scenarioSystemRaters.set(scenarioSystem, new Set());
    }
    scenarioSystemRaters.get(scenarioSystem).add(row.rater_id);

    if (!scenarioSystems.has(row.scenario_id)) {
      scenarioSystems.set(row.scenario_id, new Set());
    }
    scenarioSystems.get(row.scenario_id).add(row.system_label_blinded);
  });

  if (raterIds.size < 3) {
    fail(`completed score sheet has ${raterIds.size} independent raters; Step 20 needs at least 3`);
  }

  for (const scenarioId of scenarioIds) {
    const systems = scenarioSystems.get(scenarioId) ?? new Set();
    if (systems.size < 2) {
      fail(`${scenarioId} has ${systems.size} blinded systems; Step 20 needs 2`);
    }

    for (const systemLabel of systems) {
      const raters = scenarioSystemRaters.get(`${scenarioId}|${systemLabel}`) ?? new Set();
      if (raters.size < 3) {
        fail(`${scenarioId}/${systemLabel} has ${raters.size} raters; Step 20 needs 3`);
      }
    }
  }
}

for (const path of requiredFiles) {
  readRequired(path);
}

assertCsvHeader(join(packetDir, "rater-score-sheet-template.csv"));
const completedRows = assertCsvHeader(join(packetDir, "completed-score-sheets.csv"));
const completedRecords = parseCompletedRows(join(packetDir, "completed-score-sheets.csv"));

for (const path of requiredFiles.filter((path) => path.endsWith(".md"))) {
  const text = readRequired(path);
  assertNoClosedClaimWithoutRatings(text, path, completedRows);
  assertReadyOrBlockedState(text, path, completedRows);
}

const passFail = readRequired(join(packetDir, "pass-fail-calculation.md"));
const ownerAcceptance = readRequired(join(packetDir, "owner-acceptance.md"));

if (completedRows.length === 0) {
  if (!/Result:\s*blocked_by_owner_missing_real_ratings/i.test(passFail)) {
    fail("pass-fail calculation must explicitly block on missing real ratings");
  }
  if (!/Decision:\s*blocked_pending_real_ratings/i.test(ownerAcceptance)) {
    fail("owner acceptance must explicitly block on missing real ratings");
  }
}

if (completedRows.length > 0 && completedRows.length < 72) {
  fail(`partial completed score sheet has ${completedRows.length} rows; Step 20 needs at least 72 rows`);
}

assertCompletedRowsAreCalculable(completedRecords);

if (process.exitCode) {
  process.exit();
}

const status =
  completedRows.length >= 72 ? "status=completed_rows_attached_recalculate_required" : "status=blocked_by_owner_missing_real_ratings";
console.log(status);
console.log(`completed_rows=${completedRows.length}`);
