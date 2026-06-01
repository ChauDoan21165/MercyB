import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Toggle, toggleVariants } from "@/components/ui/toggle";

describe("ui/Toggle", () => {
  it("renders a button element", () => {
    render(<Toggle>Bold</Toggle>);
    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
  });

  it("is off (data-state=off) by default", () => {
    render(<Toggle>B</Toggle>);
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "off");
  });

  it("toggles to on state on click", async () => {
    const user = userEvent.setup();
    render(<Toggle>B</Toggle>);
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "on");
  });

  it("toggles back to off on second click", async () => {
    const user = userEvent.setup();
    render(<Toggle>B</Toggle>);
    await user.click(screen.getByRole("button"));
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "off");
  });

  it("calls onPressedChange with new state", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Toggle onPressedChange={handler}>B</Toggle>);
    await user.click(screen.getByRole("button"));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("controlled pressed prop respected", () => {
    render(
      <Toggle pressed={true} onPressedChange={vi.fn()}>
        B
      </Toggle>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("data-state", "on");
  });

  it("disabled toggle cannot be clicked", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <Toggle disabled onPressedChange={handler}>
        B
      </Toggle>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(handler).not.toHaveBeenCalled();
  });

  it("forwards className", () => {
    render(<Toggle className="custom-toggle" data-testid="tg">B</Toggle>);
    expect(screen.getByTestId("tg").className).toContain("custom-toggle");
  });

  describe("toggleVariants class contracts", () => {
    it("default variant has no explicit bg (bg-transparent)", () => {
      expect(toggleVariants({ variant: "default" })).toContain("bg-transparent");
    });

    it("outline variant has border class", () => {
      expect(toggleVariants({ variant: "outline" })).toContain("border");
    });

    it("default size has h-10 class", () => {
      expect(toggleVariants({ size: "default" })).toContain("h-10");
    });

    it("sm size has h-9 class", () => {
      expect(toggleVariants({ size: "sm" })).toContain("h-9");
    });

    it("lg size has h-11 class", () => {
      expect(toggleVariants({ size: "lg" })).toContain("h-11");
    });

    it("on state class is present in base", () => {
      expect(toggleVariants()).toContain("data-[state=on]:bg-accent");
    });
  });
});
