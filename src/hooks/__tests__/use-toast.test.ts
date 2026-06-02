import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast, toast, reducer } from '@/hooks/use-toast';

describe('reducer', () => {
  const makeToast = (id: string) => ({
    id,
    title: 'Test',
    open: true,
  });

  it('ADD_TOAST adds a toast to state', () => {
    const state = { toasts: [] };
    const next = reducer(state, { type: 'ADD_TOAST', toast: makeToast('1') });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].id).toBe('1');
  });

  it('ADD_TOAST respects TOAST_LIMIT=1 by slicing excess', () => {
    const state = { toasts: [makeToast('existing')] };
    const next = reducer(state, { type: 'ADD_TOAST', toast: makeToast('new') });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].id).toBe('new');
  });

  it('UPDATE_TOAST updates an existing toast by id', () => {
    const state = { toasts: [{ ...makeToast('1'), title: 'Old' }] };
    const next = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'New' } });
    expect(next.toasts[0].title).toBe('New');
  });

  it('DISMISS_TOAST sets open=false on the targeted toast', () => {
    const state = { toasts: [makeToast('1')] };
    const next = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' });
    expect(next.toasts[0].open).toBe(false);
  });

  it('DISMISS_TOAST with no id sets all toasts open=false', () => {
    const state = { toasts: [makeToast('1'), makeToast('2')] };
    const next = reducer(state, { type: 'DISMISS_TOAST' });
    expect(next.toasts.every((t) => t.open === false)).toBe(true);
  });

  it('REMOVE_TOAST with id removes that toast', () => {
    const state = { toasts: [makeToast('1'), makeToast('2')] };
    const next = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].id).toBe('2');
  });

  it('REMOVE_TOAST with no id clears all toasts', () => {
    const state = { toasts: [makeToast('1'), makeToast('2')] };
    const next = reducer(state, { type: 'REMOVE_TOAST' });
    expect(next.toasts).toHaveLength(0);
  });
});

describe('useToast hook', () => {
  it('returns toasts array and toast function', () => {
    const { result } = renderHook(() => useToast());
    expect(Array.isArray(result.current.toasts)).toBe(true);
    expect(typeof result.current.toast).toBe('function');
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('adds a toast when toast() is called', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      result.current.toast({ title: 'Hello' });
    });
    expect(result.current.toasts.length).toBeGreaterThan(0);
    expect(result.current.toasts[0].title).toBe('Hello');
  });

  it('dismiss() sets toast open=false', () => {
    const { result } = renderHook(() => useToast());
    let toastId: string;
    act(() => {
      const t = result.current.toast({ title: 'Dismissable' });
      toastId = t.id;
    });
    act(() => {
      result.current.dismiss(toastId!);
    });
    expect(result.current.toasts.find((t) => t.id === toastId!)?.open).toBe(false);
  });

  it('toast id returned by toast() matches what gets added', () => {
    const { result } = renderHook(() => useToast());
    let returnedId: string;
    act(() => {
      const { id } = result.current.toast({ title: 'Check' });
      returnedId = id;
    });
    expect(result.current.toasts[0].id).toBe(returnedId!);
  });
});
