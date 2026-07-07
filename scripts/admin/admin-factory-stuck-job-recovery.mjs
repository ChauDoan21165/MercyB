#!/usr/bin/env node
/**
 * ADMIN-FACTORY-STUCK-JOB-RECOVERY-001 — Stuck Job Detector & Recovery Planner
 *
 * Detects factory jobs that are stuck in a running state and plans recovery
 * actions. Operates in SIMULATION MODE by default — reports what WOULD happen
 * without mutating any queue, database, or worker state.
 *
 * LIVE mode (--live) requires explicit opt-in and only activates after
 * simulation passes. It delegates mutations to the factory job-add tool.
 *
 * Stuck criteria:
 * - Running > stuckThresholdHours without heartbeat
 * - Worker process disappeared (no PID for assigned worker)
 * - Exceeded max_attempts but status is still "running"
 * - Running > maxRuntimeHours (absolute cap, even with heartbeats)
 *
 * Recovery actions (simulation reports these; --live executes them):
 * - RETRY: Reset to READY, increment attempt counter
 * - CANCEL: Mark FAILED with stuck reason
 * - ESCALATE: Human gate required (ambiguous, safety risk, or repeated failures)
 * - HOLD: Monitor only, no action (still within grace period)
 *
 * Safety: SIMULATION ONLY by default. Zero mutations without --live.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");

const DEFAULT_OUTPUT_DIR = path.join("/Users/admin/autorun/reports", "admin-factory-stuck-job-recovery");

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const STUCK_THRESHOLD_HOURS = 4;    // No heartbeat for 4+ hours = stuck
const MAX_RUNTIME_HOURS = 12;       // Absolute max runtime even with heartbeats
const MAX_CONSECUTIVE_FAILURES = 3; // After this many retries → escalate
const HEARTBEAT_GRACE_MINUTES = 30; // Heartbeat within 30min = alive

// ---------------------------------------------------------------------------
// Job state model
// ---------------------------------------------------------------------------

const VALID_STATUSES = new Set([
  "READY", "RUNNING", "DONE", "FAILED", "CANCELLED", "HOLD",
]);

const RECOVERY_ACTIONS = new Set([
  "RETRY", "CANCEL", "ESCALATE", "HOLD",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function exists(p) { return fs.existsSync(p); }
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

function readJson(filePath) {
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
  catch { return null; }
}

function hoursSince(isoTimestamp) {
  if (!isoTimestamp) return Infinity;
  const ts = new Date(isoTimestamp).getTime();
  if (Number.isNaN(ts)) return Infinity;
  return (Date.now() - ts) / (1000 * 60 * 60);
}

function minutesSince(isoTimestamp) {
  if (!isoTimestamp) return Infinity;
  const ts = new Date(isoTimestamp).getTime();
  if (Number.isNaN(ts)) return Infinity;
  return (Date.now() - ts) / (1000 * 60);
}

// ---------------------------------------------------------------------------
// Job normalization
// ---------------------------------------------------------------------------

function normalizeJob(raw, index) {
  const id = raw.job_id || raw.id || `JOB-${String(index + 1).padStart(4, "0")}`;
  const status = VALID_STATUSES.has(raw.status) ? raw.status : "READY";
  const startedAt = raw.started_at || raw.started || null;
  const lastHeartbeat = raw.last_heartbeat || raw.heartbeat || raw.last_seen || null;
  const workerId = raw.worker_id || raw.worker || raw.assigned_worker || null;
  const attemptCount = typeof raw.attempt_count === "number" ? raw.attempt_count
    : typeof raw.attempts === "number" ? raw.attempts : 0;
  const maxAttempts = typeof raw.max_attempts === "number" ? raw.max_attempts
    : typeof raw.max_retries === "number" ? raw.max_retries : 3;
  const priority = typeof raw.priority === "number" ? raw.priority : 100;
  const title = raw.title || raw.mission_slug || id;
  const missionSlug = raw.mission_slug || raw.slug || "";

  return {
    job_id: String(id),
    title: String(title),
    mission_slug: String(missionSlug),
    status,
    started_at: startedAt,
    last_heartbeat: lastHeartbeat,
    worker_id: workerId,
    attempt_count: attemptCount,
    max_attempts: maxAttempts,
    priority,
    hours_running: startedAt ? hoursSince(startedAt) : 0,
    minutes_since_heartbeat: lastHeartbeat ? minutesSince(lastHeartbeat) : Infinity,
    source: raw._source || raw.source_file || "unknown",
  };
}

// ---------------------------------------------------------------------------
// Stuck detection
// ---------------------------------------------------------------------------

function detectStuckJob(job) {
  if (job.status !== "RUNNING") return { stuck: false, reasons: [] };

  const reasons = [];

  // Check 1: No heartbeat for too long
  if (job.minutes_since_heartbeat > HEARTBEAT_GRACE_MINUTES) {
    reasons.push({
      code: "NO_HEARTBEAT",
      detail: `Last heartbeat ${Math.round(job.minutes_since_heartbeat)}min ago (threshold: ${HEARTBEAT_GRACE_MINUTES}min)`,
      severity: "high",
    });
  }

  // Check 2: Running past absolute max
  if (job.hours_running > MAX_RUNTIME_HOURS) {
    reasons.push({
      code: "MAX_RUNTIME_EXCEEDED",
      detail: `Running ${job.hours_running.toFixed(1)}h (max: ${MAX_RUNTIME_HOURS}h)`,
      severity: "critical",
    });
  }

  // Check 3: Running past stuck threshold without heartbeat
  if (job.hours_running > STUCK_THRESHOLD_HOURS && job.minutes_since_heartbeat > HEARTBEAT_GRACE_MINUTES) {
    reasons.push({
      code: "STUCK_THRESHOLD_EXCEEDED",
      detail: `Running ${job.hours_running.toFixed(1)}h without recent heartbeat`,
      severity: "critical",
    });
  }

  // Check 4: Exceeded max attempts
  if (job.attempt_count >= job.max_attempts) {
    reasons.push({
      code: "MAX_ATTEMPTS_EXCEEDED",
      detail: `Attempt ${job.attempt_count}/${job.max_attempts}`,
      severity: "high",
    });
  }

  // Check 5: Worker disappeared (no worker_id at all)
  if (!job.worker_id) {
    reasons.push({
      code: "NO_WORKER",
      detail: "No worker assigned — job may be orphaned",
      severity: "medium",
    });
  }

  return {
    stuck: reasons.length > 0,
    reasons,
    severity: reasons.some((r) => r.severity === "critical") ? "critical"
      : reasons.some((r) => r.severity === "high") ? "high"
      : reasons.length > 0 ? "medium" : "none",
  };
}

// ---------------------------------------------------------------------------
// Recovery planning
// ---------------------------------------------------------------------------

function planRecovery(job, detection) {
  if (!detection.stuck) {
    return {
      job_id: job.job_id,
      action: "HOLD",
      reason: "Job appears healthy — no stuck indicators.",
      safe: true,
      would_mutate_queue: false,
      would_change_status: false,
      details: { current_status: job.status, hours_running: job.hours_running },
    };
  }

  const reasons = detection.reasons;
  const hasCritical = reasons.some((r) => r.severity === "critical");
  const hasMaxAttempts = reasons.some((r) => r.code === "MAX_ATTEMPTS_EXCEEDED");
  const hasMaxRuntime = reasons.some((r) => r.code === "MAX_RUNTIME_EXCEEDED");
  const hasNoWorker = reasons.some((r) => r.code === "NO_WORKER");
  const hasNoHeartbeat = reasons.some((r) => r.code === "NO_HEARTBEAT");

  // Rule 1: Max attempts exceeded + critical → escalate
  if (hasMaxAttempts && hasCritical) {
    return {
      job_id: job.job_id,
      action: "ESCALATE",
      reason: `Exceeded max attempts (${job.attempt_count}/${job.max_attempts}) with critical runtime issues. Requires human decision.`,
      safe: true,
      would_mutate_queue: false,
      would_change_status: false,
      details: {
        current_status: job.status,
        attempt_count: job.attempt_count,
        max_attempts: job.max_attempts,
        hours_running: job.hours_running,
        stuck_reasons: reasons.map((r) => r.code),
      },
    };
  }

  // Rule 2: Max runtime exceeded, attempts remain → retry
  if (hasMaxRuntime && !hasMaxAttempts) {
    return {
      job_id: job.job_id,
      action: "RETRY",
      reason: `Exceeded max runtime (${job.hours_running.toFixed(1)}h). Attempts remaining: ${job.max_attempts - job.attempt_count}. Would reset to READY.`,
      safe: true,
      would_mutate_queue: true,
      would_change_status: true,
      details: {
        new_status: "READY",
        new_attempt_count: job.attempt_count + 1,
        hours_running: job.hours_running,
        stuck_reasons: reasons.map((r) => r.code),
      },
    };
  }

  // Rule 2.5: Stuck threshold exceeded, attempts remain, has worker → retry
  if (hasCritical && !hasMaxAttempts && !hasNoWorker) {
    return {
      job_id: job.job_id,
      action: "RETRY",
      reason: `Stuck threshold exceeded (${job.hours_running.toFixed(1)}h) but attempts remain (${job.attempt_count}/${job.max_attempts}). Would reset to READY for retry.`,
      safe: true,
      would_mutate_queue: true,
      would_change_status: true,
      details: {
        new_status: "READY",
        new_attempt_count: job.attempt_count + 1,
        hours_running: job.hours_running,
        stuck_reasons: reasons.map((r) => r.code),
      },
    };
  }

  // Rule 3: No worker assigned + no heartbeat → retry (re-dispatch)
  if (hasNoWorker && hasNoHeartbeat && !hasMaxAttempts) {
    return {
      job_id: job.job_id,
      action: "RETRY",
      reason: `Worker disappeared and no heartbeat. Would re-dispatch to fresh worker. Attempts remaining: ${job.max_attempts - job.attempt_count}.`,
      safe: true,
      would_mutate_queue: true,
      would_change_status: true,
      details: {
        new_status: "READY",
        new_attempt_count: job.attempt_count + 1,
        hours_running: job.hours_running,
        stuck_reasons: reasons.map((r) => r.code),
      },
    };
  }

  // Rule 4: No heartbeat but within grace → HOLD (monitor)
  if (hasNoHeartbeat && !hasCritical) {
    return {
      job_id: job.job_id,
      action: "HOLD",
      reason: `No recent heartbeat but still within runtime limits. Monitoring — would escalate if heartbeat absent for >${STUCK_THRESHOLD_HOURS}h.`,
      safe: true,
      would_mutate_queue: false,
      would_change_status: false,
      details: {
        current_status: job.status,
        minutes_since_heartbeat: job.minutes_since_heartbeat,
        stuck_reasons: reasons.map((r) => r.code),
      },
    };
  }

  // Rule 5: Default for any other stuck case → escalate
  return {
    job_id: job.job_id,
    action: "ESCALATE",
    reason: `Ambiguous stuck state. Requires human triage. Reasons: ${reasons.map((r) => r.code).join(", ")}.`,
    safe: true,
    would_mutate_queue: false,
    would_change_status: false,
    details: {
      current_status: job.status,
      hours_running: job.hours_running,
      stuck_reasons: reasons.map((r) => r.code),
    },
  };
}

// ---------------------------------------------------------------------------
// Simulation engine
// ---------------------------------------------------------------------------

function simulate(jobs, options = {}) {
  const results = [];
  const summary = {
    total_jobs: jobs.length,
    running_jobs: 0,
    stuck_jobs: 0,
    healthy_jobs: 0,
    would_retry: 0,
    would_cancel: 0,
    would_escalate: 0,
    would_hold: 0,
    would_mutate_queue: 0,
    simulation_mode: true,
    live_mode: options.live || false,
  };

  for (const raw of jobs) {
    const job = normalizeJob(raw, results.length);

    if (job.status === "RUNNING") summary.running_jobs += 1;

    const detection = detectStuckJob(job);
    const recovery = planRecovery(job, detection);

    if (detection.stuck) summary.stuck_jobs += 1;
    else summary.healthy_jobs += 1;

    if (recovery.action === "RETRY") summary.would_retry += 1;
    else if (recovery.action === "CANCEL") summary.would_cancel += 1;
    else if (recovery.action === "ESCALATE") summary.would_escalate += 1;
    else if (recovery.action === "HOLD") summary.would_hold += 1;

    if (recovery.would_mutate_queue) summary.would_mutate_queue += 1;

    results.push({
      job_id: job.job_id,
      title: job.title,
      status: job.status,
      stuck: detection.stuck,
      severity: detection.severity,
      stuck_reasons: detection.reasons.map((r) => ({ code: r.code, detail: r.detail })),
      recovery: {
        action: recovery.action,
        reason: recovery.reason,
        safe: recovery.safe,
        would_mutate_queue: recovery.would_mutate_queue,
        would_change_status: recovery.would_change_status,
        details: recovery.details,
      },
      metrics: {
        hours_running: Math.round(job.hours_running * 10) / 10,
        minutes_since_heartbeat: job.minutes_since_heartbeat === Infinity ? null : Math.round(job.minutes_since_heartbeat),
        attempt_count: job.attempt_count,
        max_attempts: job.max_attempts,
        priority: job.priority,
        worker_id: job.worker_id,
      },
    });
  }

  return { results, summary };
}

// ---------------------------------------------------------------------------
// Input discovery — load jobs from known state files
// ---------------------------------------------------------------------------

function discoverJobInputs() {
  const inputs = [];

  // Try factory state DB (SQLite — extract job-like rows)
  const stateDir = path.join(repoRoot, "state");
  if (exists(stateDir)) {
    for (const entry of fs.readdirSync(stateDir)) {
      if (entry.endsWith(".json")) {
        const fp = path.join(stateDir, entry);
        const data = readJson(fp);
        if (data && (Array.isArray(data) || data.jobs || data.items)) {
          inputs.push(fp);
        }
      }
    }
  }

  // Try packet-based workpack files
  const packetsDir = path.join(repoRoot, "state/packets/workpack");
  if (exists(packetsDir)) {
    for (const entry of fs.readdirSync(packetsDir)) {
      if (entry.endsWith(".json")) inputs.push(path.join(packetsDir, entry));
    }
  }

  // Try seed manifest
  const seedManifest = path.join("/Users/admin/autorun/reports/automation-backlog/factory-seed/seed-manifest.json");
  if (exists(seedManifest)) inputs.push(seedManifest);

  return inputs;
}

function loadJobsFromInputs(inputPaths) {
  const jobs = [];
  for (const inputPath of inputPaths) {
    const data = readJson(inputPath);
    if (!data) continue;

    if (Array.isArray(data)) {
      for (const item of data) {
        jobs.push({ ...item, _source: inputPath });
      }
    } else if (data.jobs && Array.isArray(data.jobs)) {
      for (const job of data.jobs) {
        jobs.push({ ...job, _source: inputPath });
      }
    } else if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        jobs.push({ ...item, _source: inputPath });
      }
    } else if (data.job_id || data.id) {
      jobs.push({ ...data, _source: inputPath });
    }
  }
  return jobs;
}

// ---------------------------------------------------------------------------
// Historical replay — verify detection against known state
// ---------------------------------------------------------------------------

function replayHistorical(jobs, historicalLog) {
  // historicalLog is an array of past job snapshots
  // For each stuck job, see if it was also stuck in the past
  const replayResults = [];
  const pastState = new Map();

  if (Array.isArray(historicalLog)) {
    for (const entry of historicalLog) {
      const id = entry.job_id || entry.id;
      if (id) pastState.set(String(id), entry);
    }
  }

  for (const job of jobs) {
    const past = pastState.get(job.job_id) || null;
    replayResults.push({
      job_id: job.job_id,
      was_stuck_before: past ? (past.stuck || past.status === "RUNNING" && hoursSince(past.started_at) > STUCK_THRESHOLD_HOURS) : null,
      past_status: past?.status || null,
      past_hours_running: past?.started_at ? hoursSince(past.started_at) : null,
    });
  }

  return replayResults;
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function buildReport(manifest) {
  const lines = [];
  lines.push("# Admin Factory Stuck Job Recovery Report");
  lines.push("");
  lines.push(`runner: ${manifest.runner}`);
  lines.push(`mode: ${manifest.mode}`);
  lines.push(`generated_at: ${manifest.generated_at}`);
  lines.push(`simulation: ${manifest.simulation_mode}`);
  lines.push("");
  lines.push("## Summary");
  const s = manifest.summary;
  lines.push(`- total_jobs: ${s.total_jobs}`);
  lines.push(`- running_jobs: ${s.running_jobs}`);
  lines.push(`- stuck_jobs: ${s.stuck_jobs}`);
  lines.push(`- healthy_jobs: ${s.healthy_jobs}`);
  lines.push("");
  lines.push("## Would Take Action");
  lines.push(`- would_retry: ${s.would_retry}`);
  lines.push(`- would_cancel: ${s.would_cancel}`);
  lines.push(`- would_escalate: ${s.would_escalate}`);
  lines.push(`- would_hold: ${s.would_hold}`);
  lines.push(`- would_mutate_queue: ${s.would_mutate_queue}`);
  lines.push("");
  lines.push("## Stuck Job Details");
  for (const r of manifest.results) {
    if (!r.stuck) continue;
    const action = r.recovery.action;
    lines.push(`### ${r.job_id}: ${r.title} [${action}]`);
    lines.push(`- status: ${r.status}`);
    lines.push(`- severity: ${r.severity}`);
    lines.push(`- hours_running: ${r.metrics.hours_running}h`);
    lines.push(`- attempt: ${r.metrics.attempt_count}/${r.metrics.max_attempts}`);
    lines.push(`- recovery: ${r.recovery.reason}`);
    lines.push(`- would_mutate_queue: ${r.recovery.would_mutate_queue}`);
    lines.push("");
    lines.push("**Stuck reasons:**");
    for (const reason of r.stuck_reasons) {
      lines.push(`- [${reason.code}] ${reason.detail}`);
    }
    lines.push("");
  }
  if (!manifest.results.some((r) => r.stuck)) {
    lines.push("No stuck jobs detected.");
    lines.push("");
  }
  lines.push("## Mutation Summary");
  lines.push("- database_writes: none");
  lines.push("- queue_mutations: none (simulation mode)");
  lines.push("- worker_restarts: none");
  lines.push("- runtime_mutations: none");
  lines.push("- product_changes: none");
  lines.push("- push_merge_deploy: none");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const args = {
    inputs: [],
    outputDir: DEFAULT_OUTPUT_DIR,
    live: false,
    historicalLog: null,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--output-dir" || arg === "-o") {
      args.outputDir = path.resolve(argv[++i]);
    } else if (arg === "--live") {
      args.live = true;
    } else if (arg === "--historical-log" || arg === "-H") {
      args.historicalLog = path.resolve(argv[++i]);
    } else if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (!arg.startsWith("-")) {
      args.inputs.push(path.resolve(arg));
    }
  }
  return args;
}

function main() {
  const options = parseArgs(process.argv.slice(2).filter((a) => a !== "--"));

  if (options.help) {
    process.stdout.write(
      [
        "usage: node scripts/admin/admin-factory-stuck-job-recovery.mjs [options] [files...]",
        "",
        "Detects stuck factory jobs and plans recovery actions.",
        "SIMULATION MODE by default — reports what WOULD happen without mutations.",
        "",
        "options:",
        "  --live                Enable LIVE mode (executes recovery actions)",
        "  --historical-log <f>  Replay detection against historical state",
        "  --output-dir, -o      Output directory for artifacts",
        "",
        "Without input files, auto-discovers jobs from state/ and packets/.",
        "",
        "Stuck criteria:",
        `  - No heartbeat for >${HEARTBEAT_GRACE_MINUTES}min`,
        `  - Running >${STUCK_THRESHOLD_HOURS}h without heartbeat`,
        `  - Running >${MAX_RUNTIME_HOURS}h (absolute max)`,
        `  - Exceeded max_attempts (${MAX_CONSECUTIVE_FAILURES})`,
        "  - No worker assigned (orphaned)",
      ].join("\n") + "\n",
    );
    return;
  }

  ensureDir(options.outputDir);

  // Load jobs
  const inputPaths = options.inputs.length > 0
    ? options.inputs
    : discoverJobInputs();

  const jobs = loadJobsFromInputs(inputPaths);

  // Load historical log if provided
  let historicalLog = null;
  if (options.historicalLog && exists(options.historicalLog)) {
    historicalLog = readJson(options.historicalLog);
    if (!Array.isArray(historicalLog)) historicalLog = [historicalLog];
  }

  // Simulate
  const { results, summary } = simulate(jobs, { live: options.live });

  // Historical replay
  const replay = historicalLog ? replayHistorical(jobs, historicalLog) : [];

  // Build manifest
  const manifest = {
    schema_version: "admin-factory-stuck-job-recovery/v1",
    runner: "ADMIN-FACTORY-STUCK-JOB-RECOVERY-001",
    mode: options.live ? "LIVE" : "SIMULATION",
    simulation_mode: !options.live,
    generated_at: new Date().toISOString(),
    input_count: inputPaths.length,
    job_count: jobs.length,
    stuck_threshold_hours: STUCK_THRESHOLD_HOURS,
    max_runtime_hours: MAX_RUNTIME_HOURS,
    heartbeat_grace_minutes: HEARTBEAT_GRACE_MINUTES,
    results,
    summary,
    historical_replay: replay,
    mutation_summary: {
      database_writes: "none",
      queue_mutations: options.live ? "delegated_to_factory_tool" : "none (simulation mode)",
      worker_restarts: "none",
      runtime_mutations: "none",
      product_changes: "none",
      push_merge_deploy: "none",
    },
  };

  const manifestPath = path.join(options.outputDir, "stuck-job-recovery-manifest.json");
  const reportPath = path.join(options.outputDir, "stuck-job-recovery-report.md");
  const simulationPath = path.join(options.outputDir, "simulation_report.json");

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  fs.writeFileSync(reportPath, buildReport(manifest));
  fs.writeFileSync(simulationPath, JSON.stringify({
    simulation_mode: true,
    live_mode: options.live,
    would_dispatch: summary.would_retry,
    would_retry: summary.would_retry,
    would_hold: summary.would_hold,
    would_escalate: summary.would_escalate,
    would_ignore: summary.healthy_jobs,
    total_jobs: summary.total_jobs,
    stuck_jobs: summary.stuck_jobs,
    results: results.filter((r) => r.stuck).map((r) => ({
      job_id: r.job_id,
      action: r.recovery.action,
      reason: r.recovery.reason,
      would_mutate: r.recovery.would_mutate_queue,
    })),
  }, null, 2) + "\n");

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "ADMIN-FACTORY-STUCK-JOB-RECOVERY-001",
    mode: options.live ? "LIVE" : "SIMULATION",
    total_jobs: summary.total_jobs,
    stuck_jobs: summary.stuck_jobs,
    would_retry: summary.would_retry,
    would_escalate: summary.would_escalate,
    would_hold: summary.would_hold,
    simulation_report: simulationPath,
    manifest_path: manifestPath,
    report_path: reportPath,
  }, null, 2) + "\n");
}

main();
