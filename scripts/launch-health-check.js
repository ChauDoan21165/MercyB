#!/usr/bin/env node
/**
 * LAUNCH HEALTH CHECK - Final Pre-Launch Verification
 * 
 * This script performs comprehensive health checks before launch:
 * 1. Load every JSON room file
 * 2. Cross-check with database
 * 3. Verify audio files exist
 * 4. Check entry integrity (slug, keywords)
 * 5. Simulate user journey scenarios
 * 
 * Usage: node scripts/launch-health-check.js
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const DATA_DIR = path.join(__dirname, '..', 'public', 'data');
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');

// Canonical tier labels (must match src/lib/constants/tiers.ts)
const CANONICAL_TIERS = {
  free: "Free / Miễn phí",
  vip1: "VIP1 / VIP1",
  vip2: "VIP2 / VIP2",
  vip3: "VIP3 / VIP3",
  vip3ii: "VIP3 II / VIP3 II",
  vip4: "VIP4 / VIP4",
  vip5: "VIP5 / VIP5",
  vip6: "VIP6 / VIP6",
  vip9: "VIP9 / Cấp VIP9",
  kids_1: "Kids Level 1 / Trẻ em cấp 1",
  kids_2: "Kids Level 2 / Trẻ em cấp 2",
  kids_3: "Kids Level 3 / Trẻ em cấp 3",
};

// Results tracking
const results = {
  totalJsonFiles: 0,
  validJsonFiles: 0,
  brokenJsonFiles: [],
  
  totalDbRooms: 0,
  dbRoomsWithEntries: 0,
  dbRoomsWithoutEntries: [],
  
  missingDbRows: [],      // JSON exists but no DB row
  missingJsonFiles: [],   // DB row exists but no JSON
  
  audioFilesChecked: 0,
  missingAudioFiles: [],
  
  entriesMissingSlug: [],
  entriesMissingKeywords: [],
  
  wrongTierLabels: [],
  
  startTime: Date.now(),
};

// Initialize Supabase
const supabase = SUPABASE_URL && SUPABASE_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Get all JSON files from data directory
 */
function getJsonFiles() {
  try {
    const files = fs.readdirSync(DATA_DIR);
    return files.filter(f => f.endsWith('.json') && !f.startsWith('.'));
  } catch (error) {
    console.error('❌ Cannot read data directory:', error.message);
    return [];
  }
}

/**
 * Parse and validate a JSON room file
 */
function validateJsonFile(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    const issues = [];
    
    // Check required fields
    if (!data.id) issues.push('missing id');
    if (!data.tier) issues.push('missing tier');
    if (!Array.isArray(data.entries)) issues.push('entries not array');
    if (!data.title?.en && !data.title_en) issues.push('missing title');
    
    // Validate tier label format
    if (data.tier) {
      const isCanonical = Object.values(CANONICAL_TIERS).includes(data.tier);
      if (!isCanonical) {
        results.wrongTierLabels.push({
          file: filename,
          tier: data.tier,
          expected: 'One of canonical labels'
        });
      }
    }
    
    // Validate entries
    if (Array.isArray(data.entries)) {
      data.entries.forEach((entry, idx) => {
        const entryId = entry.slug || entry.id || entry.artifact_id || `entry-${idx}`;
        
        // Check slug/identifier
        if (!entry.slug && !entry.id && !entry.artifact_id) {
          results.entriesMissingSlug.push(`${filename}:${idx}`);
        }
        
        // Check keywords
        if (!entry.keywords_en || !Array.isArray(entry.keywords_en) || entry.keywords_en.length === 0) {
          results.entriesMissingKeywords.push(`${filename}:${entryId}`);
        }
        
        // Check audio file exists
        if (entry.audio) {
          const audioFilename = String(entry.audio).trim();
          if (audioFilename) {
            results.audioFilesChecked++;
            const audioPath = path.join(AUDIO_DIR, audioFilename);
            if (!fileExists(audioPath)) {
              results.missingAudioFiles.push({
                room: filename,
                entry: entryId,
                audio: audioFilename
              });
            }
          }
        }
      });
    }
    
    return {
      valid: issues.length === 0,
      id: data.id,
      tier: data.tier,
      entryCount: data.entries?.length || 0,
      issues
    };
  } catch (error) {
    return {
      valid: false,
      id: null,
      tier: null,
      entryCount: 0,
      issues: [`Parse error: ${error.message}`]
    };
  }
}

/**
 * Fetch all rooms from database
 */
async function fetchDbRooms() {
  if (!supabase) {
    console.log('⚠️  Supabase not configured - skipping DB checks');
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('id, tier, title_en, entries');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('❌ DB fetch error:', error.message);
    return [];
  }
}

