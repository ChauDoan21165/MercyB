#!/usr/bin/env node
// Final step: Update all audio references from vip3 to vip4
const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../public/data/Discover_Self_vip4_career_1.json'),
  path.join(__dirname, '../public/data/Explore_World_vip4_career_I_2.json')
];

console.log('🔄 Converting audio references from vip3 to vip4...\n');

files.forEach(filePath => {
  const filename = path.basename(filePath);
  console.log(`Processing: ${filename}`);
  
  // Read and parse JSON
  const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Update audio references
  let count = 0;
  json.entries?.forEach(entry => {
    if (entry.audio) {
      if (typeof entry.audio === 'string') {
        if (entry.audio.includes('vip3')) {
          entry.audio = entry.audio.replace(/vip3/g, 'vip4');
          count++;
        }
      } else if (typeof entry.audio === 'object') {
        Object.keys(entry.audio).forEach(lang => {
          if (entry.audio[lang].includes('vip3')) {
            entry.audio[lang] = entry.audio[lang].replace(/vip3/g, 'vip4');
            count++;
          }
        });
      }
    }
  });
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
  console.log(`✅ Updated ${count} audio references\n`);
});

console.log('✨ All VIP3 to VIP4 conversion complete!');
console.log('\nConverted files:');
console.log('  • public/data/Discover_Self_vip4_career_1.json');
console.log('  • public/data/Explore_World_vip4_career_I_2.json');
console.log('  • public/data/Explore_World_vip4_career_II_2.json');
console.log('  • public/data/Launch_Career_vip4_career_4_II.json');
