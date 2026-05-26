#!/usr/bin/env node
// Validate VIP4 JSON files structure, tier values, and audio references
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const VIP4_FILES = [
  'Discover_Self_vip4_career_1.json',
  'Explore_World_vip4_career_I_2.json',
  'Explore_World_vip4_career_II_2.json',
  'Launch_Career_vip4_career_4_II.json'
];

const dataDir = path.join(__dirname, '../public/data');
const audioDir = path.join(__dirname, '../public/audio/rooms');

let totalIssues = 0;
let totalWarnings = 0;

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function validateStructure(json, filename) {
  const issues = [];
  const warnings = [];

  // Check meta section
  if (!json.meta) {
    issues.push('Missing "meta" section');
  } else {
    if (!json.meta.tier) {
      issues.push('Missing "meta.tier" field');
    } else if (json.meta.tier !== 'vip4') {
      issues.push(`Invalid tier: "${json.meta.tier}" (expected "vip4")`);
    }

    if (!json.meta.created_at) {
      warnings.push('Missing "meta.created_at" field');
    }

    if (!json.meta.artifact_version_id) {
      warnings.push('Missing "meta.artifact_version_id" field');
    } else if (json.meta.artifact_version_id.includes('vip3')) {
      issues.push(`artifact_version_id contains "vip3": ${json.meta.artifact_version_id}`);
    }

    if (json.meta.summary_of && json.meta.summary_of.includes('vip3')) {
      issues.push(`summary_of contains "vip3": ${json.meta.summary_of}`);
    }
  }

  // Check entries
  if (!json.entries) {
    issues.push('Missing "entries" array');
  } else if (!Array.isArray(json.entries)) {
    issues.push('"entries" must be an array');
  } else {
    json.entries.forEach((entry, index) => {
      const entryPrefix = `Entry ${index + 1} (${entry.slug || 'no-slug'})`;

      if (!entry.slug) {
        issues.push(`${entryPrefix}: Missing "slug" field`);
      }

      // Check audio references
      if (entry.audio) {
        if (typeof entry.audio === 'string') {
          // Single audio file
          if (entry.audio.includes('vip3')) {
            issues.push(`${entryPrefix}: Audio contains "vip3": ${entry.audio}`);
          }
          checkAudioFile(entry.audio, entryPrefix, issues, warnings);
        } else if (typeof entry.audio === 'object') {
          // Multiple audio files (en/vi)
          Object.entries(entry.audio).forEach(([lang, audioPath]) => {
            if (audioPath.includes('vip3')) {
              issues.push(`${entryPrefix}: Audio [${lang}] contains "vip3": ${audioPath}`);
            }
            checkAudioFile(audioPath, `${entryPrefix} [${lang}]`, issues, warnings);
          });
        }
      }
    });
  }

  return { issues, warnings };
}

function checkAudioFile(audioPath, context, issues, warnings) {
  // Check file naming convention
  if (!audioPath.endsWith('.mp3')) {
    warnings.push(`${context}: Audio file should end with .mp3: ${audioPath}`);
  }

  // Check if file exists
  const fullPath = path.join(audioDir, audioPath);
  if (!fs.existsSync(fullPath)) {
    warnings.push(`${context}: Audio file not found: ${audioPath}`);
  }
}

function validateFile(filename) {
  log(`\n${'='.repeat(70)}`, 'cyan');
  log(`Validating: ${filename}`, 'cyan');
  log('='.repeat(70), 'cyan');

  const filePath = path.join(dataDir, filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    log(`✗ File not found: ${filePath}`, 'red');
    totalIssues++;
    return false;
  }

  try {
    // Read and parse JSON
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);

    // Validate structure
    const { issues, warnings } = validateStructure(json, filename);

    // Report results
    if (issues.length === 0 && warnings.length === 0) {
      log('✓ All checks passed!', 'green');
      return true;
    }

    if (issues.length > 0) {
      log(`\n❌ ISSUES (${issues.length}):`, 'red');
      issues.forEach(issue => log(`  • ${issue}`, 'red'));
      totalIssues += issues.length;
    }

    if (warnings.length > 0) {
      log(`\n⚠️  WARNINGS (${warnings.length}):`, 'yellow');
      warnings.forEach(warning => log(`  • ${warning}`, 'yellow'));
      totalWarnings += warnings.length;
    }

    return issues.length === 0;

  } catch (error) {
    log(`✗ Error parsing JSON: ${error.message}`, 'red');
    totalIssues++;
    return false;
  }
}

// Main execution
log('\n🔍 VIP4 JSON Files Validation', 'blue');
log('═'.repeat(70), 'blue');

const results = VIP4_FILES.map(validateFile);
const allPassed = results.every(result => result === true);

// Summary
log('\n' + '═'.repeat(70), 'blue');
log('SUMMARY', 'blue');
log('═'.repeat(70), 'blue');

const passed = results.filter(r => r).length;
const failed = results.length - passed;

log(`\nFiles validated: ${VIP4_FILES.length}`);
log(`✓ Passed: ${passed}`, passed > 0 ? 'green' : 'reset');
if (failed > 0) {
  log(`✗ Failed: ${failed}`, 'red');
}

if (totalIssues > 0) {
  log(`\n❌ Total issues: ${totalIssues}`, 'red');
}
if (totalWarnings > 0) {
  log(`⚠️  Total warnings: ${totalWarnings}`, 'yellow');
}

if (allPassed && totalWarnings === 0) {
  log('\n🎉 All VIP4 files are valid!', 'green');
  process.exit(0);
} else if (totalIssues === 0) {
  log('\n✓ No critical issues found (only warnings)', 'yellow');
  process.exit(0);
} else {
  log('\n❌ Validation failed. Please fix the issues above.', 'red');
  process.exit(1);
}
