/**
 * Theme Loader Script
 * Prevents theme flicker during hydration by setting theme before React loads
 * 
 * Usage: Add this script to index.html in <head> before any other scripts
 */

export const THEME_LOADER_SCRIPT = `
(function() {
  try {
    const theme = localStorage.getItem('mercy-blade-theme') || 'system';
    const root = document.documentElement;
    
    // Set data attribute for theme
    root.setAttribute('data-theme', theme);
    
    // Set class for Tailwind dark mode
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Set body class for theme-specific styling
    if (theme === 'color') {
      document.body.classList.add('mb-theme-color');
    } else {
      document.body.classList.add('mb-theme-bw');
    }
  } catch (e) {
    // Fail silently - default theme will be applied by React
  }
})();
`;

/**
 * Sync theme with body class after React hydration
 */
export function syncThemeClass(theme: string) {
  try {
    document.body.classList.remove('mb-theme-color', 'mb-theme-bw');
    
    if (theme === 'color') {
      document.body.classList.add('mb-theme-color');
    } else {
      document.body.classList.add('mb-theme-bw');
    }
  } catch (e) {
    console.warn('Failed to sync theme class:', e);
  }
}
