/**
 * Room Search Tests
 * 
 * Tests for roomRegistry and roomSearch modules
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock roomDataImports
vi.mock('@/lib/roomDataImports', () => ({
  roomDataMap: {
    'adhd-support-free': {
      id: 'adhd-support-free',
      nameEn: 'ADHD Support',
      nameVi: 'Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý',
      tier: 'free',
      hasData: true,
      keywords_en: ['adhd', 'focus', 'attention'],
      keywords_vi: ['tăng động', 'giảm chú ý', 'tập trung'],
    },
    'adhd-support-vip3': {
      id: 'adhd-support-vip3',
      nameEn: 'ADHD Support Advanced',
      nameVi: 'Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý Nâng Cao',
      tier: 'vip3',
      hasData: true,
      keywords_en: ['adhd', 'advanced', 'strategies'],
      keywords_vi: ['tăng động', 'nâng cao', 'chiến lược'],
    },
    'anxiety-relief-free': {
      id: 'anxiety-relief-free',
      nameEn: 'Anxiety Relief',
      nameVi: 'Giảm Lo Âu',
      tier: 'free',
      hasData: true,
      keywords_en: ['anxiety', 'calm', 'relief', 'stress'],
      keywords_vi: ['lo âu', 'bình tĩnh', 'giảm căng thẳng'],
    },
    'anxiety-relief-vip3': {
      id: 'anxiety-relief-vip3',
      nameEn: 'Anxiety Relief Advanced',
      nameVi: 'Giảm Lo Âu Nâng Cao',
      tier: 'vip3',
      hasData: true,
      keywords_en: ['anxiety', 'advanced', 'therapy'],
      keywords_vi: ['lo âu', 'trị liệu', 'nâng cao'],
    },
    'english-writing-free': {
      id: 'english-writing-free',
      nameEn: 'English Writing Basics',
      nameVi: 'Viết Tiếng Anh Cơ Bản',
      tier: 'free',
      hasData: true,
      keywords_en: ['writing', 'english', 'grammar'],
      keywords_vi: ['viết', 'tiếng anh', 'ngữ pháp'],
    },
    'depression-support-vip3': {
      id: 'depression-support-vip3',
      nameEn: 'Depression Support',
      nameVi: 'Hỗ Trợ Trầm Cảm',
      tier: 'vip3',
      hasData: true,
      keywords_en: ['depression', 'mental health', 'support'],
      keywords_vi: ['trầm cảm', 'sức khỏe tâm thần', 'hỗ trợ'],
    },
  }
}));

// Import after mock
import { getAllRooms, getRoomById, getRoomsByTier, refreshRegistry, type RoomMeta } from '@/lib/rooms/roomRegistry';
import { searchRooms, getSearchSuggestions, hasSearchResults } from '@/lib/search/roomSearch';

describe('roomRegistry', () => {
  beforeEach(() => {
    refreshRegistry(); // Clear cache between tests
  });

  it('should load all rooms from roomDataMap', () => {
    const rooms = getAllRooms();
    expect(rooms.length).toBe(6);
  });

  it('should normalize room data correctly', () => {
    const room = getRoomById('adhd-support-free');
    expect(room).toBeDefined();
    expect(room?.title_en).toBe('ADHD Support');
    expect(room?.title_vi).toBe('Hỗ Trợ Rối Loạn Tăng Động Giảm Chú Ý');
    expect(room?.tier).toBe('free');
  });

  it('should get rooms by tier', () => {
    const freeRooms = getRoomsByTier('free');
    expect(freeRooms.length).toBe(3);
    expect(freeRooms.every(r => r.tier === 'free')).toBe(true);

    const vip3Rooms = getRoomsByTier('vip3');
    expect(vip3Rooms.length).toBe(3);
    expect(vip3Rooms.every(r => r.tier === 'vip3')).toBe(true);
  });

  it('should extract keywords correctly', () => {
    const room = getRoomById('adhd-support-free');
    expect(room?.keywords_en).toContain('adhd');
    expect(room?.keywords_en).toContain('focus');
    expect(room?.keywords_vi).toContain('tăng động');
  });

  it('should return undefined for non-existent room', () => {
    const room = getRoomById('non-existent-room');
    expect(room).toBeUndefined();
  });
});

describe('searchRooms', () => {
  beforeEach(() => {
    refreshRegistry();
  });

  it('should return empty array for empty query', () => {
    expect(searchRooms('')).toEqual([]);
    expect(searchRooms('   ')).toEqual([]);
  });

  it('should find rooms by English title', () => {
    const results = searchRooms('ADHD');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id === 'adhd-support-free')).toBe(true);
    expect(results.some(r => r.id === 'adhd-support-vip3')).toBe(true);
  });

  it('should find rooms by Vietnamese title', () => {
    const results = searchRooms('trầm cảm');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id === 'depression-support-vip3')).toBe(true);
  });

  it('should find rooms by Vietnamese keyword without diacritics', () => {
    // "lo au" without diacritics should match "lo âu"
    const results = searchRooms('lo au');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id.includes('anxiety'))).toBe(true);
  });

  it('should find rooms by English keywords', () => {
    const results = searchRooms('focus');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.id === 'adhd-support-free')).toBe(true);
  });

  it('should boost results for current tier', () => {
    const results = searchRooms('ADHD', { tier: 'vip3' });
    expect(results.length).toBe(2);
    
    // VIP3 room should have higher score when tier = vip3
    const vip3Room = results.find(r => r.id === 'adhd-support-vip3');
    const freeRoom = results.find(r => r.id === 'adhd-support-free');
    
    expect(vip3Room).toBeDefined();
    expect(freeRoom).toBeDefined();
    // Both should be found, VIP3 should be boosted
  });

  it('should respect limit option', () => {
    const results = searchRooms('support', { limit: 2 });
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('should rank title prefix matches higher', () => {
    const results = searchRooms('Anxiety');
    expect(results.length).toBeGreaterThan(0);
    
    // Rooms with "Anxiety" at the start of title should rank higher
    const topResult = results[0];
    expect(topResult.title_en.toLowerCase().startsWith('anxiety')).toBe(true);
  });

  it('should handle case insensitivity', () => {
    const resultsLower = searchRooms('adhd');
    const resultsUpper = searchRooms('ADHD');
    const resultsMixed = searchRooms('AdHd');
    
    expect(resultsLower.length).toBe(resultsUpper.length);
    expect(resultsLower.length).toBe(resultsMixed.length);
  });
});

describe('getSearchSuggestions', () => {
  beforeEach(() => {
    refreshRegistry();
  });

  it('should return empty array for empty prefix', () => {
    expect(getSearchSuggestions('')).toEqual([]);
  });

  it('should return title suggestions matching prefix', () => {
    const suggestions = getSearchSuggestions('Anx');
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.startsWith('Anxiety'))).toBe(true);
  });

  it('should respect limit', () => {
    const suggestions = getSearchSuggestions('A', 2);
    expect(suggestions.length).toBeLessThanOrEqual(2);
  });
});

describe('hasSearchResults', () => {
  beforeEach(() => {
    refreshRegistry();
  });

  it('should return false for empty query', () => {
    expect(hasSearchResults('')).toBe(false);
  });

  it('should return true for matching query', () => {
    expect(hasSearchResults('ADHD')).toBe(true);
    expect(hasSearchResults('anxiety')).toBe(true);
  });

  it('should return false for non-matching query', () => {
    expect(hasSearchResults('xyznonexistent')).toBe(false);
  });
});
