import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { MbThemeProvider, useMbTheme, useMbThemeSafe } from '@/hooks/useMbTheme';

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(MbThemeProvider, null, children);

describe('useMbTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mb-theme');
  });

  it('throws when used outside MbThemeProvider', () => {
    expect(() => {
      renderHook(() => useMbTheme());
    }).toThrow('useMbTheme must be used inside <MbThemeProvider>');
  });

  it('provides default mode "color"', () => {
    const { result } = renderHook(() => useMbTheme(), { wrapper });
    expect(result.current.mode).toBe('color');
  });

  it('toggle switches from color to bw', () => {
    const { result } = renderHook(() => useMbTheme(), { wrapper });
    act(() => {
      result.current.toggle();
    });
    expect(result.current.mode).toBe('bw');
  });

  it('toggle switches from bw back to color', () => {
    localStorage.setItem('mb-theme-mode', 'bw');
    const { result } = renderHook(() => useMbTheme(), { wrapper });
    // Wait for the useEffect to read localStorage
    act(() => {});
    act(() => {
      result.current.toggle();
    });
    expect(result.current.mode).toBe('color');
  });

  it('setMode updates the mode', () => {
    const { result } = renderHook(() => useMbTheme(), { wrapper });
    act(() => {
      result.current.setMode('bw');
    });
    expect(result.current.mode).toBe('bw');
  });

  it('persists mode to localStorage on setMode', () => {
    const { result } = renderHook(() => useMbTheme(), { wrapper });
    act(() => {
      result.current.setMode('bw');
    });
    expect(localStorage.getItem('mb-theme-mode')).toBe('bw');
  });

  it('sets data-mb-theme attribute on documentElement', () => {
    const { result } = renderHook(() => useMbTheme(), { wrapper });
    act(() => {
      result.current.setMode('bw');
    });
    expect(document.documentElement.getAttribute('data-mb-theme')).toBe('bw');
  });
});

describe('useMbThemeSafe', () => {
  it('returns null when no provider present', () => {
    const { result } = renderHook(() => useMbThemeSafe());
    expect(result.current).toBeNull();
  });

  it('returns context value when provider present', () => {
    const { result } = renderHook(() => useMbThemeSafe(), { wrapper });
    expect(result.current).not.toBeNull();
    expect(result.current?.mode).toBe('color');
  });
});
