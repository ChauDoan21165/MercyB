// scripts/check-audio-assets.js
// MB-BLUE-102.1 — 2026-01-01 (+0700)
//
// AUDIO AUDIT (EN-ONLY):
// - Scans public/data/**/*.json (room JSON with id)
// - For every entry.audio reference, enforce:
//    ✅ audio is EN-only
//    ✅ mp3 file exists under public/audio/
// - Hard fail on missing files or VN audio presence
//
// Usage:
//   node scripts/check-audio-assets.js
//   npm run check:audio
//
// Exit codes:
//   0 = OK
//   1 = FAIL

import fs from "fs";
import path from "path";
import process from "process";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "public", "data");
const AUDIO_DIR = path.join(ROOT, "public", "audio");

function walkJsonFiles(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walkJsonFiles(p));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".json")) out.push(p);
  }
  return out;
}

function safeReadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isRoomJson(json) {
  return !!(json && typeof json === "object" && typeof json.id === "string");
}

function toAudioEnFilename(audio) {
  // Accept:
  // - "file.mp3"
  // - { en: "file.mp3" }   (VN must NOT exist)
  if (!audio) return null;

  if (typeof audio === "string") return audio.trim() || null;

  if (typeof audio === "object") {
    if ("vi" in audio && audio.vi) return { error: "VN_AUDIO_NOT_ALLOWED" };
    if (typeof audio.en === "string" && audio.en.trim()) return audio.en.trim();
    // sometimes people use { src: "x.mp3" } -> allow if you want; for now no.
  }

  return null;
}

function fileExistsInPublicAudio(filename) {
  const safe = String(filename).replace(/^\/+/, ""); // no leading slash
  const full = path.join(AUDIO_DIR, safe);
  return fs.existsSync(full);
}

(function main() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`[audio] ERROR: missing data dir: ${DATA_DIR}`);
    process.exit(1);
  }
  if (!fs.existsSync(AUDIO_DIR)) {
    console.error(`[audio] ERROR: missing audio dir: ${AUDIO_DIR}`);
    process.exit(1);
  }

  const files = walkJsonFiles(DATA_DIR);
  console.log(`[audio] Scanning ${files.length} JSON files under public/data ...`);

  const stats = {
    totalFiles: files.length,
    parseErrors: 0,
    roomLike: 0,
    nonRoomIgnored: 0,
    audioRefs: 0,
    missingAudioFiles: 0,
    vnAudioFound: 0,
    badAudioShape: 0,
  };

  const findings = [];

  for (const filePath of files) {
    const rel = path.relative(ROOT, filePath);

    let json;
    try {
      json = safeReadJson(filePath);
    } catch (e) {
      stats.parseErrors++;
      findings.push({ type: "PARSE_ERROR", file: rel, details: e?.message || String(e) });
      continue;
    }

    if (!isRoomJson(json)) {
      stats.nonRoomIgnored++;
      continue;
    }

    stats.roomLike++;

    const entries = Array.isArray(json.entries) ? json.entries : [];
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      if (!entry || typeof entry !== "object") continue;

      if (!("audio" in entry)) continue;

      stats.audioRefs++;
      const res = toAudioEnFilename(entry.audio);

      if (res && typeof res === "object" && res.error === "VN_AUDIO_NOT_ALLOWED") {
        stats.vnAudioFound++;
        findings.push({
          type: "VN_AUDIO_NOT_ALLOWED",
          file: rel,
          details: `entry_index=${i} audio has "vi"`,
        });
        continue;
      }

      if (!res || typeof res !== "string") {
        stats.badAudioShape++;
        findings.push({
          type: "BAD_AUDIO_FIELD",
          file: rel,
          details: `entry_index=${i} audio=${JSON.stringify(entry.audio)}`,
        });
        continue;
      }

      if (!fileExistsInPublicAudio(res)) {
        stats.missingAudioFiles++;
        findings.push({
          type: "MISSING_AUDIO_FILE",
          file: rel,
          details: `entry_index=${i} expected public/audio/${res}`,
        });
      }
    }
  }

  console.log("");
  console.log("[audio] Summary");
  console.log("--------------");
  console.log(`Total JSON files:        ${stats.totalFiles}`);
  console.log(`Parse errors:            ${stats.parseErrors}`);
  console.log(`Room-like JSON:          ${stats.roomLike}`);
  console.log(`Non-room ignored:        ${stats.nonRoomIgnored}`);
  console.log(`Audio refs scanned:      ${stats.audioRefs}`);
  console.log(`Missing audio files:     ${stats.missingAudioFiles}`);
  console.log(`VN audio found (FAIL):   ${stats.vnAudioFound}`);
  console.log(`Bad audio shape:         ${stats.badAudioShape}`);
  console.log("");

  const MAX = 160;
  if (findings.length) {
    console.log(`[audio] Findings (showing up to ${MAX}):`);
    findings.slice(0, MAX).forEach((f, i) => {
      console.log(`  ${String(i + 1).padStart(3)}. ${f.type} :: ${f.file} :: ${f.details}`);
    });
    if (findings.length > MAX) console.log(`  ... +${findings.length - MAX} more`);
    console.log("");
  }

  const fail =
    stats.parseErrors > 0 ||
    stats.missingAudioFiles > 0 ||
    stats.vnAudioFound > 0 ||
    stats.badAudioShape > 0;

  if (fail) {
    console.error("[audio] FAIL (audio integrity errors)");
    process.exit(1);
  }

  console.log("[audio] OK (audio integrity clean)");
  process.exit(0);
})();
