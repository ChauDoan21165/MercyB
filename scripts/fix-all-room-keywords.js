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

// Generate keywords_dict from entries
function generateKeywordsDict(data, fileName) {
  const keywords = {};
  
  // Check if entries exist and is an array
  if (!data.entries || !Array.isArray(data.entries)) {
    console.warn(`⚠️  ${fileName}: No entries array found`);
    return null;
  }
  
  // Build keywords_dict from entries
  data.entries.forEach(entry => {
    const slug = entry.slug || entry.id;
    if (!slug) {
      console.warn(`⚠️  ${fileName}: Entry missing slug/id`);
      return;
    }
    
    // Get keywords from entry
    const keywordsEn = entry.keywords_en || [];
    const keywordsVi = entry.keywords_vi || [];
    
    // If no keywords in entry, generate from slug
    if (keywordsEn.length === 0) {
      const slugWords = slug.split('-').map(w => w.toLowerCase());
      keywordsEn.push(...slugWords);
    }
    
    if (keywordsVi.length === 0) {
      keywordsVi.push(...translateToVietnamese(keywordsEn));
    }
    
    keywords[slug] = {
      en: keywordsEn,
      vi: keywordsVi,
      slug_vi: keywordsVi // Also add slug_vi for compatibility
    };
  });
  
  return Object.keys(keywords).length > 0 ? keywords : null;
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
    
    if (hasProperKeywords(data)) {
      console.log(`✅ ${file} - Already has keywords`);
      alreadyOkCount++;
      continue;
    }
    
    // Generate keywords_dict from entries
    const keywordsDict = generateKeywordsDict(data, file);
    
    if (!keywordsDict) {
      console.error(`❌ ${file} - Could not generate keywords (no entries or invalid structure)`);
      errorCount++;
      continue;
    }
    
    // Add keywords to the data
    const updatedData = {
      ...data,
      keywords: keywordsDict
    };
    
    // Write back
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    console.log(`🔧 ${file} - Added keywords_dict with ${Object.keys(keywordsDict).length} entries`);
    fixedCount++;
    
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
