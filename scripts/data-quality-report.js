import { readdir, readFile, access } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const DATA_DIR = join(projectRoot, 'public', 'data');
const AUDIO_DIR = join(projectRoot, 'public', 'audio');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m',
};

const stats = {
  totalFiles: 0,
  totalEntries: 0,
  filesWithKeywords: 0,
  entriesWithKeywords: 0,
  totalAudioReferences: 0,
  missingAudioFiles: 0,
  existingAudioFiles: 0,
  fileDetails: [],
};

async function fileExists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function analyzeAudioReferences(data) {
  const audioRefs = [];
  const checkAudio = async (audioPath, context) => {
    if (!audioPath || typeof audioPath !== 'string') return null;
    
    const cleanPath = audioPath.replace(/^\//, '');
    const fullPath = join(AUDIO_DIR, cleanPath);
    const exists = await fileExists(fullPath);
    
    return { path: audioPath, exists, context };
  };

  // Check top-level audio
  if (data.audio) {
    if (typeof data.audio === 'object') {
      for (const [lang, path] of Object.entries(data.audio)) {
        const result = await checkAudio(path, `top-level.audio.${lang}`);
        if (result) audioRefs.push(result);
      }
    } else {
      const result = await checkAudio(data.audio, 'top-level.audio');
      if (result) audioRefs.push(result);
    }
  }

  // Check entries
  if (data.entries) {
    const entriesList = Array.isArray(data.entries) ? data.entries : Object.values(data.entries);
    
    for (let i = 0; i < entriesList.length; i++) {
      const entry = entriesList[i];
      const identifier = entry.slug || entry.keywordEn || entry.id || `entry[${i}]`;
      
      const audioFields = ['audio', 'audioFile', 'audio_file'];
      for (const field of audioFields) {
        if (entry[field]) {
          const audioValue = entry[field];
          
          if (typeof audioValue === 'object') {
            for (const [lang, path] of Object.entries(audioValue)) {
              const result = await checkAudio(path, `${identifier}.${field}.${lang}`);
              if (result) audioRefs.push(result);
            }
          } else {
            const result = await checkAudio(audioValue, `${identifier}.${field}`);
            if (result) audioRefs.push(result);
          }
        }
      }
    }
  }

  return audioRefs;
}

function hasKeywords(data) {
  // Check top-level keywords
  if (data.keywords_en || data.keywords_vi || data.keywords) return true;
  if (data.keywords_dict && Object.keys(data.keywords_dict).length > 0) return true;
  
  // Check entry-level keywords
  if (data.entries) {
    const entriesList = Array.isArray(data.entries) ? data.entries : Object.values(data.entries);
    return entriesList.some(entry => 
      entry.keywords_en || entry.keywords_vi || entry.keywords || entry.keywordEn
    );
  }
  
  return false;
}

function countEntriesWithKeywords(data) {
  if (!data.entries) return 0;
  
  const entriesList = Array.isArray(data.entries) ? data.entries : Object.values(data.entries);
  return entriesList.filter(entry => 
    entry.keywords_en || entry.keywords_vi || entry.keywords || entry.keywordEn
  ).length;
}

async function analyzeFile(filePath, filename) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    const entriesList = Array.isArray(data.entries) 
      ? data.entries 
      : (data.entries ? Object.values(data.entries) : []);
    
    const entryCount = entriesList.length;
    const fileHasKeywords = hasKeywords(data);
    const entriesWithKeywords = countEntriesWithKeywords(data);
    const audioRefs = await analyzeAudioReferences(data);
    
    const audioStats = {
      total: audioRefs.length,
      existing: audioRefs.filter(a => a.exists).length,
      missing: audioRefs.filter(a => !a.exists).length,
    };

    stats.totalFiles++;
    stats.totalEntries += entryCount;
    if (fileHasKeywords) stats.filesWithKeywords++;
    stats.entriesWithKeywords += entriesWithKeywords;
    stats.totalAudioReferences += audioStats.total;
    stats.existingAudioFiles += audioStats.existing;
    stats.missingAudioFiles += audioStats.missing;

    stats.fileDetails.push({
      filename,
      entryCount,
      hasKeywords: fileHasKeywords,
      entriesWithKeywords,
      keywordCoverage: entryCount > 0 ? (entriesWithKeywords / entryCount * 100).toFixed(1) : 0,
      audioStats,
      tier: data.meta?.tier || 'unknown',
    });

  } catch (error) {
    console.error(`${colors.red}Error analyzing ${filename}:${colors.reset}`, error.message);
  }
}

