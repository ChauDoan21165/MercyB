// src/components/founder/FounderQuoteCard.tsx
//
// Small contextual card. Renders a single founder quote bilingually
// in a sidebar / footer slot. Picks a quote based on:
//   - the requested context ('pricing', 'blog-footer', etc.)
//   - an optional `seed` so the same page renders the same quote across
//     re-renders (avoids the quote flipping during tab interactions).
//
// Free-tier content. No gating.

import { useMemo } from "react";
import { Link } from "react-router-dom";

import {
  PRODUCT_CONFIG,
} from "@/config/product";
import {
  quotesForContext,
  type FounderQuote,
} from "@/lib/founder/founderContent";

export type FounderQuoteCardProps = {
  context: FounderQuote["context"];
  /** Stable seed so the quote doesn't shuffle on re-render. */
  seed?: string;
  /** Show a small "About Chau →" link beneath the quote. */
  showAboutLink?: boolean;
};

function pickQuote(quotes: FounderQuote[], seed: string): FounderQuote {
  if (quotes.length === 0) {
    // Defensive: this never fires in practice because quotesForContext
    // always falls back to 'general' quotes, but keeps types honest.
    return {
      id: "fallback",
      vi: "",
      en: "",
      context: "general",
    };
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return quotes[hash % quotes.length];
}

export default function FounderQuoteCard({
  context,
  seed,
  showAboutLink = true,
}: FounderQuoteCardProps) {
  const quote = useMemo(() => {
    const pool = quotesForContext(context);
    return pickQuote(pool, seed ?? context);
  }, [context, seed]);

  if (!quote.vi) return null;

  return (
    <aside className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
      <blockquote className="m-0">
        <p className="text-[15px] leading-relaxed text-black/85">
          "{quote.vi}"
        </p>
        <p className="text-xs italic text-black/55 mt-1">
          "{quote.en}"
        </p>
      </blockquote>
      <footer className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-xs font-semibold text-black/70">
          — {PRODUCT_CONFIG.founder.name},{" "}
          <span className="font-normal italic text-black/50">
            {PRODUCT_CONFIG.founder.story}
          </span>
        </span>
        {showAboutLink ? (
          <Link
            to="/about/chau"
            className="text-xs text-emerald-700 hover:text-emerald-900 underline"
          >
            About Chau →
          </Link>
        ) : null}
      </footer>
    </aside>
  );
}
