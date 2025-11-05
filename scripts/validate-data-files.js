import { readdir, readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const TIER_DIRS = ['free', 'vip1', 'vip2', 'vip3'];
const REQUIRED_FIELDS = ['name', 'description', 'entries', 'meta'];
const ENTRY_REQUIRED_FIELDS = ['slug', 'keywords_en', 'copy', 'tags'];

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

async function validateJsonStructure(data, filename) {
  const errors = [];
  const warnings = [];

  // Check required top-level fields
  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate entries array
  if (Array.isArray(data.entries)) {
    if (data.entries.length === 0) {
      warnings.push('Entries array is empty');
    }

    data.entries.forEach((entry, idx) => {
      // Check required entry fields
      for (const field of ENTRY_REQUIRED_FIELDS) {
        if (!entry[field]) {
          errors.push(`Entry ${idx}: Missing required field '${field}'`);
        }
      }

      // Validate keywords
      if (entry.keywords_en && !Array.isArray(entry.keywords_en)) {
        errors.push(`Entry ${idx}: keywords_en must be an array`);
      }
      if (entry.keywords_vi && !Array.isArray(entry.keywords_vi)) {
        errors.push(`Entry ${idx}: keywords_vi must be an array`);
      }

      // Validate copy structure
      if (entry.copy && typeof entry.copy !== 'object') {
        errors.push(`Entry ${idx}: copy must be an object`);
      } else if (entry.copy) {
        if (!entry.copy.en) {
          errors.push(`Entry ${idx}: Missing copy.en`);
        }
        // Vietnamese is optional but warn if missing
        if (!entry.copy.vi) {
          warnings.push(`Entry ${idx}: Missing copy.vi (Vietnamese translation)`);
        }
      }

      // Check audio reference
      if (entry.audio) {
        const audioPath = typeof entry.audio === 'string' 
          ? entry.audio 
          : entry.audio.en;
        
        if (audioPath) {
          const fullPath = join(projectRoot, 'public', 'audio', audioPath);
          results.missingAudio.push({ filename, entry: idx, audio: audioPath, path: fullPath });
        }
      } else {
        warnings.push(`Entry ${idx} (${entry.slug}): No audio reference`);
      }

      // Validate tags
      if (entry.tags && !Array.isArray(entry.tags)) {
        errors.push(`Entry ${idx}: tags must be an array`);
      }
    });

    // Check for duplicate slugs
    const slugs = data.entries.map(e => e.slug).filter(Boolean);
    const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (duplicates.length > 0) {
      errors.push(`Duplicate slugs found: ${[...new Set(duplicates)].join(', ')}`);
    }
  } else if (data.entries) {
    errors.push('entries must be an array');
  }

  // Validate meta object
  if (data.meta) {
    if (!data.meta.tier) {
      warnings.push('Missing meta.tier');
    }
    if (!data.meta.entry_count) {
      warnings.push('Missing meta.entry_count');
    } else if (Array.isArray(data.entries) && data.meta.entry_count !== data.entries.length) {
      warnings.push(`meta.entry_count (${data.meta.entry_count}) doesn't match actual entries (${data.entries.length})`);
    }
  }

  return { errors, warnings };
}

async function validateTierDirectory(tier) {
  const tierPath = join(projectRoot, 'public', 'data', tier);
  const tierExists = await fileExists(tierPath);
  
  if (!tierExists) {
    console.log(`${colors.yellow}⚠ Tier directory not found: ${tier}${colors.reset}`);
    return;
  }

  const files = await readdir(tierPath);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));

  console.log(`\n${colors.cyan}📁 Validating ${tier.toUpperCase()} tier (${jsonFiles.length} files)${colors.reset}`);

  for (const file of jsonFiles) {
    results.totalFiles++;
    const filePath = join(tierPath, file);
    
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
          results.errors.push({ file: `${tier}/${file}`, error: err });
        });
      }

      if (warnings.length > 0) {
        warnings.forEach(warn => {
          console.log(`    ${colors.yellow}WARN: ${warn}${colors.reset}`);
          results.warnings.push({ file: `${tier}/${file}`, warning: warn });
        });
      }
    } catch (error) {
      console.log(`  ${colors.red}✗${colors.reset} ${file}`);
      console.log(`    ${colors.red}ERROR: ${error.message}${colors.reset}`);
      results.errors.push({ file: `${tier}/${file}`, error: error.message });
    }
  }
}

async function checkAudioFiles() {
  console.log(`\n${colors.cyan}🔊 Checking audio file references...${colors.reset}`);
  
  let checked = 0;
  let found = 0;
  let missing = 0;

  for (const item of results.missingAudio) {
    checked++;
    const exists = await fileExists(item.path);
    
    if (!exists) {
      missing++;
      console.log(`  ${colors.red}✗${colors.reset} ${item.filename} (entry ${item.entry}): ${item.audio}`);
    } else {
      found++;
    }
  }

  console.log(`\n  Total audio references: ${checked}`);
  console.log(`  ${colors.green}Found: ${found}${colors.reset}`);
  if (missing > 0) {
    console.log(`  ${colors.red}Missing: ${missing}${colors.reset}`);
  }
}

async function main() {
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}       DATA FILE VALIDATION REPORT${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════════════════${colors.reset}`);

  // Validate each tier directory
  for (const tier of TIER_DIRS) {
    await validateTierDirectory(tier);
  }

  // Check audio files
  await checkAudioFiles();

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
