#!/usr/bin/env node
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import process from "node:process";
import {
  SYNTHETIC_USER_ID_PREFIX,
  extractPhonemeScores,
} from "./report.mjs";

const OWNER_GATED_FLAGS = {
  conversationCapture: [
    {
      flag: "VITE_LEARNING_CAPTURE_ENABLED",
      source: "src/lib/featureFlags.ts:186",
      producer: "src/lib/conversationCapture/conversationCapture.ts:89",
      note: "Conversation capture callers must be gated on learner consent plus LEARNING_CAPTURE_ENABLED; do not flip in code.",
    },
  ],
  detectorProvenance: [
    {
      flag: "VITE_TUTOR_PREDICTION_CAPTURE_ENABLED",
      source: "src/lib/featureFlags.ts:64",
      producer: "src/lib/tm-int/pred/sink.ts:85",
      note: "Prediction/surprise detector events drain only when the owner flips this shadow-mode flag.",
    },
    {
      flag: "learning_events producer",
      source: "supabase/migrations/20260708000000_learning_events.sql:24",
      producer: "src/lib/tm-int/pred/sink.ts:49",
      note: "Feedback/correction-class learning_events rows must carry rule_or_detector_id.",
    },
  ],
  phonemeScores: [
    {
      flag: "VITE_SPEECH_PERSISTENCE_ENABLED",
      source: "src/lib/featureFlags.ts:145",
      producer: "src/services/speechAttempts.ts:94",
      note: "Client speech persistence stores attempts but local rows do not include per-phoneme detail.",
    },
    {
      flag: "Azure phoneme scoring path enabled for the test account",
      source: "supabase/functions/azure-phoneme/index.ts:85",
      producer: "supabase/functions/azure-phoneme/index.ts:87",
      note: "Cloud phoneme rows write speech_attempts.phoneme_scores.",
    },
  ],
  cohortTag: [
    {
      flag: "feature_flags.enabled_user_ids contains the test user",
      source: "supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql:15",
      producer: "src/services/featureFlagsAdmin.ts:54",
      note: "Add the test account to the owner-selected cohort flag; no application flag default changes are needed.",
    },
  ],
  syntheticExclusion: [
    {
      flag: "profiles.is_synthetic is false for the test account",
      source: "supabase/migrations/20260710120000_synthetic_user_exclusion.sql:25",
      producer: "supabase/migrations/20260710120000_synthetic_user_exclusion.sql:33",
      note: "Real test accounts must not use the reserved 63e289e1- prefix and must not be marked synthetic.",
    },
  ],
};

const DEFAULT_OUT_JSON = "reports/cohort/preflight.json";
const DEFAULT_OUT_MD = "reports/cohort/preflight.md";
const DEFAULT_PHONEMES = ["θ", "ð", "ʃ", "tʃ", "dʒ", "ʒ", "z", "v", "r", "l"];

function usage() {
  return `Usage:
  node scripts/cohort/preflight.mjs \\
    --user-id 00000000-0000-4000-8000-000000000000 \\
    --start 2026-07-12T00:00:00Z --end 2026-07-12T23:59:59Z \\
    --cohort-tag diagnostic_contact_gate_pilot \\
    --out-json reports/cohort/preflight.json \\
    --out-md reports/cohort/preflight.md

Options:
  --user-id       Designated test account UUID.
  --start/end     ISO date or timestamp window. End is exclusive.
  --cohort-tag    Optional feature_flags.flag_key expected to contain user_id.
  --phonemes      Optional comma-separated target phoneme list.
  --out-json      JSON output path.
  --out-md        Markdown output path.

Environment:
  SUPABASE_URL or VITE_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY

This script performs read-only Supabase REST GETs and writes local artifacts only.
`;
}

