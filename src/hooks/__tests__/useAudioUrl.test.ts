// Path: src/hooks/__tests__/useAudioUrl.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

type ResolvedAudio = {
  url: string;
  fallback: boolean;
  error?: Error;
};

// ── Module mock ──────────────────────────────────────────────────────────────
// Reproduce the contract CC #1 shipped in src/lib/roomAudioResolver.ts.

const mockResolve = vi.fn<
  (key: string | null | undefined, opts?: { bustCache?: boolean }) => Promise<ResolvedAudio | null>
>();

vi.mock('@/lib/roomAudioResolver', () => {
  function toAudioKey(raw: unknown): string | null {
    if (typeof raw !== 'string') return null;
    const t = raw.trim();
    if (!t) return null;
    if (/^https?:\/\//i.test(t)) return t;
    let s = t;
    if (s.startsWith('private:')) s = s.slice('private:'.length);
    s = s.replace(/^\/+/, '').replace(/^public\//, '');
    while (s.startsWith('audio/')) s = s.slice('audio/'.length);
    return s || null;
  }

  function tryResolveLocal(key: string | null | undefined): string | null {
    if (!key) return null;
    if (/^https?:\/\//i.test(key)) return key;
    return null;
  }

  return {
    toAudioKey,
    tryResolveLocal,
    resolveRoomAudioUrl: (
      key: string | null | undefined,
      opts?: { bustCache?: boolean },
    ) => mockResolve(key, opts),
  };
});

import { useAudioUrl } from '../useAudioUrl';

beforeEach(() => {
  mockResolve.mockReset();
});

// ── Empty / null inputs ──────────────────────────────────────────────────────

describe('useAudioUrl — empty inputs', () => {
  it('empty string → zero state, no resolver call', () => {
    const { result } = renderHook(() => useAudioUrl(''));
    expect(result.current.url).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockResolve).not.toHaveBeenCalled();
  });

  it('null → zero state', () => {
    const { result } = renderHook(() => useAudioUrl(null));
    expect(result.current.url).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockResolve).not.toHaveBeenCalled();
  });

  it('undefined → zero state', () => {
    const { result } = renderHook(() => useAudioUrl(undefined));
    expect(result.current.url).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockResolve).not.toHaveBeenCalled();
  });

  it('whitespace-only → zero state', () => {
    const { result } = renderHook(() => useAudioUrl('   '));
    expect(result.current.url).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(mockResolve).not.toHaveBeenCalled();
  });
});

// ── Sync short-circuit (absolute URLs only post-migration) ───────────────────

describe('useAudioUrl — sync short-circuit for absolute URLs', () => {
  it('https:// absolute → passthrough synchronously, no resolver call', () => {
    const { result } = renderHook(() => useAudioUrl('https://cdn.example.com/x.mp3'));
    expect(result.current.url).toBe('https://cdn.example.com/x.mp3');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockResolve).not.toHaveBeenCalled();
  });
});

// ── kids / music now flow through the async resolver (Supabase) ──────────────

