import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '../public/data');

// Generate keywords from room name/slug
function generateKeywords(fileName, content) {
  const baseName = fileName.replace('.json', '').replace(/_/g, ' ');
  const words = baseName.split(' ').filter(w => !['vip1', 'vip2', 'vip3', 'free'].includes(w.toLowerCase()));
  
  const keywords = words.map(w => w.toLowerCase());
  
  // Add common related terms based on content
  const text = JSON.stringify(content).toLowerCase();
  if (text.includes('nutrition') || text.includes('eating') || text.includes('meal')) {
    keywords.push('nutrition', 'eating', 'meal', 'diet', 'food');
  }
  if (text.includes('mental') || text.includes('mind') || text.includes('cognitive')) {
    keywords.push('mental', 'mind', 'cognitive', 'thinking');
  }
  if (text.includes('exercise') || text.includes('fitness') || text.includes('physical')) {
    keywords.push('exercise', 'fitness', 'physical', 'activity');
  }
  if (text.includes('anxiety') || text.includes('stress') || text.includes('worry')) {
    keywords.push('anxiety', 'stress', 'worry', 'calm');
  }
  if (text.includes('depression') || text.includes('mood') || text.includes('sad')) {
    keywords.push('depression', 'mood', 'emotions', 'feelings');
  }
  
  return [...new Set(keywords)];
}

// Vietnamese translation helpers (basic)
function translateToVietnamese(keywords) {
  const translations = {
    'nutrition': 'dinh dưỡng',
    'eating': 'ăn uống',
    'meal': 'bữa ăn',
    'diet': 'chế độ ăn',
    'food': 'thực phẩm',
    'mental': 'tinh thần',
    'mind': 'tâm trí',
    'cognitive': 'nhận thức',
    'thinking': 'tư duy',
    'exercise': 'tập luyện',
    'fitness': 'thể dục',
    'physical': 'thể chất',
    'activity': 'hoạt động',
    'anxiety': 'lo âu',
    'stress': 'căng thẳng',
    'worry': 'lo lắng',
    'calm': 'bình tĩnh',
    'depression': 'trầm cảm',
    'mood': 'tâm trạng',
    'emotions': 'cảm xúc',
    'feelings': 'cảm giác',
    'health': 'sức khỏe',
    'wellness': 'sức khỏe tổng thể',
    'support': 'hỗ trợ',
    'help': 'giúp đỡ',
    'life': 'cuộc sống',
    'meaning': 'ý nghĩa',
    'purpose': 'mục đích',
  };
  
  return keywords.map(k => translations[k] || k);
}

// Check if file has any keyword structure
function hasKeywords(data) {
  return !!(
    data.keywords_en ||
    data.keywords_vi ||
    data.keywords ||
    data.keywords_dict ||
    data.keyword_menu
  );
}

console.log('Scanning for JSON files missing keywords...\n');

const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
const filesNeedingKeywords = [];

for (const file of files) {
  try {
    const filePath = path.join(dataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    if (!hasKeywords(data)) {
      filesNeedingKeywords.push(file);
      
      // Generate keywords
      const keywordsEn = generateKeywords(file, data);
      const keywordsVi = translateToVietnamese(keywordsEn);
      
      // Add keywords to the data
      const updatedData = {
        ...data,
        keywords_en: keywordsEn.slice(0, 10), // Limit to 10 keywords
        keywords_vi: keywordsVi.slice(0, 10)
      };
      
      // Write back
      fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
      console.log(`✅ Added keywords to: ${file}`);
      console.log(`   EN: ${keywordsEn.slice(0, 5).join(', ')}`);
      console.log(`   VI: ${keywordsVi.slice(0, 5).join(', ')}\n`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
}

console.log(`\n📊 Summary:`);
console.log(`Total files scanned: ${files.length}`);
console.log(`Files updated: ${filesNeedingKeywords.length}`);
console.log(`Files already had keywords: ${files.length - filesNeedingKeywords.length}`);