export function parseArgs(argv) {
  const out = {
    userId: null,
    start: null,
    end: null,
    cohortTag: null,
    phonemes: DEFAULT_PHONEMES,
    outJson: DEFAULT_OUT_JSON,
    outMd: DEFAULT_OUT_MD,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === "--help") return { help: true };
    if (!flag.startsWith("--")) throw new Error(`Unknown argument: ${flag}`);
    if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
    i += 1;

    if (flag === "--user-id") out.userId = normalizeUserId(value);
    else if (flag === "--start") out.start = value.trim();
    else if (flag === "--end") out.end = value.trim();
    else if (flag === "--cohort-tag") out.cohortTag = value.trim();
    else if (flag === "--phonemes") out.phonemes = splitCsv(value);
    else if (flag === "--out-json") out.outJson = value.trim();
    else if (flag === "--out-md") out.outMd = value.trim();
    else throw new Error(`Unknown argument: ${flag}`);
  }

  if (!out.userId) throw new Error("--user-id is required");
  validateDate(out.start, "--start");
  validateDate(out.end, "--end");
  if (Date.parse(out.end) <= Date.parse(out.start)) throw new Error("--end must be after --start");
  if (out.phonemes.length === 0) throw new Error("--phonemes cannot be empty");
  return out;
}

export function evaluatePreflight({ userId, start, end, cohortTag = null, phonemes = DEFAULT_PHONEMES, rows }) {
  const conversations = rows.conversations ?? [];
  const conversationEvents = rows.conversationEvents ?? [];
  const learningEvents = rows.learningEvents ?? [];
  const speechAttempts = rows.speechAttempts ?? [];
  const featureFlags = rows.featureFlags ?? [];
  const profileRows = rows.profiles ?? [];

  const turnRows = conversationEvents.filter((row) => row.event_type === "turn_completed");
  const conversationTurnCount = conversations.reduce((sum, row) => sum + safeInteger(row.turn_count), 0);
  const conversationPass = conversationTurnCount > 0 || turnRows.length > 0;

  const provenanceRows = learningEvents.filter((row) => (
    isFeedbackOrCorrectionEvent(row.event_type) && typeof row.rule_or_detector_id === "string" && row.rule_or_detector_id.trim()
  ));

  const phonemeRows = speechAttempts
    .map((row) => ({
      row,
      phonemes: extractPhonemeScores(row.phoneme_scores, phonemes),
    }))
    .filter((item) => item.phonemes.length > 0);

  const cohortRows = featureFlags.filter((row) => {
    if (cohortTag && row.flag_key !== cohortTag) return false;
    return Array.isArray(row.enabled_user_ids)
      && row.enabled_user_ids.map((id) => String(id).toLowerCase()).includes(userId);
  });

  const profile = profileRows.find((row) => String(row.id ?? "").toLowerCase() === userId) ?? null;
  const hasSyntheticPrefix = userId.startsWith(SYNTHETIC_USER_ID_PREFIX);
  const markedSynthetic = profile?.is_synthetic === true;
  const syntheticPass = !hasSyntheticPrefix && Boolean(profile) && !markedSynthetic;

  const checks = [
    makeCheck({
      id: "conversation_turn_capture",
      label: "conversation-turn capture present",
      pass: conversationPass,
      evidence: {
        conversations: conversations.slice(0, 5).map(pickConversationEvidence),
        turn_completed_events: turnRows.slice(0, 5).map(pickConversationEventEvidence),
        conversation_turn_count: conversationTurnCount,
      },
      fail: OWNER_GATED_FLAGS.conversationCapture,
    }),
    makeCheck({
      id: "detector_provenance_events",
      label: "detector-provenance events present",
      pass: provenanceRows.length > 0,
      evidence: {
        rows: provenanceRows.slice(0, 10).map(pickLearningEventEvidence),
        feedback_or_correction_rows: learningEvents.filter((row) => isFeedbackOrCorrectionEvent(row.event_type)).length,
      },
      fail: OWNER_GATED_FLAGS.detectorProvenance,
    }),
    makeCheck({
      id: "phoneme_score_rows",
      label: "phoneme-score rows present",
      pass: phonemeRows.length > 0,
      evidence: {
        rows: phonemeRows.slice(0, 10).map((item) => ({
          id: item.row.id ?? null,
          attempted_at: item.row.attempted_at ?? item.row.created_at ?? null,
          provider: item.row.provider ?? null,
          phoneme_samples: item.phonemes.slice(0, 10),
        })),
        speech_attempt_rows: speechAttempts.length,
      },
      fail: OWNER_GATED_FLAGS.phonemeScores,
    }),
    makeCheck({
      id: "cohort_tag_resolves",
      label: "cohort-tag mechanism resolves",
      pass: cohortRows.length > 0,
      evidence: {
        requested_cohort_tag: cohortTag,
        matching_flags: cohortRows.slice(0, 10).map((row) => ({
          flag_key: row.flag_key,
          is_enabled: row.is_enabled ?? null,
          enabled_user_count: Array.isArray(row.enabled_user_ids) ? row.enabled_user_ids.length : 0,
          contains_user: true,
        })),
        scanned_flags: featureFlags.length,
      },
      fail: OWNER_GATED_FLAGS.cohortTag,
    }),
    makeCheck({
      id: "synthetic_exclusion_verified",
      label: "synthetic exclusion verified",
      pass: syntheticPass,
      evidence: {
        user_id_prefix: userId.slice(0, SYNTHETIC_USER_ID_PREFIX.length),
        reserved_prefix: SYNTHETIC_USER_ID_PREFIX,
        has_reserved_prefix: hasSyntheticPrefix,
        profile: profile ? { id: profile.id, is_synthetic: profile.is_synthetic } : null,
      },
      fail: OWNER_GATED_FLAGS.syntheticExclusion,
    }),
  ];

  return {
    generated_at: new Date().toISOString(),
    user_id: userId,
    window: { start, end },
    cohort_tag: cohortTag,
    overall_status: checks.every((check) => check.status === "PASS") ? "PASS" : "FAIL",
    checks,
    runbook: buildOwnerRunbook({ userId, start, end, cohortTag }),
  };
}

