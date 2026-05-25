#!/usr/bin/env node
/**
 * Prebuild guard: fail the build if any raw React.lazy import appears
 * in src/ outside src/lib/lazyWithRetry.ts.
 *
 * Why this exists:
 *   Stale-deploy chunk-load failures (Sentry MERCYBLADE-WEB-F /
 *   https://chau-doan.sentry.io/issues/7461993296/) leaked into Sentry
 *   because a raw React.lazy(() => import(...)) in MercyGuide.tsx
 *   bypassed the Tier-1 cache-bust recovery that lazyWithRetry provides.
 *   Every dynamic import in app code must go through lazyWithRetry so a
 *   chunk 404 after a deploy gets the one-shot cache-bust reload before
 *   the error reaches ErrorBoundary / Sentry.
 *
 * What it forbids in src/ (outside src/lib/lazyWithRetry.ts):
 *   - `React.lazy(` — direct usage via the React namespace import.
 *   - `import { ..., lazy, ... } from "react"` — named import that
 *     would let someone call bare `lazy(...)` later.
 *
 * If the check fails, the message points at the fix:
 *   import { lazyWithRetry } from "@/lib/lazyWithRetry";
 *   const X = lazyWithRetry(() => import("..."));
 */

import { readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { execSync } from "node:child_process";

const REPO_ROOT = process.cwd();
const SRC_DIR = join(REPO_ROOT, "src");
const ALLOWED_FILE = join("src", "lib", "lazyWithRetry.ts");

// React.lazy( — only the call form (open paren) so comments / prose
// mentions of "React.lazy" don't false-positive.
const DIRECT_RE = /React\.lazy\(/;
// Named import `lazy` from "react" — covers `import { lazy } from
// "react"` and `import { useState, lazy } from "react"`. Restricted
// to lines that start with `import` (after optional whitespace) so
// comments don't false-positive.
const NAMED_RE = /^\s*import\b[^;]*\{[^}]*\blazy\b[^}]*\}[^;]*from\s+["']react["']/;

function listSrcFiles() {
  // Use `git ls-files` so the check is fast and respects .gitignore.
  // Falls back to a recursive walk if not in a git repo.
  try {
    const out = execSync(`git ls-files -- "src/*.ts" "src/*.tsx"`, {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    return out.split("\n").filter(Boolean);
  } catch {
    const files = [];
    walk(SRC_DIR, files);
    return files.map((p) => relative(REPO_ROOT, p).split(sep).join("/"));
  }
}

function walk(dir, out) {
  const { readdirSync, statSync } = require("node:fs");
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry)) out.push(full);
  }
}

const allowedNormalised = ALLOWED_FILE.split(sep).join("/");
const violations = [];

for (const rel of listSrcFiles()) {
  if (rel === allowedNormalised) continue;
  let content;
  try {
    content = readFileSync(join(REPO_ROOT, rel), "utf8");
  } catch {
    continue;
  }
  const lines = content.split("\n");
  lines.forEach((line, idx) => {
    if (DIRECT_RE.test(line) || NAMED_RE.test(line)) {
      violations.push({ file: rel, line: idx + 1, text: line.trim() });
    }
  });
}

if (violations.length === 0) {
  process.exit(0);
}

console.error("");
console.error("[check:no-raw-react-lazy] Found raw React.lazy usage in src/.");
console.error("");
console.error(
  "  Every dynamic import in app code must go through lazyWithRetry so a",
);
console.error(
  "  stale-chunk 404 after a deploy gets the Tier-1 cache-bust recovery",
);
console.error(
  "  before the error reaches ErrorBoundary / Sentry. See Sentry issue",
);
console.error(
  "  MERCYBLADE-WEB-F (https://chau-doan.sentry.io/issues/7461993296/) for",
);
console.error(
  "  the leak this guard exists to prevent.",
);
console.error("");
console.error("  Fix:");
console.error('    import { lazyWithRetry } from "@/lib/lazyWithRetry";');
console.error('    const Foo = lazyWithRetry(() => import("./Foo"));');
console.error("");
console.error("Violations:");
for (const v of violations) {
  console.error(`  ${v.file}:${v.line}  ${v.text}`);
}
console.error("");

process.exit(1);
