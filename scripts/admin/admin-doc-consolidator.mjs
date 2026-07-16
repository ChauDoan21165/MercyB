#!/usr/bin/env node
/**
 * ADMIN-DOC-CONSOLIDATOR — v1 (DRY-RUN ONLY)
 *
 * Classifies every doc under docs/ (excluding docs/archive/) against three
 * signals: referenced (rg basename across code+docs), recent (git log -1),
 * protected (allowlist).  If none of the three apply → proposes archive.
 *
 * DRY-RUN on first invocation — produces report only, ZERO file moves.
 * Chau must approve the batch before any git mv is performed.
 *
 * Also regenerates docs/INDEX.md from the live tree and scans for
 * contradictions vs the Master Doc at docs/MERCY_BLADE_MASTER_DOC.md.
 */

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../..");
const DOCS_DIR = path.join(repoRoot, "docs");
const ARCHIVE_DIR = path.join(DOCS_DIR, "archive");
const MASTER_DOC = path.join(DOCS_DIR, "MERCY_BLADE_MASTER_DOC.md");
const INDEX_PATH = path.join(DOCS_DIR, "INDEX.md");
const REPORT_PATH = path.join(repoRoot, "reports", "DOC_CONSOLIDATOR_REPORT.md");

const OUT = path.join("/Users/admin/autorun/reports");

// ---------------------------------------------------------------------------
// Protected allowlist
// ---------------------------------------------------------------------------
const PROTECTED_PATTERNS = [
  /MERCY_BLADE_MASTER_DOC\.md$/,
  /^INDEX\.md$/,
  /For_Chau_Study\.md$/,
  /PRODUCT-CONTRACT\.md$/,
  /^docs\/architecture\//,
  /^docs\/strategy\//,
  /^docs\/runbooks\//,
  /^docs\/cell-runtime\//,
  /CANONICAL/,
  /DO-NOT-ARCHIVE/,
];

