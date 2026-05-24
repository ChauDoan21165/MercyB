import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import TeacherMercyLearningShell from "../TeacherMercyLearningShell";

type Mode = "journey" | "grammar";

describe("TeacherMercyLearningShell", () => {
  it("renders one shared Teacher Mercy frame with mode tabs and memory slot", async () => {
    const onModeChange = vi.fn();
    render(
      <TeacherMercyLearningShell<Mode>
        title="Teacher Mercy · Shared Tutor"
        subtitle="Shared learning shell"
        helper="Reusable across products"
        eyebrow="Teacher Mercy"
        badge="Mock"
        activeMode="journey"
        modeTabs={[
          { id: "journey", label: "Journey" },
          { id: "grammar", label: "Grammar" },
        ]}
        onModeChange={onModeChange}
        memorySlot={<div>Safe reminder</div>}
        footer="Safe footer"
      >
        <div>Learning body</div>
      </TeacherMercyLearningShell>,
    );

    expect(screen.getByTestId("teacher-mercy-learning-shell")).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-avatar")).toHaveAttribute("src", "/teacher-mercy.webp");
    expect(screen.getByRole("heading", { name: "Teacher Mercy · Shared Tutor" })).toBeInTheDocument();
    expect(screen.getByText("Safe reminder")).toBeInTheDocument();
    expect(screen.getByText("Learning body")).toBeInTheDocument();
    expect(screen.getByTestId("teacher-mercy-floating-box")).toBeInTheDocument();
    expect(within(screen.getByTestId("teacher-mercy-pillar-tabs")).getByRole("button", { name: "Journey" })).toBeInTheDocument();

    await userEvent.click(within(screen.getByTestId("teacher-mercy-mode-tabs")).getByRole("button", { name: "Grammar" }));
    expect(onModeChange).toHaveBeenCalledWith("grammar");
  });
});
