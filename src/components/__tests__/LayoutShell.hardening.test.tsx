// src/components/__tests__/LayoutShell.hardening.test.tsx
//
// Hardening unit tests for src/components/LayoutShell.tsx
//
// LayoutShell is a presentational wrapper that:
//   - optionally renders <AppHeader/> (showHeader, default true)
//   - wraps children in a <main> with a max-width class derived from `maxWidth`
//   - always renders the Mercy <CompanionBubble/> (wired to useHomeCompanion)
//   - always renders the <MercyToggle/>
//
// All four external dependencies are mocked so these tests are deterministic and
// isolated from companion-session state, storage, and network.

import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";

// ---------------------------------------------------------------------------
// Mocks for external dependencies
// ---------------------------------------------------------------------------

// AppHeader → simple identifiable stub.
vi.mock("@/components/layout/AppHeader", () => ({
  __esModule: true,
  default: () => <header data-testid="app-header">AppHeader</header>,
}));

// MercyToggle → identifiable stub.
vi.mock("@/components/companion/MercyToggle", () => ({
  __esModule: true,
  MercyToggle: () => <div data-testid="mercy-toggle">MercyToggle</div>,
}));

// CompanionBubble → echoes the props it receives so assertions can verify wiring.
vi.mock("@/components/companion/CompanionBubble", () => ({
  __esModule: true,
  CompanionBubble: (props: {
    text?: string;
    visible?: boolean;
    onClose?: () => void;
    title?: string;
  }) => (
    <div
      data-testid="companion-bubble"
      data-visible={String(props.visible)}
      data-title={props.title}
      data-text={props.text}
    >
      <button
        type="button"
        data-testid="companion-close"
        onClick={() => props.onClose?.()}
      >
        close
      </button>
    </div>
  ),
}));

// useHomeCompanion → controllable mock. Tests can override the return value.
const hideSpy = vi.fn();
const useHomeCompanionMock = vi.fn(() => ({
  visible: false,
  text: "",
  hide: hideSpy,
}));

vi.mock("@/hooks/useHomeCompanion", () => ({
  __esModule: true,
  useHomeCompanion: () => useHomeCompanionMock(),
}));

// Import AFTER mocks are registered.
import LayoutShell, { LayoutShell as NamedLayoutShell } from "@/components/LayoutShell";

beforeEach(() => {
  cleanup();
  hideSpy.mockReset();
  useHomeCompanionMock.mockReset();
  useHomeCompanionMock.mockReturnValue({ visible: false, text: "", hide: hideSpy });
});

// ---------------------------------------------------------------------------
// Module shape
// ---------------------------------------------------------------------------

describe("LayoutShell — module exports", () => {
  it("exposes the same component as default and named export", () => {
    expect(LayoutShell).toBe(NamedLayoutShell);
  });

  it("is a function component", () => {
    expect(typeof LayoutShell).toBe("function");
  });
});

// ---------------------------------------------------------------------------
// Children rendering
// ---------------------------------------------------------------------------

describe("LayoutShell — children", () => {
  it("renders provided children inside the <main> region", () => {
    render(
      <LayoutShell>
        <p data-testid="child">hello world</p>
      </LayoutShell>
    );
    const child = screen.getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child.closest("main")).not.toBeNull();
  });

  it("renders multiple children", () => {
    render(
      <LayoutShell>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </LayoutShell>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });

  it("renders without throwing when children is null", () => {
    expect(() => render(<LayoutShell>{null}</LayoutShell>)).not.toThrow();
    expect(document.querySelector("main")).not.toBeNull();
  });

  it("renders a string child as text content of <main>", () => {
    render(<LayoutShell>just text</LayoutShell>);
    expect(document.querySelector("main")?.textContent).toContain("just text");
  });
});

// ---------------------------------------------------------------------------
// Header toggling
// ---------------------------------------------------------------------------

