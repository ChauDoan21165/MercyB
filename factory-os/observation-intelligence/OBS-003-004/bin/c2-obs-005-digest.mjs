#!/usr/bin/env node
/**
 * OBS-005 digest helper — byte-exact re-derivation of a packet's output_digest.
 *
 * Reuses the EXACT digest fn OBS-001/003/004 used (tmIntObservationHook.mjs):
 *   strings hash verbatim; anything else is JSON.stringify(x ?? null) first.
 * The governor shells to this so the re-derivation is byte-identical to how the
 * packet was built (no Python/JS JSON.stringify divergence).
 *
 *   node c2-obs-005-digest.mjs <packet.json>   ->  prints "sha256:...\n"
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

function digest(value) {
  const s = typeof value === "string" ? value : JSON.stringify(value ?? null);
  return "sha256:" + createHash("sha256").update(s, "utf8").digest("hex");
}

const path = process.argv[2];
if (!path) {
  console.error("usage: c2-obs-005-digest.mjs <packet.json>");
  process.exit(2);
}
const packet = JSON.parse(readFileSync(path, "utf8"));
process.stdout.write(digest(packet.output));
