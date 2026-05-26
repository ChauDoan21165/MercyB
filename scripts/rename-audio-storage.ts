/**
 * Supabase Storage Renamer v5.0
 * Phase 5: Zero-Friction Autopilot with Change Classification
 * 
 * Features:
 * - Uses batchValidate + generateCanonicalFilename
 * - Detects duplicates and picks canonical survivor
 * - Updates JSON references automatically
 * - Regenerates manifest after completion
 * - No-timestamp mode for CI dry-runs
 * - Change classification (critical/structural/cosmetic)
 * 
 * Run: npx tsx scripts/rename-audio-storage.ts [--dry-run] [--verbose] [--no-timestamp]
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data';
const AUDIO_DIR = 'public/audio';
const MANIFEST_PATH = 'public/audio/manifest.json';
const DUPLICATES_DIR = 'public/audio/_duplicates';

interface RenameOperation {
  oldPath: string;
  newPath: string;
  oldFilename: string;
  newFilename: string;
  reason: string;
  confidence: number;
  isDuplicate: boolean;
  category: 'critical' | 'structural' | 'cosmetic';
}

interface RenameReport {
  generatedAt: string;
  mode: string;
  totalOperations: number;
  successful: number;
  failed: number;
  duplicatesHandled: number;
  jsonFilesUpdated: number;
  byCategory: Record<string, number>;
  operations: RenameOperation[];
}

// ============================================
// Validation Functions (matching filenameValidator)
// ============================================

function normalizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/--+/g, '-')
    .replace(/^["']+/, '')
    .trim();
}

function extractLanguage(filename: string): 'en' | 'vi' | null {
  if (/_en\.mp3$/i.test(filename) || /-en\.mp3$/i.test(filename)) return 'en';
  if (/_vi\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename)) return 'vi';
  return null;
}

function generateCanonicalFilename(
  roomId: string,
  entrySlug: string | number,
  language: 'en' | 'vi'
): string {
  const cleanRoomId = roomId.toLowerCase().replace(/[_\s]/g, '-');
  const cleanSlug = typeof entrySlug === 'number'
    ? `entry-${entrySlug}`
    : entrySlug.toLowerCase().replace(/[_\s]/g, '-');
  
  return `${cleanRoomId}-${cleanSlug}-${language}.mp3`;
}

function isValidFilename(filename: string): boolean {
  // Must be lowercase
  if (filename !== filename.toLowerCase()) return false;
  // No underscores
  if (filename.includes('_')) return false;
  // No spaces
  if (filename.includes(' ')) return false;
  // Must end with language suffix
  if (!/-en\.mp3$/i.test(filename) && !/-vi\.mp3$/i.test(filename)) return false;
  // No leading quotes
  if (filename.startsWith('"') || filename.startsWith("'")) return false;
  return true;
}

function needsRename(filename: string): boolean {
  return !isValidFilename(filename);
}

function categorizeRename(oldFilename: string, reason: string): 'critical' | 'structural' | 'cosmetic' {
  // Critical: completely wrong format, underscores, wrong language
  if (reason.includes('underscore') || reason.includes('quote')) return 'critical';
  
  // Structural: missing language suffix, wrong case
  if (reason.includes('not lowercase') || !extractLanguage(oldFilename)) return 'structural';
  
  // Cosmetic: minor formatting
  return 'cosmetic';
}

// ============================================
// Duplicate Detection
// ============================================

interface DuplicateGroup {
  normalizedName: string;
  variants: string[];
  keepRecommendation: string;
}

function detectDuplicates(filenames: string[]): DuplicateGroup[] {
  const groups = new Map<string, string[]>();
  
  for (const filename of filenames) {
    const normalized = normalizeFilename(filename);
    const existing = groups.get(normalized) || [];
    existing.push(filename);
    groups.set(normalized, existing);
  }

  const duplicates: DuplicateGroup[] = [];
  for (const [normalizedName, variants] of groups) {
    if (variants.length > 1) {
      // Keep the one already in canonical format, or the first one
      const canonical = variants.find(v => v === normalizedName) || variants[0];
      duplicates.push({ normalizedName, variants, keepRecommendation: canonical });
    }
  }

  return duplicates;
}

// ============================================
// File Operations
// ============================================

function collectAllAudioFiles(): Map<string, string> {
  const files = new Map<string, string>(); // filename -> fullPath
  
  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        scan(fullPath);
      } else if (entry.name.toLowerCase().endsWith('.mp3')) {
        files.set(entry.name, fullPath);
      }
    }
  }
  
  scan(AUDIO_DIR);
  return files;
}

function collectRenameOperations(verbose: boolean): RenameOperation[] {
  const operations: RenameOperation[] = [];
  const files = collectAllAudioFiles();
  const filenames = Array.from(files.keys());
  
  // Detect duplicates first
  const duplicates = detectDuplicates(filenames);
  const duplicateFiles = new Set<string>();
  
  for (const dup of duplicates) {
    for (const variant of dup.variants) {
      if (variant !== dup.keepRecommendation) {
        duplicateFiles.add(variant);
        const fullPath = files.get(variant)!;
        const reason = `Duplicate of ${dup.keepRecommendation}`;
        
        operations.push({
          oldPath: fullPath,
          newPath: path.join(DUPLICATES_DIR, variant),
          oldFilename: variant,
          newFilename: `_duplicates/${variant}`,
          reason,
          confidence: 95,
          isDuplicate: true,
          category: 'structural',
        });
        
        if (verbose) {
          console.log(`  [DUP] ${variant} → _duplicates/ (keep: ${dup.keepRecommendation})`);
        }
      }
    }
  }
  
  // Now process files that need renaming (but not duplicates being moved)
  for (const [filename, fullPath] of files) {
    if (duplicateFiles.has(filename)) continue;
    
    if (needsRename(filename)) {
      const canonical = normalizeFilename(filename);
      
      if (canonical !== filename) {
        const reason = getRenamingReason(filename);
        operations.push({
          oldPath: fullPath,
          newPath: path.join(path.dirname(fullPath), canonical),
          oldFilename: filename,
          newFilename: canonical,
          reason,
          confidence: 90,
          isDuplicate: false,
          category: categorizeRename(filename, reason),
        });
        
        if (verbose) {
          console.log(`  [RENAME] ${filename} → ${canonical}`);
        }
      }
    }
  }
  
  return operations;
}

function getRenamingReason(filename: string): string {
  const reasons: string[] = [];
  if (filename !== filename.toLowerCase()) reasons.push('not lowercase');
  if (filename.includes('_')) reasons.push('contains underscores');
  if (filename.includes(' ')) reasons.push('contains spaces');
  if (filename.startsWith('"') || filename.startsWith("'")) reasons.push('starts with quote');
  return reasons.join(', ') || 'naming convention';
}

// ============================================
// JSON Update
// ============================================

function updateJsonReferences(renames: Map<string, string>, dryRun: boolean, verbose: boolean): number {
  let updatedCount = 0;
  
  if (!fs.existsSync(DATA_DIR)) return 0;
  
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  
  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      
      for (const [oldName, newName] of renames) {
        // Skip duplicate moves (they're being moved, not renamed in JSON)
        if (newName.startsWith('_duplicates/')) continue;
        
        // Check both exact and lowercase versions
        if (content.includes(oldName)) {
          content = content.split(oldName).join(newName);
          modified = true;
        }
        
        const oldLower = oldName.toLowerCase();
        if (oldLower !== oldName && content.includes(oldLower)) {
          content = content.split(oldLower).join(newName);
          modified = true;
        }
      }
      
      if (modified) {
        if (!dryRun) {
          fs.writeFileSync(filePath, content);
        }
        updatedCount++;
        if (verbose) {
          console.log(`  [JSON] Updated: ${file}`);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not update ${file}`);
    }
  }
  
  return updatedCount;
}

// ============================================
// Manifest Regeneration
// ============================================

function regenerateManifest(verbose: boolean, noTimestamp: boolean): void {
  const files: string[] = [];
  
  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('_')) {
        scan(fullPath);
      } else if (entry.name.toLowerCase().endsWith('.mp3')) {
        files.push(entry.name.toLowerCase());
      }
    }
  }
  
  scan(AUDIO_DIR);
  
  // Read existing manifest to preserve timestamp if no-timestamp mode
  let existingTimestamp = new Date().toISOString();
  if (noTimestamp && fs.existsSync(MANIFEST_PATH)) {
    try {
      const existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
      existingTimestamp = existing.generated || existingTimestamp;
    } catch {
      // Use current timestamp if can't read existing
    }
  }
  
  const manifest = {
    generated: noTimestamp ? existingTimestamp : new Date().toISOString(),
    totalFiles: files.length,
    files: [...new Set(files)].sort()
  };
  
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  
  if (verbose) {
    console.log(`  [MANIFEST] Regenerated with ${files.length} files${noTimestamp ? ' (timestamp preserved)' : ''}`);
  }
}

// ============================================
// Execute Renames
// ============================================

function executeRenames(
  operations: RenameOperation[], 
  dryRun: boolean, 
  verbose: boolean
): { successful: number; failed: number; duplicatesHandled: number } {
  let successful = 0;
  let failed = 0;
  let duplicatesHandled = 0;
  
  // Ensure _duplicates directory exists
  if (!dryRun && !fs.existsSync(DUPLICATES_DIR)) {
    fs.mkdirSync(DUPLICATES_DIR, { recursive: true });
  }
  
  for (const op of operations) {
    try {
      if (!dryRun) {
        // Check if target already exists
        if (fs.existsSync(op.newPath) && op.oldPath !== op.newPath) {
          console.warn(`Target exists, skipping: ${op.newFilename}`);
          failed++;
          continue;
        }
        
        fs.renameSync(op.oldPath, op.newPath);
      }
      
      successful++;
      if (op.isDuplicate) duplicatesHandled++;
      
    } catch (error) {
      console.error(`Failed: ${op.oldFilename} → ${error}`);
      failed++;
    }
  }
  
  return { successful, failed, duplicatesHandled };
}

// ============================================
// Main Execution
// ============================================

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');
  const noTimestamp = args.includes('--no-timestamp');
  
  console.log('='.repeat(60));
  console.log('Audio Storage Renamer v5.0 (Phase 5 Autopilot)');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE (will rename files)'}`);
  console.log(`Verbose: ${verbose ? 'ON' : 'OFF'}`);
  if (noTimestamp) {
    console.log('Timestamp suppression: ON');
  }
  console.log('');
  
  // Collect operations
  console.log('Scanning for files that need renaming or deduplication...');
  const operations = collectRenameOperations(verbose);
  
  if (operations.length === 0) {
    console.log('\n✅ All files already follow naming conventions!');
    console.log('Total renames needed: 0');
    return;
  }
  
  const renameOps = operations.filter(o => !o.isDuplicate);
  const duplicateOps = operations.filter(o => o.isDuplicate);
  
  // Group by category
  const byCategory = operations.reduce((acc, op) => {
    acc[op.category] = (acc[op.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  console.log(`\nFound ${operations.length} operations:`);
  console.log(`  - Renames: ${renameOps.length}`);
  console.log(`  - Duplicate moves: ${duplicateOps.length}`);
  console.log('\nBy category:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    const emoji = cat === 'critical' ? '🔴' : cat === 'structural' ? '🟡' : '🟢';
    console.log(`  ${emoji} ${cat}: ${count}`);
  });
  console.log('');
  
  // Build rename map for JSON updates
  const renames = new Map<string, string>();
  operations.forEach(op => {
    renames.set(op.oldFilename, op.newFilename);
    renames.set(op.oldFilename.toLowerCase(), op.newFilename);
  });
  
  // Execute renames
  console.log('Executing file operations...');
  const { successful, failed, duplicatesHandled } = executeRenames(operations, dryRun, verbose);
  
  // Update JSON references
  console.log('\nUpdating JSON references...');
  const jsonUpdated = updateJsonReferences(renames, dryRun, verbose);
  
  // Regenerate manifest
  if (!dryRun) {
    console.log('\nRegenerating manifest...');
    regenerateManifest(verbose, noTimestamp);
  }
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total renames needed: ${operations.length}`);
  console.log(`Files renamed: ${successful - duplicatesHandled}`);
  console.log(`Duplicates moved: ${duplicatesHandled}`);
  console.log(`Failed: ${failed}`);
  console.log(`JSON files updated: ${jsonUpdated}`);
  
  // Write report
  const report: RenameReport = {
    generatedAt: noTimestamp ? 'suppressed' : new Date().toISOString(),
    mode: dryRun ? 'dry-run' : 'live',
    totalOperations: operations.length,
    successful,
    failed,
    duplicatesHandled,
    jsonFilesUpdated: jsonUpdated,
    byCategory,
    operations
  };
  
  const reportPath = 'public/rename-report.json';
  
  // Only write report if there are changes or not in no-timestamp mode
  if (!noTimestamp || operations.length > 0) {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\nReport saved to: ${reportPath}`);
  } else {
    console.log('\nNo report written (no-timestamp mode with no changes)');
  }
}

main();
