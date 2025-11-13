import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter, userEvent } from '@/test/test-utils';
import { getParentRoute } from '@/lib/routeHelper';

// Mock the router navigate function
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ roomId: 'adhd-support-vip3' }),
  };
});

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
  },
}));

// Mock hooks
vi.mock('@/hooks/useRoomProgress', () => ({
  useRoomProgress: () => ({
    progress: 0,
    visitedKeywords: [],
    markKeywordAsVisited: vi.fn(),
  }),
}));

vi.mock('@/hooks/useBehaviorTracking', () => ({
  useBehaviorTracking: () => ({
    trackInteraction: vi.fn(),
  }),
}));

vi.mock('@/hooks/usePoints', () => ({
  usePoints: () => ({
    points: 0,
    addPoints: vi.fn(),
  }),
}));

vi.mock('@/hooks/useUserAccess', () => ({
  useUserAccess: () => ({
    isAdmin: false,
    canAccessVIP1: true,
    canAccessVIP2: true,
    canAccessVIP3: true,
  }),
}));

vi.mock('@/hooks/useCredits', () => ({
  useCredits: () => ({
    credits: 100,
    decrementCredit: vi.fn(),
    isAtLimit: false,
  }),
}));

describe('Navigation Integration Tests', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  describe('Route Helper Integration', () => {
    it('should correctly determine parent routes for all room types', () => {
      // Free tier
      expect(getParentRoute('adhd-support-free')).toBe('/rooms');
      expect(getParentRoute('anxiety-relief-free')).toBe('/rooms');

      // VIP1 tier
      expect(getParentRoute('adhd-support-vip1')).toBe('/rooms-vip1');
      expect(getParentRoute('mental-health-vip1')).toBe('/rooms-vip1');

      // VIP2 tier
      expect(getParentRoute('adhd-support-vip2')).toBe('/rooms-vip2');
      expect(getParentRoute('burnout-recovery-vip2')).toBe('/rooms-vip2');

      // VIP3 tier
      expect(getParentRoute('adhd-support-vip3')).toBe('/rooms-vip3');
      expect(getParentRoute('confidence-vip3')).toBe('/rooms-vip3');
    });

    it('should handle sexuality sub-rooms correctly', () => {
      expect(getParentRoute('sexuality-curiosity-vip3-sub1')).toBe('/sexuality-culture');
      expect(getParentRoute('sexuality-curiosity-vip3-sub2')).toBe('/sexuality-culture');
      expect(getParentRoute('sexuality-curiosity-vip3-sub3')).toBe('/sexuality-culture');
      expect(getParentRoute('sexuality-curiosity-vip3-sub4')).toBe('/sexuality-culture');
      expect(getParentRoute('sexuality-curiosity-vip3-sub5')).toBe('/sexuality-culture');
      expect(getParentRoute('sexuality-curiosity-vip3-sub6')).toBe('/sexuality-culture');
    });

    it('should handle special VIP3 rooms correctly', () => {
      expect(getParentRoute('sexuality-and-curiosity-and-culture-vip3')).toBe('/rooms-vip3');
      expect(getParentRoute('strategy-in-life-1-vip3')).toBe('/rooms-vip3');
      expect(getParentRoute('strategy-in-life-2-vip3')).toBe('/rooms-vip3');
      expect(getParentRoute('strategy-in-life-3-vip3')).toBe('/rooms-vip3');
      expect(getParentRoute('finance-glory-vip3')).toBe('/rooms-vip3');
    });
  });

  describe('Back Button Navigation', () => {
    it('should navigate to correct parent when back button is clicked from standard room', async () => {
      const { useNavigate, useParams } = await import('react-router-dom');
      
      // Mock for VIP3 room
      vi.mocked(useParams).mockReturnValue({ roomId: 'adhd-support-vip3' });
      
      const ChatHub = (await import('@/pages/ChatHub')).default;
      renderWithRouter(<ChatHub />);

      // Wait for component to render
      await waitFor(() => {
        expect(screen.queryByText(/Back|Quay Lại/i)).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /Back|Quay Lại/i });
      const user = userEvent.setup();
      
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/rooms-vip3');
    });

    it('should navigate to /sexuality-culture when back is clicked from sub-room', async () => {
      const { useParams } = await import('react-router-dom');
      
      // Mock for sexuality sub-room
      vi.mocked(useParams).mockReturnValue({ roomId: 'sexuality-curiosity-vip3-sub1' });
      
      const ChatHub = (await import('@/pages/ChatHub')).default;
      renderWithRouter(<ChatHub />);

      await waitFor(() => {
        expect(screen.queryByText(/Back|Quay Lại/i)).toBeInTheDocument();
      });

      const backButton = screen.getByRole('button', { name: /Back|Quay Lại/i });
      const user = userEvent.setup();
      
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/sexuality-culture');
    });
  });

  describe('Cross-Tier Navigation', () => {
    it('should navigate correctly across different tiers', () => {
      const testCases = [
        { roomId: 'confidence-free', expectedRoute: '/rooms' },
        { roomId: 'confidence-vip1', expectedRoute: '/rooms-vip1' },
        { roomId: 'confidence-vip2', expectedRoute: '/rooms-vip2' },
        { roomId: 'confidence-vip3', expectedRoute: '/rooms-vip3' },
      ];

      testCases.forEach(({ roomId, expectedRoute }) => {
        expect(getParentRoute(roomId)).toBe(expectedRoute);
      });
    });

    it('should handle all ADHD support rooms correctly', () => {
      const adhdRooms = [
        { id: 'adhd-support-free', parent: '/rooms' },
        { id: 'adhd-support-vip1', parent: '/rooms-vip1' },
        { id: 'adhd-support-vip2', parent: '/rooms-vip2' },
        { id: 'adhd-support-vip3', parent: '/rooms-vip3' },
      ];

      adhdRooms.forEach(({ id, parent }) => {
        expect(getParentRoute(id)).toBe(parent);
      });
    });
  });

  describe('Edge Case Navigation', () => {
    it('should handle undefined room gracefully', () => {
      expect(getParentRoute(undefined)).toBe('/rooms');
    });

    it('should handle empty string gracefully', () => {
      expect(getParentRoute('')).toBe('/rooms');
    });

    it('should handle invalid room ID and return default', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const result = getParentRoute('invalid-room-that-does-not-exist');
      expect(result).toBe('/rooms');
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });
  });

  describe('Room Type Coverage', () => {
    it('should cover all major room categories', () => {
      const categories = [
        // Mental Health
        { id: 'adhd-support-vip3', parent: '/rooms-vip3' },
        { id: 'anxiety-relief-vip2', parent: '/rooms-vip2' },
        { id: 'depression-support-vip1', parent: '/rooms-vip1' },
        { id: 'mental-health-free', parent: '/rooms' },
        
        // Physical Health
        { id: 'nutrition-vip3', parent: '/rooms-vip3' },
        { id: 'trigger-point-release-vip1', parent: '/rooms-vip1' },
        { id: 'sleep-improvement-vip1', parent: '/rooms-vip1' },
        
        // Personal Growth
        { id: 'confidence-vip3', parent: '/rooms-vip3' },
        { id: 'mindfulness-vip2', parent: '/rooms-vip2' },
        { id: 'shadow-work-vip1', parent: '/rooms-vip1' },
        
        // Spiritual
        { id: 'god-with-us-vip3', parent: '/rooms-vip3' },
        { id: 'meaning-of-life-vip2', parent: '/rooms-vip2' },
        
        // Specialty
        { id: 'ai-vip3', parent: '/rooms-vip3' },
        { id: 'philosophy-of-everyday-vip2', parent: '/rooms-vip2' },
      ];

      categories.forEach(({ id, parent }) => {
        expect(getParentRoute(id)).toBe(parent);
      });
    });
  });

  describe('Sexuality Culture Room Integration', () => {
    it('should handle navigation from sexuality culture parent to sub-rooms', async () => {
      const SexualityCultureRoom = (await import('@/pages/SexualityCultureRoom')).default;
      renderWithRouter(<SexualityCultureRoom />);

      // The room grid should render
      await waitFor(() => {
        expect(screen.queryByText(/Sexuality|Tính Dục/i)).toBeInTheDocument();
      });
    });

    it('should verify all 6 sexuality sub-rooms route correctly', () => {
      for (let i = 1; i <= 6; i++) {
        const roomId = `sexuality-curiosity-vip3-sub${i}`;
        expect(getParentRoute(roomId)).toBe('/sexuality-culture');
      }
    });
  });

  describe('Navigation Consistency', () => {
    it('should ensure navigation is bidirectional and consistent', () => {
      // Parent -> Sub-room -> Parent pattern
      const parentRoom = 'sexuality-and-curiosity-and-culture-vip3';
      const subRoom1 = 'sexuality-curiosity-vip3-sub1';
      
      // Parent should go to VIP3
      expect(getParentRoute(parentRoom)).toBe('/rooms-vip3');
      
      // Sub-room should go back to parent
      expect(getParentRoute(subRoom1)).toBe('/sexuality-culture');
    });

    it('should verify no circular navigation patterns', () => {
      const testRooms = [
        'adhd-support-vip3',
        'sexuality-curiosity-vip3-sub1',
        'strategy-in-life-1-vip3',
        'confidence-free',
      ];

      testRooms.forEach(roomId => {
        const parent = getParentRoute(roomId);
        // Parent routes should never point back to themselves
        expect(parent).not.toContain(roomId);
        // Parent routes should be valid route paths
        expect(parent).toMatch(/^\/[\w-]+$/);
      });
    });
  });
});
