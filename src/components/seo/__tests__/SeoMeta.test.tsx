import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import SeoMeta from "@/components/seo/SeoMeta";

// Runtime verification for the A63 canonical + hreflang fix. The app is a
// client-rendered SPA (no per-route static HTML), so the only place these
// tags exist is the DOM head SeoMeta writes via useEffect — a dist/ grep
// can't prove it, this can. Also guards the unmount cleanup so /seo meta
// never leaks into the rest of the SPA.

const CANON = "https://mercyblade.com/pricing";

function headHref(selector: string): string | null {
  return document.head.querySelector(selector)?.getAttribute("href") ?? null;
}

describe("SeoMeta — self-referencing canonical + hreflang", () => {
  it("emits a self-referencing canonical and vi + x-default alternates", () => {
    const { unmount } = render(
      <SeoMeta title="Bảng giá" description="desc" canonical={CANON} />,
    );

    expect(headHref('link[rel="canonical"]')).toBe(CANON);
    expect(headHref('link[rel="alternate"][hreflang="vi"]')).toBe(CANON);
    expect(headHref('link[rel="alternate"][hreflang="x-default"]')).toBe(CANON);

    unmount();

    // Created tags must be cleaned up so they don't bleed onto the next route.
    expect(document.head.querySelector('link[rel="alternate"][hreflang="vi"]')).toBeNull();
    expect(
      document.head.querySelector('link[rel="alternate"][hreflang="x-default"]'),
    ).toBeNull();
  });

  it("omits hreflang alternates when no canonical is provided", () => {
    const { unmount } = render(<SeoMeta title="No canon" description="d" />);
    expect(document.head.querySelector('link[rel="alternate"][hreflang="vi"]')).toBeNull();
    unmount();
  });
});
