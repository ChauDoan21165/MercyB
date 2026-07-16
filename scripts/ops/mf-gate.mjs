#!/usr/bin/env node

import fs from "node:fs";

export const DECISIONS = {
  DISPATCH_TO_C2: "DISPATCH_TO_C2",
  DISPATCH_TO_C4: "DISPATCH_TO_C4",
  DISPATCH_TO_ADMIN: "DISPATCH_TO_ADMIN",
  WAIT: "WAIT",
  HOLD_FOR_OWNER: "HOLD_FOR_OWNER",
  REJECT_DUPLICATE: "REJECT_DUPLICATE",
  REJECT_UNSAFE: "REJECT_UNSAFE",
};

export const JOB_TYPES = {
  A: "Type A",
  B: "Type B",
  C: "Type C",
  D: "Type D",
};

export const DEFAULT_POLICY = {
  diskFloorGb: 14,
  preferredOpsTargets: ["C2", "C4"],
};

export const KNOWN_STALE_DUPLICATE_KEYS = new Set(["903-success-streak-promotion-v1"]);

export const UNSAFE_PATH_RULES = [
  { key: "auth", pattern: /(^|\/)(auth|login|signup|session|oauth|jwt|password)(\/|\.|$)/i },
  { key: "billing", pattern: /(^|\/)(billing|stripe|revenuecat|subscription|checkout|invoice)(\/|\.|$)/i },
  { key: "sql_rls_migrations", pattern: /(^|\/)(sql|rls|migrations?)(\/|\.|$)|\.sql$/i },
  { key: "secrets", pattern: /(^|\/)(secrets?|credentials?|keys?)(\/|\.|$)/i },
  { key: "env", pattern: /(^|\/)\.env($|\.|\/)|(^|\/)\.env\./i },
  { key: "deploy_config", pattern: /(^|\/)(deploy|deployment|release|prod|production)(\/|\.|$)/i },
  { key: "supabase_migrations", pattern: /(^|\/)supabase\/.*migrations/i },
  { key: "wrangler", pattern: /(^|\/)wrangler\.(jsonc?|toml)$/i },
];

const DOCS_PATTERN = /^(reports|docs|evidence)\//i;
const OPS_PATTERN = /^(scripts\/ops|tests\/ops)\//i;
const DISPATCH_PRIORITY = [
  DECISIONS.DISPATCH_TO_C2,
  DECISIONS.DISPATCH_TO_C4,
  DECISIONS.DISPATCH_TO_ADMIN,
  DECISIONS.WAIT,
  DECISIONS.HOLD_FOR_OWNER,
  DECISIONS.REJECT_DUPLICATE,
  DECISIONS.REJECT_UNSAFE,
];

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

