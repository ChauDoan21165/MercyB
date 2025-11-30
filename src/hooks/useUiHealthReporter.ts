import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminCheck } from './useAdminCheck';
import { useFeatureFlag } from './useFeatureFlag';

interface UiHealthReporterProps {
  roomId?: string;
  path: string;
}

interface UiIssue {
  room_id: string | null;
  path: string;
  issue_type: string;
  severity: 'error' | 'warning' | 'info';
  details: any;
}

// WCAG contrast ratio calculator
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const lum1 = getLuminance(...rgb1);
  const lum2 = getLuminance(...rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

function parseColor(color: string): [number, number, number] | null {
  // Create temporary element to get computed color
  const temp = document.createElement('div');
  temp.style.color = color;
  document.body.appendChild(temp);
  const computed = window.getComputedStyle(temp).color;
  document.body.removeChild(temp);
  
  const match = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  return null;
}

export const useUiHealthReporter = ({ roomId, path }: UiHealthReporterProps) => {
  const { isAdmin } = useAdminCheck();
  const { enabled: featureEnabled } = useFeatureFlag('ui_health_check');

  useEffect(() => {
    // Only run for admins or when feature flag is enabled
    if (!isAdmin && !featureEnabled) {
      return;
    }

    const issues: UiIssue[] = [];

    // A. Check low contrast title
    const titleElement = document.querySelector('[data-room-title]') as HTMLElement;
    if (titleElement) {
      const computedStyle = window.getComputedStyle(titleElement);
      const textColor = parseColor(computedStyle.color);
      const bgColor = parseColor(computedStyle.backgroundColor);

      if (textColor && bgColor) {
        const ratio = getContrastRatio(textColor, bgColor);
        
        if (ratio < 4.5) {
          issues.push({
            room_id: roomId || null,
            path,
            issue_type: 'low_contrast_title',
            severity: 'error',
            details: {
              measured_ratio: ratio.toFixed(2),
              required_ratio: 4.5,
              text_color: computedStyle.color,
              background_color: computedStyle.backgroundColor,
              element: 'h1[data-room-title]'
            }
          });
        }
      }
    }

    // B. Check missing theme toggles
    const bwToggle = document.querySelector('[data-theme-toggle="bw"]');
    const mercyToggle = document.querySelector('[data-theme-toggle="mercy"]');

    if (!bwToggle) {
      issues.push({
        room_id: roomId || null,
        path,
        issue_type: 'missing_theme_toggle_bw',
        severity: 'warning',
        details: {
          expected_selector: '[data-theme-toggle="bw"]',
          message: 'Black/white theme toggle button is missing'
        }
      });
    }

    if (!mercyToggle) {
      issues.push({
        room_id: roomId || null,
        path,
        issue_type: 'missing_theme_toggle_mercy',
        severity: 'warning',
        details: {
          expected_selector: '[data-theme-toggle="mercy"]',
          message: 'Mercy Blade theme toggle button is missing'
        }
      });
    }

    // Insert issues into database
    if (issues.length > 0) {
      const insertIssues = async () => {
        try {
          const { error } = await supabase
            .from('ui_health_issues')
            .insert(issues);

          if (error) {
            console.error('[useUiHealthReporter] Failed to insert issues:', error);
          } else {
            console.log(`[useUiHealthReporter] Reported ${issues.length} UI issues for ${path}`);
          }
        } catch (err) {
          console.error('[useUiHealthReporter] Exception inserting issues:', err);
        }
      };

      // Debounce insertion to avoid spam
      const timer = setTimeout(insertIssues, 2000);
      return () => clearTimeout(timer);
    }
  }, [roomId, path, isAdmin, featureEnabled]);
};
