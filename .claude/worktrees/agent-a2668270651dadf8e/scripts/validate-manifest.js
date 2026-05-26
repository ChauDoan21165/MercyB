import { readdir } from 'fs/promises';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Non-room JSON files that live in public/data/ alongside room data.
// Mirrors scripts/validate-room-registry.js IGNORE_FILES.
const IGNORE_FILES = new Set([
  '.gitkeep',
  'Tiers.json',
  'Tiers_.json',
  'Package_Lock.json',
  'Tsconfig_App.json',
  'Tsconfig_Node.json',
  'components.json',
  'package-lock.json',
  'package.json',
  'registry.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'matchmaker_traits.json',
  'user_profile_dashboard.json',
  'Mercy_Blade_home_page.json',
  'Mercy_Blade_Method_Of_ Learning_English.json',
]);

function loadManifest() {
  const manifestPath = join(projectRoot, 'src', 'lib', 'roomManifest.ts');
  const manifestContent = readFileSync(manifestPath, 'utf8');
  const regex = /"([^"]+)":\s*"(data\/[^"]+)"/g;
  const manifest = {};
  let match;
  while ((match = regex.exec(manifestContent)) !== null) {
    const [, roomId, filePath] = match;
    manifest[roomId] = filePath;
  }
  return manifest;
}

async function getAllDataFiles() {
  const dataFiles = [];
  const dataPath = join(projectRoot, 'public', 'data');

  try {
    const files = await readdir(dataPath);
    files
      .filter(f => f.endsWith('.json'))
      .filter(f => !IGNORE_FILES.has(f))
      .forEach(f => {
        dataFiles.push(f);
      });
  } catch (error) {
    console.error('❌ Error reading data directory:', error.message);
    process.exit(1);
  }

  return dataFiles;
}

function filenameToRoomId(filename) {
  return filename
    .replace(/\.json$/, '')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/&/g, '');
}

async function validateManifest() {
  console.log('🔍 Validating Room Manifest\n');
  console.log('═'.repeat(60));

  const PUBLIC_ROOM_MANIFEST = loadManifest();
  const dataFiles = await getAllDataFiles();
  const manifestValues = new Set(Object.values(PUBLIC_ROOM_MANIFEST).map(path => path.replace('data/', '')));
  const manifestKeys = new Set(Object.keys(PUBLIC_ROOM_MANIFEST));

  const missing = [];
  const orphaned = [];

  // Check for files not in manifest
  for (const file of dataFiles) {
    if (!manifestValues.has(file)) {
      const expectedRoomId = filenameToRoomId(file);
      missing.push({ file, expectedRoomId });
    }
  }

  // Check for manifest entries with no files
  for (const [roomId, filePath] of Object.entries(PUBLIC_ROOM_MANIFEST)) {
    const fileName = filePath.replace('data/', '');
    if (!dataFiles.includes(fileName)) {
      orphaned.push({ roomId, filePath: fileName });
    }
  }

  console.log(`\n📊 Validation Results:`);
  console.log(`   Total JSON files: ${dataFiles.length}`);
  console.log(`   Total manifest entries: ${Object.keys(PUBLIC_ROOM_MANIFEST).length}`);
  console.log(`   ❌ Missing from manifest: ${missing.length}`);
  console.log(`   ⚠️  Orphaned manifest entries: ${orphaned.length}`);

  if (missing.length > 0) {
    console.log(`\n\n❌ Files Missing from Manifest (${missing.length}):`);
    console.log('─'.repeat(60));
    missing.forEach(({ file, expectedRoomId }) => {
      console.log(`   File: ${file}`);
      console.log(`   Expected Room ID: ${expectedRoomId}`);
      console.log('');
    });
    console.log('💡 Run: npm run registry:generate');
  }

  if (orphaned.length > 0) {
    console.log(`\n\n⚠️  Orphaned Manifest Entries (${orphaned.length}):`);
    console.log('─'.repeat(60));
    orphaned.forEach(({ roomId, filePath }) => {
      console.log(`   Room ID: ${roomId}`);
      console.log(`   Expected File: ${filePath}`);
      console.log('');
    });
    console.log('💡 Remove these entries or add the missing files');
  }

  console.log('\n' + '═'.repeat(60));

  if (missing.length === 0 && orphaned.length === 0) {
    console.log('\n✅ Manifest validation passed! All rooms are properly registered.');
    return 0;
  } else {
    console.log('\n❌ Manifest validation failed! Please fix the issues before deploying.');
    return 1;
  }
}

validateManifest()
  .then(code => process.exit(code))
  .catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