describe('useAudioUrl — kids and music go through Supabase', () => {
  it('kids/ key dispatches the async resolver', async () => {
    mockResolve.mockResolvedValue({ url: 'https://supabase.example/kids/airplane.mp3', fallback: false });
    const { result } = renderHook(() => useAudioUrl('kids/airplane.mp3'));
    expect(result.current.loading).toBe(true);
    expect(mockResolve).toHaveBeenCalledWith('kids/airplane.mp3', undefined);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.url).toBe('https://supabase.example/kids/airplane.mp3');
  });

  it('music/ key dispatches the async resolver', async () => {
    mockResolve.mockResolvedValue({ url: 'https://supabase.example/music/theme.mp3', fallback: false });
    const { result } = renderHook(() => useAudioUrl('music/theme.mp3'));
    expect(result.current.loading).toBe(true);
    expect(mockResolve).toHaveBeenCalledWith('music/theme.mp3', undefined);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.url).toBe('https://supabase.example/music/theme.mp3');
  });

  it('/audio/kids/ prefix is normalized and dispatched', async () => {
    mockResolve.mockResolvedValue({ url: 'https://supabase.example/kids/x.mp3', fallback: false });
    const { result } = renderHook(() => useAudioUrl('/audio/kids/x.mp3'));
    expect(mockResolve).toHaveBeenCalledWith('kids/x.mp3', undefined);
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

// ── A6: legacy "private:" prefix stripping ───────────────────────────────────

describe('useAudioUrl — legacy private: prefix (A6)', () => {
  it('"private:foo.mp3" strips to adult-room key and dispatches async resolver', async () => {
    mockResolve.mockResolvedValue({ url: 'https://signed.example/foo.mp3', fallback: false });

    const { result } = renderHook(() => useAudioUrl('private:foo.mp3'));

    expect(result.current.loading).toBe(true);
    expect(mockResolve).toHaveBeenCalledTimes(1);
    expect(mockResolve).toHaveBeenCalledWith('foo.mp3', undefined);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.url).toBe('https://signed.example/foo.mp3');
    expect(result.current.error).toBeNull();
  });
});

// ── Adult-room async path ────────────────────────────────────────────────────

describe('useAudioUrl — adult-room async path', () => {
  it('happy path: loading → resolved URL, no error', async () => {
    mockResolve.mockResolvedValue({
      url: 'https://supabase.example/alexander.mp3',
      fallback: false,
    });

    const { result } = renderHook(() => useAudioUrl('alexander_v2_1_en.mp3'));
    expect(result.current.loading).toBe(true);
    expect(result.current.url).toBeNull();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.url).toBe('https://supabase.example/alexander.mp3');
    expect(result.current.error).toBeNull();
  });

  it('resolver returns fallback: url = local fallback, error populated', async () => {
    const fallbackError = new Error('Supabase 500');
    mockResolve.mockResolvedValue({
      url: '/audio/alexander_v2_1_en.mp3',
      fallback: true,
      error: fallbackError,
    });

    const { result } = renderHook(() => useAudioUrl('alexander_v2_1_en.mp3'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.url).toBe('/audio/alexander_v2_1_en.mp3');
    expect(result.current.error).toBe(fallbackError);
  });

  it('resolver throws (defensive): error set with best-effort fallback URL', async () => {
    mockResolve.mockRejectedValue(new Error('network blew up'));

    const { result } = renderHook(() => useAudioUrl('alexander_v2_1_en.mp3'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.url).toBe('/audio/alexander_v2_1_en.mp3');
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('resolver returns null (input was stripped to null): zero state', async () => {
    mockResolve.mockResolvedValue(null);

    const { result } = renderHook(() => useAudioUrl('alexander_v2_1_en.mp3'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.url).toBeNull();
    expect(result.current.error).toBeNull();
  });
});

// ── Filename change mid-flight ───────────────────────────────────────────────

describe('useAudioUrl — filename change mid-flight', () => {
  it('stale resolution from previous filename is dropped', async () => {
    let resolveA: (r: ResolvedAudio) => void = () => {};
    let resolveB: (r: ResolvedAudio) => void = () => {};

    mockResolve
      .mockImplementationOnce(() => new Promise<ResolvedAudio>((res) => { resolveA = res; }))
      .mockImplementationOnce(() => new Promise<ResolvedAudio>((res) => { resolveB = res; }));

    const { result, rerender } = renderHook(
      ({ name }: { name: string }) => useAudioUrl(name),
      { initialProps: { name: 'fileA.mp3' } },
    );

    expect(result.current.loading).toBe(true);

    rerender({ name: 'fileB.mp3' });
    expect(result.current.loading).toBe(true);

    // Resolve B first, then A (stale) — A must not overwrite B's result.
    await act(async () => {
      resolveB({ url: 'urlB', fallback: false });
    });
    await waitFor(() => expect(result.current.url).toBe('urlB'));

    await act(async () => {
      resolveA({ url: 'urlA', fallback: false });
    });
    // Give any stale promise a tick to flush.
    await new Promise((r) => setTimeout(r, 0));

    expect(result.current.url).toBe('urlB');
    expect(result.current.loading).toBe(false);
  });
});

// ── Refresh ──────────────────────────────────────────────────────────────────

describe('useAudioUrl — refresh()', () => {
  it('re-dispatches resolver with { bustCache: true } and retains previous URL mid-refresh', async () => {
    let pendingResolve: (r: ResolvedAudio) => void = () => {};

    mockResolve
      .mockResolvedValueOnce({ url: 'url-1', fallback: false })
      .mockImplementationOnce(() => new Promise<ResolvedAudio>((res) => { pendingResolve = res; }));

    const { result } = renderHook(() => useAudioUrl('file.mp3'));

    await waitFor(() => expect(result.current.url).toBe('url-1'));
    expect(mockResolve).toHaveBeenCalledWith('file.mp3', undefined);

    // Hit refresh.
    act(() => {
      result.current.refresh();
    });

    // Mid-refresh: loading flipped, previous URL retained so <audio> doesn't break.
    expect(result.current.loading).toBe(true);
    expect(result.current.url).toBe('url-1');
    expect(mockResolve).toHaveBeenLastCalledWith('file.mp3', { bustCache: true });

    // New URL lands.
    await act(async () => {
      pendingResolve({ url: 'url-2', fallback: false });
    });
    await waitFor(() => expect(result.current.url).toBe('url-2'));
    expect(result.current.loading).toBe(false);
  });

  it('refresh identity is stable across renders', async () => {
    mockResolve.mockResolvedValue({ url: 'u', fallback: false });
    const { result, rerender } = renderHook(() => useAudioUrl('file.mp3'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const first = result.current.refresh;
    rerender();
    expect(result.current.refresh).toBe(first);
  });

  it('subsequent calls after refresh (no refresh): no bustCache flag', async () => {
    mockResolve
      .mockResolvedValueOnce({ url: 'url-1', fallback: false })
      .mockResolvedValueOnce({ url: 'url-2', fallback: false })
      .mockResolvedValueOnce({ url: 'url-3', fallback: false });

    const { result, rerender } = renderHook(
      ({ name }: { name: string }) => useAudioUrl(name),
      { initialProps: { name: 'a.mp3' } },
    );
    await waitFor(() => expect(result.current.url).toBe('url-1'));

    act(() => {
      result.current.refresh();
    });
    await waitFor(() => expect(result.current.url).toBe('url-2'));
    expect(mockResolve).toHaveBeenNthCalledWith(2, 'a.mp3', { bustCache: true });

    // Change filename AFTER refresh — bustNextRef should be reset, no bustCache.
    rerender({ name: 'b.mp3' });
    await waitFor(() => expect(result.current.url).toBe('url-3'));
    expect(mockResolve).toHaveBeenNthCalledWith(3, 'b.mp3', undefined);
  });
});

// ── Unmount mid-flight ───────────────────────────────────────────────────────

describe('useAudioUrl — unmount mid-flight', () => {
  it('late resolution after unmount does not warn', async () => {
    const warnSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let resolveLate: (r: ResolvedAudio) => void = () => {};
    mockResolve.mockImplementationOnce(
      () => new Promise<ResolvedAudio>((res) => { resolveLate = res; }),
    );

    const { unmount } = renderHook(() => useAudioUrl('file.mp3'));
    unmount();

    await act(async () => {
      resolveLate({ url: 'late', fallback: false });
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

// ── Object identity ──────────────────────────────────────────────────────────

describe('useAudioUrl — result identity stability', () => {
  it('result object identity is stable across renders when state unchanged', async () => {
    mockResolve.mockResolvedValue({ url: 'u', fallback: false });
    const { result, rerender } = renderHook(() => useAudioUrl('file.mp3'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
