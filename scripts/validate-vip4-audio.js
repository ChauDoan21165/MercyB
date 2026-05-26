const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../public/data');
const AUDIO_DIR = path.join(__dirname, '../public/audio');

// VIP4 Career room files
const VIP4_FILES = [
  'Discover_Self_vip4_career_1.json',
  'Explore_World_vip4_career_I_2.json',
  'Explore_World_vip4_career_II_2.json',
  'Build_Skills_vip4_career_3.json',
  'Build_Skills_vip4_career_3_II.json',
  'Launch_Career_vip4_career_4_II.json',
  'Grow_Wealth_vip4_career_6.json'
];

function validateAudio() {
  console.log('🔍 Validating VIP4 Career Room Audio Files...\n');
  
  let totalEntries = 0;
  let totalAudioRefs = 0;
  let foundFiles = 0;
  let missingFiles = 0;
  const missing = [];
  
  // Get all actual audio files in public/audio
  const audioFiles = new Set();
  function scanAudioDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        scanAudioDir(fullPath);
      } else if (file.endsWith('.mp3')) {
        // Store relative path from audio directory
        const relativePath = path.relative(AUDIO_DIR, fullPath).replace(/\\/g, '/');
        audioFiles.add(relativePath);
        audioFiles.add(file); // Also store just the filename
      }
    });
  }
  scanAudioDir(AUDIO_DIR);
  
  console.log(`📁 Found ${audioFiles.size} audio files in public/audio/\n`);
  
  // Check each VIP4 room file
  VIP4_FILES.forEach(filename => {
    const filePath = path.join(DATA_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filename}`);
      return;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const entries = data.entries || [];
    totalEntries += entries.length;
    
    console.log(`\n📄 ${filename} (${entries.length} entries)`);
    console.log('─'.repeat(60));
    
    entries.forEach(entry => {
      if (entry.audio) {
        totalAudioRefs++;
        
        // Handle both string and object audio references
        const audioRefs = typeof entry.audio === 'string' 
          ? [entry.audio] 
          : Object.values(entry.audio);
        
        audioRefs.forEach(audioFile => {
          if (!audioFile) return;
          
          // Clean the audio file path
          const cleanPath = audioFile.replace(/^\//, '').replace(/^audio\//, '');
          
          // Check if file exists (try both with and without audio/ prefix)
          const exists = audioFiles.has(cleanPath) || 
                        audioFiles.has(`audio/${cleanPath}`) ||
                        audioFiles.has(audioFile);
          
          if (exists) {
            foundFiles++;
            console.log(`  ✅ ${entry.slug}: ${audioFile}`);
          } else {
            missingFiles++;
            missing.push({ room: filename, slug: entry.slug, audio: audioFile });
            console.log(`  ❌ ${entry.slug}: ${audioFile} - MISSING`);
          }
        });
      } else {
        console.log(`  ⚠️  ${entry.slug}: No audio reference`);
      }
    });
  });
  
  // Summary
  console.log('\n' + '═'.repeat(60));
  console.log('📊 VALIDATION SUMMARY');
  console.log('═'.repeat(60));
  console.log(`Total VIP4 rooms checked: ${VIP4_FILES.length}`);
  console.log(`Total entries: ${totalEntries}`);
  console.log(`Total audio references: ${totalAudioRefs}`);
  console.log(`✅ Found: ${foundFiles}`);
  console.log(`❌ Missing: ${missingFiles}`);
  
  if (missingFiles > 0) {
    console.log('\n🚨 MISSING AUDIO FILES:');
    missing.forEach(({ room, slug, audio }) => {
      console.log(`  - ${room} / ${slug}: ${audio}`);
    });
    console.log('\n💡 TIP: Check if files need to be renamed or uploaded to public/audio/');
  } else {
    console.log('\n✨ All audio files validated successfully!');
  }
  
  return missingFiles === 0;
}

// Run validation
const success = validateAudio();
process.exit(success ? 0 : 1);
