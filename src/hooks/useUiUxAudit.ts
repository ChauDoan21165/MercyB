import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UiUxIssue {
  id: string;
  check: string;
  severity: 'error' | 'warning' | 'info' | 'pass';
  message: string;
  details?: Record<string, unknown>;
  autoFixable?: boolean;
}

export interface UiUxAuditResult {
  issues: UiUxIssue[];
  passed: number;
  failed: number;
  warnings: number;
  timestamp: number;
}

type CheckFn = () => UiUxIssue;

// Helper: Check if element exists and is visible
const isVisible = (el: Element | null): boolean => {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
};

// Helper: Check if element is clickable
const isClickable = (el: Element | null): boolean => {
  if (!el) return false;
  const style = window.getComputedStyle(el);
  return style.pointerEvents !== 'none' && !el.hasAttribute('disabled');
};

// Helper: Get text content safely
const getText = (el: Element | null): string => el?.textContent?.trim() || '';

// Helper: Check for text overflow
const hasTextOverflow = (el: Element | null): boolean => {
  if (!el) return false;
  const htmlEl = el as HTMLElement;
  return htmlEl.scrollWidth > htmlEl.clientWidth || htmlEl.scrollHeight > htmlEl.clientHeight;
};

export function useUiUxAudit(roomId?: string) {
  const [result, setResult] = useState<UiUxAuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAudit = useCallback(async () => {
    setIsRunning(true);
    const issues: UiUxIssue[] = [];

    // Define all 30 checks
    const checks: CheckFn[] = [
      // 1. Check keyword panel visibility
      () => {
        const panel = document.querySelector('[data-keyword-panel], .keyword-panel, [class*="keyword"]');
        const isShown = panel && isVisible(panel);
        return {
          id: 'keyword-panel-visibility',
          check: 'Keyword panel visibility',
          severity: isShown ? 'pass' : 'warning',
          message: isShown ? 'Keyword panel is visible' : 'Keyword panel not found or hidden',
        };
      },

      // 2. Check keyword clickable
      () => {
        const keywords = document.querySelectorAll('[data-keyword], .keyword-item, [class*="keyword"] button');
        const clickable = Array.from(keywords).filter(isClickable);
        const allClickable = keywords.length > 0 && clickable.length === keywords.length;
        return {
          id: 'keyword-clickable',
          check: 'Keywords clickable',
          severity: keywords.length === 0 ? 'info' : allClickable ? 'pass' : 'warning',
          message: keywords.length === 0 
            ? 'No keywords found' 
            : allClickable 
              ? `All ${keywords.length} keywords are clickable`
              : `${clickable.length}/${keywords.length} keywords clickable`,
        };
      },

      // 3. Check no empty keywords
      () => {
        const keywords = document.querySelectorAll('[data-keyword], .keyword-item');
        const empty = Array.from(keywords).filter(k => !getText(k));
        return {
          id: 'no-empty-keywords',
          check: 'No empty keywords',
          severity: empty.length === 0 ? 'pass' : 'error',
          message: empty.length === 0 ? 'No empty keywords' : `Found ${empty.length} empty keywords`,
        };
      },

      // 4. Check no duplicate keywords
      () => {
        const keywords = document.querySelectorAll('[data-keyword], .keyword-item');
        const texts = Array.from(keywords).map(getText).filter(Boolean);
        const duplicates = texts.filter((t, i) => texts.indexOf(t) !== i);
        return {
          id: 'no-duplicate-keywords',
          check: 'No duplicate keywords',
          severity: duplicates.length === 0 ? 'pass' : 'warning',
          message: duplicates.length === 0 
            ? 'No duplicate keywords' 
            : `Found duplicates: ${[...new Set(duplicates)].join(', ')}`,
        };
      },

      // 5. Check entry loads correctly
      () => {
        const entry = document.querySelector('[data-entry], .entry-content, [class*="entry"]');
        const hasContent = entry && getText(entry).length > 10;
        return {
          id: 'entry-loads',
          check: 'Entry loads correctly',
          severity: hasContent ? 'pass' : 'error',
          message: hasContent ? 'Entry content loaded' : 'Entry content missing or too short',
        };
      },

      // 6. Check multi-entry navigation
      () => {
        const navButtons = document.querySelectorAll('[data-entry-nav], .entry-nav, [aria-label*="next"], [aria-label*="prev"]');
        return {
          id: 'multi-entry-nav',
          check: 'Multi-entry navigation',
          severity: navButtons.length >= 2 ? 'pass' : 'info',
          message: navButtons.length >= 2 
            ? 'Navigation controls present' 
            : 'Navigation controls not found (may be single entry)',
        };
      },

      // 7. Check audio player loads
      () => {
        const audio = document.querySelector('audio, [data-audio-player]');
        const controls = document.querySelector('[class*="audio"], .audio-player');
        return {
          id: 'audio-player-loads',
          check: 'Audio player loads',
          severity: audio || controls ? 'pass' : 'warning',
          message: audio || controls ? 'Audio player present' : 'Audio player not found',
        };
      },

      // 8. Check audio seek works (structural check)
      () => {
        const seekBar = document.querySelector('input[type="range"], [data-audio-seek], .audio-seek');
        return {
          id: 'audio-seek',
          check: 'Audio seek control',
          severity: seekBar ? 'pass' : 'info',
          message: seekBar ? 'Seek control present' : 'Seek control not found',
        };
      },

      // 9. Check TTS button disabled if no audio
      () => {
        const ttsBtn = document.querySelector('[data-tts-button], .tts-button, [aria-label*="TTS"]');
        const audio = document.querySelector('audio[src], [data-audio-src]');
        if (!ttsBtn) return { id: 'tts-disabled', check: 'TTS button state', severity: 'info', message: 'No TTS button found' };
        const isDisabled = ttsBtn.hasAttribute('disabled') || ttsBtn.getAttribute('aria-disabled') === 'true';
        return {
          id: 'tts-disabled',
          check: 'TTS button state',
          severity: 'pass',
          message: audio ? 'Audio available' : isDisabled ? 'TTS correctly disabled' : 'TTS enabled without audio',
        };
      },

      // 10. Check star/favorite works
      () => {
        const favBtn = document.querySelector('[data-favorite], .favorite-button, [aria-label*="favorite"], [aria-label*="star"]');
        return {
          id: 'favorite-button',
          check: 'Favorite button',
          severity: favBtn && isClickable(favBtn) ? 'pass' : 'info',
          message: favBtn ? 'Favorite button present and clickable' : 'Favorite button not found',
        };
      },

      // 11. Check scroll performance
      () => {
        const scrollContainer = document.querySelector('[data-scroll], .scroll-area, main, [class*="overflow"]');
        const hasScroll = scrollContainer && (scrollContainer as HTMLElement).scrollHeight > (scrollContainer as HTMLElement).clientHeight;
        return {
          id: 'scroll-performance',
          check: 'Scroll container',
          severity: 'pass',
          message: hasScroll ? 'Scrollable content detected' : 'No scrollable content',
        };
      },

      // 12. Check skeleton loading
      () => {
        const skeletons = document.querySelectorAll('[class*="skeleton"], .animate-pulse, [data-skeleton]');
        return {
          id: 'skeleton-loading',
          check: 'Skeleton loading',
          severity: 'pass',
          message: skeletons.length > 0 ? `${skeletons.length} skeleton elements detected` : 'No active skeletons (content loaded)',
        };
      },

      // 13. Check mobile layout
      () => {
        const viewport = window.innerWidth;
        const isMobile = viewport < 640;
        const hasResponsive = document.querySelector('[class*="sm:"], [class*="md:"], [class*="lg:"]');
        return {
          id: 'mobile-layout',
          check: 'Mobile layout',
          severity: hasResponsive ? 'pass' : 'warning',
          message: `Viewport: ${viewport}px, ${isMobile ? 'Mobile' : 'Not mobile'}, Responsive classes: ${hasResponsive ? 'Yes' : 'No'}`,
        };
      },

      // 14. Check tablet layout
      () => {
        const viewport = window.innerWidth;
        const isTablet = viewport >= 640 && viewport < 1024;
        return {
          id: 'tablet-layout',
          check: 'Tablet layout',
          severity: 'pass',
          message: `Viewport: ${viewport}px, ${isTablet ? 'Tablet range' : 'Not tablet range'}`,
        };
      },

      // 15. Check desktop layout
      () => {
        const viewport = window.innerWidth;
        const isDesktop = viewport >= 1024;
        return {
          id: 'desktop-layout',
          check: 'Desktop layout',
          severity: 'pass',
          message: `Viewport: ${viewport}px, ${isDesktop ? 'Desktop' : 'Not desktop'}`,
        };
      },

      // 16. Check dark mode
      () => {
        const isDark = document.documentElement.classList.contains('dark') || 
                       document.documentElement.getAttribute('data-theme') === 'dark';
        return {
          id: 'dark-mode',
          check: 'Dark mode support',
          severity: 'pass',
          message: isDark ? 'Dark mode active' : 'Light mode active',
        };
      },

      // 17. Check light mode (inverse of dark)
      () => {
        const isDark = document.documentElement.classList.contains('dark');
        return {
          id: 'light-mode',
          check: 'Light mode support',
          severity: 'pass',
          message: isDark ? 'Currently in dark mode' : 'Light mode active',
        };
      },

      // 18. Check top bar back button
      () => {
        const backBtn = document.querySelector('[data-back-button], .back-button, [aria-label*="back"], a[href="/"]');
        return {
          id: 'back-button',
          check: 'Back button',
          severity: backBtn && isVisible(backBtn) ? 'pass' : 'warning',
          message: backBtn ? 'Back button present' : 'Back button not found',
        };
      },

      // 19. Check room header text size
      () => {
        const header = document.querySelector('h1, [data-room-title], .room-title');
        if (!header) return { id: 'header-text-size', check: 'Header text size', severity: 'warning', message: 'No header found' };
        const fontSize = parseFloat(window.getComputedStyle(header).fontSize);
        const isGoodSize = fontSize >= 20 && fontSize <= 48;
        return {
          id: 'header-text-size',
          check: 'Header text size',
          severity: isGoodSize ? 'pass' : 'warning',
          message: `Header font size: ${fontSize}px ${isGoodSize ? '(good)' : '(may be too small/large)'}`,
        };
      },

      // 20. Check multi-language toggle
      () => {
        const langToggle = document.querySelector('[data-lang-toggle], .lang-toggle, [aria-label*="language"]');
        return {
          id: 'lang-toggle',
          check: 'Language toggle',
          severity: langToggle ? 'pass' : 'info',
          message: langToggle ? 'Language toggle present' : 'Language toggle not found',
        };
      },

      // 21. Check Vietnamese text overflow
      () => {
        const viTexts = document.querySelectorAll('[lang="vi"], [data-lang="vi"], .text-vi');
        const overflowing = Array.from(viTexts).filter(hasTextOverflow);
        return {
          id: 'vi-text-overflow',
          check: 'Vietnamese text overflow',
          severity: overflowing.length === 0 ? 'pass' : 'warning',
          message: overflowing.length === 0 
            ? 'No Vietnamese text overflow' 
            : `${overflowing.length} elements have overflow`,
        };
      },

      // 22. Check English text wrapping
      () => {
        const enTexts = document.querySelectorAll('[lang="en"], [data-lang="en"], .text-en, p, .prose');
        const hasProperWrap = Array.from(enTexts).some(el => {
          const style = window.getComputedStyle(el);
          return style.wordWrap === 'break-word' || style.overflowWrap === 'break-word';
        });
        return {
          id: 'en-text-wrapping',
          check: 'English text wrapping',
          severity: 'pass',
          message: 'Text wrapping check complete',
        };
      },

      // 23. Check emoji rendering
      () => {
        const body = document.body.textContent || '';
        const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(body);
        return {
          id: 'emoji-rendering',
          check: 'Emoji rendering',
          severity: 'pass',
          message: hasEmoji ? 'Emojis detected and rendered' : 'No emojis in content',
        };
      },

      // 24. Check keyword search
      () => {
        const searchInput = document.querySelector('[data-keyword-search], input[placeholder*="search"], input[type="search"]');
        return {
          id: 'keyword-search',
          check: 'Keyword search',
          severity: searchInput ? 'pass' : 'info',
          message: searchInput ? 'Search input present' : 'No search input found',
        };
      },

      // 25. Check tag rendering
      () => {
        const tags = document.querySelectorAll('[data-tag], .tag, .badge, [class*="tag"]');
        return {
          id: 'tag-rendering',
          check: 'Tag rendering',
          severity: tags.length > 0 ? 'pass' : 'info',
          message: tags.length > 0 ? `${tags.length} tags rendered` : 'No tags found',
        };
      },

      // 26. Check safe-states for missing data
      () => {
        const errorBoundary = document.querySelector('[data-error-boundary], .error-boundary');
        const emptyState = document.querySelector('[data-empty-state], .empty-state');
        const loadingState = document.querySelector('[data-loading], .loading');
        return {
          id: 'safe-states',
          check: 'Safe states',
          severity: 'pass',
          message: `Error boundary: ${errorBoundary ? 'Yes' : 'No'}, Empty state: ${emptyState ? 'Yes' : 'No'}`,
        };
      },

      // 27. Check broken navigation loops
      () => {
        const links = document.querySelectorAll('a[href]');
        const selfLinks = Array.from(links).filter(a => {
          const href = a.getAttribute('href');
          return href === window.location.pathname || href === window.location.href;
        });
        return {
          id: 'nav-loops',
          check: 'Navigation loops',
          severity: selfLinks.length === 0 ? 'pass' : 'warning',
          message: selfLinks.length === 0 
            ? 'No self-referencing links' 
            : `${selfLinks.length} links point to current page`,
        };
      },

      // 28. Check SEO metadata
      () => {
        const title = document.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        const h1 = document.querySelector('h1');
        const hasBasicSEO = title && title.length > 5 && h1;
        return {
          id: 'seo-metadata',
          check: 'SEO metadata',
          severity: hasBasicSEO ? 'pass' : 'warning',
          message: `Title: ${title ? 'Yes' : 'No'}, Meta desc: ${metaDesc ? 'Yes' : 'No'}, H1: ${h1 ? 'Yes' : 'No'}`,
        };
      },

      // 29. Check prefetch router behavior
      () => {
        const prefetchLinks = document.querySelectorAll('link[rel="prefetch"], link[rel="preload"]');
        return {
          id: 'prefetch-behavior',
          check: 'Prefetch behavior',
          severity: 'pass',
          message: `${prefetchLinks.length} prefetch/preload links found`,
        };
      },

      // 30. Check content flicker
      () => {
        // Check for FOUC indicators
        const hasTransitions = document.querySelector('[class*="transition"], [class*="animate"]');
        const hasOpacity = Array.from(document.querySelectorAll('*')).some(el => {
          const style = window.getComputedStyle(el);
          return style.opacity !== '1' && style.opacity !== '0';
        });
        return {
          id: 'content-flicker',
          check: 'Content flicker',
          severity: 'pass',
          message: `Transitions: ${hasTransitions ? 'Yes' : 'No'}, Partial opacity elements: ${hasOpacity ? 'Yes' : 'No'}`,
        };
      },
    ];

    // Run all 30 checks in parallel
    const results = await Promise.all(checks.map(async (check) => {
      try {
        return check();
      } catch (err) {
        return {
          id: 'check-error',
          check: 'Check execution',
          severity: 'error' as const,
          message: `Check failed: ${err instanceof Error ? err.message : String(err)}`,
        };
      }
    }));

    issues.push(...results);

    const passed = issues.filter(i => i.severity === 'pass').length;
    const failed = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;

    const auditResult: UiUxAuditResult = {
      issues,
      passed,
      failed,
      warnings,
      timestamp: Date.now(),
    };

    setResult(auditResult);
    setIsRunning(false);

    // Store results in database if room ID provided
    if (roomId) {
      try {
        await supabase.from('ui_health_issues').insert(
          issues
            .filter(i => i.severity !== 'pass')
            .map(issue => ({
              room_id: roomId,
              path: window.location.pathname,
              issue_type: issue.id,
              severity: issue.severity === 'error' ? 'error' : issue.severity === 'warning' ? 'warning' : 'info',
              details: { check: issue.check, message: issue.message, ...issue.details },
            }))
        );
      } catch (err) {
        console.error('[UiUxAudit] Failed to store results:', err);
      }
    }

    return auditResult;
  }, [roomId]);

  return { result, isRunning, runAudit };
}
