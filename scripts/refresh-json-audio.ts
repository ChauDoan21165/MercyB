/**
 * JSON Room Audio Refresher v3.0
 * 
 * Full expanded version with:
 * - Complete filename validation
 * - Canonical filename regeneration
 * - EN/VI reversal detection
 * - Missing reference creation
 * - Comprehensive reporting
 * 
 * Run: npx tsx scripts/refresh-json-audio.ts [--dry-run] [--verbose]
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data';
const AUDIO_DIR = 'public/audio';

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

// Naming validation (strict)
function isValidFilename(filename: string): boolean {
  if (!filename) return true;
  
  // Must be lowercase
  if (filename !== filename.toLowerCase()) return false;
  
  // No underscores
  if (filename.includes('_')) return false;
  
  // No spaces
  if (filename.includes(' ')) return false;
  
  // Must end with -en.mp3 or -vi.mp3
  if (!/-en\.mp3$/i.test(filename) && !/-vi\.mp3$/i.test(filename)) return false;
  
  return true;
}

// Check if filename starts with roomId (CRITICAL RULE)
function startsWithRoomId(filename: string, roomId: string): boolean {
  const normalizedRoomId = roomId.toLowerCase().replace(/[_\s]/g, '-');
  return filename.toLowerCase().startsWith(normalizedRoomId + '-');
}

// Generate canonical filename
function generateCanonical(roomId: string, entrySlug: string | number, lang: 'en' | 'vi'): string {
  const cleanRoom = roomId.toLowerCase().replace(/[_\s]/g, '-');
  const cleanSlug = typeof entrySlug === 'number' 
    ? `entry-${entrySlug}` 
    : String(entrySlug).toLowerCase().replace(/[_\s]/g, '-');
  
  return `${cleanRoom}-${cleanSlug}-${lang}.mp3`;
}

// Extract language from filename
function extractLang(filename: string): 'en' | 'vi' | null {
  if (/_en\.mp3$/i.test(filename) || /-en\.mp3$/i.test(filename)) return 'en';
  if (/_vi\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

// Detect reversed EN/VI
function detectReversedAudio(audio: AudioRef): boolean {
  if (!audio.en || !audio.vi) return false;
  
  const enLang = extractLang(audio.en);
  const viLang = extractLang(audio.vi);
  
  return enLang === 'vi' && viLang === 'en';
}

// Get all audio files for quick lookup
function getAudioFiles(): Set<string> {
  const files = new Set<string>();
  
  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        scan(path.join(dir, entry.name));
      } else if (entry.name.toLowerCase().endsWith('.mp3')) {
        files.add(entry.name.toLowerCase());
      }
    }
  }
  
  scan(AUDIO_DIR);
  return files;
}

// Process a single room file
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
      
      // Case 1: No audio at all - create canonical reference
      if (!entry.audio) {
        const canonicalEn = generateCanonical(room.id, entrySlug, 'en');
        const canonicalVi = generateCanonical(room.id, entrySlug, 'vi');
        
        fixes.push({
          roomId: room.id,
          entryIndex: index,
          field: 'audio',
          oldValue: '',
          newValue: JSON.stringify({ en: canonicalEn, vi: canonicalVi }),
          reason: 'Missing audio reference - creating canonical pair',
          fixType: 'create'
        });
        
        if (!dryRun) {
          entry.audio = { en: canonicalEn, vi: canonicalVi };
          modified = true;
        }
        return;
      }
      
      // Case 2: String format - convert to object and validate
      if (typeof entry.audio === 'string') {
        const lang = extractLang(entry.audio);
        if (lang) {
          // Check validity and roomId prefix
          if (!isValidFilename(entry.audio) || !startsWithRoomId(entry.audio, room.id)) {
            const canonical = generateCanonical(room.id, entrySlug, lang);
            fixes.push({
              roomId: room.id,
              entryIndex: index,
              field: 'audio',
              oldValue: entry.audio,
              newValue: canonical,
              reason: !startsWithRoomId(entry.audio, room.id) 
                ? 'Missing roomId prefix' 
                : 'Invalid filename format',
              fixType: 'rename'
            });
            
            if (!dryRun) {
              entry.audio = canonical;
              modified = true;
            }
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
        if (!isValidFilename(audioObj.en) || !startsWithRoomId(audioObj.en, room.id)) {
          const canonical = generateCanonical(room.id, entrySlug, 'en');
          fixes.push({
            roomId: room.id,
            entryIndex: index,
            field: 'audio.en',
            oldValue: audioObj.en,
            newValue: canonical,
            reason: !startsWithRoomId(audioObj.en, room.id)
              ? 'EN: Missing roomId prefix'
              : 'EN: Invalid filename format',
            fixType: 'rename'
          });
          
          if (!dryRun) {
            audioObj.en = canonical;
            modified = true;
          }
        }
      } else {
        // Missing EN - create
        const canonical = generateCanonical(room.id, entrySlug, 'en');
        fixes.push({
          roomId: room.id,
          entryIndex: index,
          field: 'audio.en',
          oldValue: '',
          newValue: canonical,
          reason: 'Missing EN audio reference',
          fixType: 'create'
        });
        
        if (!dryRun) {
          audioObj.en = canonical;
          modified = true;
        }
      }
      
      // Validate VI
      if (audioObj.vi) {
        if (!isValidFilename(audioObj.vi) || !startsWithRoomId(audioObj.vi, room.id)) {
          const canonical = generateCanonical(room.id, entrySlug, 'vi');
          fixes.push({
            roomId: room.id,
            entryIndex: index,
            field: 'audio.vi',
            oldValue: audioObj.vi,
            newValue: canonical,
            reason: !startsWithRoomId(audioObj.vi, room.id)
              ? 'VI: Missing roomId prefix'
              : 'VI: Invalid filename format',
            fixType: 'rename'
          });
          
          if (!dryRun) {
            audioObj.vi = canonical;
            modified = true;
          }
        }
      } else {
        // Missing VI - create
        const canonical = generateCanonical(room.id, entrySlug, 'vi');
        fixes.push({
          roomId: room.id,
          entryIndex: index,
          field: 'audio.vi',
          oldValue: '',
          newValue: canonical,
          reason: 'Missing VI audio reference',
          fixType: 'create'
        });
        
        if (!dryRun) {
          audioObj.vi = canonical;
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

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');
  
  console.log('='.repeat(60));
  console.log('JSON Room Audio Refresher v3.0');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE (will modify files)'}`);
  console.log('='.repeat(60));
  
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    process.exit(1);
  }
  
  const jsonFiles = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => path.join(DATA_DIR, f));
  
  console.log(`Found ${jsonFiles.length} JSON files to process\n`);
  
  const allFixes: FixReport[] = [];
  
  for (const file of jsonFiles) {
    const fixes = processRoom(file, dryRun, verbose);
    allFixes.push(...fixes);
  }
  
  // Summary by fix type
  const byType = allFixes.reduce((acc, fix) => {
    acc[fix.fixType] = (acc[fix.fixType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files processed: ${jsonFiles.length}`);
  console.log(`Total fixes ${dryRun ? 'needed' : 'applied'}: ${allFixes.length}`);
  
  if (Object.keys(byType).length > 0) {
    console.log('\nFixes by type:');
    Object.entries(byType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count}`);
    });
  }
  
  if (allFixes.length > 0) {
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
  
  // Write report
  const reportPath = 'public/audio-refresh-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    mode: dryRun ? 'dry-run' : 'live',
    totalFiles: jsonFiles.length,
    totalFixes: allFixes.length,
    byType,
    fixes: allFixes
  }, null, 2));
  
  console.log(`\nReport saved to: ${reportPath}`);
}

main();
