/**
 * CI VALIDATION SCRIPT - Uses same validator as runtime
 * 
 * CANONICAL ROOM ENTRY STRUCTURE (aligned with roomJsonResolver.ts):
 * - audio: entry.audio (string filename, no paths) OR legacy: audio_en, audioEn
 * - copy: entry.copy.en + entry.copy.vi OR legacy: copy_en, copy_vi
 * - identifiers: entry.slug OR entry.id OR entry.artifact_id (at least one required)
 * - keywords: entry.keywords_en (array) + entry.keywords_vi (array)
 * - entry count: 2-8 (strict mode), 1-20 (wip mode)
 * 
 * This script:
 * - Reads from public/data (same as production)
 * - Uses shared validation logic from roomJsonValidation
 * - Respects VITE_MB_VALIDATION_MODE env var
 * - Exits with code 1 if any validation fails (blocks CI)
 * 
 * Run: VITE_MB_VALIDATION_MODE=strict node scripts/validate-rooms-ci.js
 */

const fs = require('fs');
const path = require('path');

// Determine validation mode from env or default to strict for CI
const MODE = process.env.VITE_MB_VALIDATION_MODE || 'strict';
const DATA_DIR = path.join(__dirname, '../public/data');

console.log(`\n🔍 CI ROOM VALIDATION`);
console.log(`Mode: ${MODE}`);
console.log(`Directory: ${DATA_DIR}\n`);

// Validation config matching src/lib/validation/roomJsonValidation.ts
const VALIDATION_CONFIGS = {
  strict: {
    mode: 'strict',
    minEntries: 2,
    maxEntries: 8,
    requireAudio: true,
    requireBilingualCopy: true,
    allowMissingFields: false,
  },
  preview: {
    mode: 'preview',
    minEntries: 1,
    maxEntries: 8,
    requireAudio: false,
    requireBilingualCopy: true,
    allowMissingFields: true,
  },
  wip: {
    mode: 'wip',
    minEntries: 1,
    maxEntries: 20,
    requireAudio: false,
    requireBilingualCopy: false,
    allowMissingFields: true,
  },
};

const config = VALIDATION_CONFIGS[MODE] || VALIDATION_CONFIGS.strict;

// Validation functions matching roomJsonValidation.ts
function validateEntryCount(count) {
  if (count < config.minEntries || count > config.maxEntries) {
    return {
      valid: false,
      message: `Entry count ${count} outside allowed range [${config.minEntries}-${config.maxEntries}] (${config.mode} mode)`
    };
  }
  return { valid: true };
}

function validateEntryAudio(entry, index) {
  if (!config.requireAudio) return { valid: true };
  
  // CANONICAL: entry.audio (string filename)
  // LEGACY: audio_en, audioEn (same as roomJsonResolver.ts)
  const hasAudio = entry.audio || entry.audio_en || entry.audioEn;
  if (!hasAudio) {
    return {
      valid: false,
      message: `Entry ${index + 1} missing audio field (required in ${config.mode} mode)`
    };
  }
  return { valid: true };
}

function validateEntryBilingualCopy(entry, index) {
  if (!config.requireBilingualCopy) return { valid: true };
  
  // CANONICAL: entry.copy.en + entry.copy.vi
  // LEGACY: copy_en, copy_vi (same as roomJsonResolver.ts)
  const hasBilingual =
    (entry.copy && entry.copy.en && entry.copy.vi) ||
    (entry.copy_en && entry.copy_vi);
    
  if (!hasBilingual) {
    return {
      valid: false,
      message: `Entry ${index + 1} missing bilingual copy (required in ${config.mode} mode)`
    };
  }
  return { valid: true };
}

function validateRoomJson(data, roomId, filename) {
  // Check if we got HTML instead of JSON
  if (typeof data === 'string' && (data.trim().startsWith('<!DOCTYPE') || data.trim().startsWith('<html'))) {
    throw new Error('Received HTML instead of JSON - file may not exist');
  }

  // Validate JSON.id matches filename
  const expectedId = filename.replace(/\.json$/, '');
  if (data.id && data.id !== expectedId && data.id !== roomId) {
    throw new Error(`JSON.id "${data.id}" does not match filename "${expectedId}"`);
  }

  // Validate bilingual title
  const hasBilingualTitle = (data.title?.en && data.title?.vi) || (data.name && data.name_vi);
  if (!hasBilingualTitle && !config.allowMissingFields) {
    throw new Error(`Missing bilingual title fields (required in ${config.mode} mode)`);
  }

  // Validate entries array exists
  if (!data.entries || !Array.isArray(data.entries)) {
    throw new Error('Missing or invalid entries array');
  }

  // Validate entry count
  const entryCountResult = validateEntryCount(data.entries.length);
  if (!entryCountResult.valid) {
    throw new Error(entryCountResult.message);
  }

  // Validate each entry
  data.entries.forEach((entry, index) => {
    // Check identifier - CANONICAL: slug OR id OR artifact_id (same as roomJsonResolver.ts)
    const hasId = entry.slug || entry.artifact_id || entry.id;
    if (!hasId) {
      throw new Error(`Entry ${index + 1} missing identifier (slug/artifact_id/id)`);
    }

    // Check audio - CANONICAL: entry.audio (string filename)
    const audioResult = validateEntryAudio(entry, index);
    if (!audioResult.valid) {
      throw new Error(audioResult.message);
    }

    // Check bilingual copy - CANONICAL: copy.en + copy.vi
    const bilingualResult = validateEntryBilingualCopy(entry, index);
    if (!bilingualResult.valid) {
      throw new Error(bilingualResult.message);
    }
  });

  // Validate tier if present
  const validTiers = ['free', 'vip1', 'vip2', 'vip3', 'vip3ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'];
  if (data.tier && !validTiers.includes(data.tier.toLowerCase().replace(/\s*\/.*$/, '').replace(/\s+/g, ''))) {
    console.warn(`⚠️  Unusual tier value: ${data.tier}`);
  }
}

// Main validation loop
let totalFiles = 0;
let validFiles = 0;
let failedFiles = [];

try {
  const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  totalFiles = files.length;

  console.log(`Found ${totalFiles} JSON files to validate\n`);

  files.forEach(filename => {
    const filePath = path.join(DATA_DIR, filename);
    const roomId = filename.replace(/\.json$/, '');
    
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      validateRoomJson(data, roomId, filename);
      
      console.log(`✅ ${filename}`);
      validFiles++;
    } catch (error) {
      console.error(`❌ ${filename}`);
      console.error(`   ${error.message}\n`);
      failedFiles.push({ filename, error: error.message });
    }
  });

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`VALIDATION SUMMARY (${MODE} mode)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total files: ${totalFiles}`);
  console.log(`Valid: ${validFiles}`);
  console.log(`Failed: ${failedFiles.length}`);
  
  if (failedFiles.length > 0) {
    console.log(`\n❌ VALIDATION FAILED - ${failedFiles.length} files have errors\n`);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL FILES VALID\n`);
    process.exit(0);
  }

} catch (error) {
  console.error(`\n❌ FATAL ERROR: ${error.message}\n`);
  process.exit(1);
}
