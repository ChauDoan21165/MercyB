/**
 * Generate Audio Manifest (CommonJS, safe with "type": "module")
 *
 * Scans public/audio/ directory recursively and creates a manifest.json
 * listing all .mp3 files.
 */

const fs = require("fs");
const path = require("path");

const AUDIO_DIR = "public/audio";
const OUTPUT_FILE = "public/audio/manifest.json";

function getAllMp3Files(dir, baseDir = dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...getAllMp3Files(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp3")) {
      const relativePath = path.relative(baseDir, fullPath);
      const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
      files.push(normalized);
    }
  }

  return files;
}

function main() {
  console.log(`Scanning ${AUDIO_DIR} for .mp3 files...`);
  const mp3Files = getAllMp3Files(AUDIO_DIR);
  mp3Files.sort();

  const manifest = {
    generated: new Date().toISOString(),
    totalFiles: mp3Files.length,
    files: mp3Files,
  };

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   Total .mp3 files: ${mp3Files.length}`);

  const rootFiles = mp3Files.filter((f) => !f.includes("/"));
  const subfolderFiles = mp3Files.filter((f) => f.includes("/"));

  console.log(`   - Root files: ${rootFiles.length}`);
  console.log(`   - In subfolders: ${subfolderFiles.length}`);
}

main();
