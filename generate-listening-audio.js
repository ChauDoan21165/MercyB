// Generate ElevenLabs audio for the 30 listening clips.
// Reads clips-for-audio.json, writes one MP3 per clip to audio-output/.
//
// Usage: node generate-listening-audio.js
// Requires ELEVENLABS_API_KEY in .env.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';
import { ElevenLabsClient } from 'elevenlabs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('ELEVENLABS_API_KEY missing in .env — aborting.');
  process.exit(1);
}

const VOICE_BY_ACCENT = {
  us: '21m00Tcm4TlvDq8ikWAM', // Rachel
  uk: 'XB0fDUnXU5powFXDhCwa', // Charlotte
  au: 'oWAxZDx7w5VEj9dCyTzz', // Grace
  ca: 'pFZP5JQG7iQjIQuC4Bku', // Lily
};

const MODEL_ID = 'eleven_multilingual_v2';
const RATE_LIMIT_MS = 1000 / 3; // 3 req/sec
const OUTPUT_DIR = path.join(__dirname, 'audio-output');
const INPUT_PATH = path.join(__dirname, 'clips-for-audio.json');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const clips = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf8'));
if (!Array.isArray(clips) || clips.length === 0) {
  console.error('clips-for-audio.json is empty or malformed — aborting.');
  process.exit(1);
}

const client = new ElevenLabsClient({ apiKey: API_KEY });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function joinDialogue(dialogue) {
  // Brief pause between speaker turns via a period + double-space; ElevenLabs
  // reads punctuation as natural prosody. Speaker label prepended for context.
  return dialogue
    .map((turn) => `${turn.speaker}: ${turn.text}`)
    .join('  ...  ');
}

async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function generateOne(clip, retry = false) {
  const voiceId = VOICE_BY_ACCENT[clip.accent] ?? VOICE_BY_ACCENT.us;
  const text = joinDialogue(clip.dialogue);
  try {
    const audio = await client.generate({
      voice: voiceId,
      model_id: MODEL_ID,
      text,
    });
    const buf = Buffer.isBuffer(audio) ? audio : await streamToBuffer(audio);
    const outPath = path.join(OUTPUT_DIR, `${clip.id}.mp3`);
    fs.writeFileSync(outPath, buf);
    return { ok: true, bytes: buf.length };
  } catch (err) {
    const status = err?.statusCode ?? err?.status ?? err?.response?.status;
    if (status === 429 && !retry) {
      console.warn(`  429 received — backing off 2s then retrying ${clip.id}`);
      await sleep(2000);
      return generateOne(clip, true);
    }
    return { ok: false, error: err?.message ?? String(err) };
  }
}

(async () => {
  let succeeded = 0;
  const failures = [];
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    console.log(`[${i + 1}/${clips.length}] generating ${clip.id}...`);
    const res = await generateOne(clip);
    if (res.ok) {
      succeeded++;
    } else {
      failures.push({ id: clip.id, error: res.error });
      console.error(`  FAILED ${clip.id}: ${res.error}`);
    }
    if (i < clips.length - 1) await sleep(RATE_LIMIT_MS);
  }
  console.log(`\nDone. ${succeeded}/${clips.length} succeeded.`);
  if (failures.length) {
    console.log('Failures:');
    for (const f of failures) console.log(`  - ${f.id}: ${f.error}`);
    process.exit(1);
  }
})();
