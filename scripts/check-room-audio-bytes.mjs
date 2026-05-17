#!/usr/bin/env node
/**
 * scripts/check-room-audio-bytes.mjs
 *
 * CI guard against the silent-corruption defect class documented in
 * reports/RECON-audio-byte-full-audit.md: room JSON references an audio key,
 * but the object in the Supabase `room-audio` bucket is 0 bytes, a 67-byte
 * failed-synthesis stub, or missing entirely (HTTP 400). The previously-wired
 * gate (scripts/validate-audio.js) is structurally blind to this — it scans
 * the empty local `public/` dir and never exits non-zero. 317 such defects
 * reached production silently. This script closes that gap.
 *
 * WHAT IT DOES
 *   Enumerate every audio key referenced by `public/data/*.json` across the
 *   field shapes the corpus actually uses (entry.audio / .audio_en / .audio_vi,
 *   content.audio, root.audio, root.intro_audio, audio_playlist[]), normalize
 *   each via the toAudioKey contract, then probe the PUBLIC bucket and FAIL the
 *   build if any key is HTTP != 200, Content-Type not audio/*, or smaller than
 *   the byte floor.
 *
 * BYTE FLOOR — 10240 (10 KB)
 *   Smallest real clip in the entire corpus is 48,527 B. The defect band is
 *   <= 67 B (0-byte writes and 67-byte API-error stubs). 10 KB sits three
 *   orders of magnitude below every real clip and ~150x above every defect:
 *   zero false positives, generous headroom. 20 KB would be equally safe; 10 KB
 *   is the conservative documented floor (kept in sync with MIN_BYTES in
 *   scripts/regen-audio-defects.ts).
 *
 * CACHE-BUSTING (load-bearing — do not remove)
 *   The public bucket sits behind Cloudflare. A key that previously served a
 *   defective object keeps that body at the edge until revalidation, so a
 *   plain probe right after a fix PR can read STALE old bytes while origin is
 *   already correct (observed: alphabet_adventure_v1_abc_song plain=67 B vs
 *   origin=421,632 B). Every probe carries a unique query string to force an
 *   origin read, so the guard verifies the object that actually exists.
 *
 * SCOPE
 *   --changed   probe only keys referenced by room files changed vs the merge
 *               base with origin/main (fast, blocking PR gate).
 *   (default)   probe the entire corpus (~2,920 keys, ~2 min — weekly cron).
 *
 *   It deliberately does NOT cover the space-joined slug:"all" play-all concat
 *   pseudo-refs (a data-shape defect, not a byte defect — guard those offline;
 *   see RECON §6 "complementary offline check").
 *
 * USAGE
 *   node scripts/check-room-audio-bytes.mjs            # full corpus
 *   node scripts/check-room-audio-bytes.mjs --changed  # PR-changed rooms only
 *   SUPABASE_PUBLIC_URL=https://… node scripts/check-room-audio-bytes.mjs
 *
 * Exit 0 = every referenced key is a real audio object >= floor.
 * Exit 1 = at least one defect (or an unresolvable probe after retries).
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const DATA_DIR = join(process.cwd(), "public", "data");
const BYTE_FLOOR = 10_240;
const CONCURRENCY = 16;
const RETRIES = 3;
const SUPA_URL = (
  process.env.SUPABASE_PUBLIC_URL ||
  process.env.VITE_SUPABASE_URL ||
  "https://buemdfxyhxunzpgdoqin.supabase.co"
).replace(/\/+$/, "");
const BUCKET = "room-audio";
const CHANGED = process.argv.includes("--changed");

/** Mirror of src/lib/roomAudioResolver.ts `toAudioKey` (kept dependency-free
 *  so the guard runs in CI without a TS toolchain). Idempotent. */
