// Move all JSON files to public/data/ and update audio references
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(rootDir, 'public', 'data');
const audioDir = path.join(rootDir, 'public', 'audio');

// Create directories if they don't exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✓ Created public/data/');
}

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
  console.log('✓ Created public/audio/');
}

// Get all JSON files in root (excluding config files)
const excludedFiles = ['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'components.json'];
const jsonFiles = fs.readdirSync(rootDir).filter(f => 
  f.endsWith('.json') && !excludedFiles.includes(f)
);

console.log(`\n📦 Found ${jsonFiles.length} JSON files to move\n`);

let movedCount = 0;

jsonFiles.forEach(filename => {
  const sourcePath = path.join(rootDir, filename);
  const destPath = path.join(dataDir, filename);
  
  try {
    // Read and parse JSON
    const content = fs.readFileSync(sourcePath, 'utf-8');
    const data = JSON.parse(content);
    
    // Update audio paths in entries to point to /audio/
    if (Array.isArray(data.entries)) {
      data.entries.forEach(entry => {
        if (entry.audio) {
          // Remove any leading slashes and ensure it doesn't have 'audio/' prefix
          let audioPath = entry.audio.replace(/^\//, '').replace(/^audio\//, '');
          // The path should just be the filename, app will prepend /audio/
          entry.audio = audioPath;
        }
      });
    }
    
    // Write to new location
    fs.writeFileSync(destPath, JSON.stringify(data, null, 2));
    
    // Delete original file
    fs.unlinkSync(sourcePath);
    
    console.log(`✓ Moved: ${filename}`);
    movedCount++;
  } catch (error) {
    console.error(`✗ Error moving ${filename}:`, error.message);
  }
});

console.log(`\n✨ Done! Moved ${movedCount}/${jsonFiles.length} files to public/data/`);
console.log('\n📝 Next steps:');
console.log('   1. Move all MP3 files to public/audio/');
console.log('   2. Run: node scripts/generate-room-registry.js');
