#!/usr/bin/env node

/**
 * Audio Validation Script
 * Checks all JSON files against available audio files and reports:
 * - Missing audio files
 * - Mismatched references
 * - Naming inconsistencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../public/data');
const AUDIO_DIR = path.join(__dirname, '../public');

// Get all JSON files
function getJSONFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`❌ Data directory not found: ${DATA_DIR}`);
    return [];
  }
  return fs.readdirSync(DATA_DIR)
    .filter(file => file.endsWith('.json'))
    .map(file => path.join(DATA_DIR, file));
}

// Get all audio files recursively
function getAudioFiles(dir = AUDIO_DIR, audioFiles = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      getAudioFiles(fullPath, audioFiles);
    } else if (entry.isFile() && entry.name.endsWith('.mp3')) {
      // Store relative path from public root
      const relativePath = path.relative(AUDIO_DIR, fullPath);
      audioFiles.push(relativePath);
    }
  }
  
  return audioFiles;
}

// Main validation
function validateAudio() {
  console.log('🔍 Audio Validation Report\n');
  console.log('=' .repeat(60));
  
  const jsonFiles = getJSONFiles();
  const audioFiles = getAudioFiles();
  const audioSet = new Set(audioFiles.map(f => f.toLowerCase()));
  
  console.log(`\n📊 Summary:`);
  console.log(`  JSON files: ${jsonFiles.length}`);
  console.log(`  Audio files: ${audioFiles.length}\n`);
  
  const issues = {
    missingAudio: [],
    namingInconsistencies: [],
    tierMismatches: []
  };
  
  // Check each JSON file
  for (const jsonFile of jsonFiles) {
    const jsonName = path.basename(jsonFile);
    const content = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    
    console.log(`\n📄 ${jsonName}`);
    console.log('-'.repeat(60));
    
    // Extract tier from filename
    const tierMatch = jsonName.match(/_(free|vip1|vip2|vip3)\.json$/i);
    const fileTier = tierMatch ? tierMatch[1].toLowerCase() : 'unknown';
    
    // Check tier field in JSON
    const jsonTier = content.tier?.toLowerCase();
    if (jsonTier && !jsonTier.includes(fileTier)) {
      issues.tierMismatches.push({
        file: jsonName,
        fileTier,
        jsonTier
      });
      console.log(`  ⚠️  Tier mismatch: File=${fileTier}, JSON=${jsonTier}`);
    }
    
    // Check entries
    if (Array.isArray(content.entries)) {
      let entryMissing = 0;
      let entryFound = 0;
      
      for (const entry of content.entries) {
        if (entry.audio) {
          const audioRef = entry.audio.replace(/^\//, '');
          const audioRefLower = audioRef.toLowerCase();
          
          if (!audioSet.has(audioRefLower)) {
            entryMissing++;
            issues.missingAudio.push({
              file: jsonName,
              slug: entry.slug,
              audioRef
            });
          } else {
            entryFound++;
            
            // Check if naming follows convention: {slug}_{tier}.mp3
            const expectedName = `${entry.slug}_${fileTier}.mp3`;
            if (audioRefLower !== expectedName.toLowerCase()) {
              issues.namingInconsistencies.push({
                file: jsonName,
                slug: entry.slug,
                actual: audioRef,
                expected: expectedName
              });
            }
          }
        }
      }
      
      console.log(`  ✓ Audio found: ${entryFound}`);
      if (entryMissing > 0) {
        console.log(`  ❌ Audio missing: ${entryMissing}`);
      }
    }
  }
  
  // Print detailed issues
  console.log('\n\n' + '='.repeat(60));
  console.log('📋 DETAILED ISSUES\n');
  
  if (issues.missingAudio.length > 0) {
    console.log(`\n❌ Missing Audio Files (${issues.missingAudio.length}):`);
    console.log('-'.repeat(60));
    for (const issue of issues.missingAudio) {
      console.log(`  ${issue.file} → ${issue.slug}`);
      console.log(`    Missing: ${issue.audioRef}`);
    }
  }
  
  if (issues.namingInconsistencies.length > 0) {
    console.log(`\n⚠️  Naming Inconsistencies (${issues.namingInconsistencies.length}):`);
    console.log('-'.repeat(60));
    for (const issue of issues.namingInconsistencies) {
      console.log(`  ${issue.file} → ${issue.slug}`);
      console.log(`    Actual:   ${issue.actual}`);
      console.log(`    Expected: ${issue.expected}`);
    }
  }
  
  if (issues.tierMismatches.length > 0) {
    console.log(`\n🔄 Tier Mismatches (${issues.tierMismatches.length}):`);
    console.log('-'.repeat(60));
    for (const issue of issues.tierMismatches) {
      console.log(`  ${issue.file}`);
      console.log(`    File tier: ${issue.fileTier}`);
      console.log(`    JSON tier: ${issue.jsonTier}`);
    }
  }
  
  // Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('✅ VALIDATION COMPLETE\n');
  const totalIssues = issues.missingAudio.length + 
                      issues.namingInconsistencies.length + 
                      issues.tierMismatches.length;
  
  if (totalIssues === 0) {
    console.log('  🎉 No issues found! All audio references are valid.');
  } else {
    console.log(`  Total issues found: ${totalIssues}`);
    console.log(`    - Missing audio: ${issues.missingAudio.length}`);
    console.log(`    - Naming issues: ${issues.namingInconsistencies.length}`);
    console.log(`    - Tier mismatches: ${issues.tierMismatches.length}`);
  }
  console.log('=' .repeat(60));
}

// Run validation
try {
  validateAudio();
} catch (error) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}
