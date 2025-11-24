/**
 * COMPREHENSIVE SINGLE ROOM VALIDATION
 * Validates JSON structure, audio files, registration before GitHub upload
 * Usage: node scripts/validate-single-room.js <filename>
 * Example: node scripts/validate-single-room.js corporate_conflict_navigation_vip9.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.join(projectRoot, 'public', 'data');
const audioDir = path.join(projectRoot, 'public', 'audio');

const VALID_TIERS = ['free', 'vip1', 'vip2', 'vip3', 'vip3_ii', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9', 'kidslevel1', 'kidslevel2', 'kidslevel3'];

class ValidationReport {
  constructor(filename) {
    this.filename = filename;
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.audioChecks = [];
  }

  addError(message) {
    this.errors.push(message);
  }

  addWarning(message) {
    this.warnings.push(message);
  }

  addInfo(message) {
    this.info.push(message);
  }

  addAudioCheck(audio, status, detail = '') {
    this.audioChecks.push({ audio, status, detail });
  }

  hasErrors() {
    return this.errors.length > 0;
  }

  print() {
    console.log('\n' + '═'.repeat(80));
    console.log(`  VALIDATION REPORT: ${this.filename}`);
    console.log('═'.repeat(80) + '\n');

    // Info
    if (this.info.length > 0) {
      console.log('📋 INFORMATION:\n');
      this.info.forEach(msg => console.log(`   ℹ️  ${msg}`));
      console.log('');
    }

    // Audio checks
    if (this.audioChecks.length > 0) {
      console.log('🎵 AUDIO FILE CHECKS:\n');
      this.audioChecks.forEach(({ audio, status, detail }) => {
        const icon = status === 'found' ? '✅' : status === 'missing' ? '❌' : '⚠️';
        console.log(`   ${icon} ${audio} ${detail ? `(${detail})` : ''}`);
      });
      console.log('');
    }

    // Warnings
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:\n');
      this.warnings.forEach(msg => console.log(`   ⚠️  ${msg}`));
      console.log('');
    }

    // Errors
    if (this.errors.length > 0) {
      console.log('❌ ERRORS (MUST FIX):\n');
      this.errors.forEach(msg => console.log(`   ❌ ${msg}`));
      console.log('');
    }

    // Summary
    console.log('═'.repeat(80));
    if (this.hasErrors()) {
      console.log('❌ VALIDATION FAILED');
      console.log(`   ${this.errors.length} error(s) - FIX BEFORE UPLOADING TO GITHUB`);
      if (this.warnings.length > 0) {
        console.log(`   ${this.warnings.length} warning(s) - Review recommended`);
      }
    } else if (this.warnings.length > 0) {
      console.log('⚠️  VALIDATION PASSED WITH WARNINGS');
      console.log(`   ${this.warnings.length} warning(s) - Review recommended but safe to upload`);
    } else {
      console.log('✅ VALIDATION PASSED - READY FOR GITHUB UPLOAD');
    }
    console.log('═'.repeat(80) + '\n');
  }
}

function validateFilename(filename, report) {
  report.addInfo(`Validating filename: ${filename}`);

  // Must be lowercase
  if (filename !== filename.toLowerCase()) {
    report.addError('Filename must be all lowercase');
    return false;
  }

  // Must use snake_case ONLY
  const baseName = filename.replace(/\.json$/, '');
  if (baseName.includes('-')) {
    const withoutTier = baseName.replace(/_(free|vip\d+(_ii)?|kidslevel\d+)$/, '');
    if (withoutTier.includes('-')) {
      report.addError('Filename must use snake_case only (no hyphens except in tier suffix)');
      return false;
    }
  }

  // Must end with .json
  if (!filename.endsWith('.json')) {
    report.addError('Filename must end with .json');
    return false;
  }

  // Must end with tier suffix
  const tierMatch = filename.match(/_(free|vip\d+(_ii)?|kidslevel\d+)\.json$/);
  if (!tierMatch) {
    report.addError('Filename must end with tier suffix (e.g., _vip9.json)');
    return false;
  }

  report.addInfo(`✓ Filename format correct`);
  return true;
}

function validateJsonStructure(data, filename, report) {
  const roomId = filename.replace(/\.json$/, '');
  
  report.addInfo(`Expected room ID: ${roomId}`);

  // Check if JSON.id matches filename (CRITICAL)
  if (!data.id) {
    report.addError('JSON is missing "id" field');
    return false;
  }
  
  if (data.id !== roomId) {
    report.addError(`JSON.id (${data.id}) does NOT match filename (${roomId})`);
    report.addError(`FIX: Change JSON.id to "${roomId}" OR rename file to "${data.id}.json"`);
    return false;
  }
  report.addInfo(`✓ JSON.id matches filename: ${roomId}`);

  // Check bilingual title
  const hasBilingualTitle = (data.title?.en && data.title?.vi) || (data.name && data.name_vi);
  if (!hasBilingualTitle) {
    report.addError('Missing bilingual title (title.en/title.vi OR name/name_vi)');
    return false;
  }
  report.addInfo(`✓ Bilingual title found`);

  // Check tier
  if (!data.tier) {
    report.addWarning('Missing tier field (recommended but not required)');
  } else {
    const tierNormalized = data.tier.toLowerCase().replace(/\s*\/.*$/, '').replace(/\s+/g, '');
    if (!VALID_TIERS.includes(tierNormalized)) {
      report.addWarning(`Unusual tier value: ${data.tier}`);
    } else {
      report.addInfo(`✓ Tier: ${data.tier}`);
    }
  }

  // Check entries
  if (!data.entries || !Array.isArray(data.entries)) {
    report.addError('Missing or invalid entries array');
    return false;
  }

  const entryCount = data.entries.length;
  if (entryCount < 2) {
    report.addError(`Too few entries: ${entryCount} (minimum 2)`);
    return false;
  }
  if (entryCount > 8) {
    report.addError(`Too many entries: ${entryCount} (maximum 8)`);
    return false;
  }
  report.addInfo(`✓ Entry count: ${entryCount} (within 2-8 range)`);

  // Validate each entry
  let hasEntryErrors = false;
  data.entries.forEach((entry, index) => {
    const entryNum = index + 1;
    
    // Check identifier
    const hasId = entry.slug || entry.artifact_id || entry.id;
    if (!hasId) {
      report.addError(`Entry ${entryNum}: Missing identifier (slug/artifact_id/id)`);
      hasEntryErrors = true;
    }

    // Check audio
    const hasAudio = entry.audio || entry.audio_en || entry.audioEn;
    if (!hasAudio) {
      report.addError(`Entry ${entryNum}: Missing audio field`);
      hasEntryErrors = true;
    }

    // Check bilingual copy
    const hasBilingualCopy = (entry.copy?.en && entry.copy?.vi) || (entry.copy_en && entry.copy_vi);
    if (!hasBilingualCopy) {
      report.addError(`Entry ${entryNum}: Missing bilingual copy (copy.en/copy.vi OR copy_en/copy_vi)`);
      hasEntryErrors = true;
    }

    // Check title
    const hasBilingualTitle = (entry.title?.en && entry.title?.vi) || entry.title;
    if (!hasBilingualTitle) {
      report.addError(`Entry ${entryNum}: Missing title`);
      hasEntryErrors = true;
    }
  });

  if (hasEntryErrors) {
    return false;
  }

  report.addInfo(`✓ All ${entryCount} entries have required fields`);
  return true;
}

function checkAudioFiles(data, report) {
  if (!data.entries) return;

  report.addInfo(`Checking ${data.entries.length} audio files...`);

  data.entries.forEach((entry, index) => {
    const audioFile = entry.audio || entry.audio_en || entry.audioEn;
    if (!audioFile) return;

    const audioPath = path.join(audioDir, audioFile);
    
    if (fs.existsSync(audioPath)) {
      const stats = fs.statSync(audioPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      report.addAudioCheck(audioFile, 'found', `${sizeKB} KB`);
    } else {
      report.addAudioCheck(audioFile, 'missing', 'FILE NOT FOUND');
      report.addError(`Entry ${index + 1}: Audio file not found: ${audioFile}`);
      report.addError(`  Expected location: public/audio/${audioFile}`);
    }
  });
}

function checkRegistration(filename, report) {
  const manifestPath = path.join(projectRoot, 'src', 'lib', 'roomManifest.ts');
  
  if (!fs.existsSync(manifestPath)) {
    report.addWarning('roomManifest.ts not found - will be auto-generated on GitHub push');
    return;
  }

  const manifestContent = fs.readFileSync(manifestPath, 'utf8');
  const roomId = filename.replace(/\.json$/, '');
  
  if (manifestContent.includes(`"${roomId}"`)) {
    report.addInfo(`✓ Room already registered in manifest`);
  } else {
    report.addInfo(`⏳ Room not yet in manifest (will auto-register on GitHub push)`);
  }
}

async function validateRoom(filename) {
  const report = new ValidationReport(filename);

  console.log('\n🔍 Starting comprehensive validation...\n');

  // Check if file exists
  const filepath = path.join(dataDir, filename);
  if (!fs.existsSync(filepath)) {
    report.addError(`File not found: ${filepath}`);
    report.addError(`Make sure file is in: public/data/`);
    report.print();
    return false;
  }

  report.addInfo(`✓ File found: ${filepath}`);

  // Validate filename
  if (!validateFilename(filename, report)) {
    report.print();
    return false;
  }

  // Parse JSON
  let data;
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    data = JSON.parse(content);
    report.addInfo(`✓ JSON parses successfully`);
  } catch (err) {
    report.addError(`Failed to parse JSON: ${err.message}`);
    report.print();
    return false;
  }

  // Validate JSON structure
  if (!validateJsonStructure(data, filename, report)) {
    report.print();
    return false;
  }

  // Check audio files
  checkAudioFiles(data, report);

  // Check registration
  checkRegistration(filename, report);

  // Print report
  report.print();

  return !report.hasErrors();
}

// Main execution
const filename = process.argv[2];

if (!filename) {
  console.error('\n❌ ERROR: Please provide a filename\n');
  console.log('Usage: node scripts/validate-single-room.js <filename>');
  console.log('Example: node scripts/validate-single-room.js corporate_conflict_navigation_vip9.json\n');
  process.exit(1);
}

validateRoom(filename).then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
