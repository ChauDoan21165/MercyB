const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const publicDataDir = path.join(__dirname, '../public/data');
const publicAudioDir = path.join(__dirname, '../public/audio');

// Get all files
const rootFiles = fs.readdirSync(rootDir);
const publicDataFiles = fs.readdirSync(publicDataDir);
const publicAudioFiles = fs.readdirSync(publicAudioDir);

// Filter by type
const rootJsonFiles = rootFiles.filter(f => f.endsWith('.json') && !f.includes('package'));
const rootMp3Files = rootFiles.filter(f => f.endsWith('.mp3'));

const publicJsonFiles = publicDataFiles.filter(f => f.endsWith('.json'));
const publicMp3Files = publicAudioFiles.filter(f => f.endsWith('.mp3'));

// Find files in root but not in public
const jsonOnlyInRoot = rootJsonFiles.filter(f => !publicJsonFiles.includes(f));
const mp3OnlyInRoot = rootMp3Files.filter(f => !publicMp3Files.includes(f));

// Check which root files are referenced in JSON data files
const referencedAudioInData = new Set();
publicJsonFiles.forEach(file => {
  try {
    const content = fs.readFileSync(path.join(publicDataDir, file), 'utf8');
    const audioMatches = content.match(/"audio":\s*"([^"]+\.mp3)"/g) || [];
    audioMatches.forEach(match => {
      const audioFile = match.match(/"audio":\s*"([^"]+\.mp3)"/)[1];
      const fileName = audioFile.split('/').pop();
      referencedAudioInData.add(fileName);
    });
    
    const nestedMatches = content.match(/"en":\s*"([^"]+\.mp3)"/g) || [];
    nestedMatches.forEach(match => {
      const audioFile = match.match(/"en":\s*"([^"]+\.mp3)"/)[1];
      const fileName = audioFile.split('/').pop();
      referencedAudioInData.add(fileName);
    });
  } catch (error) {
    // Skip invalid files
  }
});

// Find useful files - audio files that exist in root but missing in public/audio AND referenced in data
const usefulAudioFiles = mp3OnlyInRoot.filter(f => referencedAudioInData.has(f));

// Generate report
let report = '='.repeat(80) + '\n';
report += 'ROOT vs PUBLIC DIRECTORY COMPARISON\n';
report += '='.repeat(80) + '\n\n';

report += `SUMMARY:\n`;
report += `-`.repeat(80) + '\n';
report += `JSON files only in root: ${jsonOnlyInRoot.length}\n`;
report += `MP3 files only in root: ${mp3OnlyInRoot.length}\n`;
report += `JSON files in public/data: ${publicJsonFiles.length}\n`;
report += `MP3 files in public/audio: ${publicMp3Files.length}\n\n`;

report += `USEFUL FILES TO MOVE FROM ROOT:\n`;
report += `-`.repeat(80) + '\n';
report += `Audio files in root that are referenced in JSON but missing in public/audio: ${usefulAudioFiles.length}\n\n`;

if (usefulAudioFiles.length > 0) {
  report += 'FILES TO COPY FROM ROOT TO public/audio/:\n\n';
  usefulAudioFiles.sort().forEach((file, idx) => {
    report += `${idx + 1}. ${file}\n`;
  });
  report += '\n';
}

report += `\nJSON FILES ONLY IN ROOT (${jsonOnlyInRoot.length}):\n`;
report += `-`.repeat(80) + '\n';
if (jsonOnlyInRoot.length > 0) {
  jsonOnlyInRoot.sort().forEach((file, idx) => {
    // Check if similar named file exists in public/data
    const basename = file.replace(/[_\s]\d+\.json$/, '.json');
    const existsInPublic = publicJsonFiles.some(pf => 
      pf.toLowerCase() === file.toLowerCase() || 
      pf.toLowerCase() === basename.toLowerCase()
    );
    
    if (existsInPublic) {
      report += `${idx + 1}. ${file} - (duplicate, likely outdated)\n`;
    } else {
      report += `${idx + 1}. ${file} - (UNIQUE - may be useful)\n`;
    }
  });
} else {
  report += 'None\n';
}

report += `\n\nAUDIO FILES ONLY IN ROOT (${mp3OnlyInRoot.length}):\n`;
report += `-`.repeat(80) + '\n';
if (mp3OnlyInRoot.length > 0) {
  mp3OnlyInRoot.sort().forEach((file, idx) => {
    const isReferenced = referencedAudioInData.has(file);
    const status = isReferenced ? '*** NEEDED ***' : '(unreferenced)';
    report += `${idx + 1}. ${file} ${status}\n`;
  });
} else {
  report += 'None\n';
}

report += '\n\nRECOMMENDATIONS:\n';
report += `-`.repeat(80) + '\n';
report += `1. Copy ${usefulAudioFiles.length} audio files from root to public/audio/\n`;
report += `2. Review ${jsonOnlyInRoot.length} JSON files in root - most are likely duplicates\n`;
report += `3. After copying useful files, run cleanup script to remove root files\n`;

// Save report
const reportPath = path.join(__dirname, '../public/root-vs-public-comparison.txt');
fs.writeFileSync(reportPath, report);

// Also create a move script
if (usefulAudioFiles.length > 0) {
  let moveScript = '#!/bin/bash\n\n';
  moveScript += '# Script to copy useful audio files from root to public/audio/\n\n';
  usefulAudioFiles.forEach(file => {
    moveScript += `cp "${file}" "public/audio/${file}"\n`;
  });
  moveScript += '\necho "Copied ${usefulAudioFiles.length} files to public/audio/"\n';
  
  const scriptPath = path.join(__dirname, '../scripts/copy-useful-audio.sh');
  fs.writeFileSync(scriptPath, moveScript);
  fs.chmodSync(scriptPath, '755');
}

console.log(report);
console.log(`\n✓ Report saved to: public/root-vs-public-comparison.txt`);
if (usefulAudioFiles.length > 0) {
  console.log(`✓ Copy script created: scripts/copy-useful-audio.sh`);
}
