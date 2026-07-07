#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const defaultOutputDir = "/Users/admin/autorun/reports/automation-backlog/factory-seed";
const defaultJobAddTool = "/Users/admin/autorun/bin/mf-factory-job-add";
const defaultWorkDir = "/Users/admin/MercyB";

function stableJsonValue(value) {
  if (Array.isArray(value)) return value.map(stableJsonValue);
  if (!value || typeof value !== "object") return value;
  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = stableJsonValue(value[key]);
      return acc;
    }, {});
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(stableJsonValue(value), null, 2)}\n`);
}

function writeText(filePath, text) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, text.endsWith("\n") ? text : `${text}\n`);
}

function sha256(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

function parseArgs(argv) {
  const args = {
    input: null,
    outputDir: defaultOutputDir,
    dryRun: true,
    emitPrompts: false,
    applyJobs: false,
    jobAddTool: defaultJobAddTool,
    workDir: defaultWorkDir,
  };
  let sawDryRun = false;
  let sawApplyJobs = false;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => {
      i += 1;
      if (i >= argv.length) throw new Error(`missing value for ${arg}`);
      return argv[i];
    };

    if (arg === "--input") args.input = next();
    else if (arg === "--output-dir") args.outputDir = next();
    else if (arg === "--emit-prompts") args.emitPrompts = true;
    else if (arg === "--apply-jobs") {
      sawApplyJobs = true;
      args.applyJobs = true;
      args.dryRun = false;
    } else if (arg === "--dry-run") {
      sawDryRun = true;
      args.dryRun = true;
    }
    else if (arg === "--job-add-tool") args.jobAddTool = next();
    else if (arg === "--work-dir") args.workDir = next();
    else if (arg === "--help" || arg === "-h") args.help = true;
    else throw new Error(`unknown argument: ${arg}`);
  }

  if (sawDryRun && sawApplyJobs) throw new Error("cannot combine --dry-run and --apply-jobs");

  return args;
}

function usage() {
  return [
    "Usage: node scripts/admin/aak-factory-seeder.mjs --input backlog.json [--output-dir dir] [--emit-prompts] [--apply-jobs]",
    "",
    "Defaults to dry-run. DB writes happen only with --apply-jobs, delegated to /Users/admin/autorun/bin/mf-factory-job-add.",
  ].join("\n");
}

function readBacklog(inputPath) {
  const raw = fs.readFileSync(inputPath, "utf8");
  const trimmed = raw.trim();
  if (!trimmed) return { raw, items: [] };

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return { raw, items: parsed };
    for (const key of ["items", "backlog", "workpacks", "approved", "approved_items"]) {
      if (Array.isArray(parsed[key])) return { raw, items: parsed[key] };
    }
    return { raw, items: [parsed] };
  }

  const items = trimmed
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => JSON.parse(line));
  return { raw, items };
}

function isApproved(item) {
  if (!item || typeof item !== "object") return false;
  if (item.approved === true || item.seed_approved === true || item.factory_approved === true) return true;
  const values = [item.status, item.state, item.approval, item.approval_status, item.decision]
    .filter((value) => typeof value === "string")
    .map((value) => value.trim().toLowerCase());
  return values.some((value) => ["approved", "accepted", "ready", "ready_to_seed", "approved_for_seeding"].includes(value));
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function asStringArray(value) {
  if (Array.isArray(value)) return value.map((entry) => String(entry));
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

function field(item, names, fallback = "") {
  for (const name of names) {
    if (item[name] !== undefined && item[name] !== null && String(item[name]).trim() !== "") return item[name];
  }
  return fallback;
}

function buildPromptText(job) {
  const lines = [];
  lines.push(`# ${job.id}`);
  lines.push("");
  lines.push(`Mission slug: ${job.mission_slug}`);
  lines.push(`Title: ${job.title}`);
  if (job.owner) lines.push(`Owner: ${job.owner}`);
  if (job.scope) lines.push(`Scope: ${job.scope}`);
  lines.push("");
  lines.push("## Brief");
  lines.push(job.brief);
  lines.push("");
  lines.push("## Acceptance");
  if (job.acceptance.length) {
    for (const criterion of job.acceptance) lines.push(`- ${criterion}`);
  } else {
    lines.push("- deterministic seed output exists");
  }
  lines.push("");
  lines.push("## Safety");
  lines.push("- no deploy");
  lines.push("- no auto merge");
  lines.push("- no product DB writes");
  return lines.join("\n");
}

