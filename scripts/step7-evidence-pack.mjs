#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const REQUIRED_LIVE_ENV = [
  "STEP7_LIVE_AZURE_SMOKE",
  "VITE_AZURE_PHONEME_BATCH_ENABLED",
  "VITE_SUPABASE_URL",
];
const AUTH_ENV_GROUPS = [
  ["STEP7_SMOKE_USER_JWT"],
  ["STEP7_SMOKE_USER_EMAIL", "STEP7_SMOKE_USER_PASSWORD", "VITE_SUPABASE_ANON_KEY"],
  ["STEP7_SMOKE_USER_EMAIL", "STEP7_SMOKE_USER_PASSWORD", "SUPABASE_ANON_KEY"],
];
const DEFAULT_WAV = "src/lib/pronunciation/__fixtures__/step7-known-good-i-went-to-school-yesterday.wav";
const LIVE_TEST_NAME = "validates live Azure result shape and Speak rendering when local/dev env opts in";
const LOCAL_TEST_NAME = "keeps no-Azure fallback scoring, tone, and Speak display safe";
const NATIVE_EAR_CASES = [
  {
    caseId: "S7-001",
    targetText: "I went to school yesterday.",
    coverage: "clear speech baseline",
  },
  {
    caseId: "S7-002",
    targetText: "I went to school yesterday.",
    coverage: "VN-accented English",
  },
  {
    caseId: "S7-003",
    targetText: "Please finish the last task.",
    coverage: "weak final consonants",
  },
  {
    caseId: "S7-004",
    targetText: "Think about the weather.",
    coverage: "/th/ substitution",
  },
  {
    caseId: "S7-005",
    targetText: "This is the right answer.",
    coverage: "voiced /th/ substitution",
  },
  {
    caseId: "S7-006",
    targetText: "Ship and sheep sound different.",
    coverage: "vowel contrast",
  },
  {
    caseId: "S7-007",
    targetText: "I can leave at six.",
    coverage: "vowel plus final /v/ and /ks/",
  },
  {
    caseId: "S7-008",
    targetText: "Can you repeat that question?",
    coverage: "question intonation",
  },
  {
    caseId: "S7-009",
    targetText: "The meeting starts at three.",
    coverage: "consonant cluster plus /th/",
  },
  {
    caseId: "S7-010",
    targetText: "I went to school yesterday.",
    coverage: "poor audio or no-match control",
  },
];

function utcStamp() {
  return new Date().toISOString().replace(/[:.]/g, "").replace("Z", "Z");
}

