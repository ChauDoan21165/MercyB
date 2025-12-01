// Input Sanitization - Escape all user inputs to prevent XSS

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content using DOMPurify
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: strip all HTML
    return dirty.replace(/<[^>]*>/g, '');
  }
  
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text (strip all HTML)
 */
export function sanitizePlain(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}

/**
 * Sanitize user profile name
 */
export function sanitizeProfileName(name: string): string {
  return sanitizePlain(name)
    .slice(0, 100) // Max 100 characters
    .replace(/[^\w\s-]/g, ''); // Only alphanumeric, spaces, hyphens
}

/**
 * Sanitize chat message
 */
export function sanitizeChatMessage(message: string): string {
  // Remove HTML but allow basic formatting markers
  const plain = sanitizePlain(message);
  
  // Limit length
  return plain.slice(0, 500);
}

/**
 * Sanitize URL to prevent javascript: and data: URIs
 */
export function sanitizeURL(url: string): string {
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  if (
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('vbscript:')
  ) {
    return '';
  }
  
  // Only allow http, https, mailto
  if (
    !trimmed.startsWith('http://') &&
    !trimmed.startsWith('https://') &&
    !trimmed.startsWith('mailto:') &&
    !trimmed.startsWith('/')
  ) {
    return '';
  }
  
  return url;
}
