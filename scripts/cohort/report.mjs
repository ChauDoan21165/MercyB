#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import process from "node:process";

export const SYNTHETIC_USER_ID_PREFIX = "63e289e1-";

export const DEFAULT_COPULA_TAGS = [
  "vi_l1_missing_be",
  "l1-detector:missing-be",
  "l1-detector:missing_be",
  "missing_be",
  "copula_drop",
];

export const DEFAULT_VN_CONFUSABLE_PHONEMES = [
  "θ",
  "ð",
  "ʃ",
  "tʃ",
  "dʒ",
  "ʒ",
  "z",
  "v",
  "r",
  "l",
];

function usage() {
  return `Usage:
  node scripts/cohort/report.mjs \\
    --users uuid1,uuid2 \\
    --entry-start 2026-07-01 --entry-end 2026-07-08 \\
    --week3-start 2026-07-22 --week3-end 2026-07-29 \\
    --out-json reports/cohort/cohort-report.json \\
    --out-md reports/cohort/cohort-report.md

Options:
  --users                 Comma-separated user_id list.
  --cohort-tag            Feature-flag key whose enabled_user_ids define the cohort.
  --cohort-file           JSON file with { "user_ids": [...] } or { "cohort_tag": "..." }.
  --entry-start/end       ISO date or timestamp for the entry window. End is exclusive.
  --week3-start/end       ISO date or timestamp for the week-three window. End is exclusive.
  --phonemes              Optional comma-separated target phoneme list.
  --out-json              JSON output path.
  --out-md                Markdown output path.

Environment:
  SUPABASE_URL or VITE_SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY
`;
}

export function parseArgs(argv) {
  const out = {
    users: [],
    cohortTag: null,
    cohortFile: null,
    entryStart: null,
    entryEnd: null,
    week3Start: null,
    week3End: null,
    phonemes: DEFAULT_VN_CONFUSABLE_PHONEMES,
    outJson: "reports/cohort/cohort-report.json",
    outMd: "reports/cohort/cohort-report.md",
  };

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    const value = argv[i + 1];
    if (flag === "--help") {
      return { help: true };
    }
    if (!flag.startsWith("--")) throw new Error(`Unknown argument: ${flag}`);
    if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
    i += 1;

    if (flag === "--users") out.users = splitCsv(value);
    else if (flag === "--cohort-tag") out.cohortTag = value.trim();
    else if (flag === "--cohort-file") out.cohortFile = value.trim();
    else if (flag === "--entry-start") out.entryStart = value.trim();
    else if (flag === "--entry-end") out.entryEnd = value.trim();
    else if (flag === "--week3-start") out.week3Start = value.trim();
    else if (flag === "--week3-end") out.week3End = value.trim();
    else if (flag === "--phonemes") out.phonemes = splitCsv(value);
    else if (flag === "--out-json") out.outJson = value.trim();
    else if (flag === "--out-md") out.outMd = value.trim();
    else throw new Error(`Unknown argument: ${flag}`);
  }

  validateDate(out.entryStart, "--entry-start");
  validateDate(out.entryEnd, "--entry-end");
  validateDate(out.week3Start, "--week3-start");
  validateDate(out.week3End, "--week3-end");
  if (!out.cohortFile && out.users.length === 0 && !out.cohortTag) {
    throw new Error("Provide --users, --cohort-tag, or --cohort-file");
  }
  if (out.phonemes.length === 0) throw new Error("--phonemes cannot be empty");
  return out;
}

export function normalizeUserIds(userIds) {
  return [...new Set((userIds ?? []).map((id) => String(id).trim().toLowerCase()).filter(Boolean))]
    .filter((id) => !id.startsWith(SYNTHETIC_USER_ID_PREFIX))
    .sort();
}

