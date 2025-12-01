#!/usr/bin/env node

/**
 * Audio Health Check Script
 * 
 * Scans all room JSON files and checks if referenced audio files exist.
 * Reports missing files, unused files, and path format issues.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../public/data');
const AUDIO_DIR = path.join(__dirname, '../public/audio');

// Collect all available audio files
const getAllAudioFiles = (dir, fileList = [], baseDir = dir) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllAudioFiles(filePath, fileList, baseDir);
    } else if (file.endsWith('.mp3')) {
      // Store relative path from audio dir
      const relativePath = path.relative(baseDir, filePath).replace(/\\/g, '/');
      fileList.push(relativePath);
    }
  }
  
  return fileList;
};

// Normalize audio path for comparison
const normalizeAudioPath = (audioPath) => {
  if (!audioPath) return null;
  
  // Remove leading slashes, "public/", "audio/" prefixes
  let normalized = audioPath.replace(/^\/+/, '')
    .replace(/^public\//, '')
    .replace(/^audio\//, '')
    .trim();
    
  return normalized;
};

// Extract audio references from entry
const extractAudioFromEntry = (entry) => {
  const audioRefs = [];
  
  // Handle direct audio field
  if (entry.audio) {
    const audioValue = typeof entry.audio === 'object' 
      ? (entry.audio.en || entry.audio.vi || Object.values(entry.audio)[0])
      : entry.audio;
      
    // Handle space-separated playlists
    if (typeof audioValue === 'string') {
      const files = audioValue.trim().split(/\s+/);
      audioRefs.push(...files.filter(Boolean));
    }
  }
  
  // Handle legacy fields
  if (entry.audio_en) audioRefs.push(entry.audio_en);
  if (entry.audioEn) audioRefs.push(entry.audioEn);
  
  return audioRefs;
};

// Main check function
const checkAudioHealth = () => {
  console.log('🎧 Audio Health Check\n');
  console.log('=' .repeat(80));
  
  // Get all available audio files
  const availableAudio = new Set(getAllAudioFiles(AUDIO_DIR));
  console.log(`\n✅ Found ${availableAudio.size} audio files in public/audio/\n`);
  
  // Get all JSON files
  const jsonFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('.'));
  
  const referencedAudio = new Set();
  const missingAudio = new Map(); // room -> missing files
  const badPathAudio = new Map(); // room -> bad path entries
  let totalRooms = 0;
  let roomsWithAudio = 0;
  let totalAudioReferences = 0;
  
  // Scan all rooms
  for (const jsonFile of jsonFiles) {
    const filePath = path.join(DATA_DIR, jsonFile);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const room = JSON.parse(content);
      
      totalRooms++;
      
      if (!room.entries || !Array.isArray(room.entries)) {
        continue;
      }
      
      const roomMissing = [];
      const roomBadPaths = [];
      let hasAnyAudio = false;
      
      for (const entry of room.entries) {
        const audioRefs = extractAudioFromEntry(entry);
        
        if (audioRefs.length === 0) continue;
        
        hasAnyAudio = true;
        
        for (const audioRef of audioRefs) {
          totalAudioReferences++;
          
          // Check for bad path format
          if (audioRef.includes('/audio/') || audioRef.startsWith('/')) {
            roomBadPaths.push({
              entry: entry.slug || entry.id || 'unknown',
              audio: audioRef
            });
          }
          
          const normalized = normalizeAudioPath(audioRef);
          referencedAudio.add(normalized);
          
          // Check if file exists
          if (!availableAudio.has(normalized)) {
            roomMissing.push({
              entry: entry.slug || entry.id || 'unknown',
              audio: normalized
            });
          }
        }
      }
      
      if (hasAnyAudio) roomsWithAudio++;
      
      if (roomMissing.length > 0) {
        missingAudio.set(jsonFile, roomMissing);
      }
      
      if (roomBadPaths.length > 0) {
        badPathAudio.set(jsonFile, roomBadPaths);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${jsonFile}: ${error.message}`);
    }
  }
  
  // Calculate unused audio
  const unusedAudio = [...availableAudio].filter(a => !referencedAudio.has(a));
  
  // Report results
  console.log('📊 SUMMARY');
  console.log('=' .repeat(80));
  console.log(`Total rooms scanned: ${totalRooms}`);
  console.log(`Rooms with audio: ${roomsWithAudio}`);
  console.log(`Total audio references: ${totalAudioReferences}`);
  console.log(`Unique audio files referenced: ${referencedAudio.size}`);
  console.log(`Audio files found: ${availableAudio.size}`);
  console.log(`Missing audio files: ${Array.from(missingAudio.values()).flat().length}`);
  console.log(`Bad path formats: ${Array.from(badPathAudio.values()).flat().length}`);
  console.log(`Unused audio files: ${unusedAudio.length}\n`);
  
  // Report missing audio
  if (missingAudio.size > 0) {
    console.log('\n❌ MISSING AUDIO FILES');
    console.log('=' .repeat(80));
    
    for (const [room, missing] of missingAudio.entries()) {
      console.log(`\n📁 ${room}`);
      for (const item of missing) {
        console.log(`   - Entry: ${item.entry}`);
        console.log(`     Missing: ${item.audio}`);
      }
    }
  }
  
  // Report bad paths
  if (badPathAudio.size > 0) {
    console.log('\n⚠️  BAD PATH FORMATS (contains /audio/ or leading /)');
    console.log('=' .repeat(80));
    
    for (const [room, bad] of badPathAudio.entries()) {
      console.log(`\n📁 ${room}`);
      for (const item of bad) {
        console.log(`   - Entry: ${item.entry}`);
        console.log(`     Bad path: ${item.audio}`);
        console.log(`     Should be: ${normalizeAudioPath(item.audio)}`);
      }
    }
  }
  
  // Report unused audio (first 50)
  if (unusedAudio.length > 0) {
    console.log('\n💾 UNUSED AUDIO FILES (not referenced by any room)');
    console.log('=' .repeat(80));
    console.log(`Showing first 50 of ${unusedAudio.length} unused files:\n`);
    
    unusedAudio.slice(0, 50).forEach(file => {
      console.log(`   - ${file}`);
    });
    
    if (unusedAudio.length > 50) {
      console.log(`\n   ... and ${unusedAudio.length - 50} more`);
    }
  }
  
  console.log('\n' + '=' .repeat(80));
  
  // Exit code based on issues
  const hasIssues = missingAudio.size > 0 || badPathAudio.size > 0;
  if (hasIssues) {
    console.log('\n⚠️  Audio health check found issues. Please review and fix.');
    process.exit(1);
  } else {
    console.log('\n✅ Audio health check passed! All audio files exist and paths are correct.');
    process.exit(0);
  }
};

// Run check
checkAudioHealth();
