/**
 * Orphan Audio Cleanup Script v4.0
 * Chief Automation Engineer: Full GCE + Semantic Matcher Integration
 * 
 * Uses Integrity Map + GCE to derive orphans.
 * Uses Semantic Matcher for high-confidence auto-attachment.
 * 
 * Features:
 * - GCE-based orphan detection
 * - Levenshtein matching for auto-fix
 * - Safe vs dangerous categorization
 * - Backup before delete
 * - Comprehensive reporting
 * 
 * Run: npx tsx scripts/cleanup-orphans.ts [--dry-run] [--auto-fix] [--delete-orphans]
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data';
const AUDIO_DIR = 'public/audio';
const BACKUP_DIR = 'public/audio-orphans-backup';
const ORPHANS_DIR = 'public/audio/_orphans';
const MANIFEST_PATH = 'public/audio/manifest.json';

// ============================================
// GCE + Matcher Functions (inline)
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

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
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

// ============================================
// Types
// ============================================

interface OrphanReport {
  filename: string;
  fullPath: string;
  sizeKB: number;
  reason: string;
  category: 'attachable' | 'dangerous';
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

// ============================================
// Data Collection
// ============================================

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

// ============================================
// Orphan Detection with GCE
// ============================================

function findPotentialMatch(
  filename: string,
  entries: RoomEntry[]
): OrphanReport['potentialMatch'] | undefined {
  const lang = extractLanguage(filename);
  if (!lang) return undefined;
  
  let bestMatch: OrphanReport['potentialMatch'] | undefined;
  
  for (const entry of entries) {
    const canonical = getCanonicalAudioForRoom(entry.roomId, entry.slug);
    const score = similarityScore(filename.toLowerCase(), canonical[lang]);
    
    if (score > 0.7 && (!bestMatch || score > bestMatch.confidence)) {
      bestMatch = {
        roomId: entry.roomId,
        entrySlug: entry.slug,
        confidence: score,
        suggestedName: canonical[lang]
      };
    }
  }
  
  return bestMatch;
}

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
      
      // Categorize: attachable if high confidence, dangerous otherwise
      const category = potentialMatch && potentialMatch.confidence >= MIN_CONFIDENCE_FOR_AUTO_FIX
        ? 'attachable'
        : 'dangerous';
      
      orphans.push({
        filename,
        fullPath: info.fullPath,
        sizeKB: info.sizeKB,
        reason: 'Not referenced in any room JSON',
        category,
        potentialMatch
      });
    }
  }
  
  return orphans;
}

// ============================================
// Actions
// ============================================

function backupOrphans(orphans: OrphanReport[]): number {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  let backed = 0;
  const timestamp = new Date().toISOString().split('T')[0];
  
  for (const orphan of orphans) {
    try {
      const dest = path.join(BACKUP_DIR, `${timestamp}_${path.basename(orphan.fullPath)}`);
      fs.copyFileSync(orphan.fullPath, dest);
      backed++;
    } catch (error) {
      console.warn(`Could not backup: ${orphan.filename}`);
    }
  }
  
  return backed;
}

function autoFixAttachable(orphans: OrphanReport[], dryRun: boolean): number {
  let fixed = 0;
  const attachable = orphans.filter(o => o.category === 'attachable' && o.potentialMatch);
  
  for (const orphan of attachable) {
    if (!orphan.potentialMatch) continue;
    
    if (!dryRun) {
      try {
        const newPath = path.join(path.dirname(orphan.fullPath), orphan.potentialMatch.suggestedName);
        fs.renameSync(orphan.fullPath, newPath);
        console.log(`  ✅ Renamed: ${orphan.filename} → ${orphan.potentialMatch.suggestedName}`);
        fixed++;
      } catch (error) {
        console.warn(`Could not rename: ${orphan.filename}`);
      }
    } else {
      console.log(`  [DRY] Would rename: ${orphan.filename} → ${orphan.potentialMatch.suggestedName}`);
      fixed++;
    }
  }
  
  return fixed;
}

function moveDangerousToOrphans(orphans: OrphanReport[], dryRun: boolean): number {
  if (!dryRun && !fs.existsSync(ORPHANS_DIR)) {
    fs.mkdirSync(ORPHANS_DIR, { recursive: true });
  }
  
  let moved = 0;
  const dangerous = orphans.filter(o => o.category === 'dangerous');
  
  for (const orphan of dangerous) {
    if (!dryRun) {
      try {
        const dest = path.join(ORPHANS_DIR, path.basename(orphan.fullPath));
        fs.renameSync(orphan.fullPath, dest);
        moved++;
      } catch (error) {
        console.warn(`Could not move: ${orphan.filename}`);
      }
    } else {
      moved++;
    }
  }
  
  return moved;
}

function deleteOrphans(orphans: OrphanReport[], dryRun: boolean): number {
  let deleted = 0;
  const dangerous = orphans.filter(o => o.category === 'dangerous');
  
  for (const orphan of dangerous) {
    if (!dryRun) {
      try {
        // Log deletion with timestamp
        const logEntry = `${new Date().toISOString()} DELETED: ${orphan.fullPath}\n`;
        fs.appendFileSync('public/audio-deletion-log.txt', logEntry);
        
        fs.unlinkSync(orphan.fullPath);
        deleted++;
      } catch (error) {
        console.warn(`Could not delete: ${orphan.filename}`);
      }
    } else {
      deleted++;
    }
  }
  
  return deleted;
}

// ============================================
// Main Execution
// ============================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const shouldAutoFix = args.includes('--auto-fix');
  const shouldDelete = args.includes('--delete-orphans');
  
  console.log('='.repeat(60));
  console.log('Orphan Audio Cleanup v4.0 (GCE + Semantic Matcher)');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);
  console.log(`Auto-fix attachable: ${shouldAutoFix ? 'YES' : 'NO'}`);
  console.log(`Delete dangerous: ${shouldDelete ? 'YES' : 'NO (move to _orphans/)'}`);
  console.log('');
  
  // Collect data
  console.log('Scanning JSON files for audio references...');
  const { references, entries } = collectRoomEntries();
  console.log(`Found ${references.size} unique audio references`);
  console.log(`Found ${entries.length} room entries for matching\n`);
  
  console.log('Scanning audio directory...');
  const audioFiles = getAudioFiles();
  console.log(`Found ${audioFiles.size} audio files\n`);
  
  // Detect orphans using GCE
  console.log('Detecting orphans with semantic matching...');
  const orphans = detectOrphans(audioFiles, references, entries);
  
  const attachable = orphans.filter(o => o.category === 'attachable');
  const dangerous = orphans.filter(o => o.category === 'dangerous');
  
  const totalSizeKB = orphans.reduce((sum, o) => sum + o.sizeKB, 0);
  const totalSizeMB = (totalSizeKB / 1024).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('ORPHAN DETECTION RESULTS');
  console.log('='.repeat(60));
  console.log(`Orphans found: ${orphans.length}`);
  console.log(`  - Attachable (high confidence): ${attachable.length}`);
  console.log(`  - Dangerous (low confidence): ${dangerous.length}`);
  console.log(`Total size: ${totalSizeMB} MB`);
  
  // Show attachable
  if (attachable.length > 0) {
    console.log('\nAttachable (auto-fixable, confidence ≥85%):');
    attachable.slice(0, 10).forEach(o => {
      console.log(`  - ${o.filename} → ${o.potentialMatch?.suggestedName} (${Math.round(o.potentialMatch!.confidence * 100)}%)`);
    });
    if (attachable.length > 10) {
      console.log(`  ... and ${attachable.length - 10} more`);
    }
  }
  
  // Show dangerous
  if (dangerous.length > 0) {
    console.log('\nDangerous (requires manual review):');
    dangerous.slice(0, 10).forEach(o => {
      const conf = o.potentialMatch ? ` (best match: ${Math.round(o.potentialMatch.confidence * 100)}%)` : '';
      console.log(`  - ${o.filename}${conf}`);
    });
    if (dangerous.length > 10) {
      console.log(`  ... and ${dangerous.length - 10} more`);
    }
  }
  
  // Apply actions
  let autoAttached = 0;
  let movedOrDeleted = 0;
  
  if (shouldAutoFix && attachable.length > 0) {
    console.log('\nAuto-fixing attachable orphans...');
    autoAttached = autoFixAttachable(orphans, dryRun);
    console.log(`Auto-attached: ${autoAttached}`);
  }
  
  if (dangerous.length > 0 && !dryRun) {
    // Always backup before delete
    console.log('\nBacking up dangerous orphans...');
    backupOrphans(dangerous);
    
    if (shouldDelete) {
      console.log('Deleting dangerous orphans...');
      movedOrDeleted = deleteOrphans(orphans, dryRun);
      console.log(`Deleted: ${movedOrDeleted}`);
    } else {
      console.log('Moving dangerous orphans to _orphans/...');
      movedOrDeleted = moveDangerousToOrphans(orphans, dryRun);
      console.log(`Moved: ${movedOrDeleted}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total orphan files: ${orphans.length}`);
  console.log(`Auto-attached: ${autoAttached}`);
  console.log(`${shouldDelete ? 'Deleted' : 'Moved'}: ${movedOrDeleted}`);
  console.log(`Unsafe / left untouched: ${dangerous.length - movedOrDeleted}`);
  
  if (orphans.length === 0) {
    console.log('\n✅ No orphan files detected!');
  }
  
  // Write report
  const reportPath = 'public/orphan-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    mode: dryRun ? 'dry-run' : 'apply',
    totalOrphans: orphans.length,
    attachable: attachable.length,
    dangerous: dangerous.length,
    autoAttached,
    movedOrDeleted,
    totalSizeKB,
    orphans: orphans.map(o => ({
      filename: o.filename,
      sizeKB: o.sizeKB,
      category: o.category,
      potentialMatch: o.potentialMatch
    }))
  }, null, 2));
  
  console.log(`\nReport saved to: ${reportPath}`);
}

main();
