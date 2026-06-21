import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, within } from "@testing-library/react";
import { DesignAuditReport } from "@/components/DesignAuditReport";

/**
 * Hardening tests for DesignAuditReport.
 *
 * DesignAuditReport is a purely presentational, static component: it takes no
 * props, holds no state, performs no data fetching, and has no external
 * dependencies beyond the shadcn `Card` primitives and lucide-react icons
 * (both rendered inline). There is therefore no supabase/fetch surface to mock.
 *
 * These tests pin the component's contract — that it is a stable, deterministic
 * export that renders the full audit report structure — so that accidental
 * regressions (a removed section, a dropped recommendation, a broken export)
 * are caught.
 */

afterEach(() => {
  cleanup();
});

describe("DesignAuditReport — export contract", () => {
  it("is exported as a function component", () => {
    expect(DesignAuditReport).toBeDefined();
    expect(typeof DesignAuditReport).toBe("function");
  });

  it("renders without throwing", () => {
    expect(() => render(<DesignAuditReport />)).not.toThrow();
  });

  it("renders an identical DOM tree on repeated renders (deterministic)", () => {
    const first = render(<DesignAuditReport />);
    const firstHtml = first.container.innerHTML;
    cleanup();

    const second = render(<DesignAuditReport />);
    const secondHtml = second.container.innerHTML;

    expect(secondHtml).toBe(firstHtml);
  });

  it("renders non-empty markup", () => {
    const { container } = render(<DesignAuditReport />);
    expect(container.firstChild).not.toBeNull();
    expect(container.textContent && container.textContent.length).toBeGreaterThan(0);
  });
});

describe("DesignAuditReport — header", () => {
  it("renders the page title as a level-1 heading", () => {
    render(<DesignAuditReport />);
    const heading = screen.getByRole("heading", { level: 1, name: "Design Audit Report" });
    expect(heading).toBeInTheDocument();
  });

  it("renders the descriptive subtitle", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText("Review design issues across the platform")
    ).toBeInTheDocument();
  });
});

describe("DesignAuditReport — section cards", () => {
  it("renders all four top-level section titles", () => {
    render(<DesignAuditReport />);
    expect(screen.getByText("Color & Contrast Issues")).toBeInTheDocument();
    expect(screen.getByText("Spacing & Layout Issues")).toBeInTheDocument();
    expect(screen.getByText("Components Requiring Review")).toBeInTheDocument();
    expect(screen.getByText("Recommended Actions")).toBeInTheDocument();
  });

  it("renders the card descriptions", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText("Potential color problems that need review")
    ).toBeInTheDocument();
    expect(screen.getByText("Spacing and positioning problems")).toBeInTheDocument();
    expect(screen.getByText("Files that need manual inspection")).toBeInTheDocument();
  });
});

describe("DesignAuditReport — color issues section", () => {
  it("lists each color sub-issue heading", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Essay Text Highlighting" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Kids Rainbow Theme" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Level 6 Theme (Past Issue)" })
    ).toBeInTheDocument();
  });

  it("mentions the wordColorHighlighter current state", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText(/Uses COLORS array in wordColorHighlighter\.tsx/)
    ).toBeInTheDocument();
  });

  it("includes the Vietnamese vs English highlighting note", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText("Vietnamese vs English highlighting uses same colors")
    ).toBeInTheDocument();
  });
});

describe("DesignAuditReport — spacing issues section", () => {
  it("renders the spacing sub-issue headings", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Button Positioning" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Card/Box Layout" })
    ).toBeInTheDocument();
  });

  it("notes the PairedHighlightedContent spacing detail", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText("PairedHighlightedContent component spacing (mb-3, my-3)")
    ).toBeInTheDocument();
  });
});

describe("DesignAuditReport — components-to-review section", () => {
  const expectedFiles = [
    "src/lib/wordColorHighlighter.tsx",
    "src/components/PairedHighlightedContent.tsx",
    "src/pages/KidsLevel*.tsx",
    "src/components/ZoomControl.tsx",
    "src/index.css (Premium theme variables)",
    "tailwind.config.ts (kids.rainbow colors)",
  ];

  it.each(expectedFiles)("lists %s as a file to inspect", (file) => {
    render(<DesignAuditReport />);
    expect(screen.getByText(file)).toBeInTheDocument();
  });
});

describe("DesignAuditReport — recommendations", () => {
  it("renders an ordered list of six recommended actions", () => {
    render(<DesignAuditReport />);

    // Locate the recommendations card via its title, then scope to its list.
    const title = screen.getByText("Recommended Actions");
    const card = title.closest("div")?.parentElement ?? document.body;
    const lists = within(card as HTMLElement).getAllByRole("list");
    const orderedList = lists.find((el) => el.tagName.toLowerCase() === "ol");

    expect(orderedList).toBeDefined();
    const items = within(orderedList as HTMLElement).getAllByRole("listitem");
    expect(items).toHaveLength(6);
  });

  it("includes the WCAG AA contrast recommendation", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText("Verify color contrast ratios meet WCAG AA standards")
    ).toBeInTheDocument();
  });

  it("includes the zoom-testing recommendation for weak-sighted users", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText("Test all pages with zoom at 150-200% for weak-sighted users")
    ).toBeInTheDocument();
  });

  it("includes the mobile floating-button overlap recommendation", () => {
    render(<DesignAuditReport />);
    expect(
      screen.getByText("Ensure floating buttons don't overlap on mobile")
    ).toBeInTheDocument();
  });
});

describe("DesignAuditReport — structural integrity", () => {
  it("renders all five named sub-issue headings", () => {
    render(<DesignAuditReport />);
    // The shadcn CardTitle primitive also renders as an <h3>, so the raw
    // level-3 count includes the four card titles. Pin the contract on the
    // five explicit sub-issue headings authored in the component instead.
    const subIssueNames = [
      "Essay Text Highlighting",
      "Kids Rainbow Theme",
      "Level 6 Theme (Past Issue)",
      "Button Positioning",
      "Card/Box Layout",
    ];
    for (const name of subIssueNames) {
      expect(
        screen.getByRole("heading", { level: 3, name })
      ).toBeInTheDocument();
    }
  });

  it("renders a single top-level page heading", () => {
    render(<DesignAuditReport />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
