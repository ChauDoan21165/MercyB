import { preloadCompanionLines } from './companionLines';

/**
 * Preload all companion assets early in app lifecycle
 * Call this in App.tsx or main.tsx
 */
export function preloadCompanionAssets(): void {
  // Preload English friend lines
  preloadCompanionLines();
  
  // Also preload bilingual lines for legacy support
  fetch('/data/companion_lines.json').catch(() => {
    // Silently fail - not critical
  });
}
