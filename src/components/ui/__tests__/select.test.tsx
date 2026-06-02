import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Radix Select uses pointer capture APIs that jsdom doesn't implement fully.
// We shim them at module level so they are available before any test runs.
if (!HTMLElement.prototype.hasPointerCapture) {
  HTMLElement.prototype.hasPointerCapture = () => false;
}
if (!HTMLElement.prototype.setPointerCapture) {
  HTMLElement.prototype.setPointerCapture = () => {};
}
if (!HTMLElement.prototype.releasePointerCapture) {
  HTMLElement.prototype.releasePointerCapture = () => {};
}

// Radix Select wraps the trigger in aria-hidden="true" when open so we need
// hidden:true to locate items in the portal. Also, the radix-overlay wrapping
// aria-hidden makes getByRole("combobox") only work with hidden:true after open.

function renderSelect(onValueChange?: (v: string) => void) {
  return render(
    <Select onValueChange={onValueChange}>
      <SelectTrigger aria-label="Pick fruit">
        <SelectValue placeholder="Pick fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>,
  );
}

describe("ui/Select", () => {
  it("renders the trigger with placeholder", () => {
    renderSelect();
    expect(screen.getByText("Pick fruit")).toBeInTheDocument();
  });

  it("trigger has combobox role", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("dropdown is not shown before trigger interaction", () => {
    renderSelect();
    // Before open, no listbox is visible
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { hidden: true })).not.toBeInTheDocument();
  });

  it("opens dropdown and shows listbox on click", () => {
    renderSelect();
    // Use fireEvent.click to open (userEvent.click triggers pointer-capture on Radix)
    fireEvent.click(screen.getByRole("combobox", { hidden: true }));
    // After open, listbox is in the DOM (possibly inside aria-hidden portal)
    expect(screen.getByRole("listbox", { hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Apple", hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Banana", hidden: true })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Cherry", hidden: true })).toBeInTheDocument();
  });

  it("listbox is aria-expanded=true on trigger when open", () => {
    renderSelect();
    const trigger = screen.getByRole("combobox", { hidden: true });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("selecting an option calls onValueChange with correct value", () => {
    const handler = vi.fn();
    renderSelect(handler);
    const trigger = screen.getByRole("combobox", { hidden: true });
    fireEvent.click(trigger);
    const banana = screen.getByRole("option", { name: "Banana", hidden: true });
    fireEvent.click(banana);
    expect(handler).toHaveBeenCalledWith("banana");
  });

  it("controlled value is displayed correctly", () => {
    render(
      <Select value="banana">
        <SelectTrigger aria-label="Pick fruit">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });

  it("disabled trigger is not clickable", () => {
    render(
      <Select>
        <SelectTrigger disabled aria-label="Pick fruit">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();
    // After clicking disabled trigger, no listbox
    fireEvent.click(trigger);
    expect(screen.queryByRole("listbox", { hidden: true })).not.toBeInTheDocument();
  });

  it("trigger has ChevronDown icon (svg)", () => {
    const { container } = renderSelect();
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("SelectTrigger has base border class", () => {
    renderSelect();
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("border");
  });
});
