#!/usr/bin/env node
// scripts/ci/check-new-orphans.mjs
//
// Preventive, diff-scoped dead-code guard for merge requests. Fails the
// pipeline when a PR *introduces* a new orphan file (a source module that
// nothing imports). It ALSO reports new unused exports (an exported symbol
// with zero references anywhere else in the tree) — but those are a
// non-failing WARNING only, not a hard fail: a freshly-exported symbol is
// often a public-API surface, used lazily/dynamically, or wired up in a
// follow-up MR, and the word-grep can false-positive. It is intentionally
// diff-scoped: it only inspects what THIS MR adds, so the ~existing~ backlog
// of orphans never fails a PR — it just stops the pile from growing.
//
// Design goals:
//   - Fast (<10s): pure `git diff` + `git grep` (C-fast), no npm install,
//     no module-graph build, no dependencies.
//   - Low false-positive: import resolution is *generous* (a same-basename
//     hit counts as "imported"), so the guard errs toward NOT flagging a
//     file it is unsure about. A missed orphan is acceptable; wrongly
//     blocking a real PR is not.
//   - Fail-open on infra: if the diff base cannot be resolved (shallow
//     clone, detached base), it warns and exits 0 rather than blocking.
//
// Scope fences (Lane B): this script lives under scripts/ci/. It reads the
// repo via git; it never imports or modifies src/**.

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { basename, dirname, extname, normalize } from "node:path";

