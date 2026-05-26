/**
 * Audio Storage Sync Checker
 * Compares local public/audio files with Supabase Storage bucket
 * READ-ONLY - Does not modify any files
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const AUDIO_DIR = path.join(process.cwd(), 'public/audio');
const BUCKET_NAME = 'room-audio';

// Load env vars
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://buemdfxyhxunzpgdoqin.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment');
  console.log('Run with: SUPABASE_SERVICE_ROLE_KEY=your_key tsx scripts/check-audio-storage-sync.ts');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Recursively get all .mp3 files from a directory
function getLocalMp3Files(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️ Directory not found: ${dir}`);
    return fileList;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      getLocalMp3Files(fullPath, fileList);
    } else if (file.toLowerCase().endsWith('.mp3')) {
      fileList.push(file); // Just basename
    }
  }
  
  return fileList;
}

// List all objects in Supabase bucket with pagination
async function listBucketObjects(): Promise<string[]> {
  const allObjects: string[] = [];
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list('', { 
        limit, 
        offset,
        sortBy: { column: 'name', order: 'asc' }
      });
    
    if (error) {
      console.error('❌ Error listing bucket:', error.message);
      break;
    }
    
    if (!data || data.length === 0) break;
    
    // Filter for .mp3 files and extract basenames
    for (const obj of data) {
      if (obj.name.toLowerCase().endsWith('.mp3')) {
        allObjects.push(obj.name);
      }
    }
    
    if (data.length < limit) break;
    offset += limit;
  }
  
  // Also check subfolders
  const { data: folders } = await supabase.storage
    .from(BUCKET_NAME)
    .list('', { limit: 100 });
  
  if (folders) {
    for (const item of folders) {
      if (item.id === null) { // It's a folder
        await listFolderRecursive(item.name, allObjects);
      }
    }
  }
  
  return allObjects;
}

async function listFolderRecursive(folderPath: string, allObjects: string[]): Promise<void> {
  let offset = 0;
  const limit = 1000;
  
  while (true) {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(folderPath, { limit, offset });
    
    if (error || !data || data.length === 0) break;
    
    for (const obj of data) {
      if (obj.name.toLowerCase().endsWith('.mp3')) {
        allObjects.push(obj.name); // Just basename
      } else if (obj.id === null) {
        // Subfolder
        await listFolderRecursive(`${folderPath}/${obj.name}`, allObjects);
      }
    }
    
    if (data.length < limit) break;
    offset += limit;
  }
}

async function main() {
  console.log('═'.repeat(60));
  console.log('🔍 AUDIO STORAGE SYNC CHECK');
  console.log('═'.repeat(60));
  console.log(`📁 Local directory: ${AUDIO_DIR}`);
  console.log(`☁️  Bucket name: ${BUCKET_NAME}`);
  console.log('');

  // Get local files
  console.log('📂 Scanning local audio files...');
  const localFiles = getLocalMp3Files(AUDIO_DIR);
  const localSet = new Set(localFiles.map(f => f.toLowerCase()));
  
  console.log(`   Found ${localFiles.length} local .mp3 files`);
  console.log('');

  // Get bucket files
  console.log('☁️  Listing Supabase bucket objects...');
  const bucketFiles = await listBucketObjects();
  const bucketSet = new Set(bucketFiles.map(f => f.toLowerCase()));
  
  console.log(`   Found ${bucketFiles.length} bucket .mp3 files`);
  console.log('');

  // Compare
  const present: string[] = [];
  const missingInStorage: string[] = [];
  const orphansInStorage: string[] = [];

  // Check local -> storage
  for (const file of localFiles) {
    if (bucketSet.has(file.toLowerCase())) {
      present.push(file);
    } else {
      missingInStorage.push(file);
    }
  }

  // Check storage -> local (orphans)
  for (const file of bucketFiles) {
    if (!localSet.has(file.toLowerCase())) {
      orphansInStorage.push(file);
    }
  }

  // Report
  console.log('═'.repeat(60));
  console.log('📊 SYNC REPORT');
  console.log('═'.repeat(60));
  console.log(`📁 Total local .mp3:        ${localFiles.length}`);
  console.log(`☁️  Total bucket .mp3:       ${bucketFiles.length}`);
  console.log('─'.repeat(60));
  console.log(`✅ Present (both):          ${present.length}`);
  console.log(`❌ Missing in Storage:      ${missingInStorage.length}`);
  console.log(`⚠️  Orphans in Storage:      ${orphansInStorage.length}`);
  console.log('═'.repeat(60));

  // Print examples
  if (present.length > 0) {
    console.log('\n✅ PRESENT (first 20):');
    present.slice(0, 20).forEach(f => console.log(`   ${f}`));
    if (present.length > 20) console.log(`   ... and ${present.length - 20} more`);
  }

  if (missingInStorage.length > 0) {
    console.log('\n❌ MISSING IN STORAGE (first 20):');
    missingInStorage.slice(0, 20).forEach(f => console.log(`   ${f}`));
    if (missingInStorage.length > 20) console.log(`   ... and ${missingInStorage.length - 20} more`);
  }

  if (orphansInStorage.length > 0) {
    console.log('\n⚠️  ORPHANS IN STORAGE (first 20):');
    orphansInStorage.slice(0, 20).forEach(f => console.log(`   ${f}`));
    if (orphansInStorage.length > 20) console.log(`   ... and ${orphansInStorage.length - 20} more`);
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`SUMMARY: Local mp3: ${localFiles.length}, Bucket mp3: ${bucketFiles.length}, Present: ${present.length}, MissingInStorage: ${missingInStorage.length}, OrphansInStorage: ${orphansInStorage.length}`);
  console.log('═'.repeat(60));
}

main().catch(console.error);
