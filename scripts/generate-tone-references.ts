/**
 * §15 Axis 2 Bar #2 — generate reference audio for the tone production drill.
 *
 * Walks `TONE_REFERENCE_SYLLABLES` and emits one mp3 per syllable into
 * `public/audio/tones/` using Azure Cognitive Services Text-to-Speech
 * with the `vi-VN` neural voice. Run once; the resulting mp3s are
 * static assets and get committed.
 *
 * Usage:
 *   AZURE_SPEECH_KEY=... AZURE_SPEECH_REGION=... \
 *     npx tsx scripts/generate-tone-references.ts
 *
 * Environment variables (read from process.env):
 *   AZURE_SPEECH_KEY     — same key used by the `azure-phoneme` edge
 *                          function. Held by Chau in Supabase Secrets
 *                          for runtime; mirror it here for one-shot
 *                          generation.
 *   AZURE_SPEECH_REGION  — e.g. `canadacentral`. Must match the key's
 *                          region.
 *   TONE_VOICE_NAME      — optional. Defaults to
 *                          `vi-VN-HoaiMyNeural` (female, Northern
 *                          accent — paired with the dialect bias
 *                          decision in design §2). Override to a
 *                          different vi-VN voice if owner picks one
 *                          before merge.
 *   OUTPUT_DIR           — optional. Defaults to `public/audio/tones`
 *                          relative to the repo root.
 *
 * Output contract:
 *   - One mp3 per distinct syllable in `TONE_REFERENCE_SYLLABLES`.
 *   - Files are mp3 (audio/mpeg) — Azure's `audio-24khz-160kbitrate-
 *     mono-mp3` output format. Browsers stream this natively.
 *   - Existing files are NOT overwritten unless `--force` is passed.
 *     This makes re-runs cheap when only a subset is added.
 *
 * No network access from CI — this script is operator-run, not
 * automated. The edge function's daily Azure cap covers runtime
 * pronunciation-assessment costs but NOT TTS; expect ~6 syllables
 * × ~$0.000016 per character ≈ negligible spend on each run.
 */

import { mkdir, writeFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { TONE_REFERENCE_SYLLABLES, type ToneTarget } from "../src/data/tone-drill/minimal-pairs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");

const FORCE = process.argv.includes("--force");
const AZURE_KEY = process.env.AZURE_SPEECH_KEY ?? "";
const AZURE_REGION = process.env.AZURE_SPEECH_REGION ?? "";
const VOICE_NAME = process.env.TONE_VOICE_NAME ?? "vi-VN-HoaiMyNeural";
const OUTPUT_DIR = resolve(
  REPO_ROOT,
  process.env.OUTPUT_DIR ?? "public/audio/tones",
);

function fatal(message: string): never {
  console.error(`[generate-tone-references] ${message}`);
  process.exit(1);
}

async function exists(path: string): Promise<boolean> {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Build the SSML body for a single Vietnamese syllable. Keeping it
 * SSML rather than raw text lets us pin the voice + speech rate; a
 * slightly slower-than-conversational rate makes the tone shape
 * clearer for learners (matches the lesson-37 framing in
 * `src/languages/vietnamese/lessons-a1.ts:1764` — "Say them slowly").
 */
function buildSsml(target: ToneTarget): string {
  return [
    `<speak version="1.0" xml:lang="vi-VN">`,
    `  <voice name="${VOICE_NAME}">`,
    `    <prosody rate="-15%">${escapeXml(target.syllable)}</prosody>`,
    `  </voice>`,
    `</speak>`,
  ].join("\n");
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function synthesizeOne(target: ToneTarget): Promise<Uint8Array> {
  const url = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": AZURE_KEY,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
      "User-Agent": "mercyblade-tone-references",
    },
    body: buildSsml(target),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "<unreadable>");
    throw new Error(
      `Azure TTS ${response.status} for ${target.syllable}: ${body.slice(0, 200)}`,
    );
  }

  return new Uint8Array(await response.arrayBuffer());
}

async function main(): Promise<void> {
  if (!AZURE_KEY) fatal("AZURE_SPEECH_KEY env var is missing.");
  if (!AZURE_REGION) fatal("AZURE_SPEECH_REGION env var is missing.");

  await mkdir(OUTPUT_DIR, { recursive: true });

  console.log(
    `[generate-tone-references] generating ${TONE_REFERENCE_SYLLABLES.length} clips into ${OUTPUT_DIR}`,
  );
  console.log(`[generate-tone-references] voice: ${VOICE_NAME}, region: ${AZURE_REGION}`);

  let generated = 0;
  let skipped = 0;
  for (const target of TONE_REFERENCE_SYLLABLES) {
    const filename = `${target.syllable}.mp3`;
    const outPath = resolve(OUTPUT_DIR, filename);

    if (!FORCE && (await exists(outPath))) {
      console.log(`[generate-tone-references] skip ${filename} (exists; pass --force to overwrite)`);
      skipped += 1;
      continue;
    }

    try {
      const bytes = await synthesizeOne(target);
      await writeFile(outPath, bytes);
      generated += 1;
      console.log(
        `[generate-tone-references] wrote ${filename} (${bytes.byteLength} bytes, ${target.tone})`,
      );
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[generate-tone-references] FAIL ${filename}: ${reason}`);
      process.exitCode = 2;
    }
  }

  console.log(
    `[generate-tone-references] done — ${generated} generated, ${skipped} skipped of ${TONE_REFERENCE_SYLLABLES.length} total`,
  );
}

void main();
