import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

describe("ui/Popover", () => {
  it("does not show content before trigger is clicked", () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    );
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
  });

  it("shows content after trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Popover body")).toBeInTheDocument();
  });

  it("closes content when trigger is clicked again", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Popover body</PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Popover body")).toBeInTheDocument();
    await user.click(screen.getByText("Open"));
    expect(screen.queryByText("Popover body")).not.toBeInTheDocument();
  });

  it("renders children inside PopoverContent", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <p>Hello</p>
          <button>Click me</button>
        </PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("can be opened in controlled mode (defaultOpen)", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Always shown</PopoverContent>
      </Popover>,
    );
    expect(screen.getByText("Always shown")).toBeInTheDocument();
  });

  it("forwards className to PopoverContent", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent className="my-custom-class" data-testid="popover-content">
          Content
        </PopoverContent>
      </Popover>,
    );
    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("popover-content").className).toContain("my-custom-class");
  });
});
