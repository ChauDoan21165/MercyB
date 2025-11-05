// scripts/fix-all-json.js
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..');

if (!fs.existsSync(DATA_DIR)) {
  console.error(`❌ Không tìm thấy: ${DATA_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(DATA_DIR).filter(f => 
  f.endsWith('.json') && 
  !['package.json', 'package-lock.json', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'components.json'].includes(f)
);
console.log(`🔍 Tìm thấy ${files.length} file JSON. Đang sửa...\n`);

let fixedCount = 0;

files.forEach(filename => {
  const filePath = path.join(DATA_DIR, filename);
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf-8');
  } catch (e) {
    console.error(`❌ Không đọc được: ${filename}`);
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error(`❌ JSON lỗi: ${filename} → ${e.message}`);
    return;
  }

  const normalized = {
    tier: mapTier(data.meta?.tier || data.tier || 'free'),
    title: {
      en: data.name || data.title?.en || 'Untitled',
      vi: data.name_vi || data.title?.vi || 'Chưa có tên'
    },
    content: {
      en: (data.description || data.content?.en || 'No description.') + ' Discover deeper guidance in higher tiers.',
      vi: (data.description_vi || data.content?.vi || 'Không có mô tả.') + ' Khám phá thêm ở cấp độ cao hơn.'
    },
    entries: (data.entries || []).map((entry, i) => {
      const titleEn = entry.title || entry.reply_en || `Entry ${i + 1}`;
      const slug = entry.slug || generateSlug(titleEn);
      return {
        slug,
        keywords_en: normalizeKeywords(entry.keywords_en, titleEn.split(' ')[0]),
        keywords_vi: normalizeKeywords(entry.keywords_vi, entry.title_vi || entry.keywords_vi?.[0] || `Mục ${i + 1}`),
        copy: {
          en: entry.reply_en || entry.copy?.en || 'Content missing.',
          vi: entry.reply_vi || entry.copy?.vi || 'Nội dung bị thiếu.'
        },
        tags: generateTags(entry.tags || entry.keywords_en || [titleEn.toLowerCase()]),
        audio: extractAudio(entry.audio)
      };
    })
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(normalized, null, 2) + '\n');
    console.log(`✅ ĐÃ SỬA: ${filename}`);
    fixedCount++;
  } catch (e) {
    console.error(`❌ Không ghi được: ${filename}`);
  }
});

console.log(`\n🎉 HOÀN TẤT! ĐÃ SỬA ${fixedCount}/${files.length} FILE JSON!`);

function mapTier(tier) {
  const map = { free: 'Free / Miễn phí', vip1: 'VIP1 / VIP1', vip2: 'VIP2 / VIP2', vip3: 'VIP3 / VIP3' };
  return map[(tier || '').toLowerCase()] || 'Free / Miễn phí';
}

function generateSlug(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeKeywords(arr, fallback) {
  if (!Array.isArray(arr) || arr.length === 0) arr = [fallback];
  return arr.slice(0, 5).map(s => s.trim());
}

function generateTags(tags) {
  if (!Array.isArray(tags)) tags = [];
  return [...new Set(tags.map(t => t.toLowerCase().trim()))].slice(0, 4);
}

function extractAudio(audio) {
  if (typeof audio === 'string') return audio;
  if (audio?.en) return audio.en;
  return 'missing_audio.mp3';
}