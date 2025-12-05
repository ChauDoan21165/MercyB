/**
 * Orphan Audio Cleanup Script v3.0
 * 
 * Full expanded version with:
 * - Levenshtein-based matching for auto-fix
 * - High-confidence orphan resolution
 * - Move to _orphans/ folder instead of delete
 * - Comprehensive reporting
 * 
 * Run: npx tsx scripts/cleanup-orphans.ts [--dry-run] [--delete] [--backup] [--auto-fix]
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data';
const AUDIO_DIR = 'public/audio';
const BACKUP_DIR = 'public/audio-orphans-backup';
const ORPHANS_DIR = 'public/audio/_orphans';
const MANIFEST_PATH = 'public/audio/manifest.json';

interface OrphanReport {
  filename: string;
  fullPath: string;
  sizeKB: number;
  reason: string;
  potentialMatch?: {
    roomId: string;
    entrySlug: string;
    confidence: number;
    suggestedName: string;
  };
}

interface RoomEntry {
  roomId: string;
  slug: string;
}

// Levenshtein distance
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

function similarityScore(a: string, b: string): number {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshteinDistance(a, b) / maxLen;
}

function extractLang(filename: string): 'en' | 'vi' | null {
  if (/_en\.mp3$/i.test(filename) || /-en\.mp3$/i.test(filename)) return 'en';
  if (/_vi\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

function generateCanonical(roomId: string, slug: string, lang: 'en' | 'vi'): string {
  const cleanRoom = roomId.toLowerCase().replace(/[_\s]/g, '-');
  const cleanSlug = slug.toLowerCase().replace(/[_\s]/g, '-');
  return `${cleanRoom}-${cleanSlug}-${lang}.mp3`;
}

// Collect all audio references and entry slugs from JSON files
function collectRoomEntries(): { references: Set<string>; entries: RoomEntry[] } {
  const references = new Set<string>();
  const entries: RoomEntry[] = [];
  
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    return { references, entries };
  }
  
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  
  for (const file of jsonFiles) {
    try {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      const room = JSON.parse(content);
      
      if (room.entries && Array.isArray(room.entries)) {
        for (const entry of room.entries) {
          const slug = entry.slug || entry.artifact_id || entry.id;
          if (slug) {
            entries.push({ roomId: room.id, slug: String(slug) });
          }
          
          if (!entry.audio) continue;
          
          if (typeof entry.audio === 'string') {
            references.add(entry.audio.toLowerCase());
          } else {
            if (entry.audio.en) references.add(entry.audio.en.toLowerCase());
            if (entry.audio.vi) references.add(entry.audio.vi.toLowerCase());
          }
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not parse ${file}`);
    }
  }
  
  return { references, entries };
}

// Get all audio files from storage
function getAudioFiles(): Map<string, { fullPath: string; sizeKB: number }> {
  const files = new Map<string, { fullPath: string; sizeKB: number }>();
  
  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        scan(fullPath);
      } else if (entry.name.toLowerCase().endsWith('.mp3')) {
        const stats = fs.statSync(fullPath);
        files.set(entry.name.toLowerCase(), {
          fullPath,
          sizeKB: Math.round(stats.size / 1024)
        });
      }
    }
  }
  
  scan(AUDIO_DIR);
  return files;
}

// Find potential match using Levenshtein
function findPotentialMatch(
  filename: string,
  entries: RoomEntry[]
): OrphanReport['potentialMatch'] | undefined {
  const lang = extractLang(filename);
  if (!lang) return undefined;
  
  let bestMatch: OrphanReport['potentialMatch'] | undefined;
  
  for (const entry of entries) {
    const canonical = generateCanonical(entry.roomId, entry.slug, lang);
    const score = similarityScore(filename.toLowerCase(), canonical);
    
    if (score > 0.85 && (!bestMatch || score > bestMatch.confidence)) {
      bestMatch = {
        roomId: entry.roomId,
        entrySlug: entry.slug,
        confidence: score,
        suggestedName: canonical
      };
    }
  }
  
  return bestMatch;
}

// Detect orphan files
function detectOrphans(
  audioFiles: Map<string, { fullPath: string; sizeKB: number }>,
  references: Set<string>,
  entries: RoomEntry[]
): OrphanReport[] {
  const orphans: OrphanReport[] = [];
  
  for (const [filename, info] of audioFiles) {
    const basename = path.basename(filename).toLowerCase();
    
    if (!references.has(filename) && !references.has(basename)) {
      const potentialMatch = findPotentialMatch(filename, entries);
      
      orphans.push({
        filename,
        fullPath: info.fullPath,
        sizeKB: info.sizeKB,
        reason: 'Not referenced in any room JSON',
        potentialMatch
      });
    }
  }
  
  return orphans;
}

// Backup orphan files before deletion
function backupOrphans(orphans: OrphanReport[]): number {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  let backed = 0;
  for (const orphan of orphans) {
    try {
      const dest = path.join(BACKUP_DIR, path.basename(orphan.fullPath));
      fs.copyFileSync(orphan.fullPath, dest);
      backed++;
    } catch (error) {
      console.warn(`Could not backup: ${orphan.filename}`);
    }
  }
  
  return backed;
}

// Move orphans to _orphans folder
function moveOrphans(orphans: OrphanReport[]): number {
  if (!fs.existsSync(ORPHANS_DIR)) {
    fs.mkdirSync(ORPHANS_DIR, { recursive: true });
  }
  
  let moved = 0;
  for (const orphan of orphans) {
    // Skip high-confidence matches (they should be renamed, not moved)
    if (orphan.potentialMatch && orphan.potentialMatch.confidence > 0.85) {
      continue;
    }
    
    try {
      const dest = path.join(ORPHANS_DIR, path.basename(orphan.fullPath));
      fs.renameSync(orphan.fullPath, dest);
      moved++;
    } catch (error) {
      console.warn(`Could not move: ${orphan.filename}`);
    }
  }
  return moved;
}

// Auto-fix high-confidence matches by renaming
function autoFixMatches(orphans: OrphanReport[]): number {
  let fixed = 0;
  
  for (const orphan of orphans) {
    if (orphan.potentialMatch && orphan.potentialMatch.confidence > 0.85) {
      try {
        const newPath = path.join(path.dirname(orphan.fullPath), orphan.potentialMatch.suggestedName);
        fs.renameSync(orphan.fullPath, newPath);
        console.log(`  ✅ Renamed: ${orphan.filename} → ${orphan.potentialMatch.suggestedName}`);
        fixed++;
      } catch (error) {
        console.warn(`Could not rename: ${orphan.filename}`);
      }
    }
  }
  
  return fixed;
}

// Delete orphan files
function deleteOrphans(orphans: OrphanReport[]): number {
  let deleted = 0;
  for (const orphan of orphans) {
    try {
      fs.unlinkSync(orphan.fullPath);
      deleted++;
    } catch (error) {
      console.warn(`Could not delete: ${orphan.filename}`);
    }
  }
  return deleted;
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const shouldDelete = args.includes('--delete');
  const shouldBackup = args.includes('--backup');
  const shouldAutoFix = args.includes('--auto-fix');
  
  console.log('='.repeat(60));
  console.log('Orphan Audio Cleanup v3.0');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : shouldDelete ? 'DELETE' : 'DETECT + MOVE'}`);
  console.log(`Backup: ${shouldBackup ? 'YES' : 'NO'}`);
  console.log(`Auto-fix matches: ${shouldAutoFix ? 'YES' : 'NO'}\n`);
  
  // Collect references and entries
  console.log('Scanning JSON files for audio references...');
  const { references, entries } = collectRoomEntries();
  console.log(`Found ${references.size} unique audio references`);
  console.log(`Found ${entries.length} room entries for matching\n`);
  
  // Get audio files
  console.log('Scanning audio directory...');
  const audioFiles = getAudioFiles();
  console.log(`Found ${audioFiles.size} audio files\n`);
  
  // Detect orphans
  console.log('Detecting orphans with potential matches...');
  const orphans = detectOrphans(audioFiles, references, entries);
  
  // Separate high-confidence matches
  const highConfidenceMatches = orphans.filter(o => o.potentialMatch && o.potentialMatch.confidence > 0.85);
  const trueOrphans = orphans.filter(o => !o.potentialMatch || o.potentialMatch.confidence <= 0.85);
  
  // Calculate total size
  const totalSizeKB = orphans.reduce((sum, o) => sum + o.sizeKB, 0);
  const totalSizeMB = (totalSizeKB / 1024).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('ORPHAN DETECTION RESULTS');
  console.log('='.repeat(60));
  console.log(`Total orphan files: ${orphans.length}`);
  console.log(`  - High confidence matches: ${highConfidenceMatches.length} (auto-fixable)`);
  console.log(`  - True orphans: ${trueOrphans.length}`);
  console.log(`Total size: ${totalSizeMB} MB (${totalSizeKB} KB)`);
  
  // Show high-confidence matches
  if (highConfidenceMatches.length > 0) {
    console.log('\nHigh-confidence matches (>85%):');
    highConfidenceMatches.slice(0, 10).forEach(o => {
      console.log(`  - ${o.filename} → ${o.potentialMatch!.suggestedName} (${Math.round(o.potentialMatch!.confidence * 100)}%)`);
    });
    if (highConfidenceMatches.length > 10) {
      console.log(`  ... and ${highConfidenceMatches.length - 10} more`);
    }
  }
  
  // Show true orphans
  if (trueOrphans.length > 0) {
    console.log('\nTrue orphan files (no match found):');
    trueOrphans.slice(0, 20).forEach(o => {
      console.log(`  - ${o.filename} (${o.sizeKB} KB)`);
    });
    
    if (trueOrphans.length > 20) {
      console.log(`  ... and ${trueOrphans.length - 20} more`);
    }
  }
  
  if (!dryRun) {
    // Auto-fix high-confidence matches
    if (shouldAutoFix && highConfidenceMatches.length > 0) {
      console.log('\nAuto-fixing high-confidence matches...');
      const fixed = autoFixMatches(orphans);
      console.log(`Auto-fixed ${fixed} files`);
    }
    
    // Backup if requested
    if (shouldBackup && trueOrphans.length > 0) {
      console.log('\nBacking up orphan files...');
      const backed = backupOrphans(trueOrphans);
      console.log(`Backed up ${backed} files to ${BACKUP_DIR}`);
    }
    
    // Move or delete
    if (shouldDelete && trueOrphans.length > 0) {
      console.log('\nDeleting orphan files...');
      const deleted = deleteOrphans(trueOrphans);
      console.log(`Deleted ${deleted} files`);
    } else if (trueOrphans.length > 0) {
      console.log('\nMoving orphan files to _orphans/...');
      const moved = moveOrphans(trueOrphans);
      console.log(`Moved ${moved} files to ${ORPHANS_DIR}`);
    }
  }
  
  if (orphans.length === 0) {
    console.log('\n✅ No orphan files detected!');
  }
  
  // Write report
  const reportPath = 'public/orphan-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalOrphans: orphans.length,
    highConfidenceMatches: highConfidenceMatches.length,
    trueOrphans: trueOrphans.length,
    totalSizeKB,
    orphans: orphans.map(o => ({
      filename: o.filename,
      sizeKB: o.sizeKB,
      reason: o.reason,
      potentialMatch: o.potentialMatch
    }))
  }, null, 2));
  
  console.log(`\nReport saved to: ${reportPath}`);
  
  if (!shouldAutoFix && highConfidenceMatches.length > 0) {
    console.log('\nTip: Run with --auto-fix to automatically rename high-confidence matches');
  }
  if (!shouldDelete && trueOrphans.length > 0 && !dryRun) {
    console.log('Tip: Run with --delete to permanently delete orphans');
  }
}

main();
