import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox", () => {
  it("renders a checkbox role element", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("is unchecked by default", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");
  });

  it("becomes checked when clicked", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);
    const cb = screen.getByRole("checkbox");
    await user.click(cb);
    expect(cb).toHaveAttribute("data-state", "checked");
  });

  it("toggles back to unchecked on second click", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);
    const cb = screen.getByRole("checkbox");
    await user.click(cb);
    await user.click(cb);
    expect(cb).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onCheckedChange when toggled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders as disabled when disabled prop passed", () => {
    render(<Checkbox disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("disabled checkbox cannot be toggled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox disabled onCheckedChange={onCheckedChange} />);
    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("renders with checked state when defaultChecked", () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "checked");
  });

  it("forwards custom className", () => {
    render(<Checkbox className="my-check" data-testid="cb" />);
    expect(screen.getByTestId("cb").className).toContain("my-check");
  });

  it("applies h-4 w-4 dimension classes", () => {
    render(<Checkbox data-testid="cb" />);
    const el = screen.getByTestId("cb");
    expect(el.className).toContain("h-4");
    expect(el.className).toContain("w-4");
  });
});
