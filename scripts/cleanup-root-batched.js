// Batch cleanup script for root directory - handles thousands of files efficiently
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '..');
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100');
const DRY_RUN = process.env.DRY_RUN === 'true';

// System files that should NOT be deleted
const KEEP_FILES = new Set([
  'package.json',
  'package-lock.json',
  'Package_Lock.json',
  'tsconfig.json',
  'tsconfig.app.json',
  'Tsconfig_App.json',
  'tsconfig.node.json',
  'Tsconfig_Node.json',
  'components.json',
  'postcss.config.js',
  'vite.config.ts',
  '.gitignore',
  'README.md',
  '.env',
  'AI_DEVELOPMENT_PROMPT.md',
  'AI_EXECUTION_SEQUENCE.md',
  'COMPLETE_IMPLEMENTATION_GUIDE.md',
  'CONTENT_CREATION_GUIDE.md',
  'DESIGN_REPLICATION_PROMPT.md',
  'PAGE_BY_PAGE_PROMPTS.md',
  'ROOM_JSON_PROMPT.md',
  'STEP_BY_STEP_PROMPTS.md',
  'UI_SPECIFICATION_GUIDE.md',
  'Dictionary.json',
  'CLEANUP_MANIFEST_2025-11-06.md',
  'CLEANUP_REPORT.md',
  'AUDIO_VALIDATION_REPORT.md'
]);

// File extensions to delete
const DELETE_EXTENSIONS = new Set(['.json', '.mp3', '.sql', '.csv', '.bak', '.tsx']);

function shouldDelete(filename) {
  if (KEEP_FILES.has(filename)) return false;
  if (filename.startsWith('vite') && filename.endsWith('.tsx')) return false;
  
  const ext = path.extname(filename).toLowerCase();
  return DELETE_EXTENSIONS.has(ext);
}

function getFilesToDelete() {
  const allFiles = fs.readdirSync(rootDir);
  const filesToDelete = [];

  for (const filename of allFiles) {
    const filePath = path.join(rootDir, filename);
    
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;
      if (shouldDelete(filename)) {
        filesToDelete.push({ filename, size: stat.size });
      }
    } catch (error) {
      console.error(`⚠️  Error checking ${filename}: ${error.message}`);
    }
  }

  return filesToDelete;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function commitBatch(batchNumber, filesDeleted, totalSize) {
  try {
    execSync('git add -A', { cwd: rootDir, stdio: 'pipe' });
    
    const commitMsg = `chore: cleanup batch ${batchNumber} (${filesDeleted} files, ${formatBytes(totalSize)})`;
    execSync(`git commit -m "${commitMsg}"`, { cwd: rootDir, stdio: 'pipe' });
    
    console.log(`✅ Committed batch ${batchNumber}`);
    return true;
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log(`ℹ️  Batch ${batchNumber}: Nothing to commit`);
      return false;
    }
    console.error(`❌ Error committing batch ${batchNumber}:`, error.message);
    return false;
  }
}

function deleteBatch(files) {
  let deletedCount = 0;
  let totalSize = 0;
  const errors = [];

  for (const { filename, size } of files) {
    const filePath = path.join(rootDir, filename);
    
    try {
      if (!DRY_RUN) {
        fs.unlinkSync(filePath);
      }
      deletedCount++;
      totalSize += size;
      
      const ext = path.extname(filename).toUpperCase().slice(1);
      console.log(`   ${DRY_RUN ? '🔍' : '🗑️'}  ${ext.padEnd(4)} ${filename.padEnd(50)} ${formatBytes(size)}`);
    } catch (error) {
      errors.push({ filename, error: error.message });
      console.error(`   ❌ Error deleting ${filename}: ${error.message}`);
    }
  }

  return { deletedCount, totalSize, errors };
}