function toAudioKey(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed; // external URL — not a bucket object
  let s = trimmed;
  if (s.startsWith("private:")) s = s.slice("private:".length);
  s = s.replace(/^\/+/, "").replace(/^public\//, "");
  while (s.startsWith("audio/")) s = s.slice("audio/".length);
  return s || null;
}

/** A normalized key that is NOT a room-audio bucket object (skip it). */
function isNonBucketKey(key) {
  return /^https?:\/\//i.test(key) || key.startsWith("images/");
}

/** Pull every audio-key string from one room object (skip slug:"all" concats). */
function keysFromRoom(room, refs, roomFile) {
  const add = (val, field) => {
    if (typeof val !== "string") return;
    if (val.includes(" ")) return; // space-joined slug:"all" play-all concat
    const key = toAudioKey(val);
    if (!key || isNonBucketKey(key)) return;
    refs.push({ key, roomFile, field });
  };
  add(room?.content?.audio, "content.audio");
  add(room?.audio, "root.audio");
  add(room?.intro_audio, "root.intro_audio");
  if (Array.isArray(room?.audio_playlist)) {
    for (const a of room.audio_playlist) add(a, "audio_playlist[]");
  }
  if (Array.isArray(room?.entries)) {
    for (const e of room.entries) {
      add(e?.audio, "entry.audio");
      add(e?.audio_en, "entry.audio_en");
      add(e?.audio_vi, "entry.audio_vi");
    }
  }
}

function changedRoomFiles() {
  try {
    const base =
      execSync("git merge-base origin/main HEAD", { encoding: "utf8" }).trim() ||
      "origin/main";
    const out = execSync(
      `git diff --name-only ${base} HEAD -- public/data/`,
      { encoding: "utf8" },
    );
    return out
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.endsWith(".json"))
      .map((l) => l.replace(/^.*public\/data\//, ""));
  } catch (err) {
    console.error(
      `[audio-bytes] could not compute changed files (${err?.message}); falling back to full corpus`,
    );
    return null;
  }
}

function collectRefs() {
  let files = readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
  if (CHANGED) {
    const changed = changedRoomFiles();
    if (changed && changed.length) {
      const set = new Set(changed);
      files = files.filter((f) => set.has(f));
      console.log(
        `[audio-bytes] --changed: ${files.length} changed room file(s)`,
      );
    } else if (changed && changed.length === 0) {
      console.log("[audio-bytes] --changed: no room files changed — nothing to probe.");
      return [];
    }
  }
  const refs = [];
  for (const f of files) {
    let room;
    try {
      room = JSON.parse(readFileSync(join(DATA_DIR, f), "utf8"));
    } catch (err) {
      console.error(`[audio-bytes] FAIL: ${f} is not valid JSON (${err?.message})`);
      process.exitCode = 1;
      continue;
    }
    keysFromRoom(room, refs, f);
  }
  // dedupe by key; keep the first room that referenced it for the report
  const seen = new Map();
  for (const r of refs) if (!seen.has(r.key)) seen.set(r.key, r);
  return [...seen.values()];
}

async function probe(key) {
  const bust = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const url = `${SUPA_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(
    key,
  )}?v=${bust}`;
  let last = { status: 0, size: 0, type: "" };
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, { method: "HEAD", cache: "no-store" });
      const size = Number(res.headers.get("content-length") || "0");
      const type = res.headers.get("content-type") || "";
      last = { status: res.status, size, type };
      // 200 is terminal (good or bad bytes); a hard 400 (missing) is terminal
      // too. Only retry transient network/5xx.
      if (res.status === 200 || res.status === 400) break;
    } catch (err) {
      last = { status: 0, size: 0, type: `err:${err?.message ?? "fetch"}` };
    }
    if (attempt < RETRIES) await new Promise((r) => setTimeout(r, 400 * attempt));
  }
  const ok =
    last.status === 200 &&
    /^audio\//i.test(last.type) &&
    last.size >= BYTE_FLOOR;
  return { ...last, ok };
}

async function main() {
  const refs = collectRefs();
  if (!refs.length) {
    console.log("[audio-bytes] no bucket-backed audio keys to check. OK.");
    process.exit(process.exitCode || 0);
  }
  console.log(
    `[audio-bytes] probing ${refs.length} unique key(s) against ${SUPA_URL}/…/${BUCKET} (floor=${BYTE_FLOOR} B)`,
  );

  const failures = [];
  let done = 0;
  let cursor = 0;
  async function worker() {
    while (cursor < refs.length) {
      const r = refs[cursor++];
      const res = await probe(r.key);
      done++;
      if (!res.ok) {
        failures.push({ ...r, ...res });
        console.error(
          `  ✗ ${r.key}  HTTP ${res.status}  ${res.size} B  ${res.type}  (${r.roomFile} · ${r.field})`,
        );
      }
      if (done % 250 === 0) console.log(`  …${done}/${refs.length}`);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, refs.length) }, worker),
  );

  if (failures.length) {
    console.error(
      `\n[audio-bytes] FAIL: ${failures.length}/${refs.length} referenced audio key(s) are missing, truncated, or non-audio (< ${BYTE_FLOOR} B floor).`,
    );
    console.error(
      "Regenerate with: npx tsx scripts/regen-audio-defects.ts (see RECON-audio-byte-full-audit.md)",
    );
    process.exit(1);
  }
  console.log(
    `\n[audio-bytes] OK: all ${refs.length} referenced audio key(s) resolve to real audio >= ${BYTE_FLOOR} B.`,
  );
  process.exit(process.exitCode || 0);
}

main().catch((err) => {
  console.error("[audio-bytes] fatal:", err);
  process.exit(1);
});
