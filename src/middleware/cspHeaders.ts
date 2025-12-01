/**
 * Content Security Policy Configuration
 * Prevents XSS and injection attacks
 */

export const CSP_POLICY = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite dev
    "'unsafe-eval'", // Required for Vite dev
    'https://www.paypal.com',
    'https://www.paypalobjects.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Tailwind
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://*.supabase.co',
  ],
  'font-src': [
    "'self'",
    'data:',
  ],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://www.paypal.com',
    'https://api.paypal.com',
  ],
  'media-src': [
    "'self'",
    'https://*.supabase.co',
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
};

/**
 * Generate CSP header string
 */
export const generateCSPHeader = (): string => {
  return Object.entries(CSP_POLICY)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};

/**
 * Apply CSP to document (for client-side)
 */
export const applyCSP = () => {
  if (typeof document === 'undefined') return;
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = generateCSPHeader();
  document.head.appendChild(meta);
};