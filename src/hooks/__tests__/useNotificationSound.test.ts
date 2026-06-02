import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock AuthProvider
vi.mock('@/providers/AuthProvider', () => ({
  useAuth: vi.fn(() => ({ user: { id: 'admin-user' } })),
}));

// Mock Supabase
const mockSingle = vi.fn();
vi.mock('@/lib/supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: mockSingle,
    })),
  },
}));

// Mock AudioContext
const mockStop = vi.fn();
const mockStart = vi.fn();
const mockConnect = vi.fn();
const mockSetValueAtTime = vi.fn();
const mockExponentialRampToValueAtTime = vi.fn();
const mockCreateOscillator = vi.fn(() => ({
  connect: mockConnect,
  frequency: { setValueAtTime: mockSetValueAtTime },
  start: mockStart,
  stop: mockStop,
}));
const mockCreateGain = vi.fn(() => ({
  connect: mockConnect,
  gain: {
    setValueAtTime: mockSetValueAtTime,
    exponentialRampToValueAtTime: mockExponentialRampToValueAtTime,
  },
}));
const mockAudioContext = vi.fn(() => ({
  createOscillator: mockCreateOscillator,
  createGain: mockCreateGain,
  destination: {},
  currentTime: 0,
}));

beforeEach(() => {
  mockSingle.mockResolvedValue({ data: { sound_enabled: true, alert_tone: 'alert' } });
  vi.stubGlobal('AudioContext', mockAudioContext);
});

import { useNotificationSound } from '@/hooks/useNotificationSound';

describe('useNotificationSound', () => {
  it('returns playNotificationSound function', () => {
    const { result } = renderHook(() => useNotificationSound());
    expect(typeof result.current.playNotificationSound).toBe('function');
  });

  it('plays sound when sound is enabled', async () => {
    mockSingle.mockResolvedValue({ data: { sound_enabled: true, alert_tone: 'alert' } });
    const { result } = renderHook(() => useNotificationSound());
    await act(async () => {
      await result.current.playNotificationSound();
    });
    expect(mockStart).toHaveBeenCalled();
  });

  it('does not play sound when sound is disabled', async () => {
    mockSingle.mockResolvedValue({ data: { sound_enabled: false, alert_tone: 'alert' } });
    mockStart.mockClear();
    const { result } = renderHook(() => useNotificationSound());
    await act(async () => {
      await result.current.playNotificationSound();
    });
    expect(mockStart).not.toHaveBeenCalled();
  });

  it('plays sound when no user (defaults to enabled=false → no play)', async () => {
    const { useAuth } = await import('@/providers/AuthProvider');
    vi.mocked(useAuth).mockReturnValueOnce({ user: null } as ReturnType<typeof useAuth>);
    mockStart.mockClear();
    const { result } = renderHook(() => useNotificationSound());
    await act(async () => {
      await result.current.playNotificationSound();
    });
    // No user → enabled=false → no play
    expect(mockStart).not.toHaveBeenCalled();
  });

  it('supports override tone parameter', async () => {
    mockSingle.mockResolvedValue({ data: { sound_enabled: true, alert_tone: 'alert' } });
    mockStart.mockClear();
    const { result } = renderHook(() => useNotificationSound());
    await act(async () => {
      await result.current.playNotificationSound('chime');
    });
    expect(mockStart).toHaveBeenCalled();
  });

  it('defaults to enabled=true when Supabase returns no data', async () => {
    mockSingle.mockResolvedValue({ data: null });
    mockStart.mockClear();
    const { result } = renderHook(() => useNotificationSound());
    await act(async () => {
      await result.current.playNotificationSound();
    });
    expect(mockStart).toHaveBeenCalled();
  });
});
