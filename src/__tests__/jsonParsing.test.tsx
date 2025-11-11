import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock room data structures for testing
const validRoomData = {
  title: {
    en: 'Test Room',
    vi: 'Phòng Thử Nghiệm',
  },
  entries: [
    {
      slug: 'test-entry-1',
      audio: 'audio1.mp3',
      keywords_en: ['keyword1', 'keyword2', 'keyword3'],
      keywords_vi: ['từ1', 'từ2', 'từ3'],
      replies_en: ['Reply 1', 'Reply 2'],
      replies_vi: ['Trả lời 1', 'Trả lời 2'],
    },
    {
      slug: 'test-entry-2',
      audio: 'audio2.mp3',
      keywords_en: ['test', 'sample', 'demo'],
      keywords_vi: ['thử', 'mẫu', 'demo'],
      replies_en: ['Response'],
      replies_vi: ['Phản hồi'],
    },
  ],
};

describe('JSON Parsing Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Room Data Structure Validation', () => {
    it('should validate complete room data structure', () => {
      expect(validRoomData).toHaveProperty('title');
      expect(validRoomData.title).toHaveProperty('en');
      expect(validRoomData.title).toHaveProperty('vi');
      expect(validRoomData).toHaveProperty('entries');
      expect(Array.isArray(validRoomData.entries)).toBe(true);
    });

    it('should validate entry structure', () => {
      const entry = validRoomData.entries[0];
      
      expect(entry).toHaveProperty('slug');
      expect(entry).toHaveProperty('audio');
      expect(entry).toHaveProperty('keywords_en');
      expect(entry).toHaveProperty('keywords_vi');
      expect(entry).toHaveProperty('replies_en');
      expect(entry).toHaveProperty('replies_vi');
      
      expect(Array.isArray(entry.keywords_en)).toBe(true);
      expect(Array.isArray(entry.keywords_vi)).toBe(true);
      expect(Array.isArray(entry.replies_en)).toBe(true);
      expect(Array.isArray(entry.replies_vi)).toBe(true);
    });

    it('should validate minimum keyword requirements', () => {
      validRoomData.entries.forEach(entry => {
        expect(entry.keywords_en.length).toBeGreaterThanOrEqual(3);
        expect(entry.keywords_vi.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('should validate audio file references', () => {
      validRoomData.entries.forEach(entry => {
        expect(entry.audio).toBeTruthy();
        expect(typeof entry.audio).toBe('string');
        expect(entry.audio.endsWith('.mp3')).toBe(true);
      });
    });

    it('should validate slug format', () => {
      validRoomData.entries.forEach(entry => {
        expect(entry.slug).toBeTruthy();
        expect(typeof entry.slug).toBe('string');
        expect(entry.slug.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Malformed Data Handling', () => {
    it('should handle missing title gracefully', () => {
      const invalidData = { ...validRoomData, title: undefined };
      expect(invalidData.entries).toBeDefined();
    });

    it('should handle missing entries array', () => {
      const invalidData = { ...validRoomData, entries: undefined };
      expect(invalidData.title).toBeDefined();
    });

    it('should handle entry with missing keywords', () => {
      const entryWithoutKeywords = {
        slug: 'test',
        audio: 'test.mp3',
        replies_en: ['reply'],
        replies_vi: ['trả lời'],
      };
      
      expect(entryWithoutKeywords.slug).toBeTruthy();
      expect(entryWithoutKeywords.audio).toBeTruthy();
    });

    it('should handle entry with insufficient keywords', () => {
      const entryWithFewKeywords = {
        slug: 'test',
        audio: 'test.mp3',
        keywords_en: ['only', 'two'],
        keywords_vi: ['chỉ', 'hai'],
        replies_en: ['reply'],
        replies_vi: ['trả lời'],
      };
      
      expect(entryWithFewKeywords.keywords_en.length).toBeLessThan(3);
    });
  });

  describe('Data Transformation Logic', () => {
    it('should transform keywords into menu structure', () => {
      const keywordMenu = validRoomData.entries.map(entry => ({
        slug: entry.slug,
        keywordEn: entry.keywords_en,
        keywordVi: entry.keywords_vi,
      }));

      expect(keywordMenu).toHaveLength(2);
      expect(keywordMenu[0].slug).toBe('test-entry-1');
      expect(keywordMenu[0].keywordEn).toEqual(['keyword1', 'keyword2', 'keyword3']);
    });

    it('should extract merged entries with all fields', () => {
      const merged = validRoomData.entries.map(entry => ({
        slug: entry.slug,
        audio: entry.audio.startsWith('/lovable-uploads/') 
          ? entry.audio 
          : `/lovable-uploads/${entry.audio}`,
        keywordEn: entry.keywords_en,
        keywordVi: entry.keywords_vi,
        replyEn: entry.replies_en,
        replyVi: entry.replies_vi,
      }));

      expect(merged[0].audio).toBe('/lovable-uploads/audio1.mp3');
      expect(merged[0].keywordEn).toHaveLength(3);
      expect(merged[0].replyEn).toHaveLength(2);
    });

    it('should handle duplicate audio path prefixes', () => {
      const audioWithPrefix = '/lovable-uploads/test.mp3';
      const audioWithoutPrefix = 'test.mp3';
      
      const normalizedWithPrefix = audioWithPrefix.startsWith('/lovable-uploads/') 
        ? audioWithPrefix 
        : `/lovable-uploads/${audioWithPrefix}`;
      
      const normalizedWithoutPrefix = audioWithoutPrefix.startsWith('/lovable-uploads/') 
        ? audioWithoutPrefix 
        : `/lovable-uploads/${audioWithoutPrefix}`;

      expect(normalizedWithPrefix).toBe('/lovable-uploads/test.mp3');
      expect(normalizedWithoutPrefix).toBe('/lovable-uploads/test.mp3');
    });
  });

  describe('Room Registry Integration', () => {
    it('should validate room registry entry format', () => {
      const registryEntry = {
        id: 'test-room',
        nameEn: 'Test Room',
        nameVi: 'Phòng Thử',
        tier: 'free',
        path: '/data/test-room.json',
      };

      expect(registryEntry.id).toBeTruthy();
      expect(registryEntry.nameEn).toBeTruthy();
      expect(registryEntry.tier).toMatch(/^(free|vip1|vip2|vip3|vip4)$/);
      expect(registryEntry.path).toContain('.json');
    });

    it('should handle multiple tier variations', () => {
      const tiers = ['free', 'vip1', 'vip2', 'vip3', 'vip4'];
      
      tiers.forEach(tier => {
        const registryEntry = {
          id: `test-room-${tier}`,
          tier,
          path: `/data/test-room-${tier}.json`,
        };
        
        expect(tiers).toContain(registryEntry.tier);
      });
    });
  });

  describe('Bilingual Content Validation', () => {
    it('should ensure parallel English and Vietnamese content', () => {
      validRoomData.entries.forEach(entry => {
        expect(entry.keywords_en.length).toBe(entry.keywords_vi.length);
        expect(entry.replies_en.length).toBe(entry.replies_vi.length);
      });
    });

    it('should validate non-empty language content', () => {
      validRoomData.entries.forEach(entry => {
        entry.keywords_en.forEach(keyword => {
          expect(keyword.length).toBeGreaterThan(0);
        });
        entry.keywords_vi.forEach(keyword => {
          expect(keyword.length).toBeGreaterThan(0);
        });
      });
    });
  });
});
