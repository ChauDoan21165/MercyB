// Standardize all audio file names to lowercase snake_case
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

// Function to convert to lowercase snake_case
function toSnakeCase(str) {
  return str
    .replace(/\.mp3$/, '') // Remove .mp3 extension
    .replace(/([A-Z])/g, '_$1') // Add underscore before capitals
    .replace(/[\s-]+/g, '_') // Replace spaces and hyphens with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_/, '') // Remove leading underscore
    .toLowerCase() + '.mp3';
}

// Process a single JSON file
function processJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    let modified = false;

    // Process entries array
    if (json.entries && Array.isArray(json.entries)) {
      json.entries.forEach(entry => {
        if (entry.audio) {
          if (typeof entry.audio === 'string') {
            const newAudio = toSnakeCase(entry.audio);
            if (newAudio !== entry.audio) {
              console.log(`${path.basename(filePath)}: ${entry.audio} → ${newAudio}`);
              entry.audio = newAudio;
              modified = true;
            }
          } else if (typeof entry.audio === 'object') {
            // Handle en/vi audio objects
            for (const [lang, audioPath] of Object.entries(entry.audio)) {
              if (typeof audioPath === 'string') {
                const newAudio = toSnakeCase(audioPath);
                if (newAudio !== audioPath) {
                  console.log(`${path.basename(filePath)}: ${audioPath} → ${newAudio}`);
                  entry.audio[lang] = newAudio;
                  modified = true;
                }
              }
            }
          }
        }
      });
    }

    // Process top-level audio field
    if (json.audio && typeof json.audio === 'string') {
      const newAudio = toSnakeCase(json.audio);
      if (newAudio !== json.audio) {
        console.log(`${path.basename(filePath)} (root): ${json.audio} → ${newAudio}`);
        json.audio = newAudio;
        modified = true;
      }
    }

    // Save if modified
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
      console.log(`✓ Updated ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Find and process all JSON files in root directory
fs.readdirSync(rootDir).forEach(file => {
  if (file.endsWith('.json') && 
      file !== 'package.json' && 
      file !== 'package-lock.json' &&
      file !== 'tsconfig.json' &&
      file !== 'tsconfig.app.json' &&
      file !== 'tsconfig.node.json' &&
      file !== 'components.json') {
    const filePath = path.join(rootDir, file);
    processJsonFile(filePath);
  }
});

console.log('\n✓ Audio file name standardization complete!');
