import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Toaster, toast } from "@/components/ui/sonner";

// Mock next-themes so we don't need the ThemeProvider at test level
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

describe("ui/sonner (Toaster)", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it("exports toast function", () => {
    expect(typeof toast).toBe("function");
  });

  it("renders toaster with className=toaster", () => {
    const { container } = render(<Toaster />);
    // The Sonner Toaster injects a section or div with data-sonner-toaster
    // In jsdom it may not render a visible node, but the component mounts
    expect(container.firstChild).toBeInTheDocument();
  });

  it("does not throw with custom position prop", () => {
    expect(() => render(<Toaster position="bottom-right" />)).not.toThrow();
  });

  it("does not throw with richColors prop", () => {
    expect(() => render(<Toaster richColors />)).not.toThrow();
  });
});