function normalizeItem(item, index, options) {
  const id = String(field(item, ["id", "wp_id", "job_id", "slug", "mission_slug"], `BACKLOG-ITEM-${String(index + 1).padStart(3, "0")}`));
  const missionSlug = String(field(item, ["mission_slug", "slug"], slugify(id)));
  const title = String(field(item, ["title", "name"], id));
  const owner = String(field(item, ["owner"], ""));
  const scope = String(field(item, ["scope", "required_fix", "summary"], ""));
  const acceptance = [
    ...asStringArray(item.acceptance),
    ...asStringArray(item.acceptance_criteria),
    ...asStringArray(item.acceptance_gates),
  ];
  const brief = String(field(item, ["brief", "prompt", "description", "scope"], scope || title));
  const priorityRaw = Number(field(item, ["priority"], 100));
  const priority = Number.isFinite(priorityRaw) ? priorityRaw : 100;
  const artifactPath = String(field(item, ["artifact_path", "done_path"], ""));
  const promptFile = `${id}.prompt.md`;
  const plannedPromptPath = path.join(options.outputDir, "prompts", promptFile);
  const job = {
    id,
    mission_slug: missionSlug,
    title,
    owner,
    scope,
    brief,
    acceptance,
    priority,
    max_attempts: Number.isFinite(Number(item.max_attempts)) ? Number(item.max_attempts) : 3,
    work_dir: String(field(item, ["work_dir"], options.workDir)),
    artifact_path: artifactPath,
    source_prompt_path: typeof item.prompt_path === "string" ? item.prompt_path : "",
    planned_prompt_path: plannedPromptPath,
    prompt_sha256: "",
  };
  const promptText = typeof item.prompt_text === "string" ? item.prompt_text : buildPromptText(job);
  job.prompt_sha256 = sha256(promptText);
  return { job, promptText };
}

function buildManifest(inputPath, rawInput, items, options) {
  const approved = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => isApproved(item))
    .map(({ item, index }) => normalizeItem(item, index, options))
    .sort((a, b) => a.job.id.localeCompare(b.job.id));

  const jobs = approved.map(({ job }) => ({
    ...job,
    job_add_args: [
      "--mission-slug",
      job.mission_slug,
      "--title",
      job.title,
      "--brief",
      job.brief,
      "--artifact-path",
      job.artifact_path,
      "--work-dir",
      job.work_dir,
      "--priority",
      String(job.priority),
      "--max-attempts",
      String(job.max_attempts),
    ],
  }));

  return {
    schema_version: "aak-factory-seed-manifest/v1",
    runner: "AAK-FACTORY-SEEDER-001",
    input_path: path.resolve(inputPath),
    input_sha256: sha256(rawInput),
    dry_run: options.dryRun,
    emit_prompts: options.emitPrompts,
    apply_jobs: options.applyJobs,
    job_add_tool: options.jobAddTool,
    source_item_count: items.length,
    approved_item_count: jobs.length,
    skipped_item_count: items.length - jobs.length,
    database_writes: options.applyJobs ? "delegated_to_local_factory_tool" : "none",
    prompt_writes: options.emitPrompts ? "enabled" : "none",
    jobs,
  };
}

