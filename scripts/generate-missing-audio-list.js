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
const audioReferences = new Map(); // filename -> [list of JSON files that reference it]

jsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(dataDir, file), 'utf8');
    
    // Find all audio references using regex
    const audioMatches = content.match(/"audio":\s*"([^"]+\.mp3)"/g) || [];
    audioMatches.forEach(match => {
      const audioFile = match.match(/"audio":\s*"([^"]+\.mp3)"/)[1];
      const fileName = audioFile.split('/').pop();
      
      if (!audioReferences.has(fileName)) {
        audioReferences.set(fileName, []);
      }
      audioReferences.get(fileName).push(file);
    });
    
    // Also check nested audio objects with "en" key
    const nestedMatches = content.match(/"en":\s*"([^"]+\.mp3)"/g) || [];
    nestedMatches.forEach(match => {
      const audioFile = match.match(/"en":\s*"([^"]+\.mp3)"/)[1];
      const fileName = audioFile.split('/').pop();
      
      if (!audioReferences.has(fileName)) {
        audioReferences.set(fileName, []);
      }
      if (!audioReferences.get(fileName).includes(file)) {
        audioReferences.get(fileName).push(file);
      }
    });
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Find missing files
const missingFiles = [...audioReferences.keys()].filter(f => !existingAudio.has(f));

// Generate detailed report
let report = 'Based on analysis of JSON files vs existing audio files in public/audio:\n\n';
report += `MISSING AUDIO FILES (${missingFiles.length} files):\n\n`;

missingFiles.sort().forEach((file, index) => {
  report += `${index + 1}. ${file}\n`;
});

report += `\nTotal: ${missingFiles.length} missing audio files\n\n`;
report += 'These files are referenced in the JSON data files but not present in public/audio folder.\n';

// Save report
fs.writeFileSync(
  path.join(__dirname, '../public/missing-audio-list.txt'),
  report
);

console.log(report);
console.log('✓ Report saved to: public/missing-audio-list.txt');
