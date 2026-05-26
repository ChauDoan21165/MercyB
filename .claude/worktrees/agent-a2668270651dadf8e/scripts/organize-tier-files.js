import { readdir, rename, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const dataDir = join(projectRoot, 'public', 'data');

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function organizeTierFiles() {
  console.log('🗂️  Organizing data files into tier subdirectories...\n');
  
  const files = await readdir(dataDir);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));
  
  let moved = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of jsonFiles) {
    // Extract tier from filename
    const tierMatch = file.match(/_(free|vip1|vip2|vip3)\.json$/i);
    
    if (!tierMatch) {
      console.log(`⏭️  Skipping ${file} (no tier suffix found)`);
      skipped++;
      continue;
    }

    const tier = tierMatch[1].toLowerCase();
    const sourcePath = join(dataDir, file);
    const targetDir = join(dataDir, tier);
    const targetPath = join(targetDir, file);

    // Check if file already exists in target
    if (await fileExists(targetPath)) {
      console.log(`✓  ${file} already in ${tier}/`);
      skipped++;
      continue;
    }

    // Move the file
    try {
      await rename(sourcePath, targetPath);
      console.log(`✅ Moved ${file} → ${tier}/`);
      moved++;
    } catch (error) {
      console.log(`❌ Error moving ${file}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Moved: ${moved}`);
  console.log(`   Already organized: ${skipped}`);
  console.log(`   Errors: ${errors}`);
  
  if (moved > 0) {
    console.log(`\n✅ Successfully organized ${moved} files!`);
  } else if (errors === 0) {
    console.log(`\n✅ All files are already organized!`);
  }
}

organizeTierFiles().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
