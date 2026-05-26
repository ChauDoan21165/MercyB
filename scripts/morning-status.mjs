#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = { owner: "ChauDoan21165", name: "MercyB" };
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const SCHEMA_VERSION = "mb-status/v1";
export const EXIT = { PASSING_OR_UNKNOWN: 0, OPERATIONAL_FAILURE: 1, INVALID_STATUS_CONFIGURATION: 3 };
export const EXIT_REASON = { 0: "PASSING_OR_UNKNOWN", 1: "OPERATIONAL_FAILURE", 3: "INVALID_STATUS_CONFIGURATION" };
export const SERVICE = { PASS: "PASS", FAIL: "FAIL", UNKNOWN: "STATUS UNKNOWN" };
export const REQUIRED_SCRIPTS = ["mb:status", "typecheck:app", "build"];
export const OPTIONAL_SCRIPTS = ["test:mobile-audio", "validate:tests", "test:resume"];
export const SCRIPT_NAMES = ["mb:status", "test:mobile-audio", "test:resume", "validate:tests", "typecheck:app", "build"];
export const SECTIONS = ["MercyB Morning Status", "Run Info", "Git", "Package Scripts", "GitHub", "Actions", "Vercel", "Supabase", "Azure Speech", "Local Validation", "Mobile Audio", "Build Readiness", "Top Blockers", "Next Actions", "Exit Summary"];
const MOBILE_RUNTIME = ["src/lib/speech/mobileSafariSpeakingRuntime.ts", "src/lib/speech/mobileSafariSpeakingRuntime.tsx", "src/lib/speech/mobileSafariSpeakingRuntime.mjs"];
const MOBILE_UI = ["src/components/mercy-guide/MercySpeakTab.tsx", "src/components/mercy-guide/MercySpeakTab.jsx"];

export function loadEnvFiles(root = ROOT, base = process.env) {
  const env = { ...base };
  for (const file of [".env", ".env.local", ".env.validation", ".vercel/.env.production.local"]) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
      if (!line.trim() || line.trim().startsWith("#")) continue;
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (match && (env[match[1]] == null || env[match[1]] === "")) env[match[1]] = unquote(match[2]);
    }
  }
  return env;
}

export function readPackageScripts(root = ROOT) {
  try {
    const parsed = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
    if (!parsed || typeof parsed !== "object" || !parsed.scripts || typeof parsed.scripts !== "object" || Array.isArray(parsed.scripts)) return { scripts: {}, errors: [blocker("Package Scripts", "INVALID_STATUS_CONFIGURATION", "Restore package.json scripts object.")] };
    return { scripts: parsed.scripts, errors: [] };
  } catch (error) {
    return { scripts: {}, errors: [blocker("Package Scripts", "INVALID_STATUS_CONFIGURATION", `Fix package.json parsing: ${redact(error.message)}`)] };
  }
}

export function classifyPackageScripts(scripts = {}) {
  return Object.fromEntries(SCRIPT_NAMES.map((name) => {
    const required = REQUIRED_SCRIPTS.includes(name);
    const present = Boolean(scripts[name]);
    return [name, { status: required ? present ? "REQUIRED_PRESENT" : "REQUIRED_MISSING" : present ? "OPTIONAL_PRESENT" : "OPTIONAL_MISSING", required, present }];
  }));
}

export function parseGitStatus(branchOutput, porcelain, aheadBehindOutput = "") {
  if (typeof branchOutput !== "string" || typeof porcelain !== "string" || typeof aheadBehindOutput !== "string") throw new Error("malformed git output");
  const lines = porcelain ? porcelain.split(/\r?\n/).filter(Boolean) : [];
  let stagedCount = 0, unstagedCount = 0, untrackedCount = 0;
  for (const line of lines) {
    if (!/^.{2}\s/.test(line)) throw new Error("malformed git output");
    if (line.startsWith("??")) untrackedCount += 1;
    else {
      if (line[0] !== " ") stagedCount += 1;
      if (line[1] !== " ") unstagedCount += 1;
    }
  }
  const counts = parseAheadBehind(aheadBehindOutput);
  return { branch: branchOutput || "DETACHED", isDirty: lines.length > 0, stagedCount, unstagedCount, untrackedCount, aheadCount: counts.ahead, behindCount: counts.behind };
}

