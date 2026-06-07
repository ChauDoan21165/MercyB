import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ParentView from "../ParentView";
import { buildParentSummary } from "@/lib/parent-view/buildParentSummary";
import type { ParentSummary } from "@/lib/parent-view/buildParentSummary";
import type { LocalWeaknessMap } from "@/lib/stage-3a/aggregator";

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => ({
    isLoading: false,
    hasPremium: true,
  }),
}));

function renderParentView(summary: ParentSummary) {
  return render(
    <MemoryRouter>
      <ParentView initialSummary={summary} localeOverride="vi" />
    </MemoryRouter>,
  );
}

function weaknessMap(overrides: Partial<LocalWeaknessMap> = {}): LocalWeaknessMap {
  return {
    topL1Patterns: [],
    placementWeaknesses: [],
    topPronunciationPainPoints: [],
    isEmpty: false,
    generatedAt: 0,
    ...overrides,
  };
}

describe("ParentView family-bridge band render golden", () => {
  it("renders the grammar weakness band for a learner with family-bridge weakness data", () => {
    const summary = buildParentSummary(
      weaknessMap({
        topL1Patterns: [
          { tag: "vi_l1_3rd_person_s", count: 8, lastSeen: 1_700_000_000 },
        ],
      }),
      { learnerName: "Linh", reportThreshold: 5 },
    );

    renderParentView(summary);

    expect(screen.getByTestId("parent-view")).toHaveAttribute("data-locale", "vi");
    expect(screen.getByTestId("parent-headline")).toHaveTextContent("Linh");
    expect(screen.getByTestId("parent-category-grammar")).toHaveTextContent(
      "Ngữ pháp đang luyện",
    );
    expect(screen.getByTestId("parent-category-grammar")).toHaveTextContent(
      "Hay quên thêm -s sau he, she, it.",
    );
    expect(screen.queryByText("vi_l1_3rd_person_s")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Mercy giải thích"));
    expect(
      screen.getByTestId("parent-familybridge-grammar:vi_l1_3rd_person_s"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cách gia đình có thể giúp")).toBeInTheDocument();
  });

  it("renders a graceful empty state for a learner with no weakness band data", () => {
    const summary = buildParentSummary(
      weaknessMap({ isEmpty: true }),
      { learnerName: "Linh", reportThreshold: 5 },
    );

    renderParentView(summary);

    expect(screen.getByTestId("parent-view")).toBeInTheDocument();
    expect(screen.getByTestId("parent-empty")).toHaveTextContent(
      "Chưa có tóm tắt tuần này.",
    );
    expect(screen.queryByTestId("parent-category-grammar")).not.toBeInTheDocument();
  });

  it("renders the empty state instead of a raw error when the category band is missing", () => {
    const malformedSummary = {
      ...buildParentSummary(weaknessMap(), { learnerName: "Linh" }),
      isEmpty: false,
      categories: undefined,
    } as unknown as ParentSummary;

    expect(() => renderParentView(malformedSummary)).not.toThrow();
    expect(screen.getByTestId("parent-empty")).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/TypeError|Cannot read|engine error/i);
  });

  it("renders the empty state instead of a raw error when the category band is malformed", () => {
    const malformedSummary = {
      ...buildParentSummary(weaknessMap(), { learnerName: "Linh" }),
      isEmpty: false,
      categories: [{ isEmpty: false }],
    } as unknown as ParentSummary;

    expect(() => renderParentView(malformedSummary)).not.toThrow();
    expect(screen.getByTestId("parent-empty")).toBeInTheDocument();
    expect(document.body).not.toHaveTextContent(/TypeError|Cannot read|engine error/i);
  });
});
