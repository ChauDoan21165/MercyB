/**
 * Orphan Audio Cleanup Script v5.0
 * Phase 5: Zero-Friction Autopilot with Multi-Factor Scoring
 * 
 * Features:
 * - GCE-based orphan detection
 * - Multi-factor semantic matching (Levenshtein + token + room similarity)
 * - Safe vs dangerous categorization with 0.92/0.75 thresholds
 * - Backup before delete
 * - No-timestamp mode for CI dry-runs
 * - Change-set JSON export for audit
 * 
 * Run: npx tsx scripts/cleanup-orphans.ts [--dry-run] [--auto-fix] [--delete-orphans] [--no-timestamp]
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

const MIN_CONFIDENCE_AUTO_ATTACH = 0.92;
const MIN_CONFIDENCE_FLAG = 0.75;
const MIN_CONFIDENCE_BLOCK = 0.75;

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

// Token similarity (Jaccard index)
function tokenSimilarity(a: string, b: string): number {
  const tokensA = new Set(a.toLowerCase().split(/[-_\s]+/).filter(t => t.length > 1));
  const tokensB = new Set(b.toLowerCase().split(/[-_\s]+/).filter(t => t.length > 1));
  
  if (tokensA.size === 0 || tokensB.size === 0) return 0;
  
  const intersection = new Set([...tokensA].filter(x => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  
  return intersection.size / union.size;
}

// Room semantic closeness
function roomSimilarity(filename: string, roomId: string): number {
  const normalizedRoom = normalizeRoomId(roomId);
  const fileBase = filename.toLowerCase().replace(/-(en|vi)\.mp3$/i, '');
  
  // Check if filename starts with roomId
  if (fileBase.startsWith(normalizedRoom)) {
    return 1;
  }
  
  // Otherwise use token similarity
  return tokenSimilarity(fileBase, normalizedRoom);
}

// ============================================
// Types
// ============================================

interface OrphanReport {
  filename: string;
  fullPath: string;
  sizeKB: number;
  reason: string;
  category: 'auto-attach' | 'flag-review' | 'blocked';
  potentialMatch?: {
    roomId: string;
    entrySlug: string;
    confidence: number;
    suggestedName: string;
    matchFactors: {
      levenshtein: number;
      token: number;
      room: number;
    };
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
// Multi-Factor Orphan Detection
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
    
    // Multi-factor scoring
    const levenshteinScore = similarityScore(filename.toLowerCase(), canonical[lang]);
    const tokenScore = tokenSimilarity(filename, canonical[lang]);
    const roomScore = roomSimilarity(filename, entry.roomId);
    
    // Weighted combination
    const combinedScore = (levenshteinScore * 0.5) + (tokenScore * 0.3) + (roomScore * 0.2);
    
    if (combinedScore > 0.6 && (!bestMatch || combinedScore > bestMatch.confidence)) {
      bestMatch = {
        roomId: entry.roomId,
        entrySlug: entry.slug,
        confidence: combinedScore,
        suggestedName: canonical[lang],
        matchFactors: {
          levenshtein: Math.round(levenshteinScore * 100),
          token: Math.round(tokenScore * 100),
          room: Math.round(roomScore * 100),
        },
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
      
      // Categorize based on Phase 5 thresholds
      let category: OrphanReport['category'];
      if (potentialMatch && potentialMatch.confidence >= MIN_CONFIDENCE_AUTO_ATTACH) {
        category = 'auto-attach';
      } else if (potentialMatch && potentialMatch.confidence >= MIN_CONFIDENCE_FLAG) {
        category = 'flag-review';
      } else {
        category = 'blocked';
      }
      
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

function autoAttachOrphans(orphans: OrphanReport[], dryRun: boolean): number {
  let attached = 0;
  const autoAttach = orphans.filter(o => o.category === 'auto-attach' && o.potentialMatch);
  
  for (const orphan of autoAttach) {
    if (!orphan.potentialMatch) continue;
    
    if (!dryRun) {
      try {
        const newPath = path.join(path.dirname(orphan.fullPath), orphan.potentialMatch.suggestedName);
        fs.renameSync(orphan.fullPath, newPath);
        console.log(`  ✅ Auto-attached: ${orphan.filename} → ${orphan.potentialMatch.suggestedName} (${Math.round(orphan.potentialMatch.confidence * 100)}%)`);
        attached++;
      } catch (error) {
        console.warn(`Could not rename: ${orphan.filename}`);
      }
    } else {
      console.log(`  [DRY] Would auto-attach: ${orphan.filename} → ${orphan.potentialMatch.suggestedName} (${Math.round(orphan.potentialMatch.confidence * 100)}%)`);
      attached++;
    }
  }
  
  return attached;
}

function moveBlockedToOrphans(orphans: OrphanReport[], dryRun: boolean): number {
  if (!dryRun && !fs.existsSync(ORPHANS_DIR)) {
    fs.mkdirSync(ORPHANS_DIR, { recursive: true });
  }
  
  let moved = 0;
  const blocked = orphans.filter(o => o.category === 'blocked');
  
  for (const orphan of blocked) {
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
  const blocked = orphans.filter(o => o.category === 'blocked');
  
  for (const orphan of blocked) {
    if (!dryRun) {
      try {
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
  const noTimestamp = args.includes('--no-timestamp');
  
  console.log('='.repeat(60));
  console.log('Orphan Audio Cleanup v5.0 (Phase 5 Multi-Factor Matching)');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY'}`);
  console.log(`Auto-attach (≥${Math.round(MIN_CONFIDENCE_AUTO_ATTACH * 100)}%): ${shouldAutoFix ? 'YES' : 'NO'}`);
  console.log(`Delete blocked (<${Math.round(MIN_CONFIDENCE_BLOCK * 100)}%): ${shouldDelete ? 'YES' : 'NO (move to _orphans/)'}`);
  if (noTimestamp) {
    console.log('Timestamp suppression: ON');
  }
  console.log('');
  
  // Collect data
  console.log('Scanning JSON files for audio references...');
  const { references, entries } = collectRoomEntries();
  console.log(`Found ${references.size} unique audio references`);
  console.log(`Found ${entries.length} room entries for matching\n`);
  
  console.log('Scanning audio directory...');
  const audioFiles = getAudioFiles();
  console.log(`Found ${audioFiles.size} audio files\n`);
  
  // Detect orphans using multi-factor matching
  console.log('Detecting orphans with multi-factor semantic matching...');
  const orphans = detectOrphans(audioFiles, references, entries);
  
  const autoAttach = orphans.filter(o => o.category === 'auto-attach');
  const flagReview = orphans.filter(o => o.category === 'flag-review');
  const blocked = orphans.filter(o => o.category === 'blocked');
  
  const totalSizeKB = orphans.reduce((sum, o) => sum + o.sizeKB, 0);
  const totalSizeMB = (totalSizeKB / 1024).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('ORPHAN DETECTION RESULTS');
  console.log('='.repeat(60));
  console.log(`Orphans found: ${orphans.length}`);
  console.log(`  - 🟢 Auto-attach (≥${Math.round(MIN_CONFIDENCE_AUTO_ATTACH * 100)}%): ${autoAttach.length}`);
  console.log(`  - 🟡 Flag for review (${Math.round(MIN_CONFIDENCE_FLAG * 100)}-${Math.round(MIN_CONFIDENCE_AUTO_ATTACH * 100)}%): ${flagReview.length}`);
  console.log(`  - 🔴 Blocked (<${Math.round(MIN_CONFIDENCE_BLOCK * 100)}%): ${blocked.length}`);
  console.log(`Total size: ${totalSizeMB} MB`);
  
  // Show auto-attachable
  if (autoAttach.length > 0) {
    console.log(`\n🟢 Auto-attachable (confidence ≥${Math.round(MIN_CONFIDENCE_AUTO_ATTACH * 100)}%):`);
    autoAttach.slice(0, 10).forEach(o => {
      const factors = o.potentialMatch?.matchFactors;
      console.log(`  - ${o.filename} → ${o.potentialMatch?.suggestedName}`);
      console.log(`    (${Math.round(o.potentialMatch!.confidence * 100)}%: L=${factors?.levenshtein}% T=${factors?.token}% R=${factors?.room}%)`);
    });
    if (autoAttach.length > 10) {
      console.log(`  ... and ${autoAttach.length - 10} more`);
    }
  }
  
  // Show flagged for review
  if (flagReview.length > 0) {
    console.log(`\n🟡 Flagged for human review (${Math.round(MIN_CONFIDENCE_FLAG * 100)}-${Math.round(MIN_CONFIDENCE_AUTO_ATTACH * 100)}%):`);
    flagReview.slice(0, 5).forEach(o => {
      const factors = o.potentialMatch?.matchFactors;
      console.log(`  - ${o.filename} → ${o.potentialMatch?.suggestedName || 'no match'}`);
      if (factors) {
        console.log(`    (${Math.round(o.potentialMatch!.confidence * 100)}%: L=${factors.levenshtein}% T=${factors.token}% R=${factors.room}%)`);
      }
    });
    if (flagReview.length > 5) {
      console.log(`  ... and ${flagReview.length - 5} more`);
    }
  }
  
  // Show blocked
  if (blocked.length > 0) {
    console.log(`\n🔴 Blocked (confidence <${Math.round(MIN_CONFIDENCE_BLOCK * 100)}%):`);
    blocked.slice(0, 5).forEach(o => {
      const conf = o.potentialMatch ? ` (best: ${Math.round(o.potentialMatch.confidence * 100)}%)` : ' (no match)';
      console.log(`  - ${o.filename}${conf}`);
    });
    if (blocked.length > 5) {
      console.log(`  ... and ${blocked.length - 5} more`);
    }
  }
  
  // Apply actions
  let autoAttached = 0;
  let movedOrDeleted = 0;
  
  if (shouldAutoFix && autoAttach.length > 0) {
    console.log('\nAuto-attaching high-confidence orphans...');
    autoAttached = autoAttachOrphans(orphans, dryRun);
    console.log(`Auto-attached: ${autoAttached}`);
  }
  
  if (blocked.length > 0 && !dryRun) {
    // Always backup before delete
    console.log('\nBacking up blocked orphans...');
    backupOrphans(blocked);
    
    if (shouldDelete) {
      console.log('Deleting blocked orphans...');
      movedOrDeleted = deleteOrphans(orphans, dryRun);
      console.log(`Deleted: ${movedOrDeleted}`);
    } else {
      console.log('Moving blocked orphans to _orphans/...');
      movedOrDeleted = moveBlockedToOrphans(orphans, dryRun);
      console.log(`Moved: ${movedOrDeleted}`);
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total orphan files: ${orphans.length}`);
  console.log(`Auto-attached: ${autoAttached}`);
  console.log(`Flagged for review: ${flagReview.length}`);
  console.log(`${shouldDelete ? 'Deleted' : 'Moved'}: ${movedOrDeleted}`);
  
  if (orphans.length === 0) {
    console.log('\n✅ No orphan files detected!');
  }
  
  // Write report
  const reportPath = 'public/orphan-report.json';
  const report = {
    generatedAt: noTimestamp ? 'suppressed' : new Date().toISOString(),
    mode: dryRun ? 'dry-run' : 'apply',
    thresholds: {
      autoAttach: MIN_CONFIDENCE_AUTO_ATTACH,
      flagReview: MIN_CONFIDENCE_FLAG,
      blocked: MIN_CONFIDENCE_BLOCK,
    },
    totalOrphans: orphans.length,
    autoAttachable: autoAttach.length,
    flaggedForReview: flagReview.length,
    blocked: blocked.length,
    autoAttached,
    movedOrDeleted,
    totalSizeKB,
    orphans: orphans.map(o => ({
      filename: o.filename,
      sizeKB: o.sizeKB,
      category: o.category,
      potentialMatch: o.potentialMatch,
    })),
  };
  
  // Only write report if there are changes or not in no-timestamp mode
  if (!noTimestamp || orphans.length > 0) {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);
  } else {
    console.log('\nNo report written (no-timestamp mode with no orphans)');
  }
}

main();