function argValue(name) {
  const prefix = `${name}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : null;
}

function hasArg(name) {
  return process.argv.includes(name);
}

function envPresent(name) {
  return Boolean(process.env[name]?.trim());
}

function envPresenceRecord(name) {
  return { name, present: envPresent(name) };
}

function authReady() {
  return AUTH_ENV_GROUPS.some((group) => group.every(envPresent));
}

function redact(text) {
  return text
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[redacted_jwt]")
    .replace(/(anonKeyPrefix:\s*')[^']*(')/g, "$1[redacted]$2")
    .replace(/Bearer\s+[A-Za-z0-9._-]+/g, "Bearer [redacted]")
    .replace(/(STEP7_SMOKE_USER_PASSWORD=)[^\s]+/g, "$1[redacted]")
    .replace(/(STEP7_SMOKE_USER_JWT=)[^\s]+/g, "$1[redacted]")
    .replace(/(VITE_SUPABASE_ANON_KEY=)[^\s]+/g, "$1[redacted]")
    .replace(/(SUPABASE_ANON_KEY=)[^\s]+/g, "$1[redacted]");
}

function runVitest(testName) {
  const result = spawnSync(
    "npx",
    ["vitest", "run", "src/lib/pronunciation/__tests__/step7AzureSmoke.test.tsx", "-t", testName],
    {
      cwd: process.cwd(),
      env: process.env,
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 8,
    },
  );
  return {
    command: `npx vitest run src/lib/pronunciation/__tests__/step7AzureSmoke.test.tsx -t ${JSON.stringify(testName)}`,
    exitCode: result.status ?? 1,
    stdout: redact(result.stdout ?? ""),
    stderr: redact(result.stderr ?? ""),
  };
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function writeText(path, value) {
  writeFileSync(path, value);
}

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function csvRow(values) {
  return values.map(csvCell).join(",");
}

const validationId = argValue("--validation-id") ?? `real-run-${utcStamp()}`;
const outDir = resolve(argValue("--out") ?? join("reports", "ladder", "step7-evidence", validationId));
const runLocalSmoke = hasArg("--local-smoke");
const runLiveAzure = hasArg("--run-live-azure");
const wavPath = resolve(process.env.STEP7_SMOKE_WAV_PATH || DEFAULT_WAV);

mkdirSync(outDir, { recursive: true });

const generatedAt = new Date().toISOString();
const envPresence = [
  ...REQUIRED_LIVE_ENV.map(envPresenceRecord),
  { name: "STEP7_SMOKE_USER_JWT", present: envPresent("STEP7_SMOKE_USER_JWT") },
  { name: "STEP7_SMOKE_USER_EMAIL", present: envPresent("STEP7_SMOKE_USER_EMAIL") },
  { name: "STEP7_SMOKE_USER_PASSWORD", present: envPresent("STEP7_SMOKE_USER_PASSWORD") },
  { name: "VITE_SUPABASE_ANON_KEY", present: envPresent("VITE_SUPABASE_ANON_KEY") },
  { name: "SUPABASE_ANON_KEY", present: envPresent("SUPABASE_ANON_KEY") },
  { name: "STEP7_SMOKE_WAV_PATH", present: envPresent("STEP7_SMOKE_WAV_PATH") },
];

const preconditions = {
  generatedAt,
  validationId,
  wavFixture: {
    path: wavPath,
    exists: existsSync(wavPath),
    bytes: existsSync(wavPath) ? readFileSync(wavPath).byteLength : null,
  },
  envPresence,
  liveAzurePreconditionsReady:
    REQUIRED_LIVE_ENV.every(envPresent) &&
    process.env.STEP7_LIVE_AZURE_SMOKE === "true" &&
    process.env.VITE_AZURE_PHONEME_BATCH_ENABLED === "true" &&
    authReady() &&
    existsSync(wavPath),
  authReady: authReady(),
  notes: [
    "Presence only. Values are intentionally not written.",
    "A passing local smoke is readiness evidence only; it is not real Azure or native-ear evidence.",
  ],
};
writeJson(join(outDir, "preflight.json"), preconditions);

const runs = [];
if (runLocalSmoke) {
  const localRun = runVitest(LOCAL_TEST_NAME);
  runs.push({ kind: "local_no_azure_smoke", ...localRun });
  writeText(join(outDir, "local-smoke.log"), `${localRun.command}\nexitCode=${localRun.exitCode}\n\nSTDOUT\n${localRun.stdout}\n\nSTDERR\n${localRun.stderr}`);
}

let liveStatus = "not_run";
if (runLiveAzure) {
  if (!preconditions.liveAzurePreconditionsReady) {
    liveStatus = "blocked_missing_preconditions";
    writeText(
      join(outDir, "live-azure-smoke.log"),
      [
        `generated_at=${generatedAt}`,
        "requested_command=node scripts/step7-evidence-pack.mjs --run-live-azure --local-smoke",
        "result=blocked_missing_preconditions",
        "BLOCKED: live Azure smoke was requested, but preflight liveAzurePreconditionsReady=false. No live request was sent.",
        "",
        "Preflight presence snapshot; values are intentionally not written:",
        ...preconditions.envPresence.map((entry) => `${entry.name}=${entry.present ? "present" : "missing"}`),
        `authReady=${preconditions.authReady}`,
        `wavFixtureExists=${preconditions.wavFixture.exists}`,
        `wavFixtureBytes=${preconditions.wavFixture.bytes ?? "null"}`,
        "",
      ].join("\n"),
    );
  } else {
    const liveRun = runVitest(LIVE_TEST_NAME);
    runs.push({ kind: "live_azure_smoke", ...liveRun });
    writeText(join(outDir, "live-azure-smoke.log"), `${liveRun.command}\nexitCode=${liveRun.exitCode}\n\nSTDOUT\n${liveRun.stdout}\n\nSTDERR\n${liveRun.stderr}`);
    liveStatus = liveRun.exitCode === 0 ? "passed" : "failed";
  }
}

const manifest = {
  schemaVersion: 1,
  validationId,
  generatedAt,
  status: liveStatus === "passed" ? "azure_evidence_captured_review_required" : "blocked_or_ready_for_manual_steps",
  artifacts: {
    preflight: "preflight.json",
    localSmokeLog: runLocalSmoke ? "local-smoke.log" : null,
    liveAzureSmokeLog: runLiveAzure ? "live-azure-smoke.log" : null,
    nativeEarPacket: "native-ear-review-packet.md",
    nativeEarScoringCsv: "native-ear-scores.csv",
    ownerAcceptance: "owner-acceptance.md",
    operatorChecklist: "operator-checklist.md",
  },
  validationStatus: {
    localSmokePassed: runs.some((run) => run.kind === "local_no_azure_smoke" && run.exitCode === 0),
    liveAzureSmokeRequested: runLiveAzure,
    liveAzurePreconditionsReady: preconditions.liveAzurePreconditionsReady,
    liveAzureSmokeStatus: liveStatus,
    nativeEarEvidenceAttached: false,
    step7Complete: false,
  },
  blockers: [
    ...(liveStatus === "passed" ? [] : ["blocked-by-owner: real Azure pronunciation-assessment evidence is not yet captured in this pack; provide approved live-smoke target, Azure-enabled dashboard/runtime settings, and smoke-user access."]),
    "blocked-by-owner: native-ear validation evidence is not yet attached; provide reviewer assignments and completed reviewer scores.",
    "blocked-by-owner: human owner acceptance is still required before any Step 7 completion claim.",
  ],
};
writeJson(join(outDir, "manifest.json"), manifest);

const nativeEarCsvHeader = [
  "case_id",
  "coverage_target",
  "target_text",
  "audio_artifact",
  "azure_log_reference",
  "azure_mode",
  "azure_provider",
  "azure_overall_score",
  "azure_phoneme_count",
  "learner_feedback_summary",
  "native_reviewer_id",
  "native_reviewer_role",
  "review_date_utc",
  "native_overall_1_5",
  "feedback_accuracy_1_5",
  "register_politeness_1_5",
  "learner_safety_1_5",
  "verdict",
  "notes",
];
writeText(join(outDir, "native-ear-scores.csv"), [
  csvRow(nativeEarCsvHeader),
  ...NATIVE_EAR_CASES.map((testCase) => csvRow([
    testCase.caseId,
    testCase.coverage,
    testCase.targetText,
    "ATTACH_REDACTED_AUDIO_OR_REFERENCE",
    "live-azure-smoke.log",
    "ATTACH_FROM_LIVE_AZURE_LOG",
    "ATTACH_FROM_LIVE_AZURE_LOG",
    "ATTACH",
    "ATTACH",
    "ATTACH_LEARNER_FACING_FEEDBACK_TEXT_OR_SUMMARY",
    "REVIEWER_ID",
    "native English reviewer",
    "YYYY-MM-DDTHH:MM:SSZ",
    "",
    "",
    "",
    "",
    "pending",
    "Do not fill until a real reviewer scores this case against real Azure output.",
  ])),
].join("\n") + "\n");

writeText(join(outDir, "native-ear-review-packet.md"), `# Step 7 Native-Ear Review Packet

validation_id=${validationId}
generated_at=${generatedAt}

## Instructions For Reviewer

- Review only the attached real smoke cases and Azure outputs.
- Do not infer results from fixtures, unit tests, or agent summaries.
- Score whether the learner-facing feedback is accurate, kind, and useful.
- Mark any overclaim as fail, especially phoneme or tone claims not supported by evidence.

## Required Minimum Evidence

- At least 2 native-ear reviewers for the first closeout pass.
- Complete all 10 prepared rows in native-ear-scores.csv, covering clear speech, VN-accented English, weak final consonants, /th/ substitutions, vowels, question intonation, and one no-match or poor-audio case.
- Reviewer date, role, rubric scores, and notes preserved in native-ear-scores.csv.

## Pass Rule

Step 7 remains incomplete unless:

- Live Azure smoke has passed with provider=azure, mode=azure_phoneme_batch, and phoneme evidence.
- Native-ear reviewers agree the feedback is accurate and learner-safe.
- Any disagreement or unsafe wording is fixed or explicitly waived by the owner.
`);

writeText(join(outDir, "owner-acceptance.md"), `# Step 7 Owner Acceptance

validation_id=${validationId}
generated_at=${generatedAt}
status=blocked-by-owner

## Non-Closure Statement

Step 7 is not closed by this artifact unless all required evidence below is attached and accepted by the owner.

## Required Evidence Before Acceptance

- [ ] \`manifest.json\` reports \`liveAzureSmokeStatus=passed\`.
- [ ] \`live-azure-smoke.log\` proves the real Azure path ran with provider=azure, mode=azure_phoneme_batch, and nonzero phoneme evidence.
- [ ] \`native-ear-scores.csv\` is completed by real native-ear reviewer(s), not generated or inferred.
- [ ] Reviewer disagreements, unsafe wording, or overclaims are fixed or explicitly waived.
- [ ] Owner signs off on this exact validation ID.

## Current Acceptance

owner_acceptance_status=not_accepted
owner_name=
owner_acceptance_date_utc=
owner_notes=Blocked until real Azure evidence and real native-ear review are attached.
`);

