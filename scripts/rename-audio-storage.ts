/**
 * Supabase Storage Renamer
 * 
 * Renames audio files to canonical format and updates:
 * - Local storage files
 * - JSON room references
 * - Audio manifest
 * 
 * Run: npx tsx scripts/rename-audio-storage.ts [--dry-run] [--verbose]
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = 'public/data';
const AUDIO_DIR = 'public/audio';
const MANIFEST_PATH = 'public/audio/manifest.json';

interface RenameOperation {
  oldPath: string;
  newPath: string;
  oldFilename: string;
  newFilename: string;
  reason: string;
}

interface RenameReport {
  generatedAt: string;
  mode: string;
  totalOperations: number;
  successful: number;
  failed: number;
  operations: RenameOperation[];
}

// Validate and generate canonical filename
function generateCanonicalName(filename: string): string | null {
  const lower = filename.toLowerCase();
  
  // Extract language
  let lang: 'en' | 'vi' | null = null;
  if (/_en\.mp3$/i.test(filename) || /-en\.mp3$/i.test(filename)) {
    lang = 'en';
  } else if (/_vi\.mp3$/i.test(filename) || /-vi\.mp3$/i.test(filename)) {
    lang = 'vi';
  }
  
  if (!lang) return null;
  
  // Normalize: lowercase, replace underscores with hyphens
  let canonical = lower
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .replace(/--+/g, '-')
    .replace(/^["']+/, '');
  
  // Ensure proper suffix
  canonical = canonical
    .replace(/_en\.mp3$/i, `-${lang}.mp3`)
    .replace(/_vi\.mp3$/i, `-${lang}.mp3`);
  
  return canonical;
}

// Check if filename needs renaming
function needsRename(filename: string): boolean {
  // Check for uppercase
  if (filename !== filename.toLowerCase()) return true;
  
  // Check for underscores
  if (filename.includes('_')) return true;
  
  // Check for spaces
  if (filename.includes(' ')) return true;
  
  // Check for leading quotes
  if (filename.startsWith('"') || filename.startsWith("'")) return true;
  
  return false;
}

// Collect all files that need renaming
function collectRenameOperations(): RenameOperation[] {
  const operations: RenameOperation[] = [];
  
  function scan(dir: string) {
    if (!fs.existsSync(dir)) return;
    
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (entry.name.toLowerCase().endsWith('.mp3')) {
        if (needsRename(entry.name)) {
          const canonical = generateCanonicalName(entry.name);
          if (canonical && canonical !== entry.name.toLowerCase()) {
            const newPath = path.join(path.dirname(fullPath), canonical);
            operations.push({
              oldPath: fullPath,
              newPath,
              oldFilename: entry.name,
              newFilename: canonical,
              reason: getRenamingReason(entry.name)
            });
          }
        }
      }
    }
  }
  
  scan(AUDIO_DIR);
  return operations;
}

// Get human-readable reason for renaming
function getRenamingReason(filename: string): string {
  const reasons: string[] = [];
  
  if (filename !== filename.toLowerCase()) {
    reasons.push('not lowercase');
  }
  if (filename.includes('_')) {
    reasons.push('contains underscores');
  }
  if (filename.includes(' ')) {
    reasons.push('contains spaces');
  }
  if (filename.startsWith('"') || filename.startsWith("'")) {
    reasons.push('starts with quote');
  }
  
  return reasons.join(', ') || 'naming convention';
}

// Update JSON files with new filenames
function updateJsonReferences(renames: Map<string, string>, dryRun: boolean): number {
  let updatedCount = 0;
  
  if (!fs.existsSync(DATA_DIR)) return 0;
  
  const jsonFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
  
  for (const file of jsonFiles) {
    const filePath = path.join(DATA_DIR, file);
    
    try {
      let content = fs.readFileSync(filePath, 'utf-8');
      let modified = false;
      
      for (const [oldName, newName] of renames) {
        // Check both the filename and the full lowercase version
        if (content.includes(oldName)) {
          content = content.split(oldName).join(newName);
          modified = true;
        }
        
        // Also check lowercase version
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
      }
    } catch (error) {
      console.warn(`Warning: Could not update ${file}`);
    }
  }
  
  return updatedCount;
}

// Update manifest with new filenames
function updateManifest(renames: Map<string, string>, dryRun: boolean): boolean {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.warn('Manifest not found, skipping manifest update');
    return false;
  }
  
  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    
    if (manifest.files && Array.isArray(manifest.files)) {
      manifest.files = manifest.files.map((file: string) => {
        const basename = path.basename(file).toLowerCase();
        const newName = renames.get(basename);
        if (newName) {
          return file.replace(path.basename(file), newName);
        }
        return file.toLowerCase();
      });
      
      // Sort and dedupe
      manifest.files = [...new Set(manifest.files)].sort();
      manifest.totalFiles = manifest.files.length;
      manifest.generated = new Date().toISOString();
      
      if (!dryRun) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
      }
      
      return true;
    }
  } catch (error) {
    console.error('Error updating manifest:', error);
  }
  
  return false;
}

// Execute rename operations
function executeRenames(operations: RenameOperation[], dryRun: boolean): { successful: number; failed: number } {
  let successful = 0;
  let failed = 0;
  
  for (const op of operations) {
    try {
      if (!dryRun) {
        // Check if target already exists
        if (fs.existsSync(op.newPath)) {
          console.warn(`Target already exists, skipping: ${op.newFilename}`);
          failed++;
          continue;
        }
        
        fs.renameSync(op.oldPath, op.newPath);
      }
      successful++;
    } catch (error) {
      console.error(`Failed to rename ${op.oldFilename}:`, error);
      failed++;
    }
  }
  
  return { successful, failed };
}

// Main execution
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const verbose = args.includes('--verbose');
  
  console.log('='.repeat(60));
  console.log('Audio Storage Renamer');
  console.log(`Mode: ${dryRun ? 'DRY RUN (no changes)' : 'LIVE (will rename files)'}`);
  console.log('='.repeat(60));
  
  // Collect operations
  console.log('\nScanning for files that need renaming...');
  const operations = collectRenameOperations();
  
  if (operations.length === 0) {
    console.log('\n✅ All files already follow naming conventions!');
    return;
  }
  
  console.log(`Found ${operations.length} files to rename\n`);
  
  if (verbose) {
    operations.forEach(op => {
      console.log(`  ${op.oldFilename} → ${op.newFilename}`);
      console.log(`    Reason: ${op.reason}`);
    });
    console.log('');
  }
  
  // Build rename map
  const renames = new Map<string, string>();
  operations.forEach(op => {
    renames.set(op.oldFilename, op.newFilename);
    renames.set(op.oldFilename.toLowerCase(), op.newFilename);
  });
  
  // Execute renames
  console.log('Renaming files...');
  const { successful, failed } = executeRenames(operations, dryRun);
  
  // Update JSON references
  console.log('Updating JSON references...');
  const jsonUpdated = updateJsonReferences(renames, dryRun);
  
  // Update manifest
  console.log('Updating manifest...');
  const manifestUpdated = updateManifest(renames, dryRun);
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files renamed: ${successful}/${operations.length}`);
  console.log(`Failed: ${failed}`);
  console.log(`JSON files updated: ${jsonUpdated}`);
  console.log(`Manifest updated: ${manifestUpdated ? 'Yes' : 'No'}`);
  
  // Write report
  const report: RenameReport = {
    generatedAt: new Date().toISOString(),
    mode: dryRun ? 'dry-run' : 'live',
    totalOperations: operations.length,
    successful,
    failed,
    operations
  };
  
  const reportPath = 'public/rename-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);
}

main();
