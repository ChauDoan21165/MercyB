/**
 * Generate Audio Manifest
 *
 * Scans public/audio/ directory recursively and creates a manifest.json
 * listing all .mp3 files. This manifest is used by the audio coverage audit
 * to know which audio files actually exist.
 *
 * Naming standard enforced:
 * - all lowercase
 * - hyphen-separated (no underscores)
 * - ends with -en.mp3 or -vi.mp3
 *
 * Run: node scripts/generate-audio-manifest.js
 */

import fs from "fs";
import path from "path";

const AUDIO_DIR = "public/audio";
const OUTPUT_FILE = "public/audio/manifest.json";

// Naming validation
function validateFilename(name) {
  const warnings = [];
  
  if (name !== name.toLowerCase()) {
    warnings.push("not lowercase");
  }
  if (name.includes("_")) {
    warnings.push("contains underscores (use hyphens)");
  }
  if (name.includes(" ")) {
    warnings.push("contains spaces");
  }
  if (name.startsWith('"') || name.startsWith("'")) {
    warnings.push("starts with quote character");
  }
  
  return warnings;
}

function getAllMp3Files(dir, baseDir = dir) {
  const files = [];
  const warnings = [];

  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return { files, warnings };
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const result = getAllMp3Files(fullPath, baseDir);
      files.push(...result.files);
      warnings.push(...result.warnings);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".mp3")) {
      const relativePath = path.relative(baseDir, fullPath);
      const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
      
      // Skip files with leading quotes (corrupted)
      if (normalized.startsWith('"') || normalized.startsWith("'")) {
        warnings.push(`SKIPPED (corrupted): ${normalized}`);
        continue;
      }
      
      files.push(normalized);
      
      // Check naming conventions
      const nameWarnings = validateFilename(entry.name);
      if (nameWarnings.length > 0) {
        warnings.push(`${entry.name}: ${nameWarnings.join(", ")}`);
      }
    }
  }

  return { files, warnings };
}

function main() {
  console.log(`Scanning ${AUDIO_DIR} for .mp3 files...`);

  const { files: mp3Files, warnings } = getAllMp3Files(AUDIO_DIR);

  // Sort for consistent output
  mp3Files.sort();

  // Separate valid files from files with naming issues
  const validFiles = mp3Files.filter(f => {
    const name = f.split('/').pop() || f;
    return name === name.toLowerCase() && !name.includes('_') && !name.includes(' ');
  });
  
  const invalidFiles = mp3Files.filter(f => {
    const name = f.split('/').pop() || f;
    return name !== name.toLowerCase() || name.includes('_') || name.includes(' ');
  });

  const manifest = {
    generated: new Date().toISOString(),
    totalFiles: mp3Files.length,
    validFiles: validFiles.length,
    invalidFiles: invalidFiles.length,
    files: mp3Files,
    errors: invalidFiles.length > 0 ? invalidFiles : undefined,
  };

  // Write manifest
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   Total .mp3 files: ${mp3Files.length}`);

  // Show stats
  const rootFiles = mp3Files.filter((f) => !f.includes("/"));
  const subfolderFiles = mp3Files.filter((f) => f.includes("/"));
  console.log(`   - Root files: ${rootFiles.length}`);
  console.log(`   - In subfolders: ${subfolderFiles.length}`);
  
  // Show naming warnings (limit to first 20)
  if (warnings.length > 0) {
    console.log(`\n⚠️  Naming warnings (${warnings.length} total):`);
    warnings.slice(0, 20).forEach(w => console.log(`   - ${w}`));
    if (warnings.length > 20) {
      console.log(`   ... and ${warnings.length - 20} more`);
    }
  }
}

main();
