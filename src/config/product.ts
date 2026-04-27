/**
 * Global Product Configuration
 *
 * Single source of truth for the brand identity that ships in user-facing
 * copy: the app name, the tagline, who Chau is, who Mercy is, which L1/L2
 * languages we serve, the diaspora hubs we name in marketing, the support
 * email, the canonical domain, the currency.
 *
 * Why centralize: prior to this, "MercyBlade" was hardcoded in 100+ places
 * across components, meta tags, footers, and emails. Updating the tagline
 * meant a 50-file diff. With PRODUCT_CONFIG, copy edits are one diff.
 *
 * Why "as const": locks in literal-string types so TypeScript catches a
 * misuse like `PRODUCT_CONFIG.name = "X"` at compile time, and lets us
 * narrow on `PRODUCT_CONFIG.L1.code` to the exact "vi" string at call sites.
 *
 * NOT in scope (intentional):
 *   - Stripe price IDs / Apple IAP product IDs — those live in Pricing.tsx
 *     and pricing/displayPrices.ts because they're tightly coupled to
 *     payment infrastructure, not brand surface.
 *   - File-banner comments / component identifiers like
 *     `ColorfulMercyBladeHeader` — those are code, not copy. Renaming
 *     them is a different refactor (would break imports).
 *
 * Future cloneability: when MercyBlade is forked into a Korean or
 * Russian variant, swap this file (name, tagline, L1, hubs, etc.) and
 * the user-visible brand updates without touching component code.
 */

export const PRODUCT_CONFIG = {
  /** Canonical product name. */
  name: "MercyBlade",

  /** One-line positioning shown in meta tags + hero copy. */
  tagline: "English for Vietnamese diaspora",

  /** The on-screen teacher character. */
  teacher: {
    name: "Mercy",
    pronouns: "she/her",
  },

  /**
   * Founder reference — kept name-only for byline use (blog post authorship).
   * Detailed biographical fields removed for personal-safety reasons; do
   * NOT re-introduce exile / Article 117 / location detail without
   * Chau's explicit OK.
   */
  founder: {
    name: "MercyBlade",
    story: "",
    backgroundShort: "",
  },

  /** Learner's first language — the Vietnamese-first invariant. */
  L1: {
    code: "vi",
    name: "Tiếng Việt",
    englishName: "Vietnamese",
  },

  /** Target language. */
  L2: {
    code: "en",
    name: "English",
    englishName: "English",
  },

  /**
   * Cities/regions with the largest Vietnamese diaspora communities we
   * speak to in marketing. Order matters — listed by community size /
   * MercyBlade traction, not alphabetically.
   */
  diasporaHubs: [
    "California",
    "Houston",
    "Toronto",
    "Sydney",
    "Berlin",
  ],

  /** Inbound support address — show on contact pages, errors, and footer. */
  supportEmail: "support@mercyblade.com",

  /** Canonical web domain. Used in meta tags, canonical links, og:url. */
  domain: "mercyblade.com",

  /**
   * Currency posture. `primary` is what we display first; `fallback` is
   * what we show on en-locale or when VND would be confusing.
   */
  currency: {
    primary: "VND",
    fallback: "USD",
  },

  /** Footer copyright line. Update the year in the next year's January. */
  copyright: "© 2026 MercyBlade",
} as const;

/**
 * Multi-channel support contact URLs. Vietnamese learners reach us
 * through Zalo / Facebook Messenger far more than email; the floating
 * support button (src/components/support/ChatSupportButton.tsx) and the
 * /support page surface all three.
 *
 * Placeholders: zalo + messenger handles below are launch placeholders
 * Chau will swap for the real OA / Page handles before announce. The
 * surfaces themselves are wired and will work the moment the URLs are
 * updated — no code change needed.
 */
export const SUPPORT_CHANNELS = {
  zalo_url: "https://zalo.me/chaudoan",
  messenger_url: "https://m.me/mercyblade",
  email: "admin@mercyblade.com",
} as const;

export type SupportChannels = typeof SUPPORT_CHANNELS;

export type ProductConfig = typeof PRODUCT_CONFIG;

/** Convenience: the canonical product name string literal. */
export const PRODUCT_NAME = PRODUCT_CONFIG.name;