const SRC_PREFIX = "src/";
const CODE_EXT = new Set([".ts", ".tsx"]);
// Files that are entrypoints / loaded by tooling rather than by an `import`,
// so "nothing imports them" is expected and must NOT be flagged as orphan.
const ENTRYPOINT_PATTERNS = [
  /(^|\/)main\.tsx?$/,
  /^src\/pages\//, // route-loaded
  /^src\/app\//, // route-loaded
  /(^|\/)vite-env\.d\.ts$/,
  /\.d\.ts$/, // ambient declarations
  /(^|\/)setupTests?\.[tj]sx?$/,
  /(^|\/)scripts\//, // CLI/build scripts are run (node/npm), not imported — same rationale as the root scripts/ dir
];
// Test / story / fixture files are not production modules.
const NON_PRODUCTION = [
  /\.(test|spec)\.[tj]sx?$/,
  /(^|\/)__tests__\//,
  /(^|\/)__mocks__\//,
  /\.stories\.[tj]sx?$/,
  /(^|\/)test\//,
];
const SEARCH_GLOBS = ["*.ts", "*.tsx", "*.mjs", "*.cjs", "*.js"];

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}
function gitQuiet(args) {
  try {
    return git(args);
  } catch {
    return "";
  }
}
function revExists(ref) {
  try {
    execFileSync("git", ["cat-file", "-e", `${ref}^{commit}`], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Resolve the diff base (merge-base with the MR target), fail-open if impossible. */
function resolveBase() {
  const target = process.env.CI_MERGE_REQUEST_TARGET_BRANCH_NAME || "main";
  const explicit = process.env.CI_MERGE_REQUEST_DIFF_BASE_SHA;
  if (explicit && revExists(explicit)) return explicit;

  // Try a local merge-base against the (possibly remote) target branch.
  for (const ref of [`origin/${target}`, target, "origin/main", "main"]) {
    if (!revExists(ref)) continue;
    const mb = gitQuiet(["merge-base", ref, "HEAD"]).trim();
    if (mb) return mb;
    return ref; // no common ancestor found but ref exists — diff vs ref tip
  }
  // Last-ditch shallow-safe fetch of the target, then merge-base.
  gitQuiet(["fetch", "--quiet", "--depth=50", "origin", target]);
  const mb = gitQuiet(["merge-base", "FETCH_HEAD", "HEAD"]).trim();
  return mb || null;
}

function diffFiles(base, filter) {
  const out = gitQuiet(["diff", `--diff-filter=${filter}`, "--name-only", base, "HEAD", "--"]);
  return out.split("\n").map((s) => s.trim()).filter(Boolean);
}

function isExcludedSource(file) {
  if (!file.startsWith(SRC_PREFIX)) return true;
  if (!CODE_EXT.has(extname(file))) return true;
  if (NON_PRODUCTION.some((re) => re.test(file))) return true;
  if (ENTRYPOINT_PATTERNS.some((re) => re.test(file))) return true;
  return false;
}

/** Escape a string for safe use inside a basic git-grep ERE. */
function ere(s) {
  return s.replace(/[.[\]{}()*+?^$|\\/-]/g, "\\$&");
}

/**
 * Is `file` imported by any OTHER tracked source file? Generous on purpose:
 * matches the import token (basename, or parent dir for index modules) inside
 * a from/import/require string. Same-name collisions count as imported — we
 * would rather miss an orphan than block a real PR.
 */
function isImportedSomewhere(file) {
  const name = basename(file, extname(file));
  // `import './foo'` resolves foo/index.ts → importers reference the dir name.
  const token = name === "index" ? basename(dirname(file)) : name;
  if (!token) return true;
  // Match: (from|import|require()|import()) ... "<...>/<token>" or "<token>"
  // followed by quote, slash, or end-of-specifier.
  const pattern = `(from|import|require\\(|import\\()[[:space:]]*['"][^'"]*(^|/)?${ere(token)}(['"/])`;
  const lines = gitQuiet([
    "grep", "-lE", pattern, "--", ...SEARCH_GLOBS,
  ]).split("\n").map((s) => s.trim()).filter(Boolean);
  // Imported if any matching file is NOT the file itself.
  return lines.some((f) => f !== file) || isConsumedByImportMetaGlob(file);
}

function globPatternToRegex(pattern) {
  let out = "^";
  for (let i = 0; i < pattern.length; i += 1) {
    const ch = pattern[i];
    const next = pattern[i + 1];
    if (ch === "*" && next === "*") {
      out += ".*";
      i += 1;
      continue;
    }
    if (ch === "*") {
      out += "[^/]*";
      continue;
    }
    if (ch === "?") {
      out += "[^/]";
      continue;
    }
    out += ch.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
  }
  out += "$";
  return new RegExp(out);
}

function resolveGlobPattern(importer, pattern) {
  const posix = (value) => normalize(value).replace(/\\/g, "/");
  if (pattern.startsWith("@/")) return posix(`src/${pattern.slice(2)}`);
  if (pattern.startsWith("/src/")) return posix(pattern.slice(1));
  if (pattern.startsWith("src/")) return posix(pattern);
  if (pattern.startsWith("./") || pattern.startsWith("../")) {
    return posix(`${dirname(importer)}/${pattern}`);
  }
  return null;
}

/**
 * Vite auto-registers modules through static `import.meta.glob()` calls. Those
 * files are consumed even though no literal import specifier mentions each
 * module basename, so model simple static string glob patterns here.
 */
function isConsumedByImportMetaGlob(file) {
  const globCallPattern = "import\\.meta\\.glob";
  const importers = gitQuiet(["grep", "-lE", globCallPattern, "--", ...SEARCH_GLOBS])
    .split("\n").map((s) => s.trim()).filter(Boolean);

  for (const importer of importers) {
    if (importer === file) continue;
    const source = gitQuiet(["show", `HEAD:${importer}`]);
    const globCalls = source.matchAll(/import\.meta\.glob(?:<[^>\n]+>)?\(\s*["']([^"']+)["']/g);
    for (const match of globCalls) {
      const resolved = resolveGlobPattern(importer, match[1]);
      if (!resolved) continue;
      if (globPatternToRegex(resolved).test(file)) return true;
    }
  }

  return false;
}

/** Collect newly-added named exports from added/modified source files. */
function addedExports(base) {
  const diff = gitQuiet([
    "diff", "--diff-filter=AM", "--unified=0", base, "HEAD", "--", "*.ts", "*.tsx",
  ]);
  const out = [];
  let file = null;
  for (const line of diff.split("\n")) {
    const fm = line.match(/^\+\+\+ b\/(.+)$/);
    if (fm) {
      file = fm[1];
      continue;
    }
    if (!file || isExcludedSource(file)) continue;
    if (!line.startsWith("+") || line.startsWith("+++")) continue;
    const body = line.slice(1).trim();
    // export const|function|class|interface|type|enum NAME ...
    let m = body.match(
      /^export\s+(?:default\s+)?(?:async\s+)?(?:abstract\s+)?(?:const|let|var|function|class|interface|type|enum)\s+([A-Za-z_$][\w$]*)/,
    );
    if (m && !/^export\s+default/.test(body)) {
      out.push({ file, name: m[1] });
      continue;
    }
    // export { A, B as C } — count the *exposed* names (after `as`).
    m = body.match(/^export\s*\{([^}]+)\}/);
    if (m) {
      for (const part of m[1].split(",")) {
        const nm = part.trim().split(/\s+as\s+/i).pop()?.trim();
        if (nm && /^[A-Za-z_$][\w$]*$/.test(nm)) out.push({ file, name: nm });
      }
    }
  }
  return out;
}

/** Does the symbol appear anywhere outside its declaring file? */
function isReferencedElsewhere(name, declFile) {
  const files = gitQuiet(["grep", "-lw", "--", name, ...SEARCH_GLOBS])
    .split("\n").map((s) => s.trim()).filter(Boolean);
  return files.some((f) => f !== declFile);
}

function main() {
  const base = resolveBase();
  if (!base) {
    console.warn("⚠️  check-new-orphans: could not resolve a diff base (shallow clone?) — skipping (fail-open).");
    process.exit(0);
  }

  const added = diffFiles(base, "A");
  const orphans = [];
  for (const file of added) {
    if (isExcludedSource(file)) continue;
    if (!existsSync(file)) continue; // added-then-removed within range
    if (!isImportedSomewhere(file)) orphans.push(file);
  }

  const unusedExports = [];
  // Skip export-checking files we already flagged as orphan files (their
  // exports are trivially unused; one message per file is enough).
  const orphanSet = new Set(orphans);
  for (const { file, name } of addedExports(base)) {
    if (orphanSet.has(file)) continue;
    if (!isReferencedElsewhere(name, file)) unusedExports.push({ file, name });
  }

  // Unused exports are a SOFT signal — they do not fail the pipeline. A newly
  // exported symbol can be legitimately referenced-later (public API surface,
  // lazy/dynamic import, a symbol wired up in a follow-up MR), and the grep is
  // word-based so false positives are plausible. Warn, but never block on them.
  if (unusedExports.length) {
    console.warn("⚠️  check-new-orphans: this MR adds export(s) not yet referenced elsewhere (warning only — does NOT fail CI):");
    for (const { file, name } of unusedExports) console.warn(`   • ${name}  (${file})`);
    console.warn(
      "If intentional (public API, lazy/dynamic use, or wired up in a follow-up),\n" +
      "ignore this. Otherwise: make the symbol non-exported if it is only used\n" +
      "locally, wire it into a consumer, or delete it.\n",
    );
  }

  // Orphan FILES are the hard fail: a whole new source module that nothing
  // imports is almost always an accident (dead-on-arrival code).
  if (orphans.length === 0) {
    const suffix = unusedExports.length ? " (unused-export warnings above are non-blocking)" : "";
    console.log(`✅ check-new-orphans: no new orphan files in this MR (base ${base.slice(0, 9)})${suffix}.`);
    process.exit(0);
  }

  console.error("\n❌ check-new-orphans: this MR introduces a new orphan file (dead module).\n");
  console.error("New orphan file(s) — added but nothing imports them:");
  for (const f of orphans) console.error(`   • ${f}`);
  console.error("");
  console.error(
    "Fix: wire the file into a consumer, or delete it. This check is diff-scoped —\n" +
    "it only flags what this MR adds, not pre-existing orphans.",
  );
  process.exit(1);
}

main();
