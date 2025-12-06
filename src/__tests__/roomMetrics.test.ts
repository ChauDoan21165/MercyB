import { describe, it, expect } from 'vitest';

// Mock metrics data structure for testing
const mockMetrics = {
  rooms: [
    { id: 'room_1', tier: 'free', domain: 'health', title_en: 'Room 1', title_vi: 'Phòng 1', entry_count: 5, approx_words_en: 100, approx_words_vi: 120 },
    { id: 'room_2', tier: 'vip1', domain: 'english', title_en: 'Room 2', title_vi: 'Phòng 2', entry_count: 8, approx_words_en: 200, approx_words_vi: 180 },
    { id: 'room_3', tier: 'vip3', domain: 'health', title_en: 'Room 3', title_vi: 'Phòng 3', entry_count: 6, approx_words_en: 150, approx_words_vi: 160 },
    { id: 'room_4', tier: 'free', domain: 'strategy', title_en: 'Room 4', title_vi: 'Phòng 4', entry_count: 4, approx_words_en: 80, approx_words_vi: 90 },
  ],
  summary: {
    by_tier: {
      free: { rooms: 2, entries: 9, approx_words_en: 180, approx_words_vi: 210 },
      vip1: { rooms: 1, entries: 8, approx_words_en: 200, approx_words_vi: 180 },
      vip3: { rooms: 1, entries: 6, approx_words_en: 150, approx_words_vi: 160 },
    },
    by_domain: {
      health: { rooms: 2, entries: 11, approx_words_en: 250, approx_words_vi: 280 },
      english: { rooms: 1, entries: 8, approx_words_en: 200, approx_words_vi: 180 },
      strategy: { rooms: 1, entries: 4, approx_words_en: 80, approx_words_vi: 90 },
    },
    total_rooms: 4,
    total_entries: 23,
    total_words_en: 530,
    total_words_vi: 550,
    generated_at: '2024-01-01T00:00:00.000Z',
  },
};

describe('Room Metrics', () => {
  describe('Summary Validation', () => {
    it('total_rooms equals rooms array length', () => {
      expect(mockMetrics.summary.total_rooms).toBe(mockMetrics.rooms.length);
    });

    it('by_tier room counts sum to total_rooms', () => {
      const tierSum = Object.values(mockMetrics.summary.by_tier)
        .reduce((sum, tier) => sum + tier.rooms, 0);
      expect(tierSum).toBe(mockMetrics.summary.total_rooms);
    });

    it('by_domain room counts sum to total_rooms', () => {
      const domainSum = Object.values(mockMetrics.summary.by_domain)
        .reduce((sum, domain) => sum + domain.rooms, 0);
      expect(domainSum).toBe(mockMetrics.summary.total_rooms);
    });

    it('by_tier entry counts sum to total_entries', () => {
      const entrySum = Object.values(mockMetrics.summary.by_tier)
        .reduce((sum, tier) => sum + tier.entries, 0);
      expect(entrySum).toBe(mockMetrics.summary.total_entries);
    });

    it('by_domain entry counts sum to total_entries', () => {
      const entrySum = Object.values(mockMetrics.summary.by_domain)
        .reduce((sum, domain) => sum + domain.entries, 0);
      expect(entrySum).toBe(mockMetrics.summary.total_entries);
    });

    it('by_tier word counts sum to total_words', () => {
      const wordsEnSum = Object.values(mockMetrics.summary.by_tier)
        .reduce((sum, tier) => sum + tier.approx_words_en, 0);
      expect(wordsEnSum).toBe(mockMetrics.summary.total_words_en);
      
      const wordsViSum = Object.values(mockMetrics.summary.by_tier)
        .reduce((sum, tier) => sum + tier.approx_words_vi, 0);
      expect(wordsViSum).toBe(mockMetrics.summary.total_words_vi);
    });
  });

  describe('Room Data Integrity', () => {
    it('all rooms have required fields', () => {
      for (const room of mockMetrics.rooms) {
        expect(room.id).toBeTruthy();
        expect(room.tier).toBeTruthy();
        expect(room.domain).toBeTruthy();
        expect(room.title_en).toBeTruthy();
        expect(typeof room.entry_count).toBe('number');
        expect(typeof room.approx_words_en).toBe('number');
        expect(typeof room.approx_words_vi).toBe('number');
      }
    });

    it('rooms are correctly grouped by tier', () => {
      const tierGroups: Record<string, number> = {};
      for (const room of mockMetrics.rooms) {
        tierGroups[room.tier] = (tierGroups[room.tier] || 0) + 1;
      }
      
      for (const [tier, count] of Object.entries(tierGroups)) {
        expect(mockMetrics.summary.by_tier[tier]?.rooms).toBe(count);
      }
    });

    it('rooms are correctly grouped by domain', () => {
      const domainGroups: Record<string, number> = {};
      for (const room of mockMetrics.rooms) {
        domainGroups[room.domain] = (domainGroups[room.domain] || 0) + 1;
      }
      
      for (const [domain, count] of Object.entries(domainGroups)) {
        expect(mockMetrics.summary.by_domain[domain]?.rooms).toBe(count);
      }
    });
  });

  describe('Entry Count Validation', () => {
    it('individual room entry counts sum correctly per tier', () => {
      const tierEntries: Record<string, number> = {};
      for (const room of mockMetrics.rooms) {
        tierEntries[room.tier] = (tierEntries[room.tier] || 0) + room.entry_count;
      }
      
      for (const [tier, count] of Object.entries(tierEntries)) {
        expect(mockMetrics.summary.by_tier[tier]?.entries).toBe(count);
      }
    });

    it('individual room entry counts sum correctly per domain', () => {
      const domainEntries: Record<string, number> = {};
      for (const room of mockMetrics.rooms) {
        domainEntries[room.domain] = (domainEntries[room.domain] || 0) + room.entry_count;
      }
      
      for (const [domain, count] of Object.entries(domainEntries)) {
        expect(mockMetrics.summary.by_domain[domain]?.entries).toBe(count);
      }
    });
  });

  describe('Word Count Validation', () => {
    it('all rooms have non-negative word counts', () => {
      for (const room of mockMetrics.rooms) {
        expect(room.approx_words_en).toBeGreaterThanOrEqual(0);
        expect(room.approx_words_vi).toBeGreaterThanOrEqual(0);
      }
    });

    it('word counts sum correctly', () => {
      const totalEn = mockMetrics.rooms.reduce((sum, r) => sum + r.approx_words_en, 0);
      const totalVi = mockMetrics.rooms.reduce((sum, r) => sum + r.approx_words_vi, 0);
      
      expect(totalEn).toBe(mockMetrics.summary.total_words_en);
      expect(totalVi).toBe(mockMetrics.summary.total_words_vi);
    });
  });
});
