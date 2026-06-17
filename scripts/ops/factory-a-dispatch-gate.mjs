#!/usr/bin/env node

import fs from "node:fs";

export const DECISIONS = {
  ALLOW: "ALLOW",
  HOLD: "HOLD",
  REJECT: "REJECT",
};

export const JOB_TYPES = {
  A: "Type A",
  B: "Type B",
  C: "Type C",
  D: "Type D",
};

export const KNOWN_STALE_DUPLICATE_KEYS = new Set(["903-success-streak-promotion-v1"]);

export const UNSAFE_PATH_RULES = [
  { key: "auth", pattern: /(^|\/)(auth|login|signup|session|oauth|jwt|password)(\/|\.|$)/i },
  { key: "billing", pattern: /(^|\/)(billing|stripe|revenuecat|subscription|checkout|invoice)(\/|\.|$)/i },
  { key: "sql_rls_migrations", pattern: /(^|\/)(sql|rls|migrations?)(\/|\.|$)|\.sql$/i },
  { key: "secrets", pattern: /(^|\/)(secrets?|credentials?|keys?)(\/|\.|$)/i },
  { key: "env", pattern: /(^|\/)\.env($|\.|\/)|(^|\/)\.env\./i },
  { key: "deploy_config", pattern: /(^|\/)(deploy|deployment|release)(\/|\.|$)|(^|\/)(vercel|cloudflare)\.jsonc?$/i },
  { key: "supabase_migrations", pattern: /(^|\/)supabase\/.*migrations/i },
  { key: "netlify_wrangler", pattern: /(^|\/)(netlify\.toml|wrangler\.jsonc?|wrangler\.toml)$/i },
];

