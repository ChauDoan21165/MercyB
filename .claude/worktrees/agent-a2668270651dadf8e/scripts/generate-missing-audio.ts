// scripts/generate-missing-audio.ts
// Generate MP3 files for any entries that have an `audio` filename
// but the actual .mp3 file is missing on disk.
//
// Usage:
//   export OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxxxxx"
//   npx tsx scripts/generate-missing-audio.ts

import fs from "fs";
import path from "path";
import OpenAI from "openai";

type RoomJson = {
  title?: { en?: string; vi?: string };
  content?: { en?: string; vi?: string };
  entries?: Array<{
    slug?: string;
    audio?: string;
    copy?: { en?: string; vi?: string };
  }>;
};

type Mp3Job = {
  roomPath: string;
  slug: string;
  filename: string;
  text: string;
};

const DATA_DIR = path.join(process.cwd(), "public", "data");
const AUDIO_DIR = path.join(process.cwd(), "public", "audio");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJsonSafe(filePath: string): RoomJson | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`⚠️  Failed to read JSON: ${filePath}`, err);
    return null;
  }
}

function collectJobsFromRoom(filePath: string): Mp3Job[] {
  const room = readJsonSafe(filePath);
  if (!room || !Array.isArray(room.entries)) return [];

  const baseTitle = room.title?.en ?? "Mercy Blade";
  const baseIntro = room.content?.en ?? "";

  const jobs: Mp3Job[] = [];

  for (const entry of room.entries) {
    if (!entry || typeof entry.audio !== "string" || !entry.audio.trim()) {
      continue;
    }

    const filename = entry.audio.trim();
    const slug = entry.slug ?? "entry";

    const body = entry.copy?.en?.trim();
    const text =
      body && body.length > 0
        ? `${baseTitle}. ${body}`
        : `${baseTitle}. ${baseIntro || "Guidance from Mercy Blade."}`;

    jobs.push({
      roomPath: filePath,
      slug,
      filename,
      text,
    });
  }

  return jobs;
}

function walkDataDir(root: string): string[] {
  const results: string[] = [];
  const stack: string[] = [root];

  while (stack.length > 0) {
    const current = stack.pop() as string;
    const stat = fs.statSync(current);

    if (stat.isDirectory()) {
      const children = fs.readdirSync(current);
      for (const c of children) {
        stack.push(path.join(current, c));
      }
    } else if (stat.isFile() && current.endsWith(".json")) {
      // skip the non-room manifest/config jsons if needed
      results.push(current);
    }
  }

  return results;
}

async function createOneMp3(job: Mp3Job) {
  const filePath = path.join(AUDIO_DIR, job.filename);

  // ⏩ IMPORTANT: do not overwrite existing files
  if (fs.existsSync(filePath)) {
    console.log(`⏩ Skip existing file: ${job.filename}`);
    return;
  }

  console.log(
    `🎧 Generating ${job.filename} (room: ${path.basename(
      job.roomPath
    )}, slug: ${job.slug})...`
  );

  const response = await openai.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy",
    format: "mp3",
    input: job.text,
  });

  const audioBuffer = Buffer.from(await response.arrayBuffer());
  await fs.promises.writeFile(filePath, audioBuffer);

  console.log(`✅ Created new file: ${job.filename}`);
}

async function main() {
  console.log("🚀 Starting generate-missing-audio.ts");

  if (!process.env.OPENAI_API_KEY) {
    console.error(
      "❌ OPENAI_API_KEY is not set. Please export it before running this script."
    );
    process.exit(1);
  }

  ensureDir(AUDIO_DIR);

  console.log(`📂 Scanning data directory: ${DATA_DIR}`);
  const jsonFiles = walkDataDir(DATA_DIR);
  console.log(`📄 Found ${jsonFiles.length} JSON files`);

  const allJobs: Mp3Job[] = [];
  for (const filePath of jsonFiles) {
    const jobs = collectJobsFromRoom(filePath);
    if (jobs.length > 0) {
      const filenames = jobs.map((j) => j.filename).join(" ");
      console.log(
        `➡️ Room: ${filePath} | ${jobs.length} audio jobs → ${filenames}`
      );
      allJobs.push(...jobs);
    }
  }

  if (allJobs.length === 0) {
    console.log("✨ No audio jobs found. Nothing to do.");
    return;
  }

  console.log(`🎯 Total audio jobs (before skip-existing): ${allJobs.length}`);

  for (const job of allJobs) {
    try {
      await createOneMp3(job);
      // small delay to be gentle with rate limits
      await new Promise((res) => setTimeout(res, 400));
    } catch (err: any) {
      console.error(`❌ Failed to generate ${job.filename}`, err);
    }
  }

  console.log("✨ Done generating missing audio.");
}

// run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error("Unexpected error in generate-missing-audio.ts", err);
    process.exit(1);
  });
}
