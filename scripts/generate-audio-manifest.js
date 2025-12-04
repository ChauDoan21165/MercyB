/**
 * Generate Audio Manifest
 *
 * Scans public/audio/ directory recursively and creates a manifest.json
 * listing all .mp3 files. This manifest is used by the audio coverage audit
 * to know which audio files actually exist.
 *
 * Run: node scripts/generate-audio-manifest.js
 */

import fs from "fs";
import path from "path";

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
      // Recurse into subdirectories
      files.push(...getAllMp3Files(fullPath, baseDir));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp3")) {
      // Get relative path from base audio directory
      const relativePath = path.relative(baseDir, fullPath);
      // Normalize to forward slashes and lowercase
      const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
      files.push(normalized);
    }
  }

  return files;
}

function main() {
  console.log(`Scanning ${AUDIO_DIR} for .mp3 files...`);

  const mp3Files = getAllMp3Files(AUDIO_DIR);

  // Sort for consistent output
  mp3Files.sort();

  const manifest = {
    generated: new Date().toISOString(),
    totalFiles: mp3Files.length,
    files: mp3Files,
  };

  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   Total .mp3 files: ${mp3Files.length}`);

  // Show some stats
  const rootFiles = mp3Files.filter((f) => !f.includes("/"));
  const subfolderFiles = mp3Files.filter((f) => f.includes("/"));
  console.log(`   - Root files: ${rootFiles.length}`);
  console.log(`   - In subfolders: ${subfolderFiles.length}`);
}

main();
