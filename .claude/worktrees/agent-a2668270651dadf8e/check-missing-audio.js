// Check which JSON files have missing audio references
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jsonFiles = fs.readdirSync(rootDir).filter(f => 
  f.endsWith('.json') && 
  !['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'components.json'].includes(f)
);

const mp3Files = fs.readdirSync(rootDir).filter(f => f.endsWith('.mp3'));

console.log(`\n📊 Found ${jsonFiles.length} JSON files and ${mp3Files.length} MP3 files\n`);

const results = [];

jsonFiles.forEach(jsonFile => {
  try {
    const content = fs.readFileSync(path.join(rootDir, jsonFile), 'utf8');
    const json = JSON.parse(content);
    
    if (!json.entries || !Array.isArray(json.entries)) {
      return;
    }
    
    const missingAudio = [];
    const foundAudio = [];
    
    json.entries.forEach(entry => {
      if (entry.audio) {
        let audioFile;
        if (typeof entry.audio === 'string') {
          audioFile = entry.audio;
        } else if (typeof entry.audio === 'object' && entry.audio.en) {
          audioFile = entry.audio.en;
        }
        
        if (audioFile) {
          // Clean the path
          audioFile = audioFile.replace(/^\//, '').replace(/^audio\/(en|vi)\//, '');
          
          if (mp3Files.includes(audioFile)) {
            foundAudio.push(audioFile);
          } else {
            missingAudio.push(audioFile);
          }
        }
      }
    });
    
    if (missingAudio.length > 0 || foundAudio.length > 0) {
      results.push({
        file: jsonFile,
        missing: missingAudio,
        found: foundAudio,
        total: missingAudio.length + foundAudio.length
      });
    }
  } catch (err) {
    console.error(`❌ Error processing ${jsonFile}:`, err.message);
  }
});

// Sort by number of missing files (descending)
results.sort((a, b) => b.missing.length - a.missing.length);

console.log('═══════════════════════════════════════════════════════════\n');
console.log('📋 SUMMARY BY JSON FILE:\n');

results.forEach(result => {
  const status = result.missing.length === 0 ? '✅' : '❌';
  console.log(`${status} ${result.file}`);
  console.log(`   Total audio references: ${result.total}`);
  console.log(`   Found: ${result.found.length}`);
  console.log(`   Missing: ${result.missing.length}`);
  
  if (result.missing.length > 0) {
    console.log(`   Missing files:`);
    result.missing.forEach(file => console.log(`      - ${file}`));
  }
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════\n');

const allMissing = results.flatMap(r => r.missing);
const uniqueMissing = [...new Set(allMissing)];

if (uniqueMissing.length > 0) {
  console.log(`\n🔍 UNIQUE MISSING AUDIO FILES (${uniqueMissing.length} total):\n`);
  uniqueMissing.sort().forEach(file => console.log(`   ${file}`));
} else {
  console.log(`\n🎉 ALL AUDIO FILES FOUND! No missing files.\n`);
}

console.log('\n═══════════════════════════════════════════════════════════\n');
