import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  EXIT, SCHEMA_VERSION, SECTIONS, SERVICE, buildStatusModel, checkActions, checkGitHub, checkSupabase, checkVercel,
  classifyEnv, classifyPackageScripts, detectBuildReadiness, detectMobileAudio, evaluateExit, extractBlockers,
  formatJson, formatMarkdown, formatTerminal, nextActions, parseGitHubActionsResponse, parseGitStatus,
  parseVercelDeploymentsResponse, runLocalValidation, runStatus, toJsonStatus, validateBlockerInvariants,
} from "../morning-status.mjs";

const baseScripts = { "mb:status": "node scripts/morning-status.mjs", "test:mobile-audio": "vitest mobile", "test:resume": "vitest resume", "validate:tests": "node scripts/validate-tests.mjs", "typecheck:app": "tsc --noEmit", build: "vite build" };
const baseEnv = { GITHUB_TOKEN: "gh_test", VERCEL_TOKEN: "vc_test", VERCEL_PROJECT_ID: "project", VITE_SUPABASE_URL: "https://example.supabase.co", VITE_SUPABASE_ANON_KEY: "anon", AZURE_SPEECH_KEY: "key", AZURE_SPEECH_REGION: "eastus" };
const stableGit = { branch: "main", isDirty: false, stagedCount: 0, unstagedCount: 0, untrackedCount: 0, aheadCount: "UNKNOWN", behindCount: "UNKNOWN" };
const stableServices = { github: { status: SERVICE.UNKNOWN, reason: "missing credentials", detail: {} }, actions: { status: SERVICE.UNKNOWN, reason: "missing credentials", detail: {} }, vercel: { status: SERVICE.UNKNOWN, reason: "missing credentials", detail: {} }, supabase: { status: SERVICE.UNKNOWN, reason: "missing credentials", detail: {} } };
function rootWithFiles({ runtime = true, ui = true } = {}) { const root = fs.mkdtempSync(path.join(os.tmpdir(), "mb-status-")); if (runtime) write(root, "src/lib/speech/mobileSafariSpeakingRuntime.ts"); if (ui) write(root, "src/components/mercy-guide/MercySpeakTab.tsx"); return root; }
function write(root, relative) { const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, "export {};\n"); }
async function model(overrides = {}) { return buildStatusModel({ root: overrides.root || rootWithFiles(), generatedAt: overrides.generatedAt || "2026-05-21T12:00:00.000Z", env: overrides.env || baseEnv, packageRead: overrides.packageRead || { scripts: overrides.scripts || baseScripts, errors: [] }, git: overrides.git || stableGit, services: overrides.services || stableServices, localValidation: overrides.localValidation || { status: "NON_VACUOUS_GUARD_PRESENT", reason: "ok" }, mobileAudio: overrides.mobileAudio, exists: overrides.exists, reportWrite: overrides.reportWrite }); }
function normalizeDynamic(value) { return value.replace(/2026-05-2\dT\d\d:\d\d:\d\d\.\d\d\dZ/g, "<generatedAt>").replace(/mb-status-2026-05-2\d\.md/g, "mb-status-<date>.md"); }
function markdownSections(markdown) { return markdown.split("\n").filter((line) => /^#{1,2} /.test(line)).map((line) => line.replace(/^#{1,2} /, "")); }
function terminalSections(terminal) { return terminal.split("\n").filter((line) => SECTIONS.includes(line)); }

describe("morning-status production local operator primitive", () => {
  it("locks JSON schema version", async () => expect(toJsonStatus(await model()).schemaVersion).toBe(SCHEMA_VERSION));
  it("locks exact JSON top-level key order", async () => expect(Object.keys(toJsonStatus(await model()))).toEqual(["schemaVersion", "generatedAt", "repoRoot", "branch", "nodeVersion", "reportPath", "git", "packageScripts", "localValidation", "mobileAudio", "supabase", "azureSpeech", "buildReadiness", "topBlockers", "nextActions", "exitCode", "exitReason"]));
  it("JSON mode prints valid JSON only", async () => { const result = await runStatus({ jsonMode: true, root: rootWithFiles(), generatedAt: "2026-05-21T12:00:00.000Z", env: {}, packageRead: { scripts: baseScripts, errors: [] }, git: stableGit, services: stableServices, localValidation: { status: "UNKNOWN", reason: "missing" } }); expect(() => JSON.parse(result.output)).not.toThrow(); expect(result.output.trim().startsWith("{")).toBe(true); });
  it("terminal output is deterministic after timestamp normalization", async () => { const root = rootWithFiles(); expect(normalizeDynamic(formatTerminal(await model({ root, generatedAt: "2026-05-21T12:00:00.000Z" })))).toBe(normalizeDynamic(formatTerminal(await model({ root, generatedAt: "2026-05-22T13:00:00.000Z" })))); });
  it("markdown output is deterministic after timestamp normalization", async () => { const root = rootWithFiles(); expect(normalizeDynamic(formatMarkdown(await model({ root, generatedAt: "2026-05-21T12:00:00.000Z" })))).toBe(normalizeDynamic(formatMarkdown(await model({ root, generatedAt: "2026-05-22T13:00:00.000Z" })))); });
  it("JSON output is deterministic after timestamp normalization", async () => { const root = rootWithFiles(); expect(normalizeDynamic(formatJson(await model({ root, generatedAt: "2026-05-21T12:00:00.000Z" })))).toBe(normalizeDynamic(formatJson(await model({ root, generatedAt: "2026-05-22T13:00:00.000Z" })))); });
  it("terminal section order is stable", async () => expect(terminalSections(formatTerminal(await model()))).toEqual(SECTIONS));
  it("markdown section order is stable", async () => expect(markdownSections(formatMarkdown(await model()))).toEqual(SECTIONS));
  it("markdown and terminal sections have parity", async () => { const status = await model(); expect(markdownSections(formatMarkdown(status))).toEqual(terminalSections(formatTerminal(status))); });
  it("report path includes date", async () => expect((await model()).reportPath).toBe("/tmp/mb-status-2026-05-21.md"));
  it("git clean tree parses", () => expect(parseGitStatus("main", "")).toMatchObject({ branch: "main", isDirty: false }));
  it("git dirty tree parses", () => expect(parseGitStatus("main", "M  a.ts\n M b.ts\n?? c.ts")).toMatchObject({ isDirty: true }));
  it("git staged count parses", () => expect(parseGitStatus("main", "M  a.ts\nA  b.ts")).toMatchObject({ stagedCount: 2 }));
  it("git unstaged count parses", () => expect(parseGitStatus("main", " M a.ts\nMM b.ts")).toMatchObject({ unstagedCount: 2 }));
  it("git untracked count parses", () => expect(parseGitStatus("main", "?? a.ts\n?? b.ts")).toMatchObject({ untrackedCount: 2 }));
  it("git ahead behind parses", () => expect(parseGitStatus("main", "", "2 3")).toMatchObject({ aheadCount: 2, behindCount: 3 }));
  it("git ahead behind is UNKNOWN without upstream", () => expect(parseGitStatus("main", "")).toMatchObject({ aheadCount: "UNKNOWN", behindCount: "UNKNOWN" }));
  it("git detached head is visible", () => expect(parseGitStatus("abc123", "")).toMatchObject({ branch: "abc123" }));
  it("malformed git output throws", () => expect(() => parseGitStatus("main", "bad")).toThrow("malformed git output"));
  it("malformed git output exits 3", async () => expect(evaluateExit(await model({ git: { ...stableGit, malformed: true } })).code).toBe(EXIT.INVALID_STATUS_CONFIGURATION));
  it("required package script is REQUIRED_PRESENT", () => expect(classifyPackageScripts(baseScripts)["mb:status"].status).toBe("REQUIRED_PRESENT"));
  it("optional package script is OPTIONAL_PRESENT", () => expect(classifyPackageScripts(baseScripts)["validate:tests"].status).toBe("OPTIONAL_PRESENT"));
  it("optional package script missing is OPTIONAL_MISSING", () => { const scripts = { ...baseScripts }; delete scripts["test:resume"]; expect(classifyPackageScripts(scripts)["test:resume"].status).toBe("OPTIONAL_MISSING"); });
  it("required package script missing is REQUIRED_MISSING", () => { const scripts = { ...baseScripts }; delete scripts.build; expect(classifyPackageScripts(scripts).build.status).toBe("REQUIRED_MISSING"); });
  it("build readiness READY", () => expect(detectBuildReadiness(classifyPackageScripts(baseScripts))).toBe("READY"));
  it("build readiness missing typecheck", () => { const scripts = { ...baseScripts }; delete scripts["typecheck:app"]; expect(detectBuildReadiness(classifyPackageScripts(scripts))).toBe("MISSING_TYPECHECK"); });
  it("build readiness missing build", () => { const scripts = { ...baseScripts }; delete scripts.build; expect(detectBuildReadiness(classifyPackageScripts(scripts))).toBe("MISSING_BUILD"); });
  it("local validation guard present on exit 2", () => { const execFile = () => { const error = new Error("x"); error.status = 2; throw error; }; expect(runLocalValidation(classifyPackageScripts(baseScripts), "/repo", execFile).status).toBe("NON_VACUOUS_GUARD_PRESENT"); });
  it("local validation false-green risk on exit 0", () => expect(runLocalValidation(classifyPackageScripts(baseScripts), "/repo", () => "").status).toBe("FALSE_GREEN_RISK"));
  it("local validation guard failure on exit 1", () => { const execFile = () => { const error = new Error("x"); error.status = 1; throw error; }; expect(runLocalValidation(classifyPackageScripts(baseScripts), "/repo", execFile).status).toBe("VALIDATION_GUARD_FAILURE"); });
  it("local validation guard failure on exit 3", () => { const execFile = () => { const error = new Error("x"); error.status = 3; throw error; }; expect(runLocalValidation(classifyPackageScripts(baseScripts), "/repo", execFile).status).toBe("VALIDATION_GUARD_FAILURE"); });
  it("local validation guard failure on exit 4", () => { const execFile = () => { const error = new Error("x"); error.status = 4; throw error; }; expect(runLocalValidation(classifyPackageScripts(baseScripts), "/repo", execFile).status).toBe("VALIDATION_GUARD_FAILURE"); });
  it("local validation unknown when command missing", () => { const scripts = { ...baseScripts }; delete scripts["validate:tests"]; expect(runLocalValidation(classifyPackageScripts(scripts)).status).toBe("UNKNOWN"); });
  it("mobile audio READY", () => expect(detectMobileAudio({ root: rootWithFiles(), packageScripts: classifyPackageScripts(baseScripts), envInfo: classifyEnv(baseEnv) }).status).toBe("READY"));
  it("mobile audio MISSING_RUNTIME", () => expect(detectMobileAudio({ root: rootWithFiles({ runtime: false }), packageScripts: classifyPackageScripts(baseScripts), envInfo: classifyEnv(baseEnv) }).status).toBe("MISSING_RUNTIME"));
  it("mobile audio MISSING_UI", () => expect(detectMobileAudio({ root: rootWithFiles({ ui: false }), packageScripts: classifyPackageScripts(baseScripts), envInfo: classifyEnv(baseEnv) }).status).toBe("MISSING_UI"));
  it("mobile audio MISSING_TEST", () => { const scripts = { ...baseScripts }; delete scripts["test:mobile-audio"]; expect(detectMobileAudio({ root: rootWithFiles(), packageScripts: classifyPackageScripts(scripts), envInfo: classifyEnv(baseEnv) }).status).toBe("MISSING_TEST"); });
  it("mobile audio MISSING_ENV", () => expect(detectMobileAudio({ root: rootWithFiles(), packageScripts: classifyPackageScripts(baseScripts), envInfo: classifyEnv({}) }).status).toBe("MISSING_ENV"));
  it("mobile audio MALFORMED_ENV", () => expect(detectMobileAudio({ root: rootWithFiles(), packageScripts: classifyPackageScripts(baseScripts), envInfo: classifyEnv({ AZURE_SPEECH_KEY: "x" }) }).status).toBe("MALFORMED_ENV"));
  it("mobile audio UNKNOWN when all missing", () => expect(detectMobileAudio({ root: rootWithFiles({ runtime: false, ui: false }), packageScripts: classifyPackageScripts({}), envInfo: classifyEnv({}) }).status).toBe("UNKNOWN"));
  it("mobile runtime present and UI missing", () => expect(detectMobileAudio({ root: rootWithFiles({ runtime: true, ui: false }), packageScripts: classifyPackageScripts(baseScripts), envInfo: classifyEnv(baseEnv) }).status).toBe("MISSING_UI"));
  it("mobile UI present and runtime missing", () => expect(detectMobileAudio({ root: rootWithFiles({ runtime: false, ui: true }), packageScripts: classifyPackageScripts(baseScripts), envInfo: classifyEnv(baseEnv) }).status).toBe("MISSING_RUNTIME"));
  it("GitHub STATUS UNKNOWN", async () => expect((await checkGitHub(classifyEnv({}), async () => ({}))).status).toBe(SERVICE.UNKNOWN));
  it("GitHub PASS", async () => expect((await checkGitHub(classifyEnv({ GITHUB_TOKEN: "x" }), async () => ({ ok: true, json: async () => [] }))).status).toBe(SERVICE.PASS));
  it("GitHub FAIL malformed response", async () => expect((await checkGitHub(classifyEnv({ GITHUB_TOKEN: "x" }), async () => ({ ok: true, json: async () => ({}) }))).status).toBe(SERVICE.FAIL));
  it("GitHub FAIL fetch error", async () => expect((await checkGitHub(classifyEnv({ GITHUB_TOKEN: "x" }), async () => { throw new Error("fetch failed"); })).status).toBe(SERVICE.FAIL));
  it("Actions failure from workflow failure", async () => { const result = await checkActions(classifyEnv({ GITHUB_TOKEN: "x" }), async () => ({ ok: true, json: async () => ({ workflow_runs: [{ name: "build", status: "completed", conclusion: "failure", created_at: "2026-05-21T12:00:00.000Z" }] }) }), new Date("2026-05-21T13:00:00.000Z")); expect(result.status).toBe(SERVICE.FAIL); });
  it("Actions parser ignores old failures", () => expect(parseGitHubActionsResponse([{ name: "old", status: "completed", conclusion: "failure", created_at: "2026-05-19T12:00:00.000Z" }], new Date("2026-05-21T13:00:00.000Z")).failures).toEqual([]));
  it("Vercel STATUS UNKNOWN", async () => expect((await checkVercel(classifyEnv({}), "/repo", async () => ({}))).status).toBe(SERVICE.UNKNOWN));
  it("Vercel PASS", async () => { const result = await checkVercel(classifyEnv({ VERCEL_TOKEN: "x", VERCEL_PROJECT_ID: "p" }), "/repo", async () => ({ ok: true, json: async () => ({ deployments: [{ state: "READY", url: "x.vercel.app" }] }) })); expect(result.status).toBe(SERVICE.PASS); });
  it("Vercel FAIL malformed response", async () => { const result = await checkVercel(classifyEnv({ VERCEL_TOKEN: "x", VERCEL_PROJECT_ID: "p" }), "/repo", async () => ({ ok: true, json: async () => ({ deployments: {} }) })); expect(result.status).toBe(SERVICE.FAIL); });
  it("Vercel FAIL fetch error", async () => { const result = await checkVercel(classifyEnv({ VERCEL_TOKEN: "x", VERCEL_PROJECT_ID: "p" }), "/repo", async () => { throw new Error("fetch failed"); }); expect(result.status).toBe(SERVICE.FAIL); });
  it("Vercel parser preserves failure reason", () => expect(parseVercelDeploymentsResponse([{ state: "ERROR", errorMessage: "Build failed" }]).failedReason).toBe("Build failed"));
  it("Supabase STATUS UNKNOWN", async () => expect((await checkSupabase(classifyEnv({}), async () => ({}))).status).toBe(SERVICE.UNKNOWN));
  it("Supabase PASS", async () => expect((await checkSupabase(classifyEnv(baseEnv), async () => ({ ok: true, status: 200 }))).status).toBe(SERVICE.PASS));
  it("Supabase FAIL unreachable", async () => expect((await checkSupabase(classifyEnv(baseEnv), async () => ({ ok: false, status: 503 }))).status).toBe(SERVICE.FAIL));
  it("Supabase FAIL malformed env", async () => expect((await checkSupabase(classifyEnv({ VITE_SUPABASE_URL: "bad", VITE_SUPABASE_ANON_KEY: "x" }), async () => ({}))).status).toBe(SERVICE.FAIL));
  it("Azure env present", () => expect(classifyEnv(baseEnv).azureSpeech.status).toBe("ENV PRESENT"));
  it("Azure env missing", () => expect(classifyEnv({}).azureSpeech.status).toBe("ENV MISSING"));
  it("Azure env malformed", () => expect(classifyEnv({ AZURE_SPEECH_KEY: "x" }).azureSpeech.status).toBe("ENV MALFORMED"));
  it("malformed Supabase URL exits 3", async () => { const info = classifyEnv({ VITE_SUPABASE_URL: "bad", VITE_SUPABASE_ANON_KEY: "x" }); expect(evaluateExit(await model({ env: { VITE_SUPABASE_URL: "bad", VITE_SUPABASE_ANON_KEY: "x" }, services: { ...stableServices, supabase: { status: SERVICE.FAIL, reason: "malformed env", detail: {} } } })).code).toBe(EXIT.INVALID_STATUS_CONFIGURATION); expect(info.errors[0].status).toBe("MALFORMED_ENV"); });
  it("malformed Azure env exits 3", async () => expect(evaluateExit(await model({ env: { AZURE_SPEECH_KEY: "x" } })).code).toBe(EXIT.INVALID_STATUS_CONFIGURATION));
  it("malformed package scripts object exits 3", async () => expect(evaluateExit(await model({ packageRead: { scripts: {}, errors: [{ category: "Package Scripts", status: "INVALID_STATUS_CONFIGURATION", action: "bad" }] } })).code).toBe(EXIT.INVALID_STATUS_CONFIGURATION));
  it("malformed status model exits 3", () => expect(evaluateExit(null).code).toBe(EXIT.INVALID_STATUS_CONFIGURATION));
  it("malformed blocker shape invalidates invariants", () => expect(validateBlockerInvariants([{ category: "Git", action: "x" }])).toBe(false));
  it("blocker cap is 3", async () => { const status = await model({ git: { ...stableGit, isDirty: true, stagedCount: 1 }, env: { AZURE_SPEECH_KEY: "x", VITE_SUPABASE_URL: "bad", VITE_SUPABASE_ANON_KEY: "x" }, services: { github: { status: SERVICE.FAIL, reason: "bad", detail: {} }, actions: { status: SERVICE.FAIL, reason: "bad", detail: {} }, vercel: { status: SERVICE.FAIL, reason: "bad", detail: {} }, supabase: { status: SERVICE.FAIL, reason: "bad", detail: {} } } }); expect(extractBlockers(status)).toHaveLength(3); });
  it("next actions mirror blockers", async () => { const blockers = extractBlockers(await model({ services: { ...stableServices, supabase: { status: SERVICE.FAIL, reason: "HTTP 503", detail: {} } } })); expect(nextActions(blockers)).toEqual(blockers.map(({ category, action }) => ({ category, action }))); });
  it("blocker invariants require equal action lengths", () => expect(validateBlockerInvariants([{ category: "Git", status: "DIRTY", action: "x" }], [])).toBe(false));
  it("blocker invariants reject duplicate categories", () => { const blockers = [{ category: "Git", status: "A", action: "x" }, { category: "Git", status: "B", action: "y" }]; expect(validateBlockerInvariants(blockers, nextActions(blockers))).toBe(false); });
  it("exit PASSING_OR_UNKNOWN", async () => expect(evaluateExit(await model()).reason).toBe("PASSING_OR_UNKNOWN"));
  it("exit OPERATIONAL_FAILURE", async () => expect(evaluateExit(await model({ services: { ...stableServices, supabase: { status: SERVICE.FAIL, reason: "HTTP 503", detail: {} } } })).reason).toBe("OPERATIONAL_FAILURE"));
  it("exit INVALID_STATUS_CONFIGURATION", () => expect(evaluateExit({}).reason).toBe("INVALID_STATUS_CONFIGURATION"));
  it("report write failure exits 1 in terminal mode", async () => { const result = await runStatus({ jsonMode: false, root: rootWithFiles(), generatedAt: "2026-05-21T12:00:00.000Z", env: {}, packageRead: { scripts: baseScripts, errors: [] }, git: stableGit, services: stableServices, localValidation: { status: "UNKNOWN", reason: "missing" }, reportPath: "/no/such/dir/mb-status.md" }); expect(result.output).toContain("Report Write: FAIL"); expect(result.exitCode).toBe(EXIT.OPERATIONAL_FAILURE); });
  it("report write failure exits 1 in JSON mode with valid JSON", async () => { const result = await runStatus({ jsonMode: true, root: rootWithFiles(), generatedAt: "2026-05-21T12:00:00.000Z", env: {}, packageRead: { scripts: baseScripts, errors: [] }, git: stableGit, services: stableServices, localValidation: { status: "UNKNOWN", reason: "missing" }, reportPath: "/no/such/dir/mb-status.md" }); expect(() => JSON.parse(result.output)).not.toThrow(); expect(JSON.parse(result.output).exitCode).toBe(EXIT.OPERATIONAL_FAILURE); });
});
