import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

describe("ui/Tooltip", () => {
  it("trigger is visible on mount", () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("shows tooltip content on hover (role=tooltip appears)", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByText("Hover me"));
    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeInTheDocument();
    });
  });

  it("tooltip has correct aria-describedby wiring when open", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="trig">Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await user.hover(screen.getByTestId("trig"));
    await waitFor(() => expect(screen.getByRole("tooltip")).toBeInTheDocument());
    // When open, trigger gets aria-describedby pointing to the tooltip
    const trigger = screen.getByTestId("trig");
    expect(trigger).toHaveAttribute("aria-describedby");
    const tooltipId = trigger.getAttribute("aria-describedby");
    const tooltip = document.getElementById(tooltipId!);
    expect(tooltip).not.toBeNull();
  });

  it("open prop forces tooltip visible (role=tooltip present)", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Trigger</TooltipTrigger>
          <TooltipContent>Always visible</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    // When open=true, exactly one tooltip should be visible
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
  });

  it("TooltipContent forwards className", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>T</TooltipTrigger>
          <TooltipContent className="custom-tooltip" data-testid="tc">
            Custom class
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId("tc").className).toContain("custom-tooltip");
  });

  it("TooltipContent has z-50 class", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>T</TooltipTrigger>
          <TooltipContent data-testid="tc2">Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId("tc2").className).toContain("z-50");
  });

  it("TooltipContent has rounded-md class", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>T</TooltipTrigger>
          <TooltipContent data-testid="tc3">Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId("tc3").className).toContain("rounded-md");
  });

  it("renders rich children inside tooltip content when open", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover</TooltipTrigger>
          <TooltipContent>
            <strong>Bold tip</strong>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByRole("tooltip")).toBeInTheDocument();
    // getAllByText to handle potential Radix duplicate; the tooltip must contain the text
    const matches = screen.getAllByText("Bold tip");
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });

  it("TooltipContent has shadow-md class", () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>T</TooltipTrigger>
          <TooltipContent data-testid="tc4">Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByTestId("tc4").className).toContain("shadow-md");
  });
});
