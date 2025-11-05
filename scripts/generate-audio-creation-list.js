const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dataDir = path.join(__dirname, '../public/data');
const audioDir = path.join(__dirname, '../public/audio');

console.log('Analyzing audio requirements...\n');

// Get all files
const jsonFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json') && !f.includes('package'));
const existingAudio = new Set(fs.readdirSync(audioDir).filter(f => f.endsWith('.mp3')));
const rootAudioFiles = new Set(fs.readdirSync(rootDir).filter(f => f.endsWith('.mp3')));

// Track all audio references with their context
const audioNeeds = new Map(); // filename -> [{jsonFile, textContent, language}]

jsonFiles.forEach(jsonFile => {
  try {
    const content = fs.readFileSync(path.join(dataDir, jsonFile), 'utf8');
    const data = JSON.parse(content);
    
    // Helper to extract audio references
    const processObject = (obj, parentKey = '') => {
      if (!obj || typeof obj !== 'object') return;
      
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'audio' && typeof value === 'string' && value.endsWith('.mp3')) {
          const filename = value.split('/').pop();
          if (!audioNeeds.has(filename)) {
            audioNeeds.set(filename, []);
          }
          
          // Try to find corresponding text content
          let textContent = '';
          let language = 'en';
          
          // Look for nearby text fields
          if (obj.replyEn) textContent = obj.replyEn;
          else if (obj.reply) textContent = obj.reply;
          else if (obj.content) textContent = obj.content;
          else if (obj.copy?.en) textContent = obj.copy.en;
          else if (obj.essay?.en) textContent = obj.essay.en;
          
          audioNeeds.get(filename).push({
            jsonFile,
            textContent,
            language,
            context: parentKey
          });
        } else if (key === 'audio' && typeof value === 'object') {
          // Handle nested audio objects like {en: "file.mp3", vi: "file2.mp3"}
          for (const [lang, audioPath] of Object.entries(value)) {
            if (typeof audioPath === 'string' && audioPath.endsWith('.mp3')) {
              const filename = audioPath.split('/').pop();
              if (!audioNeeds.has(filename)) {
                audioNeeds.set(filename, []);
              }
              
              let textContent = '';
              if (obj.essay && obj.essay[lang]) textContent = obj.essay[lang];
              else if (obj.copy && obj.copy[lang]) textContent = obj.copy[lang];
              else if (obj.content && obj.content[lang]) textContent = obj.content[lang];
              
              audioNeeds.get(filename).push({
                jsonFile,
                textContent,
                language: lang,
                context: parentKey
              });
            }
          }
        } else if (typeof value === 'object') {
          processObject(value, key);
        }
      }
    };
    
    processObject(data);
  } catch (error) {
    console.error(`Error processing ${jsonFile}:`, error.message);
  }
});

// Categorize files
const existsInPublic = [];
const existsInRoot = [];
const needsCreation = [];

for (const [filename, contexts] of audioNeeds.entries()) {
  if (existingAudio.has(filename)) {
    existsInPublic.push({ filename, contexts });
  } else if (rootAudioFiles.has(filename)) {
    existsInRoot.push({ filename, contexts });
  } else {
    needsCreation.push({ filename, contexts });
  }
}

// Generate comprehensive report
let report = '='.repeat(100) + '\n';
report += 'AUDIO FILES ANALYSIS FOR MP3 CREATION\n';
report += '='.repeat(100) + '\n\n';

report += `SUMMARY:\n`;
report += `-`.repeat(100) + '\n';
report += `Total audio files referenced: ${audioNeeds.size}\n`;
report += `Already in public/audio/: ${existsInPublic.length} ✓\n`;
report += `Available in root (can copy): ${existsInRoot.length} 📁\n`;
report += `Need to create: ${needsCreation.length} ❌\n\n`;

// Files that can be copied from root
if (existsInRoot.length > 0) {
  report += '\n' + '='.repeat(100) + '\n';
  report += `FILES AVAILABLE IN ROOT DIRECTORY (${existsInRoot.length} files)\n`;
  report += `Run: node scripts/auto-copy-missing-audio.js to copy these automatically\n`;
  report += '='.repeat(100) + '\n\n';
  
  existsInRoot.forEach(({ filename, contexts }) => {
    report += `📁 ${filename}\n`;
    report += `   Used in: ${contexts.map(c => c.jsonFile).join(', ')}\n\n`;
  });
}

// Files that need to be created
if (needsCreation.length > 0) {
  report += '\n' + '='.repeat(100) + '\n';
  report += `AUDIO FILES TO CREATE (${needsCreation.length} files)\n`;
  report += '='.repeat(100) + '\n\n';
  
  needsCreation.sort((a, b) => a.filename.localeCompare(b.filename));
  
  needsCreation.forEach(({ filename, contexts }, index) => {
    report += `${index + 1}. ${filename}\n`;
    report += '-'.repeat(100) + '\n';
    
    contexts.forEach(ctx => {
      report += `   JSON File: ${ctx.jsonFile}\n`;
      report += `   Language: ${ctx.language}\n`;
      if (ctx.context) report += `   Context: ${ctx.context}\n`;
      
      if (ctx.textContent) {
        const preview = ctx.textContent.substring(0, 200);
        report += `   Text: ${preview}${ctx.textContent.length > 200 ? '...' : ''}\n`;
      } else {
        report += `   Text: [NOT FOUND - Check JSON manually]\n`;
      }
      report += '\n';
    });
    report += '\n';
  });
}

// Generate JSON output for easy processing
const jsonOutput = {
  summary: {
    total: audioNeeds.size,
    existsInPublic: existsInPublic.length,
    existsInRoot: existsInRoot.length,
    needsCreation: needsCreation.length
  },
  canCopyFromRoot: existsInRoot.map(({ filename, contexts }) => ({
    filename,
    usedIn: contexts.map(c => c.jsonFile)
  })),
  needsCreation: needsCreation.map(({ filename, contexts }) => ({
    filename,
    references: contexts.map(c => ({
      jsonFile: c.jsonFile,
      language: c.language,
      textContent: c.textContent || '[TEXT NOT FOUND]',
      context: c.context
    }))
  }))
};

// Save outputs
fs.writeFileSync(path.join(__dirname, '../public/audio-creation-report.txt'), report);
fs.writeFileSync(path.join(__dirname, '../public/audio-creation-data.json'), JSON.stringify(jsonOutput, null, 2));

console.log(report);
console.log('\n' + '='.repeat(100));
console.log('✓ Report saved to: public/audio-creation-report.txt');
console.log('✓ JSON data saved to: public/audio-creation-data.json');
console.log('='.repeat(100));

// List JSON files that have missing audio
const jsonFilesWithMissingAudio = new Set();
needsCreation.forEach(({ contexts }) => {
  contexts.forEach(ctx => jsonFilesWithMissingAudio.add(ctx.jsonFile));
});

if (jsonFilesWithMissingAudio.size > 0) {
  console.log('\n📋 JSON FILES WITH MISSING AUDIO:');
  console.log('-'.repeat(100));
  Array.from(jsonFilesWithMissingAudio).sort().forEach((file, idx) => {
    console.log(`${idx + 1}. ${file}`);
  });
}
