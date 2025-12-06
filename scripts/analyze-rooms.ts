/**
 * Room Metrics Analyzer
 * Generates room-metrics.json for strategist AI consumption
 * Run with: npx tsx scripts/analyze-rooms.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const publicDataDir = path.join(projectRoot, 'public', 'data');
const outputPath = path.join(publicDataDir, 'room-metrics.json');

interface RoomMetrics {
  id: string;
  tier: string;
  domain: string;
  title_en: string;
  title_vi: string;
  entry_count: number;
  approx_words_en: number;
  approx_words_vi: number;
}

interface TierStats {
  rooms: number;
  entries: number;
  approx_words_en: number;
  approx_words_vi: number;
}

interface SummaryMetrics {
  by_tier: Record<string, TierStats>;
  by_domain: Record<string, TierStats>;
  total_rooms: number;
  total_entries: number;
  total_words_en: number;
  total_words_vi: number;
  generated_at: string;
}

interface MetricsOutput {
  rooms: RoomMetrics[];
  summary: SummaryMetrics;
}

// Count words in a string
function countWords(text: string): number {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// Extract text content from various JSON structures
function extractTextContent(json: any): { en: string; vi: string } {
  let enText = '';
  let viText = '';
  
  // Room-level content
  if (json.content) {
    if (typeof json.content === 'object') {
      enText += (json.content.en || '') + ' ';
      viText += (json.content.vi || '') + ' ';
    } else if (typeof json.content === 'string') {
      enText += json.content + ' ';
    }
  }
  
  if (json.room_essay) {
    if (typeof json.room_essay === 'object') {
      enText += (json.room_essay.en || '') + ' ';
      viText += (json.room_essay.vi || '') + ' ';
    }
  }
  
  if (json.room_essay_en) enText += json.room_essay_en + ' ';
  if (json.room_essay_vi) viText += json.room_essay_vi + ' ';
  
  // Entry-level content
  const entries = json.entries || json.items || [];
  for (const entry of entries) {
    // Various content field patterns
    if (entry.copy_en) enText += entry.copy_en + ' ';
    if (entry.copy_vi) viText += entry.copy_vi + ' ';
    if (entry.content_en) enText += entry.content_en + ' ';
    if (entry.content_vi) viText += entry.content_vi + ' ';
    if (entry.text_en) enText += entry.text_en + ' ';
    if (entry.text_vi) viText += entry.text_vi + ' ';
    
    if (entry.copy) {
      if (typeof entry.copy === 'object') {
        enText += (entry.copy.en || '') + ' ';
        viText += (entry.copy.vi || '') + ' ';
      }
    }
    
    if (entry.content) {
      if (typeof entry.content === 'object') {
        enText += (entry.content.en || '') + ' ';
        viText += (entry.content.vi || '') + ' ';
      }
    }
  }
  
  return { en: enText, vi: viText };
}

// Normalize tier
function normalizeTier(tier: string): string {
  const t = (tier || '').toLowerCase();
  if (t.includes('vip9')) return 'vip9';
  if (t.includes('vip8')) return 'vip8';
  if (t.includes('vip7')) return 'vip7';
  if (t.includes('vip6')) return 'vip6';
  if (t.includes('vip5')) return 'vip5';
  if (t.includes('vip4')) return 'vip4';
  if (t.includes('vip3')) return 'vip3';
  if (t.includes('vip2')) return 'vip2';
  if (t.includes('vip1')) return 'vip1';
  if (t.includes('kids')) return 'kids';
  return 'free';
}

// Detect domain
function detectDomain(json: any): string {
  const domain = (json.domain || '').toLowerCase();
  const id = (json.id || '').toLowerCase();
  
  if (domain.includes('english') || id.includes('english')) return 'english';
  if (domain.includes('health') || id.includes('health') || id.includes('anxiety') || id.includes('depression')) return 'health';
  if (domain.includes('strategy') || id.includes('strategy')) return 'strategy';
  if (domain.includes('martial') || id.includes('martial')) return 'martial';
  if (domain.includes('kids') || id.includes('kids')) return 'kids';
  if (domain.includes('career') || id.includes('career')) return 'career';
  if (domain.includes('relationship') || id.includes('relationship')) return 'relationship';
  if (domain.includes('finance') || id.includes('finance')) return 'finance';
  if (domain) return domain.split(/[\s\/]+/)[0];
  return 'general';
}

// Extract titles
function extractTitles(json: any): { en: string; vi: string } {
  let en = '';
  let vi = '';
  
  if (json.title) {
    if (typeof json.title === 'object') {
      en = json.title.en || json.title.english || '';
      vi = json.title.vi || json.title.vietnamese || '';
    } else {
      en = json.title;
    }
  }
  
  if (!en) en = json.title_en || json.name || json.nameEn || json.id || '';
  if (!vi) vi = json.title_vi || json.name_vi || json.nameVi || en;
  
  // Try description
  if (!en && json.description) {
    if (typeof json.description === 'object') {
      en = json.description.en || '';
      vi = json.description.vi || en;
    }
  }
  
  return { en, vi };
}

// Scan all JSON files
function scanJsonFiles(dir: string, files: string[] = []): string[] {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanJsonFiles(fullPath, files);
    } else if (item.endsWith('.json') && !item.startsWith('.') && !item.startsWith('_')) {
      if (item === 'room-metrics.json' || item === 'manifest.json') continue;
      files.push(fullPath);
    }
  }
  
  return files;
}

// Analyze all rooms
function analyzeRooms(): MetricsOutput {
  console.log('🔍 Scanning room JSON files...');
  
  const jsonFiles = scanJsonFiles(publicDataDir);
  console.log(`📦 Found ${jsonFiles.length} JSON files`);
  
  const rooms: RoomMetrics[] = [];
  const byTier: Record<string, TierStats> = {};
  const byDomain: Record<string, TierStats> = {};
  
  let totalEntries = 0;
  let totalWordsEn = 0;
  let totalWordsVi = 0;
  
  for (const filePath of jsonFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const json = JSON.parse(content);
      
      if (!json.id) continue;
      
      const tier = normalizeTier(json.tier || '');
      const domain = detectDomain(json);
      const titles = extractTitles(json);
      const entryCount = Array.isArray(json.entries) ? json.entries.length : 0;
      const textContent = extractTextContent(json);
      const wordsEn = countWords(textContent.en);
      const wordsVi = countWords(textContent.vi);
      
      rooms.push({
        id: json.id,
        tier,
        domain,
        title_en: titles.en,
        title_vi: titles.vi,
        entry_count: entryCount,
        approx_words_en: wordsEn,
        approx_words_vi: wordsVi
      });
      
      // Aggregate by tier
      if (!byTier[tier]) {
        byTier[tier] = { rooms: 0, entries: 0, approx_words_en: 0, approx_words_vi: 0 };
      }
      byTier[tier].rooms++;
      byTier[tier].entries += entryCount;
      byTier[tier].approx_words_en += wordsEn;
      byTier[tier].approx_words_vi += wordsVi;
      
      // Aggregate by domain
      if (!byDomain[domain]) {
        byDomain[domain] = { rooms: 0, entries: 0, approx_words_en: 0, approx_words_vi: 0 };
      }
      byDomain[domain].rooms++;
      byDomain[domain].entries += entryCount;
      byDomain[domain].approx_words_en += wordsEn;
      byDomain[domain].approx_words_vi += wordsVi;
      
      totalEntries += entryCount;
      totalWordsEn += wordsEn;
      totalWordsVi += wordsVi;
      
    } catch (err) {
      console.error(`❌ Error parsing ${filePath}:`, (err as Error).message);
    }
  }
  
  const summary: SummaryMetrics = {
    by_tier: byTier,
    by_domain: byDomain,
    total_rooms: rooms.length,
    total_entries: totalEntries,
    total_words_en: totalWordsEn,
    total_words_vi: totalWordsVi,
    generated_at: new Date().toISOString()
  };
  
  return { rooms, summary };
}

// Main
try {
  const metrics = analyzeRooms();
  
  fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2), 'utf8');
  console.log(`\n✅ Written to ${path.relative(projectRoot, outputPath)}`);
  
  console.log('\n📊 Summary:');
  console.log(`   Total rooms: ${metrics.summary.total_rooms}`);
  console.log(`   Total entries: ${metrics.summary.total_entries}`);
  console.log(`   Total words (EN): ${metrics.summary.total_words_en.toLocaleString()}`);
  console.log(`   Total words (VI): ${metrics.summary.total_words_vi.toLocaleString()}`);
  
  console.log('\n📊 By Tier:');
  Object.entries(metrics.summary.by_tier)
    .sort((a, b) => b[1].rooms - a[1].rooms)
    .forEach(([tier, stats]) => {
      console.log(`   ${tier}: ${stats.rooms} rooms, ${stats.entries} entries, ${stats.approx_words_en.toLocaleString()} words EN`);
    });
  
  console.log('\n📊 By Domain:');
  Object.entries(metrics.summary.by_domain)
    .sort((a, b) => b[1].rooms - a[1].rooms)
    .forEach(([domain, stats]) => {
      console.log(`   ${domain}: ${stats.rooms} rooms, ${stats.entries} entries`);
    });
  
  console.log('\n✨ Analysis complete!');
} catch (err) {
  console.error('❌ Error:', err);
  process.exit(1);
}
