import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNinetyDayPlan } from '@/hooks/useNinetyDayPlan';

describe('useNinetyDayPlan', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initialises with plan=null, roadmap=null, isLoading=false, error=null', () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    expect(result.current.plan).toBeNull();
    expect(result.current.roadmap).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('exposes generatePlan, generateRoadmap, clearPlan, clearRoadmap, getSummary, getRoadmapSummaryFn', () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    expect(typeof result.current.generatePlan).toBe('function');
    expect(typeof result.current.generateRoadmap).toBe('function');
    expect(typeof result.current.clearPlan).toBe('function');
    expect(typeof result.current.clearRoadmap).toBe('function');
    expect(typeof result.current.getSummary).toBe('function');
    expect(typeof result.current.getRoadmapSummaryFn).toBe('function');
  });

  it('sets isLoading=true immediately after generatePlan is called', () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    act(() => {
      result.current.generatePlan({ cefrLevel: 'A1', focus: 'mixed' });
    });
    expect(result.current.isLoading).toBe(true);
  });

  it('generates a plan after 300ms delay', async () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    act(() => {
      result.current.generatePlan({ cefrLevel: 'B1', focus: 'listening' });
    });
    await act(async () => {
      vi.advanceTimersByTime(301);
    });
    expect(result.current.plan).not.toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('generates a roadmap after 200ms delay', async () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    act(() => {
      result.current.generateRoadmap({ currentCEFR: 'A1', targetCEFR: 'B1' });
    });
    await act(async () => {
      vi.advanceTimersByTime(201);
    });
    expect(result.current.roadmap).not.toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('clearPlan resets plan and error to null', async () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    act(() => {
      result.current.generatePlan({ cefrLevel: 'A2', focus: 'speaking' });
    });
    await act(async () => { vi.advanceTimersByTime(301); });
    expect(result.current.plan).not.toBeNull();
    act(() => {
      result.current.clearPlan();
    });
    expect(result.current.plan).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('clearRoadmap resets roadmap and error to null', async () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    act(() => {
      result.current.generateRoadmap({ currentCEFR: 'A2', targetCEFR: 'B2' });
    });
    await act(async () => { vi.advanceTimersByTime(201); });
    expect(result.current.roadmap).not.toBeNull();
    act(() => {
      result.current.clearRoadmap();
    });
    expect(result.current.roadmap).toBeNull();
  });

  it('getSummary returns an object with summary info', () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    const summary = result.current.getSummary('B1', 'mixed');
    expect(summary).toBeDefined();
    expect(typeof summary).toBe('object');
  });

  it('getRoadmapSummaryFn returns an object with roadmap summary', () => {
    const { result } = renderHook(() => useNinetyDayPlan());
    const summary = result.current.getRoadmapSummaryFn('A1', 'B1');
    expect(summary).toBeDefined();
    expect(typeof summary).toBe('object');
  });
});
