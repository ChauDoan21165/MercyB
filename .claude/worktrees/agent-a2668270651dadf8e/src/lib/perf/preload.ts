// Preload helper.
//
// Inject <link rel="preload"> for resources that are critical to the
// largest contentful paint (typically the hero image, primary font, or
// the first-fold JS chunk). Empirically saves 200-500ms LCP on slow
// connections.
//
// This is a *targeted* helper, not a wholesale preload-everything tool.
// Preloading too much hurts LCP (you fight for bandwidth) and bloats
// the head. Use sparingly — one or two assets per route at most.

export type PreloadAs = "image" | "font" | "script" | "style";

export interface PreloadOptions {
  as: PreloadAs;
  /** Required for font preloads (browser refuses without it). */
  type?: string;
  /** crossorigin attribute, required for fonts and any cross-origin asset. */
  crossOrigin?: "anonymous" | "use-credentials";
  /** Use srcset hints for responsive images. */
  imagesrcset?: string;
  imagesizes?: string;
  /** Optional fetchpriority. Browsers default high for image preloads. */
  fetchpriority?: "high" | "low" | "auto";
}

/**
 * Insert one preload <link> into <head>. Idempotent: a second call with
 * the same href is a no-op.
 */
export function preload(href: string, opts: PreloadOptions): HTMLLinkElement | null {
  if (typeof document === "undefined") return null;
  if (!href) return null;

  const existing = document.querySelector<HTMLLinkElement>(
    `link[rel="preload"][href="${cssEscape(href)}"]`,
  );
  if (existing) return existing;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.setAttribute("as", opts.as);
  if (opts.type) link.type = opts.type;
  if (opts.crossOrigin) link.crossOrigin = opts.crossOrigin;
  if (opts.imagesrcset) link.setAttribute("imagesrcset", opts.imagesrcset);
  if (opts.imagesizes) link.setAttribute("imagesizes", opts.imagesizes);
  if (opts.fetchpriority) link.setAttribute("fetchpriority", opts.fetchpriority);
  document.head.appendChild(link);
  return link;
}

/**
 * Convenience: preload a hero image with sensible defaults for an
 * above-the-fold image (high fetch priority).
 */
export function preloadHeroImage(href: string, srcset?: string, sizes?: string): HTMLLinkElement | null {
  return preload(href, {
    as: "image",
    fetchpriority: "high",
    imagesrcset: srcset,
    imagesizes: sizes,
  });
}

/**
 * Convenience: preload a font (woff2 only — woff/ttf are too old to be
 * worth preloading these days, and mixed-format preload silences the
 * browser's optimisation hints).
 */
export function preloadFont(href: string, options: { crossOrigin?: "anonymous" | "use-credentials" } = {}): HTMLLinkElement | null {
  return preload(href, {
    as: "font",
    type: "font/woff2",
    crossOrigin: options.crossOrigin ?? "anonymous",
  });
}

/**
 * Minimal CSS-attribute-selector escaper for the href dedup query.
 * Document.querySelector throws on raw special chars in attribute
 * selectors; we rarely need anything beyond escaping quotes.
 */
function cssEscape(s: string): string {
  return s.replace(/(["\\])/g, "\\$1");
}
