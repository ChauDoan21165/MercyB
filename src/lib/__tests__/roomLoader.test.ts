import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadMergedRoom } from '../roomLoader';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(),
        })),
      })),
    })),
  },
}));

// Mock fetch for static file fallback
global.fetch = vi.fn();

describe('roomLoader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('loadMergedRoom', () => {
    it('should load room data from database successfully', async () => {
      const mockDbData = {
        id: 'test-room',
        tier: 'free',
        title: { en: 'Test Room', vi: 'Phòng Thử' },
        entries: [
          {
            slug: 'entry-1',
            audio: 'audio1.mp3',
            keywords_en: ['keyword1', 'keyword2', 'keyword3'],
            keywords_vi: ['từ1', 'từ2', 'từ3'],
            replies_en: ['reply1', 'reply2'],
            replies_vi: ['trả lời1', 'trả lời2'],
          },
        ],
      };

      const mockSupabaseResponse = {
        data: mockDbData,
        error: null,
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue(mockSupabaseResponse),
          }),
        }),
      } as any);

      const result = await loadMergedRoom('test-room', 'free');

      expect(result.merged).toHaveLength(1);
      expect(result.merged[0].slug).toBe('entry-1');
      expect(result.merged[0].keywordEn).toEqual(['keyword1', 'keyword2', 'keyword3']);
      expect(result.merged[0].audio).toBe('/lovable-uploads/audio1.mp3');
    });

    it('should fall back to static files when database fails', async () => {
      const mockJsonData = {
        title: { en: 'Static Room', vi: 'Phòng Tĩnh' },
        entries: [
          {
            slug: 'static-entry',
            audio: 'static.mp3',
            keywords_en: ['static1', 'static2', 'static3'],
            keywords_vi: ['tĩnh1', 'tĩnh2', 'tĩnh3'],
            replies_en: ['reply'],
            replies_vi: ['trả lời'],
          },
        ],
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
          }),
        }),
      } as any);

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockJsonData,
      });

      const result = await loadMergedRoom('static-room', 'free');

      expect(result.merged).toHaveLength(1);
      expect(result.merged[0].slug).toBe('static-entry');
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should transform audio paths correctly', async () => {
      const mockDbData = {
        id: 'audio-test',
        tier: 'free',
        entries: [
          {
            slug: 'entry-1',
            audio: 'audio1.mp3',
            keywords_en: ['k1', 'k2', 'k3'],
            keywords_vi: ['t1', 't2', 't3'],
            replies_en: ['r1'],
            replies_vi: ['tr1'],
          },
          {
            slug: 'entry-2',
            audio: '/lovable-uploads/audio2.mp3',
            keywords_en: ['k4', 'k5', 'k6'],
            keywords_vi: ['t4', 't5', 't6'],
            replies_en: ['r2'],
            replies_vi: ['tr2'],
          },
        ],
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockDbData, error: null }),
          }),
        }),
      } as any);

      const result = await loadMergedRoom('audio-test', 'free');

      expect(result.merged[0].audio).toBe('/lovable-uploads/audio1.mp3');
      expect(result.merged[1].audio).toBe('/lovable-uploads/audio2.mp3');
    });

    it('should extract keywords menu correctly', async () => {
      const mockDbData = {
        id: 'keywords-test',
        tier: 'vip1',
        entries: [
          {
            slug: 'entry-1',
            audio: 'audio1.mp3',
            keywords_en: ['trust', 'faith', 'hope'],
            keywords_vi: ['tin tưởng', 'đức tin', 'hy vọng'],
            replies_en: ['Trust in God'],
            replies_vi: ['Tin vào Chúa'],
          },
          {
            slug: 'entry-2',
            audio: 'audio2.mp3',
            keywords_en: ['love', 'peace', 'joy'],
            keywords_vi: ['yêu thương', 'bình an', 'vui mừng'],
            replies_en: ['Love conquers all'],
            replies_vi: ['Tình yêu chiến thắng tất cả'],
          },
        ],
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockDbData, error: null }),
          }),
        }),
      } as any);

      const result = await loadMergedRoom('keywords-test', 'vip1');

      expect(result.keywordMenu).toHaveLength(2);
      expect(result.keywordMenu[0].keywordEn).toEqual(['trust', 'faith', 'hope']);
      expect(result.keywordMenu[0].keywordVi).toEqual(['tin tưởng', 'đức tin', 'hy vọng']);
      expect(result.keywordMenu[1].slug).toBe('entry-2');
    });

    it('should handle empty entries gracefully', async () => {
      const mockDbData = {
        id: 'empty-test',
        tier: 'free',
        entries: [],
      };

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockDbData, error: null }),
          }),
        }),
      } as any);

      const result = await loadMergedRoom('empty-test', 'free');

      expect(result.merged).toEqual([]);
      expect(result.keywordMenu).toEqual([]);
    });

    it('should return empty structure when all loading methods fail', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: new Error('DB error') }),
          }),
        }),
      } as any);

      (global.fetch as any).mockRejectedValue(new Error('Fetch failed'));

      const result = await loadMergedRoom('nonexistent', 'free');

      expect(result.merged).toEqual([]);
      expect(result.keywordMenu).toEqual([]);
      expect(result.audioBasePath).toBe('');
    });
  });
});