export function normalizePath(path) {
  return String(path || "")
    .trim()
    .replaceAll("\\", "/")
    .replace(/^\.\//, "");
}

function compactUnique(values) {
  return [...new Set(values.filter(Boolean))];
}

function highestDecision(current, next) {
  return DISPATCH_PRIORITY.indexOf(next) > DISPATCH_PRIORITY.indexOf(current) ? next : current;
}

function jobPaths(job = {}) {
  return asArray(job.paths ?? job.changed_paths ?? job.changedPaths ?? job.allowedPaths ?? job.files)
    .map(normalizePath)
    .filter(Boolean);
}

function jobKeys(job = {}) {
  return compactUnique([job.job_id, job.jobId, job.id, job.key, job.title, job.branch].map(normalizeText));
}

export function pathsOverlap(left, right) {
  const a = normalizePath(left);
  const b = normalizePath(right);
  return Boolean(a && b && (a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`)));
}

export function pathLockKey(paths = []) {
  const normalized = asArray(paths).map(normalizePath).filter(Boolean).sort();
  if (normalized.length === 0) return "unspecified";

  const prefixes = normalized.map((path) => path.split("/").slice(0, 2).join("/"));
  return compactUnique(prefixes).join("+");
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
  const paths = jobPaths(job);
  const unsafePaths = detectUnsafePaths(paths);

  if (unsafePaths.length > 0 || job.touchesUnsafeArea === true) {
    return {
      code: "D",
      job_type: JOB_TYPES.D,
      reason: "auth, billing, SQL/RLS, secrets, deploy, production config, Supabase, or wrangler scope",
      unsafePaths,
    };
  }

  if (paths.length > 0 && paths.every((path) => DOCS_PATTERN.test(path))) {
    return { code: "A", job_type: JOB_TYPES.A, reason: "docs, reports, or evidence only", unsafePaths: [] };
  }

  if (paths.length > 0 && paths.every((path) => OPS_PATTERN.test(path))) {
    return { code: "B", job_type: JOB_TYPES.B, reason: "scripts/ops and tests/ops only", unsafePaths: [] };
  }

  return { code: "C", job_type: JOB_TYPES.C, reason: "app/product code, mixed scope, or unspecified paths", unsafePaths: [] };
}

export function detectDuplicate(job = {}, context = {}) {
  const keys = jobKeys(job);
  const requestedArtifacts = asArray(job.artifacts ?? job.expectedArtifacts ?? job.outputs).map(normalizePath);
  const existingArtifacts = asArray(context.artifacts ?? context.existingArtifacts).map(normalizePath);
  const artifactMatches = requestedArtifacts.filter((artifact) => existingArtifacts.includes(artifact));
  const knownStaleKey = keys.find((key) => KNOWN_STALE_DUPLICATE_KEYS.has(key)) || null;
  const activeJobs = [];
  const mergeRequests = [];

  for (const activeJob of asArray(context.activeJobs ?? context.jobs)) {
    const activeKeys = jobKeys(activeJob);
    const matchedBy = keys.filter((key) => activeKeys.includes(key));
    if (matchedBy.length > 0) {
      activeJobs.push({
        job_id: activeJob.job_id ?? activeJob.jobId ?? activeJob.id ?? "",
        title: activeJob.title ?? "",
        branch: activeJob.branch ?? "",
        matchedBy,
      });
    }
  }

  for (const mr of asArray(context.mergeRequests ?? context.openMergeRequests ?? context.mrs)) {
    const mrKeys = compactUnique([mr.id, mr.iid, mr.title, mr.branch, mr.sourceBranch, mr.source_branch].map(normalizeText));
    const matchedBy = keys.filter((key) => key && mrKeys.some((mrKey) => mrKey === key));
    if (matchedBy.length > 0) {
      mergeRequests.push({
        iid: mr.iid ?? mr.id ?? "",
        state: mr.state ?? "unknown",
        title: mr.title ?? "",
        branch: mr.branch ?? mr.sourceBranch ?? mr.source_branch ?? "",
        matchedBy,
      });
    }
  }

  return {
    duplicate: Boolean(knownStaleKey || artifactMatches.length > 0 || activeJobs.length > 0 || mergeRequests.length > 0),
    knownStaleKey,
    artifactMatches,
    activeJobs,
    mergeRequests,
  };
}

export function detectPathLocks(paths = [], locks = []) {
  const normalizedPaths = asArray(paths).map(normalizePath).filter(Boolean);
  const overlaps = [];

  for (const lock of asArray(locks)) {
    if (lock.active === false || normalizeText(lock.state) === "released") continue;
    const lockPaths = asArray(lock.paths ?? lock.path ?? lock.key).map(normalizePath).filter(Boolean);
    const matchingPaths = [];

    for (const path of normalizedPaths) {
      for (const lockPath of lockPaths) {
        if (pathsOverlap(path, lockPath)) matchingPaths.push(path);
      }
    }

    if (matchingPaths.length > 0) {
      overlaps.push({
        key: lock.key ?? pathLockKey(lockPaths),
        owner: lock.owner ?? "",
        state: lock.state ?? "active",
        paths: compactUnique(matchingPaths),
      });
    }
  }

  return overlaps;
}

function normalizeRunner(raw = {}) {
  const role = String(raw.role ?? raw.target ?? raw.name ?? "").toUpperCase();
  const status = normalizeText(raw.status ?? raw.runnerStatus ?? "online");
  const diskFreeGb = Number(raw.diskFreeGb ?? raw.freeDiskGb ?? raw.disk_free_gb ?? Infinity);
  const diskFloorGb = Number(raw.diskFloorGb ?? raw.disk_floor_gb ?? DEFAULT_POLICY.diskFloorGb);
  const staleWorkerProcess = Boolean(raw.staleWorkerProcess ?? raw.stale_worker_process);

  return {
    role,
    status,
    diskFreeGb,
    diskFloorGb,
    staleWorkerProcess,
    diskBelowFloor: Number.isFinite(diskFreeGb) && diskFreeGb < diskFloorGb,
    healthy: ["online", "idle", "available", "healthy"].includes(status) && !staleWorkerProcess && !(Number.isFinite(diskFreeGb) && diskFreeGb < diskFloorGb),
  };
}

export function evaluateMachineHealth(machineHealth = {}, policy = DEFAULT_POLICY) {
  const rawRunners = asArray(machineHealth.runners ?? machineHealth.runner ?? machineHealth);
  const runners = rawRunners.map((runner) => normalizeRunner({ diskFloorGb: policy.diskFloorGb, ...runner }));
  const riskFlags = [];

  for (const runner of runners) {
    if (runner.diskBelowFloor) riskFlags.push(`${runner.role || "RUNNER"}_DISK_BELOW_FLOOR`);
    if (runner.staleWorkerProcess) riskFlags.push(`${runner.role || "RUNNER"}_STALE_WORKER_PROCESS`);
    if (!["online", "idle", "available", "healthy"].includes(runner.status)) {
      riskFlags.push(`${runner.role || "RUNNER"}_RUNNER_${runner.status.toUpperCase() || "UNKNOWN"}`);
    }
  }

  return {
    runners,
    riskFlags,
    healthyTargets: runners.filter((runner) => runner.healthy).map((runner) => runner.role),
  };
}

function isManualOnlyCleanJob(job = {}) {
  const status = normalizeText(job.status);
  const when = normalizeText(job.when);
  return ["manual", "created", "skipped"].includes(status) && (when === "manual" || /prod|production|deploy/.test(normalizeText(`${job.name} ${job.stage}`)));
}

function isAutomaticFailure(job = {}) {
  const status = normalizeText(job.status);
  if (isManualOnlyCleanJob(job)) return false;
  return ["failed", "canceled", "cancelled", "timed_out"].includes(status);
}

export function evaluateCiState(ci = {}) {
  const latestMain = ci.latestMain ?? ci.latest_main ?? ci.mainPipeline ?? {};
  const jobs = asArray(latestMain.jobs);
  const failedAutomaticJobs = jobs.filter(isAutomaticFailure).map((job) => ({
    name: job.name ?? "unknown",
    status: job.status ?? "unknown",
  }));
  const manualOnlyClean = jobs.length > 0 && failedAutomaticJobs.length === 0;
  const pipelineStatus = normalizeText(latestMain.status);
  const pipelineClean = pipelineStatus ? ["success", "passed", "skipped"].includes(pipelineStatus) : null;

  return {
    saturated: Boolean(ci.gitlabSaturated ?? ci.gitlab_saturated ?? ci.saturated),
    mainClean: jobs.length > 0 ? manualOnlyClean : pipelineClean,
    failedAutomaticJobs,
    reason:
      failedAutomaticJobs.length > 0
        ? "latest main has a failed automatic job"
        : manualOnlyClean
          ? "latest main is clean; only manual/created/skipped deploy jobs remain"
          : pipelineClean === true
            ? "latest main pipeline status is clean"
            : pipelineClean === false
              ? `latest main pipeline status is ${latestMain.status}`
              : "no latest main CI data supplied",
  };
}

function preferredTarget(classification, machine) {
  if (classification.code === "A" || classification.code === "D") return "ADMIN";
  if (classification.code === "C") return machine.healthyTargets.includes("C4") ? "C4" : "ADMIN";
  if (machine.healthyTargets.includes("C2")) return "C2";
  if (machine.healthyTargets.includes("C4")) return "C4";
  return "ADMIN";
}

function dispatchDecision(target) {
  if (target === "C2") return DECISIONS.DISPATCH_TO_C2;
  if (target === "C4") return DECISIONS.DISPATCH_TO_C4;
  return DECISIONS.DISPATCH_TO_ADMIN;
}

export function evaluateDispatchGate(input = {}) {
  const job = input.job ?? input;
  const context = input.context ?? {};
  const policy = { ...DEFAULT_POLICY, ...(input.policy ?? context.policy ?? {}) };
  const paths = jobPaths(job);
  const classification = classifyJob(job);
  const duplicate = detectDuplicate(job, context);
  const pathLocks = detectPathLocks(paths, context.pathLocks ?? context.locks);
  const machine = evaluateMachineHealth(context.machineHealth ?? context.machine_health ?? {}, policy);
  const ci = evaluateCiState(context.ci ?? context.gitlab ?? {});
  const recommended_target = preferredTarget(classification, machine);
  const risk_flags = compactUnique([
    ...machine.riskFlags,
    ...classification.unsafePaths.map((match) => `UNSAFE_${match.rule.toUpperCase()}`),
    ...(duplicate.duplicate ? ["DUPLICATE_OR_STALE_JOB"] : []),
    ...(pathLocks.length > 0 ? ["ACTIVE_PATH_LOCK_OVERLAP"] : []),
    ...(ci.saturated ? ["GITLAB_SATURATED"] : []),
    ...(ci.failedAutomaticJobs.length > 0 ? ["MAIN_FAILED_AUTOMATIC_JOB"] : []),
  ]);
  const reasons = [classification.reason];
  let decision = dispatchDecision(recommended_target);

  if (classification.code === "D") {
    decision = job.ownerReview === true || job.ownerOverride === true ? highestDecision(decision, DECISIONS.HOLD_FOR_OWNER) : highestDecision(decision, DECISIONS.REJECT_UNSAFE);
    reasons.push("unsafe Type D scope requires owner handling before dispatch");
  }

  if (duplicate.duplicate) {
    decision = highestDecision(decision, DECISIONS.REJECT_DUPLICATE);
    reasons.push(duplicate.knownStaleKey ? `known stale duplicate ${duplicate.knownStaleKey}` : "same job, artifact, or MR already exists");
  }

  if (pathLocks.length > 0) {
    decision = highestDecision(decision, DECISIONS.HOLD_FOR_OWNER);
    reasons.push("active path lock overlaps requested paths");
  }

  if (ci.failedAutomaticJobs.length > 0) {
    decision = highestDecision(decision, DECISIONS.HOLD_FOR_OWNER);
    reasons.push("latest main failed in an automatic job");
  }

  if (ci.saturated && classification.code !== "A") {
    decision = highestDecision(decision, DECISIONS.WAIT);
    reasons.push("GitLab is saturated; only docs/report/evidence jobs may pass");
  }

  if (["C2", "C4"].includes(recommended_target) && !machine.healthyTargets.includes(recommended_target)) {
    decision = highestDecision(decision, DECISIONS.WAIT);
    reasons.push(`${recommended_target} is not currently healthy for dispatch`);
  }

  return {
    decision,
    reason: reasons.join("; "),
    job_type: classification.job_type,
    risk_flags,
    path_lock_key: pathLockKey(paths),
    recommended_target,
    details: {
      job_code: classification.code,
      unsafe_paths: classification.unsafePaths,
      duplicate,
      path_locks: pathLocks,
      machine_health: machine,
      ci,
    },
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

function readStdin() {
  if (process.stdin.isTTY) return "";
  return fs.readFileSync(0, "utf8").trim();
}

export function readCliInput(args = process.argv.slice(2)) {
  const filePath = argValue(args, "input") || argValue(args, "file") || args.find((arg) => !arg.startsWith("--"));
  if (filePath) return JSON.parse(fs.readFileSync(filePath, "utf8"));

  const inlineJson = argValue(args, "json");
  if (inlineJson) return JSON.parse(inlineJson);

  const stdin = readStdin();
  if (stdin) return JSON.parse(stdin);

  return { job: {} };
}

function main() {
  const result = evaluateDispatchGate(readCliInput());
  console.log(JSON.stringify(result, null, 2));

  if ([DECISIONS.REJECT_DUPLICATE, DECISIONS.REJECT_UNSAFE].includes(result.decision)) return 2;
  if ([DECISIONS.WAIT, DECISIONS.HOLD_FOR_OWNER].includes(result.decision)) return 1;
  return 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exitCode = main();
}
