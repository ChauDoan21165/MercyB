/**
 * SeoLayout — shared chrome for /seo/* pages.
 *
 * Concerns SEO landing pages have that the rest of the app doesn't:
 *   - Vietnamese-first H1, single visible CTA above the fold
 *   - No app navigation distractions (login, room list) — the only goal
 *     here is "click the CTA and create an account"
 *   - UTM-tagged sign-up link so Chau can attribute traffic per page
 *
 * Sits inside <AppHeroShell /> which already provides the global header
 * band, so this component only owns the page-body container.
 */

import React from "react";
import { Link } from "react-router-dom";

export type SeoLayoutProps = {
  /** Vietnamese H1 — the actual search keyword phrasing. */
  h1: string;
  /** 2-3 sentence Vietnamese subheader explaining the page's angle. */
  subheader: string;
  /** Body sections — pages compose their own placeholder content here. */
  children: React.ReactNode;
  /**
   * UTM campaign slug used to tag the sign-up CTA. Convention: matches the
   * URL slug (e.g. "hoc-tieng-anh-cho-nguoi-viet").
   */
  utmCampaign: string;
};

const ctaCopy = {
  primary: "Bắt đầu sửa lỗi đầu tiên — miễn phí 7 ngày",
};

export function SeoLayout({ h1, subheader, children, utmCampaign }: SeoLayoutProps) {
  const ctaHref = `/signin?next=${encodeURIComponent("/")}&utm_source=seo&utm_campaign=${encodeURIComponent(utmCampaign)}`;

  return (
    <article
      className="mx-auto w-full max-w-[820px] px-4 py-6"
      data-testid="seo-layout"
      data-utm-campaign={utmCampaign}
    >
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-slate-900">
          {h1}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-700 leading-relaxed">
          {subheader}
        </p>
        <div className="mt-6">
          <Link
            to={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm sm:text-base font-bold text-white shadow-md hover:bg-orange-600 active:bg-orange-700 transition"
            data-testid="seo-cta-primary"
          >
            {ctaCopy.primary}
          </Link>
        </div>
      </header>

      <div className="space-y-8 text-slate-800 leading-relaxed">
        {children}
      </div>

      <footer className="mt-12 pt-8 border-t border-slate-200">
        <Link
          to={ctaHref}
          className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-orange-600 active:bg-orange-700 transition"
          data-testid="seo-cta-secondary"
        >
          {ctaCopy.primary}
        </Link>
      </footer>
    </article>
  );
}

export default SeoLayout;
