import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock react-router-dom's useNavigate so we can assert navigation without a
// real router stack. We keep the rest of the module intact (MemoryRouter,
// etc.) via importActual.
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { PromoCodeBanner } from "../PromoCodeBanner";

const renderBanner = () =>
  render(
    <MemoryRouter>
      <PromoCodeBanner />
    </MemoryRouter>,
  );

beforeEach(() => {
  mockNavigate.mockReset();
});

afterEach(() => {
  cleanup();
});

describe("PromoCodeBanner — module surface", () => {
  it("exports PromoCodeBanner as a function component", () => {
    expect(PromoCodeBanner).toBeDefined();
    expect(typeof PromoCodeBanner).toBe("function");
  });
});

describe("PromoCodeBanner — rendering", () => {
  it("renders without crashing inside a router", () => {
    expect(() => renderBanner()).not.toThrow();
  });

  it("renders the bilingual heading (EN / VI)", () => {
    renderBanner();
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Have a promo code?");
    expect(heading).toHaveTextContent("Có mã khuyến mãi?");
  });

  it("renders the bilingual supporting copy", () => {
    renderBanner();
    expect(
      screen.getByText(
        "Unlock additional questions per day / Mở khóa thêm câu hỏi mỗi ngày",
      ),
    ).toBeInTheDocument();
  });

  it("renders a single redeem button with bilingual label", () => {
    renderBanner();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("Redeem / Đổi mã");
  });

  it("keeps Vietnamese copy present for the Vietnamese-first requirement", () => {
    renderBanner();
    // Every user-facing string carries a Vietnamese half.
    expect(screen.getByText(/Có mã khuyến mãi\?/)).toBeInTheDocument();
    expect(screen.getByText(/Mở khóa thêm câu hỏi mỗi ngày/)).toBeInTheDocument();
    expect(screen.getByText(/Đổi mã/)).toBeInTheDocument();
  });

  it("renders a decorative gift icon (svg) within the banner", () => {
    const { container } = renderBanner();
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders the gradient banner container with its layout classes", () => {
    const { container } = renderBanner();
    const root = container.firstChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.className).toContain("rounded-lg");
    expect(root.className).toContain("border");
    expect(root.className).toContain("mb-6");
  });
});

describe("PromoCodeBanner — navigation behavior", () => {
  it("does not navigate on mount", () => {
    renderBanner();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("navigates to /promo-code when the redeem button is clicked", () => {
    renderBanner();
    fireEvent.click(screen.getByRole("button", { name: /Redeem/i }));
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/promo-code");
  });

  it("navigates once per click and is idempotent across multiple clicks", () => {
    renderBanner();
    const button = screen.getByRole("button", { name: /Đổi mã/i });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);
    expect(mockNavigate).toHaveBeenCalledTimes(3);
    for (const call of mockNavigate.mock.calls) {
      expect(call).toEqual(["/promo-code"]);
    }
  });

  it("always targets the exact /promo-code route (no query/hash drift)", () => {
    renderBanner();
    fireEvent.click(screen.getByRole("button"));
    const [target] = mockNavigate.mock.calls[0];
    expect(target).toBe("/promo-code");
    expect(target).not.toMatch(/\?/);
    expect(target).not.toMatch(/#/);
  });
});

describe("PromoCodeBanner — stability / determinism", () => {
  it("renders identical markup across repeated independent mounts", () => {
    const first = renderBanner();
    const firstHtml = first.container.innerHTML;
    cleanup();
    const second = renderBanner();
    const secondHtml = second.container.innerHTML;
    expect(secondHtml).toBe(firstHtml);
  });

  it("supports multiple concurrent instances without leaking handlers", () => {
    render(
      <MemoryRouter>
        <PromoCodeBanner />
        <PromoCodeBanner />
      </MemoryRouter>,
    );
    const buttons = screen.getAllByRole("button", { name: /Redeem/i });
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/promo-code");
  });

  it("scopes its content within a single banner root element", () => {
    renderBanner();
    const heading = screen.getByRole("heading", { level: 3 });
    const root = heading.closest("div.rounded-lg") as HTMLElement;
    expect(root).toBeTruthy();
    const scoped = within(root);
    expect(scoped.getByRole("button", { name: /Redeem/i })).toBeInTheDocument();
  });
});
