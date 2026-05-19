/**
 * SeoMeta — vanilla-DOM `<head>` tags for SEO landing pages.
 *
 * The codebase doesn't ship react-helmet (intentional — keeps the bundle
 * small for the kids/mobile path). This component imperatively writes the
 * tags via useEffect and restores them on unmount so navigating away from
 * a /seo/* page doesn't leak page-specific meta into the SPA.
 *
 * Usage:
 *   <SeoMeta
 *     title="Học tiếng Anh cho người Việt — MercyBlade"
 *     description="..."
 *     canonical="https://mercyblade.com/seo/hoc-tieng-anh-cho-nguoi-viet"
 *     ogImage="https://mercyblade.com/og/hoc-tieng-anh.png"
 *     lang="vi"
 *     structuredData={{ "@context": "https://schema.org", ... }}
 *   />
 *
 * Why imperative DOM: react-helmet adds a runtime dependency + double-render
 * for SSR, neither of which we use. The mercyblade.com SPA is client-rendered;
 * crawlers (Google, Bing) execute JS and read the rendered head — so a
 * useEffect-driven head update is sufficient. Bing/Yandex coverage of JS is
 * weaker, so the static og:image / canonical in index.html still acts as
 * fallback for non-rendering crawlers.
 */

import { useEffect } from "react";

export type SeoMetaProps = {
  title: string;
  description: string;
  /** Absolute URL of this page; used for canonical, og:url, twitter:url. */
  canonical?: string;
  /** Absolute URL of the share card image (1200×630 recommended). */
  ogImage?: string;
  /** Page language tag — drives `<html lang="…">`. Defaults to "vi". */
  lang?: "vi" | "en";
  /** JSON-LD payload rendered as `<script type="application/ld+json">`. */
  structuredData?: Record<string, unknown>;
  /** Twitter card type. Defaults to "summary_large_image". */
  twitterCard?: "summary" | "summary_large_image";
};

const MANAGED_ATTR = "data-mb-seo";

type ManagedTag = {
  selector: string;
  attrs: Record<string, string>;
};

/**
 * Build the list of <head> tags this component owns. We tag every element
 * we create with `data-mb-seo` so the cleanup pass can find and remove them
 * without touching anything in index.html.
 */
function buildTags({
  title,
  description,
  canonical,
  ogImage,
  twitterCard,
}: Required<Pick<SeoMetaProps, "title" | "description" | "twitterCard">> & {
  canonical: string | undefined;
  ogImage: string | undefined;
}): ManagedTag[] {
  const tags: ManagedTag[] = [
    { selector: 'meta[name="description"]', attrs: { name: "description", content: description } },
    { selector: 'meta[property="og:title"]', attrs: { property: "og:title", content: title } },
    {
      selector: 'meta[property="og:description"]',
      attrs: { property: "og:description", content: description },
    },
    { selector: 'meta[property="og:type"]', attrs: { property: "og:type", content: "website" } },
    { selector: 'meta[name="twitter:card"]', attrs: { name: "twitter:card", content: twitterCard } },
    { selector: 'meta[name="twitter:title"]', attrs: { name: "twitter:title", content: title } },
    {
      selector: 'meta[name="twitter:description"]',
      attrs: { name: "twitter:description", content: description },
    },
  ];
  if (canonical) {
    tags.push(
      { selector: 'link[rel="canonical"]', attrs: { rel: "canonical", href: canonical } },
      { selector: 'meta[property="og:url"]', attrs: { property: "og:url", content: canonical } },
      // Self-referencing hreflang. MercyBlade is a single-URL Vietnamese-first
      // SPA (no /vi /en routing), so every indexable page IS the vi version and
      // is its own x-default. Emitting vi + x-default → the page's own canonical
      // satisfies Google's hreflang reciprocity rule without per-locale URLs.
      // See reports brief url-i18n-strategy-2026-05-19 (A63).
      {
        selector: 'link[rel="alternate"][hreflang="vi"]',
        attrs: { rel: "alternate", hreflang: "vi", href: canonical },
      },
      {
        selector: 'link[rel="alternate"][hreflang="x-default"]',
        attrs: { rel: "alternate", hreflang: "x-default", href: canonical },
      },
    );
  }
  if (ogImage) {
    tags.push(
      { selector: 'meta[property="og:image"]', attrs: { property: "og:image", content: ogImage } },
      { selector: 'meta[name="twitter:image"]', attrs: { name: "twitter:image", content: ogImage } },
    );
  }
  return tags;
}

function upsertTag(tag: ManagedTag): HTMLElement {
  const isLink = tag.attrs.rel !== undefined;
  const tagName = isLink ? "link" : "meta";
  // Reuse an existing tag if index.html already provides one (e.g. canonical).
  // We mark it managed so we restore it to nothing on unmount, but only if we
  // were the one to create it.
  const existing = document.head.querySelector(tag.selector) as HTMLElement | null;
  const node = existing ?? document.createElement(tagName);
  for (const [k, v] of Object.entries(tag.attrs)) {
    node.setAttribute(k, v);
  }
  if (!existing) {
    node.setAttribute(MANAGED_ATTR, "1");
    document.head.appendChild(node);
  } else {
    // Mark as touched-by-us so cleanup knows to revert. We still allow the
    // existing tag to remain — we simply restore its original content on
    // unmount via a sibling cache.
    node.setAttribute(MANAGED_ATTR, "touched");
  }
  return node;
}

export function SeoMeta(props: SeoMetaProps): null {
  const {
    title,
    description,
    canonical,
    ogImage,
    lang = "vi",
    structuredData,
    twitterCard = "summary_large_image",
  } = props;

  useEffect(() => {
    const html = document.documentElement;
    const prevLang = html.getAttribute("lang");
    const prevTitle = document.title;

    html.setAttribute("lang", lang);
    document.title = title;

    const tags = buildTags({ title, description, canonical, ogImage, twitterCard });
    const created: HTMLElement[] = [];
    for (const t of tags) {
      const node = upsertTag(t);
      // We only fully remove tags we created. Tags we touched (existing
      // index.html ones) get reset by the next page's SeoMeta or stay as-is.
      if (node.getAttribute(MANAGED_ATTR) === "1") created.push(node);
    }

    let ldScript: HTMLScriptElement | null = null;
    if (structuredData) {
      ldScript = document.createElement("script");
      ldScript.type = "application/ld+json";
      ldScript.setAttribute(MANAGED_ATTR, "1");
      ldScript.text = JSON.stringify(structuredData);
      document.head.appendChild(ldScript);
    }

    return () => {
      // Restore previous title + lang.
      document.title = prevTitle;
      if (prevLang) html.setAttribute("lang", prevLang);
      else html.removeAttribute("lang");

      for (const node of created) node.remove();
      if (ldScript) ldScript.remove();
    };
  }, [title, description, canonical, ogImage, lang, twitterCard, structuredData]);

  return null;
}

export default SeoMeta;
