// src/lib/speech/transcribeAudio.ts
//
// Mercy Blade Speech-to-Text helper
// Runtime-safe version (works in Node, Next.js, Vercel)
//
// Uses OpenAI transcription API
//
// install:
// npm install openai form-data

import OpenAI from "openai";
import FormData from "form-data";
import { Readable } from "stream";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extFromMimeType(mimeType: string): string {
  const type = mimeType.toLowerCase();

  if (type.includes("webm")) return "webm";
  if (type.includes("wav")) return "wav";
  if (type.includes("mpeg")) return "mp3";
  if (type.includes("mp3")) return "mp3";
  if (type.includes("mp4")) return "mp4";
  if (type.includes("m4a")) return "m4a";
  if (type.includes("ogg")) return "ogg";
  if (type.includes("flac")) return "flac";

  return "webm";
}

function assertAudioSize(buffer: Buffer) {
  const maxBytes = 25 * 1024 * 1024;

  if (buffer.byteLength > maxBytes) {
    throw new Error("Audio file exceeds 25MB limit");
  }
}

function bufferToStream(buffer: Buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function transcribeAudio(
  fileBuffer: Buffer,
  mimeType: string
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }

  if (!fileBuffer || fileBuffer.byteLength === 0) {
    throw new Error("Audio file is empty");
  }

  assertAudioSize(fileBuffer);

  const ext = extFromMimeType(mimeType);

  const form = new FormData();

  form.append("file", bufferToStream(fileBuffer), {
    filename: `speech.${ext}`,
    contentType: mimeType || "audio/webm",
  });

  form.append("model", "gpt-4o-mini-transcribe");

  form.append(
    "prompt",
    "Transcribe the spoken English sentence clearly for an English learning app."
  );

  const response = await fetch(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form as any,
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI transcription error: ${errText}`);
  }

  const data = await response.json();

  const transcript =
    typeof data.text === "string" ? data.text.trim() : "";

  return transcript;
}