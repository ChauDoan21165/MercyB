/**
 * JSON Room Audio Refresher
 * 
 * Iterates through all public/data/*.json rooms
 * Detects incorrect audio references
 * Auto-fixes by generating canonical filenames
 * Updates references in place
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
}

// Naming validation
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
      if (!entry.audio) return;
      
      const entrySlug = entry.slug || entry.artifact_id || entry.id || index;
      
      if (typeof entry.audio === 'string') {
        if (!isValidFilename(entry.audio)) {
          const lang = extractLang(entry.audio);
          if (lang) {
            const canonical = generateCanonical(room.id, entrySlug, lang);
            fixes.push({
              roomId: room.id,
              entryIndex: index,
              field: 'audio',
              oldValue: entry.audio,
              newValue: canonical,
              reason: 'Invalid filename format'
            });
            
            if (!dryRun) {
              entry.audio = canonical;
              modified = true;
            }
          }
        }
      } else {
        // Object format { en: ..., vi: ... }
        if (entry.audio.en && !isValidFilename(entry.audio.en)) {
          const canonical = generateCanonical(room.id, entrySlug, 'en');
          fixes.push({
            roomId: room.id,
            entryIndex: index,
            field: 'audio.en',
            oldValue: entry.audio.en,
            newValue: canonical,
            reason: 'Invalid EN filename format'
          });
          
          if (!dryRun) {
            entry.audio.en = canonical;
            modified = true;
          }
        }
        
        if (entry.audio.vi && !isValidFilename(entry.audio.vi)) {
          const canonical = generateCanonical(room.id, entrySlug, 'vi');
          fixes.push({
            roomId: room.id,
            entryIndex: index,
            field: 'audio.vi',
            oldValue: entry.audio.vi,
            newValue: canonical,
            reason: 'Invalid VI filename format'
          });
          
          if (!dryRun) {
            entry.audio.vi = canonical;
            modified = true;
          }
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
  console.log('JSON Room Audio Refresher');
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
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files processed: ${jsonFiles.length}`);
  console.log(`Total fixes ${dryRun ? 'needed' : 'applied'}: ${allFixes.length}`);
  
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
    fixes: allFixes
  }, null, 2));
  
  console.log(`\nReport saved to: ${reportPath}`);
}

main();
