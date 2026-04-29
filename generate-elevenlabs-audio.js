// Path: scripts/render-elevenlabs-audio.js

import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { ElevenLabsClient } from "elevenlabs";

const INPUT_FILE = "clips-to-render.json";
const OUTPUT_DIR = "audio-output";

const MODEL_ID = "eleven_multilingual_v2";
const RATE_LIMIT_DELAY_MS = 350; // ~3 requests/second

const VOICES_BY_ACCENT = {
  US: "21m00Tcm4TlvDq8ikWAM", // Rachel
  UK: "XB0fDUnXU5powFXDhCwa", // Charlotte
  AU: "oWAxZDx7w5VEj9dCyTzz", // Grace
  CA: "pFZP5JQG7iQjIQuC4Bku", // Lily
  us: "21m00Tcm4TlvDq8ikWAM",
  uk: "XB0fDUnXU5powFXDhCwa",
  au: "oWAxZDx7w5VEj9dCyTzz",
  ca: "pFZP5JQG7iQjIQuC4Bku",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function transcriptToText(transcript) {
  if (typeof transcript === "string") {
    return transcript.trim();
  }

  if (Array.isArray(transcript)) {
    return transcript
      .map((turn) => {
        if (typeof turn === "string") return turn;

        const speaker = turn.speaker ? `${turn.speaker}: ` : "";
        const text = turn.text_en || turn.text || turn.en || "";

        return `${speaker}${text}`.trim();
      })
      .filter(Boolean)
      .join("\n");
  }

  return "";
}

function isRetryableError(error) {
  const status =
    error?.status ||
    error?.statusCode ||
    error?.response?.status ||
    error?.cause?.status;

  const message = String(error?.message || "").toLowerCase();

  return (
    status === 429 ||
    message.includes("429") ||
    message.includes("rate limit") ||
    message.includes("network") ||
    message.includes("fetch failed") ||
    message.includes("timeout") ||
    message.includes("econnreset") ||
    message.includes("etimedout")
  );
}

async function streamToBuffer(streamLike) {
  if (Buffer.isBuffer(streamLike)) {
    return streamLike;
  }

  if (streamLike instanceof Uint8Array) {
    return Buffer.from(streamLike);
  }

  if (typeof streamLike?.arrayBuffer === "function") {
    return Buffer.from(await streamLike.arrayBuffer());
  }

  const chunks = [];

  for await (const chunk of streamLike) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function generateAudio(client, clip) {
  const voiceId = VOICES_BY_ACCENT[clip.accent];

  if (!voiceId) {
    throw new Error(`Unsupported accent "${clip.accent}" for clip "${clip.id}"`);
  }

  const text = transcriptToText(clip.transcript);

  if (!text) {
    throw new Error(`Empty transcript for clip "${clip.id}"`);
  }

  const audio = await client.textToSpeech.convert(voiceId, {
    text,
    model_id: MODEL_ID,
    output_format: "mp3_44100_128",
  });

  return streamToBuffer(audio);
}

async function generateWithRetry(client, clip) {
  try {
    return await generateAudio(client, clip);
  } catch (firstError) {
    if (!isRetryableError(firstError)) {
      throw firstError;
    }

    console.warn(`Retrying ${clip.id} after error: ${firstError.message}`);
    await sleep(1500);

    try {
      return await generateAudio(client, clip);
    } catch (secondError) {
      throw secondError;
    }
  }
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY in .env");
  }

  const client = new ElevenLabsClient({ apiKey });

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const raw = await fs.readFile(INPUT_FILE, "utf8");
  const clips = JSON.parse(raw);

  if (!Array.isArray(clips)) {
    throw new Error(`${INPUT_FILE} must contain an array of clips`);
  }

  let succeeded = 0;
  const failures = [];

  for (let i = 0; i < clips.length; i += 1) {
    const clip = clips[i];
    const indexLabel = `${i + 1}/${clips.length}`;

    if (!clip?.id) {
      console.error(`[${indexLabel}] Skipped: missing clip id`);
      failures.push({ id: "(missing id)", error: "Missing clip id" });
      continue;
    }

    const outputPath = path.join(OUTPUT_DIR, `${clip.id}.mp3`);

    try {
      console.log(`[${indexLabel}] Rendering ${clip.id} (${clip.accent})...`);

      const audioBuffer = await generateWithRetry(client, clip);
      await fs.writeFile(outputPath, audioBuffer);

      succeeded += 1;
      console.log(`[${indexLabel}] Saved ${outputPath}`);
    } catch (error) {
      console.error(`[${indexLabel}] Failed ${clip.id}: ${error.message}`);
      failures.push({ id: clip.id, error: error.message });
    }

    await sleep(RATE_LIMIT_DELAY_MS);
  }

  console.log("\nRender complete");
  console.log(`Succeeded: ${succeeded}/${clips.length}`);
  console.log(`Failed: ${failures.length}/${clips.length}`);

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const failure of failures) {
      console.log(`- ${failure.id}: ${failure.error}`);
    }
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});