export function getGitStatus(root = ROOT, execFile = execFileSync) {
  const git = (args, trim = true) => {
    const output = execFile("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    return trim ? output.trim() : output.replace(/\r?\n$/, "");
  };
  try {
    const branch = git(["branch", "--show-current"]) || git(["rev-parse", "--short", "HEAD"]) || "DETACHED";
    const porcelain = git(["status", "--porcelain"], false);
    let aheadBehind = "";
    try { aheadBehind = git(["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]); } catch { aheadBehind = ""; }
    return parseGitStatus(branch, porcelain, aheadBehind);
  } catch (error) {
    return { malformed: true, reason: redact(error.message), branch: "UNKNOWN", isDirty: false, stagedCount: 0, unstagedCount: 0, untrackedCount: 0, aheadCount: "UNKNOWN", behindCount: "UNKNOWN" };
  }
}

export function classifyEnv(env = {}) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL || "";
  const supabaseAnonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY || "";
  const azureKey = env.AZURE_SPEECH_KEY || env.SPEECH_KEY || env.VITE_AZURE_SPEECH_KEY || "";
  const azureRegion = env.AZURE_SPEECH_REGION || env.SPEECH_REGION || env.VITE_AZURE_SPEECH_REGION || "";
  const errors = [];
  if (supabaseUrl && !isHttpUrl(supabaseUrl)) errors.push(blocker("Supabase", "MALFORMED_ENV", "Fix SUPABASE_URL/VITE_SUPABASE_URL so it is a valid http(s) URL."));
  const azureMalformed = Boolean((azureKey && !azureRegion) || (!azureKey && azureRegion) || (azureRegion && !/^[a-z0-9-]+$/i.test(azureRegion)));
  if (azureMalformed) errors.push(blocker("Azure Speech", "ENV MALFORMED", "Set both Azure Speech key and region with a valid region name."));
  return { errors, githubToken: env.GITHUB_TOKEN || env.GH_TOKEN || "", vercelToken: env.VERCEL_TOKEN || "", vercelProject: env.VERCEL_PROJECT_ID || env.VERCEL_PROJECT_NAME || "", vercelTeam: env.VERCEL_TEAM_ID || "", supabase: { url: supabaseUrl, anonKey: supabaseAnonKey }, azureSpeech: { status: azureMalformed ? "ENV MALFORMED" : azureKey && azureRegion ? "ENV PRESENT" : "ENV MISSING" } };
}

export function detectMobileAudio({ root = ROOT, packageScripts = classifyPackageScripts({}), envInfo = classifyEnv({}), exists = fs.existsSync } = {}) {
  const runtime = hasAny(root, MOBILE_RUNTIME, exists);
  const ui = hasAny(root, MOBILE_UI, exists);
  const test = packageScripts["test:mobile-audio"]?.present === true;
  const envStatus = envInfo.azureSpeech?.status || "ENV MISSING";
  let status = "READY";
  if (!runtime && !ui && !test && envStatus === "ENV MISSING") status = "UNKNOWN";
  else if (!runtime) status = "MISSING_RUNTIME";
  else if (!ui) status = "MISSING_UI";
  else if (!test) status = "MISSING_TEST";
  else if (envStatus === "ENV MALFORMED") status = "MALFORMED_ENV";
  else if (envStatus === "ENV MISSING") status = "MISSING_ENV";
  return { status, runtime: runtime ? "PRESENT" : "MISSING", ui: ui ? "PRESENT" : "MISSING", testScript: test ? "PRESENT" : "MISSING", azureSpeechEnv: envStatus };
}

export function parseGitHubPullsResponse(value) { if (!Array.isArray(value)) throw new Error("malformed GitHub response"); return { openPrs: value.length }; }
export function parseGitHubActionsResponse(value, now = new Date()) {
  if (!Array.isArray(value)) throw new Error("malformed Actions response");
  const cutoff = now.getTime() - 24 * 60 * 60 * 1000;
  return { failures: value.filter((run) => new Date(run.created_at).getTime() >= cutoff).filter((run) => run.status === "completed" && !["success", "neutral", "skipped"].includes(run.conclusion)).map((run) => run.name || run.display_title || `run ${run.id || "unknown"}`) };
}
export function parseVercelDeploymentsResponse(value) {
  if (!Array.isArray(value)) throw new Error("malformed Vercel response");
  const latest = value[0] || null;
  const failed = value.find((deploy) => ["ERROR", "CANCELED"].includes(String(deploy.state)));
  return { latestState: latest?.state || "none returned", latestUrl: latest?.url ? `https://${latest.url}` : "", failedReason: failed ? redact(failed.errorMessage || failed.error?.message || failed.readySubstate || "No deploy error detail returned by Vercel API") : "" };
}

export async function checkGitHub(envInfo, fetchImpl = globalThis.fetch) {
  if (!envInfo.githubToken) return service(SERVICE.UNKNOWN, "missing credentials");
  try { const pulls = await gh(envInfo.githubToken, `/repos/${REPO.owner}/${REPO.name}/pulls?state=open&per_page=20`, fetchImpl); return service(SERVICE.PASS, "read-only check complete", parseGitHubPullsResponse(pulls)); } catch (error) { return service(SERVICE.FAIL, redact(error.message)); }
}
export async function checkActions(envInfo, fetchImpl = globalThis.fetch, now = new Date()) {
  if (!envInfo.githubToken) return service(SERVICE.UNKNOWN, "missing credentials");
  try { const body = await gh(envInfo.githubToken, `/repos/${REPO.owner}/${REPO.name}/actions/runs?per_page=50`, fetchImpl); const detail = parseGitHubActionsResponse(body.workflow_runs, now); return service(detail.failures.length ? SERVICE.FAIL : SERVICE.PASS, detail.failures.join(", ") || "no failing runs in last 24h", detail); } catch (error) { return service(SERVICE.FAIL, redact(error.message)); }
}
export async function checkVercel(envInfo, root = ROOT, fetchImpl = globalThis.fetch) {
  if (!envInfo.vercelToken) return service(SERVICE.UNKNOWN, "missing credentials");
  try {
    const project = readVercelProject(root);
    const projectId = envInfo.vercelProject || project?.projectId;
    const teamId = envInfo.vercelTeam || project?.orgId;
    if (!projectId) return service(SERVICE.FAIL, "missing Vercel project id");
    const query = new URLSearchParams({ limit: "5", projectId });
    if (teamId) query.set("teamId", teamId);
    const body = await vercel(envInfo.vercelToken, `/v6/deployments?${query.toString()}`, fetchImpl);
    const detail = parseVercelDeploymentsResponse(body.deployments);
    return service(["ERROR", "CANCELED"].includes(detail.latestState) ? SERVICE.FAIL : SERVICE.PASS, detail.failedReason || detail.latestState, detail);
  } catch (error) { return service(SERVICE.FAIL, redact(error.message)); }
}
export async function checkSupabase(envInfo, fetchImpl = globalThis.fetch) {
  const { url, anonKey } = envInfo.supabase;
  if (!url && !anonKey) return service(SERVICE.UNKNOWN, "missing credentials");
  if (!url || !anonKey) return service(SERVICE.UNKNOWN, "missing credentials");
  if (!isHttpUrl(url)) return service(SERVICE.FAIL, "malformed env");
  try {
    const response = await fetchImpl(`${url.replace(/\/$/, "")}/auth/v1/health`, { headers: { apikey: anonKey, authorization: `Bearer ${anonKey}` }, signal: AbortSignal.timeout(5000) });
    if (!response || typeof response.ok !== "boolean" || typeof response.status !== "number") return service(SERVICE.FAIL, "invalid response shape");
    return response.ok ? service(SERVICE.PASS, `HTTP ${response.status}`) : service(SERVICE.FAIL, `HTTP ${response.status}`);
  } catch (error) { return service(SERVICE.FAIL, redact(error.message)); }
}

export function detectBuildReadiness(packageScripts = {}) {
  if (packageScripts["typecheck:app"]?.status === "REQUIRED_MISSING") return "MISSING_TYPECHECK";
  if (packageScripts.build?.status === "REQUIRED_MISSING") return "MISSING_BUILD";
  return "READY";
}
export function runLocalValidation(packageScripts, root = ROOT, execFile = execFileSync) {
  if (packageScripts["validate:tests"]?.status === "OPTIONAL_MISSING") return { status: "UNKNOWN", reason: "validate:tests script missing" };
  try { execFile("npm", ["run", "validate:tests", "--", "--pattern", "definitelyNoSuchMercyPattern"], { cwd: root, encoding: "utf8", stdio: "pipe" }); return { status: "FALSE_GREEN_RISK", reason: "validate:tests returned 0 for impossible pattern" }; } catch (error) { return error.status === 2 ? { status: "NON_VACUOUS_GUARD_PRESENT", reason: "validate:tests returned 2 for impossible pattern" } : { status: "VALIDATION_GUARD_FAILURE", reason: `validate:tests exited ${error.status ?? "unknown"}` }; }
}

export async function buildStatusModel(options = {}) {
  const root = options.root || ROOT;
  const generatedAt = options.generatedAt || new Date().toISOString();
  const reportPath = options.reportPath || path.join("/tmp", `mb-status-${generatedAt.slice(0, 10)}.md`);
  const envInfo = options.envInfo || classifyEnv(options.env || loadEnvFiles(root));
  const packageRead = options.packageRead || readPackageScripts(root);
  const packageScripts = options.packageScripts || classifyPackageScripts(packageRead.scripts);
  const git = options.git || getGitStatus(root, options.execFile);
  const services = options.services || { github: await checkGitHub(envInfo, options.fetchImpl), actions: await checkActions(envInfo, options.fetchImpl, new Date(generatedAt)), vercel: await checkVercel(envInfo, root, options.fetchImpl), supabase: await checkSupabase(envInfo, options.fetchImpl) };
  const model = { schemaVersion: SCHEMA_VERSION, generatedAt, repoRoot: root, branch: git.branch, nodeVersion: process.version, reportPath, git, packageScripts, localValidation: options.localValidation || runLocalValidation(packageScripts, root, options.execFile), mobileAudio: options.mobileAudio || detectMobileAudio({ root, packageScripts, envInfo, exists: options.exists || fs.existsSync }), supabase: services.supabase, azureSpeech: envInfo.azureSpeech, services, packageErrors: packageRead.errors, envErrors: envInfo.errors, reportWrite: options.reportWrite || { status: "PASS" } };
  model.buildReadiness = detectBuildReadiness(model.packageScripts);
  const exit = evaluateExit(model);
  model.topBlockers = extractBlockers(model);
  model.nextActions = nextActions(model.topBlockers);
  model.exitCode = exit.code;
  model.exitReason = exit.reason;
  return model;
}

export function extractBlockers(model) {
  const invalid = validateStatusModel(model);
  if (invalid) return [blocker("Status Configuration", "INVALID_STATUS_CONFIGURATION", invalid)];
  const blockers = [];
  for (const item of model.packageErrors || []) blockers.push(item);
  for (const item of model.envErrors || []) blockers.push(item);
  if (model.git.malformed) blockers.push(blocker("Git", "INVALID_STATUS_CONFIGURATION", "Fix malformed git status output."));
  if (model.git.isDirty) blockers.push(blocker("Git", "DIRTY", "Review, commit, or stash local changes before merging."));
  for (const name of REQUIRED_SCRIPTS) if (model.packageScripts[name]?.status === "REQUIRED_MISSING") blockers.push(blocker("Package Scripts", "REQUIRED_MISSING", `Add package script ${name}.`));
  for (const [key, check] of Object.entries(model.services || {})) if (check.status === SERVICE.FAIL) blockers.push(blocker(serviceLabel(key), "FAIL", check.reason || `Fix ${serviceLabel(key)} read-only check.`));
  if (["FALSE_GREEN_RISK", "VALIDATION_GUARD_FAILURE"].includes(model.localValidation.status)) blockers.push(blocker("Local Validation", model.localValidation.status, model.localValidation.status === "FALSE_GREEN_RISK" ? "Fix validate:tests so impossible patterns exit 2." : model.localValidation.reason));
  if (model.mobileAudio.status === "MALFORMED_ENV") blockers.push(blocker("Mobile Audio", "MALFORMED_ENV", "Fix malformed Azure Speech environment values."));
  if (model.buildReadiness === "MISSING_TYPECHECK") blockers.push(blocker("Build Readiness", "MISSING_TYPECHECK", "Add package script typecheck:app."));
  if (model.buildReadiness === "MISSING_BUILD") blockers.push(blocker("Build Readiness", "MISSING_BUILD", "Add package script build."));
  if (model.reportWrite?.status === "FAIL") blockers.push(blocker("Report Write", "FAIL", "Restore write access for the /tmp morning status report."));
  return dedupeBlockers(blockers).slice(0, 3);
}
export function nextActions(blockers) { return blockers.map(({ category, action }) => ({ category, action })); }
export function validateBlockerInvariants(blockers, actions = nextActions(blockers)) {
  if (!Array.isArray(blockers) || !Array.isArray(actions) || blockers.length > 3 || actions.length > 3 || blockers.length !== actions.length) return false;
  const categories = new Set();
  for (let index = 0; index < blockers.length; index += 1) {
    const item = blockers[index], action = actions[index];
    if (!item || typeof item.category !== "string" || typeof item.status !== "string" || typeof item.action !== "string") return false;
    if (categories.has(item.category)) return false;
    categories.add(item.category);
    if (action.category !== item.category || action.action !== item.action) return false;
  }
  return true;
}
export function evaluateExit(model) {
  const invalid = validateStatusModel(model);
  if (invalid) return { code: EXIT.INVALID_STATUS_CONFIGURATION, reason: EXIT_REASON[EXIT.INVALID_STATUS_CONFIGURATION] };
  const blockers = extractBlockers(model);
  if (!validateBlockerInvariants(blockers)) return { code: EXIT.INVALID_STATUS_CONFIGURATION, reason: EXIT_REASON[EXIT.INVALID_STATUS_CONFIGURATION] };
  if (blockers.some((item) => ["INVALID_STATUS_CONFIGURATION", "ENV MALFORMED", "MALFORMED_ENV"].includes(item.status))) return { code: EXIT.INVALID_STATUS_CONFIGURATION, reason: EXIT_REASON[EXIT.INVALID_STATUS_CONFIGURATION] };
  const operational = blockers.some((item) => item.category !== "Git");
  return operational ? { code: EXIT.OPERATIONAL_FAILURE, reason: EXIT_REASON[EXIT.OPERATIONAL_FAILURE] } : { code: EXIT.PASSING_OR_UNKNOWN, reason: EXIT_REASON[EXIT.PASSING_OR_UNKNOWN] };
}

export function toJsonStatus(model) {
  const exit = evaluateExit(model), topBlockers = extractBlockers(model);
  return ordered({ schemaVersion: model.schemaVersion, generatedAt: model.generatedAt, repoRoot: model.repoRoot, branch: model.branch, nodeVersion: model.nodeVersion, reportPath: model.reportPath, git: model.git, packageScripts: model.packageScripts, localValidation: model.localValidation, mobileAudio: model.mobileAudio, supabase: model.supabase, azureSpeech: model.azureSpeech, buildReadiness: model.buildReadiness, topBlockers, nextActions: nextActions(topBlockers), exitCode: exit.code, exitReason: exit.reason }, ["schemaVersion", "generatedAt", "repoRoot", "branch", "nodeVersion", "reportPath", "git", "packageScripts", "localValidation", "mobileAudio", "supabase", "azureSpeech", "buildReadiness", "topBlockers", "nextActions", "exitCode", "exitReason"]);
}
export function formatJson(model) { return `${JSON.stringify(toJsonStatus(model), null, 2)}\n`; }
export function formatTerminal(model) {
  const json = toJsonStatus(model);
  return ["MercyB Morning Status", "Run Info", `generatedAt: ${json.generatedAt}`, `reportPath: ${json.reportPath}`, `repoRoot: ${json.repoRoot}`, `branch: ${json.branch}`, `nodeVersion: ${json.nodeVersion}`, `Report Write: ${model.reportWrite.status}`, "Git", `branch: ${json.git.branch}`, `isDirty: ${json.git.isDirty}`, `stagedCount: ${json.git.stagedCount}`, `unstagedCount: ${json.git.unstagedCount}`, `untrackedCount: ${json.git.untrackedCount}`, `aheadCount: ${json.git.aheadCount}`, `behindCount: ${json.git.behindCount}`, "Package Scripts", ...SCRIPT_NAMES.map((name) => `${name}: ${json.packageScripts[name].status}`), "GitHub", formatService(model.services.github), "Actions", formatService(model.services.actions), "Vercel", formatService(model.services.vercel), "Supabase", formatService(json.supabase), "Azure Speech", json.azureSpeech.status, "Local Validation", json.localValidation.status, "Mobile Audio", json.mobileAudio.status, "Build Readiness", json.buildReadiness, "Top Blockers", ...(json.topBlockers.length ? json.topBlockers.map(formatBlocker) : ["None"]), "Next Actions", ...(json.nextActions.length ? json.nextActions.map(formatAction) : ["None"]), "Exit Summary", `exitCode: ${json.exitCode}`, `exitReason: ${json.exitReason}`].join("\n");
}
export function formatMarkdown(model) { return `${formatTerminal(model).split("\n").map((line) => line === "MercyB Morning Status" ? `# ${line}` : SECTIONS.includes(line) ? `## ${line}` : `- ${line}`).join("\n")}\n`; }
export async function runStatus(options = {}) {
  const jsonMode = options.jsonMode ?? process.argv.includes("--json");
  const model = await buildStatusModel(options);
  try { fs.writeFileSync(model.reportPath, formatMarkdown(model)); } catch (error) { model.reportWrite = { status: "FAIL", reason: redact(error.message) }; }
  const exit = evaluateExit(model);
  model.exitCode = exit.code;
  model.exitReason = exit.reason;
  return { output: jsonMode ? formatJson(model) : formatTerminal(model), exitCode: exit.code, model };
}

async function main() { const jsonMode = process.argv.includes("--json"); const result = await runStatus({ jsonMode }); if (jsonMode) { try { fs.ftruncateSync(1, 0); fs.writeSync(1, result.output, 0, "utf8"); process.exitCode = result.exitCode; return; } catch {} } process.stdout.write(result.output); process.exitCode = result.exitCode; }
async function gh(token, pathName, fetchImpl) { const response = await fetchImpl(`https://api.github.com${pathName}`, { headers: { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" } }); if (!response.ok) throw new Error(`GitHub API ${response.status}`); return response.json(); }
async function vercel(token, pathName, fetchImpl) { const response = await fetchImpl(`https://api.vercel.com${pathName}`, { headers: { authorization: `Bearer ${token}` } }); if (!response.ok) throw new Error(`Vercel API ${response.status}`); return response.json(); }
function readVercelProject(root) { try { return JSON.parse(fs.readFileSync(path.join(root, ".vercel/project.json"), "utf8")); } catch { return null; } }
function parseAheadBehind(output) { if (!output) return { ahead: "UNKNOWN", behind: "UNKNOWN" }; const parts = output.trim().split(/\s+/); if (parts.length !== 2 || parts.some((part) => !/^\d+$/.test(part))) throw new Error("malformed git output"); return { ahead: Number(parts[0]), behind: Number(parts[1]) }; }
function validateStatusModel(model) { if (!model || typeof model !== "object") return "Malformed status model."; for (const key of ["schemaVersion", "generatedAt", "repoRoot", "branch", "nodeVersion", "reportPath"]) if (typeof model[key] !== "string") return `Malformed status model: ${key}.`; if (model.schemaVersion !== SCHEMA_VERSION) return "Malformed status model: schemaVersion."; if (!model.git || typeof model.git !== "object") return "Malformed status model: git."; if (!model.packageScripts || typeof model.packageScripts !== "object") return "Malformed status model: packageScripts."; if (!model.services || typeof model.services !== "object") return "Malformed status model: services."; return ""; }
function dedupeBlockers(blockers) { const seen = new Set(), result = []; for (const item of blockers) { if (!item || typeof item.category !== "string" || typeof item.status !== "string" || typeof item.action !== "string") { result.push(blocker("Status Configuration", "INVALID_STATUS_CONFIGURATION", "Fix malformed blocker shape.")); continue; } if (seen.has(item.category)) continue; seen.add(item.category); result.push(item); } return result; }
function ordered(input, keys) { const result = {}; for (const key of keys) result[key] = input[key]; return result; }
function blocker(category, status, action) { return { category, status, action }; }
function service(status, reason, detail = {}) { return { status, reason, detail }; }
function formatService(check) { if (check.status === SERVICE.PASS || check.status === SERVICE.UNKNOWN) return check.status; return check.reason ? `${SERVICE.FAIL}\nreason: ${check.reason}` : SERVICE.FAIL; }
function formatBlocker(item, index) { return `${index + 1}. category: ${item.category}; status: ${item.status}; action: ${item.action}`; }
function formatAction(item, index) { return `${index + 1}. category: ${item.category}; action: ${item.action}`; }
function serviceLabel(key) { return ({ github: "GitHub", actions: "Actions", vercel: "Vercel", supabase: "Supabase" })[key] || key; }
function hasAny(root, candidates, exists) { return candidates.some((candidate) => exists(path.join(root, candidate))); }
function unquote(value) { const trimmed = value.trim(); if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) return trimmed.slice(1, -1); return trimmed; }
function isHttpUrl(value) { try { const parsed = new URL(value); return parsed.protocol === "http:" || parsed.protocol === "https:"; } catch { return false; } }
function redact(value = "") { return String(value).replace(/Bearer\s+\S+/gi, "Bearer [redacted]").replace(/[A-Za-z0-9_=-]{32,}/g, "[redacted]").replace(/(apikey|authorization|token|key)=([^&\s]+)/gi, "$1=[redacted]"); }
if (import.meta.url === `file://${process.argv[1]}`) main().catch((error) => { process.stderr.write(`MercyB Morning Status failed: ${redact(error.message)}\n`); process.exitCode = EXIT.INVALID_STATUS_CONFIGURATION; });
