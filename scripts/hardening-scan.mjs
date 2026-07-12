#!/usr/bin/env node
// scripts/hardening-scan.mjs
//
// Hardening Scanner — a READ-ONLY findings reporter.
//
// It runs REAL analysis (eslint, tsc, npm audit) plus precise regex scans over
// real source, and emits ONE ranked findings report to stdout AND a timestamped
// reports/hardening-scan-<UTC>.md file. That is the entire deliverable.
//
// It does NOT: generate workpacks, authorize work, prioritize beyond severity,
// recommend fixes, modify src/, stage, commit, push, or build/deploy. Every
// finding cites the raw tool/scan output that produced it — a finding with no
// citation is a bug in this scanner. Each check is independent: a missing or
// failing tool is marked SKIPPED and never blocks the others. Findings are
// sorted stably so reruns diff cleanly.
//
// Severity rubric (stated so the human gate can audit it):
//   HIGH   = security boundary or dependency vulnerability
//   MEDIUM = type escape hatch or silent-failure pattern
//   LOW    = style / lint debt
//
// Network: only npm audit's advisory lookup. Nothing else reaches out.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const SRC = "src";
const SEV_RANK = { HIGH: 0, MEDIUM: 1, LOW: 2 };
const DEFAULT_CMD_TIMEOUT_MS = 120_000;
const CHECK_TIMEOUT_MS = {
  A: 180_000,
  B: 240_000,
  D: 90_000,
};
const rel = (p) => path.relative(ROOT, p) || p;

// Run a command, capturing stdout even when the tool exits non-zero (eslint,
// tsc and npm audit all exit non-zero when they have something to report).
export function run(cmd, args, options = {}) {
  const timeout = options.timeoutMs ?? DEFAULT_CMD_TIMEOUT_MS;
  try {
    const out = execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28, timeout });
    return { code: 0, stdout: out, stderr: "" };
  } catch (e) {
    const timedOut = e.signal === "SIGTERM" || /ETIMEDOUT|timed out/i.test(String(e.message));
    return {
      code: timedOut ? 124 : (e.status ?? 1),
      stdout: e.stdout ? String(e.stdout) : "",
      stderr: e.stderr ? String(e.stderr) : String(e.message),
      timedOut,
      timeoutMs: timeout,
    };
  }
}

export function runCheck(key, label, fn) {
  const started = Date.now();
  const timeoutMs = CHECK_TIMEOUT_MS[key] ?? 60_000;
  process.stderr.write(`[hardening-scan] START ${key} ${label} timeout=${timeoutMs}ms\n`);
  try {
    const result = fn(timeoutMs);
    const elapsedMs = Date.now() - started;
    process.stderr.write(`[hardening-scan] END ${key} status=${result.status || "ok"} elapsed=${elapsedMs}ms findings=${result.findings?.length ?? 0}\n`);
    return { ...result, elapsedMs, timeoutMs };
  } catch (e) {
    const elapsedMs = Date.now() - started;
    process.stderr.write(`[hardening-scan] ERROR ${key} elapsed=${elapsedMs}ms ${e?.message || e}\n`);
    return {
      status: "SKIPPED",
      note: `check threw after ${elapsedMs}ms: ${e?.message || String(e)}`,
      findings: [],
      elapsedMs,
      timeoutMs,
    };
  }
}

function walk(dir, exts, acc = []) {
  let entries;
  try { entries = fs.readdirSync(dir); } catch { return acc; }
  for (const name of entries) {
    if (name === "node_modules" || name === "dist" || name === ".git") continue;
    const p = path.join(dir, name);
    let st;
    try { st = fs.statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, exts, acc);
    else if (exts.some((e) => name.endsWith(e))) acc.push(p);
  }
  return acc;
}

const SOURCE_ROOTS = ["src", "api", "functions", "supabase/functions"];
const SRC_FILES = SOURCE_ROOTS
  .filter((dir) => fs.existsSync(dir))
  .flatMap((dir) => walk(dir, [".ts", ".tsx", ".js", ".jsx"]))
  .filter((file) => !rel(file).startsWith("src/lib/tutor/"))
  .sort();
