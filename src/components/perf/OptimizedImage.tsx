/**
 * OptimizedImage — drop-in <img> replacement for CLS / LCP wins.
 *
 *   - Always provide width + height (prevents layout shift → CLS=0).
 *   - Defaults to loading="lazy" for below-the-fold images. Pass
 *     `priority` for the hero / above-the-fold case (LCP-critical).
 *   - Optional WebP / AVIF sources via the `formats` prop. We render a
 *     <picture> when alternates are provided so browsers pick the
 *     smallest format they support.
 *
 * Use for any image that's not already wrapped in something with its
 * own intrinsic-size handling (e.g. avatars + hero illustrations).
 */

import React from "react";

export type ImageFormat = "webp" | "avif";

export interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Above-the-fold image — eagerly load + use fetchpriority="high". */
  priority?: boolean;
  /** Alternate sources keyed by format. Each value is the asset URL. */
  formats?: Partial<Record<ImageFormat, string>>;
  /** Pass-through className for the rendered <img>. */
  className?: string;
  /** Optional sizes hint (responsive layouts). */
  sizes?: string;
  /** Optional srcSet for the base format. */
  srcSet?: string;
}

const FORMAT_MIME: Record<ImageFormat, string> = {
  webp: "image/webp",
  avif: "image/avif",
};

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  formats,
  className,
  sizes,
  srcSet,
}: OptimizedImageProps): React.ReactElement {
  const loading = priority ? "eager" : "lazy";
  const fetchPriority = priority ? "high" : "auto";

  const img = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      decoding="async"
      // React doesn't (yet) lower-case fetchPriority for SSR safely
      // — set via attribute to dodge prop-typing churn between React
      // versions.
      {...({ fetchpriority: fetchPriority } as Record<string, string>)}
      className={className}
      sizes={sizes}
      srcSet={srcSet}
    />
  );

  if (!formats || Object.keys(formats).length === 0) {
    return img;
  }

  // Render <picture>. Order matters: AVIF first (smaller, fewer
  // browsers support it), then WebP (broader support), then the
  // original as the <img> fallback.
  const orderedFormats: ImageFormat[] = ["avif", "webp"];
  return (
    <picture>
      {orderedFormats.map((fmt) => {
        const url = formats[fmt];
        if (!url) return null;
        return (
          <source key={fmt} srcSet={url} type={FORMAT_MIME[fmt]} sizes={sizes} />
        );
      })}
      {img}
    </picture>
  );
}