function buildReport(manifest, applyResults) {
  const lines = [];
  lines.push("# AAK Factory Seeder Report");
  lines.push("");
  lines.push(`schema_version: ${manifest.schema_version}`);
  lines.push(`input_path: ${manifest.input_path}`);
  lines.push(`source_item_count: ${manifest.source_item_count}`);
  lines.push(`approved_item_count: ${manifest.approved_item_count}`);
  lines.push(`skipped_item_count: ${manifest.skipped_item_count}`);
  lines.push(`dry_run: ${manifest.dry_run}`);
  lines.push(`emit_prompts: ${manifest.emit_prompts}`);
  lines.push(`apply_jobs: ${manifest.apply_jobs}`);
  lines.push(`database_writes: ${manifest.database_writes}`);
  lines.push("");
  lines.push("## Jobs");
  if (!manifest.jobs.length) {
    lines.push("- none");
  } else {
    for (const job of manifest.jobs) {
      lines.push(`- ${job.id}: mission_slug=${job.mission_slug}; priority=${job.priority}; prompt=${job.planned_prompt_path}; artifact=${job.artifact_path || "none"}`);
    }
  }
  lines.push("");
  lines.push("## Apply Results");
  if (!applyResults.length) {
    lines.push("- none");
  } else {
    for (const result of applyResults) {
      lines.push(`- ${result.id}: status=${result.status}; exit_code=${result.exit_code}; stdout=${result.stdout || "none"}; stderr=${result.stderr || "none"}`);
    }
  }
  lines.push("");
  lines.push("## Safety");
  lines.push("- dry-run is the default");
  lines.push("- DB writes require --apply-jobs");
  lines.push("- DB writes are delegated to the configured local factory job-add tool");
  lines.push("- source text is copied as provided; no translation or rewriting is performed");
  return lines.join("\n");
}

function applyJobs(manifest) {
  if (!manifest.apply_jobs) return [];
  if (!fs.existsSync(manifest.job_add_tool)) {
    throw new Error(`job-add tool not found: ${manifest.job_add_tool}`);
  }

  return manifest.jobs.map((job) => {
    const result = spawnSync(manifest.job_add_tool, job.job_add_args, { encoding: "utf8" });
    return {
      id: job.id,
      status: result.status === 0 ? "applied" : "failed",
      exit_code: result.status,
      stdout: (result.stdout || "").trim(),
      stderr: (result.stderr || "").trim(),
    };
  });
}

function main() {
  try {
    const options = parseArgs(process.argv.slice(2).filter((arg) => arg !== "--"));
    if (options.help) {
      process.stdout.write(`${usage()}\n`);
      return;
    }
    if (!options.input) throw new Error("--input is required");
    options.outputDir = path.resolve(options.outputDir);
    options.input = path.resolve(options.input);
    options.jobAddTool = path.resolve(options.jobAddTool);

    const { raw, items } = readBacklog(options.input);
    const normalized = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => isApproved(item))
      .map(({ item, index }) => normalizeItem(item, index, options))
      .sort((a, b) => a.job.id.localeCompare(b.job.id));
    const manifest = buildManifest(options.input, raw, items, options);

    if (options.emitPrompts) {
      for (const entry of normalized) writeText(entry.job.planned_prompt_path, entry.promptText);
    }

    const applyResults = applyJobs(manifest);
    const manifestPath = path.join(options.outputDir, "seed-manifest.json");
    const reportPath = path.join(options.outputDir, "seed-report.md");
    const summaryPath = path.join(options.outputDir, "dry-run-summary.json");
    const summary = {
      ok: applyResults.every((result) => result.status === "applied"),
      dry_run: options.dryRun,
      source_item_count: manifest.source_item_count,
      approved_item_count: manifest.approved_item_count,
      skipped_item_count: manifest.skipped_item_count,
      manifest_path: manifestPath,
      report_path: reportPath,
      prompt_dir: path.join(options.outputDir, "prompts"),
      database_writes: manifest.database_writes,
      applied_job_count: applyResults.filter((result) => result.status === "applied").length,
    };

    writeJson(manifestPath, manifest);
    writeText(reportPath, buildReport(manifest, applyResults));
    writeJson(summaryPath, summary);
    process.stdout.write(`${JSON.stringify(stableJsonValue(summary), null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${String(error?.message ?? error)}\n`);
    process.exitCode = 1;
  }
}

main();
