import { readdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { PUBLIC_ROOM_MANIFEST } from '../src/lib/roomManifest.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Get all JSON files in data directories
async function getAllDataFiles() {
  const dataFiles = new Set();
  const tiers = ['free', 'vip1', 'vip2', 'vip3'];
  
  for (const tier of tiers) {
    const tierPath = join(projectRoot, 'public', 'data', tier);
    try {
      const files = await readdir(tierPath);
      files.filter(f => f.endsWith('.json')).forEach(f => {
        dataFiles.add(`${tier}/${f}`);
      });
    } catch (error) {
      // Directory might not exist
    }
  }
  
  return dataFiles;
}

async function auditRooms() {
  console.log('🔍 Auditing Room Data Files\n');
  console.log('═'.repeat(60));
  
  const existingFiles = await getAllDataFiles();
  const manifestRooms = Object.keys(PUBLIC_ROOM_MANIFEST);
  
  const missing = [];
  const found = [];
  
  // Check each manifest entry
  for (const [roomId, filePath] of Object.entries(PUBLIC_ROOM_MANIFEST)) {
    const fileName = filePath.replace('data/', '');
    
    // Extract tier from roomId
    const tierMatch = roomId.match(/-(free|vip1|vip2|vip3)$/);
    if (!tierMatch) continue;
    
    const tier = tierMatch[1];
    const expectedPath = `${tier}/${fileName}`;
    
    if (existingFiles.has(expectedPath)) {
      found.push({ roomId, path: expectedPath });
    } else {
      // Check if file exists with different casing
      const baseFileName = fileName.split('.')[0];
      let foundAlternative = false;
      
      for (const existingFile of existingFiles) {
        if (existingFile.toLowerCase().includes(baseFileName.toLowerCase().replace(/_/g, ''))) {
          found.push({ roomId, path: existingFile, note: 'Different naming' });
          foundAlternative = true;
          break;
        }
      }
      
      if (!foundAlternative) {
        missing.push({ roomId, expectedPath, filePath });
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total rooms in manifest: ${manifestRooms.length}`);
  console.log(`   ✅ Found: ${found.length}`);
  console.log(`   ❌ Missing: ${missing.length}`);
  
  if (missing.length > 0) {
    console.log(`\n\n❌ Missing Room Files (${missing.length}):`);
    console.log('─'.repeat(60));
    
    missing.forEach(({ roomId, expectedPath }) => {
      console.log(`   ${roomId}`);
      console.log(`   → Expected: ${expectedPath}`);
      console.log('');
    });
  }
  
  // Check for orphaned files (files that exist but aren't in manifest)
  const manifestFiles = new Set(
    Object.values(PUBLIC_ROOM_MANIFEST).map(path => {
      const fileName = path.replace('data/', '');
      const tierMatch = path.match(/_(free|vip1|vip2|vip3)\.json$/);
      if (tierMatch) {
        const tier = tierMatch[1];
        return `${tier}/${fileName}`;
      }
      return fileName;
    })
  );
  
  const orphaned = [];
  for (const file of existingFiles) {
    const fileName = file.split('/')[1];
    if (!manifestFiles.has(file) && fileName !== '.gitkeep') {
      orphaned.push(file);
    }
  }
  
  if (orphaned.length > 0) {
    console.log(`\n\n⚠️  Orphaned Files (${orphaned.length}) - exist but not in manifest:`);
    console.log('─'.repeat(60));
    orphaned.forEach(file => console.log(`   ${file}`));
  }
  
  console.log('\n' + '═'.repeat(60));
  
  if (missing.length === 0) {
    console.log('\n✅ All manifest rooms have corresponding data files!');
    return 0;
  } else {
    console.log(`\n⚠️  ${missing.length} room(s) need data files created`);
    return 1;
  }
}

auditRooms().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