const REPORT_DOC_EVIDENCE_PATTERN = /^(reports|docs|evidence)\//i;
const OPS_UTILITY_PATTERN = /^(scripts\/ops|tests\/ops)\//i;

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function normalizePath(path) {
  return String(path || "")
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\.\//, "");
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function compactUnique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function detectUnsafePaths(paths = []) {
  const matches = [];

  for (const path of asArray(paths).map(normalizePath).filter(Boolean)) {
    for (const rule of UNSAFE_PATH_RULES) {
      if (rule.pattern.test(path)) {
        matches.push({ path, rule: rule.key });
      }
    }
  }

  return matches;
}

export function classifyJob(job = {}) {
  const paths = asArray(job.paths ?? job.allowedPaths ?? job.changedFiles).map(normalizePath).filter(Boolean);
  const unsafePaths = detectUnsafePaths(paths);

  if (unsafePaths.length > 0 || job.touchesUnsafeArea === true) {
    return {
      type: JOB_TYPES.D,
      code: "D",
      unsafePaths,
      reason: "job touches auth, billing, SQL/RLS, secrets, deploy config, Supabase migrations, Netlify, or wrangler areas",
    };
  }

  if (paths.length > 0 && paths.every((path) => REPORT_DOC_EVIDENCE_PATTERN.test(path))) {
    return {
      type: JOB_TYPES.A,
      code: "A",
      unsafePaths: [],
      reason: "reports, docs, or evidence only",
    };
  }

  if (paths.length > 0 && paths.every((path) => OPS_UTILITY_PATTERN.test(path))) {
    return {
      type: JOB_TYPES.B,
      code: "B",
      unsafePaths: [],
      reason: "scripts/ops or tests/ops utility work",
    };
  }

  return {
    type: JOB_TYPES.C,
    code: "C",
    unsafePaths: [],
    reason: "app or product code, mixed scope, or unspecified paths",
  };
}

function jobKeys(job = {}) {
  return compactUnique([job.id, job.jobId, job.key, job.title, job.branch].map(normalizeText));
}

export function detectStaleDuplicate(job = {}, context = {}) {
  const keys = jobKeys(job);
  const artifactPaths = asArray(context.existingArtifacts ?? context.artifacts).map(normalizePath);
  const requestedArtifacts = asArray(job.artifacts ?? job.expectedArtifacts ?? job.outputs).map(normalizePath);

  const artifactMatches = requestedArtifacts.filter((artifact) => artifactPaths.includes(artifact));
  const knownStaleKey = keys.find((key) => KNOWN_STALE_DUPLICATE_KEYS.has(key));
  const mrMatches = [];

  for (const mr of asArray(context.mergeRequests ?? context.openMergeRequests ?? context.mrs)) {
    const mrKeys = compactUnique([mr.id, mr.iid, mr.title, mr.branch, mr.sourceBranch, mr.source_branch].map(normalizeText));
    const matchedBy = keys.filter((key) => key && mrKeys.some((mrKey) => mrKey.includes(key) || key.includes(mrKey)));
    if (matchedBy.length > 0) {
      mrMatches.push({
        state: mr.state || "unknown",
        title: mr.title || "",
        branch: mr.branch || mr.sourceBranch || mr.source_branch || "",
        matchedBy,
      });
    }
  }

  return {
    duplicate: Boolean(knownStaleKey || artifactMatches.length > 0 || mrMatches.length > 0),
    knownStaleKey: knownStaleKey || null,
    artifactMatches,
    mrMatches,
  };
}

function pathsOverlap(left, right) {
  const a = normalizePath(left);
  const b = normalizePath(right);
  return Boolean(a && b && (a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`)));
}

export function detectPathOverlap(allowedPaths = [], mergeRequests = []) {
  const normalizedAllowed = asArray(allowedPaths).map(normalizePath).filter(Boolean);
  const overlaps = [];

  for (const mr of asArray(mergeRequests)) {
    const changedFiles = asArray(mr.changedFiles ?? mr.changed_files ?? mr.paths).map(normalizePath).filter(Boolean);
    for (const allowedPath of normalizedAllowed) {
      const matchingFiles = changedFiles.filter((changedFile) => pathsOverlap(allowedPath, changedFile));
      if (matchingFiles.length > 0) {
        overlaps.push({
          mr: mr.iid ?? mr.id ?? mr.title ?? "unknown",
          state: mr.state || "unknown",
          branch: mr.branch || mr.sourceBranch || mr.source_branch || "",
          allowedPath,
          changedFiles: matchingFiles,
        });
      }
    }
  }

  return overlaps;
}

function isTerminalSuccess(status) {
  return ["success", "passed", "skipped"].includes(normalizeText(status));
}

function isManualOrCreatedProductionJob(job) {
  const status = normalizeText(job.status);
  const when = normalizeText(job.when);
  const name = normalizeText(`${job.name || ""} ${job.stage || ""}`);
  return ["manual", "created"].includes(status) && (when === "manual" || /prod|production/.test(name));
}

export function evaluateMainPipeline(pipeline = {}) {
  const jobs = asArray(pipeline.jobs);
  if (jobs.length === 0) {
    return {
      clean: pipeline.status ? isTerminalSuccess(pipeline.status) : null,
      reason: pipeline.status ? `pipeline status is ${pipeline.status}` : "no pipeline data supplied",
      blockingJobs: [],
      remainingProductionManualJobs: [],
    };
  }

  const blockingJobs = jobs.filter((job) => !isTerminalSuccess(job.status) && !isManualOrCreatedProductionJob(job));
  const remainingProductionManualJobs = jobs.filter(isManualOrCreatedProductionJob);

  return {
    clean: blockingJobs.length === 0,
    reason:
      blockingJobs.length === 0
        ? "all automatic jobs succeeded; only manual/created production jobs remain"
        : "one or more automatic jobs are not successful",
    blockingJobs: blockingJobs.map((job) => ({ name: job.name || "unknown", status: job.status || "unknown" })),
    remainingProductionManualJobs: remainingProductionManualJobs.map((job) => ({
      name: job.name || "unknown",
      status: job.status || "unknown",
    })),
  };
}

export function classifyFailure(trace) {
  const text = String(trace || "");
  const floorMatch = text.match(/([0-9]+(?:\.[0-9]+)?)GB\s+<\s+(14(?:\.0+)?)GB floor/i);
  if (/DISK_GATE/i.test(text) || floorMatch) {
    return {
      classification: "runner_disk_floor",
      productCodeFailure: false,
      freeGb: floorMatch ? Number(floorMatch[1]) : null,
      floorGb: floorMatch ? Number(floorMatch[2]) : 14,
      reason: "DISK_GATE / GB < 14GB floor is runner capacity, not product failure",
    };
  }

  return {
    classification: "unknown",
    productCodeFailure: null,
    freeGb: null,
    floorGb: null,
    reason: "no dispatch-gate infrastructure failure pattern matched",
  };
}

function addDecision(current, next) {
  const order = [DECISIONS.ALLOW, DECISIONS.HOLD, DECISIONS.REJECT];
  return order.indexOf(next) > order.indexOf(current) ? next : current;
}

export function evaluateDispatchGate(input = {}) {
  const job = input.job ?? input;
  const context = input.context ?? {};
  const classification = classifyJob(job);
  const staleDuplicate = detectStaleDuplicate(job, context);
  const pathOverlaps = detectPathOverlap(job.allowedPaths ?? job.paths, context.openMergeRequests ?? context.mergeRequests);
  const mainPipeline = evaluateMainPipeline(context.latestMainPipeline ?? context.mainPipeline ?? {});
  const failure = classifyFailure(context.failureTrace ?? job.failureTrace ?? "");
  const reasons = [classification.reason];
  let decision = DECISIONS.ALLOW;

  if (classification.code === "D") {
    if (job.ownerOverride === true || context.ownerOverride === true) {
      decision = addDecision(decision, DECISIONS.HOLD);
      reasons.push("Type D has explicit owner override; serialize for owner-directed handling");
    } else {
      decision = addDecision(decision, DECISIONS.REJECT);
      reasons.push("Type D requires explicit owner override");
    }
  }

  if (classification.code === "C") {
    decision = addDecision(decision, DECISIONS.HOLD);
    reasons.push("Type C app/product code should be serialized instead of broad dispatch");
  }

  if (staleDuplicate.knownStaleKey) {
    decision = addDecision(decision, DECISIONS.REJECT);
    reasons.push(`known stale duplicate ${staleDuplicate.knownStaleKey} must not be dispatched`);
  } else if (staleDuplicate.duplicate) {
    decision = addDecision(decision, DECISIONS.HOLD);
    reasons.push("matching artifact or merge request already exists");
  }

  if (pathOverlaps.length > 0) {
    decision = addDecision(decision, DECISIONS.HOLD);
    reasons.push("allowed paths overlap changed files in an existing merge request");
  }

  return {
    decision,
    type: classification.type,
    code: classification.code,
    reasons,
    unsafePaths: classification.unsafePaths,
    staleDuplicate,
    pathOverlaps,
    mainPipeline,
    failure,
  };
}

function argValue(args, name) {
  const exact = `--${name}`;
  const prefix = `${exact}=`;
  const index = args.indexOf(exact);
  if (index >= 0) return args[index + 1] ?? "";
  const match = args.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : "";
}

function readJsonArg(args) {
  const jsonPath = argValue(args, "input");
  if (jsonPath) return JSON.parse(fs.readFileSync(jsonPath, "utf8"));

  const json = argValue(args, "json");
  if (json) return JSON.parse(json);

  return {
    job: {
      id: argValue(args, "id"),
      title: argValue(args, "title"),
      branch: argValue(args, "branch"),
      paths: argValue(args, "paths")
        .split(",")
        .map((path) => path.trim())
        .filter(Boolean),
      ownerOverride: args.includes("--owner-override"),
    },
  };
}

function main() {
  const args = process.argv.slice(2);
  const result = evaluateDispatchGate(readJsonArg(args));
  console.log(JSON.stringify(result, null, 2));
  return result.decision === DECISIONS.REJECT ? 2 : result.decision === DECISIONS.HOLD ? 1 : 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main();
}
