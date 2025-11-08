// Convert VIP3 JSON files to VIP4
const fs = require('fs');
const path = require('path');

const files = [
  'Discover_Self_vip3_career_1.json',
  'Explore_World_vip3_career_I_2.json',
  'Explore_World_vip3_career_II_2.json',
  'Launch_Career_vip3_career_4_II.json'
];

files.forEach(filename => {
  const sourcePath = path.join(__dirname, '../user-uploads', filename);
  const outputFilename = filename.replace(/vip3/g, 'vip4');
  const outputPath = path.join(__dirname, '../public/data', outputFilename);
  
  console.log(`\nProcessing: ${filename}`);
  
  // Read the file
  const content = fs.readFileSync(sourcePath, 'utf8');
  const json = JSON.parse(content);
  
  // Convert tier
  if (json.meta && json.meta.tier === 'vip3') {
    json.meta.tier = 'vip4';
    console.log(`  ✓ Updated tier: vip3 → vip4`);
  }
  
  // Convert artifact_version_id
  if (json.meta && json.meta.artifact_version_id) {
    const oldId = json.meta.artifact_version_id;
    json.meta.artifact_version_id = oldId.replace(/vip3/g, 'vip4');
    console.log(`  ✓ Updated artifact_version_id: ${oldId} → ${json.meta.artifact_version_id}`);
  }
  
  // Convert summary_of field if exists
  if (json.meta && json.meta.summary_of) {
    const oldSummary = json.meta.summary_of;
    json.meta.summary_of = oldSummary.replace(/vip3/g, 'vip4');
    console.log(`  ✓ Updated summary_of: ${oldSummary} → ${json.meta.summary_of}`);
  }
  
  // Convert audio references in entries
  let audioCount = 0;
  if (json.entries && Array.isArray(json.entries)) {
    json.entries.forEach(entry => {
      if (entry.audio) {
        if (typeof entry.audio === 'string') {
          const oldAudio = entry.audio;
          entry.audio = oldAudio.replace(/vip3/g, 'vip4');
          if (oldAudio !== entry.audio) {
            audioCount++;
          }
        } else if (typeof entry.audio === 'object') {
          for (const [lang, audioPath] of Object.entries(entry.audio)) {
            if (typeof audioPath === 'string') {
              const oldAudio = audioPath;
              entry.audio[lang] = oldAudio.replace(/vip3/g, 'vip4');
              if (oldAudio !== entry.audio[lang]) {
                audioCount++;
              }
            }
          }
        }
      }
    });
  }
  
  if (audioCount > 0) {
    console.log(`  ✓ Updated ${audioCount} audio reference(s)`);
  }
  
  // Write output file
  fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
  console.log(`  ✓ Saved to: public/data/${outputFilename}`);
});

console.log('\n✅ All files converted from VIP3 to VIP4!');
