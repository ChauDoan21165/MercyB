/**
 * Generate Audio Manifest v4.2
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
 * Usage:
 *   node scripts/generate-audio-manifest.js              # Normal: updates timestamp
 *   node scripts/generate-audio-manifest.js --no-timestamp  # CI dry-run: no timestamp noise
 *
 * The --no-timestamp flag prevents timestamp updates when the file list hasn't changed,
 * eliminating CI noise from "no-change" dry-run commits.
 */

import fs from "fs";
import path from "path";

const AUDIO_DIR = "public/audio";
const OUTPUT_FILE = "public/audio/manifest.json";

// Parse CLI args
const args = process.argv.slice(2);
const noTimestamp = args.includes('--no-timestamp');
const verbose = args.includes('--verbose');

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
      // Skip _duplicates, _orphans, and hidden directories
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) {
        if (verbose) {
          console.log(`  Skipping directory: ${entry.name}`);
        }
        continue;
      }
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

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function main() {
  console.log(`Scanning ${AUDIO_DIR} for .mp3 files...`);
  if (noTimestamp) {
    console.log(`  Mode: --no-timestamp (CI dry-run, minimal changes)`);
  }

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

  // Read existing manifest if present
  let existingManifest = null;
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingManifest = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf-8'));
    } catch {
      existingManifest = null;
    }
  }

  // Check if files list changed
  const filesUnchanged = existingManifest && 
    arraysEqual(existingManifest.files || [], mp3Files);

  // If --no-timestamp and files are unchanged, skip write entirely
  if (noTimestamp && filesUnchanged) {
    console.log(`✅ Manifest unchanged (${mp3Files.length} files) - no write needed`);
    return;
  }

  // Build manifest object
  const manifest = {
    // Keep existing timestamp if --no-timestamp and files unchanged
    // Otherwise update timestamp
    generated: (noTimestamp && existingManifest?.generated) 
      ? existingManifest.generated 
      : new Date().toISOString(),
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
  console.log(`   Valid files: ${validFiles.length}`);
  console.log(`   Invalid files: ${invalidFiles.length}`);

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
