// FILE: check-manifest-delta.mjs
// PATH: scripts/check-manifest-delta.mjs
// VERSION: MB-BLUE-97.9c — 2026-05-17 (+0700)
/**
 * Pre-commit guard: fail LOUD when the regenerated room manifest
 * (src/lib/roomManifest.ts) changed for reasons NOT explained by room
 * JSON files staged in THIS commit.
 *
 * WHY THIS EXISTS
 * ---------------
 * `generate-room-registry.mjs` rebuilds roomManifest.ts as a pure function
 * of the ENTIRE public/data/ working tree (it does `fs.readdirSync`, not a
 * read of the git index). In an isolated worktree that is correct: a room
 * you add/delete/rename in your branch updates the manifest in the same PR.
 *
 * In a SHARED checkout where another agent has uncommitted room
 * add/delete/rename changes (a Principle #13 violation), the regen sees the
 * UNION of both branches' file sets. The old hook then force-staged the
 * manifest unconditionally — laundering the other branch's change into your
 * commit as innocuous-looking "generated noise" that passes review.
 *
 * This guard replaces that silent `git add` with: prove the delta belongs
 * to this commit, or refuse the commit.
 *
 * Reference: reports/RECON-pre-commit-hook-audit.md (Option B).
 *
 * Exit codes: 0 = delta empty or fully explained (safe to stage).
 *             1 = unexplained delta (commit aborted) OR HEAD manifest
 *                 present-but-unparseable (fail safe, never launder).
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const MANIFEST_REL = "src/lib/roomManifest.ts";
const DATA_DIR_REL = "public/data";

/* ---------------- Pure core (unit-testable) ---------------- */

/**
 * Extract and JSON.parse the PUBLIC_ROOM_MANIFEST object from a
 * roomManifest.ts source string.
 *
 * @param {string|null|undefined} text  File contents, or null/'' if the
 *        file did not exist at the compared revision.
 * @returns {Record<string,string>}  Empty object for absent/empty input.
 * @throws  If a NON-empty manifest cannot be parsed — we must fail loud
 *          rather than silently treat an unreadable manifest as "{}"
 *          (which would mark every room as a delta).
 */
export function parseManifest(text) {
  if (text == null) return {};
  const trimmed = String(text).trim();
  if (!trimmed) return {};
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("roomManifest.ts present but no JSON object found");
  }
  const obj = JSON.parse(trimmed.slice(start, end + 1));
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    throw new Error("roomManifest.ts JSON is not an object");
  }
  return obj;
}

/** `data/foo.json` (or `foo.json`) -> `public/data/foo.json` */
function toDataPath(manifestValue) {
  return `${DATA_DIR_REL}/${path.posix.basename(String(manifestValue))}`;
}

/**
 * Compute which room files moved the manifest and which of those are NOT
 * accounted for by files staged in this commit.
 *
 * @param {object}   args
 * @param {Record<string,string>} args.oldManifest  HEAD's manifest object.
 * @param {Record<string,string>} args.newManifest  Regenerated manifest.
 * @param {Iterable<string>}      args.stagedDataPaths  Repo-relative
 *        public/data/*.json paths staged in this commit (incl. both sides
 *        of renames).
 * @returns {{changedKeys:string[], implicatedFiles:string[],
 *            unexplainedFiles:string[]}}
 */
export function computeUnexplained({ oldManifest, newManifest, stagedDataPaths }) {
  const staged = new Set(stagedDataPaths);
  const keys = new Set([
    ...Object.keys(oldManifest),
    ...Object.keys(newManifest),
  ]);

  const changedKeys = [];
  const implicated = new Set();

  for (const k of keys) {
    const oldVal = oldManifest[k];
    const newVal = newManifest[k];
    if (oldVal === newVal) continue;
    changedKeys.push(k);
    if (oldVal != null) implicated.add(toDataPath(oldVal));
    if (newVal != null) implicated.add(toDataPath(newVal));
  }

  const unexplained = [...implicated].filter((f) => !staged.has(f));

  return {
    changedKeys: changedKeys.sort(),
    implicatedFiles: [...implicated].sort(),
    unexplainedFiles: unexplained.sort(),
  };
}

