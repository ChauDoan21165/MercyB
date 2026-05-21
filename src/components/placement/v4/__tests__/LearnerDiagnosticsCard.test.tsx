import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { LearnerDiagnosticsCard } from "../LearnerDiagnosticsCard";
import type { LearnerDiagnostic } from "@/lib/placement/v4/telemetry";

function mk(
  kind: LearnerDiagnostic["kind"],
  overrides: Partial<LearnerDiagnostic> = {},
): LearnerDiagnostic {
  return {
    kind,
    headline: { vi: "Tiêu đề", en: "Headline" },
    body: { vi: "Nội dung", en: "Body" },
    reasonCode: "test",
    tone: "informational",
    ...overrides,
  };
}

describe("LearnerDiagnosticsCard — render basics", () => {
  it("returns null when there are no safe diagnostics", () => {
    const { container } = render(<LearnerDiagnosticsCard diagnostics={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders one card per diagnostic in input order", () => {
    const items = [
      mk("focus_area_this_week"),
      mk("review_debt_building", {
        headline: { vi: "Bài ôn", en: "Reviews" },
        body: { vi: "5 bài đang chờ", en: "5 reviews waiting" },
        tone: "cautionary",
      }),
      mk("speaking_confidence_improving", {
        headline: { vi: "Nói hay hơn", en: "Speaking better" },
        body: { vi: "Tiếp tục nhé", en: "Keep going" },
        tone: "celebratory",
      }),
    ];
    render(<LearnerDiagnosticsCard diagnostics={items} />);
    const list = screen.getByTestId("learner-diagnostics-list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders both VI and EN headline + body", () => {
    render(
      <LearnerDiagnosticsCard
        diagnostics={[
          mk("focus_area_this_week", {
            headline: { vi: "Tập trung tuần này", en: "Focus this week" },
            body: { vi: "Hãy đều", en: "Stay even" },
          }),
        ]}
      />,
    );
    expect(screen.getByText("Tập trung tuần này")).toBeInTheDocument();
    expect(screen.getByText("Focus this week")).toBeInTheDocument();
    expect(screen.getByText("Hãy đều")).toBeInTheDocument();
    expect(screen.getByText("Stay even")).toBeInTheDocument();
  });

  it("emits the data-tone attribute per diagnostic for UI styling", () => {
    render(
      <LearnerDiagnosticsCard
        diagnostics={[
          mk("focus_area_this_week", { tone: "informational" }),
          mk("review_debt_building", {
            tone: "cautionary",
            reasonCode: "rd",
          }),
        ]}
      />,
    );
    const cautionary = screen.getByTestId("learner-diagnostic-review_debt_building");
    expect(cautionary).toHaveAttribute("data-tone", "cautionary");
  });
});

describe("LearnerDiagnosticsCard — safety guards", () => {
  it("filters out diagnostics with missing strings", () => {
    const malformed = [
      mk("focus_area_this_week"),
      // Intentionally bad: missing VI string.
      {
        ...mk("review_debt_building"),
        headline: { en: "Only English", vi: "" } as unknown as LearnerDiagnostic["headline"],
      } as LearnerDiagnostic,
    ];
    render(<LearnerDiagnosticsCard diagnostics={malformed} />);
    const list = screen.getByTestId("learner-diagnostics-list");
    expect(within(list).getAllByRole("listitem")).toHaveLength(1);
  });

  it("filters out diagnostics with telemetry vocabulary", () => {
    const leaky: LearnerDiagnostic = mk("focus_area_this_week", {
      body: {
        vi: "Tiến độ ổn",
        en: "Your churn risk score is below the audit threshold",
      },
    });
    render(<LearnerDiagnosticsCard diagnostics={[leaky]} />);
    // No <li> should render — the entire diagnostic was filtered.
    expect(screen.queryByTestId("learner-diagnostics-list")).toBeNull();
  });

  it("returns null when every diagnostic is malformed", () => {
    const bad: LearnerDiagnostic[] = [
      { ...mk("focus_area_this_week"), tone: "explosive" as unknown as LearnerDiagnostic["tone"] },
    ];
    const { container } = render(<LearnerDiagnosticsCard diagnostics={bad} />);
    expect(container.firstChild).toBeNull();
  });

  it("never leaks 'churn' / 'risk score' / 'telemetry' / 'audit' words to the DOM", () => {
    const items = [
      mk("focus_area_this_week"),
      mk("review_debt_building", {
        headline: { vi: "Bài ôn", en: "Reviews" },
        body: { vi: "5 bài đang chờ", en: "5 reviews waiting" },
        tone: "cautionary",
      }),
    ];
    const { container } = render(<LearnerDiagnosticsCard diagnostics={items} />);
    const text = container.textContent ?? "";
    for (const banned of ["churn", "risk score", "telemetry", "audit", "provider"]) {
      expect(text.toLowerCase()).not.toContain(banned);
    }
  });
});
