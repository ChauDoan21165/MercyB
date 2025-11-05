const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(__dirname, '../public/data');
const audioDir = path.join(__dirname, '../public/audio');

console.log('Analyzing audio files...\n');

// Get all JSON files from public/data
const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

// Get existing audio files in public/audio
const existingAudio = new Set(
  fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'))
);

// Get all audio files in root
const rootAudioFiles = new Set(
  fs.readdirSync(rootDir).filter(f => f.endsWith('.mp3'))
);

// Extract all audio references from JSON files
const referencedAudio = new Set();

jsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    
    // Find all audio references
    const audioMatches = content.match(/"audio":\s*"([^"]+\.mp3)"/g) || [];
    audioMatches.forEach(match => {
      const audioFile = match.match(/"audio":\s*"([^"]+\.mp3)"/)[1];
      const fileName = audioFile.split('/').pop();
      referencedAudio.add(fileName);
    });
    
    // Check nested audio objects
    const nestedMatches = content.match(/"en":\s*"([^"]+\.mp3)"/g) || [];
    nestedMatches.forEach(match => {
      const audioFile = match.match(/"en":\s*"([^"]+\.mp3)"/)[1];
      const fileName = audioFile.split('/').pop();
      referencedAudio.add(fileName);
    });
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Find missing files
const missingFiles = [...referencedAudio].filter(f => !existingAudio.has(f));

console.log(`Total audio files referenced in JSON: ${referencedAudio.size}`);
console.log(`Existing in public/audio: ${existingAudio.size}`);
console.log(`Missing files: ${missingFiles.length}\n`);

// Check which missing files exist in root
const foundInRoot = [];
const stillMissing = [];

missingFiles.forEach(file => {
  if (rootAudioFiles.has(file)) {
    foundInRoot.push(file);
  } else {
    stillMissing.push(file);
  }
});

console.log('='.repeat(80));
console.log('COPY OPERATION RESULTS');
console.log('='.repeat(80));

// Copy files from root to public/audio
let copiedCount = 0;
let failedCount = 0;

if (foundInRoot.length > 0) {
  console.log(`\nCopying ${foundInRoot.length} files from root to public/audio/...\n`);
  
  foundInRoot.forEach((file, idx) => {
    try {
      const sourcePath = path.join(rootDir, file);
      const destPath = path.join(audioDir, file);
      fs.copyFileSync(sourcePath, destPath);
      console.log(`${idx + 1}. ✓ ${file}`);
      copiedCount++;
    } catch (error) {
      console.log(`${idx + 1}. ✗ ${file} - Error: ${error.message}`);
      failedCount++;
    }
  });
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Files found in root and copied: ${copiedCount}`);
console.log(`Files failed to copy: ${failedCount}`);
console.log(`Files still missing (need to create): ${stillMissing.length}\n`);

if (stillMissing.length > 0) {
  console.log('STILL MISSING (need to create these):');
  console.log('-'.repeat(80));
  stillMissing.sort().forEach((file, idx) => {
    console.log(`${idx + 1}. ${file}`);
  });
  
  // Save list of still missing files
  fs.writeFileSync(
    path.join(__dirname, '../public/still-missing-audio.txt'),
    stillMissing.sort().join('\n')
  );
  console.log('\n✓ Still missing list saved to: public/still-missing-audio.txt');
}

console.log(`\n✓ Operation complete! Copied ${copiedCount} files.`);
