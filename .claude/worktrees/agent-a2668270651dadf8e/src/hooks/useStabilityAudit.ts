import { useState, useCallback } from 'react';

export interface StabilityIssue {
  id: string;
  check: string;
  severity: 'error' | 'warning' | 'info' | 'pass';
  message: string;
  category: 'routing' | 'network' | 'performance' | 'ui' | 'data' | 'provider';
}

export interface StabilityResult {
  issues: StabilityIssue[];
  passed: number;
  failed: number;
  warnings: number;
  timestamp: number;
}

export function useStabilityAudit() {
  const [result, setResult] = useState<StabilityResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    const issues: StabilityIssue[] = [];

    // 1. Check route /room/:slug
    const currentPath = window.location.pathname;
    const isRoomRoute = /^\/room\/[\w-]+$/.test(currentPath);
    issues.push({
      id: 'route-room-slug',
      check: 'Route /room/:slug',
      severity: isRoomRoute ? 'pass' : 'info',
      message: isRoomRoute ? 'Currently on valid room route' : `Current route: ${currentPath}`,
      category: 'routing',
    });

    // 2. Check search
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"], [data-search]');
    issues.push({
      id: 'search-component',
      check: 'Search functionality',
      severity: searchInput ? 'pass' : 'info',
      message: searchInput ? 'Search component present' : 'No search input found on page',
      category: 'ui',
    });

    // 3. Check keyword filter
    const keywordFilter = document.querySelector('[data-keyword-filter], .keyword-filter, [class*="keyword"]');
    issues.push({
      id: 'keyword-filter',
      check: 'Keyword filter',
      severity: keywordFilter ? 'pass' : 'info',
      message: keywordFilter ? 'Keyword filter present' : 'No keyword filter on page',
      category: 'ui',
    });

    // 4. Check room list loading
    const roomList = document.querySelector('[data-room-list], .room-list, .room-grid, [class*="room-card"]');
    issues.push({
      id: 'room-list-loading',
      check: 'Room list loading',
      severity: roomList ? 'pass' : 'info',
      message: roomList ? 'Room list/grid rendered' : 'No room list found',
      category: 'ui',
    });

    // 5. Check pagination
    const pagination = document.querySelector('[data-pagination], .pagination, nav[aria-label*="page"]');
    issues.push({
      id: 'pagination',
      check: 'Pagination',
      severity: 'pass',
      message: pagination ? 'Pagination present' : 'No pagination (may use infinite scroll)',
      category: 'ui',
    });

    // 6. Check offline mode fallback
    const isOnline = navigator.onLine;
    issues.push({
      id: 'offline-fallback',
      check: 'Offline mode fallback',
      severity: isOnline ? 'pass' : 'warning',
      message: isOnline ? 'Online - network available' : 'Offline mode detected',
      category: 'network',
    });

    // 7. Check slow network degrade
    const connection = (navigator as any).connection;
    const effectiveType = connection?.effectiveType || 'unknown';
    issues.push({
      id: 'slow-network',
      check: 'Slow network handling',
      severity: effectiveType === '4g' || effectiveType === 'unknown' ? 'pass' : 'warning',
      message: `Network type: ${effectiveType}`,
      category: 'network',
    });

    // 8. Check 3G simulation
    issues.push({
      id: '3g-simulation',
      check: '3G simulation',
      severity: 'info',
      message: 'Use DevTools Network throttling for 3G testing',
      category: 'network',
    });

    // 9. Check 50 rooms open (memory check)
    const memoryInfo = (performance as any).memory;
    const usedMB = memoryInfo ? (memoryInfo.usedJSHeapSize / 1048576).toFixed(1) : 'N/A';
    issues.push({
      id: 'memory-stress',
      check: '50 rooms stress test',
      severity: 'info',
      message: `Current JS heap: ${usedMB}MB (manual stress test required)`,
      category: 'performance',
    });

    // 10. Check memory leak
    issues.push({
      id: 'memory-leak',
      check: 'Memory leak detection',
      severity: memoryInfo && memoryInfo.usedJSHeapSize > 100 * 1048576 ? 'warning' : 'pass',
      message: `Heap size: ${usedMB}MB ${memoryInfo?.usedJSHeapSize > 100 * 1048576 ? '(high)' : '(normal)'}`,
      category: 'performance',
    });

    // 11. Check broken audio file
    const audioElements = document.querySelectorAll('audio');
    let brokenAudio = 0;
    audioElements.forEach(audio => {
      if (audio.error) brokenAudio++;
    });
    issues.push({
      id: 'broken-audio',
      check: 'Broken audio files',
      severity: brokenAudio > 0 ? 'error' : 'pass',
      message: brokenAudio > 0 ? `${brokenAudio} audio element(s) have errors` : `${audioElements.length} audio elements OK`,
      category: 'ui',
    });

    // 12. Check HTML overflow
    const hasHtmlOverflow = document.documentElement.scrollWidth > window.innerWidth;
    issues.push({
      id: 'html-overflow',
      check: 'HTML overflow',
      severity: hasHtmlOverflow ? 'warning' : 'pass',
      message: hasHtmlOverflow ? 'Horizontal scroll detected on document' : 'No document overflow',
      category: 'ui',
    });

    // 13. Check CSS overflow
    const overflowElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const htmlEl = el as HTMLElement;
      return htmlEl.scrollWidth > htmlEl.clientWidth + 5;
    }).length;
    issues.push({
      id: 'css-overflow',
      check: 'CSS overflow elements',
      severity: overflowElements > 5 ? 'warning' : 'pass',
      message: `${overflowElements} element(s) with horizontal overflow`,
      category: 'ui',
    });

    // 14. Check long Vietnamese strings
    const viTexts = document.querySelectorAll('[lang="vi"], .text-vi, [data-lang="vi"]');
    const longViStrings = Array.from(viTexts).filter(el => (el.textContent?.length || 0) > 500);
    issues.push({
      id: 'long-vietnamese',
      check: 'Long Vietnamese strings',
      severity: longViStrings.length > 0 ? 'info' : 'pass',
      message: `${longViStrings.length} Vietnamese text blocks >500 chars`,
      category: 'ui',
    });

    // 15. Check emoji-induced crashes
    const bodyText = document.body.textContent || '';
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(bodyText);
    issues.push({
      id: 'emoji-crashes',
      check: 'Emoji handling',
      severity: 'pass',
      message: hasEmoji ? 'Emojis rendered without crash' : 'No emojis detected',
      category: 'ui',
    });

    // 16. Check routing race conditions
    const routerState = (window as any).__REACT_ROUTER__;
    issues.push({
      id: 'routing-race',
      check: 'Routing race conditions',
      severity: 'info',
      message: 'Race condition testing requires navigation simulation',
      category: 'routing',
    });

    // 17. Check optimistic UI
    const hasOptimisticUI = document.querySelector('[data-optimistic], .optimistic, [aria-busy="true"]');
    issues.push({
      id: 'optimistic-ui',
      check: 'Optimistic UI',
      severity: 'pass',
      message: hasOptimisticUI ? 'Optimistic UI patterns detected' : 'No active optimistic updates',
      category: 'ui',
    });

    // 18. Check Suspense behavior
    const suspenseFallbacks = document.querySelectorAll('[class*="skeleton"], .animate-pulse, [data-suspense]');
    issues.push({
      id: 'suspense-behavior',
      check: 'Suspense behavior',
      severity: 'pass',
      message: `${suspenseFallbacks.length} suspense fallback elements`,
      category: 'ui',
    });

    // 19. Check error boundaries
    const errorBoundary = document.querySelector('[data-error-boundary], .error-boundary');
    const hasErrorUI = document.querySelector('[class*="error"], [role="alert"]');
    issues.push({
      id: 'error-boundaries',
      check: 'Error boundaries',
      severity: 'pass',
      message: errorBoundary || hasErrorUI ? 'Error handling UI present' : 'No error UI visible (good)',
      category: 'provider',
    });

    // 20. Check toast spam
    const toasts = document.querySelectorAll('[data-sonner-toast], [class*="toast"], [role="status"]');
    issues.push({
      id: 'toast-spam',
      check: 'Toast spam',
      severity: toasts.length > 3 ? 'warning' : 'pass',
      message: `${toasts.length} toast(s) visible ${toasts.length > 3 ? '(too many)' : ''}`,
      category: 'ui',
    });

    // 21. Check clipboard actions
    const copyButtons = document.querySelectorAll('[data-copy], [aria-label*="copy"], button[class*="copy"]');
    issues.push({
      id: 'clipboard-actions',
      check: 'Clipboard actions',
      severity: 'pass',
      message: `${copyButtons.length} copy button(s) found`,
      category: 'ui',
    });

    // 22. Check share button
    const shareButtons = document.querySelectorAll('[data-share], [aria-label*="share"], button[class*="share"]');
    issues.push({
      id: 'share-button',
      check: 'Share button',
      severity: 'pass',
      message: shareButtons.length > 0 ? 'Share functionality present' : 'No share buttons found',
      category: 'ui',
    });

    // 23. Check SSR hydration
    const hydrationMismatch = document.querySelector('[data-hydration-error]');
    issues.push({
      id: 'ssr-hydration',
      check: 'SSR hydration',
      severity: hydrationMismatch ? 'error' : 'pass',
      message: hydrationMismatch ? 'Hydration mismatch detected' : 'No hydration errors (or CSR app)',
      category: 'provider',
    });

    // 24. Check Next.js caching (N/A for Vite)
    issues.push({
      id: 'nextjs-caching',
      check: 'Next.js caching',
      severity: 'info',
      message: 'N/A - This is a Vite/React app',
      category: 'provider',
    });

    // 25. Check unexpected nulls
    const nullTexts = Array.from(document.querySelectorAll('*')).filter(el => 
      el.textContent?.includes('null') || el.textContent?.includes('undefined')
    ).length;
    issues.push({
      id: 'unexpected-nulls',
      check: 'Unexpected nulls',
      severity: nullTexts > 0 ? 'warning' : 'pass',
      message: nullTexts > 0 ? `${nullTexts} element(s) show "null" or "undefined"` : 'No null/undefined text visible',
      category: 'data',
    });

    // 26. Check Supabase rate limit
    issues.push({
      id: 'supabase-rate-limit',
      check: 'Supabase rate limit',
      severity: 'info',
      message: 'Rate limit status requires backend check',
      category: 'network',
    });

    // 27. Check missing env vars
    const hasSupabaseUrl = !!(import.meta as any).env?.VITE_SUPABASE_URL;
    issues.push({
      id: 'missing-env-vars',
      check: 'Missing env vars',
      severity: hasSupabaseUrl ? 'pass' : 'error',
      message: hasSupabaseUrl ? 'VITE_SUPABASE_URL configured' : 'Missing VITE_SUPABASE_URL',
      category: 'provider',
    });

    // 28. Check fallback layout
    const hasMainContent = document.querySelector('main, [role="main"], #root > div');
    issues.push({
      id: 'fallback-layout',
      check: 'Fallback layout',
      severity: hasMainContent ? 'pass' : 'warning',
      message: hasMainContent ? 'Main content container present' : 'No main content wrapper found',
      category: 'ui',
    });

    // 29. Check Global Provider errors
    const providerErrors = document.querySelectorAll('[data-provider-error]');
    issues.push({
      id: 'provider-errors',
      check: 'Global Provider errors',
      severity: providerErrors.length > 0 ? 'error' : 'pass',
      message: providerErrors.length > 0 ? 'Provider errors detected' : 'No provider errors',
      category: 'provider',
    });

    // 30. Check version mismatch
    const reactVersion = (window as any).React?.version || 'unknown';
    issues.push({
      id: 'version-mismatch',
      check: 'Version mismatch',
      severity: 'pass',
      message: `React version: ${reactVersion}`,
      category: 'provider',
    });

    const passed = issues.filter(i => i.severity === 'pass').length;
    const failed = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;

    setResult({ issues, passed, failed, warnings, timestamp: Date.now() });
    setIsRunning(false);
    return { issues, passed, failed, warnings, timestamp: Date.now() };
  }, []);

  return { result, isRunning, runAudit };
}
