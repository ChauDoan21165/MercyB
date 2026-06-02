import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

describe("HoverCard", () => {
  it("renders the trigger", () => {
    render(
      <HoverCard>
        <HoverCardTrigger data-testid="trigger">Hover me</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByTestId("trigger")).toBeInTheDocument();
  });

  it("content is not visible when closed", () => {
    render(
      <HoverCard open={false}>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>Hover card content</HoverCardContent>
      </HoverCard>
    );
    expect(screen.queryByText("Hover card content")).not.toBeInTheDocument();
  });

  it("content is visible when open=true", () => {
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>Hover me</HoverCardTrigger>
        <HoverCardContent>
          <p>Hover card content</p>
        </HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByText("Hover card content")).toBeInTheDocument();
  });

  it("HoverCardContent has w-64 class when open", () => {
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>T</HoverCardTrigger>
        <HoverCardContent data-testid="content">Content</HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByTestId("content").className).toContain("w-64");
  });

  it("HoverCardContent has rounded-md and shadow-md classes", () => {
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>T</HoverCardTrigger>
        <HoverCardContent data-testid="content">Content</HoverCardContent>
      </HoverCard>
    );
    const el = screen.getByTestId("content");
    expect(el.className).toContain("rounded-md");
    expect(el.className).toContain("shadow-md");
  });

  it("HoverCardContent forwards custom className", () => {
    render(
      <HoverCard open={true}>
        <HoverCardTrigger>T</HoverCardTrigger>
        <HoverCardContent className="custom-hover" data-testid="content">X</HoverCardContent>
      </HoverCard>
    );
    expect(screen.getByTestId("content").className).toContain("custom-hover");
  });

  it("trigger renders as an anchor element by default (HoverCardTrigger)", () => {
    render(
      <HoverCard>
        <HoverCardTrigger data-testid="trigger">Link</HoverCardTrigger>
        <HoverCardContent>Content</HoverCardContent>
      </HoverCard>
    );
    // Radix HoverCardTrigger renders as <a> by default
    expect(screen.getByTestId("trigger").tagName).toBe("A");
  });
});
