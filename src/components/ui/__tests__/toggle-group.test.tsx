import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Note: in jsdom, ToggleGroupItem (type="single") renders as role="radio" inside
// a role="group". ToggleGroupItem (type="multiple") renders as role="checkbox".
// We query by their rendered ARIA roles.

describe("ui/ToggleGroup", () => {
  it("renders a group root", () => {
    const { container } = render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a" aria-label="Bold">B</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Italic">I</ToggleGroupItem>
      </ToggleGroup>,
    );
    // Root is a div[role=group]
    const group = container.querySelector('[role="group"]');
    expect(group).toBeInTheDocument();
  });

  it("renders items with correct aria-label", () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a" aria-label="Bold">B</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="Italic">I</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("radio", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Italic" })).toBeInTheDocument();
  });

  it("all items start as off (aria-checked=false)", () => {
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("data-state", "off");
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("data-state", "off");
  });

  it("clicking an item toggles it on (single type)", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="x" aria-label="X">X</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "X" }));
    expect(screen.getByRole("radio", { name: "X" })).toHaveAttribute("data-state", "on");
  });

  it("single type: only one item active at a time", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="single">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "A" }));
    await user.click(screen.getByRole("radio", { name: "B" }));
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("data-state", "off");
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("data-state", "on");
  });

  it("multiple type: multiple items can be active (aria-pressed buttons)", async () => {
    const user = userEvent.setup();
    render(
      <ToggleGroup type="multiple">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    // type="multiple" items use role="button" with aria-pressed
    await user.click(screen.getByRole("button", { name: "A" }));
    await user.click(screen.getByRole("button", { name: "B" }));
    expect(screen.getByRole("button", { name: "A" })).toHaveAttribute("data-state", "on");
    expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("data-state", "on");
  });

  it("onValueChange fires on item click (single)", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(
      <ToggleGroup type="single" onValueChange={handler}>
        <ToggleGroupItem value="foo" aria-label="Foo">Foo</ToggleGroupItem>
      </ToggleGroup>,
    );
    await user.click(screen.getByRole("radio", { name: "Foo" }));
    expect(handler).toHaveBeenCalledWith("foo");
  });

  it("controlled value prop (single)", () => {
    render(
      <ToggleGroup type="single" value="b">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
        <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute("data-state", "on");
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute("data-state", "off");
  });

  it("inherits variant from ToggleGroup context (outline = border)", () => {
    render(
      <ToggleGroup type="single" variant="outline">
        <ToggleGroupItem value="a" aria-label="A" data-testid="item-a">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    // outline variant applies border class
    expect(screen.getByTestId("item-a").className).toContain("border");
  });

  it("forwards className to ToggleGroup root", () => {
    render(
      <ToggleGroup type="single" className="custom-tg" data-testid="tg">
        <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
      </ToggleGroup>,
    );
    expect(screen.getByTestId("tg").className).toContain("custom-tg");
  });
});
