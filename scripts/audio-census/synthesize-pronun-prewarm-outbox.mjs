#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const REPORT_REF = "c16f0029:reports/audio-census/pronun-prewarm.json";
const OUTBOX_DIR = resolve("reports/audio-census/pronun-prewarm-outbox");
const MANIFEST_PATH = resolve("reports/audio-census/pronun-prewarm-outbox-manifest.json");
const OUTPUT_FORMAT = "audio-24khz-48kbitrate-mono-mp3";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function escapeSsml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSsml(text, voice) {
  return (
    `<speak version='1.0' xml:lang='${voice.locale}'>` +
    `<voice xml:lang='${voice.locale}' name='${voice.voice}'>` +
    `${escapeSsml(text)}` +
    `</voice></speak>`
  );
}

function looksLikeMp3(bytes) {
  return (
    bytes.length >= 3 &&
    ((bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) ||
      (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0))
  );
}

async function loadTargets() {
  const { execFileSync } = await import("node:child_process");
  const raw = execFileSync("git", ["show", REPORT_REF], { encoding: "utf8" });
  const report = JSON.parse(raw);
  return report.phase2.targets;
}

async function synthesize(target, key, region) {
  const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": OUTPUT_FORMAT,
      "User-Agent": "mercyblade-pronun-prewarm-local",
    },
    body: buildSsml(target.text, target),
  });
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!response.ok) {
    const message = new TextDecoder().decode(bytes.slice(0, 500));
    throw new Error(`Azure ${response.status} for ${target.storage_key}: ${message}`);
  }
  if (!looksLikeMp3(bytes)) {
    throw new Error(`Azure returned non-MP3 bytes for ${target.storage_key}`);
  }
  return bytes;
}

async function main() {
  const key = requireEnv("AZURE_SPEECH_KEY");
  const region = requireEnv("AZURE_SPEECH_REGION");
  const targets = await loadTargets();
  if (targets.length !== 42) throw new Error(`expected 42 targets, found ${targets.length}`);

  const generated = [];
  await mkdir(OUTBOX_DIR, { recursive: true });

  for (const [ordinal, target] of targets.entries()) {
    const outPath = resolve(OUTBOX_DIR, target.storage_key);
    await mkdir(dirname(outPath), { recursive: true });
    const bytes = await synthesize(target, key, region);
    await writeFile(outPath, bytes);
    generated.push({
      ordinal,
      storage_key: target.storage_key,
      outbox_path: outPath,
      language: target.language,
      level: target.level,
      repair_reason: target.repair_reason,
      voice: target.voice,
      locale: target.locale,
      bytes: bytes.length,
      text: target.text,
    });
    console.log(`${ordinal + 1}/${targets.length} ${target.storage_key} ${bytes.length} bytes`);
  }

  await writeFile(
    MANIFEST_PATH,
    `${JSON.stringify(
      {
        task: "WP-PRONUN-PREWARM",
        phase: 2,
        outbox_dir: OUTBOX_DIR,
        generated_count: generated.length,
        generated_at: new Date().toISOString(),
        output_format: OUTPUT_FORMAT,
        files: generated,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
