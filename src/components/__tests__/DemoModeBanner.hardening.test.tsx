import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock useNavigate so we can assert navigation intent without a real router history.
// react-router-dom is still partially real (MemoryRouter) so the component mounts cleanly.
const navigateMock = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

import { DemoModeBanner } from "@/components/DemoModeBanner";

const renderBanner = () =>
  render(
    <MemoryRouter>
      <DemoModeBanner />
    </MemoryRouter>,
  );

describe("DemoModeBanner — hardening", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    cleanup();
  });

  describe("exports", () => {
    it("exports DemoModeBanner as a function component", () => {
      expect(DemoModeBanner).toBeTypeOf("function");
    });
  });

  describe("rendering — normal case", () => {
    it("renders without throwing", () => {
      expect(() => renderBanner()).not.toThrow();
    });

    it("renders the title call-to-action", () => {
      renderBanner();
      expect(
        screen.getByText("Register for Level 0 Tier Access"),
      ).toBeTruthy();
    });

    it("renders the descriptive body copy", () => {
      renderBanner();
      expect(
        screen.getByText(/Enjoying the content\?/i),
      ).toBeTruthy();
      expect(
        screen.getByText(/unlock your progress tracking, favorites, and personalized learning/i),
      ).toBeTruthy();
    });

    it("renders exactly two action buttons", () => {
      renderBanner();
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("renders the Register Level 0 button", () => {
      renderBanner();
      expect(
        screen.getByRole("button", { name: /Register Level 0/i }),
      ).toBeTruthy();
    });

    it("renders the Sign In button", () => {
      renderBanner();
      expect(
        screen.getByRole("button", { name: /Sign In/i }),
      ).toBeTruthy();
    });
  });

  describe("navigation behavior", () => {
    it("navigates to /auth when Register Level 0 is clicked", () => {
      renderBanner();
      fireEvent.click(
        screen.getByRole("button", { name: /Register Level 0/i }),
      );
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith("/auth");
    });

    it("navigates to /auth when Sign In is clicked", () => {
      renderBanner();
      fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
      expect(navigateMock).toHaveBeenCalledTimes(1);
      expect(navigateMock).toHaveBeenCalledWith("/auth");
    });

    it("does not navigate before any interaction", () => {
      renderBanner();
      expect(navigateMock).not.toHaveBeenCalled();
    });

    it("both buttons route to the same /auth destination", () => {
      renderBanner();
      fireEvent.click(
        screen.getByRole("button", { name: /Register Level 0/i }),
      );
      fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
      expect(navigateMock).toHaveBeenCalledTimes(2);
      expect(navigateMock.mock.calls.every(([arg]) => arg === "/auth")).toBe(
        true,
      );
    });

    it("handles repeated clicks deterministically", () => {
      renderBanner();
      const register = screen.getByRole("button", {
        name: /Register Level 0/i,
      });
      fireEvent.click(register);
      fireEvent.click(register);
      fireEvent.click(register);
      expect(navigateMock).toHaveBeenCalledTimes(3);
      expect(navigateMock).toHaveBeenLastCalledWith("/auth");
    });
  });

  describe("idempotency / remount", () => {
    it("renders consistently across multiple independent mounts", () => {
      const { unmount } = renderBanner();
      expect(
        screen.getByText("Register for Level 0 Tier Access"),
      ).toBeTruthy();
      unmount();

      renderBanner();
      expect(
        screen.getByText("Register for Level 0 Tier Access"),
      ).toBeTruthy();
      expect(screen.getAllByRole("button")).toHaveLength(2);
    });

    it("does not leak navigation state between mounts", () => {
      const { unmount } = renderBanner();
      fireEvent.click(screen.getByRole("button", { name: /Sign In/i }));
      expect(navigateMock).toHaveBeenCalledTimes(1);
      unmount();
      navigateMock.mockReset();

      renderBanner();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
