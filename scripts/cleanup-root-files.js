// Clean up JSON and MP3 files from root directory
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// System files that should NOT be deleted
const systemFiles = [
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
  '.env'
];

// System documentation/guide files to keep
const systemDocs = [
  'AI_DEVELOPMENT_PROMPT.md',
  'AI_EXECUTION_SEQUENCE.md',
  'COMPLETE_IMPLEMENTATION_GUIDE.md',
  'CONTENT_CREATION_GUIDE.md',
  'DESIGN_REPLICATION_PROMPT.md',
  'PAGE_BY_PAGE_PROMPTS.md',
  'ROOM_JSON_PROMPT.md',
  'STEP_BY_STEP_PROMPTS.md',
  'UI_SPECIFICATION_GUIDE.md'
];

// System data files to keep
const systemData = [
  'Dictionary.json'
];

const allSystemFiles = [...systemFiles, ...systemDocs, ...systemData];

// Get all files in root
const allFiles = fs.readdirSync(rootDir);

let deletedCount = 0;
const deletedFiles = [];

console.log('\n🧹 Cleaning up root directory...\n');

allFiles.forEach(filename => {
  const filePath = path.join(rootDir, filename);
  const stat = fs.statSync(filePath);
  
  // Skip directories
  if (stat.isDirectory()) return;
  
  // Skip system files
  if (allSystemFiles.includes(filename)) {
    console.log(`⚠️  Keeping system file: ${filename}`);
    return;
  }
  
  // Delete JSON files (except system files already checked)
  if (filename.endsWith('.json')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted JSON: ${filename}`);
      deletedFiles.push(filename);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Error deleting ${filename}:`, error.message);
    }
  }
  
  // Delete MP3 files
  if (filename.endsWith('.mp3')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted MP3: ${filename}`);
      deletedFiles.push(filename);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Error deleting ${filename}:`, error.message);
    }
  }
  
  // Delete SQL migration files that shouldn't be in root
  if (filename.endsWith('.sql')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted SQL: ${filename}`);
      deletedFiles.push(filename);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Error deleting ${filename}:`, error.message);
    }
  }
  
  // Delete CSV report files
  if (filename.endsWith('.csv')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted CSV: ${filename}`);
      deletedFiles.push(filename);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Error deleting ${filename}:`, error.message);
    }
  }
  
  // Delete backup files
  if (filename.endsWith('.bak')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted backup: ${filename}`);
      deletedFiles.push(filename);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Error deleting ${filename}:`, error.message);
    }
  }
  
  // Delete duplicate/old component files
  if (filename.endsWith('.tsx') && !filename.startsWith('vite')) {
    try {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted TSX: ${filename}`);
      deletedFiles.push(filename);
      deletedCount++;
    } catch (error) {
      console.error(`✗ Error deleting ${filename}:`, error.message);
    }
  }
});

console.log(`\n✨ Cleanup complete! Deleted ${deletedCount} files from root directory.`);

// Save list of deleted files
const deletedListPath = path.join(rootDir, 'deleted-files-list.txt');
fs.writeFileSync(deletedListPath, deletedFiles.join('\n'));
console.log(`\n📝 List of deleted files saved to: deleted-files-list.txt`);
