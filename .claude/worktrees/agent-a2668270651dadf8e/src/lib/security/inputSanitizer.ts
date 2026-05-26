/**
 * Input Sanitization & XSS Protection
 * Prevents XSS attacks and injection vulnerabilities
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'div'],
    ALLOWED_ATTR: ['class'],
    KEEP_CONTENT: true,
  });
};

/**
 * Escape special characters in plain text
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Sanitize room content before rendering
 * Removes script tags, event handlers, and javascript: URIs
 */
export const sanitizeRoomContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'style'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
};

/**
 * Validate and sanitize file paths to prevent directory traversal
 */
export const sanitizeFilePath = (path: string): string | null => {
  // Block parent directory traversal
  if (path.includes('..') || path.includes('%2e%2e')) {
    console.error('Path traversal attempt detected:', path);
    return null;
  }

  // Block absolute paths
  if (path.startsWith('/') || path.startsWith('\\')) {
    console.error('Absolute path attempt detected:', path);
    return null;
  }

  // Enforce lowercase snake_case pattern for room IDs
  const validPattern = /^[a-z0-9_-]+$/;
  if (!validPattern.test(path)) {
    console.error('Invalid path pattern:', path);
    return null;
  }

  return path;
};

/**
 * Validate audio file path before playback
 */
export const validateAudioPath = (path: string): boolean => {
  // Must start with /public/audio/ or /audio/
  const validPrefix = path.startsWith('/public/audio/') || path.startsWith('/audio/');
  
  // Must end with .mp3
  const validExtension = path.endsWith('.mp3');
  
  // Must not contain directory traversal
  const noTraversal = !path.includes('..') && !path.includes('%2e%2e');
  
  return validPrefix && validExtension && noTraversal;
};

/**
 * Strip potentially dangerous URL schemes
 */
export const sanitizeUrl = (url: string): string => {
  const dangerous = ['javascript:', 'data:', 'vbscript:', 'file:'];
  const lower = url.toLowerCase().trim();
  
  for (const scheme of dangerous) {
    if (lower.startsWith(scheme)) {
      console.error('Dangerous URL scheme detected:', scheme);
      return '#';
    }
  }
  
  return url;
};