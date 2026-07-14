#!/usr/bin/env node
// Static auth-boundary intent scanner.

import fs from "node:fs";
import path from "node:path";

export const DEFAULT_INTENT_PATH = "security/auth-intent.json";
export const DEFAULT_REPORT_PATH = "reports/security/auth-matrix.md";
export const CLASSIFICATIONS = [
  "bearer-required",
  "anon-key-open",
  "service-role-only",
  "public-unauthenticated",
];

const SOURCE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const USER_DATA_RE = /\b(user_id|auth\.uid|profile|profiles|subscription|entitlement|billing|payment|email|account|student|learner|family|certificate|push_token|room_member|security_event)\b/i;
const WRITE_RE = /\.(insert|update|upsert|delete)\s*\(|\b(insert\s+into|update\s+public\.|delete\s+from|alter\s+table|create\s+table)\b|\bmethod\s*:\s*["'](?:POST|PUT|PATCH|DELETE)["']|\brequest\.method\s*={0,2}\s*["'](?:POST|PUT|PATCH|DELETE)["']/i;
const SERVICE_ROLE_RE = /\b(SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE|service_role|serviceRole|supabaseAdmin|adminClient|createAdminClient)\b/;
const BEARER_RE = /\b(Authorization|authorization)\b|Bearer\s+|auth\.getUser\s*\(|auth\.getSession\s*\(|getUser\s*\(|requireAuth|verifyJwt|jwtVerify|get_admin_level|has_role\s*\(/;
const ANON_RE = /\b(SUPABASE_ANON_KEY|VITE_SUPABASE_ANON_KEY|anonKey|createClient\s*\([^,]+,\s*(?:supabaseAnonKey|anon))\b|\.from\s*\(|\.rpc\s*\(/;

function rel(root, file) {
  return path.relative(root, file) || file;
}

function lineForOffset(text, offset) {
  return text.slice(0, offset).split(/\r?\n/).length;
}

function walk(dir, acc = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return acc; }
  for (const entry of entries) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "dist" || entry.name === "state") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (SOURCE_EXTS.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}

function read(file) {
  try { return fs.readFileSync(file, "utf8"); } catch { return ""; }
}

function firstLineFor(text, re) {
  const match = re.exec(text);
  return match ? lineForOffset(text, match.index) : 1;
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function stripComments(source) {
  return String(source || "")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/.*$/gm, "$1 ");
}

function pagesRouteFromFile(file) {
  let route = file.replace(/^functions\//, "/").replace(/\.[cm]?[tj]sx?$/, "");
  route = route.replace(/\/index$/, "");
  return route || "/";
}

function parseSupabaseVerifyJwt(root) {
  const config = read(path.join(root, "supabase/config.toml"));
  const settings = new Map();
  let current = null;
  for (const rawLine of config.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    const header = line.match(/^\[functions\.([^\]]+)\]$/);
    if (header) {
      current = header[1];
      continue;
    }
    const verify = line.match(/^verify_jwt\s*=\s*(true|false)\b/i);
    if (current && verify) settings.set(current, verify[1].toLowerCase() === "true");
  }
  return settings;
}

function classifySource({ source, verifyJwt }) {
  const code = stripComments(source);
  const evidence = [];
  const hasServiceRole = SERVICE_ROLE_RE.test(code);
  const hasBearer = BEARER_RE.test(code);
  const hasAnon = ANON_RE.test(code);
  if (verifyJwt === true) evidence.push("supabase/config.toml verify_jwt=true");
  if (verifyJwt === false) evidence.push("supabase/config.toml verify_jwt=false");
  if (hasBearer) evidence.push("auth/JWT/header/admin-role check observed");
  if (hasServiceRole) evidence.push("service-role/admin client observed");
  if (hasAnon) evidence.push("Supabase anon/RLS client operation observed");

  if (verifyJwt === true || hasBearer) return { classification: "bearer-required", evidence };
  if (hasServiceRole && !hasAnon) return { classification: "service-role-only", evidence };
  if (hasAnon) return { classification: "anon-key-open", evidence };
  if (hasServiceRole) return { classification: "service-role-only", evidence };
  return { classification: "public-unauthenticated", evidence: evidence.length ? evidence : ["no auth gate or Supabase RLS reliance observed"] };
}

function scanPagesFunctions(root) {
  const dir = path.join(root, "functions");
  return walk(dir)
    .filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file))
    .sort()
    .map((file) => {
      const source = read(file);
      const classified = classifySource({ source });
      const route = pagesRouteFromFile(rel(root, file));
      return endpointRecord({
        id: `pages:${route}`,
        kind: "cloudflare-pages-function",
        route,
        source_file: rel(root, file),
        source_line: firstLineFor(source, BEARER_RE) || 1,
        source,
        ...classified,
      });
    });
}

function scanSupabaseFunctions(root) {
  const base = path.join(root, "supabase/functions");
  const verifyJwt = parseSupabaseVerifyJwt(root);
  let entries;
  try { entries = fs.readdirSync(base, { withFileTypes: true }); } catch { return []; }
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_") && entry.name !== "shared")
    .map((entry) => {
      const index = path.join(base, entry.name, "index.ts");
      return { name: entry.name, index };
    })
    .filter(({ index }) => fs.existsSync(index))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ name, index }) => {
      const source = read(index);
      const configured = verifyJwt.has(name) ? verifyJwt.get(name) : null;
      const classified = classifySource({ source, verifyJwt: configured });
      return endpointRecord({
        id: `edge:${name}`,
        kind: "supabase-edge-function",
        route: `/functions/v1/${name}`,
        source_file: rel(root, index),
        source_line: configured !== null ? 1 : firstLineFor(source, BEARER_RE),
        source,
        verify_jwt: configured,
        ...classified,
      });
    });
}

function findSqlFunction(root, name) {
  const migrations = path.join(root, "supabase/migrations");
  const files = [];
  try {
    for (const file of fs.readdirSync(migrations).filter((item) => item.endsWith(".sql")).sort()) files.push(path.join(migrations, file));
  } catch {
    return null;
  }
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`create\\s+(?:or\\s+replace\\s+)?function\\s+(?:public\\.)?${escaped}\\s*\\(`, "i");
  for (const file of files) {
    const sql = read(file);
    const match = re.exec(sql);
    if (!match) continue;
    const tail = sql.slice(match.index, Math.min(sql.length, match.index + 6000));
    return {
      file: rel(root, file),
      line: lineForOffset(sql, match.index),
      source: tail,
    };
  }
  return null;
}

function scanClientRpc(root) {
  const roots = ["src", "functions", "supabase/functions"];
  const files = roots
    .map((item) => path.join(root, item))
    .flatMap((item) => walk(item))
    .filter((file) => !rel(root, file).startsWith("src/lib/tutor/") && !/(^|\/)__tests__\//.test(rel(root, file)))
    .sort();
  const endpoints = new Map();
  const rpcRe = /\.rpc\s*\(\s*["']([^"']+)["']/g;
  for (const file of files) {
    const source = read(file);
    let match;
    while ((match = rpcRe.exec(source)) !== null) {
      const name = match[1];
      const sql = findSqlFunction(root, name);
      const combined = `${source.slice(Math.max(0, match.index - 900), match.index + 1400)}\n${sql?.source || ""}`;
      const classified = classifySource({ source: combined });
      const prior = endpoints.get(name);
      const callsite = { file: rel(root, file), line: lineForOffset(source, match.index) };
      const record = prior || endpointRecord({
        id: `rpc:${name}`,
        kind: "client-invoked-rpc",
        route: `rpc:${name}`,
        source_file: sql?.file || callsite.file,
        source_line: sql?.line || callsite.line,
        source: combined,
        classification: classified.classification === "public-unauthenticated" ? "anon-key-open" : classified.classification,
        evidence: [...classified.evidence, sql ? `SQL function definition observed at ${sql.file}:${sql.line}` : "client RPC callsite observed; SQL definition not found in migrations"],
        callsites: [],
      });
      record.callsites.push(callsite);
      endpoints.set(name, record);
    }
  }
  return [...endpoints.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function endpointRecord(input) {
  const code = stripComments(input.source);
  const writes = WRITE_RE.test(code);
  const userScopedData = USER_DATA_RE.test(code);
  const reviewFlag = (input.classification === "public-unauthenticated" || input.classification === "anon-key-open")
    && (writes || userScopedData);
  return {
    id: input.id,
    kind: input.kind,
    route: input.route,
    classification: input.classification,
    source_file: input.source_file,
    source_line: input.source_line || 1,
    verify_jwt: input.verify_jwt ?? null,
    evidence: [...new Set(input.evidence || [])].sort(),
    writes,
    returns_user_scoped_data: userScopedData,
    review_flag: reviewFlag,
    callsites: input.callsites || [],
  };
}

export function scanAuthBoundaries({ root = process.cwd() } = {}) {
  const endpoints = [
    ...scanPagesFunctions(root),
    ...scanSupabaseFunctions(root),
    ...scanClientRpc(root),
  ].sort((a, b) => a.id.localeCompare(b.id));
  return {
    scan_roots: ["functions", "supabase/functions", "src"],
    endpoints,
  };
}

export function buildAuthIntent(scan) {
  return {
    schema_version: 1,
    generated_by: "scripts/security/auth-matrix-scan.mjs",
    scan_roots: scan.scan_roots,
    endpoints: Object.fromEntries(scan.endpoints.map((endpoint) => [
      endpoint.id,
      {
        kind: endpoint.kind,
        route: endpoint.route,
        classification: endpoint.classification,
        writes: endpoint.writes,
        returns_user_scoped_data: endpoint.returns_user_scoped_data,
        review_flag: endpoint.review_flag,
      },
    ])),
  };
}

function semanticEndpoint(endpoint) {
  return {
    kind: endpoint.kind,
    route: endpoint.route,
    classification: endpoint.classification,
    writes: Boolean(endpoint.writes),
    returns_user_scoped_data: Boolean(endpoint.returns_user_scoped_data),
    review_flag: Boolean(endpoint.review_flag),
  };
}

export function compareAuthIntent(scan, intent) {
  const current = buildAuthIntent(scan);
  const findings = [];
  const ids = new Set([...Object.keys(current.endpoints), ...Object.keys(intent.endpoints || {})]);
  for (const id of [...ids].sort()) {
    const actual = current.endpoints[id];
    const expected = intent.endpoints?.[id];
    const scanned = scan.endpoints.find((endpoint) => endpoint.id === id);
    const hit = scanned || { source_file: DEFAULT_INTENT_PATH, source_line: 1 };
    if (!expected && actual) {
      findings.push({
        type: "new_endpoint_without_manifest",
        endpoint: id,
        file: hit.source_file,
        line: hit.source_line,
        detail: "callable boundary exists in code but not in security/auth-intent.json",
      });
      continue;
    }
    if (expected && !actual) {
      findings.push({
        type: "manifest_endpoint_missing",
        endpoint: id,
        file: DEFAULT_INTENT_PATH,
        line: 1,
        detail: "endpoint is present in security/auth-intent.json but not in parsed code",
      });
      continue;
    }
    if (JSON.stringify(semanticEndpoint(actual)) !== JSON.stringify(semanticEndpoint(expected))) {
      findings.push({
        type: "endpoint_auth_intent_drift",
        endpoint: id,
        file: hit.source_file,
        line: hit.source_line,
        detail: "parsed endpoint auth classification or risk flags differ from security/auth-intent.json",
      });
    }
  }
  return findings;
}

function escapeCell(value) {
  return compact(value).replaceAll("|", "\\|");
}

export function authClassificationCounts(scan) {
  return Object.fromEntries(CLASSIFICATIONS.map((name) => [
    name,
    scan.endpoints.filter((endpoint) => endpoint.classification === name).length,
  ]));
}

export function buildAuthMatrixReport(scan, intent, drift = []) {
  const counts = authClassificationCounts(scan);
  const flagged = scan.endpoints.filter((endpoint) => endpoint.review_flag);
  const lines = [];
  lines.push("# Auth Boundary Matrix");
  lines.push("");
  lines.push("Static scan only. Source: `functions/**`, `supabase/functions/**`, client RPC callsites, and SQL function definitions in migrations when present.");
  lines.push("");
  lines.push("## Review Flags");
  lines.push("");
  if (!flagged.length) {
    lines.push("No public-unauthenticated or anon-key-open endpoints with write/user-scoped-data signals were observed.");
  } else {
    lines.push("| Endpoint | Classification | Writes | User-scoped data | Source | Evidence |");
    lines.push("|---|---|---:|---:|---|---|");
    for (const endpoint of flagged) {
      lines.push(`| \`${endpoint.id}\` | ${endpoint.classification} | ${endpoint.writes ? "yes" : "no"} | ${endpoint.returns_user_scoped_data ? "yes" : "no"} | \`${endpoint.source_file}:${endpoint.source_line}\` | ${escapeCell(endpoint.evidence.join("; "))} |`);
    }
  }
  lines.push("");
  lines.push("## Summary");
  lines.push(`- endpoints_observed: ${scan.endpoints.length}`);
  for (const key of CLASSIFICATIONS) lines.push(`- ${key}: ${counts[key]}`);
  lines.push(`- manifest_endpoints: ${Object.keys(intent.endpoints || {}).length}`);
  lines.push(`- manifest_drift_findings: ${drift.length}`);
  lines.push("");
  lines.push("## Endpoints");
  lines.push("");
  lines.push("| Endpoint | Kind | Route/RPC | Classification | Writes | User-scoped data | Source | Evidence |");
  lines.push("|---|---|---|---|---:|---:|---|---|");
  for (const endpoint of scan.endpoints) {
    lines.push(`| \`${endpoint.id}\` | ${endpoint.kind} | \`${endpoint.route}\` | ${endpoint.classification} | ${endpoint.writes ? "yes" : "no"} | ${endpoint.returns_user_scoped_data ? "yes" : "no"} | \`${endpoint.source_file}:${endpoint.source_line}\` | ${escapeCell(endpoint.evidence.join("; "))} |`);
  }
  if (drift.length) {
    lines.push("");
    lines.push("## Manifest Drift");
    for (const item of drift) lines.push(`- ${item.type}: \`${item.endpoint}\` at \`${item.file}:${item.line}\` - ${item.detail}`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function writeGenerated(root) {
  const scan = scanAuthBoundaries({ root });
  const intent = buildAuthIntent(scan);
  const drift = compareAuthIntent(scan, intent);
  const intentPath = path.join(root, DEFAULT_INTENT_PATH);
  const reportPath = path.join(root, DEFAULT_REPORT_PATH);
  fs.mkdirSync(path.dirname(intentPath), { recursive: true });
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(intentPath, `${JSON.stringify(intent, null, 2)}\n`);
  fs.writeFileSync(reportPath, buildAuthMatrixReport(scan, intent, drift));
  console.log(JSON.stringify({
    intent_path: DEFAULT_INTENT_PATH,
    report_path: DEFAULT_REPORT_PATH,
    endpoints: scan.endpoints.length,
    counts: authClassificationCounts(scan),
    review_flags: scan.endpoints.filter((endpoint) => endpoint.review_flag).length,
  }, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--write")) writeGenerated(process.cwd());
  else {
    const scan = scanAuthBoundaries();
    process.stdout.write(`${JSON.stringify(buildAuthIntent(scan), null, 2)}\n`);
  }
}