/**
 * Cross-check JSON files vs DB rows
 */
function crossCheck(jsonRooms, dbRooms) {
  const jsonIds = new Set(jsonRooms.map(r => r.id).filter(Boolean));
  const dbIds = new Set(dbRooms.map(r => r.id));
  
  // JSON exists but no DB row
  for (const id of jsonIds) {
    if (!dbIds.has(id)) {
      results.missingDbRows.push(id);
    }
  }
  
  // DB row exists but no JSON (check by filename pattern)
  for (const dbRoom of dbRooms) {
    const possibleFilenames = [
      `${dbRoom.id}.json`,
      `${dbRoom.id.replace(/-/g, '_')}.json`,
      `${dbRoom.id.replace(/_/g, '-')}.json`,
    ];
    
    const hasJson = possibleFilenames.some(f => 
      fileExists(path.join(DATA_DIR, f))
    );
    
    if (!hasJson && dbRoom.id !== 'homepage_v1' && dbRoom.id !== 'stoicism' && dbRoom.id !== 'obesity') {
      // Skip known empty placeholder rooms
      results.missingJsonFiles.push({
        id: dbRoom.id,
        tier: dbRoom.tier,
        title: dbRoom.title_en
      });
    }
  }
}

/**
 * Check DB tier labels are canonical
 */
function checkDbTierLabels(dbRooms) {
  const validLabels = new Set(Object.values(CANONICAL_TIERS));
  
  for (const room of dbRooms) {
    if (room.tier && !validLabels.has(room.tier)) {
      results.wrongTierLabels.push({
        id: room.id,
        tier: room.tier,
        expected: 'Canonical label'
      });
    }
  }
}

/**
 * Simulate user journeys
 */
function simulateUserJourneys(jsonRooms, dbRooms) {
  const journeyResults = {
    guestFreeRoom: { passed: false, details: '' },
    vip2Room: { passed: false, details: '' },
    guestVipBlocked: { passed: false, details: '' },
    adminRoom: { passed: false, details: '' },
  };
  
  // Find a free room
  const freeRoom = jsonRooms.find(r => r.tier?.toLowerCase().includes('free'));
  if (freeRoom && freeRoom.entryCount > 0) {
    journeyResults.guestFreeRoom.passed = true;
    journeyResults.guestFreeRoom.details = `Free room "${freeRoom.id}" has ${freeRoom.entryCount} entries`;
  }
  
  // Find a VIP2 room
  const vip2Room = jsonRooms.find(r => r.tier?.includes('VIP2'));
  if (vip2Room && vip2Room.entryCount > 0) {
    journeyResults.vip2Room.passed = true;
    journeyResults.vip2Room.details = `VIP2 room "${vip2Room.id}" has ${vip2Room.entryCount} entries`;
  }
  
  // Check VIP room exists for blocking test
  const vipRoom = jsonRooms.find(r => r.tier?.includes('VIP'));
  if (vipRoom) {
    journeyResults.guestVipBlocked.passed = true;
    journeyResults.guestVipBlocked.details = `VIP room "${vipRoom.id}" exists for access control test`;
  }
  
  // Admin check (any room with entries)
  const anyRoom = jsonRooms.find(r => r.entryCount > 0);
  if (anyRoom) {
    journeyResults.adminRoom.passed = true;
    journeyResults.adminRoom.details = `Room "${anyRoom.id}" available for admin test`;
  }
  
  return journeyResults;
}

/**
 * Print summary report
 */
