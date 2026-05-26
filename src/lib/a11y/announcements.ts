/**
 * Screen Reader Announcements
 * Utilities for announcing content to screen readers via ARIA live regions
 */

type AnnouncementPriority = 'polite' | 'assertive';

/**
 * Create or get existing live region for announcements
 */
function getLiveRegion(priority: AnnouncementPriority): HTMLElement {
  const id = `live-region-${priority}`;
  let region = document.getElementById(id);

  if (!region) {
    region = document.createElement('div');
    region.id = id;
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', priority);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }

  return region;
}

/**
 * Announce message to screen readers
 * @param message - Message to announce
 * @param priority - 'polite' (default) or 'assertive' for urgent messages
 */
export function announce(message: string, priority: AnnouncementPriority = 'polite') {
  const region = getLiveRegion(priority);
  
  // Clear existing content
  region.textContent = '';
  
  // Set new message after brief delay to ensure announcement
  setTimeout(() => {
    region.textContent = message;
  }, 100);
  
  // Clear after announcement (so repeated messages work)
  setTimeout(() => {
    region.textContent = '';
  }, 1000);
}

/**
 * Announce loading state
 */
export function announceLoading(what: string = 'content') {
  announce(`Loading ${what}`, 'polite');
}

/**
 * Announce success
 */
export function announceSuccess(message: string) {
  announce(message, 'polite');
}

/**
 * Announce error (assertive)
 */
export function announceError(message: string) {
  announce(message, 'assertive');
}

/**
 * Announce route change
 */
export function announcePageChange(pageName: string) {
  announce(`Navigated to ${pageName}`, 'polite');
}
