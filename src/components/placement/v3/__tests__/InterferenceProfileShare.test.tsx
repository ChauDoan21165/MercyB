import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import InterferenceProfileShare from "../InterferenceProfileShare";
import { buildInterferenceProfileFindings } from "@/lib/share/interferenceProfile";
import type { PlacementV3Results } from "@/lib/placement/v3/types";

const fixtureResults: PlacementV3Results = {
  sessionId: "hidden-from-card",
  completedAt: "2026-07-11T00:00:00.000Z",
  overallCefr: "A2",
  overallConfidence: 0.61,
  overallSummary: { en: "A2 placement.", vi: "Xếp trình độ A2." },
  skills: [],
  l1Flags: [
    {
      id: "article-omission",
      severity: "high",
      label: { en: "Article omission", vi: "Thiếu mạo từ" },
      evidence: { en: "I want better job.", vi: "I want better job." },
    },
    {
      id: "final-consonants",
      severity: "medium",
      label: { en: "Final consonants", vi: "Âm cuối" },
      evidence: { en: "The learner wrote 'work' clearly but dropped endings when speaking.", vi: "work" },
    },
    {
      id: "preposition-transfer",
      severity: "low",
      label: { en: "Preposition transfer", vi: "Dịch giới từ từ tiếng Việt" },
      evidence: { en: "discuss about the plan", vi: "discuss about the plan" },
    },
    {
      id: "extra-pattern",
      severity: "low",
      label: { en: "Extra pattern", vi: "Pattern phụ" },
      evidence: { en: "Not shown.", vi: "Không hiển thị." },
    },
  ],
  recommendations: [],
  strengths: [],
  gaps: [],
  questionCount: 5,
};

describe("InterferenceProfileShare", () => {
  it("renders a branded private card from the top three l1 findings", () => {
    render(<InterferenceProfileShare results={fixtureResults} />);

    expect(screen.getByTestId("interference-profile-share")).toBeInTheDocument();
    expect(screen.getByTestId("interference-profile-card")).toBeInTheDocument();
    expect(screen.getAllByText("MercyBlade").length).toBeGreaterThan(0);
    expect(screen.getByText("Share Interference Profile")).toBeInTheDocument();
    expect(screen.getByText("Article omission")).toBeInTheDocument();
    expect(screen.getByText("Final consonants")).toBeInTheDocument();
    expect(screen.getByText("Preposition transfer")).toBeInTheDocument();
    expect(screen.queryByText("Pattern phụ")).not.toBeInTheDocument();
    expect(screen.getByText(/I want better job/i)).toBeInTheDocument();
    expect(screen.queryByText("hidden-from-card")).not.toBeInTheDocument();
  });

  it("redacts account-shaped evidence before rendering", () => {
    const findings = buildInterferenceProfileFindings({
      ...fixtureResults,
      l1Flags: [
        {
          id: "privacy",
          severity: "high",
          label: { en: "Privacy", vi: "Riêng tư" },
          evidence: {
            en: "learner@example.com user_abcd123456789 said: I go school.",
            vi: "learner@example.com user_abcd123456789 said: I go school.",
          },
        },
      ],
    });

    expect(findings[0]?.example?.en).toContain("[redacted]");
    expect(findings[0]?.example?.en).not.toContain("learner@example.com");
    expect(findings[0]?.example?.en).not.toContain("user_abcd123456789");
  });

  it("copies the site link without account identifiers", async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(<InterferenceProfileShare results={fixtureResults} />);
    screen.getByRole("button", { name: /Copy link/i }).click();

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText).toHaveBeenCalledWith(window.location.origin);
  });
});