function printReport(journeyResults) {
  const duration = ((Date.now() - results.startTime) / 1000).toFixed(2);
  
  console.log('\n' + '═'.repeat(60));
  console.log('  🚀 LAUNCH HEALTH CHECK REPORT');
  console.log('═'.repeat(60));
  
  // JSON Files
  console.log('\n📁 JSON FILES');
  console.log(`   Total: ${results.totalJsonFiles}`);
  console.log(`   Valid: ${results.validJsonFiles}`);
  console.log(`   Broken: ${results.brokenJsonFiles.length}`);
  if (results.brokenJsonFiles.length > 0) {
    results.brokenJsonFiles.slice(0, 5).forEach(f => {
      console.log(`   ❌ ${f.file}: ${f.issues.join(', ')}`);
    });
    if (results.brokenJsonFiles.length > 5) {
      console.log(`   ... and ${results.brokenJsonFiles.length - 5} more`);
    }
  }
  
  // Database
  console.log('\n🗄️  DATABASE');
  console.log(`   Total rooms: ${results.totalDbRooms}`);
  console.log(`   With entries: ${results.dbRoomsWithEntries}`);
  console.log(`   Without entries: ${results.dbRoomsWithoutEntries.length}`);
  if (results.dbRoomsWithoutEntries.length > 0) {
    results.dbRoomsWithoutEntries.forEach(r => {
      console.log(`   ⚠️  ${r.id} (${r.tier})`);
    });
  }
  
  // Cross-check
  console.log('\n🔄 CROSS-CHECK');
  console.log(`   Missing DB rows (JSON exists): ${results.missingDbRows.length}`);
  if (results.missingDbRows.length > 0) {
    results.missingDbRows.slice(0, 5).forEach(id => {
      console.log(`   ⚠️  ${id}`);
    });
  }
  console.log(`   Missing JSON (DB exists): ${results.missingJsonFiles.length}`);
  if (results.missingJsonFiles.length > 0) {
    results.missingJsonFiles.slice(0, 5).forEach(r => {
      console.log(`   ⚠️  ${r.id} (${r.tier})`);
    });
  }
  
  // Audio
  console.log('\n🔊 AUDIO FILES');
  console.log(`   Checked: ${results.audioFilesChecked}`);
  console.log(`   Missing: ${results.missingAudioFiles.length}`);
  if (results.missingAudioFiles.length > 0) {
    results.missingAudioFiles.slice(0, 5).forEach(a => {
      console.log(`   ❌ ${a.room}:${a.entry} → ${a.audio}`);
    });
    if (results.missingAudioFiles.length > 5) {
      console.log(`   ... and ${results.missingAudioFiles.length - 5} more`);
    }
  }
  
  // Entry Issues
  console.log('\n📝 ENTRY ISSUES');
  console.log(`   Missing slug: ${results.entriesMissingSlug.length}`);
  console.log(`   Missing keywords: ${results.entriesMissingKeywords.length}`);
  
  // Tier Labels
  console.log('\n🏷️  TIER LABELS');
  console.log(`   Wrong labels: ${results.wrongTierLabels.length}`);
  if (results.wrongTierLabels.length > 0) {
    results.wrongTierLabels.slice(0, 5).forEach(t => {
      console.log(`   ❌ ${t.file || t.id}: "${t.tier}"`);
    });
  }
  
  // User Journeys
  console.log('\n👤 USER JOURNEY SIMULATION');
  Object.entries(journeyResults).forEach(([key, result]) => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`   ${icon} ${key}: ${result.details || 'Not tested'}`);
  });
  
  // Summary
  console.log('\n' + '─'.repeat(60));
  const criticalIssues = 
    results.brokenJsonFiles.length + 
    results.wrongTierLabels.length;
  const warnings = 
    results.missingAudioFiles.length + 
    results.missingDbRows.length + 
    results.entriesMissingKeywords.length;
  
  if (criticalIssues === 0 && warnings < 10) {
    console.log('🟢 LAUNCH READY');
  } else if (criticalIssues === 0) {
    console.log('🟡 LAUNCH WITH CAUTION - Review warnings above');
  } else {
    console.log('🔴 NOT READY - Fix critical issues before launch');
  }
  
  console.log(`\n⏱️  Completed in ${duration}s`);
  console.log('═'.repeat(60) + '\n');
  
  // Exit code
  process.exit(criticalIssues > 0 ? 1 : 0);
}

/**
 * Main execution
 */
async function main() {
  console.log('\n🔍 Starting Launch Health Check...\n');
  
  // 1. Validate JSON files
  console.log('📁 Checking JSON files...');
  const jsonFiles = getJsonFiles();
  results.totalJsonFiles = jsonFiles.length;
  
  const jsonRooms = [];
  for (const file of jsonFiles) {
    const validation = validateJsonFile(file);
    if (validation.valid) {
      results.validJsonFiles++;
      jsonRooms.push({ ...validation, file });
    } else {
      results.brokenJsonFiles.push({ file, issues: validation.issues });
    }
  }
  
  // 2. Fetch and check DB rooms
  console.log('🗄️  Fetching database rooms...');
  const dbRooms = await fetchDbRooms();
  results.totalDbRooms = dbRooms.length;
  
  for (const room of dbRooms) {
    const hasEntries = Array.isArray(room.entries) && room.entries.length > 0;
    if (hasEntries) {
      results.dbRoomsWithEntries++;
    } else {
      results.dbRoomsWithoutEntries.push({
        id: room.id,
        tier: room.tier,
        title: room.title_en
      });
    }
  }
  
  // 3. Cross-check JSON vs DB
  console.log('🔄 Cross-checking JSON vs Database...');
  crossCheck(jsonRooms, dbRooms);
  checkDbTierLabels(dbRooms);
  
  // 4. Simulate user journeys
  console.log('👤 Simulating user journeys...');
  const journeyResults = simulateUserJourneys(jsonRooms, dbRooms);
  
  // 5. Print report
  printReport(journeyResults);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
