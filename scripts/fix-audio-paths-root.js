// Fix all JSON audio paths to point to root directory
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const jsonFiles = fs.readdirSync(rootDir).filter(f => 
  f.endsWith('.json') && 
  !['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'components.json'].includes(f)
);

console.log(`Found ${jsonFiles.length} JSON files to process`);

jsonFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(content);
  
  if (!json.entries || !Array.isArray(json.entries)) {
    console.log(`⊘ Skipped ${file} - no entries array`);
    return;
  }
  
  let modified = false;
  
  json.entries.forEach((entry, idx) => {
    if (entry.audio) {
      const oldAudio = entry.audio;
      // Remove /audio/en/, /audio/vi/, or any path prefix
      let newAudio = oldAudio
        .replace(/^\/audio\/(en|vi)\//, '')
        .replace(/^audio\/(en|vi)\//, '')
        .replace(/^\//, '');
      
      if (oldAudio !== newAudio) {
        entry.audio = newAudio;
        console.log(`${file} [${idx}]: ${oldAudio} → ${newAudio}`);
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
    console.log(`✓ Updated ${file}`);
  } else {
    console.log(`○ No changes needed for ${file}`);
  }
});

console.log('\n✓ Audio path fix complete!');
