import { readdir, readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Scan flat public/data directory, not subdirectories
const DATA_DIR = join(projectRoot, 'public', 'data');
const AUDIO_DIR = join(projectRoot, 'public', 'audio');
const ROOM_FILE_REGEX = /(free|vip1|vip2|vip3|vip4)\.json$/i;
const REQUIRED_FIELDS = ['entries']; // Minimal requirement
const ENTRY_REQUIRED_FIELDS_FLEXIBLE = ['slug', 'keywords_en', 'keywords_vi', 'copy', 'tags']; // At least some should exist

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const results = {
  totalFiles: 0,
  validFiles: 0,
  errors: [],
  warnings: [],
  missingAudio: [],
};

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function validateKeywords(data, filename) {
  const warnings = [];
  let hasKeywords = false;
  
  // Check top-level keywords
  if (data.keywords_en || data.keywords_vi || data.keywords) {
    hasKeywords = true;
  }
  
  // Check keywords_dict (for vip3 format)
  if (data.keywords_dict && Object.keys(data.keywords_dict).length > 0) {
    hasKeywords = true;
  }
  
  // Check entry-level keywords
  if (data.entries) {
    const entriesList = Array.isArray(data.entries) ? data.entries : Object.values(data.entries);
    const entriesWithKeywords = entriesList.filter(entry => 
      entry.keywords_en || entry.keywords_vi || entry.keywords || entry.keywordEn
    );
    if (entriesWithKeywords.length > 0) {
      hasKeywords = true;
    }
  }
  
  if (!hasKeywords) {
    warnings.push('No keywords found anywhere (checked keywords_en, keywords_vi, keywords_dict, entry-level)');
  }
  
  return warnings;
}

async function validateAudioReferences(data, filename) {
  const warnings = [];
  const missingAudio = [];
  
  // Helper to check if audio file exists
  const checkAudio = async (audioPath, context) => {
    if (!audioPath || typeof audioPath !== 'string') return;
    
    const cleanPath = audioPath.replace(/^\//, '');
    const fullPath = join(AUDIO_DIR, cleanPath);
    const exists = await fileExists(fullPath);
    
    if (!exists) {
      missingAudio.push({ context, audio: audioPath });
    }
  };
  
  // Check top-level audio
  if (data.audio) {
    if (typeof data.audio === 'object') {
      for (const [lang, path] of Object.entries(data.audio)) {
        await checkAudio(path, `top-level.audio.${lang}`);
      }
    } else {
      await checkAudio(data.audio, 'top-level.audio');
    }
  }
  
  // Check entries
  if (data.entries) {
    const entriesList = Array.isArray(data.entries) ? data.entries : Object.values(data.entries);
    
    for (let i = 0; i < entriesList.length; i++) {
      const entry = entriesList[i];
      const identifier = entry.slug || entry.keywordEn || entry.id || `entry[${i}]`;
      
      // Check various audio field formats
      const audioFields = ['audio', 'audioFile', 'audio_file'];
      for (const field of audioFields) {
        if (entry[field]) {
          const audioValue = entry[field];
          
          if (typeof audioValue === 'object') {
            for (const [lang, path] of Object.entries(audioValue)) {
              await checkAudio(path, `${identifier}.${field}.${lang}`);
            }
          } else {
            await checkAudio(audioValue, `${identifier}.${field}`);
          }
        }
      }
    }
  }
  
  if (missingAudio.length > 0) {
    missingAudio.forEach(({ context, audio }) => {
      warnings.push(`Missing audio file: ${audio} (referenced in ${context})`);
    });
  }
  
  return warnings;
}

async function validateJsonStructure(data, filename) {
  const errors = [];
  const warnings = [];

  // Check for entries (required)
  if (!data.entries) {
    errors.push('Missing required field: entries');
    return { errors, warnings }; // Can't continue without entries
  }

  // Validate entries format (can be array or object)
  let entriesList = [];
  if (Array.isArray(data.entries)) {
    entriesList = data.entries;
  } else if (typeof data.entries === 'object') {
    entriesList = Object.values(data.entries);
    // This is VIP3 format with keyed entries
  } else {
    errors.push('entries must be an array or object');
    return { errors, warnings };
  }

  if (entriesList.length === 0) {
    warnings.push('Entries collection is empty');
  }

  // Validate individual entries
  entriesList.forEach((entry, idx) => {
    // Check for at least one identifier
    if (!entry.slug && !entry.keywordEn && !entry.id) {
      warnings.push(`Entry ${idx}: Missing identifier (slug, keywordEn, or id)`);
    }

    // Check for at least one content field
    if (!entry.copy && !entry.replyEn && !entry.replyVi && !entry.essay) {
      warnings.push(`Entry ${idx}: Missing content (copy, replyEn, essay, etc.)`);
    }

    // Validate copy structure if present
    if (entry.copy && typeof entry.copy !== 'object') {
      errors.push(`Entry ${idx}: copy must be an object`);
    } else if (entry.copy && !entry.copy.en) {
      errors.push(`Entry ${idx}: Missing copy.en`);
    }

    // Validate keywords
    if (entry.keywords_en && !Array.isArray(entry.keywords_en)) {
      errors.push(`Entry ${idx}: keywords_en must be an array`);
    }
    if (entry.keywords_vi && !Array.isArray(entry.keywords_vi)) {
      errors.push(`Entry ${idx}: keywords_vi must be an array`);
    }

    // Validate tags
    if (entry.tags && !Array.isArray(entry.tags)) {
      errors.push(`Entry ${idx}: tags must be an array`);
    }
  });

  // Check for duplicate slugs in array format
  if (Array.isArray(data.entries)) {
    const slugs = data.entries.map(e => e.slug).filter(Boolean);
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (duplicates.length > 0) {
      errors.push(`Duplicate slugs found: ${[...new Set(duplicates)].join(', ')}`);
    }
  }

  // Validate meta if present
  if (data.meta) {
    if (!data.meta.tier) {
      warnings.push('Missing meta.tier');
    }
    if (data.meta.entry_count !== undefined && data.meta.entry_count !== entriesList.length) {
      warnings.push(`meta.entry_count (${data.meta.entry_count}) doesn't match actual entries (${entriesList.length})`);
    }
  } else {
    warnings.push('Missing meta section (recommended)');
  }

  // Check keywords
  const keywordWarnings = await validateKeywords(data, filename);
  warnings.push(...keywordWarnings);

  // Check audio references
  const audioWarnings = await validateAudioReferences(data, filename);
  warnings.push(...audioWarnings);

  return { errors, warnings };
}

async function validateDataDirectory() {
  const dirExists = await fileExists(DATA_DIR);
  
  if (!dirExists) {
    console.log(`${colors.red}✗ Data directory not found: ${DATA_DIR}${colors.reset}`);
    return;
  }

  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.') && ROOM_FILE_REGEX.test(f));

  console.log(`\n${colors.cyan}📁 Validating data files (${jsonFiles.length} files)${colors.reset}\n`);

  for (const file of jsonFiles) {
    results.totalFiles++;
    const filePath = join(DATA_DIR, file);
    
    try {
      const content = await readFile(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      const { errors, warnings } = await validateJsonStructure(data, file);

      if (errors.length === 0) {
        results.validFiles++;
        console.log(`  ${colors.green}✓${colors.reset} ${file}`);
      } else {
        console.log(`  ${colors.red}✗${colors.reset} ${file}`);
        errors.forEach(err => {
          console.log(`    ${colors.red}ERROR: ${err}${colors.reset}`);
          results.errors.push({ file, error: err });
        });
      }

      if (warnings.length > 0) {
        warnings.forEach(warn => {
          console.log(`    ${colors.yellow}WARN: ${warn}${colors.reset}`);
          results.warnings.push({ file, warning: warn });
        });
      }
    } catch (error) {
      console.log(`  ${colors.red}✗${colors.reset} ${file}`);
      console.log(`    ${colors.red}ERROR: ${error.message}${colors.reset}`);
      results.errors.push({ file, error: error.message });
    }
  }
}

async function main() {
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}       DATA FILE VALIDATION REPORT${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);

  // Validate data directory
  await validateDataDirectory();

  // Summary
  console.log(`\n${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}                    SUMMARY${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`Total files validated: ${results.totalFiles}`);
  console.log(`${colors.green}Valid files: ${results.validFiles}${colors.reset}`);
  console.log(`${colors.red}Files with errors: ${results.errors.length > 0 ? results.totalFiles - results.validFiles : 0}${colors.reset}`);
  console.log(`${colors.yellow}Total warnings: ${results.warnings.length}${colors.reset}`);

  if (results.errors.length === 0 && results.warnings.length === 0) {
    console.log(`\n${colors.green}✓ All validation checks passed!${colors.reset}\n`);
    process.exit(0);
  } else if (results.errors.length === 0) {
    console.log(`\n${colors.yellow}⚠ Validation passed with warnings${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}✗ Validation failed with errors${colors.reset}\n`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