writeText(join(outDir, "operator-checklist.md"), `# Step 7 Operator Checklist

validation_id=${validationId}
generated_at=${generatedAt}

## Before Running Live Azure Smoke

- [ ] Use a staging or explicitly approved production target.
- [ ] Confirm no secret values will be pasted into reports.
- [ ] Confirm STEP7_LIVE_AZURE_SMOKE=true.
- [ ] Confirm VITE_AZURE_PHONEME_BATCH_ENABLED=true.
- [ ] Confirm VITE_SUPABASE_URL is set.
- [ ] Provide either STEP7_SMOKE_USER_JWT or smoke-user email/password plus Supabase anon key.
- [ ] Confirm the smoke WAV exists and is approved for this validation.

## Commands

Local readiness only:

\`\`\`bash
node scripts/step7-evidence-pack.mjs --local-smoke
\`\`\`

Live Azure evidence capture:

\`\`\`bash
node scripts/step7-evidence-pack.mjs --run-live-azure --local-smoke
\`\`\`

## Evidence Review

- [ ] manifest.json says liveAzureSmokeStatus=passed.
- [ ] live-azure-smoke.log contains no secret values.
- [ ] live-azure-smoke.log proves provider=azure or mode=azure_phoneme_batch and nonzero phoneme evidence through the harness result.
- [ ] native-ear-scores.csv is completed by real reviewer(s).
- [ ] Owner accepts the evidence before any Step 7 completion claim.
`);

console.log(`Step 7 evidence pack written: ${outDir}`);
console.log(`status=${manifest.status}`);
console.log(`liveAzurePreconditionsReady=${preconditions.liveAzurePreconditionsReady}`);
console.log(`liveAzureSmokeStatus=${liveStatus}`);