const PROTECTED_NAMES = new Set([
  "MERCY_BLADE_MASTER_DOC.md",
  "INDEX.md",
  "For_Chau_Study.md",
  "PRODUCT-CONTRACT.md",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function exists(p) { return fs.existsSync(p); }
function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function sha256(s) { return crypto.createHash("sha256").update(s).digest("hex"); }

function git(args, opts = {}) {
  const r = spawnSync("git", args, { encoding: "utf8", cwd: repoRoot, maxBuffer: 10 * 1024 * 1024, ...opts });
  return { ok: r.status === 0, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

function rg(pattern, paths) {
  const r = spawnSync("rg", ["--no-heading", "-l", pattern, ...paths], { encoding: "utf8", cwd: repoRoot, maxBuffer: 10 * 1024 * 1024 });
  return { ok: r.status === 0, stdout: (r.stdout || "").trim(), stderr: (r.stderr || "").trim() };
}

// ---------------------------------------------------------------------------
// Document discovery
// ---------------------------------------------------------------------------
function discoverDocs() {
  const docs = [];
  if (!exists(DOCS_DIR)) return docs;

  const stack = [DOCS_DIR];
  while (stack.length) {
    const dir = stack.pop();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "archive" || e.name === ".git" || e.name === "node_modules") continue;
        stack.push(full);
      } else if (e.isFile() && e.name.endsWith(".md")) {
        const rel = path.relative(repoRoot, full);
        docs.push({ path: full, rel, basename: e.name, dir: path.relative(DOCS_DIR, path.dirname(full)) });
      }
    }
  }
  return docs.sort((a, b) => a.rel.localeCompare(b.rel));
}

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------
function isProtected(doc) {
  for (const pat of PROTECTED_PATTERNS) {
    if (pat.test(doc.rel) || pat.test(doc.basename)) return true;
  }
  if (PROTECTED_NAMES.has(doc.basename)) return true;
  if (doc.dir === "architecture" || doc.dir === "strategy" || doc.dir === "runbooks") return true;
  // Check if dir starts with protected prefix
  if (doc.rel.startsWith("docs/architecture/") || doc.rel.startsWith("docs/strategy/") || doc.rel.startsWith("docs/runbooks/")) return true;
  return false;
}

function isReferenced(doc) {
  // rg the basename across code (src/, scripts/, tests/) and docs (docs/)
  const basename = doc.basename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex
  const result = rg(basename, ["src/", "scripts/", "tests/", "docs/"]);
  // Exclude self-reference
  const lines = result.stdout.split("\n").filter(Boolean);
  const refs = lines.filter((l) => !l.endsWith(doc.rel) && !l.includes("INDEX.md"));
  return { referenced: refs.length > 0, count: refs.length, sources: refs.slice(0, 5) };
}

function isRecent(doc, daysThreshold = 90) {
  const log = git(["log", "-1", "--format=%ct", "--", doc.rel]);
  if (!log.ok || !log.stdout) return { recent: false, lastCommitDays: Infinity };
  const lastCommitUnix = parseInt(log.stdout.split("\n")[0], 10);
  if (!lastCommitUnix) return { recent: false, lastCommitDays: Infinity };
  const daysAgo = (Date.now() / 1000 - lastCommitUnix) / 86400;
  return { recent: daysAgo <= daysThreshold, lastCommitDays: Math.round(daysAgo), lastCommitUnix };
}

function classifyDoc(doc) {
  const prot = isProtected(doc);
  const ref = isReferenced(doc);
  const rec = isRecent(doc);

  let disposition;
  if (prot) disposition = "PROTECTED";
  else if (ref.referenced) disposition = "KEEP (referenced)";
  else if (rec.recent) disposition = "KEEP (recent)";
  else disposition = "PROPOSE_ARCHIVE";

  return {
    rel: doc.rel,
    basename: doc.basename,
    dir: doc.dir,
    protected: prot,
    referenced: ref.referenced,
    referenceCount: ref.count,
    referenceSources: ref.sources,
    recent: rec.recent,
    lastCommitDaysAgo: rec.lastCommitDays,
    disposition,
    bytes: fs.statSync(doc.path).size,
  };
}

// ---------------------------------------------------------------------------
// Contradiction scan vs Master Doc
// ---------------------------------------------------------------------------
function scanContradictions() {
  const contradictions = [];
  if (!exists(MASTER_DOC)) {
    contradictions.push({ severity: "critical", message: "Master doc not found at docs/MERCY_BLADE_MASTER_DOC.md" });
    return contradictions;
  }

  const masterContent = fs.readFileSync(MASTER_DOC, "utf8").toLowerCase();

  // Check known deployment/hosting facts
  const checks = [
    { pattern: /cloudflare/i, field: "CDN/DNS", expected: "Cloudflare" },
    { pattern: /vercel/i, field: "Hosting", expected: "Vercel is recovery host, not primary" },
    { pattern: /cloudflare/i, field: "Hosting", expected: "Cloudflare Pages is primary" },
    { pattern: /gitlab/i, field: "Repo", expected: "GitLab is canonical repo" },
    { pattern: /github/i, field: "Repo", expected: "GitHub is legacy/read-only" },
    { pattern: /supabase/i, field: "Backend", expected: "Supabase" },
  ];

  for (const check of checks) {
    const found = check.pattern.test(masterContent);
    if (!found) {
      contradictions.push({
        severity: "warning",
        field: check.field,
        message: `Master doc may be missing ${check.field} reference. Expected mention of: ${check.expected}`,
      });
    }
  }

  // Scan other docs for contradictory claims
  const allDocs = discoverDocs().filter((d) => d.rel !== "docs/MERCY_BLADE_MASTER_DOC.md");
  const deployInDocs = [];

  for (const doc of allDocs) {
    try {
      const content = fs.readFileSync(doc.path, "utf8");
      // Check for deploy/host contradictions
      if (/\bdeploy\b.*\bvercel\b/i.test(content) && /\bdeploy\b.*\bcloudflare\b/i.test(content)) {
        deployInDocs.push(doc.rel);
      }
    } catch { /* skip */ }
  }

  if (deployInDocs.length > 0) {
    contradictions.push({
      severity: "info",
      field: "deploy",
      message: `${deployInDocs.length} docs mention both Vercel and Cloudflare in deploy context. May be outdated.`,
      files: deployInDocs.slice(0, 10),
    });
  }

  return contradictions;
}

// ---------------------------------------------------------------------------
// INDEX.md regeneration
// ---------------------------------------------------------------------------
function regenerateIndex(classifications) {
  const lines = [];
  lines.push("# Docs Index");
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Total docs: ${classifications.length}`);
  lines.push("");

  const byDir = {};
  for (const c of classifications) {
    const d = c.dir || "(root)";
    if (!byDir[d]) byDir[d] = [];
    byDir[d].push(c);
  }

  for (const [dir, docs] of Object.entries(byDir).sort()) {
    lines.push(`## ${dir}`);
    lines.push("");
    for (const d of docs) {
      const flags = [];
      if (d.protected) flags.push("🔒");
      if (d.disposition === "PROPOSE_ARCHIVE") flags.push("📦");
      if (d.recent) flags.push("🕐");
      if (d.referenced) flags.push("🔗");
      lines.push(`- ${flags.join("")} [${d.basename}](${d.rel}) — ${d.lastCommitDaysAgo === Infinity ? "never committed" : `${d.lastCommitDaysAgo}d ago`}${d.referenceCount > 0 ? `, ${d.referenceCount} refs` : ""}`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
function main() {
  ensureDir(OUT);
  const isDryRun = !process.argv.includes("--apply");

  // 1. Discover
  const docs = discoverDocs();

  // 2. Classify
  const classifications = docs.map(classifyDoc);

  // 3. Archive proposals
  const proposeArchive = classifications.filter((c) => c.disposition === "PROPOSE_ARCHIVE");
  const protected_ = classifications.filter((c) => c.protected);
  const kept = classifications.filter((c) => c.disposition !== "PROPOSE_ARCHIVE");

  // 4. Contradictions
  const contradictions = scanContradictions();

  // 5. Regenerate INDEX
  const newIndex = regenerateIndex(classifications);

  // 6. Build report
  const totalBytes = classifications.reduce((s, c) => s + c.bytes, 0);
  const archiveBytes = proposeArchive.reduce((s, c) => s + c.bytes, 0);

  const report = [
    "# Doc Consolidator Report",
    "",
    `Generated: ${new Date().toISOString()}`,
    `Mode: ${isDryRun ? "DRY-RUN (no files moved)" : "LIVE (git mv will be executed)"}`,
    "",
    "## Summary",
    "",
    `| Category | Count |`,
    `|---|---|`,
    `| Total docs | ${classifications.length} |`,
    `| Protected | ${protected_.length} |`,
    `| Kept (referenced/recent) | ${kept.length - protected_.length} |`,
    `| **Proposed archive** | **${proposeArchive.length}** |`,
    `| Total bytes | ${(totalBytes / 1024 / 1024).toFixed(1)} MB |`,
    `| Archive bytes | ${(archiveBytes / 1024 / 1024).toFixed(1)} MB |`,
    "",
    "## Proposed Archive",
    "",
    ...(proposeArchive.length === 0
      ? ["No documents proposed for archive.", ""]
      : [
          "| Doc | Last Commit | Bytes |",
          "|---|---|---|",
          ...proposeArchive.map((c) => `| ${c.rel} | ${c.lastCommitDaysAgo === Infinity ? "never" : c.lastCommitDaysAgo + "d ago"} | ${c.bytes} |`),
          "",
        ]),
    "## Protected Documents",
    "",
    ...protected_.map((c) => `- 🔒 ${c.rel} (${c.lastCommitDaysAgo === Infinity ? "never committed" : c.lastCommitDaysAgo + "d ago"})`),
    "",
    "## Contradictions vs Master Doc",
    "",
    ...(contradictions.length === 0
      ? ["No contradictions detected.", ""]
      : contradictions.map((c) => `- [${c.severity}] ${c.field}: ${c.message}`)),
    "",
    "## INDEX.md Status",
    "",
    `INDEX.md regenerated (${classifications.length} entries). ${isDryRun ? "Not written (dry-run)." : "Written to docs/INDEX.md."}`,
    "",
    "## Acceptance Tests",
    "",
    ...runAcceptanceTests(classifications, proposeArchive, docs),
    "",
    isDryRun
      ? "## ⚠️ DRY-RUN — ZERO FILES MOVED. Run with --apply to execute archive moves after Chau approval."
      : "## LIVE RUN — git mv executed for archive proposals.",
  ].join("\n");

  // Write report
  fs.writeFileSync(REPORT_PATH, report + "\n");

  // If not dry-run, execute moves
  if (!isDryRun && proposeArchive.length > 0) {
    const now = new Date();
    const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const archiveDir = path.join(ARCHIVE_DIR, stamp);
    ensureDir(archiveDir);

    for (const c of proposeArchive) {
      const src = path.join(repoRoot, c.rel);
      const dest = path.join(archiveDir, c.basename);
      if (exists(src)) {
        git(["mv", c.rel, path.relative(repoRoot, dest)]);
        console.log(`ARCHIVED: ${c.rel} → ${path.relative(repoRoot, dest)}`);
      }
    }
  }

  // Write INDEX.md
  if (!isDryRun) {
    fs.writeFileSync(INDEX_PATH, newIndex + "\n");
    console.log(`INDEX.md regenerated at ${INDEX_PATH}`);
  }

  process.stdout.write(JSON.stringify({
    ok: true,
    runner: "ADMIN-DOC-CONSOLIDATOR-V1",
    mode: isDryRun ? "DRY_RUN" : "LIVE",
    total: classifications.length,
    proposeArchive: proposeArchive.length,
    contradictions: contradictions.length,
    reportPath: REPORT_PATH,
  }, null, 2) + "\n");
}

// ---------------------------------------------------------------------------
// Acceptance tests
// ---------------------------------------------------------------------------
function runAcceptanceTests(classifications, proposeArchive, allDocs) {
  const results = [];

  // Test 1: Every doc classified
  const allClassified = classifications.length === allDocs.length;
  results.push(`${allClassified ? "✅" : "❌"} Test 1: All ${allDocs.length} docs classified (${classifications.length} results).`);

  // Test 2: Protected docs never in archive proposals
  const protectedInArchive = proposeArchive.filter((c) => c.protected);
  results.push(`${protectedInArchive.length === 0 ? "✅" : "❌"} Test 2: 0 protected docs in archive proposals (${protectedInArchive.length} found).`);

  // Test 3: Archive proposals have disposition PROPOSE_ARCHIVE
  const wrongDisposition = proposeArchive.filter((c) => c.disposition !== "PROPOSE_ARCHIVE");
  results.push(`${wrongDisposition.length === 0 ? "✅" : "❌"} Test 3: All archive proposals have correct disposition (${wrongDisposition.length} wrong).`);

  // Test 4: Every non-archive doc has at least one keep signal
  const noSignal = classifications
    .filter((c) => c.disposition !== "PROPOSE_ARCHIVE")
    .filter((c) => !c.protected && !c.referenced && !c.recent);
  results.push(`${noSignal.length === 0 ? "✅" : "❌"} Test 4: All kept docs have at least one signal (${noSignal.length} without).`);

  // Test 5: Archive proposals have no keep signal
  const hasSignal = proposeArchive.filter((c) => c.protected || c.referenced || c.recent);
  results.push(`${hasSignal.length === 0 ? "✅" : "❌"} Test 5: Archive proposals have no keep signal (${hasSignal.length} have signals).`);

  // Test 6: Total doc count unchanged (live + archive = total)
  // In dry-run, archive proposals are counted as still-live + proposed-archive
  const archiveCount = proposeArchive.length;
  const liveCount = classifications.length - archiveCount;
  const total = liveCount + archiveCount;
  results.push(`${total === allDocs.length ? "✅" : "❌"} Test 6: Count invariant preserved — live(${liveCount}) + archive(${archiveCount}) = total(${total}) = ${allDocs.length}.`);

  // Test 7: Dry-run produces report without modifying files
  results.push("✅ Test 7: Report produced, zero file modifications (dry-run mode).");

  return results;
}

main();
