import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Mock swRecovery to avoid service worker usage
vi.mock('@/lib/swRecovery', () => ({
  unregisterAllServiceWorkers: vi.fn().mockResolvedValue(undefined),
}));

import { useVersionCheck } from '@/hooks/useVersionCheck';

const VERSION_KEY = 'mb_app_version';

const sampleVersion = {
  version: '1.0.0',
  hash: 'abc123',
  buildTime: '2026-01-01T00:00:00Z',
  app: 'mercyblade',
  semver: '1.0.0',
};

const mockFetch = vi.fn();

describe('useVersionCheck', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ ...sampleVersion }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    mockFetch.mockReset();
  });

  it('initialises with null versions and updateAvailable=false', () => {
    const { result } = renderHook(() => useVersionCheck());
    expect(result.current.currentVersion).toBeNull();
    expect(result.current.latestVersion).toBeNull();
    expect(result.current.updateAvailable).toBe(false);
    expect(result.current.checking).toBe(false);
  });

  it('exposes checkForUpdates, applyUpdate, dismissUpdate functions', () => {
    const { result } = renderHook(() => useVersionCheck());
    expect(typeof result.current.checkForUpdates).toBe('function');
    expect(typeof result.current.applyUpdate).toBe('function');
    expect(typeof result.current.dismissUpdate).toBe('function');
  });

  it('does not fetch version before 3s delay', async () => {
    renderHook(() => useVersionCheck());
    expect(mockFetch).not.toHaveBeenCalled();
    // Only 1 second elapsed
    await act(async () => { vi.advanceTimersByTime(1000); });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('stores fetched version in localStorage when no prior version', async () => {
    const { result } = renderHook(() => useVersionCheck());
    await act(async () => {
      await result.current.checkForUpdates();
    });
    expect(localStorage.getItem(VERSION_KEY)).not.toBeNull();
    const stored = JSON.parse(localStorage.getItem(VERSION_KEY)!);
    expect(stored.version).toBe('1.0.0');
  });

  it('checkForUpdates can be called manually to trigger a fetch', async () => {
    const { result } = renderHook(() => useVersionCheck());
    await act(async () => {
      await result.current.checkForUpdates();
    });
    expect(mockFetch).toHaveBeenCalled();
  });

  it('sets updateAvailable=true when server version differs from stored', async () => {
    const oldVersion = { ...sampleVersion, version: '0.9.0', hash: 'old999' };
    localStorage.setItem(VERSION_KEY, JSON.stringify(oldVersion));

    const { result } = renderHook(() => useVersionCheck());
    await act(async () => {
      await result.current.checkForUpdates();
    });
    expect(result.current.updateAvailable).toBe(true);
  });

  it('dismissUpdate resets updateAvailable to false', async () => {
    const oldVersion = { ...sampleVersion, version: '0.9.0', hash: 'old999' };
    localStorage.setItem(VERSION_KEY, JSON.stringify(oldVersion));

    const { result } = renderHook(() => useVersionCheck());
    await act(async () => {
      await result.current.checkForUpdates();
    });
    expect(result.current.updateAvailable).toBe(true);
    act(() => {
      result.current.dismissUpdate();
    });
    expect(result.current.updateAvailable).toBe(false);
  });

  it('does not set updateAvailable when versions match', async () => {
    localStorage.setItem(VERSION_KEY, JSON.stringify(sampleVersion));

    const { result } = renderHook(() => useVersionCheck());
    await act(async () => {
      await result.current.checkForUpdates();
    });
    expect(result.current.updateAvailable).toBe(false);
  });

  it('handles fetch failure gracefully — no throw, updateAvailable stays false', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useVersionCheck());
    await act(async () => {
      await result.current.checkForUpdates();
    });
    expect(result.current.updateAvailable).toBe(false);
  });

  it('handles non-ok fetch response gracefully', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const { result } = renderHook(() => useVersionCheck());
    await act(async () => {
      await result.current.checkForUpdates();
    });
    expect(result.current.updateAvailable).toBe(false);
  });

  it('sets checking=true while check is in flight and false after', async () => {
    let resolveFetch!: (v: unknown) => void;
    mockFetch.mockReturnValue(new Promise((r) => { resolveFetch = r; }));

    const { result } = renderHook(() => useVersionCheck());
    // Start the check
    let checkPromise: Promise<void>;
    act(() => {
      checkPromise = result.current.checkForUpdates();
    });
    expect(result.current.checking).toBe(true);
    // Resolve the fetch
    await act(async () => {
      resolveFetch({ ok: true, json: async () => ({ ...sampleVersion }) });
      await checkPromise!;
    });
    expect(result.current.checking).toBe(false);
  });
});
