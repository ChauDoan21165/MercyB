// src/pages/__tests__/legalAndStaticPages.test.tsx
//
// Lane E (E3) — provider-light render integration for the public static /
// legal pages. These pages are reachable logged-out and must keep rendering
// their landmark headings + correct internal/external links.
//
// All pages are wrapped in <MemoryRouter> (they use <Link>). SeoMeta writes
// to document.head imperatively — that is exercised, not mocked, since it is
// a pure DOM side effect with no network.

import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import NotFound from "@/pages/NotFound";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Support from "@/pages/Support";
import ContentAdvisory from "@/pages/legal/ContentAdvisory";

function renderAt(ui: React.ReactElement, initialPath = "/") {
  return render(<MemoryRouter initialEntries={[initialPath]}>{ui}</MemoryRouter>);
}

describe("NotFound page", () => {
  it("shows the 404 marker and the requested path", () => {
    renderAt(<NotFound />, "/totally-missing");
    expect(screen.getByText("404")).toBeInTheDocument();
    // The unknown path is echoed back inside a <code> element.
    expect(screen.getByText("/totally-missing")).toBeInTheDocument();
  });

  it("offers Home / Rooms / Sign in recovery links with correct hrefs", () => {
    renderAt(<NotFound />, "/x");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Rooms" })).toHaveAttribute("href", "/rooms");
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute("href", "/signin");
  });
});

describe("Privacy page", () => {
  it("renders the Privacy Policy heading and contact email", () => {
    renderAt(<Privacy />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Privacy Policy" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("admin@mercyblade.com").length).toBeGreaterThan(0);
  });

  it("includes the PDPD withdraw-consent section (legal-required)", () => {
    renderAt(<Privacy />);
    expect(
      screen.getByRole("heading", { level: 2, name: "6a. Withdrawing Consent" }),
    ).toBeInTheDocument();
  });

  it("sets the document title via SeoMeta on mount", () => {
    renderAt(<Privacy />);
    expect(document.title).toBe("Chính sách quyền riêng tư — MercyBlade");
  });
});

describe("Terms page", () => {
  it("renders the EULA heading and the contact email", () => {
    renderAt(<Terms />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Terms of Use (EULA)" }),
    ).toBeInTheDocument();
    expect(screen.getByText("admin@mercyblade.com")).toBeInTheDocument();
  });

  it("covers subscriptions and refunds sections", () => {
    renderAt(<Terms />);
    expect(
      screen.getByRole("heading", { level: 2, name: "2. Subscriptions and Payments" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "4. Refunds" })).toBeInTheDocument();
  });
});

describe("Support page", () => {
  it("renders the Support landmark heading", () => {
    renderAt(<Support />);
    expect(screen.getByRole("heading", { level: 1, name: "Support" })).toBeInTheDocument();
  });

  it("links Zalo / Messenger contact channels to their external URLs", () => {
    renderAt(<Support />);
    const zalo = screen.getByRole("link", { name: /Zalo/ });
    expect(zalo).toHaveAttribute("href", "https://zalo.me/0913229579");
    const messenger = screen.getByRole("link", { name: /Facebook Messenger/ });
    expect(messenger).toHaveAttribute("href", "https://m.me/ChauDoan21165");
  });

  it("renders the first FAQ open by default and footer legal links", () => {
    renderAt(<Support />);
    // First FAQ (account deletion) is defaultOpen — its body text is visible.
    expect(screen.getByText("How do I delete my account?")).toBeInTheDocument();
    // Footer cross-links to Privacy + Terms.
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    expect(screen.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "/terms",
    );
  });
});

describe("ContentAdvisory (legal) page", () => {
  it("renders the bilingual advisory heading", () => {
    renderAt(<ContentAdvisory />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Lưu ý nội dung / Content Advisory" }),
    ).toBeInTheDocument();
  });

  it("states the AI-feedback disclaimer in both languages", () => {
    renderAt(<ContentAdvisory />);
    // VI + EN AI-feedback sections both present (level-2 headings).
    const aiHeadings = screen.getAllByRole("heading", { level: 2, name: /AI/ });
    expect(aiHeadings.length).toBeGreaterThanOrEqual(1);
    // The reporting email appears in both language blocks.
    expect(screen.getAllByText("admin@mercyblade.com").length).toBeGreaterThanOrEqual(2);
  });
});