export function renderMarkdown(report) {
  const lines = [
    "# Cohort Capture Preflight",
    "",
    `Generated: ${report.generated_at}`,
    `User: ${report.user_id}`,
    `Window: ${report.window.start} to ${report.window.end} (end exclusive)`,
    `Cohort tag: ${report.cohort_tag ?? "any feature_flags.enabled_user_ids match"}`,
    `Overall: ${report.overall_status}`,
    "",
    "## Checks",
    "",
    "| Check | Status | Evidence summary |",
    "| --- | --- | --- |",
  ];

  for (const check of report.checks) {
    lines.push(`| ${check.label} | ${check.status} | ${summarizeEvidence(check)} |`);
  }

  lines.push("", "## Failure Guidance", "");
  for (const check of report.checks.filter((item) => item.status === "FAIL")) {
    lines.push(`### ${check.label}`, "");
    for (const item of check.fail_guidance) {
      lines.push(`- ${item.flag}: ${item.note} Source: ${item.source}; producer: ${item.producer}.`);
    }
    lines.push("");
  }
  if (report.checks.every((item) => item.status === "PASS")) {
    lines.push("- None. All capture preflight checks passed.", "");
  }

  lines.push("## Owner Runbook", "");
  for (const [index, step] of report.runbook.steps.entries()) {
    lines.push(`${index + 1}. ${step}`);
  }
  lines.push("", "### Test Account Session Script", "");
  for (const [index, step] of report.runbook.test_account_session_script.entries()) {
    lines.push(`${index + 1}. ${step}`);
  }
  lines.push("", "### Preflight Command", "", "```sh", report.runbook.preflight_command, "```", "");
  lines.push("### Expected PASS Output", "", "```text", report.runbook.expected_pass_output, "```", "");
  lines.push("## Row-Level Evidence", "", "```json", JSON.stringify(report.checks, null, 2), "```", "");
  return `${lines.join("\n")}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(usage());
    return;
  }

  const env = readEnv();
  const client = createSupabaseRestClient(env);
  const rows = await fetchPreflightRows(client, args);
  const report = evaluatePreflight({ ...args, rows });
  writeJson(args.outJson, report);
  writeText(args.outMd, renderMarkdown(report));
  console.log(`[cohort-preflight] ${report.overall_status} wrote ${args.outJson} and ${args.outMd}`);
  for (const check of report.checks) {
    console.log(`[cohort-preflight] ${check.status} ${check.id}`);
  }
  if (report.overall_status !== "PASS") process.exitCode = 2;
}

async function fetchPreflightRows(client, args) {
  const userId = args.userId;
  const conversations = await safeSelect(client, "conversations", {
    select: "id,user_id,started_at,ended_at,turn_count,errors_detected,corrections_accepted",
    user_id: `eq.${userId}`,
    started_at: `gte.${args.start}`,
    and: `(started_at.lt.${args.end})`,
    order: "started_at.desc",
    limit: "100",
  });
  const conversationIds = conversations.map((row) => row.id).filter(Boolean);
  const conversationEvents = conversationIds.length > 0
    ? await safeSelect(client, "conversation_events", {
        select: "id,conversation_id,turn_number,event_type,error_details,created_at",
        conversation_id: `in.(${conversationIds.join(",")})`,
        created_at: `gte.${args.start}`,
        and: `(created_at.lt.${args.end})`,
        order: "created_at.desc",
        limit: "500",
      })
    : [];
  const learningEvents = await safeSelect(client, "learning_events", {
    select: "id,user_id,event_type,rule_or_detector_id,payload,session_id,created_at,client_ts",
    user_id: `eq.${userId}`,
    created_at: `gte.${args.start}`,
    and: `(created_at.lt.${args.end})`,
    order: "created_at.desc",
    limit: "500",
  });
  const speechAttempts = await safeSelect(client, "speech_attempts", {
    select: "id,user_id,attempted_at,created_at,provider,overall_score,phoneme_scores",
    user_id: `eq.${userId}`,
    attempted_at: `gte.${args.start}`,
    and: `(attempted_at.lt.${args.end})`,
    order: "attempted_at.desc",
    limit: "500",
  });
  const featureFlags = await safeSelect(client, "feature_flags", {
    select: "flag_key,is_enabled,enabled_user_ids",
    ...(args.cohortTag ? { flag_key: `eq.${args.cohortTag}` } : {}),
    limit: args.cohortTag ? "1" : "500",
  });
  const profiles = await safeSelect(client, "profiles", {
    select: "id,is_synthetic",
    id: `eq.${userId}`,
    limit: "1",
  });
  return { conversations, conversationEvents, learningEvents, speechAttempts, featureFlags, profiles };
}

function makeCheck({ id, label, pass, evidence, fail }) {
  return {
    id,
    label,
    status: pass ? "PASS" : "FAIL",
    evidence,
    fail_guidance: pass ? [] : fail,
  };
}

function buildOwnerRunbook({ userId, start, end, cohortTag }) {
  const tag = cohortTag ?? "<owner-selected-cohort-feature-flag-key>";
  return {
    steps: [
      "In the owner-controlled environment only, add the designated test user to the cohort flag's feature_flags.enabled_user_ids.",
      "Flip VITE_LEARNING_CAPTURE_ENABLED for the test cohort only, with learner-data consent enabled for the test account.",
      "Flip VITE_TUTOR_PREDICTION_CAPTURE_ENABLED for the test cohort only if detector prediction/surprise rows are part of the cohort proof.",
      "Enable the pronunciation path that calls the Azure phoneme scorer for the test account; leave global defaults unchanged.",
      "Do one complete test-account session, then run this preflight script over the session window.",
    ],
    test_account_session_script: [
      "Sign in as the designated test account.",
      "Open the AI Tutor conversation surface and complete at least two learner turns.",
      "Use one sentence likely to trigger a Vietnamese-L1 copula/provenance correction, then accept or view the correction so feedback/correction provenance can drain.",
      "Open a pronunciation exercise that uses Azure detailed phoneme scoring and complete one attempt.",
      "Wait for client-side capture queues/fire-and-forget writes to drain, then record the start/end timestamps for the preflight window.",
    ],
    preflight_command: `node scripts/cohort/preflight.mjs --user-id ${userId} --start ${start} --end ${end} --cohort-tag ${tag} --out-json reports/cohort/preflight.json --out-md reports/cohort/preflight.md`,
    expected_pass_output: [
      "[cohort-preflight] PASS wrote reports/cohort/preflight.json and reports/cohort/preflight.md",
      "[cohort-preflight] PASS conversation_turn_capture",
      "[cohort-preflight] PASS detector_provenance_events",
      "[cohort-preflight] PASS phoneme_score_rows",
      "[cohort-preflight] PASS cohort_tag_resolves",
      "[cohort-preflight] PASS synthetic_exclusion_verified",
    ].join("\n"),
  };
}

function summarizeEvidence(check) {
  if (check.id === "conversation_turn_capture") {
    return `turn_count=${check.evidence.conversation_turn_count}; turn_events=${check.evidence.turn_completed_events.length}; conversations=${check.evidence.conversations.length}`;
  }
  if (check.id === "detector_provenance_events") {
    return `provenance_rows=${check.evidence.rows.length}; feedback_or_correction_rows=${check.evidence.feedback_or_correction_rows}`;
  }
  if (check.id === "phoneme_score_rows") {
    return `phoneme_rows=${check.evidence.rows.length}; speech_attempt_rows=${check.evidence.speech_attempt_rows}`;
  }
  if (check.id === "cohort_tag_resolves") {
    return `matching_flags=${check.evidence.matching_flags.length}; scanned_flags=${check.evidence.scanned_flags}`;
  }
  if (check.id === "synthetic_exclusion_verified") {
    return `reserved_prefix=${check.evidence.has_reserved_prefix}; profile_is_synthetic=${check.evidence.profile?.is_synthetic ?? "unknown"}`;
  }
  return JSON.stringify(check.evidence);
}

function pickConversationEvidence(row) {
  return {
    id: row.id ?? null,
    started_at: row.started_at ?? null,
    ended_at: row.ended_at ?? null,
    turn_count: row.turn_count ?? null,
    errors_detected: row.errors_detected ?? null,
    corrections_accepted: row.corrections_accepted ?? null,
  };
}

function pickConversationEventEvidence(row) {
  return {
    id: row.id ?? null,
    conversation_id: row.conversation_id ?? null,
    turn_number: row.turn_number ?? null,
    event_type: row.event_type ?? null,
    created_at: row.created_at ?? null,
  };
}

function pickLearningEventEvidence(row) {
  return {
    id: row.id ?? null,
    event_type: row.event_type ?? null,
    rule_or_detector_id: row.rule_or_detector_id ?? null,
    session_id: row.session_id ?? null,
    created_at: row.created_at ?? null,
    client_ts: row.client_ts ?? null,
  };
}

function isFeedbackOrCorrectionEvent(eventType) {
  const value = String(eventType ?? "");
  return value.startsWith("feedback_") || value.startsWith("correction_");
}

function createSupabaseRestClient({ url, serviceRoleKey }) {
  const base = `${url.replace(/\/$/, "")}/rest/v1`;
  return {
    async select(table, params) {
      const endpoint = new URL(`${base}/${table}`);
      for (const [key, value] of Object.entries(params)) endpoint.searchParams.set(key, value);
      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Accept: "application/json",
        },
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText}${body ? `: ${body.slice(0, 300)}` : ""}`);
      }
      return await res.json();
    },
  };
}

async function safeSelect(client, table, params) {
  try {
    return await client.select(table, params);
  } catch (error) {
    return [{
      __preflight_error: true,
      table,
      message: error instanceof Error ? error.message : String(error),
    }];
  }
}

function readEnv() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing SUPABASE_URL or VITE_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return { url, serviceRoleKey };
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

function splitCsv(value) {
  return String(value).split(",").map((part) => part.trim()).filter(Boolean);
}

function normalizeUserId(value) {
  return String(value ?? "").trim().toLowerCase();
}

function validateDate(value, flag) {
  if (!value) throw new Error(`${flag} is required`);
  const ms = Date.parse(value);
  if (!Number.isFinite(ms)) throw new Error(`${flag} must be an ISO date or timestamp`);
}

function safeInteger(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`[cohort-preflight] ${error.message}`);
    process.exit(1);
  });
}