const APP_FILES = SRC_FILES.filter((file) => {
  const r = rel(file);
  return !/(^|\/)(__tests__|tests|fixtures|__fixtures__)\//.test(r)
    && !/\.(test|spec)\.[cm]?[tj]sx?$/.test(r);
});
const ENV_BOUNDARY_FILES = APP_FILES.filter((file) => /^(api|functions|supabase\/functions)\//.test(rel(file)));
const AI_TUTOR_UI_FILES = APP_FILES.filter((file) => {
  const r = rel(file);
  return r === "src/pages/AiTutor.tsx"
    || r.startsWith("src/components/ai-tutor/")
    || r.startsWith("src/lib/ai-tutor/");
});

// Per-line regex scan. Returns { file, line, text } for each matching line.
// `refine` can further filter using the full line array + index (for lookback).
function scanLines(files, makeRegex, refine) {
  const hits = [];
  for (const f of files) {
    let content;
    try { content = fs.readFileSync(f, "utf8"); } catch { continue; }
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const re = makeRegex();
      if (!re.test(lines[i])) continue;
      if (refine && !refine(lines, i, f)) continue;
      hits.push({ file: rel(f), line: i + 1, text: lines[i].trim().slice(0, 200) });
    }
  }
  return hits.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

// Full-text scan (for multi-line constructs like empty catch blocks). Returns
// { file, line, text } where line is derived from the match offset.
function scanText(files, makeRegex) {
  const hits = [];
  for (const f of files) {
    let content;
    try { content = fs.readFileSync(f, "utf8"); } catch { continue; }
    const re = makeRegex();
    let m;
    while ((m = re.exec(content)) !== null) {
      const before = content.slice(0, m.index);
      const line = before.split("\n").length;
      const snippet = m[0].replace(/\s+/g, " ").trim().slice(0, 120);
      hits.push({ file: rel(f), line, text: snippet });
      if (m.index === re.lastIndex) re.lastIndex++;
    }
  }
  return hits.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

function windowText(lines, index, radius = 8) {
  return lines.slice(Math.max(0, index - radius), Math.min(lines.length, index + radius + 1)).join("\n");
}

function isInTryBlock(lines, index, lookback = 12) {
  let opens = 0;
  for (let k = Math.max(0, index - lookback); k < index; k++) {
    if (/\btry\s*\{/.test(lines[k])) opens++;
    if (/\}\s*catch\b/.test(lines[k])) opens = Math.max(0, opens - 1);
  }
  return opens > 0;
}

function objectLiteralAtCallsite(lines, index) {
  return lines.slice(index, Math.min(lines.length, index + 10)).join("\n");
}

function blockFrom(lines, index, maxLines = 140) {
  const start = index;
  const end = Math.min(lines.length, index + maxLines);
  return lines.slice(start, end).join("\n");
}

function hasTerminalAsyncUiState(block, setterName, fileText = "") {
  const escapedSetter = setterName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const clearsPending = new RegExp(`${escapedSetter}\\s*\\(\\s*false\\s*\\)`).test(block);
  if (!clearsPending) return false;

  const failureBranch = /\bcatch\s*(?:\(|\{)|\.catch\s*\(|\bfinally\s*\(|provider\s*===\s*["']local-fallback["']|is[A-Za-z0-9_]*ProviderError\s*\(/.test(block);
  if (!failureBranch) return false;

  const distinctFailureState = /set[A-Za-z0-9_]*(Error|ProviderError|Retry|Failed|Unavailable)\s*\(|setError\s*\(|setEntitlementGateVisible\s*\(\s*true\s*\)|local-fallback|timeout|network|try again|retry|thử lại|thử lại sau/.test(block);
  if (!distinctFailureState) return false;

  const retryAffordance = /retry|try again|thử lại|handleRetry|onRetry/i.test(block)
    || (/ProviderError/.test(block) && /onRetry|handleRetry|retry/i.test(fileText));
  return retryAffordance;
}

export function scanAsyncUiStateNoTerminalFailureFromText(content, file = "fixture.tsx") {
  const lines = content.split("\n");
  const hits = [];
  const pendingSetterRe = /\b(set[A-Z][A-Za-z0-9_]*)\s*\(\s*true\s*\)/g;
  const pendingSetterSuffixRe = /(Pending|Loading|Waiting|Listening|Submitting|Busy|Saving|Processing)$/;
  for (let i = 0; i < lines.length; i++) {
    let m;
    while ((m = pendingSetterRe.exec(lines[i])) !== null) {
      const setterName = m[1];
      if (!pendingSetterSuffixRe.test(setterName)) continue;
      const block = blockFrom(lines, i);
      const hasLearnerRequest = /\b(fetchWithTimeout|invokeWithTimeout|sendTurn|callAiSentenceCorrection|fetchDeepSeekSpeakFollowUp|fetch\s*\(|\.functions\.invoke\s*\(|supabase\.functions\.invoke\s*\()/.test(block);
      if (!hasLearnerRequest) continue;
      if (/best-effort|non-blocking|fire-and-forget|telemetry/i.test(block)) continue;
      if (hasTerminalAsyncUiState(block, setterName, content)) continue;
      hits.push({ file, line: i + 1, text: lines[i].trim().slice(0, 200) });
    }
  }
  return hits;
}

function locs(hits) {
  return hits.map((h) => `${h.file}:${h.line}`);
}

function makeFinding({ id, severity, evidence, hits, consumer_question }) {
  return { id, severity, evidence, locations: locs(hits), consumer_question };
}

// ── Check A — Lint debt (real eslint) ─────────────────────────────────────
function checkA(timeoutMs) {
  const r = run("npx", ["--no-install", "eslint", SRC, "--format", "json"], { timeoutMs });
  if (r.timedOut) return { status: "SKIPPED", note: `eslint timed out after ${r.timeoutMs}ms; last stderr: ${r.stderr.slice(0, 200)}`, findings: [] };
  const raw = r.stdout.trim();
  if (!raw) return { status: "SKIPPED", note: `eslint produced no JSON (code ${r.code}): ${r.stderr.slice(0, 200)}`, findings: [] };
  let results;
  try { results = JSON.parse(raw); } catch { return { status: "SKIPPED", note: "eslint JSON parse failed", findings: [] }; }
  const byRule = new Map();
  for (const file of results) {
    for (const m of file.messages || []) {
      if (!m.ruleId) continue; // parser/internal messages carry no rule id
      const loc = `${rel(file.filePath)}:${m.line}:${m.column}`;
      if (!byRule.has(m.ruleId)) byRule.set(m.ruleId, { count: 0, hits: [], sample: `${loc}  ${m.ruleId}  ${m.message}` });
      const e = byRule.get(m.ruleId);
      e.count++;
      e.hits.push({ file: rel(file.filePath), line: m.line });
    }
  }
  const findings = [...byRule.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
    .map(([rule, e]) => makeFinding({
      id: `LINT-${rule}`,
      severity: "LOW", // style/lint = LOW per rubric
      evidence: `eslint (real run over src/): rule "${rule}" — ${e.count} violation(s). Raw: ${e.sample}`,
      hits: e.hits.sort((x, y) => x.file.localeCompare(y.file) || x.line - y.line),
      consumer_question: `Does a consumer exist that is harmed by "${rule}" here (a real bug/a11y/correctness risk), or is it style-only?`,
    }));
  return { status: "ok", findings };
}

// ── Check B — Type safety gaps (real tsc + regex) ─────────────────────────
function checkB(timeoutMs) {
  const findings = [];
  const notes = [];

  // B1 — real typecheck
  const t = run("node", ["--max-old-space-size=6144", "./node_modules/typescript/bin/tsc", "-p", "tsconfig.typecheck.json", "--noEmit"], { timeoutMs });
  if (t.timedOut) {
    notes.push(`tsc timed out after ${t.timeoutMs}ms; regex type-safety scans still ran. Last stderr: ${t.stderr.slice(0, 200)}`);
  }
  const tout = `${t.stdout}\n${t.stderr}`;
  const tscErrLines = tout.split("\n").filter((l) => /error TS\d+:/.test(l));
  if (t.timedOut) {
    findings.push(makeFinding({
      id: "TYPE-tsc-timeout",
      severity: "MEDIUM",
      evidence: `tsc (node --max-old-space-size=6144 ./node_modules/typescript/bin/tsc -p tsconfig.typecheck.json --noEmit) timed out after ${t.timeoutMs}ms with no complete result.`,
      hits: [{ file: "tsconfig.typecheck.json", line: 0 }],
      consumer_question: "Is the typecheck hanging due to a pathological file/import graph, or does the timeout need adjustment for the current repo size?",
    }));
  } else if (tscErrLines.length > 0) {
    findings.push(makeFinding({
      id: "TYPE-tsc-errors",
      severity: "MEDIUM",
      evidence: `tsc (node --max-old-space-size=6144 ./node_modules/typescript/bin/tsc -p tsconfig.typecheck.json --noEmit) reported ${tscErrLines.length} error(s):\n${tscErrLines.slice(0, 10).join("\n")}`,
      hits: tscErrLines.slice(0, 10).map((l) => { const mm = l.match(/^([^(]+)\((\d+),/); return mm ? { file: mm[1], line: Number(mm[2]) } : { file: l.slice(0, 40), line: 0 }; }),
      consumer_question: "Does the affected code run in a shipped path, or is it dead/test-only?",
    }));
  } else {
    notes.push(`tsc --noEmit with 6144 MB heap: 0 errors (exit ${t.code}).`);
  }

  // B2 — explicit type escape hatches
  const anyCast = scanLines(SRC_FILES, () => /(\bas\s+any\b|:\s*any\b)/);
  if (anyCast.length) findings.push(makeFinding({
    id: "TYPE-any-escape",
    severity: "MEDIUM",
    evidence: `regex /\\bas any\\b | :\\s*any\\b/ over src — ${anyCast.length} hit(s). e.g. ${anyCast[0].file}:${anyCast[0].line}: ${anyCast[0].text}`,
    hits: anyCast,
    consumer_question: "Does a caller pass unvalidated data through these `any` sites such that a type would catch a real bug?",
  }));

  const tsDirective = scanLines(
    SRC_FILES,
    () => /@ts-(ignore|expect-error)\s*$/,
    (lines, i) => { const prev = (lines[i - 1] || "").trim(); return !prev.startsWith("//") && !prev.startsWith("*"); },
  );
  if (tsDirective.length) findings.push(makeFinding({
    id: "TYPE-ts-directive-unexplained",
    severity: "MEDIUM",
    evidence: `regex /@ts-(ignore|expect-error)$/ with no trailing text and no explanatory comment on the line above — ${tsDirective.length} hit(s). e.g. ${tsDirective[0].file}:${tsDirective[0].line}: ${tsDirective[0].text}`,
    hits: tsDirective,
    consumer_question: "Does the suppressed error hide a real type mismatch, or is the suppression legitimately safe (and just under-documented)?",
  }));

  // Non-null assertion applied directly to a nullable-returning external/async source.
  const bangExternal = scanLines(SRC_FILES, () => /(process\.env\.\w+|\.querySelector\([^)]*\)|\.getItem\([^)]*\)|\.find\([^)]*\)|\.match\([^)]*\))!/);
  if (bangExternal.length) findings.push(makeFinding({
    id: "TYPE-nonnull-on-external",
    severity: "MEDIUM",
    evidence: `regex: non-null "!" applied to a nullable source (process.env / querySelector / getItem / find / match) — ${bangExternal.length} hit(s). e.g. ${bangExternal[0].file}:${bangExternal[0].line}: ${bangExternal[0].text}`,
    hits: bangExternal,
    consumer_question: "Can this source actually be null/undefined at runtime (missing env, absent DOM node, no match) — i.e. does a crash path exist?",
  }));

  return { status: "ok", findings, notes };
}

// ── Check C — Unguarded external boundaries (regex + lookback) ────────────
function checkC() {
  const findings = [];

  // process.env.X with a direct property/method access (assumes non-null) OR
  // not obviously defaulted with ?? / || on the same line.
  const envUnguarded = scanLines(
    SRC_FILES,
    () => /process\.env\.\w+/,
    (lines, i) => {
      const l = lines[i];
      const directAccess = /process\.env\.\w+\s*[.[]/.test(l); // .trim(), [0], etc.
      const defaulted = /process\.env\.\w+\s*(\?\?|\|\|)/.test(l);
      const guarded = /if\s*\(|\?\?|\|\||typeof\s+process/.test(l);
      return directAccess || (!defaulted && !guarded);
    },
  );
  if (envUnguarded.length) findings.push(makeFinding({
    id: "BOUNDARY-env-unguarded",
    severity: "HIGH",
    evidence: `regex: process.env.<X> used without a same-line ?? / || default or if-guard (or with direct .prop/[idx] access) — ${envUnguarded.length} hit(s). e.g. ${envUnguarded[0].file}:${envUnguarded[0].line}: ${envUnguarded[0].text}`,
    hits: envUnguarded,
    consumer_question: "Does a deploy/runtime environment exist where this env var is unset, making this a boundary crash (same class as the Supabase env throw)?",
  }));

  // JSON.parse( with no try{ in the preceding 10 lines still open at this point.
  const jsonParse = scanLines(
    SRC_FILES,
    () => /JSON\.parse\s*\(/,
    (lines, i) => {
      let opens = 0;
      for (let k = Math.max(0, i - 10); k < i; k++) {
        if (/\btry\s*\{/.test(lines[k])) opens++;
        if (/\}\s*catch\b/.test(lines[k])) opens--;
      }
      return opens <= 0; // no open try above → unguarded
    },
  );
  if (jsonParse.length) findings.push(makeFinding({
    id: "BOUNDARY-jsonparse-unguarded",
    severity: "HIGH",
    evidence: `regex: JSON.parse( with no open try{ in the preceding 10 lines — ${jsonParse.length} hit(s). e.g. ${jsonParse[0].file}:${jsonParse[0].line}: ${jsonParse[0].text}`,
    hits: jsonParse,
    consumer_question: "Does untrusted/external input (network, storage, user) reach this JSON.parse such that malformed input would throw uncaught?",
  }));

  // supabase .data destructured without a sibling error binding.
  // Refinement (v2): drop two false-positive classes the H8 exercise exposed —
  //   (1) auth reads (supabase.auth.getUser/getSession/getClaims): the error is
  //       an auth failure, not a data-query swallow, and callers already handle
  //       the null-user path (e.g. speechAttempts.ts, learnerCapture.ts,
  //       notebookService.ts).
  //   (2) reads inside an open try{ … } block: the error is not silently
  //       dropped, it surfaces via the surrounding catch.
  const supabaseData = scanLines(
    SRC_FILES,
    () => /const\s*\{\s*data\s*(:\s*\w+)?\s*\}\s*=\s*await\s+/,
    (lines, i) => {
      const authRe = /\.auth\.(getUser|getSession|getClaims)/;
      // the awaited call may spill onto the next 1–2 lines
      if (authRe.test(lines[i]) || authRe.test(lines[i + 1] || "") || authRe.test(lines[i + 2] || "")) return false;
      // inside an open try above (no intervening catch) → not a silent swallow
      let opens = 0;
      for (let k = Math.max(0, i - 10); k < i; k++) {
        if (/\btry\s*\{/.test(lines[k])) opens++;
        if (/\}\s*catch\b/.test(lines[k])) opens--;
      }
      return opens <= 0;
    },
  );
  if (supabaseData.length) findings.push(makeFinding({
    id: "BOUNDARY-async-data-no-error",
    severity: "HIGH",
    evidence: `regex: "const { data } = await …" destructures data with no sibling { error } binding (v2: excludes auth.get* reads and try/catch-wrapped calls) — ${supabaseData.length} hit(s). e.g. ${supabaseData[0].file}:${supabaseData[0].line}: ${supabaseData[0].text}`,
    hits: supabaseData,
    consumer_question: "Does this data query have an error channel (Supabase/fetch) that is being ignored, so a failed call silently yields undefined data downstream?",
  }));

  return { status: "ok", findings };
}

// ── Check D — Dependency vulnerabilities (real npm audit) ─────────────────
function checkD(timeoutMs) {
  const r = run("npm", ["audit", "--json"], { timeoutMs });
  if (r.timedOut) return { status: "SKIPPED", note: `npm audit timed out after ${r.timeoutMs}ms; likely advisory/network stall. Last stderr: ${r.stderr.slice(0, 200)}`, findings: [] };
  const raw = r.stdout.trim();
  if (!raw) return { status: "SKIPPED", note: `npm audit produced no JSON (offline?): ${r.stderr.slice(0, 200)}`, findings: [] };
  let j;
  try { j = JSON.parse(raw); } catch { return { status: "SKIPPED", note: "npm audit JSON parse failed", findings: [] }; }
  const vulns = j.vulnerabilities || {};
  const order = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 };
  const sevMap = { critical: "HIGH", high: "HIGH", moderate: "HIGH", low: "HIGH", info: "HIGH" }; // all vulns = HIGH per rubric
  const findings = Object.values(vulns)
    .sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9) || String(a.name).localeCompare(String(b.name)))
    .map((v) => {
      const advisories = (v.via || []).filter((x) => typeof x === "object");
      const cite = advisories.length
        ? advisories.map((x) => `${x.severity}: ${x.title || x.name} (${x.url || x.source})`).join("; ")
        : `via ${(v.via || []).join(", ")}`;
      return makeFinding({
        id: `VULN-${v.name}`,
        severity: sevMap[v.severity] || "HIGH",
        evidence: `npm audit: ${v.name} — severity=${v.severity}; fixAvailable=${JSON.stringify(v.fixAvailable)}. Advisory: ${cite}`,
        hits: [{ file: `node_modules/${v.name}`, line: 0 }],
        consumer_question: `Does a shipped code path import "${v.name}" in a way that reaches the vulnerable surface, or is it dev/transitive-only?`,
      });
    });
  return { status: "ok", findings, note: `npm audit metadata: ${JSON.stringify(j.metadata?.vulnerabilities || {})}` };
}

// ── Check E — Silent-failure patterns (regex) ─────────────────────────────
function checkE() {
  const findings = [];

  const emptyCatch = scanText(SRC_FILES, () => /catch\s*(\([^)]*\))?\s*\{\s*\}/g);
  if (emptyCatch.length) findings.push(makeFinding({
    id: "SILENT-empty-catch",
    severity: "MEDIUM",
    evidence: `regex /catch(\\(...\\))?{ }/ — empty catch body, ${emptyCatch.length} hit(s). e.g. ${emptyCatch[0].file}:${emptyCatch[0].line}: ${emptyCatch[0].text}`,
    hits: emptyCatch,
    consumer_question: "Does the swallowed error carry information a user or operator needs (vs. a genuinely ignorable best-effort call)?",
  }));

  const swallowedCatch = scanText(SRC_FILES, () => /\.catch\(\s*(async\s*)?\(\s*\w*\s*\)\s*=>\s*\{\s*\}\s*\)/g);
  if (swallowedCatch.length) findings.push(makeFinding({
    id: "SILENT-swallowed-rejection",
    severity: "MEDIUM",
    evidence: `regex /.catch(() => { })/ — swallowed promise rejection, ${swallowedCatch.length} hit(s). e.g. ${swallowedCatch[0].file}:${swallowedCatch[0].line}: ${swallowedCatch[0].text}`,
    hits: swallowedCatch,
    consumer_question: "Does this promise's failure matter to any consumer (data not saved, audio not played), or is dropping it correct?",
  }));

  const logOnlyCatch = scanText(SRC_FILES, () => /catch\s*(\([^)]*\))?\s*\{\s*console\.(error|warn|log)\([^;{}]*\);?\s*\}/g);
  if (logOnlyCatch.length) findings.push(makeFinding({
    id: "SILENT-catch-logs-only",
    severity: "MEDIUM",
    evidence: `regex: catch body is a lone console.* call (no rethrow/return) — ${logOnlyCatch.length} hit(s). e.g. ${logOnlyCatch[0].file}:${logOnlyCatch[0].line}: ${logOnlyCatch[0].text}`,
    hits: logOnlyCatch,
    consumer_question: "In a critical path, should this failure surface to the user/caller rather than only reaching the console?",
  }));

  return { status: "ok", findings };
}

// ── Check F — v3: storage/network JSON.parse boundaries ──────────────────
function checkF() {
  const jsonParse = scanLines(
    APP_FILES,
    () => /JSON\.parse\s*\(/,
    (lines, i) => {
      if (isInTryBlock(lines, i, 12)) return false;
      if (/\btry\s*\{[^}]*JSON\.parse\s*\([^}]*\}\s*catch\b/.test(lines[i])) return false;
      const callsite = windowText(lines, i, 5);
      const storageOrNetworkInput = /(localStorage|sessionStorage|\.getItem\s*\(|request\.|req\.|response\.|res\.|event\.data|\.text\s*\(\)|\.json\s*\(\)|body|payload|message\.data|FileReader|WebSocket)/.test(callsite);
      const obviousStaticOrTestFixture = /JSON\.parse\s*\(\s*["'`{[]/.test(lines[i]) || /JSON\.stringify|structuredClone/.test(callsite);
      return storageOrNetworkInput && !obviousStaticOrTestFixture;
    },
  );
  const findings = [];
  if (jsonParse.length) findings.push(makeFinding({
    id: "V3-jsonparse-storage-network-unguarded",
    severity: "HIGH",
    evidence: `v3 callsite scan: unguarded JSON.parse where the local callsite references storage/network/body input, excluding tests, src/lib/tutor/**, static literals, and parse-inside-try — ${jsonParse.length} hit(s). e.g. ${jsonParse[0].file}:${jsonParse[0].line}: ${jsonParse[0].text}`,
    hits: jsonParse,
    consumer_question: "Can a learner or deployed request carry malformed storage/network data to this parse and crash or lose state?",
  }));
  return { status: "ok", findings };
}

// ── Check G — v3: fire-and-forget promises with swallowed rejection ───────
function checkG() {
  const swallowed = scanText(
    APP_FILES,
    () => /(^|[;\n]\s*)(void\s+)?(?!await\b|return\b)([A-Za-z_$][\w$.[\]()'"`,\s?:-]+?)\.catch\s*\(\s*(async\s*)?\(?\s*\w*\s*\)?\s*=>\s*\{\s*(?:console\.(?:debug|log|warn)\([^{};]*\);?)?\s*\}\s*\)/gm,
  ).filter((hit) => !/intentional|best-effort|noncritical|fire-and-forget-ok/i.test(hit.text));
  const findings = [];
  if (swallowed.length) findings.push(makeFinding({
    id: "V3-fire-forget-swallowed-rejection",
    severity: "HIGH",
    evidence: `v3 callsite scan: unawaited promise expression with empty/log-only .catch(), excluding tests, src/lib/tutor/**, and explicit intentional/best-effort markers — ${swallowed.length} hit(s). e.g. ${swallowed[0].file}:${swallowed[0].line}: ${swallowed[0].text}`,
    hits: swallowed,
    consumer_question: "Does the promise persist learner/app state or call a backend where a dropped rejection would silently lose data?",
  }));
  return { status: "ok", findings };
}

// ── Check H — v3: fetch/invoke without timeout/AbortController ────────────
function checkH() {
  const noTimeout = scanLines(
    APP_FILES,
    () => /\b(fetch\s*\(|\.functions\.invoke\s*\(|supabase\.functions\.invoke\s*\()/,
    (lines, i) => {
      const callsite = objectLiteralAtCallsite(lines, i);
      const nearby = windowText(lines, i, 8);
      if (/signal\s*:|AbortController|AbortSignal\.timeout|timeoutMs|withTimeout|fetchWithTimeout|invokeWithTimeout/.test(callsite) || /AbortController|AbortSignal\.timeout|withTimeout|fetchWithTimeout|invokeWithTimeout/.test(nearby)) return false;
      if (/new\s+Request\s*\(|addEventListener\s*\(\s*["']fetch/.test(nearby)) return false;
      return true;
    },
  );
  const findings = [];
  if (noTimeout.length) findings.push(makeFinding({
    id: "V3-network-call-no-timeout",
    severity: "HIGH",
    evidence: `v3 callsite scan: fetch()/supabase.functions.invoke() with no nearby signal/AbortController/timeout wrapper, excluding tests and src/lib/tutor/** — ${noTimeout.length} hit(s). e.g. ${noTimeout[0].file}:${noTimeout[0].line}: ${noTimeout[0].text}`,
    hits: noTimeout,
    consumer_question: "Can this learner-facing request hang until platform timeout and surface as a 502/blank state instead of a bounded failure?",
  }));
  return { status: "ok", findings };
}

// ── Check I — v3: edge/api env reads without missing-var handling ─────────
function checkI() {
  const envReads = scanLines(
    ENV_BOUNDARY_FILES,
    () => /(process\.env\.[A-Z0-9_]+|Deno\.env\.get\s*\(\s*["'][A-Z0-9_]+["']\s*\))/,
    (lines, i) => {
      const l = lines[i];
      const nearby = windowText(lines, i, 6);
      if (/\?\?|\|\||if\s*\(|throw\s+new\s+Error|return\s+new\s+Response|missing|required|assert|envValue|requireEnv|getRequiredEnv|getEnv/.test(l)) return false;
      if (/if\s*\([^)]*(process\.env|Deno\.env\.get)|throw\s+new\s+Error|return\s+new\s+Response|missing|required|envValue|requireEnv|getRequiredEnv|getEnv/.test(nearby)) return false;
      return true;
    },
  );
  const findings = [];
  if (envReads.length) findings.push(makeFinding({
    id: "V3-api-env-read-no-missing-handling",
    severity: "HIGH",
    evidence: `v3 callsite scan: process.env/Deno.env.get in api/**, functions/**, supabase/functions/** without nearby default, explicit missing-var branch, or required-env helper, excluding src/lib/tutor/** — ${envReads.length} hit(s). e.g. ${envReads[0].file}:${envReads[0].line}: ${envReads[0].text}`,
    hits: envReads,
    consumer_question: "Can a deployed function miss this env var and crash at runtime instead of returning a controlled error or disabling optional work?",
  }));
  return { status: "ok", findings };
}

// ── Check J — v4: async UI request state without terminal failure state ────
function checkJ() {
  const hits = [];
  for (const file of AI_TUTOR_UI_FILES) {
    let content;
    try { content = fs.readFileSync(file, "utf8"); } catch { continue; }
    hits.push(...scanAsyncUiStateNoTerminalFailureFromText(content, rel(file)));
  }
  const findings = [];
  if (hits.length) findings.push(makeFinding({
    id: "V4-async-ui-state-no-terminal-failure",
    severity: "HIGH",
    evidence: `v4 callsite scan: learner-visible /ai-tutor async request state sets pending/loading true around a network/provider call but lacks a bounded terminal failure state plus retry affordance; excludes tests, src/lib/tutor/**, telemetry/fire-and-forget blocks — ${hits.length} hit(s). e.g. ${hits[0].file}:${hits[0].line}: ${hits[0].text}`,
    hits,
    consumer_question: "Can this learner-visible action fail or time out while leaving the UI stuck in a listening/waiting/loading state with no retry?",
  }));
  return { status: "ok", findings };
}

// ── Orchestrate ───────────────────────────────────────────────────────────
function main() {
  const started = new Date().toISOString();

  // Default scan target is origin/main, not HEAD: findings should describe the
  // canonical shipped code, not whatever dirty feature branch happens to be
  // checked out. Override with HARDENING_SCAN_REF. The analysis tools
  // (eslint/tsc/npm audit) necessarily read the on-disk working tree, so when
  // that tree diverges from the target ref we say so loudly rather than let a
  // branch scan masquerade as a main scan.
  const scanRef = (process.env.HARDENING_SCAN_REF || "origin/main").trim();
  run("git", ["fetch", "origin", "--quiet"]); // best-effort; offline → stale ref sha
  const refSha = run("git", ["rev-parse", "--short", scanRef]).stdout.trim() || "unknown";
  const headSha = run("git", ["rev-parse", "--short", "HEAD"]).stdout.trim() || "unknown";
  const dirty = run("git", ["status", "--porcelain"]).stdout.trim().length > 0;
  const treeMatchesRef = headSha === refSha && !dirty;

  const versions = {
    eslint: run("npx", ["--no-install", "eslint", "--version"]).stdout.trim() || "MISSING",
    tsc: run("npx", ["--no-install", "tsc", "--version"]).stdout.trim() || "MISSING",
    npm: run("npm", ["--version"]).stdout.trim() || "MISSING",
    node: process.version,
  };

  const checkFns = { A: checkA, B: checkB, C: checkC, D: checkD, E: checkE, F: checkF, G: checkG, H: checkH, I: checkI, J: checkJ };
  const labels = {
    A: "Lint debt (eslint)",
    B: "Type safety gaps (tsc + patterns)",
    C: "Unguarded external boundaries",
    D: "Dependency vulnerabilities (npm audit)",
    E: "Silent-failure patterns",
    F: "v3 storage/network JSON.parse boundaries",
    G: "v3 fire-and-forget swallowed rejections",
    H: "v3 network calls without timeouts",
    I: "v3 api/function env reads without missing-var handling",
    J: "v4 async UI request states without terminal failure state",
  };
  const requestedChecks = (process.env.HARDENING_SCAN_CHECKS || "")
    .split(",")
    .map((k) => k.trim().toUpperCase())
    .filter(Boolean);
  const checkKeys = requestedChecks.length
    ? requestedChecks.filter((k) => Object.hasOwn(checkFns, k))
    : Object.keys(checkFns);
  const checks = Object.fromEntries(checkKeys.map((k) => [k, runCheck(k, labels[k], checkFns[k])]));

  const skipped = Object.entries(checks).filter(([, c]) => c.status === "SKIPPED").map(([k]) => k);
  const ran = Object.keys(checks).filter((k) => !skipped.includes(k));

  const allFindings = [];
  for (const [k, c] of Object.entries(checks)) for (const f of c.findings) allFindings.push({ check: k, ...f });
  allFindings.sort((a, b) => SEV_RANK[a.severity] - SEV_RANK[b.severity] || a.id.localeCompare(b.id));

  const L = [];
  L.push(`# Hardening Scan — ${started} — target ${scanRef} @ ${refSha}`);
  L.push("");
  if (!treeMatchesRef) {
    L.push(`> ⚠ Working tree does NOT match ${scanRef} (HEAD @ ${headSha}${dirty ? ", dirty" : ""}).`);
    L.push(`> Findings below reflect the on-disk working tree, not pristine ${scanRef}.`);
    L.push(`> For a clean ${scanRef} scan, run from a fresh checkout of that ref.`);
    L.push("");
  }
  L.push(`Tool versions: eslint ${versions.eslint}, tsc ${versions.tsc}, npm ${versions.npm}, node ${versions.node}`);
  L.push(`Checks run: ${ran.join(",") || "none"}   Checks skipped: ${skipped.length ? skipped.join(",") : "none"}`);
  for (const k of skipped) L.push(`  - SKIPPED ${k} (${labels[k]}): ${checks[k].note || "tool unavailable"}`);
  const notes = Object.values(checks).flatMap((c) => c.notes || []).concat(Object.values(checks).map((c) => c.note).filter(Boolean));
  for (const n of notes) L.push(`  - note: ${n}`);
  for (const [k, c] of Object.entries(checks)) L.push(`  - check ${k} elapsed_ms=${c.elapsedMs ?? "unknown"} timeout_ms=${c.timeoutMs ?? "n/a"}`);
  L.push("");

  const counts = Object.fromEntries(Object.entries(checks).map(([k, c]) => [k, c.findings.length]));
  L.push(`Finding counts — ${Object.keys(checks).map((k) => `${k}:${counts[k]}`).join(" ")}  (total ${allFindings.length})`);
  L.push("");
  L.push("## Findings ranked by severity");
  if (allFindings.length === 0) {
    L.push("");
    L.push("0 findings across all checks.");
  }
  for (const f of allFindings) {
    const shown = f.locations.slice(0, 10);
    const more = f.locations.length > 10 ? ` (+${f.locations.length - 10} more)` : "";
    L.push("");
    L.push(`### [${f.severity}] ${f.id}  (check ${f.check})`);
    L.push(`- id: ${f.id}`);
    L.push(`- severity: ${f.severity}`);
    L.push(`- evidence: ${f.evidence}`);
    L.push(`- locations: ${shown.join(", ") || "n/a"}${more}`);
    L.push(`- consumer_question: ${f.consumer_question}`);
  }

  // Honest empty sections (per Step 3): name checks that produced nothing.
  L.push("");
  L.push("## Per-check summary");
  for (const k of Object.keys(checks)) {
    const c = checks[k];
    if (c.status === "SKIPPED") L.push(`- ${k} ${labels[k]}: SKIPPED`);
    else L.push(`- ${k} ${labels[k]}: ${c.findings.length === 0 ? "0 findings" : `${c.findings.length} finding(s)`}`);
  }

  L.push("");
  L.push("## Explicitly NOT included");
  L.push("- No suggested workpacks. No priorities beyond severity. No fix-now recommendations.");
  L.push("- The scanner stops at findings; authorization (the Law-1 gate) is the human's job.");

  const report = L.join("\n") + "\n";
  process.stdout.write(report);

  const stamp = started.replace(/[:.]/g, "-");
  const outPath = path.join("reports", `hardening-scan-${stamp}.md`);
  try {
    fs.mkdirSync("reports", { recursive: true });
    fs.writeFileSync(outPath, report);
    process.stderr.write(`\n[report written] ${outPath}\n`);
  } catch (e) {
    process.stderr.write(`\n[report write failed] ${e.message}\n`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