export function extractPhonemeScores(phonemeScores, targetPhonemes) {
  const targets = new Set(targetPhonemes);
  const rows = [];
  const walk = (node) => {
    if (!node) return;
    if (Array.isArray(node)) {
      for (const item of node) walk(item);
      return;
    }
    if (typeof node !== "object") return;
    const phoneme = typeof node.phoneme === "string"
      ? node.phoneme
      : typeof node.Phoneme === "string"
        ? node.Phoneme
        : null;
    const rawScore = typeof node.score === "number"
      ? node.score
      : typeof node.Score === "number"
        ? node.Score
        : null;
    if (phoneme && targets.has(phoneme) && Number.isFinite(rawScore)) {
      rows.push({ phoneme, score: rawScore });
    }
    if (Array.isArray(node.phonemes)) walk(node.phonemes);
    if (Array.isArray(node.Phonemes)) walk(node.Phonemes);
  };
  walk(phonemeScores);
  return rows;
}

export function isCopulaDetectorMatch(row, copulaTags = DEFAULT_COPULA_TAGS) {
  const tags = new Set(copulaTags);
  const candidates = [
    row?.rule_or_detector_id,
    row?.ruleOrDetectorId,
    row?.detectorTag,
    row?.tag,
    row?.errorType,
    row?.weaknessTag,
    row?.error_details?.rule_or_detector_id,
    row?.error_details?.ruleOrDetectorId,
    row?.error_details?.detectorTag,
    row?.error_details?.tag,
    row?.error_details?.errorType,
    row?.error_details?.weaknessTag,
    row?.payload?.rule_or_detector_id,
    row?.payload?.ruleOrDetectorId,
    row?.payload?.detectorTag,
    row?.payload?.tag,
    row?.payload?.errorType,
    row?.payload?.weaknessTag,
  ];
  return candidates.some((candidate) => typeof candidate === "string" && tags.has(candidate));
}

export function summarizeWindow({ userIds, windowName, windowRange, conversations, conversationEvents, learningEvents, speechAttempts, phonemes }) {
  const byUser = new Map(userIds.map((id) => [id, emptyLearnerWindow(id, windowName)]));
  const conversationUser = new Map();

  for (const row of conversations) {
    const learner = byUser.get(row.user_id);
    if (!learner) continue;
    conversationUser.set(row.id, row.user_id);
    learner.utterance_denominator.conversation_sessions += 1;
    learner.utterance_denominator.conversation_turns += safeInteger(row.turn_count);
  }

  const seenTurnEvents = new Set();
  for (const row of conversationEvents) {
    const userId = conversationUser.get(row.conversation_id);
    const learner = byUser.get(userId);
    if (!learner) continue;
    if (row.event_type === "turn_completed") {
      const key = `${row.conversation_id}:${row.turn_number}`;
      if (!seenTurnEvents.has(key)) {
        seenTurnEvents.add(key);
        learner.utterance_denominator.turn_completed_events += 1;
      }
    }
    if (row.event_type === "error_detected" && isCopulaDetectorMatch(row)) {
      learner.copula_drop.copula_events += 1;
      learner.copula_drop.sources.conversation_events += 1;
    }
  }

  for (const row of learningEvents) {
    const learner = byUser.get(row.user_id);
    if (!learner) continue;
    learner.utterance_denominator.learning_events += 1;
    if (isCopulaDetectorMatch(row)) {
      learner.copula_drop.copula_events += 1;
      learner.copula_drop.sources.learning_events += 1;
    }
  }

  for (const row of speechAttempts) {
    const learner = byUser.get(row.user_id);
    if (!learner) continue;
    learner.pronunciation.attempts += 1;
    if (row.provider === "cloud") learner.pronunciation.cloud_attempts += 1;
    if (typeof row.overall_score === "number") {
      learner.pronunciation.overall_scores.push(row.overall_score);
    }
    for (const item of extractPhonemeScores(row.phoneme_scores, phonemes)) {
      const metric = learner.pronunciation.phonemes[item.phoneme] ?? { samples: 0, avg_score: null, scores: [] };
      metric.samples += 1;
      metric.scores.push(item.score);
      learner.pronunciation.phonemes[item.phoneme] = metric;
    }
  }

  const perLearner = [...byUser.values()].map((learner) => finalizeLearnerWindow(learner));
  return {
    window: windowName,
    start: windowRange.start,
    end: windowRange.end,
    learners: perLearner,
    aggregate: aggregateLearners(perLearner),
  };
}