describe("LayoutShell — showHeader", () => {
  it("renders AppHeader by default (showHeader omitted)", () => {
    render(<LayoutShell>x</LayoutShell>);
    expect(screen.getByTestId("app-header")).toBeInTheDocument();
  });

  it("renders AppHeader when showHeader is explicitly true", () => {
    render(<LayoutShell showHeader>x</LayoutShell>);
    expect(screen.getByTestId("app-header")).toBeInTheDocument();
  });

  it("does NOT render AppHeader when showHeader is false", () => {
    render(<LayoutShell showHeader={false}>x</LayoutShell>);
    expect(screen.queryByTestId("app-header")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// maxWidth class mapping
// ---------------------------------------------------------------------------

describe("LayoutShell — maxWidth class mapping", () => {
  const mainClass = () => document.querySelector("main")?.className ?? "";

  it("defaults to the container width (max-w-[980px])", () => {
    render(<LayoutShell>x</LayoutShell>);
    expect(mainClass()).toContain("max-w-[980px]");
  });

  it("uses max-w-[980px] for explicit 'container'", () => {
    render(<LayoutShell maxWidth="container">x</LayoutShell>);
    expect(mainClass()).toContain("max-w-[980px]");
  });

  it("uses max-w-full for 'full'", () => {
    render(<LayoutShell maxWidth="full">x</LayoutShell>);
    const cls = mainClass();
    expect(cls).toContain("max-w-full");
    expect(cls).not.toContain("max-w-[980px]");
  });

  it("uses max-w-[640px] for 'narrow'", () => {
    render(<LayoutShell maxWidth="narrow">x</LayoutShell>);
    const cls = mainClass();
    expect(cls).toContain("max-w-[640px]");
    expect(cls).not.toContain("max-w-[980px]");
  });

  it("always keeps the centering + padding utility classes on <main>", () => {
    render(<LayoutShell>x</LayoutShell>);
    const cls = mainClass();
    expect(cls).toContain("mx-auto");
    expect(cls).toContain("px-4");
    expect(cls).toContain("py-6");
  });
});

// ---------------------------------------------------------------------------
// Companion + Mercy toggle wiring
// ---------------------------------------------------------------------------

describe("LayoutShell — companion + toggle", () => {
  it("always renders the CompanionBubble and MercyToggle", () => {
    render(<LayoutShell>x</LayoutShell>);
    expect(screen.getByTestId("companion-bubble")).toBeInTheDocument();
    expect(screen.getByTestId("mercy-toggle")).toBeInTheDocument();
  });

  it("renders companion + toggle even when the header is hidden", () => {
    render(<LayoutShell showHeader={false}>x</LayoutShell>);
    expect(screen.getByTestId("companion-bubble")).toBeInTheDocument();
    expect(screen.getByTestId("mercy-toggle")).toBeInTheDocument();
  });

  it("passes the hard-coded title 'Mercy' to CompanionBubble", () => {
    render(<LayoutShell>x</LayoutShell>);
    expect(screen.getByTestId("companion-bubble").getAttribute("data-title")).toBe(
      "Mercy"
    );
  });

  it("forwards visible=false / empty text from the hook by default", () => {
    render(<LayoutShell>x</LayoutShell>);
    const bubble = screen.getByTestId("companion-bubble");
    expect(bubble.getAttribute("data-visible")).toBe("false");
    expect(bubble.getAttribute("data-text")).toBe("");
  });

  it("forwards visible=true and the hook's text when the companion is active", () => {
    useHomeCompanionMock.mockReturnValue({
      visible: true,
      text: "Xin chào!",
      hide: hideSpy,
    });
    render(<LayoutShell>x</LayoutShell>);
    const bubble = screen.getByTestId("companion-bubble");
    expect(bubble.getAttribute("data-visible")).toBe("true");
    expect(bubble.getAttribute("data-text")).toBe("Xin chào!");
  });

  it("wires CompanionBubble.onClose to the hook's hide()", () => {
    render(<LayoutShell>x</LayoutShell>);
    expect(hideSpy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByTestId("companion-close"));
    expect(hideSpy).toHaveBeenCalledTimes(1);
  });

  it("invokes useHomeCompanion exactly once per render", () => {
    render(<LayoutShell>x</LayoutShell>);
    expect(useHomeCompanionMock).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Structural invariants
// ---------------------------------------------------------------------------

describe("LayoutShell — structure", () => {
  it("wraps everything in a full-height background container", () => {
    const { container } = render(<LayoutShell>x</LayoutShell>);
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
    expect(root.className).toContain("min-h-screen");
    expect(root.className).toContain("bg-background");
  });

  it("renders exactly one <main> element", () => {
    render(<LayoutShell>x</LayoutShell>);
    expect(document.querySelectorAll("main")).toHaveLength(1);
  });

  it("does not crash when re-rendered with changed props", () => {
    const { rerender } = render(<LayoutShell maxWidth="full">a</LayoutShell>);
    expect(document.querySelector("main")?.className).toContain("max-w-full");
    rerender(
      <LayoutShell maxWidth="narrow" showHeader={false}>
        b
      </LayoutShell>
    );
    expect(document.querySelector("main")?.className).toContain("max-w-[640px]");
    expect(screen.queryByTestId("app-header")).not.toBeInTheDocument();
  });
});
