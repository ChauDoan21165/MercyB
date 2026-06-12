import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StudyPathCard from "@/components/ai-tutor/StudyPathCard";

const NOW = 1_700_000_000_000;

describe("StudyPathCard", () => {
  it("renders the Vietnamese-first study path with the top patterns", () => {
    render(<StudyPathCard now={NOW} topCount={3} />);
    expect(screen.getByTestId("study-path-card")).toBeInTheDocument();
    expect(screen.getByText("Lộ trình học của bạn")).toBeInTheDocument();
    expect(screen.getAllByTestId("study-path-top-item")).toHaveLength(3);
  });

  it("toggles the collapsed 'upcoming' list", () => {
    render(<StudyPathCard now={NOW} topCount={3} />);
    expect(screen.queryByTestId("study-path-upcoming-item")).not.toBeInTheDocument();
    fireEvent.click(screen.getByTestId("study-path-upcoming-toggle"));
    expect(screen.getAllByTestId("study-path-upcoming-item").length).toBeGreaterThan(0);
  });
});
