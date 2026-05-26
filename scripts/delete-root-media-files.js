// Delete all JSON and MP3 files from root directory
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Get all files in root
const files = fs.readdirSync(rootDir);

let deletedJson = 0;
let deletedMp3 = 0;

// Delete JSON and MP3 files
files.forEach(file => {
  const filePath = path.join(rootDir, file);
  const stat = fs.statSync(filePath);
  
  if (stat.isFile()) {
    if (file.endsWith('.json') && !['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'components.json'].includes(file)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted JSON: ${file}`);
      deletedJson++;
    } else if (file.endsWith('.mp3')) {
      fs.unlinkSync(filePath);
      console.log(`Deleted MP3: ${file}`);
      deletedMp3++;
    }
  }
});

console.log(`\n✓ Cleanup complete!`);
console.log(`  - Deleted ${deletedJson} JSON files`);
console.log(`  - Deleted ${deletedMp3} MP3 files`);
console.log(`  - Total: ${deletedJson + deletedMp3} files removed`);
