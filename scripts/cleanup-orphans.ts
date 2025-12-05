/**
 * Orphan Audio Cleanup Script
 * 
 * Detects audio files that exist in storage but are not referenced
 * by any room JSON file. Provides safe cleanup with backup option.
 * 
 * Run: npx tsx scripts/cleanup-orphans.ts [--dry-run] [--delete] [--backup]
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data';
const AUDIO_DIR = 'public/audio';
const BACKUP_DIR = 'public/audio-orphans-backup';
const MANIFEST_PATH = 'public/audio/manifest.json';

interface OrphanReport {
  filename: string;
  fullPath: string;
  sizeKB: number;
  reason: string;
}

// Collect all audio references from JSON files
function collectAudioReferences(): Set<string> {
  const references = new Set<string>();
  
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Data directory not found: ${DATA_DIR}`);
    return references;
  }
  
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  
  for (const file of jsonFiles) {
    try {
      const content = fs.readFileSync(path.join(DATA_DIR, file), 'utf-8');
      const room = JSON.parse(content);
      
      if (room.entries && Array.isArray(room.entries)) {
        for (const entry of room.entries) {
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
  
  return references;
}

// Get all audio files from storage
function getAudioFiles(): Map<string, { fullPath: string; sizeKB: number }> {
  const files = new Map<string, { fullPath: string; sizeKB: number }>();
  
  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
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

// Detect orphan files
function detectOrphans(
  audioFiles: Map<string, { fullPath: string; sizeKB: number }>,
  references: Set<string>
): OrphanReport[] {
  const orphans: OrphanReport[] = [];
  
  for (const [filename, info] of audioFiles) {
    // Check if filename (or just the basename) is referenced
    const basename = path.basename(filename).toLowerCase();
    
    if (!references.has(filename) && !references.has(basename)) {
      orphans.push({
        filename,
        fullPath: info.fullPath,
        sizeKB: info.sizeKB,
        reason: 'Not referenced in any room JSON'
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
  
  console.log('='.repeat(60));
  console.log('Orphan Audio Cleanup');
  console.log('='.repeat(60));
  console.log(`Mode: ${dryRun ? 'DRY RUN' : shouldDelete ? 'DELETE' : 'DETECT ONLY'}`);
  console.log(`Backup: ${shouldBackup ? 'YES' : 'NO'}\n`);
  
  // Collect references
  console.log('Scanning JSON files for audio references...');
  const references = collectAudioReferences();
  console.log(`Found ${references.size} unique audio references\n`);
  
  // Get audio files
  console.log('Scanning audio directory...');
  const audioFiles = getAudioFiles();
  console.log(`Found ${audioFiles.size} audio files\n`);
  
  // Detect orphans
  console.log('Detecting orphans...');
  const orphans = detectOrphans(audioFiles, references);
  
  // Calculate total size
  const totalSizeKB = orphans.reduce((sum, o) => sum + o.sizeKB, 0);
  const totalSizeMB = (totalSizeKB / 1024).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('ORPHAN DETECTION RESULTS');
  console.log('='.repeat(60));
  console.log(`Total orphan files: ${orphans.length}`);
  console.log(`Total size: ${totalSizeMB} MB (${totalSizeKB} KB)`);
  
  if (orphans.length > 0) {
    console.log('\nOrphan files:');
    orphans.slice(0, 30).forEach(o => {
      console.log(`  - ${o.filename} (${o.sizeKB} KB)`);
    });
    
    if (orphans.length > 30) {
      console.log(`  ... and ${orphans.length - 30} more`);
    }
    
    // Backup if requested
    if (shouldBackup && !dryRun) {
      console.log('\nBacking up orphan files...');
      const backed = backupOrphans(orphans);
      console.log(`Backed up ${backed} files to ${BACKUP_DIR}`);
    }
    
    // Delete if requested
    if (shouldDelete && !dryRun) {
      console.log('\nDeleting orphan files...');
      const deleted = deleteOrphans(orphans);
      console.log(`Deleted ${deleted} files`);
    }
  } else {
    console.log('\n✅ No orphan files detected!');
  }
  
  // Write report
  const reportPath = 'public/orphan-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalOrphans: orphans.length,
    totalSizeKB,
    orphans: orphans.map(o => ({
      filename: o.filename,
      sizeKB: o.sizeKB,
      reason: o.reason
    }))
  }, null, 2));
  
  console.log(`\nReport saved to: ${reportPath}`);
  
  if (!shouldDelete && orphans.length > 0) {
    console.log('\nTo delete orphans, run with --delete flag');
    console.log('To backup before deleting, add --backup flag');
  }
}

main();
