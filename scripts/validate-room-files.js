/**
 * PRE-PUBLISH VALIDATION SCRIPT
 * Enforces canonical naming rules and strict JSON validation
 * Run before deployment to catch all issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.join(projectRoot, 'public', 'data');

const VALID_TIERS = ['free', 'vip1', 'vip2', 'vip3', 'vip3_ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kidslevel1', 'kidslevel2', 'kidslevel3'];

const errors = [];
const warnings = [];
let validCount = 0;

function validateFilename(filename) {
  // Must be lowercase
  if (filename !== filename.toLowerCase()) {
    return { valid: false, reason: 'Filename must be all lowercase' };
  }

  // Must use snake_case or kebab-case (not mixed)
  const hasUnderscore = filename.includes('_');
  const hasHyphen = filename.replace(/-(free|vip\d+|kidslevel\d+)\.json$/, '').includes('-');
  
  if (hasUnderscore && hasHyphen) {
    return { valid: false, reason: 'Filename mixes snake_case and kebab-case' };
  }

  // Must end with .json
  if (!filename.endsWith('.json')) {
    return { valid: false, reason: 'Filename must end with .json' };
  }

  // Must end with tier suffix
  const tierMatch = filename.match(/_(free|vip\d+|kidslevel\d+)\.json$/);
  if (!tierMatch) {
    return { valid: false, reason: 'Filename must end with tier suffix (e.g., _vip9.json)' };
  }

  return { valid: true };
}

function validateJsonStructure(data, filename, filepath) {
  const roomId = filename.replace(/\.json$/, '');
  const issues = [];

  // Check if JSON.id matches filename
  if (data.id && data.id !== roomId) {
    issues.push(`JSON.id (${data.id}) does not match filename (${roomId})`);
  }

  // Check bilingual title
  const hasBilingualTitle = (data.title?.en && data.title?.vi) || (data.name && data.name_vi);
  if (!hasBilingualTitle) {
    issues.push('Missing bilingual title (title.en/title.vi OR name/name_vi)');
  }

  // Check entries
  if (!data.entries || !Array.isArray(data.entries)) {
    issues.push('Missing or invalid entries array');
    return issues; // Can't validate further without entries
  }

  const entryCount = data.entries.length;
  if (entryCount < 2) {
    issues.push(`Too few entries: ${entryCount} (minimum 2)`);
  }
  if (entryCount > 8) {
    issues.push(`Too many entries: ${entryCount} (maximum 8)`);
  }

  // Validate each entry
  data.entries.forEach((entry, index) => {
    const entryNum = index + 1;
    
    // Check identifier
    const hasId = entry.slug || entry.artifact_id || entry.id;
    if (!hasId) {
      issues.push(`Entry ${entryNum}: Missing identifier (slug/artifact_id/id)`);
    }

    // Check audio
    const hasAudio = entry.audio || entry.audio_en || entry.audioEn;
    if (!hasAudio) {
      issues.push(`Entry ${entryNum}: Missing audio field`);
    }

    // Check bilingual copy
    const hasBilingualCopy = (entry.copy?.en && entry.copy?.vi) || (entry.copy_en && entry.copy_vi);
    if (!hasBilingualCopy) {
      issues.push(`Entry ${entryNum}: Missing bilingual copy`);
    }

    // Check title
    const hasBilingualTitle = (entry.title?.en && entry.title?.vi) || entry.title;
    if (!hasBilingualTitle) {
      issues.push(`Entry ${entryNum}: Missing title`);
    }
  });

  // Validate tier
  if (data.tier) {
    const tierNormalized = data.tier.toLowerCase().replace(/\s*\/.*$/, '').replace(/\s+/g, '');
    if (!VALID_TIERS.includes(tierNormalized)) {
      warnings.push(`${roomId}: Unusual tier value: ${data.tier}`);
    }
  }

  return issues;
}

function scanAndValidate() {
  console.log('🔍 Scanning room files for validation...\n');

  if (!fs.existsSync(dataDir)) {
    console.error(`❌ ERROR: Data directory not found: ${dataDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(dataDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));

  console.log(`Found ${jsonFiles.length} JSON files\n`);

  for (const filename of jsonFiles) {
    const filepath = path.join(dataDir, filename);
    
    // Validate filename
    const filenameValidation = validateFilename(filename);
    if (!filenameValidation.valid) {
      errors.push({
        file: filename,
        type: 'FILENAME',
        message: filenameValidation.reason
      });
      continue;
    }

    // Parse and validate JSON
    let data;
    try {
      const content = fs.readFileSync(filepath, 'utf8');
      data = JSON.parse(content);
    } catch (err) {
      errors.push({
        file: filename,
        type: 'JSON_PARSE',
        message: `Failed to parse JSON: ${err.message}`
      });
      continue;
    }

    // Validate structure
    const structureIssues = validateJsonStructure(data, filename, filepath);
    if (structureIssues.length > 0) {
      structureIssues.forEach(issue => {
        errors.push({
          file: filename,
          type: 'STRUCTURE',
          message: issue
        });
      });
    } else {
      validCount++;
    }
  }
}

function printReport() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                    VALIDATION REPORT');
  console.log('═══════════════════════════════════════════════════════════\n');

  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:\n');
    warnings.forEach(warning => {
      console.log(`   ${warning}`);
    });
    console.log('');
  }

  if (errors.length > 0) {
    console.log('❌ ERRORS FOUND:\n');
    
    const errorsByFile = {};
    errors.forEach(error => {
      if (!errorsByFile[error.file]) {
        errorsByFile[error.file] = [];
      }
      errorsByFile[error.file].push(error);
    });

    Object.keys(errorsByFile).sort().forEach(file => {
      console.log(`   📄 ${file}`);
      errorsByFile[file].forEach(error => {
        console.log(`      [${error.type}] ${error.message}`);
      });
      console.log('');
    });

    console.log(`\n❌ VALIDATION FAILED: ${errors.length} error(s) in ${Object.keys(errorsByFile).length} file(s)`);
    console.log(`✅ Valid files: ${validCount}`);
    console.log('\n🚫 DEPLOYMENT BLOCKED - Fix errors before publishing\n');
    process.exit(1);
  } else {
    console.log(`✅ ALL VALIDATIONS PASSED`);
    console.log(`   ${validCount} room files validated successfully`);
    if (warnings.length > 0) {
      console.log(`   ${warnings.length} warning(s) - review recommended`);
    }
    console.log('\n✨ Ready for deployment\n');
    process.exit(0);
  }
}

// Run validation
try {
  scanAndValidate();
  printReport();
} catch (err) {
  console.error('❌ Fatal error during validation:', err);
  process.exit(1);
}
