import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ParentHeadline } from "../ParentHeadline";
import type { ParentSummary } from "@/lib/parent-view/buildParentSummary";

function summaryFixture(overrides: Partial<ParentSummary> = {}): ParentSummary {
  return {
    headlineVi: "Con bạn đang luyện ngữ pháp.",
    headlineEn: "Your learner is practising grammar.",
    attributionClauseVi: null,
    attributionClauseEn: null,
    cefr: null,
    categories: [],
    isEmpty: false,
    ...overrides,
  };
}

describe("ParentHeadline", () => {
  it("renders the descriptive headline in the selected primary locale", () => {
    render(<ParentHeadline summary={summaryFixture()} locale="vi" />);

    expect(screen.getByTestId("parent-headline")).toHaveTextContent(
      "Con bạn đang luyện ngữ pháp.",
    );
    expect(screen.getByTestId("parent-headline")).toHaveTextContent(
      "Your learner is practising grammar.",
    );
  });

  it("renders the attribution clause when the summary supplies one", () => {
    render(
      <ParentHeadline
        summary={summaryFixture({
          attributionClauseVi: "Đang có tín hiệu tiến bộ.",
          attributionClauseEn: "Progress signal is visible.",
        })}
        locale="en"
      />,
    );

    expect(screen.getByTestId("parent-attribution")).toHaveTextContent(
      "Progress signal is visible.",
    );
  });
});
