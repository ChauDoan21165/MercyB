// Browser Environment Simulator - Simulate browser conditions for testing

import type { DevicePresetId } from './DevicePresets';
import { getDevicePreset } from './DevicePresets';

let originalViewport: { width: number; height: number } | null = null;
let appliedClasses: string[] = [];

export function applyDevicePreset(id: DevicePresetId): void {
  if (typeof window === 'undefined') return;

  const preset = getDevicePreset(id);

  // Store original viewport
  if (!originalViewport) {
    originalViewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  // Set viewport size
  try {
    window.resizeTo(preset.width, preset.height);
  } catch (e) {
    console.warn('[BrowserEnvSimulator] Cannot resize window in this environment');
  }

  // Set device pixel ratio (via CSS zoom simulation)
  document.documentElement.style.setProperty('--device-pixel-ratio', preset.pixelRatio.toString());

  // Add device class
  const deviceClass = `device-${id}`;
  document.documentElement.classList.add(deviceClass);
  appliedClasses.push(deviceClass);

  // Set user agent (read-only, but we can simulate via data attribute)
  document.documentElement.setAttribute('data-simulated-ua', preset.userAgent);

  // Touch support
  if (preset.touch) {
    document.documentElement.classList.add('has-touch');
    appliedClasses.push('has-touch');
  }

  console.log(`[BrowserEnvSimulator] Applied device preset: ${id}`);
}

export function simulateTouchOnly(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('touch-only');
  appliedClasses.push('touch-only');

  // Disable mouse events via CSS
  document.documentElement.style.pointerEvents = 'none';
  document.documentElement.style.touchAction = 'auto';
}

export function simulateNoHover(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('no-hover');
  appliedClasses.push('no-hover');

  // Add CSS to disable :hover styles
  const style = document.createElement('style');
  style.id = 'no-hover-simulation';
  style.textContent = `* { pointer-events: none !important; } button, a, input { pointer-events: auto !important; }`;
  document.head.appendChild(style);
}

export function simulateReducedMotion(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('reduce-motion');
  appliedClasses.push('reduce-motion');

  // Mock matchMedia for prefers-reduced-motion
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = ((query: string) => {
    if (query.includes('prefers-reduced-motion')) {
      return {
        matches: true,
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      } as MediaQueryList;
    }
    return originalMatchMedia(query);
  }) as typeof window.matchMedia;
}

export function simulateHighContrastMode(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('high-contrast');
  appliedClasses.push('high-contrast');

  // Add high contrast CSS
  const style = document.createElement('style');
  style.id = 'high-contrast-simulation';
  style.textContent = `
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 0%;
      --primary: 0 0% 0%;
      --primary-foreground: 0 0% 100%;
    }
  `;
  document.head.appendChild(style);
}

export function simulateLowBatteryMode(): void {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.add('low-battery');
  appliedClasses.push('low-battery');

  // Reduce animations
  document.documentElement.style.setProperty('--animation-duration', '0s');
}

export function resetBrowserEnv(): void {
  if (typeof window === 'undefined') return;

  // Remove all applied classes
  appliedClasses.forEach(cls => {
    document.documentElement.classList.remove(cls);
  });
  appliedClasses = [];

  // Remove simulation styles
  const noHoverStyle = document.getElementById('no-hover-simulation');
  if (noHoverStyle) noHoverStyle.remove();

  const highContrastStyle = document.getElementById('high-contrast-simulation');
  if (highContrastStyle) highContrastStyle.remove();

  // Reset styles
  document.documentElement.style.pointerEvents = '';
  document.documentElement.style.touchAction = '';
  document.documentElement.removeAttribute('data-simulated-ua');
  document.documentElement.style.removeProperty('--device-pixel-ratio');
  document.documentElement.style.removeProperty('--animation-duration');

  // Restore viewport
  if (originalViewport) {
    try {
      window.resizeTo(originalViewport.width, originalViewport.height);
    } catch (e) {
      // Ignore
    }
    originalViewport = null;
  }

  console.log('[BrowserEnvSimulator] Reset browser environment');
}
