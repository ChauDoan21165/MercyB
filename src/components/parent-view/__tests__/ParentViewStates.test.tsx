import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import {
  ParentAccessSkeleton,
  ParentDataSkeleton,
  ParentEmptyState,
  ParentPaywallGate,
} from "../ParentViewStates";

describe("ParentViewStates", () => {
  it("renders access loading as a polite status", () => {
    render(<ParentAccessSkeleton />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Đang kiểm tra quyền truy cập…");
  });

  it("renders data loading as a polite status", () => {
    render(<ParentDataSkeleton />);

    const status = screen.getByRole("status", {
      name: "Đang tải tóm tắt tiến bộ",
    });
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("renders the empty state copy", () => {
    render(<ParentEmptyState />);

    expect(screen.getByTestId("parent-empty")).toHaveTextContent(
      "Chưa có tóm tắt tuần này.",
    );
  });

  it("renders the premium gate with pricing link", () => {
    render(
      <MemoryRouter>
        <ParentPaywallGate />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("parent-paywall")).toHaveTextContent(
      "Trang dành cho phụ huynh có trong gói Premium.",
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/pricing");
  });
});