export function buildReportJson({ cohort, windows, availability }) {
  return {
    generated_at: new Date().toISOString(),
    cohort,
    availability,
    windows,
  };
}

export function renderMarkdown(report) {
  const lines = [
    "# Cohort Cause-Level Report",
    "",
    `Generated: ${report.generated_at}`,
    "",
    `Cohort source: ${report.cohort.source}`,
    `Learners included: ${report.cohort.user_ids.length}`,
    `Excluded synthetic prefix: ${SYNTHETIC_USER_ID_PREFIX}`,
    "",
    "## Availability Map",
    "",
    `- Copula-drop rate: ${report.availability.copula_drop.status}. ${report.availability.copula_drop.note}`,
    `- Phoneme scores: ${report.availability.phoneme_scores.status}. ${report.availability.phoneme_scores.note}`,
    `- Cohort tag: ${report.availability.cohort_tag.status}. ${report.availability.cohort_tag.note}`,
    "",
    "## Window Summary",
    "",
    "| Window | Learners | Utterance denominator | Copula events | Copula / 100 utterances | Speech attempts | Cloud attempts | Phoneme samples | Avg overall score |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  ];

  for (const window of report.windows) {
    const a = window.aggregate;
    lines.push(`| ${window.window} | ${a.learners} | ${a.utterance_denominator} | ${a.copula_events} | ${formatNumber(a.copula_per_100_utterances)} | ${a.speech_attempts} | ${a.cloud_attempts} | ${a.phoneme_samples} | ${formatNumber(a.avg_overall_score)} |`);
  }

  lines.push("", "## Per-Learner Metrics", "");
  for (const window of report.windows) {
    lines.push(`### ${window.window}`, "");
    lines.push("| user_id | utterances | copula events | copula / 100 | speech attempts | cloud attempts | phoneme samples | avg overall |");
    lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
    for (const learner of window.learners) {
      lines.push(`| ${learner.user_id} | ${learner.utterance_denominator.selected} | ${learner.copula_drop.copula_events} | ${formatNumber(learner.copula_drop.per_100_utterances)} | ${learner.pronunciation.attempts} | ${learner.pronunciation.cloud_attempts} | ${learner.pronunciation.phoneme_sample_count} | ${formatNumber(learner.pronunciation.avg_overall_score)} |`);
    }
    lines.push("");
  }

  lines.push("## Notes", "");
  lines.push("- Copula denominator uses conversation turn counts when present, then `turn_completed` events, then learning-event rows as a last-resort activity proxy.");
  lines.push("- Phoneme metrics use only rows with `speech_attempts.phoneme_scores`; local word-only attempts contribute to speech attempt counts but not per-phoneme scores.");
  lines.push("- The script performs read-only Supabase REST queries and writes only local JSON/Markdown files.");
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
  const cohort = await resolveCohort(args, client);
  const userIds = await excludeSyntheticUsers(cohort.user_ids, client);
  if (userIds.length === 0) throw new Error("Cohort is empty after synthetic-user exclusion");

  const windows = [
    { name: "entry", start: args.entryStart, end: args.entryEnd },
    { name: "week_three", start: args.week3Start, end: args.week3End },
  ];

  const summaries = [];
  for (const window of windows) {
    const data = await fetchWindowData(client, userIds, window);
    summaries.push(summarizeWindow({
      userIds,
      windowName: window.name,
      windowRange: window,
      phonemes: args.phonemes,
      ...data,
    }));
  }

  const report = buildReportJson({
    cohort: {
      source: cohort.source,
      user_ids: userIds,
      excluded_user_id_prefixes: [SYNTHETIC_USER_ID_PREFIX],
    },
    availability: availabilityMap(args),
    windows: summaries,
  });

  writeJson(args.outJson, report);
  writeText(args.outMd, renderMarkdown(report));
  console.log(`[cohort-report] wrote ${args.outJson} and ${args.outMd}`);
}

function emptyLearnerWindow(userId, windowName) {
  return {
    user_id: userId,
    window: windowName,
    utterance_denominator: {
      selected: 0,
      source: "none",
      conversation_sessions: 0,
      conversation_turns: 0,
      turn_completed_events: 0,
      learning_events: 0,
    },
    copula_drop: {
      copula_events: 0,
      per_100_utterances: null,
      sources: {
        conversation_events: 0,
        learning_events: 0,
      },
    },
    pronunciation: {
      attempts: 0,
      cloud_attempts: 0,
      overall_scores: [],
      avg_overall_score: null,
      phoneme_sample_count: 0,
      phonemes: {},
    },
  };
}

function finalizeLearnerWindow(learner) {
  const d = learner.utterance_denominator;
  if (d.conversation_turns > 0) {
    d.selected = d.conversation_turns;
    d.source = "conversations.turn_count";
  } else if (d.turn_completed_events > 0) {
    d.selected = d.turn_completed_events;
    d.source = "conversation_events.turn_completed";
  } else if (d.learning_events > 0) {
    d.selected = d.learning_events;
    d.source = "learning_events_proxy";
  }
  learner.copula_drop.per_100_utterances = d.selected > 0
    ? round((learner.copula_drop.copula_events / d.selected) * 100)
    : null;
  learner.pronunciation.avg_overall_score = average(learner.pronunciation.overall_scores);
  delete learner.pronunciation.overall_scores;
  for (const metric of Object.values(learner.pronunciation.phonemes)) {
    metric.avg_score = average(metric.scores);
    delete metric.scores;
    learner.pronunciation.phoneme_sample_count += metric.samples;
  }
  return learner;
}

function aggregateLearners(learners) {
  const out = {
    learners: learners.length,
    utterance_denominator: 0,
    copula_events: 0,
    copula_per_100_utterances: null,
    speech_attempts: 0,
    cloud_attempts: 0,
    phoneme_samples: 0,
    avg_overall_score: null,
  };
  const overallScores = [];
  for (const learner of learners) {
    out.utterance_denominator += learner.utterance_denominator.selected;
    out.copula_events += learner.copula_drop.copula_events;
    out.speech_attempts += learner.pronunciation.attempts;
    out.cloud_attempts += learner.pronunciation.cloud_attempts;
    out.phoneme_samples += learner.pronunciation.phoneme_sample_count;
    if (learner.pronunciation.avg_overall_score !== null) overallScores.push(learner.pronunciation.avg_overall_score);
  }
  out.copula_per_100_utterances = out.utterance_denominator > 0
    ? round((out.copula_events / out.utterance_denominator) * 100)
    : null;
  out.avg_overall_score = average(overallScores);
  return out;
}

async function resolveCohort(args, client) {
  let users = [...args.users];
  let source = args.users.length > 0 ? "users" : "";

  if (args.cohortFile) {
    const parsed = JSON.parse(readFileSync(args.cohortFile, "utf8"));
    if (Array.isArray(parsed.user_ids)) {
      users = parsed.user_ids;
      source = `cohort-file:${args.cohortFile}`;
    } else if (typeof parsed.cohort_tag === "string") {
      args.cohortTag = parsed.cohort_tag;
      source = `cohort-file:${args.cohortFile}:tag:${args.cohortTag}`;
    } else {
      throw new Error("--cohort-file must contain user_ids[] or cohort_tag");
    }
  }

  if (args.cohortTag) {
    const rows = await client.select("feature_flags", {
      select: "flag_key,enabled_user_ids",
      flag_key: `eq.${args.cohortTag}`,
      limit: "1",
    });
    const row = rows[0];
    if (!row) throw new Error(`No feature_flags row found for cohort tag ${args.cohortTag}`);
    users = Array.isArray(row.enabled_user_ids) ? row.enabled_user_ids : [];
    source = source || `feature_flags:${args.cohortTag}`;
  }

  return { source, user_ids: normalizeUserIds(users) };
}

async function excludeSyntheticUsers(userIds, client) {
  const prefixFiltered = normalizeUserIds(userIds);
  if (prefixFiltered.length === 0) return [];
  try {
    const rows = await client.select("profiles", {
      select: "id,is_synthetic",
      id: `in.(${prefixFiltered.join(",")})`,
    });
    const synthetic = new Set((rows ?? []).filter((row) => row.is_synthetic === true).map((row) => String(row.id).toLowerCase()));
    return prefixFiltered.filter((id) => !synthetic.has(id));
  } catch (error) {
    console.warn(`[cohort-report] profiles synthetic filter unavailable; prefix filter still applied: ${error.message}`);
    return prefixFiltered;
  }
}

async function fetchWindowData(client, userIds, window) {
  const userIn = `in.(${userIds.join(",")})`;
  const conversations = await safeSelect(client, "conversations", {
    select: "id,user_id,started_at,turn_count",
    user_id: userIn,
    started_at: `gte.${window.start}`,
    and: `(started_at.lt.${window.end})`,
  });
  const conversationIds = conversations.map((row) => row.id).filter(Boolean);
  const conversationEvents = conversationIds.length > 0
    ? await safeSelect(client, "conversation_events", {
        select: "conversation_id,turn_number,event_type,error_details,created_at",
        conversation_id: `in.(${conversationIds.join(",")})`,
        created_at: `gte.${window.start}`,
        and: `(created_at.lt.${window.end})`,
      })
    : [];
  const learningEvents = await safeSelect(client, "learning_events", {
    select: "user_id,event_type,rule_or_detector_id,payload,created_at,client_ts",
    user_id: userIn,
    created_at: `gte.${window.start}`,
    and: `(created_at.lt.${window.end})`,
  });
  const speechAttempts = await safeSelect(client, "speech_attempts", {
    select: "user_id,attempted_at,provider,overall_score,phoneme_scores",
    user_id: userIn,
    attempted_at: `gte.${window.start}`,
    and: `(attempted_at.lt.${window.end})`,
  });
  return { conversations, conversationEvents, learningEvents, speechAttempts };
}

async function safeSelect(client, table, params) {
  try {
    return await client.select(table, params);
  } catch (error) {
    console.warn(`[cohort-report] ${table} unavailable: ${error.message}`);
    return [];
  }
}

export function availabilityMap(args = {}) {
  return {
    copula_drop: {
      status: "partially_computable_today",
      note: "Counts are computable from learning_events.rule_or_detector_id and conversation_events.error_details when detector provenance is captured. Exact per-100-utterance denominators require conversation turn capture; otherwise learning_events is only a proxy. TUTOR_PREDICTION_CAPTURE_ENABLED can add prediction/surprise rows but remains owner-gated and is not flipped by this script.",
    },
    phoneme_scores: {
      status: "computable_today_when_azure_rows_exist",
      note: "speech_attempts has provider, overall_score, attempted_at, and phoneme_scores. Azure writes phoneme_scores; local client persistence writes word_scores only, so per-phoneme metrics need cloud-scored attempts in the cohort windows.",
    },
    cohort_tag: {
      status: "computable_today",
      note: "A cohort tag resolves to feature_flags.enabled_user_ids. The report also accepts an explicit user_id list or a JSON cohort file.",
    },
    windows: {
      entry: [args.entryStart ?? null, args.entryEnd ?? null],
      week_three: [args.week3Start ?? null, args.week3End ?? null],
    },
  };
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

function readEnv() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing SUPABASE_URL or VITE_SUPABASE_URL");
  if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return { url, serviceRoleKey };
}

function splitCsv(value) {
  return String(value).split(",").map((part) => part.trim()).filter(Boolean);
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

function average(values) {
  const clean = values.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (clean.length === 0) return null;
  return round(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function formatNumber(value) {
  return value === null || value === undefined ? "n/a" : String(value);
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}

function writeText(path, text) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(`[cohort-report] ${error.message}`);
    process.exit(1);
  });
}
