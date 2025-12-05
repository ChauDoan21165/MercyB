/**
 * JSON Room Audio Refresher v4.0
 * Chief Automation Engineer: Full GCE Integration
 * 
 * Uses Global Consistency Engine for all decisions.
 * 
 * Features:
 * - GCE-based validation and canonical naming
 * - EN/VI reversal detection and auto-fix
 * - Non-canonical reference correction
 * - Room filtering support
 * - Comprehensive reporting
 * 
 * Run: npx tsx scripts/refresh-json-audio.ts [--dry-run] [--apply] [--verbose] [--rooms <pattern>]
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data';
const AUDIO_DIR = 'public/audio';

// ============================================
// GCE Functions (inline to avoid import issues)
// ============================================

const MIN_CONFIDENCE_FOR_AUTO_FIX = 0.85;

function normalizeRoomId(roomId: string): string {
  return roomId
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeEntrySlug(slug: string | number): string {
  if (typeof slug === 'number') {
    return `entry-${slug}`;
  }
  return String(slug)
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getCanonicalAudioForRoom(roomId: string, entrySlug: string | number): { en: string; vi: string } {
  const normalizedRoomId = normalizeRoomId(roomId);
  const normalizedSlug = normalizeEntrySlug(entrySlug);
  return {
    en: `${normalizedRoomId}-${normalizedSlug}-en.mp3`,
    vi: `${normalizedRoomId}-${normalizedSlug}-vi.mp3`,
  };
}

function extractLanguage(filename: string): 'en' | 'vi' | null {
  if (/-en\.mp3$/i.test(filename) || /_en\.mp3$/i.test(filename)) return 'en';
  if (/-vi\.mp3$/i.test(filename) || /_vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

function isValidFilename(filename: string): boolean {
  if (!filename) return true;
  if (filename !== filename.toLowerCase()) return false;
  if (filename.includes('_')) return false;
  if (filename.includes(' ')) return false;
  if (!/-en\.mp3$/i.test(filename) && !/-vi\.mp3$/i.test(filename)) return false;
  return true;
}

function startsWithRoomId(filename: string, roomId: string): boolean {
  const normalizedRoomId = normalizeRoomId(roomId);
  return filename.toLowerCase().startsWith(normalizedRoomId + '-');
}

// ============================================
// Types
// ============================================

interface AudioRef {
  en?: string;
  vi?: string;
}

interface Entry {
  audio?: AudioRef | string;
  slug?: string;
  id?: string | number;
  artifact_id?: string;
}

interface RoomData {
  id: string;
  entries?: Entry[];
  [key: string]: unknown;
}

interface FixReport {
  roomId: string;
  entryIndex: number;
  field: string;
  oldValue: string;
  newValue: string;
  reason: string;
  fixType: 'rename' | 'create' | 'swap' | 'normalize';
}

// ============================================
// Processing Functions
// ============================================

function detectReversedAudio(audio: AudioRef): boolean {
  if (!audio.en || !audio.vi) return false;
  const enLang = extractLanguage(audio.en);
  const viLang = extractLanguage(audio.vi);
  return enLang === 'vi' && viLang === 'en';
}

function processRoom(filePath: string, dryRun: boolean, verbose: boolean): FixReport[] {
  const fixes: FixReport[] = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const room: RoomData = JSON.parse(content);
    
    if (!room.entries || !Array.isArray(room.entries)) {
      return fixes;
    }
    
    let modified = false;
    
    room.entries.forEach((entry, index) => {
      const entrySlug = entry.slug || entry.artifact_id || entry.id || index;
      const canonical = getCanonicalAudioForRoom(room.id, entrySlug);
      
      // Case 1: No audio at all - create canonical reference
      if (!entry.audio) {
        fixes.push({
          roomId: room.id,
          entryIndex: index,
          field: 'audio',
          oldValue: '',
          newValue: JSON.stringify({ en: canonical.en, vi: canonical.vi }),
          reason: 'Missing audio reference - creating canonical pair',
          fixType: 'create'
        });
        
        if (!dryRun) {
          entry.audio = { en: canonical.en, vi: canonical.vi };
          modified = true;
        }
        return;
      }
      
      // Case 2: String format - convert to object
      if (typeof entry.audio === 'string') {
        const lang = extractLanguage(entry.audio);
        if (lang) {
          const newAudio = { en: canonical.en, vi: canonical.vi };
          fixes.push({
            roomId: room.id,
            entryIndex: index,
            field: 'audio',
            oldValue: entry.audio,
            newValue: JSON.stringify(newAudio),
            reason: 'Converting string to canonical object format',
            fixType: 'normalize'
          });
          
          if (!dryRun) {
            entry.audio = newAudio;
            modified = true;
          }
        }
        return;
      }
      
      // Case 3: Object format { en: ..., vi: ... }
      const audioObj = entry.audio as AudioRef;
      
      // Check for reversed EN/VI
      if (detectReversedAudio(audioObj)) {
        fixes.push({
          roomId: room.id,
          entryIndex: index,
          field: 'audio.en+vi',
          oldValue: `en:${audioObj.en} vi:${audioObj.vi}`,
          newValue: `en:${audioObj.vi} vi:${audioObj.en}`,
          reason: 'EN/VI audio references are reversed',
          fixType: 'swap'
        });
        
        if (!dryRun) {
          const temp = audioObj.en;
          audioObj.en = audioObj.vi;
          audioObj.vi = temp;
          modified = true;
        }
      }
      
      // Validate EN
      if (audioObj.en) {
        if (!isValidFilename(audioObj.en) || !startsWithRoomId(audioObj.en, room.id) || audioObj.en.toLowerCase() !== canonical.en) {
          fixes.push({
            roomId: room.id,
            entryIndex: index,
            field: 'audio.en',
            oldValue: audioObj.en,
            newValue: canonical.en,
            reason: !startsWithRoomId(audioObj.en, room.id)
              ? 'EN: Missing roomId prefix'
              : audioObj.en.toLowerCase() !== canonical.en
              ? 'EN: Non-canonical filename'
              : 'EN: Invalid filename format',
            fixType: 'rename'
          });
          
          if (!dryRun) {
            audioObj.en = canonical.en;
            modified = true;
          }
        }
      } else {
        fixes.push({
          roomId: room.id,
          entryIndex: index,
          field: 'audio.en',
          oldValue: '',
          newValue: canonical.en,
          reason: 'Missing EN audio reference',
          fixType: 'create'
        });
        
        if (!dryRun) {
          audioObj.en = canonical.en;
          modified = true;
        }
      }
      
      // Validate VI
      if (audioObj.vi) {
        if (!isValidFilename(audioObj.vi) || !startsWithRoomId(audioObj.vi, room.id) || audioObj.vi.toLowerCase() !== canonical.vi) {
          fixes.push({
            roomId: room.id,
            entryIndex: index,
            field: 'audio.vi',
            oldValue: audioObj.vi,
            newValue: canonical.vi,
            reason: !startsWithRoomId(audioObj.vi, room.id)
              ? 'VI: Missing roomId prefix'
              : audioObj.vi.toLowerCase() !== canonical.vi
              ? 'VI: Non-canonical filename'
              : 'VI: Invalid filename format',
            fixType: 'rename'
          });
          
          if (!dryRun) {
            audioObj.vi = canonical.vi;
            modified = true;
          }
        }
      } else {
        fixes.push({
          roomId: room.id,
          entryIndex: index,
          field: 'audio.vi',
          oldValue: '',
          newValue: canonical.vi,
          reason: 'Missing VI audio reference',
          fixType: 'create'
        });
        
        if (!dryRun) {
          audioObj.vi = canonical.vi;
          modified = true;
        }
      }
    });
    
    if (modified && !dryRun) {
      fs.writeFileSync(filePath, JSON.stringify(room, null, 2));
      if (verbose) {
        console.log(`✅ Updated: ${filePath}`);
      }
    }
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
  
  return fixes;
}

// ============================================
// Main Execution
// ============================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const applyMode = args.includes('--apply');
  const verbose = args.includes('--verbose');
  
  // Extract room filter
  const roomsIndex = args.indexOf('--rooms');
  const roomFilter = roomsIndex !== -1 && args[roomsIndex + 1] ? args[roomsIndex + 1] : null;
  
  // If neither --dry-run nor --apply specified, default to dry-run
  const actualDryRun = applyMode ? false : (dryRun || !applyMode);
  
  console.log('='.repeat(60));
  console.log('JSON Room Audio Refresher v4.0 (GCE Integration)');
  console.log(`Mode: ${actualDryRun ? 'DRY RUN (no changes)' : 'APPLY (will modify files)'}`);
  if (roomFilter) {
    console.log(`Room filter: ${roomFilter}`);
  }
  console.log('='.repeat(60));
  
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }
  
  let jsonFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(DATA_DIR, f));
  
  // Apply room filter if specified
  if (roomFilter) {
    const filterRegex = new RegExp(roomFilter, 'i');
    jsonFiles = jsonFiles.filter(f => filterRegex.test(path.basename(f)));
    console.log(`Filtered to ${jsonFiles.length} files matching "${roomFilter}"\n`);
  } else {
    console.log(`Found ${jsonFiles.length} JSON files to process\n`);
  }
  
  const allFixes: FixReport[] = [];
  const roomsChanged = new Set<string>();
  
  for (const file of jsonFiles) {
    const fixes = processRoom(file, actualDryRun, verbose);
    if (fixes.length > 0) {
      roomsChanged.add(fixes[0].roomId);
    }
    allFixes.push(...fixes);
  }
  
  // Summary by fix type
  const byType = allFixes.reduce((acc, fix) => {
    acc[fix.fixType] = (acc[fix.fixType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Count reversals
  const reversals = allFixes.filter(f => f.fixType === 'swap').length;
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Rooms scanned: ${jsonFiles.length}`);
  console.log(`Rooms changed: ${roomsChanged.size}`);
  console.log(`JSON refs updated: ${allFixes.length}`);
  console.log(`Reversed-lang fixes: ${reversals}`);
  
  if (Object.keys(byType).length > 0) {
    console.log('\nFixes by type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }
  
  if (allFixes.length > 0 && verbose) {
    console.log('\nFixes by room:');
    const byRoom = allFixes.reduce((acc, fix) => {
      acc[fix.roomId] = (acc[fix.roomId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(byRoom)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .forEach(([room, count]) => {
        console.log(`  ${room}: ${count} fixes`);
      });
    
    if (Object.keys(byRoom).length > 20) {
      console.log(`  ... and ${Object.keys(byRoom).length - 20} more rooms`);
    }
  }
  
  // Final output for CI parsing
  console.log(`\nTotal fixes needed: ${allFixes.length}`);
  console.log(`Total fixes applied: ${actualDryRun ? 0 : allFixes.length}`);
  
  // Write report
  const reportPath = 'public/audio-refresh-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    mode: actualDryRun ? 'dry-run' : 'apply',
    roomsScanned: jsonFiles.length,
    roomsChanged: roomsChanged.size,
    totalFixes: allFixes.length,
    reversals,
    byType,
    fixes: allFixes
  }, null, 2));
  
  console.log(`\nReport saved to: ${reportPath}`);
}

main();
