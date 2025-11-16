const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data');
const MANIFEST_FILE = path.join(__dirname, '../src/lib/roomManifest.ts');

// Files to ignore (not actual room data)
const IGNORE_FILES = [
  '.gitkeep',
  'Tiers.json',
  'Tiers_.json',
  'Package_Lock.json',
  'Tsconfig_App.json',
  'Tsconfig_Node.json',
  'components.json',
  'package-lock.json',
  'package.json',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'matchmaker_traits.json',
  'user_profile_dashboard.json',
  'Mercy_Blade_home_page.json',
  'Mercy_Blade_Method_Of_ Learning_English.json'
];

function getAllJsonFiles() {
  const files = fs.readdirSync(DATA_DIR);
  return files
    .filter(file => file.endsWith('.json'))
    .filter(file => !IGNORE_FILES.includes(file))
    .sort();
}

function extractManifestEntries() {
  const manifestContent = fs.readFileSync(MANIFEST_FILE, 'utf8');
  
  // Extract all entries from the manifest
  const regex = /"([^"]+)":\s*"data\/([^"]+)"/g;
  const entries = new Map();
  let match;
  
  while ((match = regex.exec(manifestContent)) !== null) {
    const [, roomId, fileName] = match;
    entries.set(fileName, roomId);
  }
  
  return entries;
}

function validateRegistry() {
  console.log('🔍 Validating Room Registry...\n');
  console.log('═'.repeat(70));
  
  // Get all JSON files from public/data
  const dataFiles = getAllJsonFiles();
  console.log(`\n📁 Found ${dataFiles.length} JSON files in public/data/`);
  
  // Get all registered files from manifest
  const manifestEntries = extractManifestEntries();
  console.log(`📝 Found ${manifestEntries.size} entries in roomManifest.ts\n`);
  
  // Check for unregistered files
  const unregistered = [];
  const registered = [];
  
  dataFiles.forEach(file => {
    if (manifestEntries.has(file)) {
      registered.push(file);
    } else {
      unregistered.push(file);
    }
  });
  
  // Check for dead references (in manifest but file doesn't exist)
  const deadReferences = [];
  manifestEntries.forEach((roomId, fileName) => {
    if (!dataFiles.includes(fileName)) {
      deadReferences.push({ roomId, fileName });
    }
  });
  
  // Report results
  console.log('═'.repeat(70));
  console.log('📊 VALIDATION RESULTS');
  console.log('═'.repeat(70));
  
  if (unregistered.length === 0 && deadReferences.length === 0) {
    console.log('\n✅ Perfect! All rooms are properly registered.');
    console.log(`   - ${registered.length} rooms registered`);
    console.log(`   - ${unregistered.length} unregistered files`);
    console.log(`   - ${deadReferences.length} dead references`);
    return true;
  }
  
  let hasErrors = false;
  
  if (unregistered.length > 0) {
    hasErrors = true;
    console.log(`\n❌ UNREGISTERED FILES (${unregistered.length}):`);
    console.log('   These JSON files exist but are NOT in roomManifest.ts:');
    console.log('   ' + '─'.repeat(66));
    unregistered.forEach(file => {
      console.log(`   • ${file}`);
    });
    console.log('\n   💡 Add these to src/lib/roomManifest.ts and src/lib/roomDataImports.ts');
  }
  
  if (deadReferences.length > 0) {
    hasErrors = true;
    console.log(`\n⚠️  DEAD REFERENCES (${deadReferences.length}):`);
    console.log('   These are in roomManifest.ts but files don\'t exist:');
    console.log('   ' + '─'.repeat(66));
    deadReferences.forEach(({ roomId, fileName }) => {
      console.log(`   • ${roomId} → data/${fileName}`);
    });
    console.log('\n   💡 Remove these from roomManifest.ts or add the missing files');
  }
  
  if (registered.length > 0) {
    console.log(`\n✅ Correctly Registered: ${registered.length} rooms`);
  }
  
  console.log('\n' + '═'.repeat(70));
  
  return !hasErrors;
}

// Run validation
const success = validateRegistry();
process.exit(success ? 0 : 1);
