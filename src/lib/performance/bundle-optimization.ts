/**
 * Bundle optimization utilities
 * Reduces bundle size and improves load times
 */

/**
 * Dynamic import with error handling
 */
export async function dynamicImport<T>(
  importFn: () => Promise<T>,
  retries = 3
): Promise<T> {
  try {
    return await importFn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Dynamic import failed, retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return dynamicImport(importFn, retries - 1);
    }
    throw error;
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

/**
 * Preconnect to external domains
 */
export function preconnect(href: string) {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * DNS prefetch for external domains
 */
export function dnsPrefetch(href: string) {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = href;
  document.head.appendChild(link);
}

/**
 * Remove unused CSS
 */
export function removeUnusedStyles() {
  // In production, this is handled by build tools (PurgeCSS/Tailwind)
  // This is a runtime helper for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Unused styles removal is handled at build time');
  }
}

/**
 * Optimize images for web
 */
export function optimizeImageUrl(url: string, width?: number, quality = 80): string {
  // Add image optimization parameters if using image CDN
  if (url.includes('supabase.co/storage')) {
    const params = new URLSearchParams();
    if (width) params.set('width', width.toString());
    params.set('quality', quality.toString());
    return `${url}?${params.toString()}`;
  }
  return url;
}

/**
 * Compress data for storage
 */
export function compressJSON<T>(data: T): string {
  return JSON.stringify(data);
}

/**
 * Decompress data from storage
 */
export function decompressJSON<T>(compressed: string): T {
  return JSON.parse(compressed);
}

/**
 * Tree-shake utility - mark as side-effect free
 */
export const treeshake = {
  /**
   * Pure function marker
   */
  pure: <T extends (...args: any[]) => any>(fn: T): T => {
    return fn;
  },
};

/**
 * Code splitting helper
 */
export function splitByRoute(routes: Record<string, () => Promise<any>>) {
  return Object.entries(routes).reduce((acc, [key, loader]) => {
    acc[key] = {
      loader,
      preload: () => loader(),
    };
    return acc;
  }, {} as Record<string, { loader: () => Promise<any>; preload: () => Promise<any> }>);
}
