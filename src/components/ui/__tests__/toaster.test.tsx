import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Toaster } from "@/components/ui/toaster";

// Mock useToast so we can control what toasts are shown
vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({ toasts: [] })),
  toast: vi.fn(),
}));

// We need to re-import after mock to get mock control
import { useToast } from "@/hooks/use-toast";

describe("ui/Toaster", () => {
  it("renders without crashing (empty toasts)", () => {
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({ toasts: [] });
    const { container } = render(<Toaster />);
    expect(container).toBeInTheDocument();
  });

  it("renders a toast when useToast returns one", () => {
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      toasts: [
        {
          id: "t1",
          title: "Hello",
          description: "World",
          open: true,
        },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("World")).toBeInTheDocument();
  });

  it("renders multiple toasts", () => {
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      toasts: [
        { id: "a", title: "Toast A", open: true },
        { id: "b", title: "Toast B", open: true },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("Toast A")).toBeInTheDocument();
    expect(screen.getByText("Toast B")).toBeInTheDocument();
  });

  it("renders a toast without description", () => {
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      toasts: [
        {
          id: "t2",
          title: "No description toast",
          open: true,
        },
      ],
    });
    render(<Toaster />);
    expect(screen.getByText("No description toast")).toBeInTheDocument();
  });

  it("renders only title (no description element) when description omitted", () => {
    (useToast as ReturnType<typeof vi.fn>).mockReturnValue({
      toasts: [
        {
          id: "t3",
          title: "Only title",
          open: true,
        },
      ],
    });
    render(<Toaster />);
    // Should not render empty description
    expect(screen.queryByText("undefined")).not.toBeInTheDocument();
    expect(screen.getByText("Only title")).toBeInTheDocument();
  });
});
