import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../public/data');

console.log('🔍 Scanning all room JSON files for missing keywords_dict...\n');

// Check if room has proper keywords_dict structure
function hasProperKeywords(data) {
  return !!(data.keywords || data.keywords_dict);
}

// Generate keywords array from entries
function generateKeywords(data, fileName) {
  // Check if entries exist and is an array
  if (!data.entries || !Array.isArray(data.entries)) {
    console.warn(`⚠️  ${fileName}: No entries array found`);
    return null;
  }
  
  const allKeywordsEn = new Set();
  const allKeywordsVi = new Set();

  // Collect all keywords from entries
  data.entries.forEach(entry => {
    if (entry.keywords_en) {
      entry.keywords_en.forEach(kw => allKeywordsEn.add(kw));
    }
    if (entry.keywords_vi) {
      entry.keywords_vi.forEach(kw => allKeywordsVi.add(kw));
    }
  });

  // Add room title keywords
  if (data.title?.en) {
    data.title.en.split(' ').forEach(word => {
      if (word.length > 3) allKeywordsEn.add(word.toLowerCase());
    });
  }
  if (data.title?.vi) {
    data.title.vi.split(' ').forEach(word => {
      if (word.length > 2) allKeywordsVi.add(word.toLowerCase());
    });
  }

  return {
    en: Array.from(allKeywordsEn).slice(0, 15),
    vi: Array.from(allKeywordsVi).slice(0, 15)
  };
}

// Fix audio format in entries
function fixAudioFormat(data, fileName) {
  let audioFixed = false;
  
  if (data.entries && Array.isArray(data.entries)) {
    data.entries.forEach((entry, index) => {
      // Convert string audio to object format
      if (entry.audio && typeof entry.audio === 'string') {
        entry.audio = { en: entry.audio };
        audioFixed = true;
      }
    });
  }
  
  // Remove root-level audio if present (incorrect structure)
  if (data.audio) {
    delete data.audio;
    audioFixed = true;
    console.log(`  ⚠️  Removed root-level audio from ${fileName}`);
  }
  
  return audioFixed;
}

// Basic Vietnamese translations
function translateToVietnamese(keywords) {
  const translations = {
    'machine': 'máy',
    'learning': 'học',
    'understanding': 'hiểu',
    'ethical': 'đạo đức',
    'ai': 'trí tuệ nhân tạo',
    'foundations': 'nền tảng',
    'fundamentals': 'cơ bản',
    'introduction': 'giới thiệu',
    'basics': 'cơ bản',
    'beginner': 'người mới',
    'advanced': 'nâng cao',
    'intermediate': 'trung cấp',
    'data': 'dữ liệu',
    'patterns': 'mẫu',
    'models': 'mô hình',
    'ethics': 'đạo đức',
    'fairness': 'công bằng',
    'privacy': 'riêng tư',
    'responsibility': 'trách nhiệm',
    'anxiety': 'lo âu',
    'stress': 'căng thẳng',
    'depression': 'trầm cảm',
    'mental': 'tinh thần',
    'health': 'sức khỏe',
    'wellness': 'sức khỏe tổng thể',
    'support': 'hỗ trợ',
    'help': 'giúp đỡ',
    'relief': 'giảm nhẹ',
    'breathing': 'hô hấp',
    'grounding': 'nền tảng',
    'social': 'xã hội',
    'nutrition': 'dinh dưỡng',
    'exercise': 'tập luyện',
    'sleep': 'ngủ',
    'mindfulness': 'chánh niệm'
  };
  
  return keywords.map(k => {
    const lower = k.toLowerCase();
    return translations[lower] || lower;
  });
}

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
let fixedCount = 0;
let alreadyOkCount = 0;
let errorCount = 0;

for (const file of files) {
  try {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    let modified = false;
    let changes = [];
    
    // Fix 1: Add keywords if missing
    if (!hasProperKeywords(data)) {
      const keywords = generateKeywords(data, file);
      
      if (keywords) {
        data.keywords = keywords;
        modified = true;
        changes.push(`keywords (${keywords.en.length} en, ${keywords.vi.length} vi)`);
      } else {
        console.error(`❌ ${file} - Could not generate keywords (no entries or invalid structure)`);
        errorCount++;
        continue;
      }
    } else {
      alreadyOkCount++;
    }
    
    // Fix 2: Fix audio format
    const audioFixed = fixAudioFormat(data, file);
    if (audioFixed) {
      modified = true;
      changes.push('audio format');
    }
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`🔧 ${file} - Fixed: ${changes.join(', ')}`);
      fixedCount++;
    } else if (!hasProperKeywords(data)) {
      console.log(`✅ ${file} - Already correct`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    errorCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`Total files scanned: ${files.length}`);
console.log(`✅ Already had keywords: ${alreadyOkCount}`);
console.log(`🔧 Fixed: ${fixedCount}`);
console.log(`❌ Errors: ${errorCount}`);

if (fixedCount > 0) {
  console.log(`\n✨ Successfully fixed ${fixedCount} room files!`);
}