function main() {
  console.log('🧹 Root Directory Batch Cleanup\n');
  console.log(`📁 Directory: ${rootDir}`);
  console.log(`📦 Batch size: ${BATCH_SIZE} files`);
  console.log(`${DRY_RUN ? '🔍 DRY RUN MODE - No files will be deleted\n' : '🔥 LIVE MODE - Files will be deleted\n'}`);

  // Get all files to delete
  console.log('🔍 Scanning root directory...\n');
  const filesToDelete = getFilesToDelete();

  if (filesToDelete.length === 0) {
    console.log('✨ Root directory is already clean! No files to delete.');
    return;
  }

  // Calculate totals
  const totalFiles = filesToDelete.length;
  const totalSize = filesToDelete.reduce((sum, f) => sum + f.size, 0);
  const numBatches = Math.ceil(totalFiles / BATCH_SIZE);

  console.log(`📊 Found ${totalFiles} files to delete (${formatBytes(totalSize)})`);
  console.log(`📦 Processing in ${numBatches} batches\n`);

  // Group by file type for summary
  const byType = {};
  for (const { filename, size } of filesToDelete) {
    const ext = path.extname(filename).toLowerCase();
    if (!byType[ext]) {
      byType[ext] = { count: 0, size: 0 };
    }
    byType[ext].count++;
    byType[ext].size += size;
  }

  console.log('📋 File types breakdown:');
  for (const [ext, { count, size }] of Object.entries(byType)) {
    console.log(`   ${ext.padEnd(6)} ${count.toString().padStart(5)} files  ${formatBytes(size)}`);
  }
  console.log('');

  if (DRY_RUN) {
    console.log('🔍 DRY RUN: The following files would be deleted:\n');
  }

  // Process in batches
  let totalDeleted = 0;
  let totalBytesDeleted = 0;
  let batchesCommitted = 0;
  const allErrors = [];

  for (let i = 0; i < numBatches; i++) {
    const batchNum = i + 1;
    const start = i * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, totalFiles);
    const batch = filesToDelete.slice(start, end);

    console.log(`\n📦 Batch ${batchNum}/${numBatches} (${batch.length} files):`);
    
    const { deletedCount, totalSize, errors } = deleteBatch(batch);
    totalDeleted += deletedCount;
    totalBytesDeleted += totalSize;
    allErrors.push(...errors);

    if (!DRY_RUN && deletedCount > 0) {
      if (commitBatch(batchNum, deletedCount, totalSize)) {
        batchesCommitted++;
      }
    }

    // Progress indicator
    const progress = Math.round((end / totalFiles) * 100);
    console.log(`   📈 Progress: ${progress}% (${end}/${totalFiles} files processed)`);
  }

  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 CLEANUP SUMMARY');
  console.log('='.repeat(70));
  console.log(`${DRY_RUN ? '🔍 Mode: DRY RUN (no files deleted)' : '🔥 Mode: LIVE (files deleted)'}`);
  console.log(`📁 Files processed: ${totalDeleted}/${totalFiles}`);
  console.log(`💾 Space ${DRY_RUN ? 'to be freed' : 'freed'}: ${formatBytes(totalBytesDeleted)}`);
  
  if (!DRY_RUN) {
    console.log(`✅ Batches committed: ${batchesCommitted}`);
  }

  if (allErrors.length > 0) {
    console.log(`\n⚠️  Errors encountered: ${allErrors.length}`);
    allErrors.forEach(({ filename, error }) => {
      console.log(`   ❌ ${filename}: ${error}`);
    });
  } else {
    console.log(`\n✅ No errors encountered`);
  }

  console.log('='.repeat(70));
  
  if (DRY_RUN) {
    console.log('\n💡 To actually delete files, run without DRY_RUN=true');
  } else {
    console.log('\n✨ Cleanup complete! All batches committed locally.');
    console.log('📤 Changes will be pushed to GitHub in the next workflow step.');
  }
}

// Run cleanup
try {
  main();
  process.exit(0);
} catch (error) {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
}
