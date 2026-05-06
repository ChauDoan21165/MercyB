import fs from "fs";
import path from "path";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio");
const OUT_FILE = path.join(AUDIO_DIR, "manifest.json");

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function toWebPath(abs) {
  const rel = path.relative(path.join(process.cwd(), "public"), abs);
  return "/" + rel.split(path.sep).join("/");
}

if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
  console.warn("⚠️  public/audio not found — created empty directory and continuing");
}

console.log("Scanning public/audio for .mp3 files...");

const files = walk(AUDIO_DIR)
  .filter(f => f.toLowerCase().endsWith(".mp3"))
  .map(toWebPath)
  .sort();

fs.writeFileSync(
  OUT_FILE,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      totalMp3: files.length,
      files
    },
    null,
    2
  ),
  "utf-8"
);

console.log("✅ Audio manifest generated");
console.log("   Total .mp3 files:", files.length);