/* ---------------- Git I/O (CLI only) ---------------- */

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

/** HEAD's committed roomManifest.ts source, or null if absent/unborn. */
function readHeadManifest() {
  try {
    git(["rev-parse", "--verify", "HEAD"]);
  } catch {
    return null; // unborn HEAD (first commit) — treat as empty manifest
  }
  try {
    return git(["show", `HEAD:${MANIFEST_REL}`]);
  } catch {
    return null; // file not in HEAD — being newly introduced
  }
}

/**
 * public/data/*.json paths staged in this commit. Parses `--name-status -z`
 * so both sides of a rename/copy count as staged (legit room renames must
 * not false-positive).
 */
function readStagedDataPaths() {
  const out = git([
    "diff",
    "--cached",
    "--name-status",
    "-z",
    "--diff-filter=ACDRM",
    "--",
    DATA_DIR_REL,
  ]);
  const toks = out.split("\0").filter((t) => t.length > 0);
  const paths = [];
  for (let i = 0; i < toks.length; ) {
    const status = toks[i++];
    if (/^[CR]/.test(status)) {
      // R<score>\0<old>\0<new>  /  C<score>\0<old>\0<new>
      const oldPath = toks[i++];
      const newPath = toks[i++];
      if (oldPath) paths.push(oldPath);
      if (newPath) paths.push(newPath);
    } else {
      // A/D/M\0<path>
      const p = toks[i++];
      if (p) paths.push(p);
    }
  }
  return paths.filter(
    (p) => p.endsWith(".json") && path.posix.basename(p) !== "registry.json"
  );
}

function fail(unexplainedFiles) {
  const list = unexplainedFiles.map((f) => `    • ${f}`).join("\n");
  process.stderr.write(
    `\n` +
      `❌  COMMIT ABORTED — roomManifest.ts changed because of room files\n` +
      `    that are NOT staged in this commit:\n\n` +
      `${list}\n\n` +
      `The room manifest is regenerated from the ENTIRE public/data/\n` +
      `working tree. The delta above came from add/delete/rename of room\n` +
      `JSON not part of this commit — most often a PARALLEL AGENT working\n` +
      `in this SHARED checkout instead of an isolated worktree\n` +
      `(violation of Principle #13). Staging it now would launder another\n` +
      `branch's change into your PR as silent "generated" noise.\n` +
      `See reports/RECON-pre-commit-hook-audit.md.\n\n` +
      `Fix (pick one):\n` +
      `  1. This room change IS yours → stage it:\n` +
      `       git add ${unexplainedFiles.join(" ")}\n` +
      `  2. It is NOT yours (parallel agent / wrong checkout) →\n` +
      `     isolate or park the unrelated public/data changes:\n` +
      `       git stash push -- ${DATA_DIR_REL}\n` +
      `     (or run your work in its own: git worktree add …)\n` +
      `  3. You genuinely intend this cross-branch state →\n` +
      `       git commit --no-verify   (deliberate bypass only)\n\n`
  );
  process.exit(1);
}

function main() {
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = path.resolve(scriptDir, "..");
  const manifestAbs = path.join(repoRoot, MANIFEST_REL);

  // No regenerated manifest on disk → nothing to guard.
  if (!fs.existsSync(manifestAbs)) return;

  const newManifest = parseManifest(fs.readFileSync(manifestAbs, "utf8"));

  let oldManifest;
  try {
    oldManifest = parseManifest(readHeadManifest());
  } catch (e) {
    // HEAD manifest present but unreadable — fail safe, do not launder.
    process.stderr.write(
      `\n❌  Could not parse HEAD:${MANIFEST_REL} (${e.message}).\n` +
        `    Refusing to auto-stage a regenerated manifest blindly.\n\n`
    );
    process.exit(1);
  }

  const { changedKeys, unexplainedFiles } = computeUnexplained({
    oldManifest,
    newManifest,
    stagedDataPaths: readStagedDataPaths(),
  });

  if (changedKeys.length === 0) return; // no delta — common non-room commit
  if (unexplainedFiles.length === 0) return; // delta fully explained — OK

  fail(unexplainedFiles);
}

// Run only as a CLI; stay importable for unit tests.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
