#!/usr/bin/env node
/**
 * Cross-Topic Recommendation Generator
 * Analyzes all room files and generates intelligent cross-room recommendations
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

interface RoomKeywords {
  [category: string]: {
    en: string[];
    vi: string[];
  };
}

interface RoomData {
  schema_id: string;
  description?: { en?: string; vi?: string };
  keywords?: RoomKeywords;
  entries?: Array<{
    slug?: string;
    title?: { en?: string; vi?: string };
    tags?: string[];
  }>;
}

interface KeywordMapping {
  keyword: string;
  rooms: Array<{
    roomId: string;
    roomNameEn: string;
    roomNameVi: string;
    relevance: 'primary' | 'secondary' | 'related';
    matchedTerms: string[];
  }>;
}

interface CrossTopicRecommendations {
  schema_version: string;
  schema_id: string;
  description: { en: string; vi: string };
  meta: {
    generated_at: string;
    total_rooms: number;
    total_keywords: number;
    algorithm_version: string;
  };
  recommendations: KeywordMapping[];
}

console.log('\n🔬 Analyzing all room files...\n');

const roomsDir = join(process.cwd(), 'src/data/rooms');
const roomFiles = readdirSync(roomsDir).filter(f => f.endsWith('.json'));

// Map room IDs to display names (will extract from lib/roomData.ts)
const roomNames: Record<string, { en: string; vi: string }> = {};
const roomDataPath = join(process.cwd(), 'src/lib/roomData.ts');
const roomDataContent = readFileSync(roomDataPath, 'utf-8');

// Extract room names from roomData.ts
const roomEntryRegex = /{\s*id:\s*"([^"]+)",\s*nameVi:\s*"([^"]+)",\s*nameEn:\s*"([^"]+)"/g;
let match;
while ((match = roomEntryRegex.exec(roomDataContent)) !== null) {
  const [, id, nameVi, nameEn] = match;
  roomNames[id] = { en: nameEn, vi: nameVi };
}

console.log(`📚 Found ${roomFiles.length} room files`);
console.log(`📋 Extracted ${Object.keys(roomNames).length} room names\n`);

// Build keyword index: keyword -> rooms that have it
const keywordIndex: Map<string, Set<{
  roomId: string;
  category: string;
  language: 'en' | 'vi';
  term: string;
}>> = new Map();

let totalKeywordCategories = 0;

// Analyze each room
roomFiles.forEach(filename => {
  const filePath = join(roomsDir, filename);
  
  try {
    const content = readFileSync(filePath, 'utf-8');
    const data: RoomData = JSON.parse(content);
    
    if (!data.schema_id || !data.keywords) return;
    
    const roomId = data.schema_id;
    
    // Index all keywords from this room
    Object.entries(data.keywords).forEach(([category, terms]) => {
      totalKeywordCategories++;
      
      // Index English terms
      if (terms.en && Array.isArray(terms.en)) {
        terms.en.forEach(term => {
          const normalized = term.toLowerCase().trim();
          if (!normalized) return;
          
          if (!keywordIndex.has(normalized)) {
            keywordIndex.set(normalized, new Set());
          }
          keywordIndex.get(normalized)!.add({
            roomId,
            category,
            language: 'en',
            term: normalized
          });
        });
      }
      
      // Index Vietnamese terms
      if (terms.vi && Array.isArray(terms.vi)) {
        terms.vi.forEach(term => {
          const normalized = term.toLowerCase().trim();
          if (!normalized) return;
          
          if (!keywordIndex.has(normalized)) {
            keywordIndex.set(normalized, new Set());
          }
          keywordIndex.get(normalized)!.add({
            roomId,
            category,
            language: 'vi',
            term: normalized
          });
        });
      }
    });
  } catch (error) {
    console.error(`⚠️  Error processing ${filename}:`, error);
  }
});

console.log(`🔍 Indexed ${keywordIndex.size} unique keywords`);
console.log(`📊 From ${totalKeywordCategories} keyword categories\n`);

// Build recommendations: for each keyword, which rooms are related
const recommendations: KeywordMapping[] = [];

// Group keywords by their room coverage
const keywordsByRoomCount = new Map<number, string[]>();
keywordIndex.forEach((rooms, keyword) => {
  const roomCount = new Set([...rooms].map(r => r.roomId)).size;
  if (!keywordsByRoomCount.has(roomCount)) {
    keywordsByRoomCount.set(roomCount, []);
  }
  keywordsByRoomCount.get(roomCount)!.push(keyword);
});

console.log('📈 Keyword distribution:');
Array.from(keywordsByRoomCount.entries())
  .sort((a, b) => b[0] - a[0])
  .forEach(([count, keywords]) => {
    if (count > 1) {
      console.log(`   ${count} rooms: ${keywords.length} keywords (cross-room potential)`);
    }
  });

console.log('\n🔗 Building cross-room recommendations...\n');

// Process keywords that appear in multiple rooms (cross-room potential)
keywordIndex.forEach((roomRefs, keyword) => {
  const uniqueRooms = new Set([...roomRefs].map(r => r.roomId));
  
  // Only include keywords that appear in 2+ rooms OR have rich context
  if (uniqueRooms.size < 2 && roomRefs.size < 3) return;
  
  const roomRecommendations = new Map<string, {
    roomId: string;
    matchedTerms: Set<string>;
    categoryCount: number;
  }>();
  
  // Group by room
  roomRefs.forEach(ref => {
    if (!roomRecommendations.has(ref.roomId)) {
      roomRecommendations.set(ref.roomId, {
        roomId: ref.roomId,
        matchedTerms: new Set(),
        categoryCount: 0
      });
    }
    const rec = roomRecommendations.get(ref.roomId)!;
    rec.matchedTerms.add(ref.term);
    rec.categoryCount++;
  });
  
  // Sort rooms by relevance
  const sortedRooms = Array.from(roomRecommendations.values())
    .sort((a, b) => b.categoryCount - a.categoryCount)
    .map(rec => {
      const names = roomNames[rec.roomId] || { en: rec.roomId, vi: rec.roomId };
      
      // Determine relevance
      let relevance: 'primary' | 'secondary' | 'related';
      if (rec.categoryCount >= 3) relevance = 'primary';
      else if (rec.categoryCount >= 2) relevance = 'secondary';
      else relevance = 'related';
      
      return {
        roomId: rec.roomId,
        roomNameEn: names.en,
        roomNameVi: names.vi,
        relevance,
        matchedTerms: Array.from(rec.matchedTerms)
      };
    });
  
  if (sortedRooms.length > 0) {
    recommendations.push({
      keyword,
      rooms: sortedRooms
    });
  }
});

// Sort recommendations by cross-room potential
recommendations.sort((a, b) => b.rooms.length - a.rooms.length);

console.log(`✅ Generated ${recommendations.length} cross-topic recommendations`);
console.log(`🎯 Top cross-room keywords:`);
recommendations.slice(0, 10).forEach(rec => {
  console.log(`   "${rec.keyword}" → ${rec.rooms.length} rooms (${rec.rooms.map(r => r.roomId).join(', ')})`);
});

// Generate final output
const output: CrossTopicRecommendations = {
  schema_version: "2.0",
  schema_id: "cross_topic_recommendations",
  description: {
    en: "Intelligent cross-room keyword mapping for seamless navigation and topic discovery across 62+ rooms",
    vi: "Bản đồ từ khóa liên phòng thông minh để điều hướng liền mạch và khám phá chủ đề trên 62+ phòng"
  },
  meta: {
    generated_at: new Date().toISOString(),
    total_rooms: roomFiles.length,
    total_keywords: recommendations.length,
    algorithm_version: "v2.0-overlap-analysis"
  },
  recommendations
};

// Write output
const outputPath = join(process.cwd(), 'src/data/system/cross_topic_recommendations.json');
writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8');

console.log(`\n📝 Written to: src/data/system/cross_topic_recommendations.json`);
console.log(`\n═`.repeat(70));
console.log('\n✨ Cross-topic recommendations generated successfully!\n');
console.log(`📊 Statistics:`);
console.log(`   Rooms analyzed:        ${roomFiles.length}`);
console.log(`   Unique keywords:       ${keywordIndex.size}`);
console.log(`   Cross-room links:      ${recommendations.length}`);
console.log(`   Avg rooms/keyword:     ${(recommendations.reduce((sum, r) => sum + r.rooms.length, 0) / recommendations.length).toFixed(1)}`);
console.log(`\n═`.repeat(70));
console.log('\n🚀 Ready to power intelligent room recommendations!\n');

process.exit(0);
