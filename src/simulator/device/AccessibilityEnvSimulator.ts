// Accessibility Environment Simulator - Simulate accessibility scenarios

let activeA11yModes: string[] = [];

export function enableScreenReaderMode(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('a11y-screen-reader');
  document.documentElement.setAttribute('data-screen-reader', 'true');
  activeA11yModes.push('screen-reader');

  // Add ARIA live region announcer
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-10000px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  document.body.appendChild(announcer);

  console.log('[AccessibilityEnvSimulator] Enabled screen reader mode');
}

export function enableLargeTextMode(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('a11y-large-text');
  document.documentElement.style.fontSize = '125%';
  activeA11yModes.push('large-text');

  console.log('[AccessibilityEnvSimulator] Enabled large text mode');
}

export function enableHighContrastMode(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('a11y-high-contrast');
  activeA11yModes.push('high-contrast');

  // Add high contrast styles
  const style = document.createElement('style');
  style.id = 'a11y-high-contrast-styles';
  style.textContent = `
    .a11y-high-contrast {
      --background: 0 0% 100%;
      --foreground: 0 0% 0%;
      --primary: 0 0% 0%;
      --primary-foreground: 0 0% 100%;
      --border: 0 0% 0%;
    }
    .a11y-high-contrast * {
      border-color: black !important;
      outline-color: black !important;
    }
  `;
  document.head.appendChild(style);

  console.log('[AccessibilityEnvSimulator] Enabled high contrast mode');
}

export function enableKeyboardNavigationMode(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('a11y-keyboard-nav');
  activeA11yModes.push('keyboard-nav');

  // Show focus outlines more prominently
  const style = document.createElement('style');
  style.id = 'a11y-keyboard-nav-styles';
  style.textContent = `
    .a11y-keyboard-nav *:focus {
      outline: 3px solid hsl(var(--primary)) !important;
      outline-offset: 2px !important;
    }
  `;
  document.head.appendChild(style);

  console.log('[AccessibilityEnvSimulator] Enabled keyboard navigation mode');
}

export function enableReducedMotionMode(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('a11y-reduced-motion');
  activeA11yModes.push('reduced-motion');

  // Disable animations
  const style = document.createElement('style');
  style.id = 'a11y-reduced-motion-styles';
  style.textContent = `
    .a11y-reduced-motion *,
    .a11y-reduced-motion *::before,
    .a11y-reduced-motion *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);

  console.log('[AccessibilityEnvSimulator] Enabled reduced motion mode');
}

export function resetAccessibilityModes(): void {
  if (typeof window === 'undefined') return;

  // Remove classes
  document.documentElement.classList.remove(
    'a11y-screen-reader',
    'a11y-large-text',
    'a11y-high-contrast',
    'a11y-keyboard-nav',
    'a11y-reduced-motion'
  );

  // Remove attributes
  document.documentElement.removeAttribute('data-screen-reader');

  // Reset font size
  document.documentElement.style.fontSize = '';

  // Remove announcer
  const announcer = document.getElementById('a11y-announcer');
  if (announcer) announcer.remove();

  // Remove styles
  const highContrastStyle = document.getElementById('a11y-high-contrast-styles');
  if (highContrastStyle) highContrastStyle.remove();

  const keyboardNavStyle = document.getElementById('a11y-keyboard-nav-styles');
  if (keyboardNavStyle) keyboardNavStyle.remove();

  const reducedMotionStyle = document.getElementById('a11y-reduced-motion-styles');
  if (reducedMotionStyle) reducedMotionStyle.remove();

  activeA11yModes = [];

  console.log('[AccessibilityEnvSimulator] Reset accessibility modes');
}

export function getActiveAccessibilityModes(): string[] {
  return [...activeA11yModes];
}

export function announceToScreenReader(message: string): void {
  if (typeof window === 'undefined') return;

  const announcer = document.getElementById('a11y-announcer');
  if (!announcer) return;

  announcer.textContent = message;

  // Clear after 1 second
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}
