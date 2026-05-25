import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViKidsEnglishTutor from "../ViKidsEnglishTutor";

describe("ViKidsEnglishTutor", () => {
  it("uses the shared Teacher Mercy shell with Việt Kids English copy", () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.getByTestId("vi-kids-english-tutor")).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-avatar")).toHaveAttribute(
      "src",
      "/teacher-mercy.webp",
    );
    expect(
      screen.getByRole("heading", { name: "Teacher Mercy · English for Việt Kids" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Kids-safe practice")).toBeInTheDocument();
  });

  it("renders only the two kids-specific tabs", () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.getByRole("button", { name: "Pick a Picture" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mercy Speak" })).toBeInTheDocument();

    // Old 4-mode adult tabs must NOT be present anymore.
    expect(screen.queryByRole("button", { name: "Journey" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Grammar" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Speak" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Logic" })).not.toBeInTheDocument();
  });

  it("defaults to the Pick a Picture tab (its content mounts on load)", () => {
    render(<ViKidsEnglishTutor />);

    expect(screen.getByTestId("vi-kids-mercy-teacher-mount")).toBeInTheDocument();
    expect(screen.queryByTestId("vi-kids-mercy-speak-mount")).not.toBeInTheDocument();
  });
});
