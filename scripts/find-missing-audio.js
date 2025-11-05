const fs = require('fs');
const path = require('path');

// Get all JSON files from public/data
const dataDir = path.join(__dirname, '../public/data');
const audioDir = path.join(__dirname, '../public/audio');

// Read all JSON files
const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

// Get all existing audio files
const existingAudio = new Set(
  fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3'))
);

// Extract all audio references from JSON files
const referencedAudio = new Set();

jsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    const data = JSON.parse(content);
    
    // Find all audio references using regex
    const audioMatches = content.match(/"audio":\s*"([^"]+\.mp3)"/g) || [];
    audioMatches.forEach(match => {
      const audioFile = match.match(/"audio":\s*"([^"]+\.mp3)"/)[1];
      // Remove path prefixes if any
      const fileName = audioFile.split('/').pop();
      referencedAudio.add(fileName);
    });
    
    // Also check nested audio objects
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

console.log('\n=== AUDIO FILE ANALYSIS ===\n');
console.log(`Total JSON files: ${jsonFiles.length}`);
console.log(`Total audio files in folder: ${existingAudio.size}`);
console.log(`Total audio files referenced: ${referencedAudio.size}`);
console.log(`Missing audio files: ${missingFiles.length}\n`);

if (missingFiles.length > 0) {
  console.log('=== MISSING FILES ===\n');
  missingFiles.sort().forEach(file => console.log(file));
  
  // Save to file
  fs.writeFileSync(
    path.join(__dirname, '../missing-audio-files.txt'),
    missingFiles.sort().join('\n')
  );
  console.log('\n✓ Missing files list saved to: missing-audio-files.txt');
} else {
  console.log('✓ All referenced audio files are present!');
}

// Also find unreferenced files
const unreferenced = [...existingAudio].filter(f => !referencedAudio.has(f));
if (unreferenced.length > 0) {
  console.log(`\n=== UNREFERENCED FILES (${unreferenced.length}) ===\n`);
  unreferenced.sort().forEach(file => console.log(file));
}
