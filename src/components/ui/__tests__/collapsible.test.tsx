import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

describe("Collapsible", () => {
  function renderCollapsible(defaultOpen = false) {
    return render(
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger data-testid="trigger">Toggle</CollapsibleTrigger>
        <CollapsibleContent data-testid="content">
          <p>Hidden content</p>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  it("renders trigger button", () => {
    renderCollapsible();
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("content is closed by default", () => {
    renderCollapsible();
    expect(screen.getByTestId("content")).toHaveAttribute("data-state", "closed");
  });

  it("opens on trigger click", async () => {
    const user = userEvent.setup();
    renderCollapsible();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByTestId("content")).toHaveAttribute("data-state", "open");
  });

  it("shows content text after opening", async () => {
    const user = userEvent.setup();
    renderCollapsible();
    await user.click(screen.getByTestId("trigger"));
    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });

  it("closes after second click", async () => {
    const user = userEvent.setup();
    renderCollapsible();
    const trigger = screen.getByTestId("trigger");
    await user.click(trigger);
    await user.click(trigger);
    expect(screen.getByTestId("content")).toHaveAttribute("data-state", "closed");
  });

  it("renders open by default when defaultOpen=true", () => {
    renderCollapsible(true);
    expect(screen.getByTestId("content")).toHaveAttribute("data-state", "open");
  });
});
