#!/usr/bin/env node
// scripts/ci/check-job-tags.mjs
//
// Fail if a GitLab CI job can silently run untagged. MercyB's local macOS
// runners keep "run untagged jobs" disabled, so untagged jobs can spill onto
// paid shared/instance runners unless they are explicitly whitelisted here.

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const CI_FILE = resolve(HERE, "..", "..", ".gitlab-ci.yml");

const ALLOWED_UNTAGGED = new Set(["nightly-db-backup", "test-db-backup-now"]);
const SHARED_FALLBACK_SUFFIX = ":shared-fallback";

const RESERVED_TOP_LEVEL = new Set([
  "after_script",
  "before_script",
  "cache",
  "default",
  "image",
  "include",
  "services",
  "spec",
  "stages",
  "types",
  "variables",
  "workflow",
]);

function stripComment(line) {
  return line.replace(/(^|\s)#.*$/, "$1");
}

function parseHeader(rawLine) {
  if (/^\s/.test(rawLine)) return null;
  const line = stripComment(rawLine).trimEnd();
  if (line === "" || line.startsWith("#") || line.startsWith("---")) {
    return null;
  }

  let match = line.match(/^(.*?):\s+&(\S+)$/);
  if (match) return { name: match[1], anchor: match[2] };

  match = line.match(/^(.*):\s*$/);
  if (match) return { name: match[1], anchor: null };

  match = line.match(/^(.*?):\s+\S.*$/);
  if (match) return { name: match[1], anchor: null };

  return null;
}

function readBlocks(text) {
  const blocks = [];
  let current = null;

  for (const line of text.split("\n")) {
    const header = parseHeader(line);
    if (header) {
      current = { name: header.name, anchor: header.anchor, bodyLines: [] };
      blocks.push(current);
    } else if (current) {
      current.bodyLines.push(line);
    }
  }

  return blocks;
}

function analyse(block) {
  const refs = new Set();
  let definesTags = false;
  const aliasPattern = /\*([A-Za-z0-9_-]+)/g;

  for (const rawLine of block.bodyLines) {
    const line = stripComment(rawLine);
    if (/^\s+tags:(\s|$)/.test(line)) definesTags = true;

    aliasPattern.lastIndex = 0;
    let match;
    while ((match = aliasPattern.exec(line)) !== null) {
      refs.add(match[1]);
    }
  }

  block.definesTags = definesTags;
  block.refs = refs;
}

function tagBearingAnchors(blocks) {
  const anchors = new Map();
  for (const block of blocks) {
    if (block.anchor) anchors.set(block.anchor, block);
  }

  const tagBearing = new Set();
  for (const [name, block] of anchors) {
    if (block.definesTags) tagBearing.add(name);
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, block] of anchors) {
      if (tagBearing.has(name)) continue;
      for (const ref of block.refs) {
        if (tagBearing.has(ref)) {
          tagBearing.add(name);
          changed = true;
          break;
        }
      }
    }
  }

  return tagBearing;
}

function isTagged(block, tagBearing) {
  if (block.definesTags) return true;
  for (const ref of block.refs) {
    if (tagBearing.has(ref)) return true;
  }
  return false;
}

function isWhitelisted(name) {
  return ALLOWED_UNTAGGED.has(name) || name.endsWith(SHARED_FALLBACK_SUFFIX);
}

function main() {
  const text = readFileSync(CI_FILE, "utf8");
  const blocks = readBlocks(text);
  for (const block of blocks) analyse(block);

  const tagBearing = tagBearingAnchors(blocks);
  const jobs = blocks.filter(
    (block) =>
      !block.name.startsWith(".") && !RESERVED_TOP_LEVEL.has(block.name),
  );

  const tagged = [];
  const whitelisted = [];
  const offenders = [];

  for (const job of jobs) {
    if (isTagged(job, tagBearing)) tagged.push(job.name);
    else if (isWhitelisted(job.name)) whitelisted.push(job.name);
    else offenders.push(job.name);
  }

  console.log(
    `[check-job-tags] scanned ${jobs.length} jobs: ${tagged.length} tagged, ${whitelisted.length} whitelisted untagged, ${offenders.length} offending.`,
  );

  if (whitelisted.length > 0) {
    console.log(
      `[check-job-tags] allowed untagged: ${whitelisted.sort().join(", ")}`,
    );
  }

  if (offenders.length > 0) {
    console.error("");
    console.error(
      "Untagged GitLab CI job(s) detected; these can spill onto paid runners:",
    );
    for (const name of offenders.sort()) {
      console.error(`  - ${name}`);
    }
    console.error("");
    console.error("Add *local_runner tags, use a :shared-fallback job name,");
    console.error("or add a narrow ALLOWED_UNTAGGED exception with a reason.");
    process.exit(1);
  }

  console.log(
    "All GitLab CI jobs are tagged or explicitly whitelisted as untagged.",
  );
}

main();
