import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "@/components/ui/switch";

describe("ui/Switch", () => {
  it("renders a switch role element", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Switch />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "unchecked");
  });

  it("has checked state when defaultChecked=true", () => {
    render(<Switch defaultChecked />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
  });

  it("toggles from unchecked to checked on click", async () => {
    const user = userEvent.setup();
    render(<Switch />);
    const sw = screen.getByRole("switch");
    await user.click(sw);
    expect(sw).toHaveAttribute("data-state", "checked");
  });

  it("toggles from checked to unchecked on second click", async () => {
    const user = userEvent.setup();
    render(<Switch defaultChecked />);
    const sw = screen.getByRole("switch");
    await user.click(sw);
    expect(sw).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onCheckedChange with new value on toggle", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Switch onCheckedChange={handler} />);
    await user.click(screen.getByRole("switch"));
    expect(handler).toHaveBeenCalledWith(true);
  });

  it("calls onCheckedChange(false) when switching off", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Switch defaultChecked onCheckedChange={handler} />);
    await user.click(screen.getByRole("switch"));
    expect(handler).toHaveBeenCalledWith(false);
  });

  it("controlled checked prop is respected", () => {
    render(<Switch checked={true} onCheckedChange={vi.fn()} />);
    expect(screen.getByRole("switch")).toHaveAttribute("data-state", "checked");
  });

  it("disabled switch cannot be toggled", async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    render(<Switch disabled onCheckedChange={handler} />);
    const sw = screen.getByRole("switch");
    expect(sw).toBeDisabled();
    await user.click(sw);
    expect(handler).not.toHaveBeenCalled();
  });

  it("forwards className", () => {
    render(<Switch className="custom-switch" data-testid="sw" />);
    expect(screen.getByTestId("sw").className).toContain("custom-switch");
  });

  it("applies primary background when checked", () => {
    render(<Switch defaultChecked data-testid="sw-checked" />);
    const el = screen.getByTestId("sw-checked");
    expect(el.className).toContain("data-[state=checked]:bg-primary");
  });

  it("has aria-label support for accessibility", () => {
    render(<Switch aria-label="Dark mode" />);
    expect(screen.getByRole("switch", { name: "Dark mode" })).toBeInTheDocument();
  });
});
