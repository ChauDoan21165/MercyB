/**
 * Move all JSON files from tier subdirectories back to public/data/
 * Run with: node scripts/flatten-data-structure.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const dataDir = path.join(projectRoot, 'public', 'data');

function flattenStructure() {
  console.log('🔄 Flattening data structure...\n');
  
  const tiers = ['free', 'vip1', 'vip2', 'vip3'];
  let moved = 0;
  let skipped = 0;
  
  for (const tier of tiers) {
    const tierDir = path.join(dataDir, tier);
    
    if (!fs.existsSync(tierDir)) {
      console.log(`⏭️  Skipping ${tier}/ - directory doesn't exist`);
      continue;
    }
    
    const files = fs.readdirSync(tierDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    console.log(`📁 Processing ${tier}/ (${jsonFiles.length} files)...`);
    
    for (const filename of jsonFiles) {
      const sourcePath = path.join(tierDir, filename);
      const destPath = path.join(dataDir, filename);
      
      // Check if destination already exists
      if (fs.existsSync(destPath)) {
        console.log(`   ⚠️  Skipped ${filename} - already exists in root`);
        skipped++;
        continue;
      }
      
      // Move file
      fs.renameSync(sourcePath, destPath);
      console.log(`   ✅ Moved ${filename}`);
      moved++;
    }
    
    // Remove empty tier directory
    const remaining = fs.readdirSync(tierDir);
    if (remaining.length === 0) {
      fs.rmdirSync(tierDir);
      console.log(`   🗑️  Removed empty ${tier}/ directory`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Moved: ${moved} files`);
  console.log(`   Skipped: ${skipped} files`);
  console.log(`\n✨ Structure flattened! All files now in public/data/`);
}

try {
  flattenStructure();
} catch (err) {
  console.error('❌ Error:', err);
  process.exit(1);
}
