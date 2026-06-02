import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDesignTokenAudit } from '@/hooks/useDesignTokenAudit';

// getComputedStyle stub returns empty strings by default in jsdom
describe('useDesignTokenAudit', () => {
  it('initialises with result=null and isRunning=false', () => {
    const { result } = renderHook(() => useDesignTokenAudit());
    expect(result.current.result).toBeNull();
    expect(result.current.isRunning).toBe(false);
  });

  it('exposes a runAudit function', () => {
    const { result } = renderHook(() => useDesignTokenAudit());
    expect(typeof result.current.runAudit).toBe('function');
  });

  it('sets isRunning=false and result after runAudit completes', async () => {
    const { result } = renderHook(() => useDesignTokenAudit());
    await act(async () => {
      await result.current.runAudit();
    });
    expect(result.current.isRunning).toBe(false);
    expect(result.current.result).not.toBeNull();
  });

  it('result contains issues, passed, failed, warnings, timestamp', async () => {
    const { result } = renderHook(() => useDesignTokenAudit());
    await act(async () => {
      await result.current.runAudit();
    });
    const { result: auditResult } = result.current;
    expect(Array.isArray(auditResult!.issues)).toBe(true);
    expect(typeof auditResult!.passed).toBe('number');
    expect(typeof auditResult!.failed).toBe('number');
    expect(typeof auditResult!.warnings).toBe('number');
    expect(typeof auditResult!.timestamp).toBe('number');
  });

  it('all issues have required shape', async () => {
    const { result } = renderHook(() => useDesignTokenAudit());
    await act(async () => {
      await result.current.runAudit();
    });
    result.current.result!.issues.forEach((issue) => {
      expect(issue).toHaveProperty('id');
      expect(issue).toHaveProperty('check');
      expect(issue).toHaveProperty('severity');
      expect(issue).toHaveProperty('message');
      expect(issue).toHaveProperty('category');
    });
  });

  it('passed count equals issues with severity="pass"', async () => {
    const { result } = renderHook(() => useDesignTokenAudit());
    await act(async () => {
      await result.current.runAudit();
    });
    const passCount = result.current.result!.issues.filter(
      (i) => i.severity === 'pass'
    ).length;
    expect(result.current.result!.passed).toBe(passCount);
  });

  it('runAudit can be called multiple times; result is refreshed', async () => {
    const { result } = renderHook(() => useDesignTokenAudit());
    await act(async () => { await result.current.runAudit(); });
    const ts1 = result.current.result!.timestamp;
    // Tiny wait so timestamp differs
    await new Promise((r) => setTimeout(r, 1));
    await act(async () => { await result.current.runAudit(); });
    const ts2 = result.current.result!.timestamp;
    expect(ts2).toBeGreaterThanOrEqual(ts1);
  });
});
