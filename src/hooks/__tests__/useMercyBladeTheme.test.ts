import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMercyBladeTheme } from '@/hooks/useMercyBladeTheme';

describe('useMercyBladeTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset data attribute
    delete document.documentElement.dataset.mbTheme;
  });

  it('defaults to "color" mode when no stored preference', () => {
    const { result } = renderHook(() => useMercyBladeTheme());
    expect(result.current.mode).toBe('color');
    expect(result.current.isColor).toBe(true);
    expect(result.current.isBW).toBe(false);
  });

  it('reads stored "bw" from localStorage on mount', () => {
    localStorage.setItem('mb_visual_mode', 'bw');
    const { result } = renderHook(() => useMercyBladeTheme());
    expect(result.current.mode).toBe('bw');
    expect(result.current.isBW).toBe(true);
    expect(result.current.isColor).toBe(false);
  });

  it('setMode changes mode and persists to localStorage', () => {
    const { result } = renderHook(() => useMercyBladeTheme());
    act(() => {
      result.current.setMode('bw');
    });
    expect(result.current.mode).toBe('bw');
    expect(localStorage.getItem('mb_visual_mode')).toBe('bw');
  });

  it('toggleMode switches from color to bw', () => {
    const { result } = renderHook(() => useMercyBladeTheme());
    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe('bw');
  });

  it('toggleMode switches from bw back to color', () => {
    localStorage.setItem('mb_visual_mode', 'bw');
    const { result } = renderHook(() => useMercyBladeTheme());
    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.mode).toBe('color');
  });

  it('sets data-mb-theme attribute on documentElement when mode changes', () => {
    const { result } = renderHook(() => useMercyBladeTheme());
    act(() => {
      result.current.setMode('bw');
    });
    expect(document.documentElement.dataset.mbTheme).toBe('bw');
  });

  it('respects custom defaultMode option', () => {
    const { result } = renderHook(() => useMercyBladeTheme({ defaultMode: 'bw' }));
    expect(result.current.mode).toBe('bw');
  });

  it('stored value overrides defaultMode option', () => {
    localStorage.setItem('mb_visual_mode', 'color');
    const { result } = renderHook(() => useMercyBladeTheme({ defaultMode: 'bw' }));
    expect(result.current.mode).toBe('color');
  });
});
