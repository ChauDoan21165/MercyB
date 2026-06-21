// PATH: src/components/__tests__/Breadcrumb.hardening.test.tsx
//
// Hardening tests for the Breadcrumb component (src/components/Breadcrumb.tsx).
//
// Breadcrumb renders a navigation trail: a fixed "Home" link to "/" followed by
// one entry per item in the `items` prop. Items with an `href` render as
// react-router <Link>s; items without one render as a plain emphasized <span>.
// Each item is separated by a ChevronRight icon.
//
// Only `Breadcrumb` is exported from the module, so that is all we import.
// The component depends on react-router-dom's <Link>, which requires a Router
// context — every render is wrapped in <MemoryRouter>.

import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Breadcrumb } from "@/components/Breadcrumb";

function renderBreadcrumb(items: Parameters<typeof Breadcrumb>[0]["items"]) {
  return render(
    <MemoryRouter>
      <Breadcrumb items={items} />
    </MemoryRouter>,
  );
}

describe("Breadcrumb — module surface", () => {
  it("exports Breadcrumb as a function component", () => {
    expect(typeof Breadcrumb).toBe("function");
  });
});

describe("Breadcrumb — Home link (always present)", () => {
  it("renders a Home link pointing at '/'", () => {
    renderBreadcrumb([]);

    const home = screen.getByRole("link", { name: /home/i });
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("href", "/");
  });

  it("renders the visible 'Home' text", () => {
    renderBreadcrumb([]);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("wraps everything in a <nav> landmark", () => {
    renderBreadcrumb([{ label: "Rooms", href: "/rooms" }]);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders only the Home link when items is empty", () => {
    renderBreadcrumb([]);
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });
});

describe("Breadcrumb — items with href render as links", () => {
  it("renders a linked item with the correct label and href", () => {
    renderBreadcrumb([{ label: "Rooms", href: "/rooms" }]);

    const link = screen.getByRole("link", { name: "Rooms" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/rooms");
  });

  it("renders multiple linked items, each with its own href", () => {
    renderBreadcrumb([
      { label: "Rooms", href: "/rooms" },
      { label: "Lessons", href: "/lessons" },
    ]);

    expect(screen.getByRole("link", { name: "Rooms" })).toHaveAttribute(
      "href",
      "/rooms",
    );
    expect(screen.getByRole("link", { name: "Lessons" })).toHaveAttribute(
      "href",
      "/lessons",
    );
    // Home + 2 items
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("preserves query strings and hashes in the href", () => {
    renderBreadcrumb([{ label: "Search", href: "/search?q=ielts#top" }]);
    expect(screen.getByRole("link", { name: "Search" })).toHaveAttribute(
      "href",
      "/search?q=ielts#top",
    );
  });
});

describe("Breadcrumb — items without href render as plain text", () => {
  it("renders an item without href as a span, not a link", () => {
    renderBreadcrumb([{ label: "Current Page" }]);

    expect(screen.queryByRole("link", { name: "Current Page" })).toBeNull();
    expect(screen.getByText("Current Page")).toBeInTheDocument();
  });

  it("applies the emphasized text class to the non-link item", () => {
    renderBreadcrumb([{ label: "Current Page" }]);

    const span = screen.getByText("Current Page");
    expect(span.tagName).toBe("SPAN");
    expect(span).toHaveClass("text-foreground", "font-medium");
  });

  it("treats an explicitly undefined href the same as a missing one", () => {
    renderBreadcrumb([{ label: "NoHref", href: undefined }]);
    expect(screen.queryByRole("link", { name: "NoHref" })).toBeNull();
    expect(screen.getByText("NoHref")).toBeInTheDocument();
  });

  it("renders an empty-string href as a plain span (falsy href branch)", () => {
    renderBreadcrumb([{ label: "EmptyHref", href: "" }]);
    // "" is falsy, so the ternary takes the span branch — no link rendered.
    expect(screen.queryByRole("link", { name: "EmptyHref" })).toBeNull();
    expect(screen.getByText("EmptyHref")).toBeInTheDocument();
  });
});

describe("Breadcrumb — mixed item collections", () => {
  it("renders a typical trail with linked ancestors and a plain leaf", () => {
    renderBreadcrumb([
      { label: "Rooms", href: "/rooms" },
      { label: "IELTS", href: "/rooms/ielts" },
      { label: "Speaking Part 2" },
    ]);

    // Two linked ancestors + Home link == 3 links total.
    expect(screen.getAllByRole("link")).toHaveLength(3);
    expect(screen.getByRole("link", { name: "Rooms" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "IELTS" })).toBeInTheDocument();

    // The leaf is plain text.
    expect(screen.queryByRole("link", { name: "Speaking Part 2" })).toBeNull();
    expect(screen.getByText("Speaking Part 2")).toBeInTheDocument();
  });

  it("renders one ChevronRight separator per item", () => {
    const { container } = renderBreadcrumb([
      { label: "Rooms", href: "/rooms" },
      { label: "Lessons", href: "/lessons" },
      { label: "Leaf" },
    ]);

    // lucide-react renders icons as <svg>. There is one Home icon plus one
    // ChevronRight per item == 1 + 3 = 4 svgs.
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(4);
  });
});

describe("Breadcrumb — edge cases & resilience", () => {
  it("renders with an empty items array without throwing", () => {
    expect(() => renderBreadcrumb([])).not.toThrow();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders an item with an empty-string label", () => {
    const { container } = renderBreadcrumb([{ label: "", href: "/x" }]);
    // A link to /x still exists even with an empty accessible name.
    const link = container.querySelector('a[href="/x"]');
    expect(link).not.toBeNull();
  });

  it("handles a large number of items deterministically", () => {
    const items = Array.from({ length: 25 }, (_, i) => ({
      label: `Level ${i}`,
      href: `/level/${i}`,
    }));

    renderBreadcrumb(items);

    // Home + 25 linked items.
    expect(screen.getAllByRole("link")).toHaveLength(26);
    expect(screen.getByRole("link", { name: "Level 0" })).toHaveAttribute(
      "href",
      "/level/0",
    );
    expect(screen.getByRole("link", { name: "Level 24" })).toHaveAttribute(
      "href",
      "/level/24",
    );
  });

  it("renders duplicate labels independently", () => {
    renderBreadcrumb([
      { label: "Same", href: "/a" },
      { label: "Same", href: "/b" },
    ]);

    const links = screen.getAllByRole("link", { name: "Same" });
    expect(links).toHaveLength(2);
    expect(links.map((l) => l.getAttribute("href")).sort()).toEqual([
      "/a",
      "/b",
    ]);
  });

  it("does not escape or alter labels containing special characters", () => {
    renderBreadcrumb([{ label: "A & B <C>" }]);
    expect(screen.getByText("A & B <C>")).toBeInTheDocument();
  });

  it("preserves the order of items as given", () => {
    renderBreadcrumb([
      { label: "First", href: "/1" },
      { label: "Second", href: "/2" },
      { label: "Third" },
    ]);

    const nav = screen.getByRole("navigation");
    const text = within(nav).getByText("First").textContent;
    expect(text).toBe("First");

    // Verify DOM ordering: Home precedes First precedes Second precedes Third.
    const order = ["Home", "First", "Second", "Third"];
    const html = nav.textContent ?? "";
    let lastIndex = -1;
    for (const token of order) {
      const idx = html.indexOf(token);
      expect(idx).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });
});

describe("Breadcrumb — re-render stability", () => {
  it("reflects updated items on re-render", () => {
    const { rerender } = render(
      <MemoryRouter>
        <Breadcrumb items={[{ label: "Old", href: "/old" }]} />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Old" })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <Breadcrumb items={[{ label: "New", href: "/new" }]} />
      </MemoryRouter>,
    );

    expect(screen.queryByRole("link", { name: "Old" })).toBeNull();
    expect(screen.getByRole("link", { name: "New" })).toHaveAttribute(
      "href",
      "/new",
    );
  });
});
