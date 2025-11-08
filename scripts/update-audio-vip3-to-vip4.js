// Update audio file references from vip3 to vip4 in specific files
const fs = require('fs');
const path = require('path');

const files = [
  'Discover_Self_vip4_career_1.json',
  'Explore_World_vip4_career_I_2.json'
];

files.forEach(filename => {
  const filePath = path.join(__dirname, '../public/data', filename);
  
  console.log(`\nProcessing: ${filename}`);
  
  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  // Update audio references in entries
  let audioCount = 0;
  if (json.entries && Array.isArray(json.entries)) {
    json.entries.forEach(entry => {
      if (entry.audio) {
        if (typeof entry.audio === 'string') {
          const oldAudio = entry.audio;
          entry.audio = oldAudio.replace(/vip3/g, 'vip4');
          if (oldAudio !== entry.audio) {
            audioCount++;
            console.log(`  ${oldAudio} → ${entry.audio}`);
          }
        } else if (typeof entry.audio === 'object') {
          for (const [lang, audioPath] of Object.entries(entry.audio)) {
            if (typeof audioPath === 'string') {
              const oldAudio = audioPath;
              entry.audio[lang] = oldAudio.replace(/vip3/g, 'vip4');
              if (oldAudio !== entry.audio[lang]) {
                audioCount++;
                console.log(`  ${oldAudio} → ${entry.audio[lang]}`);
              }
            }
          }
        }
      }
    });
  }
  
  if (audioCount > 0) {
    // Write output file
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`  ✓ Updated ${audioCount} audio reference(s)`);
  } else {
    console.log(`  ℹ No audio references to update`);
  }
});

console.log('\n✅ Audio references updated from vip3 to vip4!');
