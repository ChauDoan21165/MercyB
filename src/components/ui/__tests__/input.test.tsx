import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders an <input> element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("forwards type prop", () => {
    render(<Input type="email" data-testid="i" />);
    expect(screen.getByTestId("i")).toHaveAttribute("type", "email");
  });

  it("forwards placeholder", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("applies base classes including rounded-md border", () => {
    render(<Input data-testid="i" />);
    const el = screen.getByTestId("i");
    expect(el.className).toContain("rounded-md");
    expect(el.className).toContain("border");
  });

  it("forwards custom className", () => {
    render(<Input className="custom-input" data-testid="i" />);
    expect(screen.getByTestId("i").className).toContain("custom-input");
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input data-testid="i" />);
    const input = screen.getByTestId("i");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("calls onChange when value changes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} data-testid="i" />);
    await user.type(screen.getByTestId("i"), "x");
    expect(onChange).toHaveBeenCalled();
  });

  it("disabled input cannot be typed into", async () => {
    const user = userEvent.setup();
    render(<Input disabled data-testid="i" />);
    const input = screen.getByTestId("i");
    await user.type(input, "should not type");
    expect(input).toHaveValue("");
  });

  it("renders as disabled with disabled attribute", () => {
    render(<Input disabled data-testid="i" />);
    expect(screen.getByTestId("i")).toBeDisabled();
  });
});