function printSummary() {
  console.log(`\n${colors.bold}${colors.blue}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}                   OVERALL STATISTICS${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}${'═'.repeat(60)}${colors.reset}\n`);

  console.log(`${colors.cyan}📊 Files:${colors.reset}          ${stats.totalFiles}`);
  console.log(`${colors.cyan}📝 Total Entries:${colors.reset}  ${stats.totalEntries}`);
  console.log(`${colors.cyan}🔑 Avg Entries/File:${colors.reset} ${(stats.totalEntries / stats.totalFiles).toFixed(1)}`);
  
  console.log(`\n${colors.bold}Keyword Coverage:${colors.reset}`);
  console.log(`  ${colors.green}Files with keywords:${colors.reset}    ${stats.filesWithKeywords}/${stats.totalFiles} (${(stats.filesWithKeywords / stats.totalFiles * 100).toFixed(1)}%)`);
  console.log(`  ${colors.green}Entries with keywords:${colors.reset}  ${stats.entriesWithKeywords}/${stats.totalEntries} (${(stats.entriesWithKeywords / stats.totalEntries * 100).toFixed(1)}%)`);

  console.log(`\n${colors.bold}Audio File Status:${colors.reset}`);
  console.log(`  ${colors.green}✓ Existing:${colors.reset}  ${stats.existingAudioFiles}/${stats.totalAudioReferences} (${stats.totalAudioReferences > 0 ? (stats.existingAudioFiles / stats.totalAudioReferences * 100).toFixed(1) : 0}%)`);
  console.log(`  ${colors.red}✗ Missing:${colors.reset}   ${stats.missingAudioFiles}/${stats.totalAudioReferences} (${stats.totalAudioReferences > 0 ? (stats.missingAudioFiles / stats.totalAudioReferences * 100).toFixed(1) : 0}%)`);
}

function printDetailedReport() {
  console.log(`\n${colors.bold}${colors.blue}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}                   FILE-BY-FILE REPORT${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}${'═'.repeat(60)}${colors.reset}\n`);

  // Sort by entry count (descending)
  const sorted = [...stats.fileDetails].sort((a, b) => b.entryCount - a.entryCount);

  for (const file of sorted) {
    console.log(`${colors.bold}${file.filename}${colors.reset}`);
    console.log(`  Tier: ${file.tier}`);
    console.log(`  Entries: ${file.entryCount}`);
    
    const keywordColor = file.keywordCoverage >= 80 ? colors.green : file.keywordCoverage >= 50 ? colors.yellow : colors.red;
    console.log(`  Keyword Coverage: ${keywordColor}${file.keywordCoverage}%${colors.reset} (${file.entriesWithKeywords}/${file.entryCount} entries)`);
    
    const audioColor = file.audioStats.missing === 0 ? colors.green : file.audioStats.missing < file.audioStats.total / 2 ? colors.yellow : colors.red;
    console.log(`  Audio Files: ${audioColor}${file.audioStats.existing}/${file.audioStats.total} present${colors.reset}`);
    console.log('');
  }
}

function printRecommendations() {
  console.log(`${colors.bold}${colors.blue}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}                   RECOMMENDATIONS${colors.reset}`);
  console.log(`${colors.bold}${colors.blue}${'═'.repeat(60)}${colors.reset}\n`);

  const recommendations = [];

  // Keyword coverage recommendations
  const keywordCoverage = (stats.entriesWithKeywords / stats.totalEntries * 100);
  if (keywordCoverage < 80) {
    recommendations.push(`${colors.yellow}⚠${colors.reset} Improve keyword coverage (currently ${keywordCoverage.toFixed(1)}%)`);
  }

  // Audio file recommendations
  if (stats.missingAudioFiles > 0) {
    const audioPresence = (stats.existingAudioFiles / stats.totalAudioReferences * 100);
    recommendations.push(`${colors.red}✗${colors.reset} Fix missing audio files (${stats.missingAudioFiles} missing, ${audioPresence.toFixed(1)}% present)`);
  }

  // Files without keywords
  const filesWithoutKeywords = stats.totalFiles - stats.filesWithKeywords;
  if (filesWithoutKeywords > 0) {
    recommendations.push(`${colors.yellow}⚠${colors.reset} ${filesWithoutKeywords} file(s) have no keywords at all`);
  }

  // Low entry count files
  const lowEntryFiles = stats.fileDetails.filter(f => f.entryCount < 10);
  if (lowEntryFiles.length > 0) {
    recommendations.push(`${colors.cyan}ℹ${colors.reset} ${lowEntryFiles.length} file(s) have fewer than 10 entries`);
  }

  if (recommendations.length === 0) {
    console.log(`${colors.green}✓ No issues found - data quality looks excellent!${colors.reset}\n`);
  } else {
    recommendations.forEach(rec => console.log(rec));
    console.log('');
  }
}

async function main() {
  console.log(`${colors.bold}${colors.magenta}${'═'.repeat(60)}${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}            DATA QUALITY REPORT${colors.reset}`);
  console.log(`${colors.bold}${colors.magenta}${'═'.repeat(60)}${colors.reset}\n`);

  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json') && !f.startsWith('.'));

  console.log(`${colors.cyan}Analyzing ${jsonFiles.length} JSON files...${colors.reset}\n`);

  for (const file of jsonFiles) {
    const filePath = join(DATA_DIR, file);
    await analyzeFile(filePath, file);
  }

  printSummary();
  printDetailedReport();
  printRecommendations();

  console.log(`${colors.bold}${colors.magenta}${'═'.repeat(60)}${colors.reset}\n`);
}

main().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
